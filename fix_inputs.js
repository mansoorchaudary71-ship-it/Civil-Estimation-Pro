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
    let newContent = content.replace(/(<input[^>]*className="[^"]*)text-white([^"]*")/g, (match, p1, p2) => {
        // If it already has dark:text-white, don't add it again unless we replace it.
        // But we want to ensure light mode is dark text.
        let m = match;
        // remove text-white
        let inner = p1 + p2;
        // add text-slate-900 dark:text-white
        return p1 + " text-slate-900 dark:text-white " + p2;
    });

    // same for textarea
    newContent = newContent.replace(/(<textarea[^>]*className="[^"]*)text-white([^"]*")/g, (match, p1, p2) => {
        return p1 + " text-slate-900 dark:text-white " + p2;
    });
    
    // clean up duplicate classes if they happen
    newContent = newContent.replace(/text-slate-900 dark:text-white text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
    newContent = newContent.replace(/text-white text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log('Fixed inputs in:', filePath);
    }
  }
});
