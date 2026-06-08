import React, { useState } from "react";
import { Download, Eye, FileText, ArrowLeft, X, ChevronRight, Home } from "lucide-react";
import { createPortal } from "react-dom";

const CHAPTERS = [
  { value: "ch1", label: "Chapter 1: Scope and Administration" },
  { value: "ch2", label: "Chapter 2: Definitions" },
  { value: "ch3", label: "Chapter 3: Structural Design Requirements" },
  { value: "ch4", label: "Chapter 4: Fire and Life Safety Provisions" },
  { value: "ch5", label: "Chapter 5: Energy Efficiency and Sustainability" },
];

export default function PakistanBuildingCode() {
  const [viewPdf, setViewPdf] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("");
  const pdfUrl = "/assets/standards/bcp-2021.pdf";

  const currentChapterLabel = CHAPTERS.find(c => c.value === selectedChapter)?.label;

  return (
    <div className="w-full flex-1 bg-slate-50 relative overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
           <a href="#home" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
             <Home className="w-4 h-4" />
             Dashboard
           </a>
           <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
           <span className="hover:text-slate-900 transition-colors cursor-pointer">Standards Hub</span>
           <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
           <span className={`${selectedChapter ? "hover:text-slate-900 transition-colors cursor-pointer" : "text-slate-900 font-bold"}`} onClick={() => setSelectedChapter("")}>
             Pakistan Building Code
           </span>
           {selectedChapter && (
             <>
               <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
               <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none" title={currentChapterLabel}>
                 {currentChapterLabel}
               </span>
             </>
           )}
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
            <FileText className="w-8 h-8" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Building Code of Pakistan
          </h1>
          
          <div className="flex items-center gap-3 mb-8">
             <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-100">BCP-2021</span>
             <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-sm font-semibold border border-slate-200">PEC Standard</span>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-2xl">
            The Building Code of Pakistan (BCP-2021) provides essential guidelines for the structural design, fire safety, life safety, and construction practice within Pakistan. Developed by the Pakistan Engineering Council (PEC). 
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setViewPdf(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all"
            >
              <Eye className="w-5 h-5" />
              Read in Website
            </button>
            
            <a
              href={pdfUrl}
              download="Building_Code_of_Pakistan_BCP_2021.pdf"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all"
            >
              <Download className="w-5 h-5" />
              Download Full PDF
            </a>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center p-5 bg-slate-50 border border-slate-200 rounded-xl">
             <div className="flex-1 w-full relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  <option value="">Select a specific chapter...</option>
                  {CHAPTERS.map(ch => (
                    <option key={ch.value} value={ch.value}>{ch.label}</option>
                  ))}
                </select>
             </div>
             <button
               disabled={!selectedChapter}
               onClick={() => {
                  if (!selectedChapter) return;
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `BCP_2021_${selectedChapter}.pdf`;
                  link.click();
               }}
               className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg transition-all whitespace-nowrap ${
                 selectedChapter 
                   ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                   : "bg-slate-200 text-slate-400 cursor-not-allowed"
               }`}
             >
               <Download className="w-4 h-4" />
               Download Chapter as PDF
             </button>
          </div>
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Code Highlights</h3>
           <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                 <p><strong className="text-slate-900">Seismic Provisions:</strong> Updated maps and zoning for earthquake-resistant design across distinct seismic zones.</p>
              </li>
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                 <p><strong className="text-slate-900">Structural Stability:</strong> Comprehensive parameters for steel, concrete, and masonry safety.</p>
              </li>
              <li className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                 <p><strong className="text-slate-900">Fire Safety:</strong> Stringent life-safety provisions, egress requirements, and materials classifications.</p>
              </li>
           </ul>
        </div>
      </div>

      {viewPdf && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900">Building Code of Pakistan (BCP 2021)</h2>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={pdfUrl}
                  download="Building_Code_of_Pakistan_BCP_2021.pdf"
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-900 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button
                  onClick={() => setViewPdf(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 p-4 relative">
               <iframe
                  src={pdfUrl}
                  className="w-full h-full bg-white rounded-xl border border-slate-200 shadow-sm"
                  title="PDF Viewer"
               />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
