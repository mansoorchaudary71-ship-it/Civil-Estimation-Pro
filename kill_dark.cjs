const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist) {
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
}

let files = walkSync('src/components');
files.push('src/App.tsx');

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove all dark: classes anywhere
  content = content.replace(/dark:[a-zA-Z0-9_/-]+(\/[0-9]+)?/g, '');

  // 2. Replace specific dark backgrounds
  const classNameRegex = /className="([^"]+)"/g;
  content = content.replace(classNameRegex, (match, classes) => {
     let classArr = classes.split(' ').filter(c => c.trim() !== '');
     let newClasses = [];
     let hadDarkBg = false;

     for (let c of classArr) {
         if (c.match(/^bg-(slate|gray|zinc|stone)-(900|800|700)(\/[0-9]+)?$/)) {
             hadDarkBg = true;
             // Use very soft grey instead as requested by user #F5F5F7
             newClasses.push('bg-[#F5F5F7]');
         } else if (c.match(/^bg-\[\#(0a0f1e|1a1a3a|111827|000000)\]/i)) {
             hadDarkBg = true;
             newClasses.push('bg-[#F5F5F7]');
         } else if (c === 'bg-bg-primary/50' || c === 'bg-bg-primary' || c === 'bg-slate-800/50') {
             hadDarkBg = true;
             newClasses.push('bg-white');
         } else {
             newClasses.push(c);
         }
     }

     if (hadDarkBg) {
        newClasses = newClasses.map(c => {
           if (c.startsWith('text-white') || c.startsWith('text-slate-100') || c.startsWith('text-slate-200') || c.startsWith('text-slate-300')) {
                return 'text-slate-900';
           }
           if (c.startsWith('text-slate-400') || c.startsWith('text-slate-500')) {
                return 'text-slate-700';
           }
           if (c.startsWith('border-slate-700') || c.startsWith('border-slate-800') || c.startsWith('border-border-color/50')) {
                return 'border-slate-200';
           }
           return c;
        });
     }

     // ensure there are no double spaces
     return `className="${newClasses.join(' ')}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log('Modified files:', changedFiles);
