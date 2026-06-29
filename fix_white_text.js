const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content.replace(/text-white dark:text-white dark:text-white/g, 'text-slate-900 dark:text-white');
    newContent = newContent.replace(/text-white dark:text-white/g, 'text-slate-900 dark:text-white');
    // Also fix cases where bg-slate-50 or bg-white is used with text-white without dark:text-white
    // But this might be too aggressive if they have a condition, we just fix SoilReportHeader.tsx for sure
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log('Fixed:', filePath);
    }
  }
});
