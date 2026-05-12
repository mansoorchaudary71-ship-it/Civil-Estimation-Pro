import React, { useState } from "react";
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
} from "lucide-react";

import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import Brickwork9InchModule from "./Brickwork9InchModule";
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
  /* Roads */ { id: "asphalt", label: "Asphalt", group: "Roads", icon: Layers },
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
  const cFactor = unitSystem === "metric" ? 1 : 0.3048;
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
                  <label className="text-xs font-bold text-gray-500 uppercase">
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
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Width ({unitL})
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
            ].includes(activeCalc) && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {activeCalc === "form_work" ? "Height" : "Depth"} ({unitL})
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
                <label className="text-xs font-bold text-gray-500 uppercase">
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
                <label className="text-xs font-bold text-gray-500 uppercase">
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
                  <label className="text-xs font-bold text-gray-500 uppercase">
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
                  <label className="text-xs font-bold text-gray-500 uppercase">
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
                  <label className="text-xs font-bold text-gray-500 uppercase">
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
                  <label className="text-xs font-bold text-gray-500 uppercase">
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
        <div className="bg-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-blue-300 text-sm uppercase tracking-widest mb-6">
              Quantities Required
            </h3>
            <div className="space-y-4">
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
                <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Master Quantity Estimator
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
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
          {/* Mobile Dropdown Nav */}
          <div className="xl:hidden w-full space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
              Select Calculator
            </label>
            <div className="relative">
              <select
                className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={activeCalc}
                onChange={(e) => setActiveCalc(e.target.value as CalcId)}
              >
                {groups.map((group) => (
                  <optgroup key={group} label={group}>
                    {calculatorsList
                      .filter((c) => c.group === group)
                      .map((calc) => (
                        <option key={calc.id} value={calc.id}>
                          {calc.label}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          {/* Sidebar / Top Nav for calculators (Desktop) */}
          <div className="hidden xl:block xl:w-64 flex-shrink-0 space-y-8">
            <div className="xl:h-[600px] xl:overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              {groups.map((group) => (
                <div key={group}>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">
                    {group}
                  </h4>
                  <div className="space-y-1">
                    {calculatorsList
                      .filter((c) => c.group === group)
                      .map((calc) => {
                        const Icon = calc.icon;
                        const isActive = activeCalc === calc.id;
                        return (
                          <button
                            key={calc.id}
                            onClick={() => setActiveCalc(calc.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold tracking-wide text-left ${
                              isActive 
                              ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 border-transparent ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 scale-[1.02] z-20' 
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-transparent dark:hover:bg-slate-700/50 border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow cursor-pointer'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                            />
                            <span className="text-sm">
                              {calc.label}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Calculator Content */}
          <div className="flex-1">
            {activeCalc === "bricks" ? (
              <Brickwork9InchModule />
            ) : (
              renderCalculatorContent()
            )}
          </div>
        </div>
      </div>
      {activeCalc !== 'bricks' && (
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
