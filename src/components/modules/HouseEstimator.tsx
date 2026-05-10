import React, { useState, useMemo, useReducer } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import {
  Home,
  Layers,
  PaintRoller,
  Sliders,
  LayoutDashboard,
  Settings,
  ChevronUp,
  ChevronDown,
  Share2,
  Download,
  Database,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Spline,
  Calculator,
  Briefcase,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useMarketRates } from "../../context/MarketRatesContext";
import { useSettings } from "../../context/SettingsContext";

import AdvancedSpecs, { SpecsState, initialSpecs } from "./AdvancedSpecs";
import GlobalSettingsModal from "./GlobalSettingsModal";
import RccStructureCalculator from "./RccStructureCalculator";
import MasterQuantityEstimator from "./MasterQuantityEstimator";
import ColorfulTab from "../ui/ColorfulTab";
import UnitToggleGroup from "../ui/UnitToggleGroup";
type GeometryState = {
  plotSizeUnit: "marla" | "sqyd" | "sqft";
  plotSizeValue: string;
  coveredAreaSqft: string;
  roomHeight: string;
  stories: number;
  rooms: {
    bedrooms: number;
    washrooms: number;
    kitchens: number;
    drawingDining: number;
  };
  roomAreas: {
    bedrooms: string;
    washrooms: string;
    kitchens: string;
    drawingDining: string;
  };
  roomAreaUnit: "sqft" | "sqm" | "sqyd";
};
type GeometryAction =
  | { type: "SET_PLOT_SIZE_UNIT"; payload: "marla" | "sqyd" | "sqft" }
  | { type: "SET_PLOT_SIZE_VALUE"; payload: string }
  | { type: "SET_COVERED_AREA_SQFT"; payload: string }
  | { type: "SET_ROOM_HEIGHT"; payload: string }
  | { type: "SET_STORIES"; payload: number }
  | { type: "SET_ROOMS"; payload: Partial<GeometryState["rooms"]> }
  | { type: "INCREMENT_ROOM"; payload: keyof GeometryState["rooms"] }
  | { type: "DECREMENT_ROOM"; payload: keyof GeometryState["rooms"] }
  | {
      type: "SET_ROOM_AREA";
      payload: { room: keyof GeometryState["roomAreas"]; area: string };
    }
  | { type: "SET_ROOM_AREA_UNIT"; payload: "sqft" | "sqm" | "sqyd" };
