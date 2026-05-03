import React, { useState, useRef } from "react";
import { Share2, FileText, FileSpreadsheet, MessageCircle, Mail, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ShareMenuProps {
  activeTab: string;
  data: Record<string, any>;
  title: string;
}

export default function ShareMenu({ activeTab, data, title }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside could be added, but a simple toggle is okay for now.

  const formatText = () => {
    let txt = `Construction Material Estimate - ${title}\n\n`;
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

  const handleEmail = () => {
    const subject = encodeURIComponent(`Construction Material Estimate - ${title}`);
    const body = encodeURIComponent(formatText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Construction Material Estimate - ${title}`, 14, 20);
    doc.setFontSize(10);
    
    const tableData = Object.entries(data).map(([key, val]) => [key, String(val)]);
    
    autoTable(doc, {
      startY: 30,
      head: [["Item", "Quantity"]],
      body: tableData,
    });
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-estimate.pdf`);
    setIsOpen(false);
  };

  const handleCSV = () => {
    let csv = "Item,Quantity\n";
    Object.entries(data).forEach(([key, val]) => {
      // Escape quotes and wrap in quotes if there's a comma
      const safeVal = String(val).replace(/"/g, '""');
      csv += `"${key}","${safeVal}"\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '-')}-estimate.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
      >
        <Share2 className="w-4 h-4" />
        Share / Export
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="py-1 flex flex-col">
            <button onClick={handlePDF} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors w-full text-left">
              <FileText className="w-4 h-4 text-rose-500" />
              Download PDF
            </button>
            <button onClick={handleCSV} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors w-full text-left">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Export to Excel (CSV)
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
            <button onClick={handleWhatsApp} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors w-full text-left">
              <MessageCircle className="w-4 h-4 text-green-500" />
              Share on WhatsApp
            </button>
            <button onClick={handleEmail} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors w-full text-left">
              <Mail className="w-4 h-4 text-blue-500" />
              Send via Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
