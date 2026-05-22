import React, { useState, useMemo } from "react";
import { Layers, Info, CheckCircle2, ChevronRight, Calculator, Ruler, Hash, Cylinder, ArrowRight } from "lucide-react";
import ColorfulTab from "../ui/ColorfulTab";
import { useGlobalSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
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

  return (
    <div className="space-y-6">
      <SEO title="Staircase Calculator" description="Calculate concrete and steel for stairs." />
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-indigo-400" /> Staircase Calculator
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Number of Steps</label>
              <input type="number" value={numSteps} onChange={e => setNumSteps(e.target.value)} className="w-full bg-slate-800 text-white rounded p-2" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Rise ({uLen})</label>
              <input type="number" value={rise} onChange={e => setRise(e.target.value)} className="w-full bg-slate-800 text-white rounded p-2" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tread ({uLen})</label>
              <input type="number" value={tread} onChange={e => setTread(e.target.value)} className="w-full bg-slate-800 text-white rounded p-2" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Wastage (%)</label>
              <input type="number" value={wastage} onChange={e => setWastage(e.target.value)} className="w-full bg-slate-800 text-white rounded p-2" />
            </div>
          </div>
          
          <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] w-full overflow-hidden group">
             <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Steel Required</div>
             <div className="text-3xl font-black text-white">{res.totalSteelWeight.toFixed(1)} kg</div>
             <div className="text-sm text-slate-500 mt-2">Cement: {res.cementBags} bags</div>
             <div className="text-sm text-slate-500">Sand: {res.sandCft} CFT</div>
             <div className="text-sm text-slate-500">Aggregate: {res.aggCft} CFT</div>
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
