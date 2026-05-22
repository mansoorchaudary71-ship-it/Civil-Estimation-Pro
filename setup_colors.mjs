import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/components');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Let's replace simple generic tabs that use "Estimation Results" text labels
  newContent = newContent.replace(/text-slate-[234567]00([^"]*?)uppercase(.*?) tracking-[a-z]*([^"]*?)(Estimate Results|Estimate Parameters|Review Breakdown|Calculation Methodology|Calculation Breakdown|Review Estimate)/gi, (match) => {
    if (match.includes('bg-gradient')) return match;
    let res = match.replace(/text-slate-[234567]00( \w+\:\w+-slate-\d+)* /gi, '');
    return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 bg-clip-text text-transparent ' + res;
  });

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    count++;
  }
});

console.log('Modified', count, 'files with gradient headers.');
