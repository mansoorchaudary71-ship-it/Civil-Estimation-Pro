const fs = require('fs');
const file = 'src/components/modules/AreaSpaceCalculator.tsx';

let content = fs.readFileSync(file, 'utf8');

content = content.replace(/text-purple-300/g, 'text-purple-600 dark:text-purple-400');
content = content.replace(/text-indigo-400/g, 'text-indigo-600 dark:text-indigo-400');
content = content.replace(/text-emerald-400/g, 'text-emerald-600 dark:text-emerald-400');
content = content.replace(/text-emerald-300/g, 'text-emerald-600 dark:text-emerald-400');
content = content.replace(/text-amber-400/g, 'text-amber-600 dark:text-amber-400');
content = content.replace(/text-amber-300/g, 'text-amber-600 dark:text-amber-400');
content = content.replace(/text-blue-300/g, 'text-blue-600 dark:text-blue-400');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed text colors in AreaSpaceCalculator');
