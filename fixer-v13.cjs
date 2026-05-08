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

// AreaCalculator
replaceExact('src/components/modules/AreaCalculator.tsx',
"/* Convert perimeter in meters to */  input unit (usually perimeter is shown in same unit as input, or user might want something else, let's keep it in input unit or meters) const formatPerimeter",
"/* Convert perimeter in meters to input unit (usually perimeter is shown in same unit as input, or user might want something else, let's keep it in input unit or meters) */ const formatPerimeter");

// Calculators.tsx
replaceExact('src/components/modules/Calculators.tsx',
"/* Convert cm/inches to appropriate units in */  calculator /* The */  calculator expects base units for wall (like meters or feet) /* but the br",
"/* Convert cm/inches to appropriate units in calculator */ /* The calculator expects base units for wall (like meters or feet) /* but the br");

// FormworkEstimator.tsx
replaceExact('src/components/modules/FormworkEstimator.tsx',
"} totalAreaSqm += area; }); */  const totalAreaSqft",
"} totalAreaSqm += area; }); /* */ const totalAreaSqft");

// GlobalSettingsModal.tsx
replaceExact('src/components/modules/GlobalSettingsModal.tsx',
"crush: rates.crush, }); */  const defaultPrefs: ModulePreferences",
"crush: rates.crush, }); /* */ const defaultPrefs: ModulePreferences");

// HouseEstimator.tsx
replaceExact('src/components/modules/HouseEstimator.tsx',
"/* Prevent negative */  inputs setCustomRate",
"/* Prevent negative inputs */ setCustomRate");

// ManholeModule.tsx
replaceExact('src/components/modules/ManholeModule.tsx',
"/* Concrete is used in base and top slab. (Walls could be brick or concrete. Since we want concrete */  calculations, let's assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let's calculate total concrete for Base + Top Slab + optionally wall if circular). /* Let's assume the user wants concrete details */  for base & top slab.",
"/* Concrete is used in base and top slab. Walls could be brick or concrete. Since we want concrete calculations, let's assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let's calculate total concrete for Base + Top Slab + optionally wall if circular). Let's assume the user wants concrete details for base & top slab. */");

// RateAnalysis.tsx
replaceExact('src/components/modules/RateAnalysis.tsx',
"/* Assumed fixed rates for labor and tools for mixing/pouring 1m3 const costLabor",
"/* Assumed fixed rates for labor and tools for mixing/pouring 1m3 */ const costLabor");

// RigidPavementEstimator.tsx
replaceExact('src/components/modules/RigidPavementEstimator.tsx',
"// Wait, */  if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? /* Let's use */  Math.floor",
"/* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use */ Math.floor");

// RoadEstimator.tsx
replaceExact('src/components/modules/RoadEstimator.tsx',
"/* calculational Areas strictly following typical trapezoidal */  calculation: V = ((W_top + W_bot) / 2) * t * L const areaAsp",
"/* calculational Areas strictly following typical trapezoidal calculation: V = ((W_top + W_bot) / 2) * t * L */ const areaAsp");

// ShareMenu.tsx
replaceExact('src/components/modules/ShareMenu.tsx',
": 'FF282A65' } /*  Navy Blue }; titleCell.alignment */  = {",
": 'FF282A65' }; /* Navy Blue */ titleCell.alignment = {");

// StaircaseCalculator.tsx
replaceExact('src/components/modules/StaircaseCalculator.tsx',
"ers based on shape useEffect(() => { */  if",
"ers based on shape */ useEffect(() => { if");

// UnitConverter.tsx
replaceExact('src/components/modules/UnitConverter.tsx',
"easier: base */ * factor = unit. Or base_value = unit_value * factor. Let's use: base_value ",
"easier: base * factor = unit. Or base_value = unit_value * factor. Let's use: base_value */");

// And for MasterQuantityEstimator, I'll use regex because whitespace might be weird.
// Wait, actually I can just do indexOf('import { Calculator, Box, Layers,') 
let mqe = fs.readFileSync('src/components/modules/MasterQuantityEstimator.tsx', 'utf8');
let badStart = mqe.indexOf('import { Calculator, Box');
let badEnd = mqe.indexOf('} const calculatorsList');
if (badStart !== -1 && badEnd !== -1) {
  let badChunk = mqe.substring(badStart, badEnd + 1);
  mqe = mqe.replace(badChunk, 'import { Calculator, Box, Layers, Columns, PaintBucket, Truck, ArrowRightLeft, Ruler, Square, Container, ClipboardList, Pickaxe, Map, Waves, Droplet, Zap, Maximize2 } from "lucide-react";\n\ninterface CalcItem {\nid: string;\nlabel: string;\ngroup: string;\nicon: any;\n}');
  fs.writeFileSync('src/components/modules/MasterQuantityEstimator.tsx', mqe, 'utf8');
  console.log("Fixed MQE");
}

let rcc = fs.readFileSync('src/components/modules/RccStructureCalculator.tsx', 'utf8');
if (!rcc.trim().endsWith('}')) {
  fs.writeFileSync('src/components/modules/RccStructureCalculator.tsx', rcc + '\n}\n', 'utf8');
  console.log("Fixed RCC");
}

