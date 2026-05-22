import React, { useState, useEffect } from "react";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";
import {
  Circle,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Triangle,
  PlaySquare,
  Component,
  Pill,
  Hexagon,
  Calculator,
  Save,
  History,
} from "lucide-react";
import { MaterialSummary } from "../ui/MaterialSummary";
import { ResultCard } from "../ui/ResultCard";
import { motion } from "motion/react";

import ColorfulTab from "../ui/ColorfulTab";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { SVGShapeVisualizer } from "./ShapeVisualizer";
type Shape =
  | "Circle"
  | "Square"
  | "Rectangle"
  | "Triangle"
  | "Trapezoid"
  | "Ellipse"
  | "RightTriangle"
  | "HorizontalCapsule"
  | "VerticalCapsule"
  | "Parallelogram"
  | "IrregularQuad";
type InputUnit = "mm" | "cm" | "m" | "inches" | "feet";
type OutputUnit = "sqm" | "sqft" | "acres" | "hectares";
export default function AreaCalculator() {
  const { settings, updateSettings } = useSettings();
  const isMetric = settings.measurement === "SI";
  const { user } = useAuth();
  
  
  const [activeShape, setActiveShape] = useState<Shape>("Rectangle");
  const [inputUnit, setInputUnit] = useState<InputUnit>(
    isMetric ? "m" : "feet",
  );
  const [outputUnit, setOutputUnit] = useState<OutputUnit>(
    isMetric ? "sqm" : "sqft",
  );

  interface SavedCalc {
    id: string;
    shape: string;
    area: string;
    perimeter: string;
    date: number;
    inputs: any;
  }
  const [savedCalcs, setSavedCalcs] = useState<SavedCalc[]>(() => {
    try {
      const saved = localStorage.getItem('area_calculator_saved_inline_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('area_calculator_saved_inline_v1', JSON.stringify(savedCalcs));
  }, [savedCalcs]);

  useEffect(() => {
    if (isMetric && ["feet", "inches"].includes(inputUnit)) {
      setInputUnit("m");
    } else if (!isMetric && ["m", "cm", "mm"].includes(inputUnit)) {
      setInputUnit("feet");
    }
    if (isMetric && ["sqft", "acres"].includes(outputUnit)) {
      setOutputUnit("sqm");
    } else if (!isMetric && ["sqm", "hectares"].includes(outputUnit)) {
      setOutputUnit("sqft");
    }
  }, [isMetric]);
  /* Inputs */ const [radius, setRadius] = useState("");
  const [side, setSide] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  /* Triangle (base, height, side2, side3) */ const [triBase, setTriBase] =
    useState("");
  const [triHeight, setTriHeight] = useState("");
  const [triSide2, setTriSide2] = useState("");
  const [triSide3, setTriSide3] = useState("");
  /* Trapezoid (base1, base2, height, side1, side2) */ const [
    trapBase1,
    setTrapBase1,
  ] = useState("");
  const [trapBase2, setTrapBase2] = useState("");
  const [trapHeight, setTrapHeight] = useState("");
  const [trapSide1, setTrapSide1] = useState("");
  const [trapSide2, setTrapSide2] = useState("");
  /* Ellipse (semi-major, semi-minor) */ const [ellMajor, setEllMajor] =
    useState("");
  const [ellMinor, setEllMinor] = useState("");
  /* Right Triangle */ const [rtBase, setRtBase] = useState("");
  const [rtHeight, setRtHeight] = useState("");
  /* Capsule */ const [capLength, setCapLength] = useState("");
  /* straight part */ const [capRadius, setCapRadius] = useState("");
  /* Vertical Capsule */ const [vCapLength, setVCapLength] = useState("");
  const [vCapRadius, setVCapRadius] = useState("");
  /* Parallelogram */ const [paraBase, setParaBase] = useState("");
  const [paraSide, setParaSide] = useState("");
  const [paraHeight, setParaHeight] = useState("");
  /* Irregular Quadrilateral */ const [quadA, setQuadA] = useState("");
  const [quadB, setQuadB] = useState("");
  const [quadC, setQuadC] = useState("");
  const [quadD, setQuadD] = useState("");
  const [quadDiag, setQuadDiag] = useState("");
  const shapes: { id: Shape; label: string; icon: any; color: string }[] = [
    {
      id: "Circle",
      label: "Circle",
      icon: Circle,
      color: "text-rose-500 bg-rose-100 dark:bg-rose-500/20",
    },
    {
      id: "Square",
      label: "Square",
      icon: Square,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20",
    },
    {
      id: "Rectangle",
      label: "Rectangle",
      icon: RectangleHorizontal,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      id: "Triangle",
      label: "Triangle",
      icon: Triangle,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20",
    },
    {
      id: "Trapezoid",
      label: "Trapezoid",
      icon: PlaySquare,
      color: "text-violet-500 bg-violet-100 dark:bg-violet-500/20",
    },
    /* Approximation */ {
      id: "Ellipse",
      label: "Ellipse",
      icon: Circle,
      color: "text-pink-500 bg-pink-100 dark:bg-pink-500/20",
    },
    /* Approximation */ {
      id: "RightTriangle",
      label: "Right Triangle",
      icon: Triangle,
      color: "text-orange-500 bg-orange-100 dark:bg-orange-500/20",
    },
    {
      id: "HorizontalCapsule",
      label: "Capsule (Horz)",
      icon: Pill,
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20",
    },
    {
      id: "VerticalCapsule",
      label: "Capsule (Vert)",
      icon: RectangleVertical,
      color: "text-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-500/20",
    },
    {
      id: "Parallelogram",
      label: "Parallelogram",
      icon: Component,
      color: "text-lime-500 bg-lime-100 dark:bg-lime-500/20",
    },
    {
      id: "IrregularQuad",
      label: "Irregular Quad",
      icon: Hexagon,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20",
    },
  ];
  /* Convert input value built in input unit to meters */ const toMeters = (
    val: string | number,
  ) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num)) return 0;
    switch (inputUnit) {
      case "mm":
        return num * CIVIL_CONSTANTS.MM_TO_M;
      case "cm":
        return num / 100;
      case "inches":
        return num * CIVIL_CONSTANTS.IN_TO_MM / 1000;
      case "feet":
        return num * CIVIL_CONSTANTS.FT_TO_M;
      case "m":
      default:
        return num;
    }
  };
  /* Convert area in sq. meters to target output unit */ const formatArea = (
    areaSqM: number,
  ) => {
    switch (outputUnit) {
      case "sqft":
        return (areaSqM * Math.pow(CIVIL_CONSTANTS.M_TO_FT, 2)).toFixed(2) + " sq.ft";
      case "acres":
        return (areaSqM * 0.000247105).toFixed(4) + " acres";
      case "hectares":
        return (areaSqM * 0.0001).toFixed(4) + " hectares";
      case "sqm":
      default:
        return areaSqM.toFixed(2) + " m²";
    }
  };
  /* Convert perimeter in meters to input unit (usually perimeter is shown in same unit as input, or user might want something else, let's keep it in input unit or meters) */ const formatPerimeter =
    (perimMeters: number) => {
      switch (inputUnit) {
        case "mm":
          return (perimMeters / CIVIL_CONSTANTS.MM_TO_M).toFixed(2) + " mm";
        case "cm":
          return (perimMeters * 100).toFixed(2) + " cm";
        case "inches":
          return (perimMeters / (CIVIL_CONSTANTS.IN_TO_MM / 1000)).toFixed(2) + " inches";
        case "feet":
          return (perimMeters / CIVIL_CONSTANTS.FT_TO_M).toFixed(2) + " feet";
        case "m":
        default:
          return perimMeters.toFixed(2) + " m";
      }
    };
  let calcAreaSqM = 0;
  let calcPerimeterM = 0;
  let inputSummary: Record<string, string> = {};
  if (activeShape === "Circle") {
    const r = toMeters(radius);
    calcAreaSqM = Math.PI * r * r;
    calcPerimeterM = 2 * Math.PI * r;
    inputSummary = { Radius: `${radius} ${inputUnit}` };
  } else if (activeShape === "Square") {
    const s = toMeters(side);
    calcAreaSqM = s * s;
    calcPerimeterM = 4 * s;
    inputSummary = { Side: `${side} ${inputUnit}` };
  } else if (activeShape === "Rectangle") {
    const l = toMeters(length);
    const w = toMeters(width);
    calcAreaSqM = l * w;
    calcPerimeterM = 2 * (l + w);
    inputSummary = {
      Length: `${length} ${inputUnit}`,
      Width: `${width} ${inputUnit}`,
    };
  } else if (activeShape === "Triangle") {
    const b = toMeters(triBase);
    const h = toMeters(triHeight);
    const s2 = toMeters(triSide2);
    const s3 = toMeters(triSide3);
    calcAreaSqM = 0.5 * b * h;
    calcPerimeterM = b + s2 + s3;
    inputSummary = {
      Base: `${triBase} ${inputUnit}`,
      Height: `${triHeight} ${inputUnit}`,
      "Side 2": `${triSide2} ${inputUnit}`,
      "Side 3": `${triSide3} ${inputUnit}`,
    };
  } else if (activeShape === "Trapezoid") {
    const b1 = toMeters(trapBase1);
    const b2 = toMeters(trapBase2);
    const h = toMeters(trapHeight);
    const s1 = toMeters(trapSide1);
    const s2 = toMeters(trapSide2);
    calcAreaSqM = 0.5 * (b1 + b2) * h;
    calcPerimeterM = b1 + b2 + s1 + s2;
    inputSummary = {
      "Base 1": `${trapBase1} ${inputUnit}`,
      "Base 2": `${trapBase2} ${inputUnit}`,
      Height: `${trapHeight} ${inputUnit}`,
      "Leg 1": `${trapSide1} ${inputUnit}`,
      "Leg 2": `${trapSide2} ${inputUnit}`,
    };
  } else if (activeShape === "Ellipse") {
    const a = toMeters(ellMajor);
    const b = toMeters(ellMinor);
    calcAreaSqM = Math.PI * a * b;
    /* Ramanujan's approximation for ellipse perimeter */ calcPerimeterM =
      Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    inputSummary = {
      "Semi-major Axis (a)": `${ellMajor} ${inputUnit}`,
      "Semi-minor Axis (b)": `${ellMinor} ${inputUnit}`,
    };
  } else if (activeShape === "RightTriangle") {
    const b = toMeters(rtBase);
    const h = toMeters(rtHeight);
    calcAreaSqM = 0.5 * b * h;
    calcPerimeterM = b + h + Math.sqrt(b * b + h * h);
    inputSummary = {
      Base: `${rtBase} ${inputUnit}`,
      Height: `${rtHeight} ${inputUnit}`,
    };
  } else if (activeShape === "HorizontalCapsule") {
    const l = toMeters(capLength);
    const r = toMeters(capRadius);
    calcAreaSqM = l * 2 * r + Math.PI * r * r;
    calcPerimeterM = 2 * l + 2 * Math.PI * r;
    inputSummary = {
      "Straight Length": `${capLength} ${inputUnit}`,
      Radius: `${capRadius} ${inputUnit}`,
    };
  } else if (activeShape === "VerticalCapsule") {
    const l = toMeters(vCapLength);
    const r = toMeters(vCapRadius);
    calcAreaSqM = l * 2 * r + Math.PI * r * r;
    calcPerimeterM = 2 * l + 2 * Math.PI * r;
    inputSummary = {
      "Straight Length": `${vCapLength} ${inputUnit}`,
      Radius: `${vCapRadius} ${inputUnit}`,
    };
  } else if (activeShape === "Parallelogram") {
    const b = toMeters(paraBase);
    const h = toMeters(paraHeight);
    const s = toMeters(paraSide);
    calcAreaSqM = b * h;
    calcPerimeterM = 2 * (b + s);
    inputSummary = {
      Base: `${paraBase} ${inputUnit}`,
      Height: `${paraHeight} ${inputUnit}`,
      Side: `${paraSide} ${inputUnit}`,
    };
  } else if (activeShape === "IrregularQuad") {
    const a = toMeters(quadA);
    const b = toMeters(quadB);
    const c = toMeters(quadC);
    const d = toMeters(quadD);
    const diag = toMeters(quadDiag);
    /* Area via two triangles using Heron's formula */ const s1 =
      (a + b + diag) / 2;
    const area1 = Math.sqrt(
      Math.max(0, s1 * (s1 - a) * (s1 - b) * (s1 - diag)),
    );
    const s2 = (c + d + diag) / 2;
    const area2 = Math.sqrt(
      Math.max(0, s2 * (s2 - c) * (s2 - d) * (s2 - diag)),
    );
    calcAreaSqM = area1 + area2;
    calcPerimeterM = a + b + c + d;
    inputSummary = {
      "Side A": `${quadA} ${inputUnit}`,
      "Side B": `${quadB} ${inputUnit}`,
      "Side C": `${quadC} ${inputUnit}`,
      "Side D": `${quadD} ${inputUnit}`,
      Diagonal: `${quadDiag} ${inputUnit}`,
    };
  }
  const exportData = {
    Shape: activeShape,
    "Calculated Area": formatArea(calcAreaSqM),
    "Calculated Perimeter": formatPerimeter(calcPerimeterM),
  };

  const handleSaveCalculation = () => {
    if (calcAreaSqM === 0 && calcPerimeterM === 0) return;
    const newCalc: SavedCalc = {
      id: Date.now().toString(),
      shape: activeShape,
      area: formatArea(calcAreaSqM),
      perimeter: formatPerimeter(calcPerimeterM),
      date: Date.now(),
      inputs: {
        inputUnit, outputUnit, radius, side, length, width, triBase, triHeight, triSide2, triSide3, trapBase1, trapBase2, trapHeight, trapSide1, trapSide2, ellMajor, ellMinor, rtBase, rtHeight, capLength, capRadius, vCapLength, vCapRadius, paraBase, paraSide, paraHeight, quadA, quadB, quadC, quadD, quadDiag
      }
    };
    setSavedCalcs([newCalc, ...savedCalcs].slice(0, 10)); // Keep the last 10
  };

  const deleteCalculation = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this task?")) {
      setSavedCalcs(savedCalcs.filter(c => c.id !== id));
    }
  };

  const restoreCalculation = (calc: SavedCalc) => {
    const ins = calc.inputs;
    if (ins.inputUnit) setInputUnit(ins.inputUnit);
    if (ins.outputUnit) setOutputUnit(ins.outputUnit);
    if (ins.radius !== undefined) setRadius(ins.radius);
    if (ins.side !== undefined) setSide(ins.side);
    if (ins.length !== undefined) setLength(ins.length);
    if (ins.width !== undefined) setWidth(ins.width);
    if (ins.triBase !== undefined) setTriBase(ins.triBase);
    if (ins.triHeight !== undefined) setTriHeight(ins.triHeight);
    if (ins.triSide2 !== undefined) setTriSide2(ins.triSide2);
    if (ins.triSide3 !== undefined) setTriSide3(ins.triSide3);
    if (ins.trapBase1 !== undefined) setTrapBase1(ins.trapBase1);
    if (ins.trapBase2 !== undefined) setTrapBase2(ins.trapBase2);
    if (ins.trapHeight !== undefined) setTrapHeight(ins.trapHeight);
    if (ins.trapSide1 !== undefined) setTrapSide1(ins.trapSide1);
    if (ins.trapSide2 !== undefined) setTrapSide2(ins.trapSide2);
    if (ins.ellMajor !== undefined) setEllMajor(ins.ellMajor);
    if (ins.ellMinor !== undefined) setEllMinor(ins.ellMinor);
    if (ins.rtBase !== undefined) setRtBase(ins.rtBase);
    if (ins.rtHeight !== undefined) setRtHeight(ins.rtHeight);
    if (ins.capLength !== undefined) setCapLength(ins.capLength);
    if (ins.capRadius !== undefined) setCapRadius(ins.capRadius);
    if (ins.vCapLength !== undefined) setVCapLength(ins.vCapLength);
    if (ins.vCapRadius !== undefined) setVCapRadius(ins.vCapRadius);
    if (ins.paraBase !== undefined) setParaBase(ins.paraBase);
    if (ins.paraSide !== undefined) setParaSide(ins.paraSide);
    if (ins.paraHeight !== undefined) setParaHeight(ins.paraHeight);
    if (ins.quadA !== undefined) setQuadA(ins.quadA);
    if (ins.quadB !== undefined) setQuadB(ins.quadB);
    if (ins.quadC !== undefined) setQuadC(ins.quadC);
    if (ins.quadD !== undefined) setQuadD(ins.quadD);
    if (ins.quadDiag !== undefined) setQuadDiag(ins.quadDiag);
    setActiveShape(calc.shape as Shape);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      {" "}
      <div className="max-w-4xl mx-auto">
        {" "}
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          {" "}
          <Calculator className="w-8 h-8 text-indigo-600" /> Area
          Calculator{" "}
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          Calculate area and perimeter for any 2D shape with unit conversions.
        </p>{" "}
        {/* Global Settings */}{" "}
        <div className="flex flex-wrap gap-4 mb-8">
          {" "}
          <div>
            {" "}
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
              Input Unit
            </label>{" "}
            <select
              value={inputUnit}
              onChange={(e) => {
                const newU = e.target.value as InputUnit;
                setInputUnit(newU);
                if (newU === "feet" || newU === "inches") {
                  updateSettings({ measurement: "FPS" });
                } else if (newU === "m" || newU === "cm" || newU === "mm") {
                  updateSettings({ measurement: "SI" });
                }
              }}
              className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-xl text-sm font-medium"
            >
              {" "}
              <option value="mm">Millimeters (mm)</option>{" "}
              <option value="cm">Centimeters (cm)</option>{" "}
              <option value="m">Meters (m)</option>{" "}
              <option value="inches">Inches (in)</option>{" "}
              <option value="feet">Feet (ft)</option>{" "}
            </select>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Area Output Unit
            </label>{" "}
            <select
              value={outputUnit}
              onChange={(e) => {
                const newU = e.target.value as OutputUnit;
                setOutputUnit(newU);
                if (newU === "sqft" || newU === "acres") {
                  updateSettings({ measurement: "FPS" });
                } else if (newU === "sqm" || newU === "hectares") {
                  updateSettings({ measurement: "SI" });
                }
              }}
              className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-xl text-sm font-medium"
            >
              {" "}
              <option value="sqm">Square Meters (m²)</option>{" "}
              <option value="sqft">Square Feet (sq.ft)</option>{" "}
              <option value="acres">Acres</option>{" "}
              <option value="hectares">Hectares</option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
        {/* Shapes Grid */}{" "}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 p-1">
          {" "}
          {shapes.map((s, idx) => {
            const Icon = s.icon;
            const baseColor = s.color.split("-")[1];
            return (
              <ColorfulTab index={idx} key={s.id}
                id={s.id}
                label={s.label}
                icon={<Icon className="w-5 h-5" />}
                isActive={activeShape === s.id}
                onClick={() => setActiveShape(s.id)}
                colorTheme={baseColor as any}
              />
            );
          })}{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {" "}
          {/* Inputs Section */}{" "}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            {" "}
            <h3 className="font-bold text-lg mb-6">
              {activeShape} Measurements
            </h3>{" "}
            <div className="space-y-4">
              {" "}
              {activeShape === "Circle" && (
                <div>
                  {" "}
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Radius ({inputUnit})
                  </label>{" "}
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                  />{" "}
                </div>
              )}{" "}
              {activeShape === "Square" && (
                <div>
                  {" "}
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Side length ({inputUnit})
                  </label>{" "}
                  <input
                    type="number"
                    value={side}
                    onChange={(e) => setSide(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                  />{" "}
                </div>
              )}{" "}
              {activeShape === "Rectangle" && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Length ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Width ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeShape === "Triangle" && (
                <>
                  {" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Base ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={triBase}
                        onChange={(e) => setTriBase(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Height ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={triHeight}
                        onChange={(e) => setTriHeight(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side 2 ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={triSide2}
                        onChange={(e) => setTriSide2(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side 3 ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={triSide3}
                        onChange={(e) => setTriSide3(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeShape === "Trapezoid" && (
                <>
                  {" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Parallel Base 1 ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={trapBase1}
                        onChange={(e) => setTrapBase1(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Parallel Base 2 ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={trapBase2}
                        onChange={(e) => setTrapBase2(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={trapHeight}
                      onChange={(e) => setTrapHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Leg 1 ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={trapSide1}
                        onChange={(e) => setTrapSide1(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Leg 2 ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={trapSide2}
                        onChange={(e) => setTrapSide2(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeShape === "Ellipse" && (
                <>
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Semi-major Axis (a) ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={ellMajor}
                      onChange={(e) => setEllMajor(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Semi-minor Axis (b) ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={ellMinor}
                      onChange={(e) => setEllMinor(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeShape === "RightTriangle" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Base ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={rtBase}
                      onChange={(e) => setRtBase(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Height ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={rtHeight}
                      onChange={(e) => setRtHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </div>
              )}{" "}
              {activeShape === "HorizontalCapsule" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Straight Length ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={capLength}
                      onChange={(e) => setCapLength(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Radius ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={capRadius}
                      onChange={(e) => setCapRadius(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </div>
              )}{" "}
              {activeShape === "VerticalCapsule" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Straight Length ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={vCapLength}
                      onChange={(e) => setVCapLength(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Radius ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={vCapRadius}
                      onChange={(e) => setVCapRadius(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </div>
              )}{" "}
              {activeShape === "Parallelogram" && (
                <>
                  {" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Base ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={paraBase}
                        onChange={(e) => setParaBase(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={paraSide}
                        onChange={(e) => setParaSide(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Vertical Height ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={paraHeight}
                      onChange={(e) => setParaHeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {activeShape === "IrregularQuad" && (
                <>
                  {" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side A ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={quadA}
                        onChange={(e) => setQuadA(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side B ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={quadB}
                        onChange={(e) => setQuadB(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side C ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={quadC}
                        onChange={(e) => setQuadC(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Side D ({inputUnit})
                      </label>{" "}
                      <input
                        type="number"
                        value={quadD}
                        onChange={(e) => setQuadD(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Diagonal (A to C) ({inputUnit})
                    </label>{" "}
                    <input
                      type="number"
                      value={quadDiag}
                      onChange={(e) => setQuadDiag(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-700 dark:text-slate-300"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
            </div>{" "}
          </div>{" "}
          {/* Results Section */}{" "}
          <div className="flex flex-col flex-1">
            <MaterialSummary
               title="Real-Time Calculation"
               totalLabel="Total Area"
               totalValue={formatArea(calcAreaSqM)}
               totalUnit=""
               subtitle=""
             >
              {activeShape === "Trapezoid" && (
                <SVGShapeVisualizer
                  shape="Trapezoid"
                  dimensions={{
                    base1: Number(trapBase1),
                    base2: Number(trapBase2),
                    height: Number(trapHeight),
                  }}
                />
              )}
              {activeShape === "Circle" && (
                <SVGShapeVisualizer shape="Circle" dimensions={{ radius: Number(radius) }} />
              )}
              {activeShape === "Square" && (
                <SVGShapeVisualizer shape="Square" dimensions={{ side: Number(side) }} />
              )}
              {activeShape === "Rectangle" && (
                <SVGShapeVisualizer shape="Rectangle" dimensions={{ length: Number(length), width: Number(width) }} />
              )}
              {activeShape === "Triangle" && (
                <SVGShapeVisualizer shape="Triangle" dimensions={{ a: Number(triBase), b: Number(triSide2), c: Number(triSide3) }} />
              )}
              {activeShape === "Ellipse" && (
                <SVGShapeVisualizer shape="Ellipse" dimensions={{ major: Number(ellMajor), minor: Number(ellMinor) }} />
              )}
              {activeShape === "RightTriangle" && (
                <SVGShapeVisualizer shape="RightTriangle" dimensions={{ base: Number(rtBase), height: Number(rtHeight) }} />
              )}
              {activeShape === "HorizontalCapsule" && (
                <SVGShapeVisualizer shape="HorizontalCapsule" dimensions={{ length: Number(capLength), radius: Number(capRadius) }} />
              )}
              {activeShape === "VerticalCapsule" && (
                <SVGShapeVisualizer shape="VerticalCapsule" dimensions={{ length: Number(vCapLength), radius: Number(vCapRadius) }} />
              )}
              {activeShape === "Parallelogram" && (
                <SVGShapeVisualizer shape="Parallelogram" dimensions={{ base: Number(paraBase), height: Number(paraHeight) }} />
              )}
              {activeShape === "IrregularQuad" && (
                <SVGShapeVisualizer shape="IrregularQuad" dimensions={{ a: Number(quadA), b: Number(quadB), c: Number(quadC), d: Number(quadD) }} />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <ResultCard
                  title="Perimeter / Circumference"
                  value={formatPerimeter(calcPerimeterM)}
                  unit=""
                  variant="neutral"
                />
              </div>
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={handleSaveCalculation}
                disabled={calcAreaSqM === 0 && calcPerimeterM === 0}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/20"
              >
                <Save className="w-5 h-5" />
                Save Calculation to List
              </button>
            </div>
            {savedCalcs.length > 0 && (
              <div className="mt-8 border-t border-slate-700/50 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  <History className="w-4 h-4 text-indigo-400" /> Saved Calculations
                </h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {savedCalcs.map((calc) => (
                    <div key={calc.id} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {calc.shape}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteCalculation(calc.id)}
                          className="text-slate-700 dark:text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-700"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <span className="block text-[10px] text-slate-700 dark:text-slate-300 uppercase">Area</span>
                          <span className="text-sm font-bold text-indigo-300">{calc.area}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-700 dark:text-slate-300 uppercase">Perimeter</span>
                          <span className="text-sm font-bold text-teal-300">{calc.perimeter}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => restoreCalculation(calc)}
                        className="w-full mt-1 bg-slate-700/50 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <PlaySquare className="w-3 h-3" /> Recall Inputs
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </MaterialSummary>
          </div>
        </div>
      </div>
      <CalculationHistory
        calculatorId="area_calculator_v1"
        currentInputs={{ activeShape, inputUnit, outputUnit, radius, side, length, width, triBase, triHeight, triSide2, triSide3, trapBase1, trapBase2, trapHeight, trapSide1, trapSide2, ellMajor, ellMinor, rtBase, rtHeight, capLength, capRadius, vCapLength, vCapRadius, paraBase, paraSide, paraHeight, quadA, quadB, quadC, quadD, quadDiag }}
        currentResults={{ area: formatArea(calcAreaSqM), perimeter: formatPerimeter(calcPerimeterM) }}
        summaryGeneration={(inputs, results) => `${inputs.activeShape} Area: ${results.area}`}
        onRestore={(inputs) => {
          if (inputs.activeShape) setActiveShape(inputs.activeShape);
          if (inputs.inputUnit) setInputUnit(inputs.inputUnit);
          if (inputs.outputUnit) setOutputUnit(inputs.outputUnit);
          if (inputs.radius !== undefined) setRadius(inputs.radius);
          if (inputs.side !== undefined) setSide(inputs.side);
          if (inputs.length !== undefined) setLength(inputs.length);
          if (inputs.width !== undefined) setWidth(inputs.width);
          if (inputs.triBase !== undefined) setTriBase(inputs.triBase);
          if (inputs.triHeight !== undefined) setTriHeight(inputs.triHeight);
          if (inputs.triSide2 !== undefined) setTriSide2(inputs.triSide2);
          if (inputs.triSide3 !== undefined) setTriSide3(inputs.triSide3);
          if (inputs.trapBase1 !== undefined) setTrapBase1(inputs.trapBase1);
          if (inputs.trapBase2 !== undefined) setTrapBase2(inputs.trapBase2);
          if (inputs.trapHeight !== undefined) setTrapHeight(inputs.trapHeight);
          if (inputs.trapSide1 !== undefined) setTrapSide1(inputs.trapSide1);
          if (inputs.trapSide2 !== undefined) setTrapSide2(inputs.trapSide2);
          if (inputs.ellMajor !== undefined) setEllMajor(inputs.ellMajor);
          if (inputs.ellMinor !== undefined) setEllMinor(inputs.ellMinor);
          if (inputs.rtBase !== undefined) setRtBase(inputs.rtBase);
          if (inputs.rtHeight !== undefined) setRtHeight(inputs.rtHeight);
          if (inputs.capLength !== undefined) setCapLength(inputs.capLength);
          if (inputs.capRadius !== undefined) setCapRadius(inputs.capRadius);
          if (inputs.vCapLength !== undefined) setVCapLength(inputs.vCapLength);
          if (inputs.vCapRadius !== undefined) setVCapRadius(inputs.vCapRadius);
          if (inputs.paraBase !== undefined) setParaBase(inputs.paraBase);
          if (inputs.paraSide !== undefined) setParaSide(inputs.paraSide);
          if (inputs.paraHeight !== undefined) setParaHeight(inputs.paraHeight);
          if (inputs.quadA !== undefined) setQuadA(inputs.quadA);
          if (inputs.quadB !== undefined) setQuadB(inputs.quadB);
          if (inputs.quadC !== undefined) setQuadC(inputs.quadC);
          if (inputs.quadD !== undefined) setQuadD(inputs.quadD);
          if (inputs.quadDiag !== undefined) setQuadDiag(inputs.quadDiag);
        }}
      />
    </div>
  );
}
