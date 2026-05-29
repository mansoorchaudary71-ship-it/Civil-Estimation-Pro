const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/components/modules');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(srcDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern 1: AreaSpaceCalculator
  content = content.replace(
      /bg-slate-800 dark:bg-slate-900 text-white p-6 rounded-\[2rem\] shadow-xl/g, 
      'bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm'
  );
  // Remove inner dark classes for text in AreaSpaceCalculator
  content = content.replace(/text-white\/60 text-xs font-bold uppercase tracking-widest/g, 'text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest');
  content = content.replace(/text-white\/50/g, 'text-slate-400 dark:text-slate-500');
  content = content.replace(/text-white\/70/g, 'text-slate-600 dark:text-slate-400');
  content = content.replace(/bg-white\/10 rounded-2xl/g, 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl');
  content = content.replace(/bg-white\/5 rounded-2xl border border-white\/10/g, 'bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800');
  content = content.replace(/border-white\/10/g, 'border-slate-100 dark:border-slate-800');

  // Pattern 2: QuickRoughEstimation
  content = content.replace(
      /bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-3xl shadow-xl/g, 
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm'
  );
  content = content.replace(/text-indigo-200 font-semibold mb-2 uppercase tracking-wide/g, 'text-slate-500 dark:text-slate-400 font-bold mb-2 uppercase tracking-widest');
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/bg-white\/10/g, 'bg-slate-50 dark:bg-slate-800/50');
  content = content.replace(/text-indigo-100/g, 'text-slate-600 dark:text-slate-400');
  
  // Pattern 3: LabourCalculator
  content = content.replace(
      /bg-slate-800 dark:bg-slate-900 rounded-3xl p-6 text-white shadow-lg border border-slate-700/g,
      'bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm'
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
