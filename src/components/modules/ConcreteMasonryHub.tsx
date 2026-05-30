import React, { useState } from "react";
import { UniversalTabs } from "../ui/UniversalTabs";
import { Building2, Grid2X2, Columns, Droplet, PaintBucket, Layers, Square, Boxes, BookOpen } from "lucide-react";
import { SEO } from "../SEO";

import SlabEstimator from "./SlabEstimator";
import ColumnEstimator from "./ColumnEstimator";
import BeamCalculator from "./BeamCalculator";
import StaircaseCalculator from "./StaircaseCalculator";
import IsolatedFootingCalculator from "./IsolatedFootingCalculator";
import RetainingWallCalculator from "./RetainingWallCalculator";
import ConstructionMaterialEstimator from "./Calculators"; // to be wrapped
import MasterRccStructure from "./MasterRccStructure";
import { CalculationHistory } from '../ui/CalculationHistory';

type HubTab = "slab" | "column" | "beam" | "staircase" | "foundation" | "retaining-wall" | "general-concrete" | "bricks-blocks" | "plaster-finishes";

interface ConcreteMasonryHubProps {
  isEmbedded?: boolean;
  onNavigate?: (module: string) => void;
}

export default function ConcreteMasonryHub({ isEmbedded = false, onNavigate }: ConcreteMasonryHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("slab");
  const [brickBlockTab, setBrickBlockTab] = useState<"bricks" | "blocks">("bricks");

  const tabs: { id: HubTab; label: string; icon: any }[] = [
    { id: "slab", label: "Slab", icon: Grid2X2 },
    { id: "column", label: "Column", icon: Columns },
    { id: "beam", label: "Beam", icon: Layers },
    { id: "staircase", label: "Staircase", icon: Layers },
    { id: "foundation", label: "Foundation", icon: Square },
    { id: "retaining-wall", label: "Retaining Wall", icon: Building2 },
    { id: "general-concrete", label: "General Concrete", icon: Droplet },
    { id: "bricks-blocks", label: "Bricks & Blocks", icon: Boxes },
    { id: "plaster-finishes", label: "Plaster & Finishes", icon: PaintBucket },
  ];

  return (
    <div className={isEmbedded ? "w-full" : "max-w-7xl mx-auto pb-20"}>
      {!isEmbedded && (
        <>
          <SEO 
            title="Concrete & Masonry Hub | EstiPro"
            description="Unified hub for all concrete and masonry calculations: slabs, columns, foundations, bricks, blocks, and plaster calculations."
          />
          
          <div className="mb-6 md:mb-8 px-4 md:px-0">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-indigo-600" />
              Concrete & Masonry Hub
            </h1>
            <p className="text-slate-500 font-medium">
              Unified interface for RCC elements, retaining walls, foundations, blocks, and plaster.
              <br/>
              <span className="text-xs text-indigo-600 flex items-center gap-1 mt-1 font-bold">
                <BookOpen className="w-3 h-3" />
                Ref: IS 456:2000 / ACI 318 / BS 8110 for structural concrete elements.
              </span>
            </p>
          </div>
        </>
      )}

      <div className="flex flex-col gap-4 px-1 md:px-0">
        <UniversalTabs 
          tabs={tabs.map(t => ({ id: t.id, label: t.label, icon: t.icon ? <t.icon className="w-5 h-5" /> : undefined }))} 
          activeTab={activeTab} 
          onTabChange={(id) => setActiveTab(id as any)} 
        />

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-right-2 duration-300">
          {activeTab === "slab" && <SlabEstimator />}
          {activeTab === "column" && <ColumnEstimator />}
          {activeTab === "beam" && <BeamCalculator />}
          {activeTab === "staircase" && <StaircaseCalculator />}
          {activeTab === "foundation" && <IsolatedFootingCalculator isEmbedded />}
          {activeTab === "retaining-wall" && <RetainingWallCalculator isEmbedded />}
          {activeTab === "general-concrete" && <ConstructionMaterialEstimator forcedTab="concrete" hideHeader />}
          {activeTab === "bricks-blocks" && (
            <div className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-[24px] w-fit">
                <button
                  onClick={() => setBrickBlockTab("bricks")}
                  className={`px-6 py-2 rounded-[24px] text-sm font-bold transition-all ${
                    brickBlockTab === "bricks"
                      ? "bg-white  text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Brickwork
                </button>
                <button
                  onClick={() => setBrickBlockTab("blocks")}
                  className={`px-6 py-2 rounded-[24px] text-sm font-bold transition-all ${
                    brickBlockTab === "blocks"
                      ? "bg-white  text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Blockwork
                </button>
              </div>
              <ConstructionMaterialEstimator forcedTab={brickBlockTab} hideHeader key={brickBlockTab} />
            </div>
          )}
          {activeTab === "plaster-finishes" && <ConstructionMaterialEstimator forcedTab="plaster" hideHeader />}
        </div>
      </div>
    
    
      <CalculationHistory calculatorId="concretemasonryhub_tool" currentInputs={{}} />
</div>
  );
}
