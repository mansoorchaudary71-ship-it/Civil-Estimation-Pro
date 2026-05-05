import React, { useState } from "react";
import { Circle, Square, RectangleHorizontal, RectangleVertical, Triangle, PlaySquare, Component, Pill, Hexagon, Calculator } from "lucide-react";
import ShareButtonWithPopup from "./ShareMenu";

type Shape = "Circle" | "Square" | "Rectangle" | "Triangle" | "Trapezoid" | "Ellipse" | "RightTriangle" | "HorizontalCapsule" | "VerticalCapsule" | "Parallelogram" | "IrregularQuad";
type InputUnit = "mm" | "cm" | "m" | "inches" | "feet";
type OutputUnit = "sqm" | "sqft" | "acres" | "hectares";

export default function AreaCalculator() {
  const [activeShape, setActiveShape] = useState<Shape>("Rectangle");
  const [inputUnit, setInputUnit] = useState<InputUnit>("m");
  const [outputUnit, setOutputUnit] = useState<OutputUnit>("sqm");

  // Inputs
  const [radius, setRadius] = useState("");
  const [side, setSide] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  // Triangle (base, height, side2, side3)
  const [triBase, setTriBase] = useState("");
  const [triHeight, setTriHeight] = useState("");
  const [triSide2, setTriSide2] = useState("");
  const [triSide3, setTriSide3] = useState("");
  // Trapezoid (base1, base2, height, side1, side2)
  const [trapBase1, setTrapBase1] = useState("");
  const [trapBase2, setTrapBase2] = useState("");
  const [trapHeight, setTrapHeight] = useState("");
  const [trapSide1, setTrapSide1] = useState("");
  const [trapSide2, setTrapSide2] = useState("");
  // Ellipse (semi-major, semi-minor)
  const [ellMajor, setEllMajor] = useState("");
  const [ellMinor, setEllMinor] = useState("");
  // Right Triangle
  const [rtBase, setRtBase] = useState("");
  const [rtHeight, setRtHeight] = useState("");
  // Capsule
  const [capLength, setCapLength] = useState(""); // straight part
  const [capRadius, setCapRadius] = useState("");
  // Vertical Capsule
  const [vCapLength, setVCapLength] = useState("");
  const [vCapRadius, setVCapRadius] = useState("");
  // Parallelogram
  const [paraBase, setParaBase] = useState("");
  const [paraSide, setParaSide] = useState("");
  const [paraHeight, setParaHeight] = useState("");
  // Irregular Quadrilateral
  const [quadA, setQuadA] = useState("");
  const [quadB, setQuadB] = useState("");
  const [quadC, setQuadC] = useState("");
  const [quadD, setQuadD] = useState("");
  const [quadDiag, setQuadDiag] = useState("");

  const shapes: { id: Shape; label: string; icon: any; color: string }[] = [
    { id: "Circle", label: "Circle", icon: Circle, color: "text-rose-500 bg-rose-100 dark:bg-rose-500/20" },
    { id: "Square", label: "Square", icon: Square, color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20" },
    { id: "Rectangle", label: "Rectangle", icon: RectangleHorizontal, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20" },
    { id: "Triangle", label: "Triangle", icon: Triangle, color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20" },
    { id: "Trapezoid", label: "Trapezoid", icon: PlaySquare, color: "text-violet-500 bg-violet-100 dark:bg-violet-500/20" }, // Approximation
    { id: "Ellipse", label: "Ellipse", icon: Circle, color: "text-pink-500 bg-pink-100 dark:bg-pink-500/20" }, // Approximation
    { id: "RightTriangle", label: "Shape 1", icon: Triangle, color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20" },
    { id: "HorizontalCapsule", label: "Shape 2", icon: Pill, color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20" },
    { id: "VerticalCapsule", label: "Shape 3", icon: RectangleVertical, color: "text-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-500/20" },
    { id: "Parallelogram", label: "Shape 4", icon: Component, color: "text-lime-500 bg-lime-100 dark:bg-lime-500/20" },
    { id: "IrregularQuad", label: "Shape 5", icon: Hexagon, color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20" },
  ];

  // Convert input value built in input unit to meters
  const toMeters = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num)) return 0;
    switch (inputUnit) {
      case "mm": return num / 1000;
      case "cm": return num / 100;
      case "inches": return num * 0.0254;
      case "feet": return num * 0.3048;
      case "m": default: return num;
    }
  };

  // Convert area in sq. meters to target output unit
  const formatArea = (areaSqM: number) => {
    switch (outputUnit) {
      case "sqft": return (areaSqM * 10.7639).toFixed(2) + " sq.ft";
      case "acres": return (areaSqM * 0.000247105).toFixed(4) + " acres";
      case "hectares": return (areaSqM * 0.0001).toFixed(4) + " hectares";
      case "sqm": default: return areaSqM.toFixed(2) + " m²";
    }
  };

  // Convert perimeter in meters to input unit (usually perimeter is shown in same unit as input, or user might want something else, let's keep it in input unit or meters)
  const formatPerimeter = (perimMeters: number) => {
    switch (inputUnit) {
      case "mm": return (perimMeters * 1000).toFixed(2) + " mm";
      case "cm": return (perimMeters * 100).toFixed(2) + " cm";
      case "inches": return (perimMeters / 0.0254).toFixed(2) + " inches";
      case "feet": return (perimMeters / 0.3048).toFixed(2) + " feet";
      case "m": default: return perimMeters.toFixed(2) + " m";
    }
  };

  let calcAreaSqM = 0;
  let calcPerimeterM = 0;
  let inputSummary: Record<string, string> = {};

  if (activeShape === "Circle") {
    const r = toMeters(radius);
    calcAreaSqM = Math.PI * r * r;
    calcPerimeterM = 2 * Math.PI * r;
    inputSummary = { "Radius": `${radius} ${inputUnit}` };
  } else if (activeShape === "Square") {
    const s = toMeters(side);
    calcAreaSqM = s * s;
    calcPerimeterM = 4 * s;
    inputSummary = { "Side": `${side} ${inputUnit}` };
  } else if (activeShape === "Rectangle") {
    const l = toMeters(length);
    const w = toMeters(width);
    calcAreaSqM = l * w;
    calcPerimeterM = 2 * (l + w);
    inputSummary = { "Length": `${length} ${inputUnit}`, "Width": `${width} ${inputUnit}` };
  } else if (activeShape === "Triangle") {
    const b = toMeters(triBase);
    const h = toMeters(triHeight);
    const s2 = toMeters(triSide2);
    const s3 = toMeters(triSide3);
    calcAreaSqM = 0.5 * b * h;
    calcPerimeterM = b + s2 + s3;
    inputSummary = { "Base": `${triBase} ${inputUnit}`, "Height": `${triHeight} ${inputUnit}`, "Side 2": `${triSide2} ${inputUnit}`, "Side 3": `${triSide3} ${inputUnit}` };
  } else if (activeShape === "Trapezoid") {
    const b1 = toMeters(trapBase1);
    const b2 = toMeters(trapBase2);
    const h = toMeters(trapHeight);
    const s1 = toMeters(trapSide1);
    const s2 = toMeters(trapSide2);
    calcAreaSqM = 0.5 * (b1 + b2) * h;
    calcPerimeterM = b1 + b2 + s1 + s2;
    inputSummary = { "Base 1": `${trapBase1} ${inputUnit}`, "Base 2": `${trapBase2} ${inputUnit}`, "Height": `${trapHeight} ${inputUnit}`, "Leg 1": `${trapSide1} ${inputUnit}`, "Leg 2": `${trapSide2} ${inputUnit}` };
  } else if (activeShape === "Ellipse") {
    const a = toMeters(ellMajor);
    const b = toMeters(ellMinor);
    calcAreaSqM = Math.PI * a * b;
    // Ramanujan's approximation for ellipse perimeter
    calcPerimeterM = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    inputSummary = { "Semi-major Axis (a)": `${ellMajor} ${inputUnit}`, "Semi-minor Axis (b)": `${ellMinor} ${inputUnit}` };
  } else if (activeShape === "RightTriangle") {
    const b = toMeters(rtBase);
    const h = toMeters(rtHeight);
    calcAreaSqM = 0.5 * b * h;
    calcPerimeterM = b + h + Math.sqrt(b * b + h * h);
    inputSummary = { "Base": `${rtBase} ${inputUnit}`, "Height": `${rtHeight} ${inputUnit}` };
  } else if (activeShape === "HorizontalCapsule") {
    const l = toMeters(capLength);
    const r = toMeters(capRadius);
    calcAreaSqM = (l * 2 * r) + (Math.PI * r * r);
    calcPerimeterM = (2 * l) + (2 * Math.PI * r);
    inputSummary = { "Straight Length": `${capLength} ${inputUnit}`, "Radius": `${capRadius} ${inputUnit}` };
  } else if (activeShape === "VerticalCapsule") {
    const l = toMeters(vCapLength);
    const r = toMeters(vCapRadius);
    calcAreaSqM = (l * 2 * r) + (Math.PI * r * r);
    calcPerimeterM = (2 * l) + (2 * Math.PI * r);
    inputSummary = { "Straight Length": `${vCapLength} ${inputUnit}`, "Radius": `${vCapRadius} ${inputUnit}` };
  } else if (activeShape === "Parallelogram") {
    const b = toMeters(paraBase);
    const h = toMeters(paraHeight);
    const s = toMeters(paraSide);
    calcAreaSqM = b * h;
    calcPerimeterM = 2 * (b + s);
    inputSummary = { "Base": `${paraBase} ${inputUnit}`, "Height": `${paraHeight} ${inputUnit}`, "Side": `${paraSide} ${inputUnit}` };
  } else if (activeShape === "IrregularQuad") {
    const a = toMeters(quadA);
    const b = toMeters(quadB);
    const c = toMeters(quadC);
    const d = toMeters(quadD);
    const diag = toMeters(quadDiag);
    
    // Area via two triangles using Heron's formula
    const s1 = (a + b + diag) / 2;
    const area1 = Math.sqrt(Math.max(0, s1 * (s1 - a) * (s1 - b) * (s1 - diag)));
    
    const s2 = (c + d + diag) / 2;
    const area2 = Math.sqrt(Math.max(0, s2 * (s2 - c) * (s2 - d) * (s2 - diag)));
    
    calcAreaSqM = area1 + area2;
    calcPerimeterM = a + b + c + d;
    inputSummary = { "Side A": `${quadA} ${inputUnit}`, "Side B": `${quadB} ${inputUnit}`, "Side C": `${quadC} ${inputUnit}`, "Side D": `${quadD} ${inputUnit}`, "Diagonal": `${quadDiag} ${inputUnit}` };
  }

  const exportData = {
    "Shape": activeShape,
    "Calculated Area": formatArea(calcAreaSqM),
    "Calculated Perimeter": formatPerimeter(calcPerimeterM)
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-indigo-500" />
          Area Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Calculate area and perimeter for any 2D shape with unit conversions.</p>

        {/* Global Settings */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Input Unit</label>
             <select value={inputUnit} onChange={e => setInputUnit(e.target.value as InputUnit)} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-xl text-sm font-medium">
               <option value="mm">Millimeters (mm)</option>
               <option value="cm">Centimeters (cm)</option>
               <option value="m">Meters (m)</option>
               <option value="inches">Inches (in)</option>
               <option value="feet">Feet (ft)</option>
             </select>
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Area Output Unit</label>
             <select value={outputUnit} onChange={e => setOutputUnit(e.target.value as OutputUnit)} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-xl text-sm font-medium">
               <option value="sqm">Square Meters (m²)</option>
               <option value="sqft">Square Feet (sq.ft)</option>
               <option value="acres">Acres</option>
               <option value="hectares">Hectares</option>
             </select>
          </div>
        </div>

        {/* Shapes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {shapes.map((s) => {
            const Icon = s.icon;
            const isActive = activeShape === s.id;
            const baseColor = s.color.split('-')[1];
            
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
                key={s.id}
                onClick={() => setActiveShape(s.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-[20px] border-2 transition-all duration-300 overflow-hidden group ${outerClass}`}
              >
                {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none" />}
                <div className={`p-3 rounded-2xl relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${innerClass}`}>
                  <Icon className="w-8 h-8 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                  {!isActive && <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: baseColor === 'lime' ? '#84cc16' : baseColor === 'cyan' ? '#06b6d4' : baseColor === 'emerald' ? '#10b981' : baseColor === 'amber' ? '#f59e0b' : baseColor === 'fuchsia' ? '#d946ef' : baseColor === 'rose' ? '#f43f5e' : baseColor === 'pink' ? '#ec4899' : baseColor === 'orange' ? '#f97316' : baseColor === 'violet' ? '#8b5cf6' : '#3b82f6' }} />}
                </div>
                <span className={`text-[11px] font-extrabold text-center leading-tight tracking-wide z-10 ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{s.label}</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-6">{activeShape} Measurements</h3>
            <div className="space-y-4">
              {activeShape === "Circle" && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Radius ({inputUnit})</label>
                  <input type="number" value={radius} onChange={e => setRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
              {activeShape === "Square" && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Side length ({inputUnit})</label>
                  <input type="number" value={side} onChange={e => setSide(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
              {activeShape === "Rectangle" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Length ({inputUnit})</label>
                    <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Width ({inputUnit})</label>
                    <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </>
              )}
              {activeShape === "Triangle" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Base ({inputUnit})</label>
                      <input type="number" value={triBase} onChange={e => setTriBase(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Height ({inputUnit})</label>
                      <input type="number" value={triHeight} onChange={e => setTriHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side 2 ({inputUnit})</label>
                      <input type="number" value={triSide2} onChange={e => setTriSide2(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side 3 ({inputUnit})</label>
                      <input type="number" value={triSide3} onChange={e => setTriSide3(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </>
              )}
              {activeShape === "Trapezoid" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Parallel Base 1 ({inputUnit})</label>
                      <input type="number" value={trapBase1} onChange={e => setTrapBase1(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Parallel Base 2 ({inputUnit})</label>
                      <input type="number" value={trapBase2} onChange={e => setTrapBase2(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height ({inputUnit})</label>
                    <input type="number" value={trapHeight} onChange={e => setTrapHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Leg 1 ({inputUnit})</label>
                      <input type="number" value={trapSide1} onChange={e => setTrapSide1(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Leg 2 ({inputUnit})</label>
                      <input type="number" value={trapSide2} onChange={e => setTrapSide2(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </>
              )}
              {activeShape === "Ellipse" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Semi-major Axis (a) ({inputUnit})</label>
                    <input type="number" value={ellMajor} onChange={e => setEllMajor(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Semi-minor Axis (b) ({inputUnit})</label>
                    <input type="number" value={ellMinor} onChange={e => setEllMinor(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </>
              )}
              {activeShape === "RightTriangle" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Base ({inputUnit})</label>
                    <input type="number" value={rtBase} onChange={e => setRtBase(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height ({inputUnit})</label>
                    <input type="number" value={rtHeight} onChange={e => setRtHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              )}
              {activeShape === "HorizontalCapsule" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Straight Length ({inputUnit})</label>
                    <input type="number" value={capLength} onChange={e => setCapLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Radius ({inputUnit})</label>
                    <input type="number" value={capRadius} onChange={e => setCapRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              )}
              {activeShape === "VerticalCapsule" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Straight Length ({inputUnit})</label>
                    <input type="number" value={vCapLength} onChange={e => setVCapLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Radius ({inputUnit})</label>
                    <input type="number" value={vCapRadius} onChange={e => setVCapRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              )}
              {activeShape === "Parallelogram" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Base ({inputUnit})</label>
                      <input type="number" value={paraBase} onChange={e => setParaBase(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side ({inputUnit})</label>
                      <input type="number" value={paraSide} onChange={e => setParaSide(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Vertical Height ({inputUnit})</label>
                    <input type="number" value={paraHeight} onChange={e => setParaHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </>
              )}
              {activeShape === "IrregularQuad" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side A ({inputUnit})</label>
                      <input type="number" value={quadA} onChange={e => setQuadA(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side B ({inputUnit})</label>
                      <input type="number" value={quadB} onChange={e => setQuadB(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side C ({inputUnit})</label>
                      <input type="number" value={quadC} onChange={e => setQuadC(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Side D ({inputUnit})</label>
                      <input type="number" value={quadD} onChange={e => setQuadD(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Diagonal (A to C) ({inputUnit})</label>
                    <input type="number" value={quadDiag} onChange={e => setQuadDiag(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 lg:p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest mb-6">Real-Time Calculation</h3>
               
               <div className="space-y-6">
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Total Area</span>
                    <span className="text-3xl font-black text-indigo-400">{formatArea(calcAreaSqM)}</span>
                 </div>
                 
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Perimeter / Circumference</span>
                    <span className="text-3xl font-black text-teal-400">{formatPerimeter(calcPerimeterM)}</span>
                 </div>
               </div>
            </div>

            <div className="mt-8">
               <ShareButtonWithPopup 
                 activeTab="Area Calculator" 
                 title={`${activeShape} Area Calculation`}
                 data={exportData}
                 exportFormat={{
                    inputs: inputSummary,
                    breakdown: exportData
                 }}
               />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
