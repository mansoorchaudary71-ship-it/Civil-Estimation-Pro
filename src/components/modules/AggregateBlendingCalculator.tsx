import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RefreshCw, Calculator, Layers, AlertCircle, ArrowRightLeft } from "lucide-react";
import toast from "react-hot-toast";

interface BinData {
  size: number;
  minPassing: number;
  maxPassing: number;
  binA: number | "";
  binB: number | "";
  binC: number | "";
  binD: number | "";
}

import { CalculationHistory } from "../ui/CalculationHistory";

import { Category, sieveSpecData } from "../../data/sieveSpecs";

export default function AggregateBlendingCalculator() {
  const [categories, setCategories] = useState<Category[]>(sieveSpecData.categories);
  const [selectedCategory, setSelectedCategory] = useState<string>(sieveSpecData.categories[0]?.name || "");
  const [selectedGrading, setSelectedGrading] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [sieveData, setSieveData] = useState<BinData[]>([]);
  
  // Proportions for Bin A, B, C, D
  const [proportions, setProportions] = useState<[number, number, number, number]>([25, 25, 25, 25]);
  const [binNames, setBinNames] = useState<[string, string, string, string]>(["20mm Agg", "10mm Agg", "Stone Dust", "Sand"]);

  useEffect(() => {
    // Initial setup if needed, handled by initial state
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((c) => c.name === selectedCategory);
      if (category && category.gradings.length > 0) {
        setSelectedGrading(category.gradings[0].name);
      } else {
        setSelectedGrading("");
      }
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    if (selectedCategory && selectedGrading) {
      const category = categories.find((c) => c.name === selectedCategory);
      const grading = category?.gradings.find((g) => g.name === selectedGrading);
      
      if (grading) {
        setSieveData(
          grading.sieves.map((s) => ({
            size: s.size,
            minPassing: s.minPassing,
            maxPassing: s.maxPassing,
            binA: 100, // Default to 100 to show something on the graph initially
            binB: 100,
            binC: 100,
            binD: 100,
          }))
        );
      }
    }
  }, [selectedCategory, selectedGrading, categories]);

  const handleProportionChange = (index: number, valStr: string) => {
    let newValue = parseFloat(valStr);
    if (isNaN(newValue)) newValue = 0;
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;

    const diff = newValue - proportions[index];
    const others = proportions.map((p, i) => i !== index ? p : 0);
    const sumOthers = others.reduce((a, b) => a + b, 0);

    let newProportions: [number, number, number, number] = [...proportions] as [number, number, number, number];
    newProportions[index] = newValue;

    if (sumOthers > 0) {
      for (let i = 0; i < 4; i++) {
        if (i !== index) {
          newProportions[i] -= diff * (proportions[i] / sumOthers);
          if (newProportions[i] < 0) newProportions[i] = 0; // Clamp and renormalize later if needed
        }
      }
    } else {
      const amt = -diff / 3;
      for (let i = 0; i < 4; i++) {
        if (i !== index) newProportions[i] = Math.max(0, amt);
      }
    }

    // Force strict 100% normalization to avoid float issues
    const finalSum = newProportions.reduce((a, b) => a + b, 0);
    if (finalSum > 0 && Math.abs(finalSum - 100) > 0.01) {
       for (let i = 0; i < 4; i++) {
           newProportions[i] = (newProportions[i] / finalSum) * 100;
       }
    }
    
    setProportions(newProportions);
  };

  const handleBinDataChange = (sieveIndex: number, bin: 'binA'|'binB'|'binC'|'binD', val: string) => {
    const newData = [...sieveData];
    newData[sieveIndex][bin] = val === "" ? "" : parseFloat(val);
    setSieveData(newData);
  };

  const handleBinNameChange = (index: number, val: string) => {
    const newNames = [...binNames] as [string, string, string, string];
    newNames[index] = val;
    setBinNames(newNames);
  };

  const getBlendedValue = (row: BinData): number | null => {
    const a = row.binA === "" ? 0 : row.binA;
    const b = row.binB === "" ? 0 : row.binB;
    const c = row.binC === "" ? 0 : row.binC;
    const d = row.binD === "" ? 0 : row.binD;
    
    // Only calculate if we have some data
    if (row.binA === "" && row.binB === "" && row.binC === "" && row.binD === "") return null;

    return (a * proportions[0] / 100) + 
           (b * proportions[1] / 100) + 
           (c * proportions[2] / 100) + 
           (d * proportions[3] / 100);
  };

  const chartData = sieveData.map(row => {
    const blendValue = getBlendedValue(row);
    return {
      size: row.size,
      logSize: row.size === 0 ? 0.001 : row.size,
      Blend: blendValue !== null ? parseFloat(blendValue.toFixed(2)) : null,
      Min: row.minPassing,
      Max: row.maxPassing
    };
  }).sort((a, b) => a.size - b.size);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#151821] rounded-[12px] p-6 md:p-8 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[var(--accent-vibrant)]/10 border border-[var(--accent-vibrant)]/20 mb-3">
           <ArrowRightLeft className="w-4 h-4 text-[var(--accent-vibrant)]" />
           <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">Mix Design Toolkit</span>
        </div>
        <h2 className="text-[18px] md:text-[28px] font-heading font-black text-text-primary mb-2">Aggregate Blending Calculator</h2>
        <p className="text-[#4B5563] max-w-3xl text-sm leading-relaxed">
          Blend 2 to 4 different aggregate stockpiles to meet target grading specifications. Use the interactive sliders to adjust proportions and instantly preview the blended gradation envelope.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Top/Left Section: Inputs & Spec Selection */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="bg-bg-card/80 backdrop-blur-md rounded-[12px] p-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Category</label>
                <select 
                  className="w-full px-4 py-3 rounded-[12px] bg-bg-primary/50 border border-border-color focus:ring-2 focus:ring-[var(--accent-vibrant)] outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Specification</label>
                <select 
                  className="w-full px-4 py-3 rounded-[12px] bg-bg-primary/50 border border-border-color focus:ring-2 focus:ring-[var(--accent-vibrant)] outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={selectedGrading}
                  onChange={(e) => setSelectedGrading(e.target.value)}
                >
                  {categories.find(c => c.name === selectedCategory)?.gradings.map(g => (
                    <option key={g.name} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-bg-card/80 backdrop-blur-md rounded-[12px] p-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-white/5 overflow-x-auto">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--accent-vibrant)]" /> Stockpile Percent Passing
            </h3>
            
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="py-2 px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-wider w-24">IS Sieve</th>
                  {[0, 1, 2, 3].map(i => (
                    <th key={i} className="py-2 px-2">
                      <input 
                        type="text"
                        value={binNames[i]}
                        onChange={(e) => handleBinNameChange(i, e.target.value)}
                        className="w-full text-[12px] font-medium text-[#6B7280] uppercase tracking-wider"
                      />
                    </th>
                  ))}
                  <th className="py-2 px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-wider text-right w-24">Blended %</th>
                  <th className="py-2 px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-wider text-right w-24">Limits</th>
                </tr>
              </thead>
              <tbody>
                {sieveData.map((row, idx) => {
                  const blend = getBlendedValue(row);
                  const isPassing = blend !== null && blend >= row.minPassing && blend <= row.maxPassing;
                  
                  return (
                    <tr key={row.size} className="border-t border-border-color/50">
                      <td className="py-2 px-2 font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">
                        {row.size} mm
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number"
                          className="w-full px-2 py-1.5 rounded bg-bg-primary border border-border-color focus:ring-1 focus:ring-[var(--accent-vibrant)] outline-none text-sm font-medium dark:text-white"
                          value={row.binA}
                          onChange={(e) => handleBinDataChange(idx, 'binA', e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number"
                          className="w-full px-2 py-1.5 rounded bg-bg-primary border border-border-color focus:ring-1 focus:ring-[var(--accent-vibrant)] outline-none text-sm font-medium dark:text-white"
                          value={row.binB}
                          onChange={(e) => handleBinDataChange(idx, 'binB', e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number"
                          className="w-full px-2 py-1.5 rounded bg-bg-primary border border-border-color focus:ring-1 focus:ring-[var(--accent-vibrant)] outline-none text-sm font-medium dark:text-white"
                          value={row.binC}
                          onChange={(e) => handleBinDataChange(idx, 'binC', e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number"
                          className="w-full px-2 py-1.5 rounded bg-bg-primary border border-border-color focus:ring-1 focus:ring-[var(--accent-vibrant)] outline-none text-sm font-medium dark:text-white"
                          value={row.binD}
                          onChange={(e) => handleBinDataChange(idx, 'binD', e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        {blend !== null ? (
                           <span className={`inline-block px-2 py-1 rounded text-sm font-bold ${isPassing ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'}`}>
                             {blend.toFixed(1)}%
                           </span>
                        ) : '-'}
                      </td>
                      <td className="py-2 px-2 text-sm font-medium text-[#4B5563] text-right whitespace-nowrap">
                        {row.minPassing} - {row.maxPassing}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Section: Sliders & Graph */}
        <div className="xl:col-span-5 space-y-6">
          
          <div className="bg-bg-card/80 backdrop-blur-md rounded-[12px] p-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[var(--accent-vibrant)]" /> Trial Blending
              </h3>
              <div className="px-3 py-1 rounded bg-bg-primary text-sm font-bold text-slate-700 dark:text-slate-300">
                Sum: {proportions.reduce((a,b) => a+b, 0).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{binNames[i]}</span>
                    <span className="font-mono font-bold text-[var(--accent-vibrant)]">{proportions[i].toFixed(1)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={proportions[i]}
                    onChange={(e) => handleProportionChange(i, e.target.value)}
                    className="w-full h-2 bg-slate-200 dark:bg-[#6B46C1] rounded-[12px] appearance-none cursor-pointer accent-[var(--accent-vibrant)]"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-[12px] bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 text-xs text-orange-800 dark:text-orange-300 flex items-start gap-2">
               <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
               <p>Moving a slider will automatically adjust the remaining proportions to ensure the total blend always equals 100%.</p>
            </div>
          </div>

          <div className="bg-bg-card/80 backdrop-blur-md rounded-[12px] p-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-white/5 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[var(--accent-vibrant)]" /> Blended Gradation Curve
            </h3>
            <div className="flex-1 w-full relative min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                    <XAxis 
                      dataKey="logSize" 
                      scale="log" 
                      domain={['auto', 'auto']} 
                      type="number"
                      tickFormatter={(val) => val === 0.001 ? "Pan" : val.toString()}
                      stroke="#64748b"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="#64748b"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                      itemStyle={{ color: "#f8fafc" }}
                      labelFormatter={(val) => val === 0.001 ? "Pan" : `Sieve: ${val}mm`}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    
                    <Line type="stepAfter" dataKey="Max" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" name="Upper Limit" dot={false} />
                    <Line type="stepAfter" dataKey="Min" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Lower Limit" dot={false} />
                    <Line type="monotone" dataKey="Blend" stroke="#10b981" strokeWidth={3} name="Blended %" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
            </div>
          </div>

        </div>
        
        <CalculationHistory
          calculatorId="aggregate_blending_v1"
          currentInputs={{ proportions, binNames, selectedCategory, selectedGrading }}
          onRestore={(ins) => {
            if (ins.proportions) setProportions(ins.proportions);
            if (ins.binNames) setBinNames(ins.binNames);
            if (ins.selectedCategory) setSelectedCategory(ins.selectedCategory);
            if (ins.selectedGrading) setSelectedGrading(ins.selectedGrading);
          }}
        />

      </div>
    </div>
  );
}
