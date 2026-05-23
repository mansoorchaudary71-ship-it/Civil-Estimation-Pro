const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
let totalFilesChanged = 0;

files.forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  let original = txt;
  
  // Base backgrounds
  txt = txt.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-bg-primary');
  txt = txt.replace(/bg-slate-50 dark:bg-slate-800\/80/g, 'bg-bg-primary');
  txt = txt.replace(/bg-slate-50 dark:bg-slate-800/g, 'bg-bg-primary');
  txt = txt.replace(/bg-slate-100 dark:bg-slate-900/g, 'bg-bg-primary');
  txt = txt.replace(/bg-slate-100 dark:bg-slate-800/g, 'bg-bg-primary');
  
  // Card backgrounds
  txt = txt.replace(/bg-white dark:bg-slate-800/g, 'bg-bg-card');
  txt = txt.replace(/bg-white dark:bg-slate-900/g, 'bg-bg-card');
  txt = txt.replace(/bg-white\/60 dark:bg-slate-900\/40/g, 'bg-bg-card opacity-90');
  txt = txt.replace(/bg-white dark:bg-slate-900\/40/g, 'bg-bg-card');
  
  // Text
  txt = txt.replace(/text-slate-800 dark:text-white/g, 'text-text-primary');
  txt = txt.replace(/text-slate-900 dark:text-white/g, 'text-text-primary');
  txt = txt.replace(/text-\[\#0f172a\] dark:text-white/g, 'text-text-primary');
  txt = txt.replace(/text-gray-900 dark:text-white/g, 'text-text-primary');
  txt = txt.replace(/text-gray-800 dark:text-white/g, 'text-text-primary');
  
  // Borders
  txt = txt.replace(/border-slate-100 dark:border-slate-700/g, 'border-border-color');
  txt = txt.replace(/border-slate-200 dark:border-slate-700/g, 'border-border-color');
  txt = txt.replace(/border-slate-300 dark:border-slate-600/g, 'border-border-color');
  txt = txt.replace(/border-slate-200 dark:border-slate-800/g, 'border-border-color');
  txt = txt.replace(/border-slate-100 dark:border-slate-800/g, 'border-border-color');
  txt = txt.replace(/border-white\/60 dark:border-slate-800\/60/g, 'border-border-color');

  if (txt !== original) {
    fs.writeFileSync(f, txt);
    totalFilesChanged++;
  }
});

console.log('Modified', totalFilesChanged, 'files.');
