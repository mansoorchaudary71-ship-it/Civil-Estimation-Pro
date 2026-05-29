import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { CalculationHistory } from '../ui/CalculationHistory';

export default function ColumnDesignTool() {
  const [load, setLoad] = useState('1500');
  const [length, setLength] = useState('3.5');

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
         <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="text-pink-600" /> Column Design (IS 456 & 13920)
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Axial Load (kN)</label>
              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={load} onChange={e => setLoad(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Unsupported Length (m)</label>
              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={length} onChange={e => setLength(e.target.value)} />
            </div>
         </div>
         <div className="mt-8 p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-900">
            <p className="text-pink-800 dark:text-pink-200 font-medium text-center">Interactive interaction diagrams and bi-axial design calculations would appear here based on the selected section size and reinforcement arrangement.</p>
         </div>
      </div>
    
      <CalculationHistory calculatorId="columndesigntool_tool" currentInputs={{}} />
</div>
  );
}
