const fs = require('fs');

function fixMatch(file, regex, replacement) {
  try {
    let content = fs.readFileSync('src/components/modules/' + file, 'utf8');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      fs.writeFileSync('src/components/modules/' + file, content, 'utf8');
      console.log(`[OK] Fixed ${file}`);
    } else {
      console.log(`[PASS] Regex not matched in ${file}`);
    }
  } catch(e) {
    console.log(`[ERR] ${file} not found`);
  }
}

fixMatch('AreaCalculator.tsx', /\]; \/\* Convert \*\/\s+input value built in input unit to meters /, ']; /* Convert input value built in input unit to meters */ ');
fixMatch('Calculators.tsx', /\/\*  Project Cart state interface CartItem \*\/\s+\{/, '/* Project Cart state */ interface CartItem {');
fixMatch('FinishingEstimator.tsx', /\/\* 33% extra \*\/\s+for mortar const/, '/* 33% extra for mortar */ const');
fixMatch('FormworkEstimator.tsx', /elements, repetitionFactor\]astagePct\]\);/, 'elements, repetitionFactor, wastagePct]);');
fixMatch('GlobalSettingsModal.tsx', /\/\*  const defaultPrefs/, 'const defaultPrefs');
fixMatch('HouseEstimator.tsx', /\/\*\s*Extrapolated quantities & prices\s*\*\/\s+for add-ons const/, '/* Extrapolated quantities & prices for add-ons */ const');
fixMatch('ManholeModule.tsx', /\/\*\s*calculations, let's assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick\. Let's keep it simple: concrete/, 'calculations, let\'s assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let\'s keep it simple: concrete */');
fixMatch('MasterQuantityEstimator.tsx', /type CalcId = \|  "concrete"/, 'type CalcId = "concrete"');
fixMatch('RigidPavementEstimator.tsx', /\/\* kg \/\/ Adjust longitudinal joint \*\/\s+calculation to account for floating point errors const/, '/* kg Adjust longitudinal joint calculation to account for floating point errors */ const');
fixMatch('RoadEstimator.tsx', /\/\* Trapezoidal cross-section \*\/\s+calculations considering side slope extending outwards const/, '/* Trapezoidal cross-section calculations considering side slope extending outwards */ const');
fixMatch('SettingsModal.tsx', /\*\/ly complete mockup const/, 'ly complete mockup */ const');
fixMatch('ShareMenu.tsx', /\/\*  4\. Financial Summary Table \(bottom \*\/\s+line\) autoTable\(/, '/* 4. Financial Summary Table (bottom line) */ autoTable(');
fixMatch('SlabSteelModule.tsx', /\*\/\s+export default function SlabSteelModule/, 'export default function SlabSteelModule');
// StaircaseCalculator.tsx
fixMatch('StaircaseCalculator.tsx', /stairShape\]\); const/, 'stairShape]); const'); // Wait stairShape is fine? I need to check it later if it fails.
fixMatch('StaircaseCalculator.tsx', /setLandings\(\[\]\); \} \}, \[stairShape\]\); const/, 'setLandings([]); } }, [stairShape]); const');
fixMatch('Takeoff.tsx', /\{\/\* Vertex circles \*\/\}\s+\{drawingPoints\.map/, '{drawingPoints.map');
fixMatch('Takeoff.tsx', /\)\}\s+\{\/\* Vertex circles \*\/\}\s+/, ')} ');
fixMatch('UnitConverter.tsx', /\/\*\s*Multiply base by this to get unit \*\/\s+\(so base = unit \/ factor\)\. Wait, actually easier: base/, '/* Multiply base by this to get unit (so base = unit / factor). Wait, actually easier: base */');

// Extra fixes for MasterQuantity Estimator logic breaking?
fixMatch('MasterQuantityEstimator.tsx', /"concrete", \*\/\s+label: "Concrete"/, '"concrete", label: "Concrete"');

let rcc = fs.readFileSync('src/components/modules/RccStructureCalculator.tsx', 'utf8');
if (rcc.endsWith('}\n}\n') || rcc.endsWith('} }\n')) {
  rcc = rcc.replace(/\}\s*\}\s*$/, '}\n');
  fs.writeFileSync('src/components/modules/RccStructureCalculator.tsx', rcc, 'utf8');
}
