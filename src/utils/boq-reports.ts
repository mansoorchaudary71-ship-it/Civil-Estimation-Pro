import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { generateProfessionalPDF, formatCapitalize } from './pdfGenerator';

interface BOQItem {
  id: string;
  division: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
}

export const generateBOQPDF = async (items: BOQItem[], projectName: string, subtotal: number, contingencyAmt: number, gstAmt: number, grandTotal: number, currency: string) => {
  const tableRows: any[] = [];
  
  items.forEach((item) => {
    tableRows.push([
      item.division,
      item.description,
      `${item.quantity.toFixed(2)} (@ ${currency}${item.rate.toFixed(2)})`,
      item.unit,
      (item.quantity * item.rate).toFixed(2)
    ]);
  });

  tableRows.push(["", "", "", "Subtotal", subtotal.toFixed(2)]);
  tableRows.push(["", "", "", "Contingency", contingencyAmt.toFixed(2)]);
  tableRows.push(["", "", "", "GST/VAT", gstAmt.toFixed(2)]);
  tableRows.push(["", "", "", "Grand Total", grandTotal.toFixed(2)]);

  const doc = await generateProfessionalPDF({
    title: "Bill of Quantities (BOQ)",
    inputs: {
      "Project Name": projectName,
      "Date": new Date().toLocaleDateString()
    },
    tableData: tableRows,
    grandTotal
  });

  doc.save(`${projectName.replace(/\s+/g, '_')}_BOQ.pdf`);
};

export const generateBOQExcel = async (items: BOQItem[], projectName: string, subtotal: number, contingencyAmt: number, gstAmt: number, grandTotal: number, currency: string) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('BOQ');
  
  // Protect the sheet to lock formula cells (or just cells in general)
  await sheet.protect('password', {
    selectLockedCells: true,
    selectUnlockedCells: true,
  });

  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = `Bill of Quantities - ${projectName}`;
  sheet.getCell('A1').font = { size: 16, bold: true };
  
  sheet.getRow(3).values = ['Division', 'Description', 'Unit', 'Quantity', `Rate (${currency})`, `Amount (${currency})`];
  sheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ['A','B','C','D','E','F'].forEach(c => {
    sheet.getCell(`${c}3`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2980B9' } };
  });

  let currentRow = 4;
  items.forEach((item) => {
    const row = sheet.getRow(currentRow);
    row.values = [
      item.division,
      item.description,
      item.unit,
      item.quantity,
      item.rate,
      { formula: `D${currentRow}*E${currentRow}`, result: item.quantity * item.rate }
    ];
    
    // Unlock input columns (Quantity, Rate)
    sheet.getCell(`D${currentRow}`).protection = { locked: false };
    sheet.getCell(`E${currentRow}`).protection = { locked: false };
    sheet.getCell(`F${currentRow}`).protection = { locked: true }; // Locked formula

    currentRow++;
  });
  
  // Subtotal
  sheet.getCell(`E${currentRow}`).value = 'Subtotal';
  sheet.getCell(`F${currentRow}`).value = { formula: `SUM(F4:F${currentRow-1})`, result: subtotal };
  sheet.getCell(`F${currentRow}`).protection = { locked: true };
  currentRow++;
  
  sheet.getCell(`E${currentRow}`).value = 'Contingency';
  sheet.getCell(`F${currentRow}`).value = contingencyAmt;
  sheet.getCell(`F${currentRow}`).protection = { locked: true };
  currentRow++;
  
  sheet.getCell(`E${currentRow}`).value = 'GST/VAT';
  sheet.getCell(`F${currentRow}`).value = gstAmt;
  sheet.getCell(`F${currentRow}`).protection = { locked: true };
  currentRow++;
  
  sheet.getCell(`E${currentRow}`).value = 'Grand Total';
  sheet.getCell(`F${currentRow}`).value = { formula: `F${currentRow-3}+F${currentRow-2}+F${currentRow-1}`, result: grandTotal };
  sheet.getCell(`F${currentRow}`).font = { bold: true };
  sheet.getCell(`F${currentRow}`).protection = { locked: true };

  sheet.getColumn('A').width = 30;
  sheet.getColumn('B').width = 40;
  sheet.getColumn('C').width = 10;
  sheet.getColumn('D').width = 15;
  sheet.getColumn('E').width = 15;
  sheet.getColumn('F').width = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${projectName.replace(/\s+/g, '_')}_BOQ.xlsx`);
};
