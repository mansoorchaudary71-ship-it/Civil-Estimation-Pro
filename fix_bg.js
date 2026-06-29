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
    
    // find inputs with bg-white but no dark:bg-*
    let newContent = content.replace(/(<input[^>]*className="[^"]*)bg-white([^"]*")/g, (match, p1, p2) => {
        if (!match.includes('dark:bg-') && !match.includes('bg-transparent')) {
            return p1 + "bg-white dark:bg-slate-800" + p2;
        }
        return match;
    });

    // find inputs with bg-slate-50 but no dark:bg-*
    newContent = newContent.replace(/(<input[^>]*className="[^"]*)bg-slate-50([^"]*")/g, (match, p1, p2) => {
        if (!match.includes('dark:bg-') && !match.includes('bg-transparent')) {
            return p1 + "bg-slate-50 dark:bg-slate-800" + p2;
        }
        return match;
    });

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log('Fixed backgrounds in:', filePath);
    }
  }
});
