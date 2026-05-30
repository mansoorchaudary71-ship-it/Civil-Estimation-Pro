const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

let files = walkSync(srcDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Make toolcards perfectly rectangular
  if (file.includes('ToolCard.tsx')) {
    content = content.replace(/rounded-\[24px\]/g, 'rounded-none');
    content = content.replace(/rounded-2xl/g, 'rounded-none');
  }

  // Dashboard specific border-radiuses
  if (file.includes('Dashboard.tsx')) {
    content = content.replace(/rounded-3xl/g, 'rounded-none');
  }

  // Header components border-radiuses
  if (file.includes('App.tsx')) {
     content = content.replace(/rounded-2xl/g, 'rounded-none');
     // The AppHeader
     content = content.replace(/mx-2 mt-3 mb-3/g, 'm-0');
     content = content.replace(/border border-black\/5 dark:border-white\/5 rounded-none shadow-\[0_2px_10px_rgba\(0,0,0,0.02\)\]/g, 'border-b border-black/5 dark:border-white/5');
  }

  // Landing sections
  if (file.includes('LandingSections.tsx')) {
    content = content.replace(/rounded-3xl/g, 'rounded-none');
    content = content.replace(/rounded-\[2rem\]/g, 'rounded-none');
    content = content.replace(/rounded-2xl/g, 'rounded-none');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated layout in ${file}`);
  }
}
