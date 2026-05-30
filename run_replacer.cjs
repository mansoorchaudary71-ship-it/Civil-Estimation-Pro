const fs = require('fs');
const path = require('path');

const dirpaths = ['src/components/modules', 'src/components/ui', 'src/components'];

function getAllFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        let fullPath = path.join(dir, file);
        let stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(getAllFiles(fullPath));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(fullPath);
        }
    });
    return results;
}

let files = [];
for (const dir of dirpaths) {
    files = files.concat(getAllFiles(dir));
}

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Let's manually replace `className="... bg-slate-900 ..."` ensuring we skip hover and dark
  // Instead of a regex function, just do simple string replacements to avoid edge cases.
  content = content.replace(/className="([^"]*\s)?bg-slate-900(\s[^"]*)?"/g, (match) => {
      if (match.includes('dark:bg-slate-900') || match.includes('hover:bg-slate-900')) return match;
      if (match.includes('btn') || match.includes('button')) return match; // skip buttons if any
      return match.replace(/\bbg-slate-900\b/g, 'bg-white');
  });

  content = content.replace(/className="([^"]*\s)?bg-slate-800(\s[^"]*)?"/g, (match) => {
      if (match.includes('dark:bg-slate-800') || match.includes('hover:bg-slate-800')) return match;
      if (match.includes('btn') || match.includes('button')) return match;
      // Formula blocks were typically bg-slate-800 text-white. Let's fix them to light shadow.
      let newStr = match.replace(/\bbg-slate-800\b/g, 'bg-white');
      if (!newStr.includes('shadow-sm')) newStr = newStr.replace('bg-white', 'bg-white shadow-sm border border-slate-200 dark:border-slate-800');
      if (newStr.includes('text-white')) newStr = newStr.replace('text-white', 'text-slate-800 dark:text-slate-100');
      return newStr;
  });

  // Specifically check for dark background results in any component!
  // e.g. `<div className="mt-8 p-5 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl">`
  
  // Make large containers softly rounded
  content = content.replace(/\brounded-lg\b/g, 'rounded-xl'); // inputs
  content = content.replace(/\brounded-xl\b/g, 'rounded-2xl'); // small cards
  content = content.replace(/\brounded-2xl\b/g, 'rounded-3xl'); // large cards

  // Fix up those weird replaced strings
  content = content.replace(/rounded-3xl/g, 'rounded-[24px]');
  content = content.replace(/rounded-2xl/g, 'rounded-[20px]');
  content = content.replace(/rounded-xl/g, 'rounded-[16px]');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log('Modified files:', changedFiles);
