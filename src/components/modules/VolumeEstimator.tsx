import React, { useState, useMemo } from "react";
import {
  Box,
  Cylinder,
  Database,
  Cuboid,
  Cone,
  Triangle,
  Square,
  Circle,
  Calculator,
  Droplets,
  Maximize,
  Share2,
  Container,
  Hexagon,
  Save,
} from "lucide-react";

import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { SVGShapeVisualizer } from "./ShapeVisualizer";
type Shape =
  | "Rectangular Prism"
  | "Cube"
  | "Cylinder"
  | "Sphere"
  | "Half Sphere"
  | "Cone"
  | "Frustum Cone"
  | "Parabolic Cone"
  | "Triangular Dumper"
  | "Trapezoidal Dumper"
  | "Rectangle Tank"
  | "Prism";
type System = "Metric" | "Imperial";
import { useGlobalSettings } from "../../context/SettingsContext";
import ColorfulTab from "../ui/ColorfulTab";
export default function VolumeEstimator() {
  const { user } = useAuth();
  const { currentUnit, setCurrentUnit } = useGlobalSettings();
  
  
  const [activeShape, setActiveShape] = useState<Shape>("Rectangular Prism");
  const system = currentUnit;
  /* Input states */ const [length, setLength] = useState("");
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
    {
      id: "Rectangular Prism",
      label: "Rect Prism",
      icon: Cuboid,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      id: "Cube",
      label: "Cube",
      icon: Box,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20",
    },
    {
      id: "Cylinder",
      label: "Cylinder",
      icon: Cylinder,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-500/20",
    },
    {
      id: "Sphere",
      label: "Sphere",
      icon: Circle,
      color: "text-rose-500 bg-rose-100 dark:bg-rose-500/20",
    },
    {
      id: "Half Sphere",
      label: "Half Sphere",
      icon: Circle,
      color: "text-pink-500 bg-pink-100 dark:bg-pink-500/20",
    },
    {
      id: "Cone",
      label: "Cone",
      icon: Cone,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20",
    },
    {
      id: "Frustum Cone",
      label: "Frustum Cone",
      icon: Database,
      color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20",
    },
    {
      id: "Parabolic Cone",
      label: "Parabolic Cone",
      icon: Cone,
      color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20",
    },
    {
      id: "Triangular Dumper",
      label: "Tri Dumper",
      icon: Triangle,
      color: "text-teal-500 bg-teal-100 dark:bg-teal-500/20",
    },
    {
      id: "Trapezoidal Dumper",
      label: "Trap Dumper",
      icon: Square,
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20",
    },
    {
      id: "Rectangle Tank",
      label: "Rect Tank",
      icon: Container,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20",
    },
    {
      id: "Prism",
      label: "Prism",
      icon: Hexagon,
      color: "text-lime-500 bg-lime-100 dark:bg-lime-500/20",
    },
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
    
    let explanationOpts: any = {
      hasInputs: false,
      genericFormula: [],
      activeBreakdown: [],
      notes: [
        system === "Metric" ? "1 cubic meter = 1000 Litres" : "1 cubic foot = 7.48 Gallons"
      ]
    };

    if (activeShape === "Rectangular Prism") {
      volume = l * w * h;
      surfaceArea = 2 * (l * w + l * h + w * h);
      inputs = {
        Length: `${l} ${unit}`,
        Width: `${w} ${unit}`,
        Height: `${h} ${unit}`,
      };
      explanationOpts.genericFormula = [
        { label: "Volume", formula: "Length × Width × Height" },
        { label: "Surface Area", formula: "2 × (Length×Width + Length×Height + Width×Height)" }
      ];
      if (l || w || h) {
        explanationOpts.hasInputs = true;
        explanationOpts.activeBreakdown = [
          { label: "Volume", formula: `${l} × ${w} × ${h}`, result: `${volume.toFixed(2)} ${unit}³` },
        ];
      }
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
      surfaceArea = 3 * Math.PI * r * r;
      /* Base + curved */ inputs = { Radius: `${r} ${unit}` };
    } else if (activeShape === "Cone") {
      volume = (1 / 3) * Math.PI * r * r * h;
      const slant = Math.sqrt(r * r + h * h);
      surfaceArea = Math.PI * r * slant + Math.PI * r * r;
      inputs = { Radius: `${r} ${unit}`, Height: `${h} ${unit}` };
    } else if (activeShape === "Frustum Cone") {
      volume = (1 / 3) * Math.PI * h * (tr * tr + tr * br + br * br);
      const slant = Math.sqrt(Math.pow(tr - br, 2) + h * h);
      surfaceArea =
        Math.PI * (tr + br) * slant + Math.PI * tr * tr + Math.PI * br * br;
      inputs = {
        "Top Radius": `${tr} ${unit}`,
        "Bottom Radius": `${br} ${unit}`,
        Height: `${h} ${unit}`,
      };
    } else if (activeShape === "Parabolic Cone") {
      volume = 0.5 * Math.PI * r * r * h;
      /* Approximate surface area formula surfaceArea = (Math.PI * r / (6 * h * h || 1)) * (Math.pow(r * r + 4 * h * h, 1.5) - Math.pow(r, 3)); inputs = { Radius: `${r} ${unit}`, Height: `${h} ${unit}` }; } else if (activeShape === "Triangular Dumper") { /* Isosceles prism volume = 0.5 * b * h * l; */ const slant =
        Math.sqrt(Math.pow(b / 2, 2) + h * h);
      surfaceArea = b * h + l * b + 2 * l * slant;
      inputs = {
        Base: `${b} ${unit}`,
        Height: `${h} ${unit}`,
        Length: `${l} ${unit}`,
      };
    } else if (activeShape === "Trapezoidal Dumper") {
      /* Isosceles trapezoidal prism volume = 0.5 * (tw + bw) * d * l; */ const slant =
        Math.sqrt(Math.pow((tw - bw) / 2, 2) + d * d);
      surfaceArea = (tw + bw) * d + l * tw + l * bw + 2 * l * slant;
      inputs = {
        "Top Width": `${tw} ${unit}`,
        "Bottom Width": `${bw} ${unit}`,
        Depth: `${d} ${unit}`,
        Length: `${l} ${unit}`,
      };
    } else if (activeShape === "Rectangle Tank") {
      volume = l * w * h;
      surfaceArea = 2 * (l * w + l * h + w * h);
      inputs = {
        Length: `${l} ${unit}`,
        Width: `${w} ${unit}`,
        Height: `${h} ${unit}`,
      };
    } else if (activeShape === "Prism") {
      volume = ba * h;
      surfaceArea = 2 * ba + bp * h;
      inputs = {
        "Base Area": `${ba} ${sqUnit}`,
        "Base Perimeter": `${bp} ${unit}`,
        Height: `${h} ${unit}`,
      };
    }
    return { volume, surfaceArea, inputs, explanationOpts };
  };
  const { volume, surfaceArea, inputs, explanationOpts } = useMemo(calculate, [
    activeShape,
    system,
    length,
    width,
    height,
    side,
    radius,
    topRadius,
    bottomRadius,
    base,
    topWidth,
    bottomWidth,
    depth,
    baseArea,
    basePerimeter,
  ]);
  let liquidCapacity = 0;
  let capacityUnit = "";
  if (system === "Metric") {
    liquidCapacity = volume * 1000; 
    capacityUnit = "Liters";
  } else {
    liquidCapacity = volume * 7.48052; 
    capacityUnit = "Gallons";
  }
  const volUnit = system === "Metric" ? "m³" : "cu.ft";
  const areaUnit = system === "Metric" ? "m²" : "sq.ft";
  const exportData = {
    Shape: activeShape,
    Volume: `${volume.toFixed(2)} ${volUnit}`,
    "Surface Area": `${surfaceArea.toFixed(2)} ${areaUnit}`,
    "Liquid Capacity": `${liquidCapacity.toFixed(2)} ${capacityUnit}`,
  };
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-500" /> Volume Estimator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 mb-8 font-medium">
          Calculate total volume, surface area, and liquid capacity of civil
          engineering shapes.
        </p>
        {/* Global Settings */}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
              Measurement System
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
              <button
                onClick={() => setCurrentUnit("Metric")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${system === "Metric" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-700 dark:text-slate-300"}`}
              >
                Metric (m)
              </button>
              <button
                onClick={() => setCurrentUnit("Imperial")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${system === "Imperial" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-700 dark:text-slate-300"}`}
              >
                Imperial (ft)
              </button>
            </div>
          </div>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 p-1">
          {shapes.map((s, idx) => {
            const Icon = s.icon;
            const baseColor = s.color.split("-")[1];
            return (
              <ColorfulTab index={idx} key={s.id}
                id={s.id}
                label={s.label}
                icon={<Icon className="w-5 h-5" />}
                isActive={activeShape === s.id}
                onClick={() => setActiveShape(s.id as Shape)}
                colorTheme={baseColor as any}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                {(() => {
                  const ShapeIcon =
                    shapes.find((s) => s.id === activeShape)?.icon || Box;
                  return <ShapeIcon className="w-6 h-6" />;
                })()}
              </div>
              <h3 className="font-bold text-xl">{activeShape} Parameters</h3>
            </div>
            <div className="space-y-4">
              {activeShape === "Rectangular Prism" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Length ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Width ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}
              {activeShape === "Cube" && (
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Side Length ({system === "Metric" ? "m" : "ft"})
                  </label>
                  <input
                    type="number"
                    value={side}
                    onChange={(e) => setSide(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                  />
                </div>
              )}
              {["Cylinder", "Cone", "Parabolic Cone"].includes(activeShape) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Radius ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}
              {["Sphere", "Half Sphere"].includes(activeShape) && (
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Radius ({system === "Metric" ? "m" : "ft"})
                  </label>
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                  />
                </div>
              )}
              {activeShape === "Frustum Cone" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Top Radius ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={topRadius}
                      onChange={(e) => setTopRadius(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Bottom Radius ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={bottomRadius}
                      onChange={(e) => setBottomRadius(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}
              {activeShape === "Triangular Dumper" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Base Width ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={base}
                      onChange={(e) => setBase(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Vertical / Triangle Height (
                      {system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Length ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}
              {activeShape === "Trapezoidal Dumper" && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Top Width ({system === "Metric" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        value={topWidth}
                        onChange={(e) => setTopWidth(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Bottom Width ({system === "Metric" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        value={bottomWidth}
                        onChange={(e) => setBottomWidth(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Depth / Height ({system === "Metric" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Length ({system === "Metric" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeShape === "Rectangle Tank" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Length ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Width ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height/Depth ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}
              {activeShape === "Prism" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Base Area ({system === "Metric" ? "m²" : "sq.ft"})
                    </label>
                    <input
                      type="number"
                      value={baseArea}
                      onChange={(e) => setBaseArea(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Base Perimeter ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={basePerimeter}
                      onChange={(e) => setBasePerimeter(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height ({system === "Metric" ? "m" : "ft"})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-white shadow-xl flex flex-col justify-between items-center text-center">
            <div className="w-full text-left mb-6">
              <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">
                Calculated Results
              </h3>
            </div>
            
            {["Trapezoidal Dumper", "Cylinder", "Rectangle Tank"].includes(activeShape) && (
              <SVGShapeVisualizer
                shape={activeShape}
                dimensions={{
                  topWidth: Number(topWidth),
                  bottomWidth: Number(bottomWidth),
                  depth: Number(depth),
                  length: Number(length),
                  width: Number(width),
                  height: Number(height),
                  radius: Number(radius)
                }}
              />
            )}

            <div className="w-full space-y-4 mb-8">
              <div className="bg-slate-800/50 px-4 py-3 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                <Maximize className="w-6 h-6 text-blue-400 mb-2" />
                <span className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase mb-1">
                  Total Volume
                </span>
                <span className="text-4xl font-black text-white">
                  {volume.toFixed(2)}
                  <span className="text-xl text-blue-300">{volUnit}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-4 items-center w-full">
                <div className="bg-slate-800/50 px-4 py-3 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                  <span className="block text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase mb-1">
                    Surface Area
                  </span>
                  <span className="text-xl font-bold text-emerald-400">
                    {surfaceArea.toFixed(2)}
                    <span className="text-sm">{areaUnit}</span>
                  </span>
                </div>
                <div className="bg-slate-800/50 px-4 py-3 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                  <span className="block text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase mb-1">
                    Liquid Capacity
                  </span>
                  <span className="text-xl font-bold text-cyan-400">
                    {liquidCapacity.toFixed(2)}
                    <span className="text-sm">{capacityUnit}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              
              
              
            </div>
          </div>
        </div>
      </div>
      <CalculationHistory
        calculatorId="volume_estimator_v1"
        currentInputs={{ activeShape, length, width, height, side, radius, topRadius, bottomRadius, base, topWidth, bottomWidth, depth, baseArea, basePerimeter }}
        currentResults={{ volVal: volume.toFixed(2), volUnit, surfaceArea: surfaceArea.toFixed(2), liquidCapacity: liquidCapacity.toFixed(2) }}
        summaryGeneration={(inputs, res) => `${inputs.activeShape} Volume: ${res.volVal} ${res.volUnit}`}
        explanation={explanationOpts}
        onRestore={(inputs) => {
          if (inputs.activeShape) setActiveShape(inputs.activeShape);
          if (inputs.length !== undefined) setLength(inputs.length);
          if (inputs.width !== undefined) setWidth(inputs.width);
          if (inputs.height !== undefined) setHeight(inputs.height);
          if (inputs.side !== undefined) setSide(inputs.side);
          if (inputs.radius !== undefined) setRadius(inputs.radius);
          if (inputs.topRadius !== undefined) setTopRadius(inputs.topRadius);
          if (inputs.bottomRadius !== undefined) setBottomRadius(inputs.bottomRadius);
          if (inputs.base !== undefined) setBase(inputs.base);
          if (inputs.topWidth !== undefined) setTopWidth(inputs.topWidth);
          if (inputs.bottomWidth !== undefined) setBottomWidth(inputs.bottomWidth);
          if (inputs.depth !== undefined) setDepth(inputs.depth);
          if (inputs.baseArea !== undefined) setBaseArea(inputs.baseArea);
          if (inputs.basePerimeter !== undefined) setBasePerimeter(inputs.basePerimeter);
        }}
      />
    </div>
  );
}
