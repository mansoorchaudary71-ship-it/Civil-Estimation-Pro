import React, { useState } from "react";
import { Grid2X2, Settings2, Replace } from "lucide-react";
import { SEO } from "../SEO";
import { CalculationHistory } from "../ui/CalculationHistory";
import { StyledChart } from "../ui/EstimateVisualizer";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";

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
        <h1 className="text-[28px] font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <Grid2X2 className="w-8 h-8 text-indigo-600" />
          Slab Estimator
        </h1>
        <p className="text-[#4B5563] font-medium">
          Estimate concrete volume and total structural steel weight for one-way and two-way spanning slabs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 p-6 md:p-8">
          
          <div className="mb-6 p-1 bg-slate-100 rounded-[12px] flex gap-1">
            <button
              onClick={() => setSlabType("one-way")}
              className={`flex-1 py-2 rounded-[12px] text-sm font-bold transition-all ${slabType === "one-way" ? "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-indigo-600" : "text-[#4B5563] hover:text-slate-700 hover:bg-slate-200/50"}`}
            >
              One-Way Slab
            </button>
            <button
              onClick={() => setSlabType("two-way")}
              className={`flex-1 py-2 rounded-[12px] text-sm font-bold transition-all ${slabType === "two-way" ? "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-indigo-600" : "text-[#4B5563] hover:text-slate-700 hover:bg-slate-200/50"}`}
            >
              Two-Way Slab
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-[#374151]">Slab Dimensions</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Long Span (ly) (m)">
                <input
                  type="number"
                  min="0"
                  value={ly}
                  onChange={(e) => setLy(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
                />
              </InputGroup>
              <InputGroup label="Short Span (lx) (m)">
                <input
                  type="number"
                  min="0"
                  value={lx}
                  onChange={(e) => setLx(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
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
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
                />
              </InputGroup>
              <InputGroup label="Clear Cover (mm)">
                <input
                  type="number"
                  min="0"
                  value={clearCover}
                  onChange={(e) => setClearCover(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
                />
              </InputGroup>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 mt-8">
            <Grid2X2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-[#374151]">Reinforcement Details</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-[12px] border border-slate-100">
              <h3 className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-3">
                {slabType === "one-way" ? "Main Bars (Short Span)" : "Short Span Bars (Main)"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Diameter (mm)">
                  <select
                    value={mainDia}
                    onChange={(e) => setMainDia(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
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
                    className="w-full h-11 bg-white border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-[12px] border border-slate-100">
              <h3 className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-3">
                {slabType === "one-way" ? "Distribution Bars (Long Span)" : "Long Span Bars"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Diameter (mm)">
                  <select
                    value={distDia}
                    onChange={(e) => setDistDia(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
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
                    className="w-full h-11 bg-white border border-slate-200 rounded-[12px] px-4 text-[#374151] font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all"
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          <button
            onClick={calculateSlab}
            className="w-full mt-6 bg-[#6B46C1] hover:bg-[#6B46C1] text-white font-bold py-4 rounded-[12px] transition-colors mt-8"
          >
            Calculate Slab Quantities
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          {results ? (
            <MaterialSummary
              title="Material Summary"
              totalLabel="Total Concrete Dry Volume"
              totalValue={results.concreteVolumeDry.toFixed(2)}
              totalUnit="m³"
              subtitle={`Wet Volume: ${results.concreteVolumeWet.toFixed(2)} m³`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Total Steel Weight"
                  value={results.totalSteelWeight.toFixed(2)}
                  unit="kg"
                  variant="primary"
                  badge={results.type === "one-way" ? "One-Way Slab" : "Two-Way Slab"}
                />
                <ResultCard
                  title={results.type === "one-way" ? "Main Bars" : "Short Span Bars"}
                  value={results.shortBarsCount}
                  unit="bars"
                  description={`${results.shortBarsTotalLength.toFixed(1)}m total length`}
                  variant="neutral"
                />
                <ResultCard
                  title={results.type === "one-way" ? "Dist Bars" : "Long Span Bars"}
                  value={results.longBarsCount}
                  unit="bars"
                  description={`${results.longBarsTotalLength.toFixed(1)}m total length`}
                  variant="neutral"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/10">
                <div className="mb-4 text-[10px] sm:text-xs font-extrabold text-slate-500 dark:text-white/50 uppercase tracking-[0.15em]">
                  Rebar Breakdown
                </div>
                <div className="bg-white/50 dark:bg-white rounded-[12px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-slate-900 border border-slate-200/50 dark:border-slate-100 backdrop-blur-md">
                  <StyledChart 
                    data={[
                      { name: results.type === "one-way" ? "Main Bars" : "Short Span", value: Math.round(results.shortBarsTotalLength), fill: '#6366f1' },
                      { name: results.type === "one-way" ? "Dist Bars" : "Long Span", value: Math.round(results.longBarsTotalLength), fill: '#14b8a6' }
                    ]}
                    type="bar"
                    title="Length Breakdown"
                    valueFormatter={(val) => `${val} m`}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-[12px]">
                 <p className="text-xs flex gap-2">
                    <span className="text-amber-600 dark:text-amber-500 font-bold">ℹ</span>
                    <span className="text-slate-600 dark:text-amber-500/80 leading-relaxed">
                      {results.type === "two-way" 
                        ? "Includes an assumption for alternate bent-up (cranked) bars contributing an additional average of 0.42d extra length per bar."
                        : "Main bars span across the shorter dimension (lx). Distribution bars span across the longer dimension (ly)."}
                    </span>
                 </p>
              </div>
            </MaterialSummary>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-[12px] p-6 lg:p-12 text-center flex items-center justify-center h-full shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <span className="text-[#4B5563] font-medium tracking-wide">Enter dimensions to calculate</span>
            </div>
          )}
        </div>
      </div>
      
      <CalculationHistory
        calculatorId="slab_estimator"
        currentInputs={{ type: slabType, ly, lx, thickness, clearCover, mainDia, distDia, mainSpacing, distSpacing }}
        currentResults={results ? {
          "Concrete Dry Vol": `${results.concreteVolumeDry.toFixed(2)} m³`,
          "Total Steel Wt": `${results.totalSteelWeight.toFixed(2)} kg`
        } : undefined}
        onRestore={(inputs) => {
          setSlabType(inputs.type || "two-way");
          setLy(inputs.ly || "5");
          setLx(inputs.lx || "4");
          setThickness(inputs.thickness || "150");
          setClearCover(inputs.clearCover || "20");
          setMainDia(inputs.mainDia || "12");
          setDistDia(inputs.distDia || "10");
          setMainSpacing(inputs.mainSpacing || "150");
          setDistSpacing(inputs.distSpacing || "150");
        }}
        estimationName="Slab"
      />
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
