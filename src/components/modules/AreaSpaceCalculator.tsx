import React, { useState, useMemo } from "react";
import { useGlobalSettings, MeasurementSystem } from "../../context/SettingsContext";
import { useUnitChange } from "../../hooks/useUnitChange";
import {
  Square, Triangle, Circle, Layers, Ruler, Map as MapIcon, Home, Compass, RectangleHorizontal, Hexagon, Type, CornerDownRight, Calculator, PaintBucket, Plus, Trash2, ShieldCheck
} from "lucide-react";
import { UniversalTabs } from "../ui/UniversalTabs";
import { DetailedCalculationDisplay } from "../ui/DetailedCalculationDisplay";
import toast from 'react-hot-toast';

export default function AreaSpaceCalculator() {
  const { currentUnit } = useGlobalSettings();
  
  useUnitChange((newUnit: MeasurementSystem) => {
    toast.success(`Automatically recalculated area inputs to ${newUnit === 'SI' ? 'Metric' : 'Imperial'} format.`, { icon: '🔄', id: 'area_recalc_toast' });
  });

  const isMetric = currentUnit === "Metric";
  const uLen = isMetric ? "m" : "ft";
  const uArea = isMetric ? "m²" : "sq.ft";

  const [activeTab, setActiveTab] = useState<"shape" | "property" | "plot" | "roof" | "plaster">("shape");

  // --- Tab 1: Shape Calculator ---
  const [shapeType, setShapeType] = useState("rectangle");
  const [shapeParams, setShapeParams] = useState<Record<string, number>>({
    length: 5, width: 4, radius: 3, base: 4, height: 3, sideA: 5, sideB: 7, sideC: 4,
    l1: 5, l2: 3, w1: 2, w2: 2, tTop: 6, tLegWidth: 2, tTotalHeight: 5, tTopThickness: 1,
  });
  const [polygonCoords, setPolygonCoords] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 }, { x: 5, y: 0 }, { x: 4, y: 4 }, { x: 1, y: 3 },
  ]);

  const handleShapeParam = (key: string, val: number) => setShapeParams((prev) => ({ ...prev, [key]: val }));

  const calculateShape = () => {
    let area = 0, perimeter = 0;
    const p = shapeParams;
    switch (shapeType) {
      case "rectangle":
        area = p.length * p.width;
        perimeter = 2 * (p.length + p.width);
        break;
      case "square":
        area = p.length * p.length;
        perimeter = 4 * p.length;
        break;
      case "circle":
        area = Math.PI * p.radius * p.radius;
        perimeter = 2 * Math.PI * p.radius;
        break;
      case "triangle":
        const s = (p.sideA + p.sideB + p.sideC) / 2;
        area = Math.sqrt(Math.max(0, s * (s - p.sideA) * (s - p.sideB) * (s - p.sideC)));
        perimeter = p.sideA + p.sideB + p.sideC;
        break;
      case "trapezoid":
        area = ((p.sideA + p.sideB) / 2) * p.height;
        const leg = Math.sqrt(Math.pow(Math.abs(p.sideB - p.sideA) / 2, 2) + Math.pow(p.height, 2));
        perimeter = p.sideA + p.sideB + 2 * leg;
        break;
      case "l-shape":
        area = p.l1 * p.w1 + (p.l2 - p.w1) * p.w2;
        perimeter = 2 * p.l1 + 2 * p.l2;
        break;
      case "t-shape":
        area = p.tTop * p.tTopThickness + (p.tTotalHeight - p.tTopThickness) * p.tLegWidth;
        perimeter = 2 * p.tTop + 2 * p.tTotalHeight;
        break;
      case "polygon":
        let sum = 0, perim = 0;
        const n = polygonCoords.length;
        if (n >= 3) {
          for (let i = 0; i < n; i++) {
            const current = polygonCoords[i];
            const next = polygonCoords[(i + 1) % n];
            sum += current.x * next.y - next.x * current.y;
            perim += Math.hypot(next.x - current.x, next.y - current.y);
          }
          area = Math.abs(sum) / 2;
          perimeter = perim;
        }
        break;
    }
    return { area, perimeter };
  };
  const shapeData = calculateShape();

  // --- Tab 2: Property Area ---
  const [propParams, setPropParams] = useState({
    carpetReq: 100, internalWallsPerc: 10, externalWallsPerc: 5, balconyArea: 10, commonAreaPerc: 20,
  });
  const handlePropParam = (key: string, val: number) => setPropParams((prev) => ({ ...prev, [key]: val }));

  const propertyCalc = useMemo(() => {
    const traditionalCarpet = propParams.carpetReq;
    const reraCarpetArea = traditionalCarpet + traditionalCarpet * (propParams.internalWallsPerc / 100);
    const plinthArea = reraCarpetArea + traditionalCarpet * (propParams.externalWallsPerc / 100);
    const builtUpArea = plinthArea + propParams.balconyArea;
    const superBuiltUpArea = builtUpArea + builtUpArea * (propParams.commonAreaPerc / 100);
    return { traditionalCarpet, reraCarpetArea, plinthArea, builtUpArea, superBuiltUpArea };
  }, [propParams]);

  // --- Tab 3: Plot Measurement ---
  const [plotBounds, setPlotBounds] = useState({ n: 30, s: 30, e: 40, w: 40, d: 50 });
  const boundsArea = useMemo(() => {
    const { n, s, e, w, d } = plotBounds;
    const s1 = (n + e + d) / 2;
    const area1 = Math.sqrt(Math.max(0, s1 * (s1 - n) * (s1 - e) * (s1 - d)));
    const s2 = (s + w + d) / 2;
    const area2 = Math.sqrt(Math.max(0, s2 * (s2 - s) * (s2 - w) * (s2 - d)));
    return { area1, area2, total: area1 + area2, perimeter: n + s + e + w };
  }, [plotBounds]);

  // --- Tab 4: Roof Area ---
  const [roofParams, setRoofParams] = useState({ floorArea: 150, pitchAngle: 30, overhang: 0.6, perimeterLength: 50 });
  const roofCalc = useMemo(() => {
    const overhangArea = roofParams.perimeterLength * roofParams.overhang;
    const totalHorizontalArea = roofParams.floorArea + overhangArea;
    const pitchRad = (roofParams.pitchAngle * Math.PI) / 180;
    const trueRoofArea = totalHorizontalArea / Math.cos(pitchRad);
    return { totalHorizontalArea, trueRoofArea };
  }, [roofParams]);

  // --- Tab 5: Plaster & Paint Deductions ---
  const [wallLen, setWallLen] = useState(5);
  const [wallHt, setWallHt] = useState(3);
  const [bothFaces, setBothFaces] = useState(false);
  const [jambDepth, setJambDepth] = useState(0.2);
  const [openings, setOpenings] = useState([{ w: 1, h: 2, count: 1 }]);

  const plasterCalc = useMemo(() => {
    let grossArea = wallLen * wallHt;
    if (bothFaces) grossArea *= 2;

    let totalDeduction = 0;
    let jambAddition = 0;

    let steps = [];

    steps.push({
      stepName: "1. Gross Wall Area",
      equation: bothFaces ? "A_gross = (Length × Height) × 2" : "A_gross = Length × Height",
      variables: [ { name: "Length", value: wallLen, unit: uLen }, { name: "Height", value: wallHt, unit: uLen } ],
// Replace them all using exact exact string.
      substitution: bothFaces ? `A_gross = (${wallLen} × ${wallHt}) × 2` : `A_gross = ${wallLen} × ${wallHt}`,
      result: parseFloat(grossArea.toFixed(4)),
      resultUnit: uArea,
      resultColor: "slate"
    });

    openings.forEach((op, idx) => {
      const area = op.w * op.h;
      const totalOpArea = area * op.count;
      let deduct = 0;
      let add = 0;
      let ruleApplied = "";

      if (area < 0.5) {
        deduct = 0;
        ruleApplied = "< 0.5 sq.m (No deduction)";
      } else if (area <= 3.0) {
        deduct = bothFaces ? totalOpArea : (totalOpArea / 2);
        ruleApplied = bothFaces ? "0.5 to 3 sq.m (Deduct 1 face only for both side plaster)" : "0.5 to 3 sq.m (Deduct 50% for single side plaster measurement)";
      } else {
        deduct = bothFaces ? totalOpArea * 2 : totalOpArea;
        ruleApplied = "> 3 sq.m (Deduct entirely, add jambs)";
        add = (2 * op.h + op.w) * jambDepth * op.count;
      }
      totalDeduction += deduct;
      jambAddition += add;

      steps.push({
        stepName: `Opening ${idx + 1} Deduction`,
        equation: ruleApplied,
        insight: `Width: ${op.w}${uLen}, Height: ${op.h}${uLen}, Count: ${op.count}`,
        variables: [ { name: "Total Op Area", value: totalOpArea, unit: uArea } ],
        substitution: `Deduct: ${deduct.toFixed(2)} ${uArea}` + (add > 0 ? `, Add Jambs: ${add.toFixed(2)} ${uArea}` : ""),
        result: parseFloat((add - deduct).toFixed(4)),
        resultUnit: uArea,
        resultColor: "rose"
      });
    });

    const netArea = grossArea - totalDeduction + jambAddition;

    steps.push({
      stepName: "Net Plastering/Paint Area",
      equation: "A_net = A_gross - Deductions + Jambs",
      variables: [
        { name: "Gross", value: grossArea.toFixed(2), unit: uArea },
        { name: "Deductions", value: totalDeduction.toFixed(2), unit: uArea },
        { name: "Jambs", value: jambAddition.toFixed(2), unit: uArea }
      ],
      substitution: `A_net = ${grossArea.toFixed(2)} - ${totalDeduction.toFixed(2)} + ${jambAddition.toFixed(2)}`,
      result: parseFloat(netArea.toFixed(4)),
      resultUnit: uArea,
      resultColor: "emerald"
    });

    return { grossArea, totalDeduction, jambAddition, netArea, steps };
  }, [wallLen, wallHt, bothFaces, openings, jambDepth, uLen, uArea]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-[120px]">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-semibold tabular-nums tracking-tight text-slate-800 dark:text-white flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-[24px]">
            <Ruler className="w-8 h-8" />
          </div>
          Plot Area Calculator — Irregular Land, RERA & IS Code Compliant
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Professional standard area computation with geometric triangulation, RERA matrices, roof pitch multi-factor, and IS Code opening deductions.
        </p>
      </div>

      {/* TABS */}
      <div className="-mx-4 px-4 pb-4 md:mx-0 md:px-0">
        <UniversalTabs
          tabs={[
            { id: "shape", label: "2D Shapes", icon: <Square className="w-5 h-5" /> },
            { id: "plot", label: "Triangulation", icon: <MapIcon className="w-5 h-5" /> },
            { id: "property", label: "RERA Areas", icon: <Home className="w-5 h-5" /> },
            { id: "plaster", label: "Plaster / Paint Deductions", icon: <PaintBucket className="w-5 h-5" /> },
            { id: "roof", label: "Roof Pitch", icon: <Layers className="w-5 h-5" /> }
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: SHAPES */}
          {activeTab === "shape" && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-[24px] shadow-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                <Square className="w-5 h-5 text-indigo-500" /> 2D Shape Calculator
              </h3>
              <div className="mb-6 overflow-x-auto pb-2 flex gap-2">
                <select value={shapeType} onChange={(e) => setShapeType(e.target.value)} className="w-full sm:w-auto px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  <option value="rectangle">Rectangle</option>
                  <option value="square">Square</option>
                  <option value="triangle">Triangle</option>
                  <option value="circle">Circle</option>
                  <option value="trapezoid">Trapezoid</option>
                  <option value="l-shape">L-Shape</option>
                  <option value="t-shape">T-Shape</option>
                  <option value="polygon">Irregular Polygon</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {shapeType === "rectangle" && (
                  <>
                    <div><label className="block text-sm font-bold mb-2">Length ({uLen})</label><input type="number" value={shapeParams.length} onChange={(e) => handleShapeParam("length", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-bold mb-2">Width ({uLen})</label><input type="number" value={shapeParams.width} onChange={(e) => handleShapeParam("width", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                  </>
                )}
                {shapeType === "square" && (
                  <div><label className="block text-sm font-bold mb-2">Side Length ({uLen})</label><input type="number" value={shapeParams.length} onChange={(e) => handleShapeParam("length", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                )}
                {shapeType === "circle" && (
                  <div><label className="block text-sm font-bold mb-2">Radius ({uLen})</label><input type="number" value={shapeParams.radius} onChange={(e) => handleShapeParam("radius", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                )}
                {shapeType === "triangle" && (
                  <>
                    <div><label className="block text-sm font-bold mb-2">Side A ({uLen})</label><input type="number" value={shapeParams.sideA} onChange={(e) => handleShapeParam("sideA", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-bold mb-2">Side B ({uLen})</label><input type="number" value={shapeParams.sideB} onChange={(e) => handleShapeParam("sideB", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-bold mb-2">Side C ({uLen})</label><input type="number" value={shapeParams.sideC} onChange={(e) => handleShapeParam("sideC", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                  </>
                )}
                {shapeType === "trapezoid" && (
                  <>
                    <div><label className="block text-sm font-bold mb-2">Parallel Side A ({uLen})</label><input type="number" value={shapeParams.sideA} onChange={(e) => handleShapeParam("sideA", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-bold mb-2">Parallel Side B ({uLen})</label><input type="number" value={shapeParams.sideB} onChange={(e) => handleShapeParam("sideB", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-bold mb-2">Height distance ({uLen})</label><input type="number" value={shapeParams.height} onChange={(e) => handleShapeParam("height", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                  </>
                )}
                {shapeType === "polygon" && (
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold mb-2">Polygon Coordinates (x,y in {uLen})</label>
                    <div className="space-y-2">
                      {polygonCoords.map((coord, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="number" value={coord.x} onChange={(e) => { const newC = [...polygonCoords]; newC[idx].x = +e.target.value; setPolygonCoords(newC); }} className="w-1/2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" placeholder="X" />
                          <input type="number" value={coord.y} onChange={(e) => { const newC = [...polygonCoords]; newC[idx].y = +e.target.value; setPolygonCoords(newC); }} className="w-1/2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" placeholder="Y" />
                          <button onClick={() => setPolygonCoords(polygonCoords.filter((_, i) => i !== idx))} className="px-3 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-xl font-bold"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => setPolygonCoords([...polygonCoords, { x: 0, y: 0 }])} className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl mt-2 flex justify-center items-center gap-2 border border-indigo-200 dark:border-indigo-800"><Plus className="w-4 h-4" /> Add Vertex</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PLOT MEASUREMENT */}
          {activeTab === "plot" && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-[24px] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                <MapIcon className="w-5 h-5 text-emerald-500" /> Calculate Irregular Plot Area Using Geometric Triangulation
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                Calculates the exact area of irregular plots by dividing them into two triangles with a measured diagonal.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div><label className="block text-xs font-bold uppercase mb-2">North Side ({uLen})</label><input type="number" value={plotBounds.n} onChange={(e) => setPlotBounds({ ...plotBounds, n: +e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white focus:ring-emerald-500" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2">South Side ({uLen})</label><input type="number" value={plotBounds.s} onChange={(e) => setPlotBounds({ ...plotBounds, s: +e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white focus:ring-emerald-500" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2">East Side ({uLen})</label><input type="number" value={plotBounds.e} onChange={(e) => setPlotBounds({ ...plotBounds, e: +e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white focus:ring-emerald-500" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2">West Side ({uLen})</label><input type="number" value={plotBounds.w} onChange={(e) => setPlotBounds({ ...plotBounds, w: +e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white focus:ring-emerald-500" /></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold uppercase mb-2 text-indigo-500 dark:text-indigo-400">Diagonal NW-SE ({uLen})</label><input type="number" value={plotBounds.d} onChange={(e) => setPlotBounds({ ...plotBounds, d: +e.target.value })} className="w-full px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 rounded-[16px] text-indigo-900 dark:text-indigo-100 focus:ring-indigo-500" /></div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTY RERA */}
          {activeTab === "property" && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-[24px] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                <Home className="w-5 h-5 text-purple-500" /> RERA Carpet Area Calculator (NBC/RERA Compliant)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-2">Net Carpet Area ({uArea})</label><input type="number" value={propParams.carpetReq} onChange={(e) => handlePropParam("carpetReq", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Internal Partition Walls (%)</label><input type="number" value={propParams.internalWallsPerc} onChange={(e) => handlePropParam("internalWallsPerc", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">External Walls (%)</label><input type="number" value={propParams.externalWallsPerc} onChange={(e) => handlePropParam("externalWallsPerc", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Balcony/Terrace ({uArea})</label><input type="number" value={propParams.balconyArea} onChange={(e) => handlePropParam("balconyArea", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Common Spaces Share (%)</label><input type="number" value={propParams.commonAreaPerc} onChange={(e) => handlePropParam("commonAreaPerc", +e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
              </div>
            </div>
          )}

          {/* TAB 4: PLASTER DEDUCTIONS */}
          {activeTab === "plaster" && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-[24px] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                <PaintBucket className="w-5 h-5 text-rose-500" /> IS Code Opening Deductions for Accurate Net Area
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div><label className="block text-sm font-bold mb-2">Wall Length ({uLen})</label><input type="number" value={wallLen} onChange={(e) => setWallLen(+e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Wall Height ({uLen})</label><input type="number" value={wallHt} onChange={(e) => setWallHt(+e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div className="col-span-2 md:col-span-1 flex flex-col justify-center">
                  <label className="block text-sm font-bold mb-2">Faces Plastered</label>
                  <select value={bothFaces ? "2" : "1"} onChange={(e) => setBothFaces(e.target.value === "2")} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500">
                    <option value="1">Single Face</option>
                    <option value="2">Both Faces</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Jamb Depth ({uLen}) <span className="font-normal text-slate-500">(For large openings {'>3'}sq.m)</span></label>
                <input type="number" value={jambDepth} onChange={(e) => setJambDepth(+e.target.value)} className="w-full md:w-1/3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" />
              </div>

              <hr className="my-6 border-slate-200 dark:border-slate-800/50" />
              
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">Openings (Doors / Windows)</h4>
              <div className="space-y-3">
                {openings.map((op, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-end">
                    <div className="w-[45%] md:w-auto flex-1"><label className="block text-xs font-semibold mb-1 text-slate-500">Width ({uLen})</label><input type="number" value={op.w} onChange={(e) => { const newOp = [...openings]; newOp[idx].w = +e.target.value; setOpenings(newOp); }} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-rose-500" /></div>
                    <div className="w-[45%] md:w-auto flex-1"><label className="block text-xs font-semibold mb-1 text-slate-500">Height ({uLen})</label><input type="number" value={op.h} onChange={(e) => { const newOp = [...openings]; newOp[idx].h = +e.target.value; setOpenings(newOp); }} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-rose-500" /></div>
                    <div className="w-auto flex-1"><label className="block text-xs font-semibold mb-1 text-slate-500">Count</label><input type="number" value={op.count} onChange={(e) => { const newOp = [...openings]; newOp[idx].count = Math.max(1, parseInt(e.target.value) || 1); setOpenings(newOp); }} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-rose-500" /></div>
                    <button onClick={() => setOpenings(openings.filter((_, i) => i !== idx))} className="px-3 py-3 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-xl font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
                <button onClick={() => setOpenings([...openings, { w: 1, h: 2, count: 1 }])} className="w-full py-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl mt-2 flex justify-center items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition border border-rose-200 dark:border-rose-800/50"><Plus className="w-5 h-5" /> Add Opening</button>
              </div>
            </div>
          )}

          {/* TAB 5: ROOF PITCH */}
          {activeTab === "roof" && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-[24px] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                <Layers className="w-5 h-5 text-amber-500" /> Roof Pitch Area with Multi-Factor Correction
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-2">Horizontal Area ({uArea})</label><input type="number" value={roofParams.floorArea} onChange={(e) => setRoofParams({ ...roofParams, floorArea: +e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Roof Pitch Angle (°)</label><input type="number" value={roofParams.pitchAngle} onChange={(e) => setRoofParams({ ...roofParams, pitchAngle: +e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Roof Overhang ({uLen})</label><input type="number" value={roofParams.overhang} onChange={(e) => setRoofParams({ ...roofParams, overhang: +e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-2">Eaves Perimeter / Length ({uLen})</label><input type="number" value={roofParams.perimeterLength} onChange={(e) => setRoofParams({ ...roofParams, perimeterLength: +e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] text-slate-900 dark:text-white" /></div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL (RIGHT) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-8 rounded-[2rem] shadow-sm sticky top-6">
            <h3 className="font-semibold tabular-nums tracking-tight text-xl mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Calculation Results
            </h3>

            {activeTab === "shape" && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-[24px] border border-indigo-100 dark:border-indigo-800/30 shadow-sm text-indigo-900 dark:text-indigo-100">
                  <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Total Net Area</p>
                  <p className="text-4xl font-black tabular-nums tracking-tight">
                    {shapeData.area.toFixed(2)} <span className="text-xl font-medium opacity-60">{uArea}</span>
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-700/50 shadow-sm text-slate-800 dark:text-white">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Perimeter</p>
                  <p className="text-2xl font-semibold">
                    {shapeData.perimeter.toFixed(2)} <span className="text-base opacity-50">{uLen}</span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "plot" && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-[24px] border border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100 shadow-sm">
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Triangulated Land Area</p>
                  <p className="text-4xl font-black tabular-nums tracking-tight">
                    {Number.isNaN(boundsArea.total) ? "Invalid" : boundsArea.total.toFixed(2)} <span className="text-xl opacity-60 font-medium">{uArea}</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50 text-sm font-medium opacity-80 grid gap-2">
                    <p className="flex justify-between"><span>Sub-triangle 1 (North):</span> <span>{Number.isNaN(boundsArea.area1) ? "-" : boundsArea.area1.toFixed(2)} {uArea}</span></p>
                    <p className="flex justify-between"><span>Sub-triangle 2 (South):</span> <span>{Number.isNaN(boundsArea.area2) ? "-" : boundsArea.area2.toFixed(2)} {uArea}</span></p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-white shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Outer Perimeter</p>
                  <p className="text-2xl font-semibold">{boundsArea.perimeter.toFixed(2)} <span className="text-base opacity-50">{uLen}</span></p>
                </div>
              </div>
            )}

            {activeTab === "property" && (
              <div className="space-y-3">
                <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-[24px] border border-purple-100 dark:border-purple-800/30 mb-4 shadow-sm">
                  <p className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">RERA Carpet Area</p>
                  <p className="text-4xl font-black tabular-nums tracking-tight text-purple-700 dark:text-purple-300">
                    {propertyCalc.reraCarpetArea.toFixed(2)} <span className="text-xl font-medium opacity-60">{uArea}</span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-purple-200/50 dark:border-purple-800/50 text-xs text-purple-800 dark:text-purple-200/70 font-semibold leading-relaxed">
                    Legally defined space encompassing net usable area + internal partition walls (Excludes balconies/external walls).
                  </div>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-medium">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Trad. Carpet Area</span>
                  <span className="font-bold">{propertyCalc.traditionalCarpet.toFixed(2)} {uArea}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-medium">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex flex-col"><span>Plinth Area</span><span className="text-[10px] text-slate-400 dark:text-slate-500">IS 3861 bounds</span></span>
                  <span className="font-bold">{propertyCalc.plinthArea.toFixed(2)} {uArea}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-medium">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Built-Up Area</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{propertyCalc.builtUpArea.toFixed(2)} {uArea}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 text-slate-800 dark:text-white font-medium">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Super Built-Up</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{propertyCalc.superBuiltUpArea.toFixed(2)} {uArea}</span>
                </div>
              </div>
            )}

            {activeTab === "roof" && (
              <div className="space-y-4">
                <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-[24px] border border-amber-100 dark:border-amber-800/30 text-amber-900 dark:text-amber-100 shadow-sm">
                  <p className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">True Sloped Roof Area</p>
                  <p className="text-4xl font-black tabular-nums tracking-tight">
                    {roofCalc.trueRoofArea.toFixed(2)} <span className="text-xl opacity-60 font-medium">{uArea}</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/50 text-sm opacity-80 grid gap-2 font-medium">
                    <p className="flex justify-between"><span>Base + Overhangs:</span> <span>{roofCalc.totalHorizontalArea.toFixed(2)} {uArea}</span></p>
                    <p className="flex justify-between text-amber-600 dark:text-amber-400"><span>Pitch Multiplier (Secant):</span> <span>{(1 / Math.cos((roofParams.pitchAngle * Math.PI) / 180)).toFixed(3)}x</span></p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "plaster" && (
              <div className="space-y-4">
                <div className="p-5 bg-rose-50 dark:bg-rose-900/20 rounded-[24px] border border-rose-100 dark:border-rose-800/30 text-rose-900 dark:text-rose-100 shadow-sm">
                  <p className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">Net Plastering Area</p>
                  <p className="text-4xl font-black tabular-nums tracking-tight">
                    {plasterCalc.netArea.toFixed(2)} <span className="text-xl opacity-60 font-medium">{uArea}</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-rose-200/50 dark:border-rose-800/50 text-sm font-medium grid gap-2 text-rose-800/80 dark:text-rose-300/80">
                      <p className="flex justify-between"><span>Wall Gross Area:</span> <span>{plasterCalc.grossArea.toFixed(2)} {uArea}</span></p>
                      <p className="flex justify-between text-rose-600 dark:text-rose-400"><span>Opening Deductions:</span> <span>- {plasterCalc.totalDeduction.toFixed(2)} {uArea}</span></p>
                      <p className="flex justify-between"><span>Jambs Added:</span> <span>+ {plasterCalc.jambAddition.toFixed(2)} {uArea}</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA BOQ Banner */}
            <div className="mt-6 p-5 rounded-[20px] bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md text-white">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                📄 Turn this calculation into a full BOQ
              </h4>
              <p className="text-indigo-100 text-xs mb-4 leading-relaxed font-medium">
                Your area is ready. Generate material quantities and cost summary in 3 clicks.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="flex-1 px-4 py-2 bg-white text-indigo-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition duration-200 shadow-sm truncate">
                  Generate BOQ Now →
                </button>
                <button className="px-4 py-2 bg-indigo-600 border border-indigo-400 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center">
                  Save Result
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {activeTab === "plaster" && plasterCalc.steps.length > 0 && (
        <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-white">IS 1200 Deduction Proof</h3>
            <DetailedCalculationDisplay steps={plasterCalc.steps as any} />
        </div>
      )}

      {/* SEO SECTIONS */}
      <div className="mt-16 space-y-12">
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">How to Use the Plot Area Calculator</h2>
          <div className="text-slate-600 dark:text-slate-400 space-y-4">
            <p>1. <strong>Select your module:</strong> Choose between Triangulation, RERA Property Area, or Roof Pitch.</p>
            <p>2. <strong>Input dimensions:</strong> Enter values in your preferred unit system (Metric or Imperial) which can be set in the global settings.</p>
            <p>3. <strong>For Irregular Plots:</strong> Input all 4 edges and 1 diagonal length. The calculator uses geometric triangulation automatically.</p>
            <p>4. <strong>Review results:</strong> Instantly check Net Area, Built-Up calculations, and Deductions dynamically generated on the side panel.</p>
          </div>
        </section>

        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">How is an irregular plot calculated?</h3>
              <p className="text-slate-600 dark:text-slate-400">Irregular land is measured by breaking the polygon into adjacent triangles (Geometric Triangulation). By measuring the 4 boundaries and one diagonal cross-section, Heron's formula is applied to each triangle for perfect accuracy.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">What is RERA Carpet Area?</h3>
              <p className="text-slate-600 dark:text-slate-400">According to the Real Estate (Regulation and Development) Act (RERA), the carpet area is the net usable floor area of an apartment, excluding external walls, balconies, terraces, and service shafts, but including the area covered by internal partition walls.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">How does the Roof Pitch Multiplier work?</h3>
              <p className="text-slate-600 dark:text-slate-400">A sloped roof has a larger surface area than its horizontal footprint. The calculator divides the horizontal area (plus overhangs) by the cosine of the pitch angle to give the true sloped area required for roofing materials.</p>
            </div>
          </div>
        </section>

        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Methodology & Engineering Standards</h2>
          <div className="text-slate-600 dark:text-slate-400 space-y-4">
            <p>Our <strong>Plot Area Calculator</strong> strictly adheres to the following industry guidelines:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>IS 1200 (Part 1, 4, 12):</strong> Rules for deduction of openings in plastering and masonry work. For plastering, no deductions are made for openings under 0.5 sq.m.</li>
              <li><strong>IS 3861:</strong> Method of measurement for plinth, carpet, and rentable areas of buildings.</li>
              <li><strong>RERA / NBC:</strong> Standard matrix computation for deriving Carpet, Built-Up, and Super Built-Up areas based on proportional allocations of common spaces.</li>
              <li><strong>Geometric Surveying:</strong> Triangulation calculation based on Heron’s principle ensures 100% mathematical validity for non-orthogonal property boundaries.</li>
            </ul>
          </div>
        </section>
        <section className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Expert Reviewed</h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p><strong>Reviewed by:</strong> Civil Estimation Pro Engineering Team</p>
                <p><strong>Qualifications:</strong> B.Tech Civil Engineering · 8 years in QS practice</p>
                <p><strong>Last reviewed:</strong> June 2025</p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
