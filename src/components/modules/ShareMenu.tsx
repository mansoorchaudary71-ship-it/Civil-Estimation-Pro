import React, { useState, useRef } from "react";
import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';
import { Share2, FileText, FileSpreadsheet, MessageCircle, Mail, ChevronDown, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ShareMenuProps {
  activeTab: string;
  data: Record<string, any>;
  title: string;
  exportFormat?: {
    inputs: Record<string, string>;
    breakdown: Record<string, string>;
    rates?: any;
    cartItem?: any;
    customTableData?: { item: string, quantityStr: string | number, unitStr: string, rate?: number | string, cost: number, color?: string }[];
  }
}

function createDonutChart(data: {label: string, value: number, color: string}[], totalText: string): Promise<string | null> {
   return new Promise((resolve) => {
      let svg = `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
               <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.15" />
            </filter>
         </defs>
         <g filter="url(#shadow)">`;
      let total = data.reduce((sum, d) => sum + d.value, 0);
      if (total <= 0) return resolve(null);
      let currentAngle = -Math.PI / 2;
      const center = 400, radius = 320, innerRadius = 200;

      data.forEach(d => {
         if (d.value <= 0) return;
         const sliceAngle = (d.value / total) * 2 * Math.PI;
         // Gap between slices
         const gap = 0.02;
         const drawAngle = Math.max(0, sliceAngle - gap);
         const nextAngle = currentAngle + sliceAngle;
         
         const x1 = center + radius * Math.cos(currentAngle + gap/2);
         const y1 = center + radius * Math.sin(currentAngle + gap/2);
         const x2 = center + radius * Math.cos(currentAngle + gap/2 + drawAngle);
         const y2 = center + radius * Math.sin(currentAngle + gap/2 + drawAngle);
         
         const ix1 = center + innerRadius * Math.cos(currentAngle + gap/2);
         const iy1 = center + innerRadius * Math.sin(currentAngle + gap/2);
         const ix2 = center + innerRadius * Math.cos(currentAngle + gap/2 + drawAngle);
         const iy2 = center + innerRadius * Math.sin(currentAngle + gap/2 + drawAngle);

         const largeArc = drawAngle > Math.PI ? 1 : 0;

         if (sliceAngle > 2 * Math.PI - 0.01) {
            svg += `<circle cx="400" cy="400" r="${(radius+innerRadius)/2}" fill="none" stroke="${d.color}" stroke-width="${radius-innerRadius}" />`;
         } else {
             const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
             svg += `<path d="${path}" fill="${d.color}" />`;
         }
         currentAngle = nextAngle;
      });

      svg += `</g>
              <text x="400" y="380" text-anchor="middle" font-family="helvetica, sans-serif" font-size="40" fill="#64748b" font-weight="bold">Grand Total</text>
              <text x="400" y="440" text-anchor="middle" font-family="helvetica, sans-serif" font-size="56" fill="#1e293b" font-weight="bold">${totalText}</text>
              </svg>`;

      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new window.Image();
      img.onload = () => {
         const canvas = document.createElement("canvas");
         canvas.width = 800;
         canvas.height = 800;
         const ctx = canvas.getContext("2d");
         if (ctx) ctx.drawImage(img, 0, 0);
         URL.revokeObjectURL(url);
         resolve(canvas.toDataURL("image/png", 1.0));
      };
      img.onerror = () => resolve(null);
      img.src = url;
   });
}

export default function ShareButtonWithPopup({ activeTab, data, title, exportFormat }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel">("pdf");
  const [reportDetails, setReportDetails] = useState({
    projectName: "",
    siteLocation: "",
    preparedBy: ""
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside could be added, but a simple toggle is okay for now.

  const formatText = () => {
    let txt = `${title}\n\n`;
    Object.entries(data).forEach(([key, val]) => {
      txt += `${key}: ${val}\n`;
    });
    txt += `\nGenerated via Civil Estimation Pro`;
    return txt;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setIsOpen(false);
  };

  const handleDownloadText = () => {
    const textBlob = new Blob([formatText()], { type: "text/plain;charset=utf-8" });
    saveAs(textBlob, `${title.replace(/\s+/g, '_')}_Estimate.txt`);
    setIsOpen(false);
  };

  const handleEmail = () => {
    let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f0f0f0; font-family: Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background-color: #282A65; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">${title}</h1>
    </div>
    <div style="padding: 20px;">
      <p style="color: #333333; font-size: 16px;">Hello,</p>
      <p style="color: #333333; font-size: 16px;">Here is the requested estimate for <strong>${title}</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="background-color: #282A65; color: #ffffff; padding: 12px; text-align: left; border: 1px solid #ddd;">Material / Item</th>
            <th style="background-color: #282A65; color: #ffffff; padding: 12px; text-align: right; border: 1px solid #ddd;">Quantity</th>
            <th style="background-color: #282A65; color: #ffffff; padding: 12px; text-align: right; border: 1px solid #ddd;">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>`;

    const cItem = exportFormat?.cartItem as any;
    const customTableData = exportFormat?.customTableData;
    const rates: any = (exportFormat as any)?.rates || {};
    let grandTotal = 0;
    let isEven = false;

    const addRow = (item: string, qty: number, unitLabel: string, typeRateId: string) => {
        if (qty > 0) {
            const cost = qty * (rates[typeRateId] || 0);
            grandTotal += cost;
            const bg = isEven ? '#f9f9f9' : '#ffffff';
            html += `
          <tr style="background-color: ${bg};">
            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${item}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${qty.toFixed(2)} ${unitLabel}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${cost.toFixed(2)}</td>
          </tr>`;
            isEven = !isEven;
        }
    };

    if (customTableData) {
        customTableData.forEach(row => {
            const bg = isEven ? '#f9f9f9' : '#ffffff';
            html += `
          <tr style="background-color: ${bg};">
            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${row.item}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${row.quantityStr} ${row.unitStr}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${row.cost.toFixed(2)}</td>
          </tr>`;
            grandTotal += row.cost;
            isEven = !isEven;
        });
    } else if (cItem) {
        addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
        addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
        addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
        addRow("Water", cItem.waterLiters || 0, "L", "water");
        if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
        if (cItem.bricksCount) addRow("Bricks", cItem.bricksCount, "nos", "bricks");
        if (cItem.blocksCount) addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
        Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
           const bg = isEven ? '#f9f9f9' : '#ffffff';
           html += `
          <tr style="background-color: ${bg};">
            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${k}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">${v}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #333;">-</td>
          </tr>`;
           isEven = !isEven;
        });
    }

    html += `
          <tr>
            <td colspan="2" style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; background-color: #E6F0FA; color: #282A65;">Grand Total</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; background-color: #E6F0FA; color: #282A65;">Rs ${grandTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
        <a href="#" style="background-color: #282A65; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Download Full PDF Report</a>
      </div>
      <p style="color: #888888; font-size: 12px; text-align: center; margin-top: 20px;">* This is a system-generated estimate. Actual prices may vary based on market conditions.</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    saveAs(blob, `Email-Template-${title.replace(/[^a-zA-Z0-9]/g, '-')}.html`);
    setIsOpen(false);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // 1. Header
    doc.setFillColor(40, 42, 101); // #282A65
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${title}`, 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.text(`Date Generated: ${dateStr}`, pageWidth - 14, 16, { align: "right" });
    doc.text(`Rates Valid As Of: ${dateStr}`, pageWidth - 14, 24, { align: "right" });
    
    // 2. Project Parameters
    let currentY = 40;
    doc.setTextColor(40, 42, 101);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Project Parameters", 14, currentY);
    
    doc.setDrawColor(40, 42, 101);
    doc.setLineWidth(0.5);
    doc.line(14, currentY + 2, pageWidth - 14, currentY + 2);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    
    let isLeft = true;
    
    const inputsInfo = {
      "Project Name": reportDetails.projectName || "Not specified",
      "Site Location": reportDetails.siteLocation || "Not specified",
      "Prepared By": reportDetails.preparedBy || "Not specified",
      "Structure Type": title,
      ...(exportFormat?.inputs || {})
    };
    
    Object.entries(inputsInfo).forEach(([key, val]) => {
      const x = isLeft ? 14 : pageWidth / 2 + 10;
      doc.setFont("helvetica", "bold");
      doc.text(`${key}:`, x, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(String(val), x + doc.getTextWidth(`${key}:`) + 3, currentY);
      
      if (!isLeft) {
        currentY += 7;
      }
      isLeft = !isLeft;
    });
    
    if (!isLeft) currentY += 7;
    
    // 3. Visual Summary (Chart)
    const cItem = exportFormat?.cartItem as any;
    const customTableData = exportFormat?.customTableData;
    const rates: any = (exportFormat as any)?.rates || {};
    
    let chartData: {label: string, value: number, color: string}[] = [];
    let grandTotal = 0;
    let tableRows: any[][] = [];

    const addRow = (item: string, qty: number, unitLabel: string, typeRateId: string) => {
        if (qty > 0) {
            const cost = qty * (rates[typeRateId] || 0);
            grandTotal += cost;
            tableRows.push([
                item,
                `${qty.toFixed(2)}\n(@ Rs ${rates[typeRateId] || 0}/${unitLabel})`,
                unitLabel,
                cost.toFixed(2)
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
        customTableData.forEach(row => {
            tableRows.push([
                row.item,
                `${row.quantityStr}\n(@ Rs ${row.rate || 0}/${row.unitStr})`,
                row.unitStr,
                row.cost.toFixed(2)
            ]);
            grandTotal += row.cost;
            chartData.push({ label: row.item, value: row.cost, color: row.color || "#cbd5e1" });
        });
    } else if (cItem) {
        addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
        addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
        addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
        addRow("Water", cItem.waterLiters || 0, "L", "water");
        if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
        if (cItem.bricksCount) addRow("Bricks", cItem.bricksCount, "nos", "bricks");
        if (cItem.blocksCount) addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
        Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
           tableRows.push([k, String(v), "-", "-"]);
        });
    }

    currentY += 5;
    
    const totalText = `Rs ${grandTotal.toFixed(0)}`;
    const chartBase64 = await createDonutChart(chartData, totalText);
    
    if (chartBase64 && chartData.length > 0) {
       doc.addImage(chartBase64, "PNG", pageWidth/2 - 40, currentY, 80, 80);
       currentY += 85;
    } else {
       currentY += 10;
    }

    // 5. BOQ Table Structure
    const tableBody: any[] = [];
    tableBody.push([
      { content: `${title} - Details`, colSpan: 4, styles: { fillColor: [240, 240, 240], textColor: [40, 42, 101], fontStyle: 'bold', halign: 'center' } }
    ]);
    tableRows.forEach(r => tableBody.push(r));

    autoTable(doc, {
      startY: currentY,
      head: [["Material / Item", "Quantity", "Unit", "Amount (Rs)"]],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [40, 42, 101], textColor: [255, 255, 255], font: 'helvetica', fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, valign: 'middle' },
      margin: { left: 14 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || currentY + 10;
    
    // 4. Financial Summary Table (bottom line)
    autoTable(doc, {
        startY: finalY,
        body: [
            ["Grand Total Estimated", `Rs ${grandTotal.toFixed(2)}`]
        ],
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 12, cellPadding: 6 },
        columnStyles: {
            0: { fontStyle: 'bold', fillColor: [240, 248, 255], textColor: [40, 42, 101] }, 
            1: { halign: 'right', fontStyle: 'bold', fillColor: [240, 248, 255], textColor: [40, 42, 101], cellWidth: 50 }
        },
        margin: { left: 14 }
    });

    // 6. Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("* Denotes a user-defined custom rate. This is a system-generated estimate. Actual prices may vary based on market conditions.", 14, doc.internal.pageSize.height - 10);
    
    doc.save(`Corporate-BOQ-${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
    setShowReportDetails(false);
    setIsOpen(false);
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Estimate');

    // 1. Title Banner (A1:E2)
    sheet.mergeCells('A1:E2');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `${title}`;
    titleCell.font = { name: 'Helvetica', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF282A65' } // Navy Blue
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    
    // Add date aligned to the right inside the banner. We will just use cell D1, E1 if we didn't merge across. Since we merged A1:E2, we can't easily put right-aligned text in the same cell without rich text, but rich text horizontal alignment is tricky. Alternatively, we can unmerge A1:E2, merge A1:C2 for title, D1:E2 for dates. Let's do that!
    sheet.unMergeCells('A1:E2');
    sheet.mergeCells('A1:C2');
    const titleCellA = sheet.getCell('A1');
    titleCellA.value = `${title}`;
    titleCellA.font = { name: 'Helvetica', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF282A65' } };
    titleCellA.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    
    sheet.mergeCells('D1:E2');
    const dateCell = sheet.getCell('D1');
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    dateCell.value = `Date Generated: ${dateStr}\nRates Valid As Of: ${dateStr}`;
    dateCell.font = { name: 'Helvetica', size: 9, color: { argb: 'FFFFFFFF' } };
    dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF282A65' } };
    dateCell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };

    // Set height of row 1, 2
    sheet.getRow(1).height = 18;
    sheet.getRow(2).height = 18;

    // 2. Project Details (rows 4-x)
    const inputsInfo = {
      "Project Name": reportDetails.projectName || "Not specified",
      "Site Location": reportDetails.siteLocation || "Not specified",
      "Prepared By": reportDetails.preparedBy || "Not specified",
      "Structure Type": title,
      ...(exportFormat?.inputs || {})
    };

    let currentRow = 4;
    Object.entries(inputsInfo).forEach(([key, val]) => {
      sheet.getCell(`A${currentRow}`).value = `${key}:   `;
      sheet.getCell(`A${currentRow}`).font = { bold: true };
      sheet.getCell(`B${currentRow}`).value = val;
      currentRow++;
    });

    currentRow += 1; // Spacing

    // 3. Main BOQ Table Header
    const headerRow = sheet.getRow(currentRow);
    headerRow.values = ['Material / Item', 'Quantity', 'Unit', 'Rate (Rs)', 'Amount'];
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { horizontal: 'center' };
    
    for (let c = 1; c <= 5; c++) {
      headerRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF282A65' } };
    }
    currentRow++;

    // Section Divider
    const sectionRow = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:E${currentRow}`);
    sectionRow.getCell(1).value = `Details - ${title}`;
    sectionRow.getCell(1).font = { bold: true };
    sectionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } }; // Light Grey
    currentRow++;

    // Add Data
    const cItem = exportFormat?.cartItem as any;
    const customTableData = exportFormat?.customTableData;
    const rates: any = (exportFormat as any)?.rates || {};

    let startAmtRow = currentRow;

    const addRow = (item: string, qty: number, unitLabel: string, typeRateId: string) => {
        if (qty > 0) {
            const row = sheet.getRow(currentRow);
            row.getCell(1).value = item;
            row.getCell(2).value = qty;
            row.getCell(2).numFmt = '#,##0.00';
            row.getCell(2).alignment = { horizontal: 'right' };
            row.getCell(3).value = unitLabel;
            row.getCell(3).alignment = { horizontal: 'center' };
            row.getCell(4).value = rates[typeRateId] || 0;
            row.getCell(4).numFmt = '"Rs "#,##0.00';
            
            // Amount = Qty * Rate
            row.getCell(5).value = { formula: `B${currentRow}*D${currentRow}`, date1904: false } as any;
            row.getCell(5).numFmt = '"Rs "#,##0.00';
            currentRow++;
        }
    };

    if (customTableData) {
        customTableData.forEach(r => {
            const row = sheet.getRow(currentRow);
            row.getCell(1).value = r.item;
            row.getCell(2).value = r.quantityStr;
            // if it's a number, align right and maybe give it formatting
            if(typeof r.quantityStr === 'number') {
                row.getCell(2).numFmt = '#,##0.00';
            }
            row.getCell(2).alignment = { horizontal: 'right' };
            row.getCell(3).value = r.unitStr;
            row.getCell(3).alignment = { horizontal: 'center' };
            row.getCell(4).value = Number(r.rate) || 0;
            row.getCell(4).numFmt = '"Rs "#,##0.00';
            row.getCell(5).value = r.cost;
            row.getCell(5).numFmt = '"Rs "#,##0.00';
            currentRow++;
        });
    } else if (cItem) {
        addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
        addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
        addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
        addRow("Water", cItem.waterLiters || 0, "L", "water");
        if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
        if (cItem.bricksCount) addRow("Bricks", cItem.bricksCount, "nos", "bricks");
        if (cItem.blocksCount) addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
        Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
           const row = sheet.getRow(currentRow);
           row.getCell(1).value = k;
           row.getCell(2).value = String(v);
           row.getCell(3).value = "-";
           row.getCell(4).value = 0;
           row.getCell(5).value = 0;
           currentRow++;
        });
    }
    
    let endAmtRow = currentRow - 1;

    // Grand Total Row
    const grandRow = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:D${currentRow}`);
    grandRow.getCell(1).value = 'Grand Total Estimated';
    grandRow.getCell(1).font = { bold: true, color: { argb: 'FF282A65' } };
    grandRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0FA' } }; // Very light blue
    grandRow.getCell(1).alignment = { horizontal: 'right' };
    
    const formulaStr = endAmtRow >= startAmtRow ? `SUM(E${startAmtRow}:E${endAmtRow})` : '0';
    grandRow.getCell(5).value = { formula: formulaStr, date1904: false } as any;
    grandRow.getCell(5).font = { bold: true, color: { argb: 'FF282A65' } };
    grandRow.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0FA' } };
    grandRow.getCell(5).numFmt = '"Rs "#,##0.00';
    
    currentRow += 2;
    sheet.getCell(`A${currentRow}`).value = "* Denotes a user-defined custom rate. This is a system-generated estimate. Actual prices may vary based on market conditions.";
    sheet.getCell(`A${currentRow}`).font = { size: 9, italic: true, color: { argb: 'FF888888' } };

    // Auto fit columns
    sheet.columns.forEach((column, i) => {
      let maxLen = 12;
      column.eachCell!({ includeEmpty: false }, cell => {
        if (!cell.isMerged && cell.value) {
            const str = cell.value.toString();
            if (str.length > maxLen) maxLen = str.length;
        }
      });
      if (i === 0) maxLen = Math.max(maxLen, 25);
      column.width = maxLen + 4;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Corporate-BOQ-${title.replace(/[^a-zA-Z0-9]/g, '-')}.xlsx`);
    
    setShowReportDetails(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-3" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl shadow-indigo-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-indigo-600/20"
          title="Share"
        >
          <Share2 className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>

        {isOpen && (
          <div 
            className="absolute right-0 bottom-full mb-4 w-72 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-[16px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)] z-50 p-2 font-sans origin-bottom-right"
            style={{ animation: 'menuSlideUp 0.2s ease-out forwards' }}
          >
            <style>{`
              @keyframes menuSlideUp {
                from { opacity: 0; transform: translateY(10px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
            <div className="flex flex-col">
              <button onClick={() => { setExportType("pdf"); setIsOpen(false); setShowReportDetails(true); }} className="flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group w-full text-left">
                <div className="p-2.5 rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                Download PDF
              </button>
              
              <div className="h-px bg-slate-100 my-1 mx-4"></div>
              
              <button onClick={() => { setExportType("excel"); setIsOpen(false); setShowReportDetails(true); }} className="flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group w-full text-left">
                <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                Export to Excel (CSV)
              </button>
              
              <div className="h-px bg-slate-100 my-1 mx-4"></div>
              
              <button onClick={handleWhatsApp} className="flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group w-full text-left">
                <div className="p-2.5 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                Share on WhatsApp
              </button>
              
              <div className="h-px bg-slate-100 my-1 mx-4"></div>
              
              <button onClick={handleEmail} className="flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group w-full text-left">
                <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                Send via Email
              </button>
              <div className="h-px bg-slate-100 my-1 mx-4"></div>
              
              <button onClick={handleDownloadText} className="flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group w-full text-left">
                <div className="p-2.5 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                Download as Text
              </button>
            </div>
          </div>
        )}
      </div>

      {showReportDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Details</h3>
              <button 
                onClick={() => setShowReportDetails(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Residential House Construction"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={reportDetails.projectName}
                  onChange={(e) => setReportDetails({...reportDetails, projectName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Site Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Plot 42, Sector B"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={reportDetails.siteLocation}
                  onChange={(e) => setReportDetails({...reportDetails, siteLocation: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Prepared By</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={reportDetails.preparedBy}
                  onChange={(e) => setReportDetails({...reportDetails, preparedBy: e.target.value})}
                />
              </div>
            </div>
            
            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowReportDetails(false)}
                className="flex-1 py-3 px-4 font-bold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => exportType === "pdf" ? generatePDF() : generateExcel()}
                className={`flex-1 py-3 px-4 font-bold rounded-xl text-white ${exportType === "pdf" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"} transition-colors flex justify-center items-center gap-2 shadow-lg`}
              >
                {exportType === "pdf" ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                Generate {exportType === "pdf" ? "PDF" : "Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
