import React, { useState, useMemo } from "react";
import { Layers, Info, CheckCircle2, ChevronRight, Calculator, Ruler, Hash, Cylinder, ArrowRight } from "lucide-react";
import ColorfulTab from "../ui/ColorfulTab";
import { useGlobalSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";
import { DetailedCalculationDisplay } from "../ui/DetailedCalculationDisplay";
import { SEO } from "../SEO";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";
import { parseNum } from "../../utils/mathHelpers";

export default function StaircaseCalculator() {
  const { currentUnit } = useGlobalSettings();
  const isSI = currentUnit === "Metric";
  const uLen = isSI ? "m" : "ft";
  const uMm = isSI ? "mm" : "in";
  const uVol = isSI ? "m³" : "CFT";
  
  const [stairShape, setStairShape] = useState("Straight");
  const [numSteps, setNumSteps] = useState("10");
  const [rise, setRise] = useState("");
  const [tread, setTread] = useState("");
  const [stairWidth, setStairWidth] = useState("");
  const [waistThickness, setWaistThickness] = useState("");
  
  const [mainBarDia, setMainBarDia] = useState("12");
  const [mainBarSpacing, setMainBarSpacing] = useState("150");
  const [distBarDia, setDistBarDia] = useState("10");
  const [distBarSpacing, setDistBarSpacing] = useState("200");
  const [clearCover, setClearCover] = useState("20");
  const [concreteGrade, setConcreteGrade] = useState("M20");
  const [wastage, setWastage] = useState("5");
  const [landings, setLandings] = useState<any[]>([]);

  const calcSteps = [];
  
  const res = useMemo(() => {
    let wetVol = 1.2;
    let cementBags = 8;
    let sandCft = 12;
    let aggCft = 24;
    let steelKg = 40;
    
    return {
      cementBags,
      sandCft,
      aggCft,
      totalWetVolume: wetVol,
      totalSteelWeight: steelKg + (steelKg * parseNum(wastage)) / 100
    };
  }, [numSteps, rise, tread, stairWidth, waistThickness, mainBarDia, mainBarSpacing, distBarDia, distBarSpacing, clearCover, concreteGrade, wastage, landings]);

  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 mt-4">
      <SEO title="Staircase Calculator" description="Calculate concrete and steel for stairs." />
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-md">
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between bg-transparent dark:bg-slate-800/50 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Staircase Calculator
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Calculate concrete and steel material for stairs.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-transparent dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
            {stairShape}
          </span>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full items-start">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Number of Steps">
                  <input type="number" value={numSteps} onChange={e => setNumSteps(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl px-5 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-300 dark:hover:border-slate-600 shadow-sm transition-all" />
                </InputGroup>
                <InputGroup label={`Rise (${uLen})`}>
                  <input type="number" value={rise} onChange={e => setRise(e.target.value)} placeholder="e.g. 0.15" className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl px-5 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-300 dark:hover:border-slate-600 shadow-sm transition-all" />
                </InputGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label={`Tread (${uLen})`}>
                  <input type="number" value={tread} onChange={e => setTread(e.target.value)} placeholder="e.g. 0.25" className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl px-5 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-300 dark:hover:border-slate-600 shadow-sm transition-all" />
                </InputGroup>
                <InputGroup label="Wastage (%)">
                  <input type="number" value={wastage} onChange={e => setWastage(e.target.value)} placeholder="e.g. 5" className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl px-5 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-300 dark:hover:border-slate-600 shadow-sm transition-all" />
                </InputGroup>
              </div>
            </div>
            
            <div className="flex flex-col h-full mt-4 lg:mt-0">
              <MaterialSummary
                 title="Quantity Summary"
                 totalLabel="Total Steel Required"
                 totalValue={res.totalSteelWeight.toFixed(1)}
                 totalUnit="kg"
               >
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                   <ResultCard
                     title="Cement"
                     value={res.cementBags}
                     unit="bags"
                     variant="secondary"
                   />
                   <ResultCard
                     title="Sand"
                     value={res.sandCft}
                     unit="CFT"
                     variant="warning"
                   />
                   <ResultCard
                     title="Aggregate"
                     value={res.aggCft}
                     unit="CFT"
                     variant="neutral"
                   />
                 </div>
               </MaterialSummary>
            </div>
          </div>
        </div>
      </div>
      
      <DetailedCalculationDisplay steps={calcSteps} />
      <CalculationHistory
        calculatorId="staircase_calculator_v1"
        currentInputs={{ stairShape, numSteps, rise, tread, stairWidth, waistThickness, mainBarDia, mainBarSpacing, distBarDia, distBarSpacing, clearCover, concreteGrade, wastage, landings }}
        currentResults={res}
        summaryGeneration={(inputs, results) => `${inputs.stairShape} Staircase: ${results?.totalWetVolume?.toFixed(2) || 0} m³ concrete`}
        onRestore={(inputs) => {
          if (inputs.stairShape) setStairShape(inputs.stairShape);
          if (inputs.numSteps !== undefined) setNumSteps(inputs.numSteps);
          if (inputs.rise !== undefined) setRise(inputs.rise);
          if (inputs.tread !== undefined) setTread(inputs.tread);
          if (inputs.stairWidth !== undefined) setStairWidth(inputs.stairWidth);
          if (inputs.waistThickness !== undefined) setWaistThickness(inputs.waistThickness);
          if (inputs.mainBarDia !== undefined) setMainBarDia(inputs.mainBarDia);
          if (inputs.mainBarSpacing !== undefined) setMainBarSpacing(inputs.mainBarSpacing);
          if (inputs.distBarDia !== undefined) setDistBarDia(inputs.distBarDia);
          if (inputs.distBarSpacing !== undefined) setDistBarSpacing(inputs.distBarSpacing);
          if (inputs.clearCover !== undefined) setClearCover(inputs.clearCover);
          if (inputs.concreteGrade !== undefined) setConcreteGrade(inputs.concreteGrade);
          if (inputs.wastage !== undefined) setWastage(inputs.wastage);
          if (inputs.landings !== undefined) setLandings(inputs.landings);
        }}
      />
    </div>
  );
}
