import React, { useState } from 'react';
import { Columns, ArrowUpRight } from 'lucide-react';
import { MaterialSummary } from '../ui/MaterialSummary';
import { CalculationHistory } from '../ui/CalculationHistory';

export default function FarFsiCalculator() {
  const [plotArea, setPlotArea] = useState<number>(500);
  const [fsiAllowed, setFsiAllowed] = useState<number>(2.0);
  const [groundCoveragePerc, setGroundCoveragePerc] = useState<number>(50);

  const totalBuiltUpAllowed = plotArea * fsiAllowed;
  const maxFootprint = plotArea * (groundCoveragePerc / 100);
  const maxFloors = Math.floor(totalBuiltUpAllowed / maxFootprint);

  const results = [
    { division: "Regulatory", description: "Max Permissible Built-up Area", unit: "m²", quantity: totalBuiltUpAllowed, rate: 0 },
    { division: "Regulatory", description: "Max Ground Footprint", unit: "m²", quantity: maxFootprint, rate: 0 },
    { division: "Regulatory", description: "Estimated Max Floors", unit: "nos", quantity: maxFloors, rate: 0 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <ArrowUpRight className="w-6 h-6 text-amber-500" />
          FAR/FSI Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-2">Plot Area (m²)</label>
            <input type="number" value={plotArea || ''} onChange={(e) => setPlotArea(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Permissible FSI/FAR</label>
            <input type="number" step="0.1" value={fsiAllowed || ''} onChange={(e) => setFsiAllowed(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Max Ground Coverage (%)</label>
            <input type="number" max="100" value={groundCoveragePerc || ''} onChange={(e) => setGroundCoveragePerc(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-8">
           <h3 className="font-bold mb-3 text-slate-800 dark:text-slate-200">What is FAR/FSI?</h3>
           <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
             Floor Area Ratio (FAR) or Floor Space Index (FSI) is the ratio of a building's total floor area (gross floor area) to the size of the piece of land upon which it is built.
           </p>
           <p className="text-sm font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 inline-block">
             Total Built Area = Plot Area × FSI
           </p>
        </div>

        <MaterialSummary items={results} onUpdateRate={() => {}} showRates={false} totalValue={0} />
      </div>
    
      <CalculationHistory calculatorId="farfsicalculator_tool" currentInputs={{}} />
</div>
  );
}
