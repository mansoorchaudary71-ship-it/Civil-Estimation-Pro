import React, { useState } from "react";
import { FlaskConical, Droplet, Layers, Beaker, ArrowDownToLine, Flame, Download } from "lucide-react";
import GeotechnicalCalculator from "./GeotechnicalCalculator";
import MasterSieveAnalysis from "./MasterSieveAnalysis";
import AggregateBlendingCalculator from "./AggregateBlendingCalculator";
import DirectShearTestCalculator from "./DirectShearTestCalculator";
import CbrTestCalculator from "./CbrTestCalculator";
import PermeabilityCalculator from "./PermeabilityCalculator";
import AggregateTestsCalculator from "./AggregateTestsCalculator";

type HubTab = "index" | "gradation" | "strength" | "aggregates";

export default function SoilLabSuite() {
  const [activeTab, setActiveTab] = useState<HubTab>("index");
  
  // Map standard based on active tab
  const getStandard = () => {
    switch (activeTab) {
      case "index": return "IS 2720 Part 2, 3, 5";
      case "gradation": return "IS 2720 Part 4 / IS 383";
      case "strength": return "IS 2720 Part 13, 16, 17, 39";
      case "aggregates": return "IS 2386 series";
      default: return "IS 2720 / ASTM D Series";
    }
  };

  const tabs: { id: HubTab; label: string; icon: any }[] = [
    { id: "index", label: "Index Properties", icon: Droplet },
    { id: "gradation", label: "Gradation", icon: Layers },
    { id: "strength", label: "Strength & Permeability", icon: ArrowDownToLine },
    { id: "aggregates", label: "Road Aggregates", icon: FlaskConical },
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar for Sub-Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col pt-6 px-4 gap-2">
        <h2 className="text-xl font-black text-slate-800 dark:text-white px-2 mb-4">
          Soil & Materials Lab
        </h2>
        
        <div className="px-2 mb-4">
          <label className="text-xs font-bold text-slate-500 uppercase">Applicable Standard</label>
          <div className="w-full mt-1 bg-slate-100 dark:bg-slate-800 border-none p-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
            {getStandard()}
          </div>
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
               activeTab === tab.id
                ? "bg-slate-900 text-white shadow-md translate-x-1"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-0 max-w-7xl mx-auto h-full">
          {activeTab === "index" && <GeotechnicalIndexProperties />}
          {activeTab === "gradation" && <GradationSuite />}
          {activeTab === "strength" && <StrengthPermeabilitySuite />}
          {activeTab === "aggregates" && <AggregateTestsCalculator />}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-Suites that bundle existing components with tabs
// -------------------------------------------------------------

function GeotechnicalIndexProperties() {
  // Enhancing existing GeotechnicalCalculator which does some of this, but it also has Sieve and CBR.
  // I will create a tailored view here for WC, SG, Atterberg.
  const [test, setTest] = useState<"wc" | "sg" | "atterberg">("wc");
  
  return (
    <div className="p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full mb-6">
        <button onClick={() => setTest("wc")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${test === "wc" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}>Water Content</button>
        <button onClick={() => setTest("sg")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${test === "sg" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}>Specific Gravity</button>
        <button onClick={() => setTest("atterberg")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${test === "atterberg" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}>Atterberg Limits</button>
      </div>

      {test === "wc" && <WaterContentCalc />}
      {test === "sg" && <SpecificGravityCalc />}
      {test === "atterberg" && <AtterbergLimitsCalc />}
    </div>
  );
}

// 1. Water Content
function WaterContentCalc() {
  const [wcW1, setWcW1] = useState("");
  const [wcW2, setWcW2] = useState("");
  const [wcW3, setWcW3] = useState("");

  const W1 = parseFloat(wcW1) || 0;
  const W2 = parseFloat(wcW2) || 0;
  const W3 = parseFloat(wcW3) || 0;

  let wc = 0;
  if (W3 - W1 > 0 && W2 > W3) {
    wc = ((W2 - W3) / (W3 - W1)) * 100;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold border-b pb-2 mb-4">Input Data</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">W1: Weight of empty container (g)</label>
            <input type="number" value={wcW1} onChange={e => setWcW1(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">W2: Wt. container + wet soil (g)</label>
            <input type="number" value={wcW2} onChange={e => setWcW2(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">W3: Wt. container + dry soil (g)</label>
            <input type="number" value={wcW3} onChange={e => setWcW3(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center text-center">
         <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">Water Content (w)</h4>
         <div className="text-6xl font-black text-indigo-600">{wc.toFixed(2)}%</div>
      </div>
    </div>
  );
}

// 2. Specific Gravity
function SpecificGravityCalc() {
  const [sgW1, setSgW1] = useState("");
  const [sgW2, setSgW2] = useState("");
  const [sgW3, setSgW3] = useState("");
  const [sgW4, setSgW4] = useState("");

  const W1 = parseFloat(sgW1) || 0;
  const W2 = parseFloat(sgW2) || 0;
  const W3 = parseFloat(sgW3) || 0;
  const W4 = parseFloat(sgW4) || 0;

  let g = 0;
  if ((W2 - W1) - (W3 - W4) > 0) {
    g = (W2 - W1) / ((W2 - W1) - (W3 - W4));
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold border-b pb-2 mb-4">Input Data (Pycnometer)</h3>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase">W1: Empty (g)</label><input type="number" value={sgW1} onChange={e => setSgW1(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">W2: + Soil (g)</label><input type="number" value={sgW2} onChange={e => setSgW2(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">W3: + Soil + Water (g)</label><input type="number" value={sgW3} onChange={e => setSgW3(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">W4: + Water (g)</label><input type="number" value={sgW4} onChange={e => setSgW4(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center text-center">
         <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">Specific Gravity (G)</h4>
         <div className="text-6xl font-black text-indigo-600">{g > 0 ? g.toFixed(3) : "0.000"}</div>
         {g > 0 && (g < 2.5 || g > 2.9) && <div className="text-xs text-rose-500 mt-2 font-bold">Unusual value (typically 2.6 - 2.8)</div>}
      </div>
    </div>
  );
}

// 3. Atterberg Limits
function AtterbergLimitsCalc() {
  const [llBlows, setLlBlows] = useState("25");
  const [llWater, setLlWater] = useState("");
  const [plWater, setPlWater] = useState("");

  const N = parseFloat(llBlows) || 25;
  const w = parseFloat(llWater) || 0;
  
  let LL = 0;
  if (N > 0 && w > 0) {
    LL = w * Math.pow(N / 25, 0.121);
  }

  const PL = parseFloat(plWater) || 0;
  const PI = Math.max(0, LL - PL);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold border-b pb-2 mb-4">Liquid Limit (One-Point)</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><label className="text-xs font-bold text-slate-500 uppercase">Blows (N)</label><input type="number" value={llBlows} onChange={e => setLlBlows(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Water Content (%)</label><input type="number" value={llWater} onChange={e => setLlWater(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
        </div>

        <h3 className="font-bold border-b pb-2 mb-4">Plastic Limit</h3>
        <div><label className="text-xs font-bold text-slate-500 uppercase">Plastic Limit w (%)</label><input type="number" value={plWater} onChange={e => setPlWater(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center text-center gap-6">
         <div>
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">Liquid Limit (LL)</h4>
           <div className="text-3xl font-black text-indigo-600">{LL.toFixed(1)}%</div>
         </div>
         <div>
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">Plastic Limit (PL)</h4>
           <div className="text-3xl font-black text-emerald-600">{PL > 0 ? PL.toFixed(1) + "%" : "---"}</div>
         </div>
         <div className="border-t pt-4">
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">Plasticity Index (PI)</h4>
           <div className="text-4xl font-black text-amber-600">{(LL > 0 && PL > 0) ? PI.toFixed(1) + "%" : "---"}</div>
         </div>
      </div>
    </div>
  );
}


function GradationSuite() {
  const [test, setTest] = useState<"sieve" | "blending" | "hydrometer">("sieve");
  
  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full max-w-3xl mb-6">
        <button onClick={() => setTest("sieve")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${test === "sieve" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}>Sieve Analysis</button>
        <button onClick={() => setTest("blending")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${test === "blending" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}>Aggregate Blending</button>
        <button onClick={() => setTest("hydrometer")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${test === "hydrometer" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}>Hydrometer</button>
      </div>
      <div className="flex-1 min-h-0 border-t pt-4">
        {test === "sieve" && <MasterSieveAnalysis />}
        {test === "blending" && <div className="h-full overflow-y-auto"><AggregateBlendingCalculator /></div>}
        {test === "hydrometer" && <HydrometerCalc />}
      </div>
    </div>
  );
}

function HydrometerCalc() {
  const [sg, setSg] = useState("2.65");
  const [temp, setTemp] = useState("25");
  const [reading, setReading] = useState("30");
  const [time, setTime] = useState("60");

  const G = parseFloat(sg) || 2.65;
  const T = parseFloat(temp) || 25;
  const R = parseFloat(reading) || 0;
  const t = parseFloat(time) || 0;

  // Approximate Stokes Law derived D (mm)
  // v = viscosity of water at 25C ~= 0.0089 poise
  // simple approx: D = K * sqrt(L/t) where L is effective depth
  const effectiveDepth = 16.29 - 0.164 * R; // example cm
  const K = 0.013; // general constant for 2.65 at 25C
  const D = (t > 0 && effectiveDepth > 0) ? K * Math.sqrt(effectiveDepth / t) : 0;
  
  // Percent Finer
  const Ws = 50; // assuming 50g sample
  const menis = 1;
  const zeroCor = 0;
  const Rc = R - zeroCor - menis; 
  // simplified 
  const N = (Rc * 100 * G) / (Ws * (G - 1));

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold border-b pb-2 mb-4">Input Data (Single Reading Example)</h3>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase">Specific Gravity (G)</label><input type="number" step="0.01" value={sg} onChange={e => setSg(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Temperature (°C)</label><input type="number" value={temp} onChange={e => setTemp(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Hydrometer Reading (R)</label><input type="number" value={reading} onChange={e => setReading(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Elapsed Time (min)</label><input type="number" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center text-center gap-6">
         <div>
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">Particle Diameter (D)</h4>
           <div className="text-3xl font-black text-indigo-600">{D.toFixed(4)} mm</div>
         </div>
         <div className="border-t pt-4">
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">% Finer (N)</h4>
           <div className="text-4xl font-black text-emerald-600">{Math.max(0, Math.min(100, N)).toFixed(1)}%</div>
         </div>
      </div>
    </div>
  );
}


function StrengthPermeabilitySuite() {
  const [test, setTest] = useState<"directshear" | "cbr" | "perm" | "uct">("directshear");
  
  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-wrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full mb-6">
        <button onClick={() => setTest("directshear")} className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${test === "directshear" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}>Direct Shear</button>
        <button onClick={() => setTest("cbr")} className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${test === "cbr" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}>CBR Test</button>
        <button onClick={() => setTest("perm")} className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${test === "perm" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}>Permeability</button>
        <button onClick={() => setTest("uct")} className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${test === "uct" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}>UCT</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {test === "directshear" && <DirectShearTestCalculator />}
        {test === "cbr" && <CbrTestCalculator />}
        {test === "perm" && <PermeabilityCalculator />}
        {test === "uct" && <UnconfinedCompressionTest />}
      </div>
    </div>
  );
}

function UnconfinedCompressionTest() {
  const [load, setLoad] = useState("500");
  const [dia, setDia] = useState("38");
  const [height, setHeight] = useState("76");
  const [deformation, setDeformation] = useState("5");

  const P = parseFloat(load) || 0; // N
  const d = parseFloat(dia) || 38; // mm
  const L = parseFloat(height) || 76; // mm
  const deltaL = parseFloat(deformation) || 0; // mm

  const A0 = (Math.PI * d * d) / 4; // mm2
  const strain = deltaL / L; // dimensionless
  const A_corr = (strain < 1) ? A0 / (1 - strain) : A0;
  
  // qu in kPa (N/mm2 * 1000)
  const qu = (A_corr > 0) ? (P / A_corr) * 1000 : 0;
  const cu = qu / 2;

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold border-b pb-2 mb-4">UCT Input (at failure)</h3>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase">Sample Diameter (mm)</label><input type="number" value={dia} onChange={e => setDia(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Sample Height (mm)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Failure Load (N)</label><input type="number" value={load} onChange={e => setLoad(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Axial Deformation (mm)</label><input type="number" value={deformation} onChange={e => setDeformation(e.target.value)} className="w-full mt-1 bg-slate-50 border p-2 rounded-lg" /></div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center text-center gap-6">
         <div>
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">Unconfined Compressive Strength (qu)</h4>
           <div className="text-4xl font-black text-indigo-600">{qu.toFixed(1)} kPa</div>
         </div>
         <div className="border-t pt-4">
           <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">Undrained Shear Strength (cu)</h4>
           <div className="text-4xl font-black text-emerald-600">{cu.toFixed(1)} kPa</div>
         </div>
      </div>
    </div>
  );
}
