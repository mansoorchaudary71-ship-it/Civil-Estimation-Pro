const fs = require('fs');

const file = 'src/utils/pdfGenerator.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /export const generateProfessionalPDF = async \([\s\S]*?\): Promise<jsPDF> => \{[\s\S]*\n\};\n?/m;

const newGen = `import { GlobalReportEngine } from "./GlobalReportEngine";\n\nexport const generateProfessionalPDF = async ({
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
  const cleanInputs = filterValidParameters(inputs || {});
  const boqData = tableData.map(row => {
     let costStr = String(row[row.length - 1]).replace(/[^0-9.-]+/g, "");
     let cost = parseFloat(costStr) || 0;
     let qStr = String(row[1]).split('\\n')[0];
     let qty = parseFloat(qStr.replace(/[^0-9.-]+/g, "")) || 0;
     return {
       category: "",
       itemDescription: String(row[0]),
       quantity: qty,
       unit: String(row[2]),
       rate: qty > 0 ? (cost / qty) : 0,
       amount: cost
     };
  });
  
  const barData = [...(chartData || [])].sort((a, b) => b.value - a.value).slice(0, 5);
  
  const payload = {
    toolName: title,
    metadata: {
      totalEstimatedCost: grandTotal,
      structureType: cleanInputs["Structure Type"] || title,
      ...cleanInputs
    },
    chartData: {
      donut: chartData || [],
      bar: barData
    },
    boqData
  };
  
  return await GlobalReportEngine.generatePDF(payload);
};
`;

content = content.replace(regex, newGen);
fs.writeFileSync(file, content);
