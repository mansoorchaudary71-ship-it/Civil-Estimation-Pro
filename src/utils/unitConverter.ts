import { Point } from './measurements';

export const CIVIL_CONSTANTS = {
  DRY_CONCRETE_FACTOR: 1.54,
  DRY_MORTAR_FACTOR: 1.33,
  STEEL_DENSITY_KG_M3: 7850,
  CEMENT_BAG_VOLUME_M3: 0.0347,
  CEMENT_BAG_VOLUME_CFT: 1.226,
  CEMENT_BAG_KG: 50,
  CEMENT_DENSITY_KG_M3: 1440,
  MARLA_TO_SQFT: 225,
  WATER_DENSITY_KG_L: 1,
  WATER_LITER_TO_GALLON: 0.264172,
  WATER_M3_TO_LITER: 1000,
  M3_TO_CFT: 35.3147,
  CFT_TO_M3: 0.0283168,
  IN_TO_MM: 25.4,
  MM_TO_M: 0.001,
  FT_TO_M: 0.3048,
  M_TO_FT: 3.28084,
  KG_TO_TON: 0.001,
  TON_TO_KG: 1000,
  SQ_MM_TO_SQ_M: 0.000001,
};

// Types for UnitConverter component
export type Category =
  | "Length"
  | "Area"
  | "Volume"
  | "Weight"
  | "Pressure"
  | "Angle"
  | "Power"
  | "Force"
  | "Work"
  | "Temperature"
  | "Speed"
  | "Time"
  | "Fuel"
  | "Voltage"
  | "Data"
  | "Current"
  | "Resistance"
  | "Capacitance"
  | "Frequency"
  | "Acceleration"
  | "Torque"
  | "Density"
  | "Volumetric Flow"
  | "Mass Flow"
  | "Dynamic Viscosity"
  | "Typography"
  | "Resolution"
  | "Currency";

export interface Unit {
  id: string;
  label: string;
  factor?: number; // baseValue = inputValue * factor
}

