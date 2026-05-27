const fs = require('fs');

const file = 'src/utils/boq-reports.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /export const generateBOQExcel = async \([\s\S]*$/m;

const newGen = `import { GlobalReportEngine } from "./GlobalReportEngine";

export const generateBOQExcel = async (items: BOQItem[], projectName: string, subtotal: number, contingencyAmt: number, gstAmt: number, grandTotal: number, currency: string) => {
  const boqData = items.map(item => {
    return {
      category: item.division,
      itemDescription: item.description,
      quantity: item.quantity,
      unit: item.unit,
      rate: item.rate,
      amount: item.quantity * item.rate
    };
  });
  
  const payload = {
    toolName: "Bill of Quantities (BOQ)",
    metadata: {
      totalEstimatedCost: grandTotal,
      projectName: projectName,
      subtotal: subtotal,
      contingency: contingencyAmt,
      gst: gstAmt,
      date: new Date().toLocaleDateString()
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
  const fileName = \`\${projectName.replace(/\\s+/g, '_')}_BOQ.xlsx\`;
  
  // @ts-ignore
  if (typeof window !== 'undefined' && typeof window.saveAs !== 'undefined') {
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
};
`;

content = content.replace(regex, newGen);
fs.writeFileSync(file, content);
