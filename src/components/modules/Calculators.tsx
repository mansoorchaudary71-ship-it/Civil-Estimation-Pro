import React, { useState } from "react";
import { UniversalTabs } from "../ui/UniversalTabs";
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
  Clock,
  HelpCircle,
} from "lucide-react";
import { useGlobalSettings } from "../../context/SettingsContext";
import { useEstimateProcessing } from "../../hooks/useEstimateProcessing";
import { MaterialSummary } from "../ui/MaterialSummary";
import { ProcessingSkeleton } from "../ui/ProcessingSkeleton";
import {
  ConcreteMortarCalculator,
  BrickworkCalculator,
  PlasterCalculator,
  SteelCalculator,
} from "../../utils/calculators";

import UnitToggleGroup from "../ui/UnitToggleGroup";
import MasterQuantityEstimator from "./MasterQuantityEstimator";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import Brickwork9InchModule from "./Brickwork9InchModule";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { CalculationHistory } from "../ui/CalculationHistory";
import { SEO } from "../SEO";
import { StyledChart } from "../ui/EstimateVisualizer";

export default function ConstructionMaterialEstimator({ forcedTab, hideHeader }: { forcedTab?: "master" | "concrete" | "bricks" | "blocks" | "plaster" | "bricks-blocks" | "steel"; hideHeader?: boolean } = {}) {
  const { formatCurrency, currentUnit, setCurrentUnit, currentCurrency } = useGlobalSettings();
  const { user } = useAuth();
  const { isProcessing, hasData, processEstimate, resetEstimate } = useEstimateProcessing();
  
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
  const unitVol = isSI ? "m³" : "ft³";
  const unitArea = isSI ? "m²" : "sq.ft";
  const tabs = [
    { id: "master", label: "Master Quantities", icon: Calculator },
    { id: "concrete", label: "Concrete", icon: Box },
    { id: "bricks", label: "Bricks", icon: Columns },
    { id: "blocks", label: "Blocks", icon: Container },
    { id: "plaster", label: "Finishes", icon: PaintBucket },
    { id: "steel", label: "Steel", icon: Layers },
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
  type TabId = (typeof fullTabs)[number]["id"] | "bricks-blocks";
  const [activeTab, setActiveTab] = useState<TabId>(forcedTab || "master");
  const [concreteType, setConcreteType] = useState<"slab" | "column" | "staircase">("slab");
  const [finishesType, setFinishesType] = useState<"plaster" | "paint" | "antitermite">("plaster");

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
  /* Concrete - Slab */ const [cLength, setCLength] = useState("10");
  const [cWidth, setCWidth] = useState("10");
  const [cDepth, setCDepth] = useState(isSI ? "0.15" : "0.5");
  /* Concrete - Column */ const [cColDia, setCColDia] = useState(isSI ? "0.3" : "1");
  const [cColHeight, setCColHeight] = useState(isSI ? "3" : "10");
  /* Concrete - Staircase */ const [cStairSteps, setCStairSteps] = useState("15");
  const [cStairTread, setCStairTread] = useState(isSI ? "0.25" : "0.82");
  const [cStairRiser, setCStairRiser] = useState(isSI ? "0.15" : "0.5");
  const [cStairWidth, setCStairWidth] = useState(isSI ? "1.2" : "4");
  const [cStairWaist, setCStairWaist] = useState(isSI ? "0.15" : "0.5");
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
  const [pLocation, setPLocation] = useState<"Internal" | "External">("Internal");
  /* Paint */ const [paintArea, setPaintArea] = useState("500");
  const [paintCoats, setPaintCoats] = useState("2");
  /* Anti-Termite */ const [termiteArea, setTermiteArea] = useState("1000");
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
    let volume = 0;
    
    if (concreteType === "slab") {
      volume = parseNum(cLength) * parseNum(cWidth) * parseNum(cDepth);
    } else if (concreteType === "column") {
      const r = parseNum(cColDia) / 2;
      volume = Math.PI * r * r * parseNum(cColHeight);
    } else if (concreteType === "staircase") {
      const steps = parseNum(cStairSteps);
      const tread = parseNum(cStairTread);
      const riser = parseNum(cStairRiser);
      const width = parseNum(cStairWidth);
      const waist = parseNum(cStairWaist);
      
      const stepVol = steps * (0.5 * tread * riser * width);
      const flightLen = steps * Math.sqrt(tread * tread + riser * riser);
      const waistVol = flightLen * waist * width;
      volume = stepVol + waistVol;
    }
    
    // Fake L=volume, W=1, D=1 to reuse the calculator
    const calc = new ConcreteMortarCalculator(
      volume,
      1,
      1,
      cMix,
      parseNum(wastage),
      parseNum(cWcRatio),
      isSI,
    );
    const res = calc.calculate();

    const titlePrefix = concreteType === "column" ? "Round Column" : concreteType === "staircase" ? "Stair Case" : "Standard Slab";

    currentExportInputs = {
      Type: titlePrefix,
      "Mix Ratio": cMix,
      "W/C Ratio": cWcRatio,
      "Wastage Allowed": `${wastage}%`,
      ...(concreteType === "slab" ? {
        Dimensions: `Length: ${cLength} ${unitFt} | Width: ${cWidth} ${unitFt} | Depth: ${cDepth} ${unitFt}`,
      } : concreteType === "column" ? {
        Dimensions: `Diameter: ${cColDia} ${unitFt} | Height: ${cColHeight} ${unitFt}`
      } : {
        Dimensions: `Steps: ${cStairSteps} | Width: ${cStairWidth} ${unitFt} | Tread: ${cStairTread} ${unitFt} | Riser: ${cStairRiser} ${unitFt} | Waist: ${cStairWaist} ${unitFt}`
      })
    };
    currentExportData = {
      "Type": titlePrefix,
      "Concrete Mixed Volume": `${res.totalWetVolume.toFixed(2)} ${unitVol}`,
      [`Dry Volume (+${wastage}% waste)`]: `${(res.totalWetVolume * CIVIL_CONSTANTS.DRY_CONCRETE_FACTOR * (1 + parseNum(wastage) / 100)).toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`,
      "Aggregate Required": `${res.aggregateVol.toFixed(2)} ${unitVol}`,
      "Water Required": isSI ? `${res.waterLiters.toFixed(1)} Liters` : `${(res.waterLiters / 3.78541).toFixed(1)} Gallons`,
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
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-[24px] border w-full relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h3 className="font-bold text-lg text-text-primary">
              Concrete Estimator
            </h3>
            <UnitToggleGroup
              units={[
                { id: "Metric", label: "Metric (m³, L)" },
                { id: "Imperial", label: "Imperial (ft³, gal)" },
              ]}
              activeUnit={currentUnit || "Metric"}
              onChange={setCurrentUnit}
              size="sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-[24px] w-full sm:w-auto">
            {(["slab", "column", "staircase"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { 
                  setConcreteType(type); 
                  if(hasData) resetEstimate(); 
                  
                  // Suggest standard concrete grades based on structural member
                  if (type === "slab") setCMix("1:1.5:3"); // M20 is standard for slabs
                  else if (type === "column") setCMix("1:1.5:3"); // M20+ is standard for columns
                  else if (type === "staircase") setCMix("1:2:4"); // M15/M20 can be used
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-[24px] text-xs font-bold transition-all ${
                  concreteType === type 
                    ? "bg-white  shadow-sm text-indigo-600 " 
                    : "text-slate-500 hover:text-slate-700 "
                }`}
              >
                {type === "slab" ? "Slab" : type === "column" ? "Round Column" : "Staircase"}
              </button>
            ))}
          </div>
        </div>

        {concreteType === "slab" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Length ({unitFt})
              </label>
              <input
                type="number"
                value={cLength}
                onChange={(e) => setCLength(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Width ({unitFt})
              </label>
              <input
                type="number"
                value={cWidth}
                onChange={(e) => setCWidth(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Depth ({unitFt})
              </label>
              <input
                type="number"
                value={cDepth}
                onChange={(e) => setCDepth(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {concreteType === "column" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Diameter ({unitFt})
              </label>
              <input
                type="number"
                value={cColDia}
                onChange={(e) => setCColDia(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Height ({unitFt})
              </label>
              <input
                type="number"
                value={cColHeight}
                onChange={(e) => setCColHeight(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {concreteType === "staircase" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Number of Steps
              </label>
              <input
                type="number"
                value={cStairSteps}
                onChange={(e) => setCStairSteps(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Stair Width ({unitFt})
              </label>
              <input
                type="number"
                value={cStairWidth}
                onChange={(e) => setCStairWidth(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Tread Length ({unitFt})
              </label>
              <input
                type="number"
                value={cStairTread}
                onChange={(e) => setCStairTread(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Riser Height ({unitFt})
              </label>
              <input
                type="number"
                value={cStairRiser}
                onChange={(e) => setCStairRiser(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Waist Slab Thick ({unitFt})
              </label>
              <input
                type="number"
                value={cStairWaist}
                onChange={(e) => setCStairWaist(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        )}
        <div className="bg-blue-50/50 rounded-[24px] px-4 py-3 border border-blue-100 flex items-center justify-center min-h-[8rem] relative text-[10px] font-bold text-blue-500/80 overflow-hidden">
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
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Mix Ratio
              </label>
              <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Standard: {concreteType === 'slab' || concreteType === 'column' ? 'M20' : 'M15/M20'}
              </span>
            </div>
            <select
              value={cMix}
              onChange={(e) => setCMix(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
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
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              W/C Ratio (0.45-0.6)
            </label>
            <input
              type="number"
              step="0.01"
              value={cWcRatio}
              onChange={(e) => setCWcRatio(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
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
        <Brickwork9InchModule hideHistory={true} />
      ) : (
        <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-[24px] border w-full">
          <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-500">
            {activeTab} Wall
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Wall Length ({unitFt})
              </label>
              <input
                type="number"
                value={bWallL}
                onChange={(e) => setBWallL(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Wall Height ({unitFt})
              </label>
              <input
                type="number"
                value={bWallH}
                onChange={(e) => setBWallH(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Wall Thick ({unitIn})
              </label>
              <input
                type="number"
                value={bWallT}
                onChange={(e) => setBWallT(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="bg-amber-50/50 rounded-[24px] px-4 py-3 border border-amber-100 flex items-center justify-center min-h-[8rem] relative text-[10px] font-bold text-amber-600/80 overflow-hidden">
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
          <div className="bg-white px-4 py-3 rounded-[24px] border">
            <h4 className="text-xs font-bold text-slate-700 uppercase flex justify-between items-center mb-4">
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
                  className="bg-transparent border p-2 rounded-[16px] text-xs font-medium"
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
                    className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
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
                    className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
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
                    className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
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
                className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-[16px] text-xs font-bold hover:bg-indigo-50 transition-colors"
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
                    <span className="text-slate-700">
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
          <h3 className="font-bold border-b pb-2 pt-4 uppercase text-sm tracking-widest text-slate-700">
            Unit Dimensions ({unitIn})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Length
              </label>
              <input
                type="number"
                value={l}
                onChange={(e) => setL(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Width
              </label>
              <input
                type="number"
                value={w}
                onChange={(e) => setW(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Height
              </label>
              <input
                type="number"
                value={h}
                onChange={(e) => setH(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Joint Thick ({unitIn})
              </label>
              <input
                type="number"
                value={j}
                onChange={(e) => setJ(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Mortar Mix
              </label>
              <select
                value={bMix}
                onChange={(e) => setBMix(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
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
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-[24px] border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-700">
          Steel Reinforcement
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              Bar Dia (mm/in#)
            </label>
            <input
              type="number"
              value={sDia}
              onChange={(e) => setSDia(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              Span Length ({unitFt})
            </label>
            <input
              type="number"
              value={sSpan}
              onChange={(e) => setSSpan(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label
              className="text-[10px] font-bold text-gray-700 uppercase"
              title="Center-to-center spacing"
            >
              Spacing c/c ({isSI ? "mm" : "inch"})
            </label>
            <input
              type="number"
              value={sSpace}
              onChange={(e) => setSSpace(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              Standard Bar Length ({unitFt})
            </label>
            <input
              type="number"
              value={sBarL}
              onChange={(e) => setSBarL(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              Overlap Factor (xD)
            </label>
            <input
              type="number"
              value={sOverlap}
              onChange={(e) => setSOverlap(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "plaster") {
    if (finishesType === "plaster") {
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
        Type: "Plastering",
        "Location": pLocation,
        "Surface Area": `${pArea} ${unitArea}`,
        Thickness: `${pThick} ${unitIn}`,
        "Mix Ratio": pMix,
        "Wastage Allowed": `${wastage}%`,
      };
      currentExportData = {
        "Type": "Plaster",
        "Total Wet Volume": `${res.totalWetVolume.toFixed(2)} ${unitVol}`,
        "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
        "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`,
        "Water Required": `${res.waterLiters.toFixed(1)} L`,
      };
      currentCartItem = {
        type: "Plaster",
        cementBags: res.cementBags,
        sandVol: res.sandVol,
        aggregateVol: 0,
        waterLiters: res.waterLiters,
        unitVol,
        rawExport: currentExportData,
      };
    } else if (finishesType === "paint") {
      const area = parseNum(paintArea);
      const coats = parseNum(paintCoats);
      // Rough industry averages
      const paintCovSqM = 10;
      const primerCovSqM = 12;
      const paintCovSqFt = 107.6;
      const primerCovSqFt = 129.1;

      const paintLiters = isSI 
        ? (area * coats) / paintCovSqM
        : (area * coats) / paintCovSqFt;

      const primerLiters = isSI
        ? area / primerCovSqM
        : area / primerCovSqFt;

      currentExportInputs = {
        Type: "Paint Work",
        "Wall Area": `${paintArea} ${unitArea}`,
        "Number of Coats": paintCoats,
      };
      currentExportData = {
        "Type": "Paint",
        "Paint Required": `${paintLiters.toFixed(2)} Liters`,
        "Primer Required": `${primerLiters.toFixed(2)} Liters`,
      };
      currentCartItem = {
        type: "Paint",
        cementBags: 0,
        sandVol: 0,
        aggregateVol: 0,
        waterLiters: 0,
        unitVol,
        rawExport: currentExportData,
        // For custom inputs, we omit them from the cart standard cement/sand etc. 
      };
    } else if (finishesType === "antitermite") {
      const area = parseNum(termiteArea);
      // IS 6313 / BS standard approximations for pre-construction soil treatment
      const chemLiters = isSI 
        ? area * 5 
        : area * 0.4645; // 5L per 10.76 sqft
      currentExportInputs = {
        Type: "Anti-Termite Treatment",
        "Plinth Area": `${termiteArea} ${unitArea}`,
      };
      currentExportData = {
        "Type": "Anti-Termite",
        "Chemical Emulsion Required": `${chemLiters.toFixed(2)} Liters`,
      };
      currentCartItem = {
        type: "Anti-Termite",
        cementBags: 0,
        sandVol: 0,
        aggregateVol: 0,
        waterLiters: 0,
        unitVol,
        rawExport: currentExportData,
      };
    }

    content = (
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-[24px] border w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-4">
          <h3 className="font-bold text-lg text-text-primary flex flex-wrap items-center gap-2">
            Finishes Estimator
            {finishesType === "plaster" && (
              <>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold tracking-wide uppercase">
                  Beginner
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 MIN
                </span>
              </>
            )}
          </h3>
          <div className="flex bg-white p-1 rounded-[24px] w-full sm:w-auto">
            {(["plaster", "paint", "antitermite"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setFinishesType(type); if(hasData) resetEstimate(); }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-[24px] text-xs font-bold transition-all ${
                  finishesType === type 
                    ? "bg-white  shadow-sm text-indigo-600 " 
                    : "text-slate-500 hover:text-slate-700 "
                }`}
              >
                {type === "plaster" ? "Plastering" : type === "paint" ? "Paint Work" : "Anti-Termite"}
              </button>
            ))}
          </div>
        </div>

        {finishesType === "plaster" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase mb-2 block">
                Plaster Location
              </label>
              <div className="flex bg-slate-100 p-1 rounded-[24px] w-full">
                <button
                  type="button"
                  onClick={() => {
                    setPLocation("Internal");
                    setPThick(isSI ? "1.2" : "0.5");
                    setPMix("1:4");
                  }}
                  className={`flex-1 px-4 py-2 rounded-[24px] text-xs font-bold transition-all ${
                    pLocation === "Internal" 
                      ? "bg-white  shadow-sm text-indigo-600 " 
                      : "text-slate-500 hover:text-slate-700 "
                  }`}
                >
                  Internal (12mm)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPLocation("External");
                    setPThick(isSI ? "2.0" : "0.75");
                    setPMix("1:6");
                  }}
                  className={`flex-1 px-4 py-2 rounded-[24px] text-xs font-bold transition-all ${
                    pLocation === "External" 
                      ? "bg-white  shadow-sm text-indigo-600 " 
                      : "text-slate-500 hover:text-slate-700 "
                  }`}
                >
                  External (20mm)
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Wall Area ({unitArea})
              </label>
              <input
                type="number"
                value={pArea}
                onChange={(e) => setPArea(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Thickness ({unitIn})
              </label>
              <input
                type="number"
                value={pThick}
                onChange={(e) => setPThick(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Mix Ratio (Cement:Sand)
              </label>
              <select
                value={pMix}
                onChange={(e) => setPMix(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              >
                <option value="1:3">1:3 (Ceiling/Rich mix)</option>
                <option value="1:4">1:4 (Internal walls)</option>
                <option value="1:5">1:5 (Standard)</option>
                <option value="1:6">1:6 (External/Rough)</option>
              </select>
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-3 bg-slate-50 border border-slate-200 rounded-[24px] border border-slate-100">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase flex items-center justify-between">
                  Cement Density (kg/m³)
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="number"
                  defaultValue="1440"
                  className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase flex items-center justify-between">
                  Sand Density (kg/m³)
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="number"
                  defaultValue="1600"
                  className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2 mt-4 p-4 rounded-[24px] border border-indigo-200 bg-indigo-50/50">
              <h4 className="text-sm font-semibold text-indigo-900 mb-2">Math Logic & Formulas (Built-in)</h4>
              <ul className="text-xs text-indigo-800 space-y-1.5 list-disc list-inside">
                <li><strong>Wet Volume (V_wet):</strong> Area × (Thickness / 100)</li>
                <li><strong>Dry Volume (V_dry):</strong> V_wet × 1.33 (wastage/voids) × 1.25 (shrinkage) = <strong>V_wet × 1.6625</strong></li>
                <li><strong>Cement Bags:</strong> [V_dry × (Cement Ratio / Total Ratio)] / 0.0347</li>
              </ul>
            </div>

            <div className="sm:col-span-2 mt-6">
              <h4 className="font-bold text-slate-800 mb-3">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-[16px] border border-slate-100">
                  <p className="font-semibold text-sm text-slate-700">Why do we multiply wet volume by 1.33?</p>
                  <p className="text-xs text-slate-500 mt-1">Dry mortar volume is typically 30-33% more than wet volume due to voids getting filled with water during mixing.</p>
                </div>
                <div className="bg-white p-3 rounded-[16px] border border-slate-100">
                  <p className="font-semibold text-sm text-slate-700">What is the standard mix ratio for internal plaster?</p>
                  <p className="text-xs text-slate-500 mt-1">1:4 (1 part cement to 4 parts sand) is the standard for internal walls and ceilings, ensuring strong adherence.</p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 mt-6">
              <h4 className="font-bold text-slate-800 mb-3">Related Tools</h4>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('concrete')} className="px-3 py-2 text-xs font-semibold rounded-[16px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">Concrete Calculator</button>
                <button onClick={() => setActiveTab('bricks')} className="px-3 py-2 text-xs font-semibold rounded-[16px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">Brickwork Estimator</button>
              </div>
            </div>
          </div>
        )}

        {finishesType === "paint" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Wall Area ({unitArea})
              </label>
              <input
                type="number"
                value={paintArea}
                onChange={(e) => setPaintArea(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Number of Coats
              </label>
              <input
                type="number"
                value={paintCoats}
                onChange={(e) => setPaintCoats(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {finishesType === "antitermite" && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">
                Plinth Area ({unitArea})
              </label>
              <input
                type="number"
                value={termiteArea}
                onChange={(e) => setTermiteArea(e.target.value)}
                className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        )}
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
      <div className="space-y-6 bg-transparent/50 px-4 py-3 rounded-[24px] border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-700">
          Water Requirements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              Weight of Cement (kg)
            </label>
            <input
              type="number"
              value={wCementKg}
              onChange={(e) => setWCementKg(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 uppercase">
              W/C Ratio (0.45-0.6)
            </label>
            <input
              type="number"
              step="0.01"
              value={wWcRatio}
              onChange={(e) => setWWcRatio(e.target.value)}
              className="mt-1 w-full bg-transparent border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-sm transition-all shadow-sm"
            />
          </div>
        </div>
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
      <div className="bg-transparent border p-12 rounded-[24px] text-center text-slate-700 max-w-xl mx-auto mt-8">
        <Layers className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
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

  let explanationOpts: any = {
    hasInputs: false,
    genericFormula: [],
    activeBreakdown: [],
    notes: []
  };

  const hasConcreteInputs = !!(parseNum(cLength) || parseNum(cWidth) || parseNum(cDepth) || parseNum(cColDia) || parseNum(cStairSteps));
  const hasBrickInputs = !!(parseNum(bWallL) || parseNum(bWallH));
  
  if (activeTab === "concrete") {
    explanationOpts.hasInputs = hasConcreteInputs;
    explanationOpts.genericFormula = [
      { label: "Wet Volume", formula: "Length × Width × Depth" },
      { label: "Dry Volume", formula: "Wet Volume × 1.54 × (1 + Wastage)" },
      { label: "Cement", formula: "(Ratio of Cement / Sum of Ratios) × Dry Volume" }
    ];
    if (hasConcreteInputs && currentExportData["Concrete Mixed Volume"]) {
      explanationOpts.activeBreakdown = [
        { label: "Dry Volume", formula: `${parseFloat(currentExportData["Concrete Mixed Volume"])} × 1.54 × (1 + ${wastage || 0}%)`, result: currentExportData[`Dry Volume (+${wastage}% waste)`] },
        { label: "Cement", formula: `Dry Volume × Ratio`, result: currentExportData["Cement Required"] },
      ];
    }
    explanationOpts.notes = ["1 bag of cement = 50 kg", "Dry volume coefficient for concrete is 1.54"];
  }

  return (
    <div className={hideHeader ? "w-full" : "w-full h-full overflow-y-auto bg-transparent text-slate-900 p-6 md:p-8"}>
      {!hideHeader && (
        <SEO 
          title="Construction Material Estimator" 
          description="Calculate exact material requirements like cement, sand, and aggregate for brickwork, plaster, and concrete across your construction projects." 
          canonicalUrl="https://civilestimationpro.com/calculators" 
          schema={schema}
        />
      )}
      <div className={hideHeader ? "w-full" : "max-w-7xl mx-auto"}>
        {!hideHeader && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900 mb-2">
                Construction Material Estimator
              </h1>
              <p className="text-gray-700 font-medium">
                Accurate estimations for concrete, bricks, steel, blocks, and
                mortar.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <GlobalSettingsToggle align="left" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white px-4 py-3 rounded-[24px] border flex items-center gap-2 shadow-sm">
                <span className="text-xs font-bold text-gray-700">
                  WASTAGE
                </span>
                <input
                  type="number"
                  value={wastage}
                  onChange={(e) => setWastage(e.target.value)}
                  className="w-14 text-center font-bold bg-transparent rounded border border-slate-200 p-1 focus:ring-2 focus:ring-indigo-500/50"
                />
                <span className="text-xs font-bold text-gray-700">%</span>
              </div>
            </div>
          </div>
        )}
        {!hideHeader && (
          <div className="mb-4">
            <UniversalTabs 
              tabs={fullTabs.map(t => ({ id: t.id, label: t.label, icon: <t.icon className="w-4 h-4" /> }))}
              activeTab={activeTab}
              onTabChange={(id) => { setActiveTab(id as any); resetEstimate(); }}
            />
          </div>
        )}
        <div className="bg-bg-card p-6 md:p-8 rounded-[24px] shadow-md border border-border-color transition-all duration-300 relative">
          <div className={`grid grid-cols-1 ${activeTab !== "master" && activeTab !== "cement" && activeTab !== "sand" && activeTab !== "bricks" ? "lg:grid-cols-2 gap-8 relative" : "gap-4"}`}>
            <div 
              className={`flex flex-col gap-4 ${activeTab === "master" || activeTab === "bricks" ? "lg:col-span-2" : ""}`}
              onChange={(e) => {
                if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') {
                  if (hasData) resetEstimate();
                }
              }}
            >
              {content}
              {activeTab !== "cement" &&
                activeTab !== "sand" &&
                activeTab !== "master" &&
                activeTab !== "bricks" && (
                  <button
                    onClick={() => processEstimate(() => {})}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-900 font-bold py-4 px-6 rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(34,211,238,0.4)] transition-all mt-4"
                  >
                    {isProcessing ? "Computing Estimate..." : "Compute Estimate"}
                  </button>
              )}
            </div>
            
            {activeTab !== "cement" &&
              activeTab !== "sand" &&
              activeTab !== "master" &&
              activeTab !== "bricks" && (
                isProcessing ? (
                  <div className="sticky top-6 self-start z-10 w-full">
                    <ProcessingSkeleton count={4} />
                  </div>
                ) : hasData ? (
                  <div className="sticky top-6 self-start z-10 w-full">
                    <MaterialSummary
                      title="Material Breakdown"
                      totalLabel="Status"
                      totalValue="Computed"
                      totalUnit=""
                    >
                      <div className="flex justify-end mb-4 border-b border-slate-200/50 pb-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs bg-slate-50 border border-slate-200 border border-slate-200 p-2 rounded-[16px] hover:bg-slate-50 border border-slate-200 transition">
                          <input
                            type="checkbox"
                            checked={showCost}
                            onChange={(e) => setShowCost(e.target.checked)}
                            className="accent-indigo-500 w-4 h-4 rounded"
                          />
                          <span className="text-slate-700 font-bold">Cost Est.</span>
                        </label>
                      </div>
                  {Object.entries(currentExportData).map(([key, val]) => {
                    let colorClass = "text-slate-700 ";
                    if (key.includes("Cement"))
                      colorClass = "text-blue-400 font-bold";
                    else if (key.includes("Sand"))
                      colorClass = "text-amber-400 font-bold";
                    else if (key.includes("Aggregate"))
                      colorClass = "text-gray-700  font-bold";
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
                          className={`${key.includes("Units Required") ? "font-mono font-bold text-slate-900  uppercase text-xl" : "font-mono font-bold text-slate-900 "} text-left sm:text-right`}
                        >
                          {val}
                        </span>
                      </div>
                    );
                  })}
                  {showCost && currentCartItem && (
                    <div className="pt-4 mt-4 border-t-2 border-slate-200 space-y-3">
                      <div className="grid grid-cols-2 gapx-4 py-3 text-xs bg-slate-50 border border-slate-200 p-3 rounded-[24px] border border-slate-200">
                        {currentCartItem.cementBags > 0 && (
                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-slate-700 mb-1 block">
                              Cement (per bag)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                            <label className="text-slate-700 mb-1 block">
                              Sand (per {currentCartItem.unitVol})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                            <label className="text-slate-700 mb-1 block">
                              Aggregate (per {currentCartItem.unitVol})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                              <label className="text-slate-700 mb-1 block">
                                Steel (per kg)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                              <label className="text-slate-700 mb-1 block">
                                Bricks (per unit)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                              <label className="text-slate-700 mb-1 block">
                                Blocks (per unit)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                            <label className="text-slate-700 mb-1 block">
                              Water (per {isSI ? "L" : "Gal"})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              className="w-full bg-white border border-slate-200 rounded-[16px] p-2.5 text-slate-800 font-mono focus:ring-2 focus:ring-[#6B46C1]/50 outline-none transition-all"
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
                            <div className="text-xs text-slate-500 mt-1 uppercase text-right">
                              {isSI 
                                ? `${currentCartItem.waterLiters.toFixed(1)} L` 
                                : `${(currentCartItem.waterLiters / 3.78541).toFixed(1)} Gal`}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-6 pb-2 border-t mt-4 border-border-color">
                        <span className="text-slate-700 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                          Estimated Cost
                        </span>
                        <div className="bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-5 py-2 rounded-full text-2xl font-semibold tabular-nums tracking-tight">
                          {formatCurrency(
                            currentCartItem.cementBags * rates.cement +
                              currentCartItem.sandVol * rates.sand +
                              (currentCartItem.aggregateVol || 0) *
                                rates.aggregate +
                              (isSI ? currentCartItem.waterLiters : currentCartItem.waterLiters / 3.78541) * rates.water +
                              (currentCartItem.steelKg || 0) * rates.steel +
                              (currentCartItem.bricksCount || 0) *
                                rates.bricks +
                              (currentCartItem.blocksCount || 0) * rates.blocks,
                          )}
                        </div>
                      </div>
                      
                      {/* Pie Chart for Cost Breakdown */}
                      {(() => {
                        const pieData = [];
                        const cCost = currentCartItem.cementBags * rates.cement;
                        const sCost = currentCartItem.sandVol * rates.sand;
                        const aCost = (currentCartItem.aggregateVol || 0) * rates.aggregate;
                        const waterAmount = isSI ? currentCartItem.waterLiters : (currentCartItem.waterLiters / 3.78541);
                        const wCost = waterAmount * rates.water;
                        const stCost = (currentCartItem.steelKg || 0) * rates.steel;
                        const bkCost = (currentCartItem.bricksCount || 0) * rates.bricks;
                        const blCost = (currentCartItem.blocksCount || 0) * rates.blocks;

                        if (cCost > 0) pieData.push({ name: 'Cement', value: cCost, fill: '#3b82f6' }); // blue-500
                        if (sCost > 0) pieData.push({ name: 'Sand', value: sCost, fill: '#f59e0b' }); // amber-500
                        if (aCost > 0) pieData.push({ name: 'Aggregate', value: aCost, fill: '#64748b' }); // slate-500
                        if (wCost > 0) pieData.push({ name: 'Water', value: wCost, fill: '#06b6d4' }); // cyan-500
                        if (stCost > 0) pieData.push({ name: 'Steel', value: stCost, fill: '#6366f1' }); // indigo-500
                        if (bkCost > 0) pieData.push({ name: 'Bricks', value: bkCost, fill: '#f43f5e' }); // rose-500
                        if (blCost > 0) pieData.push({ name: 'Blocks', value: blCost, fill: '#8b5cf6' }); // violet-500

                        if (pieData.length === 0) return null;

                        return (
                          <div className="mt-6 pt-4 border-t border-border-color">
                            <StyledChart 
                              data={pieData} 
                              type="pie" 
                              title="Cost Breakdown" 
                              valueFormatter={(val) => formatCurrency(val)}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </MaterialSummary>
              </div>
              ) : (
                <div className="bg-white rounded-[24px] p-8 border-2 border-dashed border-border-color flex flex-col items-center justify-center text-center sticky top-6 self-start h-full min-h-[300px] w-full">
                    <Calculator className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="font-bold text-slate-700 text-lg">Waiting to Compute</h3>
                    <p className="text-slate-500 text-sm mt-2">Enter your dimensions on the left and click the Compute Estimate button to see the detailed material breakdown.</p>
                  </div>
                )
              )}
          </div>
          {hasData && currentCartItem && (
            <div className="mt-8 pt-6 border-t border-border-color flex flex-col sm:flex-row gap-4 items-end pb-12 sm:pb-0">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-gray-700 uppercase">
                  Element Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Footing A, Slab B, Retaining Wall"
                  value={elementName}
                  onChange={(e) => setElementName(e.target.value)}
                  className="w-full bg-transparent border border-slate-200 p-4 rounded-[24px] mt-1 font-medium focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <button
                onClick={addToCart}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold transition-colors shadow-md shadow-indigo-600/20"
              >
                + Add to Estimate
              </button>
            </div>
          )}
          
        </div>
        {cart.length > 0 && (
          <div className="mt-8 bg-white border border-slate-200 border-l-[4px] border-l-[#6B46C1] rounded-[2rem] p-6 md:p-8 shadow-sm relative">
            <h2 className="text-xl font-semibold tabular-nums tracking-tight mb-6 text-slate-800">
              Project Cart ({cart.length} Elements)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-[24px] flex items-center justify-between border border-slate-100"
                  >
                    <div>
                      <div className="font-bold text-lg text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                        {item.type}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-[16px] text-sm font-bold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-[#6B46C1] to-orange-500 p-6 rounded-[24px] border border-white/20 self-start text-slate-900">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-6">
                  Accumulated Total
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                    <span className="text-slate-600 font-semibold">
                      Cement
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {totalCement.toFixed(2)} Bags
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                    <span className="text-slate-600 font-semibold">
                      Sand
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {totalSand.toFixed(2)} {isSI ? "m³" : "cft"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                    <span className="text-slate-600 font-semibold">
                      Aggregate
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {totalAgg.toFixed(2)} {isSI ? "m³" : "cft"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600 font-semibold">
                      Water
                    </span>
                    <span className="font-mono font-bold text-slate-900 uppercase text-right">
                      {isSI ? `${totalWater.toFixed(1)} L` : `${(totalWater / 3.78541).toFixed(1)} Gal`}
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

      <CalculationHistory
        calculatorId="master_calculators"
        estimationName="Material Estimator"
        currentInputs={{ activeTab }}
        currentResults={{ totalCement, totalSand, totalAgg, totalWater }}
      />
    </div>
  );
}
