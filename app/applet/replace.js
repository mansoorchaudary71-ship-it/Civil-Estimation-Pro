import fs from 'fs';
import path from 'path';

const dir = 'src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match anything containing saveMessage inside {}
  content = content.replace(/\{saveMessage\s*&&\s*\([^}]+\)\s*\}/g, '');
  content = content.replace(/\{saveMessage\s*&&\s*<[^>]+>[^<]+<\/[^>]+>\s*\}/g, '');

  content = content.replace(/\{saveMessage\s*&&\s*\(\s*<span[\s\S]*?<\/span>\s*\)\s*\}/g, '');

  content = content.replace(/\{saveMessage\s*&&\s*\(\s*<div[\s\S]*?<\/div>\s*\)\s*\}/g, '');

  fs.writeFileSync(filePath, content);
}

console.log("Cleanup script completed.");
