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

  // 1. Remove arbitrary font sizes like text-[15px], text-[11px]
  content = content.replace(/text-\[\d+px\]/g, (match) => {
    const size = parseInt(match.match(/\d+/)[0], 10);
    if (size <= 11) return 'text-xs';
    if (size === 12) return 'text-xs';
    if (size === 13) return 'text-sm';
    if (size === 14) return 'text-sm';
    if (size === 15) return 'text-base';
    if (size === 16) return 'text-base';
    if (size === 17 || size === 18) return 'text-lg';
    if (size === 19 || size === 20) return 'text-xl';
    if (size > 20 && size <= 24) return 'text-2xl';
    if (size > 24 && size <= 30) return 'text-3xl';
    return match;
  });

  // 2. Form Labels: "text-sm font-medium text-gray-700 mb-1"
  // Assuming labels have 'block', 'text-sm', 'font-medium', 'text-slate-X'
  // Or targeting <label> directly.
  content = content.replace(/<label\b[^>]*className=["']([^"']*)["'][^>]*>/g, (match, classes) => {
    let newClasses = classes
      .replace(/text-(xs|sm|base|lg)/g, '')
      .replace(/font-(light|normal|medium|semibold|bold)/g, '')
      .replace(/text-(slate|gray|zinc|neutral)-[0-9]{3}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    newClasses += ' text-sm font-medium text-gray-700 mb-1 block'; // 'block' is usually needed for labels
    
    // De-duplicate classes
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    
    return match.replace(classes, newClasses);
  });

  // 3. Form Inputs: "text-base" and normal weight
  // Inputs usually have 'border', 'rounded', 'px-X', 'py-X'
  content = content.replace(/<(input|select|textarea)\b[^>]*className=["']([^"']*)["'][^>]*>/g, (match, tag, classes) => {
    let newClasses = classes
      .replace(/text-(xs|sm|base|lg)/g, '')
      .replace(/font-(light|normal|medium|semibold|bold)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    newClasses += ' text-base font-normal';
    
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return match.replace(classes, newClasses);
  });

  // 4. Section Headers: text-xl font-semibold text-gray-900 tracking-tight
  // H2, H3, etc. that look like section headers.
  content = content.replace(/<(h1|h2)\b[^>]*className=["']([^"']*)["'][^>]*>/g, (match, tag, classes) => {
    let newClasses = classes
      .replace(/text-(sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)/g, '')
      .replace(/font-(light|normal|medium|semibold|bold|extrabold|black)/g, '')
      .replace(/text-(slate|gray|zinc|neutral)-[0-9]{3}/g, '')
      .replace(/tracking-(tighter|tight|normal|wide|wider|widest)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (tag === 'h1') {
      newClasses += ' text-2xl font-semibold text-gray-900 tracking-tight mb-6';
    } else {
      newClasses += ' text-xl font-semibold text-gray-900 tracking-tight mb-4';
    }
    
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return match.replace(classes, newClasses);
  });

  // 5. Sub-headers: text-lg font-medium text-gray-800
  content = content.replace(/<(h3|h4)\b[^>]*className=["']([^"']*)["'][^>]*>/g, (match, tag, classes) => {
    let newClasses = classes
      .replace(/text-(sm|base|lg|xl|2xl|3xl)/g, '')
      .replace(/font-(light|normal|medium|semibold|bold|extrabold|black)/g, '')
      .replace(/text-(slate|gray|zinc|neutral)-[0-9]{3}/g, '')
      .replace(/tracking-(tighter|tight|normal|wide|wider|widest)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    newClasses += ' text-lg font-medium text-gray-800 mb-4';
    
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return match.replace(classes, newClasses);
  });

  // Replace text-slate with text-gray to be consistent with prompt?
  // User asked for text-gray-900 / text-gray-800 / text-gray-600.
  // We can just globally replace text-slate-* with text-gray-* in className strings if we want,
  // but it's safer to only do it where targeted.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

walkDir('./src', processFile);
console.log('Refactoring completed.');