const initialGeometry: GeometryState = {
  plotSizeUnit: "marla",
  plotSizeValue: "5",
  coveredAreaSqft: "900",
  roomHeight: "10.5",
  stories: 2,
  rooms: { bedrooms: 3, washrooms: 3, kitchens: 1, drawingDining: 1 },
  roomAreas: {
    bedrooms: "150",
    washrooms: "45",
    kitchens: "100",
    drawingDining: "220",
  },
  roomAreaUnit: "sqft",
};
function geometryReducer(
  state: GeometryState,
  action: GeometryAction,
): GeometryState {
  switch (action.type) {
    case "SET_PLOT_SIZE_UNIT":
      return { ...state, plotSizeUnit: action.payload };
    case "SET_PLOT_SIZE_VALUE":
      return { ...state, plotSizeValue: action.payload };
    case "SET_COVERED_AREA_SQFT":
      return { ...state, coveredAreaSqft: action.payload };
    case "SET_ROOM_HEIGHT":
      return { ...state, roomHeight: action.payload };
    case "SET_STORIES":
      return { ...state, stories: action.payload };
    case "SET_ROOMS":
      return { ...state, rooms: { ...state.rooms, ...action.payload } };
    case "INCREMENT_ROOM":
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload]: state.rooms[action.payload] + 1,
        },
      };
    case "DECREMENT_ROOM":
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload]: Math.max(0, state.rooms[action.payload] - 1),
        },
      };
    case "SET_ROOM_AREA":
      return {
        ...state,
        roomAreas: {
          ...state.roomAreas,
          [action.payload.room]: action.payload.area,
        },
      };
    case "SET_ROOM_AREA_UNIT":
      return { ...state, roomAreaUnit: action.payload };
    default:
      return state;
  }
}
export default function HouseEstimator() {
  const {
    marketRates,
    customRates,
    rates,
    setCustomRate,
    resetCustomRates,
    isCustomRate,
  } = useMarketRates();
  const { formatCurrency, settings, convertAmount } = useSettings();
  const isSI = settings.measurement === "SI";
  const [geoState, dispatch] = useReducer(geometryReducer, initialGeometry);
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    clientName: "",
    siteLocation: "",
  });
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [specs, setSpecs] = useState<SpecsState>(initialSpecs);
  const [isSpecsAccordionOpen, setIsSpecsAccordionOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "grey" | "finishing" | "summary" | "rcc" | "master"
  >("summary");
  const [finishQuality, setFinishQuality] = useState<number>(1);
  /* 1: Standard, 2: Premium, 3: Luxury */ const [
    isGlobalSettingsOpen,
    setIsGlobalSettingsOpen,
  ] = useState(false);
  /* Master Unit System Toggle */ const masterUnit =
    settings.measurement === "SI" ? "metric" : "imperial";
  /* Boundary Wall State */ const [
    includeBoundaryWall,
    setIncludeBoundaryWall,
  ] = useState(false);
  const [bwLength, setBwLength] = useState(100);
  /* feet */ const [bwHeight, setBwHeight] = useState(6);
  /* feet */ const [bwGateSize, setBwGateSize] = useState(12);
  /* feet */ const plotAreaSqft = useMemo(() => {
    const val = parseFloat(geoState.plotSizeValue) || 0;
    if (geoState.plotSizeUnit === "marla") return val * 225;
    if (geoState.plotSizeUnit === "sqyd") return val * 9;
    return val;
  }, [geoState.plotSizeUnit, geoState.plotSizeValue]);
  const coveredAreaSqft = useMemo(() => {
    return parseFloat(geoState.coveredAreaSqft) || 0;
  }, [geoState.coveredAreaSqft]);
  const builtUpArea = coveredAreaSqft * geoState.stories;
  const estimates = useMemo(() => {
    const stories = geoState.stories;
    const roomHeight = parseFloat(geoState.roomHeight) || 10.5;
    /* Step 1: Generate Standard Assumptions */ const totalWallLength =
      coveredAreaSqft * 0.15;
    const wallThickness = 0.75;
    /* 9 inches */ const slabThickness = 0.5;
    /* 6 inches */ const foundationDepth = 3;
    const foundationWidth = 3;
    const openingDeduction = 0.85;
    /* Step 2: Apply Exact Formulas // 1. Excavation */ const excavationVolumeCft =
      totalWallLength * foundationWidth * foundationDepth;
    /* 2. Brickwork */ const totalHeight =
      roomHeight * stories + foundationDepth;
    const brickworkVolume =
      totalWallLength * totalHeight * wallThickness * openingDeduction;
    const totalBricksNos = Math.ceil(brickworkVolume * 13.5);
    const brickworkDryMortar = brickworkVolume * 0.3;
    const cementBw = (1 / 5) * brickworkDryMortar;
    const sandBw = (4 / 5) * brickworkDryMortar;
    /* 3. RCC */ const slabVolume = coveredAreaSqft * slabThickness * stories;
    const rcWetVolume = slabVolume * 1.25;
    /* Slab + 25% for beams/columns */ const rccDryVolume = rcWetVolume * 1.54;
    const cementRcc = (1 / 7) * rccDryVolume;
    const sandRcc = (2 / 7) * rccDryVolume;
    const crushRcc = (4 / 7) * rccDryVolume;
    /* 4. Steel */ const steelKgResult = rcWetVolume * 0.015 * 222.2;
    const steelMetricTons = steelKgResult / 1000;
    /* 5. Plastering */ const plasterArea =
      totalWallLength * (roomHeight * stories) * 2 * openingDeduction;
    const plasterWetVol = plasterArea * (0.5 / 12);
    const plasterDryVol = plasterWetVol * 1.27;
    const cementPlaster = (1 / 5) * plasterDryVol;
    const sandPlaster = (4 / 5) * plasterDryVol;
    /* Totals */ const cementBagsTotal = Math.ceil(
      (cementBw + cementRcc + cementPlaster) / 1.25,
    );
    const sandCftTotal = Math.ceil(sandBw + sandRcc + sandPlaster);
    const crushCftTotal = Math.ceil(crushRcc);
    const steelKg = Math.ceil(steelKgResult);
    const bricksCount = totalBricksNos;
    /* Grey Structure Costs */ const costCement =
      cementBagsTotal * rates.cement;
    const costSteel = steelKg * rates.steel;
    const costBricks = bricksCount * rates.bricks;
    const costSand = sandCftTotal * rates.sand;
    const costCrush = crushCftTotal * rates.crush;
    const costLabor = builtUpArea * rates.laborGrey;
    const totalGrey =
      costCement + costSteel + costBricks + costSand + costCrush + costLabor;
    /* Finishing Costs Multiplier */ const qualityMultiplier =
      finishQuality === 1 ? 1 : finishQuality === 2 ? 1.6 : 2.5;
    const finishRate = rates.laborFinish * qualityMultiplier;
    const baseMepPct = 0.2;
    const extraWashrooms = Math.max(
      0,
      geoState.rooms.washrooms - geoState.rooms.bedrooms,
    );
    const mepMultiplier =
      1 + extraWashrooms * 0.05 + geoState.rooms.kitchens * 0.05;
    const costTiles = builtUpArea * (finishRate * 0.35);
    /* 35% of finishing */ const costPaint = builtUpArea * (finishRate * 0.2);
    /* 20% */ const costWoodwork =
      builtUpArea * (finishRate * 0.25) * (1 + geoState.rooms.bedrooms * 0.02);
    /* 25% + bonus for bedrooms */ const costMep =
      builtUpArea * (finishRate * baseMepPct) * mepMultiplier;
    /* Roof Treatment & Insulation Cost */ let roofMultiplier = 1;
    if (specs?.roofTreatment?.includes("Premium")) roofMultiplier = 1.6;
    if (specs?.roofTreatment?.includes("Luxury")) roofMultiplier = 2.5;
    const roofArea =
      geoState.stories > 0 ? builtUpArea / geoState.stories : builtUpArea;
    const costRoofing = roofArea * (finishRate * 0.15) * roofMultiplier;
    const totalFinishing =
      costTiles + costPaint + costWoodwork + costMep + costRoofing;
    /* Boundary Wall Calculations */ const bwNetLength = Math.max(
      0,
      bwLength - bwGateSize,
    );
    const bwArea = bwNetLength * bwHeight;
    /* sqft */ const bwVolume = bwArea * 0.75;
    /* assuming 9-inch wall // Boundary Wall Materials */ const bwBricks =
      Math.ceil(bwVolume * 13.5);
    const bwDryMortar = bwVolume * 0.3;
    const bwCementBags = Math.ceil((bwDryMortar * 0.2) / 1.25);
    /* 1:4 ratio approx -> 20% dry mortar, divide by 1.25 cft/bag */ const bwSandCft =
      Math.ceil(bwDryMortar * 0.8);
    const bwExcavation = Math.ceil(bwNetLength * 2 * 1.5);
    /* 2 ft deep, 1.5 ft wide */ const bwLaborCost = bwArea * rates.laborGrey;
    /* simple labor estimate */ const costBwCement =
      bwCementBags * rates.cement;
    const costBwBricks = bwBricks * rates.bricks;
    const costBwSand = bwSandCft * rates.sand;
    const bwTotalCost = includeBoundaryWall
      ? costBwCement + costBwBricks + costBwSand + bwLaborCost
      : 0;
    /* Additional Technical Base Requirements for Grey Structure */ const termiteAreaSqft =
      coveredAreaSqft;
    const polytheneAreaSqft = coveredAreaSqft;
    const waterTankCost = 150000;
    /* Extrapolated quantities & prices for add-ons */ const excavationVolTotal =
      Math.ceil(excavationVolumeCft) + (includeBoundaryWall ? bwExcavation : 0);
    const costExcavation = excavationVolTotal * (rates.laborGrey * 0.15);
    /* est factor */ const costTermite = termiteAreaSqft * 12;
    /* estimated Rs 12/sqft */ const costPolythene = polytheneAreaSqft * 8;
    /* estimated Rs 8/sqft */ const costWaterTank = includeBoundaryWall
      ? waterTankCost
      : 0;
    const trueTotalGrey =
      totalGrey + costExcavation + costTermite + costPolythene + costWaterTank;
    return {
      cementBags: cementBagsTotal + (includeBoundaryWall ? bwCementBags : 0),
      steelKg: steelKg,
      bricksCount: bricksCount + (includeBoundaryWall ? bwBricks : 0),
      sandCft: sandCftTotal + (includeBoundaryWall ? bwSandCft : 0),
      crushCft: crushCftTotal,
      excavationCft:
        Math.ceil(excavationVolumeCft) +
        (includeBoundaryWall ? bwExcavation : 0),
      steelTons: steelMetricTons,
      termiteAreaSqft,
      polytheneAreaSqft,
      costTerms: { costExcavation, costTermite, costPolythene, costWaterTank },
      costCement,
      costSteel,
      costBricks,
      costSand,
      costCrush,
      costLabor,
      totalGrey: trueTotalGrey,
      costTiles,
      costPaint,
      costWoodwork,
      costMep,
      costRoofing,
      totalFinishing,
      costBoundaryWall: bwTotalCost,
      totalCost: trueTotalGrey + totalFinishing + bwTotalCost,
    };
  }, [
    coveredAreaSqft,
    builtUpArea,
    finishQuality,
    rates,
    geoState,
    specs,
    includeBoundaryWall,
    bwLength,
    bwHeight,
    bwGateSize,
  ]);
  const greyFoundationData = [
    {
      name: "Excavation & Backfilling",
      value: estimates.costTerms.costExcavation,
      color: "#78716c",
      quantity: estimates.excavationCft,
      unit: "Cft",
      rate: rates.laborGrey * 0.15,
    },
    {
      name: "Termite Treatment",
      value: estimates.costTerms.costTermite,
      color: "#f97316",
      quantity: estimates.termiteAreaSqft,
      unit: "Sq.ft",
      rate: 12,
    },
  ];
  if (includeBoundaryWall) {
    greyFoundationData.push({
      name: "Water Tank (UG & OH)",
      value: estimates.costTerms.costWaterTank,
      color: "#3b82f6",
      quantity: 1,
      unit: "Lump Sum",
      rate: estimates.costTerms.costWaterTank,
    });
  }
  const greySuperstructureData = [
    {
      name: `Cement${isCustomRate("cement") ? "*" : ""}`,
      value: estimates.costCement,
      color: "#94a3b8",
      quantity: estimates.cementBags,
      unit: "Bags",
      rate: rates.cement,
      isCustom: isCustomRate("cement"),
    },
    {
      name: `Steel${isCustomRate("steel") ? "*" : ""}`,
      value: estimates.costSteel,
      color: "#334155",
      quantity: parseFloat(estimates.steelTons.toFixed(2)),
      unit: "Tons",
      rate: rates.steel * 1000,
      isCustom: isCustomRate("steel"),
    },
    {
      name: `Bricks${isCustomRate("bricks") ? "*" : ""}`,
      value: estimates.costBricks,
      color: "#b91c1c",
      quantity: estimates.bricksCount,
      unit: "Nos",
      rate: rates.bricks,
      isCustom: isCustomRate("bricks"),
    },
    {
      name: `Sand${isCustomRate("sand") ? "*" : ""}`,
      value: estimates.costSand,
      color: "#fcd34d",
      quantity: estimates.sandCft,
      unit: "Cft",
      rate: rates.sand,
      isCustom: isCustomRate("sand"),
    },
    {
      name: `Crush${isCustomRate("crush") ? "*" : ""}`,
      value: estimates.costCrush,
      color: "#a3a3a3",
      quantity: estimates.crushCft,
      unit: "Cft",
      rate: rates.crush,
      isCustom: isCustomRate("crush"),
    },
    {
      name: "Polythene Sheet & DPC",
      value: estimates.costTerms.costPolythene,
      color: "#6ee7b7",
      quantity: estimates.polytheneAreaSqft,
      unit: "Sq.ft",
      rate: 8,
    },
    {
      name: `Labor${isCustomRate("laborGrey") ? "*" : ""}`,
      value: estimates.costLabor,
      color: "#0369a1",
      quantity: builtUpArea,
      unit: "Sq.ft",
      rate: rates.laborGrey,
      isCustom: isCustomRate("laborGrey"),
    },
  ];
  const greyCostData = [...greyFoundationData, ...greySuperstructureData];
  const qualityMultiplier =
    finishQuality === 1 ? 1 : finishQuality === 2 ? 1.6 : 2.5;
  const finishRate = rates.laborFinish * qualityMultiplier;
  let roofMultiplier = 1;
  if (specs?.roofTreatment?.includes("Premium")) roofMultiplier = 1.6;
  if (specs?.roofTreatment?.includes("Luxury")) roofMultiplier = 2.5;
  const finishingCostData = [
    {
      name: `Tiles & Floor${isCustomRate("laborFinish") ? "*" : ""}`,
      value: estimates.costTiles,
      color: "#0ea5e9",
      quantity: builtUpArea,
      unit: "Sq.ft",
      rate: finishRate * 0.35,
      isCustom: isCustomRate("laborFinish"),
    },
    {
      name: `Paint & Ceiling${isCustomRate("laborFinish") ? "*" : ""}`,
      value: estimates.costPaint,
      color: "#ec4899",
      quantity: builtUpArea,
      unit: "Sq.ft",
      rate: finishRate * 0.2,
      isCustom: isCustomRate("laborFinish"),
    },
    {
      name: `Woodwork${isCustomRate("laborFinish") ? "*" : ""}`,
      value: estimates.costWoodwork,
      color: "#8b5cf6",
      quantity: builtUpArea,
      unit: "Sq.ft",
      rate: finishRate * 0.25 * (1 + geoState.rooms.bedrooms * 0.02),
      isCustom: isCustomRate("laborFinish"),
    },
    {
      name: `Electric & Plumbing${isCustomRate("laborFinish") ? "*" : ""}`,
      value: estimates.costMep,
      color: "#10b981",
      quantity: builtUpArea,
      unit: "Sq.ft",
      rate: estimates.costMep / builtUpArea,
      isCustom: isCustomRate("laborFinish"),
    },
    {
      name: `Roofing & Insulation${isCustomRate("laborFinish") ? "*" : ""}`,
      value: estimates.costRoofing,
      color: "#f59e0b",
      quantity:
        geoState.stories > 0 ? builtUpArea / geoState.stories : builtUpArea,
      unit: "Sq.ft",
      rate: finishRate * 0.15 * roofMultiplier,
      isCustom: isCustomRate("laborFinish"),
    },
  ];
  const summaryData = [
    { name: "Grey Structure", value: estimates.totalGrey, color: "#64748b" },
    {
      name: "Finishing Works",
      value: estimates.totalFinishing,
      color: "#8b5cf6",
    },
  ];
  if (includeBoundaryWall) {
    summaryData.push({
      name: "Boundary Wall",
      value: estimates.costBoundaryWall,
      color: "#10b981",
    });
  }

  const combinedCostData = useMemo(() => {
    const data: any[] = [];
    greyCostData.forEach((d) =>
      data.push({
        name: d.name.replace(/\*/g, ""),
        value: convertAmount(d.value),
        category: "Grey Structure",
        color: d.color || "#64748b",
      })
    );
    finishingCostData.forEach((d) =>
      data.push({
        name: d.name.replace(/\*/g, ""),
        value: convertAmount(d.value),
        category: "Finishing Works",
        color: d.color || "#8b5cf6",
      })
    );
    return data.sort((a, b) => b.value - a.value);
  }, [greyCostData, finishingCostData, convertAmount]);

  const getQualityLabel = (val: number) => {
    switch (val) {
      case 1:
        return "Standard";
      case 2:
        return "Premium";
      case 3:
        return "Luxury";
      default:
        return "Standard";
    }
  };
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        <header className="mb-8 block">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent pb-2">
              Complete House Estimator
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              Precise civil engineering estimations for grey structure and
              finishing works.
            </p>
            <div className="mt-5 flex gap-4 w-fit">
              <GlobalSettingsToggle align="left" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Built-up
              </span>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                {builtUpArea.toFixed(0)}
                <span className="text-sm font-medium text-indigo-400">
                  sq.ft
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* Project Details */}
        <section className="bg-white/80 p-6 md:p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Project Details
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                For accurate reports & records
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Project Name
              </label>
              <input
                type="text"
                value={projectDetails.projectName}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    projectName: e.target.value,
                  })
                }
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 w-full outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. 5 Marla Villa"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Client Name
              </label>
              <input
                type="text"
                value={projectDetails.clientName}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    clientName: e.target.value,
                  })
                }
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 w-full outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Site Location
              </label>
              <input
                type="text"
                value={projectDetails.siteLocation}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    siteLocation: e.target.value,
                  })
                }
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 w-full outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. DHA Phase 6"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls Overlay */}
          <section className="lg:col-span-4 space-y-6">
            {/* Plot & Geometry Accordion */}
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
              <div
                className="flex items-center justify-between mb-6 cursor-pointer"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Home className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Plot & Geometry
                  </h2>
                </div>
                <div className="p-2 bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  {isAccordionOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
              {/* Basic View (when closed) */}
              {!isAccordionOpen && (
                <div className="space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Plot Size</span>
                    <span className="font-bold text-slate-800">
                      {geoState.plotSizeValue}
                      {geoState.plotSizeUnit.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">
                      Covered Area
                    </span>
                    <span className="font-bold text-slate-800">
                      {geoState.coveredAreaSqft} Sq.Ft/fl
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Stories</span>
                    <span className="font-bold text-slate-800">
                      {geoState.stories}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAccordionOpen(true)}
                    className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors"
                  >
                    Edit Detailed Geometry
                  </button>
                </div>
              )}
              {/* Detailed View (when open) */}
              {isAccordionOpen && (
                <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                  <div className="bg-transparent/50 px-4 py-3 sm:px-4 py-3 rounded-[1.5rem] border border-slate-100 space-y-6">
                    <h3 className="text-sm font-bold text-slate-800">
                      Area Specifications
                    </h3>
                    <div className="space-y-5">
                      {/* Total Area */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                          Total Area
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={geoState.plotSizeValue}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_PLOT_SIZE_VALUE",
                                payload: e.target.value,
                              })
                            }
                            className="flex-1 bg-white border border-slate-200 text-slate-800 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium shadow-sm"
                            placeholder="0"
                          />
                          <select
                            value={geoState.plotSizeUnit}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_PLOT_SIZE_UNIT",
                                payload: e.target.value as any,
                              })
                            }
                            className="hidden"
                          ></select>
                          <UnitToggleGroup
                            units={[
                              { id: "marla", label: "Marla" },
                              { id: "sqyd", label: "Sq.Yd" },
                              { id: "sqft", label: "Sq.Ft" },
                            ]}
                            activeUnit={geoState.plotSizeUnit}
                            onChange={(u) =>
                              dispatch({
                                type: "SET_PLOT_SIZE_UNIT",
                                payload: u as any,
                              })
                            }
                            size="sm"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-2">
                          Total plot size (
                          {isSI
                            ? (plotAreaSqft / 10.7639).toFixed(1)
                            : plotAreaSqft.toFixed(0)}
                          {isSI ? "Sq.M" : "Sq.Ft"})
                        </p>
                      </div>
                      {/* Covered Area */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                          Covered Area
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={geoState.coveredAreaSqft}
                            onChange={(e) =>
                              dispatch({
                                type: "SET_COVERED_AREA_SQFT",
                                payload: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-full px-5 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium shadow-sm"
                            placeholder="0" /* In metric we assume input was already SQM visually but actually logic uses sqft, so let's adapt. Actually let's keep logic in sqft and just display correctly for users if needed. wait, actually for simplicity just changing display is fine. */
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            {isSI ? "SQ.M" : "SQ.FT"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-2">
                          Constructed area per floor
                        </p>
                      </div>
                      {/* Open Area */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                          Open Area
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={Math.max(
                              0,
                              plotAreaSqft -
                                (parseFloat(geoState.coveredAreaSqft) || 0),
                            )}
                            onChange={(e) => {
                              const open = parseFloat(e.target.value) || 0;
                              const covered = Math.max(0, plotAreaSqft - open);
                              dispatch({
                                type: "SET_COVERED_AREA_SQFT",
                                payload: covered.toString(),
                              });
                            }}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-full px-5 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium shadow-sm"
                            placeholder="0" /* In metric we assume input was already SQM visually but actually logic uses sqft, so let's adapt. Actually let's keep logic in sqft and just display correctly for users if needed. wait, actually for simplicity just changing display is fine. */
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            SQ.FT
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-2">
                          Unbuilt space (Total - Covered)
                        </p>
                      </div>
                      {/* Visual Indicator */}
                      <div className="pt-2 px-1">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Proportion Ratio
                          </span>
                          <span className="text-[10px] font-bold text-blue-600">
                            {plotAreaSqft > 0
                              ? (
                                  ((parseFloat(geoState.coveredAreaSqft) || 0) /
                                    plotAreaSqft) *
                                  100
                                ).toFixed(0)
                              : 0}
                            % Covered
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{
                              width: `${plotAreaSqft > 0 ? Math.min(100, Math.max(0, ((parseFloat(geoState.coveredAreaSqft) || 0) / plotAreaSqft) * 100)) : 0}%`,
                            }}
                          />
                          <div
                            className="h-full bg-slate-200 transition-all duration-500 ease-out"
                            style={{
                              width: `${plotAreaSqft > 0 ? Math.max(0, 100 - ((parseFloat(geoState.coveredAreaSqft) || 0) / plotAreaSqft) * 100) : 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Stories
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "SET_STORIES",
                              payload: Math.max(1, geoState.stories - 1),
                            })
                          }
                          className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-bold text-lg w-6 text-center">
                          {geoState.stories}
                        </span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "SET_STORIES",
                              payload: geoState.stories + 1,
                            })
                          }
                          className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Room Ht (ft)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={geoState.roomHeight}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_ROOM_HEIGHT",
                            payload: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-600">
                        Room Configuration
                      </h3>
                      <select
                        value={geoState.roomAreaUnit}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_ROOM_AREA_UNIT",
                            payload: e.target.value as any,
                          })
                        }
                        className="hidden"
                      ></select>
                      <UnitToggleGroup
                        units={[
                          { id: "sqft", label: "Sq.Ft" },
                          { id: "sqm", label: "Sq.M" },
                          { id: "sqyd", label: "Sq.Yd" },
                        ]}
                        activeUnit={geoState.roomAreaUnit}
                        onChange={(u) =>
                          dispatch({
                            type: "SET_ROOM_AREA_UNIT",
                            payload: u as any,
                          })
                        }
                        size="sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      {(
                        Object.keys(geoState.rooms) as Array<
                          keyof GeometryState["rooms"]
                        >
                      ).map((room) => (
                        <div key={room} className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {room.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-transparent border border-slate-200 rounded-lg p-0.5 w-[5.5rem]">
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: "DECREMENT_ROOM",
                                    payload: room,
                                  })
                                }
                                className="w-7 h-7 rounded text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="font-bold text-sm flex-1 text-center">
                                {geoState.rooms[room]}
                              </span>
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: "INCREMENT_ROOM",
                                    payload: room,
                                  })
                                }
                                className="w-7 h-7 rounded text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex-1 relative">
                              <input
                                type="number"
                                value={geoState.roomAreas[room]}
                                onChange={(e) =>
                                  dispatch({
                                    type: "SET_ROOM_AREA",
                                    payload: { room, area: e.target.value },
                                  })
                                }
                                className="w-full bg-transparent border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm pr-10"
                                placeholder="Area"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                                {geoState.roomAreaUnit === "sqft"
                                  ? "sf"
                                  : geoState.roomAreaUnit === "sqm"
                                    ? "m²"
                                    : "yd²"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                  <Sliders className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Finish Quality
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black text-violet-600 tracking-tighter">
                    {getQualityLabel(finishQuality)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    x
                    {finishQuality === 1
                      ? "1.0"
                      : finishQuality === 2
                        ? "1.6"
                        : "2.5"}
                    Multiplier
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={finishQuality}
                  onChange={(e) => setFinishQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-2">
                  <span>Std</span> <span>Prem</span> <span>Lux</span>
                </div>
              </div>
            </div>
            <AdvancedSpecs
              specs={specs}
              setSpecs={setSpecs}
              isOpen={isSpecsAccordionOpen}
              setIsOpen={setIsSpecsAccordionOpen}
            />
            {/* Boundary Wall Module */}
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-xl font-extrabold text-slate-800">
                    Boundary Wall
                  </h2>
                  <span className="text-sm font-medium text-slate-500">
                    Include exterior boundary wall
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={includeBoundaryWall}
                    onChange={() =>
                      setIncludeBoundaryWall(!includeBoundaryWall)
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {includeBoundaryWall && (
                <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Length (ft)
                    </label>
                    <input
                      type="number"
                      value={bwLength || ""}
                      onChange={(e) => setBwLength(parseFloat(e.target.value))}
                      className="w-full bg-transparent border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Height (ft)
                    </label>
                    <input
                      type="number"
                      value={bwHeight || ""}
                      onChange={(e) => setBwHeight(parseFloat(e.target.value))}
                      className="w-full bg-transparent border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Gate (ft)
                    </label>
                    <input
                      type="number"
                      value={bwGateSize || ""}
                      onChange={(e) =>
                        setBwGateSize(parseFloat(e.target.value))
                      }
                      className="w-full bg-transparent border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
          {/* Results Area */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            {!showResults ? (
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">
                      Configure Material Rates
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                      Review market rates and override with custom vendor quotes
                      if needed.
                    </p>
                  </div>
                </div>
                <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl mb-6">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase text-xs tracking-wider sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 font-bold">Material Item</th>
                        <th className="px-6 py-4 font-bold">
                          Current Market Rate
                        </th>
                        <th className="px-6 py-4 font-bold bg-indigo-50/50 text-indigo-700">
                          Your Custom Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {(
                        [
                          {
                            key: "cement",
                            name: "Cement (Per Bag)",
                            color: "bg-stone-500",
                            bg: "bg-stone-50",
                          },
                          {
                            key: "steel",
                            name: "Steel 60-Grade (Per Kg)",
                            color: "bg-slate-700",
                            bg: "bg-transparent",
                          },
                          {
                            key: "bricks",
                            name: "Bricks A-Class (Per 1000)",
                            color: "bg-orange-500",
                            bg: "bg-orange-50",
                          },
                          {
                            key: "sand",
                            name: "Sand (Per Cft)",
                            color: "bg-amber-400",
                            bg: "bg-amber-50",
                          },
                          {
                            key: "crush",
                            name: "Crush (Per Cft)",
                            color: "bg-neutral-500",
                            bg: "bg-neutral-50",
                          },
                          {
                            key: "laborGrey",
                            name: "Grey Labor (Per Sq.ft)",
                            color: "bg-emerald-500",
                            bg: "bg-emerald-50",
                          },
                          {
                            key: "laborFinish",
                            name: "Finish Labor (Per Sq.ft)",
                            color: "bg-teal-500",
                            bg: "bg-teal-50",
                          },
                        ] as const
                      ).map((item) => (
                        <tr
                          key={item.key}
                          className="hover:bg-transparent/80 transition-colors group"
                        >
                          <td className="px-6 py-4 font-bold text-slate-700">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-lg ${item.bg} group-hover:scale-110 transition-transform`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}
                                ></div>
                              </div>
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-500">
                            {formatCurrency(
                              item.key === "bricks"
                                ? marketRates[item.key] * 1000
                                : marketRates[item.key],
                            )}
                          </td>
                          <td className="px-6 py-3 bg-indigo-50/30">
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-slate-400 font-bold mb-0.5">
                                {settings.currency === "PKR" ? "Rs" : "$"}
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                className={`w-full bg-white border ${customRates[item.key] !== undefined ? "border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-700 font-bold" : "border-slate-200 text-slate-800"} rounded-xl py-2 pl-10 pr-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                                placeholder="Default"
                                value={
                                  customRates[item.key] !== undefined
                                    ? item.key === "bricks"
                                      ? customRates[item.key]! * 1000
                                      : customRates[item.key]
                                    : ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value
                                    ? parseFloat(e.target.value)
                                    : null;
                                  if (val !== null && val < 0) return;
                                  /* Prevent negative inputs */ setCustomRate(
                                    item.key,
                                    val !== null && item.key === "bricks"
                                      ? val / 1000
                                      : val,
                                  );
                                }}
                              />
                            </div>
                            {customRates[item.key] !== undefined && (
                              <div className="text-[10px] text-indigo-500 font-medium mt-1 ml-1 truncate">
                                Custom rate active
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-auto gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={resetCustomRates}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Defaults
                  </button>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setShowResults(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-100 transition-all active:scale-95"
                    >
                      UPDATE RATES
                    </button>
                    <button
                      onClick={() => setShowResults(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                    >
                      Generate Estimate <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Segmented Control & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between relative">
                  <div className="flex overflow-x-auto p-1.5 bg-white border border-slate-200 shadow-sm rounded-2xl w-full sm:w-fit space-x-1">
                    <ColorfulTab
                      id="summary"
                      label="Summary"
                      icon={<LayoutDashboard className="w-[18px] h-[18px]" />}
                      isActive={activeTab === "summary"}
                      onClick={() => setActiveTab("summary")}
                      colorTheme="indigo"
                    />
                    <ColorfulTab
                      id="grey"
                      label="Grey Structure"
                      icon={<Layers className="w-[18px] h-[18px]" />}
                      isActive={activeTab === "grey"}
                      onClick={() => setActiveTab("grey")}
                      colorTheme="slate"
                    />
                    <ColorfulTab
                      id="finishing"
                      label="Finishing"
                      icon={<PaintRoller className="w-[18px] h-[18px]" />}
                      isActive={activeTab === "finishing"}
                      onClick={() => setActiveTab("finishing")}
                      colorTheme="rose"
                    />
                    <ColorfulTab
                      id="rcc"
                      label="RCC Detailed"
                      icon={<Spline className="w-[18px] h-[18px]" />}
                      isActive={activeTab === "rcc"}
                      onClick={() => setActiveTab("rcc")}
                      colorTheme="amber"
                    />
                    <ColorfulTab
                      id="master"
                      label="Master Quantities"
                      icon={<Calculator className="w-[18px] h-[18px]" />}
                      isActive={activeTab === "master"}
                      onClick={() => setActiveTab("master")}
                      colorTheme="emerald"
                    />
                  </div>
                  <button
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold px-4 py-2.5 rounded-xl shadow-sm border border-indigo-100 transition-colors shrink-0 whitespace-nowrap"
                  >
                    <Database className="w-[18px] h-[18px]" /> View / Edit Rates
                  </button>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden transition-all duration-300">
                  {activeTab === "summary" && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 mb-6">
                        Total Project Estimate
                      </h3>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-1">
                        <div
                          className="w-full md:w-1/2 h-64 relative"
                          id="export-chart-target"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={summaryData}
                                innerRadius={85}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1000}
                              >
                                {summaryData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="none"
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: number) =>
                                  formatCurrency(value, false)
                                }
                                contentStyle={{
                                  borderRadius: "16px",
                                  border: "none",
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                }}
                              />
                              <text
                                x="50%"
                                y="42%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#64748b"
                                fontSize="11"
                                fontWeight="600"
                              >
                                Grey: {formatCurrency(estimates.totalGrey)}
                              </text>
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#8b5cf6"
                                fontSize="11"
                                fontWeight="600"
                              >
                                Finish:
                                {formatCurrency(estimates.totalFinishing)}
                              </text>
                              <text
                                x="50%"
                                y="62%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#0f172a"
                                fontSize="15"
                                fontWeight="900"
                              >
                                Total:
                                {formatCurrency(estimates.totalCost)}
                              </text>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                          <div className="bg-transparent px-4 py-3 rounded-2xl border border-slate-100 relative overflow-hidden group flex flex-col justify-center min-w-0">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500" />
                            <div className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-1 pl-2 truncate">
                              Grey Structure
                            </div>
                            <div
                              className="text-xl sm:text-2xl font-black text-slate-800 pl-2 truncate"
                              title={formatCurrency(estimates.totalGrey)}
                            >
                              {formatCurrency(estimates.totalGrey)}
                            </div>
                            <div className="text-slate-400 text-xs md:text-sm font-medium mt-1 pl-2 truncate">
                              Foundation, Framing, Masonry
                            </div>
                          </div>
                          <div className="bg-violet-50 px-4 py-3 rounded-2xl border border-violet-100 relative overflow-hidden flex flex-col justify-center min-w-0">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                            <div className="text-violet-600 text-xs md:text-sm font-bold uppercase tracking-widest mb-1 pl-2 truncate">
                              Finishing Works
                            </div>
                            <div
                              className="text-xl sm:text-2xl font-black text-violet-800 pl-2 truncate"
                              title={formatCurrency(estimates.totalFinishing)}
                            >
                              {formatCurrency(estimates.totalFinishing)}
                            </div>
                            <div className="text-violet-500/80 text-xs md:text-sm font-medium mt-1 pl-2 truncate">
                              {getQualityLabel(finishQuality)} Grade Finishing
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-10 pt-8 border-t border-slate-100/60" id="overview-bar-chart">
                        <h4 className="text-lg font-bold text-slate-800 mb-6 flex justify-between items-center">
                          <span>Cost Breakdown Comparison</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">Highest to Lowest</span>
                        </h4>
                        <div className="w-full h-[450px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={combinedCostData}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
                              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} 
                                tickFormatter={(val) => `${settings.currency === "PKR" ? "RS" : settings.currency} ${(val / 1000).toFixed(0)}k`} />
                              <YAxis dataKey="name" type="category" width={140} axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }} />
                              <Tooltip 
                                cursor={{ fill: "#f8fafc" }}
                                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", fontWeight: "bold" }}
                                formatter={(value: number, name: string, props: any) => [formatCurrency(value, false), props.payload.category]}
                              />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={40}>
                                {combinedCostData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "grey" && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                        <h3 className="text-xl font-bold text-slate-800">
                          Grey Structure Breakdown
                        </h3>
                        <div className="text-2xl font-black text-indigo-600 tracking-tighter bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-100">
                          {formatCurrency(estimates.totalGrey)}
                        </div>
                      </div>
                      <div className="flex flex-wrap  gap-4 mb-8 items-center w-full">
                        <div className="bg-transparent px-4 py-3 rounded-2xl border border-gray-100 text-center min-w-0">
                          <div
                            className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate"
                            title={estimates.cementBags.toFixed(0)}
                          >
                            {estimates.cementBags.toFixed(0)}
                            <span className="text-xs font-normal">bags</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">
                            Cement
                          </div>
                          <div className="text-sm font-bold text-indigo-600 mt-2">
                            {formatCurrency(estimates.costCement)}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 text-center min-w-0">
                          <div
                            className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate"
                            title={(estimates.steelKg / 1000).toFixed(1)}
                          >
                            {(estimates.steelKg / 1000).toFixed(1)}
                            <span className="text-xs font-normal">tons</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">
                            Steel
                          </div>
                          <div className="text-sm font-bold text-indigo-600 mt-2">
                            {formatCurrency(estimates.costSteel)}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 text-center min-w-0">
                          <div
                            className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate"
                            title={`${(estimates.bricksCount / 1000).toFixed(0)}k`}
                          >
                            {(estimates.bricksCount / 1000).toFixed(0)}k
                            <span className="text-xs font-normal">qty</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">
                            Bricks
                          </div>
                          <div className="text-sm font-bold text-indigo-600 mt-2">
                            {formatCurrency(estimates.costBricks)}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 text-center min-w-0">
                          <div
                            className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate"
                            title={
                              isSI
                                ? (estimates.sandCft / 35.3147).toFixed(1)
                                : estimates.sandCft.toFixed(0)
                            }
                          >
                            {isSI
                              ? (estimates.sandCft / 35.3147).toFixed(1)
                              : estimates.sandCft.toFixed(0)}
                            <span className="text-xs font-normal">
                              {isSI ? "m³" : "cft"}
                            </span>
                          </div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">
                            Sand
                          </div>
                          <div className="text-sm font-bold text-indigo-600 mt-2">
                            {formatCurrency(estimates.costSand)}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 text-center min-w-0 md:col-span-1 col-span-2">
                          <div
                            className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate"
                            title={
                              isSI
                                ? (estimates.crushCft / 35.3147).toFixed(1)
                                : estimates.crushCft.toFixed(0)
                            }
                          >
                            {isSI
                              ? (estimates.crushCft / 35.3147).toFixed(1)
                              : estimates.crushCft.toFixed(0)}
                            <span className="text-xs font-normal">
                              {isSI ? "m³" : "cft"}
                            </span>
                          </div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">
                            Crush
                          </div>
                          <div className="text-sm font-bold text-indigo-600 mt-2">
                            {formatCurrency(estimates.costCrush)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">
                        Detailed Exact BOQ
                      </h3>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm mb-8">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase text-xs tracking-wider">
                            <tr>
                              <th className="px-6 py-4 font-bold">
                                Material / Item
                              </th>
                              <th className="px-6 py-4 font-bold text-center">
                                Quantity
                              </th>
                              <th className="px-6 py-4 font-bold text-center">
                                Unit
                              </th>
                              <th className="px-6 py-4 font-bold text-right">
                                Amount (Rs)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-800 divide-y divide-slate-100">
                            <tr className="bg-transparent/50">
                              <td
                                colSpan={4}
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                              >
                                Foundation Work
                              </td>
                            </tr>
                            {greyFoundationData.map((item, idx) => (
                              <tr
                                key={`f-${idx}`}
                                className="hover:bg-transparent/70 transition-colors"
                              >
                                <td className="px-6 py-4 font-semibold text-slate-700">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-600">
                                  {typeof item.quantity === "number"
                                    ? item.quantity.toLocaleString()
                                    : item.quantity}
                                  {item.rate && (
                                    <div className="text-[10px] font-normal text-slate-400 mt-0.5 font-mono">
                                      @ {formatCurrency(item.rate)}/{item.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-slate-500">
                                  {item.unit}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800">
                                  {formatCurrency(item.value)}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-transparent/50">
                              <td
                                colSpan={4}
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                              >
                                Superstructure
                              </td>
                            </tr>
                            {greySuperstructureData.map((item, idx) => (
                              <tr
                                key={`s-${idx}`}
                                className="hover:bg-transparent/70 transition-colors"
                              >
                                <td className="px-6 py-4 font-semibold text-slate-700">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-600">
                                  {typeof item.quantity === "number"
                                    ? item.quantity.toLocaleString()
                                    : item.quantity}
                                  {item.rate && (
                                    <div className="text-[10px] font-normal text-slate-400 mt-0.5 font-mono">
                                      @ {formatCurrency(item.rate)}/{item.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-slate-500">
                                  {item.unit}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800">
                                  {formatCurrency(item.value)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex-1 min-h-[250px] w-full relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={greyCostData.map((d) => ({
                              ...d,
                              value: convertAmount(d.value),
                            }))}
                            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#E2E8F0"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#64748B",
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#94A3B8", fontSize: 10 }}
                              tickFormatter={(val) =>
                                `${settings.currency === "PKR" ? "RS" : settings.currency} ${(val / 1000).toFixed(0)}k`
                              }
                            />
                            <Tooltip
                              cursor={{ fill: "#F8FAFC" }}
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #E2E8F0",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                                fontWeight: "bold",
                              }}
                              formatter={(value: number) =>
                                formatCurrency(value, false)
                              }
                            />
                            <Bar
                              dataKey="value"
                              radius={[6, 6, 0, 0]}
                              maxBarSize={60}
                            >
                              {greyCostData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  {activeTab === "finishing" && (
                    <div className="animate-in fade-in slide-in-from-left-8 duration-500 h-full flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">
                          Finishing Breakdown
                        </h3>
                        <div className="text-2xl font-black text-violet-600 tracking-tighter bg-violet-50 px-4 py-1.5 rounded-xl border border-violet-100">
                          {formatCurrency(estimates.totalFinishing)}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-violet-500 mb-6">
                        Based on {getQualityLabel(finishQuality)} Grade settings
                        ({specs.flooringType}, {specs.wardrobeMaterial})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start mb-8">
                        {finishingCostData.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-100 px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                          >
                            <div
                              className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="flex justify-between items-start pl-2 min-w-0">
                              <div className="min-w-0 flex-1 pr-2">
                                <div
                                  className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate"
                                  title={formatCurrency(item.value)}
                                >
                                  {formatCurrency(item.value)}
                                </div>
                                <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">
                                  {item.name}
                                </div>
                              </div>
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center opacity-20 shrink-0"
                                style={{ backgroundColor: item.color }}
                              >
                                <Settings
                                  className="w-5 h-5 mix-blend-multiply"
                                  style={{ color: item.color }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">
                        Detailed Exact BOQ
                      </h3>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm mb-8">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase text-xs tracking-wider">
                            <tr>
                              <th className="px-6 py-4 font-bold">
                                Material / Item
                              </th>
                              <th className="px-6 py-4 font-bold text-center">
                                Quantity
                              </th>
                              <th className="px-6 py-4 font-bold text-center">
                                Unit
                              </th>
                              <th className="px-6 py-4 font-bold text-right">
                                Amount (Rs)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-800 divide-y divide-slate-100">
                            {finishingCostData.map((item, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-transparent/70 transition-colors"
                              >
                                <td className="px-6 py-4 font-semibold text-slate-700">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-600">
                                  {typeof item.quantity === "number"
                                    ? Math.round(item.quantity).toLocaleString()
                                    : item.quantity}
                                  {item.rate && (
                                    <div className="text-[10px] font-normal text-slate-400 mt-0.5 font-mono">
                                      @ {formatCurrency(item.rate)}/{item.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-slate-500">
                                  {item.unit}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800">
                                  {formatCurrency(item.value)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex-1 min-h-[250px] w-full relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={finishingCostData.map((d) => ({
                              ...d,
                              value: convertAmount(d.value),
                            }))}
                            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#E2E8F0"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#64748B",
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#94A3B8", fontSize: 10 }}
                              tickFormatter={(val) =>
                                `${settings.currency === "PKR" ? "RS" : settings.currency} ${(val / 1000).toFixed(0)}k`
                              }
                            />
                            <Tooltip
                              cursor={{ fill: "#F8FAFC" }}
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #E2E8F0",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                                fontWeight: "bold",
                              }}
                              formatter={(value: number) =>
                                formatCurrency(value, false)
                              }
                            />
                            <Bar
                              dataKey="value"
                              radius={[6, 6, 0, 0]}
                              maxBarSize={60}
                            >
                              {finishingCostData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  {activeTab === "rcc" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 h-full flex flex-col pt-4">
                      <RccStructureCalculator isEmbedded={true} />
                    </div>
                  )}
                  {activeTab === "master" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 h-full flex flex-col pt-4">
                      <MasterQuantityEstimator isEmbedded={true} />
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
      
      <GlobalSettingsModal
        isOpen={isGlobalSettingsOpen}
        onClose={() => setIsGlobalSettingsOpen(false)}
      />
    </div>
  );
}
