const fs = require('fs');

let f = fs.readFileSync('src/components/modules/SlabSteelModule.tsx', 'utf8');
f = f.replace(/\/\* in meters slabWidth\?: string; \/\/ in meters slabThickness\?: string; \/\/ in meters onStateChange\?: \(results: SlabSteelResults\) => void;/g, 
"/* in meters */ slabWidth?: string; /* in meters */ slabThickness?: string; /* in meters */ onStateChange?: (results: SlabSteelResults) => void;");
fs.writeFileSync('src/components/modules/SlabSteelModule.tsx', f, 'utf8');

console.log("Fixed Slab comment!");
