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
  RefreshCcw
} from "lucide-react";

type Category = "Length" | "Area" | "Volume" | "Weight" | "Pressure" | "Angle" | "Power" | "Force" | "Work" | "Temperature" | "Speed" | "Time" | "Fuel" | "Voltage" | "Data";

interface Unit {
  id: string;
  label: string;
  factor?: number; // Multiply base by this to get unit (so base = unit / factor). Wait, actually easier: base * factor = unit. Or base_value = unit_value * factor. Let's use: base_value = unit_value * factor.
  // Example: m to cm. If base is m, factor for cm is 0.01. So 1 cm = 0.01 m.
}

const categories: { id: Category; label: string; icon: any; color: string }[] = [
  { id: "Length", label: "Length", icon: Ruler, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20" },
  { id: "Area", label: "Area", icon: Square, color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20" },
  { id: "Volume", label: "Volume", icon: Box, color: "text-purple-500 bg-purple-100 dark:bg-purple-500/20" },
  { id: "Weight", label: "Weight", icon: Scale, color: "text-rose-500 bg-rose-100 dark:bg-rose-500/20" },
  { id: "Pressure", label: "Pressure", icon: Gauge, color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20" },
  { id: "Angle", label: "Angle", icon: Compass, color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20" },
  { id: "Power", label: "Power", icon: Zap, color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20" },
  { id: "Force", label: "Force", icon: Hammer, color: "text-red-500 bg-red-100 dark:bg-red-500/20" },
  { id: "Work", label: "Work", icon: Wrench, color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20" },
  { id: "Temperature", label: "Temperature", icon: Thermometer, color: "text-pink-500 bg-pink-100 dark:bg-pink-500/20" },
  { id: "Speed", label: "Speed", icon: GaugeCircle, color: "text-sky-500 bg-sky-100 dark:bg-sky-500/20" },
  { id: "Time", label: "Time", icon: Clock, color: "text-teal-500 bg-teal-100 dark:bg-teal-500/20" },
  { id: "Fuel", label: "Fuel", icon: Fuel, color: "text-lime-500 bg-lime-100 dark:bg-lime-500/20" },
  { id: "Voltage", label: "Voltage", icon: Battery, color: "text-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-500/20" },
  { id: "Data", label: "Data", icon: Database, color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20" },
];

// Conversions to BASE
// baseValue = inputValue * factor
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
    { id: "mmhg", label: "Millimeter of Mercury (mmHg)", factor: 133.322387415 },
  ],
  Angle: [
    { id: "deg", label: "Degree (°)", factor: 1 },
    { id: "rad", label: "Radian (rad)", factor: 57.295779513 },
    { id: "grad", label: "Gradian (grad)", factor: 0.9 },
    { id: "arcmin", label: "Minute of Arc (')", factor: 0.016666666667 },
    { id: "arcsec", label: "Second of Arc (\")", factor: 0.000277777778 },
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

  useEffect(() => {
    // Reset units when category changes
    const units = unitsData[activeCategory];
    if (units.length > 0) {
      setFromUnit(units[0].id);
      setToUnit(units.length > 1 ? units[1].id : units[0].id);
      setFromValue("1");
    }
  }, [activeCategory]);

  useEffect(() => {
    calculateConversion();
  }, [fromValue, fromUnit, toUnit, activeCategory]);

  const calculateConversion = () => {
    if (fromValue === "" || isNaN(parseFloat(fromValue))) {
      setToValue("");
      return;
    }
    
    const val = parseFloat(fromValue);
    let result = 0;

    if (activeCategory === "Temperature") {
      // Special logic for Temperature
      let celsius = val;
      if (fromUnit === "f") celsius = (val - 32) * 5 / 9;
      else if (fromUnit === "k") celsius = val - 273.15;

      if (toUnit === "c") result = celsius;
      else if (toUnit === "f") result = celsius * 9 / 5 + 32;
      else if (toUnit === "k") result = celsius + 273.15;
    } 
    else if (activeCategory === "Fuel") {
      // Special logic for Fuel (all convert to km/L as base)
      let kml = val;
      if (fromUnit === "l_100") kml = 100 / val;
      else if (fromUnit === "mpg_us") kml = val / 2.35214583;
      else if (fromUnit === "mpg_uk") kml = val / 2.824809363;

      if (toUnit === "km_l") result = kml;
      else if (toUnit === "l_100") result = 100 / kml;
      else if (toUnit === "mpg_us") result = kml * 2.35214583;
      else if (toUnit === "mpg_uk") result = kml * 2.824809363;
    }
    else {
      // Normal factor-based logic
      const uData = unitsData[activeCategory];
      const fUnitDef = uData.find((u) => u.id === fromUnit);
      const tUnitDef = uData.find((u) => u.id === toUnit);

      if (fUnitDef && tUnitDef && fUnitDef.factor && tUnitDef.factor) {
        const baseVal = val * fUnitDef.factor;
        result = baseVal / tUnitDef.factor;
      }
    }

    // Format nicely
    if (result === 0) setToValue("0");
    else if (Math.abs(result) < 0.000001 || Math.abs(result) > 10000000) {
      setToValue(result.toExponential(6).replace(/\.?0+e/, 'e'));
    } else {
      setToValue(parseFloat(result.toFixed(6)).toString());
    }
  };

  const handleSwap = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    // fromValue stays the same, calculateConversion runs in useEffect
  };

  const currentUnits = unitsData[activeCategory] || [];

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <RefreshCcw className="w-8 h-8 text-fuchsia-500" />
          Universal Unit Converter
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Instantly convert across 15 engineering and scientific categories with standard precision.</p>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-10">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = activeCategory === c.id;
            const baseColor = c.color.split('-')[1];
            
            // Build safe styles instead of dynamic strings
            const outerColorMap: Record<string, string> = {
              emerald: isActive ? "bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-500 text-white shadow-xl shadow-emerald-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900 text-slate-700 dark:text-slate-200 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20",
              blue: isActive ? "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-500 text-white shadow-xl shadow-blue-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900 text-slate-700 dark:text-slate-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20",
              purple: isActive ? "bg-gradient-to-br from-purple-500 to-purple-700 border-purple-500 text-white shadow-xl shadow-purple-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900 text-slate-700 dark:text-slate-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20",
              rose: isActive ? "bg-gradient-to-br from-rose-500 to-rose-700 border-rose-500 text-white shadow-xl shadow-rose-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-900 text-slate-700 dark:text-slate-200 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/20",
              pink: isActive ? "bg-gradient-to-br from-pink-500 to-pink-700 border-pink-500 text-white shadow-xl shadow-pink-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-pink-100 dark:border-pink-900 text-slate-700 dark:text-slate-200 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/20",
              amber: isActive ? "bg-gradient-to-br from-amber-500 to-amber-700 border-amber-500 text-white shadow-xl shadow-amber-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-amber-100 dark:border-amber-900 text-slate-700 dark:text-slate-200 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20",
              orange: isActive ? "bg-gradient-to-br from-orange-500 to-orange-700 border-orange-500 text-white shadow-xl shadow-orange-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-orange-100 dark:border-orange-900 text-slate-700 dark:text-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20",
              yellow: isActive ? "bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-500 text-white shadow-xl shadow-yellow-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-yellow-100 dark:border-yellow-900 text-slate-700 dark:text-slate-200 hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/20",
              teal: isActive ? "bg-gradient-to-br from-teal-500 to-teal-700 border-teal-500 text-white shadow-xl shadow-teal-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-teal-100 dark:border-teal-900 text-slate-700 dark:text-slate-200 hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20",
              cyan: isActive ? "bg-gradient-to-br from-cyan-500 to-cyan-700 border-cyan-500 text-white shadow-xl shadow-cyan-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-cyan-100 dark:border-cyan-900 text-slate-700 dark:text-slate-200 hover:border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20",
              indigo: isActive ? "bg-gradient-to-br from-indigo-500 to-indigo-700 border-indigo-500 text-white shadow-xl shadow-indigo-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 text-slate-700 dark:text-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20",
              lime: isActive ? "bg-gradient-to-br from-lime-500 to-lime-700 border-lime-500 text-white shadow-xl shadow-lime-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-lime-100 dark:border-lime-900 text-slate-700 dark:text-slate-200 hover:border-lime-300 hover:bg-lime-50 dark:hover:bg-lime-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-lime-500/20",
              fuchsia: isActive ? "bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 border-fuchsia-500 text-white shadow-xl shadow-fuchsia-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-fuchsia-100 dark:border-fuchsia-900 text-slate-700 dark:text-slate-200 hover:border-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-fuchsia-500/20",
              violet: isActive ? "bg-gradient-to-br from-violet-500 to-violet-700 border-violet-500 text-white shadow-xl shadow-violet-500/40 -translate-y-1 scale-105 z-10" : "bg-white dark:bg-slate-900 border-violet-100 dark:border-violet-900 text-slate-700 dark:text-slate-200 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/20",
            };
            
            const outerClass = outerColorMap[baseColor] || outerColorMap['blue'];

            const innerColorMap: Record<string, string> = {
              emerald: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-500 dark:from-emerald-500/20 dark:to-emerald-500/5",
              blue: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-500 dark:from-blue-500/20 dark:to-blue-500/5",
              purple: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-500 dark:from-purple-500/20 dark:to-purple-500/5",
              rose: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-rose-100 to-rose-50 text-rose-500 dark:from-rose-500/20 dark:to-rose-500/5",
              pink: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-pink-100 to-pink-50 text-pink-500 dark:from-pink-500/20 dark:to-pink-500/5",
              amber: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-500 dark:from-amber-500/20 dark:to-amber-500/5",
              orange: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 dark:from-orange-500/20 dark:to-orange-500/5",
              yellow: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-500 dark:from-yellow-500/20 dark:to-yellow-500/5",
              teal: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-teal-100 to-teal-50 text-teal-500 dark:from-teal-500/20 dark:to-teal-500/5",
              cyan: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-500 dark:from-cyan-500/20 dark:to-cyan-500/5",
              indigo: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-500 dark:from-indigo-500/20 dark:to-indigo-500/5",
              lime: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-lime-100 to-lime-50 text-lime-500 dark:from-lime-500/20 dark:to-lime-500/5",
              fuchsia: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 text-fuchsia-500 dark:from-fuchsia-500/20 dark:to-fuchsia-500/5",
              violet: isActive ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm' : "bg-gradient-to-br from-violet-100 to-violet-50 text-violet-500 dark:from-violet-500/20 dark:to-violet-500/5",
            };

            const innerClass = innerColorMap[baseColor] || innerColorMap['blue'];
            
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-[20px] border-2 transition-all duration-300 overflow-hidden group ${outerClass}`}
              >
                {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />}
                <div className={`p-3 rounded-2xl relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${innerClass}`}>
                  <Icon className="w-7 h-7 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                  {!isActive && <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: baseColor === 'lime' ? '#84cc16' : baseColor === 'cyan' ? '#06b6d4' : baseColor === 'emerald' ? '#10b981' : baseColor === 'amber' ? '#f59e0b' : baseColor === 'fuchsia' ? '#d946ef' : baseColor === 'rose' ? '#f43f5e' : baseColor === 'pink' ? '#ec4899' : baseColor === 'orange' ? '#f97316' : baseColor === 'violet' ? '#8b5cf6' : baseColor === 'teal' ? '#14b8a6' : baseColor === 'sky' ? '#0ea5e9' : '#3b82f6' }} />}
                </div>
                <span className={`text-[11px] sm:text-xs font-extrabold tracking-wide z-10 text-center leading-tight ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* Conversion UI */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <h2 className="text-xl font-bold mb-8 text-center text-slate-800 dark:text-white uppercase tracking-widest">{activeCategory} Conversion</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            
            {/* FROM PANE */}
            <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-fuchsia-300 dark:hover:border-fuchsia-500/30">
              <label className="block text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-4">From</label>
              <select 
                value={fromUnit} 
                onChange={(e) => setFromUnit(e.target.value)} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white p-4 rounded-2xl font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none"
              >
                {currentUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              <input 
                type="number" 
                value={fromValue}
                onChange={e => setFromValue(e.target.value)}
                className="w-full bg-transparent border-none text-4xl sm:text-5xl font-black text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:ring-0 p-0 text-center"
                placeholder="0"
              />
            </div>

            {/* SWAP BUTTON */}
            <button 
              onClick={handleSwap}
              className="p-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white dark:hover:bg-fuchsia-500 transition-all shadow-lg hover:rotate-180 duration-500 flex-shrink-0"
              title="Swap Units"
            >
              <ArrowRightLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>

            {/* TO PANE */}
            <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-fuchsia-300 dark:hover:border-fuchsia-500/30">
              <label className="block text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-4">To</label>
              <select 
                value={toUnit} 
                onChange={(e) => setToUnit(e.target.value)} 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white p-4 rounded-2xl font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none"
              >
                {currentUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              <div className="w-full overflow-hidden text-center text-4xl sm:text-5xl font-black text-slate-900 dark:text-white py-2 break-all" style={{ minHeight: '60px' }}>
                {toValue || "0"}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
