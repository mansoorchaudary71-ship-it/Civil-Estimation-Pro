const fs = require('fs');
let code = fs.readFileSync('src/components/modules/Brickwork9InchModule.tsx', 'utf8');

const startStr = '          {/* Results Column */}';
const start = code.indexOf(startStr);
const endStr = '          <div className="mt-6 flex flex-wrap gap-4 items-center">\n            \n          </div>\n        </div>';
const end = code.indexOf(endStr) + endStr.length;

if (start === -1 || end === -1 || start >= end) {
  console.error('Could not find bounds');
  process.exit(1);
}

const replacement = `          {/* Results Section */}
          <div className="w-full pt-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Calculation Results
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <ResultCard 
                title="Total Bricks" 
                value={results.noOfBricks.toLocaleString()} 
                unit="pcs" 
                variant="primary" 
                icon={<Box className="w-5 h-5 text-indigo-500" />} 
                description="Final workable count"
              />
              <ResultCard 
                title="Cement Total" 
                value={results.cementBags.toString()} 
                unit="bags" 
                variant="secondary" 
                icon={<Construction className="w-5 h-5 text-blue-500" />} 
                description="50kg standard bags"
              />
              <ResultCard 
                title="Sand Total" 
                value={results.sandCft.toFixed(1)} 
                unit="cft" 
                variant="warning" 
                icon={<Layers className="w-5 h-5 text-amber-500" />} 
                description="Fine aggregate volume"
              />
              <ResultCard 
                title="Dry Mortar" 
                value={results.dryMortarVol.toFixed(2)} 
                unit={results.isSI ? 'm³' : 'cft'} 
                variant="neutral" 
                icon={<Droplets className="w-5 h-5 text-slate-500" />} 
                description="Required mortar mix"
              />
            </div>
            
            <div className="w-full">
              <StyledChart 
                data={[
                  { name: "Bricks Volume", value: Math.round(results.volumeOfBricksDisplay), fill: '#f97316' },
                  { name: "Mortar Volume", value: Math.round(results.wetMortarVol), fill: '#64748b' }
                ]}
                type="pie"
                title="Wall Volume Breakdown"
                valueFormatter={(val) => \`\${val} \${results.isSI ? 'm³' : 'cft'}\`}
              />
            </div>
          </div>
        </div>`;

code = code.substring(0, start) + replacement + code.substring(end);
fs.writeFileSync('src/components/modules/Brickwork9InchModule.tsx', code);
console.log('Replaced successfully');