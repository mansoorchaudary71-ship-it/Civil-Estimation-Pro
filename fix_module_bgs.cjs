const fs = require('fs');
const path = require('path');

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

let files = walkSync('src/components');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find all className="..."
  const classNameRegex = /className="([^"]+)"/g;
  content = content.replace(classNameRegex, (match, classes) => {
     let classArr = classes.split(' ');
     let newClasses = classArr.map(c => {
         // If a class is strictly 'bg-slate-900' or 'bg-slate-800' or 'bg-gray-900' (i.e. not dark:bg-..., not hover:bg-...)
         // and we know it's a structural container
         if (c === 'bg-slate-900' || c === 'bg-slate-800' || c === 'bg-gray-900') {
             return 'bg-white';
         }
         return c;
     });
     
     // specific fixes for text color if background was dark and now light
     if (classArr.includes('bg-slate-900') || classArr.includes('bg-slate-800')) {
         newClasses = newClasses.map(c => {
             if (c === 'text-white') return 'text-slate-900';
             if (c === 'text-slate-200' || c === 'text-slate-300') return 'text-slate-600';
             if (c === 'text-slate-400') return 'text-slate-500';
             return c;
         });
     }

     return `className="${newClasses.join(' ')}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
