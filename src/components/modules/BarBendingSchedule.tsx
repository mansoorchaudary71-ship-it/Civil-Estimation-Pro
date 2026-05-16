import React, { useState, useRef } from "react";
import { Printer, Plus, Trash2, LayoutList, GripHorizontal, FileSpreadsheet } from "lucide-react";
import { SEO } from "../SEO";
import { CalculationHistory } from "../ui/CalculationHistory";

type ShapeType = "straight" | "u-hook" | "cranked" | "rect-stirrup";

interface BBSRow {
  id: string;
  member: string;
  shape: ShapeType;
  dia: number;
  noOfBars: number;
  cover: number;
  inputs: Record<string, number>;
  cutLengthM: number;
  totalLengthM: number;
  totalWeightKg: number;
}

export default function BarBendingSchedule() {
  const [rows, setRows] = useState<BBSRow[]>([]);

  // Input states
  const [member, setMember] = useState("");
  const [shape, setShape] = useState<ShapeType>("rect-stirrup");
  const [dia, setDia] = useState<string>("8");
  const [noOfBars, setNoOfBars] = useState<string>("1");
  const [cover, setCover] = useState<string>("40");

  // Shape specific states
  const [span, setSpan] = useState<string>("3000"); // for straight, u-hook, cranked
  const [width, setWidth] = useState<string>("300"); // for stirrup
  const [depth, setDepth] = useState<string>("450"); // for stirrup
  const [slabThick, setSlabThick] = useState<string>("150"); // for cranked
  const [cranks, setCranks] = useState<string>("2"); // for cranked

  const printRef = useRef<HTMLDivElement>(null);

  const calculateBBS = () => {
    const d = parseFloat(dia) || 0;
    const n = parseInt(noOfBars) || 0;
    const c = parseFloat(cover) || 0;

    let cutLengthMm = 0;
    const inputsUsed: Record<string, number> = {};

    if (shape === "rect-stirrup") {
      const W = parseFloat(width) || 0;
      const D = parseFloat(depth) || 0;
      const A = W - 2 * c;
      const B = D - 2 * c;
      // Formula: L = 2(A + B) + 24 * dia (user rule)
      cutLengthMm = 2 * (A + B) + 24 * d;
      inputsUsed.W = W;
      inputsUsed.D = D;
      inputsUsed.A = A;
      inputsUsed.B = B;
    } else if (shape === "straight") {
      const S = parseFloat(span) || 0;
      cutLengthMm = S; // Assuming span is cut length, or span - 2c? Let's say it's clear span of bar
      inputsUsed.Span = S;
    } else if (shape === "u-hook") {
      const S = parseFloat(span) || 0;
      // Hook length = 9d on each side => 18d total
      cutLengthMm = S + 18 * d;
      inputsUsed.Span = S;
    } else if (shape === "cranked") {
      const S = parseFloat(span) || 0;
      const T = parseFloat(slabThick) || 0;
      const C = parseInt(cranks) || 1;
      const h = T - 2 * c - d; // Crank height/effective depth offset
      // Crank length added per crank = 0.42 * h
      cutLengthMm = S + C * 0.42 * h + 18 * d; // assuming hooks on both ends + crank 
      inputsUsed.Span = S;
      inputsUsed.Thick = T;
      inputsUsed.Cranks = C;
    }

    const cutLengthM = cutLengthMm / 1000;
    const totalLengthM = cutLengthM * n;
    // W = d^2 / 162.28 (user rule)
    const unitWt = (d * d) / 162.28;
    const totalWeightKg = totalLengthM * unitWt;

    const newRow: BBSRow = {
      id: Math.random().toString(36).substr(2, 9),
      member: member || `Item ${rows.length + 1}`,
      shape,
      dia: d,
      noOfBars: n,
      cover: c,
      inputs: inputsUsed,
      cutLengthM,
      totalLengthM,
      totalWeightKg,
    };

    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };
  
  const handlePrint = () => {
    window.print();
  };

  const totalProjectWeight = rows.reduce((sum, r) => sum + r.totalWeightKg, 0);

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <SEO 
        title="Bar Bending Schedule Generator | Civil Estimation Pro" 
        description="Generate precise Bar Bending Schedules (BBS) for reinforcement detailing with exact concrete cover and hook deductions."
      />
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header - Hidden in Print */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 print:hidden">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 text-white">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">BBS Generator</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-1">Create printable Bar Bending Schedules with exact cutting lengths</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
             <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 transition-all"
             >
                <Printer className="w-4 h-4" />
                Print Schedule
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
          
          {/* Input Form */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white px-6 py-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
               <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-6 flex items-center gap-2">
                 <Plus className="w-5 h-5 text-blue-500" /> Add Bar
               </h2>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Member Name / Mark</label>
                   <input
                     type="text"
                     placeholder="e.g. B1, C2, Main Bar"
                     className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                     value={member}
                     onChange={(e) => setMember(e.target.value)}
                   />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Shape Code</label>
                   <select
                     className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-semibold"
                     value={shape}
                     onChange={(e) => setShape(e.target.value as ShapeType)}
                   >
                     <option value="straight">Straight Bar</option>
                     <option value="u-hook">U-Hook Bar</option>
                     <option value="cranked">Cranked Slab Bar</option>
                     <option value="rect-stirrup">Rectangular Stirrup</option>
                   </select>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Bar Dia (mm)</label>
                     <select
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                       value={dia}
                       onChange={(e) => setDia(e.target.value)}
                     >
                       <option value="6">6mm</option>
                       <option value="8">8mm</option>
                       <option value="10">10mm</option>
                       <option value="12">12mm</option>
                       <option value="16">16mm</option>
                       <option value="20">20mm</option>
                       <option value="25">25mm</option>
                       <option value="32">32mm</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">No. of Bars</label>
                     <input
                       type="number"
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                       value={noOfBars}
                       onChange={(e) => setNoOfBars(e.target.value)}
                     />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Cover (mm)</label>
                   <input
                     type="number"
                     className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                     value={cover}
                     onChange={(e) => setCover(e.target.value)}
                   />
                 </div>
                 
                 {/* Conditional Inputs */}
                 {shape === "rect-stirrup" && (
                   <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                     <div>
                       <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5 ml-1">Sect Width (mm)</label>
                       <input
                         type="number"
                         className="w-full bg-white border border-blue-200 text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                         value={width}
                         onChange={(e) => setWidth(e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5 ml-1">Sect Depth (mm)</label>
                       <input
                         type="number"
                         className="w-full bg-white border border-blue-200 text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                         value={depth}
                         onChange={(e) => setDepth(e.target.value)}
                       />
                     </div>
                   </div>
                 )}
                 
                 {(shape === "straight" || shape === "u-hook" || shape === "cranked") && (
                   <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                     <div>
                       <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5 ml-1">Length/Span (mm)</label>
                       <input
                         type="number"
                         className="w-full bg-white border border-blue-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                         value={span}
                         onChange={(e) => setSpan(e.target.value)}
                       />
                     </div>
                     {shape === "cranked" && (
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5 ml-1">Slab Thk (mm)</label>
                           <input
                             type="number"
                             className="w-full bg-white border border-blue-200 text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                             value={slabThick}
                             onChange={(e) => setSlabThick(e.target.value)}
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5 ml-1">No. Cranks</label>
                           <input
                             type="number"
                             className="w-full bg-white border border-blue-200 text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                             value={cranks}
                             onChange={(e) => setCranks(e.target.value)}
                           />
                         </div>
                       </div>
                     )}
                   </div>
                 )}
                 
                 <button
                   onClick={calculateBBS}
                   className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md mt-4"
                 >
                   Calculate & Add
                 </button>
               </div>
            </div>
          </section>

          {/* Schedule Summary (Screen only, mirrored below for print) */}
          <section className="lg:col-span-8 space-y-6">
             <div className="bg-white px-6 py-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                     <LayoutList className="w-5 h-5 text-blue-500" /> Current Schedule
                   </h2>
                   <div className="bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full font-bold text-sm">
                      Total: {totalProjectWeight.toFixed(2)} Kg
                   </div>
                </div>
                
                {rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <GripHorizontal className="w-12 h-12 mb-4 opacity-50" />
                    <p>No bars added yet. Add a bar from the panel.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                     <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-xs">
                         <tr>
                           <th className="px-4 py-3 border-b">Member</th>
                           <th className="px-4 py-3 border-b">Shape</th>
                           <th className="px-4 py-3 border-b">Dia</th>
                           <th className="px-4 py-3 border-b text-center">Nos.</th>
                           <th className="px-4 py-3 border-b text-right">Cut L. (m)</th>
                           <th className="px-4 py-3 border-b text-right">Tot. L (m)</th>
                           <th className="px-4 py-3 border-b text-right">Wgt (kg)</th>
                           <th className="px-4 py-3 border-b text-center">Act</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {rows.map((r, i) => (
                           <tr key={r.id} className="hover:bg-slate-50/50">
                             <td className="px-4 py-3 font-semibold text-slate-800">{r.member}</td>
                             <td className="px-4 py-3 text-slate-600">
                                <div className="capitalize">{r.shape.replace('-', ' ')}</div>
                                <div className="text-[10px] text-slate-400">
                                   {r.shape === 'rect-stirrup' && `A:${r.inputs.A} B:${r.inputs.B}`}
                                   {r.shape === 'cranked' && `S:${r.inputs.Span} T:${r.inputs.Thick}`}
                                </div>
                             </td>
                             <td className="px-4 py-3 font-medium">Ø{r.dia}</td>
                             <td className="px-4 py-3 text-center font-bold text-slate-700">{r.noOfBars}</td>
                             <td className="px-4 py-3 text-right font-medium">{r.cutLengthM.toFixed(3)}</td>
                             <td className="px-4 py-3 text-right">{r.totalLengthM.toFixed(2)}</td>
                             <td className="px-4 py-3 text-right font-bold text-blue-700">{r.totalWeightKg.toFixed(2)}</td>
                             <td className="px-4 py-3 text-center">
                               <button onClick={() => removeRow(r.id)} className="text-red-400 hover:text-red-600 p-1">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>
      
      {/* Print-Only Layout */}
      <div className="hidden print:block p-8 bg-white text-black" ref={printRef}>
         <div className="border-b-2 border-slate-800 pb-4 mb-6">
            <h1 className="text-2xl font-black uppercase text-slate-900">Bar Bending Schedule</h1>
            <p className="text-slate-600 mt-1">Generated by Civil Estimation Pro</p>
         </div>
         
         <table className="w-full text-sm text-left border-collapse border border-slate-300">
           <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-xs">
             <tr>
               <th className="px-3 py-2 border border-slate-300">SN.</th>
               <th className="px-3 py-2 border border-slate-300">Member Description</th>
               <th className="px-3 py-2 border border-slate-300">Shape / Schematic</th>
               <th className="px-3 py-2 border border-slate-300">Bar Dia (Ø)</th>
               <th className="px-3 py-2 border border-slate-300 text-center">No. of Bars</th>
               <th className="px-3 py-2 border border-slate-300 text-right">Cut Length (m)</th>
               <th className="px-3 py-2 border border-slate-300 text-right">Total Length (m)</th>
               <th className="px-3 py-2 border border-slate-300 text-right">Total Weight (kg)</th>
             </tr>
           </thead>
           <tbody>
             {rows.map((r, i) => (
               <tr key={r.id}>
                 <td className="px-3 py-2 border border-slate-300 text-center">{i + 1}</td>
                 <td className="px-3 py-2 border border-slate-300 font-semibold">{r.member}</td>
                 <td className="px-3 py-2 border border-slate-300">
                    <div className="capitalize font-medium">{r.shape.replace('-', ' ')}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                       {r.shape === 'rect-stirrup' && `Inner Dim: A=${r.inputs.A}mm, B=${r.inputs.B}mm`}
                       {r.shape === 'cranked' && `Span=${r.inputs.Span}mm, Slab=${r.inputs.Thick}mm`}
                       {r.shape === 'u-hook' && `Clear Span=${r.inputs.Span}mm`}
                       {r.shape === 'straight' && `Length=${r.inputs.Span}mm`}
                    </div>
                 </td>
                 <td className="px-3 py-2 border border-slate-300 text-center font-medium">Ø{r.dia}</td>
                 <td className="px-3 py-2 border border-slate-300 text-center">{r.noOfBars}</td>
                 <td className="px-3 py-2 border border-slate-300 text-right">{r.cutLengthM.toFixed(3)}</td>
                 <td className="px-3 py-2 border border-slate-300 text-right">{r.totalLengthM.toFixed(2)}</td>
                 <td className="px-3 py-2 border border-slate-300 text-right font-bold">{r.totalWeightKg.toFixed(2)}</td>
               </tr>
             ))}
             <tr className="bg-slate-50">
               <td colSpan={7} className="px-3 py-3 border border-slate-300 text-right font-bold uppercase">Grand Total Weight</td>
               <td className="px-3 py-3 border border-slate-300 text-right font-black text-lg">{totalProjectWeight.toFixed(2)} kg</td>
             </tr>
           </tbody>
         </table>
      </div>
      
      <CalculationHistory
        calculatorId="bbs_generator_v1"
        estimationName="Bar Bending Schedule"
        savePayload={{ rows, totalProjectWeight }}
        currentInputs={{}}
        onRestore={() => {}}
      />
    </div>
  );
}
