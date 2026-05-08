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

// Calculators
replaceExact('src/components/modules/Calculators.tsx',
"/* The calculator expects base units for wall (like meters or feet) /* but the brick dimensions are in cm or inches. Our */  calculator code expects everything mathematically scaled? /* Wait, let's normalize everything to the base unit (Meters or Feet). */",
"/* The calculator expects base units for wall (like meters or feet) but the brick dimensions are in cm or inches. Our calculator code expects everything mathematically scaled? Wait, let's normalize everything to the base unit (Meters or Feet). */");

// RPE
replaceExact('src/components/modules/RigidPavementEstimator.tsx',
"sp_long). If w / sp_long exactly integer",
"sp_long). If w / sp_long exactly integer */");
// Actually let's use the full text
replaceExact('src/components/modules/RigidPavementEstimator.tsx',
"/* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use */ Math.floor(w / sp_long). If w / sp_long exactly integer, subtract 1.",
"/* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use Math.floor(w / sp_long). If w / sp_long exactly integer, subtract 1. */");

// Road
replaceExact('src/components/modules/RoadEstimator.tsx',
"/* calculational Areas strictly following typical trapezoidal */  calculation: V = ((W_top + W_bot) / 2) * t * L const areaAsp",
"/* calculational Areas strictly following typical trapezoidal calculation: V = ((W_top + W_bot) / 2) * t * L */ const areaAsp");

// Share Menu
replaceExact('src/components/modules/ShareMenu.tsx',
"FF282A65' }; /* Navy Blue */ titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent:",
"FF282A65' } }; /* Navy Blue */ titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent:");

// Staircase 
replaceExact('src/components/modules/StaircaseCalculator.tsx',
"for calculation let riseM = isMetric ? rise / 1000 : (rise * 25.4) / 1000",
"/* for calculation */ let riseM = isMetric ? rise / 1000 : (rise * 25.4) / 1000");

// UnitConverter
replaceExact('src/components/modules/UnitConverter.tsx',
"base_value = unit_value * factor. Let's use: base_value */= unit_value * factor. /* Example: m to cm",
"base_value = unit_value * factor. Let's use: base_value = unit_value * factor. */ /* Example: m to cm");

