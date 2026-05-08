const fs = require('fs');
const lines = fs.readFileSync('src/components/modules/SlabSteelModule.tsx', 'utf8').split('\n');
const line4 = lines[3]; // 0-indexed
console.log(line4.slice(150, 250));
