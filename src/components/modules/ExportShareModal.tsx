import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useSettings } from '../../context/SettingsContext';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimates: any;
  geoState: any;
  plotAreaSqft: number;
  builtUpArea: number;
  finishQuality: number;
  greyCostData: any[];
  finishingCostData: any[];
  summaryData: any[];
}

export default function ExportShareModal({
  isOpen,
  onClose,
  estimates,
  geoState,
  plotAreaSqft,
  builtUpArea,
  finishQuality,
  greyCostData,
  finishingCostData,
  summaryData,
}: ExportShareModalProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const { formatCurrency, settings } = useSettings();

  if (!isOpen) return null;

  const getQualityLabel = (val: number) => {
    switch(val) {
      case 1: return 'Standard';
      case 2: return 'Premium';
      case 3: return 'Luxury';
      default: return 'Standard';
    }
  };

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text('Takeoff Estimate Report', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Project Details
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59); // Slate 800
      doc.text('Project Details', 14, 45);
      
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`Plot Size: ${geoState.plotSizeValue} ${geoState.plotSizeUnit.toUpperCase()} (${plotAreaSqft.toFixed(0)} sq.ft)`, 14, 55);
      doc.text(`Stories: ${geoState.stories}`, 14, 62);
      doc.text(`Total Built-up Area: ${builtUpArea.toFixed(0)} sq.ft`, 14, 69);
      doc.text(`Finish Quality: ${getQualityLabel(finishQuality)}`, 14, 76);

      // Try to capture pie chart
      let finalY = 85;
      const chartEl = document.getElementById('export-chart-target');
      if (chartEl) {
        try {
          const svgEls = chartEl.getElementsByTagName('svg');
          if (svgEls.length > 0) {
            const originalSvg = svgEls[0];
            const svg = originalSvg.cloneNode(true) as SVGSVGElement;
            const rect = originalSvg.getBoundingClientRect();
            
            svg.setAttribute('width', rect.width.toString());
            svg.setAttribute('height', rect.height.toString());
            
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(svg);
            if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
              svgString = svgString.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
            }
            
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const URL = window.URL || window.webkitURL || window;
            const blobURL = globalThis.URL.createObjectURL(svgBlob);
            
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = blobURL;
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = rect.width * 2;
            canvas.height = rect.height * 2;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              const imgData = canvas.toDataURL('image/png');
              const imgWidth = 90;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              doc.addImage(imgData, 'PNG', pageWidth - imgWidth - 14, 35, imgWidth, imgHeight);
              finalY = Math.max(85, 35 + imgHeight + 10);
            }
            globalThis.URL.revokeObjectURL(blobURL);
          }
        } catch (err) {
          console.warn("Could not capture chart image", err);
        }
      }

      // Summary Table
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Summary', 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Category', 'Cost']],
        body: [
          ['Grey Structure', formatCurrency(estimates.totalGrey)],
          ['Finishing Works', formatCurrency(estimates.totalFinishing)],
          ['Total Estimated Cost', formatCurrency(estimates.totalCost)]
        ],
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] }
      });
      
      finalY = (doc as any).lastAutoTable.finalY + 15;

      // Grey Structure Breakdown
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Grey Structure BOQ', 14, finalY);
      
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Item', `Amount (${settings.currency})`]],
        body: greyCostData.map(item => [item.name, formatCurrency(item.value)]),
        theme: 'striped',
        headStyles: { fillColor: [100, 116, 139] }
      });
      
      finalY = (doc as any).lastAutoTable.finalY + 15;

      // Check if we need a new page for finishing
      if (finalY > 220) {
        doc.addPage();
        finalY = 20;
      }

      // Finishing Breakdown
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Finishing Works BOQ', 14, finalY);
      
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Item', `Amount (${settings.currency})`]],
        body: finishingCostData.map(item => [item.name, formatCurrency(item.value)]),
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] }
      });

      doc.save('House_Estimate_Report.pdf');
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setIsExcelLoading(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Takeoff App';
      const sheet = workbook.addWorksheet('House Estimate');

      // Add Headers
      sheet.columns = [
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Item', key: 'item', width: 25 },
        { header: `Total Cost (${settings.currency})`, key: 'cost', width: 20 }
      ];

      // Format Headers
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };

      // Add Project Info
      sheet.addRow(['Project Info', 'Plot Size', `${geoState.plotSizeValue} ${geoState.plotSizeUnit.toUpperCase()}`]);
      sheet.addRow(['Project Info', 'Stories', geoState.stories]);
      sheet.addRow(['Project Info', 'Total Built-up (sq.ft)', builtUpArea.toFixed(0)]);
      sheet.addRow(['Project Info', 'Finish Quality', getQualityLabel(finishQuality)]);
      sheet.addRow([]);

      const startGreyRow = sheet.rowCount + 2; // header
      
      // Grey Structure
      sheet.addRow(['Grey Structure', '', '']);
      const greyHeader = sheet.getRow(sheet.rowCount);
      greyHeader.font = { bold: true };
      
      greyCostData.forEach(item => {
        sheet.addRow(['', item.name, item.value]);
      });
      
      const endGreyRow = sheet.rowCount;
      sheet.addRow(['', 'Subtotal Grey Structure', { formula: `SUM(C${startGreyRow + 1}:C${endGreyRow})` }]);
      sheet.getRow(sheet.rowCount).font = { bold: true };
      sheet.addRow([]);

      const startFinishRow = sheet.rowCount + 1;
      // Finishing Works
      sheet.addRow(['Finishing Works', '', '']);
      const finishHeader = sheet.getRow(sheet.rowCount);
      finishHeader.font = { bold: true };
      
      finishingCostData.forEach(item => {
         sheet.addRow(['', item.name, item.value]);
      });

      const endFinishRow = sheet.rowCount;
      sheet.addRow(['', 'Subtotal Finishing', { formula: `SUM(C${startFinishRow + 1}:C${endFinishRow})` }]);
      sheet.getRow(sheet.rowCount).font = { bold: true };
      sheet.addRow([]);

      // Grand Total
      sheet.addRow(['', 'Grand Total', { formula: `C${endGreyRow + 1} + C${endFinishRow + 1}` }]);
      const grandTotalRow = sheet.getRow(sheet.rowCount);
      grandTotalRow.font = { bold: true, size: 14 };
      grandTotalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

      // Currency Formatting for Cost Column
      sheet.getColumn('cost').numFmt = '#,##0';

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'House_Estimate_Report.xlsx');
    } catch (error) {
      console.error('Failed to generate Excel', error);
    } finally {
      setIsExcelLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] w-full max-w-md shadow-[0_20px_60px_rgb(0,0,0,0.1)] relative overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Export Report</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-slate-500 text-sm font-medium">
            Download your detailed Bill of Quantities (BOQ) and summary as a professional document.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            
            {/* PDF Button */}
            <button 
              onClick={handleDownloadPDF}
              disabled={isPdfLoading}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 text-red-600 hover:border-red-200 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <div className="bg-red-100 p-3 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                {isPdfLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-slate-800 text-lg">Download PDF</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Summary Chart & BOQ</p>
              </div>
              <Download className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Excel Button */}
            <button 
              onClick={handleDownloadExcel}
              disabled={isExcelLoading}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <div className="bg-emerald-100 p-3 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                {isExcelLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileSpreadsheet className="w-6 h-6" />}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-slate-800 text-lg">Download Excel</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Editable .xlsx File</p>
              </div>
              <Download className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>

          </div>
        </div>
        
      </div>
    </div>
  );
}
