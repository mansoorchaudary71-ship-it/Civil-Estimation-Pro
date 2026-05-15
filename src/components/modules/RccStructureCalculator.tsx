import React, { useState, useMemo } from "react";
import {
  Calculator,
  Box,
  Layers,
  Columns,
  Circle,
  Square,
  Hammer,
  AlignVerticalSpaceAround,
  Spline,
  Save,
  Info,
} from "lucide-react";

import ColorfulTab from "../ui/ColorfulTab";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import SlabSteelModule, { SlabSteelResults } from "./SlabSteelModule";
import { useSettings } from "../../context/SettingsContext";
import { SEO } from "../SEO";

const Tooltip = ({ content }: { content: string }) => (
  <div className="relative group inline-flex ml-1.5 align-middle">
    <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-slate-900 text-white text-[11px] font-normal rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[5px] border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

type StructureType =
  | "Simple Slab"
  | "One Way Slab"
  | "Two Way Slab"
  | "4 Bar Column"
  | "6 Bar Column"
  | "8 Bar Column"
  | "Round Column";
export default function RccStructureCalculator({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
}) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const unitSystem = settings.measurement === "SI" ? "metric" : "imperial";
  const isSI = unitSystem === "metric";
  const [activeType, setActiveType] = useState<StructureType>("Simple Slab");
  
  
  /* Slab Inputs */ const [slabLength, setSlabLength] = useState<string>("5");
  /* m */ const [slabWidth, setSlabWidth] = useState<string>("4");
  /* m */ const [slabThickness, setSlabThickness] = useState<string>("0.15");
  /* m */ const [slabSteelResults, setSlabSteelResults] =
    useState<SlabSteelResults | null>(null);
  /* Column Inputs */ const [colHeight, setColHeight] = useState<string>("3");
  /* m */ const [colWidth, setColWidth] = useState<string>("300");
  /* mm */ const [colDepth, setColDepth] = useState<string>("300");
  /* mm */ const [colDia, setColDia] = useState<string>("300");
  /* mm */ const [colMainBarDia, setColMainBarDia] = useState<string>("16");
  /* mm */ const [colTieDia, setColTieDia] = useState<string>("8");
  /* mm */ const [colTieSpacing, setColTieSpacing] = useState<string>("150");
  /* mm */ const [colCover, setColCover] = useState<string>("40");
  /* mm */ const [colRoundBarsCount, setColRoundBarsCount] = useState<string>("6");
  const [steelGrade, setSteelGrade] = useState<string>("Fe500");
  const [concreteGrade, setConcreteGrade] = useState<string>("M20");

  const structureTypes: {
    id: StructureType;
    label: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: "Simple Slab",
      label: "Simple Slab",
      icon: Layers,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20",
    },
    {
      id: "One Way Slab",
      label: "One Way Slab",
      icon: AlignVerticalSpaceAround,
      color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20",
    },
    {
      id: "Two Way Slab",
      label: "Two Way Slab",
      icon: Box,
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20",
    },
    {
      id: "4 Bar Column",
      label: "4 Bar Column",
      icon: Columns,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      id: "6 Bar Column",
      label: "6 Bar Column",
      icon: Columns,
      color: "text-teal-500 bg-teal-100 dark:bg-teal-500/20",
    },
    {
      id: "8 Bar Column",
      label: "8 Bar Column",
      icon: Columns,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20",
    },
    {
      id: "Round Column",
      label: "Round Column",
      icon: Circle,
      color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20",
    },
  ];
  const calculate = () => {
    let concreteVol = 0;
    /* m³ */ let totalSteelKg = 0;
    /* kg */ let inputsUsed: Record<string, string> = {};
    let steelBreakdown: { label: string; details: string; weight: number; tooltip: string }[] = [];
    const parse = (v: string) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
    if (activeType.includes("Slab")) {
      const L = parse(slabLength);
      const W = parse(slabWidth);
      const T = parse(slabThickness);
      concreteVol = L * W * T;
      const isOneWay = activeType === "One Way Slab";
      const isTwoWay = activeType === "Two Way Slab";
      let mainWt = slabSteelResults?.mainTotalWeight || 0;
      let distWt = slabSteelResults?.distTotalWeight || 0;
      let extraWt = 0;
      if (isTwoWay) {
        /* Approximate extra weight for two-way bending / crank bars */ extraWt =
          mainWt * 0.15;
      }
      totalSteelKg = mainWt + distWt + extraWt;
      inputsUsed = {
        "Length (m)": `${L}`,
        "Width (m)": `${W}`,
        "Thickness (m)": `${T}`,
        "Main Bars Wt (kg)": `${mainWt.toFixed(2)}`,
        "Dist Bars Wt (kg)": `${distWt.toFixed(2)}`,
        "Extra Wt (kg)": `${extraWt.toFixed(2)}`,
      };
      
      steelBreakdown.push({
        label: "Main Bars",
        details: `${slabSteelResults?.mainBarsCount || 0} bars`,
        weight: mainWt,
        tooltip: "Primary reinforcement resisting bending moment."
      });
      steelBreakdown.push({
        label: "Distribution Bars",
        details: `${slabSteelResults?.distBarsCount || 0} bars`,
        weight: distWt,
        tooltip: "Secondary reinforcement for shrinkage and temperature."
      });
      if (extraWt > 0) {
        steelBreakdown.push({
          label: "Extra / Crank Bars",
          details: "Est. 15% for Two-way",
          weight: extraWt,
          tooltip: "Additional reinforcement for negative moments."
        });
      }
    } else {
      /* Columns */ const H = parse(colHeight);
      const W = parse(colWidth) / 1000;
      /* m */ const D = parse(colDepth) / 1000;
      /* m */ const diaM = parse(colDia) / 1000;
      /* m */ const c = parse(colCover) / 1000;
      /* m */ const mainDia = parse(colMainBarDia);
      const tieDia = parse(colTieDia);
      const tieSpc = parse(colTieSpacing) / 1000;
      
      // Determine lap multiplier based on grade (heuristic for IS 456)
      // Standard lap is 50d for Fe500, 40d for Fe415, etc.
      let lapDMultiplier = 50;
      if (steelGrade === 'Fe415' || steelGrade === 'Grade 40') lapDMultiplier = 40;
      if (steelGrade === 'Fe550') lapDMultiplier = 55;
      
      const lapLengthPerLap = lapDMultiplier * mainDia / 1000; // in meters
      // Let's assume standard bar length is 12m, but typically a column has at least one lap per floor if extending, or we add one lap if height > 6m.
      // For simplicity, we add lap length proportional to height if H > 12, but standard practice is 1 lap per story or continuous. 
      // We will add 1 lap length per bar as a standard overlap allowance for multi-story estimation or calculate proportional laps.
      const lapsRequired = Math.floor(H / 12);
      const totalLapLengthPerBar = lapsRequired > 0 ? (lapsRequired * lapLengthPerLap) : lapLengthPerLap; 
      // adding one safety lap is common in estimation to maintain continuity
      
      const mainCuttingLength = H + totalLapLengthPerBar;

      let noOfBars = 4;
      if (activeType === "6 Bar Column") noOfBars = 6;
      else if (activeType === "8 Bar Column") noOfBars = 8;
      else if (activeType === "Round Column")
        noOfBars = parse(colRoundBarsCount);
        
      let mainWt = 0;
      let tieWt = 0;
      let extraTiesWt = 0;
      
      if (activeType === "Round Column") {
        concreteVol = (Math.PI / 4) * diaM * diaM * H;
        mainWt = noOfBars * mainCuttingLength * ((mainDia * mainDia) / 162.28);
        const tiesCount = Math.ceil(H / (tieSpc || 1)) + 1;
        // Circular stirrup length: Pi * (D - 2c) + 24d hook
        const tieLen = Math.PI * (diaM - 2 * c) + (24 * tieDia) / 1000;
        tieWt = tiesCount * tieLen * ((tieDia * tieDia) / 162.28);
        totalSteelKg = mainWt + tieWt;
        inputsUsed = {
          "Height (m)": `${H}`,
          "Diameter (mm)": `${diaM * 1000}`,
          "Main Bars": `${noOfBars} of ${mainDia}mm`,
          "Tie Dia (mm)": `${tieDia}`,
          "Tie Spacing (mm)": `${tieSpc * 1000}`,
          "Cover (mm)": `${c * 1000}`,
          "Steel Grade": steelGrade,
        };
        steelBreakdown.push({
          label: "Vertical Main Bars",
          details: `${noOfBars} bars of Ø${mainDia} (includes lap = ${lapLengthPerLap.toFixed(2)}m/bar)`,
          weight: mainWt,
          tooltip: `Cutting Length = Height + Laps (${lapDMultiplier}d). Main longitudinal reinforcement.`
        });
        steelBreakdown.push({
          label: "Spiral / Circular Ties",
          details: `Ø${tieDia} @ ${tieSpc*1000}mm c/c`,
          weight: tieWt,
          tooltip: "Lateral ties providing shear reinforcement. Cutting length includes hook."
        });
      } else {
        concreteVol = W * D * H;
        mainWt = noOfBars * mainCuttingLength * ((mainDia * mainDia) / 162.28);
        const tiesCount = Math.ceil(H / (tieSpc || 1)) + 1;
        
        // Rectangular Stirrup cutting length L = 2(A + B) + 24d
        const A = W - 2 * c;
        const B = D - 2 * c;
        const tieLen = 2 * (A + B) + (24 * tieDia) / 1000;
        
        tieWt = tiesCount * tieLen * ((tieDia * tieDia) / 162.28);
        if (noOfBars > 4) {
          /* For 6 or 8 bars, more ties are required (cross ties or diamond) */ 
          // Approximate extra ties weight 
          extraTiesWt = tieWt * 0.5;
        }
        totalSteelKg = mainWt + tieWt + extraTiesWt;
        inputsUsed = {
          "Height (m)": `${H}`,
          "Cross-section": `${W * 1000} x ${D * 1000} mm`,
          "Main Bars": `${noOfBars} of ${mainDia}mm`,
          "Tie Dia (mm)": `${tieDia}`,
          "Tie Spacing (mm)": `${tieSpc * 1000}`,
          "Cover (mm)": `${c * 1000}`,
          "Steel Grade": steelGrade,
        };
        steelBreakdown.push({
          label: "Vertical Main Bars",
          details: `${noOfBars} bars of Ø${mainDia} (includes lap = ${lapLengthPerLap.toFixed(2)}m/bar)`,
          weight: mainWt,
          tooltip: `Cutting Length = Height + Laps (${lapDMultiplier}d).`
        });
        steelBreakdown.push({
          label: "Lateral Ties",
          details: `Ø${tieDia} @ ${tieSpc*1000}mm c/c`,
          weight: tieWt,
          tooltip: "Perimeter shear reinforcement. Evaluated using L = 2(A + B) + 24d (Includes hook and bend deductions)."
        });
        if (extraTiesWt > 0) {
          steelBreakdown.push({
            label: "Cross / Inner Ties",
            details: "For interior bars",
            weight: extraTiesWt,
            tooltip: "Additional ties to confine bars spaced more than 150mm apart."
          });
        }
      }

      const sizeWeights: Record<string, number> = {};
      sizeWeights[`Ø${mainDia}mm`] = (sizeWeights[`Ø${mainDia}mm`] || 0) + mainWt;
      sizeWeights[`Ø${tieDia}mm`] = (sizeWeights[`Ø${tieDia}mm`] || 0) + tieWt + extraTiesWt;

      Object.entries(sizeWeights).forEach(([size, w]) => {
        if (w > 0) {
          steelBreakdown.push({
            label: `Total ${size}`,
            details: "Grouped by size",
            weight: w,
            tooltip: `Total weight for all ${size} bars.`
          });
        }
      });
    }
    return { concreteVol, totalSteelKg, inputsUsed, steelBreakdown };
  };
  const { concreteVol, totalSteelKg, inputsUsed, steelBreakdown } = useMemo(calculate, [
    activeType,
    slabLength,
    slabWidth,
    slabThickness,
    slabSteelResults,
    colHeight,
    colWidth,
    colDepth,
    colDia,
    colMainBarDia,
    colTieDia,
    colTieSpacing,
    colCover,
    colRoundBarsCount,
  ]);
  const exportData = {
    "Concrete Volume": `${(concreteVol || 0).toFixed(3)} m³`,
    "Total Steel": `${(totalSteelKg || 0).toFixed(2)} kg`,
    "Steel Tonnage": `${((totalSteelKg || 0) / 1000).toFixed(3)} Metric Tons`,
  };
  return (
    <div
      className={
        isEmbedded
          ? "w-full"
          : "w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8"
      }
    >
      {!isEmbedded && (
        <SEO 
          title="RCC Structure Calculator" 
          description="Calculate concrete volume and steel reinforcement weight for slabs and columns." 
          canonicalUrl="https://civilestimationpro.com/rcc-calculator" 
        />
      )}
      <div className={isEmbedded ? "w-full" : "max-w-6xl mx-auto"}>
        {!isEmbedded && (
          <>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Spline className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              RCC Structure Calculator
            </h1>
            <p className="text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 mb-8 font-medium">
              Estimate concrete volume and steel reinforcement for standard
              structural elements.
            </p>
          </>
        )}
        {/* Types Grid */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 p-1">
          {structureTypes.map((t) => {
            const Icon = t.icon;
            const baseColor = t.color.split("-")[1];
            return (
              <ColorfulTab
                key={t.id}
                id={t.id}
                label={t.label}
                icon={<Icon className="w-4 h-4" />}
                isActive={activeType === t.id}
                onClick={() => setActiveType(t.id)}
                colorTheme={baseColor as any}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-xl mb-6">
              {activeType} Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {activeType.includes("Slab") && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        Length (m)
                      </label>
                      <input
                        type="number"
                        value={slabLength}
                        onChange={(e) => setSlabLength(e.target.value)}
                        className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Width (m)
                      </label>
                      <input
                        type="number"
                        value={slabWidth}
                        onChange={(e) => setSlabWidth(e.target.value)}
                        className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Slab Thickness (m)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={slabThickness}
                        onChange={(e) => setSlabThickness(e.target.value)}
                        className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <SlabSteelModule
                      slabLength={slabLength}
                      slabWidth={slabWidth}
                      slabThickness={slabThickness}
                      onStateChange={setSlabSteelResults}
                    />
                  </div>
                </>
              )}
              {!activeType.includes("Slab") && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Column Height (m)
                    </label>
                    <input
                      type="number"
                      value={colHeight}
                      onChange={(e) => setColHeight(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Clear Cover ({isSI ? "mm" : "in"})
                    </label>
                    <input
                      type="number"
                      value={colCover}
                      onChange={(e) => setColCover(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Steel Grade
                      <Tooltip content="Used to calculate lap lengths (e.g. 50d for Fe500)." />
                    </label>
                    <select
                      value={steelGrade}
                      onChange={(e) => setSteelGrade(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Fe415">Fe415 / Grade 40 (40d Lap)</option>
                      <option value="Fe500">Fe500 / Grade 60 (50d Lap)</option>
                      <option value="Fe550">Fe550 (55d Lap)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Concrete Grade
                      <Tooltip content="M20, M25, M30. Indicates compressive strength." />
                    </label>
                    <select
                      value={concreteGrade}
                      onChange={(e) => setConcreteGrade(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="M15">M15 (1:2:4)</option>
                      <option value="M20">M20 (1:1.5:3)</option>
                      <option value="M25">M25 (1:1.2:2)</option>
                      <option value="M30">M30 (Design Mix)</option>
                    </select>
                  </div>
                  {activeType === "Round Column" ? (
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Diameter ({isSI ? "mm" : "in"})
                      </label>
                      <input
                        type="number"
                        value={colDia}
                        onChange={(e) => setColDia(e.target.value)}
                        className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                          Width ({isSI ? "mm" : "in"})
                        </label>
                        <input
                          type="number"
                          value={colWidth}
                          onChange={(e) => setColWidth(e.target.value)}
                          className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                          Depth ({isSI ? "mm" : "in"})
                        </label>
                        <input
                          type="number"
                          value={colDepth}
                          onChange={(e) => setColDepth(e.target.value)}
                          className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2 pt-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b pb-2">
                      Steel Details
                    </h4>
                  </div>
                  {activeType === "Round Column" && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        No. of Main Bars
                      </label>
                      <input
                        type="number"
                        value={colRoundBarsCount}
                        onChange={(e) => setColRoundBarsCount(e.target.value)}
                        className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase flex items-center">
                      Main Bar Dia ({isSI ? "mm" : "in"})
                      <Tooltip content={`Standard unit is ${isSI ? "mm" : "in"}. Larger diameter exponentially increases total steel weight.`} />
                    </label>
                    <input
                      type="number"
                      value={colMainBarDia}
                      onChange={(e) => setColMainBarDia(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase flex items-center">
                      Stirrup / Tie Dia ({isSI ? "mm" : "in"})
                      <Tooltip content={`Standard unit is ${isSI ? "mm" : "in"}. Used for shear reinforcement.`} />
                    </label>
                    <input
                      type="number"
                      value={colTieDia}
                      onChange={(e) => setColTieDia(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase flex items-center">
                      Tie Spacing ({isSI ? "mm" : "in"})
                      <Tooltip content={`Center-to-center distance (${isSI ? "in mm" : "in inches"}). Smaller spacing requires more ties, increasing weight.`} />
                    </label>
                    <input
                      type="number"
                      value={colTieSpacing}
                      onChange={(e) => setColTieSpacing(e.target.value)}
                      className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Results Section */}
          <div className="lg:col-span-5 bg-indigo-950 border border-indigo-900 rounded-[2rem] p-6 lg:p-10 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-indigo-300 text-sm uppercase tracking-widest mb-8">
                Calculated Results
              </h3>
              <div className="space-y-6">
                <div className="bg-indigo-900/60 p-6 rounded-2xl border border-indigo-800">
                  <div className="flex items-center mb-2 group relative w-fit">
                    <span className="block text-indigo-300 text-xs font-bold uppercase cursor-help">
                      Concrete Volume
                    </span>
                    <Info className="w-3.5 h-3.5 ml-1.5 text-indigo-400 cursor-help" />
                    <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-max max-w-[280px] p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl text-xs font-medium normal-case text-slate-200 z-50">
                      <strong>Formula:</strong><br />
                      {activeType.includes("Slab") 
                        ? "Volume = Length × Width × Thickness."
                        : activeType === "Round Column" 
                        ? "Volume = π × (Diameter/2)² × Height."
                        : "Volume = Width × Depth × Height."}
                      <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                    </div>
                  </div>
                  <span className="text-4xl font-black text-white">
                    {(concreteVol || 0).toFixed(3)}
                    <span className="text-xl text-indigo-400 ml-2">
                      m³
                    </span>
                  </span>
                </div>
                <div className="bg-indigo-900/60 p-6 rounded-2xl border border-indigo-800">
                  <div className="flex items-center mb-2 group relative w-fit">
                    <span className="block text-indigo-300 text-xs font-bold uppercase cursor-help">
                      Total Steel Weight
                    </span>
                    <Info className="w-3.5 h-3.5 ml-1.5 text-indigo-400 cursor-help" />
                    <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-max max-w-[280px] p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl text-xs font-medium normal-case text-slate-200 z-50">
                      <strong>Formula:</strong><br />
                      {activeType.includes("Slab") 
                        ? "Total Weight = Main Bars + Distribution Bars + Extra (if Two-Way)."
                        : "Total Weight = Main Vertical Bars + Lateral Ties/Stirrups."}
                      <br /><br />
                      <span className="text-slate-700 dark:text-slate-300">Unit Weight = d² / 162.28 kg/m.</span>
                      <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                    </div>
                  </div>
                  <span className="text-5xl font-black text-emerald-400">
                    {(totalSteelKg || 0).toFixed(2)}
                    <span className="text-2xl text-indigo-400 ml-3">
                      kg
                    </span>
                  </span>
                  <div className="mt-3 text-sm font-semibold text-indigo-300">
                    ≈ {((totalSteelKg || 0) / 1000).toFixed(3)} Metric Tons
                  </div>
                </div>

                <div className="bg-indigo-900/40 rounded-2xl border border-indigo-800/60 overflow-x-auto p-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-indigo-900/80 text-indigo-300 rounded-xl">
                      <tr>
                        <th className="px-4 py-3 font-semibold w-1/3 rounded-tl-xl">Element</th>
                        <th className="px-4 py-3 font-semibold w-1/3">Details</th>
                        <th className="px-4 py-3 text-right font-semibold w-1/3 rounded-tr-xl">Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-800/40 text-slate-200">
                      {steelBreakdown.map((item, idx) => (
                        <tr key={idx} className={`transition-colors ${item.label.startsWith('Total Ø') ? 'bg-indigo-800/30 font-semibold' : 'hover:bg-indigo-800/20'}`}>
                          <td className="px-4 py-3">
                            <span className="flex items-center font-medium">
                              {item.label}
                              <Tooltip content={item.tooltip} />
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{item.details}</td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-400">{item.weight.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
