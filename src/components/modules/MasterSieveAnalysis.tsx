import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Calculator, FileSpreadsheet, RefreshCw, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface SieveSpec {
  size: number;
  minPassing: number;
  maxPassing: number;
}

interface Grading {
  name: string;
  sieves: SieveSpec[];
}

interface Category {
  name: string;
  gradings: Grading[];
}

interface SieveRow {
  size: number;
  minPassing: number;
  maxPassing: number;
  weightRetained: number | "";
  cumulativeWeightRetained: number;
  cumulativePercentRetained: number;
  percentPassing: number;
}

export default function MasterSieveAnalysis() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGrading, setSelectedGrading] = useState<string>("");
  const [totalWeight, setTotalWeight] = useState<number | "">("");
  const [sieveData, setSieveData] = useState<SieveRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpecs();
  }, []);

  const fetchSpecs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sieve-specs");
      const data = await res.json();
      setCategories(data.categories);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0].name);
      }
    } catch (err) {
      toast.error("Failed to load specification data in Sieve Analysis");
    } finally {
      setLoading(false);
    }
  };

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
        // Initialize sieve data based on grading spec
        setSieveData(
          grading.sieves.map((s) => ({
            size: s.size,
            minPassing: s.minPassing,
            maxPassing: s.maxPassing,
            weightRetained: "",
            cumulativeWeightRetained: 0,
            cumulativePercentRetained: 0,
            percentPassing: 100,
          }))
        );
        setTotalWeight("");
      }
    }
  }, [selectedCategory, selectedGrading, categories]);

  const handleWeightChange = (index: number, val: string) => {
    const value = val === "" ? "" : parseFloat(val);
    const newData = [...sieveData];
    newData[index].weightRetained = value;
    setSieveData(newData);
    recalculate(newData, totalWeight);
  };

  const handleTotalWeightChange = (val: string) => {
    const tw = val === "" ? "" : parseFloat(val);
    setTotalWeight(tw);
    recalculate(sieveData, tw);
  };

  const recalculate = (data: SieveRow[], tw: number | "") => {
    if (tw === "" || tw <= 0) return;
    
    let cumWeight = 0;
    const newData = data.map((row) => {
      const w = row.weightRetained === "" ? 0 : row.weightRetained;
      cumWeight += w;
      const cumPercent = (cumWeight / tw) * 100;
      const percentPassing = 100 - cumPercent;
      
      return {
        ...row,
        cumulativeWeightRetained: parseFloat(cumWeight.toFixed(2)),
        cumulativePercentRetained: parseFloat(cumPercent.toFixed(2)),
        percentPassing: parseFloat(percentPassing.toFixed(2))
      };
    });
    setSieveData(newData);
  };

  const chartData = sieveData.map(row => ({
    size: row.size,
    logSize: row.size === 0 ? 0.001 : row.size, // for log scale handling
    Actual: (totalWeight !== "" && row.weightRetained !== "") ? row.percentPassing : null,
    Min: row.minPassing,
    Max: row.maxPassing
  })).sort((a, b) => a.size - b.size); // Recharts line charts typically expect sorted X-axis data

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#151821] rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F26B1D]/10 border border-[#F26B1D]/20 mb-3">
             <FileSpreadsheet className="w-4 h-4 text-[#F26B1D]" />
             <span className="text-xs font-bold text-[#F26B1D] uppercase tracking-wider">Geotechnical Lab</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-slate-800 dark:text-white mb-2">Master Sieve Analysis</h2>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
            Dynamic gradation validator driven by specification databases. Select category, grading, and enter retained weights to validate against limits and generate custom gradation curves.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inputs & Data entry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#151821] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#F26B1D]" /> Spec Selection & Input
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#F26B1D] outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Grading Spec</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#F26B1D] outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={selectedGrading}
                  onChange={(e) => setSelectedGrading(e.target.value)}
                >
                  {categories.find(c => c.name === selectedCategory)?.gradings.map(g => (
                    <option key={g.name} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Sample Wt. (gm)</label>
                <input 
                  type="number"
                  min="0"
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#F26B1D] outline-none text-slate-700 dark:text-slate-200 font-medium transition-all"
                  value={totalWeight}
                  onChange={(e) => handleTotalWeightChange(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">IS Sieve (mm)</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Wt. Retained (gm)</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cum. Wt. (gm)</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Limits (%)</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">% Passing</th>
                  </tr>
                </thead>
                <tbody>
                  {sieveData.map((row, idx) => {
                    const isPassing = row.percentPassing >= row.minPassing && row.percentPassing <= row.maxPassing;
                    const hasInput = row.weightRetained !== "" || totalWeight !== "";
                    
                    return (
                      <tr key={row.size} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">{row.size}</td>
                        <td className="py-2 px-4">
                          <input 
                            type="number"
                            min="0"
                            className="w-24 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#F26B1D] outline-none text-sm text-slate-700 dark:text-slate-200 font-medium transition-all"
                            value={row.weightRetained}
                            onChange={(e) => handleWeightChange(idx, e.target.value)}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {row.cumulativeWeightRetained}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-500">
                          {row.minPassing} - {row.maxPassing}
                        </td>
                        <td className={`py-3 px-4 text-sm font-bold ${hasInput ? (isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400') : 'text-slate-600 dark:text-slate-400'}`}>
                          {hasInput ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${isPassing ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                              {row.percentPassing.toFixed(1)}%
                              {!isPassing && <AlertCircle className="w-3.5 h-3.5" />}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151821] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5 h-[500px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#F26B1D]" /> Gradation Curve
            </h3>
            
            <div className="flex-1 w-full relative min-h-0">
               {totalWeight === "" ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                   <p className="text-slate-500 dark:text-slate-400 font-medium text-sm text-center px-4">
                     Enter Total Sample Weight and Sieve values to generate plot.
                   </p>
                 </div>
               ) : (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                      <XAxis 
                        dataKey="logSize" 
                        scale="log" 
                        domain={['auto', 'auto']} 
                        type="number"
                        tickFormatter={(val) => val === 0.001 ? "Pan" : val.toString()}
                        stroke="#64748b"
                        label={{ value: "IS Sieve Size (mm)", position: "insideBottom", offset: -15, fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        stroke="#64748b"
                        label={{ value: "% Passing", angle: -90, position: 'insideLeft', fill: "#64748b", fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                        labelFormatter={(val) => val === 0.001 ? "Pan" : `Sieve: ${val}mm`}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      
                      <Line type="stepAfter" dataKey="Max" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" name="Upper Limit" dot={false} />
                      <Line type="stepAfter" dataKey="Min" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Lower Limit" dot={false} />
                      <Line type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={3} name="Actual Gradation" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
               )}
            </div>
          </div>
          
          <div className="bg-[#F26B1D] text-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(242,107,29,0.3)] border border-[#F26B1D]/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <h3 className="text-xl font-heading font-black mb-2 relative z-10">Instant Report</h3>
            <p className="text-orange-100 text-sm mb-6 relative z-10 font-medium">Generate a professional specification-compliant testing report instantly.</p>
            <button className="w-full flex items-center justify-center gap-2 bg-white text-[#F26B1D] font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1 relative z-10">
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
