import React, { useState, useMemo } from "react";
import { Box, Cylinder, Database, Cuboid, Cone, Triangle, Square, Circle, Calculator, Droplets, Maximize, Share2, Container, Hexagon , Save } from "lucide-react";
import ShareButtonWithPopup from "./ShareMenu";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";

type Shape = "Rectangular Prism" | "Cube" | "Cylinder" | "Sphere" | "Half Sphere" | "Cone" | "Frustum Cone" | "Parabolic Cone" | "Triangular Dumper" | "Trapezoidal Dumper" | "Rectangle Tank" | "Prism";
type System = "Metric" | "Imperial";

import { useGlobalSettings } from "../../context/SettingsContext";

export default function VolumeEstimator() {
  const { user } = useAuth();
  const { currentUnit, setCurrentUnit } = useGlobalSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [activeShape, setActiveShape] = useState<Shape>("Rectangular Prism");
  const system = currentUnit;


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
              <button onClick={() => setCurrentUnit("Metric")} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${system === "Metric" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>Metric (m)</button>
              <button onClick={() => setCurrentUnit("Imperial")} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${system === "Imperial" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>Imperial (ft)</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {shapes.map((s) => {
            const Icon = s.icon;
            const isActive = activeShape === s.id;
            const baseColor = s.color.split('-')[1];
            
            return (
              <button
                key={s.id}
                onClick={() => setActiveShape(s.id)}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] transition-all duration-200 overflow-hidden group hover:border-[color:var(--theme-color)] hover:bg-[color:var(--theme-bg-light)] ${isActive ? 'shadow-sm' : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                style={{
                  '--theme-color': `var(--color-${baseColor}-500)`,
                  '--theme-color-hover': `var(--color-${baseColor}-600)`,
                  '--theme-bg': `color-mix(in srgb, var(--color-${baseColor}-500) 10%, transparent)`,
                  '--theme-bg-light': `color-mix(in srgb, var(--color-${baseColor}-500) 5%, transparent)`,
                  borderColor: isActive ? 'var(--theme-color)' : undefined,
                  borderWidth: isActive ? '2px' : undefined,
                  borderStyle: isActive ? 'solid' : undefined,
                  backgroundColor: isActive ? 'var(--theme-bg-light)' : undefined
                } as React.CSSProperties}
              >
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: 'var(--theme-bg)',
                    color: 'var(--theme-color)',
                    filter: isActive ? 'drop-shadow(0 0 20px color-mix(in srgb, var(--theme-color) 25%, transparent))' : undefined
                  }}
                >
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className={`text-[11px] font-extrabold text-center leading-tight tracking-wide ${isActive ? '' : 'text-slate-600 dark:text-slate-400 group-hover:[color:var(--theme-color-hover)]'}`} style={{ color: isActive ? 'var(--theme-color-hover)' : undefined }}>{s.label}</span>
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

            
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <ShareButtonWithPopup 
                 activeTab="Volume Estimator" 
                 title={`${activeShape} Volume BOQ`}
                 data={exportData}
                 exportFormat={{
                    inputs: inputs,
                    breakdown: exportData
                 }}
               />
            {user && (
              <button 
                onClick={async () => {
                  setIsSaving(true);
                  setSaveMessage("");
                  try {
                    const payload = {
                    inputs: inputs,
                    breakdown: exportData
                 };
                    const projName = prompt("Enter project element/estimate name:", "My VolumeEstimator Estimate");
                    if (projName) {
                      await saveEstimate(projName, payload);
                      setSaveMessage("Saved successfully!");
                      setTimeout(() => setSaveMessage(""), 3000);
                    }
                  } catch (e) {
                    setSaveMessage("Failed to save.");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="bg-green-600/20 text-green-400 hover:bg-green-600/30 px-6 py-4 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save to Profile
                  </>
                )}
              </button>
            )}
            {saveMessage && <span className="text-sm font-bold text-green-400 ml-4">{saveMessage}</span>}
          </div>

          </div>
        </div>

      </div>
    </div>
  );
}
