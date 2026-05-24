import React, { useState } from "react";
import { 
  CloudRain, 
  Droplet, 
  Sprout, 
  Wallet,
  Settings,
  CircleDollarSign
} from "lucide-react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";

export default function RainwaterHarvesting() {
  const { settings, formatCurrency } = useSettings();
  
  const [roofArea, setRoofArea] = useState("100");
  const [areaUnit, setAreaUnit] = useState("sqm");
  const [rainfall, setRainfall] = useState("800");
  const [coefficient, setCoefficient] = useState("0.85");
  const [muniWaterCost, setMuniWaterCost] = useState("2.5"); // per m3
  const [setupCost, setSetupCost] = useState("1500");

  const area = parseFloat(roofArea) || 0;
  const areaSqm = areaUnit === "sqft" ? area / 10.7639 : area;
  
  const pRainfall = parseFloat(rainfall) || 0;
  const pCoeff = parseFloat(coefficient) || 0.85;
  
  // Annual Collectible Volume in cubic meters
  const annualVolM3 = areaSqm * (pRainfall / 1000) * pCoeff;
  const annualVolLiters = annualVolM3 * 1000;
  
  // Recommend a tank size (roughly representing 1 month of rain or peak storm capture)
  // We'll approximate 8% of annual yield
  const recommendedTankM3 = annualVolM3 * 0.08;
  const recommendedTankLiters = recommendedTankM3 * 1000;
  
  // Financial Savings
  const pWaterCost = parseFloat(muniWaterCost) || 0;
  const pSetupCost = parseFloat(setupCost) || 0;
  const annualSavings = annualVolM3 * pWaterCost;
  
  const paybackPeriod = annualSavings > 0 ? (pSetupCost / annualSavings) : 0;
  
  // CO2 savings - approximate 0.6 kg CO2 per cubic meter of municipal water supplied
  const co2Savings = annualVolM3 * 0.6;

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-text-primary p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3 text-text-primary">
              <CloudRain className="w-8 h-8 text-[#0284c7] dark:text-[#38bdf8]" />
              Rainwater Harvesting
            </h1>
            <p className="text-slate-500 dark:text-slate-300 font-medium">
              Calculate collectible rainwater volume, recommend tank sizes, and estimate financial & ecological savings.
            </p>
          </div>
          <GlobalSettingsToggle align="left" showCurrency={true} />
        </div>
        
        <div className="bg-bg-card rounded-3xl shadow-sm border border-border-color overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Catchment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Roof Area</label>
                      <div className="flex">
                        <input type="number" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-l-xl px-4 py-3 focus:ring-2 focus:ring-[#0284c7]/50" value={roofArea} onChange={(e) => setRoofArea(e.target.value)} />
                        <select className="bg-slate-50 dark:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-xl px-2 py-3 outline-none" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                          <option value="sqm">m²</option>
                          <option value="sqft">sq.ft</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ann. Rainfall (mm)</label>
                      <input type="number" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0284c7]/50" value={rainfall} onChange={(e) => setRainfall(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Runoff Coefficient</label>
                      <select className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0284c7]/50" value={coefficient} onChange={(e) => setCoefficient(e.target.value)}>
                        <option value="0.90">Metal / Corrugated Roof (0.90)</option>
                        <option value="0.85">Concrete / Tiles (0.85)</option>
                        <option value="0.80">Asphalt Shingles (0.80)</option>
                        <option value="0.60">Flat Gravel Roof (0.60)</option>
                        <option value="0.20">Green Roof (0.20)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Financials</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">Water Cost (/{`m³`})</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-slate-400 text-sm font-medium">{settings.currency.substring(0,1)}</span>
                        <input type="number" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-emerald-500/50" value={muniWaterCost} onChange={(e) => setMuniWaterCost(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Est. Setup Cost</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-slate-400 text-sm font-medium">{settings.currency.substring(0,1)}</span>
                        <input type="number" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-emerald-500/50" value={setupCost} onChange={(e) => setSetupCost(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schematic Diagram */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-sm relative overflow-hidden">
                <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-sm mb-4">System Schematic</h4>
                <svg width="280" height="240" viewBox="0 0 280 240" className="max-w-full drop-shadow-sm">
                  {/* Rain */}
                  <g stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" opacity="0.6">
                    <line x1="60" y1="20" x2="50" y2="50" />
                    <line x1="100" y1="15" x2="90" y2="45" />
                    <line x1="140" y1="25" x2="130" y2="55" />
                  </g>
                  {/* Cloud */}
                  <path d="M70,40 a20,20 0 0,1 40,0 a30,30 0 0,1 50,0 a20,20 0 0,1 -10,35 h-70 a15,15 0 0,1 -10,-35" fill="rgba(148, 163, 184, 0.2)" stroke="#94a3b8" strokeWidth="2"/>

                  {/* House / Roof */}
                  <polygon points="20,110 100,50 180,110" fill="#f1f5f9" stroke="#64748b" strokeWidth="3" strokeLinejoin="round" />
                  <rect x="35" y="110" width="130" height="90" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
                  
                  {/* Gutter */}
                  <path d="M 15 110 L 185 110" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Downpipe */}
                  <path d="M 175 110 L 175 180 L 195 180" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Filter box */}
                  <rect x="195" y="170" width="20" height="20" fill="#cbd5e1" stroke="#475569" strokeWidth="2" rx="2" />
                  <path d="M 215 180 L 230 180 L 230 150" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Tank */}
                  <rect x="220" y="100" width="45" height="100" fill="#f8fafc" stroke="#334155" strokeWidth="3" rx="4" />
                  <path d="M 220 120 L 265 120 M 220 140 L 265 140 M 220 160 L 265 160 M 220 180 L 265 180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3"/>
                  <rect x="220" y="160" width="45" height="40" fill="#0ea5e9" opacity="0.3" />
                  
                  {/* Tap */}
                  <circle cx="230" cy="180" r="3" fill="#334155" />
                  <path d="M 230 180 L 210 180 L 210 185" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Labels */}
                  <text x="100" y="90" fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="bold">Catchment</text>
                  <text x="242" y="150" fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="bold" transform="rotate(-90 242 150)">Storage</text>
                </svg>
              </div>
            </div>

            {/* Results */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-5 h-5 text-sky-500" />
                    <h3 className="text-sm font-bold text-sky-800 dark:text-sky-300 uppercase tracking-tight">Annual Yield</h3>
                  </div>
                  <div className="mt-1">
                    <span className="text-2xl font-black text-sky-600 dark:text-sky-400">{annualVolLiters.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="text-sm text-sky-500 ml-1 font-semibold">Liters/yr</span>
                  </div>
                  <div className="text-xs text-sky-600/70 font-medium mt-0.5">({annualVolM3.toFixed(1)} cubic meters)</div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-tight">Rec. Tank</h3>
                  </div>
                  <div className="mt-1">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{recommendedTankLiters.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="text-sm text-indigo-500 ml-1 font-semibold">Liters</span>
                  </div>
                  <div className="text-xs text-indigo-600/70 font-medium mt-0.5">({recommendedTankM3.toFixed(1)} cubic meters)</div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-tight">Payback</h3>
                  </div>
                  <div className="mt-1">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{paybackPeriod.toFixed(1)}</span>
                    <span className="text-sm text-emerald-500 ml-1 font-semibold">Years</span>
                  </div>
                  <div className="text-xs text-emerald-600/70 font-medium mt-0.5">Saves {formatCurrency(annualSavings)}/yr</div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-5 h-5 text-rose-500" />
                    <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 uppercase tracking-tight">CO2 Offset</h3>
                  </div>
                  <div className="mt-1">
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{co2Savings.toFixed(1)}</span>
                    <span className="text-sm text-rose-500 ml-1 font-semibold">kg CO₂e/yr</span>
                  </div>
                  <div className="text-xs text-rose-600/70 font-medium mt-0.5">Vs. pumped water</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalculationHistory
        calculatorId="rainwater"
        estimationName="Rainwater Estimate"
        currentInputs={{ roofArea, rainfall }}
        currentResults={{ annualVolLiters }}
        summaryGeneration={(inputs, res) => `Yield: ${Math.round(res.annualVolLiters).toLocaleString()} L`}
      />
    </div>
  );
}
