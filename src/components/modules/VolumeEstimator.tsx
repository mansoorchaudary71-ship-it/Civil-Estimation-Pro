import React, { useState, useMemo } from "react";
import { Box, Cylinder, Database, Cuboid, Cone, Triangle, Square, Circle, Calculator, Droplets, Maximize, Share2, Container, Hexagon } from "lucide-react";
import ShareButtonWithPopup from "./ShareMenu";

type Shape = "Rectangular Prism" | "Cube" | "Cylinder" | "Sphere" | "Half Sphere" | "Cone" | "Frustum Cone" | "Parabolic Cone" | "Triangular Dumper" | "Trapezoidal Dumper" | "Rectangle Tank" | "Prism";
type System = "Metric" | "Imperial";

export default function VolumeEstimator() {
  const [activeShape, setActiveShape] = useState<Shape>("Rectangular Prism");
  const [system, setSystem] = useState<System>("Metric");

  // Input states
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [side, setSide] = useState("");
  const [radius, setRadius] = useState("");
  const [topRadius, setTopRadius] = useState("");
  const [bottomRadius, setBottomRadius] = useState("");
  const [base, setBase] = useState("");
  const [topWidth, setTopWidth] = useState("");
  const [bottomWidth, setBottomWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [baseArea, setBaseArea] = useState("");
  const [basePerimeter, setBasePerimeter] = useState("");

  const shapes: { id: Shape; label: string; icon: any; color: string }[] = [
    { id: "Rectangular Prism", label: "Rect Prism", icon: Cuboid, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20" },
    { id: "Cube", label: "Cube", icon: Box, color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20" },
    { id: "Cylinder", label: "Cylinder", icon: Cylinder, color: "text-purple-500 bg-purple-100 dark:bg-purple-500/20" },
    { id: "Sphere", label: "Sphere", icon: Circle, color: "text-rose-500 bg-rose-100 dark:bg-rose-500/20" },
    { id: "Half Sphere", label: "Half Sphere", icon: Circle, color: "text-pink-500 bg-pink-100 dark:bg-pink-500/20" },
    { id: "Cone", label: "Cone", icon: Cone, color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20" },
    { id: "Frustum Cone", label: "Frustum Cone", icon: Database, color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20" },
    { id: "Parabolic Cone", label: "Parabolic Cone", icon: Cone, color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20" },
    { id: "Triangular Dumper", label: "Tri Dumper", icon: Triangle, color: "text-teal-500 bg-teal-100 dark:bg-teal-500/20" },
    { id: "Trapezoidal Dumper", label: "Trap Dumper", icon: Square, color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20" },
    { id: "Rectangle Tank", label: "Rect Tank", icon: Container, color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20" },
    { id: "Prism", label: "Prism", icon: Hexagon, color: "text-lime-500 bg-lime-100 dark:bg-lime-500/20" },
  ];

  const calculate = () => {
    let volume = 0;
    let surfaceArea = 0;
    let inputs: Record<string, string> = {};

    const parse = (val: string) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const l = parse(length);
    const w = parse(width);
    const h = parse(height);
    const s = parse(side);
    const r = parse(radius);
    const tr = parse(topRadius);
    const br = parse(bottomRadius);
    const b = parse(base);
    const tw = parse(topWidth);
    const bw = parse(bottomWidth);
    const d = parse(depth);
    const ba = parse(baseArea);
    const bp = parse(basePerimeter);
    const unit = system === "Metric" ? "m" : "ft";
    const sqUnit = system === "Metric" ? "m²" : "sq.ft";

    if (activeShape === "Rectangular Prism") {
      volume = l * w * h;
      surfaceArea = 2 * (l * w + l * h + w * h);
      inputs = { Length: `${l} ${unit}`, Width: `${w} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Cube") {
      volume = s * s * s;
      surfaceArea = 6 * s * s;
      inputs = { Side: `${s} ${unit}` };
    } else if (activeShape === "Cylinder") {
      volume = Math.PI * r * r * h;
      surfaceArea = 2 * Math.PI * r * h + 2 * Math.PI * r * r;
      inputs = { Radius: `${r} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Sphere") {
      volume = (4 / 3) * Math.PI * Math.pow(r, 3);
      surfaceArea = 4 * Math.PI * r * r;
      inputs = { Radius: `${r} ${unit}` };
    } else if (activeShape === "Half Sphere") {
      volume = (2 / 3) * Math.PI * Math.pow(r, 3);
      surfaceArea = 3 * Math.PI * r * r; // Base + curved
      inputs = { Radius: `${r} ${unit}` };
    } else if (activeShape === "Cone") {
      volume = (1 / 3) * Math.PI * r * r * h;
      const slant = Math.sqrt(r * r + h * h);
      surfaceArea = Math.PI * r * slant + Math.PI * r * r;
      inputs = { Radius: `${r} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Frustum Cone") {
      volume = (1 / 3) * Math.PI * h * (tr * tr + tr * br + br * br);
      const slant = Math.sqrt(Math.pow(tr - br, 2) + h * h);
      surfaceArea = Math.PI * (tr + br) * slant + Math.PI * tr * tr + Math.PI * br * br;
      inputs = { "Top Radius": `${tr} ${unit}`, "Bottom Radius": `${br} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Parabolic Cone") {
      volume = 0.5 * Math.PI * r * r * h;
      // Approximate surface area formula
      surfaceArea = (Math.PI * r / (6 * h * h || 1)) * (Math.pow(r * r + 4 * h * h, 1.5) - Math.pow(r, 3));
      inputs = { Radius: `${r} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Triangular Dumper") {
      // Isosceles prism
      volume = 0.5 * b * h * l;
      const slant = Math.sqrt(Math.pow(b / 2, 2) + h * h);
      surfaceArea = b * h + l * b + 2 * l * slant;
      inputs = { Base: `${b} ${unit}`, Height: `${h} ${unit}`, Length: `${l} ${unit}` };
    } else if (activeShape === "Trapezoidal Dumper") {
      // Isosceles trapezoidal prism
      volume = 0.5 * (tw + bw) * d * l;
      const slant = Math.sqrt(Math.pow((tw - bw) / 2, 2) + d * d);
      surfaceArea = (tw + bw) * d + l * tw + l * bw + 2 * l * slant;
      inputs = { "Top Width": `${tw} ${unit}`, "Bottom Width": `${bw} ${unit}`, Depth: `${d} ${unit}`, Length: `${l} ${unit}` };
    } else if (activeShape === "Rectangle Tank") {
      volume = l * w * h;
      surfaceArea = 2 * (l * w + l * h + w * h);
      inputs = { Length: `${l} ${unit}`, Width: `${w} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Prism") {
      volume = ba * h;
      surfaceArea = 2 * ba + bp * h;
      inputs = { "Base Area": `${ba} ${sqUnit}`, "Base Perimeter": `${bp} ${unit}`, Height: `${h} ${unit}` };
    }

    return { volume, surfaceArea, inputs };
  };

  const { volume, surfaceArea, inputs } = useMemo(calculate, [activeShape, system, length, width, height, side, radius, topRadius, bottomRadius, base, topWidth, bottomWidth, depth, baseArea, basePerimeter]);

  let liquidCapacity = 0;
  let capacityUnit = "";
  if (system === "Metric") {
    // 1 m3 = 1000 Liters
    liquidCapacity = volume * 1000;
    capacityUnit = "Liters";
  } else {
    // 1 ft3 = 7.48052 Gallons
    liquidCapacity = volume * 7.48052;
    capacityUnit = "Gallons";
  }

  const volUnit = system === "Metric" ? "m³" : "cu.ft";
  const areaUnit = system === "Metric" ? "m²" : "sq.ft";

  const exportData = {
    Shape: activeShape,
    "Volume": `${volume.toFixed(2)} ${volUnit}`,
    "Surface Area": `${surfaceArea.toFixed(2)} ${areaUnit}`,
    "Liquid Capacity": `${liquidCapacity.toFixed(2)} ${capacityUnit}`
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-500" />
          Volume Estimator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Calculate total volume, surface area, and liquid capacity of civil engineering shapes.</p>

        {/* Global Settings */}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Measurement System</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
              <button onClick={() => setSystem("Metric")} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${system === "Metric" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>Metric (m)</button>
              <button onClick={() => setSystem("Imperial")} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${system === "Imperial" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>Imperial (ft)</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {shapes.map((s) => {
            const Icon = s.icon;
            const isActive = activeShape === s.id;
            const baseColor = s.color.split('-')[1];
            
            // Build safe styles instead of dynamic strings
            const outerColorMap: Record<string, string> = {
              emerald: isActive 
                ? "bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-500 text-white shadow-xl shadow-emerald-500/40 -translate-y-1 scale-105 z-10" 
                : "bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900 text-slate-700 dark:text-slate-200 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20",
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
                  {!isActive && <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: baseColor === 'lime' ? '#84cc16' : baseColor === 'cyan' ? '#06b6d4' : baseColor === 'emerald' ? '#10b981' : '#3b82f6' }} />}
                </div>
                <span className={`text-[11px] font-extrabold text-center leading-tight tracking-wide z-10 ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{s.label}</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                 {(() => {
                    const ShapeIcon = shapes.find(s => s.id === activeShape)?.icon || Box;
                    return <ShapeIcon className="w-6 h-6" />;
                 })()}
               </div>
               <h3 className="font-bold text-xl">{activeShape} Parameters</h3>
            </div>
            
            <div className="space-y-4">
              {activeShape === "Rectangular Prism" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Length ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Width ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {activeShape === "Cube" && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Side Length ({system === "Metric" ? "m" : "ft"})</label>
                  <input type="number" value={side} onChange={e => setSide(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {["Cylinder", "Cone", "Parabolic Cone"].includes(activeShape) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Radius ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={radius} onChange={e => setRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {["Sphere", "Half Sphere"].includes(activeShape) && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Radius ({system === "Metric" ? "m" : "ft"})</label>
                  <input type="number" value={radius} onChange={e => setRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {activeShape === "Frustum Cone" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Top Radius ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={topRadius} onChange={e => setTopRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Bottom Radius ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={bottomRadius} onChange={e => setBottomRadius(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {activeShape === "Triangular Dumper" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Base Width ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={base} onChange={e => setBase(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Vertical / Triangle Height ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Length ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {activeShape === "Trapezoidal Dumper" && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Top Width ({system === "Metric" ? "m" : "ft"})</label>
                       <input type="number" value={topWidth} onChange={e => setTopWidth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Bottom Width ({system === "Metric" ? "m" : "ft"})</label>
                       <input type="number" value={bottomWidth} onChange={e => setBottomWidth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Depth / Height ({system === "Metric" ? "m" : "ft"})</label>
                       <input type="number" value={depth} onChange={e => setDepth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Length ({system === "Metric" ? "m" : "ft"})</label>
                       <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                     </div>
                  </div>
                </div>
              )}

              {activeShape === "Rectangle Tank" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Length ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Width ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height/Depth ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {activeShape === "Prism" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Base Area ({system === "Metric" ? "m²" : "sq.ft"})</label>
                    <input type="number" value={baseArea} onChange={e => setBaseArea(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Base Perimeter ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={basePerimeter} onChange={e => setBasePerimeter(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Height ({system === "Metric" ? "m" : "ft"})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-white shadow-xl flex flex-col justify-between items-center text-center">
            <div className="w-full text-left mb-6">
              <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">Calculated Results</h3>
            </div>
            
            <div className="w-full space-y-4 mb-8">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                <Maximize className="w-6 h-6 text-blue-400 mb-2" />
                <span className="block text-slate-400 text-[11px] font-bold uppercase mb-1">Total Volume</span>
                <span className="text-4xl font-black text-white">{volume.toFixed(2)} <span className="text-xl text-blue-300">{volUnit}</span></span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Surface Area</span>
                  <span className="text-xl font-bold text-emerald-400">{surfaceArea.toFixed(2)} <span className="text-sm">{areaUnit}</span></span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Liquid Capacity</span>
                  <span className="text-xl font-bold text-cyan-400">{liquidCapacity.toFixed(2)} <span className="text-sm">{capacityUnit}</span></span>
                </div>
              </div>
            </div>

            <div className="w-full mt-auto">
               <ShareButtonWithPopup 
                 activeTab="Volume Estimator" 
                 title={`${activeShape} Volume BOQ`}
                 data={exportData}
                 exportFormat={{
                    inputs: inputs,
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
