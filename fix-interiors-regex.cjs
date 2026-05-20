const fs = require('fs');
let txt = fs.readFileSync('src/components/modules/InteriorsFinishes.tsx', 'utf8');

// Replace tile 1
txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Required Tiles \(inc\. 5% waste\)"\}<\/span>[\s\S]*?\{results\.numTiles\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Required Tiles (inc. 5% waste)" value={results.numTiles} unit="tiles" variant="neutral" />`);

// Replace tile 2
txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Boxes Required"\}<\/span>[\s\S]*?\{results\.boxesReq\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Boxes Required" value={results.boxesReq} unit="boxes" variant="primary" />`);

// Paint
txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Required Paint"\}<\/span>[\s\S]*?\{results\.liters\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Required Paint" value={results.liters} unit="Liters" variant="warning" />`);

txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"In Gallons \(US\)"\}<\/span>[\s\S]*?\{results\.gallons\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="In Gallons (US)" value={results.gallons} unit="gals" variant="neutral" />`);

// Plaster
txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Net Printable \/ Plaster Area"\}<\/span>[\s\S]*?\{netArea > 0 \? netArea\.toFixed\(2\) : 0\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Net Printable / Plaster Area" value={netArea > 0 ? netArea.toFixed(2) : 0} unit={uArea} variant="primary" />`);

txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Total Deductions"\}<\/span>[\s\S]*?\{totalDeduction\.toFixed\(2\)\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Total Deductions" value={totalDeduction.toFixed(2)} unit={uArea} variant="warning" />`);


// Studs
txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Total Studs Required"\}<\/span>[\s\S]*?\{results\.studs\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Total Studs Required" value={results.studs} unit="studs" variant="primary" />`);

txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{`Top & Bottom Plates \(\$\{results\.plateLengthDesc\}\ boards\)`\}<\/span>[\s\S]*?\{results\.plates\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title={\`Top & Bottom Plates (\${results.plateLengthDesc} boards)\`} value={results.plates} unit="boards" variant="neutral" />`);

// Treating Termites
txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"Chemical Emulsion Required"\}<\/span>[\s\S]*?\{results\.liters\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="Chemical Emulsion Required" value={results.liters} unit="Liters" variant="warning" />`);

txt = txt.replace(/\{\/\*\s*Hardcoded Result Reverted\s*\*\/\}\s*<div[\s\S]*?\{"In Gallons \(US\)"\}<\/span>[\s\S]*?\{results\.gallons\}<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<ResultCard title="In Gallons (US)" value={results.gallons} unit="gals" variant="neutral" />`);

if (!txt.includes('ResultCard')) {
  let importMatch = txt.match(/import\s+[^;]+;\n/g);
  let lastImport = importMatch[importMatch.length - 1];
  txt = txt.replace(lastImport, lastImport + `import { ResultCard } from "../ui/ResultCard";\n`);
}

fs.writeFileSync('src/components/modules/InteriorsFinishes.tsx', txt);
console.log("Done");
