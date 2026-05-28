import React, { useState, useMemo } from "react";
import { MaterialSummary } from "../ui/MaterialSummary";
import {
  Square,
  Triangle,
  Circle,
  Layers,
  Ruler,
  Map as MapIcon,
  Home,
  Compass,
  RectangleHorizontal,
  Hexagon,
  Type,
  CornerDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";
import { CalculationHistory } from "../ui/CalculationHistory";
import { UniversalTabs } from "../ui/UniversalTabs";

export default function AreaSpaceCalculator() {
  const [activeTab, setActiveTab] = useState<
    "shape" | "property" | "plot" | "roof"
  >("shape");

  // --- Tab 1: Shape Calculator ---
  const [shapeType, setShapeType] = useState("rectangle");
  const [shapeParams, setShapeParams] = useState<Record<string, number>>({
    length: 5,
    width: 4,
    radius: 3,
    base: 4,
    height: 3,
    sideA: 5,
    sideB: 7,
    sideC: 4,
    l1: 5,
    l2: 3,
    w1: 2,
    w2: 2,
    tTop: 6,
    tLegWidth: 2,
    tTotalHeight: 5,
    tTopThickness: 1,
  });
  const [polygonCoords, setPolygonCoords] = useState<
    { x: number; y: number }[]
  >([
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 4 },
    { x: 1, y: 3 },
  ]);

  const handleShapeParam = (key: string, val: number) =>
    setShapeParams((prev) => ({ ...prev, [key]: val }));

  const calculateShape = () => {
    let area = 0,
      perimeter = 0;
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
        // using Heron's for perimeter, but input only has base and height... let's just do an equilateral approx for perimeter if side not given,
        // wait, we can just ask for sideA, sideB, sideC for triangle area.
        {
          const s = (p.sideA + p.sideB + p.sideC) / 2;
          area = Math.sqrt(
            Math.max(0, s * (s - p.sideA) * (s - p.sideB) * (s - p.sideC)),
          );
          perimeter = p.sideA + p.sideB + p.sideC;
        }
        break;
      case "trapezoid": // Needs parallel sidea, sideb, height, and we don't have other sides so we estimate perimeter
        area = ((p.sideA + p.sideB) / 2) * p.height;
        // Approximation for perimeter if it's an isosceles trapezoid
        const leg = Math.sqrt(
          Math.pow(Math.abs(p.sideB - p.sideA) / 2, 2) + Math.pow(p.height, 2),
        );
        perimeter = p.sideA + p.sideB + 2 * leg;
        break;
      case "l-shape":
        // L shape made of two rects: vertical and horizontal
        area = p.l1 * p.w1 + (p.l2 - p.w1) * p.w2;
        perimeter = 2 * p.l1 + 2 * p.l2;
        break;
      case "t-shape":
        // T shape
        area =
          p.tTop * p.tTopThickness +
          (p.tTotalHeight - p.tTopThickness) * p.tLegWidth;
        perimeter = 2 * p.tTop + 2 * p.tTotalHeight;
        break;
      case "polygon":
        let sum = 0;
        let perim = 0;
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
    carpetReq: 100, // sqm
    internalWallsPerc: 10,
    externalWallsPerc: 5,
    balconyArea: 10,
    commonAreaPerc: 20,
  });

  const handlePropParam = (key: string, val: number) =>
    setPropParams((prev) => ({ ...prev, [key]: val }));

  const propertyCalc = useMemo(() => {
    const traditionalCarpet = propParams.carpetReq;
    // RERA carpet area: Net usable floor area + internal partition walls. (Excludes external walls, balconies, terraces)
    const reraCarpetArea =
      traditionalCarpet +
      traditionalCarpet * (propParams.internalWallsPerc / 100);
    const plinthArea =
      reraCarpetArea + traditionalCarpet * (propParams.externalWallsPerc / 100); // Plinth Area / Built-up area
    const builtUpArea = plinthArea + propParams.balconyArea; // Built up adds balconies
    const superBuiltUpArea =
      builtUpArea + builtUpArea * (propParams.commonAreaPerc / 100);

    return {
      traditionalCarpet,
      reraCarpetArea,
      plinthArea,
      builtUpArea,
      superBuiltUpArea,
    };
  }, [propParams]);

  // --- Tab 3: Plot Measurement ---
  const [plotMethod, setPlotMethod] = useState<"boundaries" | "coordinates">(
    "boundaries",
  );
  const [plotBounds, setPlotBounds] = useState({
    n: 30,
    s: 30,
    e: 40,
    w: 40,
    d: 50,
  }); // d = diagonal (NW to SE)

  const boundsArea = useMemo(() => {
    const { n, s, e, w, d } = plotBounds;
    // Two triangles: (n, e, d) and (s, w, d). Wait, if N is top, E is right, S is bottom, W is left.
    // Diagonal NW to SE divides it into Triangle 1 (N, E, d) and Triangle 2 (S, W, d)
    const s1 = (n + e + d) / 2;
    const area1 = Math.sqrt(Math.max(0, s1 * (s1 - n) * (s1 - e) * (s1 - d)));
    const s2 = (s + w + d) / 2;
    const area2 = Math.sqrt(Math.max(0, s2 * (s2 - s) * (s2 - w) * (s2 - d)));
    return { area1, area2, total: area1 + area2, perimeter: n + s + e + w };
  }, [plotBounds]);

  // --- Tab 4: Roof Area ---
  const [roofParams, setRoofParams] = useState({
    floorArea: 150,
    pitchAngle: 30, // degrees
    overhang: 0.6,
    perimeterLength: 50,
  });

  const roofCalc = useMemo(() => {
    // True area = (Floor Area + overhang area) / cos(pitch)
    const overhangArea = roofParams.perimeterLength * roofParams.overhang;
    const totalHorizontalArea = roofParams.floorArea + overhangArea;
    const pitchRad = (roofParams.pitchAngle * Math.PI) / 180;
    const trueRoofArea = totalHorizontalArea / Math.cos(pitchRad);

    // Material Qty (e.g. shingles)
    const shinglesWastage = 1.1; // 10% wastage
    const trueMaterialArea = trueRoofArea * shinglesWastage;

    return { totalHorizontalArea, trueRoofArea, trueMaterialArea };
  }, [roofParams]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-[120px]">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Ruler className="w-8 h-8" />
          </div>
          Area & Space Calculator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Calculate dimensional areas, RERA compliant property spaces, plot
          measurements, and roof material planning.
        </p>
      </div>

      {/* TABS */}
      <div className="-mx-4 px-4 pb-4 md:mx-0 md:px-0">
        <UniversalTabs
          tabs={[
            {
              id: "shape",
              label: "Shape Calculator",
              icon: <Square className="w-5 h-5" />,
            },
            {
              id: "property",
              label: "Property Area Rates",
              icon: <Home className="w-5 h-5" />,
            },
            {
              id: "plot",
              label: "Plot Measurement",
              icon: <MapIcon className="w-5 h-5" />,
            },
            {
              id: "roof",
              label: "Roof / Pitch Multiplier",
              icon: <Layers className="w-5 h-5" />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: SHAPES */}
          {activeTab === "shape" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Square className="w-5 h-5 text-indigo-500" /> 2D Shape
                Calculator
              </h3>
              <div className="mb-6 -mx-6 px-6 md:mx-0 md:px-0">
                <UniversalTabs
                  tabs={[
                    {
                      id: "rectangle",
                      label: "Rectangle",
                      icon: <RectangleHorizontal className="w-4 h-4" />,
                    },
                    {
                      id: "square",
                      label: "Square",
                      icon: <Square className="w-4 h-4" />,
                    },
                    {
                      id: "triangle",
                      label: "Triangle",
                      icon: <Triangle className="w-4 h-4" />,
                    },
                    {
                      id: "circle",
                      label: "Circle",
                      icon: <Circle className="w-4 h-4" />,
                    },
                    {
                      id: "trapezoid",
                      label: "Trapezoid",
                      icon: <Layers className="w-4 h-4" />,
                    },
                    {
                      id: "l-shape",
                      label: "L-Shape",
                      icon: <CornerDownRight className="w-4 h-4" />,
                    },
                    {
                      id: "t-shape",
                      label: "T-Shape",
                      icon: <Type className="w-4 h-4" />,
                    },
                    {
                      id: "polygon",
                      label: "Polygon",
                      icon: <Hexagon className="w-4 h-4" />,
                    },
                  ]}
                  activeTab={shapeType}
                  onTabChange={(id) => setShapeType(id)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {shapeType === "rectangle" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Length
                      </label>
                      <input
                        type="number"
                        value={shapeParams.length}
                        onChange={(e) =>
                          handleShapeParam("length", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        value={shapeParams.width}
                        onChange={(e) =>
                          handleShapeParam("width", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </>
                )}
                {shapeType === "square" && (
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Side Length
                    </label>
                    <input
                      type="number"
                      value={shapeParams.length}
                      onChange={(e) =>
                        handleShapeParam("length", +e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                )}
                {shapeType === "circle" && (
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Radius
                    </label>
                    <input
                      type="number"
                      value={shapeParams.radius}
                      onChange={(e) =>
                        handleShapeParam("radius", +e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                )}
                {shapeType === "triangle" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Side A
                      </label>
                      <input
                        type="number"
                        value={shapeParams.sideA}
                        onChange={(e) =>
                          handleShapeParam("sideA", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Side B
                      </label>
                      <input
                        type="number"
                        value={shapeParams.sideB}
                        onChange={(e) =>
                          handleShapeParam("sideB", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Side C
                      </label>
                      <input
                        type="number"
                        value={shapeParams.sideC}
                        onChange={(e) =>
                          handleShapeParam("sideC", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </>
                )}
                {shapeType === "trapezoid" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Base A
                      </label>
                      <input
                        type="number"
                        value={shapeParams.sideA}
                        onChange={(e) =>
                          handleShapeParam("sideA", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Base B
                      </label>
                      <input
                        type="number"
                        value={shapeParams.sideB}
                        onChange={(e) =>
                          handleShapeParam("sideB", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        value={shapeParams.height}
                        onChange={(e) =>
                          handleShapeParam("height", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </>
                )}
                {shapeType === "l-shape" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Overall Length (L1)
                      </label>
                      <input
                        type="number"
                        value={shapeParams.l1}
                        onChange={(e) =>
                          handleShapeParam("l1", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Overall Width (L2)
                      </label>
                      <input
                        type="number"
                        value={shapeParams.l2}
                        onChange={(e) =>
                          handleShapeParam("l2", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Thickness 1 (W1)
                      </label>
                      <input
                        type="number"
                        value={shapeParams.w1}
                        onChange={(e) =>
                          handleShapeParam("w1", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Thickness 2 (W2)
                      </label>
                      <input
                        type="number"
                        value={shapeParams.w2}
                        onChange={(e) =>
                          handleShapeParam("w2", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </>
                )}
                {shapeType === "t-shape" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Top Flange Width
                      </label>
                      <input
                        type="number"
                        value={shapeParams.tTop}
                        onChange={(e) =>
                          handleShapeParam("tTop", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Top Flange Thickness
                      </label>
                      <input
                        type="number"
                        value={shapeParams.tTopThickness}
                        onChange={(e) =>
                          handleShapeParam("tTopThickness", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Total Height
                      </label>
                      <input
                        type="number"
                        value={shapeParams.tTotalHeight}
                        onChange={(e) =>
                          handleShapeParam("tTotalHeight", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Web Thickness
                      </label>
                      <input
                        type="number"
                        value={shapeParams.tLegWidth}
                        onChange={(e) =>
                          handleShapeParam("tLegWidth", +e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </>
                )}
              </div>

              {shapeType === "polygon" && (
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">
                    Coordinates (x,y)
                  </label>
                  <div className="space-y-2">
                    {polygonCoords.map((coord, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="number"
                          value={coord.x}
                          onChange={(e) => {
                            const newC = [...polygonCoords];
                            newC[idx].x = +e.target.value;
                            setPolygonCoords(newC);
                          }}
                          className="w-1/2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          placeholder="X"
                        />
                        <input
                          type="number"
                          value={coord.y}
                          onChange={(e) => {
                            const newC = [...polygonCoords];
                            newC[idx].y = +e.target.value;
                            setPolygonCoords(newC);
                          }}
                          className="w-1/2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          placeholder="Y"
                        />
                        <button
                          onClick={() =>
                            setPolygonCoords(
                              polygonCoords.filter((_, i) => i !== idx),
                            )
                          }
                          className="px-3 bg-rose-50 text-rose-500 rounded-xl font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setPolygonCoords([...polygonCoords, { x: 0, y: 0 }])
                      }
                      className="w-full py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl mt-2"
                    >
                      + Add Vertex
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Shoelace formula requires vertices to be entered
                    sequentially (clockwise or counter-clockwise).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROPERTY AREA */}
          {activeTab === "property" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-500" /> Property Area
                Metrics & RERA
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-6">
                Definitions as per IS 3861:1975 and RERA 2016 Act (Sec 2(k)).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Net Usable / Clean Carpet Area (m²)
                  </label>
                  <input
                    type="number"
                    value={propParams.carpetReq}
                    onChange={(e) =>
                      handlePropParam("carpetReq", +e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Internal Partition Walls (%)
                  </label>
                  <input
                    type="number"
                    value={propParams.internalWallsPerc}
                    onChange={(e) =>
                      handlePropParam("internalWallsPerc", +e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    External Walls (%)
                  </label>
                  <input
                    type="number"
                    value={propParams.externalWallsPerc}
                    onChange={(e) =>
                      handlePropParam("externalWallsPerc", +e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Balcony / Terrace Area (m²)
                  </label>
                  <input
                    type="number"
                    value={propParams.balconyArea}
                    onChange={(e) =>
                      handlePropParam("balconyArea", +e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Common Spaces Share (%)
                  </label>
                  <input
                    type="number"
                    value={propParams.commonAreaPerc}
                    onChange={(e) =>
                      handlePropParam("commonAreaPerc", +e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-8 p-5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-2xl">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
                  RERA Carpet Area vs Traditional
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-400">
                  RERA 2016 defines "carpet area" to include the area covered by
                  internal partition walls but explicitly excludes external
                  walls, services shafts, exclusive balconies, and terraces.
                  Traditional carpet area often strictly meant wall-to-wall
                  inner dimensions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PLOT MEASUREMENT */}
          {activeTab === "plot" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-emerald-500" /> Plot & Land
                  Measurement
                </h3>
                <select
                  value={plotMethod}
                  onChange={(e) =>
                    setPlotMethod(
                      e.target.value as "boundaries" | "coordinates",
                    )
                  }
                  className="text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg font-bold"
                >
                  <option value="boundaries">Boundary Sides</option>
                  <option value="coordinates">Coordinates</option>
                </select>
              </div>

              {plotMethod === "boundaries" ? (
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-6">
                    Irregular quadrilateral plots are best calculated by
                    breaking them into two triangles using a diagonal. Ensure
                    all lengths are consistent units.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">
                        North Side
                      </label>
                      <input
                        type="number"
                        value={plotBounds.n}
                        onChange={(e) =>
                          setPlotBounds({ ...plotBounds, n: +e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">
                        South Side
                      </label>
                      <input
                        type="number"
                        value={plotBounds.s}
                        onChange={(e) =>
                          setPlotBounds({ ...plotBounds, s: +e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">
                        East Side
                      </label>
                      <input
                        type="number"
                        value={plotBounds.e}
                        onChange={(e) =>
                          setPlotBounds({ ...plotBounds, e: +e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2">
                        West Side
                      </label>
                      <input
                        type="number"
                        value={plotBounds.w}
                        onChange={(e) =>
                          setPlotBounds({ ...plotBounds, w: +e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-indigo-500">
                        Diagonal (NW to SE)
                      </label>
                      <input
                        type="number"
                        value={plotBounds.d}
                        onChange={(e) =>
                          setPlotBounds({ ...plotBounds, d: +e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                  <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-500">
                    Coordinate Input Selected
                  </p>
                  <button
                    onClick={() => {
                      setPlotMethod("boundaries");
                      setActiveTab("shape");
                      setShapeType("polygon");
                    }}
                    className="mt-3 text-sm font-bold text-indigo-500 underline"
                  >
                    Switch to Shape &gt; Polygon Tool
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ROOF PITCH */}
          {activeTab === "roof" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Triangle className="w-5 h-5 text-amber-500" /> Roof Area &
                Pitch Calculator
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-6">
                Converts a horizontal 2D footprint into true sloped surface area
                for material ordering.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Horizontal Floor Plan Area (m²)
                  </label>
                  <input
                    type="number"
                    value={roofParams.floorArea}
                    onChange={(e) =>
                      setRoofParams({
                        ...roofParams,
                        floorArea: +e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Roof Pitch Angle (°)
                  </label>
                  <input
                    type="number"
                    value={roofParams.pitchAngle}
                    onChange={(e) =>
                      setRoofParams({
                        ...roofParams,
                        pitchAngle: +e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Roof Overhang (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={roofParams.overhang}
                    onChange={(e) =>
                      setRoofParams({
                        ...roofParams,
                        overhang: +e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Building Perimeter / Eaves Length (m)
                  </label>
                  <input
                    type="number"
                    value={roofParams.perimeterLength}
                    onChange={(e) =>
                      setRoofParams({
                        ...roofParams,
                        perimeterLength: +e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-amber-800/50 flex items-center justify-center font-black text-amber-500 text-xl border-2 border-amber-200 dark:border-amber-700/50 shrink-0">
                  {Math.ceil(
                    (1 / Math.cos((roofParams.pitchAngle * Math.PI) / 180)) *
                      100,
                  ) / 100}
                  x
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-300">
                    Pitch Multiplier (Secant)
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Multiply the horizontal area by this factor to find the
                    sloped area automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL (RIGHT) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800 dark:bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl sticky top-6">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Calculation Results
            </h3>

            {activeTab === "shape" && (
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    Total Net Area
                  </p>
                  <p className="text-3xl font-black">
                    {shapeData.area.toFixed(2)}{" "}
                    <span className="text-lg opacity-50">sq units</span>
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    Perimeter
                  </p>
                  <p className="text-xl font-bold">
                    {shapeData.perimeter.toFixed(2)}{" "}
                    <span className="text-sm opacity-50">linear units</span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "property" && (
              <div className="space-y-3">
                <div className="p-4 bg-white/10 rounded-2xl mb-2">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    RERA Carpet Area
                  </p>
                  <p className="text-2xl font-black text-purple-300">
                    {propertyCalc.reraCarpetArea.toFixed(2)}{" "}
                    <span className="text-sm opacity-50">m²</span>
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    Net Usable + Internal Walls
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-white/70">
                    Trad. Carpet Area
                  </span>
                  <span className="font-bold">
                    {propertyCalc.traditionalCarpet.toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-white/70 flex flex-col">
                    <span>Plinth Area</span>
                    <span className="text-[10px] text-white/40">(IS 3861)</span>
                  </span>
                  <span className="font-bold">
                    {propertyCalc.plinthArea.toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-white/70">Built-Up Area</span>
                  <span className="font-bold text-sky-300">
                    {propertyCalc.builtUpArea.toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-white/70">Super Built-Up</span>
                  <span className="font-bold text-emerald-300">
                    {propertyCalc.superBuiltUpArea.toFixed(2)} m²
                  </span>
                </div>
              </div>
            )}

            {activeTab === "plot" && plotMethod === "boundaries" && (
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    Total Land Area
                  </p>
                  <p className="text-3xl font-black text-emerald-400">
                    {Number.isNaN(boundsArea.total)
                      ? "Invalid"
                      : boundsArea.total.toFixed(2)}{" "}
                    <span className="text-lg opacity-50">sq units</span>
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    North Triangle:{" "}
                    {Number.isNaN(boundsArea.area1)
                      ? "N/A"
                      : boundsArea.area1.toFixed(1)}{" "}
                    <br /> South Triangle:{" "}
                    {Number.isNaN(boundsArea.area2)
                      ? "N/A"
                      : boundsArea.area2.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    Plot Perimeter
                  </p>
                  <p className="text-xl font-bold">
                    {boundsArea.perimeter.toFixed(2)}{" "}
                    <span className="text-sm opacity-50">units</span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "roof" && (
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    True Sloped Area
                  </p>
                  <p className="text-3xl font-black text-amber-400">
                    {roofCalc.trueRoofArea.toFixed(2)}{" "}
                    <span className="text-lg opacity-50">m²</span>
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    Includes eave overhangs
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center justify-between mb-1">
                    Calculated Mat. Qty{" "}
                    <span className="py-0.5 px-2 bg-rose-500/20 text-rose-300 rounded font-bold text-[10px]">
                      +10% Waste
                    </span>
                  </p>
                  <p className="text-xl font-bold">
                    {roofCalc.trueMaterialArea.toFixed(2)}{" "}
                    <span className="text-sm opacity-50">m²</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CalculationHistory
        calculatorId="areaspacecalculator_tool"
        currentInputs={{}}
      />
    </div>
  );
}
