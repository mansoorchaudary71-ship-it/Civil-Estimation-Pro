import React, { useState, useMemo } from "react";
import { UniversalTabs } from "../ui/UniversalTabs";
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

import { MaterialSummary } from "../ui/MaterialSummary";
import { ResultCard } from "../ui/ResultCard";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { CalculationHistory } from "../ui/CalculationHistory";
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
 color: "text-slate-500 bg-slate-100 ",
 },
 {
 id: "Square bar",
 label: "Square Bar",
 icon: Square,
 color: "text-zinc-500 bg-zinc-100 ",
 },
 {
 id: "Round pipe bar",
 label: "Round Pipe",
 icon: CircleDashed,
 color: "text-stone-500 bg-stone-100 ",
 },
 {
 id: "Hexagonal bar",
 label: "Hexagonal Bar",
 icon: Hexagon,
 color: "text-neutral-500 bg-neutral-100 ",
 },
 {
 id: "Square tubing bar",
 label: "Square Tubing",
 icon: SquareDashed,
 color: "text-gray-500 bg-gray-100 ",
 },
 {
 id: "Tee Bar",
 label: "Tee Bar",
 icon: RectangleHorizontal,
 color: "text-slate-600 bg-slate-200 ",
 },
 {
 id: "Beam bar",
 label: "Beam (I/H)",
 icon: Type,
 color: "text-sky-500 bg-sky-100 ",
 },
 {
 id: "Channel shape",
 label: "Channel (C/U)",
 icon: Columns,
 color: "text-blue-500 bg-blue-100 ",
 },
 {
 id: "Angle shape",
 label: "Angle (L)",
 icon: CornerDownRight,
 color: "text-indigo-600 bg-indigo-50 ",
 },
 {
 id: "Flat shape",
 label: "Flat Bar",
 icon: Minus,
 color: "text-purple-500 bg-purple-100 ",
 },
 {
 id: "Sheet shape",
 label: "Sheet / Plate",
 icon: Layers,
 color: "text-violet-500 bg-violet-100 ",
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
 <div className="w-full h-full bg-[#F5F5F7] text-text-primary p-6 md:p-8"><div className="max-w-4xl mx-auto"><div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200 mb-8"><div className="flex flex-col md:flex-row gap-6 mb-6"><div className="flex-1 min-w-[200px]">
 <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">
 Element Length (m)
 </label>
 <input
 type="number" inputMode="decimal"
 value={length}
 onChange={(e) => setLength(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-3 rounded-[24px] font-bold focus:ring-2 focus:ring-neutral-500"
 />
 <p className="text-[10px] text-slate-700 mt-1 pl-1">
 Total run length of member
 </p>
 </div>
 </div>
 {/* Profiles Grid */}
 <div className="mb-8">
 <UniversalTabs 
 tabs={profiles.map(p => ({ id: p.id, label: p.label, icon: <p.icon className="w-5 h-5" /> }))}
 activeTab={activeProfile}
 onTabChange={(id) => setActiveProfile(id as Profile)}
 />
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* Inputs Section */}
 <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] border border-border-color shadow-sm">
 <h3 className="font-bold text-xl mb-6">
 {activeProfile} Dimensions
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 {activeProfile === "Round bar" && (
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Diameter (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={d}
 onChange={(e) => setD(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 20"
 />
 </div>
 )}
 {activeProfile === "Square bar" && (
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Side Width (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={w}
 onChange={(e) => setW(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 50"
 />
 </div>
 )}
 {activeProfile === "Round pipe bar" && (
 <>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Outer Diameter (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={d}
 onChange={(e) => setD(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 100"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Wall Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={t}
 onChange={(e) => setT(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 5"
 />
 </div>
 </>
 )}
 {activeProfile === "Hexagonal bar" && (
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Size Across Flats (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={s}
 onChange={(e) => setS(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 30"
 />
 </div>
 )}
 {activeProfile === "Square tubing bar" && (
 <>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Outer Width (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={w}
 onChange={(e) => setW(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 50"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Wall Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={t}
 onChange={(e) => setT(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 3"
 />
 </div>
 </>
 )}
 {activeProfile === "Tee Bar" && (
 <>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Flange Width (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={w}
 onChange={(e) => setW(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 40"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Total Height (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={h}
 onChange={(e) => setH(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 40"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={t}
 onChange={(e) => setT(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 5"
 />
 </div>
 </>
 )}
 {["Beam bar", "Channel shape"].includes(activeProfile) && (
 <>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Flange Width (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={w}
 onChange={(e) => setW(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 150"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Depth / Height (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={h}
 onChange={(e) => setH(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 300"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Flange Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={tf}
 onChange={(e) => setTf(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 10"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Web Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={tw}
 onChange={(e) => setTw(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 7"
 />
 </div>
 </>
 )}
 {activeProfile === "Angle shape" && (
 <>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Leg 1 Length (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={leg1}
 onChange={(e) => setLeg1(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 50"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Leg 2 Length (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={leg2}
 onChange={(e) => setLeg2(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 50"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={t}
 onChange={(e) => setT(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 6"
 />
 </div>
 </>
 )}
 {["Flat shape", "Sheet shape"].includes(activeProfile) && (
 <>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Width (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={w}
 onChange={(e) => setW(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 1000"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-700 uppercase">
 Thickness (mm)
 </label>
 <input
 type="number" inputMode="decimal"
 value={t}
 onChange={(e) => setT(e.target.value)}
 className="w-full bg-transparent bg-white border border-slate-200 p-4 rounded-[24px] mt-1.5 font-bold focus:ring-2 focus:ring-neutral-500"
 placeholder="e.g. 10"
 />
 </div>
 </>
 )}
 </div>
 </div>
 {/* Results Section */}
 <div className="lg:col-span-5 flex flex-col items-stretch h-full">
 <MaterialSummary
 title="Calculated Results"
 totalLabel="Total Element Weight"
 totalValue={totalWeight.toFixed(2)}
 totalUnit="kg"
 subtitle=""
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
 <ResultCard
 title="Weight per Unit Length"
 value={weightPerM.toFixed(3)}
 unit="kg/m"
 variant="neutral"
 />
 <ResultCard
 title="Material Density"
 value={density}
 unit="kg/m³"
 variant="neutral"
 />
 </div>
 </MaterialSummary>
 </div>
 </div>
 </div>
 <CalculationHistory
 calculatorId="metal_weight_calculator_v1"
 currentInputs={{ activeProfile, length, density, d, w, h, t, tf, tw, s, leg1, leg2 }}
 currentResults={{ weight: `${weightPerM.toFixed(3)} kg/m`, totalWeight: `${totalWeight.toFixed(2)} kg` }}
 summaryGeneration={(inputs, results) => `${inputs.activeProfile} Weight: ${results.totalWeight}`}
 onRestore={(inputs) => {
 if (inputs.activeProfile) setActiveProfile(inputs.activeProfile);
 if (inputs.length !== undefined) setLength(inputs.length);
 if (inputs.density !== undefined) setDensity(inputs.density);
 if (inputs.d !== undefined) setD(inputs.d);
 if (inputs.w !== undefined) setW(inputs.w);
 if (inputs.h !== undefined) setH(inputs.h);
 if (inputs.t !== undefined) setT(inputs.t);
 if (inputs.tf !== undefined) setTf(inputs.tf);
 if (inputs.tw !== undefined) setTw(inputs.tw);
 if (inputs.s !== undefined) setS(inputs.s);
 if (inputs.leg1 !== undefined) setLeg1(inputs.leg1);
 if (inputs.leg2 !== undefined) setLeg2(inputs.leg2);
 }} /></div></div>); }
