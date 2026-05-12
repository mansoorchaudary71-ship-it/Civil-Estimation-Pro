import QRCode from "qrcode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// PRO-TIPS DATABASE
const PRO_TIPS = [
  "Pro Tip: Always ensure a water-cement ratio of 0.45 to 0.55 for standard residential slabs to prevent shrinkage cracks.",
  "Pro Tip: Curing concrete for at least 7-14 days significantly increases its final compressive strength.",
  "Pro Tip: When estimating steel, always account for 3-5% wastage due to cutting and overlapping.",
  "Pro Tip: Verify the standard dimensions of local bricks as they form the baseline for mortar calculations.",
  "Pro Tip: For plastering, a dry materials multiplier of 1.33 is essential to compensate for wet shrinkage.",
  "Pro Tip: When performing earthworks, soil bulking can increase excavated volume by 15-20%.",
  "Pro Tip: Proper cover blocks are crucial to prevent reinforcement corrosion in concrete structures."
];

export const formatSpacedText = (str: string): string => {
  if (!str) return "";
  return String(str)
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
    .replace(/([a-zA-Z])(\d)/g, "$1 $2") // split letters from numbers
    .replace(/(\d)([a-zA-Z])/g, "$1 $2") // split numbers from letters
    .replace(/_/g, " ") // replace underscores with spaces
    .replace(/-/g, " ") // replace hyphens with spaces
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();
};

