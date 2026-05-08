import React, { useState, useMemo } from "react";
import {
  Circle,
  Square,
  CircleDashed,
  Hexagon,
  SquareDashed,
  RectangleHorizontal,
  Type,
  Columns,
  CornerDownRight,
  Minus,
  Layers,
  Weight,
  Calculator,
  Save,
} from "lucide-react";
import ShareButtonWithPopup from "./ShareMenu";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
type Profile =
  | "Round bar"
  | "Square bar"
  | "Round pipe bar"
  | "Hexagonal bar"
  | "Square tubing bar"
  | "Tee Bar"
  | "Beam bar"
  | "Channel shape"
  | "Angle shape"
  | "Flat shape"
  | "Sheet shape";
export default function MetalWeightCalculator() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [activeProfile, setActiveProfile] = useState<Profile>("Round bar");
  /* Base Inputs */ const [length, setLength] = useState<string>("1");
  /* Length in meters */ const [density, setDensity] = useState<string>("7850");
  /* Density in kg/m³ // Dimensions in millimeters */ const [d, setD] =
    useState<string>("");
  /* Diameter */ const [w, setW] = useState<string>("");
  /* Width / Size */ const [h, setH] = useState<string>("");
  /* Height */ const [t, setT] = useState<string>("");
  /* Thickness (Uniform) */ const [tf, setTf] = useState<string>("");
  /* Flange Thickness */ const [tw, setTw] = useState<string>("");
  /* Web Thickness */ const [s, setS] = useState<string>("");
  /* Across flats (Hexagon) */ const [leg1, setLeg1] = useState<string>("");
  /* Angle shape leg 1 */ const [leg2, setLeg2] = useState<string>("");
  /* Angle shape leg 2 */ const profiles: {
    id: Profile;
    label: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: "Round bar",
      label: "Round Bar",
      icon: Circle,
      color: "text-slate-500 bg-slate-100 dark:bg-slate-500/20",
    },
    {
      id: "Square bar",
      label: "Square Bar",
      icon: Square,
      color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-500/20",
    },
    {
      id: "Round pipe bar",
      label: "Round Pipe",
      icon: CircleDashed,
      color: "text-stone-500 bg-stone-100 dark:bg-stone-500/20",
    },
    {
      id: "Hexagonal bar",
      label: "Hexagonal Bar",
      icon: Hexagon,
      color: "text-neutral-500 bg-neutral-100 dark:bg-neutral-500/20",
    },
    {
      id: "Square tubing bar",
      label: "Square Tubing",
      icon: SquareDashed,
      color: "text-gray-500 bg-gray-100 dark:bg-gray-500/20",
    },
    {
      id: "Tee Bar",
      label: "Tee Bar",
      icon: RectangleHorizontal,
      color: "text-slate-600 bg-slate-200 dark:bg-slate-400/20",
    },
    {
      id: "Beam bar",
      label: "Beam (I/H)",
      icon: Type,
      color: "text-sky-500 bg-sky-100 dark:bg-sky-500/20",
    },
    {
      id: "Channel shape",
      label: "Channel (C/U)",
      icon: Columns,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20",
    },
    {
      id: "Angle shape",
      label: "Angle (L)",
      icon: CornerDownRight,
      color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20",
    },
    {
      id: "Flat shape",
      label: "Flat Bar",
      icon: Minus,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-500/20",
    },
    {
      id: "Sheet shape",
      label: "Sheet / Plate",
      icon: Layers,
      color: "text-violet-500 bg-violet-100 dark:bg-violet-500/20",
    },
  ];
  const calculate = () => {
    let area_mm2 = 0;
    /* Cross-sectional area in mm² */ let inputsUsed: Record<string, string> = {
      Length: `${length} m`,
      Density: `${density} kg/m³`,
    };
    const parse = (val: string) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };
    const len = parse(length);
    const dens = parse(density);
    if (activeProfile === "Round bar") {
      const diam = parse(d);
      area_mm2 = (Math.PI * diam * diam) / 4;
      inputsUsed["Diameter (D)"] = `${d} mm`;
    } else if (activeProfile === "Square bar") {
      const width = parse(w);
      area_mm2 = width * width;
      inputsUsed["Side (W)"] = `${w} mm`;
    } else if (activeProfile === "Round pipe bar") {
      const od = parse(d);
      const thk = parse(t);
      const id = od - 2 * thk;
      area_mm2 = id > 0 ? (Math.PI / 4) * (od * od - id * id) : 0;
      inputsUsed["Outer Diameter (D)"] = `${d} mm`;
      inputsUsed["Wall Thickness (T)"] = `${t} mm`;
    } else if (activeProfile === "Hexagonal bar") {
      const flat = parse(s);
      area_mm2 = (Math.sqrt(3) / 2) * flat * flat;
      inputsUsed["Size across flats (S)"] = `${s} mm`;
    } else if (activeProfile === "Square tubing bar") {
      const width = parse(w);
      const thk = parse(t);
      const inner = width - 2 * thk;
      area_mm2 = inner > 0 ? width * width - inner * inner : 0;
      inputsUsed["Width (W)"] = `${w} mm`;
      inputsUsed["Wall Thickness (T)"] = `${t} mm`;
    } else if (activeProfile === "Tee Bar") {
      const width = parse(w);
      const height = parse(h);
      const thk = parse(t);
      area_mm2 = width * thk + (height - thk) * thk;
      inputsUsed["Flange Width (W)"] = `${w} mm`;
      inputsUsed["Height (H)"] = `${h} mm`;
      inputsUsed["Thickness (T)"] = `${t} mm`;
    } else if (activeProfile === "Beam bar") {
      const width = parse(w);
      const height = parse(h);
      const thkF = parse(tf);
      const thkW = parse(tw);
      area_mm2 = 2 * (width * thkF) + (height - 2 * thkF) * thkW;
      inputsUsed["Flange Width (W)"] = `${w} mm`;
      inputsUsed["Depth/Height (H)"] = `${h} mm`;
      inputsUsed["Flange Thk (Tf)"] = `${tf} mm`;
      inputsUsed["Web Thk (Tw)"] = `${tw} mm`;
    } else if (activeProfile === "Channel shape") {
      const width = parse(w);
      const height = parse(h);
      const thkF = parse(tf);
      const thkW = parse(tw);
      area_mm2 = 2 * (width * thkF) + (height - 2 * thkF) * thkW;
      inputsUsed["Flange Width (W)"] = `${w} mm`;
      inputsUsed["Depth/Height (H)"] = `${h} mm`;
      inputsUsed["Flange Thk (Tf)"] = `${tf} mm`;
      inputsUsed["Web Thk (Tw)"] = `${tw} mm`;
    } else if (activeProfile === "Angle shape") {
      const l1 = parse(leg1);
      const l2 = parse(leg2);
      const thk = parse(t);
      area_mm2 = l1 * thk + (l2 - thk) * thk;
      inputsUsed["Leg 1 (A)"] = `${leg1} mm`;
      inputsUsed["Leg 2 (B)"] = `${leg2} mm`;
      inputsUsed["Thickness (T)"] = `${t} mm`;
    } else if (activeProfile === "Flat shape") {
      const width = parse(w);
      const thk = parse(t);
      area_mm2 = width * thk;
      inputsUsed["Width (W)"] = `${w} mm`;
      inputsUsed["Thickness (T)"] = `${t} mm`;
    } else if (activeProfile === "Sheet shape") {
      const width = parse(w);
      const thk = parse(t);
      area_mm2 = width * thk;
      /* For sheet, weight per len is weight per meter length of that width. */ inputsUsed[
        "Width (W)"
      ] = `${w} mm`;
      inputsUsed["Thickness (T)"] = `${t} mm`;
    }
    /* Convert area from mm² to m² */ const area_m2 = area_mm2 / 1000000;
    /* Weight per unit length = Area(m²) * Density(kg/m³) => returns kg/m */ const weightPerM =
      Math.max(0, area_m2 * dens);
    /* Total weight = WeightPerM * Length(m) */ const totalWeight = Math.max(
      0,
      weightPerM * len,
    );
    return { totalWeight, weightPerM, inputsUsed };
  };
  const { totalWeight, weightPerM, inputsUsed } = useMemo(calculate, [
    activeProfile,
    d,
    w,
    h,
    t,
    tf,
    tw,
    s,
    leg1,
    leg2,
    length,
    density,
  ]);
  const exportData = {
    Profile: activeProfile,
    "Weight / Meter": `${weightPerM.toFixed(3)} kg/m`,
    "Total Weight": `${totalWeight.toFixed(2)} kg`,
  };
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3 whitespace-nowrap">
          {" "}
          <Weight className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />{" "}
          Metal Weight Calculator{" "}
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          Calculate the mass and per-length weight of standard structural steel
          profiles.
        </p>{" "}
        {/* Global Settings */}{" "}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 min-w-fit whitespace-nowrap">
          {" "}
          <div className="flex-1 min-w-[200px]">
            {" "}
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5 whitespace-nowrap">
              Material Density (kg/m³)
            </label>{" "}
            <input
              type="number"
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl font-bold focus:ring-2 focus:ring-neutral-500"
            />{" "}
            <p className="text-[10px] text-slate-400 mt-1 pl-1">
              Steel: 7850 | Aluminum: 2700 | Stainless: 7930
            </p>{" "}
          </div>{" "}
          <div className="flex-1 min-w-[200px]">
            {" "}
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5 whitespace-nowrap">
              Element Length (m)
            </label>{" "}
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3 rounded-xl font-bold focus:ring-2 focus:ring-neutral-500"
            />{" "}
            <p className="text-[10px] text-slate-400 mt-1 pl-1">
              Total run length of member
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Profiles Grid */}{" "}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {" "}
          {profiles.map((p) => {
            const Icon = p.icon;
            const isActive = activeProfile === p.id;
            const baseColor = p.color.split("-")[1];
            return (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-[20px] transition-all duration-200 overflow-hidden group hover:border-[color:var(--theme-color)] hover:bg-[color:var(--theme-bg-light)] ${isActive ? "shadow-sm" : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}`}
                style={
                  {
                    "--theme-color": `var(--color-${baseColor}-500)`,
                    "--theme-color-hover": `var(--color-${baseColor}-600)`,
                    "--theme-bg": `color-mix(in srgb, var(--color-${baseColor}-500) 10%, transparent)`,
                    "--theme-bg-light": `color-mix(in srgb, var(--color-${baseColor}-500) 5%, transparent)`,
                    borderColor: isActive ? "var(--theme-color)" : undefined,
                    borderWidth: isActive ? "2px" : undefined,
                    borderStyle: isActive ? "solid" : undefined,
                    backgroundColor: isActive
                      ? "var(--theme-bg-light)"
                      : undefined,
                  } as React.CSSProperties
                }
              >
                {" "}
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: "var(--theme-bg)",
                    color: "var(--theme-color)",
                    filter: isActive
                      ? "drop-shadow(0 0 20px color-mix(in srgb, var(--theme-color) 25%, transparent))"
                      : undefined,
                  }}
                >
                  {" "}
                  <Icon className="w-6 h-6" strokeWidth={2} />{" "}
                </div>{" "}
                <span
                  className={`text-[11px] font-extrabold text-center leading-tight tracking-wide z-10 ${isActive ? "" : "text-slate-600 dark:text-slate-400 group-hover:[color:var(--theme-color-hover)]"}`}
                  style={{
                    color: isActive ? "var(--theme-color-hover)" : undefined,
                  }}
                >
                  {p.label}
                </span>{" "}
              </button>
            );
          })}{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {" "}
          {/* Inputs Section */}{" "}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            {" "}
            <h3 className="font-bold text-xl mb-6 whitespace-nowrap">
              {activeProfile} Dimensions
            </h3>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {" "}
              {activeProfile === "Round bar" && (
                <div>
                  {" "}
                  <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                    Diameter (mm)
                  </label>{" "}
                  <input
                    type="number"
                    value={d}
                    onChange={(e) => setD(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                    placeholder="e.g. 20"
                  />{" "}
                </div>
              )}{" "}
              {activeProfile === "Square bar" && (
                <div>
                  {" "}
                  <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                    Side Width (mm)
                  </label>{" "}
                  <input
                    type="number"
                    value={w}
                    onChange={(e) => setW(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                    placeholder="e.g. 50"
                  />{" "}
                </div>
              )}{" "}
              {activeProfile === "Round pipe bar" && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Outer Diameter (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={d}
                      onChange={(e) => setD(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 100"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Wall Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={t}
                      onChange={(e) => setT(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 5"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeProfile === "Hexagonal bar" && (
                <div>
                  {" "}
                  <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                    Size Across Flats (mm)
                  </label>{" "}
                  <input
                    type="number"
                    value={s}
                    onChange={(e) => setS(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                    placeholder="e.g. 30"
                  />{" "}
                </div>
              )}{" "}
              {activeProfile === "Square tubing bar" && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Outer Width (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={w}
                      onChange={(e) => setW(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 50"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Wall Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={t}
                      onChange={(e) => setT(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 3"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeProfile === "Tee Bar" && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Flange Width (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={w}
                      onChange={(e) => setW(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 40"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Total Height (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={h}
                      onChange={(e) => setH(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 40"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={t}
                      onChange={(e) => setT(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 5"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {["Beam bar", "Channel shape"].includes(activeProfile) && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Flange Width (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={w}
                      onChange={(e) => setW(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 150"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Depth / Height (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={h}
                      onChange={(e) => setH(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 300"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Flange Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={tf}
                      onChange={(e) => setTf(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 10"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Web Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={tw}
                      onChange={(e) => setTw(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 7"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeProfile === "Angle shape" && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Leg 1 Length (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={leg1}
                      onChange={(e) => setLeg1(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 50"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Leg 2 Length (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={leg2}
                      onChange={(e) => setLeg2(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 50"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={t}
                      onChange={(e) => setT(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 6"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {["Flat shape", "Sheet shape"].includes(activeProfile) && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Width (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={w}
                      onChange={(e) => setW(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 1000"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      Thickness (mm)
                    </label>{" "}
                    <input
                      type="number"
                      value={t}
                      onChange={(e) => setT(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
                      placeholder="e.g. 10"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
            </div>{" "}
          </div>{" "}
          {/* Results Section */}{" "}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 lg:p-10 text-white shadow-2xl flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <h3 className="font-bold text-neutral-400 text-sm uppercase tracking-widest mb-8 whitespace-nowrap">
                Calculated Results
              </h3>{" "}
              <div className="space-y-6">
                {" "}
                <div className="bg-neutral-800/60 p-6 rounded-2xl border border-neutral-700">
                  {" "}
                  <span className="block text-neutral-400 text-xs font-bold uppercase mb-2 whitespace-nowrap">
                    Weight per Unit Length
                  </span>{" "}
                  <span className="text-4xl font-black text-emerald-400 whitespace-nowrap">
                    {" "}
                    {weightPerM.toFixed(3)}{" "}
                    <span className="text-xl text-neutral-500 ml-2 whitespace-nowrap">
                      kg/m
                    </span>{" "}
                  </span>{" "}
                </div>{" "}
                <div className="bg-neutral-800/60 p-6 rounded-2xl border border-neutral-700">
                  {" "}
                  <span className="block text-neutral-400 text-xs font-bold uppercase mb-2 whitespace-nowrap">
                    Total Element Weight
                  </span>{" "}
                  <span className="text-5xl font-black text-white whitespace-nowrap">
                    {" "}
                    {totalWeight.toFixed(2)}{" "}
                    <span className="text-2xl text-neutral-500 ml-3 whitespace-nowrap">
                      kg
                    </span>{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              {" "}
              <ShareButtonWithPopup
                activeTab="Metal Weight"
                title={`${activeProfile} Weight Estimate`}
                data={exportData}
                exportFormat={{ inputs: inputsUsed, breakdown: exportData }}
              />{" "}
              {user && (
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    setSaveMessage("");
                    try {
                      const payload = {
                        inputs: inputsUsed,
                        breakdown: exportData,
                      };
                      const projName = prompt(
                        "Enter project element/estimate name:",
                        "My MetalWeightCalculator Estimate",
                      );
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
                  {" "}
                  {isSaving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      {" "}
                      <Save className="w-5 h-5" /> Save to Profile{" "}
                    </>
                  )}{" "}
                </button>
              )}{" "}
              {saveMessage && (
                <span className="text-sm font-bold text-green-400 ml-4">
                  {saveMessage}
                </span>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
