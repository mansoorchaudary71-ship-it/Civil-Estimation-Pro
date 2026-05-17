import React, { useState } from "react";
import { Building2, Grid2X2, Columns, FileSpreadsheet, Layers, Menu } from "lucide-react";
import { SEO } from "../SEO";

import SlabEstimator from "./SlabEstimator";
import ColumnEstimator from "./ColumnEstimator";
import BeamCalculator from "./BeamCalculator";
import BarBendingSchedule from "./BarBendingSchedule";
import StaircaseCalculator from "./StaircaseCalculator";

type RccTab = "slab" | "column" | "beam" | "bbs" | "staircase";

export default function MasterRccStructure() {
  const [activeTab, setActiveTab] = useState<RccTab>("slab");

  const tabs: { id: RccTab; label: string; icon: any }[] = [
    { id: "slab", label: "Slab Estimator", icon: Grid2X2 },
    { id: "column", label: "Column Estimator", icon: Columns },
    { id: "beam", label: "Beam Calculator", icon: Grid2X2 },
    { id: "staircase", label: "Staircase Calculator", icon: Layers },
    { id: "bbs", label: "BBS Generator", icon: FileSpreadsheet },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <SEO 
        title="Master RCC Structure | EstiPro"
        description="Central hub for all concrete and steel calculations, including slabs, columns, beams, staircases, and BBS generator."
      />
      
      <div className="mb-6 md:mb-8 px-4 md:px-0">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Master RCC Structure
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          A centralized hub for advanced reinforced concrete and steel estimation tools.
        </p>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 px-4 md:px-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all flex-shrink-0 border shadow-sm
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }
            `}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-blue-100" : "text-slate-400 dark:text-slate-500"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "slab" && <SlabEstimator />}
        {activeTab === "column" && <ColumnEstimator />}
        {activeTab === "beam" && <BeamCalculator />}
        {activeTab === "staircase" && <StaircaseCalculator />}
        {activeTab === "bbs" && <BarBendingSchedule />}
      </div>
    </div>
  );
}
