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

let totalReplacements = 0;
files.forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  let original = txt;
  
  // Replace card bg
  txt = txt.replace(/bg-white dark:bg-slate-800\b/g, 'bg-[var(--bg-card)]');
  txt = txt.replace(/bg-white dark:bg-slate-900\b/g, 'bg-[var(--bg-card)]');
  txt = txt.replace(/bg-white\\/(\d+) dark:bg-slate-900\\/(\d+)\b/g, 'bg-[var(--bg-card)]/40');
  
  // Replace primary bg
  txt = txt.replace(/bg-slate-50 dark:bg-slate-900\b/g, 'bg-[var(--bg-primary)]');
  txt = txt.replace(/bg-slate-50 dark:bg-slate-800\/80\b/g, 'bg-[var(--bg-primary)]');
  txt = txt.replace(/bg-slate-50 dark:bg-slate-800\b/g, 'bg-[var(--bg-primary)]');
  txt = txt.replace(/bg-slate-100 dark:bg-slate-900\b/g, 'bg-[var(--bg-primary)]');
  
  // Replace text
  txt = txt.replace(/text-slate-800 dark:text-white\b/g, 'text-[var(--text-primary)]');
  txt = txt.replace(/text-slate-900 dark:text-white\b/g, 'text-[var(--text-primary)]');
  txt = txt.replace(/text-\[\#0f172a\] dark:text-white\b/g, 'text-[var(--text-primary)]');
  txt = txt.replace(/text-gray-900 dark:text-white\b/g, 'text-[var(--text-primary)]');
  txt = txt.replace(/text-gray-800 dark:text-white\b/g, 'text-[var(--text-primary)]');
  
  // Replace borders
  txt = txt.replace(/border-slate-100 dark:border-slate-700\b/g, 'border-[var(--border-color)]');
  txt = txt.replace(/border-slate-200 dark:border-slate-700\b/g, 'border-[var(--border-color)]');
  txt = txt.replace(/border-slate-300 dark:border-slate-600\b/g, 'border-[var(--border-color)]');
  txt = txt.replace(/border-slate-200 dark:border-slate-800\b/g, 'border-[var(--border-color)]');
  txt = txt.replace(/border-[^ ]* dark:border-[^ ]*/g, 'border-[var(--border-color)]');
  
  if (txt !== original) {
    fs.writeFileSync(f, txt);
    totalReplacements++;
  }
});
console.log('Total files updated:', totalReplacements);
