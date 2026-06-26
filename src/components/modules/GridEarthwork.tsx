import React, { useState } from "react";
import {
  Truck,
  Calculator,
  Ruler,
  Hash,
  Plus,
  Layers,
  ArrowRight,
  Grid2X2,
} from "lucide-react";
import { MaterialSummary } from "../ui/MaterialSummary";
import { ResultCard } from "../ui/ResultCard";

import { useSettings } from "../../context/SettingsContext";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { CalculationHistory } from "../ui/CalculationHistory";
export default function GridEarthworkEstimator() {
  const { settings, formatCurrency, convertAmount, convertAmountToRaw } =
    useSettings();
  const isMetric = settings.measurement === "SI";
  const unitL = isMetric ? "m" : "ft";
  const unitA = isMetric ? "m²" : "ft²";
  const unitV = isMetric ? "m³" : "ft³";
  const [gridLength, setGridLength] = useState<string>("10");
  const [gridWidth, setGridWidth] = useState<string>("10");
  const [cornerTL, setCornerTL] = useState({
    existing: "100.5",
    proposed: "100.0",
  });
  const [cornerTR, setCornerTR] = useState({
    existing: "100.8",
    proposed: "100.0",
  });
  const [cornerBL, setCornerBL] = useState({
    existing: "100.2",
    proposed: "100.0",
  });
  const [cornerBR, setCornerBR] = useState({
    existing: "100.4",
    proposed: "100.0",
  });
  const L = parseFloat(gridLength) || 0;
  const W = parseFloat(gridWidth) || 0;
  const area = L * W;
  const tlE = parseFloat(cornerTL.existing) || 0;
  const tlP = parseFloat(cornerTL.proposed) || 0;
  const trE = parseFloat(cornerTR.existing) || 0;
  const trP = parseFloat(cornerTR.proposed) || 0;
  const blE = parseFloat(cornerBL.existing) || 0;
  const blP = parseFloat(cornerBL.proposed) || 0;
  const brE = parseFloat(cornerBR.existing) || 0;
  const brP = parseFloat(cornerBR.proposed) || 0;
  const tlDiff = tlE - tlP;
  const trDiff = trE - trP;
  const blDiff = blE - blP;
  const brDiff = brE - brP;
  const avgExisting = (tlE + trE + blE + brE) / 4;
  const avgProposed = (tlP + trP + blP + brP) / 4;
  const avgDepth = (tlDiff + trDiff + blDiff + brDiff) / 4;
  const totalVolume = Math.abs(avgDepth) * area;
  const isCut = avgDepth > 0;
  const isFill = avgDepth < 0;
  return (
    <div className="w-full bg-transparent text-gray-900 font-sans mt-4">
      <div className="space-y-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent pb-1">
            Grid Method Volume
          </h2>
          <GlobalSettingsToggle align="left" showCurrency={false} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-blue-50 text-indigo-600 rounded-[24px]">
                  <Grid2X2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-800">
                  Grid Dimensions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                    Length [{unitL}]
                  </label>
                  <input
                    type="number" inputMode="decimal"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-[24px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow min-h-[44px]"
                    value={gridLength}
                    onChange={(e) => setGridLength(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                    Width [{unitL}]
                  </label>
                  <input
                    type="number" inputMode="decimal"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-[24px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow min-h-[44px]"
                    value={gridWidth}
                    onChange={(e) => setGridWidth(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-[24px] font-medium text-gray-600 flex justify-between">
                <span>Grid Area:</span>
                <span className="font-bold text-gray-800">
                  {area.toFixed(2)} {unitA}
                </span>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-[24px]">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-800">
                  Corner Elevations
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6 relative">
                {/* Visual Connector Lines */}
                <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-100 -translate-y-1/2" />
                <div className="absolute left-1/2 top-6 bottom-6 w-0.5 bg-gray-100 -translate-x-1/2" />
                {/* Top Left */}
                <div className="bg-white border-2 border-gray-100 px-4 py-3 rounded-[24px] relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Top Left
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-[16px] text-gray-700">
                      Corner 1
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Existing
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerTL.existing}
                        onChange={(e) =>
                          setCornerTL({ ...cornerTL, existing: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Proposed
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerTL.proposed}
                        onChange={(e) =>
                          setCornerTL({ ...cornerTL, proposed: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* Top Right */}
                <div className="bg-white border-2 border-gray-100 px-4 py-3 rounded-[24px] relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Top Right
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-[16px] text-gray-700">
                      Corner 2
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Existing
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerTR.existing}
                        onChange={(e) =>
                          setCornerTR({ ...cornerTR, existing: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Proposed
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerTR.proposed}
                        onChange={(e) =>
                          setCornerTR({ ...cornerTR, proposed: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* Bottom Left */}
                <div className="bg-white border-2 border-gray-100 px-4 py-3 rounded-[24px] relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Bottom Left
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-[16px] text-gray-700">
                      Corner 3
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Existing
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerBL.existing}
                        onChange={(e) =>
                          setCornerBL({ ...cornerBL, existing: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Proposed
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerBL.proposed}
                        onChange={(e) =>
                          setCornerBL({ ...cornerBL, proposed: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* Bottom Right */}
                <div className="bg-white border-2 border-gray-100 px-4 py-3 rounded-[24px] relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Bottom Right
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-[16px] text-gray-700">
                      Corner 4
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Existing
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerBR.existing}
                        onChange={(e) =>
                          setCornerBR({ ...cornerBR, existing: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Proposed
                      </label>
                      <input
                        type="number" inputMode="decimal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
                        value={cornerBR.proposed}
                        onChange={(e) =>
                          setCornerBR({ ...cornerBR, proposed: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-6 flex-1 flex flex-col mt-6">
                 <MaterialSummary
                   title="Results (Grid Leveling)"
                   totalLabel={`Total ${isCut ? "Cut" : isFill ? "Fill" : ""} Volume`}
                   totalValue={totalVolume.toFixed(2)}
                   totalUnit={unitV || ""}
                 >
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                     <ResultCard
                       title="Avg Existing Elev."
                       value={avgExisting.toFixed(3)}
                       unit={unitL || ""}
                       variant="neutral"
                     />
                     <ResultCard
                       title="Avg Proposed Elev."
                       value={avgProposed.toFixed(3)}
                       unit={unitL || ""}
                       variant="neutral"
                     />
                     <ResultCard
                       title={isCut ? "Average Cut Depth" : isFill ? "Average Fill Depth" : "Average Depth"}
                       value={Math.abs(avgDepth).toFixed(3)}
                       unit={unitL || ""}
                       variant="neutral"
                     />
                   </div>
                 </MaterialSummary>
          </section>
        </div>
      </div>
      <CalculationHistory
        calculatorId="grid_earthwork_v1"
        estimationName="Grid Earthwork"
        currentInputs={{ gridLength, gridWidth, cornerTL, cornerTR, cornerBL, cornerBR }}
        currentResults={{ totalVolume: totalVolume.toFixed(2), avgDepth: avgDepth.toFixed(3) }}
        summaryGeneration={(inputs, res) => `Volume: ${res.totalVolume} ${unitV}`}
        onRestore={(inputs) => {
          if (inputs.gridLength) setGridLength(inputs.gridLength);
          if (inputs.gridWidth) setGridWidth(inputs.gridWidth);
          if (inputs.cornerTL) setCornerTL(inputs.cornerTL);
          if (inputs.cornerTR) setCornerTR(inputs.cornerTR);
          if (inputs.cornerBL) setCornerBL(inputs.cornerBL);
          if (inputs.cornerBR) setCornerBR(inputs.cornerBR);
        }}
      />
    </div>
  );
}
