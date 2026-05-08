const fs = require('fs');

function fixMatch(file, regex, replacement) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`[OK] Fixed ${file}`);
    } else {
      console.log(`[PASS] Regex not matched in ${file}`);
    }
  } catch(e) {
    console.log(`[ERR] ${file} not found`);
  }
}

fixMatch('src/components/modules/AreaCalculator.tsx', /\/\*  Approximation \{ id: "Ellipse", \/\* \*\/ label: "Ellipse"/, '/* Approximation */ { id: "Ellipse", label: "Ellipse"');
fixMatch('src/components/modules/Brickwork9InchModule.tsx', /\/\*\s*10% wastage\s*\*\/\s+for mortar \} const/, '/* 10% wastage for mortar */ } const');
fixMatch('src/components/modules/Calculators.tsx', /\}else\{return \/\* 0;\}\/\s+/, '}else{return 0;} /* */ ');
fixMatch('src/components/modules/Calculators.tsx', /number; bricksCount\?: number;/, 'number; bricksCount?: number;');
fixMatch('src/components/modules/FinishingEstimator.tsx', /\/\*\s*1:4 \/\/ Tile\s*\*\/\s+inputs const/, '/* 1:4 Tile inputs */ const');
fixMatch('src/components/modules/FormworkEstimator.tsx', /elements, repetitionFactor, w/, 'elements, repetitionFactor]'); // wait formwork estimator error?
fixMatch('src/components/modules/GlobalSettingsModal.tsx', /per kg in context, per \*\/\s+ton in modal bricks: rates/, 'per kg in context, per ton in modal */ bricks: rates');
fixMatch('src/components/modules/HouseEstimator.tsx', /\/\*\s*25% \+ bonus\s*\*\/\s+for bedrooms const/, '/* 25% + bonus for bedrooms */ const');
fixMatch('src/components/modules/ManholeModule.tsx', /\/\*\s*Used only\s*\*\/\s+for rectangular width const/, '/* Used only for rectangular width */ const');
fixMatch('src/components/modules/MasterQuantityEstimator.tsx', /type CalcId = \/\* \*\/ \|/, 'type CalcId = | ');
fixMatch('src/components/modules/RateAnalysis.tsx', /\{\/\* Rate Inputs \*\/\} <section/, '{/* Rate Inputs */} </section> <section'); // Wait
fixMatch('src/components/modules/RccStructureCalculator.tsx', /\/\*\s*100mm\s*\*\/\s+for hook const/, '/* 100mm for hook */ const');
fixMatch('src/components/modules/RigidPavementEstimator.tsx', /\/\*\s*longitudinal joint\s*\*\/\s+calculation to account for floating point error/, '/* longitudinal joint calculation to account for floating point error */ ');
fixMatch('src/components/modules/SettingsModal.tsx', /\/\*\s*add this dummy state\s*\*\/\s+for account details to provide the visu/, '/* add this dummy state for account details to provide the visu */ ');
fixMatch('src/components/modules/SewerageEstimator.tsx', /\/\*\s*~40L per user per year\s*\*\/\s+for 2 years = 80L\/user\) const/, '/* ~40L per user per year for 2 years = 80L/user) */ const');
fixMatch('src/components/modules/ShareMenu.tsx', /\/\*\s*simple toggle is okay\s*\*\/\s+for now\. const/, '/* simple toggle is okay for now. */ const');
fixMatch('src/components/modules/SlabSteelModule.tsx', /\/\*\s*on SlabSteelModule/, 'export default function SlabSteelModule');
fixMatch('src/components/modules/Takeoff.tsx', /\{isLinked && \/\* \*\/ \(/, '{isLinked && (');
fixMatch('src/components/modules/UnitConverter.tsx', /\/\*\s*Divide by this to get unit\s*\*\/\s+\(so base = unit \/ factor\)\. Wait, actua/, '/* Divide by this to get unit (so base = unit / factor). Wait, actua */ ');
fixMatch('src/components/modules/VolumeEstimator.tsx', /\/\*\s*Math\.PI \* r \/ \(6 \* h \* h \|\| 1\)\) \* \(Math\.pow\(/, '/* Math.PI * r / (6 * h * h || 1)) * (Math.pow(');
