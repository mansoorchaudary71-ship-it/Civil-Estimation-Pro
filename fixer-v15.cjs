const fs = require('fs');

function replaceExact(file, searchStr, replaceStr) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let idx = content.indexOf(searchStr);
    if (idx !== -1) {
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

// Calculators.tsx
replaceExact('src/components/modules/Calculators.tsx',
"/* The calculator expects base units for wall (like meters or feet) /* but the brick dimensions are in cm or inches. Our */  calculator code expects everything mathematically scaled? /* Wait, let's normalize everything to the base unit (Meters or Feet). */",
"/* The calculator expects base units for wall (like meters or feet) but the brick dimensions are in cm or inches. Our calculator code expects everything mathematically scaled? Wait, let's normalize everything to the base unit (Meters or Feet). */");

// MasterQuantityEstimator.tsx
// Add the missing `}` back 
replaceExact('src/components/modules/MasterQuantityEstimator.tsx',
"icon: any;\n}\nconst calculatorsList",
"icon: any;\n}\nexport default function MasterQuantityEstimator() {\nconst calculatorsList"); // Wait, it needs to be inside the component maybe? 
// Let's actually look at MQE to see what I broke.
