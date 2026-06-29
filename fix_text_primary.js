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
    let newContent = content.replace(/text-text-primary/g, 'text-slate-900 dark:text-white');
    
    // clean up duplicate classes
    newContent = newContent.replace(/text-slate-800 text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
    newContent = newContent.replace(/text-slate-900 dark:text-white text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');

    // Also replace border-border-color with border-slate-200 dark:border-slate-700
    newContent = newContent.replace(/border-border-color/g, 'border-slate-200 dark:border-slate-700');

    // Also replace bg-bg-primary with bg-white dark:bg-slate-800
    newContent = newContent.replace(/bg-bg-primary/g, 'bg-white dark:bg-slate-800');

    // Also replace text-text-secondary with text-slate-500 dark:text-slate-400
    newContent = newContent.replace(/text-text-secondary/g, 'text-slate-500 dark:text-slate-400');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log('Fixed themes in:', filePath);
    }
  }
});
