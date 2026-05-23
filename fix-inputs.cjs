const fs = require('fs');
const file = 'src/components/modules/Calculators.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"/g, 'className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"');
fs.writeFileSync(file, content);
console.log('Replaced all occurrences');
