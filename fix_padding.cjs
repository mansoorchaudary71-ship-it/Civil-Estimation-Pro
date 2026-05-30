const fs = require('fs');

let str = fs.readFileSync('src/components/LandingSections.tsx', 'utf8');

str = str.replace(/py-16 md:py-24/g, 'py-12 md:py-16');
str = str.replace(/py-20 md:py-32/g, 'py-12 md:py-16');

fs.writeFileSync('src/components/LandingSections.tsx', str);
