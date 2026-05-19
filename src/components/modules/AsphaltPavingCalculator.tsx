import React, { useState } from "react";
import { Route, Droplet, ArrowRight, Layers, Calculator } from "lucide-react";
import { cn } from "../../lib/utils";
import { CalculationHistory } from "../ui/CalculationHistory";

type Tab = "asphalt" | "prime" | "tack";

export default function AsphaltPavingCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("asphalt");

  return (
    <div className="w-full text-gray-900 font-sans md:p-4">
      <div className="max-w-7xl mx-auto pb-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("asphalt")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-[14px] transition-colors whitespace-nowrap",
              activeTab === "asphalt"
                ? "text-slate-800 border-b-2 border-slate-800 bg-slate-50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Layers className="w-4 h-4" /> Asphalt
          </button>
          <button
            onClick={() => setActiveTab("prime")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-[14px] transition-colors whitespace-nowrap",
              activeTab === "prime"
                ? "text-slate-800 border-b-2 border-slate-800 bg-slate-50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Droplet className="w-4 h-4" /> Prime Coat
          </button>
          <button
            onClick={() => setActiveTab("tack")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-[14px] transition-colors whitespace-nowrap",
              activeTab === "tack"
                ? "text-slate-800 border-b-2 border-slate-800 bg-slate-50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Droplet className="w-4 h-4" /> Tack Coat
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === "asphalt" && <AsphaltCalculator />}
          {activeTab === "prime" && <PrimeCoatCalculator />}
          {activeTab === "tack" && <TackCoatCalculator />}
        </div>
      </div>
      </div>
    </div>
  );
}

// --- Calculators ---

function AsphaltCalculator() {
  const [length, setLength] = useState<number | "">("");
  const [width, setWidth] = useState<number | "">("");
  const [thickness, setThickness] = useState<number | "">("");
  
  // Use meters/cm by default for calculations
  const [lengthUnit, setLengthUnit] = useState<"m" | "ft">("m");
  const [thicknessUnit, setThicknessUnit] = useState<"mm" | "inch">("mm");

  const calculateAsphalt = () => {
    if (!length || !width || !thickness) return null;
    if (Number(length) <= 0 || Number(width) <= 0 || Number(thickness) <= 0) return null;

    let l = Number(length);
    let w = Number(width);
    let t = Number(thickness);

    if (lengthUnit === "ft") {
      l = l * 0.3048; // to meters
      w = w * 0.3048;
    }

    if (thicknessUnit === "inch") {
      t = t * 25.4; // to mm
    }

    // Volume in cubic meters = length(m) * width(m) * thickness(m)
    const volume = l * w * (t / 1000);
    
    // Standard asphalt compacted density is approx 2320 kg/m³ or 2.32 tons/m³
    const density = 2320; 
    const kg = volume * density;
    const tons = kg / 1000;

    return {
      tons: tons.toFixed(2),
      volume: volume.toFixed(2),
      area: (l * w).toFixed(2)
    };
  };

  const results = calculateAsphalt();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
             <select
                value={lengthUnit}
                onChange={(e) => setLengthUnit(e.target.value as any)}
                className="h-10 bg-slate-100 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 font-bold outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="m">Meters (m)</option>
                <option value="ft">Feet (ft)</option>
              </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label={`Length (${lengthUnit})`}>
              <input
                type="number"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value ? Number(e.target.value) : "")}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              />
            </InputGroup>
            <InputGroup label={`Width (${lengthUnit})`}>
              <input
                type="number"
                min="0"
                value={width}
                onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : "")}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              />
            </InputGroup>
          </div>
          <InputGroup label={`Thickness (${thicknessUnit})`}>
             <div className="flex">
              <input
                type="number"
                min="0"
                value={thickness}
                onChange={(e) => setThickness(e.target.value ? Number(e.target.value) : "")}
                className="flex-1 h-12 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              />
              <select
                value={thicknessUnit}
                onChange={(e) => setThicknessUnit(e.target.value as any)}
                className="h-12 bg-slate-100 border border-slate-200 rounded-r-xl px-4 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="mm">mm</option>
                <option value="inch">Inch</option>
              </select>
             </div>
          </InputGroup>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
          
          {results ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Required Asphalt</p>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  {results.tons} <span className="text-xl text-slate-300 font-bold">Metric Tons</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Volume</p>
                  <p className="text-2xl font-bold">{results.volume} <span className="text-sm font-normal text-slate-400">m³</span></p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Surface Area</p>
                  <p className="text-2xl font-bold">{results.area} <span className="text-sm font-normal text-slate-400">m²</span></p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-800/80 rounded-lg text-slate-300 text-sm">
                ℹ️ Assumes a standard compacted density of 2320 kg/m³. Actual yield may vary.
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Enter length, width, and thickness to calculate asphalt tonnage.
            </div>
          )}
        </div>
      </div>
      
      <CalculationHistory
        calculatorId="asphalt_calc_v1"
        currentInputs={{ length, width, thickness, thicknessUnit }}
        onRestore={(ins) => {
          if (ins.length) setLength(ins.length);
          if (ins.width) setWidth(ins.width);
          if (ins.thickness) setThickness(ins.thickness);
          if (ins.thicknessUnit) setThicknessUnit(ins.thicknessUnit);
        }}
      />
    </div>
  );
}

