import React, { useState } from "react";
import { Zap, Droplet, Wind } from "lucide-react";
import { cn } from "../../lib/utils";
import ColorfulTab from "../ui/ColorfulTab";
import { useSettings } from "../../context/SettingsContext";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";
import { NumberInput } from "../ui/NumberInput";

type Tab = "solar" | "water" | "ac";

export default function EnergyMepCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("solar");

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-indigo-600" />
          Energy & MEP Calculators
        </h1>
        <p className="text-slate-500 font-medium">
          Estimate solar capacity, water heating requirements, and AC sizing for your projects.
        </p>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ColorfulTab index={0} id="solar"
          label="Solar Rooftop"
          icon={<Zap className="w-5 h-5" />}
          isActive={activeTab === "solar"}
          onClick={() => setActiveTab("solar")}
          colorTheme="amber"
        />
        <ColorfulTab index={1} id="water"
          label="Solar Water Heater"
          icon={<Droplet className="w-5 h-5" />}
          isActive={activeTab === "water"}
          onClick={() => setActiveTab("water")}
          colorTheme="blue"
        />
        <ColorfulTab index={2} id="ac"
          label="AC Initial Sizing"
          icon={<Wind className="w-5 h-5" />}
          isActive={activeTab === "ac"}
          onClick={() => setActiveTab("ac")}
          colorTheme="teal"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
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
  const { formatCurrency, convertAmount } = useSettings();
  const [area, setArea] = useState<number | "">("");
  const [areaUnit, setAreaUnit] = useState<"sqft" | "sqm">("sqft");
  const [dailyPower, setDailyPower] = useState<number | "">("");

  // Calculation Logic
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

    const panelCount = Math.ceil(requiredKwByPower / 0.4);
    // Estimated cost: ~ $1000 per kW, just for demonstration
    const estCost = requiredKwByPower * 1000;
    const estCostConverted = convertAmount(estCost);

    return {
      requiredKw: requiredKwByPower.toFixed(2),
      panelCount,
      requiredArea: Math.ceil(requiredArea),
      maxKwByArea: maxKwByArea ? maxKwByArea.toFixed(2) : null,
      estCostConverted
    };
  };

  const results = calculateSolar();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <NumberInput
            label="Daily Power Requirement"
            unit="kWh"
            value={dailyPower}
            onChange={setDailyPower}
            placeholder="e.g. 20"
          />

          <div className="w-full">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
              Available Roof Area (Optional)
            </label>
            <div className="relative flex items-center">
              <NumberInput
                value={area}
                onChange={setArea}
                placeholder="e.g. 500"
                containerClassName="flex-1"
                className="rounded-r-none border-r-0 focus:ring-opacity-50"
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as "sqft" | "sqm")}
                className="h-[46px] bg-slate-100 border border-slate-200 rounded-r-xl px-4 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="sqft">Sq Ft</option>
                <option value="sqm">Sq M</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          {results ? (
            <MaterialSummary
               title="Estimate Results"
               totalLabel="Required System Capacity"
               totalValue={results.requiredKw.toString()}
               totalUnit="kW"
             >
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                 <ResultCard
                   title="Total Panels (~400W)"
                   value={results.panelCount}
                   unit="panels"
                   variant="neutral"
                 />
                 <ResultCard
                   title="Estimated Cost"
                   value={formatCurrency(results.estCostConverted)}
                   unit=""
                   variant="primary"
                 />
               </div>
             </MaterialSummary>
          ) : (
            <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex items-center justify-center text-slate-500 text-sm">
              Enter specifications to see estimation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WaterHeaterCalculator() {
  const [people, setPeople] = useState<number | "">("");

  const calculateWaterHeater = () => {
    if (!people) return null;
    const lpd = Number(people) * 50; // 50 liters per person per day
    let recommendedSize = 100;
    if (lpd > 100) recommendedSize = 200;
    if (lpd > 200) recommendedSize = 300;
    if (lpd > 300) recommendedSize = 500;
    return { lpd, recommendedSize };
  };

  const results = calculateWaterHeater();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <NumberInput
            label="Number of People in Household"
            value={people}
            onChange={setPeople}
            placeholder="e.g. 4"
          />
        </div>
        <div className="flex flex-col h-full">
          {results ? (
             <MaterialSummary
               title="Estimate Results"
               totalLabel="Recommended System Size"
               totalValue={results.recommendedSize.toString()}
               totalUnit="Liters per Day (LPD)"
             />
          ) : (
            <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex items-center justify-center text-slate-500 text-sm">
              Enter specifications to see estimation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AcCalculator() {
  const [area, setArea] = useState<number | "">("");
  
  const calculateAc = () => {
    if (!area) return null;
    const sqft = Number(area);
    const tonnage = sqft / 400; // approx 1 ton per 400 sq.ft
    return { tonnage: Math.max(1, Math.ceil(tonnage * 2) / 2) }; // nearest 0.5 ton
  };

  const results = calculateAc();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <NumberInput
            label="Room Area"
            unit="Sq.Ft"
            value={area}
            onChange={setArea}
            placeholder="e.g. 150"
          />
        </div>
        <div className="flex flex-col h-full">
          {results ? (
             <MaterialSummary
               title="Estimate Results"
               totalLabel="Recommended AC Capacity"
               totalValue={results.tonnage.toFixed(1)}
               totalUnit="Tons"
             />
          ) : (
            <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex items-center justify-center text-slate-500 text-sm">
              Enter specifications to see estimation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}