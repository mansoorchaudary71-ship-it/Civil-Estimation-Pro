import React, { useState, useMemo } from "react";
import { Layers, Info, CheckCircle2, ChevronRight, Calculator, Ruler, Hash, Cylinder, ArrowRight } from "lucide-react";
import ColorfulTab from "../ui/ColorfulTab";
import { useGlobalSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { ResultCard } from "../ui/ResultCard";
import { MaterialSummary } from "../ui/MaterialSummary";
import { DetailedCalculationDisplay } from "../ui/DetailedCalculationDisplay";
import { NumberInput } from "../ui/NumberInput";
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
  const [rise, setRise] = useState("0.15");
  const [tread, setTread] = useState("0.25");
  const [stairWidth, setStairWidth] = useState("1.2");
  const [waistThickness, setWaistThickness] = useState("0.15");
  
  const [mainBarDia, setMainBarDia] = useState("12");
  const [mainBarSpacing, setMainBarSpacing] = useState("150");
  const [distBarDia, setDistBarDia] = useState("10");
  const [distBarSpacing, setDistBarSpacing] = useState("200");
  const [clearCover, setClearCover] = useState("20");
  const [concreteGrade, setConcreteGrade] = useState("M20");
  const [wastage, setWastage] = useState("5");
  const [landings, setLandings] = useState<any[]>([]);

  const { res, calcSteps } = useMemo(() => {
    let wetVol = 0;
    let cementBags = 0;
    let sandCft = 0;
    let aggCft = 0;
    let steelKg = 0;
    
    const steps: any[] = [];
    
    const stepsCount = parseNum(numSteps) || 0;
    let r = parseNum(rise) || 0;
    let t = parseNum(tread) || 0;
    let w = parseNum(stairWidth) || 0;
    const was = parseNum(wastage) || 0;

    if (r > 0 && t > 0 && w > 0 && stepsCount > 0) {
      if (!isSI && uLen === "ft") {
        r = r * 0.3048;
        t = t * 0.3048;
        w = w * 0.3048;
      }

      // Step 1: Volume of one step = (Rise × Tread × Width) / 2
      const volOneStep = (r * t * w) / 2;
      steps.push({
        stepName: "1. Volume of One Step",
        equation: "V_step = (Rise × Tread × Width) / 2",
        variables: [
          { name: "Rise", value: r, unit: "m" },
          { name: "Tread", value: t, unit: "m" },
          { name: "Width", value: w, unit: "m" }
        ],
        substitution: `V_step = (${r.toFixed(3)} × ${t.toFixed(3)} × ${w.toFixed(3)}) / 2`,
        result: parseFloat(volOneStep.toFixed(4)),
        resultUnit: "m³",
        resultColor: "emerald"
      });

      // Step 2: Total concrete volume = Volume per step × Number of steps
      const totalConcreteVol = volOneStep * stepsCount;
      steps.push({
        stepName: "2. Total Wet Concrete Volume",
        equation: "V_total_wet = V_step × Number of steps",
        variables: [
          { name: "V_step", value: volOneStep.toFixed(4), unit: "m³" },
          { name: "Steps", value: stepsCount }
        ],
        substitution: `V_total_wet = ${volOneStep.toFixed(4)} × ${stepsCount}`,
        result: parseFloat(totalConcreteVol.toFixed(4)),
        resultUnit: "m³",
        resultColor: "emerald"
      });

      // Step 3: With wastage
      const totalWithWastage = totalConcreteVol * (1 + (was / 100));
      steps.push({
        stepName: "3. With Wastage",
        equation: "V_wastage = Total × (1 + wastage%)",
        variables: [
          { name: "Total", value: totalConcreteVol.toFixed(4), unit: "m³" },
          { name: "Wastage", value: was, unit: "%" }
        ],
        substitution: `V_wastage = ${totalConcreteVol.toFixed(4)} × 1.${was.toString().padStart(2, '0')}`,
        result: parseFloat(totalWithWastage.toFixed(4)),
        resultUnit: "m³",
        resultColor: "emerald"
      });

      // Step 3.5: Dry Volume conversion
      const dryVol = totalWithWastage * 1.54;
      wetVol = totalWithWastage;
      
      const parts = concreteGrade.match(/\(([\d.]+):([\d.]+):([\d.]+)\)/);
      let cPart = 1, sPart = 1.5, aPart = 3;
      if (parts) {
        cPart = parseFloat(parts[1]);
        sPart = parseFloat(parts[2]);
        aPart = parseFloat(parts[3]);
      }
      const sum = cPart + sPart + aPart;

      // Step 4: Cement bags
      cementBags = Math.ceil((dryVol * (cPart / sum)) / 0.0347);
      steps.push({
        stepName: "4. Cement Bags",
        equation: "Bags = (Dry Volume × cement_ratio / total_ratio) / 0.0347",
        insight: "System Rule: V_dry = V_wet * 1.54. Then 1 bag = 50kg = 0.0347 m³. Rule Enforcement Active.",
        variables: [
          { name: "Dry Volume", value: dryVol.toFixed(4), unit: "m³" },
          { name: "Ratio (C:S:A)", value: `${cPart}:${sPart}:${aPart}` }
        ],
        substitution: `Bags = (${dryVol.toFixed(4)} × ${cPart} / ${sum}) / 0.0347`,
        result: cementBags,
        resultUnit: "bags",
        resultColor: "purple"
      });

      // Step 5: Sand CFT = Dry Volume × sand ratio / total ratio × 35.3147
      sandCft = (dryVol * (sPart / sum)) * 35.3147;
      steps.push({
        stepName: "5. Sand Volume",
        equation: "Sand (CFT) = Dry Volume × (sand_ratio / total_ratio) × 35.3147",
        variables: [
          { name: "Dry Volume", value: dryVol.toFixed(4), unit: "m³" }
        ],
        substitution: `Sand = ${dryVol.toFixed(4)} × (${sPart} / ${sum}) × 35.3147`,
        result: parseFloat(sandCft.toFixed(2)),
        resultUnit: "CFT",
        resultColor: "blue"
      });

      // Step 6: Aggregate CFT = Dry Volume × aggregate ratio / total ratio × 35.3147
      aggCft = (dryVol * (aPart / sum)) * 35.3147;
      steps.push({
        stepName: "6. Aggregate Volume",
        equation: "Aggregate (CFT) = Dry Volume × (aggregate_ratio / total_ratio) × 35.3147",
        variables: [
          { name: "Dry Volume", value: dryVol.toFixed(4), unit: "m³" }
        ],
        substitution: `Aggregate = ${dryVol.toFixed(4)} × (${aPart} / ${sum}) × 35.3147`,
        result: parseFloat(aggCft.toFixed(2)),
        resultUnit: "CFT",
        resultColor: "orange"
      });

      // Step 7: Steel = Total concrete volume × 1% × 7850 kg/m³
      steelKg = totalConcreteVol * 0.01 * 7850;
      steps.push({
        stepName: "7. Steel Requirement",
        equation: "Steel (kg) = Total Wet Volume × 1% × 7850",
        variables: [
          { name: "Total Wet Vol", value: totalConcreteVol.toFixed(4), unit: "m³" }
        ],
        substitution: `Steel = ${totalConcreteVol.toFixed(4)} × 0.01 × 7850`,
        result: parseFloat(steelKg.toFixed(2)),
        resultUnit: "kg",
        resultColor: "emerald"
      });
    }
    
    return {
      res: {
        cementBags,
        sandCft: parseFloat(sandCft.toFixed(2)),
        aggCft: parseFloat(aggCft.toFixed(2)),
        totalWetVolume: wetVol,
        totalSteelWeight: steelKg + (steelKg * was) / 100
      },
      calcSteps: steps
    };
  }, [numSteps, rise, tread, stairWidth, waistThickness, mainBarDia, mainBarSpacing, distBarDia, distBarSpacing, clearCover, concreteGrade, wastage, landings, isSI, uLen]);

  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );

  const rVal = parseFloat(rise) || 0;
  const tVal = parseFloat(tread) || 0;
  let warningText = "";
  if (rVal > 0 && tVal > 0) {
    const rMm = isSI ? rVal * 1000 : rVal * 304.8;
    const tMm = isSI ? tVal * 1000 : tVal * 304.8;
    const formula = (2 * rMm) + tMm;
    if (formula < 600 || formula > 640) {
      warningText = `Warning: 2R + T = ${Math.round(formula)}mm — outside 600-640mm ideal range. Suggest R=150mm, T=300mm.`;
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <SEO title="Staircase Calculator" description="Calculate concrete and steel for stairs." />
      <div className="w-full bg-bg-card border border-border-color rounded-[2rem] overflow-hidden shadow-md">
        <div className="px-6 md:px-8 py-5 border-b border-border-color flex flex-col md:flex-row items-start md:items-center justify-between bg-transparent dark:bg-slate-800/50 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Staircase Calculator
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Calculate concrete and steel material for stairs.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-transparent dark:bg-slate-800 border border-border-color text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
            {stairShape}
          </span>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full items-start">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Number of Steps">
                  <NumberInput value={numSteps} onChange={(val) => setNumSteps(val.toString())} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-2xl font-semibold shadow-sm transition-all" />
                </InputGroup>
                <InputGroup label={`Rise (${uLen})`}>
                  <NumberInput value={rise} onChange={(val) => setRise(val.toString())} placeholder="e.g. 0.15" step="0.01" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-2xl font-semibold shadow-sm transition-all" />
                </InputGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label={`Tread (${uLen})`}>
                  <NumberInput value={tread} onChange={(val) => setTread(val.toString())} placeholder="e.g. 0.25" step="0.01" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-2xl font-semibold shadow-sm transition-all" />
                </InputGroup>
                <InputGroup label={`Width (${uLen})`}>
                  <NumberInput value={stairWidth} onChange={(val) => setStairWidth(val.toString())} placeholder="e.g. 1.2" step="0.1" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-2xl font-semibold shadow-sm transition-all" />
                </InputGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Mix Ratio">
                  <select value={concreteGrade} onChange={e => setConcreteGrade(e.target.value)} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-2xl px-5 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-300 dark:hover:border-slate-600 shadow-sm transition-all">
                    <option value="M10 (1:3:6)">M10 (1:3:6)</option>
                    <option value="M15 (1:2:4)">M15 (1:2:4)</option>
                    <option value="M20 (1:1.5:3)">M20 (1:1.5:3)</option>
                    <option value="M25 (1:1:2)">M25 (1:1:2)</option>
                  </select>
                </InputGroup>
                <InputGroup label="Wastage (%)">
                  <NumberInput value={wastage} onChange={(val) => setWastage(val.toString())} placeholder="e.g. 5" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-2xl font-semibold shadow-sm transition-all" />
                </InputGroup>
              </div>
              
              {warningText && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-2xl text-sm font-bold flex items-start gap-3">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{warningText}</p>
                </div>
              )}
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
