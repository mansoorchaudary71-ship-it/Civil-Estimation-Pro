import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "../layouts/CalculatorLayout";
import { MaterialSummary } from "../ui/MaterialSummary";
import {
  Settings,
  Calculator,
  AlertTriangle,
  FileOutput,
  CheckCircle,
  Droplet,
  Layers,
  HelpCircle,
  HardHat,
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
} from "recharts";

type Exposure = "Mild" | "Moderate" | "Severe" | "Very Severe" | "Extreme";

const EXPOSURE_LIMITS: Record<Exposure, { minCement: number; maxWc: number }> =
  {
    Mild: { minCement: 300, maxWc: 0.55 },
    Moderate: { minCement: 300, maxWc: 0.5 },
    Severe: { minCement: 320, maxWc: 0.45 },
    "Very Severe": { minCement: 340, maxWc: 0.45 },
    Extreme: { minCement: 360, maxWc: 0.4 },
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
}; // For Zone II sand at W/C = 0.5

const SG_CEMENT = 3.15;
const SG_FA = 2.65;
const SG_CA = 2.74;

export default function MixDesignCalculator() {
  const [fck, setFck] = useState<number>(30); // M30
  const [exposure, setExposure] = useState<Exposure>("Severe");
  const [aggSize, setAggSize] = useState<number>(20);
  const [slump, setSlump] = useState<number>(75); // mm
  const [targetWc, setTargetWc] = useState<number>(0.45); // Allow manual override, starting with exposure limit
  const [sgCementInput, setSgCementInput] = useState<number>(3.15);
  const [sgFaInput, setSgFaInput] = useState<number>(2.65);
  const [sgCaInput, setSgCaInput] = useState<number>(2.74);

  // Target Strength (f'ck) Calculation
  const stdDev = fck <= 25 ? 4 : fck > 60 ? 6 : 5;
  const targetStrength = fck + 1.65 * stdDev;

  // 1. Water content calculation
  let waterContent = BASE_WATER_CONTENT[aggSize] || 186;
  if (slump > 50) {
    const extraSlump = slump - 50;
    const additionalPercentage = Math.ceil(extraSlump / 25) * 3;
    waterContent = waterContent * (1 + additionalPercentage / 100);
  }

  // 2. W/C Ratio logic
  const maxWcAllowed = EXPOSURE_LIMITS[exposure].maxWc;
  const actualWc = Math.min(targetWc, maxWcAllowed); // Ensure we don't exceed max w/c for durability

  // 3. Cement Content
  let cementContent = Math.ceil(waterContent / actualWc);
  // Check min cement
  const minCementReq = EXPOSURE_LIMITS[exposure].minCement;
  let isCementAdjusted = false;
  if (cementContent < minCementReq) {
    cementContent = minCementReq;
    isCementAdjusted = true;
  }

  // 4. Volume calculations (Method of Absolute Volume)
  const volAir = ENTRAPPED_AIR[aggSize] || 0.02;
  const volCement = cementContent / (sgCementInput * 1000);
  const volWater = waterContent / 1000;

  const volAllAggregates = 1 - (volAir + volWater + volCement);

  // Adjust CA Volume based on W/C (Rule: +/- 0.01 for every -/+ 0.05 change in w/c from 0.50)
  let volCAFraction = BASE_CA_VOLUME[aggSize] || 0.62;
  const wcDiff = 0.5 - actualWc;
  const adjustment = (wcDiff / 0.05) * 0.01;
  volCAFraction = volCAFraction + adjustment;

  // Ensure we round cleanly or handle non-pumpable
  const weightCA = Math.round(
    volAllAggregates * volCAFraction * sgCaInput * 1000,
  );
  const weightFA = Math.round(
    volAllAggregates * (1 - volCAFraction) * sgFaInput * 1000,
  );

  // Warnings
  const warnings = [];
  if (cementContent > 450)
    warnings.push(
      `Cement content is very high (${cementContent} kg/m³). IS 456 limits max cement to 450 kg/m³. Use fly ash/GGBS or superplasticizers to reduce water and cement.`,
    );
  if (actualWc < targetWc)
    warnings.push(
      `Target W/C ratio of ${targetWc} was overridden to ${maxWcAllowed} to meet ${exposure} exposure condition requirements.`,
    );

  // Graph Data
  const pieData = [
    { name: "Cement", value: cementContent, fill: "#6366f1" },
    { name: "Fine Agg (Sand)", value: weightFA, fill: "#f59e0b" },
    { name: "Coarse Agg", value: weightCA, fill: "#0f766e" },
    { name: "Water", value: waterContent, fill: "#0ea5e9" },
  ];

  const barData = [
    { name: "M20", Cement: 320, FA: 700, CA: 1100, Water: 175 },
    { name: "M25", Cement: 360, FA: 680, CA: 1150, Water: 175 },
    {
      name: `Target M${fck}`,
      Cement: cementContent,
      FA: weightFA,
      CA: weightCA,
      Water: Math.round(waterContent),
    },
    { name: "M35", Cement: 410, FA: 640, CA: 1180, Water: 175 },
  ];

  // Batch specific (1 Bag of cement = 50kg)
  const batchFactor = 50 / cementContent;
  const batchCement = 50;
  const batchFA = Math.round(weightFA * batchFactor);
  const batchCA = Math.round(weightCA * batchFactor);
  const batchWater = (waterContent * batchFactor).toFixed(1);

  const LeftPanel = (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Mix Parameters
        </h3>

        <div className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Target Grade (fck MPa)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">M</span>
              <input
                type="number"
                value={fck}
                onChange={(e) => setFck(Number(e.target.value) || 20)}
                className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner hover:border-white/20"
                min={15}
                max={80}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
              Exposure Condition{" "}
              <HelpCircle
                className="w-4 h-4 opacity-50 cursor-help hover:opacity-100 transition-opacity text-slate-400"
                title="Mild, Moderate, Severe, Very Severe, Extreme based on environmental factors"
              />
            </label>
            <select
              value={exposure}
              onChange={(e) => setExposure(e.target.value as Exposure)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all appearance-none shadow-inner hover:border-white/20"
            >
              {Object.keys(EXPOSURE_LIMITS).map((exp) => (
                <option key={exp} value={exp} className="bg-slate-900">
                  {exp}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Agg Size (mm)
              </label>
              <select
                value={aggSize}
                onChange={(e) => setAggSize(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all appearance-none shadow-inner"
              >
                <option value={10} className="bg-slate-900">10 mm</option>
                <option value={20} className="bg-slate-900">20 mm</option>
                <option value={40} className="bg-slate-900">40 mm</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Slump (mm)
              </label>
              <select
                value={slump}
                onChange={(e) => setSlump(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all appearance-none shadow-inner"
              >
                <option value={50} className="bg-slate-900">50 mm</option>
                <option value={75} className="bg-slate-900">75 mm</option>
                <option value={100} className="bg-slate-900">100 mm</option>
                <option value={125} className="bg-slate-900">125 mm</option>
                <option value={150} className="bg-slate-900">150 mm</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Target W/C Ratio
            </label>
            <input
              type="number"
              step="0.01"
              value={targetWc}
              onChange={(e) => setTargetWc(Number(e.target.value))}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner"
            />
          </div>

          <div className="pt-6 mt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Specific Gravities
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                  Cement
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sgCementInput}
                  onChange={(e) => setSgCementInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm outline-none text-white focus:border-indigo-500 transition-colors shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                  Fine Agg.
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sgFaInput}
                  onChange={(e) => setSgFaInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm outline-none text-white focus:border-indigo-500 transition-colors shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                  Coarse Agg.
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sgCaInput}
                  onChange={(e) => setSgCaInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm outline-none text-white focus:border-indigo-500 transition-colors shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calculate Button */}
      <button className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-1 block md:hidden">
        Calculate Results
      </button>

      {warnings.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl backdrop-blur-md">
          <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> Design Warnings
          </h4>
          <ul className="list-disc pl-5 space-y-1.5">
            {warnings.map((w, i) => (
              <li
                key={i}
                className="text-amber-200 text-xs font-medium leading-relaxed"
              >
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md">
        <h4 className="font-bold text-emerald-400 text-sm mb-4">
          Code Provisions Met
        </h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Min Cement ({minCementReq} kg/m³) satisfied</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Max W/C Ratio ({maxWcAllowed}) satisfied</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const RightPanel = (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-3">
         <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
            <Calculator className="w-6 h-6 text-indigo-400" />
         </div>
         <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">MATERIAL SUMMARY</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2 relative z-10">
            Cement
          </p>
          <p className="text-3xl font-black text-indigo-400 tabular-nums relative z-10 drop-shadow-md">
            {cementContent}{" "}
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">kg/m³</span>
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2 relative z-10">
            Water
          </p>
          <p className="text-3xl font-black text-sky-400 tabular-nums relative z-10 drop-shadow-md">
            {Math.round(waterContent)}{" "}
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">L/m³</span>
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2 relative z-10">
            Fine Agg. (Sand)
          </p>
          <p className="text-3xl font-black text-amber-400 tabular-nums relative z-10 drop-shadow-md">
            {weightFA}{" "}
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">kg/m³</span>
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2 relative z-10">
            Coarse Agg.
          </p>
          <p className="text-3xl font-black text-teal-400 tabular-nums relative z-10 drop-shadow-md">
            {weightCA}{" "}
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">kg/m³</span>
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-1 mt-4">
        <div className="p-6 border-b border-white/10 bg-black/20">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <Layers className="w-5 h-5 text-purple-400" /> Mix Proportions (By Volume & Weight)
          </h3>
        </div>

        <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-10 items-stretch border-b border-white/10">
          <div className="w-full xl:w-1/2 xl:border-r border-white/10 xl:pr-8 flex flex-col justify-center">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center bg-white/5 py-2 rounded-lg">
              Batch Weight Ratio
            </h4>
            <div className="flex justify-center items-end gap-3 sm:gap-6 mb-2">
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/40 flex items-center justify-center font-black text-2xl text-white border-b-4 border-indigo-500 shadow-xl group-hover:-translate-y-2 transition-transform">
                  1
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                  Cement
                </span>
              </div>
              <span className="text-2xl font-black text-slate-600 pb-10">
                :
              </span>
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/40 flex items-center justify-center font-black text-2xl text-white border-b-4 border-amber-500 shadow-xl group-hover:-translate-y-2 transition-transform">
                  {(weightFA / cementContent).toFixed(2)}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                  Sand
                </span>
              </div>
              <span className="text-2xl font-black text-slate-600 pb-10">
                :
              </span>
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/40 flex items-center justify-center font-black text-2xl text-white border-b-4 border-teal-500 shadow-xl group-hover:-translate-y-2 transition-transform">
                  {(weightCA / cementContent).toFixed(2)}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                  Agg.
                </span>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 flex flex-col justify-center">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              Field Batch Equivalent (per 50kg bag)
            </h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-medium text-slate-300">
                    Cement
                  </td>
                  <td className="py-3.5 text-right font-black text-white">
                    {batchCement} kg
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-medium text-slate-300">
                    Fine Aggregate (Sand)
                  </td>
                  <td className="py-3.5 text-right font-black text-white">
                    {batchFA} kg
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-medium text-slate-300">
                    Coarse Aggregate
                  </td>
                  <td className="py-3.5 text-right font-black text-white">
                    {batchCA} kg
                  </td>
                </tr>
                <tr className="bg-sky-500/10 border-t-2 border-sky-500/30">
                  <td className="py-3.5 font-bold text-sky-400 px-4 rounded-bl-xl">
                    Water Required
                  </td>
                  <td className="py-3.5 text-right font-black text-sky-400 px-4 rounded-br-xl">
                    {batchWater} Liters
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-black/10">
          <div className="h-72 relative">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> By Weight Composition
            </h4>
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="rgba(0,0,0,0.2)"
                  label={({ name, value }) =>
                    `${name}: ${((value / (cementContent + weightFA + weightCA + waterContent)) * 100).toFixed(1)}%`
                  }
                  labelLine={false}
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    fill: "#94a3b8",
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: number) => `${val.toLocaleString('en-US')} kg`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-72">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Comparison with Standard Mixes
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 0, right: 0, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip 
                   cursor={{ fill: "rgba(255,255,255,0.05)" }}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} 
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "20px", color: "#e2e8f0" }} />
                <Bar dataKey="Cement" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Water" stackId="a" fill="#0ea5e9" />
                <Bar
                  dataKey="FA"
                  stackId="a"
                  fill="#f59e0b"
                  name="Fine Agg"
                />
                <Bar
                  dataKey="CA"
                  stackId="a"
                  fill="#14b8a6"
                  name="Coarse Agg"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout 
       title="Concrete Mix Design Pro"
       category="Concrete Tech"
       rating={4.9}
       reviewCount={854}
       LeftPanel={LeftPanel}
       RightPanel={RightPanel}
       formulasUsed={`Target Mean Strength (f'ck) = fck + 1.65 * S
W/C Ratio = base W/C modified by IS 10262 Table exposure guidelines
Cement Content = Water Content / Target W/C (capped by IS 456 min limits)
Vol of Cement = Cement_kg / (Specific Gravity * 1000)
Total Aggregate Vol = 1 - (WaterVol + CementVol + EntrappedAir)`}
       faqs={[
         { q: "Why did the actual W/C ratio change from my target?", a: "To ensure durability, IS 456 mandates a maximum water-cement ratio based on environmental exposure. If your target W/C exceeds the maximum allowed for your exposure condition (e.g. 0.45 for Severe), the calculator automatically lowers it to comply." },
         { q: "How is aggregate size modifying water content?", a: "Smaller aggregates have a larger surface area per unit volume, which requires more water and cement paste to coat them for a given workability (slump). IS 10262 applies different base water contents for 10mm, 20mm, and 40mm max aggregate sizes." }
       ]}
       howToSteps={[
         { title: "Define Target Grade", desc: "Select the required characteristic compressive strength of concrete at 28 days." },
         { title: "Set Environmental Exposure", desc: "Choose the exposure condition (Mild to Extreme) to enforce IS 456 durability limits." },
         { title: "Adjust Slump & SG", desc: "Modify the desired slump for workability, and input accurate specific gravity values from lab tests." }
       ]}
    />
  );
}
