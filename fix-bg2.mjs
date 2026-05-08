import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const original = content;
      content = content.replace(/bg-\[#f8fafc\]/g, 'bg-slate-50');
      content = content.replace(/bg-\[#f0f2f5\]/g, 'bg-slate-100');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir('src/components');
console.log('Fixed more hex backgrounds.');
