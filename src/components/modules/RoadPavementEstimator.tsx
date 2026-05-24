import React, { useState } from "react";
import { CalculationHistory } from "../ui/CalculationHistory";
import { Route, Layers, Droplet, Waves } from "lucide-react";
import { SEO } from "../SEO";
import RoadEstimator from "./RoadEstimator";
import RigidPavementEstimator from "./RigidPavementEstimator";
import AsphaltPavingCalculator from "./AsphaltPavingCalculator";
import SewerageEstimator from "./SewerageEstimator";
import ColorfulTab from "../ui/ColorfulTab";

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
        <h1 className="text-3xl font-extrabold text-text-primary mb-2 flex items-center gap-3">
          <Route className="w-8 h-8 text-amber-600 dark:text-amber-500" />
          Road & Pavement Estimator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          A centralized hub for roadway, pavement, layer materials, and surface coat calculations.
        </p>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 px-4 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <ColorfulTab index={idx} key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={<Icon className="w-5 h-5" />}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              colorTheme="amber"
            />
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mt-2">
          {activeTab === "flexible" && <RoadEstimator />}
          {activeTab === "rigid" && <RigidPavementEstimator />}
          {activeTab === "asphalt" && <AsphaltPavingCalculator />}
          {activeTab === "sewerage" && <SewerageEstimator />}
        </div>
      </div>
    
      <CalculationHistory
        calculatorId="roadpavementestimator"
        currentInputs={{}}
        currentResults={{}}
        estimationName="Road Pavement Estimator"
      />
</div>
  );
}
