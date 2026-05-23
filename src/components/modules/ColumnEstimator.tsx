import React, { useState } from "react";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";
import {
  Columns,
  CircleDashed,
  Square,
  Layers,
  Droplets,
  Settings2,
  CopySlash
} from "lucide-react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";
import ColorfulTab from "../ui/ColorfulTab";

const mixRatios: Record<string, { c: number; s: number; a: number }> = {
  "M10 (1:3:6)": { c: 1, s: 3, a: 6 },
  "M15 (1:2:4)": { c: 1, s: 2, a: 4 },
  "M20 (1:1.5:3)": { c: 1, s: 1.5, a: 3 },
  "M25 (1:1:2)": { c: 1, s: 1, a: 2 },
};

function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function CircularColumnInputs({
  diameter,
  setDiameter,
}: {
  diameter: string;
  setDiameter: (val: string) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
        Diameter (m)
      </label>
      <input
        type="number"
        className="w-full bg-white border border-gray-200 text-gray-800 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
        value={diameter}
        onChange={(e) => setDiameter(e.target.value)}
        placeholder="e.g. 0.4"
      />
    </div>
  );
}
function RectangularColumnInputs({
  length,
  width,
  setLength,
  setWidth,
  isSquare,
}: {
  length: string;
  width: string;
  setLength: (val: string) => void;
  setWidth: (val: string) => void;
  isSquare: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
          {isSquare ? "Side Length (m)" : "Length (m)"}
        </label>
        <input
          type="number"
          className="w-full bg-white border border-gray-200 text-gray-800 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          value={length}
          onChange={(e) => {
            setLength(e.target.value);
            if (isSquare) setWidth(e.target.value);
          }}
          placeholder="e.g. 0.3"
        />
      </div>
      {!isSquare && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
            Width (m)
          </label>
          <input
            type="number"
            className="w-full bg-white border border-gray-200 text-gray-800 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g. 0.3"
          />
        </div>
      )}
    </div>
  );
}
export default function ColumnEstimator() {
  const { settings } = useSettings();
  const [shape, setShape] = useState<"rectangular" | "square" | "circular">(
    "rectangular",
  );
  const [length, setLength] = useState("0.4");
  const [width, setWidth] = useState("0.6");
  const [diameter, setDiameter] = useState("0.4");
  const [height, setHeight] = useState("3.0");
  const [count, setCount] = useState("1");
  const [mix, setMix] = useState("M20 (1:1.5:3)");

  // Reinforcement States
  const [mainBarsCount, setMainBarsCount] = useState("8"); 
  const [mainDia, setMainDia] = useState("16");
  const [clearCover, setClearCover] = useState("40");
  const [tieDia, setTieDia] = useState("8");
  const [tieSpacing, setTieSpacing] = useState("150");
  const [variation8, setVariation8] = useState("1");
  const [variation10, setVariation10] = useState("1");

  const l = parseFloat(length) || 0;
  const w = shape === "square" ? l : parseFloat(width) || 0;
  const d = parseFloat(diameter) || 0;
  const h = parseFloat(height) || 0;
  const n = parseFloat(count) || 1;
  const c = parseFloat(clearCover) || 0;
  const dMain = parseFloat(mainDia) || 0;
  const dTie = parseFloat(tieDia) || 0;
  const sTie = parseFloat(tieSpacing) || 1;
  const numBars = parseInt(mainBarsCount) || 4;

  let vol = 0;
  if (shape === "circular") {
    vol = Math.PI * Math.pow(d / 2, 2) * h * n;
  } else {
    vol = l * w * h * n;
  }
  const dryVol = vol * CIVIL_CONSTANTS.DRY_CONCRETE_FACTOR;
  const ratio = mixRatios[mix];
  const totalRatio = ratio.c + ratio.s + ratio.a;
  const cementM3 = (dryVol * ratio.c) / totalRatio;
  const cementBags = Math.ceil(cementM3 / CIVIL_CONSTANTS.CEMENT_BAG_VOLUME_M3);
  const sandCft = ((dryVol * ratio.s) / totalRatio) * CIVIL_CONSTANTS.M3_TO_CFT;
  const aggCft = ((dryVol * ratio.a) / totalRatio) * CIVIL_CONSTANTS.M3_TO_CFT;

  // Reinforcement Calculations
  let totalTieWeight = 0;
  let mainSteelWeight = 0;
  let totalSteelWeight = 0;
  const tieTypes: { name: string; length: number; countPerSet: number }[] = [];
  let tieSetsCount = 0;

  if (h > 0 && sTie > 0 && dTie > 0 && dMain > 0) {
    const l_mm = l * 1000;
    const w_mm = w * 1000;
    const d_mm = d * 1000;

    tieSetsCount = Math.ceil((h * 1000) / sTie) + 1; // RULE: REBAR_SPACING_COUNT

    if (shape === "circular") {
      const coreDia = d_mm - 2 * c;
      const hoopLength = Math.PI * coreDia + 24 * dTie; // Outer circular hoop + hooks
      tieTypes.push({ name: "Circular Hoop", length: hoopLength, countPerSet: 1 });
    } else {
      const a = w_mm - 2 * c; // Note: w is width
      const b = l_mm - 2 * c; // l is length

      const outerTieLength = 2 * (a + b) + 24 * dTie; // RULE: RECTANGULAR_STIRRUP_LENGTH
      tieTypes.push({ name: "Outer Rectangular Tie", length: outerTieLength, countPerSet: 1 });

      if (numBars === 8) {
        if (variation8 === "1") {
          const diamondSide = Math.sqrt(Math.pow(a / 2, 2) + Math.pow(b / 2, 2));
          const diamondCutLength = 4 * diamondSide + 24 * dTie;
          tieTypes.push({ name: "Inner Diamond Tie", length: diamondCutLength, countPerSet: 1 });
        } else if (variation8 === "2") {
          const aMax = Math.max(a, b);
          const aMin = Math.min(a, b);
          const innerA = aMax / 3;
          const innerB = aMin;
          const innerRectLength = 2 * (innerA + innerB) + 24 * dTie;
          tieTypes.push({ name: "Inner Rectangular Tie", length: innerRectLength, countPerSet: 1 });
        } else if (variation8 === "3") {
          tieTypes.push({ name: "Link Tie (Parallel to Width)", length: a + 24 * dTie, countPerSet: 1 });
          tieTypes.push({ name: "Link Tie (Parallel to Length)", length: b + 24 * dTie, countPerSet: 1 });
        }
      } else if (numBars === 10) {
        if (variation10 === "1") {
          // Assuming 4 on long face, 3 on short face (which adds up to 10 if overlapping correctly but outer tie covers all. Standard is 4x3)
          // Based off our ten bar implementation
          tieTypes.push({ name: "Link/Cross Tie (Parallel to Width)", length: a + 24 * dTie, countPerSet: 2 });
          tieTypes.push({ name: "Link/Cross Tie (Parallel to Length)", length: b + 24 * dTie, countPerSet: 1 });
        } else if (variation10 === "2") {
          const innerA = a;
          const innerB = b / 2;
          const innerRectLength = 2 * (innerA + innerB) + 24 * dTie;
          tieTypes.push({ name: "Inner Rectangular Tie", length: innerRectLength, countPerSet: 1 });
          tieTypes.push({ name: "Link/Cross Tie (Parallel to Length)", length: b + 24 * dTie, countPerSet: 1 });
        }
      }
      // For 4 bars and 6 bars, we can just supply the outer rectangular tie as default
      // 6 bars usually requires one middle link tie
      if (numBars === 6) {
        const longestSide = Math.max(a, b);
        const shortestSide = Math.min(a, b);
        tieTypes.push({ name: "Link Tie (Mid)", length: shortestSide + 24 * dTie, countPerSet: 1 });
      }
    }

    const totalMainBarLength = numBars * h; 
    const mainUnitWeight = Math.pow(dMain, 2) / 162.28; // RULE: STEEL_WEIGHT_ESTIMATION
    mainSteelWeight = mainUnitWeight * totalMainBarLength * n; // multiply by n columns

    const tieUnitWeight = Math.pow(dTie, 2) / 162.28;
    tieTypes.forEach(tie => {
      const totalLengthM = (tie.length / 1000) * tie.countPerSet * tieSetsCount * n; // multiply by n columns
      totalTieWeight += totalLengthM * tieUnitWeight;
    });

    totalSteelWeight = mainSteelWeight + totalTieWeight;
  }
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-text-primary p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-black mb-2 flex items-center gap-3 text-text-primary">
              <Columns className="w-8 h-8 text-indigo-600 dark:text-blue-400" />
              Column Concrete Estimator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 font-medium">
              Calculate concrete volume and material breakdown for columns.
            </p>
          </div>
          <GlobalSettingsToggle align="left" showCurrency={false} />
        </div>
        <div className="bg-bg-card rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-border-color overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Shape Toggle Group */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Column Shape
              </label>
              <div className="flex overflow-x-auto pb-4 gap-2 mb-6 p-1">
                {(["rectangular", "square", "circular"] as const).map(
                  (s, idx) => (
                    <ColorfulTab index={idx} key={s}
                      id={s}
                      label={s.charAt(0).toUpperCase() + s.slice(1)}
                      isActive={shape === s}
                      onClick={() => setShape(s)}
                      colorTheme={s === 'rectangular' ? 'indigo' : s === 'square' ? 'teal' : 'amber'}
                      icon={s === "circular" ? <CircleDashed className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Dynamically Render Inputs */}
                {shape === "circular" ? (
                  <CircularColumnInputs
                    diameter={diameter}
                    setDiameter={setDiameter}
                  />
                ) : (
                  <RectangularColumnInputs
                    length={length}
                    width={width}
                    setLength={setLength}
                    setWidth={setWidth}
                    isSquare={shape === "square"}
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Height (m)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-transparent dark:bg-[#6B46C1]/50 border border-border-color text-text-primary rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Number of Columns
                    </label>
                    <input
                      type="number"
                      className="w-full bg-transparent dark:bg-[#6B46C1]/50 border border-border-color text-text-primary rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Concrete Mix
                  </label>
                  <select
                    className="w-full bg-transparent dark:bg-[#6B46C1]/50 border border-border-color text-text-primary rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)] appearance-none"
                    value={mix}
                    onChange={(e) => setMix(e.target.value)}
                  >
                    {Object.keys(mixRatios).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Visual Aid */}
              <div className="bg-transparent dark:bg-[#6B46C1] rounded-[12px] flex flex-col items-center justify-center px-4 py-3 border border-border-color/50 min-h-[300px]">
                <div
                  className="w-40 h-40 relative flex items-center justify-center text-blue-200 dark:text-blue-900 border-[8px] mb-6 shadow-inner transition-all duration-500 ease-in-out"
                  style={{
                    borderRadius:
                      shape === "circular"
                        ? "50%"
                        : shape === "square"
                          ? "1rem"
                          : "1rem",
                    borderColor: "currentColor",
                    width: shape === "rectangular" ? "160px" : "140px",
                    height: shape === "rectangular" ? "120px" : "140px",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-[#6B46C1]" />
                    <div className="absolute top-2 w-1 h-3 rounded-full bg-blue-300 dark:bg-[#6B46C1]" />
                    <div className="absolute bottom-2 w-1 h-3 rounded-full bg-blue-300 dark:bg-[#6B46C1]" />
                    <div className="absolute left-2 w-3 h-1 rounded-full bg-blue-300 dark:bg-[#6B46C1]" />
                    <div className="absolute right-2 w-3 h-1 rounded-full bg-blue-300 dark:bg-[#6B46C1]" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-text-primary capitalize">
                    {shape} Column Cross-Section
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                    {shape === "circular"
                      ? `Ø ${d}m`
                      : shape === "square"
                        ? `${l} × ${l}m`
                        : `${l} × ${w}m`}
                    <span className="mx-2">•</span> Height: {h}m
                  </p>
                </div>
              </div>
            </div>
            
            {/* Reinforcement Configuration */}
            <div className="pt-6 border-t border-border-color">
              <div className="flex items-center gap-2 mb-6">
                <CopySlash className="w-5 h-5 text-indigo-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-text-primary">Reinforcement Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Clear Cover (mm)">
                      <input
                        type="number"
                        min="0"
                        value={clearCover}
                        onChange={(e) => setClearCover(e.target.value)}
                        className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                      />
                    </InputGroup>
                    <InputGroup label="Number of Main Bars">
                      <select
                        value={mainBarsCount}
                        onChange={(e) => setMainBarsCount(e.target.value)}
                        className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                      >
                        <option value="4">4 Bars</option>
                        <option value="6">6 Bars</option>
                        <option value="8">8 Bars</option>
                        <option value="10">10 Bars</option>
                      </select>
                    </InputGroup>
                  </div>
                  <InputGroup label="Main Bar Diameter (mm)">
                    <select
                      value={mainDia}
                      onChange={(e) => setMainDia(e.target.value)}
                      className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                    >
                      {[12, 16, 20, 25, 32].map(d => (
                        <option key={d} value={d}>{d} mm</option>
                      ))}
                    </select>
                  </InputGroup>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Tie Diameter (mm)">
                      <select
                        value={tieDia}
                        onChange={(e) => setTieDia(e.target.value)}
                        className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                      >
                        {[8, 10, 12, 16].map(d => (
                          <option key={d} value={d}>{d} mm</option>
                        ))}
                      </select>
                    </InputGroup>
                    <InputGroup label="Tie Spacing c/c (mm)">
                      <input
                        type="number"
                        min="0"
                        value={tieSpacing}
                        onChange={(e) => setTieSpacing(e.target.value)}
                        className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                      />
                    </InputGroup>
                  </div>

                  {shape !== "circular" && mainBarsCount === "8" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <InputGroup label="8-Bar Tie Variation">
                        <select
                          value={variation8}
                          onChange={(e) => setVariation8(e.target.value)}
                          className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                        >
                          <option value="1">Outer Rect + Inner Diamond</option>
                          <option value="2">Outer Rect + Inner Rect (4x2 layout)</option>
                          <option value="3">Outer Rect + 2 Cross/Link Ties</option>
                        </select>
                      </InputGroup>
                    </div>
                  )}

                  {shape !== "circular" && mainBarsCount === "10" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <InputGroup label="10-Bar Tie Variation">
                        <select
                          value={variation10}
                          onChange={(e) => setVariation10(e.target.value)}
                          className="w-full h-11 bg-bg-primary/50 border border-border-color rounded-[12px] px-4 text-text-primary font-bold focus:ring-2 focus:ring-[#6B46C1] outline-none transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                        >
                          <option value="1">Outer Rect + 3 Link/Cross Ties</option>
                          <option value="2">Outer Rect + Inner Rect + 1 Link Tie</option>
                        </select>
                      </InputGroup>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex flex-col h-full pt-6 border-t border-border-color w-full mt-4">
              <MaterialSummary
                title="Estimate Results"
                totalLabel="Total Steel Weight"
                totalValue={totalSteelWeight.toFixed(2)}
                totalUnit="kg"
              >
                <div className="grid grid-cols-1 gap-6 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ResultCard
                      title="Concrete Volume (Wet)"
                      value={vol.toFixed(3)}
                      unit="m³"
                      variant="primary"
                    />
                    <ResultCard
                      title="Dry Concrete Volume"
                      value={dryVol.toFixed(3)}
                      unit="m³"
                      variant="neutral"
                    />
                  </div>
                  
                  <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300" />
                    Material Breakdown ({mix})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <ResultCard title="Cement" value={cementBags} unit="bags" variant="neutral" />
                    <ResultCard title="Sand" value={sandCft.toFixed(1)} unit="cft" variant="neutral" />
                    <ResultCard title="Aggregate" value={aggCft.toFixed(1)} unit="cft" variant="neutral" />
                  </div>
                  
                  <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-[4px] border-l-[#6B46C1] rounded-[12px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] mt-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <CopySlash className="w-5 h-5 text-[#6B46C1]" />
                      Steel Reinforcement Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-slate-50 dark:bg-[#6B46C1] p-3 rounded-[12px] border border-slate-100 dark:border-slate-700">
                            <span className="text-[#4B5563] text-xs uppercase tracking-wider block mb-0.5">Main ({numBars} Bars)</span>
                            <span className="font-semibold text-lg text-slate-800 dark:text-slate-100">{mainSteelWeight.toFixed(2)} kg</span>
                          </div>
                          <div className="bg-slate-50 dark:bg-[#6B46C1] p-3 rounded-[12px] border border-slate-100 dark:border-slate-700">
                            <span className="text-[#4B5563] text-xs uppercase tracking-wider block mb-0.5">Ties</span>
                            <span className="font-semibold text-lg text-slate-800 dark:text-slate-100">{totalTieWeight.toFixed(2)} kg</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-[#6B46C1]/50 rounded-[12px] p-4 border border-slate-200 dark:border-slate-700/50">
                        <p className="text-[#4B5563] text-xs uppercase tracking-wider mb-3">Tie Cut Length Breakdown ({tieSetsCount} sets per col)</p>
                        <ul className="space-y-2">
                          {tieTypes.map((tie, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white dark:bg-[#6B46C1] border border-slate-100 dark:border-slate-700 px-3 py-2 rounded-[12px] text-sm shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                              <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">{tie.name}</p>
                                <p className="text-xs text-[#4B5563]">{tie.countPerSet} per set</p>
                              </div>
                              <p className="font-bold text-slate-700 dark:text-slate-300">{tie.length.toFixed(0)} mm</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </MaterialSummary>
            </div>
          </div>
        </div>
      </div>
      <CalculationHistory
          calculatorId="column_v1"
          estimationName="Column Estimate"
          currentInputs={{ shape, diameter, length, width, height, mix, count }}
          currentResults={{ vol: vol.toFixed(2), cementBags, sandCft: sandCft.toFixed(2), aggCft: aggCft.toFixed(2) }}
          summaryGeneration={(inputs, res) => `Vol: ${res.vol} cft - Cement: ${res.cementBags} bags`}
          onRestore={(inputs) => {
            if (inputs.shape) setShape(inputs.shape);
            if (inputs.diameter) setDiameter(inputs.diameter);
            if (inputs.length) setLength(inputs.length);
            if (inputs.width) setWidth(inputs.width);
            if (inputs.height) setHeight(inputs.height);
            if (inputs.mix) setMix(inputs.mix);
            if (inputs.count) setCount(inputs.count);
          }}
      />
    </div>
  );
}
