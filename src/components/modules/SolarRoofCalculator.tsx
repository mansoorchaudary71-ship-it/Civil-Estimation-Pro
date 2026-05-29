import React, { useState, useEffect } from "react";
import { Sun, Battery, Zap, DollarSign, Home, AlertCircle, Calculator } from "lucide-react";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";

export default function SolarRoofCalculator() {
  const [roofArea, setRoofArea] = useState<number | "">(50);
  const [areaUnit, setAreaUnit] = useState<"sqm" | "sqft">("sqm");
  const [monthlyBill, setMonthlyBill] = useState<number | "">(150);
  const [electricityRate, setElectricityRate] = useState<number | "">(0.15); // $/kWh
  const [peakSunHours, setPeakSunHours] = useState<number | "">(4.5);
  
  const [results, setResults] = useState<{
    reqSystemSize: number;
    recSystemSize: number;
    numPanels: number;
    annualGeneration: number;
    annualSavings: number;
    systemCost: number;
    paybackPeriod: number;
    areaRequired: number;
    fitsOnRoof: boolean;
    roi: number;
  } | null>(null);

  useEffect(() => {
    calculateSolar();
  }, [roofArea, areaUnit, monthlyBill, electricityRate, peakSunHours]);

  const calculateSolar = () => {
    if (roofArea === "" || monthlyBill === "" || electricityRate === "" || peakSunHours === "") {
      setResults(null);
      return;
    }

    const panelWattage = 400; // 400W per panel
    const panelAreaSqm = 2; // ~2 sq meters per panel
    const systemDerateFactor = 0.8; // System losses
    const costPerWatt = 2.50; // $2.50/W installation cost

    // Electricity usage
    const monthlyEnergyUsage = monthlyBill / electricityRate; // kWh/month
    const dailyEnergyUsage = monthlyEnergyUsage / 30.4; // kWh/day

    // 1. Calculate Required System Size (kW) to offset 100% bill
    const reqSystemSizeKw = dailyEnergyUsage / peakSunHours / systemDerateFactor;
    
    // 2. Available Roof Area in Sq Meters
    const validRoofAreaSqm = areaUnit === "sqft" ? roofArea * 0.092903 : roofArea;

    // 3. Max System Size based on Roof Area
    const maxPanelsPossible = Math.floor(validRoofAreaSqm / panelAreaSqm);
    const maxSystemSizeKw = (maxPanelsPossible * panelWattage) / 1000;

    // 4. Recommendation (bounded by roof area)
    const recSystemSizeKw = Math.min(reqSystemSizeKw, maxSystemSizeKw);
    const numPanels = Math.ceil((recSystemSizeKw * 1000) / panelWattage);
    const areaRequiredSqm = numPanels * panelAreaSqm;
    
    const fitsOnRoof = reqSystemSizeKw <= maxSystemSizeKw;

    // 5. Outputs
    const annualGenerationKwh = recSystemSizeKw * peakSunHours * 365 * systemDerateFactor;
    const annualSavings = annualGenerationKwh * electricityRate;
    const systemCost = recSystemSizeKw * 1000 * costPerWatt;
    const paybackPeriod = annualSavings > 0 ? systemCost / annualSavings : 0;
    const roi = systemCost > 0 ? ((annualSavings * 25 - systemCost) / systemCost) * 100 : 0;

    setResults({
      reqSystemSize: reqSystemSizeKw,
      recSystemSize: recSystemSizeKw,
      numPanels,
      annualGeneration: annualGenerationKwh,
      annualSavings,
      systemCost,
      paybackPeriod,
      areaRequired: areaRequiredSqm,
      fitsOnRoof,
      roi
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#151821] rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-slate-200 dark:border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-3">
           <Sun className="w-4 h-4 text-amber-500" />
           <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Renewable Energy</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold tabular-nums tracking-tight text-text-primary mb-2">Solar Roof Calculator</h2>
        <p className="text-slate-500 max-w-3xl text-sm leading-relaxed">
          Estimate the required solar system size, number of panels, and ROI based on your electricity bill and available roof space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" /> System Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Roof Area</label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    min="0"
                    className="flex-1 px-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                    value={roofArea}
                    onChange={(e) => setRoofArea(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  />
                  <select
                    className="w-24 px-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as "sqm" | "sqft")}
                  >
                    <option value="sqm">sq m</option>
                    <option value="sqft">sq ft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Avg. Monthly Electricity Bill ($)</label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value === "" ? "" : parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Electricity Rate ($/kWh)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(e.target.value === "" ? "" : parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Peak Sun Hours / Day</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={peakSunHours}
                  onChange={(e) => setPeakSunHours(parseFloat(e.target.value))}
                >
                  <option value="3.5">Northern US / UK (~3.5 hrs)</option>
                  <option value="4.5">Average US / Europe (~4.5 hrs)</option>
                  <option value="5.5">Southern US / Australia (~5.5 hrs)</option>
                  <option value="6.5">Middle East / Africa (~6.5 hrs)</option>
                </select>
              </div>
              
              <div className="mt-4 p-4 rounded-xl bg-bg-primary border border-border-color text-xs text-slate-600 dark:text-slate-400">
                Assumes standard 400W panels (size ~2 m²) and a $2.50/W installation cost.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="lg:col-span-8">
          {results ? (
            <div className="space-y-6">
              
              {/* Top Banner Alert */}
              {!results.fitsOnRoof && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                  <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-orange-800 dark:text-orange-400 font-bold mb-1">Roof Space Limited</h4>
                    <p className="text-orange-700/80 dark:text-orange-300/80 text-sm">
                      To offset 100% of your bill, you need a <strong>{results.reqSystemSize.toFixed(1)} kW</strong> system. 
                      However, your roof area only fits a <strong>{results.recSystemSize.toFixed(1)} kW</strong> system.
                      We have adjusted the recommendation accordingly.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Stats */}
              <div className="flex flex-col h-full">
                <MaterialSummary
                  title="Estimate Results"
                  totalLabel="Recommended System"
                  totalValue={results.recSystemSize.toFixed(1)}
                  totalUnit="kW"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <ResultCard
                      title="Total Panels"
                      value={results.numPanels}
                      unit="units"
                      variant="primary"
                      icon={<Home className="w-5 h-5 text-slate-900 dark:text-white" />}
                    />
                    <ResultCard
                      title="Annual Energy Gen."
                      value={results.annualGeneration.toLocaleString('en-US', {maximumFractionDigits: 0})}
                      unit="kWh"
                      variant="neutral"
                      icon={<Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
                    />
                    <ResultCard
                      title="Annual Savings"
                      value={`$${results.annualSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                      unit=""
                      variant="neutral"
                      icon={<DollarSign className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
                    />
                  </div>
                </MaterialSummary>
              </div>

              {/* Financial Summary */}
              <div className="bg-gradient-to-br from-slate-900 to-[#111111] dark:from-[#111111] dark:to-[#0a0a0a] rounded-2xl p-8 text-slate-900 dark:text-white relative overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 group">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/20 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                
                <h3 className="text-xl font-bold font-heading mb-6 relative z-10 flex items-center gap-2">
                  <Battery className="w-5 h-5 text-amber-400" /> ROI & Financials
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Estimated System Cost</p>
                    <p className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">${results.systemCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-xs text-slate-500 mt-2">Gross cost before federal/local tax incentives</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Estimated Payback Period</p>
                    <div className="flex items-baseline gap-2 flex-wrap relative z-10">
                      <p className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight text-amber-400">{results.paybackPeriod.toFixed(1)}</p>
                      <span className="text-lg font-bold text-amber-400/80">Years</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Time to recover the initial investment</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-medium mb-1">Lifetime ROI (25 yrs)</p>
                    <div className="flex items-baseline gap-2 flex-wrap relative z-10">
                      <p className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight text-emerald-400">{results.roi.toFixed(0)}</p>
                      <span className="text-lg font-bold text-emerald-400/80">%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Total return on investment over 25 years</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-bg-card/80 rounded-2xl p-12 shadow-sm border border-slate-200 dark:border-white/5 h-full flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
               <Sun className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
               <p className="font-semibold text-lg">Awaiting Input</p>
               <p className="text-sm max-w-sm mt-2">Please enter your roof area and electricity bill details to generate a solar estimate.</p>
            </div>
          )}
        </div>
        
        <CalculationHistory
          calculatorId="solar_roof_calc_v1"
          currentInputs={{ roofArea, areaUnit, monthlyBill, electricityRate, peakSunHours }}
          onRestore={(ins) => {
            if (ins.roofArea) setRoofArea(ins.roofArea);
            if (ins.areaUnit) setAreaUnit(ins.areaUnit);
            if (ins.monthlyBill) setMonthlyBill(ins.monthlyBill);
            if (ins.electricityRate) setElectricityRate(ins.electricityRate);
            if (ins.peakSunHours) setPeakSunHours(ins.peakSunHours);
          }}
        />
        
      </div>
    </div>
  );
}
