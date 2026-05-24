import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Calculator, ArrowRight, Save, Printer, Share2, Droplets, Clock, HelpCircle, Activity } from "lucide-react";
import { useEstimateProcessing } from "../../hooks/useEstimateProcessing";
import { ProcessingSkeleton } from "../ui/ProcessingSkeleton";
import { CalculationHistory } from "../ui/CalculationHistory";

export default function PermeabilityCalculator() {
  const { isProcessing, hasData, processEstimate } = useEstimateProcessing();

  const [testMethod, setTestMethod] = useState<"constant" | "falling">("constant");

  // Constant Head Inputs
  const [qVolume, setQVolume] = useState("");
  const [lengthSample, setLengthSample] = useState("");
  const [areaSample, setAreaSample] = useState("");
  const [constantHead, setConstantHead] = useState("");
  const [timeConstant, setTimeConstant] = useState("");

  // Falling Head Inputs
  const [areaStandpipe, setAreaStandpipe] = useState("");
  // Re-use lengthSample, areaSample for falling head
  const [timeFalling, setTimeFalling] = useState("");
  const [headInitial, setHeadInitial] = useState("");
  const [headFinal, setHeadFinal] = useState("");

  const estimateData = useMemo(() => {
    if (!hasData) return null;

    let k = 0;
    
    const L = parseFloat(lengthSample) || 0;
    const A = parseFloat(areaSample) || 0;

    if (testMethod === "constant") {
      const Q = parseFloat(qVolume) || 0;
      const h = parseFloat(constantHead) || 0;
      const t = parseFloat(timeConstant) || 0;
      
      if (A * h * t > 0) {
        k = (Q * L) / (A * h * t);
      }
    } else {
      const a = parseFloat(areaStandpipe) || 0;
      const t = parseFloat(timeFalling) || 0;
      const h1 = parseFloat(headInitial) || 0;
      const h2 = parseFloat(headFinal) || 0;
      
      if (A * t > 0 && h1 > 0 && h2 > 0) {
        k = 2.303 * ((a * L) / (A * t)) * Math.log10(h1 / h2);
      }
    }

    let soilClass = "Unknown";
    if (k > 1e-1) soilClass = "Clean Gravel (High Permeability)";
    else if (k > 1e-3) soilClass = "Clean Sands, Clean Sand and Gravel Mixtures (Medium)";
    else if (k > 1e-5) soilClass = "Very Fine Sands, Organic and Inorganic Silts (Low)";
    else if (k > 1e-7) soilClass = "Homogeneous Clays below zone of weathering (Very Low)";
    else if (k > 0) soilClass = "Practically Impervious";

    return {
      k,
      soilClass,
      method: testMethod
    };
  }, [hasData, testMethod, qVolume, lengthSample, areaSample, constantHead, timeConstant, areaStandpipe, timeFalling, headInitial, headFinal]);

  const handlePrint = () => window.print();

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-900 pb-[120px]">
      <Helmet>
        <title>Permeability Calculator (Constant & Falling Head)</title>
        <meta name="description" content="Calculate soil permeability coefficient (k) using Constant Head and Falling Head methods." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Droplets className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Permeability Calculator
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold tracking-wide uppercase ml-2 border border-blue-200 dark:border-blue-800">
              Lab Suite
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold tracking-wide uppercase flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3 h-3" />
              2 MIN
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            Determine the coefficient of permeability (k) for soils using standard laboratory metrics. Features both Constant Head method for coarse-grained soils and Falling Head method for fine-grained soils.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Panel */}
          <div className="w-full md:w-[45%] flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Test Method</h3>
                
                {/* Master UI Toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-[240px]">
                  <button
                    onClick={() => { setTestMethod("constant"); if(hasData) processEstimate(() => {}); }}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      testMethod === "constant" 
                        ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    Constant Head
                  </button>
                  <button
                    onClick={() => { setTestMethod("falling"); if(hasData) processEstimate(() => {}); }}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      testMethod === "falling" 
                        ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    Falling Head
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Length of Sample, L (cm)</label>
                  <input
                    type="number"
                    value={lengthSample}
                    onChange={(e) => setLengthSample(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Sample Area, A (cm²)</label>
                  <input
                    type="number"
                    value={areaSample}
                    onChange={(e) => setAreaSample(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
              </div>

              {testMethod === "constant" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Collected Volume, Q (cm³)</label>
                      <input
                        type="number"
                        value={qVolume}
                        onChange={(e) => setQVolume(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Time, t (sec)</label>
                      <input
                        type="number"
                        value={timeConstant}
                        onChange={(e) => setTimeConstant(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Constant Head, h (cm)</label>
                    <input
                      type="number"
                      value={constantHead}
                      onChange={(e) => setConstantHead(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Standpipe Area, a (cm²)</label>
                      <input
                        type="number"
                        value={areaStandpipe}
                        onChange={(e) => setAreaStandpipe(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Time Interval, t (sec)</label>
                      <input
                        type="number"
                        value={timeFalling}
                        onChange={(e) => setTimeFalling(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Initial Head, h1 (cm)</label>
                      <input
                        type="number"
                        value={headInitial}
                        onChange={(e) => setHeadInitial(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Final Head, h2 (cm)</label>
                      <input
                        type="number"
                        value={headFinal}
                        onChange={(e) => setHeadFinal(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => processEstimate(() => {})}
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 group border border-indigo-500"
              >
                {isProcessing ? "Processing..." : "Calculate Permeability"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm mt-2">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Math Logic & Formulas
              </h4>
              {testMethod === "constant" ? (
                 <ul className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 space-y-2 list-disc list-inside leading-relaxed font-semibold">
                   <li><strong>Q</strong> = Volume of fluid collected</li>
                   <li><strong>L</strong> = Length of soil sample</li>
                   <li><strong>A</strong> = Cross-sectional area of soil</li>
                   <li><strong>h</strong> = Constant head</li>
                   <li><strong>t</strong> = Time to collect Q</li>
                   <li className="mt-2 text-indigo-900 dark:text-indigo-300">k = (Q × L) / (A × h × t)</li>
                 </ul>
              ) : (
                 <ul className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 space-y-2 list-disc list-inside leading-relaxed font-semibold">
                   <li><strong>a</strong> = Cross-sectional area of standpipe</li>
                   <li><strong>L</strong> = Length of soil sample</li>
                   <li><strong>A</strong> = Cross-sectional area of soil</li>
                   <li><strong>t</strong> = Time interval</li>
                   <li><strong>h1, h2</strong> = Head at start and end of t</li>
                   <li className="mt-2 text-indigo-900 dark:text-indigo-300">k = 2.303 × (a × L) / (A × t) × log₁₀(h1 / h2)</li>
                 </ul>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide text-xs">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">When should I use Constant Head vs Falling Head?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Constant head is suitable for coarse-grained soils (high permeability like sand/gravel), while Falling Head is appropriate for fine-grained soils (low permeability like clay/silt).</p>
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
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 block">Permeability Coefficient (k)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                          {estimateData.k.toExponential(3)}
                        </span>
                        <span className="text-lg font-bold text-slate-400">cm/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm p-5 flex items-center justify-between mb-8">
                     <div>
                       <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Soil Classification</span>
                       <span className="text-lg font-black text-slate-800 dark:text-white">{estimateData.soilClass}</span>
                     </div>
                     <Droplets className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Test Parameters</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Method</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200">{estimateData.method === 'constant' ? 'Constant Head' : 'Falling Head'}</span>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Length (L)</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200">{lengthSample || "0"} cm</span>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Sample Area (A)</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200">{areaSample || "0"} cm²</span>
                     </div>
                     
                     {estimateData.method === 'constant' ? (
                        <>
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Q Volume</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{qVolume || "0"} cm³</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Const. Head (h)</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{constantHead || "0"} cm</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Time (t)</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{timeConstant || "0"} sec</span>
                          </div>
                        </>
                     ) : (
                        <>
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Standpipe Area (a)</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{areaStandpipe || "0"} cm²</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Heads (h1, h2)</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{headInitial || "0"} / {headFinal || "0"} cm</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Time (t)</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{timeFalling || "0"} sec</span>
                          </div>
                        </>
                     )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center opacity-80">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 shadow-highlight">
                  <Droplets className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Determine Permeability</h3>
                <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                  Select your test method and input the laboratory readings. The permeability coefficient (k) and soil classification will be computed automatically.
                </p>
              </div>
            )}
            
            <CalculationHistory
              calculatorId="permeability_calculator"
              currentInputs={{ testMethod, lengthSample, areaSample, qVolume, timeConstant, constantHead, areaStandpipe, headInitial, headFinal, timeFalling }}
              currentResults={estimateData ? {
                "Permeability (k)": `${estimateData.k_sci}`,
                "Standard Form": `${estimateData.k_std} cm/sec`,
                "Soil Classification": `${estimateData.classification}`
              } : undefined}
              estimationName="Permeability Test"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
