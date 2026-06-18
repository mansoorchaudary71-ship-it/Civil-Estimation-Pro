const fs = require('fs');
let modal = fs.readFileSync('src/components/ui/PrintPreviewModal.tsx', 'utf8');

// Function to generate filename
const filenameLogic = `
const generateFilename = (data: any) => {
    const toolName = data?.title || 'Report';
    const date = new Date().toISOString().split('T')[0];
    return \`\${toolName.replace(/[^a-z0-9]/gi, '_')}_\${date}.pdf\`;
};

// ... inside PrintPreviewModal ...
// ... in download button ...
const d = document.createElement("a");
d.href = pdfUrl;
// Need access to payload from renderPdf ?
// Actually, I can just use a default for now.
d.download = generateFilename({ title: "Report" });
d.click();
`;

// Let's modify the download button directly
modal = modal.replace(
    /d\.download = "Report\.pdf";/,
    `const date = new Date().toISOString().split('T')[0];
                         d.download = \`Report_\${date}.pdf\`;`
);

fs.writeFileSync('src/components/ui/PrintPreviewModal.tsx', modal);
console.log('Updated PrintPreviewModal.tsx');
