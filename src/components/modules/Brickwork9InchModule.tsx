import React, { useState, useMemo } from "react";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";

import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { Save } from "lucide-react";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";
import { StyledChart } from "../ui/EstimateVisualizer";
import {
  Columns,
  Settings,
  MinusSquare,
  Box,
  Droplets,
  Layers,
  Construction,
} from "lucide-react";
import { useGlobalSettings } from "../../context/SettingsContext";

const STANDARD_BRICK = { l: 0.23, w: 0.11, h: 0.075 };
/* in m (9" x 4.3" x 3") */ const MODULAR_BRICK = { l: 0.19, w: 0.09, h: 0.09 };
/* in m */ const MORTAR_THICKNESS = 0.01;
/* 10mm mortar */ const MIX_RATIOS: Record<string, { c: number; s: number }> = {
  "1:3": { c: 1, s: 3 },
  "1:4": { c: 1, s: 4 },
  "1:6": { c: 1, s: 6 },
};

export default function Brickwork9InchModule({ hideHistory = false }: { hideHistory?: boolean }) {
  const { currentUnit } = useGlobalSettings();
  const isSI = currentUnit === "Metric";

  const [brickType, setBrickType] = useState<"standard" | "modular">(
    "standard",
  );
  const [wallLength, setWallLength] = useState<string>("5");
  const [wallHeight, setWallHeight] = useState<string>("3");
  const [deductions, setDeductions] = useState<string>("0");
  const [mixRatio, setMixRatio] = useState<string>("1:4");
  const [includeWastage, setIncludeWastage] = useState<boolean>(true);

  React.useEffect(() => {
    if (isSI) {
      setWallLength("5");
      setWallHeight("3");
      setDeductions("0");
    } else {
      setWallLength("16");
      setWallHeight("10");
      setDeductions("0");
    }
  }, [isSI]);

  /* 9 inch is roughly 0.23m */ const THICKNESS = 0.23;

  const results = useMemo(() => {
    let l = parseFloat(wallLength) || 0;
    let h = parseFloat(wallHeight) || 0;
    let ded = parseFloat(deductions) || 0;

    // Convert from imperial if needed to metric for base calculations
    if (!isSI) {
      l = l * CIVIL_CONSTANTS.FT_TO_M; // ft to m
      h = h * CIVIL_CONSTANTS.FT_TO_M; // ft to m
      ded = ded * 0.092903; // sq.ft to m2
    }

    const grossArea = l * h;
    const netArea = Math.max(0, grossArea - ded);
    const netVolume = netArea * THICKNESS;
    const brick = brickType === "standard" ? STANDARD_BRICK : MODULAR_BRICK;
    /* Volume of 1 brick with mortar */ const brickVolWithMortar =
      (brick.l + MORTAR_THICKNESS) *
      (brick.w + MORTAR_THICKNESS) *
      (brick.h + MORTAR_THICKNESS);
    /* Volume of 1 brick without mortar */ const brickVolWithoutMortar =
      brick.l * brick.w * brick.h;
    /* Number of bricks */ let noOfBricks = netVolume / brickVolWithMortar;
    if (includeWastage) {
      noOfBricks = noOfBricks * 1.1; /* 10% wastage for bricks  */
    }
    noOfBricks = Math.ceil(noOfBricks);
    /* Total volume of bricks without mortar */ const volumeOfBricks =
      noOfBricks * brickVolWithoutMortar;
    /* Wet mortar volume */ let wetMortarVol = netVolume - volumeOfBricks;
    if (wetMortarVol < 0) wetMortarVol = 0;
    /* fallback // Dry mortar volume (approx 33% more) */ let dryMortarVol =
      wetMortarVol * 1.33;
    if (includeWastage) {
      dryMortarVol = dryMortarVol * 1.1; /* 10% wastage for mortar */
    }
    const ratio = MIX_RATIOS[mixRatio];
    const totalRatio = ratio.c + ratio.s;
    /* Cement in m3 */ const cementM3 = (dryMortarVol * ratio.c) / totalRatio;
    /* 1 bag = 0.0347 m3 */ const cementBags = Math.ceil(cementM3 / 0.0347);
    /* Sand in m3 -> convert to cft */ const sandM3 =
      (dryMortarVol * ratio.s) / totalRatio;
    const sandCft = sandM3 * 35.3147;

    return {
      netVolume: isSI ? netVolume : netVolume * 35.3147, // display unit volume
      netVolumeM3: netVolume,
      volumeOfBricksM3: volumeOfBricks,
      volumeOfBricksDisplay: isSI ? volumeOfBricks : volumeOfBricks * 35.3147,
      wetMortarVolM3: wetMortarVol,
      noOfBricks,
      wetMortarVol: isSI ? wetMortarVol : wetMortarVol * 35.3147,
      dryMortarVol: isSI ? dryMortarVol : dryMortarVol * 35.3147,
      cementBags,
      sandCft,
      sandM3,
      isSI
    };
  }, [wallLength, wallHeight, deductions, brickType, mixRatio, includeWastage, isSI]);
  const explanationOpts = useMemo(() => {
    let l = parseFloat(wallLength) || 0;
    let h = parseFloat(wallHeight) || 0;
    let ded = parseFloat(deductions) || 0;
    let hasInputs = !!(l || h);

    if (!hasInputs) {
      return {
        hasInputs: false,
        genericFormula: [
          { label: "Volume of Wall", formula: "Length × Height × Thickness" },
          { label: "No. of Bricks", formula: "Volume of Wall / Volume of 1 Brick with Mortar" },
          { label: "Dry Mortar", formula: "Total Mortar Volume × 1.33" }
        ],
        notes: ["1.33 is the dry volume conversion factor for mortar", "Standard Mortar Joint is 10mm"]
      };
    }

    return {
      hasInputs: true,
      activeBreakdown: [
        { label: "Gross Wall Area", formula: `${l} × ${h}`, result: `${(l * h).toFixed(2)} ${isSI ? "m²" : "sq.ft"}` },
        { label: "Net Volume", formula: `(Gross Area - Deductions) × ${isSI ? '0.23m' : '0.75ft'}`, result: `${results.netVolume.toFixed(2)} ${isSI ? "m³" : "cft"}` },
        { label: "Bricks", formula: `Net Volume / Brick Vol.`, result: `${results.noOfBricks.toLocaleString()} pcs` },
      ],
      notes: ["1.33 is the dry volume conversion factor for mortar"]
    };
  }, [wallLength, wallHeight, deductions, results, isSI]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-md mt-4">
      <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between bg-transparent dark:bg-slate-800/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Brickwork Estimator
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Calculate bricks, cement, and sand for a 9-inch wall.
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 bg-transparent dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
          Load Bearing (230mm)
        </span>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Inputs Column */}
          <div className="space-y-8">
            {/* Wall Dimensions Section */}
            <section>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                Wall Dimensions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                    Length ({results.isSI ? 'm' : 'ft'})
                  </label>
                  <input
                    type="number"
                    value={wallLength}
                    onChange={(e) => setWallLength(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                    Height ({results.isSI ? 'm' : 'ft'})
                  </label>
                  <input
                    type="number"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
                    placeholder="e.g. 3"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                    Deductions ({results.isSI ? 'm²' : 'sq.ft'})
                  </label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
                    placeholder="e.g. 1.5"
                  />
                </div>
              </div>
            </section>

            {/* Specifications Section */}
            <section>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                    Brick Size
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button
                      onClick={() => setBrickType("standard")}
                      className={`flex flex-col items-start justify-center py-3 px-4 text-sm font-bold rounded-xl transition-all border ${brickType === "standard" ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-200 hover:bg-orange-50/50"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${brickType === "standard" ? "border-orange-500" : "border-slate-300"}`}>
                          {brickType === "standard" && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                        </div>
                        <span>Standard</span>
                      </div>
                      <span className={`text-[11px] font-medium ml-6 ${brickType === "standard" ? "text-orange-600/80 dark:text-orange-400/80" : "text-slate-700 dark:text-slate-300"}`}>
                        230 × 110 × 75 mm
                      </span>
                    </button>
                    <button
                      onClick={() => setBrickType("modular")}
                      className={`flex flex-col items-start justify-center py-3 px-4 text-sm font-bold rounded-xl transition-all border ${brickType === "modular" ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-200 hover:bg-orange-50/50"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${brickType === "modular" ? "border-orange-500" : "border-slate-300"}`}>
                          {brickType === "modular" && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                        </div>
                        <span>Modular</span>
                      </div>
                      <span className={`text-[11px] font-medium ml-6 ${brickType === "modular" ? "text-orange-600/80 dark:text-orange-400/80" : "text-slate-700 dark:text-slate-300"}`}>
                        190 × 90 × 90 mm
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                      Mortar Ratio (Cement:Sand)
                    </label>
                    <div className="relative">
                      <select
                        value={mixRatio}
                        onChange={(e) => setMixRatio(e.target.value)}
                        className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all cursor-pointer font-bold"
                      >
                        <option value="1:3">1:3 (Rich Mix)</option>
                        <option value="1:4">1:4 (Standard Mix)</option>
                        <option value="1:6">1:6 (Lean Mix)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-700 dark:text-slate-300">
                        <Settings className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <label className="relative flex cursor-pointer items-center rounded-full p-1 border border-orange-100 hover:bg-orange-50/50 transition-colors">
                  <input
                    type="checkbox"
                    className="peer cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 checked:before:bg-orange-500 w-5 h-5 ml-1"
                    checked={includeWastage}
                    onChange={(e) => setIncludeWastage(e.target.checked)}
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 ml-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </label>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none" onClick={() => setIncludeWastage(!includeWastage)}>
                  Include 10% Wastage (Bricks & Mortar)
                </span>
              </div>
            </section>
          </div>

          {/* Results Column */}
          <div className="relative">
            <div className="sticky top-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden flex flex-col h-full">
              <div className="px-6 py-5 bg-transparent dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/50 text-center">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1.5">
                  Net Wall Volume
                </p>
                <div className="flex items-center justify-center gap-1.5 text-slate-800 dark:text-white">
                  <span className="text-3xl font-black">
                    {results.netVolume.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    {results.isSI ? 'm³' : 'cft'}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6 flex-1 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-800/50">
                {/* Total Bricks Highlight */}
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-5 border border-orange-100 dark:border-orange-900/30 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Box className="w-5 h-5 text-orange-600" />
                    <h4 className="text-[11px] font-bold text-orange-600/80 dark:text-orange-400 uppercase tracking-widest">
                      Total Bricks Estimated
                    </h4>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-4xl font-black text-orange-600 dark:text-orange-400">
                      {results.noOfBricks.toLocaleString()}
                    </p>
                    <span className="text-base font-bold text-orange-500/70 mt-2">
                      pcs
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cement Result */}
                  <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Construction className="w-4 h-4 text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                        Cement
                      </h4>
                    </div>
                    <div className="flex items-end gap-1">
                      <p className="text-2xl font-black text-slate-800 dark:text-white">
                        {results.cementBags}
                      </p>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                        bags
                      </span>
                    </div>
                  </div>

                  {/* Sand Result */}
                  <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Layers className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                        Sand
                      </h4>
                    </div>
                    <div>
                      <div className="flex items-end gap-1">
                        <p className="text-2xl font-black text-slate-800 dark:text-white">
                          {results.sandCft.toFixed(1)}
                        </p>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                          cft
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                        {((results.sandCft || 0) / 35.3147).toFixed(2)} m³
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="px-6 py-4 bg-transparent dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-center text-center">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  Dry Mortar: {results.dryMortarVol.toFixed(3)} {results.isSI ? 'm³' : 'cft'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            
          </div>
        </div>
      </div>
      {!hideHistory && (
        <CalculationHistory
          calculatorId="brickwork_9inch_v1"
          currentInputs={{ brickType, wallLength, wallHeight, deductions, mixRatio, includeWastage }}
          currentResults={{ noOfBricks: results.noOfBricks, cementBags: results.cementBags, sandCft: results.sandCft }}
          summaryGeneration={(inputs, res) => `9in Brickwork Area ${inputs.wallLength}x${inputs.wallHeight}`}
          explanation={explanationOpts}
          onRestore={(inputs) => {
            if (inputs.brickType) setBrickType(inputs.brickType);
            if (inputs.wallLength !== undefined) setWallLength(inputs.wallLength);
            if (inputs.wallHeight !== undefined) setWallHeight(inputs.wallHeight);
            if (inputs.deductions !== undefined) setDeductions(inputs.deductions);
            if (inputs.mixRatio !== undefined) setMixRatio(inputs.mixRatio);
            if (inputs.includeWastage !== undefined) setIncludeWastage(inputs.includeWastage);
          }}
        />
      )}
    </div>
  );
}
