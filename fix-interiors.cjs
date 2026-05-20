const fs = require('fs');

const fileName = 'src/components/modules/InteriorsFinishes.tsx';

let txt = fs.readFileSync(fileName, 'utf8');

// I will do simple string replacement for the 10 blocks:

const blocksToReplace = [
  {
    find: `              {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Required Tiles (inc. 5% waste)"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.numTiles}</span>
                  {"tiles" && <span className="text-sm font-semibold text-slate-300">{"tiles"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Required Tiles (inc. 5% waste)" value={results.numTiles} unit="tiles" variant="neutral" />`
  },
  {
    find: `              {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Boxes Required"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.boxesReq}</span>
                  {"boxes" && <span className="text-sm font-semibold text-slate-300">{"boxes"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Boxes Required" value={results.boxesReq} unit="boxes" variant="primary" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Required Paint"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.liters}</span>
                  {"Liters" && <span className="text-sm font-semibold text-slate-300">{"Liters"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Required Paint" value={results.liters} unit="Liters" variant="warning" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"In Gallons (US)"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.gallons}</span>
                  {"gals" && <span className="text-sm font-semibold text-slate-300">{"gals"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="In Gallons (US)" value={results.gallons} unit="gals" variant="neutral" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Net Printable / Plaster Area"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{netArea > 0 ? netArea.toFixed(2) : 0}</span>
                  {uArea && <span className="text-sm font-semibold text-slate-300">{uArea}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Net Printable / Plaster Area" value={netArea > 0 ? netArea.toFixed(2) : 0} unit={uArea} variant="primary" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Total Deductions"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{totalDeduction.toFixed(2)}</span>
                  {uArea && <span className="text-sm font-semibold text-slate-300">{uArea}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Total Deductions" value={totalDeduction.toFixed(2)} unit={uArea} variant="warning" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Total Studs Required"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.studs}</span>
                  {"studs" && <span className="text-sm font-semibold text-slate-300">{"studs"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Total Studs Required" value={results.studs} unit="studs" variant="primary" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{\`Top & Bottom Plates (\${results.plateLengthDesc} boards)\`}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.plates}</span>
                  {"boards" && <span className="text-sm font-semibold text-slate-300">{"boards"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title={\`Top & Bottom Plates (\${results.plateLengthDesc} boards)\`} value={results.plates} unit="boards" variant="neutral" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Chemical Emulsion Required"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.liters}</span>
                  {"Liters" && <span className="text-sm font-semibold text-slate-300">{"Liters"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="Chemical Emulsion Required" value={results.liters} unit="Liters" variant="warning" />`
  },
  {
    find: `            {/* Hardcoded Result Reverted */}
              <div className={\`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \${""}\`}>
                <div className="flex items-center gap-2 mb-2">
                  
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"In Gallons (US)"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.gallons}</span>
                  {"gals" && <span className="text-sm font-semibold text-slate-300">{"gals"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>`,
    replace: `              <ResultCard title="In Gallons (US)" value={results.gallons} unit="gals" variant="neutral" />`
  }
];

let replacedCount = 0;
blocksToReplace.forEach(block => {
  if (txt.includes(block.find)) {
    txt = txt.replace(block.find, block.replace);
    replacedCount++;
  }
});

// Add import if needed
if (replacedCount > 0 && !txt.includes('ResultCard')) {
  let importMatch = txt.match(/import\s+[^;]+;\n/g);
  if (importMatch) {
    let lastImport = importMatch[importMatch.length - 1];
    txt = txt.replace(lastImport, lastImport + `import { ResultCard } from "../ui/ResultCard";\n`);
  }
  fs.writeFileSync(fileName, txt);
  console.log(`Replaced ${replacedCount} blocks in InteriorsFinishes.tsx`);
} else {
  console.log("Blocks not found or already replaced.");
}
