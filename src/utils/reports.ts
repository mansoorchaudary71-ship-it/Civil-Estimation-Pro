import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { BOQItem } from '../context/TakeoffContext';
import { Measurement, calculateLength, calculateArea, convertLength, convertArea } from './measurements';

interface ReportDetails {
  projectName: string;
  projectId: string;
  clientName: string;
  siteLocation: string;
  date: string;
}

const cleanUnit = (u: string) => u.replace(/[²³]/g, '').replace(/sq\.?/g, '').trim().toLowerCase();

export const getMappedQty = (item: BOQItem, measurements: Measurement[], scalePxPerUnit: number, globalUnitName: string) => {
  if (item.isManualOverride) return item.qtyOverride || 0;
  
  if (item.linkedMeasurementIds && item.linkedMeasurementIds.length > 0) {
    let totalVal = 0;
    const fromBase = cleanUnit(globalUnitName);
    const toBase = cleanUnit(item.unit);
    
    item.linkedMeasurementIds.forEach(mId => {
      const m = measurements.find(m => m.id === mId);
      if (m) {
        let val = 0;
        if (m.type === 'line') {
          val = calculateLength(m.points, scalePxPerUnit);
          val = convertLength(val, fromBase, toBase);
        } else if (m.type === 'area') {
          val = calculateArea(m.points, scalePxPerUnit);
          val = convertArea(val, fromBase, toBase);
        }
        totalVal += val;
      }
    });
    return totalVal;
  }
  return item.qtyOverride || 0;
};

import { generateProfessionalPDF, formatCapitalize } from './pdfGenerator';

export const generatePDFReport = async (boqItems: BOQItem[], measurements: Measurement[], scalePxPerUnit: number, globalUnitName: string, details: ReportDetails, currencySymbol: string = "$") => {
  const tableRows: any[] = [];
  let grandTotal = 0;
  const chartData: { label: string; value: number; color: string }[] = [];

  const colors = ["#8b5cf6", "#ec4899", "#0ea5e9", "#10b981", "#f59e0b", "#64748b", "#3b82f6"];

  boqItems.forEach((item, index) => {
    const qty = getMappedQty(item, measurements, scalePxPerUnit, globalUnitName);
    const amount = qty * item.rate;
    grandTotal += amount;
    
    tableRows.push([
      `${item.id} - ${item.desc}`,
      `${qty.toFixed(2)} (@ ${currencySymbol}${item.rate.toFixed(2)})`,
      item.unit,
      amount.toFixed(2)           
    ]);

    if (amount > 0) {
       chartData.push({
          label: formatCapitalize(item.desc),
          value: amount,
          color: colors[index % colors.length]
       });
    }
  });

  const doc = await generateProfessionalPDF({
    title: "Bill of Quantities (BOQ)",
    inputs: {
      "Project Name": details.projectName,
      "Project ID": details.projectId,
      "Client Name": details.clientName,
      "Site Location": details.siteLocation,
      "Date": details.date
    },
    tableData: tableRows,
    chartData: chartData.length > 0 ? chartData : undefined,
    grandTotal
  });

  doc.save(`BOQ_Report_${details.projectId}.pdf`);
};

export const generateExcelReport = async (boqItems: BOQItem[], measurements: Measurement[], scalePxPerUnit: number, globalUnitName: string, details: ReportDetails, currencySymbol: string = "$") => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Estimator AI';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('BOQ Report');

  // Report Header
  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = 'Bill of Quantities (BOQ) Report';
  sheet.getCell('A1').font = { size: 16, bold: true };
  sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

  sheet.getCell('A3').value = 'Project Name:';
  sheet.getCell('B3').value = details.projectName;
  sheet.getCell('D3').value = 'Client:';
  sheet.getCell('E3').value = details.clientName;

  sheet.getCell('A4').value = 'Project ID:';
  sheet.getCell('B4').value = details.projectId;
  sheet.getCell('D4').value = 'Location:';
  sheet.getCell('E4').value = details.siteLocation;

  sheet.getCell('D5').value = 'Date:';
  sheet.getCell('E5').value = details.date;

  // Table Headers
  sheet.getRow(7).values = ['Item ID', 'Description', 'Unit', 'Quantity', `Rate (${currencySymbol})`, `Amount (${currencySymbol})`];
  sheet.getRow(7).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  
  // Header background color
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
    sheet.getCell(`${col}7`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2980B9' }
    };
  });

  // Data
  let grandTotal = 0;
  let currentRow = 8;

  boqItems.forEach(item => {
    const qty = getMappedQty(item, measurements, scalePxPerUnit, globalUnitName);
    const amount = qty * item.rate;
    grandTotal += amount;
    
    sheet.getRow(currentRow).values = [
      item.id,
      item.desc,
      item.unit,
      parseFloat(qty.toFixed(2)),
      parseFloat(item.rate.toFixed(2)),
      parseFloat(amount.toFixed(2))
    ];
    currentRow++;
  });

  // Formatting for numbers
  const numColD = sheet.getColumn('D');
  numColD.numFmt = '#,##0.00';
  const numColE = sheet.getColumn('E');
  numColE.numFmt = '#,##0.00';
  const numColF = sheet.getColumn('F');
  numColF.numFmt = '#,##0.00';

  // Grand Total row
  currentRow++;
  sheet.getCell(`E${currentRow}`).value = 'Grand Total';
  sheet.getCell(`E${currentRow}`).font = { bold: true };
  sheet.getCell(`F${currentRow}`).value = grandTotal;
  sheet.getCell(`F${currentRow}`).font = { bold: true };
  sheet.getCell(`F${currentRow}`).numFmt = '#,##0.00';

  // Set widths
  sheet.getColumn('A').width = 10;
  sheet.getColumn('B').width = 40;
  sheet.getColumn('C').width = 10;
  sheet.getColumn('D').width = 15;
  sheet.getColumn('E').width = 15;
  sheet.getColumn('F').width = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `BOQ_Report_${details.projectId}.xlsx`);
};
