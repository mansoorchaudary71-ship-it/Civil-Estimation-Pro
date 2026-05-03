import React, { useMemo } from 'react';
import { TrendingUp, Settings, DollarSign, Database, Activity, Layers, PenTool } from 'lucide-react';
import { useMarketRates, MarketRates } from '../../context/MarketRatesContext';
import { useSettings } from '../../context/SettingsContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RateAnalysis() {
  const { rates, updateRate } = useMarketRates();
  const { settings } = useSettings();

  const handleRateChange = (key: keyof MarketRates, valStr: string) => {
    const val = parseFloat(valStr);
    if (!isNaN(val)) {
      updateRate(key, val);
    }
  };

  // Composite Calculation: 1 m3 of 1:2:4 Concrete
  const compositeCalc = useMemo(() => {
    const dryVol = 1.54; // m3
    const sumRatio = 1 + 2 + 4;
    
    // Cement Component (1 part)
    const cementVol = (1 / sumRatio) * dryVol; // m3
    const cementBags = cementVol / 0.0347; // approx 6.34
    
    // Sand Component (2 parts)
    const sandVol = (2 / sumRatio) * dryVol; // m3
    const sandCft = sandVol * 35.3147; // approx 15.54 cft
    
    // Crush Component (4 parts)
    const crushVol = (4 / sumRatio) * dryVol; // m3
    const crushCft = crushVol * 35.3147; // approx 31.08 cft
    
    const costCement = cementBags * rates.cement;
    const costSand = sandCft * rates.sand;
    const costCrush = crushCft * rates.crush;
    
    // Assumed fixed rates for labor and tools for mixing/pouring 1m3
    const costLabor = 1500; 
    const costEquipment = 800;
    
    const primeCost = costCement + costSand + costCrush + costLabor + costEquipment;
    const overheadCost = primeCost * (rates.overheadMarkup / 100);
    const finalRate = primeCost + overheadCost;

    return {
      cementBags, costCement,
      sandCft, costSand,
      crushCft, costCrush,
      costLabor, costEquipment,
      primeCost, overheadCost, finalRate
    };
  }, [rates]);

  return (
    <div className="w-full h-full overflow-y-auto bg-[#fafafa] text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent pb-2">
            Rate Analysis & Market Pricing
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            Centralized hub for local market rates. Updates here reflect globally across all estimation modules.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Rate Inputs */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white/80 p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 backdrop-blur-xl">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100">
                   <Database className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold tracking-tight text-gray-800">Global Material Rates</h2>
                   <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Updates globally in real-time</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Material Input Cards */}
                 <InputCard label="Cement (per Bag)" value={rates.cement} unit={settings.currency} onChange={(v) => handleRateChange('cement', v)} />
                 <InputCard label="Steel (per kg)" value={rates.steel} unit={settings.currency} onChange={(v) => handleRateChange('steel', v)} />
                 <InputCard label="Sand (per cft)" value={rates.sand} unit={settings.currency} onChange={(v) => handleRateChange('sand', v)} />
                 <InputCard label="Crush (per cft)" value={rates.crush} unit={settings.currency} onChange={(v) => handleRateChange('crush', v)} />
                 <InputCard label="Bricks (per Piece)" value={rates.bricks} unit={settings.currency} onChange={(v) => handleRateChange('bricks', v)} />
                 
                 <div className="col-span-1 sm:col-span-2 pt-4 pb-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Finishing & Labor</h3>
                 </div>

                 <InputCard label="Tiles (per Box)" value={rates.tiles} unit={settings.currency} onChange={(v) => handleRateChange('tiles', v)} />
                 <InputCard label="Paint (per Liter)" value={rates.paint} unit={settings.currency} onChange={(v) => handleRateChange('paint', v)} />
                 <InputCard label="Labour (Grey / sqft)" value={rates.laborGrey} unit={settings.currency} onChange={(v) => handleRateChange('laborGrey', v)} />
                 <InputCard label="Finish Multiplier Base" value={rates.laborFinish} unit={settings.currency} onChange={(v) => handleRateChange('laborFinish', v)} />
                 
                 <div className="col-span-1 sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-700">Contractor Overhead & Profit</div>
                      <div className="text-xs text-slate-500 font-medium">Applied to composite items</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-lg font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                         value={rates.overheadMarkup}
                         onChange={(e) => handleRateChange('overheadMarkup', e.target.value)}
                       />
                       <span className="text-lg font-black text-slate-400">%</span>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* Composite Rate Analyzer */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden text-white/90">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]" />
               
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur border border-white/10">
                       <Activity className="w-5 h-5 text-teal-400" />
                     </div>
                     <h3 className="text-lg font-bold">Composite Item Analysis</h3>
                   </div>
                 </div>

                 <div className="mb-6">
                    <h4 className="text-2xl font-black text-white leading-tight">1.0 m³ Concrete</h4>
                    <p className="text-teal-400/80 font-mono text-sm mt-1 mb-4 border-b border-white/10 pb-4">Mix Ratio 1:2:4 | 1.54 Dry Vol</p>
                    
                    <div className="h-48 w-full mb-6 relative">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[
                           { name: 'Cement', value: compositeCalc.costCement, color: '#94a3b8' },
                           { name: 'Sand', value: compositeCalc.costSand, color: '#fcd34d' },
                           { name: 'Crush', value: compositeCalc.costCrush, color: '#a3a3a3' },
                           { name: 'Labor/Eq', value: compositeCalc.costLabor + compositeCalc.costEquipment, color: '#0ea5e9' },
                           { name: 'Overhead', value: compositeCalc.overheadCost, color: '#10b981' }
                         ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                           <YAxis tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                           <Tooltip 
                             cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                             formatter={(value: number) => `${settings.currency === "PKR" ? "RS" : settings.currency} ${value.toFixed(0)}`}
                           />
                           <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                             {[
                               { name: 'Cement', value: compositeCalc.costCement, color: '#94a3b8' },
                               { name: 'Sand', value: compositeCalc.costSand, color: '#fcd34d' },
                               { name: 'Crush', value: compositeCalc.costCrush, color: '#a3a3a3' },
                               { name: 'Labor/Eq', value: compositeCalc.costLabor + compositeCalc.costEquipment, color: '#0ea5e9' },
                               { name: 'Overhead', value: compositeCalc.overheadCost, color: '#10b981' }
                             ].map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                           </Bar>
                         </BarChart>
                       </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 font-mono text-sm">
                       <div className="flex justify-between items-center group">
                          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Cement ({compositeCalc.cementBags.toFixed(2)} Bags)</span>
                          <span className="font-bold text-slate-200">{compositeCalc.costCement.toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between items-center group">
                          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Sand ({compositeCalc.sandCft.toFixed(2)} cft)</span>
                          <span className="font-bold text-slate-200">{compositeCalc.costSand.toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between items-center group">
                          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Crush ({compositeCalc.crushCft.toFixed(2)} cft)</span>
                          <span className="font-bold text-slate-200">{compositeCalc.costCrush.toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-white/5">
                          <span>Labor & Equipment</span>
                          <span>{(compositeCalc.costLabor + compositeCalc.costEquipment).toFixed(0)}</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                       <span>Subtotal</span>
                       <span className="font-mono">{compositeCalc.primeCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                       <span>Overhead & Profit ({rates.overheadMarkup}%)</span>
                       <span className="font-mono text-emerald-400">+{compositeCalc.overheadCost.toFixed(0)}</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mt-4 flex items-center justify-between">
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Analyzed Rate</span>
                       <div className="flex items-end gap-1">
                          <span className="text-3xl font-black text-white leading-none">{compositeCalc.finalRate.toFixed(0)}</span>
                          <span className="text-sm font-medium text-teal-400 pb-0.5">/ m³</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function InputCard({ label, value, unit, onChange }: { label: string, value: number, unit: string, onChange: (v: string) => void }) {
  return (
    <div className="group bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-emerald-200 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
       <label className="text-xs font-bold text-gray-500 tracking-wide mb-3 block">{label}</label>
       <div className="flex items-center gap-2">
         <div className="relative flex-1">
           <input 
             type="number"
             className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 pl-8 transition-shadow"
             value={value}
             onChange={(e) => onChange(e.target.value)}
           />
           <DollarSign className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
         </div>
         <span className="text-xs font-bold text-gray-400 uppercase w-10 text-right">{unit}</span>
       </div>
    </div>
  );
}
