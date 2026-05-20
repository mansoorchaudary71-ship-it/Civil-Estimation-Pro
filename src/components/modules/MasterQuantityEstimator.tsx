import React, { useState } from "react";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";
import {
  Calculator,
  Box,
  Layers,
  Columns,
  PaintBucket,
  Truck,
  ArrowRightLeft,
  Ruler,
  Square,
  Container,
  ClipboardList,
  Pickaxe,
  Map,
  Waves,
  Droplet,
  Zap,
  Maximize2,
  Shovel,
} from "lucide-react";

import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import Brickwork9InchModule from "./Brickwork9InchModule";
import CountertopModule from "./CountertopModule";
import { SEO } from "../SEO";

interface CalcItem {
  id: string;
  label: string;
  group: string;
  icon: any;
}
export const calculatorsList: CalcItem[] = [
  /* Concrete & Masonry */ {
    id: "concrete",
    label: "Concrete",
    group: "Concrete & Masonry",
    icon: Box,
  },
  { id: "bricks", label: "Bricks", group: "Concrete & Masonry", icon: Columns },
  {
    id: "blocks",
    label: "Blocks",
    group: "Concrete & Masonry",
    icon: Container,
  },
  {
    id: "plaster",
    label: "Plaster",
    group: "Concrete & Masonry",
    icon: PaintBucket,
  },
  {
    id: "concrete_test",
    label: "Concrete Test",
    group: "Concrete & Masonry",
    icon: ClipboardList,
  },
  /* Finishes */ {
    id: "paint",
    label: "Paint",
    group: "Finishes",
    icon: PaintBucket,
  },
  { id: "tiles", label: "Tiles", group: "Finishes", icon: Layers },
  { id: "terrazzo", label: "Terrazzo", group: "Finishes", icon: Layers },
  {
    id: "floor_bricks",
    label: "Floor Bricks",
    group: "Finishes",
    icon: Columns,
  },
  {
    id: "countertop",
    label: "Countertop (Platform)",
    group: "Finishes",
    icon: Square,
  },
  /* Earthworks */ {
    id: "excavation",
    label: "Excavation",
    group: "Earthworks",
    icon: Pickaxe,
  },
  { id: "filling", label: "Filling", group: "Earthworks", icon: Truck },
  {
    id: "slope_filling",
    label: "Slope Filling",
    group: "Earthworks",
    icon: Map,
  },
  {
    id: "soil_mechanics",
    label: "Soil Mechanics",
    group: "Earthworks",
    icon: Waves,
  },
  {
    id: "anti_termite",
    label: "Anti Termite",
    group: "Earthworks",
    icon: Droplet,
  },
  {
    id: "plywood",
    label: "Plywood Sheets",
    group: "Finishes",
    icon: Square,
  },
  {
    id: "top_soil",
    label: "Top Soil",
    group: "Earthworks",
    icon: Shovel,
  },
  {
    id: "concrete_tube",
    label: "Concrete Tube",
    group: "Concrete & Masonry",
    icon: Box,
  },
  /* Roads */ { id: "asphalt", label: "Asphalt", group: "Roads", icon: Layers },
  {
    id: "prime_coat",
    label: "Bitumen Prime Coat",
    group: "Roads",
    icon: Droplet,
  },
  {
    id: "tack_coat",
    label: "Bitumen Tack Coat",
    group: "Roads",
    icon: Droplet,
  },
  {
    id: "super_elevation",
    label: "Super Elevation",
    group: "Roads",
    icon: ArrowRightLeft,
  },
  /* Reinforcement & Formwork */ {
    id: "helix_bar",
    label: "Helix Bar",
    group: "Rebar & Formwork",
    icon: Zap,
  },
  {
    id: "form_work",
    label: "Form Work",
    group: "Rebar & Formwork",
    icon: Square,
  },
  {
    id: "rebar_cage",
    label: "Rebar Cage Estimation",
    group: "Rebar & Formwork",
    icon: Layers,
  },
  /* General & Specialized */ {
    id: "water_tank",
    label: "Water Tank",
    group: "Specialized",
    icon: Droplet,
  },
  { id: "boq", label: "BOQ", group: "Specialized", icon: ClipboardList },
  { id: "diagonal", label: "Diagonal", group: "Specialized", icon: Maximize2 },
  {
    id: "depth_foundation",
    label: "Depth of Foundation",
    group: "Specialized",
    icon: Ruler,
  },
  {
    id: "precast_boundary",
    label: "Precast Boundary",
    group: "Specialized",
    icon: Container,
  },
];
import { useSettings } from "../../context/SettingsContext";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { Save } from "lucide-react";
type CalcId = string;
export default function MasterQuantityEstimator({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
}) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [activeCalc, setActiveCalc] = useState<CalcId>("concrete");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Concrete");
  const unitSystem = settings.measurement === "SI" ? "metric" : "imperial";
  
  
  /* Input states */ 
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("10");
  const [depth, setDepth] = useState<string>("0.15");
  const [mixRatioStr, setMixRatioStr] = useState<string>("1:2:4");
  const [wastage, setWastage] = useState<string>("5");
  const [rebarWeight, setRebarWeight] = useState<string>("1000");
  const [steelGrade, setSteelGrade] = useState<string>("60");
  const [rebarSpacing, setRebarSpacing] = useState<string>("150");
  const [costPerTon, setCostPerTon] = useState<string>("250000");
  const [totalArea, setTotalArea] = useState<string>("100");
  const [thickness, setThickness] = useState<string>("10");
  const [weightPerUnit, setWeightPerUnit] = useState<string>("50");
  const [quantity, setQuantity] = useState<string>("1");
  const [basePrice, setBasePrice] = useState<string>("1000");
  const [grade, setGrade] = useState<string>("C20");
  const [rooms, setRooms] = useState<string>("3");
  const [pointsPerRoom, setPointsPerRoom] = useState<string>("4");
  const [wireLengthPerPoint, setWireLengthPerPoint] = useState<string>("5");
  const [pipeLengthPerRoom, setPipeLengthPerRoom] = useState<string>("10");
  const [boardPerRoom, setBoardPerRoom] = useState<string>("2");
  const cFactor = unitSystem === "metric" ? 1 : CIVIL_CONSTANTS.FT_TO_M;
  const parse = (v: string) => isNaN(parseFloat(v)) ? 0 : parseFloat(v);

  let results: Record<string, string> = {};
  const l = parse(length);
  const w = parse(width);
  const d = parse(depth);
  const wst = parse(wastage);
  const volume = l * w * d * (1 + wst / 100);
  const area = l * w * (1 + wst / 100);
  const unitL = unitSystem === "metric" ? "m" : "ft";
  const unitA = unitSystem === "metric" ? "m²" : "sq ft";
  const unitV = unitSystem === "metric" ? "m³" : "cu ft";
  switch (activeCalc) {
    case "concrete":
      results = {
        "Total Volume": `${volume.toFixed(2)} ${unitV}`,
        "Cement Bags (50kg)": `${Math.ceil(volume * 6)} bags`,
        Sand: `${(volume * 0.45).toFixed(2)} ${unitV}`,
        Aggregate: `${(volume * 0.9).toFixed(2)} ${unitV}`,
      };
      break;
    case "bricks":
      results = {
        "Total Wall Area": `${area.toFixed(2)} ${unitA}`,
        "No. of Bricks": `${Math.ceil(volume * (unitSystem === "metric" ? 500 : 14.15))} pcs`,
        "Mortar Volume": `${(volume * 0.25).toFixed(2)} ${unitV}`,
      };
      break;
    case "blocks":
      results = {
        "Total Wall Area": `${area.toFixed(2)} ${unitA}`,
        "No. of Blocks (400x200x200mm)": `${Math.ceil(area * (unitSystem === "metric" ? 12.5 : 1.16))} pcs`,
        "Mortar Volume": `${(volume * 0.1).toFixed(2)} ${unitV}`, // Approx 10% volume is mortar
      };
      break;
    case "tiles":
      results = {
        "Floor Area": `${area.toFixed(2)} ${unitA}`,
        "No. of Tiles (600x600)": `${Math.ceil(area / (unitSystem === "metric" ? 0.36 : 3.87))} pcs`,
        "Tile Adhesive": `${(area * 4).toFixed(2)} kg`,
      };
      break;
    case "paint":
      results = {
        "Surface Area": `${area.toFixed(2)} ${unitA}`,
        "Primer Required": `${(area / 10).toFixed(2)} Liters`,
        "Paint Required (2 coats)": `${(area / 6).toFixed(2)} Liters`,
      };
      break;
    case "excavation":
    case "filling":
      results = {
        "Earth Volume": `${volume.toFixed(2)} ${unitV}`,
        "Trucks required (10m³ / 350cft)": `${Math.ceil(volume / (unitSystem === "metric" ? 10 : 350))} trips`,
      };
      break;
    case "asphalt":
      results = {
        Volume: `${volume.toFixed(2)} ${unitV}`,
        "Asphalt Required": `${(volume * (unitSystem === "metric" ? 2.4 : 0.068)).toFixed(2)} Tons`,
      };
      break;
    case "form_work":
      results = {
        "Contact Area": `${(l * d * 2 + w * d * 2).toFixed(2)} ${unitA}`,
        "Plywood sheets (4x8)": `${Math.ceil((l * d * 2 + w * d * 2) / (unitSystem === "metric" ? 2.97 : 32))} sheets`,
      };
      break;
    case "water_tank":
      results = {
        "Tank Capacity": `${volume.toFixed(2)} ${unitV}`,
        "Water Volume": `${(volume * (unitSystem === "metric" ? 1000 : 28.31)).toFixed(2)} Liters / ${(volume * (unitSystem === "metric" ? 264.17 : 7.48)).toFixed(2)} Gallons`,
      };
      break;
    case "diagonal":
      results = {
        Width: `${w.toFixed(2)} ${unitL}`,
        Length: `${l.toFixed(2)} ${unitL}`,
        "Diagonal (Hypotenuse)": `${Math.sqrt(l * l + w * w).toFixed(2)} ${unitL}`,
      };
      break;
    case "prime_coat":
      results = {
        "Surface Area": `${area.toFixed(2)} ${unitA}`,
        "Bitumen Required (Approx 1.0 L/sq.m)": `${(area * (unitSystem === "metric" ? 1.0 : 0.092)).toFixed(2)} Liters`,
        "Bitumen Weight": `${((area * (unitSystem === "metric" ? 1.0 : 0.092)) * 1.01 / 1000).toFixed(3)} Tons`
      };
      break;
    case "tack_coat":
      results = {
        "Surface Area": `${area.toFixed(2)} ${unitA}`,
        "Bitumen Required (Approx 0.25 L/sq.m)": `${(area * (unitSystem === "metric" ? 0.25 : 0.023)).toFixed(2)} Liters`,
        "Bitumen Weight": `${((area * (unitSystem === "metric" ? 0.25 : 0.023)) * 1.01 / 1000).toFixed(3)} Tons`
      };
      break;
    case "countertop":
      results = {
        "Total Surface Area": `${area.toFixed(2)} ${unitA}`,
        "Edge Polishing / Skirting Length": `${(l * 2 + w * 2).toFixed(2)} ${unitL}`,
        "Material Req. (incl. wastage)": `${(area * 1.1).toFixed(2)} ${unitA}`
      };
      break;
    case "precast_boundary":
      results = {
        "Total Length": `${l.toFixed(2)} ${unitL}`,
        "Total Height": `${d.toFixed(2)} ${unitL}`,
        "No. of Columns (Spacing Approx 2m/6ft)": `${Math.ceil(l / (unitSystem === "metric" ? 2 : 6)) + 1} pcs`,
        "No. of Panels": `${Math.ceil(l / (unitSystem === "metric" ? 2 : 6)) * Math.ceil(d / (unitSystem === "metric" ? 0.3 : 1))} pcs`
      };
      break;
    case "plywood":
      results = {
        "Total Surface Area": `${area.toFixed(2)} ${unitA}`,
        "Standard Plywood Sheets (4x8 ft)": `${Math.ceil(area / (unitSystem === "metric" ? 2.97289 : 32))} sheets`,
        "Plywood Required (incl. wastage)": `${Math.ceil((area * (1 + wst/100)) / (unitSystem === "metric" ? 2.97289 : 32))} sheets`
      };
      break;
    case "top_soil":
      results = {
        "Total Area": `${area.toFixed(2)} ${unitA}`,
        "Top Soil Volume": `${volume.toFixed(2)} ${unitV}`,
        "TruckLoads (approx. 10m³ / 350cft)": `${Math.ceil(volume / (unitSystem === "metric" ? 10 : 350))} trips`
      };
      break;
    case "concrete_tube":
      const PI = Math.PI;
      // length is L, width is outer_dia, depth is inner_dia
      const outerR = w / 2;
      const innerR = d / 2;
      const tubeVolume = PI * (outerR * outerR - innerR * innerR) * l;
      results = {
        "Total Length": `${l.toFixed(2)} ${unitL}`,
        "Concrete Volume": `${tubeVolume.toFixed(2)} ${unitV}`,
        "Cement Bags (50kg)": `${Math.ceil(tubeVolume * 6)} bags`,
        "Sand Volume": `${(tubeVolume * 0.45).toFixed(2)} ${unitV}`,
        "Aggregate Volume": `${(tubeVolume * 0.9).toFixed(2)} ${unitV}`
      };
      break;
    case "rebar_cage":
      const weight = parse(rebarWeight);
      const tons = weight / 1000;
      const spacing = parse(rebarSpacing);
      const cost = tons * parse(costPerTon);
      results = {
        "Total Steel Weight": `${weight.toFixed(2)} kg`,
        "Steel Required (Tons)": `${tons.toFixed(3)} tons`,
        "Steel Grade": `Grade ${steelGrade}`,
        "Estimated Spacing": `${spacing} mm`,
        "Total Cost": `Rs ${cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      };
      break;
    default:
      /* Generic fallback for others */ results = {
        "Calculated Value 1": `${(volume * 1.5).toFixed(2)} units`,
        "Calculated Value 2": `${(area * 0.8).toFixed(2)} units`,
      };
      break;
  }

  const renderCalculatorContent = () => {
    /* A simplified generic layout for each calculator for the sake of completion. */ let content = null;
    return (
      <div className="flex flex-wrap  gap-8 items-center w-full">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-4 py-3 shadow-sm">
          <h3 className="font-bold mb-6 text-lg">
            Input Parameters
          </h3>
          <div className="space-y-4">
            {activeCalc !== "rebar_cage" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Length ({unitL})
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    {activeCalc === "concrete_tube" ? "Outer Diameter" : "Width"} ({unitL})
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            {[
              "concrete",
              "bricks",
              "blocks",
              "excavation",
              "filling",
              "asphalt",
              "water_tank",
              "form_work",
              "precast_boundary",
              "concrete_tube"
            ].includes(activeCalc) && (
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  {["form_work", "precast_boundary"].includes(activeCalc) ? "Height" : activeCalc === "concrete_tube" ? "Inner Diameter" : "Depth"} ({unitL})
                </label>
                <input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {activeCalc !== "rebar_cage" && (
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Wastage (%)
                </label>
                <input
                  type="number"
                  value={wastage}
                  onChange={(e) => setWastage(e.target.value)}
                  className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {["concrete", "plaster", "concrete_test"].includes(activeCalc) && (
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Mix Ratio
                </label>
                <input
                  type="text"
                  value={mixRatioStr}
                  onChange={(e) => setMixRatioStr(e.target.value)}
                  className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 1:2:4"
                />
              </div>
            )}
            {activeCalc === "rebar_cage" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Total Rebar Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={rebarWeight}
                    onChange={(e) => setRebarWeight(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Steel Grade
                  </label>
                  <input
                    type="number"
                    value={steelGrade}
                    onChange={(e) => setSteelGrade(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Spacing (mm)
                  </label>
                  <input
                    type="number"
                    value={rebarSpacing}
                    onChange={(e) => setRebarSpacing(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Cost per Ton (Rs)
                  </label>
                  <input
                    type="number"
                    value={costPerTon}
                    onChange={(e) => setCostPerTon(e.target.value)}
                    className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-widest mb-6">
              Quantities Required
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(results).map(([key, val]) => (
                <div
                  key={key}
                  className="bg-blue-900/50 p-4 rounded-xl border border-blue-800/50 flex justify-between items-center"
                >
                  <span className="text-blue-200 text-sm font-medium">
                    {key}
                  </span>
                  <span className="text-xl font-bold text-white">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            
            
            
          </div>
        </div>
      </div>
    );
  };
  const groups = Array.from(new Set(calculatorsList.map((c) => c.group)));
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
          title="Master Quantity Estimator" 
          description="Comprehensive construction quantity estimator for multiple elements including concrete, bricks, plaster, paint, and more." 
          canonicalUrl="https://civilestimationpro.com/master-quantity" 
        />
      )}
      <div className={isEmbedded ? "w-full" : "max-w-7xl mx-auto"}>
        {!isEmbedded && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                <Calculator className="w-8 h-8 text-indigo-600 dark:text-blue-400" />
                Master Quantity Estimator
              </h1>
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 font-medium">
                Comprehensive suite of 23 civil engineering calculators for
                accurate material estimation.
              </p>
            </div>
            <div className="mt-5 flex gap-4 w-fit">
              <GlobalSettingsToggle align="left" />
            </div>
          </div>
        )}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Searchable Accordion / Tool Selection (Desktop & Mobile unified) */}
          <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 font-medium dark:text-white outline-none placeholder:text-slate-700 dark:text-slate-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3.5 text-slate-700 dark:text-slate-300 hover:text-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="xl:h-[600px] xl:overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {groups.map((group) => {
                const groupTools = calculatorsList.filter(
                  (c) => c.group === group && c.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (groupTools.length === 0) return null;
                
                const isExpanded = expandedGroup === group || searchTerm !== "";
                return (
                  <div key={group} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedGroup(isExpanded && searchTerm === "" ? null : group)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="uppercase text-xs tracking-widest">{group}</span>
                      <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-1 p-2 border-t border-slate-100 dark:border-slate-700/50">
                        {groupTools.map((calc) => {
                          const Icon = calc.icon;
                          const isActive = activeCalc === calc.id;
                          return (
                            <button
                              key={calc.id}
                              onClick={() => setActiveCalc(calc.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                                isActive 
                                ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold' 
                                : 'text-slate-600 dark:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium'
                              }`}
                            >
                              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`} />
                              <span className="text-sm truncate">{calc.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Calculator Content */}
          <div className="flex-1">
            {activeCalc === "bricks" ? (
              <Brickwork9InchModule />
            ) : activeCalc === "countertop" ? (
              <CountertopModule />
            ) : (
              renderCalculatorContent()
            )}
          </div>
        </div>
      </div>
      {activeCalc !== 'bricks' && activeCalc !== 'countertop' && (
        <CalculationHistory
          calculatorId={`mqt_${activeCalc}_v1`}
          currentInputs={{ length, width, depth, wastage, totalArea, thickness, weightPerUnit, quantity, costPerTon, basePrice, grade, rooms, pointsPerRoom, wireLengthPerPoint, pipeLengthPerRoom, boardPerRoom }}
          currentResults={results}
          summaryGeneration={(inputs, results) => `${activeCalc.replace('_', ' ').toUpperCase()} Calculator`}
          onRestore={(inputs) => {
            if (inputs.length !== undefined) setLength(inputs.length);
            if (inputs.width !== undefined) setWidth(inputs.width);
            if (inputs.depth !== undefined) setDepth(inputs.depth);
            if (inputs.wastage !== undefined) setWastage(inputs.wastage);
            if (inputs.totalArea !== undefined) setTotalArea(inputs.totalArea);
            if (inputs.thickness !== undefined) setThickness(inputs.thickness);
            if (inputs.weightPerUnit !== undefined) setWeightPerUnit(inputs.weightPerUnit);
            if (inputs.quantity !== undefined) setQuantity(inputs.quantity);
            if (inputs.costPerTon !== undefined) setCostPerTon(inputs.costPerTon);
            if (inputs.basePrice !== undefined) setBasePrice(inputs.basePrice);
            if (inputs.grade !== undefined) setGrade(inputs.grade);
            if (inputs.rooms !== undefined) setRooms(inputs.rooms);
            if (inputs.pointsPerRoom !== undefined) setPointsPerRoom(inputs.pointsPerRoom);
            if (inputs.wireLengthPerPoint !== undefined) setWireLengthPerPoint(inputs.wireLengthPerPoint);
            if (inputs.pipeLengthPerRoom !== undefined) setPipeLengthPerRoom(inputs.pipeLengthPerRoom);
            if (inputs.boardPerRoom !== undefined) setBoardPerRoom(inputs.boardPerRoom);
          }}
        />
      )}
    </div>
  );
}
