const fs = require('fs');

// 1. Update PrintPreviewModal.tsx
let modal = fs.readFileSync('src/components/ui/PrintPreviewModal.tsx', 'utf8');

if (!modal.includes('const [showLogo, setShowLogo]')) {
    // Add state if not present (although I can just replace the whole hooks block)
    modal = modal.replace(
        /const \[customHeader, setCustomHeader\] = useState\(""\);/,
        `const [customHeader, setCustomHeader] = useState("");
  const [showLogo, setShowLogo] = useState(true);`
    );

    // Update renderPdf signature
    modal = modal.replace(
        /const renderPdf = async \(brandState: boolean, currentSize: "a4" \| "legal" \| "letter", currentTheme: "Professional" \| "Minimalist" \| "Condensed", currentWatermark: "DRAFT" \| "CONFIDENTIAL" \| "NONE", currentHeader: string\) => \{/,
        'const renderPdf = async (brandState: boolean, currentSize: "a4" | "legal" | "letter", currentTheme: "Professional" | "Minimalist" | "Condensed", currentWatermark: "DRAFT" | "CONFIDENTIAL" | "NONE", currentHeader: string, currentShowLogo: boolean) => {'
    );

    // Update branding data injection to include showLogo
    modal = modal.replace(
        /payload\.customHeader = currentHeader;/,
        'payload.customHeader = currentHeader;\n            payload.showLogo = currentShowLogo;'
    );

    // Update call to renderPdf
    modal = modal.replace(
        /renderPdf\(useBranding, paperSize, theme, watermark, customHeader\);/,
        'renderPdf(useBranding, paperSize, theme, watermark, customHeader, showLogo);'
    );

    // Add UI Checkbox
    // We need to inject the checkbox before the text input of customHeader
    modal = modal.replace(
        /<input \n                  type="text" \n                  value=\{customHeader\}/,
        `<label className="flex items-center gap-2 mb-1">
                  <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} className="rounded border-[#E8E4D9]" />
                  <span className="text-xs text-[#8B8476]">Show Logo</span>
                </label>
                <input 
                  type="text" 
                  value={customHeader}`
    );

    fs.writeFileSync('src/components/ui/PrintPreviewModal.tsx', modal);
    console.log('Updated PrintPreviewModal.tsx');
}

// 2. Update GlobalReportEngine.tsx
let eng = fs.readFileSync('src/utils/GlobalReportEngine.tsx', 'utf8');

if (!eng.includes('showLogo?: boolean;')) {
    // interface ReportData
    eng = eng.replace(
        /customHeader\?: string;/,
        'customHeader?: string;\n  showLogo?: boolean;'
    );

    // Handling logo logic
    // The logo is drawn inside the `if (safeData.branding) {` block
    eng = eng.replace(
        /if \(safeData.branding.logoBase64\) \{/,
        'if (safeData.branding.logoBase64 && (safeData.showLogo !== false)) {'
    );
    
    fs.writeFileSync('src/utils/GlobalReportEngine.tsx', eng);
    console.log('Updated GlobalReportEngine.tsx');
}
