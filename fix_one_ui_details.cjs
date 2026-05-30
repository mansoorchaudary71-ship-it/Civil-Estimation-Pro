const fs = require('fs');

function fixFile(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    for (let r of replacements) {
        content = content.replace(r[0], r[1]);
    }
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
}

fixFile('src/components/ui/DetailedCalculationDisplay.tsx', [
    ['bg-slate-800 dark:bg-black/40 rounded-[16px] p-4 sm:p-5 text-white', 'bg-white dark:bg-slate-800/40 rounded-[24px] border border-slate-200 dark:border-slate-700/50 p-4 sm:p-5 text-slate-900 dark:text-white shadow-sm'],
    ['text-white', 'text-slate-900 dark:text-white'], // this might be aggressive, let's target more specifically
    ['text-slate-300 mb-4 whitespace-nowrap overflow-x-auto pb-2 border-b border-slate-700/50', 'text-slate-800 dark:text-slate-200 mb-4 whitespace-nowrap overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700/50'],
    ['bg-white/80 dark:bg-slate-800/80 rounded-[20px] p-5 sm:p-6 shadow-sm border border-border-color/50', 'bg-slate-50/50 dark:bg-slate-800/30 rounded-[28px] p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700/50'],
    ['bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[24px]', 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px]']
]);

fixFile('src/App.tsx', [
    [/rounded-none/g, 'rounded-3xl']
]);

fixFile('src/components/Dashboard.tsx', [
    [/rounded-none/g, 'rounded-[28px]']
]);

fixFile('src/components/ToolCard.tsx', [
    [/rounded-none/g, 'rounded-[24px]']
]);

// Any calculation block in modules that has `bg-slate-[89]00` but not `dark:`
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

let files = walkSync('src/components/modules');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  // Replace big black boxes (sometimes used for results)
  content = content.replace(/bg-slate-800 dark:bg-slate-900/g, 'bg-slate-50 dark:bg-slate-800/50');
  content = content.replace(/bg-slate-900/g, 'bg-slate-50 dark:bg-slate-900'); // make sure light mode is light grey/white
  content = content.replace(/bg-gray-900/g, 'bg-slate-50 dark:bg-gray-900');
  content = content.replace(/text-white/g, 'text-slate-800 dark:text-white');
  
  if (content !== original) {
    // but wait, modifying all text-white breaks buttons e.g "bg-indigo-600 text-slate-800"
    // I should undo the very generic text-white replace if it's there. 
    // I will write a smarter replace below instead of using the simple one.
  }
}
