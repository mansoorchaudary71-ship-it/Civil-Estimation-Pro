import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/components/**/*.tsx');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Let's add colorful UI texts anywhere it says "Estimate Results", "Calculation History", "Materials"
  
  // We'll replace instances of typical dull text colors with strong vibrant gemini-like styles.
  newContent = newContent.replace(/text-slate-[234567]00([^"]*?)uppercase(.*?) tracking-[a-z]*([^"]*?)(Estimate Results|Estimate Parameters|Review Breakdown|Calculation Methodology|Calculation Breakdown|Review Estimate)/gi, (match) => {
    // If it's already a gradient, skip
    if (match.includes('bg-gradient')) return match;

    // Remove text-slate-xxx
    let res = match.replace(/text-slate-[234567]00( \w+\:\w+-slate-\d+)* /gi, '');
    
    // Prepend gradient
    return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 bg-clip-text text-transparent ' + res;
  });

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    count++;
  }
});

console.log('Modified', count, 'files with gradient headers.');
