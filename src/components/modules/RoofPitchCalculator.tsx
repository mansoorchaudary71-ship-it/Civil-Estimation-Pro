import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Calculator, ArrowRight, Save, Printer, Share2, Triangle, Clock, HelpCircle } from "lucide-react";
import { useEstimateProcessing } from "../../hooks/useEstimateProcessing";
import { ProcessingSkeleton } from "../ui/ProcessingSkeleton";
import { useGlobalSettings } from "../../context/SettingsContext";

export default function RoofPitchCalculator() {
  const { isProcessing, hasData, processEstimate, resetEstimate } = useEstimateProcessing();
  const { currentUnit } = useGlobalSettings();
  const isMetric = currentUnit === "metric";

  const [inputMode, setInputMode] = useState<"rise-run" | "pitch-angle">("rise-run");
  
  // Inputs
  const [rise, setRise] = useState("6");
  const [run, setRun] = useState("12");
  
  const [pitchAngle, setPitchAngle] = useState("26.57");
  const [runForAngle, setRunForAngle] = useState("12");

  const [overhang, setOverhang] = useState("2"); // horizontal overhang

  const estimateData = useMemo(() => {
    if (!hasData) return null;

    let computedRise = 0;
    let computedRun = 0;
    let computedAngleRad = 0;

    const parseNum = (val: string) => Math.max(0, parseFloat(val) || 0);

    const OH = parseNum(overhang);

    if (inputMode === "rise-run") {
      computedRise = parseNum(rise);
      computedRun = parseNum(run);
      // Avoid division by zero
      computedRun = computedRun === 0 ? 1 : computedRun;
      computedAngleRad = Math.atan(computedRise / computedRun);
    } else {
      computedRun = parseNum(runForAngle);
      computedRun = computedRun === 0 ? 1 : computedRun;
      let angleDeg = parseNum(pitchAngle);
      // Cap angle strictly between 0 and 89 to avoid infinity
      angleDeg = Math.min(89.9, Math.max(0, angleDeg));
      computedAngleRad = angleDeg * (Math.PI / 180);
      computedRise = computedRun * Math.tan(computedAngleRad);
    }

    const angleDeg = computedAngleRad * (180 / Math.PI);
    const slopeFactor = Math.sqrt(Math.pow(computedRise, 2) + Math.pow(computedRun, 2)) / computedRun;
    
    const rafterBase = Math.sqrt(Math.pow(computedRise, 2) + Math.pow(computedRun, 2));
    const overhangRafter = OH * slopeFactor;
    const totalRafterLength = rafterBase + overhangRafter;

    // Pitch ratio representation (e.g., Rise / 12)
    // If run is 12, then pitch is Rise / 12. Else, scale it to /12 for standard representation
    const pitchNumerator12 = (computedRise / computedRun) * 12;

    return {
      rise: computedRise,
      run: computedRun,
      angleDeg,
      pitchStr: `${pitchNumerator12.toFixed(1)} / 12`,
      rafterBase,
      overhangRafter,
      totalRafterLength,
      slopeFactor,
      OH
    };
  }, [hasData, inputMode, rise, run, pitchAngle, runForAngle, overhang]);

  const handleDataChange = () => {
    if (hasData) resetEstimate();
  };

  const handlePrint = () => window.print();

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-900 pb-[120px]">
      <Helmet>
        <title>Roof Pitch Calculator</title>
        <meta name="description" content="Calculate Roof Pitch, Angle, Rafter Length, and Area Multiplier." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Triangle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Roof Pitch Calculator
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase ml-2 border border-emerald-200 dark:border-emerald-800">
              Beginner
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold tracking-wide flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5" /> 2 MIN
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            Determine roof pitch angles, calculate rafter lengths (including overhangs), and find the slope area multiplier for roofing materials. 
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Panel */}
          <div className="w-full md:w-[45%] flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Roof Dimensions</h3>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 w-full">
                <button
                  onClick={() => { setInputMode("rise-run"); handleDataChange(); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    inputMode === "rise-run" 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Enter Rise & Run
                </button>
                <button
                  onClick={() => { setInputMode("pitch-angle"); handleDataChange(); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    inputMode === "pitch-angle" 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Enter Angle
                </button>
              </div>

              {inputMode === "rise-run" ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Rise (Height)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={rise}
                        onChange={(e) => { setRise(e.target.value); handleDataChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "m" : "in"}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Run (1/2 Span)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={run}
                        onChange={(e) => { setRun(e.target.value); handleDataChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "m" : "in"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Pitch Angle</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pitchAngle}
                        onChange={(e) => { setPitchAngle(e.target.value); handleDataChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">deg</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Run (1/2 Span)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={runForAngle}
                        onChange={(e) => { setRunForAngle(e.target.value); handleDataChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "m" : "in"}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Horizontal Overhang (Eave)</label>
                <div className="relative max-w-[200px]">
                  <input
                    type="number"
                    value={overhang}
                    onChange={(e) => { setOverhang(e.target.value); handleDataChange(); }}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{isMetric ? "m" : "in"}</span>
                </div>
              </div>

              <button
                onClick={() => processEstimate(() => {})}
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 group border border-indigo-500"
              >
                {isProcessing ? "Computing..." : "Calculate Roof Spec"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Math Logic & Formulas
              </h4>
              <ul className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 space-y-2 list-disc list-inside leading-relaxed uppercase tracking-wider font-semibold">
                <li><strong className="lowercase">Pitch Angle</strong> = arctan(Rise / Run)</li>
                <li><strong className="lowercase">Rafter Base Length</strong> = √(Rise² + Run²)</li>
                <li><strong className="lowercase">Slope Factor (Multiplier)</strong> = √(Rise² + Run²) / Run</li>
                <li><strong className="lowercase">Overhang Rafter Length</strong> = Horiz. Overhang × Slope Factor</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide text-xs">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">What is the Slope Factor Multiplier?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Multiply your roof's flat footprint area by this factor to find the true sloped surface area required for buying shingles or metal sheets.</p>
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                      <span className="text-indigo-600/80 dark:text-indigo-400/80 text-xs font-bold uppercase tracking-widest block mb-1">Pitch Angle</span>
                      <div className="text-4xl font-black text-indigo-700 dark:text-indigo-300">
                        {estimateData.angleDeg.toFixed(2)}°
                      </div>
                      <span className="text-[10px] text-indigo-500/70 font-bold mt-1 block">or {estimateData.pitchStr}</span>
                    </div>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                      <span className="text-emerald-600/80 dark:text-emerald-400/80 text-xs font-bold uppercase tracking-widest block mb-1">Area Multiplier</span>
                      <div className="text-4xl font-black text-emerald-700 dark:text-emerald-300">
                        {estimateData.slopeFactor.toFixed(3)}
                      </div>
                      <span className="text-[10px] text-emerald-500/70 font-bold mt-1 block">Slope Factor</span>
                    </div>
                  </div>

                  {/* SVG Roof Visualizer */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                    <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10">Cross-Section Profile</span>
                    
                    {(() => {
                      const maxW = 500;
                      const maxH = 250;
                      const runTotal = estimateData.run + estimateData.OH;
                      const totalWidthUnits = runTotal * 2;
                      const totalHeightUnits = estimateData.rise + (estimateData.OH * (estimateData.rise / estimateData.run));
                      
                      // Scale mapping
                      const scaleX = maxW / Math.max(1, totalWidthUnits);
                      const scaleY = maxH / Math.max(1, totalHeightUnits * 1.5); // *1.5 for extra breathing room at top/bottom
                      const currentScale = Math.min(scaleX, scaleY) * 0.8; // fit inside with 20% margin
                      
                      const scaledRise = estimateData.rise * currentScale;
                      const scaledRun = estimateData.run * currentScale;
                      const scaledOH_X = estimateData.OH * currentScale;
                      const scaledOH_Y = (estimateData.OH * (estimateData.rise / estimateData.run)) * currentScale;

                      const ridgeX = maxW / 2;
                      const ridgeY = 30; // 30px padding from top

                      const leftEaveX = ridgeX - scaledRun;
                      const leftEaveY = ridgeY + scaledRise;
                      const rightEaveX = ridgeX + scaledRun;
                      const rightEaveY = ridgeY + scaledRise;

                      const leftOHX = leftEaveX - scaledOH_X;
                      const leftOHY = leftEaveY + scaledOH_Y;
                      const rightOHX = rightEaveX + scaledOH_X;
                      const rightOHY = rightEaveY + scaledOH_Y;

                      return (
                        <svg width="100%" height="100%" viewBox={`0 0 ${maxW} ${maxH}`} className="overflow-visible drop-shadow-sm">
                          {/* Grid Background */}
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" className="opacity-50" />

                          {/* Top Wall Plates / Span Indicator */}
                          <line x1={leftEaveX} y1={leftEaveY} x2={rightEaveX} y2={rightEaveY} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" strokeDasharray="5,5" />
                          <circle cx={leftEaveX} cy={leftEaveY} r="4" className="fill-slate-500" />
                          <circle cx={rightEaveX} cy={rightEaveY} r="4" className="fill-slate-500" />

                          {/* Center Rise Line */}
                          <line x1={ridgeX} y1={ridgeY} x2={ridgeX} y2={leftEaveY} className="stroke-indigo-400 dark:stroke-indigo-600" strokeWidth="2" strokeDasharray="4,4" />

                          {/* Left Rafter */}
                          <line x1={ridgeX} y1={ridgeY} x2={leftOHX} y2={leftOHY} className="stroke-slate-800 dark:stroke-slate-300" strokeWidth="6" strokeLinecap="round" />
                          {/* Right Rafter */}
                          <line x1={ridgeX} y1={ridgeY} x2={rightOHX} y2={rightOHY} className="stroke-slate-800 dark:stroke-slate-300" strokeWidth="6" strokeLinecap="round" />
                          
                          {/* Rise Text */}
                          <text x={ridgeX + 8} y={ridgeY + (scaledRise / 2)} className="fill-indigo-600 dark:fill-indigo-400 text-[12px] font-bold font-mono">Rise: {estimateData.rise.toFixed(2)}</text>
                          
                          {/* Run Text */}
                          <text x={ridgeX - (scaledRun / 2)} y={leftEaveY - 8} className="fill-slate-600 dark:fill-slate-400 text-[12px] font-bold font-mono text-anchor-middle">Run: {estimateData.run.toFixed(2)}</text>

                          {/* Angle Arch */}
                          {scaledRun > 20 && (
                            <path d={`M ${rightEaveX - 20} ${rightEaveY} A 20 20 0 0 0 ${rightEaveX - 16} ${rightEaveY - 12}`} fill="none" className="stroke-indigo-500" strokeWidth="2" />
                          )}
                          <text x={rightEaveX - 45} y={rightEaveY - 8} className="fill-indigo-600 dark:fill-indigo-400 text-[12px] font-bold font-mono">{estimateData.angleDeg.toFixed(1)}°</text>

                        </svg>
                      );
                    })()}

                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">Dimensional Breakdown</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex justify-between items-center">
                       <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Rafter (Base Run)</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{estimateData.rafterBase.toFixed(3)} {isMetric ? "m" : "in"}</span>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex justify-between items-center">
                       <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Rafter (Overhang)</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{estimateData.overhangRafter.toFixed(3)} {isMetric ? "m" : "in"}</span>
                     </div>
                     <div className="bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex justify-between items-center sm:col-span-2">
                       <span className="text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">Total Rafter Length</span>
                       <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{estimateData.totalRafterLength.toFixed(3)} {isMetric ? "m" : "in"}</span>
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
                  <Triangle className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Configure Roof Pitch</h3>
                <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                  Input the Rise & Run or Angle specification. A dynamic cross-section rendering, rafter lengths, and surface area multiplier will be generated instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
