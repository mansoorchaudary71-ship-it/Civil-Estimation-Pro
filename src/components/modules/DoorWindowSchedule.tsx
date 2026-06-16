import React, { useState } from 'react';
import { Columns, Save } from 'lucide-react';
import { CalculationHistory } from '../ui/CalculationHistory';

interface Entry {
  id: string;
  type: string;
  w: number;
  h: number;
  qty: number;
  notes: string;
}

export default function DoorWindowSchedule() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', type: 'D1 (Main)', w: 1.2, h: 2.1, qty: 1, notes: 'Solid Wood' },
    { id: '2', type: 'D2 (Room)', w: 0.9, h: 2.1, qty: 3, notes: 'Flush Door' },
    { id: '3', type: 'W1 (Living)', w: 1.5, h: 1.2, qty: 2, notes: 'UPVC Sliding' }
  ]);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), type: 'New', w: 1, h: 1, qty: 1, notes: '' }]);
  };

  const updateEntry = (id: string, field: keyof Entry, val: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  // Convert to CSV for export
  const downloadCSV = () => {
    let csv = "ID,Type/Mark,Width (m),Height (m),Area (sqm),Quantity,Total Area (sqm),Lintel Length (m),Notes\n";
    entries.forEach((e, idx) => {
       const area = e.w * e.h;
       const lintelLength = e.w + 0.3; // minimum bearing 150mm each side
       csv += `\${idx+1},"\${e.type}",\${e.w},\${e.h},\${area.toFixed(2)},\${e.qty},\${(area*e.qty).toFixed(2)},\${lintelLength.toFixed(2)},"\${e.notes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Door_Window_Schedule.csv';
    a.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
       <div className="bg-[#FAFAF8] hover:bg-[#FDFCF9] transition-colors duration-500 border border-slate-200 p-6 rounded-[24px] shadow-sm">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-semibold flex items-center gap-2">
             <Columns className="w-6 h-6 text-teal-500" />
             Door & Window Schedule Generator
           </h2>
           <button onClick={downloadCSV} className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 px-4 py-2 rounded-[24px] font-bold transition flex items-center gap-2 text-sm">
             <Save className="w-4 h-4"/> Export CSV
           </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border-y border-slate-200">
                   <th className="p-3 text-sm font-bold text-slate-500">Mark</th>
                   <th className="p-3 text-sm font-bold text-slate-500">Width (m)</th>
                   <th className="p-3 text-sm font-bold text-slate-500">Height (m)</th>
                   <th className="p-3 text-sm font-bold text-slate-500">Qty</th>
                   <th className="p-3 text-sm font-bold text-slate-500">Area (sqm)</th>
                   <th className="p-3 text-sm font-bold text-slate-500">Req. Lintel (m)</th>
                   <th className="p-3 text-sm font-bold text-slate-500">Notes</th>
                   <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map(e => (
                   <tr key={e.id}>
                     <td className="p-2">
                        <input type="text" value={e.type} onChange={(ev)=>updateEntry(e.id, 'type', ev.target.value)} className="w-[120px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-[16px] text-sm" />
                     </td>
                     <td className="p-2">
                        <input type="number" step="0.1" value={e.w} onChange={(ev)=>updateEntry(e.id, 'w', parseFloat(ev.target.value)||0)} className="w-[80px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-[16px] text-sm" />
                     </td>
                     <td className="p-2">
                        <input type="number" step="0.1" value={e.h} onChange={(ev)=>updateEntry(e.id, 'h', parseFloat(ev.target.value)||0)} className="w-[80px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-[16px] text-sm" />
                     </td>
                     <td className="p-2">
                        <input type="number" value={e.qty} onChange={(ev)=>updateEntry(e.id, 'qty', parseInt(ev.target.value)||0)} className="w-[60px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-[16px] text-sm" />
                     </td>
                     <td className="p-2 text-sm font-bold text-slate-600">
                        {((e.w * e.h) * e.qty).toFixed(2)}
                     </td>
                     <td className="p-2 text-sm font-mono text-slate-500">
                        {(e.w + 0.3).toFixed(2)}
                     </td>
                     <td className="p-2">
                        <input type="text" value={e.notes} onChange={(ev)=>updateEntry(e.id, 'notes', ev.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-[16px] text-sm" />
                     </td>
                     <td className="p-2">
                        <button onClick={()=>setEntries(entries.filter(x=>x.id!==e.id))} className="text-rose-500 hover:bg-rose-50 p-2 rounded-[16px] transition">✕</button>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
         </div>
         <div className="mt-4">
            <button onClick={addEntry} className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-[16px] hover:bg-teal-100 transition">
              + Add Item
            </button>
         </div>
       </div>
    
      <CalculationHistory calculatorId="doorwindowschedule_tool" currentInputs={{}} />
</div>
  );
}
