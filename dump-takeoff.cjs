const fs = require('fs');

const code = fs.readFileSync('src/components/modules/Takeoff.tsx', 'utf8');
const charAt = 16376;
console.log(code.slice(charAt - 200, charAt + 100));
