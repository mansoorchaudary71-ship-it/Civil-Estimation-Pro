const fs = require('fs');
const path = require('path');
const dir = './src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
const missing = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  if (!content.includes('CalculationHistory')) {
    missing.push(f);
  }
});
console.log(missing);
