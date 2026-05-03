export type Point = { x: number; y: number };
export type MeasurementType = 'line' | 'area' | 'assembly';
export type Measurement = {
  id: string;
  type: MeasurementType;
  color: string;
  points: Point[];
  name: string;
  metadata?: any;
};

export type GlobalUnit = 'm' | 'ft' | 'in' | 'cm' | 'mm' | 'yd';

const conversionRatesToMeters: Record<GlobalUnit, number> = {
  m: 1,
  ft: 0.3048,
  in: 0.0254,
  cm: 0.01,
  mm: 0.001,
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
