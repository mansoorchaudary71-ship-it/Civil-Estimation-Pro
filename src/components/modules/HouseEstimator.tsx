import React, { useState, useMemo, useReducer } from "react";
import { UniversalTabs } from "../ui/UniversalTabs";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";
import { DetailedRoomEstimators } from "./DetailedRoomEstimators";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Layers,
  PaintRoller,
  Sliders,
  LayoutDashboard,
  Settings,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Share2,
  Download,
  Database,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Spline,
  Calculator,
  Briefcase,
  X,
  CheckCircle2,
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
import { StyledChart } from "../ui/EstimateVisualizer";
import { useMarketRates } from "../../context/MarketRatesContext";
import { useSettings } from "../../context/SettingsContext";

import AdvancedSpecs, { SpecsState, initialSpecs } from "./AdvancedSpecs";
import GlobalSettingsModal from "./GlobalSettingsModal";
import MasterRccStructure from "./MasterRccStructure";
import MasterQuantityEstimator from "./MasterQuantityEstimator";
import { CalculationHistory } from "../ui/CalculationHistory";
import { SEO } from "../SEO";
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
  const { formatCurrency, settings, convertAmount, updateSettings } = useSettings();
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
    "grey" | "finishing" | "summary" | "rcc" | "master" | "rates"
  >("summary");
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [finishQuality, setFinishQuality] = useState<number>(1);
  /* 1: Standard, 2: Premium, 3: Luxury */ const [
    isGlobalSettingsOpen,
    setIsGlobalSettingsOpen,
  ] = useState(false);
  /* Master Unit System Toggle */ const masterUnit =
    settings.measurement === "SI" ? "metric" : "imperial";
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomConfigs, setRoomConfigs] = useState({
    bedroom: { length: 14, width: 12, height: 10, wardrobeLength: 6 },
    washroom: { length: 8, width: 6, wcType: "Wall Hung", showerSetup: "Glass Enclosure", vanity: "Standard" },
    kitchen: { length: 12, width: 10, counterLength: 15, cabinets: "UV/Acrylic", backsplash: "Ceramic" },
    livingRoom: { length: 16, width: 14, featureWall: "Yes", chandelierPoints: 1 },
    basement: { depth: 10, retainingWall: "RCC 9-Inch" }
  });
  const [activeRoomTab, setActiveRoomTab] = useState<"bedroom"|"washroom"|"kitchen"|"living"|"basement">("bedroom");
  
  /* International Market Settings */
  const [currencyRate, setCurrencyRate] = useState("PKR");
  const [designStandard, setDesignStandard] = useState("NBC Pakistan 2021");
  const [foundationType, setFoundationType] = useState("Strip Foundation");
  const [structuralSystem, setStructuralSystem] = useState("RCC Framed Structure");
  const [seismicZone, setSeismicZone] = useState("Zone 2B");
  
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
    let steelSeismicMultiplier = 1;
    let concreteSeismicMultiplier = 1;

    switch (seismicZone) {
      case "Zone 4":
        steelSeismicMultiplier = 1.2;
        concreteSeismicMultiplier = 1.1;
        break;
      case "Zone 3":
        steelSeismicMultiplier = 1.1;
        concreteSeismicMultiplier = 1.05;
        break;
      case "Zone 2B":
        steelSeismicMultiplier = 1.05;
        break;
      default:
        steelSeismicMultiplier = 1.0;
        concreteSeismicMultiplier = 1.0;
    }

    let steelMulti = steelSeismicMultiplier;
    let concreteMulti = concreteSeismicMultiplier;
    let brickMulti = 1.0;

    if (structuralSystem === "Load bearing masonry") {
      steelMulti *= 0.4;
      concreteMulti *= 0.8;
      brickMulti *= 1.5;
    } else if (structuralSystem === "Steel frame") {
      steelMulti *= 2.5;
      concreteMulti *= 0.3;
      brickMulti *= 0.5;
    }

    if (foundationType === "Raft Foundation") {
      concreteMulti *= 1.5;
      steelMulti *= 1.3;
    } else if (foundationType === "Pile Foundation") {
      concreteMulti *= 2.0;
      steelMulti *= 1.8;
    }

    const stories = geoState.stories;
    const roomHeight = parseFloat(geoState.roomHeight) || 10.5;
    /* Step 1: Generate Standard Assumptions */ const totalWallLength =
      coveredAreaSqft * 0.15;
    const wallThickness = 0.75;
    /* 9 inches */ const slabThickness = 0.5;
    /* 6 inches */ const foundationDepth = foundationType === "Pile Foundation" ? 15 : foundationType === "Raft Foundation" ? 4 : 3;
    const foundationWidth = 3;
    const openingDeduction = 0.85;
    /* Step 2: Apply Exact Formulas // 1. Excavation */ const excavationVolumeCft =
      totalWallLength * foundationWidth * foundationDepth;
    /* 2. Brickwork */ const totalHeight =
      roomHeight * stories + foundationDepth;
    const brickworkVolume =
      totalWallLength * totalHeight * wallThickness * openingDeduction * brickMulti;
    const totalBricksNos = Math.ceil(brickworkVolume * 13.5);
    const brickworkDryMortar = brickworkVolume * 0.3;
    const cementBw = (1 / 5) * brickworkDryMortar;
    const sandBw = (4 / 5) * brickworkDryMortar;
    /* 3. RCC */ const slabVolume = coveredAreaSqft * slabThickness * stories;
    const rcWetVolume = slabVolume * 1.25 * concreteMulti;
    /* Slab + 25% for beams/columns */ const rccDryVolume = rcWetVolume * CIVIL_CONSTANTS.DRY_CONCRETE_FACTOR;
    const cementRcc = (1 / 7) * rccDryVolume;
    const sandRcc = (2 / 7) * rccDryVolume;
    const crushRcc = (4 / 7) * rccDryVolume;
    /* 4. Steel */ const steelKgResult = slabVolume * 1.25 * 0.015 * 222.2 * steelMulti;
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
    if (specs?.roofInsulation?.includes("Premium")) roofMultiplier = 1.6;
    if (specs?.roofInsulation?.includes("Luxury")) roofMultiplier = 2.5;
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
    foundationType,
    structuralSystem,
    seismicZone,
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
  if (specs?.roofInsulation?.includes("Premium")) roofMultiplier = 1.6;
  if (specs?.roofInsulation?.includes("Luxury")) roofMultiplier = 2.5;
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

  const pdfExportPayload = useMemo(() => {
    const customTableData = [...greyCostData, ...finishingCostData].map(d => ({
      item: d.name.replace(/\*/g, ''),
      quantityStr: typeof d.quantity === 'number' ? Math.round(d.quantity).toLocaleString('en-US') : d.quantity,
      unitStr: d.unit,
      rate: d.rate,
      cost: d.value,
      color: d.color
    }));
    
    return {
      inputs: {
        "Project Name": projectDetails.projectName || "-",
        "Client Name": projectDetails.clientName || "-",
        "Plot Size": `${geoState.plotSizeValue} ${geoState.plotSizeUnit.toUpperCase()}`,
        "Covered Area": `${geoState.coveredAreaSqft} Sq.Ft`,
        "Stories": geoState.stories,
        "Finish Grade": getQualityLabel(finishQuality),
        "Total Built-up Area": `${builtUpArea.toFixed(0)} sq.ft`
      },
      breakdown: {
        "Total Cost": estimates.totalCost.toFixed(2),
        "Grey Structure": estimates.totalGrey.toFixed(2),
        "Finishing": estimates.totalFinishing.toFixed(2)
      },
      customTableData
    };
  }, [greyCostData, finishingCostData, geoState, finishQuality, projectDetails, builtUpArea, estimates]);

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <SEO 
        title="Complete House Estimator" 
        description="Estimate complete house construction costs including grey structure and finishing works." 
        canonicalUrl="https://civilestimationpro.com/house" 
      />
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        

        <div className="space-y-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls Overlay */}
          <section className="lg:col-span-4 space-y-6">
            {/* Quick Estimate Base Controls */}
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-50 text-indigo-600 rounded-[24px]">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Quick Estimate
                  </h2>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    Basic Configuration
                  </p>
                </div>
              </div>

              {/* City Location */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">
                  City / Location
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
                  className="bg-white border border-slate-200 rounded-[24px] px-4 py-3 text-sm font-semibold text-gray-800 w-full outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                  placeholder="e.g. DHA Phase 6"
                />
              </div>

              {/* Plot Size */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1 group flex items-center gap-1 w-fit cursor-help">
                  Plot Size 
                  <span className="relative">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1.5 bg-white text-slate-900 text-[10px] rounded-[16px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-200 shadow-sm">
                      Total land area limits the maximum covered area
                    </span>
                  </span>
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="number"
                    value={geoState.plotSizeValue}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PLOT_SIZE_VALUE",
                        payload: e.target.value,
                      })
                    }
                    className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium shadow-sm w-full"
                    placeholder="0"
                  />
                  <div className="w-full">
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
                      size="md"
                    />
                  </div>
                </div>
              </div>

              {/* Stories & Rooms Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
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
                      className="w-10 h-10 rounded-[24px] bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
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
                      className="w-10 h-10 rounded-[24px] bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Finish Quality */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 bg-violet-50 text-violet-600 rounded-[24px]">
                     <Sliders className="w-4 h-4" />
                   </div>
                   <h3 className="text-sm font-bold text-gray-700">Finish Quality</h3>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xl font-semibold tabular-nums tracking-tight text-violet-600 tracking-tighter whitespace-nowrap">
                    {getQualityLabel(finishQuality)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    x
                    {finishQuality === 1
                      ? "1.0"
                      : finishQuality === 2
                        ? "1.6"
                        : "2.5"}
                    Rate
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={finishQuality}
                  onChange={(e) => setFinishQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-[16px] appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">
                  <span>Std</span> <span>Prem</span> <span>Lux</span>
                </div>
              </div>
            </div>

            {/* International & Structural Setup */}
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-[24px]">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    International & Structural Defaults
                  </h2>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    Market, Foundation, System
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">Market Currency</label>
                  <select
                    value={currencyRate}
                    onChange={(e) => {
                      const market = e.target.value;
                      setCurrencyRate(market);
                      if (market === "CUSTOM") return;
                      updateSettings({ currency: market as any });
                      const marketPresets: Record<string, any> = {
                        PKR: { cement: 1450, steel: 280, bricks: 18, sand: 90, crush: 250, laborGrey: 500, laborFinish: 600 },
                        INR: { cement: 380, steel: 65, bricks: 8, sand: 45, crush: 80, laborGrey: 250, laborFinish: 350 },
                        USD: { cement: 15, steel: 1, bricks: 0.6, sand: 2, crush: 4, laborGrey: 45, laborFinish: 55 },
                        GBP: { cement: 8, steel: 1.5, bricks: 0.8, sand: 1.5, crush: 3, laborGrey: 35, laborFinish: 45 },
                        AED: { cement: 18, steel: 3, bricks: 2, sand: 5, crush: 10, laborGrey: 30, laborFinish: 40 },
                        SAR: { cement: 18, steel: 3, bricks: 2, sand: 4, crush: 9, laborGrey: 25, laborFinish: 35 },
                        BDT: { cement: 500, steel: 100, bricks: 12, sand: 30, crush: 80, laborGrey: 300, laborFinish: 400 },
                        LKR: { cement: 2000, steel: 400, bricks: 25, sand: 150, crush: 300, laborGrey: 800, laborFinish: 1000 }
                      };
                      const pst = marketPresets[market];
                      if(pst) {
                        setCustomRate("cement", pst.cement);
                        setCustomRate("steel", pst.steel);
                        setCustomRate("bricks", pst.bricks);
                        setCustomRate("sand", pst.sand);
                        setCustomRate("crush", pst.crush);
                        setCustomRate("laborGrey", pst.laborGrey);
                        setCustomRate("laborFinish", pst.laborFinish);
                      }
                    }}
                    className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-medium shadow-sm w-full"
                  >
                    {["PKR", "INR", "USD", "GBP", "AED", "SAR", "BDT", "LKR", "CUSTOM"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">Design Standard</label>
                  <select
                     value={designStandard}
                     onChange={(e) => setDesignStandard(e.target.value)}
                     className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-medium shadow-sm w-full"
                  >
                     <option>NBC Pakistan 2021</option>
                     <option>NBC India 2016</option>
                     <option>IS 456</option>
                     <option>BS 8110</option>
                     <option>ACI 318</option>
                     <option>Dubai Municipality Stds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">Foundation Type</label>
                  <select
                     value={foundationType}
                     onChange={(e) => setFoundationType(e.target.value)}
                     className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-medium shadow-sm w-full"
                  >
                     <option>Strip Foundation</option>
                     <option>Raft Foundation</option>
                     <option>Pile Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">Structural System</label>
                  <select
                     value={structuralSystem}
                     onChange={(e) => setStructuralSystem(e.target.value)}
                     className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-medium shadow-sm w-full"
                  >
                     <option>RCC Framed Structure</option>
                     <option>Load bearing masonry</option>
                     <option>Steel frame</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">Seismic Zone</label>
                  <select
                     value={seismicZone}
                     onChange={(e) => setSeismicZone(e.target.value)}
                     className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-medium shadow-sm w-full"
                  >
                     <option>Zone 1</option>
                     <option>Zone 2</option>
                     <option>Zone 2B</option>
                     <option>Zone 3</option>
                     <option>Zone 4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Customization Accordion */}
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-[24px]">
                    <Settings className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-bold text-gray-800">
                    Advanced Customization
                  </h2>
                </div>
                <div className="p-2 bg-transparent text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  {isAccordionOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
              
              {isAccordionOpen && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                  {/* Room Setup Button Trigger */}
                  <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-[24px] border border-indigo-100">
                    <div>
                      <h3 className="text-sm font-bold text-indigo-900">Room Configuration</h3>
                      <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">Customize layout specifics</p>
                    </div>
                    <button 
                      onClick={() => setIsRoomModalOpen(true)} 
                      className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-[24px] transition-all shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      Open Rooms <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Covered Area */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1 cursor-help group w-fit">
                      Covered Area (Per Floor)
                      <span className="relative">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[200px] whitespace-normal px-3 py-1.5 bg-white text-slate-900 text-[10px] rounded-[16px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center border border-slate-200 shadow-sm">
                          Total floor area constructed for a single story. Must be less than plot size.
                        </span>
                      </span>
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
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium shadow-sm"
                        placeholder="0" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                        {isSI ? "SQ.M" : "SQ.FT"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 ml-1">
                      Room Height (ft)
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
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm shadow-sm"
                    />
                  </div>
                  
                  <AdvancedSpecs
                    specs={specs}
                    setSpecs={setSpecs}
                    isOpen={isSpecsAccordionOpen}
                    setIsOpen={setIsSpecsAccordionOpen}
                  />

                  {/* Boundary Wall Module */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-slate-800">
                          Boundary Wall
                        </h2>
                        <span className="text-[10px] font-medium text-slate-500">
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
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {includeBoundaryWall && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                            Length (ft)
                          </label>
                          <input
                            type="number"
                            value={bwLength || ""}
                            onChange={(e) => setBwLength(parseFloat(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[16px] px-3 py-2 text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                            Height (ft)
                          </label>
                          <input
                            type="number"
                            value={bwHeight || ""}
                            onChange={(e) => setBwHeight(parseFloat(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[16px] px-3 py-2 text-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
            
            <button
               onClick={() => setShowResults(true)}
               className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-[24px] hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-slate-900/10"
            >
               Compute Total Cost
            </button>
          </section>
          
          {/* Results Area */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            <div className="sticky top-6 z-10 bg-indigo-600 rounded-[2rem] p-6 shadow-xl shadow-indigo-500/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-100 rounded-[24px]">
                  <Calculator className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-0.5">Total Estimated Cost</h3>
                  <p className="text-3xl sm:text-3xl md:text-[clamp(1.75rem,5vw,2.5rem)] break-all font-semibold tabular-nums tracking-tight tabular-nums text-slate-900 drop-shadow-sm">{formatCurrency(estimates.totalCost)}</p>
                  <p className="text-indigo-200 text-[10px] mt-1 font-medium">Rates based on current regional market — verify with local suppliers.</p>
                </div>
              </div>
              <div className="flex gap-6 mt-4 sm:mt-0 w-full sm:w-auto p-4 sm:p-0 bg-white/5 sm:bg-transparent rounded-[24px] sm:rounded-[24px]">
                <div>
                  <div className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">Basic Structure</div>
                  <div className="text-lg font-bold tabular-nums text-slate-900">{formatCurrency(estimates.totalGrey)}</div>
                </div>
                <div className="w-px h-8 bg-indigo-400/30 self-center hidden sm:block"></div>
                <div>
                  <div className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">Finishings</div>
                  <div className="text-lg font-bold tabular-nums text-slate-900">{formatCurrency(estimates.totalFinishing)}</div>
                </div>
              </div>
            </div>

            {/* Visual Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-2">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                Cost Breakdown Visuals
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div
                  className="w-full md:w-1/2 h-80 relative"
                  id="export-chart-target"
                >
                  <StyledChart 
                    data={summaryData.map(d => ({ ...d, fill: d.color }))}
                    type="pie"
                    title="Cost Breakdown"
                    valueFormatter={(val) => formatCurrency(val, false)}
                  />
                </div>
                <div className="w-full md:w-1/2 h-80 relative mt-4 md:mt-0 pt-8 border-t md:border-t-0 md:border-l border-slate-100/60 pl-0 md:pl-8">
                  <StyledChart 
                    data={combinedCostData.map(d => ({ ...d, fill: d.color })).slice(0, 10)}
                    type="bar"
                    title="Top Metrics"
                    valueFormatter={(val) => formatCurrency(val, true)}
                  />
                </div>
              </div>
            </div>

            {/* Detailed Mathematical Breakdown Accordion */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsMathOpen(!isMathOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-[24px]">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">View Detailed Mathematical Breakdown</h3>
                    <p className="text-xs font-medium text-slate-500">Access raw math derivations and master rate sheets</p>
                  </div>
                </div>
                <div className="p-2 bg-transparent text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                  {isMathOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {isMathOpen && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Segmented Control & Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between relative mb-6">
                    <div className="flex overflow-x-auto gap-2 p-1 border-b border-slate-100 w-full sm:w-fit [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <UniversalTabs tabs={[{id: "grey", label: "Basic Structure", icon: <Layers className="w-[18px] h-[18px]" />}]} activeTab={activeTab === "grey" ? "grey" : ""} onTabChange={() => setActiveTab("grey")} />
                      <UniversalTabs tabs={[{id: "finishing", label: "Finishing", icon: <PaintRoller className="w-[18px] h-[18px]" />}]} activeTab={activeTab === "finishing" ? "finishing" : ""} onTabChange={() => setActiveTab("finishing")} />
                      <UniversalTabs tabs={[{id: "rcc", label: "RCC Detailed", icon: <Spline className="w-[18px] h-[18px]" />}]} activeTab={activeTab === "rcc" ? "rcc" : ""} onTabChange={() => setActiveTab("rcc")} />
                      <UniversalTabs tabs={[{id: "master", label: "Master Quantities", icon: <Calculator className="w-[18px] h-[18px]" />}]} activeTab={activeTab === "master" ? "master" : ""} onTabChange={() => setActiveTab("master")} />
                      <UniversalTabs tabs={[{id: "rates", label: "Material Rates", icon: <Database className="w-[18px] h-[18px]" />}]} activeTab={activeTab === "rates" ? "rates" : ""} onTabChange={() => setActiveTab("rates")} />
                    </div>
                  </div>
                  <div className="relative overflow-hidden transition-all duration-300">
                    {activeTab === "grey" && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                      <MaterialSummary
                        title="Grey Structure Breakdown"
                        totalLabel="Total Grey Structure Cost"
                        totalValue={formatCurrency(estimates.totalGrey)}
                        totalUnit=""
                        relatedToolIds={['brickwork', 'concrete-mix']}
                        onRecalculate={() => {}}
                      >
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                           <ResultCard
                              title="Cement"
                              value={estimates.cementBags.toFixed(0)}
                              unit="bags"
                              variant="neutral"
                              description={formatCurrency(estimates.costCement)}
                              status="normal"
                              comparisonText="8% more than average"
                              explanation="The total volume of cement required for foundation, walls, roof, and plaster work. Store in a damp-proof area."
                           />
                           <ResultCard
                              title="Steel"
                              value={(estimates.steelKg / 1000).toFixed(1)}
                              unit="tons"
                              variant="primary"
                              description={formatCurrency(estimates.costSteel)}
                              status="high"
                              comparisonText="5% over typical limit"
                              explanation="High-tensile Grade 60 steel required for structural integrity of the roof, columns, and foundations. Verify the BBS for exact usage."
                           />
                           <ResultCard
                              title="Bricks"
                              value={`${(estimates.bricksCount / 1000).toFixed(0)}k`}
                              unit="qty"
                              variant="warning"
                              description={formatCurrency(estimates.costBricks)}
                              status="normal"
                              secondaryUnit="pallets"
                              secondaryValue={Math.ceil(estimates.bricksCount / 500)}
                           />
                           <ResultCard
                              title="Sand"
                              value={isSI ? (estimates.sandCft / 35.3147).toFixed(1) : estimates.sandCft.toFixed(0)}
                              unit={isSI ? "m³" : "cft"}
                              variant="neutral"
                              description={formatCurrency(estimates.costSand)}
                              secondaryUnit={isSI ? "cft" : "m³"}
                              secondaryValue={isSI ? estimates.sandCft : (estimates.sandCft / 35.3147)}
                              explanation="Required for concrete mortar joints and wall plastering. Silt content should be tested on-site."
                           />
                           <ResultCard
                              title="Crush"
                              value={isSI ? (estimates.crushCft / 35.3147).toFixed(1) : estimates.crushCft.toFixed(0)}
                              unit={isSI ? "m³" : "cft"}
                              variant="neutral"
                              description={formatCurrency(estimates.costCrush)}
                              secondaryUnit={isSI ? "cft" : "m³"}
                              secondaryValue={isSI ? estimates.crushCft : (estimates.crushCft / 35.3147)}
                           />
                        </div>
                      </MaterialSummary>
                      <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
                        Detailed Exact BOQ
                      </h3>
                      <div className="border border-slate-200 rounded-[24px] overflow-hidden bg-white shadow-sm mb-8">
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
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700"
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
                                    ? item.quantity.toLocaleString('en-US')
                                    : item.quantity}
                                  {item.rate && (
                                    <div className="text-[10px] font-normal text-slate-700 mt-0.5 font-mono">
                                      @ {formatCurrency(item.rate)}/{item.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-slate-700">
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
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700"
                              >
                                Above-Ground Work (Walls & Roof)
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
                                    ? item.quantity.toLocaleString('en-US')
                                    : item.quantity}
                                  {item.rate && (
                                    <div className="text-[10px] font-normal text-slate-700 mt-0.5 font-mono">
                                      @ {formatCurrency(item.rate)}/{item.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-slate-700">
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
                      <MaterialSummary
                        title="Finishing Breakdown"
                        totalLabel="Total Finishing Cost"
                        totalValue={formatCurrency(estimates.totalFinishing)}
                        totalUnit=""
                        subtitle={`Based on ${getQualityLabel(finishQuality)} Grade settings (${specs.flooringType}, ${specs.wardrobeMaterial})`}
                        relatedToolIds={['interiors-finishes', 'master-quantity']}
                        onRecalculate={() => {}}
                      >
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {finishingCostData.map((item, idx) => (
                               <ResultCard
                                  key={idx}
                                  title={item.name}
                                  value={formatCurrency(item.value)}
                                  unit=""
                                  variant="neutral"
                               />
                            ))}
                         </div>
                      </MaterialSummary>
                      <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
                        Detailed Exact BOQ
                      </h3>
                      <div className="border border-slate-200 rounded-[24px] overflow-hidden bg-white shadow-sm mb-8">
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
                                    ? Math.round(item.quantity).toLocaleString('en-US')
                                    : item.quantity}
                                  {item.rate && (
                                    <div className="text-[10px] font-normal text-slate-700 mt-0.5 font-mono">
                                      @ {formatCurrency(item.rate)}/{item.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-slate-700">
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
                      <MasterRccStructure isEmbedded={true} />
                    </div>
                  )}
                  {activeTab === "master" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 h-full flex flex-col pt-4">
                      <MasterQuantityEstimator isEmbedded={true} />
                    </div>
                  )}
                  {activeTab === "rates" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 h-full flex flex-col text-left">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[24px]">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                            Configure Material Rates
                          </h2>
                          <p className="text-slate-700 font-medium text-sm mt-1">
                            Review market rates and override with custom vendor quotes
                            if needed.
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto border border-slate-200 rounded-[24px] mb-6">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase text-xs tracking-wider sticky top-0 z-10">
                            <tr>
                              <th className="px-6 py-4 font-bold">Material Item</th>
                              <th className="px-6 py-4 font-bold">Current Market Rate</th>
                              <th className="px-6 py-4 font-bold bg-indigo-50/50 text-indigo-700">Your Custom Rate</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-100">
                            {(
                              [
                                { key: "cement", name: "Cement (Per Bag)", color: "bg-stone-500", bg: "bg-stone-50" },
                                { key: "steel", name: "Steel 60-Grade (Per Kg)", color: "bg-slate-700", bg: "bg-transparent" },
                                { key: "bricks", name: "Bricks A-Class (Per 1000)", color: "bg-orange-500", bg: "bg-orange-50" },
                                { key: "sand", name: "Sand (Per Cft)", color: "bg-amber-400", bg: "bg-amber-50" },
                                { key: "crush", name: "Crush (Per Cft)", color: "bg-neutral-500", bg: "bg-neutral-50" },
                                { key: "laborGrey", name: "Grey Labor (Per Sq.ft)", color: "bg-emerald-500", bg: "bg-emerald-50" },
                                { key: "laborFinish", name: "Finish Labor (Per Sq.ft)", color: "bg-teal-500", bg: "bg-teal-50" },
                              ] as const
                            ).map((item) => (
                              <tr key={item.key} className="hover:bg-transparent/80 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-700">
                                  <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-[24px] ${item.bg} group-hover:scale-110 transition-transform`}>
                                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                                    </div>
                                    <span>{item.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700">
                                  {formatCurrency(item.key === "bricks" ? marketRates[item.key] * 1000 : marketRates[item.key])}
                                </td>
                                <td className="px-6 py-3 bg-indigo-50/30">
                                  <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-700 font-bold mb-0.5">
                                      {settings.currency === "PKR" ? "Rs" : "$"}
                                    </span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="any"
                                      className={`w-full bg-white border ${customRates[item.key] !== undefined ? "border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-700 font-bold" : "border-slate-200 text-slate-800"} rounded-[24px] py-2 pl-10 pr-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                                      placeholder="Default"
                                      value={customRates[item.key] !== undefined ? (item.key === "bricks" ? customRates[item.key]! * 1000 : customRates[item.key]) : ""}
                                      onChange={(e) => {
                                        const val = e.target.value ? parseFloat(e.target.value) : null;
                                        if (val !== null && val < 0) return;
                                        setCustomRate(item.key, val !== null && item.key === "bricks" ? val / 1000 : val);
                                      }}
                                    />
                                  </div>
                                  {customRates[item.key] !== undefined && (
                                    <div className="text-[10px] text-indigo-600 font-medium mt-1 ml-1 truncate">Custom rate active</div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between mt-auto gap-4 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => {
                            if(window.confirm("Are you sure you want to reset all inputs? This action cannot be undone.")) resetCustomRates();
                          }}
                          className="flex items-center gap-2 text-slate-700 font-bold hover:text-slate-800 px-4 py-2 rounded-[24px] hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center"
                        >
                          <RotateCcw className="w-4 h-4" /> Reset Defaults
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  </div>
  
  <GlobalSettingsModal
        isOpen={isGlobalSettingsOpen}
        onClose={() => setIsGlobalSettingsOpen(false)}
      />

      {/* Room Customization Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F5F5F7] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Advanced Room Specs</h2>
                <p className="text-sm font-medium text-slate-500">Configure exact dimensions and features per room</p>
              </div>
              <button onClick={() => setIsRoomModalOpen(false)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
               {(["bedroom", "washroom", "kitchen", "living", "basement"] as const).map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveRoomTab(tab)}
                   className={`px-6 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                     activeRoomTab === tab 
                     ? "border-indigo-600 text-indigo-700 bg-indigo-50/50" 
                     : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                   }`}
                 >
                   {tab === "living" ? "Drawing/Living" : tab}
                 </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {activeRoomTab === "bedroom" && (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typical Length (ft)</label>
                       <input type="number" value={roomConfigs.bedroom.length} onChange={e => setRoomConfigs(p => ({...p, bedroom: {...p.bedroom, length: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typical Width (ft)</label>
                       <input type="number" value={roomConfigs.bedroom.width} onChange={e => setRoomConfigs(p => ({...p, bedroom: {...p.bedroom, width: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ceiling Height (ft)</label>
                       <input type="number" value={roomConfigs.bedroom.height} onChange={e => setRoomConfigs(p => ({...p, bedroom: {...p.bedroom, height: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wardrobe Length (ft)</label>
                       <input type="number" value={roomConfigs.bedroom.wardrobeLength} onChange={e => setRoomConfigs(p => ({...p, bedroom: {...p.bedroom, wardrobeLength: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                  </>
                )}

                {activeRoomTab === "washroom" && (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Length (ft)</label>
                       <input type="number" value={roomConfigs.washroom.length} onChange={e => setRoomConfigs(p => ({...p, washroom: {...p.washroom, length: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Width (ft)</label>
                       <input type="number" value={roomConfigs.washroom.width} onChange={e => setRoomConfigs(p => ({...p, washroom: {...p.washroom, width: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commode / WC Type</label>
                       <select value={roomConfigs.washroom.wcType} onChange={e => setRoomConfigs(p => ({...p, washroom: {...p.washroom, wcType: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>Floor Mounted (Asian)</option>
                         <option>Floor Mounted (Western)</option>
                         <option>Wall Hung (Concealed)</option>
                       </select>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shower Setup</label>
                       <select value={roomConfigs.washroom.showerSetup} onChange={e => setRoomConfigs(p => ({...p, washroom: {...p.washroom, showerSetup: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>Standard Mixer</option>
                         <option>Glass Enclosure</option>
                         <option>Jacuzzi Tub</option>
                       </select>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vanity / Basin</label>
                       <select value={roomConfigs.washroom.vanity} onChange={e => setRoomConfigs(p => ({...p, washroom: {...p.washroom, vanity: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>Standard Ceramic</option>
                         <option>Custom PVC Vanity</option>
                         <option>Corian Marble Top</option>
                       </select>
                    </div>
                  </>
                )}

                {activeRoomTab === "kitchen" && (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Length (ft)</label>
                       <input type="number" value={roomConfigs.kitchen.length} onChange={e => setRoomConfigs(p => ({...p, kitchen: {...p.kitchen, length: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Width (ft)</label>
                       <input type="number" value={roomConfigs.kitchen.width} onChange={e => setRoomConfigs(p => ({...p, kitchen: {...p.kitchen, width: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Countertop (Length ft)</label>
                       <input type="number" value={roomConfigs.kitchen.counterLength} onChange={e => setRoomConfigs(p => ({...p, kitchen: {...p.kitchen, counterLength: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cabinets Material</label>
                       <select value={roomConfigs.kitchen.cabinets} onChange={e => setRoomConfigs(p => ({...p, kitchen: {...p.kitchen, cabinets: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>Lasani Wood</option>
                         <option>UV/Acrylic</option>
                         <option>Solid Ash/Oak</option>
                       </select>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Backsplash</label>
                       <select value={roomConfigs.kitchen.backsplash} onChange={e => setRoomConfigs(p => ({...p, kitchen: {...p.kitchen, backsplash: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>Ceramic Tiles</option>
                         <option>Glass/Mosaic</option>
                         <option>Corian Full Wall</option>
                       </select>
                    </div>
                  </>
                )}

                {activeRoomTab === "living" && (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Length (ft)</label>
                       <input type="number" value={roomConfigs.livingRoom.length} onChange={e => setRoomConfigs(p => ({...p, livingRoom: {...p.livingRoom, length: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Width (ft)</label>
                       <input type="number" value={roomConfigs.livingRoom.width} onChange={e => setRoomConfigs(p => ({...p, livingRoom: {...p.livingRoom, width: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Feature Wall Setup</label>
                       <select value={roomConfigs.livingRoom.featureWall} onChange={e => setRoomConfigs(p => ({...p, livingRoom: {...p.livingRoom, featureWall: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>None</option>
                         <option>Yes (Wallpaper/Paint)</option>
                         <option>Yes (Wood Paneling / Marble)</option>
                       </select>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chandelier Points</label>
                       <input type="number" value={roomConfigs.livingRoom.chandelierPoints} onChange={e => setRoomConfigs(p => ({...p, livingRoom: {...p.livingRoom, chandelierPoints: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                  </>
                )}

                {activeRoomTab === "basement" && (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Excavation Depth (ft)</label>
                       <input type="number" value={roomConfigs.basement.depth} onChange={e => setRoomConfigs(p => ({...p, basement: {...p.basement, depth: Number(e.target.value)}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-[24px] flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Retaining Wall Spec</label>
                       <select value={roomConfigs.basement.retainingWall} onChange={e => setRoomConfigs(p => ({...p, basement: {...p.basement, retainingWall: e.target.value}}))} className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>Standard Brick 13.5-inch</option>
                         <option>RCC 9-Inch</option>
                         <option>RCC 12-Inch Heavy</option>
                       </select>
                    </div>
                  </>
                )}
                
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white">
               <button onClick={() => setIsRoomModalOpen(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-[24px] transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] active:scale-95 flex justify-center items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Save Detail Configurations
               </button>
            </div>
          </div>
        </div>
      )}

      <CalculationHistory
        calculatorId="house_estimator_v1"
        estimationName="Complete House Estimator"
        currentInputs={{ activeTab, finishQuality }}
        currentResults={{ 
          totalCost: estimates.totalCost.toFixed(2),
          totalGrey: estimates.totalGrey.toFixed(2),
          totalFinishing: estimates.totalFinishing.toFixed(2)
        }}
        summaryGeneration={(inputs, res) => `Total Cost: ${res.totalCost}`}
        onRestore={(inputs) => {
          if (inputs.activeTab) setActiveTab(inputs.activeTab);
          if (inputs.finishQuality) setFinishQuality(inputs.finishQuality);
        }}
        savePayload={pdfExportPayload}
      />
    </div>
  );
}