export const unitsData: Record<Category, Unit[]> = {
  Length: [
    { id: "m", label: "Meter (m)", factor: 1 },
    { id: "km", label: "Kilometer (km)", factor: 1000 },
    { id: "cm", label: "Centimeter (cm)", factor: 0.01 },
    { id: "mm", label: "Millimeter (mm)", factor: 0.001 },
    { id: "um", label: "Micrometer (μm)", factor: 0.000001 },
    { id: "nm", label: "Nanometer (nm)", factor: 0.000000001 },
    { id: "mi", label: "Mile (mi)", factor: 1609.344 },
    { id: "yd", label: "Yard (yd)", factor: 0.9144 },
    { id: "ft", label: "Foot (ft)", factor: 0.3048 },
    { id: "in", label: "Inch (in)", factor: 0.0254 },
    { id: "nmi", label: "Nautical Mile (nmi)", factor: 1852 },
  ],
  Area: [
    { id: "sm", label: "Square Meter (m²)", factor: 1 },
    { id: "smm", label: "Square Millimeter (mm²)", factor: CIVIL_CONSTANTS.SQ_MM_TO_SQ_M },
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
    { id: "cf", label: "Cubic Foot (cu ft)", factor: CIVIL_CONSTANTS.CFT_TO_M3 },
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
    { id: "ft_s", label: "Foot per Second (ft/s)", factor: CIVIL_CONSTANTS.FT_TO_M },
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
  Current: [
    { id: "a", label: "Ampere (A)", factor: 1 },
    { id: "ma", label: "Milliampere (mA)", factor: 0.001 },
    { id: "ua", label: "Microampere (μA)", factor: 0.000001 },
    { id: "ka", label: "Kiloampere (kA)", factor: 1000 },
  ],
  Resistance: [
    { id: "ohm", label: "Ohm (Ω)", factor: 1 },
    { id: "mohm", label: "Milliohm (mΩ)", factor: 0.001 },
    { id: "kohm", label: "Kilo-ohm (kΩ)", factor: 1000 },
    { id: "megaohm", label: "Mega-ohm (MΩ)", factor: 1000000 },
  ],
  Capacitance: [
    { id: "f", label: "Farad (F)", factor: 1 },
    { id: "mf", label: "Millifarad (mF)", factor: 0.001 },
    { id: "uf", label: "Microfarad (μF)", factor: 0.000001 },
    { id: "nf", label: "Nanofarad (nF)", factor: 0.000000001 },
    { id: "pf", label: "Picofarad (pF)", factor: 0.000000000001 },
  ],
  Frequency: [
    { id: "hz", label: "Hertz (Hz)", factor: 1 },
    { id: "khz", label: "Kilohertz (kHz)", factor: 1000 },
    { id: "mhz", label: "Megahertz (MHz)", factor: 1000000 },
    { id: "ghz", label: "Gigahertz (GHz)", factor: 1000000000 },
  ],
  Acceleration: [
    { id: "m_s2", label: "Meter per square second (m/s²)", factor: 1 },
    { id: "g_force", label: "G-force (g)", factor: 9.80665 },
    { id: "ft_s2", label: "Foot per square second (ft/s²)", factor: 0.3048 },
    { id: "cm_s2", label: "Centimeter per square second (cm/s²)", factor: 0.01 },
  ],
  Torque: [
    { id: "nm", label: "Newton-meter (N·m)", factor: 1 },
    { id: "lbf_ft", label: "Pound-force foot (lbf·ft)", factor: 1.3558179483314 },
    { id: "lbf_in", label: "Pound-force inch (lbf·in)", factor: 0.1129848290276167 },
    { id: "kgf_m", label: "Kilogram-force meter (kgf·m)", factor: 9.80665 },
  ],
  Density: [
    { id: "kg_m3", label: "Kilogram per cubic meter (kg/m³)", factor: 1 },
    { id: "g_cm3", label: "Gram per cubic centimeter (g/cm³)", factor: 1000 },
    { id: "lb_ft3", label: "Pound per cubic foot (lb/ft³)", factor: 16.01846337396014 },
    { id: "lb_in3", label: "Pound per cubic inch (lb/in³)", factor: 27679.904710203105 },
  ],
  "Volumetric Flow": [
    { id: "cm_s", label: "Cubic meter per second (m³/s)", factor: 1 },
    { id: "l_s", label: "Liter per second (L/s)", factor: 0.001 },
    { id: "l_min", label: "Liter per minute (L/min)", factor: 0.000016666666666666667 },
    { id: "gal_min", label: "Gallon per minute (US, GPM)", factor: 0.0000630901964 },
    { id: "cfm", label: "Cubic foot per minute (CFM)", factor: 0.0004719474432 },
  ],
  "Mass Flow": [
    { id: "kg_s", label: "Kilogram per second (kg/s)", factor: 1 },
    { id: "g_s", label: "Gram per second (g/s)", factor: 0.001 },
    { id: "kg_h", label: "Kilogram per hour (kg/h)", factor: 0.0002777777777777778 },
    { id: "lb_s", label: "Pound per second (lb/s)", factor: 0.45359237 },
    { id: "lb_h", label: "Pound per hour (lb/h)", factor: 0.0001259978805555555 },
  ],
  "Dynamic Viscosity": [
    { id: "pa_s", label: "Pascal-second (Pa·s)", factor: 1 },
    { id: "p", label: "Poise (P)", factor: 0.1 },
    { id: "cp", label: "Centipoise (cP)", factor: 0.001 },
  ],
  Typography: [
    { id: "px", label: "Pixel (px)", factor: 1 },
    { id: "pt", label: "Point (pt)", factor: 1.3333333333333333 },
    { id: "pc", label: "Pica (pc)", factor: 16 },
    { id: "em", label: "Em (em)", factor: 16 },
    { id: "rem", label: "Rem (rem)", factor: 16 },
  ],
  Resolution: [
    { id: "dpi", label: "Dots per inch (DPI)", factor: 1 },
    { id: "ppi", label: "Pixels per inch (PPI)", factor: 1 },
    { id: "ppcm", label: "Pixels per centimeter (PPCM)", factor: 2.54 },
  ],
  Currency: [
    { id: "usd", label: "US Dollar (USD)", factor: 1 },
    { id: "eur", label: "Euro (EUR)", factor: 1.08 },
    { id: "gbp", label: "British Pound (GBP)", factor: 1.25 },
    { id: "jpy", label: "Japanese Yen (JPY)", factor: 0.0066 },
    { id: "cad", label: "Canadian Dollar (CAD)", factor: 0.73 },
    { id: "aud", label: "Australian Dollar (AUD)", factor: 0.65 },
    { id: "inr", label: "Indian Rupee (INR)", factor: 0.012 },
    { id: "cny", label: "Chinese Yuan (CNY)", factor: 0.14 },
    { id: "pkr", label: "Pakistani Rupee (PKR)", factor: 0.0036 },
  ],
};

export const convertValue = (valStr: string, fUnit: string, tUnit: string, cat: Category): string => {
  if (!valStr || valStr.trim() === "" || valStr === "-" || valStr === "." || valStr === "-.") {
    return "";
  }
  const val = parseFloat(valStr);
  if (isNaN(val)) {
    return "";
  }
  
  let result = 0;
  if (cat === "Temperature") {
    let celsius = val;
    if (fUnit === "f") celsius = ((val - 32) * 5) / 9;
    else if (fUnit === "k") celsius = val - 273.15;
    if (tUnit === "c") result = celsius;
    else if (tUnit === "f") result = (celsius * 9) / 5 + 32;
    else if (tUnit === "k") result = celsius + 273.15;
  } else if (cat === "Fuel") {
    let kml = val;
    if (Math.abs(val) < 1e-12 && (fUnit === "l_100" || tUnit === "l_100")) return "0";
    
    if (fUnit === "l_100") kml = 100 / val;
    else if (fUnit === "mpg_us") kml = val / 2.35214583;
    else if (fUnit === "mpg_uk") kml = val / 2.824809363;
    
    if (tUnit === "km_l") result = kml;
    else if (tUnit === "l_100") result = kml === 0 ? 0 : 100 / kml;
    else if (tUnit === "mpg_us") result = kml * 2.35214583;
    else if (tUnit === "mpg_uk") result = kml * 2.824809363;
  } else {
    const uData = unitsData[cat];
    const fUnitDef = uData.find((u) => u.id === fUnit);
    const tUnitDef = uData.find((u) => u.id === tUnit);
    if (fUnitDef && tUnitDef && fUnitDef.factor !== undefined && tUnitDef.factor !== undefined && tUnitDef.factor !== 0) {
      const baseVal = val * fUnitDef.factor;
      result = baseVal / tUnitDef.factor;
    }
  }
  
  if (result === 0) return "0";
  if (Math.abs(result) < 0.000001 || Math.abs(result) > 10000000) {
    return result.toExponential(6).replace(/\.?0+e/, "e");
  }
  
  const fixedResult = parseFloat(result.toFixed(6));
  return fixedResult.toString();
};

export type GlobalUnit = 'm' | 'ft' | 'in' | 'cm' | 'mm' | 'yd';

const conversionRatesToMeters: Record<GlobalUnit, number> = {
  m: 1,
  ft: CIVIL_CONSTANTS.FT_TO_M,
  in: 0.0254,
  cm: 0.01,
  mm: CIVIL_CONSTANTS.MM_TO_M,
  yd: 0.9144
};

export function convertLength(value: number, fromUnit: string, toUnit: string): number {
  const from = (fromUnit as GlobalUnit) || 'm';
  const to = (toUnit as GlobalUnit) || 'm';
  if (from === to || !conversionRatesToMeters[from] || !conversionRatesToMeters[to]) return value;
  const valueInMeters = value * conversionRatesToMeters[from];
  return valueInMeters / conversionRatesToMeters[to];
}

export function convertArea(value: number, fromUnit: string, toUnit: string): number {
  const from = (fromUnit as GlobalUnit) || 'm';
  const to = (toUnit as GlobalUnit) || 'm';
  if (from === to || !conversionRatesToMeters[from] || !conversionRatesToMeters[to]) return value;
  const valueInSqMeters = value * Math.pow(conversionRatesToMeters[from], 2);
  return valueInSqMeters / Math.pow(conversionRatesToMeters[to], 2);
}

export function getAlternateUnit(unit: string): GlobalUnit | null {
  const u = unit.toLowerCase().trim() as GlobalUnit;
  switch (u) {
    case 'm': return 'ft';
    case 'ft': return 'm';
    case 'cm': return 'in';
    case 'in': return 'cm';
    case 'mm': return 'in';
    case 'yd': return 'm';
    default: return null;
  }
}

export function formatDualMeasurement(value: number, currentUnit: string, type: 'line' | 'area'): { primary: string, secondary: string | null } {
  const primaryStr = type === 'area' ? `${value.toFixed(2)} ${currentUnit}²` : `${value.toFixed(2)} ${currentUnit}`;
  
  const altUnit = getAlternateUnit(currentUnit);
  if (!altUnit) return { primary: primaryStr, secondary: null };

  if (type === 'line') {
    const altVal = convertLength(value, currentUnit, altUnit);
    return { primary: primaryStr, secondary: `${altVal.toFixed(2)} ${altUnit}` };
  } else {
    const altVal = convertArea(value, currentUnit, altUnit);
    return { primary: primaryStr, secondary: `${altVal.toFixed(2)} ${altUnit}²` };
  }
}

export function getDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function calculateLength(points: Point[], scalePxPerUnit: number) {
  if (points.length < 2) return 0;
  let len = 0;
  for (let i = 0; i < points.length - 1; i++) {
    len += getDistance(points[i], points[i + 1]);
  }
  return len / scalePxPerUnit;
}

export function calculateArea(points: Point[], scalePxPerUnit: number) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2) / (scalePxPerUnit * scalePxPerUnit);
}
