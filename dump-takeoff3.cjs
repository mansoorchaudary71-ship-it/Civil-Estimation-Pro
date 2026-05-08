const fs = require('fs');
const lines = fs.readFileSync('src/components/modules/Takeoff.tsx', 'utf8').split('\n');
const line9 = lines[8]; // 0-indexed
console.log(line9.slice(16000, 16500));
