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
} from "lucide-react";
import ShareButtonWithPopup from "./ShareMenu";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import SlabSteelModule, { SlabSteelResults } from "./SlabSteelModule";
import { useSettings } from "../../context/SettingsContext";
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
  const [activeType, setActiveType] = useState<StructureType>("Simple Slab");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
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
  /* mm */ const [colRoundBarsCount, setColRoundBarsCount] =
    useState<string>("6");
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
        "Main Bars Wt (kg)": `${mainWt}`,
        "Dist Bars Wt (kg)": `${distWt}`,
        "Extra Wt (kg)": `${extraWt}`,
      };
    } else {
      /* Columns */ const H = parse(colHeight);
      const W = parse(colWidth) / 1000;
      /* m */ const D = parse(colDepth) / 1000;
      /* m */ const diaM = parse(colDia) / 1000;
      /* m */ const c = parse(colCover) / 1000;
      /* m */ const mainDia = parse(colMainBarDia);
      const tieDia = parse(colTieDia);
      const tieSpc = parse(colTieSpacing) / 1000;
      let noOfBars = 4;
      if (activeType === "6 Bar Column") noOfBars = 6;
      else if (activeType === "8 Bar Column") noOfBars = 8;
      else if (activeType === "Round Column")
        noOfBars = parse(colRoundBarsCount);
      if (activeType === "Round Column") {
        concreteVol = (Math.PI / 4) * diaM * diaM * H;
        const mainWt = noOfBars * H * ((mainDia * mainDia) / 162.28);
        const tiesCount = Math.ceil(H / (tieSpc || 1)) + 1;
        const tieLen = Math.PI * (diaM - 2 * c);
        const tieWt = tiesCount * tieLen * ((tieDia * tieDia) / 162.28);
        totalSteelKg = mainWt + tieWt;
        inputsUsed = {
          "Height (m)": `${H}`,
          "Diameter (mm)": `${diaM * 1000}`,
          "Main Bars": `${noOfBars} of ${mainDia}mm`,
          "Tie Dia (mm)": `${tieDia}`,
          "Tie Spacing (mm)": `${tieSpc * 1000}`,
          "Cover (mm)": `${c * 1000}`,
        };
      } else {
        concreteVol = W * D * H;
        const mainWt = noOfBars * H * ((mainDia * mainDia) / 162.28);
        const tiesCount = Math.ceil(H / (tieSpc || 1)) + 1;
        const tieLen = 2 * (W - 2 * c + (D - 2 * c)) + 0.1;
        /* 100mm for hook */ const tieWt =
          tiesCount * tieLen * ((tieDia * tieDia) / 162.28);
        let extraTiesWt = 0;
        if (noOfBars > 4) {
          /* For 6 or 8 bars, more ties are often required (cross ties or diamond) */ extraTiesWt =
            tieWt * 0.5;
        }
        totalSteelKg = mainWt + tieWt + extraTiesWt;
        inputsUsed = {
          "Height (m)": `${H}`,
          "Cross-section": `${W * 1000} x ${D * 1000} mm`,
          "Main Bars": `${noOfBars} of ${mainDia}mm`,
          "Tie Dia (mm)": `${tieDia}`,
          "Tie Spacing (mm)": `${tieSpc * 1000}`,
          "Cover (mm)": `${c * 1000}`,
        };
      }
    }
    return { concreteVol, totalSteelKg, inputsUsed };
  };
  const { concreteVol, totalSteelKg, inputsUsed } = useMemo(calculate, [
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
    "Concrete Volume": `${concreteVol.toFixed(3)} m³`,
    "Total Steel": `${totalSteelKg.toFixed(2)} kg`,
    "Steel Tonnage": `${(totalSteelKg / 1000).toFixed(3)} Metric Tons`,
  };
  return (
    <div
      className={
        isEmbedded
          ? "w-full"
          : "w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8"
      }
    >
      <div className={isEmbedded ? "w-full" : "max-w-6xl mx-auto"}>
        {!isEmbedded && (
          <>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Spline className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              RCC Structure Calculator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Estimate concrete volume and steel reinforcement for standard
              structural elements.
            </p>
          </>
        )}
        {/* Types Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {structureTypes.map((t) => {
            const Icon = t.icon;
            const isActive = activeType === t.id;
            const baseColor = t.color.split("-")[1];
            return (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`relative flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-[16px] transition-all duration-200 overflow-hidden group hover:border-[color:var(--theme-color)] hover:bg-[color:var(--theme-bg-light)] ${isActive ? "shadow-sm" : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}`}
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
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: "var(--theme-bg)",
                    color: "var(--theme-color)",
                    filter: isActive
                      ? "drop-shadow(0 0 20px color-mix(in srgb, var(--theme-color) 25%, transparent))"
                      : undefined,
                  }}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-extrabold text-center leading-tight tracking-wide z-10 ${isActive ? "" : "text-slate-600 dark:text-slate-400 group-hover:[color:var(--theme-color-hover)]"}`}
                  style={{
                    color: isActive ? "var(--theme-color-hover)" : undefined,
                  }}
                >
                  {t.label}
                </span>
              </button>
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
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Length (m)
                      </label>
                      <input
                        type="number"
                        value={slabLength}
                        onChange={(e) => setSlabLength(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Width (m)
                      </label>
                      <input
                        type="number"
                        value={slabWidth}
                        onChange={(e) => setSlabWidth(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Slab Thickness (m)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={slabThickness}
                        onChange={(e) => setSlabThickness(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
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
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Column Height (m)
                    </label>
                    <input
                      type="number"
                      value={colHeight}
                      onChange={(e) => setColHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Clear Cover ({isSI ? "mm" : "in"})
                    </label>
                    <input
                      type="number"
                      value={colCover}
                      onChange={(e) => setColCover(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {activeType === "Round Column" ? (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Diameter ({isSI ? "mm" : "in"})
                      </label>
                      <input
                        type="number"
                        value={colDia}
                        onChange={(e) => setColDia(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Width ({isSI ? "mm" : "in"})
                        </label>
                        <input
                          type="number"
                          value={colWidth}
                          onChange={(e) => setColWidth(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Depth ({isSI ? "mm" : "in"})
                        </label>
                        <input
                          type="number"
                          value={colDepth}
                          onChange={(e) => setColDepth(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
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
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        No. of Main Bars
                      </label>
                      <input
                        type="number"
                        value={colRoundBarsCount}
                        onChange={(e) => setColRoundBarsCount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Main Bar Dia ({isSI ? "mm" : "in"})
                    </label>
                    <input
                      type="number"
                      value={colMainBarDia}
                      onChange={(e) => setColMainBarDia(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Stirrup / Tie Dia ({isSI ? "mm" : "in"})
                    </label>
                    <input
                      type="number"
                      value={colTieDia}
                      onChange={(e) => setColTieDia(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Tie Spacing ({isSI ? "mm" : "in"})
                    </label>
                    <input
                      type="number"
                      value={colTieSpacing}
                      onChange={(e) => setColTieSpacing(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1.5 font-bold focus:ring-2 focus:ring-indigo-500"
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
                  <span className="block text-indigo-300 text-xs font-bold uppercase mb-2">
                    Concrete Volume
                  </span>
                  <span className="text-4xl font-black text-white">
                    {concreteVol.toFixed(3)}
                    <span className="text-xl text-indigo-400 ml-2">
                      m³
                    </span>
                  </span>
                </div>
                <div className="bg-indigo-900/60 p-6 rounded-2xl border border-indigo-800">
                  <span className="block text-indigo-300 text-xs font-bold uppercase mb-2">
                    Total Steel Weight
                  </span>
                  <span className="text-5xl font-black text-emerald-400">
                    {totalSteelKg.toFixed(2)}
                    <span className="text-2xl text-indigo-400 ml-3">
                      kg
                    </span>
                  </span>
                  <div className="mt-3 text-sm font-semibold text-indigo-300">
                    ≈ {(totalSteelKg / 1000).toFixed(3)} Metric Tons
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <ShareButtonWithPopup
                activeTab="RCC Calculator"
                title={`${activeType} Estimate`}
                data={exportData}
                exportFormat={{ inputs: inputsUsed, breakdown: exportData }}
              />
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
                        "My RccStructureCalculator Estimate",
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
                  {isSaving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Save to Profile
                    </>
                  )}
                </button>
              )}
              {saveMessage && (
                <span className="text-sm font-bold text-green-400 ml-4">
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
