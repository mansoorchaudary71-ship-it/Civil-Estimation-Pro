const fs = require('fs');

function fix(file, from, to) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(from)) {
    content = content.replace(from, to);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  } else {
    console.log(`String not found in ${file}`);
  }
}

// 1. AreaCalculator.tsx
// '{ id: "Ellipse", */  label: "Ellipse", icon: Circle, color...'
// Original code had: `{ id: "Ellipse", label: "Ellipse", ... }, // Approximation`
// Then it was followed by `{ id: "RightTriangle"...`
fix('src/components/modules/AreaCalculator.tsx', 
  '{ id: "Ellipse", */  label: "Ellipse"', 
  '{ id: "Ellipse", label: "Ellipse"');
fix('src/components/modules/AreaCalculator.tsx', 
  '{ id: "Trapezoid", */  label: "Trapezoid"', 
  '{ id: "Trapezoid", label: "Trapezoid"');

// 2. Brickwork9InchModule.tsx
// `...1.10; /* 10% wastage */  for bricks } noOfBricks = Math.ceil`
fix('src/components/modules/Brickwork9InchModule.tsx',
  '/* 10% wastage */  for bricks }',
  '/* 10% wastage for bricks */ }');

// 3. Calculators.tsx
// `type CalcId */  = | "concrete" | "bricks" | "blocks" | "plaster" |...`
// Wait Calculators.js had: `type CalcId = ` and somewhere it got corrupted.
fix('src/components/modules/Calculators.tsx', 
  'type CalcId */  =', 
  'type CalcId =');
fix('src/components/modules/Calculators.tsx',
  '; waterLiters: number; steelKg?: number; bricksCount?: number; ',
  '; waterLiters: number; steelKg?: number; bricksCount?: number;');

// 4. ChainageVolume.tsx
// `/*  Prismoidal Formula intCut = (length */  / 6) * (cutArea + 4 * Am_cut + prev_cutArea);`
fix('src/components/modules/ChainageVolume.tsx',
  '/*  Prismoidal Formula intCut = (length */  / 6)',
  '/* Prismoidal Formula */ intCut = (length / 6)');

// 5. FinishingEstimator.tsx
// `... '15'); /* Plaster */  inputs const [plasterThickness, setPlaste...`
fix('src/components/modules/FinishingEstimator.tsx',
  '/* Plaster */  inputs const',
  '/* Plaster inputs */ const');

// 6. FormworkEstimator.tsx
// `...; /* Detailed areas */  for charting/breakdown let colArea = 0; ...`
fix('src/components/modules/FormworkEstimator.tsx',
  '/* Detailed areas */  for charting/breakdown let',
  '/* Detailed areas for charting/breakdown */ let');

// 7. GlobalSettingsModal.tsx
// `...tes'); /* Local state */  for edits const [localRates, setLocalR...`
fix('src/components/modules/GlobalSettingsModal.tsx',
  '/* Local state */  for edits const',
  '/* Local state for edits */ const');

// 8. HouseEstimator.tsx
// `... 1.25; /* Slab + 25% */  for beams/columns const rccDryVolume =...`
fix('src/components/modules/HouseEstimator.tsx',
  '/* Slab + 25% */  for beams/columns const',
  '/* Slab + 25% for beams/columns */ const');

// 9. ManholeModule.tsx
// `...ring>('3'); /* Used */  for circular diameter or rectangular len...`
fix('src/components/modules/ManholeModule.tsx',
  '/* Used */  for circular diameter or rectangular len',
  '/* Used for circular diameter or rectangular len');

// 10. MasterQuantityEstimator.tsx
fix('src/components/modules/MasterQuantityEstimator.tsx',
  'type CalcId */  =',
  'type CalcId =');

// 11. RateAnalysis.tsx
// `...* Assumed fixed rates */  for labor and tools for mixing/pouring...`
fix('src/components/modules/RateAnalysis.tsx',
  '/* Assumed fixed rates */  for labor and tools for mixing/pouring',
  '/* Assumed fixed rates for labor and tools for mixing/pouring');

// 12. RccStructureCalculator.tsx
// `...proximate extra weight */  for two-way bending / crank bars extr...`
fix('src/components/modules/RccStructureCalculator.tsx',
  '/* Approximate extra weight */  for two-way bending / crank bars extr',
  '/* Approximate extra weight for two-way bending / crank bars extr');

// 13. RigidPavementEstimator.tsx
// `...wc; /* Steel */  calculations const numTransverseJoints = sp_tra...`
fix('src/components/modules/RigidPavementEstimator.tsx',
  '/* Steel */  calculations const',
  '/* Steel calculations */ const');

// 14. RoadEstimator.tsx
// `...slope camber */  calculations const halfCarriage = w / 2; const ...`
fix('src/components/modules/RoadEstimator.tsx',
  '/* slope camber */  calculations const',
  '/* slope camber calculations */ const');

// 15. SettingsModal.tsx
// `...add this dummy state */  for account details to provide the visu...`
fix('src/components/modules/SettingsModal.tsx',
  '/* add this dummy state */  for account details to provide the visu',
  '/* add this dummy state for account details to provide the visu');

// 16. SewerageEstimator.tsx
// `... ~40L per user per year */  for 2 years = 80L/user) const sludge...`
fix('src/components/modules/SewerageEstimator.tsx',
  '/* ~40L per user per year */  for 2 years = 80L/user) const',
  '/* ~40L per user per year for 2 years = 80L/user) */ const');

// 17. ShareMenu.tsx
// `...simple toggle is okay */  for now. const formatText = () => { l...`
fix('src/components/modules/ShareMenu.tsx',
  '/* simple toggle is okay */  for now. const',
  '/* simple toggle is okay for now. */ const');

// 18. SlabSteelModule.tsx
// `...on SlabSteelModule({ slabLength = '5', slabWidth = '4', slabThic...`
fix('src/components/modules/SlabSteelModule.tsx',
  "SlabSteelModule({ slabLength = '5'",
  "SlabSteelModule({ slabLength = '5'");

// 19. StaircaseCalculator.tsx
// `...mSteps(15); setLandings([]); } }, [stairShape]); const [mainBarD...`
fix('src/components/modules/StaircaseCalculator.tsx',
  '}, [stairShape]); const [mainBarD',
  '}, [stairShape]); const [mainBarD');

// 20. Takeoff.tsx
// `...mate centering /> {isLinked */  && ( <Group x={12 / stageScale} ...`
fix('src/components/modules/Takeoff.tsx',
  '/* estimate centering /> {isLinked */  &&',
  '/* estimate centering */ {isLinked &&');

// 21. UnitConverter.tsx
// `...e by this to get unit */  (so base = unit / factor). Wait, actua...`
fix('src/components/modules/UnitConverter.tsx',
  '/* Divide by this to get unit */  (so base = unit / factor). Wait, actua',
  '/* Divide by this to get unit (so base = unit / factor). Wait, actua');

// 22. VolumeEstimator.tsx
// `.../ Math.PI * r / (6 * h * h || 1)) * (Math.pow(r * r + 4 * h * h,...`
fix('src/components/modules/VolumeEstimator.tsx',
  '/* Math.PI * r / (6 * h * h || 1)) * (Math.pow(r * r + 4 * h * h',
  '/* Math.PI * r / (6 * h * h || 1)) * (Math.pow(r * r + 4 * h * h');
