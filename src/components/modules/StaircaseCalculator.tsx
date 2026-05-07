import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Info, CheckCircle2, ChevronRight, Calculator, Ruler, Hash, Cylinder, ArrowRight } from 'lucide-react';
import ShareButtonWithPopup from "./ShareMenu";

interface StaircaseCalculatorProps {
  isEmbedded?: boolean;
  onCalculate?: (results: any) => void;
}

export default function StaircaseCalculator({ isEmbedded = false, onCalculate }: StaircaseCalculatorProps) {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [stairShape, setStairShape] = useState<'straight' | 'l-shape' | 'u-shape' | 'spiral'>('straight');
  
  const [numSteps, setNumSteps] = useState<number>(10);
  const [rise, setRise] = useState<number>(150); // mm/in
  const [tread, setTread] = useState<number>(250); // mm/in
  const [stairWidth, setStairWidth] = useState<number>(1.2); // m/ft
  const [waistThickness, setWaistThickness] = useState<number>(150); // mm/in
  
  const [landings, setLandings] = useState([{ id: 1, length: 1.2, width: 1.2, thickness: 150 }]);

  // Apply default parameters based on shape
  useEffect(() => {
    if (stairShape === 'straight') {
      setNumSteps(12);
      setLandings([]);
    } else if (stairShape === 'l-shape') {
      setNumSteps(16);
      setLandings([{ id: Date.now(), length: 1.2, width: 1.2, thickness: 150 }]);
    } else if (stairShape === 'u-shape') {
      setNumSteps(20);
      setLandings([{ id: Date.now(), length: 2.5, width: 1.2, thickness: 150 }]);
    } else if (stairShape === 'spiral') {
      setNumSteps(15);
      setLandings([]);
    }
  }, [stairShape]);
  
  const [mainBarDia, setMainBarDia] = useState<number>(12); // mm
  const [mainBarSpacing, setMainBarSpacing] = useState<number>(150); // mm
  const [distBarDia, setDistBarDia] = useState<number>(10); // mm
  const [distBarSpacing, setDistBarSpacing] = useState<number>(200); // mm
  const [clearCover, setClearCover] = useState<number>(20); // mm
  
  const [concreteGrade, setConcreteGrade] = useState<'M15' | 'M20' | 'M25'>('M20');
  const [wastage, setWastage] = useState<number>(5); // %

  const addLanding = () => {
    setLandings([...landings, { id: Date.now(), length: 1.2, width: 1.2, thickness: 150 }]);
  };
  
  const updateLanding = (id: number, field: string, value: number) => {
    setLandings(landings.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  
  const removeLanding = (id: number) => {
    setLandings(landings.filter(l => l.id !== id));
  };

  const calculateResults = useCallback(() => {
    const isMetric = unitSystem === 'metric';
    // Convert everything to meters for calculation
    let riseM = isMetric ? rise / 1000 : (rise * 25.4) / 1000;
    let treadM = isMetric ? tread / 1000 : (tread * 25.4) / 1000;
    let waistThicknessM = isMetric ? waistThickness / 1000 : (waistThickness * 25.4) / 1000;
    let clearCoverM = isMetric ? clearCover / 1000 : (clearCover * 25.4) / 1000;
    let stairWidthM = isMetric ? stairWidth : stairWidth * 0.3048;
    
    // Concrete Volume
    const stepVolume = (0.5 * riseM * treadM * stairWidthM);
    const totalStepVolume = numSteps * stepVolume;
    
    const inclinedLength = numSteps * Math.sqrt(Math.pow(riseM, 2) + Math.pow(treadM, 2));
    const waistVolume = inclinedLength * stairWidthM * waistThicknessM;
    
    let landingsVolume = 0;
    let totalLandingLength = 0;
    landings.forEach(l => {
      let lLengthM = isMetric ? l.length : l.length * 0.3048;
      let lWidthM = isMetric ? l.width : l.width * 0.3048;
      let lThicknessM = isMetric ? l.thickness / 1000 : (l.thickness * 25.4) / 1000;
      landingsVolume += lLengthM * lWidthM * lThicknessM;
      totalLandingLength += lLengthM;
    });
    
    const totalWetVolume = totalStepVolume + waistVolume + landingsVolume;
    const totalDryVolume = totalWetVolume * 1.54;
    
    // Mix Ratios
    let cementRatio = 1, sandRatio = 1.5, structRatio = 3;
    if (concreteGrade === 'M15') { sandRatio = 2; structRatio = 4; }
    else if (concreteGrade === 'M25') { sandRatio = 1; structRatio = 2; }
    const totalRatio = cementRatio + sandRatio + structRatio;
    
    const cementVol = totalDryVolume * (cementRatio / totalRatio);
    const sandVol = totalDryVolume * (sandRatio / totalRatio);
    const aggVol = totalDryVolume * (structRatio / totalRatio);
    
    const cementBags = cementVol * 28.8; // 1m3 = 28.8 bags approx
    const sandCft = sandVol * 35.3147;
    const aggCft = aggVol * 35.3147;
    
    // Steel Calculation
    let mainBarSpacingM = isMetric ? mainBarSpacing / 1000 : (mainBarSpacing * 25.4) / 1000;
    let distBarSpacingM = isMetric ? distBarSpacing / 1000 : (distBarSpacing * 25.4) / 1000;
    let mainBarDiaMm = isMetric ? mainBarDia : mainBarDia * 25.4; 
    let distBarDiaMm = isMetric ? distBarDia : distBarDia * 25.4;

    const totalWalkLength = inclinedLength + totalLandingLength;
    const mainBarLength = totalWalkLength - (2 * clearCoverM);
    const numMainBars = Math.floor((stairWidthM - (2 * clearCoverM)) / mainBarSpacingM) + 1;
    const totalMainBarLengthCut = numMainBars * mainBarLength;
    const mainBarWeight = totalMainBarLengthCut * Math.pow(mainBarDiaMm, 2) / 162;
    
    const distBarLength = stairWidthM - (2 * clearCoverM);
    const numDistBars = Math.floor(totalWalkLength / distBarSpacingM) + 1;
    const totalDistBarLengthCut = numDistBars * distBarLength;
    const distBarWeight = totalDistBarLengthCut * Math.pow(distBarDiaMm, 2) / 162;
    
    const totalSteelWeight = (mainBarWeight + distBarWeight) * (1 + wastage / 100);
    
    const results = {
      totalWetVolume,
      totalDryVolume,
      cementBags,
      sandCft,
      aggCft,
      totalSteelWeight,
      totalMainBarLengthCut,
      totalDistBarLengthCut
    };
    
    if (onCalculate) {
      onCalculate(results);
    }
    return results;
  }, [numSteps, rise, tread, stairWidth, waistThickness, landings, mainBarDia, mainBarSpacing, distBarDia, distBarSpacing, clearCover, concreteGrade, wastage, unitSystem, onCalculate]);

  const res = calculateResults();
  const isMetric = unitSystem === 'metric';
  const uMm = isMetric ? 'mm' : 'in';
  const uM = isMetric ? 'm' : 'ft';

  return (
    <div className={`w-full ${isEmbedded ? '' : 'p-4 md:p-8 max-w-7xl mx-auto'}`}>
      {!isEmbedded && (
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Staircase Calculator</h1>
            <p className="text-slate-500 mt-2 font-medium">Calculate precise concrete and steel quantities for RCC staircases.</p>
          </div>
          <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl w-max">
            <button 
              onClick={() => setUnitSystem('metric')} 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
            <button 
              onClick={() => setUnitSystem('imperial')} 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-3 duration-500 delay-50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Staircase Design</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['straight', 'l-shape', 'u-shape', 'spiral'] as const).map(shape => (
            <button 
              key={shape}
              onClick={() => setStairShape(shape)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${stairShape === shape ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/50 text-slate-600 dark:text-slate-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'}`}
            >
              <div className="font-semibold capitalize">{shape.replace('-', ' ')}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                <Ruler className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Stair Dimensions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Number of Steps</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Hash className="w-4 h-4" /></span>
                  <input type="number" min={1} value={numSteps || ''} onChange={(e) => setNumSteps(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Rise Height ({uMm})</label>
                <div className="relative">
                  <input type="number" value={rise || ''} onChange={(e) => setRise(Number(e.target.value))} className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">{uMm}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tread/Run Length ({uMm})</label>
                <div className="relative">
                  <input type="number" value={tread || ''} onChange={(e) => setTread(Number(e.target.value))} className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">{uMm}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Staircase Width ({uM})</label>
                <div className="relative">
                  <input type="number" step="0.1" value={stairWidth || ''} onChange={(e) => setStairWidth(Number(e.target.value))} className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">{uM}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Waist Slab Thickness ({uMm})</label>
                <div className="relative">
                  <input type="number" value={waistThickness || ''} onChange={(e) => setWaistThickness(Number(e.target.value))} className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">{uMm}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Landings</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {landings.map((landing, index) => (
                <div key={landing.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 md:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Landing {index + 1} Length ({uM})</label>
                    <input type="number" step="0.1" value={landing.length || ''} onChange={(e) => updateLanding(landing.id, 'length', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Width ({uM})</label>
                    <input type="number" step="0.1" value={landing.width || ''} onChange={(e) => updateLanding(landing.id, 'width', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Thickness ({uMm})</label>
                    <input type="number" value={landing.thickness || ''} onChange={(e) => updateLanding(landing.id, 'thickness', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition-all font-medium" />
                  </div>
                  <div className="pb-1">
                    <button onClick={() => removeLanding(landing.id)} className="w-full py-2.5 text-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:hover:bg-transparent" disabled={landings.length === 1}>Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={addLanding} className="w-full mt-2 py-3 border-2 border-dashed border-purple-200 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-600 rounded-2xl text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                + Add another landing
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
                <Cylinder className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Steel & Concrete Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Concrete Mix Grade</label>
                <div className="flex gap-2">
                  {(['M15', 'M20', 'M25'] as const).map(grade => (
                    <button 
                      key={grade} 
                      onClick={() => setConcreteGrade(grade)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        concreteGrade === grade 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Clear Cover ({uMm})</label>
                <div className="relative">
                  <input type="number" value={clearCover || ''} onChange={(e) => setClearCover(Number(e.target.value))} className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium" />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">{uMm}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Wastage (%)</label>
                <div className="relative">
                  <input type="number" value={wastage || ''} onChange={(e) => setWastage(Number(e.target.value))} className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium" />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Main Reinforcement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Bar Dia ({uMm})</label>
                    <input type="number" step="0.1" value={mainBarDia || ''} onChange={(e) => setMainBarDia(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Spacing ({uMm})</label>
                    <input type="number" value={mainBarSpacing || ''} onChange={(e) => setMainBarSpacing(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Distribution Bars
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Bar Dia ({uMm})</label>
                    <input type="number" step="0.1" value={distBarDia || ''} onChange={(e) => setDistBarDia(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Spacing ({uMm})</label>
                    <input type="number" value={distBarSpacing || ''} onChange={(e) => setDistBarSpacing(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" /> Component Diagram
            </h3>
            <div className="w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-black/20 p-8 flex justify-center items-center shadow-inner border border-slate-100 dark:border-slate-800/50">
              <svg viewBox="0 0 400 250" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 50,200 L 150,200 L 150,150 L 200,150 L 200,100 L 250,100 L 250,50 L 350,50" strokeWidth="4" className="text-slate-800 dark:text-slate-200" />
                <path d="M 50,220 L 170,220 L 270,70 L 350,70" strokeOpacity="0.3" strokeWidth="4" className="text-blue-500" stroke="currentColor" />
                <line x1="160" y1="210" x2="160" y2="150" strokeDasharray="4 4" strokeWidth="2" className="text-red-500" stroke="currentColor" />
                <line x1="150" y1="160" x2="200" y2="160" strokeDasharray="4 4" strokeWidth="2" className="text-purple-500" stroke="currentColor" />
                <text x="120" y="180" fill="currentColor" stroke="none" fontSize="14" className="text-red-500" fontWeight="bold">Rise</text>
                <text x="175" y="140" fill="currentColor" stroke="none" fontSize="14" className="text-purple-500" fontWeight="bold">Tread</text>
                <text x="210" y="200" fill="currentColor" stroke="none" fontSize="14" className="text-blue-500" fontWeight="bold">Waist Slab</text>
                <text x="300" y="40" fill="currentColor" stroke="none" fontSize="14" className="text-amber-500" fontWeight="bold">Landing</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 animate-in fade-in slide-in-from-right-8 duration-500 delay-300">
          <div className="sticky top-6">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-blue-900/10 dark:shadow-none border border-slate-800 dark:border-slate-700 relative overflow-hidden group">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
              
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2.5 bg-blue-500/20 rounded-xl">
                  <Calculator className="w-5 h-5 text-blue-400" />
                </div>
                Real-Time Estimate
              </h3>
              
              <div className="space-y-8 relative z-10">
                <div>
                  <div className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wide flex justify-between items-center">
                    <span>Total Wet Volume</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">CONCRETE</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-tight text-white">{isMetric ? res.totalWetVolume.toFixed(2) : (res.totalWetVolume * 35.3147).toFixed(2)}</span>
                    <span className="text-lg text-slate-500 font-medium">{isMetric ? 'm³' : 'Cu.ft'}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/80 dark:bg-slate-700/80" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 dark:bg-slate-700/40 p-4 md:p-5 rounded-2xl border border-slate-700/50 dark:border-slate-600/30">
                    <div className="text-slate-400 text-[11px] font-bold mb-1.5 uppercase tracking-widest">CEMENT</div>
                    <div className="text-2xl font-bold text-white mb-1">{Math.ceil(res.cementBags)} <span className="text-sm text-slate-500 font-medium">bags</span></div>
                    <div className="text-xs text-slate-500">50kg standard</div>
                  </div>
                  <div className="bg-slate-800/80 dark:bg-slate-700/40 p-4 md:p-5 rounded-2xl border border-slate-700/50 dark:border-slate-600/30">
                    <div className="text-slate-400 text-[11px] font-bold mb-1.5 uppercase tracking-widest">SAND</div>
                    <div className="text-2xl font-bold text-white mb-1">{res.sandCft.toFixed(1)} <span className="text-sm text-slate-500 font-medium">cft</span></div>
                    <div className="text-xs text-slate-500">Fine aggregate</div>
                  </div>
                  <div className="bg-slate-800/80 dark:bg-slate-700/40 p-4 md:p-5 rounded-2xl border border-slate-700/50 dark:border-slate-600/30 col-span-2 flex justify-between items-center">
                    <div>
                      <div className="text-slate-400 text-[11px] font-bold mb-1.5 uppercase tracking-widest">AGGREGATE</div>
                      <div className="text-2xl font-bold text-white mb-1">{res.aggCft.toFixed(1)} <span className="text-sm text-slate-500 font-medium">cft</span></div>
                      <div className="text-xs text-slate-500">Coarse material</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center bg-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/80 dark:bg-slate-700/80" />

                <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-5 md:p-6 rounded-2xl border border-amber-500/20">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="text-amber-400/80 text-[11px] font-bold uppercase tracking-widest mb-1.5">Total Steel Required</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-amber-500">{res.totalSteelWeight.toFixed(1)}</span>
                        <span className="text-sm font-medium text-amber-500/60">kg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 
                        Main (Ø{mainBarDia}{uMm})
                      </span>
                      <span className="font-semibold text-white">{isMetric ? res.totalMainBarLengthCut.toFixed(1) : (res.totalMainBarLengthCut * 3.28084).toFixed(1)}{uM} length</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> 
                        Dist (Ø{distBarDia}{uMm})
                      </span>
                      <span className="font-semibold text-white">{isMetric ? res.totalDistBarLengthCut.toFixed(1) : (res.totalDistBarLengthCut * 3.28084).toFixed(1)}{uM} length</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-amber-500/10 flex justify-between items-center">
                    <span className="text-xs text-amber-500/60 font-medium">Includes {wastage}% wastage factor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!isEmbedded && (
        <ShareButtonWithPopup 
          activeTab="Staircase Calculator"
          title={`${stairShape} Staircase Estimation`}
          data={{
            "Concrete Volume": `${res.totalWetVolume.toFixed(2)} ${isMetric ? 'm³' : 'Cu.ft'}`,
            "Cement": `${Math.ceil(res.cementBags)} bags`,
            "Sand": `${res.sandCft.toFixed(1)} cft`,
            "Aggregate": `${res.aggCft.toFixed(1)} cft`,
            "Total Steel": `${res.totalSteelWeight.toFixed(1)} kg`,
          }}
          exportFormat={{
            inputs: {
              "Shape": stairShape,
              "Steps": String(numSteps),
              "Rise": `${rise} ${uMm}`,
              "Tread": `${tread} ${uMm}`,
              "Width": `${stairWidth} ${uM}`
            },
            breakdown: {
              "Concrete Wet Volume": `${res.totalWetVolume.toFixed(2)} ${isMetric ? 'm³' : 'Cu.ft'}`,
              "Cement Required": `${Math.ceil(res.cementBags)} bags`,
              "Sand Required": `${res.sandCft.toFixed(1)} cft`,
              "Aggregate Required": `${res.aggCft.toFixed(1)} cft`,
              "Steel (Main)": `${res.mainWeight.toFixed(1)} kg`,
              "Steel (Distribution)": `${res.distWeight.toFixed(1)} kg`,
              "Total Steel Required": `${res.totalSteelWeight.toFixed(1)} kg`
            }
          }}
        />
      )}
    </div>
  );
}
