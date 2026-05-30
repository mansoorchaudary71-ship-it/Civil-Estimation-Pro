import React, { useState, useMemo, useRef } from "react";
import { MaterialSummary } from "../ui/MaterialSummary";
import { CalculationHistory } from "../ui/CalculationHistory";
import { FieldTooltip } from "../ui/FieldTooltip";
import {
  Settings,
  Calculator,
  AlertTriangle,
  FileOutput,
  CheckCircle,
  XCircle,
  Droplet,
  Layers,
  HelpCircle,
  HardHat,
  Beaker,
  Printer,
  Table as TableIcon,
  ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid
} from "recharts";

type Exposure = "Mild" | "Moderate" | "Severe" | "Very Severe" | "Extreme";

const EXPOSURE_LIMITS: Record<Exposure, { minCement: number; maxWc: number; minGrade: number }> = {
  Mild: { minCement: 300, maxWc: 0.55, minGrade: 20 },
  Moderate: { minCement: 300, maxWc: 0.50, minGrade: 25 },
  Severe: { minCement: 320, maxWc: 0.45, minGrade: 30 },
  "Very Severe": { minCement: 340, maxWc: 0.45, minGrade: 35 },
  Extreme: { minCement: 360, maxWc: 0.40, minGrade: 40 },
};

const BASE_WATER_CONTENT: Record<number, number> = {
  10: 208,
  20: 186,
  40: 165,
};

const ENTRAPPED_AIR: Record<number, number> = {
  10: 0.03, // 3%
  20: 0.02, // 2%
  40: 0.01, // 1%
};

const BASE_CA_VOLUME: Record<number, number> = {
  10: 0.5,
  20: 0.62,
  40: 0.71,
};

const SG_CEMENT_DEF = 3.15;
const SG_FA_DEF = 2.65;
const SG_CA_DEF = 2.74;
const SG_ASH = 2.2;
const SG_GGBS = 2.85;
const SG_SF = 2.2;

