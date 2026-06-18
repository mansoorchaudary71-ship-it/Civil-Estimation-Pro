const fs = require('fs');

// 1. Update PrintPreviewModal.tsx
let modal = fs.readFileSync('src/components/ui/PrintPreviewModal.tsx', 'utf8');
modal = modal.replace(/useState<"a4" \| "legal">\("a4"\)/g, 'useState<"a4" | "legal" | "letter">("a4")');
modal = modal.replace(/currentSize: "a4" \| "legal"/g, 'currentSize: "a4" | "legal" | "letter"');
modal = modal.replace(/onChange=\{\(e\) => setPaperSize\(e\.target\.value as "a4" \| "legal"\)\}/g, 'onChange={(e) => setPaperSize(e.target.value as "a4" | "legal" | "letter")}');
modal = modal.replace(/<option value="legal">Legal Size<\/option>/g, '<option value="legal">Legal Size</option>\n                 <option value="letter">Letter Size</option>');
fs.writeFileSync('src/components/ui/PrintPreviewModal.tsx', modal);
console.log('Updated PrintPreviewModal.tsx');

// 2. Update pdfGenerator.ts
let pdfGen = fs.readFileSync('src/utils/pdfGenerator.ts', 'utf8');
pdfGen = pdfGen.replace(/paperSize\?: "a4" \| "legal";/g, 'paperSize?: "a4" | "legal" | "letter";');
fs.writeFileSync('src/utils/pdfGenerator.ts', pdfGen);
console.log('Updated pdfGenerator.ts');

// 3. Update GlobalReportEngine.tsx interface
let eng = fs.readFileSync('src/utils/GlobalReportEngine.tsx', 'utf8');
eng = eng.replace(/paperSize\?: "a4" \| "legal";/g, 'paperSize?: "a4" | "legal" | "letter";');
fs.writeFileSync('src/utils/GlobalReportEngine.tsx', eng);
console.log('Updated GlobalReportEngine.tsx');
