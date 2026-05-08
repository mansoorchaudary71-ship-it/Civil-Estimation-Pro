const fs = require('fs');

function replaceAll(f, searchPrefix, replaceWith) {
  try {
    let text = fs.readFileSync('src/components/modules/' + f, 'utf8');
    const regex = new RegExp(searchPrefix, "g");
    text = text.replace(regex, replaceWith);
    fs.writeFileSync('src/components/modules/' + f, text, 'utf8');
  } catch(e) {
    console.log("Failed on", f, e.message);
  }
}

// 1. AreaCalculator.tsx
let f1 = fs.readFileSync('src/components/modules/AreaCalculator.tsx', 'utf8');
f1 = f1.replace(/\/\* Convert perimeter in meters to \*\/\s*input unit \(usually perimeter is shown in same unit as input, or user might want something else, let's keep it in input unit or meters\) const formatPerimeter/g,
  "/* Convert perimeter in meters to input unit (usually perimeter is shown in same unit as input, or user might want something else, let's keep it in input unit or meters) */ const formatPerimeter"
);
fs.writeFileSync('src/components/modules/AreaCalculator.tsx', f1, 'utf8');

// 2. Calculators.tsx
let f2 = fs.readFileSync('src/components/modules/Calculators.tsx', 'utf8');
f2 = f2.replace(/\/\* Convert cm\/inches to appropriate units in \*\/\s*calculator \/\* The \*\/\s*calculator expects base units for wall \(like meters or feet\) \/\* but the br/g, 
  "/* Convert cm/inches to appropriate units in calculator. The calculator expects base units for wall (like meters or feet) but the br"
);
fs.writeFileSync('src/components/modules/Calculators.tsx', f2, 'utf8');

// 3. FormworkEstimator.tsx
let f3 = fs.readFileSync('src/components/modules/FormworkEstimator.tsx', 'utf8');
f3 = f3.replace(/\}\s*totalAreaSqm \+= area;\s*\}\);\s*\*\//g, 
  "} totalAreaSqm += area; }); /* */"
);
fs.writeFileSync('src/components/modules/FormworkEstimator.tsx', f3, 'utf8');

// 4. GlobalSettingsModal.tsx
let f4 = fs.readFileSync('src/components/modules/GlobalSettingsModal.tsx', 'utf8');
f4 = f4.replace(/sand:\s*rates\.sand,\s*crush:\s*rates\.crush,\s*\}\);\s*\*\/\s*const defaultPrefs:/g,
  "sand: rates.sand, crush: rates.crush, }); /* */ const defaultPrefs:"
);
fs.writeFileSync('src/components/modules/GlobalSettingsModal.tsx', f4, 'utf8');

// 5. HouseEstimator.tsx
let f5 = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf8');
f5 = f5.replace(/\/\*\s*Prevent negative\s*\*\/\s*inputs setCustomRate/g,
  "/* Prevent negative inputs */ setCustomRate"
);
fs.writeFileSync('src/components/modules/HouseEstimator.tsx', f5, 'utf8');

// 6. ManholeModule.tsx
let f6 = fs.readFileSync('src/components/modules/ManholeModule.tsx', 'utf8');
f6 = f6.replace(/\/\*\s*Concrete is used in base and top slab\. \(Walls could be brick or concrete\. Since we want concrete\s*\*\/\s*calculations, let's assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick\. Let's calculate total concrete for Base \+ Top Slab \+ optionally wall if circular\)\.\s*\/\*\s*Let's assume the user wants concrete details\s*\*\/\s*for base & top slab\./g,
  "/* Concrete is used in base and top slab. Walls could be brick or concrete. Since we want concrete calculations, let's assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let's calculate total concrete for Base + Top Slab + optionally wall if circular. Let's assume the user wants concrete details for base & top slab. */"
);
fs.writeFileSync('src/components/modules/ManholeModule.tsx', f6, 'utf8');

