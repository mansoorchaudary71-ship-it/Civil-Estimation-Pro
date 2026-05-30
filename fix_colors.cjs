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

  // Let's modify detailed calculation display specially first
  if (file.includes('DetailedCalculationDisplay.tsx')) {
     content = content.replace('bg-slate-800 dark:bg-black/40 rounded-[16px] p-4 sm:p-5 text-white', 'bg-white dark:bg-slate-800/40 rounded-[24px] border border-slate-200 dark:border-slate-700/50 p-4 sm:p-5 shadow-sm');
     content = content.replace('text-xs font-bold uppercase tracking-wider text-slate-400 mb-3', 'text-xs font-bold uppercase tracking-wider text-slate-500 mb-3');
     content = content.replace('font-mono text-sm sm:text-base text-slate-300 mb-4 whitespace-nowrap overflow-x-auto pb-2 border-b border-slate-700/50', 'font-mono text-sm sm:text-base text-slate-800 dark:text-slate-200 mb-4 whitespace-nowrap overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700/50');
     content = content.replace('text-sm font-medium text-slate-400', 'text-sm font-medium text-slate-500');
     content = content.replace('bg-white/80 dark:bg-slate-800/80 rounded-[20px] p-5 sm:p-6 shadow-sm border border-border-color/50', 'bg-slate-50/50 dark:bg-slate-800/30 rounded-[24px] p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700/50');
  }

  // Restore border radius globals that were removed:
  content = content.replace(/rounded-none/g, 'rounded-[24px]');

  // Use the refined replace logic
  const classNameRegex = /className="([^"]+)"/g;
  content = content.replace(classNameRegex, (match, classes) => {
     let classArr = classes.split(' ');
     
     // Skip pill buttons for filters
     if (classArr.includes('hover:bg-slate-800') || classArr.includes('hover:bg-slate-700') || classArr.includes('transition-colors') && classArr.includes('whitespace-nowrap')) {
         return match; 
     }

     let modified = false;
     let newClasses = classArr.map(c => {
         if (c === 'bg-slate-900' || c === 'bg-slate-800' || c === 'bg-gray-900') {
             modified = true;
             return 'bg-white';
         }
         return c;
     });
     
     if (modified) {
         newClasses = newClasses.map(c => {
             if (c === 'text-white' && !classArr.includes('bg-indigo-600') && !classArr.includes('bg-purple-600')) return 'text-slate-900';
             return c;
         });
         
         // Add border and shadow if there isn't one, this makes it a soft card (One UI style)
         if (!newClasses.includes('border') && !newClasses.includes('shadow-sm') && !newClasses.includes('shadow-md') && !newClasses.includes('shadow-lg')) {
            newClasses.push('border', 'border-slate-200', 'dark:border-slate-800', 'shadow-sm');
         }
     }
     
     // Change completely sharp corners or standard rounded to more generous One UI styles in specific patterns
     // Like rounded-lg -> rounded-2xl in forms/inputs
     const oneUI = newClasses.map(c => {
         // if it's an input or a block
         if (c === 'rounded-md' || c === 'rounded-lg') {
             // Let's make inputs rounded-2xl softly
             return 'rounded-[16px]';
         }
         if (c === 'rounded-2xl') {
             return 'rounded-[24px]'; // standard One UI bigger cards
         }
         return c;
     });

     return `className="${oneUI.join(' ')}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
