import React, { useState, useRef } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import {
  Share2,
  FileText,
  FileSpreadsheet,
  MessageCircle,
  Mail,
  ChevronDown,
  X,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { generateProfessionalPDF, formatTitleCase, formatCapitalize, filterValidParameters } from "../../utils/pdfGenerator";

export interface ShareMenuProps {
  activeTab: string;
  data: Record<string, any>;
  title: string;
  triggerClassName?: string;
  triggerContent?: React.ReactNode;
  containerClassName?: string;
  popupPosition?: "top" | "bottom";
  exportFormat?: {
    inputs: Record<string, string>;
    breakdown: Record<string, string>;
    rates?: any;
    cartItem?: any;
    customTableData?: {
      item: string;
      quantityStr: string | number;
      unitStr: string;
      rate?: number | string;
      cost: number;
      color?: string;
    }[];
  };
}
export default function ShareButtonWithPopup({
  activeTab,
  data,
  title,
  triggerClassName,
  triggerContent,
  containerClassName,
  popupPosition = "top",
  exportFormat,
}: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const getFileNamePrefix = () => {
    const dateObj = new Date();
    const d = dateObj.getDate().toString().padStart(2, "0");
    const m = dateObj.toLocaleString("en-US", { month: "short" });
    const y = dateObj.getFullYear();
    let hr = dateObj.getHours();
    const min = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12;
    hr = hr ? hr : 12;
    const hrStr = hr.toString().padStart(2, "0");
    const dateStr = `${d}-${m}-${y}`;
    const timeStr = `${hrStr}${min}${ampm}`;
    const prefix = user?.displayName
      ? user.displayName.replace(/\s+/g, "_")
      : "Civil";
    return `${prefix}_Estimate_${dateStr}_${timeStr}`;
  };
  /* Close menu when clicking outside could be added, but a simple toggle is okay for now. */ const formatText =
    () => {
      let txt = `${title}\n\n`;
      Object.entries(filterValidParameters(exportFormat?.inputs || data)).forEach(([key, val]) => {
        txt += `${formatTitleCase(key)}: ${val}\n`;
      });
      txt += `\nBreakdown:\n`;
      Object.entries(exportFormat?.breakdown || data).forEach(([key, val]) => {
         txt += `${formatCapitalize(key.replace(/\*/g, ''))}: ${val}\n`;
      });
      txt += `\nGenerated via Civil Estimation Pro`;
      return txt;
    };
  const handleWhatsAppHTML = () => {
    const text = encodeURIComponent(formatText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setIsOpen(false);
    toast.success("Opened WhatsApp");
  };
  const handleDownloadText = () => {
    const fileName = `${getFileNamePrefix()}.txt`;
    const textBlob = new Blob([formatText()], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(textBlob, fileName);
    setIsOpen(false);
    toast.success(`✅ File saved as ${fileName}`);
  };
  const handleEmailHTML = () => {
    let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f0f0f0; font-family: Helvetica, Arial, sans-serif;"> <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;"> <div style="background-color: #282A65; color: #ffffff; padding: 20px; text-align: center;"> <h1 style="margin: 0; font-size: 24px;">${title}</h1> </div> <div style="padding: 20px;"> <p style="color: #333333; font-size: 16px;">Hello,</p> <p style="color: #333333; font-size: 16px;">Here is the requested estimate for <strong>${title}</strong>.</p> <table style="width: 100%; border-collapse: collapse; margin-top: 20px;"> <thead> <tr> <th style="background-color: #282A65; color: #ffffff; padding: 12px; text-align: left; border: 1px solid #ddd;">Material / Item</th> <th style="background-color: #282A65; color: #ffffff; padding: 12px; text-align: right; border: 1px solid #ddd;">Quantity</th> <th style="background-color: #282A65; color: #ffffff; padding: 12px; text-align: right; border: 1px solid #ddd;">Amount (Rs)</th> </tr> </thead> <tbody>`;
    const cItem = exportFormat?.cartItem as any;
    const customTableData = exportFormat?.customTableData;
    const rates: any = (exportFormat as any)?.rates || {};
    let grandTotal = 0;
    let isEven = false;
    const addRow = (
      item: string,
      qty: number,
      unitLabel: string,
      typeRateId: string,
    ) => {
      if (qty > 0) {
        const cost = qty * (rates[typeRateId] || 0);
        grandTotal += cost;
        const bg = isEven ? "#f9f9f9" : "#ffffff";
        html += ` <tr style="background-color: ${bg};"> <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${item}</td> <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${qty.toFixed(2)} ${unitLabel}</td> <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${cost.toFixed(2)}</td> </tr>`;
        isEven = !isEven;
      }
    };
    if (customTableData) {
      customTableData.forEach((row) => {
        const bg = isEven ? "#f9f9f9" : "#ffffff";
        html += ` <tr style="background-color: ${bg};"> <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${row.item}</td> <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${row.quantityStr} ${row.unitStr}</td> <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${row.cost.toFixed(2)}</td> </tr>`;
        grandTotal += row.cost;
        isEven = !isEven;
      });
    } else if (cItem) {
      const isSI = cItem.unitVol === "m³";
      addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
      addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
      addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
      addRow("Water", isSI ? (cItem.waterLiters || 0) : ((cItem.waterLiters / 3.78541) || 0), isSI ? "L" : "Gal", "water");
      if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
      if (cItem.bricksCount)
        addRow("Bricks", cItem.bricksCount, "nos", "bricks");
      if (cItem.blocksCount)
        addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
      Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
        const vLower = String(v).toLowerCase();
        let cost = 0;
        let inferredKey = k.toLowerCase();
        
        if (inferredKey.includes("cement")) inferredKey = "cement";
        else if (inferredKey.includes("sand")) inferredKey = "sand";
        else if (inferredKey.includes("aggregate") || inferredKey.includes("crush")) inferredKey = "aggregate";
        else if (inferredKey.includes("water")) inferredKey = "water";
        else if (inferredKey.includes("steel")) inferredKey = "steel";
        else if (inferredKey.includes("brick")) inferredKey = "bricks";
        else if (inferredKey.includes("block")) inferredKey = "blocks";

        if (rates && rates[inferredKey]) {
          const rawNum = parseFloat(vLower.replace(/[^0-9.-]+/g, "")) || 0;
          cost = rawNum * rates[inferredKey];
        }

        const bg = isEven ? "#f9f9f9" : "#ffffff";
        html += ` <tr style="background-color: ${bg};"> <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${formatCapitalize(k.replace(/\*/g, ''))}</td> <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${v}</td> <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${cost > 0 ? cost.toFixed(2) : "-"}</td> </tr>`;
        if (cost > 0) grandTotal += cost;
        isEven = !isEven;
      });
    }
    html += ` <tr> <td colspan="2" style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; background-color: #E6F0FA; color: #282A65;">Grand Total</td> <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; background-color: #E6F0FA; color: #282A65;">Rs ${grandTotal.toFixed(2)}</td> </tr> </tbody> </table> <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;"> <a href="#" style="background-color: #282A65; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Download Full PDF Report</a> </div> <p style="color: #888888; font-size: 12px; text-align: center; margin-top: 20px;">* This is a system-generated estimate. Actual prices may vary based on market conditions.</p> </div> </div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const fileName = `${getFileNamePrefix()}.html`;
    saveAs(blob, fileName);
    setIsOpen(false);
    toast.success(`✅ File saved as ${fileName}`);
  };
  const generatePDF = async (
    exportType: "pdf" | "whatsapp" | "email" = "pdf",
  ) => {
    const cItem = exportFormat?.cartItem as any;
    const customTableData = exportFormat?.customTableData;
    const rates: any = (exportFormat as any)?.rates || {};
    let chartData: { label: string; value: number; color: string }[] = [];
    let grandTotal = 0;
    let tableRows: any[][] = [];
    const addRow = (
      item: string,
      qty: number,
      unitLabel: string,
      typeRateId: string,
    ) => {
      if (qty > 0) {
        const cost = qty * (rates[typeRateId] || 0);
        grandTotal += cost;
        tableRows.push([
          item,
          `${qty.toFixed(2)}\n(@ Rs ${rates[typeRateId] || 0}/${unitLabel})`,
          unitLabel,
          cost.toFixed(2),
        ]);
        let color = "#cbd5e1";
        if (item.includes("Cement")) color = "#60a5fa";
        else if (item.includes("Sand")) color = "#fbbf24";
        else if (item.includes("Aggregate")) color = "#94a3b8";
        else if (item.includes("Water")) color = "#22d3ee";
        else if (item.includes("Steel")) color = "#818cf8";
        else if (item.includes("Brick")) color = "#f43f5e";
        else if (item.includes("Block")) color = "#fb923c";
        chartData.push({ label: item, value: cost, color });
      }
    };
    if (customTableData) {
      customTableData.forEach((row) => {
        tableRows.push([
          row.item,
          `${row.quantityStr}\n(@ Rs ${row.rate || 0}/${row.unitStr})`,
          row.unitStr,
          row.cost.toFixed(2),
        ]);
        grandTotal += row.cost;
        chartData.push({
          label: row.item,
          value: row.cost,
          color: row.color || "#cbd5e1",
        });
      });
    } else if (cItem) {
      const isSI = cItem.unitVol === "m³";
      addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
      addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
      addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
      addRow("Water", isSI ? (cItem.waterLiters || 0) : ((cItem.waterLiters / 3.78541) || 0), isSI ? "L" : "Gal", "water");
      if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
      if (cItem.bricksCount)
        addRow("Bricks", cItem.bricksCount, "nos", "bricks");
      if (cItem.blocksCount)
        addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
      Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
        const vLower = String(v).toLowerCase();
        let cost = 0;
        let rateStr = "-";
        
        let inferredKey = k.toLowerCase();
        if (inferredKey.includes("cement")) inferredKey = "cement";
        else if (inferredKey.includes("sand")) inferredKey = "sand";
        else if (inferredKey.includes("aggregate") || inferredKey.includes("crush")) inferredKey = "aggregate";
        else if (inferredKey.includes("water")) inferredKey = "water";
        else if (inferredKey.includes("steel")) inferredKey = "steel";
        else if (inferredKey.includes("brick")) inferredKey = "bricks";
        else if (inferredKey.includes("block")) inferredKey = "blocks";

        if (rates && rates[inferredKey]) {
          const rawNum = parseFloat(vLower.replace(/[^0-9.-]+/g, "")) || 0;
          cost = rawNum * rates[inferredKey];
          rateStr = `${rates[inferredKey]}`;
        }

        const quantityText = rateStr !== "-" ? `${String(v)}\n(@ Rs ${rateStr})` : String(v);
        tableRows.push([k, quantityText, "-", cost > 0 ? cost.toFixed(2) : "-"]);
        
        if (cost > 0) {
          grandTotal += cost;
          chartData.push({ label: k, value: cost, color: "#8b5cf6" });
        }
      });
    }

    const doc = await generateProfessionalPDF({
      title,
      toolId: activeTab,
      inputs: {
        "Structure Type": title,
        ...(exportFormat?.inputs || {}),
      },
      tableData: tableRows,
      chartData: chartData.length > 0 ? chartData : undefined,
      grandTotal,
    });

    const fileName = `${getFileNamePrefix()}.pdf`;
    if (exportType === "whatsapp" || exportType === "email") {
      const pdfBlob = doc.output("blob");
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        navigator
          .share({
            title: title,
            text: "Here is the estimation PDF generated via Civil Estimation Pro.",
            files: [file],
          })
          .then(() => toast.success("Shared successfully"))
          .catch((e) => {
            console.error("Error sharing", e);
          });
        setIsOpen(false);
      } else {
        toast(
          `Direct file sharing via ${exportType === "whatsapp" ? "WhatsApp" : "Email"} is not supported on this device/browser. The PDF will be downloaded so you can share it manually.`,
          { icon: "ℹ️" },
        );
        doc.save(fileName);
        setIsOpen(false);
        toast.success(`✅ File saved as ${fileName}`);
      }
    } else {
      doc.save(fileName);
      setIsOpen(false);
      toast.success(`✅ File saved as ${fileName}`);
    }
  };
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estimate");
    /* 1. Title Banner (A1:E2) */ sheet.mergeCells("A1:E2");
    const titleCell = sheet.getCell("A1");
    titleCell.value = `${title}`;
    titleCell.font = {
      name: "Helvetica",
      size: 16,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF282A65" },
    };
    /* Navy Blue */ titleCell.alignment = {
      vertical: "middle",
      horizontal: "left",
      indent: 1,
    };
    /* Add date aligned to the right inside the banner. We will just use cell D1, E1 if we didn't merge across. Since we merged A1:E2, we can't easily put right-aligned text in the same cell without rich text, but rich text horizontal alignment is tricky. Alternatively, we can unmerge A1:E2, merge A1:C2 for title, D1:E2 for dates. Let's do that! */ sheet.unMergeCells(
      "A1:E2",
    );
    sheet.mergeCells("A1:C2");
    const titleCellA = sheet.getCell("A1");
    titleCellA.value = `${title}`;
    titleCellA.font = {
      name: "Helvetica",
      size: 16,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    titleCellA.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF282A65" },
    };
    titleCellA.alignment = {
      vertical: "middle",
      horizontal: "left",
      indent: 1,
    };
    sheet.mergeCells("D1:E2");
    const dateCell = sheet.getCell("D1");
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    dateCell.value = `Date Generated: ${dateStr}\nRates Valid As Of: ${dateStr}`;
    dateCell.font = { name: "Helvetica", size: 9, color: { argb: "FFFFFFFF" } };
    dateCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF282A65" },
    };
    dateCell.alignment = {
      vertical: "middle",
      horizontal: "right",
      wrapText: true,
      indent: 1,
    };
    /* Set height of row 1, 2 */ sheet.getRow(1).height = 18;
    sheet.getRow(2).height = 18;
    /* 2. Project Details (rows 4-x) */ const inputsInfo = filterValidParameters({
      "Structure Type": title,
      ...(exportFormat?.inputs || {}),
    });
    let currentRow = 4;
    Object.entries(inputsInfo).forEach(([key, val]) => {
      sheet.getCell(`A${currentRow}`).value = `${formatTitleCase(key)}: `;
      sheet.getCell(`A${currentRow}`).font = { bold: true };
      sheet.getCell(`B${currentRow}`).value = val;
      currentRow++;
    });
    currentRow += 1;
    /* Spacing */ /* 3. Main BOQ Table Header */ const headerRow =
      sheet.getRow(currentRow);
    headerRow.values = [
      "Material / Item",
      "Quantity",
      "Unit",
      "Rate (Rs)",
      "Amount",
    ];
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.alignment = { horizontal: "center" };
    for (let c = 1; c <= 5; c++) {
      headerRow.getCell(c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF282A65" },
      };
    }
    currentRow++;
    /* Section Divider */ const sectionRow = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:E${currentRow}`);
    sectionRow.getCell(1).value = `Details - ${title}`;
    sectionRow.getCell(1).font = { bold: true };
    sectionRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF0F0F0" },
    };
    /* Light Grey */ currentRow++;
    /* Add Data */ const cItem = exportFormat?.cartItem as any;
    const customTableData = exportFormat?.customTableData;
    const rates: any = (exportFormat as any)?.rates || {};
    let startAmtRow = currentRow;
    const addRow = (
      item: string,
      qty: number,
      unitLabel: string,
      typeRateId: string,
    ) => {
      if (qty > 0) {
        const row = sheet.getRow(currentRow);
        row.getCell(1).value = item;
        row.getCell(2).value = qty;
        row.getCell(2).numFmt = "#,##0.00";
        row.getCell(2).alignment = { horizontal: "right" };
        row.getCell(3).value = unitLabel;
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(4).value = rates[typeRateId] || 0;
        row.getCell(4).numFmt = '"Rs "#,##0.00';
        /* Amount = Qty * Rate */ row.getCell(5).value = {
          formula: `B${currentRow}*D${currentRow}`,
          date1904: false,
        } as any;
        row.getCell(5).numFmt = '"Rs "#,##0.00';
        currentRow++;
      }
    };
    if (customTableData) {
      customTableData.forEach((r) => {
        const row = sheet.getRow(currentRow);
        row.getCell(1).value = r.item;
        row.getCell(2).value = r.quantityStr;
        /* if it's a number, align right and maybe give it formatting */ if (
          typeof r.quantityStr === "number"
        ) {
          row.getCell(2).numFmt = "#,##0.00";
        }
        row.getCell(2).alignment = { horizontal: "right" };
        row.getCell(3).value = r.unitStr;
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(4).value = Number(r.rate) || 0;
        row.getCell(4).numFmt = '"Rs "#,##0.00';
        row.getCell(5).value = r.cost;
        row.getCell(5).numFmt = '"Rs "#,##0.00';
        currentRow++;
      });
    } else if (cItem) {
      const isSI = cItem.unitVol === "m³";
      addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
      addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
      addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
      addRow("Water", isSI ? cItem.waterLiters : (cItem.waterLiters / 3.78541) || 0, isSI ? "L" : "Gal", "water");
      if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
      if (cItem.bricksCount)
        addRow("Bricks", cItem.bricksCount, "nos", "bricks");
      if (cItem.blocksCount)
        addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
      Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
        const row = sheet.getRow(currentRow);
        const vLower = String(v).toLowerCase();
        let cost = 0;
        let inferredKey = k.toLowerCase();
        
        if (inferredKey.includes("cement")) inferredKey = "cement";
        else if (inferredKey.includes("sand")) inferredKey = "sand";
        else if (inferredKey.includes("aggregate") || inferredKey.includes("crush")) inferredKey = "aggregate";
        else if (inferredKey.includes("water")) inferredKey = "water";
        else if (inferredKey.includes("steel")) inferredKey = "steel";
        else if (inferredKey.includes("brick")) inferredKey = "bricks";
        else if (inferredKey.includes("block")) inferredKey = "blocks";

        if (rates && rates[inferredKey]) {
          const rawNum = parseFloat(vLower.replace(/[^0-9.-]+/g, "")) || 0;
          cost = rawNum * rates[inferredKey];
        }

        row.getCell(1).value = formatCapitalize(k.replace(/\*/g, ''));
        row.getCell(2).value = String(v);
        row.getCell(3).value = "-";
        row.getCell(4).value = rates && rates[inferredKey] ? rates[inferredKey] : "-";
        row.getCell(5).value = cost || "-";
        if (cost) {
          row.getCell(5).numFmt = '"Rs "#,##0.00';
        }
        currentRow++;
      });
    }
    let endAmtRow = currentRow - 1;
    /* Grand Total Row */ const grandRow = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:D${currentRow}`);
    grandRow.getCell(1).value = "Grand Total Estimated";
    grandRow.getCell(1).font = { bold: true, color: { argb: "FF282A65" } };
    grandRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F0FA" },
    };
    /* Very light blue */ grandRow.getCell(1).alignment = {
      horizontal: "right",
    };
    const formulaStr =
      endAmtRow >= startAmtRow ? `SUM(E${startAmtRow}:E${endAmtRow})` : "0";
    grandRow.getCell(5).value = { formula: formulaStr, date1904: false } as any;
    grandRow.getCell(5).font = { bold: true, color: { argb: "FF282A65" } };
    grandRow.getCell(5).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F0FA" },
    };
    grandRow.getCell(5).numFmt = '"Rs "#,##0.00';
    currentRow += 2;
    sheet.getCell(`A${currentRow}`).value =
      "* Denotes a user-defined custom rate. This is a system-generated estimate. Actual prices may vary based on market conditions.";
    sheet.getCell(`A${currentRow}`).font = {
      size: 9,
      italic: true,
      color: { argb: "FF888888" },
    };
    /* Auto fit columns */ sheet.columns.forEach((column, i) => {
      let maxLen = 12;
      column.eachCell!({ includeEmpty: false }, (cell) => {
        if (!cell.isMerged && cell.value) {
          const str = cell.value.toString();
          if (str.length > maxLen) maxLen = str.length;
        }
      });
      if (i === 0) maxLen = Math.max(maxLen, 25);
      column.width = maxLen + 4;
    });
    const fileName = `${getFileNamePrefix()}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
    setIsOpen(false);
    toast.success(`✅ File saved as ${fileName}`);
  };
  return (
    <div
      className={`relative inline-flex items-center gap-3 z-30 font-sans ${containerClassName || ""}`}
      ref={menuRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClassName || "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-teal-500/30 shadow-md flex items-center justify-center gap-2 text-sm"}
        title="Share Results"
      >
        {triggerContent || (
          <>
            <Share2 className="w-4 h-4 group-hover:-translate-y-[1px] transition-transform" />
            <span>Share Results</span>
          </>
        )}
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 ${popupPosition === "top" ? "bottom-full mb-3 origin-bottom-right" : "top-full mt-3 origin-top-right"} w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15),0_8px_20px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.3)] z-50 p-2 font-sans`}
          style={{ animation: "menuSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
            <style>{` @keyframes menuSlide { from { opacity: 0; transform: translateY(${popupPosition === "top" ? "15px" : "-15px"}) scale(0.95); filter: blur(4px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } } `}</style>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => generatePDF("pdf")}
                className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-900 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 dark:hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 shadow-sm shadow-rose-200/50 dark:shadow-none transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                Download PDF
              </button>
              
              <button
                onClick={generateExcel}
                className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-sm shadow-emerald-200/50 dark:shadow-none transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                Export to Excel
              </button>
              
              <button
                onClick={() => generatePDF("whatsapp")}
                className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-900 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500/20 dark:hover:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-green-500/20 text-green-500 dark:text-green-400 shadow-sm shadow-green-200/50 dark:shadow-none transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                Share on WhatsApp
              </button>
              
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
                  setIsOpen(false);
                  toast.success("Opened LinkedIn");
                }}
                className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold bg-[#e8f4fa] text-[#0a66c2] hover:bg-[#d0e8f5] hover:text-[#004182] dark:bg-[#0a66c2]/10 dark:text-[#70b5f9] dark:hover:bg-[#0a66c2]/20 dark:hover:text-[#a0cbfb] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#70b5f9] shadow-sm shadow-[#0a66c2]/30 dark:shadow-none transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                Share on LinkedIn
              </button>

              <button
                onClick={() => generatePDF("email")}
                className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 shadow-sm shadow-blue-200/50 dark:shadow-none transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                Send via Email
              </button>
              
              <button
                onClick={handleDownloadText}
                className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-200/50 dark:shadow-none transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                Download as Text
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