function PrimeCoatCalculator() {
  const [area, setArea] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">(1.0);
  
  const calculateCoat = () => {
    if (!area || !rate) return null;
    if (Number(area) <= 0 || Number(rate) <= 0) return null;

    const liters = Number(area) * Number(rate);
    const drums = Math.ceil(liters / 200); // Standard 200L drum

    return {
      liters: liters.toFixed(1),
      drums
    };
  };

  const results = calculateCoat();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputGroup label="Surface Area (sq meters)">
            <input
              type="number"
              min="0"
              value={area}
              onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              placeholder="e.g. 500"
            />
          </InputGroup>

          <InputGroup label="Application Rate (Liters/m²)">
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              placeholder="Standard: 0.8 - 1.2"
            />
            <p className="text-xs text-slate-400 mt-1">Default is ~1.0 L/m² for WBM/WMM surfaces.</p>
          </InputGroup>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
          
          {results ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Prime Coat Emulsion</p>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  {results.liters} <span className="text-xl text-slate-300 font-bold">Liters</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 text-sm mb-1">Standard Drums (200L)</p>
                <p className="text-xl font-bold">{results.drums} <span className="text-sm font-normal text-slate-400">drums approx.</span></p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Enter area and application rate to calculate prime coat.
            </div>
          )}
        </div>
      </div>
      <CalculationHistory
        calculatorId="prime_coat_calc_v1"
        currentInputs={{ area, rate }}
        onRestore={(ins) => {
          if (ins.area) setArea(ins.area);
          if (ins.rate) setRate(ins.rate);
        }}
      />
    </div>
  );
}

function TackCoatCalculator() {
  const [area, setArea] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">(0.25);
  
  const calculateCoat = () => {
    if (!area || !rate) return null;
    if (Number(area) <= 0 || Number(rate) <= 0) return null;

    const liters = Number(area) * Number(rate);
    const drums = Math.ceil(liters / 200);

    return {
      liters: liters.toFixed(1),
      drums
    };
  };

  const results = calculateCoat();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputGroup label="Surface Area (sq meters)">
            <input
              type="number"
              min="0"
              value={area}
              onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              placeholder="e.g. 500"
            />
          </InputGroup>

          <InputGroup label="Application Rate (Liters/m²)">
            <input
              type="number"
              min="0"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all"
              placeholder="Standard: 0.2 - 0.3"
            />
            <p className="text-xs text-slate-400 mt-1">Default is ~0.25 L/m² for bituminous surfaces.</p>
          </InputGroup>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
          
          {results ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Tack Coat Emulsion</p>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  {results.liters} <span className="text-xl text-slate-300 font-bold">Liters</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 text-sm mb-1">Standard Drums (200L)</p>
                <p className="text-xl font-bold">{results.drums} <span className="text-sm font-normal text-slate-400">drums approx.</span></p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Enter area and application rate to calculate tack coat.
            </div>
          )}
        </div>
      </div>
      <CalculationHistory
        calculatorId="tack_coat_calc_v1"
        currentInputs={{ area, rate }}
        onRestore={(ins) => {
          if (ins.area) setArea(ins.area);
          if (ins.rate) setRate(ins.rate);
        }}
      />
    </div>
  );
}

function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
