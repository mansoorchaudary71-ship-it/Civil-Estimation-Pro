import React, { useState } from 'react';
import { Spline, Triangle } from 'lucide-react';
import { MaterialSummary } from '../ui/MaterialSummary';
import { CalculationHistory } from '../ui/CalculationHistory';

export default function StaircaseDesignReference() {
  const [totalHeight, setTotalHeight] = useState<number>(3.0); // floor to floor
  const [riser, setRiser] = useState<number>(150); // mm
  const [going, setGoing] = useState<number>(250); // mm
  const [width, setWidth] = useState<number>(1.2); // m
  const [type, setType] = useState<string>('residential');

  const numberOfRisers = Math.ceil((totalHeight * 1000) / riser);
  const actualRiser = (totalHeight * 1000) / numberOfRisers;
  const numberOfTreads = numberOfRisers - 1; // straight flight assuming

  // Checker: 2R + G = 600-640mm
  const checkValue = (2 * actualRiser) + going;
  const isErgonomic = checkValue >= 600 && checkValue <= 640;

  let minWidth = 1.0;
  if (type === 'public') minWidth = 1.5;
  if (type === 'hospital') minWidth = 2.0;

  const isWidthOk = width >= minWidth;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
         <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Spline className="w-6 h-6 text-blue-500" />
          Staircase Design Reference (NBC)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
           <div>
             <label className="block text-sm font-semibold mb-2">Total Height / Fall (m)</label>
             <input type="number" step="0.1" value={totalHeight || ''} onChange={(e) => setTotalHeight(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl" />
           </div>
           <div>
             <label className="block text-sm font-semibold mb-2">Target Riser (mm)</label>
             <input type="number" value={riser || ''} onChange={(e) => setRiser(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl" />
           </div>
           <div>
             <label className="block text-sm font-semibold mb-2">Target Going/Tread (mm)</label>
             <input type="number" value={going || ''} onChange={(e) => setGoing(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl" />
           </div>
           <div>
             <label className="block text-sm font-semibold mb-2">Stair Width (m)</label>
             <input type="number" step="0.1" value={width || ''} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl" />
           </div>
           <div>
            <label className="block text-sm font-semibold mb-2">Occupancy Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl">
              <option value="residential">Residential</option>
              <option value="public">Public / Commercial</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
           <div className={`p-4 rounded-xl border \${isErgonomic ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'}`}>
              <p className="font-bold mb-1 text-slate-800 dark:text-slate-900 dark:text-white">Ergonomics (2R + G = 600-640)</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Score: <span className="font-bold">{checkValue.toFixed(1)} mm</span> (Actual Riser: {actualRiser.toFixed(1)}mm)</p>
              {isErgonomic ? <span className="text-emerald-600 font-bold text-sm">✓ Comfortable</span> : <span className="text-rose-600 font-bold text-sm">✗ Out of bounds</span>}
           </div>

           <div className={`p-4 rounded-xl border \${isWidthOk ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'}`}>
              <p className="font-bold mb-1 text-slate-800 dark:text-slate-900 dark:text-white">Minimum Width Check</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Required: {minWidth}m. Provided: {width}m</p>
              {isWidthOk ? <span className="text-emerald-600 font-bold text-sm">✓ Compliant</span> : <span className="text-rose-600 font-bold text-sm">✗ Needs wider stairs</span>}
           </div>
        </div>

        <MaterialSummary 
          items={[
            { division: "Layout", description: "Number of Risers", unit: "nos", quantity: numberOfRisers, rate: 0 },
            { division: "Layout", description: "Number of Treads (Straight flight)", unit: "nos", quantity: numberOfTreads, rate: 0 },
            { division: "Detail", description: "Adjusted Exact Riser Size", unit: "mm", quantity: actualRiser, rate: 0 },
          ]} 
          onUpdateRate={() => {}} 
          showRates={false} 
          totalValue={0}
        />
       </div>
    
      <CalculationHistory calculatorId="staircasedesignreference_tool" currentInputs={{}} />
</div>
  );
}
