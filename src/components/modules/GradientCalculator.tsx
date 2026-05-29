import React, { useState, useEffect } from "react";
import { ArrowRight, Triangle, Activity } from "lucide-react";
import { SEO } from "../SEO";
import { CalculationHistory } from "../ui/CalculationHistory";

export default function GradientCalculator() {
  const [rise, setRise] = useState<string>("");
  const [run, setRun] = useState<string>("");
  const [slopePercent, setSlopePercent] = useState<string>("");
  const [ratioN, setRatioN] = useState<string>("");
  const [angleDeg, setAngleDeg] = useState<string>("");
  
  const [startElevation, setStartElevation] = useState<string>("");
  const [finalElevation, setFinalElevation] = useState<string>("");
  const [isCut, setIsCut] = useState<boolean>(true); // false = Fill (upward), true = Cut (downward)
  
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Helper to round to 4 decimals
  const round4 = (num: number) => Math.round(num * 10000) / 10000;
  
  // Calculate whenever key variables change.
  // We use the two most recently changed/focused inputs if possible, or just build a deterministic update.
  // Best approach for 5 variables: update everything based on Rise & Run, unless the user is typing in another field, 
  // then we derive Rise or Run and calculate the rest.
  
  const handleInputChange = (field: string, value: string) => {
    setActiveInput(field);
    const numVal = parseFloat(value);
    
    if (isNaN(numVal) && value !== "") {
       // invalid, just set the text and return
       if (field === 'rise') setRise(value);
       if (field === 'run') setRun(value);
       if (field === 'percent') setSlopePercent(value);
       if (field === 'ratio') setRatioN(value);
       if (field === 'angle') setAngleDeg(value);
       return;
    }
    
    let currentRise = parseFloat(rise) || 0;
    let currentRun = parseFloat(run) || 0;
    
    if (field === 'rise') {
      setRise(value);
      currentRise = numVal || 0;
    } else if (field === 'run') {
      setRun(value);
      currentRun = numVal || 0;
    } else if (field === 'percent') {
      setSlopePercent(value);
      if (currentRun > 0 && !isNaN(numVal)) {
         currentRise = (numVal / 100) * currentRun;
         setRise(round4(currentRise).toString());
      } else if (currentRise > 0 && !isNaN(numVal) && numVal > 0) {
         currentRun = currentRise / (numVal / 100);
         setRun(round4(currentRun).toString());
      }
    } else if (field === 'ratio') {
      // 1:N
      setRatioN(value);
      if (currentRise > 0 && !isNaN(numVal)) {
         currentRun = currentRise * numVal;
         setRun(round4(currentRun).toString());
      } else if (currentRun > 0 && !isNaN(numVal) && numVal > 0) {
         currentRise = currentRun / numVal;
         setRise(round4(currentRise).toString());
      }
    } else if (field === 'angle') {
      setAngleDeg(value);
      if (!isNaN(numVal) && numVal > 0 && numVal < 90) {
         const tanAng = Math.tan(numVal * Math.PI / 180);
         if (currentRun > 0) {
             currentRise = currentRun * tanAng;
             setRise(round4(currentRise).toString());
         } else if (currentRise > 0) {
             currentRun = currentRise / tanAng;
             setRun(round4(currentRun).toString());
         }
      }
    }
    
    updateAll(field, currentRise, currentRun, isNaN(numVal) ? undefined : numVal);
  };
  
  const updateAll = (sourceField: string, newRise: number, newRun: number, sourceVal?: number) => {
    if (newRise > 0 && newRun > 0) {
       if (sourceField !== 'percent') setSlopePercent(round4((newRise / newRun) * 100).toString());
       if (sourceField !== 'ratio') setRatioN(round4(newRun / newRise).toString());
       if (sourceField !== 'angle') setAngleDeg(round4(Math.atan(newRise / newRun) * 180 / Math.PI).toString());
    } else {
       if (sourceField !== 'percent') setSlopePercent("");
       if (sourceField !== 'ratio') setRatioN("");
       if (sourceField !== 'angle') setAngleDeg("");
    }
  };

  useEffect(() => {
    const sElev = parseFloat(startElevation);
    let r = parseFloat(rise) || 0;
    
    if (!isNaN(sElev) && r > 0) {
      if (isCut) {
         setFinalElevation(round4(sElev - r).toString());
      } else {
         setFinalElevation(round4(sElev + r).toString());
      }
    } else {
      setFinalElevation("");
    }
  }, [startElevation, rise, isCut]);

  const clearAll = () => {
    setRise("");
    setRun("");
    setSlopePercent("");
    setRatioN("");
    setAngleDeg("");
    setStartElevation("");
    setFinalElevation("");
    setActiveInput(null);
  };
  
  // Triangle Visualization Calculation
  const maxDim = 200;
  let vizRise = parseFloat(rise) || 0;
  let vizRun = parseFloat(run) || 0;
  
  if (vizRise === 0 && vizRun === 0) { vizRise = 1; vizRun = 2; }
  else if (vizRise === 0) { vizRise = 0.01; }
  else if (vizRun === 0) { vizRun = 0.01; }
  
  // Scale everything so max bounding box fits maxDim
  const maxReal = Math.max(vizRise, vizRun);
  const scale = maxDim / maxReal;
  const svgRise = vizRise * scale;
  const svgRun = vizRun * scale;

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <SEO 
        title="Gradient & Slope Calculator | Civil Estimation Pro" 
        description="Calculate slopes, gradients, angles, and elevations dynamically for earthworks and construction projects."
      />
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 text-white">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Gradient & Slope</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-1">Dynamic bidirectional slope and elevation calculator</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
             <button
                onClick={clearAll}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
             >
                Clear All
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <section className="lg:col-span-7 space-y-6">
             <div className="bg-white px-6 py-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Triangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-800">Slope Parameters</h2>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 font-medium">Enter any 2 parameters to auto-calculate the rest.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 ml-1">Rise (Vertical Δ)</label>
                     <input
                       type="number"
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                       value={rise}
                       onChange={(e) => handleInputChange('rise', e.target.value)}
                       placeholder="e.g. 5"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 ml-1">Run (Horizontal Δ)</label>
                     <input
                       type="number"
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                       value={run}
                       onChange={(e) => handleInputChange('run', e.target.value)}
                       placeholder="e.g. 100"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 ml-1">Slope %</label>
                     <div className="relative">
                       <input
                         type="number"
                         className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all pr-8"
                         value={slopePercent}
                         onChange={(e) => handleInputChange('percent', e.target.value)}
                         placeholder="e.g. 5"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 ml-1">Gradient Ratio 1:N</label>
                     <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all overflow-hidden">
                       <span className="pl-4 pr-2 text-slate-800 font-bold bg-slate-100 h-full py-3 border-r border-slate-200">1 :</span>
                       <input
                         type="number"
                         className="w-full bg-transparent text-slate-800 px-3 py-3 outline-none"
                         value={ratioN}
                         onChange={(e) => handleInputChange('ratio', e.target.value)}
                         placeholder="e.g. 20"
                       />
                     </div>
                   </div>
                   
                   <div className="sm:col-span-2">
                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 ml-1">Angle (Degrees)</label>
                     <div className="relative">
                       <input
                         type="number"
                         className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all pr-8"
                         value={angleDeg}
                         onChange={(e) => handleInputChange('angle', e.target.value)}
                         placeholder="e.g. 2.86"
                         max="89.99"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">°</span>
                     </div>
                   </div>
                </div>
             </div>
             
             {/* Elevation section */}
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-6 rounded-[1.5rem] shadow-xl text-slate-900 dark:text-white">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                  <div className="p-2.5 bg-slate-700 rounded-xl">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">Elevation Finder</h2>
                </div>
                
                <div className="flex items-center gap-4 mb-6 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 w-max">
                   <button 
                     onClick={() => setIsCut(true)}
                     className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isCut ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                   >
                     Cut (Downward)
                   </button>
                   <button 
                     onClick={() => setIsCut(false)}
                     className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${!isCut ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                   >
                     Fill (Upward)
                   </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Start Elevation</label>
                     <input
                       type="number"
                       className="w-full bg-slate-800/50 border border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                       value={startElevation}
                       onChange={(e) => setStartElevation(e.target.value)}
                       placeholder="e.g. 100.5"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Final Elevation</label>
                     <div className="w-full bg-slate-800/80 border border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-lg font-bold min-h-[50px] flex items-center">
                        {finalElevation ? finalElevation : '--'}
                     </div>
                   </div>
                </div>
             </div>
             
          </section>
          
          <section className="lg:col-span-5 space-y-6">
             <div className="bg-white px-6 py-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 self-start">Visual Diagram</h3>
                
                <div className="relative w-full max-w-[280px] flex justify-center items-center h-[220px]">
                   <svg width={maxDim + 40} height={maxDim + 40} className="overflow-visible">
                      <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                        </marker>
                      </defs>
                      <g transform={`translate(20, ${maxDim + 10}) scale(1, -1)`}>
                         {/* Grid/Axes */}
                         <line x1="0" y1="0" x2={svgRun} y2="0" stroke="#E2E8F0" strokeWidth="3" />
                         <line x1={svgRun} y1="0" x2={svgRun} y2={svgRise} stroke="#10B981" strokeWidth="3" strokeDasharray="5,5" />
                         
                         {/* Slope line */}
                         <line 
                           x1="0" y1={isCut ? svgRise : 0} 
                           x2={svgRun} y2={isCut ? 0 : svgRise} 
                           stroke="#0F172A" strokeWidth="4" strokeLinecap="round" 
                         />
                         
                         {/* Angle Arc if not cut or simple representation */}
                         {!isCut && svgRise > 0 && svgRun > 0 && (
                            <path 
                              d={`M ${(maxDim/svgRun)*30 > 30 ? 30 : (maxDim/svgRun)*30} 0 A 30 30 0 0 1 ${(maxDim/svgRun)*30 > 30 ? 30*Math.cos(Math.atan(svgRise/svgRun)) : 30} ${(maxDim/svgRun)*30 > 30 ? 30*Math.sin(Math.atan(svgRise/svgRun)) : 30}`} 
                              fill="none" stroke="#64748B" strokeWidth="2"
                            />
                         )}
                         {isCut && svgRise > 0 && svgRun > 0 && (
                            <path 
                              d={`M ${(maxDim/svgRun)*30 > 30 ? 30 : (maxDim/svgRun)*30} ${svgRise} A 30 30 0 0 0 ${(maxDim/svgRun)*30 > 30 ? 30*Math.cos(Math.atan(-svgRise/svgRun)) : 30} ${svgRise - ((maxDim/svgRun)*30 > 30 ? 30*Math.sin(Math.atan(svgRise/svgRun)) : 30)}`} 
                              fill="none" stroke="#64748B" strokeWidth="2"
                            />
                         )}
                      </g>
                   </svg>
                   
                   <div className={`absolute left-0  ${isCut ? 'top-0' : 'bottom-0'} -translate-x-full text-xs font-bold text-slate-400 whitespace-nowrap`}>
                      Rise<br/>
                      <span className="text-emerald-600 text-sm">{rise || "---"}</span>
                   </div>
                   
                   <div className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 text-xs font-bold text-slate-400 mt-2">
                      Run <span className="text-slate-800 text-sm ml-1">{run || "---"}</span>
                   </div>
                   
                   <div className={`absolute right-4 ${isCut ? 'bottom-8' : 'top-8'} text-slate-500 font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-100`}>
                     {angleDeg ? `${parseFloat(angleDeg).toFixed(1)}°` : '--°'}
                   </div>
                </div>
                
             </div>
             
             <div className="bg-slate-50 px-6 py-6 rounded-[1.5rem] border border-slate-200">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Formulas Used</h3>
                <ul className="text-sm text-slate-600 space-y-2 font-mono">
                   <li><span className="font-bold text-slate-800">Slope %</span> = (Rise / Run) × 100</li>
                   <li><span className="font-bold text-slate-800">1:N Ratio</span> = Run / Rise</li>
                   <li><span className="font-bold text-slate-800">Angle</span> = atan(Rise / Run)</li>
                   <li><span className="font-bold text-slate-800">Elevation</span> = Start ± Rise</li>
                </ul>
             </div>
          </section>
          
        </div>
      </div>
      <CalculationHistory
        calculatorId="gradient_slope_calculator_v1"
        estimationName="Gradient & Slope Profile"
        savePayload={{ rise, run, slopePercent, startElevation, finalElevation, isCut }}
        currentInputs={{ rise, run, slopePercent, startElevation, finalElevation, isCut }}
        onRestore={() => {}}
      />
    </div>
  );
}
