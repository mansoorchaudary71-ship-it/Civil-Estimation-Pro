import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Calculator, ArrowRight, Save, Printer, Share2, Bug, Clock, HelpCircle } from "lucide-react";
import { useEstimateProcessing } from "../../hooks/useEstimateProcessing";
import { ProcessingSkeleton } from "../ui/ProcessingSkeleton";
import { useGlobalSettings } from "../../context/SettingsContext";

export default function AntiTermiteCalculator() {
  const { isProcessing, hasData, processEstimate, resetEstimate } = useEstimateProcessing();
  const { currentUnit } = useGlobalSettings();
  const isMetric = currentUnit === "metric";

  const [floorArea, setFloorArea] = useState("100");
  const [perimeter, setPerimeter] = useState("40");
  const [trenchDepth, setTrenchDepth] = useState("0.5");

  const chemicals = [
    { name: "Chlorpyrifos 20% EC (1:19 dilution)", ratio: 20 },
    { name: "Bifenthrin 2.5% EC (1:19 dilution)", ratio: 20 },
    { name: "Imidacloprid 30.5% SC (1:475 dilution)", ratio: 476 },
    { name: "Custom Dilution Factor", ratio: 0 },
  ];

  const [selectedChemical, setSelectedChemical] = useState(chemicals[0]);
  const [customRatio, setCustomRatio] = useState("20");
  const [costPerLitre, setCostPerLitre] = useState("15");

  const handleDataChange = () => {
    if (hasData) resetEstimate();
  };

  const estimateData = useMemo(() => {
    if (!hasData) return null;

    const parseNum = (val: string) => Math.max(0, parseFloat(val) || 0);

    const fArea = parseNum(floorArea);
    const p = parseNum(perimeter);
    const d = parseNum(trenchDepth);

    // Convert to metric for standard calculation (Liters)
    const floorAreaM2 = isMetric ? fArea : fArea * 0.092903;
    const perimeterM = isMetric ? p : p * 0.3048;
    const adminDepthM = isMetric ? d : d * 0.3048;

    // Rules:
    // Floor Area: 5 Liters of emulsion per square meter
    // Perimeter Trench: 7.5 Liters of emulsion per linear meter per meter of depth -> perimeter * depth * 7.5
    // Wait, the rule usually says 7.5 L/sqm of vertical surface of the substructure. So perimeter * depth = sqm.
    const emulsionFloorL = floorAreaM2 * 5;
    const emulsionTrenchL = perimeterM * adminDepthM * 7.5;
    const totalEmulsionL = emulsionFloorL + emulsionTrenchL;

    const dilutionRatio = selectedChemical.ratio === 0 ? parseNum(customRatio) : selectedChemical.ratio;
    // Prevent division by zero
    const safeRatio = dilutionRatio > 0 ? dilutionRatio : 1;

    const chemicalConcentrateL = totalEmulsionL / safeRatio;
    
    // Cost
    const rate = parseNum(costPerLitre);
    const totalCost = chemicalConcentrateL * rate;

    // Conversions for display if imperial
    const emulsionFloorDisplay = isMetric ? emulsionFloorL : emulsionFloorL * 0.264172; // Gallons
    const emulsionTrenchDisplay = isMetric ? emulsionTrenchL : emulsionTrenchL * 0.264172;
    const totalEmulsionDisplay = isMetric ? totalEmulsionL : totalEmulsionL * 0.264172;
    const chemicalConcentrateDisplay = isMetric ? chemicalConcentrateL : chemicalConcentrateL * 0.264172;

    const volumeUnit = isMetric ? "Liters" : "Gallons";

    return {
      emulsionFloor: emulsionFloorDisplay,
      emulsionTrench: emulsionTrenchDisplay,
      totalEmulsion: totalEmulsionDisplay,
      chemicalConcentrate: chemicalConcentrateDisplay,
      totalCost,
      volumeUnit,
      dilutionRatio: safeRatio
    };
  }, [hasData, floorArea, perimeter, trenchDepth, selectedChemical, customRatio, costPerLitre, isMetric]);

  const handlePrint = () => window.print();

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-900 pb-[120px]">
      <Helmet>
        <title>Anti-Termite Treatment Calculator</title>
        <meta name="description" content="Calculate chemical emulsion volume and concentrate for pre-construction anti-termite treatment." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Bug className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Anti-Termite Treatment
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase ml-2 border border-emerald-200 dark:border-emerald-800">
              Beginner
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold tracking-wide flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5" /> 2 MIN
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            Estimate the total chemical emulsion volume and required concentrate for pre-construction termite soil treatment for building foundations and floor slabs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Panel */}
          <div className="w-full md:w-[45%] flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Foundation Dimensions</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Ground Floor Area</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={floorArea}
                      onChange={(e) => { setFloorArea(e.target.value); handleDataChange(); }}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "sq m" : "sq ft"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Perimeter Length</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={perimeter}
                      onChange={(e) => { setPerimeter(e.target.value); handleDataChange(); }}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "m" : "ft"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Trench Depth</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={trenchDepth}
                      onChange={(e) => { setTrenchDepth(e.target.value); handleDataChange(); }}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "m" : "ft"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 mt-8">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Chemical Specs</h3>
              </div>

              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Chemical & Dilution</label>
                <select
                  value={selectedChemical.name}
                  onChange={(e) => {
                    const chem = chemicals.find(c => c.name === e.target.value);
                    if (chem) {
                      setSelectedChemical(chem);
                      handleDataChange();
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold appearance-none"
                >
                  {chemicals.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {selectedChemical.ratio === 0 && (
                <div className="mb-4 fade-in">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Custom Ratio (1 part chemical : X parts water)</label>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold font-mono">1 : </span>
                    <input
                      type="number"
                      value={customRatio}
                      onChange={(e) => { setCustomRatio(e.target.value); handleDataChange(); }}
                      className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div className="mb-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Cost of Chemical Concentrate</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={costPerLitre}
                    onChange={(e) => { setCostPerLitre(e.target.value); handleDataChange(); }}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-8 pr-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">per {isMetric ? "Liter" : "Gallon"}</span>
                </div>
              </div>

              <button
                onClick={() => processEstimate(() => {})}
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 group border border-indigo-500"
              >
                {isProcessing ? "Computing..." : "Generate Estimate"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Math Logic & Formulas
              </h4>
              <ul className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 space-y-2 list-disc list-inside leading-relaxed uppercase tracking-wider font-semibold">
                <li><strong className="lowercase">Floor Treatment</strong> = Floor Area × 5 Liters/sqm</li>
                <li><strong className="lowercase">Trench Treatment</strong> = Perimeter × Depth × 7.5 Liters/sqm</li>
                <li><strong className="lowercase">Total Emulsion</strong> = Floor Treatment + Trench Treatment</li>
                <li><strong className="lowercase">Chemical Concentrate</strong> = Total Emulsion ÷ Dilution Ratio</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide text-xs">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">What is emulsion vs concentrate?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">The "Concentrate" is the pure chemical you purchase in bottles. You mix it with water at a specific ratio to create the "Emulsion" which is flooded into the soil.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="w-full md:w-[55%]">
            {isProcessing ? (
              <ProcessingSkeleton count={5} />
            ) : hasData && estimateData ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 block">Total Treatment Cost</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                          ${estimateData.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                      <span className="text-indigo-600/80 dark:text-indigo-400/80 text-xs font-bold uppercase tracking-widest block mb-2 relative z-10 w-full truncate">Required Concentrate</span>
                      <div className="text-4xl font-black text-indigo-700 dark:text-indigo-300 relative z-10 flex items-baseline gap-1">
                        {estimateData.chemicalConcentrate.toLocaleString(undefined, {maximumFractionDigits: 1})}
                        <span className="text-lg font-bold">{estimateData.volumeUnit}</span>
                      </div>
                      <span className="text-[10px] text-indigo-500/70 font-bold mt-1 block relative z-10 uppercase tracking-widest">Pure Chemical Needed</span>
                    </div>
                    
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded-2xl border border-cyan-100 dark:border-cyan-800/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                      <span className="text-cyan-600/80 dark:text-cyan-400/80 text-xs font-bold uppercase tracking-widest block mb-2 relative z-10 w-full truncate">Total Emulsion</span>
                      <div className="text-4xl font-black text-cyan-700 dark:text-cyan-300 relative z-10 flex items-baseline gap-1">
                        {estimateData.totalEmulsion.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        <span className="text-lg font-bold">{estimateData.volumeUnit}</span>
                      </div>
                      <span className="text-[10px] text-cyan-500/70 font-bold mt-1 block relative z-10 uppercase tracking-widest">Mixed Solution Required</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4 border-b border-black/5 dark:border-white/5 pb-2">Application Breakdown</h4>
                  
                  <div className="space-y-3 mb-6">
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex justify-between items-center group hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-colors">
                       <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Floor / Slab Emulsion</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{Math.round(estimateData.emulsionFloor).toLocaleString()} {estimateData.volumeUnit}</span>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex justify-between items-center group hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-colors">
                       <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Trench / Perimeter Emulsion</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{Math.round(estimateData.emulsionTrench).toLocaleString()} {estimateData.volumeUnit}</span>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex justify-between items-center">
                       <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Dilution Ratio Used</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">1 : {estimateData.dilutionRatio}</span>
                     </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-2 transition-colors">
                      <Save className="w-4 h-4" /> Save Specs
                    </button>
                    <div className="flex gap-2">
                       <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors font-bold text-sm">
                         <Printer className="w-4 h-4" /> Print
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm border-none hover:bg-indigo-700 transition-colors font-bold text-sm">
                         <Share2 className="w-4 h-4" /> Share
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center opacity-80">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 shadow-highlight">
                  <Bug className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Configure Treatment</h3>
                <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                  Input the foundation dimensions and chemical dilution. The total required emulsion volume and pure concentrate amounts will be calculated.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
