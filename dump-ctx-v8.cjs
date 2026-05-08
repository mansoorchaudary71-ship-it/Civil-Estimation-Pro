const fs = require('fs');

const dumpCtx = (file, str) => {
  try {
    const code = fs.readFileSync('src/components/modules/' + file, 'utf8');
    const idx = code.indexOf(str);
    if(idx > -1) {
      console.log(`\n==== ${file}: '${str}' ====`);
      console.log(code.slice(Math.max(0, idx - 100), Math.min(code.length, idx + 100)));
    } else {
      console.log(`\n==== ${file}: '${str}' (NOT FOUND) ====`);
    }
  } catch(e) {}
}

dumpCtx('AreaCalculator.tsx', 'imeters to */  input unit');
dumpCtx('Calculators.tsx', '*/  calculator /* The */');
dumpCtx('FormworkEstimator.tsx', '}, [elements, repetitionFactor, w');
dumpCtx('GlobalSettingsModal.tsx', '}); */  const defaultPrefs');
dumpCtx('HouseEstimator.tsx', 'inputs setCustomRate(item.key');
dumpCtx('ManholeModule.tsx', 'let\'s assume if circular');
dumpCtx('MasterQuantityEstimator.tsx', '*/ { id: "concrete"');
dumpCtx('RateAnalysis.tsx', 'gap-8"> {/* Rate Inputs */} <section');
dumpCtx('RccStructureCalculator.tsx', 'export default function');
dumpCtx('RigidPavementEstimator.tsx', 'Wait, */  if w=');
dumpCtx('RoadEstimator.tsx', 'L const areaAsp');
dumpCtx('ShareMenu.tsx', 'indent: 1 }; /* Add date aligned');
dumpCtx('SlabSteelModule.tsx', '/* mm */  const [mainSpacing');
dumpCtx('StaircaseCalculator.tsx', 'setLandings([]); } }, [stairShape]);');
dumpCtx('Takeoff.tsx', ')} {/* Vertex circles */} {drawingPoints');
dumpCtx('UnitConverter.tsx', 'actually easier: base */ * factor');
