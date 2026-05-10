import React, { useState, useEffect } from "react";

import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { Save } from "lucide-react";
import { CalculationHistory } from "../ui/CalculationHistory";
import { Layers, Info } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const Tooltip = ({ content }: { content: string }) => (
  <div className="relative group inline-flex ml-1.5 align-middle">
    <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-slate-900 text-white text-[11px] font-normal rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[5px] border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

export interface SlabSteelResults {
  mainBarsCount: number;
  mainTotalWeight: number;
  distBarsCount: number;
  distTotalWeight: number;
  totalSteelWtKg: number;
  totalSteelWtTon: number;
}
interface SlabSteelModuleProps {
  slabLength?: string;
  /* in meters */ slabWidth?: string;
  /* in meters */ slabThickness?: string;
  /* in meters */ onStateChange?: (results: SlabSteelResults) => void;
}
export default function SlabSteelModule({
  slabLength = "5",
  slabWidth = "4",
  slabThickness = "0.15",
  onStateChange,
}: SlabSteelModuleProps) {
  const { settings } = useSettings();
  const isSI = settings.measurement === "SI";
  const [mainDia, setMainDia] = useState("12");
  /* mm */ const [mainSpacing, setMainSpacing] = useState("150");
  /* mm (c/c) */ const [distDia, setDistDia] = useState("10");
  /* mm */ const [distSpacing, setDistSpacing] = useState("200");
  /* mm (c/c) */ const [topCover, setTopCover] = useState("20");
  /* mm */ const [bottomCover, setBottomCover] = useState("20");
  /* mm */ const [sideCover, setSideCover] = useState("25");
  /* mm */ useEffect(() => {
    const parse = (v: string) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
    const L = parse(slabLength);
    const W = parse(slabWidth);
    const mDia = parse(mainDia);
    const mSpc = parse(mainSpacing) / 1000;
    const dDia = parse(distDia);
    const dSpc = parse(distSpacing) / 1000;
    const cSide = parse(sideCover) / 1000;
    /* We assume shorter span is Main, longer is Distribution */ const shortSpan =
      Math.min(L, W);
    const longSpan = Math.max(L, W);
    /* Number of Main Bars = (Long Span - 2*Cover) / Spacing + 1 */ const mainBarsCount =
      mSpc > 0 && longSpan > 2 * cSide
        ? Math.ceil((longSpan - 2 * cSide) / mSpc) + 1
        : 0;
    const mainBarCuttingLen = shortSpan > 2 * cSide ? shortSpan - 2 * cSide : 0;
    /* adding hook length (e.g. 2 * 9d) or we can just use straight bar cutting length for simple slab we'll keep it simple: straight length */ const mainWt =
      mainBarsCount * mainBarCuttingLen * (Math.pow(mDia, 2) / 162.28);
    const distBarsCount =
      dSpc > 0 && shortSpan > 2 * cSide
        ? Math.ceil((shortSpan - 2 * cSide) / dSpc) + 1
        : 0;
    const distBarCuttingLen = longSpan > 2 * cSide ? longSpan - 2 * cSide : 0;
    const distWt =
      distBarsCount * distBarCuttingLen * (Math.pow(dDia, 2) / 162.28);
    if (onStateChange) {
      onStateChange({
        mainBarsCount,
        mainTotalWeight: Number(mainWt.toFixed(2)),
        distBarsCount,
        distTotalWeight: Number(distWt.toFixed(2)),
        totalSteelWtKg: Number((mainWt + distWt).toFixed(2)),
        totalSteelWtTon: Number(((mainWt + distWt) / 1000).toFixed(4)),
      });
    }
  }, [
    slabLength,
    slabWidth,
    slabThickness,
    mainDia,
    mainSpacing,
    distDia,
    distSpacing,
    topCover,
    bottomCover,
    sideCover,
    onStateChange,
  ]);

  const parse = (v: string) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
  const L = parse(slabLength);
  const W = parse(slabWidth);
  const mDia = parse(mainDia);
  const mSpc = parse(mainSpacing) / 1000;
  const dDia = parse(distDia);
  const dSpc = parse(distSpacing) / 1000;
  const cSide = parse(sideCover) / 1000;
  
  const shortSpan = Math.min(L, W);
  const longSpan = Math.max(L, W);
  
  const mainBarsCount = mSpc > 0 && longSpan > 2 * cSide ? Math.ceil((longSpan - 2 * cSide) / mSpc) + 1 : 0;
  const mainBarCuttingLen = shortSpan > 2 * cSide ? shortSpan - 2 * cSide : 0;
  const mainWt = mainBarsCount * mainBarCuttingLen * (Math.pow(mDia, 2) / 162.28);
  
  const distBarsCount = dSpc > 0 && shortSpan > 2 * cSide ? Math.ceil((shortSpan - 2 * cSide) / dSpc) + 1 : 0;
  const distBarCuttingLen = longSpan > 2 * cSide ? longSpan - 2 * cSide : 0;
  const distWt = distBarsCount * distBarCuttingLen * (Math.pow(dDia, 2) / 162.28);
  const totalSteelWtKg = mainWt + distWt;
  
  const results: SlabSteelResults = {
    mainBarsCount,
    mainTotalWeight: Number(mainWt.toFixed(2)),
    distBarsCount,
    distTotalWeight: Number(distWt.toFixed(2)),
    totalSteelWtKg: Number(totalSteelWtKg.toFixed(2)),
    totalSteelWtTon: Number((totalSteelWtKg / 1000).toFixed(4)),
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden mt-6 shadow-sm">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-transparent dark:bg-slate-800/50">
        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Steel Reinforcement Settings
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 px-4 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
            <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-4">
              Main Bars (Bottom • Short Span)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
                  Diameter ({isSI ? "mm" : "in"})
                  <Tooltip content={`Standard unit is ${isSI ? "mm" : "in"}. Larger diameter exponentially increases total steel weight.`} />
                </label>
                <input
                  type="number"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
                  value={mainDia}
                  onChange={(e) => setMainDia(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
                  Spacing c/c ({isSI ? "mm" : "in"})
                  <Tooltip content={`Center-to-center distance (${isSI ? "mm" : "in"}). Smaller spacing requires more bars, increasing total weight.`} />
                </label>
                <input
                  type="number"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
                  value={mainSpacing}
                  onChange={(e) => setMainSpacing(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="bg-transparent dark:bg-slate-800/30 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
              Distribution Bars (Top/Cross)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
                  Diameter ({isSI ? "mm" : "in"})
                  <Tooltip content={`Standard unit is ${isSI ? "mm" : "in"}. Larger diameter exponentially increases total steel weight.`} />
                </label>
                <input
                  type="number"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
                  value={distDia}
                  onChange={(e) => setDistDia(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
                  Spacing c/c ({isSI ? "mm" : "in"})
                  <Tooltip content={`Center-to-center distance (${isSI ? "mm" : "in"}). Smaller spacing requires more bars, increasing total weight.`} />
                </label>
                <input
                  type="number"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
                  value={distSpacing}
                  onChange={(e) => setDistSpacing(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Top Cover ({isSI ? "mm" : "in"})
              </label>
              <input
                type="number"
                value={topCover}
                onChange={(e) => setTopCover(e.target.value)}
                className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Bot Cover ({isSI ? "mm" : "in"})
              </label>
              <input
                type="number"
                value={bottomCover}
                onChange={(e) => setBottomCover(e.target.value)}
                className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Side Cover ({isSI ? "mm" : "in"})
              </label>
              <input
                type="number"
                value={sideCover}
                onChange={(e) => setSideCover(e.target.value)}
                className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex-1 bg-transparent dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center px-4 py-3 border border-slate-100 dark:border-slate-700 relative min-h-[250px]">
            {/* SVG Visual representing cross section */}
            <svg
              viewBox="0 0 400 150"
              className="w-full max-w-[300px] h-full object-contain"
            >
              {/* Slab Outline */}
              <rect
                x="20"
                y="20"
                width="360"
                height="110"
                className="fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600"
                strokeWidth="2"
              />
              {/* Main Bars (Bottom) */}
              <line
                x1="45"
                y1="105"
                x2="355"
                y2="105"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle
                cx="355"
                cy="105"
                r="4"
                className="fill-indigo-600 dark:fill-indigo-400"
              />
              <circle
                cx="45"
                cy="105"
                r="4"
                className="fill-indigo-600 dark:fill-indigo-400"
              />
              {/* Dist Bars (Top perpendicular) */}
              {[60, 100, 140, 180, 220, 260, 300, 340].map((cx, i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy="95"
                  r="5"
                  className="fill-rose-500 dark:fill-rose-400"
                />
              ))}
              {/* Labels */}
              <text
                x="200"
                y="85"
                fontSize="12"
                className="fill-rose-600 dark:fill-rose-400"
                textAnchor="middle"
                fontWeight="bold"
              >
                Dist. Bars
              </text>
              <text
                x="200"
                y="125"
                fontSize="12"
                className="fill-indigo-600 dark:fill-indigo-400"
                textAnchor="middle"
                fontWeight="bold"
              >
                Main Bars
              </text>
              {/* Cover lines */}
              <line
                x1="200"
                y1="20"
                x2="200"
                y2="35"
                className="stroke-slate-500 dark:stroke-slate-400"
                strokeWidth="1"
                strokeDasharray="2"
              />
              <text
                x="205"
                y="32"
                fontSize="10"
                className="fill-slate-500 dark:fill-slate-400"
              >
                {topCover}{isSI ? "mm" : "in"} Cover
              </text>
              <line
                x1="200"
                y1="115"
                x2="200"
                y2="130"
                className="stroke-slate-500 dark:stroke-slate-400"
                strokeWidth="1"
                strokeDasharray="2"
              />
              <text
                x="205"
                y="125"
                fontSize="10"
                className="fill-slate-500 dark:fill-slate-400"
              >
                {bottomCover}{isSI ? "mm" : "in"}
              </text>
            </svg>
            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Cross Section View
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            
          </div>
        </div>
      </div>
      <CalculationHistory
        calculatorId="slab_steel_v1"
        currentInputs={{ slabLength, slabWidth, slabThickness, mainDia, mainSpacing, distDia, distSpacing, topCover, bottomCover, sideCover }}
        currentResults={{ mainBarsCount: results.mainBarsCount, mainTotalWeight: results.mainTotalWeight, distBarsCount: results.distBarsCount, distTotalWeight: results.distTotalWeight, totalSteelWtKg: results.totalSteelWtKg, totalSteelWtTon: results.totalSteelWtTon }}
        summaryGeneration={(inputs, res) => `Slab Steel ${inputs.slabLength}x${inputs.slabWidth}`}
        onRestore={(inputs) => {
          if (inputs.mainDia !== undefined) setMainDia(inputs.mainDia);
          if (inputs.mainSpacing !== undefined) setMainSpacing(inputs.mainSpacing);
          if (inputs.distDia !== undefined) setDistDia(inputs.distDia);
          if (inputs.distSpacing !== undefined) setDistSpacing(inputs.distSpacing);
          if (inputs.topCover !== undefined) setTopCover(inputs.topCover);
          if (inputs.bottomCover !== undefined) setBottomCover(inputs.bottomCover);
          if (inputs.sideCover !== undefined) setSideCover(inputs.sideCover);
        }}
      />
    </div>
  );
}
