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

fixMatch('src/components/modules/AreaCalculator.tsx', /\{ id: "Ellipse", \*\/\s+label: "Ellipse"/, '{ id: "Ellipse", /* */ label: "Ellipse"');
fixMatch('src/components/modules/Brickwork9InchModule.tsx', /\/\* 10% wastage \*\/\s+for bricks \} noOfBricks/, '/* 10% wastage for bricks */ } noOfBricks');
fixMatch('src/components/modules/Calculators.tsx', /\}else\{return \/\* 0;\}\/\s+/, '}else{return 0;} /* */');
fixMatch('src/components/modules/Calculators.tsx', /number; bricksCount\?: number; \/\*/, 'number; bricksCount?: number; /*');
fixMatch('src/components/modules/ChainageVolume.tsx', /\/\*\s+Prismoidal Formula intCut = \(length \*\/\s+\/ 6\)/, '/* Prismoidal Formula */ intCut = (length / 6)');
fixMatch('src/components/modules/FinishingEstimator.tsx', /\/\* Plaster \*\/\s+inputs const/, '/* Plaster inputs */ const');
fixMatch('src/components/modules/FormworkEstimator.tsx', /\/\* Detailed areas \*\/\s+for charting\/breakdown let/, '/* Detailed areas for charting/breakdown */ let');
fixMatch('src/components/modules/GlobalSettingsModal.tsx', /\/\* Local state \*\/\s+for edits const/, '/* Local state for edits */ const');
fixMatch('src/components/modules/HouseEstimator.tsx', /\/\* Slab \+ 25% \*\/\s+for beams\/columns const/, '/* Slab + 25% for beams/columns */ const');
fixMatch('src/components/modules/ManholeModule.tsx', /\/\* Used \*\/\s+for circular diameter or rectangular len/, '/* Used for circular diameter or rectangular len');
fixMatch('src/components/modules/MasterQuantityEstimator.tsx', /type CalcId \*\/\s+=/, 'type CalcId = /* */');
fixMatch('src/components/modules/RateAnalysis.tsx', /\/\* Assumed fixed rates \*\/\s+for labor and tools for mixing\/pouring/, '/* Assumed fixed rates for labor and tools for mixing/pouring');
fixMatch('src/components/modules/RccStructureCalculator.tsx', /\/\* Approximate extra weight \*\/\s+for two-way bending \/ crank bars extr/, '/* Approximate extra weight for two-way bending / crank bars extr');
fixMatch('src/components/modules/RigidPavementEstimator.tsx', /\/\* Steel \*\/\s+calculations const/, '/* Steel calculations */ const');
fixMatch('src/components/modules/RoadEstimator.tsx', /\/\* slope camber \*\/\s+calculations const/, '/* slope camber calculations */ const');
fixMatch('src/components/modules/SettingsModal.tsx', /\/\* add this dummy state \*\/\s+for account details to provide the visu/, '/* add this dummy state for account details to provide the visu');
fixMatch('src/components/modules/SewerageEstimator.tsx', /\/\* ~40L per user per year \*\/\s+for 2 years = 80L\/user\) const/, '/* ~40L per user per year for 2 years = 80L/user) */ const');
fixMatch('src/components/modules/ShareMenu.tsx', /\/\* simple toggle is okay \*\/\s+for now\. const/, '/* simple toggle is okay for now. */ const');
fixMatch('src/components/modules/SlabSteelModule.tsx', /\/\*\s+on SlabSteelModule\(\{ slabLength = '5'/, 'export default function SlabSteelModule({ slabLength = \'5\'');
fixMatch('src/components/modules/StaircaseCalculator.tsx', /setLandings\(\[\]\); \} \}, \[stairShape\]\); const/, 'setLandings([]); } }, [stairShape]); const');
fixMatch('src/components/modules/Takeoff.tsx', /\{isLinked \*\/\s+&& \(/, '{isLinked && /* */ (');
fixMatch('src/components/modules/UnitConverter.tsx', /\/\* Divide by this to get unit \*\/\s+\(so base = unit \/ factor\)\. Wait, actua/, '/* Divide by this to get unit (so base = unit / factor). Wait, actua');
fixMatch('src/components/modules/VolumeEstimator.tsx', /\/ 6 \* h \* h \|\| 1\)\) \* \(Math\.pow\(/, '/ (6 * h * h || 1)) * (Math.pow(');

// General fix for /* */
const files = fs.readdirSync('src/components/modules').filter(f => f.endsWith('.tsx'));
for (const file of files) {
  let content = fs.readFileSync(`src/components/modules/${file}`, 'utf8');
  let original = content;
  
  // some fixes for general broken things
  content = content.replace(/\/\*\s+([^}]+)\*\/\s+\}/g, '/* $1 */ }');
  
  if (content !== original) {
    fs.writeFileSync(`src/components/modules/${file}`, content, 'utf8');
  }
}
