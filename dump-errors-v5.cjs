const fs = require('fs');

function dump(file, regex) {
  try {
    const code = fs.readFileSync('src/components/modules/' + file, 'utf8');
    const m = code.match(regex);
    if (m) {
      console.log(`\n--- ${file} ---`);
      console.log(code.slice(Math.max(0, m.index - 50), Math.min(code.length, m.index + 50)));
    }
  } catch(e) {}
}

dump('AreaCalculator.tsx', /Convert/);
dump('Calculators.tsx', /waterLiters: /);
dump('FinishingEstimator.tsx', /for mortar/);
dump('FormworkEstimator.tsx', /repetitionFactor/);
dump('GlobalSettingsModal.tsx', /defaultPrefs:/);
dump('HouseEstimator.tsx', /add-ons/);
dump('ManholeModule.tsx', /let's assume/);
dump('MasterQuantityEstimator.tsx', /"concrete"/);
dump('RateAnalysis.tsx', /Rate Inputs/);
dump('RccStructureCalculator.tsx', /\}\n?$/);
dump('RigidPavementEstimator.tsx', /calculation to account/);
dump('RoadEstimator.tsx', /considering/);
dump('SettingsModal.tsx', /ly complete/);
dump('ShareMenu.tsx', /line\)/);
dump('SlabSteelModule.tsx', /SlabSteelModule\(/);
dump('StaircaseCalculator.tsx', /stairShape/);
dump('Takeoff.tsx', /Vertex circles/);
dump('UnitConverter.tsx', /base = unit/);