export const formatCapitalize = (str: string): string => {
  if (!str) return "";
  const spaced = formatSpacedText(String(str));
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const formatTitleCase = (str: string): string => {
  if (!str) return "";
  const spaced = formatSpacedText(String(str));
  return spaced
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const filterValidParameters = (
  params: Record<string, any>
): Record<string, any> => {
  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    // Basic valid check
    if (
      value !== null &&
      value !== undefined &&
      value !== "NaN" &&
      value !== "Infinity"
    ) {
      const isStringAndEmpty = typeof value === "string" && value.trim() === "";
      const isObjectAndEmpty = typeof value === "object" && Object.keys(value).length === 0;
      if (!isStringAndEmpty && !isObjectAndEmpty) {
        filtered[formatCapitalize(key)] = value;
      }
    }
  }
  return filtered;
};

// SVG to Base64 Image string generator for generic charts
export const createDonutChartBase64 = (
  data: { label: string; value: number; color: string }[],
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
    const center = 400,
      radius = 320,
      innerRadius = 200;

    data.forEach((d) => {
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

      if (sliceAngle > 2 * Math.PI - 0.01) {
        svg += `<circle cx="${center}" cy="400" r="${(radius + innerRadius) / 2}" fill="none" stroke="${d.color}" stroke-width="${radius - innerRadius}" />`;
      } else {
        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
        svg += `<path d="${path}" fill="${d.color}" />`;
      }
      currentAngle = nextAngle;
    });

    svg += `</g>
      <text x="${center}" y="380" text-anchor="middle" font-family="helvetica, sans-serif" font-size="40" fill="#64748b" font-weight="bold">Grand Total</text>
      <text x="${center}" y="440" text-anchor="middle" font-family="helvetica, sans-serif" font-size="56" fill="#1e293b" font-weight="bold">${totalText}</text>`;
      
    // Legend drawing
    const legendX = 800;
    let legendY = 400 - (data.length * 25);
    data.forEach(d => {
       if(d.value <= 0) return;
       const pct = ((d.value / total) * 100).toFixed(1);
       svg += `<rect x="${legendX}" y="${legendY - 20}" width="24" height="24" rx="4" fill="${d.color}" />`;
       const formattedLabel = d.label ? formatCapitalize(d.label.replace(/\*/g, '')) : '';
       svg += `<text x="${legendX + 40}" y="${legendY}" font-family="helvetica, sans-serif" font-size="28" fill="#334155" font-weight="bold">${formattedLabel}</text>`;
       svg += `<text x="${legendX + 40 + formattedLabel.length * 16 + 20}" y="${legendY}" font-family="helvetica, sans-serif" font-size="24" fill="#64748b">${pct}%</text>`;
       legendY += 50;
    });

    svg += `</svg>`;

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

export const getDiagramBase64ForTool = (toolId: string): Promise<string | null> => {
  return new Promise((resolve) => {
    // Generate an educational tool specific SVG diagram base64 
    let svg = "";
    if (toolId === "house_estimator_v1") {
       svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
         <rect x="100" y="50" width="200" height="120" fill="#f1f5f9" stroke="#6366f1" stroke-width="4"/>
         <polygon points="100,50 200,10 300,50" fill="#indigo" stroke="#6366f1" stroke-width="4" stroke-linejoin="round"/>
         <text x="200" y="110" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">Structure</text>
         <text x="200" y="130" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Covered Area = W × L</text>
       </svg>`;
    } else if (toolId === "concrete_calculator") {
       svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
         <rect x="40" y="40" width="120" height="120" fill="#f1f5f9" stroke="#64748b" stroke-width="3"/>
         <path d="M40 40 L60 20 L180 20 L160 40 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
         <path d="M160 40 L180 20 L180 140 L160 160 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
         <text x="100" y="100" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">Volume</text>
         <text x="100" y="115" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">L × W × D</text>
       </svg>`;
    } else if (toolId === "bricks_calculator") {
       svg = `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
         <rect x="50" y="30" width="100" height="40" fill="#fca5a5" stroke="#b91c1c" stroke-width="3"/>
         <line x1="100" y1="30" x2="100" y2="70" stroke="#b91c1c" stroke-width="3"/>
         <text x="100" y="20" font-family="sans-serif" font-size="12" fill="#7f1d1d" text-anchor="middle">Brick Size</text>
       </svg>`;
    } else {
       return resolve(null); // No specialized diagram
    }

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 200);
        ctx.drawImage(img, 0, 0);
      }
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png", 1.0));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const generateProfessionalPDF = async ({
  title,
  toolId,
  inputs,
  tableData,
  chartData,
  grandTotal,
}: {
  title: string;
  toolId?: string;
  inputs?: Record<string, any>;
  tableData: any[][];
  chartData?: { label: string; value: number; color: string }[];
  grandTotal: number;
}): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Generate QR Code containing the current URL
  let qrCodeDataURL = "";
  try {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev.web.app/';
    qrCodeDataURL = await QRCode.toDataURL(currentUrl, {
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });
  } catch (err) {
    console.error("Failed to generate QR code", err);
  }

  // 1. Header (Navy Blue Banner)
  doc.setFillColor(40, 42, 101);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(formatCapitalize(title), 14, 22);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 45, 18, { align: "right" });
  doc.text(`Estimation Pro`, pageWidth - 45, 26, { align: "right" });
  
  // Rate Tag
  doc.setFillColor(79, 70, 229); // Indigo Tag
  doc.rect(14, 27, 85, 6, "F");
  doc.setFontSize(8);
  doc.text("Costing Basis: Custom Market Rates / Selected MRS", 16, 31.5);
  doc.setFontSize(10);

  if (qrCodeDataURL) {
    doc.addImage(qrCodeDataURL, "PNG", pageWidth - 36, 5, 28, 28);
  }

  let currentY = 50;

  // 2. Project Parameters
  const cleanInputs = filterValidParameters(inputs || {});
  if (Object.keys(cleanInputs).length > 0) {
    doc.setTextColor(40, 42, 101);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Project Parameters", 14, currentY);
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, currentY + 3, pageWidth - 14, currentY + 3);
    
    currentY += 12;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    let isLeft = true;
    for (const [key, val] of Object.entries(cleanInputs)) {
      const x = isLeft ? 14 : pageWidth / 2 + 10;
      doc.setFont("helvetica", "bold");
      const label = `${formatTitleCase(key)}:`;
      doc.text(label, x, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(String(val), x + doc.getTextWidth(label) + 2, currentY);
      
      if (!isLeft) currentY += 8;
      isLeft = !isLeft;
    }
    if (!isLeft) currentY += 8;
  }

  // 3. Educational Diagram (Optional based on toolId)
  if (toolId) {
    const diagramBase64 = await getDiagramBase64ForTool(toolId);
    if (diagramBase64) {
      if (currentY > pageHeight - 80) {
        doc.addPage();
        currentY = 20;
      }
      doc.addImage(diagramBase64, "PNG", 14, currentY, 80, 40);
      currentY += 45;
    }
  }

  // 4. Visual Summary (Chart)
  if (chartData && chartData.length > 0) {
    if (currentY > pageHeight - 100) {
      doc.addPage();
      currentY = 20;
    }
    const totalText = `Rs ${Math.round(grandTotal).toLocaleString()}`;
    const chartBase64 = await createDonutChartBase64(chartData, totalText);
    
    if (chartBase64) {
      doc.addImage(chartBase64, "PNG", pageWidth / 2 - 45, currentY, 90, 90);
      currentY += 95;
    }
  } else {
    currentY += 5;
  }

  // 5. Professional Material/Item Table
  const tableBody: any[] = [];
  tableData.forEach((row) => {
    // Format the first column (Item Name) to title case and spaced
    if (row[0] && typeof row[0] === 'string') {
      row[0] = formatCapitalize(row[0].replace(/\*/g, ''));
    }
    tableBody.push(row);
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Item / Description", "Quantity & Rate", "Unit", "Amount (Rs)"]],
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: [40, 42, 101],
      textColor: [255, 255, 255],
      font: "helvetica",
      fontStyle: "bold",
    },
    alternateRowStyles: {
       fillColor: [248, 250, 252],
    },
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 5,
      valign: "middle",
      lineColor: [226, 232, 240],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [30, 41, 59] },
      3: { halign: "right", textColor: [15, 23, 42], fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || currentY + 10;

  // 6. Grand Total Row
  autoTable(doc, {
    startY: finalY,
    body: [["Grand Total Estimated", `Rs ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]],
    theme: "grid",
    styles: { font: "helvetica", fontSize: 13, cellPadding: 8 },
    columnStyles: {
      0: {
        fontStyle: "bold",
        fillColor: [240, 248, 255],
        textColor: [40, 42, 101],
        halign: "right"
      },
      1: {
        halign: "right",
        fontStyle: "bold",
        fillColor: [240, 248, 255],
        textColor: [40, 42, 101],
        cellWidth: 60,
      },
    },
    margin: { left: 14, right: 14 },
  });

  let endingY = (doc as any).lastAutoTable.finalY + 15;
  
  // 7. Formula Elaboration
  if (endingY > pageHeight - 60) {
     doc.addPage();
     endingY = 20;
  }
  
  doc.setFillColor(243, 244, 246);
  doc.rect(14, endingY, pageWidth - 28, 25, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("How it's Calculated (Standard AI Studio Engineering Logic)", 18, endingY + 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  
  let formulaText = "Amounts(Rs) = Quantity × Unit Rate. Constants: Dry Volume Multipliers used appropriately.";
  if (toolId?.includes("concrete")) {
    formulaText = "Dry Concrete Volume = Wet Volume × 1.54. Cement volume in bags uses 0.0347 m³ per 50kg bag.";
  } else if (toolId?.includes("brick")) {
    formulaText = "Dry Mortar Volume = Wet Mortar Volume × 1.33. Brick count includes 10mm mortar thickness allowance.";
  } else if (toolId?.includes("steel")) {
    formulaText = "Steel Unit Weight = d² / 162.28 (kg/m). Total cost factors in unit rates and exact piece cutting calculations.";
  } else if (toolId?.includes("earth")) {
    formulaText = "Excavation/Volume accounts for standard 1.15 to 1.2 soil bulking factor based on soil type.";
  }
  
  doc.text(formulaText, 18, endingY + 16);
  endingY += 35;

  // Footer text & Pro Tip
  if (endingY > pageHeight - 30) {
    endingY = pageHeight - 30; // Just push it up if we are really low
  }
  
  const randomTip = PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)];
  doc.setFontSize(9);
  doc.setTextColor(40, 42, 101); // Indigo color for tip
  doc.setFont("helvetica", "bold");
  doc.text(randomTip, 14, pageHeight - 25);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text(
    "* Denotes a user-defined custom rate. This is a system-generated estimate.\nActual prices may vary based on market conditions and site-specific complexities.",
    14,
    pageHeight - 15,
  );

  return doc;
};

