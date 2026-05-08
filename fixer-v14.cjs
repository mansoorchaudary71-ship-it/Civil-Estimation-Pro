const fs = require('fs');

function replaceExact(file, searchStr, replaceStr) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let idx = content.indexOf(searchStr);
    if (idx !== -1) {
      content = content.replace(searchStr, replaceStr);
      fs.writeFileSync(file, content, 'utf8');
      console.log("Fixed", file);
    } else {
      console.log("Could not find exact string in", file);
    }
  } catch(e) {
    console.log("Error processing", file);
  }
}

// AreaCalculator.tsx
replaceExact('src/components/modules/AreaCalculator.tsx',
"/* Ramanujan's approximation */  for ellipse perimeter",
"/* Ramanujan's approximation for ellipse perimeter */");

// Calculators.tsx
replaceExact('src/components/modules/Calculators.tsx',
"/* cm or inches interface Opening { id: string; type: 'Door' | 'Window' | 'Ventilator'; quantity: number; length: number; height: number;  */ }",
"/* cm or inches */ interface Opening { id: string; type: 'Door' | 'Window' | 'Ventilator'; quantity: number; length: number; height: number; }");

// FormworkEstimator.tsx
replaceExact('src/components/modules/FormworkEstimator.tsx',
"if (item.type === 'column') { /* (2 * width * height) + (2 * length * height) area = ((2 * w * h) + (2 * l * h)) * c; colArea += area;  */ } else if (item.type === 'beam') { /* Bottom + 2 Sides (length * width) + (2 * length * depth) area = ((l * w) + (2 * l * h)) * c; beamArea += area;  */ } else if (item.type === 'slab') { /* Bottom + Perimeters area = ((l * w) + (2 * (l + w) * h)) * c; slabArea += area; }",
"if (item.type === 'column') { /* (2 * width * height) + (2 * length * height) */ area = ((2 * w * h) + (2 * l * h)) * c; colArea += area; } else if (item.type === 'beam') { /* Bottom + 2 Sides (length * width) + (2 * length * depth) */ area = ((l * w) + (2 * l * h)) * c; beamArea += area; } else if (item.type === 'slab') { /* Bottom + Perimeters */ area = ((l * w) + (2 * (l + w) * h)) * c; slabArea += area; }");

// FormworkEstimator again (bottom)
replaceExact('src/components/modules/FormworkEstimator.tsx',
"{ name: 'Columns', value: results.breakdown.colArea, color: '#f59e0b' }, /*  amber-500 { name: 'Slabs', value: */  results.breakdown.slabArea, color: '#f43f5e' }, /* rose-500 { name: 'Beams', value: results.breakdown.beamArea, color: '#6366f1' }, // indigo-500 ].filter(d => d.value > 0); }, [results]); */  return (",
"{ name: 'Columns', value: results.breakdown.colArea, color: '#f59e0b' }, /* amber-500 */ { name: 'Slabs', value: results.breakdown.slabArea, color: '#f43f5e' }, /* rose-500 */ { name: 'Beams', value: results.breakdown.beamArea, color: '#6366f1' }, /* indigo-500 */ ].filter((d: any) => d.value > 0); }, [results]); return (");


// GlobalSettingsModal.tsx
replaceExact('src/components/modules/GlobalSettingsModal.tsx',
"const [localRates, setLocalRates] = React.useState({ cement: rates.cement, steel: rates.steel * 1000, /*  stored per kg in context, per ton in modal */ bricks: rates.bricks * 1000, /* stored per piece in context, per 1000 in modal sand: rates.sand, crush: rates.crush, });",
"const [localRates, setLocalRates] = React.useState({ cement: rates.cement, steel: rates.steel * 1000, /* stored per kg in context, per ton in modal */ bricks: rates.bricks * 1000, /* stored per piece in context, per 1000 in modal */ sand: rates.sand, crush: rates.crush, });");

// ManholeModule.tsx
replaceExact('src/components/modules/ManholeModule.tsx',
"/* Used for circular diameter or rectangular length input const [mhInnerLen",
"/* Used for circular diameter or rectangular length input */ const [mhInnerLen");

replaceExact('src/components/modules/ManholeModule.tsx',
"const excD = baseD + 0.6; /* 300mm working space wallVol = */  Math.PI * Math.pow(outerD / 2, 2) * depth - Math.PI * Math.pow(len / 2, 2) * depth;",
"const excD = baseD + 0.6; /* 300mm working space */ wallVol = Math.PI * Math.pow(outerD / 2, 2) * depth - Math.PI * Math.pow(len / 2, 2) * depth;");

replaceExact('src/components/modules/ManholeModule.tsx',
"/* Standard brick metric 190x90x90 with mortar ~ 200x100x100 = 0.002m³ brickCount = */  Math.ceil(wallVol / 0.002); }",
"/* Standard brick metric 190x90x90 with mortar ~ 200x100x100 = 0.002m³ */ brickCount = Math.ceil(wallVol / 0.002); }");

replaceExact('src/components/modules/ManholeModule.tsx',
"/* cement volume in m3 */  const cementM3 = (totalDryConcrete * ratio.c) / totalRatio; const cementBags = Math.ceil(cementM3 / 0.0347); /* 50kg bag // sand in cft (1 m3 = 35.3147 cft) */  const sandCft",
"/* cement volume in m3 */  const cementM3 = (totalDryConcrete * ratio.c) / totalRatio; const cementBags = Math.ceil(cementM3 / 0.0347); /* 50kg bag, sand in cft (1 m3 = 35.3147 cft) */  const sandCft");

replaceExact('src/components/modules/ManholeModule.tsx',
"/* Let's recreate */  calculations for display const totalWetConcrete",
"/* Let's recreate calculations for display */ const totalWetConcrete");

// MasterQuantityEstimator.tsx
replaceExact('src/components/modules/MasterQuantityEstimator.tsx',
"} const calculatorsList: CalcItem[] = [ /* Concrete & Masonry */ { id: \"concrete\", label: \"Concrete\", group: \"Concrete & Masonry\", icon: Box }, { id: \"bricks\", label: \"Bricks\", group: \"Concrete & Masonry\", icon: Columns }, { id: \"blocks\", label: \"Blocks\", group: \"Concrete & Masonry\", icon: Container }, { id: \"plaster\", label: \"Plaster\", group: \"Concrete & Masonry\", icon: PaintBucket }, { id: \"concrete_test\", label: \"Concrete Test\", group: \"Concrete & Masonry\", icon: ClipboardList }",
"const calculatorsList: CalcItem[] = [ /* Concrete & Masonry */ { id: \"concrete\", label: \"Concrete\", group: \"Concrete & Masonry\", icon: Box }, { id: \"bricks\", label: \"Bricks\", group: \"Concrete & Masonry\", icon: Columns }, { id: \"blocks\", label: \"Blocks\", group: \"Concrete & Masonry\", icon: Container }, { id: \"plaster\", label: \"Plaster\", group: \"Concrete & Masonry\", icon: PaintBucket }, { id: \"concrete_test\", label: \"Concrete Test\", group: \"Concrete & Masonry\", icon: ClipboardList }");