// 7. MasterQuantityEstimator.tsx
let f7 = fs.readFileSync('src/components/modules/MasterQuantityEstimator.tsx', 'utf8');
f7 = f7.replace(/import \{ Calculator, Box, Layers, Columns, PaintBucket, Truck, ArrowRightLeft, Ruler, Square, Con.*?el: string;\s*group: string;\s*icon: any;\s*\}/g,
  `import { Calculator, Box, Layers, Columns, PaintBucket, Truck, ArrowRightLeft, Ruler, Square, Container, ClipboardList, Pickaxe, Map, Waves, Droplet, Zap, Maximize2 } from "lucide-react";\n\ninterface CalcItem {\nid: string;\nlabel: string;\ngroup: string;\nicon: any;\n}`
);
fs.writeFileSync('src/components/modules/MasterQuantityEstimator.tsx', f7, 'utf8');

// 8. RateAnalysis.tsx
let f8 = fs.readFileSync('src/components/modules/RateAnalysis.tsx', 'utf8');
f8 = f8.replace(/\/\*\s*Assumed fixed rates for labor and tools for mixing\/pouring 1m3\s*const costLabor/g,
  "/* Assumed fixed rates for labor and tools for mixing/pouring 1m3 */ const costLabor"
);
fs.writeFileSync('src/components/modules/RateAnalysis.tsx', f8, 'utf8');

// 9. RccStructureCalculator.tsx
let f9 = fs.readFileSync('src/components/modules/RccStructureCalculator.tsx', 'utf8');
if (!f9.trim().endsWith('}')) {
  f9 += '\n}\n';
}
fs.writeFileSync('src/components/modules/RccStructureCalculator.tsx', f9, 'utf8');

// 10. RigidPavementEstimator.tsx
let f10 = fs.readFileSync('src/components/modules/RigidPavementEstimator.tsx', 'utf8');
f10 = f10.replace(/\/\/\s*Wait,\s*\*\/\s*if w=7\.5,\s*sp_long=3\.5,\s*w\/sp=2\.14 -> 2 inner joints\?\s*\/\*\s*Let's use\s*\*\/\s*Math\.floor/g,
  "/* Wait, if w=7.5, sp_long=3.5, w/sp=2.14 -> 2 inner joints? Let's use */ Math.floor"
);
fs.writeFileSync('src/components/modules/RigidPavementEstimator.tsx', f10, 'utf8');

// 11. RoadEstimator.tsx
let f11 = fs.readFileSync('src/components/modules/RoadEstimator.tsx', 'utf8');
f11 = f11.replace(/\/\*\s*calculational Areas strictly following typical trapezoidal\s*\*\/\s*calculation: V = \(\(W_top \+ W_bot\) \/ 2\) \* t \* L\s*const areaAsp =/g,
  "/* calculational Areas strictly following typical trapezoidal calculation: V = ((W_top + W_bot) / 2) * t * L */ const areaAsp ="
);
fs.writeFileSync('src/components/modules/RoadEstimator.tsx', f11, 'utf8');

// 12. ShareMenu.tsx
let f12 = fs.readFileSync('src/components/modules/ShareMenu.tsx', 'utf8');
f12 = f12.replace(/:\s*'FF282A65'\s*\}\s*\/\*\s*Navy Blue\s*\}\;\s*titleCell\.alignment\s*\*\/\s*=\s*\{/g,
  ": 'FF282A65' }; /* Navy Blue */ titleCell.alignment = {"
);
fs.writeFileSync('src/components/modules/ShareMenu.tsx', f12, 'utf8');

// 13. StaircaseCalculator.tsx
let f13 = fs.readFileSync('src/components/modules/StaircaseCalculator.tsx', 'utf8');
f13 = f13.replace(/ers based on shape useEffect\(\(\) => \{\s*\*\/\s*if/g,
  "ers based on shape */ useEffect(() => { if"
);
fs.writeFileSync('src/components/modules/StaircaseCalculator.tsx', f13, 'utf8');

// 14. UnitConverter.tsx
let f14 = fs.readFileSync('src/components/modules/UnitConverter.tsx', 'utf8');
f14 = f14.replace(/easier: base\s*\*\/\s*\*\s*factor = unit\.\s*Or base_value = unit_value \*\s*factor\.\s*Let's use: base_value/g,
  "easier: base * factor = unit. Or base_value = unit_value * factor. Let's use: base_value */"
);
fs.writeFileSync('src/components/modules/UnitConverter.tsx', f14, 'utf8');

console.log("Applied v10 fixes.");
