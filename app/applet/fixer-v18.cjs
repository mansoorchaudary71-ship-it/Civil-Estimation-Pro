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

// 1. RoadEstimator
replaceExact('src/components/modules/RoadEstimator.tsx',
"/* Cross-sectional Areas strictly following typical trapezoidal */  calculation: V = ((W_top + W_bot) / 2) * t * L const areaAsp",
"/* Cross-sectional Areas strictly following typical trapezoidal calculation: V = ((W_top + W_bot) / 2) * t * L */ const areaAsp");

// 2. UnitConverter
replaceExact('src/components/modules/UnitConverter.tsx',
"base_value = unit_value * factor. */ /* Example: m to cm. If base is m, factor */  for cm is 0.01.",
"base_value = unit_value * factor. Example: m to cm. If base is m, factor for cm is 0.01.");

// 3. RigidPavementEstimator
replaceExact('src/components/modules/RigidPavementEstimator.tsx',
"we subtract 1 because the edges don't get tie bars. /* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use */ Math.floor(w / sp_long). If w / sp_long exactly integer */, subtract 1.",
"we subtract 1 because the edges don't get tie bars. Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use Math.floor(w / sp_long). If w / sp_long exactly integer, subtract 1. */");

// 4. MasterQuantityEstimator
replaceExact('src/components/modules/MasterQuantityEstimator.tsx',
"icon: any;\nconst calculatorsList",
"icon: any;\n}\nexport default function MasterQuantityEstimator() {\nconst calculatorsList");

// 5. RccStructureCalculator
replaceExact('src/components/modules/RccStructureCalculator.tsx',
"if (noOfBars > 4) { /* For 6 or 8 bars, more ties are often required (cross ties or diamond) extraTiesWt = tieWt * 0.5; } totalSteelKg = mainWt + tieWt + extraTiesWt; */  inputsUsed = {",
"if (noOfBars > 4) { /* For 6 or 8 bars, more ties are often required (cross ties or diamond) */ extraTiesWt = tieWt * 0.5; } totalSteelKg = mainWt + tieWt + extraTiesWt; inputsUsed = {");

// 6. ShareMenu
replaceExact('src/components/modules/ShareMenu.tsx',
"/* Add date aligned to the right inside the banner. We will just use cell D1, E1 */  if we didn't merge across. Since we merged A1:E2, we can't easily put right-aligned text in the same cell without rich text, but rich text horizontal alignment is tricky. Alternatively, we can unmerge A1:E2, merge A1:C2 for title, D1:E2 for dates. Let's do that! sheet.unMergeCells",
"/* Add date aligned to the right inside the banner. We will just use cell D1, E1 if we didn't merge across. Since we merged A1:E2, we can't easily put right-aligned text in the same cell without rich text, but rich text horizontal alignment is tricky. Alternatively, we can unmerge A1:E2, merge A1:C2 for title, D1:E2 for dates. Let's do that! */ sheet.unMergeCells");
