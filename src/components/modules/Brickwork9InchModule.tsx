import React, { useState, useMemo } from "react";
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

export default function Brickwork9InchModule() {
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
      l = l * 0.3048; // ft to m
      h = h * 0.3048; // ft to m
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
      noOfBricks,
      wetMortarVol: isSI ? wetMortarVol : wetMortarVol * 35.3147,
      dryMortarVol: isSI ? dryMortarVol : dryMortarVol * 35.3147,
      cementBags,
      sandCft,
      sandM3,
      isSI
    };
  }, [wallLength, wallHeight, deductions, brickType, mixRatio, includeWastage, isSI]);
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm mt-4">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <Columns className="w-5 h-5 text-orange-600 dark:text-orange-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            9-Inch Brickwork Estimator
          </h3>
        </div>
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full">
          Load Bearing (230mm)
        </span>
      </div>
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Brick Type Toggle */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Brick Size Standard
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full">
              <button
                onClick={() => setBrickType("standard")}
                className={`flex-1 flex flex-col xl:flex-row items-center justify-center py-2 px-1 xl:gap-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center h-full ${brickType === "standard" ? "bg-white dark:bg-slate-700 text-orange-600 shadow border border-slate-200/50 dark:border-slate-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
              >
                <span>Standard</span>
                <span className="opacity-75 text-[10px] xl:text-xs font-medium">
                  (230x110x75)
                </span>
              </button>
              <button
                onClick={() => setBrickType("modular")}
                className={`flex-1 flex flex-col xl:flex-row items-center justify-center py-2 px-1 xl:gap-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center h-full ${brickType === "modular" ? "bg-white dark:bg-slate-700 text-orange-600 shadow border border-slate-200/50 dark:border-slate-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
              >
                <span>Modular</span>
                <span className="opacity-75 text-[10px] xl:text-xs font-medium">
                  (190x90x90)
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Wall Length ({results.isSI ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                value={wallLength}
                onChange={(e) => setWallLength(e.target.value)}
                className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Wall Height ({results.isSI ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
                placeholder="e.g. 3"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1">
                <MinusSquare className="w-3.5 h-3.5" /> Deductions ({results.isSI ? 'm²' : 'sq.ft'})
              </label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
                placeholder="For doors/windows"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Mortar Ratio
              </label>
              <div className="relative">
                <select
                  value={mixRatio}
                  onChange={(e) => setMixRatio(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all cursor-pointer font-medium"
                >
                  <option value="1:3">1:3 (Rich Mix)</option>
                  <option value="1:4">1:4 (Standard Mix)</option>
                  <option value="1:6">1:6 (Lean Mix)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <Settings className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-orange-50/50 dark:bg-orange-900/10 px-4 py-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
            <input
              type="checkbox"
              id="wastage-toggle"
              checked={includeWastage}
              onChange={(e) => setIncludeWastage(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
            />
            <label
              htmlFor="wastage-toggle"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Include 10% Wastage (Bricks & Mortar)
            </label>
          </div>
        </div>
        {/* Output Section */}
        <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-3 md:px-4 py-3 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Net Wall Volume
            </p>
            <div className="flex items-baseline gap-2 text-slate-800 dark:text-white">
              <span className="text-4xl font-black">
                {results.netVolume.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-slate-500">
                {results.isSI ? 'm³' : 'cft'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap sm:gap-4 items-center w-full">
            <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Box className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">
                  Total Bricks
                </h4>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {results.noOfBricks.toLocaleString()}
                <span className="text-sm text-slate-500 font-medium">
                  pcs
                </span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Construction className="w-5 h-5 text-slate-500" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">
                  Cement
                </h4>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {results.cementBags}
                <span className="text-sm text-slate-500 font-medium">
                  bags
                </span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sm:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">
                  Sand Required
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {results.sandCft.toFixed(1)}
                  <span className="text-sm text-slate-500 font-medium">
                    cft
                  </span>
                </p>
                <div className="hidden sm:block w-px self-stretch bg-slate-200 dark:bg-slate-700"></div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {((results.sandCft || 0) / 35.3147).toFixed(2)}
                  <span className="text-sm text-slate-500 font-medium">
                    m³
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-200/50 dark:bg-slate-800 p-3 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-400" /> Dry Mortar Required:
            {results.dryMortarVol.toFixed(3)} {results.isSI ? 'm³' : 'cft'} | Wet:
            {results.wetMortarVol.toFixed(3)} {results.isSI ? 'm³' : 'cft'}
          </div>
        </div>
      </div>
    </div>
  );
}
