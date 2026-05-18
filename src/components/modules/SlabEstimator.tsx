import React, { useState } from "react";
import { Grid2X2, Settings2, Replace } from "lucide-react";
import { SEO } from "../SEO";
import { CalculationHistory } from "../ui/CalculationHistory";

export default function SlabEstimator() {
  const [slabType, setSlabType] = useState<"one-way" | "two-way">("two-way");
  
  const [ly, setLy] = useState("5"); // Long Span (meters)
  const [lx, setLx] = useState("4"); // Short Span (meters)
  const [thickness, setThickness] = useState("150"); // mm
  const [clearCover, setClearCover] = useState("20"); // mm
  
  const [mainDia, setMainDia] = useState("12"); // mm (Short Span/Main)
  const [distDia, setDistDia] = useState("10"); // mm (Long Span/Distribution)
  const [mainSpacing, setMainSpacing] = useState("150"); // mm
  const [distSpacing, setDistSpacing] = useState("150"); // mm

  const [results, setResults] = useState<{
    type: "one-way" | "two-way";
    concreteVolumeWet: number;
    concreteVolumeDry: number;
    shortBarsCount: number;
    shortBarsTotalLength: number;
    longBarsCount: number;
    longBarsTotalLength: number;
    totalSteelWeight: number;
  } | null>(null);

  const calculateSlab = () => {
    const l_y = parseFloat(ly);
    const l_x = parseFloat(lx);
    const t = parseFloat(thickness);
    const ds = parseFloat(mainDia);
    const dl = parseFloat(distDia);
    const ss = parseFloat(mainSpacing);
    const sl = parseFloat(distSpacing);
    const c = parseFloat(clearCover);

    if (
      isNaN(l_y) || isNaN(l_x) || isNaN(t) || isNaN(ds) || 
      isNaN(dl) || isNaN(ss) || isNaN(sl) || isNaN(c) ||
      l_y <= 0 || l_x <= 0 || t <= 0 || ss <= 0 || sl <= 0
    ) {
      return;
    }

    // Concrete Volume
    const concreteVolumeWet = l_x * l_y * (t / 1000);
    const concreteVolumeDry = concreteVolumeWet * 1.54; // RULE: CONCRETE_DRY_VOLUME

    // Dimensions in mm
    const lx_mm = l_x * 1000;
    const ly_mm = l_y * 1000;

    let shortBarsCount = 0;
    let shortBarsTotalLength = 0;
    let longBarsCount = 0;
    let longBarsTotalLength = 0;

    if (slabType === "two-way") {
      const h_short = t - 2 * c;
      const h_long = t - 2 * c - ds; 

      // Short Span Bars (Parallel to lx, spread along ly)
      shortBarsCount = Math.ceil(ly_mm / ss) + 1; 
      const shortBarCutLength = lx_mm - 2 * c + 0.42 * h_short;
      shortBarsTotalLength = (shortBarsCount * shortBarCutLength) / 1000; 

      // Long Span Bars (Parallel to ly, spread along lx)
      longBarsCount = Math.ceil(lx_mm / sl) + 1; 
      const longBarCutLength = ly_mm - 2 * c + 0.42 * Math.max(0, h_long);
      longBarsTotalLength = (longBarsCount * longBarCutLength) / 1000;
    } else {
      // One-Way Slab
      // Main Bars (Parallel to lx, spread along ly)
      shortBarsCount = Math.ceil(ly_mm / ss) + 1; 
      const mainBarCutLength = lx_mm - 2 * c;
      shortBarsTotalLength = (shortBarsCount * mainBarCutLength) / 1000;

      // Distribution Bars (Parallel to ly, spread along lx)
      longBarsCount = Math.ceil(lx_mm / sl) + 1; 
      const distBarCutLength = ly_mm - 2 * c;
      longBarsTotalLength = (longBarsCount * distBarCutLength) / 1000;
    }

    // Steel Weight Calculation
    const shortUnitWeight = Math.pow(ds, 2) / 162.28;
    const longUnitWeight = Math.pow(dl, 2) / 162.28;

    const shortTotalWeight = shortUnitWeight * shortBarsTotalLength;
    const longTotalWeight = longUnitWeight * longBarsTotalLength;
    const totalSteelWeight = shortTotalWeight + longTotalWeight;

    setResults({
      type: slabType,
      concreteVolumeWet,
      concreteVolumeDry,
      shortBarsCount,
      shortBarsTotalLength,
      longBarsCount,
      longBarsTotalLength,
      totalSteelWeight,
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <SEO 
        title="Slab Estimator | EstiPro"
        description="Calculate concrete volume and steel reinforcement for one-way and two-way reinforced concrete slabs."
      />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <Grid2X2 className="w-8 h-8 text-[#1A1A1A]" />
          Slab Estimator
        </h1>
        <p className="text-slate-500 font-medium">
          Estimate concrete volume and total structural steel weight for one-way and two-way spanning slabs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          <div className="mb-6 p-1 bg-slate-100 rounded-xl flex gap-1">
            <button
              onClick={() => setSlabType("one-way")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${slabType === "one-way" ? "bg-white shadow-sm text-[#1A1A1A]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
            >
              One-Way Slab
            </button>
            <button
              onClick={() => setSlabType("two-way")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${slabType === "two-way" ? "bg-white shadow-sm text-[#1A1A1A]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
            >
              Two-Way Slab
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-[#1A1A1A]" />
            <h2 className="text-lg font-bold text-slate-800">Slab Dimensions</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Long Span (ly) (m)">
                <input
                  type="number"
                  min="0"
                  value={ly}
                  onChange={(e) => setLy(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </InputGroup>
              <InputGroup label="Short Span (lx) (m)">
                <input
                  type="number"
                  min="0"
                  value={lx}
                  onChange={(e) => setLx(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </InputGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Thickness (mm)">
                <input
                  type="number"
                  min="0"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </InputGroup>
              <InputGroup label="Clear Cover (mm)">
                <input
                  type="number"
                  min="0"
                  value={clearCover}
                  onChange={(e) => setClearCover(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </InputGroup>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 mt-8">
            <Grid2X2 className="w-5 h-5 text-[#1A1A1A]" />
            <h2 className="text-lg font-bold text-slate-800">Reinforcement Details</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">
                {slabType === "one-way" ? "Main Bars (Short Span)" : "Short Span Bars (Main)"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Diameter (mm)">
                  <select
                    value={mainDia}
                    onChange={(e) => setMainDia(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    {[8, 10, 12, 16, 20, 25].map(d => (
                      <option key={d} value={d}>{d} mm</option>
                    ))}
                  </select>
                </InputGroup>
                <InputGroup label="Spacing (c/c) (mm)">
                  <input
                    type="number"
                    min="0"
                    value={mainSpacing}
                    onChange={(e) => setMainSpacing(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">
                {slabType === "one-way" ? "Distribution Bars (Long Span)" : "Long Span Bars"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Diameter (mm)">
                  <select
                    value={distDia}
                    onChange={(e) => setDistDia(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    {[8, 10, 12, 16, 20, 25].map(d => (
                      <option key={d} value={d}>{d} mm</option>
                    ))}
                  </select>
                </InputGroup>
                <InputGroup label="Spacing (c/c) (mm)">
                  <input
                    type="number"
                    min="0"
                    value={distSpacing}
                    onChange={(e) => setDistSpacing(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          <button
            onClick={calculateSlab}
            className="w-full mt-6 bg-[#EDED78] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors mt-8"
          >
            Calculate Slab Quantities
          </button>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Calculation Results</h3>
          
          {results ? (
            <div className="space-y-6 flex-1">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Concrete Dry Volume (~1.54x)</p>
                <div className="text-3xl font-black text-white mb-2">
                  {results.concreteVolumeDry.toFixed(2)} <span className="text-lg text-slate-400 font-normal">m³</span>
                </div>
                <p className="text-slate-400 text-sm">Wet Volume: {results.concreteVolumeWet.toFixed(2)} m³</p>
              </div>
              
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Total Steel Weight</p>
                <div className="text-3xl font-black text-blue-400 mb-4">
                  {results.totalSteelWeight.toFixed(2)} <span className="text-lg text-slate-400 font-normal">kg</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                      {results.type === "one-way" ? "Main Bars" : "Short Span Bars"}
                    </p>
                    <p className="text-xl font-bold text-white">{results.shortBarsCount} <span className="text-xs font-normal text-slate-400">bars</span></p>
                    <p className="text-sm text-slate-300 mt-1">{results.shortBarsTotalLength.toFixed(1)}m total</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                      {results.type === "one-way" ? "Dist Bars" : "Long Span Bars"}
                    </p>
                    <p className="text-xl font-bold text-white">{results.longBarsCount} <span className="text-xs font-normal text-slate-400">bars</span></p>
                    <p className="text-sm text-slate-300 mt-1">{results.longBarsTotalLength.toFixed(1)}m total</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/40 border border-blue-800/50 rounded-xl">
                 <p className="text-xs flex gap-2">
                    <span className="text-blue-400">ℹ</span>
                    <span className="text-blue-200 leading-relaxed">
                      {results.type === "two-way" 
                        ? "Includes an assumption for alternate bent-up (cranked) bars contributing an additional average of 0.42d extra length per bar."
                        : "Main bars span across the shorter dimension (lx). Distribution bars span across the longer dimension (ly)."}
                    </span>
                 </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 py-12 text-center h-full">
              Enter slab dimensions and reinforcement details to calculate material requirements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
