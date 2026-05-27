const fs = require('fs');

const file = 'src/utils/reports.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /export const generateExcelReport = async \([\s\S]*?\};/m;

const newGen = `import { GlobalReportEngine } from "./GlobalReportEngine";

export const generateExcelReport = async (boqItems: BOQItem[], measurements: Measurement[], scalePxPerUnit: number, globalUnitName: string, details: ReportDetails, currencySymbol: string = "$") => {
  let grandTotal = 0;
  const boqData = boqItems.map(item => {
    const qty = getMappedQty(item, measurements, scalePxPerUnit, globalUnitName);
    const amount = qty * item.rate;
    grandTotal += amount;
    return {
      category: "",
      itemDescription: \`\${item.id} - \${item.desc}\`,
      quantity: qty,
      unit: item.unit,
      rate: item.rate,
      amount: amount
    };
  });
  
  const payload = {
    toolName: "Bill of Quantities (BOQ)",
    reportId: details.projectId,
    metadata: {
      totalEstimatedCost: grandTotal,
      projectName: details.projectName,
      clientName: details.clientName,
      siteLocation: details.siteLocation,
      date: details.date
    },
    chartData: {
      donut: boqData.map(d => ({ label: d.itemDescription, value: d.amount })),
      bar: [...boqData].sort((a,b) => b.amount - a.amount).slice(0, 5).map(d => ({ label: d.itemDescription, value: d.amount }))
    },
    boqData
  };
  
  const workbook = await GlobalReportEngine.generateExcel(payload);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = \`BOQ_Report_\${details.projectId}.xlsx\`;
  
  // @ts-ignore
  if (typeof window !== 'undefined' && window.saveAs) {
    // @ts-ignore
    window.saveAs(blob, fileName);
  } else {
    // Basic download fallback
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
};`;

content = content.replace(regex, newGen);
fs.writeFileSync(file, content);
