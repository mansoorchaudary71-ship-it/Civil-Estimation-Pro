const fs = require('fs');
const { execSync } = require('child_process');

function fix(file, regex, replace) {
  let content = fs.readFileSync('src/components/modules/' + file, 'utf8');
  if (regex.test(content)) {
    content = content.replace(regex, replace);
    fs.writeFileSync('src/components/modules/' + file, content, 'utf8');
    console.log(`Fixed ${file}: ${regex}`);
  }
}

// Calculators.tsx
fix('Calculators.tsx', /\/\* Global \*\/\s+inputs const/, '/* Global inputs */ const');
fix('Calculators.tsx', /\/\* Concrete \*\/\s+const/, '/* Concrete */ const');
fix('Calculators.tsx', /\/\* Bricks \*\/\s+const/, '/* Bricks */ const');

// AreaCalculator.tsx
fix('AreaCalculator.tsx', /\/\* Convert \*\/\s+input value built in input unit to meters/, '/* Convert input value built in input unit to meters */');
// wait, we see `Expected ";" but found "unit"`
fix('AreaCalculator.tsx', /\/\* Convert \*\/\s+area in sq\. meters to target output unit/, '/* Convert area in sq. meters to target output unit */');
fix('AreaCalculator.tsx', /\/\* Convert \*\/\s+perimeter in meters to input unit/, '/* Convert perimeter in meters to input unit */');
fix('AreaCalculator.tsx', /\/\* Convert input value built in input unit to meters \*\/\s+const/, '/* Convert input value built in input unit to meters */ const');
fix('AreaCalculator.tsx', /\/\* Convert area in sq\. meters to target output unit \*\/\s+const/, '/* Convert area in sq. meters to target output unit */ const');

// Takeoff.tsx
// wait, Takeoff has `<Circle ... /> )}`
fix('Takeoff.tsx', /\)\}\s+\{drawingPoints\.map/, ')} {/* Vertex circles */} {drawingPoints.map');
fix('Takeoff.tsx', /\{drawingPoints\.map\(\(p, i\) => \(\s+</, '{drawingPoints.map((p, i) => ( <');

// RoadEstimator.tsx
fix('RoadEstimator.tsx', /\/\* trapezoidal cross-section \*\/\s+calculations/i, '/* Trapezoidal cross-section calculations */');

// RigidPavementEstimator.tsx
fix('RigidPavementEstimator.tsx', /\/\* \+ \*\/\s+w/, '/* + w */');

// UnitConverter.tsx
fix('UnitConverter.tsx', /\/\* Multiply base by this to get unit \*\/\s*\(so base = unit \/ factor\)\./, '/* Multiply base by this to get unit (so base = unit / factor). */');
fix('UnitConverter.tsx', /\/\* Multiply base by this to get unit \(so base = unit \/ factor\)\. Wait, actually easier: base \*\//, '/* Multiply base by this to get unit (so base = unit / factor). Wait, actually easier: base */');
fix('UnitConverter.tsx', /\/\* Multiply base by this to get unit \*\/\s*so base = unit \/ factor\./, '/* Multiply base by this to get unit (so base = unit / factor). */');

// HouseEstimator.tsx
fix('HouseEstimator.tsx', /setCustomRate \*\//, 'setCustomRate */');

// Run esbuild
const files = fs.readdirSync('src/components/modules').filter(f => f.endsWith('.tsx'));
for (const file of files) {
  try {
    execSync(`npx esbuild src/components/modules/${file}`);
  } catch (e) {
    console.log(`\n\n--- FAILED: ${file} ---`);
    console.log(e.stderr ? e.stderr.toString() : e.message);
  }
}
