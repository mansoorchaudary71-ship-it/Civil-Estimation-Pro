import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dir = 'src';
const targetString = /text-\[\#FFFFFF\]/g;
const replacementString = 'text-slate-900';

walkDir(dir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    if (filePath.includes('HeroSection.tsx')) return;
    if (filePath.includes('TopNavbar.tsx')) return; // handled this manually
    
    let contents = fs.readFileSync(filePath, 'utf8');
    if (contents.includes('text-[#FFFFFF]')) {
      const updated = contents.replace(targetString, replacementString);
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
