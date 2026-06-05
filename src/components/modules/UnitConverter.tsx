import React, { useState, useEffect } from "react";
import { UniversalTabs } from "../ui/UniversalTabs";

import {
  Ruler,
  Square,
  Box,
  Scale,
  Gauge,
  Compass,
  Zap,
  Hammer,
  Wrench,
  Thermometer,
  GaugeCircle,
  Clock,
  Fuel,
  Battery,
  Database,
  ArrowRightLeft,
  RefreshCcw,
  Activity,
  Radio,
  Waves,
  Rocket,
  RotateCcw,
  Droplets,
  Wind,
  AlignEndHorizontal,
  FlaskConical,
  Type,
  Monitor,
  Banknote,
} from "lucide-react";
import { CalculationHistory } from "../ui/CalculationHistory";
import { Category, unitsData, convertValue } from "../../utils/unitConverter";
import { useSettings } from "../../context/SettingsContext";

const categories: { id: Category; label: string; icon: any; color: string }[] = [
  { id: "Length", label: "Length", icon: Ruler, color: "text-emerald-500 bg-emerald-100/50 " },
  { id: "Area", label: "Area", icon: Square, color: "text-blue-500 bg-blue-100/50 " },
  { id: "Volume", label: "Volume", icon: Box, color: "text-purple-500 bg-purple-100/50 " },
  { id: "Mass", label: "Mass (Weignt)", icon: Scale, color: "text-rose-500 bg-rose-100/50 " },
  { id: "Density", label: "Density", icon: Droplets, color: "text-teal-500 bg-teal-100/50 " },
  { id: "Force", label: "Force", icon: Hammer, color: "text-orange-500 bg-orange-100/50 " },
  { id: "Pressure & Stress", label: "Pressure / Stress", icon: Gauge, color: "text-red-500 bg-red-100/50 " },
  { id: "Torque & Moment", label: "Torque / Moment", icon: RotateCcw, color: "text-indigo-600 bg-indigo-50/50 " },
  { id: "Velocity", label: "Velocity", icon: GaugeCircle, color: "text-sky-500 bg-sky-100/50 " },
  { id: "Angle", label: "Angle", icon: Compass, color: "text-yellow-500 bg-yellow-100/50 " },
  { id: "Temperature", label: "Temperature", icon: Thermometer, color: "text-pink-500 bg-pink-100/50 " },
  { id: "Energy & Work", label: "Energy & Work", icon: Wrench, color: "text-fuchsia-500 bg-fuchsia-100/50 " },
  { id: "Power", label: "Power", icon: Zap, color: "text-amber-500 bg-amber-100/50 " },
  { id: "Volumetric Flow", label: "Volumetric Flow", icon: Wind, color: "text-cyan-500 bg-cyan-100/50 " },
  { id: "Dynamic Viscosity", label: "Dynamic Viscosity", icon: FlaskConical, color: "text-violet-500 bg-violet-100/50 " }
];

