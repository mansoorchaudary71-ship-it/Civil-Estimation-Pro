import React, { useState } from "react";
import { Shovel } from "lucide-react";
import StandardEarthworks from "./EarthworksBase";
import TrenchExcavationEstimator from "./TrenchExcavation";
import GridEarthworkEstimator from "./GridEarthwork";

export default function EarthworksEstimator() {
  const [activeMethod, setActiveMethod] = useState<"standard" | "trench" | "grid">("standard");

  return (
    <div className="w-full text-gray-900 font-sans md:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-6 px-4 md:px-0">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Shovel className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Earthworks & Excavation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Calculate calculation volumes for standard grading, trenches, and grid-method excavations.
          </p>
          
          <div className="mt-6 flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Calculation Method:
            </label>
            <select
              title="Calculation Method"
              value={activeMethod}
              onChange={(e) => setActiveMethod(e.target.value as "standard" | "trench" | "grid")}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm"
            >
              <option value="standard">Standard Area/Depth</option>
              <option value="trench">Trenching</option>
              <option value="grid">Grid Method</option>
            </select>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="mt-2">
            {activeMethod === "standard" && <StandardEarthworks />}
            {activeMethod === "trench" && <TrenchExcavationEstimator />}
            {activeMethod === "grid" && <GridEarthworkEstimator />}
          </div>
        </div>
      </div>
    </div>
  );
}


