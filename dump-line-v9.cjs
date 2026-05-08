const fs = require('fs');

function extractLine(file, line) {
  let lines = fs.readFileSync('src/components/modules/' + file, 'utf8').split('\n');
  console.log(`\n==== ${file}:${line} ====`);
  console.log(lines[line - 1]);
}

extractLine('AreaCalculator.tsx', 9);
extractLine('FormworkEstimator.tsx', 6);
extractLine('GlobalSettingsModal.tsx', 6);
extractLine('HouseEstimator.tsx', 16);
extractLine('ManholeModule.tsx', 5);
extractLine('MasterQuantityEstimator.tsx', 9);
extractLine('RateAnalysis.tsx', 9);
extractLine('RigidPavementEstimator.tsx', 6);
extractLine('RoadEstimator.tsx', 5);
extractLine('ShareMenu.tsx', 20);
extractLine('SlabSteelModule.tsx', 4);
extractLine('StaircaseCalculator.tsx', 5);
extractLine('Takeoff.tsx', 9);
extractLine('UnitConverter.tsx', 4);
