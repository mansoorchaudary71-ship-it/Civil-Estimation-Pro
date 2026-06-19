const fs = require('fs');

// 1. Update PrintPreviewModal.tsx
let modal = fs.readFileSync('src/components/ui/PrintPreviewModal.tsx', 'utf8');

if (!modal.includes('const [customHeader, setCustomHeader]')) {
    // Add state for customHeader
    modal = modal.replace(
        /const \[theme, setTheme\] = useState<"Professional" \| "Minimalist" \| "Condensed">\("Professional"\);/,
        `const [theme, setTheme] = useState<"Professional" | "Minimalist" | "Condensed">("Professional");
  const [customHeader, setCustomHeader] = useState("");`
    );

    // Update renderPdf signature and usage
    modal = modal.replace(
        /const renderPdf = async \(brandState: boolean, currentSize: "a4" \| "legal" \| "letter", currentTheme: "Professional" \| "Minimalist" \| "Condensed", currentWatermark: "DRAFT" \| "CONFIDENTIAL" \| "NONE"\) => \{/,
        'const renderPdf = async (brandState: boolean, currentSize: "a4" | "legal" | "letter", currentTheme: "Professional" | "Minimalist" | "Condensed", currentWatermark: "DRAFT" | "CONFIDENTIAL" | "NONE", currentHeader: string) => {'
    );

    // Update branding data injection to include header
    modal = modal.replace(
        /payload\.branding = brandingData;/,
        'payload.branding = brandingData;\n            payload.customHeader = currentHeader;'
    );

    // Update call to renderPdf
    modal = modal.replace(
        /renderPdf\(useBranding, paperSize, theme, watermark\);/,
        'renderPdf(useBranding, paperSize, theme, watermark, customHeader);'
    );

    // Add UI Input
    modal = modal.replace(
        /<label className="text-sm font-semibold text-[#8B8476]">Company \/ Name Details<\/label>/,
        `<label className="text-sm font-semibold text-[#8B8476]">Project Header</label>
                <input 
                  type="text" 
                  value={customHeader}
                  onChange={(e) => setCustomHeader(e.target.value)}
                  placeholder="e.g. Project: Skyscraper Alpha"
                  className="flex-1 border border-[#E8E4D9] text-[#4A443B] px-3 py-1.5 rounded-lg text-sm bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D7BA89]/50"
                />
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-[250px]">
                <label className="text-sm font-semibold text-[#8B8476]">Company / Name Details</label>`
    );

    fs.writeFileSync('src/components/ui/PrintPreviewModal.tsx', modal);
    console.log('Updated PrintPreviewModal.tsx');
}

// 2. Update GlobalReportEngine.tsx
let eng = fs.readFileSync('src/utils/GlobalReportEngine.tsx', 'utf8');

if (!eng.includes('customHeader?: string;')) {
    // interface ReportData
    eng = eng.replace(
        /watermark\?: "DRAFT" \| "CONFIDENTIAL" \| "NONE";/,
        'watermark?: "DRAFT" | "CONFIDENTIAL" | "NONE";\n  customHeader?: string;'
    );

    // Handling title inside generatePDF
    const headerLogic = `
    if (safeData.customHeader) {
       doc.setFont("helvetica", "bold");
       doc.setFontSize(14);
       doc.setTextColor(255, 255, 255); // White for dark backgrounds
       doc.text(safeData.customHeader, pageWidth / 2, 40, { align: "center" });
    }
    `;
    
    // Add logic after branding draw
    eng = eng.replace(
        /if \(qrCodeDataURL\) \{/,
        headerLogic + '\n    if (qrCodeDataURL) {'
    );
    
    fs.writeFileSync('src/utils/GlobalReportEngine.tsx', eng);
    console.log('Updated GlobalReportEngine.tsx');
}
