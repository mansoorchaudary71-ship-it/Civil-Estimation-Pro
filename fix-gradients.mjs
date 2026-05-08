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
      content = content.replace(/from-\[#1e293b\]/g, 'from-slate-800');
      content = content.replace(/to-\[#0f172a\]/g, 'to-slate-900');
      content = content.replace(/from-\[#111827\]/g, 'from-slate-900');
      content = content.replace(/to-\[#1f2937\]/g, 'to-slate-800');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir('src/components');
console.log('Fixed gradient backgrounds.');
