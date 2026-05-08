const fs = require('fs');

function replace(file, r, rep) {
  let content = fs.readFileSync('src/components/modules/' + file, 'utf8');
  content = content.replace(r, rep);
  fs.writeFileSync('src/components/modules/' + file, content, 'utf8');
  console.log(`Fixed ${file}`);
}

replace('AreaCalculator.tsx', '/*  Approximation { id: "RightTriangle", */  label', '/* Approximation */ { id: "RightTriangle", label');
replace('FinishingEstimator.tsx', '/* pcs // Paint */  inputs const', '/* pcs Paint inputs */ const');
replace('FormworkEstimator.tsx', ']astagePct', ', wastagePct');
replace('HouseEstimator.tsx', 'Base Requirements */  for Grey Structure const', 'Base Requirements for Grey Structure */ const');

// ManholeModule.tsx
let man = fs.readFileSync('src/components/modules/ManholeModule.tsx', 'utf8');
man = man.replace('concrete */  calculations, let\'s assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let\'s keep it simple: concrete', 'concrete calculations, let\'s assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let\'s keep it simple: concrete */');
fs.writeFileSync('src/components/modules/ManholeModule.tsx', man, 'utf8');

replace('MasterQuantityEstimator.tsx', '/*  Concrete & Masonry { id: "concrete", */  label', '/* Concrete & Masonry */ { id: "concrete", label');

// RateAnalysis.tsx
replace('RateAnalysis.tsx', 'gap-8"> {/* Rate Inputs */} </section> <section', 'gap-8"> {/* Rate Inputs */} <section');

// RigidPavementEstimator.tsx
replace('RigidPavementEstimator.tsx', '/* kg // Adjust longitudinal joint */  calculation to account for floating point errors (e.g. 10.00000001)', '/* kg Adjust longitudinal joint calculation to account for floating point errors (e.g. 10.00000001) */');

// RoadEstimator.tsx
replace('RoadEstimator.tsx', '/* Cross-slope camber */  calculations const', '/* Cross-slope camber calculations */ const');

// SettingsModal.tsx
replace('SettingsModal.tsx', '/* We add this dummy state */  for account details to provide the visual', '/* We add this dummy state for account details to provide the visual */');

// SewerageEstimator.tsx
replace('SewerageEstimator.tsx', '/* Volume: 24h retention + sludge (assume ~40L per user per year */  for 2 years = 80L/user) const', '/* Volume: 24h retention + sludge (assume ~40L per user per year for 2 years = 80L/user) */ const');

// ShareMenu.tsx
replace('ShareMenu.tsx', 'okay */  for now. const', 'okay for now. */ const');

// Takeoff.tsx
replace('Takeoff.tsx', '{/* Current Drawing Line/Polygon */} {drawingPoints', '{drawingPoints');

// VolumeEstimator.tsx
replace('VolumeEstimator.tsx', '( */ Math.PI', '(Math.PI');

// RccStructureCalculator.tsx (missing `}`) at EOF
let rcc = fs.readFileSync('src/components/modules/RccStructureCalculator.tsx', 'utf8');
if (!rcc.endsWith('}')) {
  rcc += '}\n';
  fs.writeFileSync('src/components/modules/RccStructureCalculator.tsx', rcc, 'utf8');
}
