import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Calculator, ArrowRight, Save, Printer, Share2, Ruler, Lock, BrickWall, Clock, HelpCircle } from "lucide-react";
import { useEstimateProcessing } from "../../hooks/useEstimateProcessing";
import { ProcessingSkeleton } from "../ui/ProcessingSkeleton";
import { useGlobalSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";

export default function PrecastWallCalculator() {
  const { isProcessing, hasData, processEstimate } = useEstimateProcessing();
  const { currentUnit } = useGlobalSettings();
  const isMetric = currentUnit === "metric";

  const [totalLength, setTotalLength] = useState("100");
  const [postSpacing, setPostSpacing] = useState("2.5");
  const [wallHeight, setWallHeight] = useState("2.0");
  const [slabHeight, setSlabHeight] = useState("0.3");
  
  const [postRate, setPostRate] = useState("800");
  const [slabRate, setSlabRate] = useState("400");
  const [laborRatePerRunningMeter, setLaborRate] = useState("150");

  const estimateData = useMemo(() => {
    if (!hasData) return null;

    const length = parseFloat(totalLength) || 0;
    const spacing = parseFloat(postSpacing) || 1;
    const height = parseFloat(wallHeight) || 0;
    const sHeight = parseFloat(slabHeight) || 0.1;

    const numberOfBays = Math.ceil(length / spacing);
    const numberOfPosts = numberOfBays + 1; // n bays need n+1 posts usually
    const actualLengthLengthCovered = numberOfBays * spacing;

    const slabsPerBay = Math.ceil(height / sHeight);
    const totalSlabs = numberOfBays * slabsPerBay;

    const pr = parseFloat(postRate) || 0;
    const sr = parseFloat(slabRate) || 0;
    const lr = parseFloat(laborRatePerRunningMeter) || 0;

    const costPosts = numberOfPosts * pr;
    const costSlabs = totalSlabs * sr;
    const costLabor = length * lr;
    const totalCost = costPosts + costSlabs + costLabor;

    return {
      numberOfPosts,
      slabsPerBay,
      totalSlabs,
      costPosts,
      costSlabs,
      costLabor,
      totalCost,
      numberOfBays,
      lengthOption: isMetric ? "m" : "ft"
    };
  }, [hasData, totalLength, postSpacing, wallHeight, slabHeight, postRate, slabRate, laborRatePerRunningMeter, isMetric]);

  const handlePrint = () => window.print();

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-900 pb-[120px]">
      <Helmet>
        <title>Precast Compound Wall Calculator</title>
        <meta name="description" content="Calculate precast slabs, posts, and costs for boundary walls." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <BrickWall className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Precast Wall Calculator
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase ml-2 border border-emerald-200 dark:border-emerald-800">
              Beginner
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold tracking-wide flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5" /> 3 MIN
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            Estimate quantities and costs for commercial boundary walls using precast concrete panels and H-columns. Get an instant Bill of Materials (BOM).
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Panel */}
          <div className="w-full md:w-[45%] flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                Boundary Dimensions
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Total Length ({isMetric ? "m" : "ft"})</label>
                  <input
                    type="number"
                    value={totalLength}
                    onChange={(e) => setTotalLength(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Wall Height ({isMetric ? "m" : "ft"})</label>
                  <input
                    type="number"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 mt-8">
                Precast Component Specs
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Post Spacing c/c ({isMetric ? "m" : "ft"})</label>
                  <input
                    type="number"
                    value={postSpacing}
                    onChange={(e) => setPostSpacing(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Single Slab Height ({isMetric ? "m" : "ft"})</label>
                  <input
                    type="number"
                    value={slabHeight}
                    onChange={(e) => setSlabHeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 mt-8">
                Cost & Rates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Rate/Post</label>
                  <input
                    type="number"
                    value={postRate}
                    onChange={(e) => setPostRate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Rate/Slab</label>
                  <input
                    type="number"
                    value={slabRate}
                    onChange={(e) => setSlabRate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Labor/{isMetric ? "m" : "ft"}</label>
                  <input
                    type="number"
                    value={laborRatePerRunningMeter}
                    onChange={(e) => setLaborRate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => processEstimate(() => {})}
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 group border border-indigo-500"
              >
                {isProcessing ? "Computing..." : "Generate BOM"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Math Logic & Formulas
              </h4>
              <ul className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 space-y-2 list-disc list-inside leading-relaxed uppercase tracking-wider font-semibold">
                <li>Bays = CEIL(Total Length / Post Spacing)</li>
                <li>Posts Required = Total Bays + 1</li>
                <li>Slabs per Bay = Wall height / Slab height</li>
                <li>Total Slabs = Total Bays × Slabs per Bay</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide text-xs">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">Why do we add 1 to the post count?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">A linear wall segment requires a starting post and an ending post. For n bays, you need n+1 posts. If it's a closed loop enclosure, n posts = n bays.</p>
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
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-lg relative">
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 block">Total BOM Cost</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                          ${estimateData.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Material Breakdown</h4>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Component</th>
                          <th className="px-4 py-3 text-right">Quantity</th>
                          <th className="px-4 py-3 text-right">Rate</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">H-Column Posts</td>
                          <td className="px-4 py-3 text-right font-mono">{estimateData.numberOfPosts} nos</td>
                          <td className="px-4 py-3 text-right font-mono">${postRate}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">${estimateData.costPosts.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Precast Slabs</td>
                          <td className="px-4 py-3 text-right font-mono">{estimateData.totalSlabs} nos</td>
                          <td className="px-4 py-3 text-right font-mono">${slabRate}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">${estimateData.costSlabs.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Installation/Labor</td>
                          <td className="px-4 py-3 text-right font-mono">{totalLength} {estimateData.lengthOption}</td>
                          <td className="px-4 py-3 text-right font-mono">${laborRatePerRunningMeter}/{estimateData.lengthOption}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">${estimateData.costLabor.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-slate-100/50 dark:bg-slate-800/30">
                          <td colSpan={3} className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200 text-right">Total Estimates</td>
                          <td className="px-4 py-3 text-right font-black text-indigo-600 dark:text-indigo-400">${estimateData.totalCost.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Total Bays Formed</span>
                      <div className="text-xl font-black text-slate-800 dark:text-white">{estimateData.numberOfBays}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Slabs per Bay</span>
                      <div className="text-xl font-black text-slate-800 dark:text-white">{estimateData.slabsPerBay}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-graph-pattern opacity-80 mix-blend-multiply dark:mix-blend-lighten">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 shadow-highlight">
                  <BrickWall className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Build the Wall</h3>
                <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                  Input the plot dimensions and precast component specs. A complete tabular Bill of Materials and cost breakdown will be generated instantly.
                </p>
              </div>
            )}
            
            <CalculationHistory
              calculatorId="precast_wall_calculator"
              currentInputs={{ totalLength, postSpacing, wallHeight, slabHeight, postRate, slabRate, laborRatePerRunningMeter }}
              currentResults={estimateData ? {
                "Total Posts": `${estimateData.totalPosts} nos`,
                "Total Slabs": `${estimateData.totalSlabs} nos`,
                "Total Bays Formed": `${estimateData.numberOfBays}`,
                "Total Cost": `$${estimateData.totalCost.toLocaleString()}`
              } : undefined}
              estimationName="Precast Wall Estimate"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
