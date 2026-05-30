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

const categories: { id: Category; label: string; icon: any; color: string }[] =
  [
    {
      id: "Length",
      label: "Length",
      icon: Ruler,
      color: "text-emerald-500 bg-emerald-100 ",
    },
    {
      id: "Area",
      label: "Area",
      icon: Square,
      color: "text-blue-500 bg-blue-100 ",
    },
    {
      id: "Volume",
      label: "Volume",
      icon: Box,
      color: "text-purple-500 bg-purple-100 ",
    },
    {
      id: "Weight",
      label: "Weight",
      icon: Scale,
      color: "text-rose-500 bg-rose-100 ",
    },
    {
      id: "Pressure",
      label: "Pressure",
      icon: Gauge,
      color: "text-orange-500 bg-orange-100 ",
    },
    {
      id: "Angle",
      label: "Angle",
      icon: Compass,
      color: "text-yellow-500 bg-yellow-100 ",
    },
    {
      id: "Power",
      label: "Power",
      icon: Zap,
      color: "text-amber-500 bg-amber-100 ",
    },
    {
      id: "Force",
      label: "Force",
      icon: Hammer,
      color: "text-red-500 bg-red-100 ",
    },
    {
      id: "Work",
      label: "Work",
      icon: Wrench,
      color: "text-indigo-600 bg-indigo-50 ",
    },
    {
      id: "Temperature",
      label: "Temperature",
      icon: Thermometer,
      color: "text-pink-500 bg-pink-100 ",
    },
    {
      id: "Speed",
      label: "Speed",
      icon: GaugeCircle,
      color: "text-sky-500 bg-sky-100 ",
    },
    {
      id: "Time",
      label: "Time",
      icon: Clock,
      color: "text-teal-500 bg-teal-100 ",
    },
    {
      id: "Fuel",
      label: "Fuel",
      icon: Fuel,
      color: "text-lime-500 bg-lime-100 ",
    },
    {
      id: "Voltage",
      label: "Voltage",
      icon: Battery,
      color: "text-fuchsia-500 bg-fuchsia-100 ",
    },
    {
      id: "Data",
      label: "Data",
      icon: Database,
      color: "text-cyan-500 bg-cyan-100 ",
    },
    {
      id: "Current",
      label: "Current",
      icon: Activity,
      color: "text-red-500 bg-red-100 ",
    },
    {
      id: "Resistance",
      label: "Resistance",
      icon: Waves,
      color: "text-amber-500 bg-amber-100 ",
    },
    {
      id: "Capacitance",
      label: "Capacitance",
      icon: Battery,
      color: "text-emerald-500 bg-emerald-100 ",
    },
    {
      id: "Frequency",
      label: "Frequency",
      icon: Radio,
      color: "text-blue-500 bg-blue-100 ",
    },
    {
      id: "Acceleration",
      label: "Acceleration",
      icon: Rocket,
      color: "text-orange-500 bg-orange-100 ",
    },
    {
      id: "Torque",
      label: "Torque",
      icon: RotateCcw,
      color: "text-indigo-600 bg-indigo-50 ",
    },
    {
      id: "Density",
      label: "Density",
      icon: Droplets,
      color: "text-teal-500 bg-teal-100 ",
    },
    {
      id: "Volumetric Flow",
      label: "Volumetric Flow",
      icon: Wind,
      color: "text-sky-500 bg-sky-100 ",
    },
    {
      id: "Mass Flow",
      label: "Mass Flow",
      icon: AlignEndHorizontal,
      color: "text-purple-500 bg-purple-100 ",
    },
    {
      id: "Dynamic Viscosity",
      label: "Dynamic Viscosity",
      icon: FlaskConical,
      color: "text-fuchsia-500 bg-fuchsia-100 ",
    },
    {
      id: "Typography",
      label: "Typography",
      icon: Type,
      color: "text-rose-500 bg-rose-100 ",
    },
    {
      id: "Resolution",
      label: "Resolution",
      icon: Monitor,
      color: "text-slate-500 bg-slate-100 ",
    },
    {
      id: "Currency",
      label: "Currency",
      icon: Banknote,
      color: "text-green-600 bg-green-100 ",
    },
  ];

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState<string>(unitsData["Length"][0].id);
  const [toUnit, setToUnit] = useState<string>(unitsData["Length"][1].id);
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("");

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
    <div className="w-full h-full overflow-y-auto bg-transparent text-text-primary p-6 md:p-8">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <h1 className="text-3xl font-bold tabular-nums tracking-tight mb-2 flex items-center gap-3">
          {" "}
          <RefreshCcw className="w-8 h-8 text-fuchsia-500" /> Universal Unit
          Converter{" "}
        </h1>{" "}
        <p className="text-slate-500 mb-8 font-medium">
          Instantly convert across 15 engineering and scientific categories with
          standard precision.
        </p>{" "}
        {/* Categories Tabs */}
        <div className="mb-10">
          <UniversalTabs 
            tabs={categories.map(c => ({ id: c.id, label: c.label, icon: <c.icon className="w-5 h-5" /> }))}
            activeTab={activeCategory}
            onTabChange={(id) => setActiveCategory(id as Category)}
          />
        </div>
        {/* Conversion UI */}{" "}
        <div className="bg-bg-card rounded-[2.5rem] p-8 md:p-12 border border-border-color shadow-xl shadow-slate-200/50">
          {" "}
          <h2 className="text-xl font-bold mb-8 text-center text-text-primary uppercase tracking-widest">
            {activeCategory} Conversion
          </h2>{" "}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {" "}
            {/* FROM PANE */}{" "}
            <div className="flex-1 w-full bg-transparent rounded-[24px] border border-slate-200 shadow-sm text-slate-800 p-6 md:p-8 rounded-[2rem] border border-border-color transition-all hover:border-fuchsia-300">
              {" "}
              <label className="block text-xs font-bold text-fuchsia-600 uppercase tracking-widest mb-4">
                From
              </label>{" "}
              <select
                value={fromUnit}
                onChange={(e) => handleFromUnitChange(e.target.value)}
                className="w-full bg-bg-card border border-border-color text-text-primary px-4 py-3 rounded-[24px] font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none"
              >
                {" "}
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}{" "}
              </select>{" "}
              <input
                type="number"
                value={fromValue}
                onChange={(e) => handleFromValueChange(e.target.value)}
                className="w-full bg-transparent border-0 text-[clamp(1.75rem,5vw,2.5rem)] break-all sm:text-[clamp(1.75rem,5vw,2.5rem)] break-all font-semibold tabular-nums tracking-tight text-text-primary placeholder-slate-300 focus:ring-0 focus:outline-none p-0 text-center whitespace-nowrap"
                placeholder="0"
              />{" "}
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
            <div className="flex-1 w-full bg-transparent rounded-[24px] border border-slate-200 shadow-sm text-slate-800 p-6 md:p-8 rounded-[2rem] border border-border-color transition-all hover:border-fuchsia-300">
              {" "}
              <label className="block text-xs font-bold text-fuchsia-600 uppercase tracking-widest mb-4">
                To
              </label>{" "}
              <select
                value={toUnit}
                onChange={(e) => handleToUnitChange(e.target.value)}
                className="w-full bg-bg-card border border-border-color text-text-primary px-4 py-3 rounded-[24px] font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none"
              >
                {" "}
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}{" "}
              </select>{" "}
              <div
                className="w-full overflow-hidden text-center text-[clamp(1.75rem,5vw,2.5rem)] break-all sm:text-[clamp(1.75rem,5vw,2.5rem)] break-all font-semibold tabular-nums tracking-tight text-text-primary py-2"
                style={{ minHeight: "60px" }}
              >
                {" "}
                {toValue || "0"}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          
          {/* Conversion specific feedback */}
          {conversionRate !== "" && (
             <div className="mt-8 pt-6 border-t border-border-color flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-1">
                  Conversion Rate
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-fuchsia-50 rounded-full border border-fuchsia-100 text-fuchsia-700 font-medium sm:text-lg text-sm flex-wrap justify-center">
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
