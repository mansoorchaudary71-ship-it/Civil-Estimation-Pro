import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import QRCode from "qrcode";

export interface ReportData {
  toolName: string;
  reportId?: string;
  metadata: {
    totalEstimatedCost: number;
    costPerSqFt?: number;
    totalCoveredArea?: number;
    structureType?: string;
    [key: string]: any;
  };
  chartData: {
    donut: { label: string; value: number; color?: string }[];
    bar: { label: string; value: number; color?: string }[];
  };
  boqData: {
    category?: string;
    itemDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    amount: number; // We'll compute this in Excel with formula =Qty*Rate
  }[];
}

const DEFAULT_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"
];

const generateBarChartBase64 = async (data: { label: string; value: number; color?: string }[]): Promise<string | null> => {
  return new Promise((resolve) => {
    let svg = `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.1" />
        </filter>
      </defs>
      <rect width="800" height="400" fill="#ffffff" />
      <text x="400" y="40" text-anchor="middle" font-family="helvetica, sans-serif" font-size="24" fill="#1e293b" font-weight="bold">Top 5 Cost Drivers</text>
      <g transform="translate(200, 80)">`;

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barHeight = 40;
    const barSpacing = 20;

    data.slice(0, 5).forEach((d, i) => {
      const y = i * (barHeight + barSpacing);
      const width = (d.value / maxValue) * 500;
      const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

      svg += `<text x="-20" y="${y + barHeight / 2 + 6}" text-anchor="end" font-family="helvetica, sans-serif" font-size="16" fill="#475569" font-weight="bold">${d.label}</text>`;
      svg += `<rect x="0" y="${y}" width="${width}" height="${barHeight}" fill="${color}" rx="6" filter="url(#shadow)" />`;
      svg += `<text x="${width + 15}" y="${y + barHeight / 2 + 6}" font-family="helvetica, sans-serif" font-size="16" fill="#1e293b" font-weight="bold">Rs ${Math.round(d.value).toLocaleString('en-US')}</text>`;
    });

    svg += `</g></svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 800, 400);
        ctx.drawImage(img, 0, 0);
      }
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png", 1.0));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const createDonutChartBase64New = (
  data: { label: string; value: number; color?: string }[],
  totalText: string
): Promise<string | null> => {
  return new Promise((resolve) => {
    let svg = `<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.15" />
        </filter>
      </defs>
      <rect width="1200" height="800" fill="#ffffff" />
      <g filter="url(#shadow)">`;
    let total = data.reduce((sum, d) => sum + d.value, 0);
    if (total <= 0) return resolve(null);

    let currentAngle = -Math.PI / 2;
    const center = 400;
    const radius = 320;
    const innerRadius = 200;

    data.forEach((d, i) => {
      if (d.value <= 0) return;
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const gap = 0.02;
      const drawAngle = Math.max(0, sliceAngle - gap);
      const nextAngle = currentAngle + sliceAngle;

      const x1 = center + radius * Math.cos(currentAngle + gap / 2);
      const y1 = center + radius * Math.sin(currentAngle + gap / 2);
      const x2 = center + radius * Math.cos(currentAngle + gap / 2 + drawAngle);
      const y2 = center + radius * Math.sin(currentAngle + gap / 2 + drawAngle);

      const ix1 = center + innerRadius * Math.cos(currentAngle + gap / 2);
      const iy1 = center + innerRadius * Math.sin(currentAngle + gap / 2);
      const ix2 = center + innerRadius * Math.cos(currentAngle + gap / 2 + drawAngle);
      const iy2 = center + innerRadius * Math.sin(currentAngle + gap / 2 + drawAngle);

      const largeArc = drawAngle > Math.PI ? 1 : 0;
      const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

      if (sliceAngle > 2 * Math.PI - 0.01) {
        svg += `<circle cx="${center}" cy="400" r="${(radius + innerRadius) / 2}" fill="none" stroke="${color}" stroke-width="${radius - innerRadius}" />`;
      } else {
        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
        svg += `<path d="${path}" fill="${color}" />`;
      }
      currentAngle = nextAngle;
    });

    svg += `</g>
      <text x="${center}" y="380" text-anchor="middle" font-family="helvetica, sans-serif" font-size="40" fill="#64748b" font-weight="bold">Total Cost</text>
      <text x="${center}" y="440" text-anchor="middle" font-family="helvetica, sans-serif" font-size="56" fill="#1e293b" font-weight="bold">${totalText}</text>
      
      <g transform="translate(800, 150)">`;

    data.forEach((d, i) => {
      if (d.value <= 0) return;
      const y = i * 60;
      const pct = ((d.value / total) * 100).toFixed(1);
      const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

      svg += `<rect x="0" y="${y - 20}" width="24" height="24" rx="6" fill="${color}" />`;
      svg += `<text x="40" y="${y}" font-family="helvetica, sans-serif" font-size="28" fill="#1e293b" font-weight="bold">${d.label}</text>`;
      svg += `<text x="40" y="${y + 30}" font-family="helvetica, sans-serif" font-size="22" fill="#64748b" font-weight="normal">Rs ${Math.round(d.value).toLocaleString('en-US')} (${pct}%)</text>`;
    });

    svg += `</g></svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1200, 800);
        ctx.drawImage(img, 0, 0);
      }
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png", 1.0));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const GlobalReportEngine = {
  
  generatePDF: async (data: ReportData): Promise<jsPDF> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const safeData = data || {} as ReportData;

    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, pageWidth, 45, "F");

    let qrCodeDataURL = "";
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev.web.app/';
      qrCodeDataURL = await QRCode.toDataURL(currentUrl, {
        margin: 1,
        color: { dark: '#0F172A', light: '#ffffff' }
      });
    } catch (err) {
      console.error(err);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(safeData.toolName?.toUpperCase() || 'ESTIMATION REPORT', 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); 
    doc.text("Civil Estimation Pro", 14, 28);
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Report ID: ${safeData.reportId || 'EST-' + Math.floor(Math.random()*10000)}`, pageWidth - 45, 18, { align: "right" });
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(`Date: ${dateStr}`, pageWidth - 45, 26, { align: "right" });

    if (qrCodeDataURL) {
      doc.addImage(qrCodeDataURL, "PNG", pageWidth - 36, 7, 30, 30);
    }

    let currentY = 55;

    doc.setFillColor(248, 250, 252);
    doc.rect(14, currentY, (pageWidth - 34) / 4, 25, "F");
    doc.rect(14 + (pageWidth - 34) / 4 + 2, currentY, (pageWidth - 34) / 4, 25, "F");
    doc.rect(14 + ((pageWidth - 34) / 4) * 2 + 4, currentY, (pageWidth - 34) / 4, 25, "F");
    doc.rect(14 + ((pageWidth - 34) / 4) * 3 + 6, currentY, (pageWidth - 34) / 4, 25, "F");

    let cardX = 16;
    const cardWidth = (pageWidth - 34) / 4;

    const drawCard = (idx: number, title: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(title, cardX + (cardWidth * idx) + (idx * 2), currentY + 8);
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(value, cardX + (cardWidth * idx) + (idx * 2), currentY + 18);
    };

    drawCard(0, "TOTAL EST. COST", `Rs ${Math.round(safeData.metadata.totalEstimatedCost || 0).toLocaleString()}`);
    drawCard(1, "COST PER SQ.FT", safeData.metadata.costPerSqFt ? `Rs ${Math.round(safeData.metadata.costPerSqFt).toLocaleString()}` : "-");
    drawCard(2, "COVERED AREA", safeData.metadata.totalCoveredArea ? `${safeData.metadata.totalCoveredArea} sq.ft` : "-");
    drawCard(3, "STRUCTURE TYPE", safeData.metadata.structureType || "Standard");

    currentY += 35;

    if (safeData.chartData?.donut?.length > 0) {
      const totalTxt = `Rs ${Math.round(safeData.metadata.totalEstimatedCost || 0).toLocaleString()}`;
      const donutBase64 = await createDonutChartBase64New(safeData.chartData.donut, totalTxt);
      if (donutBase64) {
        doc.addImage(donutBase64, "PNG", 14, currentY, 90, 60);
      }
    }
    
    if (safeData.chartData?.bar?.length > 0) {
      const barBase64 = await generateBarChartBase64(safeData.chartData.bar);
      if (barBase64) {
        doc.addImage(barBase64, "PNG", 110, currentY, 85, 45);
      }
    }

    currentY += 65;

    const tableBody = (safeData.boqData || []).map(row => [
      row.category || "",
      row.itemDescription || "",
      row.quantity.toLocaleString(undefined, {maximumFractionDigits: 2}),
      row.unit || "",
      row.rate.toLocaleString(),
      row.amount.toLocaleString()
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Category", "Item Description", "Qty", "Unit", "Rate (Rs)", "Amount (Rs)"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [249, 250, 251], // Light gray
        textColor: [17, 24, 39],
        font: "helvetica",
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [229, 231, 235],
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        lineColor: [229, 231, 235],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "center", cellWidth: 15 },
        4: { halign: "right", cellWidth: 25 },
        5: { halign: "right", cellWidth: 35, fontStyle: "bold", textColor: [15, 23, 42] },
      },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || currentY + 10;

    autoTable(doc, {
      startY: finalY,
      body: [["GRAND TOTAL", `Rs ${Math.round(safeData.metadata.totalEstimatedCost || 0).toLocaleString()}`]],
      theme: "plain",
      styles: { font: "helvetica", fontSize: 13, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [15, 23, 42], halign: "right" },
        1: { halign: "right", fontStyle: "bold", textColor: [232, 84, 26], cellWidth: 45 },
      },
      margin: { left: 14, right: 14 },
    });

    return doc;
  },

  generateExcel: async (data: ReportData): Promise<ExcelJS.Workbook> => {
     const safeData = data || {} as ReportData;
     const workbook = new ExcelJS.Workbook();
     workbook.creator = 'Civil Estimation Pro';
     workbook.lastModifiedBy = 'Civil Estimation Pro';
     workbook.created = new Date();
     workbook.modified = new Date();

     // Tab 1: Dashboard
     const dashSheet = workbook.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
     
     dashSheet.getColumn("B").width = 30;
     dashSheet.getColumn("C").width = 25;

     dashSheet.mergeCells("B2:D3");
     const titleCell = dashSheet.getCell("B2");
     titleCell.value = (safeData.toolName || 'ESTIMATION REPORT').toUpperCase();
     titleCell.font = { name: 'Arial', family: 2, size: 24, bold: true, color: { argb: 'FF0F172A' } };
     
     const dateCell = dashSheet.getCell("B4");
     dateCell.value = `Generated: ${new Date().toLocaleDateString()}`;
     dateCell.font = { italic: true, color: { argb: 'FF64748B' } };

     dashSheet.getCell("B6").value = "Executive Summary";
     dashSheet.getCell("B6").font = { bold: true, size: 14, color: { argb: 'FF0F172A' } };
     
     dashSheet.getCell("B8").value = "Total Estimated Cost";
     dashSheet.getCell("C8").value = safeData.metadata.totalEstimatedCost || 0;
     dashSheet.getCell("C8").numFmt = '"Rs "#,##0';
     dashSheet.getCell("C8").font = { bold: true, color: { argb: 'FFE8541A' } };

     dashSheet.getCell("B9").value = "Cost per Sq.Ft";
     dashSheet.getCell("C9").value = safeData.metadata.costPerSqFt || 0;
     dashSheet.getCell("C9").numFmt = '"Rs "#,##0';

     dashSheet.getCell("B10").value = "Total Covered Area (sq.ft)";
     dashSheet.getCell("C10").value = safeData.metadata.totalCoveredArea || 0;

     dashSheet.getCell("B11").value = "Structure Type";
     dashSheet.getCell("C11").value = safeData.metadata.structureType || "Standard";

     // If charts exist, we embed the donut chart
     if (safeData.chartData?.donut?.length > 0) {
       try {
         const donutBase64 = await createDonutChartBase64New(safeData.chartData.donut, `Rs ${Math.round(safeData.metadata.totalEstimatedCost || 0).toLocaleString()}`);
         if (donutBase64) {
           const imageId = workbook.addImage({
             base64: donutBase64.replace(/^data:image\/png;base64,/, ""),
             extension: 'png',
           });
           dashSheet.addImage(imageId, {
             tl: { col: 4, row: 5 },
             ext: { width: 500, height: 333 }
           });
         }
       } catch (e) { console.error("Could not append image to excel", e); }
     }

     for(let r=8; r<=11; r++) {
         const cellB = dashSheet.getCell(`B${r}`);
         const cellC = dashSheet.getCell(`C${r}`);
         cellB.border = { top: {style:'thin', color:{argb:'FFE2E8F0'}}, bottom: {style:'thin', color:{argb:'FFE2E8F0'}} };
         cellB.fill = { type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFF8FAFC'} };
         cellC.border = { top: {style:'thin', color:{argb:'FFE2E8F0'}}, bottom: {style:'thin', color:{argb:'FFE2E8F0'}} };
     }

     // Tab 2: Detailed BOQ
     const boqSheet = workbook.addWorksheet('Detailed BOQ', { views: [{ state: 'frozen', ySplit: 1 }] });
     
     boqSheet.columns = [
       { header: 'Category', key: 'cat', width: 25 },
       { header: 'Item Description', key: 'desc', width: 45 },
       { header: 'Unit', key: 'unit', width: 12 },
       { header: 'Quantity', key: 'qty', width: 15 },
       { header: 'Rate (Rs)', key: 'rate', width: 18 },
       { header: 'Amount (Rs)', key: 'amt', width: 22 }
     ];

     const headerRow = boqSheet.getRow(1);
     headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
     headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Deep blue/slate
     headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
     headerRow.height = 30;

     (safeData.boqData || []).forEach((row, index) => {
       const rowNum = index + 2;
       const excelRow = boqSheet.addRow({
         cat: row.category,
         desc: row.itemDescription,
         unit: row.unit,
         qty: row.quantity,
         rate: row.rate,
       });

       // INTERACTIVE FORMULA
       const amtCell = excelRow.getCell(6);
       amtCell.value = { formula: `D${rowNum}*E${rowNum}`, result: row.quantity * row.rate };
       
       excelRow.getCell(4).numFmt = '#,##0.00';
       excelRow.getCell(5).numFmt = '"Rs "#,##0';
       amtCell.numFmt = '"Rs "#,##0';

       if (index % 2 === 1) {
         excelRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
       }
     });

     const lastRow = (safeData.boqData?.length || 0) + 1;
     const footerRow = boqSheet.addRow({
       cat: '',
       desc: 'GRAND TOTAL',
       unit: '',
       qty: '',
       rate: '',
     });
     footerRow.font = { bold: true, size: 12, color: { argb: 'FF0F172A' } };
     
     const totalCell = footerRow.getCell(6);
     totalCell.value = { formula: `SUM(F2:F${lastRow})` };
     totalCell.numFmt = '"Rs "#,##0';
     totalCell.font = { bold: true, color: { argb: 'FFE8541A' } }; // Orange brand

     return workbook;
  }
};
