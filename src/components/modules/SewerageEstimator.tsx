import React, { useState, useEffect } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import {
  Waves,
  Ruler,
  CircleDashed,
  ArrowDownRight,
  AlignVerticalJustifyStart,
  ArrowRight,
  ChevronDown,
  Plus,
  Droplet,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useTakeoff } from "../../context/TakeoffContext";
import ShareButtonWithPopup from "./ShareMenu";
import ManholeModule, { ManholeResults } from "./ManholeModule";
export default function SewerageEstimator() {
  const { boqItems, addBoqItem, updateBoqItem } = useTakeoff();
  const [openSection, setOpenSection] = useState<string>("manhole");
  const [mhResults, setMhResults] = useState<ManholeResults | null>(null);
  /* Trench State */ const [trenchLength, setTrenchLength] =
    useState<string>("100");
  const [trenchWidth, setTrenchWidth] = useState<string>("1.5");
  const [trenchDepth, setTrenchDepth] = useState<string>("2.5");
  const [trenchProfile, setTrenchProfile] = useState<"vertical" | "sloped">(
    "vertical",
  );
  const [trenchSlopeRatio, setTrenchSlopeRatio] = useState<string>("0.5");
  /* Horizontal : 1 Vertical // Backfill Calculation State */ const [
    pipeOuterDiameter,
    setPipeOuterDiameter,
  ] = useState<string>("0.4");
  /* m */ const [beddingDepth, setBeddingDepth] = useState<string>("0.2");
  /* m // Invert Level State */ const [startIL, setStartIL] =
    useState<string>("100");
  /* m */ const [ilLength, setIlLength] = useState<string>("50");
  /* m */ const [ilGradient, setIlGradient] = useState<string>("200");
  /* 1 in 200 // Pipe Sections State */ const [pipeLength, setPipeLength] =
    useState<string>("100");
  const [pipeSectionLen, setPipeSectionLen] = useState<string>("2.5");
  /* standard 2.5m RCC pipe // Hydraulic Flow State */ const [
    flowDia,
    setFlowDia,
  ] = useState<string>("0.3");
  /* m */ const [flowGradient, setFlowGradient] = useState<string>("200");
  /* 1 in X */ const [flowMaterial, setFlowMaterial] = useState<
    "pvc" | "concrete" | "cast_iron" | "clay"
  >("concrete");
  /* Pipe Bedding State */ const [beddingCalcLength, setBeddingCalcLength] =
    useState<string>("100");
  const [beddingCalcWidth, setBeddingCalcWidth] = useState<string>("1.5");
  const [beddingCalcPipeOD, setBeddingCalcPipeOD] = useState<string>("0.4");
  const [beddingType, setBeddingType] = useState<
    "classA" | "classB" | "classC"
  >("classB");
  const [beddingUnderPipe, setBeddingUnderPipe] = useState<string>("0.15");
  const [beddingHaunchHeight, setBeddingHaunchHeight] = useState<string>("0.2");
  /* Septic System State */ const [septicUsers, setSepticUsers] =
    useState<string>("5");
  const [septicDemand, setSepticDemand] = useState<string>("120");
  const [septicPercolation, setSepticPercolation] = useState<string>("30");
  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };
  /* Calculations */ const tL = parseFloat(trenchLength) || 0;
  const tW = parseFloat(trenchWidth) || 0;
  const tD = parseFloat(trenchDepth) || 0;
  const tSlope = parseFloat(trenchSlopeRatio) || 0;
  const pipeOD = parseFloat(pipeOuterDiameter) || 0;
  const bedD = parseFloat(beddingDepth) || 0;
  /* Trench Excavation */ let topWidth = tW;
  if (trenchProfile === "sloped") {
    topWidth = tW + 2 * (tSlope * tD);
  }
  const trenchVol = ((tW + topWidth) / 2) * tD * tL;
  /* Pipe Displacement Volume */ const pipeVol =
    Math.PI * Math.pow(pipeOD / 2, 2) * tL;
  /* Bedding Volume */ let topBeddingWidth = tW;
  if (trenchProfile === "sloped") {
    topBeddingWidth = tW + 2 * (tSlope * bedD);
  }
  const beddingVol = ((tW + topBeddingWidth) / 2) * bedD * tL;
  /* Net Backfill Volume */ const netBackfillVol = Math.max(
    0,
    trenchVol - pipeVol - beddingVol,
  );
  const sIL = parseFloat(startIL) || 0;
  const iL = parseFloat(ilLength) || 0;
  const iG = parseFloat(ilGradient) || 1;
  /* prevent divide by zero */ const drop = iG > 0 ? iL / iG : 0;
  const endIL = sIL - drop;
  const pL = parseFloat(pipeLength) || 0;
  const pS = parseFloat(pipeSectionLen) || 1;
  const pipeCount = pS > 0 ? Math.ceil(pL / pS) : 0;
  /* Hydraulic Flow Calculations */ const fD = parseFloat(flowDia) || 0;
  const fG = parseFloat(flowGradient) || 1;
  let n = 0.013;
  /* default concrete */ if (flowMaterial === "pvc") n = 0.009;
  else if (flowMaterial === "cast_iron") n = 0.014;
  else if (flowMaterial === "clay") n = 0.015;
  const hydraulicRadius = fD > 0 ? fD / 4 : 0;
  const slope = fG > 0 ? 1 / fG : 0;
  const flowVelocity =
    n > 0 && fD > 0 && fG > 0
      ? (1 / n) * Math.pow(hydraulicRadius, 2 / 3) * Math.pow(slope, 1 / 2)
      : 0;
  const flowArea = Math.PI * Math.pow(fD / 2, 2);
  const dischargeCapacityM3 = flowArea * flowVelocity;
  /* m3/s */ const dischargeCapacityL = dischargeCapacityM3 * 1000;
  /* L/s // Structural Pipe Bedding Calculations */ const calcBedLength =
    parseFloat(beddingCalcLength) || 0;
  const calcBedWidth = parseFloat(beddingCalcWidth) || 0;
  const calcBedPipeOD = parseFloat(beddingCalcPipeOD) || 0;
  const calcBedUnder = parseFloat(beddingUnderPipe) || 0;
  const calcBedHaunch = parseFloat(beddingHaunchHeight) || 0;
  let bedPipeDisplaced = 0;
  if (calcBedPipeOD > 0) {
    const R = calcBedPipeOD / 2;
    const h = Math.min(Math.max(calcBedHaunch, 0), calcBedPipeOD);
    /* clamp haunch height */ if (h >= calcBedPipeOD) {
      bedPipeDisplaced = Math.PI * R * R;
    } else if (h > 0) {
      const d = Math.abs(R - h);
      const theta = 2 * Math.acos(d / R);
      const segmentArea = ((R * R) / 2) * (theta - Math.sin(theta));
      if (h <= R) {
        bedPipeDisplaced = segmentArea;
      } else {
        bedPipeDisplaced = Math.PI * R * R - segmentArea;
      }
    }
  }
  /* Cross-sectional area = Trench Width * Total Depth - Pipe DisplacedArea */ const totalBedDepth =
    calcBedUnder + Math.min(calcBedPipeOD, Math.max(0, calcBedHaunch));
  const bedCrossSection = Math.max(
    0,
    calcBedWidth * totalBedDepth - bedPipeDisplaced,
  );
  const beddingCalculatedVol = bedCrossSection * calcBedLength;
  const beddingWeightTons =
    beddingType === "classB" || beddingType === "classC"
      ? beddingCalculatedVol * 1.6
      : 0;
  /* 1600 kg/m3 = 1.6 t/m3 // Septic System Calculations */ const sUsers =
    parseFloat(septicUsers) || 0;
  const sDemand = parseFloat(septicDemand) || 0;
  const sPerc = parseFloat(septicPercolation) || 1;
  /* L/m2/day */ const dailyFlowLiters = sUsers * sDemand;
  const dailyFlowM3 = dailyFlowLiters / 1000;
  /* Volume: 24h retention + sludge (assume ~40L per user per year for 2 years = 80L/user) */ const sludgeVolLiters =
    sUsers * 80;
  const septicTotalVolM3 = (dailyFlowLiters + sludgeVolLiters) / 1000;
  /* Dimensions (L = 2W) => 2W^2 * D = V -> W = sqrt(V / 2D) */ const septicDepth =
    Math.max(1, Math.min(2.5, Math.pow(septicTotalVolM3, 1 / 3)));
  /* dynamic depth between 1m and 2.5m */ const septicWidth =
    septicTotalVolM3 > 0 ? Math.sqrt(septicTotalVolM3 / (2 * septicDepth)) : 0;
  const septicLength = septicWidth * 2;
  const soakageAreaRequired = dailyFlowLiters / (sPerc > 0 ? sPerc : 1);
  const soakageDepth = Math.max(1.5, septicDepth + 0.5);
  /* soakage pit slightly deeper than tank */ const soakageDia =
    soakageAreaRequired > 0
      ? soakageAreaRequired / (Math.PI * soakageDepth)
      : 0;
  const handleAddPipesToBOQ = () => {
    if (pipeCount <= 0) return;
    const descStr = `Sewerage RCC Pipe (${pipeSectionLen}m sections)`;
    const existing = boqItems.find((item) => item.desc === descStr);
    if (existing) {
      if (existing.qtyOverride !== pipeCount) {
        updateBoqItem(existing.id, { qtyOverride: pipeCount });
      }
    } else {
      /* Also clean up any other length so they don't stack up */ const otherExisting =
        boqItems.find((item) => item.desc.startsWith("Sewerage RCC Pipe"));
      if (otherExisting) {
        updateBoqItem(otherExisting.id, {
          qtyOverride: pipeCount,
          desc: descStr,
        });
      } else {
        addBoqItem({
          desc: descStr,
          unit: "nos",
          rate: 2500,
          qtyOverride: pipeCount,
        });
      }
    }
  };
  useEffect(() => {
    if (pipeCount > 0) {
      const timeout = setTimeout(() => {
        handleAddPipesToBOQ();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [pipeCount, pipeSectionLen]);
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent pb-1">
            Sewerage & Drainage Calculator
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Calculate excavation volumes, manhole material, pipe sections, and
            invert levels for municipal infrastructure.
          </p>
          <div className="mt-5 w-fit">
            <GlobalSettingsToggle align="left" showCurrency={false} />
          </div>
        </header>
        <div className="space-y-4">
          {/* Manhole Material Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection("manhole")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <CircleDashed className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Manhole Calculator
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "manhole" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "manhole" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="border-t border-gray-50 bg-gray-50 flex">
                <ManholeModule onStateChange={setMhResults} />
              </div>
            </div>
          </div>
          {/* Trench Excavation Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection("trench")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlignVerticalJustifyStart className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Trench Excavation
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "trench" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "trench" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid grid-cols-2 gap-4 h-fit">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Length (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        value={trenchLength}
                        onChange={(e) => setTrenchLength(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Bottom Width (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        value={trenchWidth}
                        onChange={(e) => setTrenchWidth(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Depth (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        value={trenchDepth}
                        onChange={(e) => setTrenchDepth(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 mt-2 border-t border-gray-100 pt-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Trench Profile
                      </label>
                      <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                        <button
                          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${trenchProfile === "vertical" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                          onClick={() => setTrenchProfile("vertical")}
                        >
                          Vertical
                        </button>
                        <button
                          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${trenchProfile === "sloped" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                          onClick={() => setTrenchProfile("sloped")}
                        >
                          Sloped/Trapezoidal
                        </button>
                      </div>
                    </div>
                    {trenchProfile === "sloped" && (
                      <div className="col-span-2 -mt-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Side Slope Ratio (Horizontal:Vertical)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          placeholder="e.g. 0.5 for 1H:2V"
                          value={trenchSlopeRatio}
                          onChange={(e) => setTrenchSlopeRatio(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="col-span-2 mt-2 border-t border-gray-100 pt-4">
                      <h3 className="text-sm font-bold text-gray-800 mb-3">
                        Backfill Parameters
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                            Pipe Outer Dia (m)
                          </label>
                          <input
                            type="number"
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            value={pipeOuterDiameter}
                            onChange={(e) =>
                              setPipeOuterDiameter(e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                            Bedding Depth (m)
                          </label>
                          <input
                            type="number"
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            value={beddingDepth}
                            onChange={(e) => setBeddingDepth(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 px-4 py-3 rounded-2xl border border-amber-100 flex flex-col justify-center space-y-4">
                    <h3 className="text-amber-800 font-bold border-b border-amber-200 pb-2">
                      Excavation & Backfill
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-700 font-medium">
                        Total Excavation Vol
                      </span>
                      <span className="text-amber-900 font-bold text-xl">
                        {trenchVol.toFixed(2)} m³
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-700 font-medium">
                        Pipe Displacement Vol
                      </span>
                      <span className="text-amber-900 font-bold">
                        {pipeVol.toFixed(2)} m³
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-700 font-medium">
                        Bedding Volume
                      </span>
                      <span className="text-amber-900 font-bold">
                        {beddingVol.toFixed(2)} m³
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-amber-200 pt-3 mt-2">
                      <span className="text-amber-800 font-bold text-base">
                        Net Backfill Volume
                      </span>
                      <span className="text-amber-900 font-black text-2xl">
                        {netBackfillVol.toFixed(2)} m³
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Invert Level Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection("il")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Invert Level (IL) Calculator
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "il" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "il" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Starting IL (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={startIL}
                        onChange={(e) => setStartIL(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Length (m)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={ilLength}
                          onChange={(e) => setIlLength(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Gradient (1 in X)
                        </label>
                        <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 overflow-hidden">
                          <div className="px-3 text-sm text-gray-400 font-medium">
                            1 :
                          </div>
                          <input
                            type="number"
                            className="w-full flex-1 bg-transparent text-gray-800 py-3 pr-4 focus:outline-none"
                            value={ilGradient}
                            onChange={(e) => setIlGradient(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 px-4 py-3 rounded-2xl border border-blue-100 flex flex-col justify-center">
                    <div className="text-blue-800 text-sm font-semibold mb-1">
                      Ending Invert Level
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black text-blue-600 tracking-tighter">
                        {endIL.toFixed(3)}
                      </span>
                      <span className="text-xl font-medium text-blue-500 mb-1">
                        m
                      </span>
                    </div>
                    <div className="text-blue-600/70 text-sm mt-3 font-medium">
                      Drop:
                      <strong className="text-blue-700">
                        {drop.toFixed(3)} m
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Pipe Sections Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection("pipe")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Waves className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Pipe Count Calculator
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "pipe" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "pipe" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 h-fit">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Total Run Length (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={pipeLength}
                        onChange={(e) => setPipeLength(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        One Pipe Section Length (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={pipeSectionLen}
                        onChange={(e) => setPipeSectionLen(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="bg-indigo-50 px-4 py-3 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                    <div className="text-indigo-800 text-sm font-semibold mb-1">
                      Required Pipes
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-indigo-600 tracking-tighter leading-none">
                          {pipeCount}
                        </span>
                        <span className="text-lg font-medium text-indigo-500">
                          sections
                        </span>
                      </div>
                      <button
                        onClick={handleAddPipesToBOQ}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">Add to BOQ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Pipe Bedding Calculator Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden mb-8">
            <button
              onClick={() => toggleSection("bedding")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Pipe Bedding Calculator
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "bedding" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "bedding" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 h-fit">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Trench Length (m)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          value={beddingCalcLength}
                          onChange={(e) => setBeddingCalcLength(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Trench Width (m)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          value={beddingCalcWidth}
                          onChange={(e) => setBeddingCalcWidth(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Pipe Outer Dia (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        value={beddingCalcPipeOD}
                        onChange={(e) => setBeddingCalcPipeOD(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Bedding Type / Class
                      </label>
                      <select
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                        value={beddingType}
                        onChange={(e) => setBeddingType(e.target.value as any)}
                      >
                        <option value="classA">
                          Class A (Concrete Cradle/Arch)
                        </option>
                        <option value="classB">
                          Class B (Granular Bedding)
                        </option>
                        <option value="classC">
                          Class C (Granular Shaped Bottom)
                        </option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Depth Under Pipe (m)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          value={beddingUnderPipe}
                          onChange={(e) => setBeddingUnderPipe(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Haunching HT (m)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          value={beddingHaunchHeight}
                          onChange={(e) =>
                            setBeddingHaunchHeight(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 px-4 py-3 rounded-2xl border border-purple-100 flex flex-col justify-center space-y-4">
                    <h3 className="text-purple-800 font-bold border-b border-purple-200 pb-2">
                      Material Requirements
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-700 font-medium">
                        Cross-Sectional Area
                      </span>
                      <div className="text-right">
                        <span className="text-purple-900 font-bold ">
                          {bedCrossSection.toFixed(4)}
                        </span>
                        <span className="text-purple-600 font-medium text-xs">
                          m²
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-700 font-medium">
                        Total Volume
                      </span>
                      <div className="text-right">
                        <span className="text-purple-900 font-bold text-xl">
                          {beddingCalculatedVol.toFixed(2)}
                        </span>
                        <span className="text-purple-600 font-medium text-sm">
                          m³
                        </span>
                      </div>
                    </div>
                    {(beddingType === "classB" || beddingType === "classC") &&
                      beddingWeightTons > 0 && (
                        <div className="flex justify-between items-center text-sm border-t border-purple-200 pt-3 mt-1">
                          <div className="flex flex-col">
                            <span className="text-purple-700 font-medium">
                              Estimated Weight
                            </span>
                            <span className="text-purple-500 text-[10px]">
                              @ 1600 kg/m³ density
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-purple-900 font-black text-2xl">
                              {beddingWeightTons.toFixed(2)}
                            </span>
                            <span className="text-purple-600 font-bold">
                              tons
                            </span>
                          </div>
                        </div>
                      )}
                    {beddingType === "classA" && (
                      <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-200 p-3 rounded-xl mt-1">
                        <p className="text-xs font-medium text-indigo-700">
                          For Class A (Concrete), you typically use low-strength
                          concrete (e.g., M10 or M15).
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Hydraulic Flow Calculator Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection("flow")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Droplet className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Hydraulic Flow Calculator
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "flow" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "flow" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 h-fit">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Pipe Inner Diameter (m)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        value={flowDia}
                        onChange={(e) => setFlowDia(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Gradient (1 in X)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        value={flowGradient}
                        onChange={(e) => setFlowGradient(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Pipe Material
                      </label>
                      <select
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                        value={flowMaterial}
                        onChange={(e) => setFlowMaterial(e.target.value as any)}
                      >
                        <option value="pvc">
                          PVC / Plastic (n=0.009)
                        </option>
                        <option value="concrete">Concrete (n=0.013)</option>
                        <option value="cast_iron">Cast Iron (n=0.014)</option>
                        <option value="clay">
                          Clay / Ceramic (n=0.015)
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-cyan-50 px-4 py-3 rounded-2xl border border-cyan-100 flex flex-col justify-center space-y-4">
                    <h3 className="text-cyan-800 font-bold border-b border-cyan-200 pb-2">
                      Full-Bore Flow Characteristics
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-cyan-700 font-medium">
                        Flow Velocity
                      </span>
                      <div className="text-right">
                        <span className="text-cyan-900 font-bold text-xl">
                          {flowVelocity.toFixed(3)}
                        </span>
                        <span className="text-cyan-600 font-medium text-sm">
                          m/s
                        </span>
                      </div>
                    </div>
                    {flowVelocity > 0 && flowVelocity < 0.6 && (
                      <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl mt-1">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                        <p className="text-xs font-medium">
                          Warning: Calculated velocity is below the typical
                          self-cleansing velocity of 0.6 m/s. Siltation may
                          occur.
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-cyan-700 font-medium">
                        Discharge Capacity
                      </span>
                      <div className="text-right">
                        <span className="text-cyan-900 font-bold text-lg">
                          {dischargeCapacityM3.toFixed(4)}
                        </span>
                        <span className="text-cyan-600 font-medium text-sm">
                          m³/s
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-cyan-200 pt-3 mt-1">
                      <span className="text-cyan-700 font-medium">
                        Discharge (Liters/sec)
                      </span>
                      <div className="text-right">
                        <span className="text-cyan-900 font-black text-2xl">
                          {dischargeCapacityL.toFixed(2)}
                        </span>
                        <span className="text-cyan-600 font-bold">
                          L/s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Septic System Sizing Calculator Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden mb-8">
            <button
              onClick={() => toggleSection("septic")}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Waves className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Septic System Sizing Calculator
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === "septic" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out ${openSection === "septic" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 h-fit">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Number of Users
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        value={septicUsers}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val < 0) return;
                          setSepticUsers(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Per Capita Water Demand (L/day)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        value={septicDemand}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val < 0) return;
                          setSepticDemand(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Soil Percolation Rate (L/m²/day)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        value={septicPercolation}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val < 0) return;
                          setSepticPercolation(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 flex flex-col justify-center space-y-4">
                    <h3 className="text-emerald-800 font-bold border-b border-emerald-200 pb-2">
                      Septic Tank Dimensions
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center w-full">
                      <div className="bg-white/60 p-3 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-emerald-600 text-xs font-semibold mb-1">
                          Length
                        </span>
                        <span className="block text-emerald-900 font-bold text-lg">
                          {septicLength.toFixed(2)} m
                        </span>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-emerald-600 text-xs font-semibold mb-1">
                          Width
                        </span>
                        <span className="block text-emerald-900 font-bold text-lg">
                          {septicWidth.toFixed(2)} m
                        </span>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-emerald-600 text-xs font-semibold mb-1">
                          Liquid Depth
                        </span>
                        <span className="block text-emerald-900 font-bold text-lg">
                          {septicDepth.toFixed(2)} m
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium text-center">
                      Calculated Volume: {septicTotalVolM3.toFixed(2)} m³
                      (Includes 24hr retention + sludge)
                    </p>
                    <h3 className="text-emerald-800 font-bold border-b border-emerald-200 pb-2 mt-2">
                      Soakage Pit Dimensions
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-700 font-medium">
                        Req. Sidewall Area
                      </span>
                      <span className="text-emerald-900 font-bold text-base">
                        {soakageAreaRequired.toFixed(2)} m²
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 items-center w-full">
                      <div className="bg-white/60 p-3 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-emerald-600 text-xs font-semibold mb-1">
                          Diameter
                        </span>
                        <span className="block text-emerald-900 font-bold text-xl">
                          {soakageDia.toFixed(2)} m
                        </span>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-emerald-600 text-xs font-semibold mb-1">
                          Depth
                        </span>
                        <span className="block text-emerald-900 font-bold text-xl">
                          {soakageDepth.toFixed(2)} m
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareButtonWithPopup
        activeTab="Sewerage"
        data={{
          "Trench Volume": `${trenchVol.toFixed(2)} m³`,
          "Net Backfill": `${netBackfillVol.toFixed(2)} m³`,
          "Manhole Wall Vol": `${mhResults?.wallVol?.toFixed(2) || "0.00"} m³`,
          "Flow Velocity": `${flowVelocity.toFixed(3)} m/s`,
          "Septic Vol": `${septicTotalVolM3.toFixed(2)} m³`,
        }}
        exportFormat={{
          inputs: {
            "Trench Length": `${trenchLength}m`,
            "Trench Depth": `${trenchDepth}m`,
            "Pipe Outer Dia": `${pipeOuterDiameter}m`,
            "Bedding Depth": `${beddingDepth}m`,
            "Flow Dia": `${flowDia}m`,
            "Flow Gradient": `1 in ${flowGradient}`,
            "Septic Users": `${septicUsers}`,
            "Septic Demand": `${septicDemand} L/d`,
          },
          breakdown: {
            "Total Excavation": `${trenchVol.toFixed(2)} m³`,
            "Bedding Volume": `${beddingVol.toFixed(2)} m³`,
            "Net Backfill": `${netBackfillVol.toFixed(2)} m³`,
            "Manhole Concrete": `${mhResults?.totalWetConcrete?.toFixed(2) || "0.00"} m³`,
            "Flow Velocity": `${flowVelocity.toFixed(3)} m/s`,
            "Discharge (m³/s)": `${dischargeCapacityM3.toFixed(4)} m³/s`,
            "Septic Tank Vol": `${septicTotalVolM3.toFixed(2)} m³`,
            "Soakage Area": `${soakageAreaRequired.toFixed(2)} m²`,
            "Pipes Required": `${pipeCount} nos`,
          },
        }}
        title="Sewerage Estimator"
      />
    </div>
  );
}
