import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Calculator, ArrowRight, Save, Printer, Share2, Plus, Trash2, Clock, HelpCircle, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";
import { useEstimateProcessing } from "../../hooks/useEstimateProcessing";
import { MaterialSummary } from "../ui/MaterialSummary";
import { ProcessingSkeleton } from "../ui/ProcessingSkeleton";
import { CalculationHistory } from "../ui/CalculationHistory";
import { SoilReportHeader } from "../ui/SoilReportHeader";
import { SoilReportDetails, generateGeotechReportPDF } from "../../utils/soilReports";

export default function CbrTestCalculator() {
  const { isProcessing, hasData, processEstimate, resetEstimate } = useEstimateProcessing();

  const [minSpec, setMinSpec] = useState("15");
  const [reportDetails, setReportDetails] = useState<SoilReportDetails>({
    projectName: "Highway Rehabilitation Phase 2",
    clientName: "Department of Transportation",
    labName: "Central Soils Laboratory",
    sampleId: "S-54/CBR",
    depth: "1.5m",
    testedBy: "Senior Tech",
    date: new Date().toLocaleDateString(),
  });

  const handleReportChange = (field: keyof SoilReportDetails, value: string) => {
    setReportDetails(prev => ({ ...prev, [field]: value }));
  };

  const defaultData = [
    { penetration: 0.0, load: 0 },
    { penetration: 0.5, load: 15 },
    { penetration: 1.0, load: 45 },
    { penetration: 1.5, load: 90 },
    { penetration: 2.0, load: 140 },
    { penetration: 2.5, load: 180 },
    { penetration: 3.0, load: 210 },
    { penetration: 4.0, load: 260 },
    { penetration: 5.0, load: 300 },
    { penetration: 7.5, load: 380 },
    { penetration: 10.0, load: 450 },
    { penetration: 12.5, load: 500 },
  ];

  const [testData, setTestData] = useState<{ penetration: number; load: number }[]>(defaultData);

  const handleDataChange = (index: number, field: "load" | "penetration", value: string) => {
    const updatedData = [...testData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: parseFloat(value) || 0,
    };
    setTestData(updatedData);
    if (hasData) resetEstimate();
  };

  const addRow = () => {
    setTestData([...testData, { penetration: 0, load: 0 }]);
  };

  const removeRow = (index: number) => {
    const updatedData = testData.filter((_, i) => i !== index);
    setTestData(updatedData);
    if (hasData) resetEstimate();
  };

  const estimateData = useMemo(() => {
    if (!hasData) return null;

    // Sort to be safe
    const sortedData = [...testData].sort((a, b) => a.penetration - b.penetration);

    // Identify loads at exactly 2.5 and 5.0 using linear interpolation if missing
    const getLoadAtPenetration = (pen: number) => {
      const exactMatch = sortedData.find(d => Math.abs(d.penetration - pen) < 0.01);
      if (exactMatch) return exactMatch.load;
      
      const lower = sortedData.filter(d => d.penetration < pen).pop();
      const higher = sortedData.find(d => d.penetration > pen);
      
      if (lower && higher) {
        return lower.load + ((higher.load - lower.load) / (higher.penetration - lower.penetration)) * (pen - lower.penetration);
      }
      return 0;
    };

    const load25 = getLoadAtPenetration(2.5);
    const load50 = getLoadAtPenetration(5.0);

    const cbr25 = (load25 / 1370) * 100;
    const cbr50 = (load50 / 2055) * 100;
    const finalCbr = Math.max(cbr25, cbr50);
    const requiredMin = parseFloat(minSpec) || 0;

    let soilClass = "Poor";
    if (finalCbr >= 80) soilClass = "Excellent (Base Course)";
    else if (finalCbr >= 50) soilClass = "Good (Base/Subbase)";
    else if (finalCbr >= 20) soilClass = "Fair (Subbase)";
    else if (finalCbr >= 10) soilClass = "Poor (Subgrade)";
    else soilClass = "Very Poor (Unsuitable)";

    return {
      cbr25,
      cbr50,
      finalCbr,
      soilClass,
      passed: finalCbr >= requiredMin,
      load25,
      load50,
      requiredMin
    };
  }, [hasData, testData, minSpec]);

  const handlePrint = () => window.print();
  const handleSave = async () => {
    if (!estimateData) return;
    
    // Auto-generated interpretation
    const interpretationText = `Design CBR = ${estimateData.finalCbr.toFixed(1)}% — Per IRC:37-2018, recommended subgrade CBR for traffic > 10 MSA requires minimum 5%.\nStatus: [${estimateData.passed ? 'PASS' : 'FAIL'}] — Quality: ${estimateData.soilClass}`;
    
    const results = [
      { label: "CBR at 2.5 mm", value: `${estimateData.cbr25.toFixed(2)} %` },
      { label: "CBR at 5.0 mm", value: `${estimateData.cbr50.toFixed(2)} %` },
      { label: "Design CBR", value: `${estimateData.finalCbr.toFixed(2)} %` },
      { label: "Quality classification", value: estimateData.soilClass },
      { label: "Specification minimum", value: `${estimateData.requiredMin} %` },
      { label: "Test Result Status", value: estimateData.passed ? "PASSED" : "FAILED" }
    ];

    await generateGeotechReportPDF("California Bearing Ratio (CBR)", reportDetails, results, interpretationText);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-900 pb-[120px]">
      <Helmet>
        <title>California Bearing Ratio (CBR) Test Calculator</title>
        <meta name="description" content="Free CBR test calculator for Geotechnical engineering labs." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-900 dark:text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              CBR Test Calculator
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold tracking-wide uppercase ml-2 border border-blue-200 dark:border-blue-800">
              Lab Suite
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold tracking-wide flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5" /> 5 MIN
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            Record Load vs. Penetration data to calculate the California Bearing Ratio (CBR) for evaluating the mechanical strength of road subgrades and base courses.
          </p>
        </div>

        <SoilReportHeader 
          details={reportDetails}
          onChange={handleReportChange}
          onGenerateReport={handleSave}
          isGenerating={!hasData}
        />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Panel */}
          <div className="w-full md:w-[45%] flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-900 dark:text-white">Test Readings</h3>
                <button 
                  onClick={addRow}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              <div className="mb-6 z-10 relative">
                <div className="grid grid-cols-12 gap-2 mb-2 px-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <div className="col-span-5">Penetration (mm)</div>
                  <div className="col-span-5">Load (kg)</div>
                  <div className="col-span-2 text-right">#</div>
                </div>
                
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {testData.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 relative group">
                        <input
                          type="number"
                          step="0.5"
                          value={row.penetration}
                          onChange={(e) => handleDataChange(idx, "penetration", e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-900 dark:text-white rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                        />
                      </div>
                      <div className="col-span-5 relative">
                        <input
                          type="number"
                          value={row.load}
                          onChange={(e) => handleDataChange(idx, "load", e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-900 dark:text-white rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={() => removeRow(idx)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-2">
                    Minimum Required CBR (%) for Spec Pass
                 </label>
                 <div className="relative">
                   <input
                     type="number"
                     value={minSpec}
                     onChange={(e) => setMinSpec(e.target.value)}
                     className="w-full max-w-[200px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-900 dark:text-white rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                   />
                   <span className="absolute left-[170px] top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
                 </div>
              </div>

              <button
                onClick={() => processEstimate(() => {})}
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 group border border-indigo-500"
              >
                {isProcessing ? "Processing Curve..." : "Calculate CBR Result"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Math Logic & Formulas
              </h4>
              <ul className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 space-y-2 list-disc list-inside leading-relaxed uppercase tracking-wider font-semibold">
                <li>CBR <span className="lowercase">at</span> 2.5<span className="lowercase">mm</span> = (Measured Load / 1370 <span className="lowercase">kg</span>) × 100</li>
                <li>CBR <span className="lowercase">at</span> 5.0<span className="lowercase">mm</span> = (Measured Load / 2055 <span className="lowercase">kg</span>) × 100</li>
                <li>Design CBR = <span className="lowercase">max(</span>CBR 2.5, CBR 5.0<span className="lowercase">)</span></li>
              </ul>
              <div className="mt-3 p-3 bg-white/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                Standard loads assume a standard 50mm diameter plunger.
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide text-xs">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">What if the curve is concave upwards initially?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">This happens due to surface irregularities. The curve must be corrected by drawing a tangent at the point of greatest slope to intersect the load axis.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">Why is 5.0mm CBR sometimes higher?</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Usually the 2.5mm CBR is higher. If 5.0mm is higher, the test should be repeated. If the second test also shows 5.0mm &gt; 2.5mm, the 5.0mm value is accepted.</p>
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
                <div className={`p-6 md:p-8 rounded-[2rem] border shadow-lg relative overflow-hidden transition-all duration-500 ${estimateData.passed ? 'bg-gradient-to-br from-emerald-50 to-teal-50/30 border-emerald-200 dark:from-emerald-950/30 dark:to-teal-900/10 dark:border-emerald-800/50' : 'bg-gradient-to-br from-rose-50 to-red-50/30 border-rose-200 dark:from-rose-950/30 dark:to-red-900/10 dark:border-rose-800/50'}`}>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 block">Final Design CBR</span>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl md:text-5xl font-semibold tabular-nums tracking-tight tracking-tight ${estimateData.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {estimateData.finalCbr.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm uppercase tracking-wider border ${estimateData.passed ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600'}`}>
                        {estimateData.passed ? "✓ Spec Passed" : "✗ Spec Failed"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">CBR @ 2.5mm</span>
                      <div className="text-2xl font-semibold tabular-nums tracking-tight text-slate-800 dark:text-slate-900 dark:text-white">{estimateData.cbr25.toFixed(1)}%</div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Load: {estimateData.load25.toFixed(1)} kg</span>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">CBR @ 5.0mm</span>
                      <div className="text-2xl font-semibold tabular-nums tracking-tight text-slate-800 dark:text-slate-900 dark:text-white">{estimateData.cbr50.toFixed(1)}%</div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Load: {estimateData.load50.toFixed(1)} kg</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-slate-100 dark:border-slate-800 shadow-sm p-5 flex items-center justify-between mb-8">
                     <div>
                       <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">Soil Quality Index</span>
                       <span className="text-lg font-semibold tabular-nums tracking-tight text-slate-800 dark:text-slate-900 dark:text-white">{estimateData.soilClass}</span>
                     </div>
                     <Activity className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  </div>

                  {/* Chart section */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-black/5 dark:border-slate-100 dark:border-slate-800 shadow-sm h-[300px] w-full pt-6">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Load vs. Penetration Curve</h3>
                     <ResponsiveContainer width="100%" height="85%">
                       <AreaChart data={[...testData].sort((a, b) => a.penetration - b.penetration)}>
                         <defs>
                           <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                         <XAxis 
                           dataKey="penetration" 
                           type="number" 
                           domain={[0, 'dataMax']} 
                           tickCount={10}
                           tick={{fontSize: 10, fontWeight: 500}} 
                           tickLine={false} 
                           axisLine={false} 
                           tickMargin={10}
                         />
                         <YAxis 
                           tick={{fontSize: 10, fontWeight: 500}} 
                           tickLine={false} 
                           axisLine={false} 
                           tickFormatter={(varLoad) => `${varLoad}kg`}
                           tickMargin={5}
                           domain={[0, 'dataMax']}
                         />
                         <RechartsTooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                           labelFormatter={(label) => `Penetration: ${label}mm`}
                           formatter={(value) => [`${value} kg`, 'Load']}
                         />
                         <ReferenceLine x={2.5} stroke="#10b981" strokeDasharray="3 3" />
                         <ReferenceLine x={5.0} stroke="#10b981" strokeDasharray="3 3" />
                         <ReferenceDot x={2.5} y={estimateData.load25} r={4} fill="#10b981" stroke="white" />
                         <ReferenceDot x={5.0} y={estimateData.load50} r={4} fill="#10b981" stroke="white" />
                         <Area 
                           type="monotone" 
                           dataKey="load" 
                           stroke="#6366f1" 
                           strokeWidth={3} 
                           fillOpacity={1} 
                           fill="url(#colorLoad)" 
                           animationDuration={1500}
                         />
                       </AreaChart>
                     </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-graph-pattern opacity-80 mix-blend-multiply dark:mix-blend-lighten">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 shadow-highlight">
                  <Activity className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-80" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Ready to Plot Load-Penetration</h3>
                <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                  Input your lab dial readings in the left panel. The interactive CBR curve and corrected values will appear here automatically.
                </p>
                <div className="flex gap-3 text-xs font-bold text-indigo-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900">
                   <span>2.5mm</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                   <span>5.0mm</span>
                </div>
              </div>
            )}
            
            <CalculationHistory
              calculatorId="cbr_test_calculator"
              currentInputs={{ minSpec, ...Object.fromEntries(testData.map((d) => [`Penetration ${d.penetration}mm`, `${d.load} kg`])) }}
              currentResults={estimateData ? {
                "CBR @ 2.5mm": `${estimateData.cbr25.toFixed(1)}%`,
                "CBR @ 5.0mm": `${estimateData.cbr50.toFixed(1)}%`,
                "Final CBR": `${estimateData.finalCbr.toFixed(1)}%`,
                "Status": estimateData.passed ? "PASSED" : "FAILED"
              } : undefined}
              estimationName="CBR Test Result"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
