import React, { useState } from "react";
import { Zap, Droplet, Wind, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

type Tab = "solar" | "water" | "ac";

export default function EnergyMepCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("solar");

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-[#1A1A1A]" />
          Energy & MEP Calculators
        </h1>
        <p className="text-slate-500 font-medium">
          Estimate solar capacity, water heating requirements, and AC sizing for your projects.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("solar")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-[14px] transition-colors whitespace-nowrap",
              activeTab === "solar"
                ? "text-[#1A1A1A] border-b-2 border-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Zap className="w-4 h-4" /> Solar Rooftop
          </button>
          <button
            onClick={() => setActiveTab("water")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-[14px] transition-colors whitespace-nowrap",
              activeTab === "water"
                ? "text-[#1A1A1A] border-b-2 border-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Droplet className="w-4 h-4" /> Solar Water Heater
          </button>
          <button
            onClick={() => setActiveTab("ac")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-[14px] transition-colors whitespace-nowrap",
              activeTab === "ac"
                ? "text-[#1A1A1A] border-b-2 border-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Wind className="w-4 h-4" /> AC Initial Sizing
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === "solar" && <SolarCalculator />}
          {activeTab === "water" && <WaterHeaterCalculator />}
          {activeTab === "ac" && <AcCalculator />}
        </div>
      </div>
    </div>
  );
}

// --- Specific Calculators ---

function SolarCalculator() {
  const [area, setArea] = useState<number | "">("");
  const [areaUnit, setAreaUnit] = useState<"sqft" | "sqm">("sqft");
  const [dailyPower, setDailyPower] = useState<number | "">("");

  // Calculation Logic
  // 1 kW requires ~100 sq ft or ~10 sq m
  // 1 kW produces ~4 kWh / day
  const calculateSolar = () => {
    if (!dailyPower) return null;

    const requiredKwByPower = Number(dailyPower) / 4;
    
    let requiredArea = 0;
    if (areaUnit === "sqft") {
      requiredArea = requiredKwByPower * 100;
    } else {
      requiredArea = requiredKwByPower * 9.29; // approx 10 sqm
    }

    let maxKwByArea = null;
    if (area) {
      if (areaUnit === "sqft") {
        maxKwByArea = Number(area) / 100;
      } else {
        maxKwByArea = Number(area) / 9.29;
      }
    }

    // Assuming 400W (0.4kW) panels
    const panelCount = Math.ceil(requiredKwByPower / 0.4);

    return {
      requiredKw: requiredKwByPower.toFixed(2),
      panelCount,
      requiredArea: Math.ceil(requiredArea),
      maxKwByArea: maxKwByArea ? maxKwByArea.toFixed(2) : null,
    };
  };

  const results = calculateSolar();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputGroup label="Daily Power Requirement (kWh)">
            <input
              type="number"
              value={dailyPower}
              onChange={(e) => setDailyPower(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. 20"
            />
          </InputGroup>

          <InputGroup label={`Available Roof Area (${areaUnit === 'sqft' ? 'Sq Ft' : 'Sq M'}) (Optional)`}>
            <div className="flex">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
                className="flex-1 h-12 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 500"
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="h-12 bg-slate-100 border border-slate-200 rounded-r-xl px-4 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sqft">Sq Ft</option>
                <option value="sqm">Sq M</option>
              </select>
            </div>
          </InputGroup>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
          
          {results ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Required System Capacity</p>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  {results.requiredKw} <span className="text-xl text-blue-400 font-bold">kW</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Panels (~400W)</p>
                  <p className="text-2xl font-bold">{results.panelCount}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Min. Clear Area</p>
                  <p className="text-2xl font-bold">{results.requiredArea} {areaUnit}</p>
                </div>
              </div>

              {results.maxKwByArea && Number(results.requiredKw) > Number(results.maxKwByArea) && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                  ⚠️ Your available area can only support approx {results.maxKwByArea} kW. You may need higher efficiency panels or more space.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Enter your daily power requirement to see estimates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WaterHeaterCalculator() {
  const [members, setMembers] = useState<number | "">("");
  const [usageType, setUsageType] = useState<"low" | "medium" | "high">("medium");

  const calculateWaterHeater = () => {
    if (!members) return null;

    let lpdPerPerson = 25; // low
    if (usageType === "medium") lpdPerPerson = 35;
    if (usageType === "high") lpdPerPerson = 50;

    const totalLpd = Number(members) * lpdPerPerson;
    
    // Standard sizes
    const standardSizes = [100, 150, 200, 250, 300, 500];
    const recommended = standardSizes.find(size => size >= totalLpd) || Math.ceil(totalLpd / 100) * 100;

    return {
      totalLpd,
      recommended
    };
  };

  const results = calculateWaterHeater();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputGroup label="Number of Family Members">
            <input
              type="number"
              value={members}
              onChange={(e) => setMembers(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. 4"
            />
          </InputGroup>

          <InputGroup label="Hot Water Usage Profile">
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setUsageType(type)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-bold capitalize transition-all border",
                    usageType === type 
                      ? "bg-[#EDED78] text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {usageType === "low" && "Showers only (approx 25 LPD/person)"}
              {usageType === "medium" && "Showers + Basins (approx 35 LPD/person)"}
              {usageType === "high" && "Showers, Basins + Bathtubs (approx 50 LPD/person)"}
            </p>
          </InputGroup>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
          
          {results ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Recommended Tank Capacity</p>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  {results.recommended} <span className="text-xl text-blue-400 font-bold">LPD</span>
                </div>
                <p className="text-slate-500 text-sm mt-1">Liters Per Day</p>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 text-sm mb-1">Calculated Daily Consumption</p>
                <p className="text-xl font-bold">{results.totalLpd} Liters</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Enter family size to see recommended tank capacity.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AcCalculator() {
  const [length, setLength] = useState<number | "">("");
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [unit, setUnit] = useState<"ft" | "m">("ft");

  const calculateAc = () => {
    if (!length || !width) return null;

    let l = Number(length);
    let w = Number(width);
    let h = height ? Number(height) : (unit === "ft" ? 10 : 3); // default height

    if (unit === "m") {
      l = l * 3.28084;
      w = w * 3.28084;
      h = h * 3.28084;
    }

    const volume = l * w * h;
    // Rule of thumb: Volume / 1000 = Tons
    let tons = volume / 1000;
    
    // Standard AC sizes
    const standardTons = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0];
    let recommended = standardTons.find(t => t >= tons) || tons;
    
    // Round to nearest 0.5 above if exceeding standards
    if (recommended > 5.0) {
      recommended = Math.ceil(tons * 2) / 2;
    }

    const btu = recommended * 12000;

    return {
      tons: tons.toFixed(2),
      recommended: recommended.toFixed(1),
      btu: btu.toLocaleString(),
      sqft: (l * w).toFixed(0)
    };
  };

  const results = calculateAc();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-end">
             <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="h-10 bg-slate-100 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ft">Feet (ft)</option>
                <option value="m">Meters (m)</option>
              </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label={`Length (${unit})`}>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value ? Number(e.target.value) : "")}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </InputGroup>
            <InputGroup label={`Width (${unit})`}>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : "")}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </InputGroup>
          </div>
          <InputGroup label={`Height (${unit}) (Optional)`}>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={unit === "ft" ? "Default: 10" : "Default: 3"}
              />
          </InputGroup>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
          
          {results ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Recommended AC Size</p>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  {results.recommended} <span className="text-xl text-blue-400 font-bold">Tons</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Cooling Capacity</p>
                  <p className="text-2xl font-bold">{results.btu} <span className="text-sm font-normal text-slate-400">BTU/hr</span></p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Room Area</p>
                  <p className="text-2xl font-bold">{results.sqft} <span className="text-sm font-normal text-slate-400">Sq Ft</span></p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm">
                ℹ️ This is a rough estimate. Top-floor rooms or rooms with large sun-facing windows may require 0.5 Ton extra.
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Enter room dimensions to calculate AC capacity.
            </div>
          )}
        </div>
      </div>
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
