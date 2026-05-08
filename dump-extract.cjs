const fs = require('fs');

const extract = (f, charOffset) => {
  try {
    let t = fs.readFileSync('src/components/modules/' + f, 'utf8');
    return t.slice(Math.max(0, charOffset - 50), Math.min(t.length, charOffset + 50));
  } catch(e) {}
  return '';
}
console.log('Area:', extract('AreaCalculator.tsx', 4743));
console.log('Calculators:', extract('Calculators.tsx', 8572));
console.log('Formwork:', extract('FormworkEstimator.tsx', 2527));
console.log('Global:', extract('GlobalSettingsModal.tsx', 594));
console.log('House:', extract('HouseEstimator.tsx', 29907));
console.log('Manhole:', extract('ManholeModule.tsx', 2138));
console.log('Master:', extract('MasterQuantityEstimator.tsx', 88));
console.log('Rate:', extract('RateAnalysis.tsx', 2403));
console.log('Rigid:', extract('RigidPavementEstimator.tsx', 4016));
console.log('Road:', extract('RoadEstimator.tsx', 3134));
console.log('Share:', extract('ShareMenu.tsx', 6842));
console.log('Slab:', extract('SlabSteelModule.tsx', 218));
console.log('Staircase:', extract('StaircaseCalculator.tsx', 1352));
console.log('Takeoff:', extract('Takeoff.tsx', 16376));
console.log('Unit:', extract('UnitConverter.tsx', 353));