export default function UnitConverter() {
  const { settings, updateSettings } = useSettings();
  const [activeCategory, setActiveCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState<string>(unitsData["Length"][0].id);
  const [toUnit, setToUnit] = useState<string>(unitsData["Length"][1].id);
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("");
  
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [batchInput, setBatchInput] = useState<string>("");
  const [batchResults, setBatchResults] = useState<{in: string, out: string}[]>([]);

  useEffect(() => {
    if (isBatchMode) {
      const values = batchInput.split(/[\n,]+/).map(v => v.trim()).filter(v => v !== "" && !isNaN(Number(v)));
      setBatchResults(values.map(v => ({ in: v, out: convertValue(v, fromUnit, toUnit, activeCategory) })));
    }
  }, [batchInput, fromUnit, toUnit, activeCategory, isBatchMode]);

  const handleFromValueChange = (valStr: string) => {
    setFromValue(valStr);
    setToValue(convertValue(valStr, fromUnit, toUnit, activeCategory));
  };

  const handleFromUnitChange = (fUnit: string) => {
    setFromUnit(fUnit);
    setToValue(convertValue(fromValue, fUnit, toUnit, activeCategory));
  };

  const handleToUnitChange = (tUnit: string) => {
    setToUnit(tUnit);
    setToValue(convertValue(fromValue, fromUnit, tUnit, activeCategory));
  };

  useEffect(() => {
    /* Reset units when category changes */ const units =
      unitsData[activeCategory];
    if (units.length > 0) {
      const initFromUnit = units[0].id;
      const initToUnit = units.length > 1 ? units[1].id : units[0].id;
      setFromUnit(initFromUnit);
      setToUnit(initToUnit);
      setFromValue("1");
      setToValue(convertValue("1", initFromUnit, initToUnit, activeCategory));
    }
  }, [activeCategory]);

  const handleSwap = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setToValue(convertValue(fromValue, toUnit, tempUnit, activeCategory));
  };
  const currentUnits = unitsData[activeCategory] || [];
  
  const fromUnitLabel = currentUnits.find((u) => u.id === fromUnit)?.label || fromUnit;
  const toUnitLabel = currentUnits.find((u) => u.id === toUnit)?.label || toUnit;
  const conversionRate = convertValue("1", fromUnit, toUnit, activeCategory);

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-100 p-6 md:p-8">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        {" "}
        {" "}
        {/* Categories Tabs */}
        <div className="mb-10">
          <div className="w-full bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-6 mb-8 border border-slate-700/50 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-fuchsia-500" />
                  Global Measurement System
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Automatically scale input fields across all calculators based on your preference.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-full border border-slate-600/50 relative z-10 w-full md:w-auto">
                <button
                  onClick={() => updateSettings({ measurement: "SI" })}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    settings.measurement === "SI"
                      ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Metric (m, kg)
                </button>
                <button
                  onClick={() => updateSettings({ measurement: "FPS" })}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    settings.measurement === "FPS"
                      ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Imperial (ft, lb)
                </button>
              </div>
            </div>
          </div>

          <UniversalTabs 
            tabs={categories.map(c => ({ id: c.id, label: c.label, icon: <c.icon className="w-5 h-5" /> }))}
            activeTab={activeCategory}
            onTabChange={(id) => setActiveCategory(id as Category)}
          />
        </div>
        {/* Conversion UI */}{" "}
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-slate-700/50 shadow-2xl overflow-hidden relative">
          {" "}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold text-center sm:text-left text-slate-100 uppercase tracking-widest">
              {activeCategory} Conversion
            </h2>
            <div className="flex items-center justify-center gap-3">
               <span className="text-sm font-bold text-slate-300">Batch Mode</span>
               <button 
                 onClick={() => setIsBatchMode(!isBatchMode)}
                 className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${isBatchMode ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-md ${isBatchMode ? 'translate-x-7' : 'translate-x-1'}`} />
               </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {" "}
            {/* FROM PANE */}{" "}
            <div className={`w-full bg-slate-800/40 backdrop-blur-xl rounded-[2rem] border border-slate-700 shadow-inner p-6 md:p-8 transition-all hover:border-fuchsia-500/50 hover:bg-slate-800/60 flex flex-col items-center justify-center relative ${isBatchMode ? 'flex-none md:w-[45%]' : 'flex-1'}`}>
              {" "}
              <label className="block text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-4 drop-shadow-md z-10">
                From
              </label>{" "}
              <select
                value={fromUnit}
                onChange={(e) => handleFromUnitChange(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-600 text-slate-100 px-4 py-3 rounded-[24px] font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/30 focus:border-fuchsia-500 transition-all outline-none shadow-inner z-10"
              >
                {" "}
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}{" "}
              </select>{" "}
              {isBatchMode ? (
                <textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="Paste comma-separated values (e.g., 5, 10, 15)"
                  className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-[20px] p-4 text-center font-mono text-sm min-h-[120px] focus:outline-none focus:border-fuchsia-500 transition-colors z-10 resize-none shadow-inner"
                />
              ) : (
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => handleFromValueChange(e.target.value)}
                  className="w-full bg-transparent border-0 text-[clamp(1.75rem,5vw,2.5rem)] font-bold tabular-nums tracking-tight text-white placeholder-white/20 focus:ring-0 focus:outline-none p-0 text-center drop-shadow-lg z-10"
                  placeholder="0"
                />
              )}{" "}
            </div>{" "}
            {/* SWAP BUTTON */}{" "}
            <button
              onClick={handleSwap}
              className="p-5 rounded-full bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-600 hover:text-slate-900 transition-all shadow-lg hover:rotate-180 duration-500 flex-shrink-0"
              title="Swap Units"
            >
              {" "}
              <ArrowRightLeft className="w-6 h-6" strokeWidth={2.5} />{" "}
            </button>{" "}
            {/* TO PANE */}{" "}
            <div className={`w-full bg-slate-800/40 backdrop-blur-xl rounded-[2rem] border border-slate-700 shadow-inner p-6 md:p-8 transition-all hover:border-fuchsia-500/50 hover:bg-slate-800/60 flex flex-col items-center justify-center relative ${isBatchMode ? 'flex-none md:w-[45%]' : 'flex-1'}`}>
              {" "}
              <label className="block text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-4 drop-shadow-md z-10">
                To
              </label>{" "}
              <select
                value={toUnit}
                onChange={(e) => handleToUnitChange(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-600 text-slate-100 px-4 py-3 rounded-[24px] font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/30 focus:border-fuchsia-500 transition-all outline-none shadow-inner z-10"
              >
                {" "}
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}{" "}
              </select>{" "}
              
              {isBatchMode ? (
                <div className="w-full bg-slate-900/50 border border-slate-700 rounded-[20px] p-4 text-center font-mono text-sm min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar shadow-inner z-10 flex flex-col gap-1">
                   {batchResults.length === 0 ? (
                     <div className="text-slate-500 italic my-auto">Results will appear here</div>
                   ) : (
                     batchResults.map((res, i) => (
                       <div key={i} className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-1 mb-1 last:border-0 last:mb-0 last:pb-0">
                         <span className="opacity-70">{res.in} <span className="text-[10px] uppercase">{fromUnit}</span></span>
                         <span className="font-bold text-fuchsia-400">{res.out} <span className="text-[10px] uppercase text-fuchsia-500/70">{toUnit}</span></span>
                       </div>
                     ))
                   )}
                </div>
              ) : (
                <div
                  className="w-full overflow-hidden text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold tabular-nums tracking-tight text-white py-2 drop-shadow-lg z-10"
                  style={{ minHeight: "60px" }}
                >
                  {" "}
                  {toValue || "0"}{" "}
                </div>
              )}
            </div>{" "}
          </div>{" "}
          
          {/* Conversion specific feedback */}
          {conversionRate !== "" && (
             <div className="mt-8 pt-6 border-t border-border-color flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-1">
                  Conversion Rate
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-fuchsia-900/30 rounded-full border border-fuchsia-500/30 text-fuchsia-300 font-medium sm:text-lg text-sm flex-wrap justify-center">
                  <span>1 {fromUnitLabel.split(' (')[0]}</span>
                  <span className="text-fuchsia-400 font-normal">=</span>
                  <span className="font-bold">{conversionRate} {toUnitLabel.split(' (')[0]}</span>
                </div>
             </div>
          )}
        </div>{" "}
        {" "}
      </div>{" "}
      <CalculationHistory
        calculatorId="unit_converter_v1"
        currentInputs={{ activeCategory, fromUnit, toUnit, fromValue }}
        currentResults={{ toValue: toValue || "0" }}
        summaryGeneration={(inputs, results) => `${inputs.fromValue} ${inputs.fromUnit} to ${results.toValue} ${inputs.toUnit}`}
        onRestore={(inputs) => {
          if (inputs.activeCategory) setActiveCategory(inputs.activeCategory);
          if (inputs.fromUnit) setFromUnit(inputs.fromUnit);
          if (inputs.toUnit) setToUnit(inputs.toUnit);
          if (inputs.fromValue !== undefined) setFromValue(inputs.fromValue);
        }}
      />
    </div>
  );
}
