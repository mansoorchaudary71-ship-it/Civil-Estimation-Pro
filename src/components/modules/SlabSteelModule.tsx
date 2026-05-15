import React, { useState, useEffect } from "react";

import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { Save } from "lucide-react";
import { CalculationHistory } from "../ui/CalculationHistory";
import { Layers, Info } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const Tooltip = ({ content }: { content: string }) => (
  <div className="relative group inline-flex ml-1.5 align-middle">
    <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-help" />
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1 flex items-center">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
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
          <div className="flex-1 bg-transparent dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center px-4 py-3 border border-slate-100 dark:border-slate-700 relative min-h-[300px]">
            {/* SVG Visual representing top-down view */}
            <svg
              viewBox="0 0 400 300"
              className="w-full max-w-[400px] h-full object-contain overflow-visible"
            >
              {(() => {
                const viewboxW = 400;
                const viewboxH = 300;
                const pad = 50; 
                const maxW = viewboxW - 2 * pad;
                const maxH = viewboxH - 2 * pad;

                const L_val = L > 0 ? L : 1;
                const W_val = W > 0 ? W : 1;

                const scaleX = maxW / L_val;
                const scaleY = maxH / W_val;
                const vScale = Math.min(scaleX, scaleY);

                const slabPxW = L_val * vScale;
                const slabPxH = W_val * vScale;

                const startX = (viewboxW - slabPxW) / 2;
                const startY = (viewboxH - slabPxH) / 2;
                
                const isLLong = L_val >= W_val;
                const mainIsVertical = isLLong; 
                
                const mainThick = Math.max(1.5, Math.min(4, mDia / 4));
                const distThick = Math.max(1, Math.min(3, dDia / 4));

                const renderBars = (
                  isMain: boolean, 
                  count: number, 
                  isVertical: boolean, 
                  actualSpacing: number,
                  thickness: number,
                  className: string
                ) => {
                  if(count === 0) return { lines: null, isSimplified: false };
                  const lines = [];
                  const cSidePx = cSide * vScale;
                  const startBase = isVertical ? startX : startY;
                  const extent = isVertical ? slabPxW : slabPxH;
                  const orthoStart = isVertical ? startY : startX;
                  const orthoExtent = isVertical ? slabPxH : slabPxW;
                  
                  const drawLimit = 40;
                  let stepPx = actualSpacing * vScale;
                  let drawCount = count;
                  let isSimplified = false;

                  if (count > drawLimit) {
                    drawCount = drawLimit;
                    stepPx = (extent - 2 * cSidePx) / (drawCount - 1);
                    isSimplified = true;
                  }
                  
                  for (let i = 0; i < drawCount; i++) {
                    let pos = startBase + cSidePx + i * stepPx;
                    if (pos > startBase + extent - cSidePx) {
                       pos = startBase + extent - cSidePx;
                    }
                    const ortho1 = orthoStart + cSidePx;
                    const ortho2 = orthoStart + orthoExtent - cSidePx;
                    lines.push(
                      <line
                        key={`${isMain ? "m" : "d"}-${i}`}
                        x1={isVertical ? pos : ortho1}
                        y1={isVertical ? ortho1 : pos}
                        x2={isVertical ? pos : ortho2}
                        y2={isVertical ? ortho2 : pos}
                        strokeWidth={thickness}
                        className={className}
                        strokeLinecap="round"
                      />
                    );
                  }
                  return { lines, isSimplified };
                };

                const { lines: mainLines, isSimplified: mSimp } = renderBars(
                  true, mainBarsCount, mainIsVertical, mSpc, mainThick, "stroke-indigo-600 dark:stroke-indigo-400"
                );
                
                const { lines: distLines, isSimplified: dSimp } = renderBars(
                  false, distBarsCount, !mainIsVertical, dSpc, distThick, "stroke-rose-500 dark:stroke-rose-400 opacity-80"
                );

                return (
                  <>
                    <rect
                      x={startX}
                      y={startY}
                      width={slabPxW}
                      height={slabPxH}
                      className="fill-slate-200/50 dark:fill-slate-700/50 stroke-slate-300 dark:stroke-slate-600"
                      strokeWidth="2"
                      rx="2"
                    />
                    
                    {/* Main Bars */}
                    {mainLines}
                    
                    {/* Dist Bars */}
                    {distLines}

                    {/* L Dimension */}
                    <line
                      x1={startX}
                      y1={startY - 15}
                      x2={startX + slabPxW}
                      y2={startY - 15}
                      className="stroke-slate-400 dark:stroke-slate-500"
                      strokeWidth="1"
                    />
                    <line x1={startX} y1={startY - 20} x2={startX} y2={startY - 10} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
                    <line x1={startX + slabPxW} y1={startY - 20} x2={startX + slabPxW} y2={startY - 10} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
                    <text
                      x={startX + slabPxW / 2}
                      y={startY - 25}
                      fontSize="11"
                      className="fill-slate-600 dark:fill-slate-300"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      L = {L} {isSI ? "m" : "ft"}
                    </text>

                    {/* W Dimension */}
                    <line
                      x1={startX - 15}
                      y1={startY}
                      x2={startX - 15}
                      y2={startY + slabPxH}
                      className="stroke-slate-400 dark:stroke-slate-500"
                      strokeWidth="1"
                    />
                    <line x1={startX - 20} y1={startY} x2={startX - 10} y2={startY} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
                    <line x1={startX - 20} y1={startY + slabPxH} x2={startX - 10} y2={startY + slabPxH} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
                    <text
                      x={startX - 25}
                      y={startY + slabPxH / 2 + 4}
                      fontSize="11"
                      className="fill-slate-600 dark:fill-slate-300"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      W = {W} {isSI ? "m" : "ft"}
                    </text>
                    
                    {/* Legend */}
                    <g transform="translate(10, 280)">
                      <line x1="0" y1="0" x2="20" y2="0" strokeWidth="3" className="stroke-indigo-600 dark:stroke-indigo-400" />
                      <text x="25" y="4" fontSize="10" className="fill-slate-600 dark:fill-slate-400">Main: {mainBarsCount} no's (dia {mainDia})</text>
                    </g>
                    <g transform="translate(200, 280)">
                      <line x1="0" y1="0" x2="20" y2="0" strokeWidth="3" className="stroke-rose-500 dark:stroke-rose-400" />
                      <text x="25" y="4" fontSize="10" className="fill-slate-600 dark:fill-slate-400">Dist: {distBarsCount} no's (dia {distDia})</text>
                    </g>
                    
                    {(mSimp || dSimp) && (
                      <text x={viewboxW / 2} y="260" fontSize="9" className="fill-slate-400 text-center" textAnchor="middle">
                        *Visualization simplified for large number of bars
                      </text>
                    )}
                  </>
                );
              })()}
            </svg>
            <div className="mt-4 text-center">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium tracking-wide uppercase">
                Slab Top-Down View
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
