import React, { useState } from "react";
import { Calculator, Copy, RotateCw, RefreshCw } from "lucide-react";
import { useGlobalSettings } from "../../context/SettingsContext";

export default function CageEstimator() {
  const { currentUnit } = useGlobalSettings();

  const [cageType, setCageType] = useState<"spiral" | "hoop">("spiral");
  const [pileDiameter, setPileDiameter] = useState("600");
  const [pileLength, setPileLength] = useState("10"); // m or ft depending on currentUnit
  const [clearCover, setClearCover] = useState("50"); // mm
  const [barDiameter, setBarDiameter] = useState("8"); // mm
  const [pitch, setPitch] = useState("150"); // mm
  const [lapLength, setLapLength] = useState("50"); // multiplied by bar dia => 50d

  const isMetric = currentUnit === "Metric";

  const calculateSpiral = () => {
    const D = parseFloat(pileDiameter); // mm
    const L_pool = parseFloat(pileLength); // m
    const L_mm = isMetric ? L_pool * 1000 : L_pool * 304.8; 
    const c = parseFloat(clearCover);
    const d = parseFloat(barDiameter);
    const p = parseFloat(pitch);
    const laps = parseFloat(lapLength);

    if (isNaN(D) || isNaN(L_mm) || isNaN(c) || isNaN(d) || isNaN(p) || isNaN(laps) || p <= 0) return null;

    // Center to center diameter of spiral
    const coreDiameter = D - (2 * c) - d;
    if (coreDiameter <= 0) return null;

    // Length of one spiral loop
    // L_loop = sqrt((PI * coreDiameter)^2 + pitch^2)
    const loopLength_mm = Math.sqrt(Math.pow(Math.PI * coreDiameter, 2) + Math.pow(p, 2));

    let noOfSpirals = L_mm / p + 1; // plus 1 for end
    
    if (cageType === "hoop") {
        noOfSpirals = Math.ceil(L_mm / p) + 1;
    }

    let totalLength_mm = 0;

    if (cageType === "spiral") {
        totalLength_mm = (L_mm / p) * loopLength_mm + 2 * (Math.PI * coreDiameter); // adding 2 flat turns at ends
    } else {
        totalLength_mm = noOfSpirals * (Math.PI * coreDiameter + 24 * d); // adding hook length 24d
    }

    // Laps
    const lengthPerBar = 12000; // standard 12m bar
    const noOfLaps = Math.max(0, Math.ceil(totalLength_mm / lengthPerBar) - 1);
    const lapAdjustment = noOfLaps * laps * d;
    
    totalLength_mm += lapAdjustment;

    const totalLength_m = totalLength_mm / 1000;
    const weightPerMeter = Math.pow(d, 2) / 162.28;
    const totalWeight_kg = totalLength_m * weightPerMeter;

    return {
      coreDiameter: coreDiameter.toFixed(1),
      noOfPitch: Math.ceil(noOfSpirals),
      loopLength: (loopLength_mm / 1000).toFixed(3),
      totalLength: totalLength_m.toFixed(2),
      totalLaps: noOfLaps,
      lapAdjustment: (lapAdjustment / 1000).toFixed(2),
      unitWeight: weightPerMeter.toFixed(3),
      totalWeight: totalWeight_kg.toFixed(2)
    };
  };

  const results = calculateSpiral();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <RotateCw className="w-6 h-6 text-emerald-500" />
          Cage / Spiral Estimator
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate quantities for helical spirals or circular hoops used in piles and columns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Cage Parameters
          </h3>
          
          <div className="space-y-4">
             <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full">
              <button
                onClick={() => setCageType("spiral")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                  cageType === "spiral"
                    ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Continuous Spiral
              </button>
              <button
                onClick={() => setCageType("hoop")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                  cageType === "hoop"
                    ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Circular Hoops / Rings
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pile/Col Diameter (mm)</label>
                <input
                  type="number"
                  value={pileDiameter}
                  onChange={(e) => setPileDiameter(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Length ({isMetric ? "m" : "ft"})</label>
                <input
                  type="number"
                  value={pileLength}
                  onChange={(e) => setPileLength(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clear Cover (mm)</label>
                <input
                  type="number"
                  value={clearCover}
                  onChange={(e) => setClearCover(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bar Dia (mm)</label>
                <input
                  type="number"
                  value={barDiameter}
                  onChange={(e) => setBarDiameter(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pitch/Spacing (mm)</label>
                <input
                  type="number"
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lap Length (x Dia)</label>
                <input
                  type="number"
                  value={lapLength}
                  onChange={(e) => setLapLength(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
            </div>
            
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 space-y-6">
           <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <RefreshCw className="absolute -right-6 -bottom-6 w-32 h-32 text-emerald-500 opacity-20" />
              <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Total Rebar Weight</h3>
              <div className="flex items-end gap-2 relative z-10">
                <span className="text-5xl font-black tracking-tight">{results ? results.totalWeight : "0.00"}</span>
                <span className="text-xl text-emerald-200 mb-1 font-bold">kg</span>
              </div>
           </div>

           {results && (
             <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Detailed Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Core/Mean Dia</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.coreDiameter} mm</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{cageType === "spiral" ? "Loop Length" : "Ring Length"}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.loopLength} m</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">No. of Loops/Rings</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.noOfPitch} nos</span>
                  </div>
                   <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Lap Allowance</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.lapAdjustment} m (x{results.totalLaps})</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Total Cut Length</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.totalLength} m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Unit Weight</span>
                    <span className="font-bold text-slate-900 dark:text-white">{results.unitWeight} kg/m</span>
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
