import React, { useState } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { Route, Calculator, Layers, Droplets, ArrowRight } from "lucide-react";

import { useSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { SEO } from "../SEO";

const roadSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Flexible Pavement Estimator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "WebBrowser",
  "description": "Calculate materials, volumes, and costs for flexible pavement layer by layer including Subgrade, Sub-base, WBM, and Asphalt.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function RoadEstimator() {
  const { settings, formatCurrency } = useSettings();
  const isPKR = settings.currency === "PKR";
  const [length, setLength] = useState<string>("1000");
  /* meters */ const [width, setWidth] = useState<string>("7.5");
  /* meters */ const [camber, setCamber] = useState<string>("2.5");
  /* % */ const [shoulderWidth, setShoulderWidth] = useState<string>("1.5");
  /* meters */ const [shoulderFall, setShoulderFall] = useState<string>("3.0");
  /* % */ const [sideSlope, setSideSlope] = useState<string>("1.5");
  /* H:1V */ const [sgThickness, setSgThickness] = useState<string>("500");
  /* mm */ const [sbThickness, setSbThickness] = useState<string>("300");
  /* mm */ const [wbmThickness, setWbmThickness] = useState<string>("200");
  /* mm */ const [asphaltThickness, setAsphaltThickness] =
    useState<string>("50");
  /* mm */ const [primeRateInput, setPrimeRateInput] = useState<string>("1.0");
  /* Liters/m² */ const [tackRateInput, setTackRateInput] =
    useState<string>("0.25");
  /* Liters/m² */ const [rateSg, setRateSg] = useState<string>("");
  /* per m3 */ const [rateSb, setRateSb] = useState<string>("");
  /* per m3 */ const [rateWbm, setRateWbm] = useState<string>("");
  /* per m3 */ const [rateAsp, setRateAsp] = useState<string>("");
  /* per ton */ const [ratePrime, setRatePrime] = useState<string>("");
  /* per ton */ const [rateTack, setRateTack] = useState<string>("");
  /* per ton */ const [asphaltDensity, setAsphaltDensity] =
    useState<string>("2.3");
  /* tons/m3 */ const [bitumenSG, setBitumenSG] = useState<string>("1.01");
  /* specific gravity */ const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const c = parseFloat(camber) || 0;
  const shW = parseFloat(shoulderWidth) || 0;
  const shF = parseFloat(shoulderFall) || 0;
  const s = parseFloat(sideSlope) || 0;
  const sgT = parseFloat(sgThickness) || 0;
  const sbT = parseFloat(sbThickness) || 0;
  const wbmT = parseFloat(wbmThickness) || 0;
  const aspT = parseFloat(asphaltThickness) || 0;
  /* Cross-slope camber calculations */ const halfCarriage = w / 2;
  const riseAtCenter = halfCarriage * (c / 100);
  const slantCarriage = Math.sqrt(
    halfCarriage * halfCarriage + riseAtCenter * riseAtCenter,
  );
  const dropAtShoulder = shW * (shF / 100);
  const slantShoulder = Math.sqrt(shW * shW + dropAtShoulder * dropAtShoulder);
  const actualSurfaceWidth = (slantCarriage + slantShoulder) * 2;
  /* Trapezoidal cross-section calculations considering side slope extending outwards */ const tA_m =
    aspT / 1000;
  const tW_m = wbmT / 1000;
  const tSB_m = sbT / 1000;
  const tSG_m = sgT / 1000;
  /* Top/Bottom widths of each layer using side slope s = H/V // Note: V component is thickness so H = s * V */ const wAspTop =
    w + 2 * shW;
  const wAspBot = wAspTop + 2 * s * tA_m;
  const wWbmTop = wAspBot;
  const wWbmBot = wWbmTop + 2 * s * tW_m;
  const wSbTop = wWbmBot;
  const wSbBot = wSbTop + 2 * s * tSB_m;
  const wSgTop = wSbBot;
  const wSgBot = wSgTop + 2 * s * tSG_m;
  /* Cross-sectional Areas strictly following typical trapezoidal calculation: V = ((W_top + W_bot) / 2) * t * L */ const areaAsp =
    ((wAspTop + wAspBot) / 2) * tA_m;
  const areaWbm = ((wWbmTop + wWbmBot) / 2) * tW_m;
  const areaSb = ((wSbTop + wSbBot) / 2) * tSB_m;
  const areaSg = ((wSgTop + wSgBot) / 2) * tSG_m;
  /* Volumes in cubic meters (m³) */ const volSG = areaSg * l;
  const volSB = areaSb * l;
  const volWBM = areaWbm * l;
  const volAsphalt = areaAsp * l;
  const asphaltTons = volAsphalt * (parseFloat(asphaltDensity) || 0);
  /* Granular Material Breakdown */ const wbmShrinkage = 1.3;
  const sbShrinkage = 1.3;
  const wbmLooseVol = volWBM * wbmShrinkage;
  const wbmCoarseVol = wbmLooseVol * 0.8;
  const wbmScreeningVol = wbmLooseVol * 0.15;
  const wbmBindingVol = wbmLooseVol * 0.05;
  const sbLooseVol = volSB * sbShrinkage;
  /* Converting to metric tons // Assumption: density in loose state -> Coarse(1.6), Screening(1.5), Binding(1.6), Sub-Base / GSB(1.6) */ const wbmCoarseTons =
    wbmCoarseVol * 1.6;
  const wbmScreeningTons = wbmScreeningVol * 1.5;
  const wbmBindingTons = wbmBindingVol * 1.6;
  const sbMaterialTons = sbLooseVol * 1.6;
  /* Coats in Liters (Typical rates approximation) */ const primeCoatRate =
    parseFloat(primeRateInput) || 0;
  const tackCoatRate = parseFloat(tackRateInput) || 0;
  const primeCoatArea = wWbmTop * l;
  const primeCoatVolume = primeCoatArea * primeCoatRate;
  const tackCoatVolume = actualSurfaceWidth * l * tackCoatRate;
  /* Convert Bitumen to Metric Tons (Liters to kg -> /1000) */ const primeCoatTons =
    (primeCoatVolume * (parseFloat(bitumenSG) || 0)) / 1000;
  const tackCoatTons = (tackCoatVolume * (parseFloat(bitumenSG) || 0)) / 1000;
  /* Costs */ const costSg = volSG * (parseFloat(rateSg) || 0);
  const costSb = volSB * (parseFloat(rateSb) || 0);
  const costWbm = volWBM * (parseFloat(rateWbm) || 0);
  const costAsp = asphaltTons * (parseFloat(rateAsp) || 0);
  const costPrime = primeCoatTons * (parseFloat(ratePrime) || 0);
  const costTack = tackCoatTons * (parseFloat(rateTack) || 0);
  const totalCost = costSg + costSb + costWbm + costAsp + costPrime + costTack;
  /* Visual dimensions */ const svgTotalHeight = 300;
  const fixedMinHeight = 25;
  /* minimum visual height per layer to show text // Calculate relative heights */ const hSG =
    Math.max(fixedMinHeight, sgT * 0.2);
  const hSB = Math.max(fixedMinHeight, sbT * 0.2);
  const hWBM = Math.max(fixedMinHeight, wbmT * 0.2);
  const hAsp = Math.max(fixedMinHeight, aspT * 0.2);
  /* Normalize heights to fit nicely in 200px max total layer thickness space if they get too big */ const currentTotal =
    hSG + hSB + hWBM + hAsp;
  const scaleRatio = currentTotal > 200 ? 200 / currentTotal : 1;
  const vSG = hSG * scaleRatio;
  const vSB = hSB * scaleRatio;
  const vWBM = hWBM * scaleRatio;
  const vAsp = hAsp * scaleRatio;
  /* Visual Camber formulation */ const visualCamberDrop = Math.min(
    30,
    Math.max(0, c * 5),
  );
  const visualShoulderDrop = Math.min(20, Math.max(0, shF * 3));
  /* Coordinates */ const y0_C = 40;
  const y0_Carriage = y0_C + visualCamberDrop;
  const y0_S = y0_Carriage + visualShoulderDrop;
  const y1_C = y0_C + vAsp;
  const y1_Carriage = y0_Carriage + vAsp;
  const y1_S = y0_S + vAsp;
  const y2_C = y1_C + vWBM;
  const y2_Carriage = y1_Carriage + vWBM;
  const y2_S = y1_S + vWBM;
  const y3_C = y2_C + vSB;
  const y3_Carriage = y2_Carriage + vSB;
  const y3_S = y2_S + vSB;
  const y4_C = y3_C + vSG;
  const y4_Carriage = y3_Carriage + vSG;
  const y4_S = y3_S + vSG;
  /* Visual Width Mapping */ const maxModelWidth = Math.max(wSgBot, 1);
  const visualScaleX = 800 / maxModelWidth;
  const dxCarriageway = (w * visualScaleX) / 2;
  const dxAspTop = (wAspTop * visualScaleX) / 2;
  const dxAspBot = (wAspBot * visualScaleX) / 2;
  const dxWbmBot = (wWbmBot * visualScaleX) / 2;
  const dxSbBot = (wSbBot * visualScaleX) / 2;
  const dxSgBot = (wSgBot * visualScaleX) / 2;
  /* Path formulations */ const pathAsp = `M ${500 - dxAspTop},${y0_S} L ${500 - dxCarriageway},${y0_Carriage} L 500,${y0_C} L ${500 + dxCarriageway},${y0_Carriage} L ${500 + dxAspTop},${y0_S} L ${500 + dxAspBot},${y1_S} L ${500 + dxCarriageway},${y1_Carriage} L 500,${y1_C} L ${500 - dxCarriageway},${y1_Carriage} L ${500 - dxAspBot},${y1_S} Z`;
  const pathWbm = `M ${500 - dxAspBot},${y1_S} L ${500 - dxCarriageway},${y1_Carriage} L 500,${y1_C} L ${500 + dxCarriageway},${y1_Carriage} L ${500 + dxAspBot},${y1_S} L ${500 + dxWbmBot},${y2_S} L ${500 + dxCarriageway},${y2_Carriage} L 500,${y2_C} L ${500 - dxCarriageway},${y2_Carriage} L ${500 - dxWbmBot},${y2_S} Z`;
  const pathSb = `M ${500 - dxWbmBot},${y2_S} L ${500 - dxCarriageway},${y2_Carriage} L 500,${y2_C} L ${500 + dxCarriageway},${y2_Carriage} L ${500 + dxWbmBot},${y2_S} L ${500 + dxSbBot},${y3_S} L ${500 + dxCarriageway},${y3_Carriage} L 500,${y3_C} L ${500 - dxCarriageway},${y3_Carriage} L ${500 - dxSbBot},${y3_S} Z`;
  const pathSg = `M ${500 - dxSbBot},${y3_S} L ${500 - dxCarriageway},${y3_Carriage} L 500,${y3_C} L ${500 + dxCarriageway},${y3_Carriage} L ${500 + dxSbBot},${y3_S} L ${500 + dxSgBot},${y4_S} L ${500 + dxCarriageway},${y4_Carriage} L 500,${y4_C} L ${500 - dxCarriageway},${y4_Carriage} L ${500 - dxSgBot},${y4_S} Z`;
  return (
    <div className="w-full text-gray-900 font-sans md:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Route className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Geometry Input
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Length (meters)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Carriage (m)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Camber (%)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                      value={camber}
                      onChange={(e) => setCamber(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1"
                      title="Shoulder Width (m)"
                    >
                      Shoulder (m)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                      value={shoulderWidth}
                      onChange={(e) => setShoulderWidth(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1"
                      title="Shoulder Cross-fall (%)"
                    >
                      Fall (%)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                      value={shoulderFall}
                      onChange={(e) => setShoulderFall(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1"
                      title="Side Slope (1 Vertical : X Horizontal)"
                    >
                      Side Slope
                    </label>
                    <div className="flex items-center gap-3 w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-amber-500/50 transition-shadow">
                      <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm whitespace-nowrap">1 V :</span>
                      <input
                        type="number"
                        className="w-full bg-transparent text-gray-800 focus:outline-none -ml-1 text-sm md:text-base font-semibold"
                        value={sideSlope}
                        placeholder="e.g. 2"
                        onChange={(e) => setSideSlope(e.target.value)}
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm whitespace-nowrap">H</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Layer Thickness (mm)
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Sub-Grade
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={sgThickness}
                      onChange={(e) => setSgThickness(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Sub-Base
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={sbThickness}
                      onChange={(e) => setSbThickness(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Base Course (WBM)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={wbmThickness}
                      onChange={(e) => setWbmThickness(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Asphalt Course
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={asphaltThickness}
                      onChange={(e) => setAsphaltThickness(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Droplets className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Application Rates (L/m²)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Prime Coat
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={primeRateInput}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val < 0) return;
                      setPrimeRateInput(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                    Tack Coat
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={tackRateInput}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val < 0) return;
                      setTackRateInput(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Material Rates
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Sub-Grade /{isPKR ? "CFT" : "m³"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      value={rateSg}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRateSg(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Sub-Base /{isPKR ? "CFT" : "m³"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      value={rateSb}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRateSb(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      WBM /{isPKR ? "CFT" : "m³"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      value={rateWbm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRateWbm(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Asphalt /Ton
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      value={rateAsp}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRateAsp(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Prime /Ton
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      value={ratePrime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRatePrime(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Tack /Ton
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      value={rateTack}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRateTack(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Asphalt Density (t/m³)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-600 text-sm rounded-xl px-3 py-2 focus:outline-none"
                      value={asphaltDensity}
                      onChange={(e) => setAsphaltDensity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                      Bitumen Specific Gravity
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-600 text-sm rounded-xl px-3 py-2 focus:outline-none"
                      value={bitumenSG}
                      onChange={(e) => setBitumenSG(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Visualization and Results Section */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            <div
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between"
              style={{ minHeight: "360px" }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative z-10 flex items-center justify-between mb-8 text-white">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" /> Cross-Section
                  Profile
                </h2>
                <div className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  Camber: {c}% | Rise: {(riseAtCenter * 1000).toFixed(0)}mm
                </div>
              </div>
              {/* Road SVG Diagram */}
              <div className="relative z-10 flex-1 flex flex-col justify-center w-full mt-4">
                <svg
                  viewBox="0 0 1000 320"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-auto drop-shadow-2xl"
                >
                  <defs>
                    <linearGradient id="aspGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#374151" />
                      <stop offset="100%" stopColor="#1f2937" />
                    </linearGradient>
                    <linearGradient id="wbmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8c7a6b" />
                      <stop offset="100%" stopColor="#6e5d50" />
                    </linearGradient>
                    <linearGradient id="sbGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d0c1b0" />
                      <stop offset="100%" stopColor="#bfae9a" />
                    </linearGradient>
                    <linearGradient id="sgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a38a73" />
                      <stop offset="100%" stopColor="#876f59" />
                    </linearGradient>
                    <filter
                      id="shadow"
                      x="-5%"
                      y="-5%"
                      width="110%"
                      height="110%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="8"
                        stdDeviation="6"
                        floodColor="#000"
                        floodOpacity="0.3"
                      />
                    </filter>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M 0 2 L 10 5 L 0 8 z"
                        fill="white"
                        opacity="0.5"
                      />
                    </marker>
                  </defs>
                  <g filter="url(#shadow)">
                    {/* Sub-grade */}
                    <path
                      d={pathSg}
                      fill="url(#sgGrad)"
                      stroke="#5c4a3d"
                      strokeWidth="2"
                    />
                    {/* Sub-base */}
                    <path
                      d={pathSb}
                      fill="url(#sbGrad)"
                      stroke="#a1907d"
                      strokeWidth="2"
                    />
                    {/* WBM */}
                    <path
                      d={pathWbm}
                      fill="url(#wbmGrad)"
                      stroke="#504337"
                      strokeWidth="2"
                    />
                    {/* Asphalt */}
                    <path
                      d={pathAsp}
                      fill="url(#aspGrad)"
                      stroke="#111827"
                      strokeWidth="2"
                    />
                  </g>
                  {/* Center Reference Line */}
                  <line
                    x1="500"
                    y1="10"
                    x2="500"
                    y2={y4_C + 30}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    opacity="0.4"
                  />
                  {/* Horizontal Reference Line for Camber */}
                  <line
                    x1="0"
                    y1={y0_C}
                    x2="1000"
                    y2={y0_C}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    opacity="0.6"
                  />
                  {/* Width Annotations */}
                  <path
                    d={`M ${500 - dxAspTop},${y0_C - 15} L ${500 + dxAspTop},${y0_C - 15}`}
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.5"
                    markerStart="url(#arrow)"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x="500"
                    y={y0_C - 22}
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    opacity="0.8"
                  >
                    Top Width: {wAspTop.toFixed(2)}m
                  </text>
                  {/* Bottom Width Annotation */}
                  {s > 0 && (
                    <>
                      <path
                        d={`M ${500 - dxSgBot},${y4_S + 25} L ${500 + dxSgBot},${y4_S + 25}`}
                        stroke="#876f59"
                        strokeWidth="1.5"
                        opacity="0.5"
                        markerStart="url(#arrow)"
                        markerEnd="url(#arrow)"
                      />
                      <text
                        x="500"
                        y={y4_S + 42}
                        fill="#5c4a3d"
                        fontSize="14"
                        textAnchor="middle"
                        opacity="0.8"
                      >
                        Base Width: {wSgBot.toFixed(2)}m
                      </text>
                    </>
                  )}
                  {/* Labels */}
                  <text
                    x="500"
                    y={y0_C + vAsp / 2 + 5}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    ASPHALT ({aspT}mm)
                  </text>
                  <text
                    x="500"
                    y={y1_C + vWBM / 2 + 5}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="1"
                    opacity="0.9"
                  >
                    WBM ({wbmT}mm)
                  </text>
                  <text
                    x="500"
                    y={y2_C + vSB / 2 + 5}
                    fill="#3e342b"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    SUB-BASE ({sbT}mm)
                  </text>
                  <text
                    x="500"
                    y={y3_C + vSG / 2 + 5}
                    fill="#1a140f"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    SUB-GRADE ({sgT}mm)
                  </text>
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap  gap-4 items-center w-full">
              <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-amber-200 transition-colors">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-500" /> Layer
                  Quantities
                </h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Sub-Grade</span>
                    <span className="font-bold text-gray-900">
                      {volSG.toFixed(2)} m³
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Sub-Base</span>
                    <span className="font-bold text-gray-900">
                      {volSB.toFixed(2)} m³
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-600">WBM</span>
                    <span className="font-bold text-gray-900">
                      {volWBM.toFixed(2)} m³
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Asphalt</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 block">
                        {volAsphalt.toFixed(2)} m³
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {asphaltTons.toFixed(2)} Tons
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-orange-200 transition-colors">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-orange-500" /> Bitumen
                  Coats
                </h3>
                <div className="space-y-4">
                  <div className="bg-orange-50/50 px-4 py-3 rounded-xl border border-orange-100">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-orange-800 text-xs font-semibold">
                        Prime Coat (on WBM)
                      </div>
                      <div className="text-orange-600/70 text-[10px] font-bold">
                        @ {primeCoatRate} L/m²
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-black text-orange-600 leading-none">
                          {primeCoatVolume.toFixed(1)}
                        </span>
                        <span className="text-xs font-medium text-orange-400 mb-0.5">
                          L
                        </span>
                      </div>
                      <div className="text-sm font-bold text-orange-800 bg-orange-100/50 px-2 rounded">
                        {primeCoatTons.toFixed(2)} T
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-gray-600 text-xs font-semibold">
                        Tack Coat
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-[10px] font-bold">
                        @ {tackCoatRate} L/m²
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-black text-gray-800 leading-none">
                          {tackCoatVolume.toFixed(1)}
                        </span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                          L
                        </span>
                      </div>
                      <div className="text-sm font-bold text-gray-800 bg-gray-200/50 px-2 rounded">
                        {tackCoatTons.toFixed(2)} T
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-indigo-200 transition-colors mb-6 mt-6">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Granular Material
                Breakdown (Loose)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md inline-block mb-3">
                    WBM Sub-components
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-600">
                        Coarse Aggregate (80%)
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">
                          {wbmCoarseVol.toFixed(2)} m³
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {wbmCoarseTons.toFixed(2)} T
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-600">
                        Screenings (15%)
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">
                          {wbmScreeningVol.toFixed(2)} m³
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {wbmScreeningTons.toFixed(2)} T
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Binding Material (5%)
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">
                          {wbmBindingVol.toFixed(2)} m³
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {wbmBindingTons.toFixed(2)} T
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md inline-block mb-3">
                    Sub-base Material
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        GSB Aggregate (100%)
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">
                          {sbLooseVol.toFixed(2)} m³
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {sbMaterialTons.toFixed(2)} T
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-emerald-200 transition-colors">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Financial Summary
              </h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-50">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub-Grade</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(costSg)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub-Base</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(costSb)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-50">
                  <div className="flex justify-between">
                    <span className="text-gray-600">WBM</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(costWbm)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asphalt</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(costAsp)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prime Coat</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(costPrime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tack Coat</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(costTack)}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t-2 border-slate-800 flex justify-between items-center text-lg">
                  <span className="font-bold text-slate-800 tracking-tight uppercase text-xs">
                    Total Estimate Project Cost
                  </span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <CalculationHistory
        calculatorId="road_estimator_v1"
        estimationName="Road Calculation"
        currentInputs={{ length, width, camber, shoulderWidth, shoulderFall, sideSlope, sgThickness, sbThickness, wbmThickness, asphaltThickness }}
        currentResults={{ 
          volSG: volSG.toFixed(2), 
          volSB: volSB.toFixed(2), 
          volWBM: volWBM.toFixed(2), 
          volAsphalt: volAsphalt.toFixed(2) 
        }}
        summaryGeneration={(inputs, res) => `Asphalt: ${res.volAsphalt} m³`}
        onRestore={(inputs) => {
          if(inputs.length) setLength(inputs.length);
          if(inputs.width) setWidth(inputs.width);
          if(inputs.camber) setCamber(inputs.camber);
          if(inputs.shoulderWidth) setShoulderWidth(inputs.shoulderWidth);
          if(inputs.shoulderFall) setShoulderFall(inputs.shoulderFall);
          if(inputs.sideSlope) setSideSlope(inputs.sideSlope);
          if(inputs.sgThickness) setSgThickness(inputs.sgThickness);
          if(inputs.sbThickness) setSbThickness(inputs.sbThickness);
          if(inputs.wbmThickness) setWbmThickness(inputs.wbmThickness);
          if(inputs.asphaltThickness) setAsphaltThickness(inputs.asphaltThickness);
        }}
      />
    </div>
  );
}
