import React, { useState, useMemo } from 'react';
import { Hammer, Grid, Plus, Trash2, RefreshCw, LayoutTemplate, SquareStack } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface FormworkElement {
  id: string;
  name: string;
  type: 'column' | 'beam' | 'slab';
  length: string;
  width: string;
  height: string;
  count: string;
}

export default function FormworkEstimator() {
  const [elements, setElements] = useState<FormworkElement[]>([
    { id: '1', name: 'Column C1', type: 'column', length: '0.3', width: '0.4', height: '3.0', count: '10' },
    { id: '2', name: 'Slab Roof', type: 'slab', length: '12.0', width: '10.0', height: '0.15', count: '1' }
  ]);

  const [repetitionFactor, setRepetitionFactor] = useState<number>(4);
  const [wastagePct, setWastagePct] = useState<number>(5);

  const addElement = () => {
    setElements([
      ...elements,
      { id: Math.random().toString(36).substring(2, 9), name: 'New Item', type: 'beam', length: '4.0', width: '0.3', height: '0.45', count: '1' }
    ]);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(e => e.id !== id));
  };

  const updateElement = (id: string, field: keyof FormworkElement, value: string) => {
    setElements(elements.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const results = useMemo(() => {
    let totalAreaSqm = 0;
    
    // Detailed areas for charting/breakdown
    let colArea = 0;
    let beamArea = 0;
    let slabArea = 0;

    elements.forEach(item => {
      const l = parseFloat(item.length) || 0;
      const w = parseFloat(item.width) || 0;
      const h = parseFloat(item.height) || 0;
      const c = parseFloat(item.count) || 0;

      let area = 0;
      if (item.type === 'column') {
        // (2 * width * height) + (2 * length * height)
        area = ((2 * w * h) + (2 * l * h)) * c;
        colArea += area;
      } else if (item.type === 'beam') {
        // Bottom + 2 Sides (length * width) + (2 * length * depth)
        area = ((l * w) + (2 * l * h)) * c;
        beamArea += area;
      } else if (item.type === 'slab') {
        // Bottom + Perimeters
        area = ((l * w) + (2 * (l + w) * h)) * c;
        slabArea += area;
      }

      totalAreaSqm += area;
    });

    const totalAreaSqft = totalAreaSqm * 10.7639;

    // Repetition Factor affects the actual material purchased/rented
    const effectiveAreaSqft = (totalAreaSqft / repetitionFactor) * (1 + wastagePct / 100);
    const effectiveAreaSqm = (totalAreaSqm / repetitionFactor) * (1 + wastagePct / 100);

    // 1 standard plywood sheet = 4ft x 8ft = 32 sqft
    const plywoodSheets = Math.ceil(effectiveAreaSqft / 32);
    
    // Wooden battens/runners: rule of thumb roughly ~2.5 - 3 running ft per sqft of formwork
    const battensRft = Math.ceil(effectiveAreaSqft * 2.5);
    
    // Props / Scaffolding pipes: rule of thumb approx 1.2 props per sqm of formwork
    const steelProps = Math.ceil(effectiveAreaSqm * 1.5);

    return {
      totalAreaSqm,
      totalAreaSqft,
      effectiveAreaSqft,
      plywoodSheets,
      battensRft,
      steelProps,
      breakdown: { colArea, beamArea, slabArea }
    };
  }, [elements, repetitionFactor, wastagePct]);

  const breakdownData = useMemo(() => {
    return [
      { name: 'Columns', value: results.breakdown.colArea, color: '#f59e0b' }, // amber-500
      { name: 'Slabs', value: results.breakdown.slabArea, color: '#f43f5e' }, // rose-500
      { name: 'Beams', value: results.breakdown.beamArea, color: '#6366f1' }, // indigo-500
    ].filter(d => d.value > 0);
  }, [results]);

  return (
    <div className="w-full h-full overflow-y-auto bg-[#fafafa] text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        
        <header className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent pb-2">
            Formwork & Scaffolding
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            Calculate accurate shuttering contact surface areas and standard material requirements.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Elements Config Section */}
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white/90 p-6 md:p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 rounded-2xl">
                    <Grid className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Shuttering Elements</h2>
                    <p className="text-sm text-gray-500 font-medium">Add columns, beams, or slabs</p>
                  </div>
                </div>
                <button onClick={addElement} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {elements.map((el, index) => (
                  <div key={el.id} className="group bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-amber-200 p-5 rounded-[2rem] transition-all shadow-sm hover:shadow-md relative overflow-hidden flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300 group-hover:bg-amber-400 transition-colors" />
                    
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 items-end pl-2">
                      <div className="col-span-2 md:col-span-2 space-y-1">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Type & Name</label>
                         <div className="flex gap-2">
                           <select 
                             className="bg-gray-100 border-none rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-amber-500/30 w-24"
                             value={el.type}
                             onChange={(e) => updateElement(el.id, 'type', e.target.value)}
                           >
                             <option value="column">Col</option>
                             <option value="beam">Beam</option>
                             <option value="slab">Slab</option>
                           </select>
                           <input 
                             type="text" 
                             className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 w-full outline-none focus:ring-2 focus:ring-amber-500/30"
                             value={el.name}
                             onChange={(e) => updateElement(el.id, 'name', e.target.value)}
                           />
                         </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">L (m)</label>
                        <input type="number" step="0.1" className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium w-full outline-none focus:ring-2 focus:ring-amber-500/30" value={el.length} onChange={(e) => updateElement(el.id, 'length', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">W (m)</label>
                        <input type="number" step="0.1" className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium w-full outline-none focus:ring-2 focus:ring-amber-500/30" value={el.width} onChange={(e) => updateElement(el.id, 'width', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">H/D (m)</label>
                        <input type="number" step="0.1" className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium w-full outline-none focus:ring-2 focus:ring-amber-500/30" value={el.height} onChange={(e) => updateElement(el.id, 'height', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Qty</label>
                        <input type="number" className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium w-full outline-none focus:ring-2 focus:ring-amber-500/30" value={el.count} onChange={(e) => updateElement(el.id, 'count', e.target.value)} />
                      </div>
                    </div>
                    
                    <button onClick={() => removeElement(el.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors ml-auto md:ml-0 self-end md:self-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {elements.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem]">
                    <p className="text-gray-400 font-medium">No formwork elements added.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/90 p-6 md:p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 backdrop-blur-xl flex flex-col sm:flex-row gap-6 sm:items-center">
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-gray-800">Repetition Factor</h3>
                 </div>
                 <p className="text-sm text-gray-500">How many times will the shuttering be reused? This drastically reduces material required.</p>
               </div>
               <div className="flex gap-2">
                 {[1, 2, 4, 6].map(factor => (
                   <button 
                     key={factor}
                     onClick={() => setRepetitionFactor(factor)}
                     className={`w-12 h-12 rounded-2xl font-black transition-all ${repetitionFactor === factor ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                   >
                     x{factor}
                   </button>
                 ))}
               </div>
            </div>

          </section>

          {/* Results Summary Interface */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-b from-[#111827] to-[#1f2937] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]" />
               
               <div className="relative z-10 text-white">
                 <h2 className="text-lg flex items-center gap-2 text-amber-400 font-bold tracking-wide uppercase mb-6">
                    <SquareStack className="w-5 h-5" /> Material Summary
                 </h2>

                 <div className="mb-8">
                    <div className="text-gray-400 text-sm font-semibold mb-1">Total Formwork Area</div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black tracking-tighter">{results.totalAreaSqm.toFixed(1)}</span>
                      <span className="text-lg font-medium text-gray-500 mb-0.5">m²</span>
                    </div>
                    <div className="text-gray-500 font-mono text-xs mt-1">({results.totalAreaSqft.toFixed(1)} sq.ft)</div>
                 </div>

                 <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:bg-white/15 transition-colors">
                       <div className="text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                         Plywood Sheets <span className="px-2 py-0.5 bg-amber-500/20 rounded-full">4'x8'</span>
                       </div>
                       <div className="text-3xl font-black">{results.plywoodSheets}</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:bg-white/15 transition-colors">
                       <div className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                         Wooden Battens
                       </div>
                       <div className="flex items-end gap-1">
                         <div className="text-3xl font-black">{results.battensRft}</div>
                         <div className="text-emerald-300/60 font-medium mb-1">Rft</div>
                       </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:bg-white/15 transition-colors">
                       <div className="text-sky-300 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                         Steel Props / Scaffold
                       </div>
                       <div className="flex items-end gap-1">
                         <div className="text-3xl font-black">{results.steelProps}</div>
                         <div className="text-sky-300/60 font-medium mb-1">Pcs</div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10">
                   <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Area Breakdown</div>
                   <div className="h-48 w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie 
                           data={breakdownData} 
                           innerRadius={50} 
                           outerRadius={70} 
                           paddingAngle={5} 
                           dataKey="value"
                           animationDuration={1000}
                         >
                           {breakdownData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                           ))}
                         </Pie>
                         <Tooltip 
                           formatter={(value: number) => `${value.toFixed(1)} m²`} 
                           contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '12px' }}
                           itemStyle={{ color: '#f3f4f6' }}
                         />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center gap-4 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"/> Columns</span>
                     <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"/> Slabs</span>
                     <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"/> Beams</span>
                   </div>
                 </div>

               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
