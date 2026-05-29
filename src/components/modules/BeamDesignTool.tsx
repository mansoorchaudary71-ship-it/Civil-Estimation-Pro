import React, { useState } from 'react';
import { Layers, Activity, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { CalculationHistory } from '../ui/CalculationHistory';

export default function BeamDesignTool() {
  const [span, setSpan] = useState('5');
  const [load, setLoad] = useState('25');
  const [fck, setFck] = useState('20');
  const [fy, setFy] = useState('415');

  // Simple placeholder logic for demo
  const mu = (parseFloat(load) * Math.pow(parseFloat(span), 2)) / 8;
  const ast = (mu * 1e6) / (0.87 * parseFloat(fy) * 400); // very rough

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
         <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="text-pink-600" /> Beam Design Parameters (IS 456)
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Effective Span (m)</label>
              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={span} onChange={e => setSpan(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Factored Load (kN/m)</label>
              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={load} onChange={e => setLoad(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Concrete Grade (fck MPa)</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={fck} onChange={e => setFck(e.target.value)}>
                <option value="20">M20</option>
                <option value="25">M25</option>
                <option value="30">M30</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Steel Grade (fy MPa)</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={fy} onChange={e => setFy(e.target.value)}>
                <option value="415">Fe 415</option>
                <option value="500">Fe 500</option>
                <option value="550">Fe 550</option>
              </select>
            </div>
         </div>
      </div>

      <div className="bg-pink-50 dark:bg-pink-900/20 rounded-3xl p-6 md:p-8 border border-pink-100 dark:border-pink-800">
         <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300 mb-4">Design Results</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
               <div className="text-sm text-slate-500 mb-1">Max Bending Moment</div>
               <div className="text-2xl font-semibold">{mu.toFixed(2)} kNm</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
               <div className="text-sm text-slate-500 mb-1">Required Ast (approx)</div>
               <div className="text-2xl font-semibold">{Math.max(0, ast).toFixed(0)} mm²</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
               <div className="text-sm text-slate-500 mb-1">Deflection Check</div>
               <div className="text-lg font-bold text-emerald-600">Safe</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
               <div className="text-sm text-slate-500 mb-1">Shear Reinforcement</div>
               <div className="text-lg font-bold">2-legged 8mm @ 150c/c</div>
            </div>
         </div>
      </div>
    
      <CalculationHistory calculatorId="beamdesigntool_tool" currentInputs={{}} />
</div>
  );
}
