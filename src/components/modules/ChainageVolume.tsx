import React, { useState } from "react";
import {
  Truck,
  Calculator,
  Ruler,
  Hash,
  Plus,
  Layers,
  ArrowRight,
  Trash2,
  Map,
  LayoutTemplate,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";
import { v4 as uuidv4 } from "uuid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

interface Station {
  id: string;
  chainage: string;
  ngl: string;
  fl: string;
}
export default function ChainageVolumeEstimator() {
  const { settings, formatCurrency, convertAmount, convertAmountToRaw } =
    useSettings();
  const isMetric = settings.measurement === "SI";
  const unitL = isMetric ? "m" : "ft";
  const unitA = isMetric ? "m²" : "ft²";
  const unitV = isMetric ? "m³" : "ft³";
  const [formationWidth, setFormationWidth] = useState("10");
  const [cutSlope, setCutSlope] = useState("1.5");
  const [fillSlope, setFillSlope] = useState("2.0");
  const [stations, setStations] = useState<Station[]>([
    { id: uuidv4(), chainage: "0", ngl: "100", fl: "100" },
    { id: uuidv4(), chainage: "30", ngl: "102", fl: "100" },
    { id: uuidv4(), chainage: "60", ngl: "98", fl: "100" },
  ]);
  const parseChainage = (val: string) => {
    const clean = val.replace(/\s/g, "");
    if (clean.includes("+")) {
      const parts = clean.split("+");
      return parseFloat(parts.join("")) || 0;
    }
    return parseFloat(clean) || 0;
  };
  const handleUpdateStation = (
    id: string,
    field: keyof Station,
    value: string,
  ) => {
    setStations(
      stations.map((st) => (st.id === id ? { ...st, [field]: value } : st)),
    );
  };
  const addStation = () => {
    setStations([...stations, { id: uuidv4(), chainage: "", ngl: "", fl: "" }]);
  };
  const removeStation = (id: string) => {
    if (stations.length > 1) {
      setStations(stations.filter((st) => st.id !== id));
    }
  };
  const B = parseFloat(formationWidth) || 0;
  const sc = parseFloat(cutSlope) || 0;
  const sf = parseFloat(fillSlope) || 0;
  const sortedStations = [...stations].sort(
    (a, b) => parseChainage(a.chainage) - parseChainage(b.chainage),
  );
  let cumCut = 0;
  let cumFill = 0;
  const results = sortedStations.map((station, index) => {
    const ch = parseChainage(station.chainage);
    const ngl = parseFloat(station.ngl) || 0;
    const fl = parseFloat(station.fl) || 0;
    const d = ngl - fl;
    const d_cut = d > 0 ? d : 0;
    const d_fill = d < 0 ? -d : 0;
    const cutArea = B * d_cut + sc * d_cut * d_cut;
    const fillArea = B * d_fill + sf * d_fill * d_fill;
    let intCut = 0;
    let intFill = 0;
    let length = 0;
    if (index > 0) {
      const prev = sortedStations[index - 1];
      const prevCh = parseChainage(prev.chainage);
      const prevNgl = parseFloat(prev.ngl) || 0;
      const prevFl = parseFloat(prev.fl) || 0;
      length = Math.max(0, ch - prevCh);
      const d_prev = prevNgl - prevFl;
      const prev_cutArea =
        B * (d_prev > 0 ? d_prev : 0) +
        sc * (d_prev > 0 ? d_prev : 0) * (d_prev > 0 ? d_prev : 0);
      const prev_fillArea =
        B * (d_prev < 0 ? -d_prev : 0) +
        sf * (d_prev < 0 ? -d_prev : 0) * (d_prev < 0 ? -d_prev : 0);
      const dm_true = (d + d_prev) / 2;
      const true_dm_cut = dm_true > 0 ? dm_true : 0;
      const true_dm_fill = dm_true < 0 ? -dm_true : 0;
      const Am_cut = B * true_dm_cut + sc * true_dm_cut * true_dm_cut;
      const Am_fill = B * true_dm_fill + sf * true_dm_fill * true_dm_fill;
      /* Prismoidal Formula */ intCut =
        (length / 6) * (cutArea + 4 * Am_cut + prev_cutArea);
      intFill = (length / 6) * (fillArea + 4 * Am_fill + prev_fillArea);
      cumCut += intCut;
      cumFill += intFill;
    }
    const netVolume = cumCut - cumFill;
    return {
      ...station,
      parsedChainage: ch,
      length,
      depthCut: d_cut,
      depthFill: d_fill,
      cutArea,
      fillArea,
      intCut,
      intFill,
      cumCut,
      cumFill,
      netVolume,
    };
  });
  const totalCut = cumCut;
  const totalFill = cumFill;
  const finalNet = totalCut - totalFill;
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl md:text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent pb-1 flex items-center gap-3">
              <Map className="w-8 h-8 text-amber-500" /> Road Earthwork
              Calculator
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Calculate road alignment cutting and filling volumes using the
              accurate Prismoidal Formula.
            </p>
            <div className="mt-5 w-fit">
              <GlobalSettingsToggle align="left" showCurrency={false} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 space-y-6">
            {/* Global Parameters */}
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Road Parameters
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Formation Width ({unitL})
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                    value={formationWidth}
                    onChange={(e) => setFormationWidth(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Cut Slope (H:1V)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                    value={cutSlope}
                    onChange={(e) => setCutSlope(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Fill Slope (H:1V)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                    value={fillSlope}
                    onChange={(e) => setFillSlope(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <Map className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-800">
                    Station Data
                  </h2>
                </div>
                <button
                  onClick={addStation}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Station
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      <th className="pb-3 pr-4 font-semibold min-w-[120px]">
                        Chainage
                      </th>
                      <th className="pb-3 px-4 font-semibold min-w-[100px]">
                        NGL ({unitL})
                      </th>
                      <th className="pb-3 px-4 font-semibold min-w-[100px]">
                        FL ({unitL})
                      </th>
                      <th className="pb-3 px-4 font-semibold min-w-[100px]">
                        Depth ({unitL})
                      </th>
                      <th className="pb-3 pl-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {results.map((st) => (
                      <tr
                        key={st.id}
                        className="group hover:bg-transparent transition-colors"
                      >
                        <td className="py-2 pr-4">
                          <input
                            type="text"
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow font-mono text-sm"
                            value={st.chainage}
                            onChange={(e) =>
                              handleUpdateStation(
                                st.id,
                                "chainage",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 1+200"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow font-mono text-sm"
                            value={st.ngl}
                            onChange={(e) =>
                              handleUpdateStation(st.id, "ngl", e.target.value)
                            }
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow font-mono text-sm"
                            value={st.fl}
                            onChange={(e) =>
                              handleUpdateStation(st.id, "fl", e.target.value)
                            }
                          />
                        </td>
                        <td className="py-2 px-4">
                          <div className="font-mono text-[13px] font-semibold flex flex-col items-start bg-slate-100 rounded-lg px-3 py-1.5 min-w-[70px]">
                            {st.depthCut > 0 && (
                              <span className="text-amber-600">
                                C: {st.depthCut.toFixed(2)}
                              </span>
                            )}
                            {st.depthFill > 0 && (
                              <span className="text-indigo-600">
                                F: {st.depthFill.toFixed(2)}
                              </span>
                            )}
                            {st.depthCut === 0 && st.depthFill === 0 && (
                              <span className="text-gray-700 dark:text-gray-300">0.00</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 pl-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => removeStation(st.id)}
                            disabled={stations.length <= 1}
                            className={`p-2 rounded-lg ${stations.length <= 1 ? "text-gray-300 cursor-not-allowed" : "text-red-400 hover:text-red-600 hover:bg-red-50"}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Detailed Results Table */}
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-gray-700 dark:text-gray-300" /> Calculation
                Output (Prismoidal Method)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 bg-gray-50/50">
                      <th className="py-3 px-4 rounded-tl-lg text-gray-800">
                        Ch / Stn
                      </th>
                      <th className="py-3 px-4">Dist.</th>
                      <th className="py-3 px-4 text-amber-700">
                        Area C ({unitA})
                      </th>
                      <th className="py-3 px-4 text-indigo-700">
                        Area F ({unitA})
                      </th>
                      <th className="py-3 px-4 text-amber-700">
                        Vol C ({unitV})
                      </th>
                      <th className="py-3 px-4 text-indigo-700">
                        Vol F ({unitV})
                      </th>
                      <th className="py-3 px-4 text-amber-900 bg-amber-50/50">
                        Cum C
                      </th>
                      <th className="py-3 px-4 text-indigo-900 bg-indigo-50/50">
                        Cum F
                      </th>
                      <th className="py-3 px-4 bg-gray-100/50 rounded-tr-lg">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[13px]">
                    {results.map((r, i) => (
                      <tr
                        key={r.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {r.chainage || "0"}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {r.length > 0 ? r.length.toFixed(2) : "-"}
                        </td>
                        <td className="py-3 px-4 text-amber-600/70">
                          {r.cutArea > 0 ? r.cutArea.toFixed(2) : "-"}
                        </td>
                        <td className="py-3 px-4 text-indigo-600/70">
                          {r.fillArea > 0 ? r.fillArea.toFixed(2) : "-"}
                        </td>
                        <td className="py-3 px-4 text-amber-600 font-semibold bg-amber-50/10">
                          {r.intCut > 0 ? r.intCut.toFixed(2) : "-"}
                        </td>
                        <td className="py-3 px-4 text-indigo-600 font-semibold bg-indigo-50/10">
                          {r.intFill > 0 ? r.intFill.toFixed(2) : "-"}
                        </td>
                        <td className="py-3 px-4 text-amber-800 bg-amber-50/40 font-bold">
                          {r.cumCut.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-indigo-800 bg-indigo-50/40 font-bold">
                          {r.cumFill.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-4 font-bold bg-gray-50/60 ${r.netVolume > 0 ? "text-amber-600" : r.netVolume < 0 ? "text-indigo-600" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {r.netVolume > 0 ? "C " : r.netVolume < 0 ? "F " : ""}
                          {Math.abs(r.netVolume).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mass Haul Curve Chart */}
            <div className="bg-white px-4 py-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-indigo-600" /> Mass Haul Curve
              </h2>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={results}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                    <XAxis 
                      dataKey="chainage" 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      tickMargin={12} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      tickMargin={12} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: number) => [`${value.toFixed(2)} ${unitV}`, "Mass Haul"]}
                      labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="netVolume" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fill="url(#splitColor)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-xs text-gray-500 font-medium text-center">
                The diagram plots Cumulative Volume vs. Chainage. Points where the curve intersects the zero line indicate balance points.
              </p>
            </div>
          </section>
          <section className="lg:col-span-4 space-y-6">
            <div className="flex flex-col h-full sticky top-6">
              <MaterialSummary
                title="Summary"
                totalLabel={`Final Balance ${finalNet >= 0 ? "(Excess Cut)" : "(Required Fill)"}`}
                totalValue={Math.abs(finalNet).toFixed(2)}
                totalUnit={unitV}
              >
                <div className="grid grid-cols-1 gap-4 mt-6">
                  <ResultCard
                    title="Cumulative Cut"
                    value={totalCut.toFixed(2)}
                    unit={unitV}
                    variant="warning"
                  />
                  <ResultCard
                    title="Cumulative Fill"
                    value={totalFill.toFixed(2)}
                    unit={unitV}
                    variant="secondary"
                  />
                </div>
              </MaterialSummary>
            </div>
          </section>
        </div>
      </div>
      <CalculationHistory
        calculatorId="chainage_v1"
        estimationName="Road Earthworks"
        currentInputs={{
          formationWidth, cutSlope, fillSlope, stations
        }}
        currentResults={{ 
          totalCut: totalCut.toFixed(2), 
          totalFill: totalFill.toFixed(2), 
          finalNet: finalNet.toFixed(2)
        }}
        summaryGeneration={(inputs, res) => `Cut: ${res.totalCut}${unitV} | Fill: ${res.totalFill}${unitV}`}
        onRestore={(inputs) => {
          if (inputs.formationWidth) setFormationWidth(inputs.formationWidth);
          if (inputs.cutSlope) setCutSlope(inputs.cutSlope);
          if (inputs.fillSlope) setFillSlope(inputs.fillSlope);
          if (inputs.stations && Array.isArray(inputs.stations)) setStations(inputs.stations);
        }}
      />
    </div>
  );
}
