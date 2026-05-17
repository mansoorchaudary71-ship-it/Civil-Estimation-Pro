import React, { useState } from "react";
import { Route, Layers, Droplet, Waves } from "lucide-react";
import { SEO } from "../SEO";
import RoadEstimator from "./RoadEstimator";
import RigidPavementEstimator from "./RigidPavementEstimator";
import AsphaltPavingCalculator from "./AsphaltPavingCalculator";
import SewerageEstimator from "./SewerageEstimator";

type Tab = "flexible" | "rigid" | "asphalt" | "sewerage";

export default function RoadPavementEstimator() {
  const [activeTab, setActiveTab] = useState<Tab>("flexible");

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "flexible", label: "Flexible Pavement", icon: Route },
    { id: "rigid", label: "Rigid Pavement", icon: Layers },
    { id: "asphalt", label: "Asphalt & Paving", icon: Droplet },
    { id: "sewerage", label: "Drainage & Sewerage", icon: Waves },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <SEO 
        title="Road & Pavement Estimator | EstiPro"
        description="Comprehensive tool for flexible, rigid, and asphalt pavement calculations."
      />
      
      <div className="mb-6 md:mb-8 px-4 md:px-0">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Route className="w-8 h-8 text-amber-600 dark:text-amber-500" />
          Road & Pavement Estimator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          A centralized hub for roadway, pavement, layer materials, and surface coat calculations.
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
                  ? "bg-amber-600 text-white border-amber-600 shadow-amber-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }
            `}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-amber-100" : "text-slate-400 dark:text-slate-500"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mt-2">
          {activeTab === "flexible" && <RoadEstimator />}
          {activeTab === "rigid" && <RigidPavementEstimator />}
          {activeTab === "asphalt" && <AsphaltPavingCalculator />}
          {activeTab === "sewerage" && <SewerageEstimator />}
        </div>
      </div>
    </div>
  );
}
