const fs = require('fs');
const content = fs.readFileSync('src/components/modules/Calculators.tsx', 'utf8');
const idx = content.indexOf('waterLiters:');
console.log(content.slice(Math.max(0, idx - 200), idx + 200));
