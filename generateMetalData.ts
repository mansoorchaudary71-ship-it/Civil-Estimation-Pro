import fs from 'fs';

const data: any[] = [];
const density = 7850; // kg/m^3

const roundSizes = [6, 8, 10, 12, 16, 20, 22, 25, 28, 32, 36, 40];
const squareSizes = [6, 8, 10, 12, 16, 20, 25, 30, 32, 40];
const pipeSizes = [
  { d: 20, t: 2 }, { d: 25, t: 2.5 }, { d: 32, t: 3 }, { d: 40, t: 3.2 },
  { d: 50, t: 3.6 }, { d: 65, t: 4 }, { d: 80, t: 4.5 }, { d: 100, t: 5 }
];

const lengths = [
  { val: 1, unit: 'm', m: 1 },
  { val: 2, unit: 'm', m: 2 },
  { val: 3, unit: 'm', m: 3 },
  { val: 6, unit: 'm', m: 6 },
  { val: 12, unit: 'm', m: 12 },
  { val: 1, unit: 'ft', m: 0.3048 },
  { val: 5, unit: 'ft', m: 1.524 },
  { val: 10, unit: 'ft', m: 3.048 },
  { val: 20, unit: 'ft', m: 6.096 },
  { val: 40, unit: 'ft', m: 12.192 }
];

roundSizes.forEach(d => {
  lengths.forEach(l => {
    const dM = d / 1000;
    const volume = Math.PI * Math.pow(dM / 2, 2) * l.m;
    const weight = volume * density;
    const slug = `weight-of-${d}mm-round-steel-bar-${l.val}-${l.unit}`;
    data.push({
      slug,
      material_type: "Steel",
      profile: "Round Bar",
      diameter_mm: d,
      length_m: parseFloat(l.m.toFixed(4)),
      weight_kg: parseFloat(weight.toFixed(3)),
      target_keyword: `${d}mm round steel bar weight ${l.val} ${l.unit} calculation`,
      related_keywords: ['steel bar mass per meter', 'rebar weight formula', 'structural steel estimation']
    });
  });
});

squareSizes.forEach(d => {
  lengths.forEach(l => {
    const dM = d / 1000;
    const volume = dM * dM * l.m;
    const weight = volume * density;
    const slug = `weight-of-${d}mm-square-steel-bar-${l.val}-${l.unit}`;
    data.push({
      slug,
      material_type: "Steel",
      profile: "Square Bar",
      diameter_mm: d,
      length_m: parseFloat(l.m.toFixed(4)),
      weight_kg: parseFloat(weight.toFixed(3)),
      target_keyword: `${d}mm square steel bar weight ${l.val} ${l.unit} calculation`,
      related_keywords: ['square steel bar weight calculator', 'structural steel estimation']
    });
  });
});

pipeSizes.forEach(size => {
  lengths.forEach(l => {
    const dOuter = size.d / 1000;
    const t = size.t / 1000;
    const dInner = dOuter - 2 * t;
    const rOuter = dOuter / 2;
    const rInner = dInner / 2;
    const volume = Math.PI * (rOuter * rOuter - rInner * rInner) * l.m;
    const weight = volume * density;
    const slug = `weight-of-${size.d}mm-steel-pipe-${l.val}-${l.unit}`;
    data.push({
      slug,
      material_type: "Steel",
      profile: "Steel Pipe",
      diameter_mm: size.d,
      wall_thickness_mm: size.t,
      length_m: parseFloat(l.m.toFixed(4)),
      weight_kg: parseFloat(weight.toFixed(3)),
      target_keyword: `${size.d}mm steel pipe weight ${l.val} ${l.unit} calculation`,
      related_keywords: ['hollow steel pipe weight', 'civil engineering steel pipe weight', 'tubular steel estimation']
    });
  });
});

const outData = data.slice(0, 300);

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/metalData.json', JSON.stringify(outData, null, 2));
console.log('Generated ' + outData.length + ' items.');
