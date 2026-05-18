import React, { useState } from "react";
import {
  Truck,
  Calculator,
  Ruler,
  Layers,
  DollarSign,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { CalculationHistory } from "../ui/CalculationHistory";

export default function StandardEarthworks() {
  const { settings, formatCurrency, convertAmount, convertAmountToRaw } = useSettings();
  const isMetric = settings.measurement === "SI";
  const unitL = isMetric ? "m" : "ft";
  const unitA = isMetric ? "m²" : "ft²";
  const unitV = isMetric ? "m³" : "ft³";
  const [length, setLength] = useState<string>("100");
  const [area1, setArea1] = useState<string>("50");
  const [area2, setArea2] = useState<string>("40");
  const [areaM, setAreaM] = useState<string>("47");
  const [calcMethod, setCalcMethod] = useState<"prismoidal" | "averageEnd">("prismoidal");
  const [autoCalcAm, setAutoCalcAm] = useState<boolean>(false);
  const [bulkingFactor, setBulkingFactor] = useState<string>("15");
  const [shrinkageFactor, setShrinkageFactor] = useState<string>("10");
  const [truckCapacity, setTruckCapacity] = useState<string>("800");
  const [excavationRate, setExcavationRate] = useState<string>("150");
  const [compactionRate, setCompactionRate] = useState<string>("100");
  const [haulingRate, setHaulingRate] = useState<string>("500");
  
  const l = parseFloat(length) || 0;
  const a1 = parseFloat(area1) || 0;
  const a2 = parseFloat(area2) || 0;
  const inputAm = parseFloat(areaM) || 0;
  
  const am = calcMethod === "prismoidal" && autoCalcAm
      ? Math.pow((Math.sqrt(a1) + Math.sqrt(a2)) / 2, 2)
      : inputAm;
      
  const solidVolume = calcMethod === "averageEnd"
      ? l * ((a1 + a2) / 2)
      : (l / 6) * (a1 + 4 * am + a2);
      
  const bulkPct = parseFloat(bulkingFactor) || 0;
  const shrinkPct = parseFloat(shrinkageFactor) || 0;
  const tCap = parseFloat(truckCapacity) || 0;
  
  const looseVolume = solidVolume * (1 + bulkPct / 100);
  const compactedVolume = solidVolume * (1 - shrinkPct / 100);
  
  const truckTrips = tCap > 0 ? Math.ceil(looseVolume / tCap) : 0;
  
  const excRateParsed = convertAmountToRaw(parseFloat(excavationRate) || 0);
  const compRateParsed = convertAmountToRaw(parseFloat(compactionRate) || 0);
  const haulRateParsed = convertAmountToRaw(parseFloat(haulingRate) || 0);
  
  const totalCostRaw = solidVolume * excRateParsed + compactedVolume * compRateParsed + truckTrips * haulRateParsed;
  const totalCostConverted = convertAmount(totalCostRaw);

  return (
    <div className="w-full bg-transparent text-gray-900 font-sans">
      <div className="space-y-8 mt-4">
        <div className="mb-4">
           <h2 className="text-2xl font-bold bg-gradient-to-r   bg-clip-text text-transparent pb-1">
             Standard Area/Depth Method
           </h2>
           <GlobalSettingsToggle align="left" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <section className="space-y-6">
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-blue-50 text-[#1A1A1A] rounded-xl">
                  <Ruler className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Volume Calculation
                </h2>
              </div>
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 ml-1">
                    Calculation Method
                  </label>
                  <div className="flex bg-gray-100/80 p-1 rounded-xl">
                    <button
                      onClick={() => setCalcMethod("prismoidal")}
                      className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${calcMethod === "prismoidal" ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.05)] text-[#1A1A1A]" : "text-gray-700 dark:text-gray-300 hover:text-gray-700"}`}
                    >
                      Prismoidal Formula
                    </button>
                    <button
                      onClick={() => setCalcMethod("averageEnd")}
                      className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${calcMethod === "averageEnd" ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.05)] text-[#1A1A1A]" : "text-gray-700 dark:text-gray-300 hover:text-gray-700"}`}
                    >
                      Average End Area
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Length (L) [{unitL}]
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder={`Enter length in ${unitL}...`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      End Area 1 (A₁) [{unitA}]
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                      value={area1}
                      onChange={(e) => setArea1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      End Area 2 (A₂) [{unitA}]
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                      value={area2}
                      onChange={(e) => setArea2(e.target.value)}
                    />
                  </div>
                </div>
                {calcMethod === "prismoidal" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                        Middle Area (Aₘ) [{unitA}]
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer pr-1">
                        <input
                          type="checkbox"
                          checked={autoCalcAm}
                          onChange={(e) => setAutoCalcAm(e.target.checked)}
                          className="w-3.5 h-3.5 text-[#1A1A1A] rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Calculate Aₘ Automatically
                        </span>
                      </label>
                    </div>
                    {!autoCalcAm ? (
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                        value={areaM}
                        onChange={(e) => setAreaM(e.target.value)}
                      />
                    ) : (
                      <div className="w-full bg-gray-50 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-3 cursor-not-allowed font-medium">
                        {am.toFixed(2)}
                        <span className="text-gray-700 dark:text-gray-300 text-sm ml-1 font-normal">
                          (approximated)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-[#F0F0C0] text-[#5C5C00] rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Factors & Hauling
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Swell Factor (%)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EDED78]/50 focus:border-[#EDED78] transition-shadow"
                      value={bulkingFactor}
                      onChange={(e) => setBulkingFactor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Shrink Factor (%)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EDED78]/50 focus:border-[#EDED78] transition-shadow"
                      value={shrinkageFactor}
                      onChange={(e) => setShrinkageFactor(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Truck Capacity ({unitV})
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EDED78]/50 focus:border-[#EDED78] transition-shadow"
                    value={truckCapacity}
                    onChange={(e) => setTruckCapacity(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Cost Estimation */}
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] mt-6">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Cost Estimation
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Excavation Rate (per Bank {unitV})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium">
                      {settings.currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-shadow"
                      value={excavationRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setExcavationRate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Compaction Rate (per Compacted {unitV})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium">
                      {settings.currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-shadow"
                      value={compactionRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setCompactionRate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Hauling Rate (per Truck Trip)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium">
                      {settings.currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-shadow"
                      value={haulingRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setHaulingRate(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Results Section */}
          <section className="space-y-6">
            <div className="bg-[#1A1A1A] text-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(79,70,229,0.2)] relative overflow-hidden">
              {/* Decorative background shapes */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-900/40 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Calculation Results
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/10 p-5 rounded-[1.25rem] border border-white/20 backdrop-blur-sm">
                    <div className="text-blue-100 text-sm font-medium mb-1">
                      Solid Volume (Bank Measure)
                    </div>
                    <div className="text-4xl font-extrabold tracking-tight">
                      {solidVolume.toFixed(2)}
                      <span className="text-xl font-medium text-blue-200">
                        {unitV}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center w-full">
                    <div className="bg-white/10 p-4 rounded-[1.25rem] border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="text-blue-100 text-xs font-medium mb-1">
                        Loose Volume (Swell)
                      </div>
                      <div className="text-2xl font-bold">
                        {looseVolume.toFixed(2)}
                        <span className="text-lg font-medium text-blue-200/70">
                          {unitV}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-[1.25rem] border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="text-indigo-100 text-xs font-medium mb-1">
                        Compacted Volume
                      </div>
                      <div className="text-2xl font-bold">
                        {compactedVolume.toFixed(2)}
                        <span className="text-lg font-medium text-indigo-200/70">
                          {unitV}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hauling Summary */}
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Total Truck Trips
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Based on loose volume & capacity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-4xl font-black text-[#1A1A1A] tracking-tighter">
                  {truckTrips}
                </div>
                <div className="text-gray-700 dark:text-gray-300 mt-2">trips</div>
              </div>
            </div>
            {/* Total Cost Summary */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(20,184,166,0.2)] text-white flex items-center justify-between mt-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-1">
                  Total Project Cost
                </h3>
                <p className="text-sm text-emerald-100 font-medium">
                  Excavation + Compaction + Hauling
                </p>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                  {formatCurrency(totalCostConverted)}
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Analytics Table */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-gray-50 text-gray-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-gray-800">
              Earthwork Volume Data Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100">
                    Parameter
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100">
                    Value
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">Length</td>
                  <td className="px-6 py-4 font-mono text-[#1A1A1A]">
                    {l.toFixed(2)} {unitL}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    Distance between end sections
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">End Areas</td>
                  <td className="px-6 py-4 font-mono text-[#1A1A1A]">
                    {a1.toFixed(2)} / {a2.toFixed(2)} {unitA}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">A1 and A2</td>
                </tr>
                {calcMethod === "prismoidal" && (
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">Middle Area</td>
                    <td className="px-6 py-4 font-mono text-[#1A1A1A]">
                      {am.toFixed(2)} {unitA}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      Am (used in Prismoidal formula)
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 border-l-2 border-blue-500">
                    Solid Volume
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    {solidVolume.toFixed(2)} {unitV}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    Bank measure before swell
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 border-l-2 border-indigo-500">
                    Hauling Trips
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-[#1A1A1A]">
                    {truckTrips} trips
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    @ {tCap.toFixed(2)} {unitV} capacity
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <CalculationHistory
          calculatorId="earthworks_v1"
          estimationName="Earthworks Estimate"
          currentInputs={{ length, area1, area2, areaM, calcMethod, autoCalcAm, bulkingFactor, shrinkageFactor, truckCapacity, excavationRate, compactionRate, haulingRate }}
          currentResults={{ solidVolume: solidVolume.toFixed(2), looseVolume: looseVolume.toFixed(2), truckTrips, totalCost: totalCostConverted }}
          summaryGeneration={(inputs, res) => `Vol: ${res.solidVolume} ${unitV} - Cost: ${res.totalCost}`}
          onRestore={(inputs) => {
            setLength(inputs.length || "");
            setArea1(inputs.area1 || "");
            setArea2(inputs.area2 || "");
            setAreaM(inputs.areaM || "");
            setCalcMethod(inputs.calcMethod || "prismoidal");
            setAutoCalcAm(inputs.autoCalcAm || false);
            setBulkingFactor(inputs.bulkingFactor || "");
            setShrinkageFactor(inputs.shrinkageFactor || "");
            setTruckCapacity(inputs.truckCapacity || "");
            setExcavationRate(inputs.excavationRate || "");
            setCompactionRate(inputs.compactionRate || "");
            setHaulingRate(inputs.haulingRate || "");
          }}
        />
      </div>
    </div>
  );
}
