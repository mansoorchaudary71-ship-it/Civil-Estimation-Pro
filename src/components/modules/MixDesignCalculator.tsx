import React, { useState, useMemo } from "react";
import { MaterialSummary } from "../ui/MaterialSummary";
import { CalculationHistory } from "../ui/CalculationHistory";
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Droplet className="w-8 h-8" />
            </div>
            Concrete Mix Design (IS 10262)
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Design performance-based concrete mixes according to standard codes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" /> Mix Parameters
            </h3>

            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Grade (fck MPa)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">M</span>
                  <input
                    type="number"
                    value={fck}
                    onChange={(e) => setFck(Number(e.target.value) || 20)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    min={15}
                    max={80}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  Exposure Condition{" "}
                  <HelpCircle
                    className="w-3.5 h-3.5 opacity-50"
                  />
                </label>
                <select
                  value={exposure}
                  onChange={(e) => setExposure(e.target.value as Exposure)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(EXPOSURE_LIMITS).map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Agg Size (mm)
                  </label>
                  <select
                    value={aggSize}
                    onChange={(e) => setAggSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={10}>10 mm</option>
                    <option value={20}>20 mm</option>
                    <option value={40}>40 mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Slump (mm)
                  </label>
                  <select
                    value={slump}
                    onChange={(e) => setSlump(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={50}>50 mm</option>
                    <option value={75}>75 mm</option>
                    <option value={100}>100 mm</option>
                    <option value={125}>125 mm</option>
                    <option value={150}>150 mm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target W/C Ratio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetWc}
                  onChange={(e) => setTargetWc(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Specific Gravities
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Cement
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sgCementInput}
                      onChange={(e) => setSgCementInput(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Fine Agg.
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sgFaInput}
                      onChange={(e) => setSgFaInput(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Coarse Agg.
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sgCaInput}
                      onChange={(e) => setSgCaInput(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl">
              <h4 className="text-amber-800 dark:text-amber-400 font-bold text-sm flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Design Warnings
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((w, i) => (
                  <li
                    key={i}
                    className="text-amber-700 dark:text-amber-500 text-xs font-medium"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">
              Code Provisions Met
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Min Cement ({minCementReq} kg/m³) satisfied</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Max W/C Ratio ({maxWcAllowed}) satisfied</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                Cement
              </p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                {cementContent}{" "}
                <span className="text-sm font-bold text-slate-400">kg/m³</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                Water
              </p>
              <p className="text-3xl font-black text-sky-500 dark:text-sky-400 tabular-nums">
                {Math.round(waterContent)}{" "}
                <span className="text-sm font-bold text-slate-400">L/m³</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                Fine Aggregation
              </p>
              <p className="text-3xl font-black text-amber-500 dark:text-amber-400 tabular-nums">
                {weightFA}{" "}
                <span className="text-sm font-bold text-slate-400">kg/m³</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                Coarse Agg
              </p>
              <p className="text-3xl font-black text-teal-600 dark:text-teal-400 tabular-nums">
                {weightCA}{" "}
                <span className="text-sm font-bold text-slate-400">kg/m³</span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden flex-1">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" /> Mix
                Proportions
              </h3>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-8 items-center border-b border-slate-100 dark:border-slate-800">
              <div className="w-full md:w-1/2 md:border-r border-slate-100 dark:border-slate-800 md:pr-8">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">
                  Batch Weight Ratio
                </h4>
                <div className="flex justify-center items-end gap-2 sm:gap-4 mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-slate-800 dark:text-white border-4 border-indigo-500">
                      1
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-2">
                      Cement
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-slate-300 pb-6">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-slate-800 dark:text-white border-4 border-amber-500">
                      {(weightFA / cementContent).toFixed(2)}
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-2">
                      F.A.
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-slate-300 pb-6">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-slate-800 dark:text-white border-4 border-teal-500">
                      {(weightCA / cementContent).toFixed(2)}
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-2">
                      C.A.
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Field Batch (per 50kg bag)
                </h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                        Cement
                      </td>
                      <td className="py-2.5 text-right font-black">
                        {batchCement} kg
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                        Fine Aggregate (Sand)
                      </td>
                      <td className="py-2.5 text-right font-black">
                        {batchFA} kg
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                        Coarse Aggregate
                      </td>
                      <td className="py-2.5 text-right font-black">
                        {batchCA} kg
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 font-semibold text-sky-600 dark:text-sky-400 px-2 rounded-l-lg">
                        Water Required
                      </td>
                      <td className="py-2.5 text-right font-black text-sky-600 dark:text-sky-400 px-2 rounded-r-lg">
                        {batchWater} Liters
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="h-64 relative">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 text-center absolute w-full top-0">
                  By Weight Composition
                </h4>
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  className="mt-4"
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${((value / (cementContent + weightFA + weightCA + waterContent)) * 100).toFixed(1)}%`
                      }
                      labelLine={false}
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",
                        fill: "#64748b",
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => `${val.toLocaleString('en-US')} kg`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Comparison with Standard Mixes
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: "bold" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="Cement" stackId="a" fill="#6366f1" />
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
                      fill="#0f766e"
                      name="Coarse Agg"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalculationHistory
        calculatorId="mix_design_calculator"
        currentInputs={{ fck, maxCA, slump, exposure, mixType, specificGravityCement, specificGravityFA, specificGravityCA }}
        currentResults={{
          "Cement": `${cementContent} kg/m³`,
          "Water": `${(waterContent).toFixed(1)} L`,
          "Fine Sand": `${(weightFA).toFixed(1)} kg`,
          "Coarse Agg": `${Math.round(weightCA)} kg`
        }}
        estimationName="Concrete Mix Design"
      />
    </div>
  );
}
