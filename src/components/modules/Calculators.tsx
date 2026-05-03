import { useState } from "react";
import { Copy, RefreshCw, Calculator, Grid3x3, Layers } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { ConcreteMortarCalculator, BrickworkCalculator, SteelCalculator } from "../../utils/calculators";

export default function CoreCalculators() {
  const { formatCurrency, settings } = useSettings();
  const isSI = settings.measurement === "SI";
  const [activeTab, setActiveTab] = useState<"concrete" | "bricks" | "steel">("concrete");
  
  // Concrete State (Dimensions in feet)
  const [length, setLength] = useState("10"); // ft
  const [width, setWidth] = useState("10"); // ft
  const [depth, setDepth] = useState("0.5"); // ft
  const [mixRatio, setMixRatio] = useState("1:2:4"); 

  // Market Rates
  const [cementRate, setCementRate] = useState("1200"); // per bag
  const [sandRate, setSandRate] = useState("40"); // per {isSI ? "cu.m" : "cft"}
  const [aggregateRate, setAggregateRate] = useState("45"); // per {isSI ? "cu.m" : "cft"}

  // Bricks State
  const [bWallLength, setBWallLength] = useState("20"); // ft
  const [bWallHeight, setBWallHeight] = useState("10"); // ft
  const [bWallThickness, setBWallThickness] = useState("9"); // inches
  const [bDeductions, setBDeductions] = useState("21"); // sq ft
  
  const [brickL, setBrickL] = useState("9"); // inches
  const [brickW, setBrickW] = useState("4.5"); // inches
  const [brickH, setBrickH] = useState("3"); // inches
  
  const [mortarThickness, setMortarThickness] = useState("0.39"); // inches
  const [bMixRatio, setBMixRatio] = useState("1:4"); // cement:sand
  
  const [brickRate, setBrickRate] = useState("15"); // per brick
  const [bCementRate, setBCementRate] = useState("1200"); // per bag
  const [bSandRate, setBSandRate] = useState("40"); // per {isSI ? "cu.m" : "cft"}

  // Steel State
  const [componentName, setComponentName] = useState("Main Slab");
  const [barDia, setBarDia] = useState("12"); // mm
  const [spanLength, setSpanLength] = useState("10"); // m
  const [spacing, setSpacing] = useState("150"); // mm
  const [cutLength, setCutLength] = useState("5"); // m
  const [overlapFactor, setOverlapFactor] = useState("50"); // 50d
  const [overlapCount, setOverlapCount] = useState("1"); // per bar
  const [steelPrice, setSteelPrice] = useState("110"); // per kg

  // --- Computations ---
  const calc = new ConcreteMortarCalculator(
    (parseFloat(length) || 0) * (isSI ? 3.28084 : 1),
    (parseFloat(width) || 0) * (isSI ? 3.28084 : 1),
    (parseFloat(depth) || 0) * (isSI ? 3.28084 : 1),
    mixRatio
  );
  const results = calc.calculate();
  const cementCost = results.cementBags * (parseFloat(cementRate) || 0);
  const sandCost = (isSI ? results.sandCft / 35.3147 : results.sandCft) * (parseFloat(sandRate) || 0);
  const aggregateCost = (isSI ? results.aggregateCft / 35.3147 : results.aggregateCft) * (parseFloat(aggregateRate) || 0);
  const totalCost = cementCost + sandCost + aggregateCost;

  const brickCalc = new BrickworkCalculator(
    (parseFloat(bWallLength) || 0) * (isSI ? 3.28084 : 1),
    (parseFloat(bWallHeight) || 0) * (isSI ? 3.28084 : 1),
    (parseFloat(bWallThickness) || 0) / (isSI ? 2.54 : 1),
    (parseFloat(bDeductions) || 0) * (isSI ? 10.7639 : 1),
    (parseFloat(brickL) || 0) / (isSI ? 2.54 : 1),
    (parseFloat(brickW) || 0) / (isSI ? 2.54 : 1),
    (parseFloat(brickH) || 0) / (isSI ? 2.54 : 1),
    (parseFloat(mortarThickness) || 0) / (isSI ? 2.54 : 1),
    bMixRatio
  );
  const brickResults = brickCalc.calculate();
  const brickTotalCost = 
    (brickResults.numBricks * (parseFloat(brickRate) || 0)) + 
    (brickResults.cementBags * (parseFloat(bCementRate) || 0)) +
    ((isSI ? brickResults.sandCft / 35.3147 : brickResults.sandCft) * (parseFloat(bSandRate) || 0));

  const steelCalc = new SteelCalculator(
    parseFloat(barDia) || 0,
    parseFloat(spanLength) || 0,
    parseFloat(spacing) || 0,
    parseFloat(cutLength) || 0,
    parseFloat(overlapFactor) || 0,
    parseFloat(overlapCount) || 0
  );
  const steelResults = steelCalc.calculate();
  const steelTotalCost = steelResults.totalWeightKg * (parseFloat(steelPrice) || 0);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 text-slate-900 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent pb-2">
            Core Calculators
          </h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Accurate estimations for concrete, bricks, and steel requirements.
          </p>
        </div>

        {/* Custom Segmented Control */}
        <div className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-1.5 bg-white border border-slate-200 shadow-sm rounded-2xl w-full sm:w-fit relative mb-6">
          {["concrete", "bricks", "steel"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm capitalize transition-all duration-300 ${
                activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {tab === 'concrete' && <Calculator className="w-[18px] h-[18px]" />}
              {tab === 'bricks' && <Grid3x3 className="w-[18px] h-[18px]" />}
              {tab === 'steel' && <Layers className="w-[18px] h-[18px]" />}
              <span className="whitespace-nowrap">{tab}</span>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden transition-all duration-300">
        {activeTab === "concrete" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {/* Input Section */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-[14px] h-[14px] text-slate-500" />
                  Dimensions ({isSI ? "Meters" : "Feet"})
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Length</label>
                    <input 
                      type="number" 
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Width</label>
                    <input 
                      type="number" 
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Depth</label>
                    <input 
                      type="number" 
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-[14px] h-[14px] text-slate-500" />
                  Mix & Rates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mix Ratio (Cement:Sand:Crush)</label>
                    <select 
                      value={mixRatio}
                      onChange={(e) => setMixRatio(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                    >
                      <option value="1:6:0">1:6 Mortar</option>
                      <option value="1:4:0">1:4 Mortar</option>
                      <option value="1:5:10">1:5:10 (PCC/M5)</option>
                      <option value="1:4:8">1:4:8 (PCC/M7.5)</option>
                      <option value="1:3:6">1:3:6 (M10)</option>
                      <option value="1:2:4">1:2:4 (RCC/M15)</option>
                      <option value="1:1.5:3">1:1.5:3 (RCC/M20)</option>
                      <option value="1:1:2">1:1:2 (RCC/M25)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cement Rate / Bag</label>
                    <input 
                      type="number" 
                      value={cementRate}
                      onChange={(e) => setCementRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sand Rate / {isSI ? "cu.m" : "cft"} / {isSI ? "cu.m" : "cft"}</label>
                    <input 
                      type="number" 
                      value={sandRate}
                      onChange={(e) => setSandRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Crush/Aggregate Rate / {isSI ? "cu.m" : "cft"}</label>
                    <input 
                      type="number" 
                      value={aggregateRate}
                      onChange={(e) => setAggregateRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white"
                      disabled={!mixRatio.includes(':') || mixRatio.split(':')[2] === '0'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-slate-800">Material Breakdown & Cost</h3>
                <div className="text-[10px] font-mono whitespace-nowrap text-slate-500">
                  Wet Vol: {(isSI ? calc.getWetVolumeCft() / 35.3147 : calc.getWetVolumeCft()).toFixed(2)} {isSI ? "cu.m" : "cft"}
                </div>
              </div>
              
              <div className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Cement (50kg bags)</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">{results.cementBags.toFixed(2)} <span className="text-[10px] font-sans text-indigo-600">bags</span></div>
                    <div className="text-sm font-mono text-slate-400">{formatCurrency(cementCost)}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Sand (Fine Aggregate)</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">{(isSI ? results.sandCft / 35.3147 : results.sandCft).toFixed(2)} <span className="text-[10px] font-sans text-green-400">{isSI ? "cu.m" : "cft"}</span></div>
                    <div className="text-sm font-mono text-slate-400">{formatCurrency(sandCost)}</div>
                  </div>
                </div>
              </div>

              <div className={`p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow ${(!mixRatio.includes(':') || mixRatio.split(':')[2] === '0') ? 'opacity-50' : ''}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Crush (Coarse Aggregate)</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">{(isSI ? results.aggregateCft / 35.3147 : results.aggregateCft).toFixed(2)} <span className="text-[10px] font-sans text-orange-400">{isSI ? "cu.m" : "cft"}</span></div>
                    <div className="text-sm font-mono text-slate-400">{formatCurrency(aggregateCost)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-end">
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest">Estimated Material Cost</div>
                <div className="text-2xl font-mono font-bold text-slate-800">{formatCurrency(totalCost)}</div>
              </div>
              
              <div className="mt-auto text-[10px] text-slate-500">
                * Assumes 1.54 as the dry volume factor. 1 bag of cement ≈ 1.226 {isSI ? "cu.m" : "cft"}. Wastage is not included.
              </div>
            </div>
          </div>
        )}

        {activeTab === "bricks" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-[14px] h-[14px] text-slate-500" />
                  Wall Dimensions ({isSI ? "Meters" : "Feet"}) & Deductions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Length ({isSI ? "m" : "ft"})</label>
                    <input type="number" value={bWallLength} onChange={e => setBWallLength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Height ({isSI ? "m" : "ft"})</label>
                    <input type="number" value={bWallHeight} onChange={e => setBWallHeight(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Thickness ({isSI ? "cm" : "in"})</label>
                    <input type="number" value={bWallThickness} onChange={e => setBWallThickness(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deductions ({isSI ? "sq.m" : "sq.ft"})</label>
                    <input type="number" value={bDeductions} onChange={e => setBDeductions(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Grid3x3 className="w-[14px] h-[14px] text-slate-500" />
                  Brick Dimensions ({isSI ? "cm" : "Inches"})
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Length</label>
                    <input type="number" value={brickL} onChange={e => setBrickL(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Width</label>
                    <input type="number" value={brickW} onChange={e => setBrickW(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Height</label>
                    <input type="number" value={brickH} onChange={e => setBrickH(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-[14px] h-[14px] text-slate-500" />
                  Mortar & Rates
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Joint / Mortar ({isSI ? "cm" : "in"})</label>
                    <input type="number" value={mortarThickness} onChange={e => setMortarThickness(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mortar Mix (Cement:Sand)</label>
                    <select value={bMixRatio} onChange={e => setBMixRatio(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white">
                      <option value="1:3">1:3 Mortar</option>
                      <option value="1:4">1:4 Mortar</option>
                      <option value="1:5">1:5 Mortar</option>
                      <option value="1:6">1:6 Mortar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Brick Rate</label>
                    <input type="number" value={brickRate} onChange={e => setBrickRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cement Rate</label>
                    <input type="number" value={bCementRate} onChange={e => setBCementRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sand Rate</label>
                    <input type="number" value={bSandRate} onChange={e => setBSandRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-slate-800">Material Breakdown & Cost</h3>
                <div className="text-[10px] font-mono whitespace-nowrap text-slate-500">
                  Net Wall Vol: {(isSI ? brickCalc.getNetWallVolumeCft() / 35.3147 : brickCalc.getNetWallVolumeCft()).toFixed(2)} {isSI ? "cu.m" : "cft"}
                </div>
              </div>

              <div className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Bricks Required</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">{brickResults.numBricks} <span className="text-[10px] font-sans text-red-400">bricks</span></div>
                    <div className="text-sm font-mono text-slate-400">{formatCurrency(brickResults.numBricks * (parseFloat(brickRate) || 0))}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Cement (50kg bags)</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">{brickResults.cementBags.toFixed(2)} <span className="text-[10px] font-sans text-indigo-600">bags</span></div>
                    <div className="text-sm font-mono text-slate-400">{formatCurrency(brickResults.cementBags * (parseFloat(bCementRate) || 0))}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Sand (Fine Aggregate)</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">{(isSI ? brickResults.sandCft / 35.3147 : brickResults.sandCft).toFixed(2)} <span className="text-[10px] font-sans text-green-400">{isSI ? "cu.m" : "cft"}</span></div>
                    <div className="text-sm font-mono text-slate-400">{formatCurrency((isSI ? brickResults.sandCft / 35.3147 : brickResults.sandCft) * (parseFloat(bSandRate) || 0))}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-end">
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest">Estimated Material Cost</div>
                <div className="text-2xl font-mono font-bold text-slate-800">{formatCurrency(brickTotalCost)}</div>
              </div>
              
              <div className="mt-auto text-[10px] text-slate-500">
                * Based on wet mortar volume of {(isSI ? brickResults.mortarWetVolCft / 35.3147 : brickResults.mortarWetVolCft).toFixed(2)} {isSI ? "cu.m" : "cft"}. Wastage is not included. 
              </div>
            </div>
          </div>
        )}

        {activeTab === "steel" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Layers className="w-[14px] h-[14px] text-slate-500" />
                  Bar Properties & Dimensions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Component Name</label>
                    <input type="text" value={componentName} onChange={e => setComponentName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" placeholder="e.g. Main Slab" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Diameter (mm)</label>
                    <input type="number" value={barDia} onChange={e => setBarDia(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Span Length (m)</label>
                    <input type="number" value={spanLength} onChange={e => setSpanLength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" title="Area to distribute bars across" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Spacing (mm)</label>
                    <input type="number" value={spacing} onChange={e => setSpacing(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cut Length/Bar (m)</label>
                    <input type="number" value={cutLength} onChange={e => setCutLength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-[14px] h-[14px] text-slate-500" />
                  Overlaps & Rates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Overlap Factor</label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all shadow-sm">
                      <input type="number" value={overlapFactor} onChange={e => setOverlapFactor(e.target.value)} className="w-full bg-transparent px-4 py-2.5 text-sm font-medium focus:outline-none text-slate-800 text-right" />
                      <div className="flex items-center justify-center px-4 font-bold text-sm text-slate-500 bg-slate-50/50 border-l border-slate-100">d</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Laps per Bar</label>
                    <input type="number" value={overlapCount} onChange={e => setOverlapCount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Price/Kg</label>
                    <input type="number" value={steelPrice} onChange={e => setSteelPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all focus:bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-slate-800">Bar Bending Schedule (BBS)</h3>
                <div className="text-[10px] font-mono whitespace-nowrap text-slate-500">
                  Wt/m: {steelResults.weightPerMeter.toFixed(3)} kg/m
                </div>
              </div>

              {/* BBS Generated Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-bold">Component</th>
                      <th className="px-4 py-3 font-bold text-center">Dia</th>
                      <th className="px-4 py-3 font-bold text-center">Bars</th>
                      <th className="px-4 py-3 font-bold text-right">Len/Bar</th>
                      <th className="px-4 py-3 font-bold text-right bg-slate-50/50 border-l border-slate-100">Total Wt</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-800 divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium truncate max-w-[100px]" title={componentName || "N/A"}>{componentName || "N/A"}</td>
                      <td className="px-4 py-3 font-mono text-center text-orange-500 font-medium">Ø{barDia}</td>
                      <td className="px-4 py-3 font-mono text-center font-medium">{steelResults.numBars}</td>
                      <td className="px-4 py-3 font-mono text-right text-slate-500">{steelResults.singleBarTotalLengthM.toFixed(2)}m</td>
                      <td className="px-4 py-3 font-mono text-right font-bold text-indigo-600 bg-slate-50/50 border-l border-slate-100">
                        {steelResults.totalWeightKg.toFixed(2)} kg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl relative overflow-hidden hover:shadow-md transition-shadow mt-2">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Total Weight (Metric Tons)</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xl font-mono text-slate-800">
                      {steelResults.totalWeightMT.toFixed(3)} <span className="text-[10px] font-sans text-orange-400">MT</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-end">
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest">Estimated Cost</div>
                <div className="text-2xl font-mono font-bold text-slate-800">{formatCurrency(steelTotalCost)}</div>
              </div>

              <div className="text-[10px] text-slate-500">
                * D²/162 formula used for unit weight. Cover distance and hooks deductions are not included.
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
