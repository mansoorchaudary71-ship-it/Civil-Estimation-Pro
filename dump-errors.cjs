const fs = require('fs');

const targets = {
  'AreaCalculator.tsx': /id: "RightTriangle",/,
  'FinishingEstimator.tsx': /const \[paintCoverage/,
  'FormworkEstimator.tsx': /\]as/,
  'GlobalSettingsModal.tsx': /defaultPrefs/,
  'HouseEstimator.tsx': /Grey Structure/,
  'ManholeModule.tsx': /circular -> concrete rings/,
  'MasterQuantityEstimator.tsx': /label: "Concrete"/,
  'RateAnalysis.tsx': /Rate Inputs/,
  'RccStructureCalculator.tsx': /hook const/,
  'RigidPavementEstimator.tsx': /longitudinal joint/,
  'RoadEstimator.tsx': /slope camber/,
  'SettingsModal.tsx': /dummy state/,
  'SewerageEstimator.tsx': /\~40L/,
  'ShareMenu.tsx': /simple toggle is okay/,
  'SlabSteelModule.tsx': /SlabSteelModule/,
  'StaircaseCalculator.tsx': /stairShape/,
  'Takeoff.tsx': /Current Drawing Line/,
  'UnitConverter.tsx': /Divide by this to get unit/,
  'VolumeEstimator.tsx': /6 \* h \* h/
};

for (const [file, r] of Object.entries(targets)) {
  try {
    const content = fs.readFileSync('src/components/modules/' + file, 'utf8');
    const m = content.match(r);
    if (m) {
      const idx = m.index;
      console.log(`\n--- ${file} ---`);
      console.log(content.slice(Math.max(0, idx - 50), Math.min(content.length, idx + 50)));
    } else {
      console.log(`No match in ${file} for ${r}`);
    }
  } catch (e) {
    console.log(`Error ${file}`);
  }
}
