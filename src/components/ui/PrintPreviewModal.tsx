import React, { useEffect, useState } from "react";
import { X, Printer, Download } from "lucide-react";
import { generateProfessionalPDF } from "../../utils/pdfGenerator";
import { createPortal } from "react-dom";

export default function PrintPreviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      try {
        const getter = (window as any).__GLOBAL_PDF_GETTER;
        if (getter) {
          const payload = getter();
          if (payload) {
            generateProfessionalPDF(payload)
              .then((doc) => {
                setPdfUrl(doc.output("bloburl").toString());
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
                window.print();
                onClose();
              });
            return;
          }
        }
      } catch(e) {}
      
      // Fallback
      setLoading(false);
      window.print();
      onClose();
    } else {
      setPdfUrl("");
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative border border-[#E8E4D9]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4D9] bg-[#FAF8F5]">
          <h2 className="text-xl font-bold text-[#4A443B]">Print Preview</h2>
          <div className="flex items-center gap-3">
             <button
                onClick={() => {
                   if (pdfUrl) {
                      const d = document.createElement("a");
                      d.href = pdfUrl;
                      d.download = "Report.pdf";
                      d.click();
                   }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E4D9] text-[#4A443B] hover:bg-[#F2EFE9] font-semibold rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              
            <button
              onClick={onClose}
              className="p-2 text-[#A39D93] hover:text-[#4A443B] hover:bg-[#E8E4D9]/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#F2EFE9] overflow-hidden relative">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-[#D7BA89] border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : pdfUrl ? (
            <iframe
              id="print-iframe"
              src={pdfUrl}
              className="w-full h-full border-none"
              title="Print Preview PDF"
            />
          ) : (
            <div className="p-8 text-center text-[#8B8476]">Preview not available for this tool.</div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E4D9] flex justify-end">
           <button
             onClick={() => {
                const iframe = document.getElementById("print-iframe") as HTMLIFrameElement;
                if (iframe && iframe.contentWindow) {
                   iframe.contentWindow.print();
                } else {
                   window.print();
                }
             }}
             className="flex items-center gap-2 px-6 py-2.5 bg-[#4A443B] hover:bg-[#322E27] text-[#FAF8F5] font-bold rounded-xl transition-colors"
           >
             <Printer className="w-5 h-5" />
             Confirm Print
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
}