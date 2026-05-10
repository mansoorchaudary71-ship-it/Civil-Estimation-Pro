import React, { useState, useEffect } from "react";
import ShareButtonWithPopup from "./ShareMenu";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { Save } from "lucide-react";
import { CalculationHistory } from "../ui/CalculationHistory";
import {
  CircleDashed,
  Square,
  ArrowDownRight,
  Droplets,
  Layers,
  Construction,
} from "lucide-react";
import ColorfulTab from "../ui/ColorfulTab";
export interface ManholeResults {
  excavationVol: number;
  wallVol: number;
  baseVol: number;
  topSlabVol: number;
  totalWetConcrete: number;
  totalDryConcrete: number;
  materials: { cementBags: number; sandCft: number; aggCft: number };
  brickCount?: number;
}
interface ManholeModuleProps {
  onStateChange?: (results: ManholeResults) => void;
}
const mixRatios: Record<string, { c: number; s: number; a: number }> = {
  "M10 (1:3:6)": { c: 1, s: 3, a: 6 },
  "M15 (1:2:4)": { c: 1, s: 2, a: 4 },
  "M20 (1:1.5:3)": { c: 1, s: 1.5, a: 3 },
  "M25 (1:1:2)": { c: 1, s: 1, a: 2 },
};
export default function ManholeModule({ onStateChange }: ManholeModuleProps) {
  const [mhType, setMhType] = useState<"circular" | "rectangular">("circular");
  const [mhDepth, setMhDepth] = useState<string>("3");
  /* Used for circular diameter or rectangular length input */ const [
    mhInnerLen,
    setMhInnerLen,
  ] = useState<string>("1.2");
  /* Used only for rectangular width */ const [mhInnerWid, setMhInnerWid] =
    useState<string>("1.2");
  const [mhWallThick, setMhWallThick] = useState<string>("0.23");
  const [mhBaseThick, setMhBaseThick] = useState<string>("0.15");
  const [mhTopThick, setMhTopThick] = useState<string>("0.15");
  const [concreteMix, setConcreteMix] = useState<string>("M15 (1:2:4)");
  useEffect(() => {
    const depth = parseFloat(mhDepth) || 0;
    const len = parseFloat(mhInnerLen) || 0;
    const wid = mhType === "rectangular" ? parseFloat(mhInnerWid) || 0 : len;
    const wallThick = parseFloat(mhWallThick) || 0;
    const baseThick = parseFloat(mhBaseThick) || 0;
    const topThick = parseFloat(mhTopThick) || 0;
    let excVol = 0;
    let wallVol = 0;
    let baseVol = 0;
    let topSlabVol = 0;
    let brickCount = 0;
    if (mhType === "circular") {
      const outerD = len + 2 * wallThick;
      const baseD = outerD + 0.3;
      /* 150mm offset */ const excD = baseD + 0.6;
      /* 300mm working space */ wallVol =
        Math.PI * Math.pow(outerD / 2, 2) * depth -
        Math.PI * Math.pow(len / 2, 2) * depth;
      excVol = Math.PI * Math.pow(excD / 2, 2) * (depth + baseThick);
      baseVol = Math.PI * Math.pow(baseD / 2, 2) * baseThick;
      topSlabVol = Math.PI * Math.pow(outerD / 2, 2) * topThick;
    } else {
      const outerL = len + 2 * wallThick;
      const outerW = wid + 2 * wallThick;
      const baseL = outerL + 0.3;
      const baseW = outerW + 0.3;
      const excL = baseL + 0.6;
      const excW = baseW + 0.6;
      wallVol = (outerL * outerW - len * wid) * depth;
      excVol = excL * excW * (depth + baseThick);
      baseVol = baseL * baseW * baseThick;
      topSlabVol = outerL * outerW * topThick;
      /* Standard brick metric 190x90x90 with mortar ~ 200x100x100 = 0.002m³ */ brickCount =
        Math.ceil(wallVol / 0.002);
    }
    /* Concrete is used in base and top slab. Walls could be brick or concrete. Since we want concrete calculations, let's assume if circular -> concrete rings or cast-in-place; if rectangular -> either RCC or Brick. Let's calculate total concrete for Base + Top Slab + optionally wall if circular). Let's assume the user wants concrete details for base & top slab. */ const totalWetConcrete =
      baseVol + topSlabVol + (mhType === "circular" ? wallVol : 0);
    const totalDryConcrete = totalWetConcrete * 1.54;
    const ratio = mixRatios[concreteMix];
    const totalRatio = ratio.c + ratio.s + ratio.a;
    /* cement volume in m3 */ const cementM3 =
      (totalDryConcrete * ratio.c) / totalRatio;
    const cementBags = Math.ceil(cementM3 / 0.0347);
    /* 50kg bag, sand in cft (1 m3 = 35.3147 cft) */ const sandCft =
      ((totalDryConcrete * ratio.s) / totalRatio) * 35.3147;
    /* agg in cft */ const aggCft =
      ((totalDryConcrete * ratio.a) / totalRatio) * 35.3147;
    const results = {
      excavationVol: excVol,
      wallVol,
      baseVol,
      topSlabVol,
      totalWetConcrete,
      totalDryConcrete,
      materials: { cementBags, sandCft, aggCft },
      brickCount: mhType === "rectangular" ? brickCount : undefined,
    };
    if (onStateChange) {
      onStateChange(results);
    }
  }, [
    mhType,
    mhDepth,
    mhInnerLen,
    mhInnerWid,
    mhWallThick,
    mhBaseThick,
    mhTopThick,
    concreteMix,
    onStateChange,
  ]);
  const ratio = mixRatios[concreteMix];
  const totalRatio = ratio.c + ratio.s + ratio.a;
  const depth = parseFloat(mhDepth) || 0;
  const len = parseFloat(mhInnerLen) || 0;
  const wid = mhType === "rectangular" ? parseFloat(mhInnerWid) || 0 : len;
  const wallThick = parseFloat(mhWallThick) || 0;
  const baseThick = parseFloat(mhBaseThick) || 0;
  const topThick = parseFloat(mhTopThick) || 0;
  
  let excVol = 0;
  let wallVol = 0;
  let baseVol = 0;
  let topSlabVol = 0;

  if (mhType === "circular") {
    const outerD = len + 2 * wallThick;
    const baseD = outerD + 0.3;
    const excD = baseD + 0.6;
    wallVol = Math.PI * Math.pow(outerD / 2, 2) * depth - Math.PI * Math.pow(len / 2, 2) * depth;
    excVol = Math.PI * Math.pow(excD / 2, 2) * (depth + baseThick);
    baseVol = Math.PI * Math.pow(baseD / 2, 2) * baseThick;
    topSlabVol = Math.PI * Math.pow(outerD / 2, 2) * topThick;
  } else {
    const outerL = len + 2 * wallThick;
    const outerW = wid + 2 * wallThick;
    const baseL = outerL + 0.3;
    const baseW = outerW + 0.3;
    const excL = baseL + 0.6;
    const excW = baseW + 0.6;
    wallVol = (outerL * outerW - len * wid) * depth;
    excVol = excL * excW * (depth + baseThick);
    baseVol = baseL * baseW * baseThick;
    topSlabVol = outerL * outerW * topThick;
  }

  /* Let's recreate calculations for display */ const totalWetConcrete =
    mhType === "circular"
      ? Math.PI * Math.pow((len + 2 * wallThick) / 2, 2) * depth -
        Math.PI * Math.pow(len / 2, 2) * depth +
        Math.PI * Math.pow((len + 2 * wallThick + 0.3) / 2, 2) * baseThick +
        Math.PI * Math.pow((len + 2 * wallThick) / 2, 2) * topThick
      : (len + 2 * wallThick + 0.3) * (wid + 2 * wallThick + 0.3) * baseThick +
        (len + 2 * wallThick) * (wid + 2 * wallThick) * topThick;
  const totalDryConcrete = totalWetConcrete * 1.54;
  const cementM3 = (totalDryConcrete * ratio.c) / totalRatio;
  const cementBags = Math.ceil(cementM3 / 0.0347);
  const sandCft = ((totalDryConcrete * ratio.s) / totalRatio) * 35.3147;
  const aggCft = ((totalDryConcrete * ratio.a) / totalRatio) * 35.3147;
  return (
    <div className="w-full h-full">
      {" "}
      <div className="px-2 py-4 sm:px-6 sm:py-6 bg-transparent border-b border-gray-100 rounded-t-2xl">
        {" "}
        <div className="flex flex-col mb-6">
          {" "}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            Shape
          </label>{" "}
          <div className="flex overflow-x-auto pb-4 gap-2 mb-2 p-1 w-full max-w-sm">
            {" "}
            <ColorfulTab
              id="circular"
              label="Circular"
              icon={<CircleDashed className="w-4 h-4" />}
              isActive={mhType === "circular"}
              onClick={() => setMhType("circular")}
              colorTheme="teal"
            />
            <ColorfulTab
              id="rectangular"
              label="Rectangular"
              icon={<Square className="w-4 h-4" />}
              isActive={mhType === "rectangular"}
              onClick={() => setMhType("rectangular")}
              colorTheme="indigo"
            />
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {" "}
          <div>
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Depth (m)
            </label>{" "}
            <input
              type="number"
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm"
              value={mhDepth}
              onChange={(e) => setMhDepth(e.target.value)}
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              {mhType === "circular" ? "Inner Diameter" : "Inner Length"} (m)
            </label>{" "}
            <input
              type="number"
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm"
              value={mhInnerLen}
              onChange={(e) => setMhInnerLen(e.target.value)}
            />{" "}
          </div>{" "}
          {mhType === "rectangular" && (
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Inner Width (m)
              </label>{" "}
              <input
                type="number"
                className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm"
                value={mhInnerWid}
                onChange={(e) => setMhInnerWid(e.target.value)}
              />{" "}
            </div>
          )}{" "}
          <div>
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Wall Thickness (m)
            </label>{" "}
            <input
              type="number"
              step="0.01"
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm"
              value={mhWallThick}
              onChange={(e) => setMhWallThick(e.target.value)}
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Base Thick (m)
            </label>{" "}
            <input
              type="number"
              step="0.01"
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm"
              value={mhBaseThick}
              onChange={(e) => setMhBaseThick(e.target.value)}
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Top Slab Thick (m)
            </label>{" "}
            <input
              type="number"
              step="0.01"
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm"
              value={mhTopThick}
              onChange={(e) => setMhTopThick(e.target.value)}
            />{" "}
          </div>{" "}
          <div className="lg:col-span-2">
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Concrete Mix Grade
            </label>{" "}
            <select
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-sm appearance-none"
              value={concreteMix}
              onChange={(e) => setConcreteMix(e.target.value)}
            >
              {" "}
              {Object.keys(mixRatios).map((mix) => (
                <option key={mix} value={mix}>
                  {mix}
                </option>
              ))}{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-6 py-8">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {" "}
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-transparent border border-slate-100 rounded-2xl">
            {" "}
            {/* Visual Icon representation based on shape */}{" "}
            <div
              className="w-32 h-32 relative flex items-center justify-center text-teal-200 border-[8px] mb-4 shadow-inner"
              style={{
                borderRadius: mhType === "circular" ? "50%" : "1rem",
                borderColor: "currentColor",
              }}
            >
              {" "}
              <span className="text-sm font-bold text-teal-700 absolute">
                {" "}
                {mhType === "circular" ? `Ø ${len}m` : `${len}×${wid}m`}{" "}
              </span>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <h4 className="font-bold text-gray-800 mb-1">
                {mhType === "circular" ? "Circular" : "Rectangular"} Manhole
              </h4>{" "}
              <p className="text-xs text-gray-500 font-medium">
                Depth: {depth}m
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-2 flex flex-wrap gap-4 items-center w-full">
            {" "}
            <div className="bg-teal-50 px-4 py-3 rounded-2xl border border-teal-100">
              {" "}
              <div className="flex items-center gap-2 mb-3">
                {" "}
                <Droplets className="w-4 h-4 text-teal-600" />{" "}
                <h4 className="text-sm font-semibold text-teal-800">
                  Concrete Volume
                </h4>{" "}
              </div>{" "}
              <div className="flex items-baseline gap-2 mb-1">
                {" "}
                <span className="text-3xl font-black text-teal-700">
                  {totalWetConcrete.toFixed(2)}
                </span>{" "}
                <span className="text-teal-600 font-medium">m³</span>{" "}
              </div>{" "}
              <p className="text-xs text-teal-600/80 font-medium">
                Wet Area (Base + Wall + Slab)
              </p>{" "}
            </div>{" "}
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Total Dry Concrete
                </h4>{" "}
                <div className="flex items-baseline gap-2">
                  {" "}
                  <span className="text-2xl font-bold text-gray-800">
                    {totalDryConcrete.toFixed(2)}
                  </span>{" "}
                  <span className="text-gray-500 text-sm font-medium">
                    m³
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="mt-2 text-xs text-gray-400 font-medium bg-transparent p-2 rounded-lg inline-block">
                {" "}
                Wet factor used: × 1.54{" "}
              </div>{" "}
            </div>{" "}
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
              {" "}
              <h4 className="text-sm font-bold text-indigo-800 mb-4 flex items-center gap-2">
                {" "}
                <Construction className="w-4 h-4" /> Material Breakdown (
                {concreteMix}){" "}
              </h4>{" "}
              <div className="grid grid-cols-3 gap-6">
                {" "}
                <div>
                  {" "}
                  <span className="block text-xs font-semibold text-indigo-500 mb-1">
                    Cement
                  </span>{" "}
                  <span className="block text-2xl font-black text-indigo-700">
                    {cementBags}{" "}
                    <span className="text-sm font-medium">bags</span>
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="block text-xs font-semibold text-indigo-500 mb-1">
                    Sand
                  </span>{" "}
                  <span className="block text-2xl font-black text-indigo-700">
                    {sandCft.toFixed(1)}{" "}
                    <span className="text-sm font-medium">cft</span>
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="block text-xs font-semibold text-indigo-500 mb-1">
                    Aggregate
                  </span>{" "}
                  <span className="block text-2xl font-black text-indigo-700">
                    {aggCft.toFixed(1)}{" "}
                    <span className="text-sm font-medium">cft</span>
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <ShareButtonWithPopup
              activeTab="Manhole Estimator"
              title="Manhole Estimate"
              data={{ excavationVol: excVol, wallVol, baseVol, topSlabVol, cementBags, sandCft, aggCft }}
              exportFormat={{
                inputs: { mhType, mhDepth, mhInnerLen, mhInnerWid, mhWallThick, mhBaseThick, mhTopThick, concreteMix },
                breakdown: {
                    "Excavation Volume": excVol.toFixed(2) + " m³",
                    "Total Wet Concrete": totalWetConcrete.toFixed(2) + " m³",
                    cement: cementBags.toString() + " bags",
                    sand: sandCft.toFixed(1) + " cft",
                    aggregate: aggCft.toFixed(1) + " cft"
                },
              }}
            />
          </div>
        </div>{" "}
      </div>{" "}
      <CalculationHistory
        calculatorId="manhole_v1"
        currentInputs={{ mhType, mhDepth, mhInnerLen, mhInnerWid, mhWallThick, mhBaseThick, mhTopThick, concreteMix }}
        currentResults={{ excVol, totalWetConcrete, cementBags, sandCft, aggCft }}
        summaryGeneration={(inputs, res) => `Manhole ${inputs.mhType} - Depth: ${inputs.mhDepth}m`}
        onRestore={(inputs) => {
          if (inputs.mhType) setMhType(inputs.mhType);
          if (inputs.mhDepth !== undefined) setMhDepth(inputs.mhDepth);
          if (inputs.mhInnerLen !== undefined) setMhInnerLen(inputs.mhInnerLen);
          if (inputs.mhInnerWid !== undefined) setMhInnerWid(inputs.mhInnerWid);
          if (inputs.mhWallThick !== undefined) setMhWallThick(inputs.mhWallThick);
          if (inputs.mhBaseThick !== undefined) setMhBaseThick(inputs.mhBaseThick);
          if (inputs.mhTopThick !== undefined) setMhTopThick(inputs.mhTopThick);
          if (inputs.concreteMix !== undefined) setConcreteMix(inputs.concreteMix);
        }}
      />
    </div>
  );
}
