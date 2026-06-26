const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 6. Buttons: text-base font-semibold
  content = content.replace(/<button\b[^>]*className=["']([^"']*)["'][^>]*>/g, (match, classes) => {
    let newClasses = classes
      .replace(/text-(xs|sm|base|lg|xl|2xl)/g, '')
      .replace(/font-(light|normal|medium|semibold|bold|extrabold)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    newClasses += ' text-base font-semibold';
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return match.replace(classes, newClasses);
  });

  // 7. Paragraphs: text-base font-normal text-gray-600 leading-relaxed
  content = content.replace(/<p\b[^>]*className=["']([^"']*)["'][^>]*>/g, (match, classes) => {
    let newClasses = classes
      .replace(/text-(xs|sm|base|lg|xl|2xl)/g, '')
      .replace(/font-(light|normal|medium|semibold|bold|extrabold)/g, '')
      .replace(/text-(slate|gray|zinc|neutral)-[0-9]{3}/g, '')
      .replace(/leading-(none|tight|snug|normal|relaxed|loose)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    newClasses += ' text-base font-normal text-gray-600 leading-relaxed';
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return match.replace(classes, newClasses);
  });

  // 8. Secondary/Helper text replacements
  // Heuristics: if it had text-xs or text-sm and text-slate-500 -> text-sm text-gray-500
  // Instead of complex regex for all elements, we can do a global replace for common slate colors to gray
  content = content.replace(/text-slate-900/g, 'text-gray-900');
  content = content.replace(/text-slate-800/g, 'text-gray-800');
  content = content.replace(/text-slate-700/g, 'text-gray-700');
  content = content.replace(/text-slate-600/g, 'text-gray-600');
  content = content.replace(/text-slate-500/g, 'text-gray-500');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

walkDir('./src', processFile);
console.log('Refactoring 2 completed.');
