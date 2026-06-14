import React, { useEffect, useState } from "react";
import { X, Printer, Download, User as UserIcon } from "lucide-react";
import { generateProfessionalPDF } from "../../utils/pdfGenerator";
import { createPortal } from "react-dom";
import { useAuth } from "../../contexts/AuthContext";

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string | undefined> => {
  if (!imageUrl) return undefined;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(undefined);
      }
    };
    img.onerror = () => resolve(undefined);
    img.src = imageUrl;
  });
};

export default function PrintPreviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [useBranding, setUseBranding] = useState(false);
  const [paperSize, setPaperSize] = useState<"a4" | "legal">("a4");
  const { user } = useAuth();
  
  const renderPdf = async (brandState: boolean, currentSize: "a4" | "legal") => {
      setLoading(true);
      try {
        const getter = (window as any).__GLOBAL_PDF_GETTER;
        if (getter) {
          const payload = getter();
          if (payload) {
            let brandingData = undefined;
            if (brandState && user) {
               const logoBase64 = user.photoURL ? await getBase64ImageFromUrl(user.photoURL) : undefined;
               brandingData = {
                  name: user.displayName || undefined,
                  email: user.email || undefined,
                  logoBase64
               };
            }
            
            // Assuming `payload` is the arg object for generateProfessionalPDF. 
            // We can mutate it to add branding
            payload.branding = brandingData;
            payload.paperSize = currentSize;

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
  };

  useEffect(() => {
    if (isOpen) {
      renderPdf(useBranding, paperSize);
    } else {
      setPdfUrl("");
    }
  }, [isOpen]);

  useEffect(() => {
     if (isOpen) renderPdf(useBranding, paperSize);
  }, [useBranding, paperSize]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative border border-[#E8E4D9]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4D9] bg-[#FAF8F5]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#4A443B]">Print Preview</h2>
            {user && (
              <label className="flex items-center gap-2 cursor-pointer ml-4">
                <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${useBranding ? 'bg-[#D7BA89]' : 'bg-[#E8E4D9]'}`}>
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${useBranding ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={useBranding} 
                  onChange={(e) => setUseBranding(e.target.checked)} 
                />
                <span className="text-sm font-semibold text-[#8B8476] flex items-center gap-1.5"><UserIcon className="w-4 h-4"/> Professional Branding</span>
              </label>
            )}
          </div>
          <div className="flex items-center gap-3">
             <select
               value={paperSize}
               onChange={(e) => setPaperSize(e.target.value as "a4" | "legal")}
               className="bg-white border border-[#E8E4D9] text-[#4A443B] text-sm font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
             >
               <option value="a4">A4 Size</option>
               <option value="legal">Legal Size</option>
             </select>
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