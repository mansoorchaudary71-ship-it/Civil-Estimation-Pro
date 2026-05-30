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

  // Clean up broken dark fragments like `:bg-slate-800` or `:text-indigo-300` left over from previous script
  content = content.replace(/\s:[a-zA-Z0-9_/-]+/g, '');
  content = content.replace(/\s:text-[a-zA-Z0-9_/-]+/g, '');
  content = content.replace(/\s:border-[a-zA-Z0-9_/-]+/g, '');

  // Fixing Dashboard active pill
  content = content.replace(/"bg-slate-900 border-slate-900 text-white"/g, '"bg-indigo-600 border-indigo-600 text-white"');
  
  // Specifically in SocialProofSection and others that have hover:bg-slate-800 or bg-slate-800
  content = content.replace(/hover:bg-slate-800/g, 'hover:bg-indigo-600');
  content = content.replace(/hover:border-slate-800/g, 'hover:border-indigo-600');
  content = content.replace(/hover:bg-slate-900\/40/g, 'hover:bg-indigo-50/40');
  content = content.replace(/hover:bg-slate-800\/60/g, 'hover:bg-indigo-50/40');
  content = content.replace(/bg-indigo-900\/40/g, 'bg-indigo-100');

  // Fix buttons that might have been "bg-white border border-slate-800 hover:bg-slate-800"
  content = content.replace(/border-slate-800 text-white font-bold/g, 'border-indigo-600 text-indigo-600 font-bold');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}
console.log('Fixed', changedFiles);
