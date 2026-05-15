import React, { useState } from "react";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import {
  Copy,
  Droplet,
  Box,
  Hammer,
  PaintBucket,
  Scaling,
  ArrowRightLeft,
  Layers,
  Columns,
  Container,
  Spline,
  Calculator,
  Save,
} from "lucide-react";
import { useGlobalSettings } from "../../context/SettingsContext";
import {
  ConcreteMortarCalculator,
  BrickworkCalculator,
  PlasterCalculator,
  SteelCalculator,
} from "../../utils/calculators";

import ColorfulTab from "../ui/ColorfulTab";
import UnitToggleGroup from "../ui/UnitToggleGroup";
import { CalculationHistory } from "../ui/CalculationHistory";
import RccStructureCalculator from "./RccStructureCalculator";
import MasterQuantityEstimator from "./MasterQuantityEstimator";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import Brickwork9InchModule from "./Brickwork9InchModule";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { SEO } from "../SEO";

export default function ConstructionMaterialEstimator() {
  const { formatCurrency, currentUnit, currentCurrency } = useGlobalSettings();
  const { user } = useAuth();
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Construction Material Estimator",
    "applicationCategory": "BusinessApplication",
    "description": "Calculate exact material requirements like cement, sand, and aggregate for brickwork, plaster, and concrete.",
    "operatingSystem": "All"
  };
  
  const isSI = currentUnit === "Metric";
  const unitFt = isSI ? "m" : "ft";
  const unitIn = isSI ? "cm" : "in";
  const unitVol = isSI ? "m³" : "cft";
  const unitArea = isSI ? "m²" : "sq.ft";
  const tabs = [
    { id: "master", label: "Master Quantities", icon: Calculator },
    { id: "concrete", label: "Concrete", icon: Box },
    { id: "bricks", label: "Bricks", icon: Columns },
    { id: "blocks", label: "Blocks", icon: Container },
    { id: "plaster", label: "Plaster", icon: PaintBucket },
    { id: "steel", label: "Steel", icon: Layers },
    { id: "rcc", label: "RCC Structure", icon: Spline },
    { id: "water", label: "Water", icon: Droplet },
  ] as const;
  const [showCost, setShowCost] = useState(false);
  const [rates, setRates] = useState({
    cement: 1200,
    sand: 60,
    aggregate: 80,
    water: 1,
    steel: 260,
    bricks: 15,
    blocks: 50,
  });
  const fullTabs = [
    ...tabs,
    { id: "cement", label: "Cement", icon: Box },
    { id: "sand", label: "Sand", icon: Scaling },
  ] as const;
  type TabId = (typeof fullTabs)[number]["id"];
  const [activeTab, setActiveTab] = useState<TabId>("master");
  /* Project Cart state */ interface CartItem {
    id: string;
    name: string;
    type: string;
    cementBags: number;
    sandVol: number;
    aggregateVol: number;
    waterLiters: number;
    steelKg?: number;
    bricksCount?: number;
    blocksCount?: number;
    unitVol: string;
    rawExport: Record<string, any>;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [elementName, setElementName] = useState<string>("");
  /* Global inputs */ const [wastage, setWastage] = useState("5");
  /* Concrete */ const [cLength, setCLength] = useState("10");
  const [cWidth, setCWidth] = useState("10");
  const [cDepth, setCDepth] = useState(isSI ? "0.15" : "0.5");
  const [cMix, setCMix] = useState("1:2:4");
  const [cWcRatio, setCWcRatio] = useState("0.5");
  /* Bricks */ const [bWallL, setBWallL] = useState("20");
  const [bWallH, setBWallH] = useState("10");
  const [bWallT, setBWallT] = useState(isSI ? "22" : "9");
  /* cm or inches */ interface Opening {
    id: string;
    type: "Door" | "Window" | "Ventilator";
    quantity: number;
    length: number;
    height: number;
  }
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [newOpening, setNewOpening] = useState<Omit<Opening, "id">>({
    type: "Door",
    quantity: 1,
    length: 0,
    height: 0,
  });
  const [brickL, setBrickL] = useState(isSI ? "22.8" : "9");
  /* cm or inches */ const [brickW, setBrickW] = useState(
    isSI ? "11.4" : "4.5",
  );
  const [brickH, setBrickH] = useState(isSI ? "7.6" : "3");
  const [bJoint, setBJoint] = useState(isSI ? "1" : "0.39");
  /* cm or inches */ const [bMix, setBMix] = useState("1:4");
  /* Blocks */ const [blockL, setBlockL] = useState(isSI ? "40" : "16");
  /* cm or inches */ const [blockW, setBlockW] = useState(isSI ? "20" : "8");
  const [blockH, setBlockH] = useState(isSI ? "20" : "8");
  const [blockJoint, setBlockJoint] = useState(isSI ? "1" : "0.39");
  /* Plaster */ const [pArea, setPArea] = useState("200");
  const [pThick, setPThick] = useState(isSI ? "1.2" : "0.5");
  /* cm or in */ const [pMix, setPMix] = useState("1:4");
  /* Steel */ const [sDia, setSDia] = useState("12");
  /* mm */ const [sSpan, setSSpan] = useState("10");
  /* m or ft */ const [sSpace, setSSpace] = useState("150");
  /* mm or inches */ const [sBarL, setSBarL] = useState(isSI ? "12" : "40");
  /* m or ft */ const [sOverlap, setSOverlap] = useState("50");
  /* Water */ const [wCementKg, setWCementKg] = useState("50");
  const [wWcRatio, setWWcRatio] = useState("0.5");
  React.useEffect(() => {
    if (currentUnit === "Metric") {
      setCDepth("0.15");
      setBWallT("22");
      setBWallL("5");
      setBWallH("3");
      setBrickL("22.8");
      setBrickW("11.4");
      setBrickH("7.6");
      setBJoint("1");
      setBlockL("40");
      setBlockW("20");
      setBlockH("20");
      setBlockJoint("1");
      setPThick("1.2");
      setSBarL("12");
      setSDia("12");
      setSSpace("150");
    } else {
      setCDepth("0.5");
      setBWallT("9");
      setBWallL("20");
      setBWallH("10");
      setBrickL("9");
      setBrickW("4.5");
      setBrickH("3");
      setBJoint("0.39");
      setBlockL("16");
      setBlockW("8");
      setBlockH("8");
      setBlockJoint("0.39");
      setPThick("0.5");
      setSBarL("40");
      setSDia("4");
      setSSpace("6");
    }
  }, [currentUnit]);
  const parseNum = (val: string) => parseFloat(val) || 0;
  let content = null;
  let currentExportData: Record<string, any> = {};
  let currentExportInputs: Record<string, any> = {};
  let currentCartItem: Omit<CartItem, "id" | "name"> | null = null;
  if (activeTab === "concrete") {
    const calc = new ConcreteMortarCalculator(
      parseNum(cLength),
      parseNum(cWidth),
      parseNum(cDepth),
      cMix,
      parseNum(wastage),
      parseNum(cWcRatio),
      isSI,
    );
    const res = calc.calculate();
    currentExportInputs = {
      Dimensions: `Length: ${cLength} ${unitFt} | Width: ${cWidth} ${unitFt} | Depth: ${cDepth} ${unitFt}`,
      "Mix Ratio": cMix,
      "W/C Ratio": cWcRatio,
      "Wastage Allowed": `${wastage}%`,
    };
    currentExportData = {
      "Concrete Mixed Volume": `${res.totalWetVolume.toFixed(2)} ${unitVol}`,
      [`Dry Volume (+${wastage}% waste)`]: `${(res.totalWetVolume * CIVIL_CONSTANTS.DRY_CONCRETE_FACTOR * (1 + parseNum(wastage) / 100)).toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`,
      "Aggregate Required": `${res.aggregateVol.toFixed(2)} ${unitVol}`,
      "Water Required": `${res.waterLiters.toFixed(1)} L`,
    };
    currentCartItem = {
      type: "Concrete",
      cementBags: res.cementBags,
      sandVol: res.sandVol,
      aggregateVol: res.aggregateVol,
      waterLiters: res.waterLiters,
      unitVol,
      rawExport: currentExportData,
    };
    content = (
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2">
          Concrete Slab / Footing
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
              Length ({unitFt})
            </label>
            <input
              type="number"
              value={cLength}
              onChange={(e) => setCLength(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Width ({unitFt})
            </label>
            <input
              type="number"
              value={cWidth}
              onChange={(e) => setCWidth(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Depth ({unitFt})
            </label>
            <input
              type="number"
              value={cDepth}
              onChange={(e) => setCDepth(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="bg-blue-50/50 rounded-xl px-4 py-3 border border-blue-100 flex items-center justify-center min-h-[8rem] relative text-[10px] font-bold text-blue-500/80 overflow-hidden">
          <svg
            viewBox="0 0 120 80"
            className="w-full h-full absolute inset-0 opacity-20 pointer-events-none"
          >
            <path d="M30,50 L90,50 L105,30 L45,30 Z" fill="currentColor" />
            <path
              d="M30,50 L30,60 L90,60 L90,50 M90,60 L105,40 L105,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 bg-blue-50">
            L {cLength}
          </span>
          <span className="absolute right-10 top-6 px-2 bg-blue-50">
            W {cWidth}
          </span>
          <span className="absolute left-8 bottom-6 px-2 bg-blue-50">
            D {cDepth}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Mix Ratio
            </label>
            <select
              value={cMix}
              onChange={(e) => setCMix(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            >
              <option value="1:5:10">1:5:10 (M5)</option>
              <option value="1:4:8">1:4:8 (M7.5)</option>
              <option value="1:3:6">1:3:6 (M10)</option>
              <option value="1:2:4">1:2:4 (M15)</option>
              <option value="1:1.5:3">1:1.5:3 (M20)</option>
              <option value="1:1:2">1:1:2 (M25)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              W/C Ratio (0.45-0.6)
            </label>
            <input
              type="number"
              step="0.01"
              value={cWcRatio}
              onChange={(e) => setCWcRatio(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "bricks" || activeTab === "blocks") {
    const l = activeTab === "bricks" ? brickL : blockL;
    const w = activeTab === "bricks" ? brickW : blockW;
    const h = activeTab === "bricks" ? brickH : blockH;
    const j = activeTab === "bricks" ? bJoint : blockJoint;
    /* Convert cm/inches to appropriate units in calculator */ /* The calculator expects base units for wall (like meters or feet) but the brick dimensions are in cm or inches. Our calculator code expects everything mathematically scaled? Wait, let's normalize everything to the base unit (Meters or Feet). */ const conv =
      isSI ? 100 : 12;
    /* cm to m, or inches to feet */ const totalDeductionArea = openings.reduce(
      (acc, op) => acc + op.quantity * op.length * op.height,
      0,
    );
    const calc = new BrickworkCalculator(
      parseNum(bWallL),
      parseNum(bWallH),
      parseNum(bWallT) / conv,
      totalDeductionArea,
      parseNum(l) / conv,
      parseNum(w) / conv,
      parseNum(h) / conv,
      parseNum(j) / conv,
      bMix,
      parseNum(wastage),
      isSI,
    );
    const res = calc.calculate();
    const setL = activeTab === "bricks" ? setBrickL : setBlockL;
    const setW = activeTab === "bricks" ? setBrickW : setBlockW;
    const setH = activeTab === "bricks" ? setBrickH : setBlockH;
    const setJ = activeTab === "bricks" ? setBJoint : setBlockJoint;
    currentExportInputs = {
      "Wall Dimensions": `L: ${bWallL} ${unitFt} | H: ${bWallH} ${unitFt} | T: ${bWallT} ${unitIn}`,
      "Deductions Area": `${totalDeductionArea.toFixed(2)} ${unitArea}`,
      "Unit Dimensions": `L: ${l} ${unitIn} | W: ${w} ${unitIn} | H: ${h} ${unitIn}`,
      "Mortar Joint": `${j} ${unitIn}`,
      "Mix Ratio": bMix,
      "Wastage Allowed": `${wastage}%`,
    };
    currentExportData = {
      "Net Wall Volume": `${res.netWallVol.toFixed(2)} ${unitVol}`,
      "Total Units Required": `${res.numBricks} nos`,
      "Mortar Volume": `${res.mortarWetVol.toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`,
    };
    currentCartItem = {
      type: activeTab === "bricks" ? "Bricks" : "Blocks",
      cementBags: res.cementBags,
      sandVol: res.sandVol,
      aggregateVol: 0,
      waterLiters: 0,
      bricksCount: activeTab === "bricks" ? res.numBricks : undefined,
      blocksCount: activeTab === "blocks" ? res.numBricks : undefined,
      unitVol,
      rawExport: currentExportData,
    } as any;
    content =
      activeTab === "bricks" ? (
        <Brickwork9InchModule />
      ) : (
        <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-2xl border w-full">
          <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-500 dark:text-slate-400">
            {activeTab} Wall
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Wall Length ({unitFt})
              </label>
              <input
                type="number"
                value={bWallL}
                onChange={(e) => setBWallL(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Wall Height ({unitFt})
              </label>
              <input
                type="number"
                value={bWallH}
                onChange={(e) => setBWallH(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Wall Thick ({unitIn})
              </label>
              <input
                type="number"
                value={bWallT}
                onChange={(e) => setBWallT(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="bg-amber-50/50 rounded-xl px-4 py-3 border border-amber-100 flex items-center justify-center min-h-[8rem] relative text-[10px] font-bold text-amber-600/80 overflow-hidden">
            <svg
              viewBox="0 0 120 80"
              className="w-full h-full absolute inset-0 opacity-20 pointer-events-none"
            >
              <path
                d="M20,60 L80,60 L80,20 L20,20 Z"
                fill="currentColor"
              />
              <path
                d="M80,60 L95,45 L95,5 L80,20 M20,20 L35,5 L95,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 bg-amber-50">
              L {bWallL}
            </span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 px-2 bg-amber-50">
              H {bWallH}
            </span>
            <span className="absolute right-10 bottom-6 px-2 bg-amber-50">
              T {bWallT}
            </span>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex justify-between items-center mb-4">
              Add Deductions
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px]">
                Total:
                {openings
                  .reduce(
                    (acc, op) => acc + op.quantity * op.length * op.height,
                    0,
                  )
                  .toFixed(2)}
                {unitArea}
              </span>
            </h4>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-2">
                <select
                  className="bg-transparent border p-2 rounded-lg text-xs font-medium"
                  value={newOpening.type}
                  onChange={(e) =>
                    setNewOpening({
                      ...newOpening,
                      type: e.target.value as any,
                    })
                  }
                >
                  <option value="Door">Door</option>
                  <option value="Window">Window</option>
                  <option value="Ventilator">Ventilator</option>
                </select>
                <div>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newOpening.quantity || ""}
                    onChange={(e) =>
                      setNewOpening({
                        ...newOpening,
                        quantity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder={`L (${unitFt})`}
                    value={newOpening.length || ""}
                    onChange={(e) =>
                      setNewOpening({
                        ...newOpening,
                        length: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder={`H (${unitFt})`}
                    value={newOpening.height || ""}
                    onChange={(e) =>
                      setNewOpening({
                        ...newOpening,
                        height: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (
                    newOpening.quantity &&
                    newOpening.length &&
                    newOpening.height
                  ) {
                    setOpenings([
                      ...openings,
                      {
                        ...newOpening,
                        id: Math.random().toString(36).substr(2, 9),
                      } as Opening,
                    ]);
                    setNewOpening({
                      type: "Door",
                      quantity: 1,
                      length: 0,
                      height: 0,
                    });
                  }
                }}
                className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                disabled={
                  !newOpening.quantity ||
                  !newOpening.length ||
                  !newOpening.height
                }
              >
                + Add Opening
              </button>
            </div>
            {openings.length > 0 && (
              <div className="mt-4 space-y-2">
                {openings.map((op) => (
                  <div
                    key={op.id}
                    className="flex items-center justify-between bg-transparent p-2 rounded text-xs"
                  >
                    <span className="font-semibold text-slate-600">
                      {op.quantity}x {op.type}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {op.length}×{op.height} {unitFt}
                    </span>
                    <span className="font-bold text-slate-700">
                      {(op.quantity * op.length * op.height).toFixed(2)}
                      {unitArea}
                    </span>
                    <button
                      onClick={() =>
                        setOpenings(openings.filter((o) => o.id !== op.id))
                      }
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <h3 className="font-bold border-b pb-2 pt-4 uppercase text-sm tracking-widest text-slate-700 dark:text-slate-300">
            Unit Dimensions ({unitIn})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Length
              </label>
              <input
                type="number"
                value={l}
                onChange={(e) => setL(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Width
              </label>
              <input
                type="number"
                value={w}
                onChange={(e) => setW(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Height
              </label>
              <input
                type="number"
                value={h}
                onChange={(e) => setH(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Joint Thick ({unitIn})
              </label>
              <input
                type="number"
                value={j}
                onChange={(e) => setJ(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                Mortar Mix
              </label>
              <select
                value={bMix}
                onChange={(e) => setBMix(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
              >
                <option value="1:3">1:3</option>
                <option value="1:4">1:4</option>
                <option value="1:5">1:5</option>
                <option value="1:6">1:6</option>
              </select>
            </div>
          </div>
        </div>
      );
  } else if (activeTab === "steel") {
    const calc = new SteelCalculator(
      parseNum(sDia),
      parseNum(sSpan),
      parseNum(sSpace),
      parseNum(sBarL),
      parseNum(sOverlap),
      1,
      parseNum(wastage),
      isSI,
    );
    const res = calc.calculate();
    currentExportInputs = {
      "Bar Diameter": `${sDia} mm/in#`,
      "Span/Length": `${sSpan} ${unitFt}`,
      Spacing: `${sSpace} mm/in`,
      "Standard Bar Length": `${sBarL} ${unitFt}`,
      "Overlap Factor": `${sOverlap}xD`,
      "Wastage Allowed": `${wastage}%`,
    };
    currentExportData = {
      "Total Bars Needed": `${res.numBars} nos`,
      "Weight per Unit": `${res.weightPerUnitLength.toFixed(3)} kg`,
      "Total Cut Length": `${res.totalLengthAllBars.toFixed(2)} ${unitFt}`,
      "Total Weight": `${res.totalWeightKg.toFixed(1)} kg`,
    };
    currentCartItem = {
      type: "Steel",
      cementBags: 0,
      sandVol: 0,
      aggregateVol: 0,
      waterLiters: 0,
      steelKg: res.totalWeightKg,
      unitVol,
      rawExport: currentExportData,
    };
    content = (
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-700 dark:text-slate-300">
          Steel Reinforcement
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Bar Dia (mm/in#)
            </label>
            <input
              type="number"
              value={sDia}
              onChange={(e) => setSDia(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Span Length ({unitFt})
            </label>
            <input
              type="number"
              value={sSpan}
              onChange={(e) => setSSpan(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label
              className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase"
              title="Center-to-center spacing"
            >
              Spacing c/c ({isSI ? "mm" : "inch"})
            </label>
            <input
              type="number"
              value={sSpace}
              onChange={(e) => setSSpace(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Standard Bar Length ({unitFt})
            </label>
            <input
              type="number"
              value={sBarL}
              onChange={(e) => setSBarL(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Overlap Factor (xD)
            </label>
            <input
              type="number"
              value={sOverlap}
              onChange={(e) => setSOverlap(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "plaster") {
    const conv = isSI ? 100 : 12;
    const calc = new PlasterCalculator(
      parseNum(pArea),
      parseNum(pThick) / conv,
      pMix,
      parseNum(wastage),
      isSI,
    );
    const res = calc.calculate();
    currentExportInputs = {
      "Surface Area": `${pArea} ${unitArea}`,
      Thickness: `${pThick} ${unitIn}`,
      "Mix Ratio": pMix,
      "Wastage Allowed": `${wastage}%`,
    };
    currentExportData = {
      "Total Wet Volume": `${res.totalWetVolume.toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`,
    };
    currentCartItem = {
      type: "Plaster",
      cementBags: res.cementBags,
      sandVol: res.sandVol,
      aggregateVol: 0,
      waterLiters: 0,
      unitVol,
      rawExport: currentExportData,
    };
    content = (
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-700 dark:text-slate-300">
          Plaster / Mortar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Surface Area ({unitArea})
            </label>
            <input
              type="number"
              value={pArea}
              onChange={(e) => setPArea(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Thickness ({unitIn})
            </label>
            <input
              type="number"
              value={pThick}
              onChange={(e) => setPThick(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Mix Ratio
            </label>
            <select
              value={pMix}
              onChange={(e) => setPMix(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            >
              <option value="1:3">1:3</option> <option value="1:4">1:4</option>
              <option value="1:5">1:5</option>
              <option value="1:6">1:6</option>
            </select>
          </div>
        </div>
        <div className="bg-slate-100/50 rounded-xl px-4 py-3 border border-slate-200 flex items-center justify-center min-h-[8rem] relative text-[10px] font-bold text-slate-700 dark:text-slate-300 overflow-hidden">
          <svg
            viewBox="0 0 120 80"
            className="w-full h-full absolute inset-0 opacity-20 pointer-events-none"
          >
            <path d="M30,70 L90,60 L90,20 L30,30 Z" fill="currentColor" />
          </svg>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-transparent">
            Area: {pArea} {unitArea}
          </span>
          <span className="absolute bottom-4 right-10 px-2 bg-transparent">
            T: {pThick} {unitIn}
          </span>
        </div>
      </div>
    );
  } else if (activeTab === "water") {
    /* Basic Water Calculator based on cement weight */ const waterCalc =
      parseNum(wCementKg) * parseNum(wWcRatio);
    currentExportInputs = {
      "Weight of Cement": `${wCementKg} kg`,
      "W/C Ratio": `${wWcRatio}`,
    };
    currentExportData = {
      "Weight of Cement": `${wCementKg} kg`,
      "W/C Ratio": `${wWcRatio}`,
      "Required Water": `${waterCalc.toFixed(1)} L (${(waterCalc / 3.785).toFixed(2)} Gallons)`,
    };
    currentCartItem = {
      type: "Water",
      cementBags: 0,
      sandVol: 0,
      aggregateVol: 0,
      waterLiters: waterCalc,
      unitVol,
      rawExport: currentExportData,
    };
    content = (
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-700 dark:text-slate-300">
          Water Requirements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              Weight of Cement (kg)
            </label>
            <input
              type="number"
              value={wCementKg}
              onChange={(e) => setWCementKg(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
              W/C Ratio (0.45-0.6)
            </label>
            <input
              type="number"
              step="0.01"
              value={wWcRatio}
              onChange={(e) => setWWcRatio(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "rcc") {
    content = (
      <div className="w-full relative col-span-1 lg:col-span-2 space-y-4">
        <RccStructureCalculator isEmbedded={true} />
      </div>
    );
  } else if (activeTab === "master") {
    content = (
      <div className="w-full relative col-span-1 lg:col-span-2 space-y-4">
        <MasterQuantityEstimator isEmbedded={true} />
      </div>
    );
  } else if (activeTab === "cement" || activeTab === "sand") {
    content = (
      <div className="bg-transparent border p-12 rounded-3xl text-center text-slate-700 dark:text-slate-300 max-w-xl mx-auto mt-8">
        <Layers className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          Use Standard Modules
        </h3>
        <p>
          For standalone {activeTab} estimations, please rely on the Concrete,
          Plaster, or Block modules which accurately calculate the constituent
          cement/sand ratios from overall dimensions.
        </p>
      </div>
    );
  }
  const addToCart = () => {
    if (!currentCartItem) return;
    const item: CartItem = {
      ...currentCartItem,
      id: Math.random().toString(36).substr(2, 9),
      name: elementName || `${currentCartItem.type} Element`,
    };
    setCart([...cart, item]);
    setElementName("");
  };
  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  const totalCement = cart.reduce((acc, item) => acc + item.cementBags, 0);
  const totalSand = cart.reduce((acc, item) => acc + item.sandVol, 0);
  const totalAgg = cart.reduce((acc, item) => acc + item.aggregateVol, 0);
  const totalWater = cart.reduce((acc, item) => acc + item.waterLiters, 0);
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-slate-900 p-6 md:p-8">
      <SEO 
        title="Construction Material Estimator" 
        description="Calculate exact material requirements like cement, sand, and aggregate for brickwork, plaster, and concrete across your construction projects." 
        canonicalUrl="https://civilestimationpro.com/calculators" 
        schema={schema}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Construction Material Estimator
            </h1>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Accurate estimations for concrete, bricks, steel, blocks, and
              mortar.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <GlobalSettingsToggle align="left" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white px-4 py-3 rounded-xl border flex items-center gap-2 shadow-sm">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                WASTAGE
              </span>
              <input
                type="number"
                value={wastage}
                onChange={(e) => setWastage(e.target.value)}
                className="w-14 text-center font-bold bg-transparent rounded border border-slate-200 p-1 focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">%</span>
            </div>
          </div>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-2 mb-4 p-1 snap-x snap-mandatory scroll-smooth scrollbar-hide">
          {fullTabs.map((tab, idx) => {
            const colors = ["indigo", "rose", "emerald", "amber", "cyan", "fuchsia", "teal"];
            const color = colors[idx % colors.length] as any;
            return (
              <ColorfulTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={<tab.icon className="w-4 h-4" />}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                colorTheme={color}
              />
            );
          })}
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-all duration-300 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {content}
            {activeTab !== "cement" &&
              activeTab !== "sand" &&
              activeTab !== "rcc" &&
              activeTab !== "master" && (
                <div className="bg-slate-900 rounded-3xl px-4 py-3 md:px-4 py-3 text-white space-y-4 shadow-xl sticky top-6 self-start z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">
                      Material Breakdown
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer text-xs bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={showCost}
                        onChange={(e) => setShowCost(e.target.checked)}
                        className="accent-indigo-500 w-4 h-4 rounded"
                      />
                      Cost Est.
                    </label>
                  </div>
                  {Object.entries(currentExportData).map(([key, val]) => {
                    let colorClass = "text-slate-700 dark:text-slate-300";
                    if (key.includes("Cement"))
                      colorClass = "text-blue-400 font-bold";
                    else if (key.includes("Sand"))
                      colorClass = "text-amber-400 font-bold";
                    else if (key.includes("Aggregate"))
                      colorClass = "text-gray-700 dark:text-gray-300 font-bold";
                    else if (key.includes("Water"))
                      colorClass = "text-cyan-400 font-bold";
                    else if (
                      key.toLowerCase().includes("weight") ||
                      key.includes("Steel")
                    )
                      colorClass = "text-indigo-400 font-bold";
                    else if (key.includes("Units Required"))
                      colorClass = "text-rose-400 font-bold";
                    return (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800 pb-3 pt-2 gap-1 sm:gap-4"
                      >
                        <span className={`${colorClass}`}>
                          {key}
                        </span>
                        <span
                          className={`${key.includes("Units Required") ? "font-mono font-bold text-white uppercase text-xl" : "font-mono font-bold text-white"} text-left sm:text-right`}
                        >
                          {val}
                        </span>
                      </div>
                    );
                  })}
                  {showCost && currentCartItem && (
                    <div className="pt-4 mt-4 border-t-2 border-slate-700 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        {currentCartItem.cementBags > 0 && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                              Cement (per bag)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                              value={rates.cement}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val < 0) return;
                                setRates({
                                  ...rates,
                                  cement: isNaN(val) ? 0 : val,
                                });
                              }}
                            />
                          </div>
                        )}
                        {currentCartItem.sandVol > 0 && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                              Sand (per {currentCartItem.unitVol})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                              value={rates.sand}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val < 0) return;
                                setRates({
                                  ...rates,
                                  sand: isNaN(val) ? 0 : val,
                                });
                              }}
                            />
                          </div>
                        )}
                        {(currentCartItem.aggregateVol || 0) > 0 && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                              Aggregate (per {currentCartItem.unitVol})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                              value={rates.aggregate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val < 0) return;
                                setRates({
                                  ...rates,
                                  aggregate: isNaN(val) ? 0 : val,
                                });
                              }}
                            />
                          </div>
                        )}
                        {currentCartItem.steelKg !== undefined &&
                          currentCartItem.steelKg > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                                Steel (per kg)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                                value={rates.steel}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val < 0) return;
                                  setRates({
                                    ...rates,
                                    steel: isNaN(val) ? 0 : val,
                                  });
                                }}
                              />
                            </div>
                          )}
                        {currentCartItem.bricksCount !== undefined &&
                          currentCartItem.bricksCount > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                                Bricks (per unit)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                                value={rates.bricks}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val < 0) return;
                                  setRates({
                                    ...rates,
                                    bricks: isNaN(val) ? 0 : val,
                                  });
                                }}
                              />
                            </div>
                          )}
                        {currentCartItem.blocksCount !== undefined &&
                          currentCartItem.blocksCount > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                                Blocks (per unit)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                                value={rates.blocks}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val < 0) return;
                                  setRates({
                                    ...rates,
                                    blocks: isNaN(val) ? 0 : val,
                                  });
                                }}
                              />
                            </div>
                          )}
                        {currentCartItem.waterLiters > 0 && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-slate-700 dark:text-slate-300 mb-1 block">
                              Water (per L)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                              value={rates.water}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val < 0) return;
                                setRates({
                                  ...rates,
                                  water: isNaN(val) ? 0 : val,
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Estimated Cost
                        </span>
                        <span className="text-2xl font-black text-green-400">
                          {formatCurrency(
                            currentCartItem.cementBags * rates.cement +
                              currentCartItem.sandVol * rates.sand +
                              (currentCartItem.aggregateVol || 0) *
                                rates.aggregate +
                              currentCartItem.waterLiters * rates.water +
                              (currentCartItem.steelKg || 0) * rates.steel +
                              (currentCartItem.bricksCount || 0) *
                                rates.bricks +
                              (currentCartItem.blocksCount || 0) * rates.blocks,
                          )}
                        </span>
                      </div>
                      
                      {/* Pie Chart for Cost Breakdown */}
                      {(() => {
                        const pieData = [];
                        const cCost = currentCartItem.cementBags * rates.cement;
                        const sCost = currentCartItem.sandVol * rates.sand;
                        const aCost = (currentCartItem.aggregateVol || 0) * rates.aggregate;
                        const wCost = currentCartItem.waterLiters * rates.water;
                        const stCost = (currentCartItem.steelKg || 0) * rates.steel;
                        const bkCost = (currentCartItem.bricksCount || 0) * rates.bricks;
                        const blCost = (currentCartItem.blocksCount || 0) * rates.blocks;

                        if (cCost > 0) pieData.push({ name: 'Cement', value: cCost, fill: '#60a5fa' });
                        if (sCost > 0) pieData.push({ name: 'Sand', value: sCost, fill: '#fbbf24' });
                        if (aCost > 0) pieData.push({ name: 'Aggregate', value: aCost, fill: '#9ca3af' });
                        if (wCost > 0) pieData.push({ name: 'Water', value: wCost, fill: '#22d3ee' });
                        if (stCost > 0) pieData.push({ name: 'Steel', value: stCost, fill: '#818cf8' });
                        if (bkCost > 0) pieData.push({ name: 'Bricks', value: bkCost, fill: '#fb7185' });
                        if (blCost > 0) pieData.push({ name: 'Blocks', value: blCost, fill: '#a78bfa' });

                        if (pieData.length === 0) return null;

                        return (
                          <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center mb-2 uppercase tracking-wide">Cost Breakdown</h4>
                            <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2.5 mt-2">
                              {pieData.map(entry => (
                                <div key={entry.name} className="flex items-center gap-1.5 text-[10px] text-slate-300 font-medium">
                                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.fill }} />
                                  {entry.name}
                                  <span className="opacity-60 ml-0.5">
                                    {Math.round((entry.value / pieData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
          </div>
          {currentCartItem && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-end pb-12 sm:pb-0">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Element Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Footing A, Slab B, Retaining Wall"
                  value={elementName}
                  onChange={(e) => setElementName(e.target.value)}
                  className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-4 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={addToCart}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/20"
              >
                + Add to Estimate
              </button>
            </div>
          )}
          
        </div>
        {cart.length > 0 && (
          <div className="mt-8 bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative">
            <h2 className="text-xl font-black mb-6">
              Project Cart ({cart.length} Elements)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 px-4 py-3 rounded-2xl flex items-center justify-between border border-slate-700/50"
                  >
                    <div>
                      <div className="font-bold text-lg">
                        {item.name}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">
                        {item.type}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-400 hover:text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl border border-indigo-500/30 self-start">
                <h3 className="font-bold text-indigo-200 text-sm uppercase tracking-widest mb-6">
                  Accumulated Total
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                    <span className="text-indigo-100/70 font-semibold">
                      Cement
                    </span>
                    <span className="font-mono font-bold text-white">
                      {totalCement.toFixed(2)} Bags
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                    <span className="text-indigo-100/70 font-semibold">
                      Sand
                    </span>
                    <span className="font-mono font-bold text-white">
                      {totalSand.toFixed(2)} {isSI ? "m³" : "cft"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                    <span className="text-indigo-100/70 font-semibold">
                      Aggregate
                    </span>
                    <span className="font-mono font-bold text-white">
                      {totalAgg.toFixed(2)} {isSI ? "m³" : "cft"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-indigo-100/70 font-semibold">
                      Water
                    </span>
                    <span className="font-mono font-bold text-white">
                      {totalWater.toFixed(1)} L
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              
              
              
            </div>
          </div>
        )}
      </div>
      {(activeTab !== 'master' && activeTab !== 'rcc') && (
        <CalculationHistory
          calculatorId={`material_calc_${activeTab}`}
          currentInputs={currentExportInputs}
          currentResults={currentExportData}
          summaryGeneration={(inputs, results) => `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} calculation`}
          onRestore={(inputs) => {
            if (activeTab === "concrete") {
              if (inputs["Dimensions"]) {
                const match = inputs["Dimensions"].match(/Length:\s([\d.]+).*?Width:\s([\d.]+).*?Depth:\s([\d.]+)/);
                if (match) { setCLength(match[1]); setCWidth(match[2]); setCDepth(match[3]); }
              }
              if (inputs["Mix Ratio"]) setCMix(inputs["Mix Ratio"]);
              if (inputs["W/C Ratio"]) setCWcRatio(inputs["W/C Ratio"]);
              if (inputs["Wastage Allowed"]) setWastage(inputs["Wastage Allowed"].replace("%", ""));
            } else if (activeTab === "bricks" || activeTab === "blocks") {
              if (inputs["Wall Dimensions"]) {
                 const match = inputs["Wall Dimensions"].match(/Length:\s([\d.]+).*?Height:\s([\d.]+).*?Thickness:\s([\d.]+)/);
                 if (match) { setBWallL(match[1]); setBWallH(match[2]); setBWallT(match[3]); }
              }
              if (inputs["Mix Ratio (Cement:Sand)"]) setBMix(inputs["Mix Ratio (Cement:Sand)"]);
            } else if (activeTab === "plaster") {
              if (inputs["Total Plaster Area"]) setPArea(inputs["Total Plaster Area"].split(" ")[0]);
              if (inputs["Plaster Thickness"]) setPThick(inputs["Plaster Thickness"].split(" ")[0]);
              if (inputs["Mix Ratio"]) setPMix(inputs["Mix Ratio"]);
            } else if (activeTab === "steel") {
              if (inputs["Total Span/Length"]) setSSpan(inputs["Total Span/Length"].split(" ")[0]);
              if (inputs["Spacing (c/c)"]) setSSpace(inputs["Spacing (c/c)"].split(" ")[0]);
              if (inputs["Bar Diameter"]) setSDia(inputs["Bar Diameter"].split(" ")[0]);
            }
          }}
        />
      )}
    </div>
  );
}
