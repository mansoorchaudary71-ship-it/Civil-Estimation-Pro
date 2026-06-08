const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createDoc() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 24;
  
  page.drawText('Building Code of Pakistan (2021)', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  page.drawText('Note: Full text is omitted here. Please refer to PEC.', {
    x: 50,
    y: height - 6 * fontSize,
    size: 14,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  
  fs.mkdirSync(path.join(process.cwd(), 'public', 'assets', 'standards'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'standards', 'bcp-2021.pdf'), pdfBytes);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'standards', 'BCP_2021_ch1.pdf'), pdfBytes);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'standards', 'BCP_2021_ch2.pdf'), pdfBytes);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'standards', 'BCP_2021_ch3.pdf'), pdfBytes);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'standards', 'BCP_2021_ch4.pdf'), pdfBytes);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'standards', 'BCP_2021_ch5.pdf'), pdfBytes);
  console.log('PDFs created!');
}

createDoc().catch(console.error);
