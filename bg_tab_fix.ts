const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/components/modules/**/*.tsx');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Let's add colorful UI texts anywhere it says "Estimate Results", "Calculation History", "Materials"
  
  // Actually, let's just make sure all h2, h3 headers around generic Estimate Results have vibrant UI colors.
  // We'll replace instances of typical dull text colors with strong vibrant gemini-like styles.
  newContent = newContent.replace(/text-slate-[3456]00(.*?)uppercase tracking-wider(.*?)(Estimate Results|Calculation Methodology|Calculation Breakdown)/g, (match, p1, p2, p3) => {
    return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 bg-clip-text text-transparent font-bold text-sm uppercase tracking-wider' + p2 + p3;
  });

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    count++;
  }
});

console.log('Modified', count, 'files with gradient headers.');
