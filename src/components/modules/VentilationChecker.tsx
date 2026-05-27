import React, { useState } from 'react';
import { Wind, Sun } from 'lucide-react';
import { MaterialSummary } from '../ui/MaterialSummary';
import { CalculationHistory } from '../ui/CalculationHistory';

export default function VentilationChecker() {
  const [floorArea, setFloorArea] = useState<number>(20);
  const [totalWindowArea, setTotalWindowArea] = useState<number>(2.5);
  const [openableFraction, setOpenableFraction] = useState<number>(0.5); // 50% openable

  // NBC Rule: Light area >= 1/10th of floor area
  const reqLightArea = floorArea / 10;
  // NBC Rule: Ventilation area >= 1/20th of floor area (assuming openable is the vent area)
  // Or varies by climate. Let's use 10% total, 50% openable.
  const ventArea = totalWindowArea * openableFraction;
  const reqVentArea = floorArea / 20;

  const isLightOk = totalWindowArea >= reqLightArea;
  const isVentOk = ventArea >= reqVentArea;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
         <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
           <Wind className="w-6 h-6 text-cyan-500" />
           Ventilation & Lighting Checker
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2">Room Floor Area (m²)</label>
              <input type="number" value={floorArea || ''} onChange={(e) => setFloorArea(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Total Window Area (m²)</label>
              <input type="number" value={totalWindowArea || ''} onChange={(e) => setTotalWindowArea(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Openable Fraction (0-1)</label>
              <input type="number" step="0.1" max="1" value={openableFraction || ''} onChange={(e) => setOpenableFraction(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500" />
            </div>
         </div>

         <div className="space-y-4">
            <div className={`p-4 rounded-xl border flex items-center justify-between \${isLightOk ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200'}`}>
               <div>
                  <h4 className="font-bold flex items-center gap-2"><Sun className="w-4 h-4"/> Natural Lighting check</h4>
                  <p className="text-sm text-slate-600 mt-1">Required: {reqLightArea.toFixed(2)} m² (10% of floor area). Provided: {totalWindowArea.toFixed(2)} m²</p>
               </div>
               <span className={`font-black \${isLightOk ? 'text-emerald-500' : 'text-rose-500'}`}>{isLightOk ? 'PASS' : 'FAIL'}</span>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between \${isVentOk ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200'}`}>
               <div>
                  <h4 className="font-bold flex items-center gap-2"><Wind className="w-4 h-4"/> Natural Ventilation check</h4>
                  <p className="text-sm text-slate-600 mt-1">Required openable: {reqVentArea.toFixed(2)} m² (5% of floor area). Provided: {ventArea.toFixed(2)} m²</p>
               </div>
               <span className={`font-black \${isVentOk ? 'text-emerald-500' : 'text-rose-500'}`}>{isVentOk ? 'PASS' : 'FAIL'}</span>
            </div>
         </div>
       </div>
    
      <CalculationHistory calculatorId="ventilationchecker_tool" currentInputs={{}} />
</div>
  );
}
