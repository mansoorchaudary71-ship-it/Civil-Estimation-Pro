import React, { useState, useEffect } from "react";

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
} from "lucide-react";
import ColorfulTab from "../ui/ColorfulTab";
import { CalculationHistory } from "../ui/CalculationHistory";
import { Category, unitsData, convertValue } from "../../utils/unitConverter";

const categories: { id: Category; label: string; icon: any; color: string }[] =
  [
    {
      id: "Length",
      label: "Length",
      icon: Ruler,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      id: "Area",
      label: "Area",
      icon: Square,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20",
    },
    {
      id: "Volume",
      label: "Volume",
      icon: Box,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-500/20",
    },
    {
      id: "Weight",
      label: "Weight",
      icon: Scale,
      color: "text-rose-500 bg-rose-100 dark:bg-rose-500/20",
    },
    {
      id: "Pressure",
      label: "Pressure",
      icon: Gauge,
      color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20",
    },
    {
      id: "Angle",
      label: "Angle",
      icon: Compass,
      color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20",
    },
    {
      id: "Power",
      label: "Power",
      icon: Zap,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20",
    },
    {
      id: "Force",
      label: "Force",
      icon: Hammer,
      color: "text-red-500 bg-red-100 dark:bg-red-500/20",
    },
    {
      id: "Work",
      label: "Work",
      icon: Wrench,
      color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20",
    },
    {
      id: "Temperature",
      label: "Temperature",
      icon: Thermometer,
      color: "text-pink-500 bg-pink-100 dark:bg-pink-500/20",
    },
    {
      id: "Speed",
      label: "Speed",
      icon: GaugeCircle,
      color: "text-sky-500 bg-sky-100 dark:bg-sky-500/20",
    },
    {
      id: "Time",
      label: "Time",
      icon: Clock,
      color: "text-teal-500 bg-teal-100 dark:bg-teal-500/20",
    },
    {
      id: "Fuel",
      label: "Fuel",
      icon: Fuel,
      color: "text-lime-500 bg-lime-100 dark:bg-lime-500/20",
    },
    {
      id: "Voltage",
      label: "Voltage",
      icon: Battery,
      color: "text-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-500/20",
    },
    {
      id: "Data",
      label: "Data",
      icon: Database,
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20",
    },
  ]; /* Conversions to BASE
// baseValue = inputValue * factor */
const unitsData: Record<Category, Unit[]> = {
  Length: [
    { id: "m", label: "Meter (m)", factor: 1 },
    { id: "mm", label: "Millimeter (mm)", factor: 0.001 },
    { id: "cm", label: "Centimeter (cm)", factor: 0.01 },
    { id: "km", label: "Kilometer (km)", factor: 1000 },
    { id: "in", label: "Inch (in)", factor: 0.0254 },
    { id: "ft", label: "Foot (ft)", factor: 0.3048 },
    { id: "yd", label: "Yard (yd)", factor: 0.9144 },
    { id: "mi", label: "Mile (mi)", factor: 1609.344 },
    { id: "nmi", label: "Nautical Mile (nmi)", factor: 1852 },
  ],
  Area: [
    { id: "sm", label: "Square Meter (m²)", factor: 1 },
    { id: "smm", label: "Square Millimeter (mm²)", factor: 0.000001 },
    { id: "scm", label: "Square Centimeter (cm²)", factor: 0.0001 },
    { id: "skm", label: "Square Kilometer (km²)", factor: 1000000 },
    { id: "ha", label: "Hectare (ha)", factor: 10000 },
    { id: "sin", label: "Square Inch (sq in)", factor: 0.00064516 },
    { id: "sft", label: "Square Foot (sq ft)", factor: 0.09290304 },
    { id: "syd", label: "Square Yard (sq yd)", factor: 0.83612736 },
    { id: "ac", label: "Acre (ac)", factor: 4046.8564224 },
    { id: "smi", label: "Square Mile (sq mi)", factor: 2589988.110336 },
  ],
  Volume: [
    { id: "cm", label: "Cubic Meter (m³)", factor: 1 },
    { id: "ml", label: "Milliliter (mL)", factor: 0.000001 },
    { id: "l", label: "Liter (L)", factor: 0.001 },
    { id: "us_gal", label: "US Gallon", factor: 0.00378541 },
    { id: "us_qt", label: "US Quart", factor: 0.000946353 },
    { id: "us_pt", label: "US Pint", factor: 0.000473176 },
    { id: "us_cup", label: "US Cup", factor: 0.000236588 },
    { id: "us_oz", label: "US Fluid Ounce", factor: 0.0000295735 },
    { id: "uk_gal", label: "Imperial Gallon", factor: 0.00454609 },
    { id: "ci", label: "Cubic Inch (cu in)", factor: 0.000016387064 },
    { id: "cf", label: "Cubic Foot (cu ft)", factor: 0.028316846592 },
    { id: "cy", label: "Cubic Yard (cu yd)", factor: 0.764554857984 },
  ],
  Weight: [
    { id: "kg", label: "Kilogram (kg)", factor: 1 },
    { id: "mg", label: "Milligram (mg)", factor: 0.000001 },
    { id: "g", label: "Gram (g)", factor: 0.001 },
    { id: "t", label: "Metric Ton (t)", factor: 1000 },
    { id: "oz", label: "Ounce (oz)", factor: 0.028349523125 },
    { id: "lb", label: "Pound (lb)", factor: 0.45359237 },
    { id: "st", label: "Stone (st)", factor: 6.35029318 },
    { id: "us_t", label: "Short Ton (US, t)", factor: 907.18474 },
    { id: "uk_t", label: "Long Ton (UK, t)", factor: 1016.0469088 },
  ],
  Pressure: [
    { id: "pa", label: "Pascal (Pa)", factor: 1 },
    { id: "kpa", label: "Kilopascal (kPa)", factor: 1000 },
    { id: "mpa", label: "Megapascal (MPa)", factor: 1000000 },
    { id: "bar", label: "Bar", factor: 100000 },
    { id: "psi", label: "Pound per Square Inch (psi)", factor: 6894.7572932 },
    { id: "atm", label: "Standard Atmosphere (atm)", factor: 101325 },
    { id: "torr", label: "Torr", factor: 133.32236842 },
    {
      id: "mmhg",
      label: "Millimeter of Mercury (mmHg)",
      factor: 133.322387415,
    },
  ],
  Angle: [
    { id: "deg", label: "Degree (°)", factor: 1 },
    { id: "rad", label: "Radian (rad)", factor: 180 / Math.PI },
    { id: "grad", label: "Gradian (grad)", factor: 0.9 },
    { id: "arcmin", label: "Minute of Arc (')", factor: 1 / 60 },
    { id: "arcsec", label: 'Second of Arc (")', factor: 1 / 3600 },
  ],
  Power: [
    { id: "w", label: "Watt (W)", factor: 1 },
    { id: "kw", label: "Kilowatt (kW)", factor: 1000 },
    { id: "mw", label: "Megawatt (MW)", factor: 1000000 },
    { id: "hp_m", label: "Horsepower (metric)", factor: 735.49875 },
    { id: "hp_i", label: "Horsepower (imperial)", factor: 745.699872 },
    { id: "btu_h", label: "BTU per hour (BTU/h)", factor: 0.29307107 },
    { id: "tr", label: "Ton of Refrigeration (TR)", factor: 3516.85284 },
  ],
  Force: [
    { id: "n", label: "Newton (N)", factor: 1 },
    { id: "kn", label: "Kilonewton (kN)", factor: 1000 },
    { id: "kgf", label: "Kilogram-force (kgf)", factor: 9.80665 },
    { id: "lbf", label: "Pound-force (lbf)", factor: 4.448221615 },
    { id: "dyne", label: "Dyne", factor: 0.00001 },
  ],
  Work: [
    { id: "j", label: "Joule (J)", factor: 1 },
    { id: "kj", label: "Kilojoule (kJ)", factor: 1000 },
    { id: "mj", label: "Megajoule (MJ)", factor: 1000000 },
    { id: "gj", label: "Gigajoule (GJ)", factor: 1000000000 },
    { id: "cal", label: "Calorie (cal)", factor: 4.184 },
    { id: "kcal", label: "Kilocalorie (kcal)", factor: 4184 },
    { id: "wh", label: "Watt-hour (Wh)", factor: 3600 },
    { id: "kwh", label: "Kilowatt-hour (kWh)", factor: 3600000 },
    { id: "btu", label: "British Thermal Unit (BTU)", factor: 1055.05585 },
    { id: "ft_lb", label: "Foot-pound (ft-lbf)", factor: 1.355817948 },
  ],
  Temperature: [
    { id: "c", label: "Celsius (°C)" },
    { id: "f", label: "Fahrenheit (°F)" },
    { id: "k", label: "Kelvin (K)" },
  ],
  Speed: [
    { id: "m_s", label: "Meter per Second (m/s)", factor: 1 },
    { id: "km_h", label: "Kilometer per Hour (km/h)", factor: 0.2777777778 },
    { id: "mph", label: "Mile per Hour (mph)", factor: 0.44704 },
    { id: "knot", label: "Knot (kn)", factor: 0.5144444444 },
    { id: "ft_s", label: "Foot per Second (ft/s)", factor: 0.3048 },
  ],
  Time: [
    { id: "s", label: "Second (s)", factor: 1 },
    { id: "ms", label: "Millisecond (ms)", factor: 0.001 },
    { id: "m", label: "Minute (min)", factor: 60 },
    { id: "h", label: "Hour (h)", factor: 3600 },
    { id: "d", label: "Day (d)", factor: 86400 },
    { id: "wk", label: "Week (wk)", factor: 604800 },
    { id: "mo", label: "Month (avg, 30.43d)", factor: 2629800 },
    { id: "y", label: "Year (avg, 365.25d)", factor: 31557600 },
  ],
  Fuel: [
    { id: "km_l", label: "Kilometer per Liter (km/L)" },
    { id: "l_100", label: "Liter per 100km (L/100km)" },
    { id: "mpg_us", label: "Miles per US Gallon (mpg)" },
    { id: "mpg_uk", label: "Miles per Imperial Gallon (mpg)" },
  ],
  Voltage: [
    { id: "v", label: "Volt (V)", factor: 1 },
    { id: "mv", label: "Millivolt (mV)", factor: 0.001 },
    { id: "kv", label: "Kilovolt (kV)", factor: 1000 },
    { id: "mv_mega", label: "Megavolt (MV)", factor: 1000000 },
  ],
  Data: [
    { id: "b", label: "Byte (B)", factor: 1 },
    { id: "bit", label: "Bit (bit)", factor: 0.125 },
    { id: "kb", label: "Kilobyte (KB)", factor: 1024 },
    { id: "mb", label: "Megabyte (MB)", factor: 1048576 },
    { id: "gb", label: "Gigabyte (GB)", factor: 1073741824 },
    { id: "tb", label: "Terabyte (TB)", factor: 1099511627776 },
    { id: "pb", label: "Petabyte (PB)", factor: 1125899906842624 },
  ],
};
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
    <div className="w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          {" "}
          <RefreshCcw className="w-8 h-8 text-fuchsia-500" /> Universal Unit
          Converter{" "}
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 mb-8 font-medium">
          Instantly convert across 15 engineering and scientific categories with
          standard precision.
        </p>{" "}
        {/* Categories Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-10 p-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = activeCategory === c.id;
            const baseColor = c.color.split("-")[1];
            return (
              <ColorfulTab
                key={c.id}
                id={c.id}
                label={c.label}
                icon={<Icon className="w-5 h-5" />}
                isActive={isActive}
                onClick={() => setActiveCategory(c.id)}
                colorTheme={baseColor as any}
              />
            );
          })}
        </div>
        {/* Conversion UI */}{" "}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {" "}
          <h2 className="text-xl font-bold mb-8 text-center text-slate-800 dark:text-white uppercase tracking-widest">
            {activeCategory} Conversion
          </h2>{" "}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {" "}
            {/* FROM PANE */}{" "}
            <div className="flex-1 w-full bg-transparent dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-fuchsia-300 dark:hover:border-fuchsia-500/30">
              {" "}
              <label className="block text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-4">
                From
              </label>{" "}
              <select
                value={fromUnit}
                onChange={(e) => handleFromUnitChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-2xl font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none"
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
                className="w-full bg-transparent border-0 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:ring-0 focus:outline-none p-0 text-center whitespace-nowrap"
                placeholder="0"
              />{" "}
            </div>{" "}
            {/* SWAP BUTTON */}{" "}
            <button
              onClick={handleSwap}
              className="p-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white dark:hover:bg-fuchsia-500 transition-all shadow-lg hover:rotate-180 duration-500 flex-shrink-0"
              title="Swap Units"
            >
              {" "}
              <ArrowRightLeft className="w-6 h-6" strokeWidth={2.5} />{" "}
            </button>{" "}
            {/* TO PANE */}{" "}
            <div className="flex-1 w-full bg-transparent dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-fuchsia-300 dark:hover:border-fuchsia-500/30">
              {" "}
              <label className="block text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-4">
                To
              </label>{" "}
              <select
                value={toUnit}
                onChange={(e) => handleToUnitChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-2xl font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none"
              >
                {" "}
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}{" "}
              </select>{" "}
              <div
                className="w-full overflow-hidden text-center text-4xl sm:text-5xl font-black text-slate-900 dark:text-white py-2"
                style={{ minHeight: "60px" }}
              >
                {" "}
                {toValue || "0"}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          
          {/* Conversion specific feedback */}
          {conversionRate !== "" && (
             <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1">
                  Conversion Rate
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-full border border-fuchsia-100 dark:border-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 font-medium sm:text-lg text-sm flex-wrap justify-center">
                  <span>1 {fromUnitLabel.split(' (')[0]}</span>
                  <span className="text-fuchsia-400 dark:text-fuchsia-500 font-normal">=</span>
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
