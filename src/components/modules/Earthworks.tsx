import React, { useState } from "react";
import { Mountain, Route, Grid, TrendingUp, ShieldAlert } from "lucide-react";
import StandardEarthworks from "./EarthworksBase";
import ChainageVolumeEstimator from "./ChainageVolume";
import GridEarthworkEstimator from "./GridEarthwork";
import SlopeStability from "./SlopeStability"; // We will create this
import { CalculationHistory } from '../ui/CalculationHistory';

type HubTab = "general" | "chainage" | "grid" | "slope";

export default function EarthworksEstimator() {
  const [activeTab, setActiveTab] = useState<HubTab>("general");
  const [designStandard, setDesignStandard] = useState("IS 1200 Part 27 (Measurement)");

  const tabs: { id: HubTab; label: string; icon: any }[] = [
    { id: "general", label: "General Earthwork", icon: Mountain },
    { id: "chainage", label: "Road Chainage & Mass Haul", icon: Route },
    { id: "grid", label: "Grid Method", icon: Grid },
    { id: "slope", label: "Slope Stability", icon: ShieldAlert },
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar for Sub-Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col pt-6 px-4 gap-2">
        <h2 className="text-xl font-semibold tabular-nums tracking-tight text-slate-800 dark:text-slate-900 dark:text-white px-2 mb-4">
          Earthworks
        </h2>
        
        <div className="px-2 mb-4">
          <label className="text-xs font-bold text-slate-500 uppercase">Reference</label>
          <select 
            value={designStandard}
            onChange={(e) => setDesignStandard(e.target.value)}
            className="w-full mt-1 bg-slate-100 dark:bg-slate-800 border-none p-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="IS 1200 Part 27 (Measurement)">IS 1200 Part 27 (Measurement)</option>
            <option value="IS 3764 (Excavation Safety)">IS 3764 (Safety)</option>
            <option value="USCS Classification">USCS Classification</option>
          </select>
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
              activeTab === tab.id
                ? "bg-amber-600 text-slate-900 dark:text-white shadow-md translate-x-1"
                : "text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-slate-800 dark:hover:text-amber-500"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-0 max-w-7xl mx-auto">
          {activeTab === "general" && <StandardEarthworks />}
          {activeTab === "chainage" && <ChainageVolumeEstimator />}
          {activeTab === "grid" && <GridEarthworkEstimator />}
          {activeTab === "slope" && <SlopeStability />}
        </div>
      </div>
    
      <CalculationHistory calculatorId="earthworks_tool" currentInputs={{}} />
</div>
  );
}


