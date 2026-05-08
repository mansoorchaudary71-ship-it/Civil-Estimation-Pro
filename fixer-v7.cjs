const fs = require('fs');

function executeFix(f, finds, replaces) {
  try {
    let text = fs.readFileSync('src/components/modules/' + f, 'utf8');
    let original = text;
    for(let i=0; i<finds.length; i++) {
      text = text.replace(finds[i], replaces[i]);
    }
    if (text !== original) {
      fs.writeFileSync('src/components/modules/' + f, text, 'utf8');
      console.log(`[OK] ${f}`);
    }
  } catch(e) {}
}

executeFix('AreaCalculator.tsx',
  ['meters to */  input unit'],
  ['meters to input unit */ ']
);

executeFix('FormworkEstimator.tsx',
  ['[elements, repetitionFactor, wastagePct]'],
  ['[elements, repetitionFactor, wastagePct]'] // Maybe the actual issue is earlier?
);
// wait, Formwork estimator error is:
// `}, [elements, repetitionFactor, w...`
// I'll leave formwork for a second.

executeFix('GlobalSettingsModal.tsx',
  ['}); */  const defaultPrefs'],
  ['}); /* */  const defaultPrefs']
);

executeFix('HouseEstimator.tsx', 
  ['inputs setCustomRate'],
  ['inputs */ setCustomRate']
);

executeFix('ManholeModule.tsx',
  ['concrete */  calculations, let\'s assume if'],
  ['concrete calculations, let\'s assume if']
);

// Master Quantity: `/* Concrete & Masonry */ { id: "concrete",`
// Wait, the error is Expected ";" but found ":"
// Ah, `import /* Concrete & Masonry */ { id: "concrete"` No!
// It's `const CATEGORIES: CalcItem[] = [ /* Concrete & Masonry */ { id: "concrete", label: "Concrete" ...`
// Wait, why would there be a syntax error? Let's check the area.

executeFix('RateAnalysis.tsx',
  ['{/* Rate Inputs */} <section'],
  ['{/* Rate Inputs */} </section> <section']
); // is this what it needs? The error was `Expected ")" but found "<"` 
// so probably it's `...gap-8"> {/* Rate Inputs */} <section...` this is inside a JSX component. Wait, we've unbalanced JSX tags.

executeFix('RigidPavementEstimator.tsx',
  ['Wait, */  if w='],
  ['Wait, if w=']
);

executeFix('RoadEstimator.tsx',
  ['* L const'],
  ['* L; const']
);


executeFix('ShareMenu.tsx',
  ['indent: 1 }; /* Add date'],
  ['indent: 1 }; /* Add date */']
);

executeFix('SlabSteelModule.tsx',
  ['/* mm */  const [mainSpacing'],
  ['/* mm */ const [mainSpacing']
);

executeFix('Takeoff.tsx',
  [')} {/* Vertex circles */} {drawingPoints.map'],
  [')} {/* Vertex circles */} {drawingPoints.map']
);

executeFix('UnitConverter.tsx',
  ['easier: base */ * factor = unit.'],
  ['easier: base * factor = unit. */']
);

// RccStructureCalculator
// Append a `}` at the end if missing. Let's make sure.