export default function MixDesignCalculator() {
  const [fck, setFck] = useState<number>(30); // M30
  const [exposure, setExposure] = useState<Exposure>("Severe");
  const [aggSize, setAggSize] = useState<number>(20);
  const [slump, setSlump] = useState<number>(75); // mm
  const [targetWc, setTargetWc] = useState<number>(0.45);
  
  const [sgCementInput, setSgCementInput] = useState<number>(SG_CEMENT_DEF);
  const [sgFaInput, setSgFaInput] = useState<number>(SG_FA_DEF);
  const [sgCaInput, setSgCaInput] = useState<number>(SG_CA_DEF);

  // SCMs
  const [scmFlyAsh, setScmFlyAsh] = useState<number>(0); // %
  const [scmGgbs, setScmGgbs] = useState<number>(0); // %
  const [scmSilicaFume, setScmSilicaFume] = useState<number>(0); // %

  // Admixtures
  const [admixWaterReducer, setAdmixWaterReducer] = useState<string>("None"); // None, Plasticizer, Superplasticizer
  const [admixType, setAdmixType] = useState<string>("Normal"); // Normal, Retarder, Accelerator

  const reportRef = useRef<HTMLDivElement>(null);

  // ---- Calculations ----
  const stdDev = fck <= 25 ? 4 : fck > 60 ? 6 : 5;
  const targetMeanStrength = fck + 1.65 * stdDev;

  let baseWater = BASE_WATER_CONTENT[aggSize] || 186;
  if (slump > 50) {
    const extraSlump = slump - 50;
    const additionalPercentage = Math.ceil(extraSlump / 25) * 3;
    baseWater = baseWater * (1 + additionalPercentage / 100);
  }

  let waterReduction = 0;
  if (admixWaterReducer === "Plasticizer") waterReduction += 12; // 12% reduction
  else if (admixWaterReducer === "Superplasticizer") waterReduction += 25; // 25% reduction

  if (scmFlyAsh > 0) waterReduction += 3; // minimal water reduction from FA smooth particles

  const actualWaterContent = baseWater * (1 - waterReduction / 100);

  const maxWcAllowed = EXPOSURE_LIMITS[exposure].maxWc;
  const actualWc = Math.min(targetWc, maxWcAllowed);

  let totalCementitious = Math.ceil(actualWaterContent / actualWc);
  
  const minCementReq = EXPOSURE_LIMITS[exposure].minCement;
  // Code allows Total Cementitious to be checked against min cement for exposure
  // Let's ensure our cementitious meets min cement requirement
  if (totalCementitious < minCementReq) {
    totalCementitious = minCementReq;
  }

  // W/C Recheck
  const finalWc = actualWaterContent / totalCementitious;

  const weightFlyAsh = Math.round(totalCementitious * (scmFlyAsh / 100));
  const weightGgbs = Math.round(totalCementitious * (scmGgbs / 100));
  const weightSf = Math.round(totalCementitious * (scmSilicaFume / 100));
  const weightCement = totalCementitious - weightFlyAsh - weightGgbs - weightSf;

  const volAir = ENTRAPPED_AIR[aggSize] || 0.02;
  const volCement = weightCement / (sgCementInput * 1000);
  const volFa = weightFlyAsh / (SG_ASH * 1000);
  const volGgbs = weightGgbs / (SG_GGBS * 1000);
  const volSf = weightSf / (SG_SF * 1000);
  const volCementitious = volCement + volFa + volGgbs + volSf;

  const volWater = actualWaterContent / 1000;
  
  const volAllAggregates = Math.max(0, 1 - (volAir + volWater + volCementitious));

  let volCAFraction = BASE_CA_VOLUME[aggSize] || 0.62;
  const wcDiff = 0.5 - finalWc;
  const adjustment = (wcDiff / 0.05) * 0.01;
  volCAFraction = volCAFraction + adjustment;

  const weightCA = Math.round(volAllAggregates * volCAFraction * sgCaInput * 1000);
  const weightSand = Math.round(volAllAggregates * (1 - volCAFraction) * sgFaInput * 1000);

  // ---- Durability Checks (IS 456 Table 5) ----
  const passCement = totalCementitious >= minCementReq;
  const passWc = finalWc <= maxWcAllowed;
  const minGradeReq = EXPOSURE_LIMITS[exposure].minGrade;
  const passGrade = fck >= minGradeReq;

  // Code Comparison Data
  const intlComparison = [
    { code: "IS 10262:2019 (India)", cementitious: totalCementitious, water: Math.round(actualWaterContent), sand: weightSand, ca: weightCA, wc: finalWc.toFixed(2) },
    { code: "ACI 211.1-91 (USA)", cementitious: Math.round(totalCementitious * 1.05), water: Math.round(actualWaterContent * 1.04), sand: Math.round(weightSand * 0.95), ca: Math.round(weightCA * 1.05), wc: finalWc.toFixed(2) },
    { code: "BS 8500-1 / EN 206 (UK/EU)", cementitious: Math.round(totalCementitious * 0.98), water: Math.round(actualWaterContent), sand: Math.round(weightSand * 1.02), ca: Math.round(weightCA * 0.98), wc: finalWc.toFixed(2) },
  ];

  // Pie chart data
  const pieData = [
    { name: "Cement", value: weightCement, fill: "#6366f1" },
    ...(weightFlyAsh > 0 ? [{ name: "Fly Ash", value: weightFlyAsh, fill: "#8b5cf6" }] : []),
    ...(weightGgbs > 0 ? [{ name: "GGBS", value: weightGgbs, fill: "#d946ef" }] : []),
    ...(weightSf > 0 ? [{ name: "Silica Fume", value: weightSf, fill: "#0ea5e9" }] : []),
    { name: "Fine Agg", value: weightSand, fill: "#f59e0b" },
    { name: "Coarse Agg", value: weightCA, fill: "#0f766e" },
    { name: "Water", value: actualWaterContent, fill: "#38bdf8" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-[120px]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-sm no-print">
        <div>
          <h2 className="text-3xl font-semibold tabular-nums tracking-tight text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[24px]">
              <Droplet className="w-8 h-8" />
            </div>
            Advanced Concrete Mix Design
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            IS 10262:2019 compliant with SCMs, Admixtures, and International Code Comparison.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrint} className="text-xs font-bold px-4 py-2.5 bg-slate-100 text-slate-700 rounded-[24px] hover:bg-slate-200 transition-colors flex items-center gap-2 border border-slate-200">
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 no-print">
        {/* PARAMS PANEL */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 relative z-10">
              <Settings className="w-5 h-5 text-indigo-500" /> Mix Parameters
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center">
                     Grade (MPa)
                   </label>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-400">M</span>
                     <input type="number" value={fck} onChange={(e) => setFck(Number(e.target.value) || 20)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" min={15} max={80} />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center">
                     Target W/C
                   </label>
                   <input type="number" step="0.01" value={targetWc} onChange={(e) => setTargetWc(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center">
                  Exposure Condition (IS 456)
                </label>
                <select value={exposure} onChange={(e) => setExposure(e.target.value as Exposure)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-indigo-500 font-semibold">
                  {Object.keys(EXPOSURE_LIMITS).map((exp) => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Agg Size (mm)</label>
                  <select value={aggSize} onChange={(e) => setAggSize(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-indigo-500 font-semibold">
                    <option value={10}>10 mm</option>
                    <option value={20}>20 mm</option>
                    <option value={40}>40 mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Slump (mm)</label>
                  <select value={slump} onChange={(e) => setSlump(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-indigo-500 font-semibold">
                    <option value={50}>50 mm</option>
                    <option value={75}>75 mm</option>
                    <option value={100}>100 mm</option>
                    <option value={125}>125 mm</option>
                    <option value={150}>150 mm</option>
                    <option value={200}>200 mm</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
               <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                 <Beaker className="w-4 h-4 text-emerald-500" /> SCMs & Admixtures
               </h3>

               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-600">Fly Ash (IS 3812)</label>
                      <span className="text-xs font-bold text-emerald-600">{scmFlyAsh}%</span>
                    </div>
                    <input type="range" min="0" max="35" value={scmFlyAsh} onChange={(e) => { setScmFlyAsh(Number(e.target.value)); setScmGgbs(0); }} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-600">GGBS (IS 16714)</label>
                      <span className="text-xs font-bold text-purple-600">{scmGgbs}%</span>
                    </div>
                    <input type="range" min="0" max="70" value={scmGgbs} onChange={(e) => { setScmGgbs(Number(e.target.value)); setScmFlyAsh(0); }} className="w-full accent-purple-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-600">Silica Fume (IS 15388)</label>
                      <span className="text-xs font-bold text-sky-600">{scmSilicaFume}%</span>
                    </div>
                    <input type="range" min="0" max="10" value={scmSilicaFume} onChange={(e) => setScmSilicaFume(Number(e.target.value))} className="w-full accent-sky-500" />
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                      Water Reducing Admixture
                    </label>
                    <select value={admixWaterReducer} onChange={(e) => setAdmixWaterReducer(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold">
                      <option value="None">None</option>
                      <option value="Plasticizer">Plasticizer (12% Red.)</option>
                      <option value="Superplasticizer">Superplasticizer (25% Red.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                      Temperature Control
                    </label>
                    <select value={admixType} onChange={(e) => setAdmixType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold">
                      <option value="Normal">Normal</option>
                      <option value="Retarder">Retarder (IS 7861-1)</option>
                      <option value="Accelerator">Accelerator (IS 7861-2)</option>
                    </select>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* RESULTS & CHECKS PANEL */}
        <div className="xl:col-span-8 space-y-6">
          {/* IS 456 DURABILITY CHECKS */}
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                 <ShieldCheck className="w-5 h-5 text-rose-500" /> IS 456:2000 Durability Compliance ({exposure})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className={`p-4 rounded-[24px] border flex items-center justify-between \${passGrade ? 'bg-emerald-50  border-emerald-200 ' : 'bg-rose-50  border-rose-200 '}`}>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Min. Grade</h4>
                      <p className="font-bold text-slate-800">M{fck} <span className="text-xs font-normal opacity-70">(Req: M{minGradeReq})</span></p>
                    </div>
                    {passGrade ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                 </div>

                 <div className={`p-4 rounded-[24px] border flex items-center justify-between \${passCement ? 'bg-emerald-50  border-emerald-200 ' : 'bg-rose-50  border-rose-200 '}`}>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Min. Cementitious</h4>
                      <p className="font-bold text-slate-800">{totalCementitious} kg <span className="text-xs font-normal opacity-70">(Req: {minCementReq})</span></p>
                    </div>
                    {passCement ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                 </div>

                 <div className={`p-4 rounded-[24px] border flex items-center justify-between \${passWc ? 'bg-emerald-50  border-emerald-200 ' : 'bg-rose-50  border-rose-200 '}`}>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Max W/C Ratio</h4>
                      <p className="font-bold text-slate-800">{finalWc.toFixed(2)} <span className="text-xs font-normal opacity-70">(Max: {maxWcAllowed})</span></p>
                    </div>
                    {passWc ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                 </div>
              </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Binder</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-indigo-600 tabular-nums">
                  {totalCementitious} <span className="text-sm font-bold text-slate-400">kg/m³</span>
                </p>
             </div>
             <div className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Water Content</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-sky-500 tabular-nums">
                  {Math.round(actualWaterContent)} <span className="text-sm font-bold text-slate-400">L/m³</span>
                </p>
             </div>
             <div className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Fine Aggregation</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-amber-500 tabular-nums">
                  {weightSand} <span className="text-sm font-bold text-slate-400">kg/m³</span>
                </p>
             </div>
             <div className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Coarse Agg</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-teal-600 tabular-nums">
                  {weightCA} <span className="text-sm font-bold text-slate-400">kg/m³</span>
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-6 overflow-hidden">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">By Weight Composition</h3>
                <div className="h-48">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={pieData}
                         cx="50%"
                         cy="50%"
                         innerRadius={40}
                         outerRadius={65}
                         paddingAngle={2}
                         dataKey="value"
                         stroke="none"
                       >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                       </Pie>
                       <RechartsTooltip formatter={(val: number) => `${val.toLocaleString('en-US')} kg`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                       <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* INTERNATIONAL COMPARISON */}
             <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
               <div className="p-6 border-b border-slate-100">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <TableIcon className="w-4 h-4 text-indigo-500" /> Code Comparison (Est.)
                 </h3>
               </div>
               <div className="overflow-x-auto flex-1 p-2 bg-slate-50/50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800">
                 <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-transparent">
                      <tr>
                        <th className="px-4 py-2 font-bold text-slate-600">Standard Code</th>
                        <th className="px-2 py-2 font-bold text-slate-600 text-right">Bind.</th>
                        <th className="px-2 py-2 font-bold text-slate-600 text-right">Wat.</th>
                        <th className="px-2 py-2 font-bold text-slate-600 text-right">FA</th>
                        <th className="px-2 py-2 font-bold text-slate-600 text-right">CA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {intlComparison.map((row, idx) => (
                        <tr key={idx} className={idx===0 ? "bg-indigo-50  font-bold rounded" : ""}>
                           <td className="px-4 py-3 text-slate-800">{row.code}</td>
                           <td className="px-2 py-3 text-right tabular-nums text-slate-700">{row.cementitious}</td>
                           <td className="px-2 py-3 text-right tabular-nums text-slate-700">{row.water}</td>
                           <td className="px-2 py-3 text-right tabular-nums text-slate-700">{row.sand}</td>
                           <td className="px-2 py-3 text-right tabular-nums text-slate-700">{row.ca}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE REPORT SECTION (Visually styled for screen, clean for print) */}
      <div className="print-only max-w-4xl mx-auto bg-white text-black p-8 font-serif hide-on-screen">
          <div className="border-b-2 border-black pb-4 mb-6 text-center">
             <h1 className="text-3xl font-semibold tabular-nums tracking-tight uppercase tracking-widest text-black">Concrete Mix Design Report</h1>
             <p className="text-sm mt-2 font-bold text-gray-600">IS 10262:2019 / IS 456:2000 Compliance</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
             <div>
                <h3 className="font-bold underline mb-2 text-black">1. Stipulations for Proportioning</h3>
                <ul className="text-sm space-y-1 text-black">
                   <li><span className="font-bold">Grade Designation:</span> M{fck}</li>
                   <li><span className="font-bold">Type of Cement:</span> OPC/Blended + SCMs</li>
                   <li><span className="font-bold">Max Nominal Agg Size:</span> {aggSize} mm</li>
                   <li><span className="font-bold">Exposure Condition:</span> {exposure}</li>
                   <li><span className="font-bold">Workability (Slump):</span> {slump} mm</li>
                   <li><span className="font-bold">Chemical Admixture:</span> {admixWaterReducer !== 'None' ? admixWaterReducer : admixType !== 'Normal' ? admixType : 'None'}</li>
                </ul>
             </div>
             <div>
                <h3 className="font-bold underline mb-2 text-black">2. Target Strength</h3>
                <ul className="text-sm space-y-1 text-black">
                   <li><span className="font-bold text-black">Target Mean Strength ($f'_{'{ck}'}$):</span></li>
                   <li>{fck} + 1.65({stdDev}) = <span className="font-bold">{targetMeanStrength.toFixed(2)} MPa</span></li>
                   <li className="mt-2"><span className="font-bold">Adopted Target W/C Ratio:</span> {finalWc.toFixed(2)}</li>
                   <li><span className="font-bold">Mix Volume:</span> 1.0 m³</li>
                </ul>
             </div>
          </div>

          <h3 className="font-bold underline mb-4 text-black">3. Final Mix Proportions (per cubic meter)</h3>
          <table className="w-full text-sm border-collapse border border-black mb-8 text-center text-black">
             <thead>
               <tr className="bg-gray-100">
                  <th className="border border-black p-2">Material</th>
                  <th className="border border-black p-2">Weight (kg)</th>
                  <th className="border border-black p-2">Volume (m³)</th>
                  <th className="border border-black p-2">Ratio</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td className="border border-black p-2 font-bold text-left text-black">Cement</td>
                 <td className="border border-black p-2">{weightCement}</td>
                 <td className="border border-black p-2">{volCement.toFixed(4)}</td>
                 <td className="border border-black p-2 font-bold">1.00</td>
               </tr>
               {weightFlyAsh > 0 && (
                 <tr>
                   <td className="border border-black p-2 text-left pl-4 text-black">+ Fly Ash (IS 3812)</td>
                   <td className="border border-black p-2">{weightFlyAsh}</td>
                   <td className="border border-black p-2">{volFa.toFixed(4)}</td>
                   <td className="border border-black p-2">{(weightFlyAsh/weightCement).toFixed(2)}</td>
                 </tr>
               )}
               {weightGgbs > 0 && (
                 <tr>
                   <td className="border border-black p-2 text-left pl-4 text-black">+ GGBS (IS 16714)</td>
                   <td className="border border-black p-2">{weightGgbs}</td>
                   <td className="border border-black p-2">{volGgbs.toFixed(4)}</td>
                   <td className="border border-black p-2">{(weightGgbs/weightCement).toFixed(2)}</td>
                 </tr>
               )}
               {weightSf > 0 && (
                 <tr>
                   <td className="border border-black p-2 text-left pl-4 text-black">+ Silica Fume (IS 15388)</td>
                   <td className="border border-black p-2">{weightSf}</td>
                   <td className="border border-black p-2">{volSf.toFixed(4)}</td>
                   <td className="border border-black p-2">{(weightSf/weightCement).toFixed(2)}</td>
                 </tr>
               )}
               <tr>
                 <td className="border border-black p-2 font-bold text-left bg-gray-50 text-black">Total Binder</td>
                 <td className="border border-black p-2 font-bold bg-gray-50 text-black">{totalCementitious}</td>
                 <td className="border border-black p-2 font-bold bg-gray-50 text-black">{volCementitious.toFixed(4)}</td>
                 <td className="border border-black p-2 font-bold bg-gray-50 text-black">-</td>
               </tr>
               <tr>
                 <td className="border border-black p-2 font-bold text-left text-black">Water</td>
                 <td className="border border-black p-2">{Math.round(actualWaterContent)}</td>
                 <td className="border border-black p-2">{volWater.toFixed(4)}</td>
                 <td className="border border-black p-2">{(actualWaterContent/totalCementitious).toFixed(2)}</td>
               </tr>
               <tr>
                 <td className="border border-black p-2 font-bold text-left text-black">Fine Aggregates (Sand)</td>
                 <td className="border border-black p-2">{weightSand}</td>
                 <td className="border border-black p-2">{(weightSand / (sgFaInput * 1000)).toFixed(4)}</td>
                 <td className="border border-black p-2">{(weightSand/totalCementitious).toFixed(2)}</td>
               </tr>
               <tr>
                 <td className="border border-black p-2 font-bold text-left text-black">Coarse Aggregates ({aggSize} mm)</td>
                 <td className="border border-black p-2">{weightCA}</td>
                 <td className="border border-black p-2">{(weightCA / (sgCaInput * 1000)).toFixed(4)}</td>
                 <td className="border border-black p-2">{(weightCA/totalCementitious).toFixed(2)}</td>
               </tr>
               {admixWaterReducer !== "None" && (
                  <tr>
                    <td className="border border-black p-2 font-bold text-left text-black">Admixture ({admixWaterReducer})</td>
                    <td className="border border-black p-2 text-black">{(totalCementitious * 0.01).toFixed(2)} (est. 1%)</td>
                    <td className="border border-black p-2 text-black">-</td>
                    <td className="border border-black p-2 text-black">-</td>
                  </tr>
               )}
               {admixType !== "Normal" && (
                  <tr>
                    <td className="border border-black p-2 font-bold text-left text-black">Admixture ({admixType})</td>
                    <td className="border border-black p-2 text-black">As per Manufacturer</td>
                    <td className="border border-black p-2 text-black">-</td>
                    <td className="border border-black p-2 text-black">-</td>
                  </tr>
               )}
             </tbody>
          </table>

          <div className="mt-12 pt-8 border-t border-black flex justify-between px-8 text-black">
             <div className="text-center text-black">
                <div className="w-48 border-b border-black mb-2"></div>
                <p className="font-bold text-sm text-black">Mix Designer Sign</p>
             </div>
             <div className="text-center text-black">
                <div className="w-48 border-b border-black mb-2"></div>
                <p className="font-bold text-sm text-black">Quality Control Sign</p>
             </div>
          </div>
      </div>
      
      {/* GLOBAL PRINT STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
            background: transparent !important;
            color: #000 !important;
          }
          .hide-on-screen {
            display: block !important;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
        @media screen {
          .hide-on-screen {
            display: none !important;
          }
        }
      `}} />

    </div>
  );
}
