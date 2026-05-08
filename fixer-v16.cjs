const fs = require('fs');

function replaceExact(file, searchStr, replaceStr) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let idx = content.indexOf(searchStr);
    if (idx !== -1) {
      // replace all occurrences
      content = content.replace(searchStr, replaceStr);
      fs.writeFileSync(file, content, 'utf8');
      console.log("Fixed", file);
    } else {
      console.log("Could not find exact string in", file);
    }
  } catch(e) {
    console.log("Error processing", file);
  }
}

// MasterQuantityEstimator
replaceExact('src/components/modules/MasterQuantityEstimator.tsx',
"icon: any;\nconst calculatorsList",
"icon: any;\n}\nconst calculatorsList");

// Calculators
replaceExact('src/components/modules/Calculators.tsx',
"/* The calculator expects base units for wall (like meters or feet) /* but the brick dimensions are in cm or inches. Our */  calculator code expects everything mathematically scaled? /* Wait, let's normalize everything to the base unit (Meters or Feet). */",
"/* The calculator expects base units for wall (like meters or feet) but the brick dimensions are in cm or inches. Our calculator code expects everything mathematically scaled? Wait, let's normalize everything to the base unit (Meters or Feet). */");

// RccStructureCalculator
let rccContent = fs.readFileSync('src/components/modules/RccStructureCalculator.tsx', 'utf8');
if (!rccContent.trim().endsWith("export default function RccStructureCalculator() { return null; }")) {
   // Just in case, it was truncated! Let's find out how it looks
}
// Actually, let me check RccStructureCalculator first!
console.log("Rcc length:", rccContent.length);

// RigidPavementEstimator
replaceExact('src/components/modules/RigidPavementEstimator.tsx',
"/* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use */ Math.floor(w / sp_long). If w / sp_long exactly integer, sub...",
"/* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use Math.floor(w / sp_long). If w / sp_long exactly integer, sub... */");
// Let me verify the exact string in RigidPavementEstimator.tsx
