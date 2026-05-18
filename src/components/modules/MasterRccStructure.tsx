import React, { useState } from "react";
import { Building2, Grid2X2, Columns, FileSpreadsheet, Layers, AlignVerticalSpaceAround } from "lucide-react";
import { SEO } from "../SEO";

import SlabEstimator from "./SlabEstimator";
import ColumnEstimator from "./ColumnEstimator";
import BeamCalculator from "./BeamCalculator";
import BarBendingSchedule from "./BarBendingSchedule";
import StaircaseCalculator from "./StaircaseCalculator";

type RccTab = "slab" | "column" | "beam" | "staircase" | "bbs";

interface MasterRccProps {
  isEmbedded?: boolean;
}

export default function MasterRccStructure({ isEmbedded = false }: MasterRccProps) {
  const [activeTab, setActiveTab] = useState<RccTab>("slab");

  const tabs: { id: RccTab; label: string; icon: any }[] = [
    { id: "slab", label: "Slab Estimator", icon: Grid2X2 },
    { id: "column", label: "Column Estimator", icon: Columns },
    { id: "beam", label: "Beam Calculator", icon: AlignVerticalSpaceAround },
    { id: "staircase", label: "Staircase Calculator", icon: Layers },
    { id: "bbs", label: "BBS Generator", icon: FileSpreadsheet },
  ];

  return (
    <div className={isEmbedded ? "w-full" : "max-w-7xl mx-auto pb-20"}>
      {!isEmbedded && (
        <>
          <SEO 
            title="Master RCC Estimator | EstiPro"
            description="Unified hub for all concrete and steel calculations, including slabs, columns, beams, staircases, and Bar Bending Schedules."
          />
          
          <div className="mb-6 md:mb-8 px-4 md:px-0">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-indigo-600 dark:text-blue-400" />
              Master RCC Estimator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              A unified hub for advanced reinforced concrete and steel estimation tools.
            </p>
          </div>
        </>
      )}

      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-0">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex lg:flex-col overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-4 font-bold whitespace-nowrap transition-all text-left flex-shrink-0
                    ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-b-2 lg:border-b-0 lg:border-l-4 border-blue-600"
                        : "text-slate-600 dark:text-slate-400 border-b-2 lg:border-b-0 lg:border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 animate-in fade-in slide-in-from-right-2 duration-300">
          {activeTab === "slab" && <SlabEstimator />}
          {activeTab === "column" && <ColumnEstimator />}
          {activeTab === "beam" && <BeamCalculator />}
          {activeTab === "staircase" && <StaircaseCalculator />}
          {activeTab === "bbs" && <BarBendingSchedule />}
        </div>
      </div>
    </div>
  );
}
