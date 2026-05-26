import React, { useState } from "react";
import {
  Truck,
  Calculator,
  Ruler,
  Layers,
  DollarSign,
} from "lucide-react";
import { MaterialSummary } from "../ui/MaterialSummary";
import { ResultCard } from "../ui/ResultCard";
import { FieldTooltip } from "../ui/FieldTooltip";

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
                <div className="p-2.5 bg-blue-50 text-indigo-600 rounded-xl">
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
                      className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${calcMethod === "prismoidal" ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.05)] text-indigo-600" : "text-gray-700 dark:text-gray-300 hover:text-gray-700"}`}
                    >
                      Prismoidal Formula
                    </button>
                    <button
                      onClick={() => setCalcMethod("averageEnd")}
                      className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${calcMethod === "averageEnd" ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.05)] text-indigo-600" : "text-gray-700 dark:text-gray-300 hover:text-gray-700"}`}
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
                          className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-blue-500"
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
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Factors & Hauling
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
                      Swell Factor (%)
                      <FieldTooltip content="Volume increase when soil is excavated. Loose sandy soil = 10-15%, Clay = 20-30%, Rock = 25-50%" />
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
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
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
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
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
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
          <section className="space-y-6 flex-1 flex flex-col mt-6">
            <MaterialSummary
               title="Calculation Results"
               totalLabel="Total Project Cost"
               totalValue={formatCurrency(totalCostConverted)}
               totalUnit=""
               subtitle="Excavation + Compaction + Hauling"
             >
               {totalCostConverted === 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mt-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚠</span>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-400">
                      Material rates not set. Fill in the rates above or go to Live DB Rates to set current market prices first.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const event = new CustomEvent('navigate-module', { detail: { moduleId: 'rates' } });
                      window.dispatchEvent(event);
                    }}
                    className="shrink-0 text-xs font-bold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Set Live DB Rates
                  </button>
                </div>
               )}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                 <ResultCard
                   title="Solid Volume"
                   value={solidVolume.toFixed(2)}
                   unit={unitV}
                   description="Bank Measure"
                   variant="neutral"
                 />
                 <ResultCard
                   title="Loose Volume"
                   value={looseVolume.toFixed(2)}
                   unit={unitV}
                   description="Excavated Measure"
                   variant="neutral"
                 />
                 <ResultCard
                   title="Compacted Volume"
                   value={compactedVolume.toFixed(2)}
                   unit={unitV}
                   variant="neutral"
                 />
                 <ResultCard
                   title="Total Truck Trips"
                   value={truckTrips}
                   unit="trips"
                   description="Based on loose vol & capacity"
                   variant="neutral"
                 />
               </div>
             </MaterialSummary>
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
                  <td className="px-6 py-4 font-mono text-indigo-600">
                    {l.toFixed(2)} {unitL}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    Distance between end sections
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">End Areas</td>
                  <td className="px-6 py-4 font-mono text-indigo-600">
                    {a1.toFixed(2)} / {a2.toFixed(2)} {unitA}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">A1 and A2</td>
                </tr>
                {calcMethod === "prismoidal" && (
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">Middle Area</td>
                    <td className="px-6 py-4 font-mono text-indigo-600">
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
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">
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
