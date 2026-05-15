import fs from 'fs';

const diameters = [6, 8, 10, 12, 16, 20, 25];
const metricLengths = [1, 12]; // meters
const imperialLengths = [1, 40]; // feet

const data: any[] = [];

diameters.forEach(d => {
  metricLengths.forEach(l => {
    const w = (d * d / 162.28) * l;
    data.push({
      slug: `weight-of-${d}mm-steel-bar-${l === 1 ? 'per-meter' : l + '-meter'}`,
      diameter_mm: d,
      length_metric: l,
      length_imperial: parseFloat((l * 3.28084).toFixed(3)),
      weight_kg: parseFloat(w.toFixed(3)),
      target_keyword: `${d}mm steel weight ${l === 1 ? 'per meter' : 'in ' + l + ' meters'} calculation`,
      related_keywords: ['sariya weight calculator', 'd2/162 formula', 'civil engineering steel estimation', 'RCC slab steel weight', `${d} mm sariya weight`, `unit weight of ${d}mm rebars`]
    });
  });

  imperialLengths.forEach(l => {
    const w = (d * d / 533) * l;
    data.push({
      slug: `weight-of-${d}mm-steel-bar-${l === 1 ? 'per-foot' : l + '-feet'}`,
      diameter_mm: d,
      length_metric: parseFloat((l / 3.28084).toFixed(3)),
      length_imperial: l,
      weight_kg: parseFloat(w.toFixed(3)),
      target_keyword: `${d}mm steel weight ${l === 1 ? 'per foot' : 'in ' + l + ' feet'} calculation`,
      related_keywords: ['sariya weight calculator', 'd2/533 formula', 'civil engineering steel estimation', `RCC slab steel weight`, `${d} mm sariya weight`, `weight of ${d}mm steel bar in kg`]
    });
  });
});

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/steelData.json', JSON.stringify(data.slice(0, 50), null, 2));
console.log('Generated ' + Math.min(data.length, 50) + ' items.');
