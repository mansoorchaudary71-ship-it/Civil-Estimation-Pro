import React, { useState, useEffect } from 'react';
import { ModuleId } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { ALL_MODULES } from './Dashboard';
import { getMyEstimates } from '../lib/estimates';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { ArrowRight, Home, Box, Ruler, Building2, Plus, FileText, Clock, TrendingUp, HardHat } from 'lucide-react';
import { useGlobalSettings } from '../context/SettingsContext';

interface PostLoginDashboardProps {
  onSelectModule: (id: ModuleId) => void;
}

export default function PostLoginDashboard({ onSelectModule }: PostLoginDashboardProps) {
  const { user } = useAuth();
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useGlobalSettings();

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const data: any[] | undefined = await getMyEstimates();
        if (data) {
          // Sort by newest first
          data.sort((a, b) => b.createdAt - a.createdAt);
          setEstimates(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const recentEstimates = estimates.slice(0, 5).map(e => {
    let totalCost = 0;
    if (e.payload?.totalCost) {
      totalCost = e.payload.totalCost;
    } else if (e.payload?.results?.totalCost) {
      totalCost = e.payload.results.totalCost;
    } else if (e.payload?.results?.grandTotal) {
      totalCost = e.payload.results.grandTotal;
    }

    return {
      id: e.id,
      name: e.name,
      date: new Date(e.createdAt).toLocaleDateString(),
      totalCost,
      status: e.status || 'Draft',
    };
  });

  const chartData = [...recentEstimates].reverse().map((e, idx) => ({
    name: e.name.length > 10 ? e.name.substring(0, 10) + '...' : e.name,
    cost: e.totalCost || 0,
  }));

  const quickTools = [
    { id: "house", title: "House Estimator", icon: Home, bg: "bg-blue-50 dark:bg-blue-900/20", color: "text-blue-600 dark:text-blue-400" },
    { id: "calculators", title: "Material Splits", icon: Box, bg: "bg-orange-50 dark:bg-orange-900/20", color: "text-orange-600 dark:text-orange-400" },
    { id: "takeoff", title: "2D Takeoff", icon: Ruler, bg: "bg-purple-50 dark:bg-purple-900/20", color: "text-purple-600 dark:text-purple-400" },
    { id: "master-rcc", title: "RCC Master", icon: Building2, bg: "bg-emerald-50 dark:bg-emerald-900/20", color: "text-emerald-600 dark:text-emerald-400" }
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] dark:text-white mb-1">
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-[#111111]/60 dark:text-white/60">
            Pick up where you left off or start a new estimate.
          </p>
        </div>
        <button 
          onClick={() => onSelectModule('calculators')}
          className="hidden sm:flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-5 py-2.5 rounded-full font-bold hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          New Estimate
        </button>
      </div>

      {/* Quick Start Buttons */}
      <h2 className="text-lg font-bold text-[#111111] dark:text-white mt-2">Quick Start</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectModule(tool.id as ModuleId)}
            className="group flex flex-col bg-white dark:bg-[#1A1A1A] border border-[#111111]/5 dark:border-white/10 rounded-2xl p-5 hover:shadow-lg transition-all text-left hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-[#111111] dark:text-white text-[15px]">{tool.title}</h3>
            <div className="mt-3 flex items-center text-[12px] font-bold text-[#111111]/40 dark:text-white/40 group-hover:text-[#111111] dark:group-hover:text-white uppercase tracking-wider transition-colors">
              Open <ArrowRight className="w-3.5 h-3.5 ml-1 mt-0.5" strokeWidth={3} />
            </div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111] dark:border-white"></div>
        </div>
      ) : estimates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Recent Estimates Table */}
          <div className="lg:col-span-2 flex flex-col bg-white dark:bg-[#1A1A1A] border border-[#111111]/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111] dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#111111]/40 dark:text-white/40" />
                Recent Estimates
              </h2>
              <button 
                onClick={() => onSelectModule('my-estimates')}
                className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#111111]/10 dark:border-white/10">
                    <th className="pb-3 text-[12px] font-bold uppercase tracking-widest text-[#111111]/40 dark:text-white/40">Project Name</th>
                    <th className="pb-3 text-[12px] font-bold uppercase tracking-widest text-[#111111]/40 dark:text-white/40">Date</th>
                    <th className="pb-3 text-[12px] font-bold uppercase tracking-widest text-[#111111]/40 dark:text-white/40">Status</th>
                    <th className="pb-3 text-[12px] font-bold uppercase tracking-widest text-[#111111]/40 dark:text-white/40 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEstimates.map(est => (
                    <tr key={est.id} className="border-b border-[#111111]/5 dark:border-white/5 last:border-0 hover:bg-[#111111]/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="font-bold text-[14px] text-[#111111] dark:text-white">{est.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[14px] text-[#111111]/60 dark:text-white/60">{est.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                          est.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          est.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {est.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono font-bold text-[14px] text-[#111111] dark:text-white">
                        {est.totalCost > 0 ? formatCurrency(est.totalCost) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Trend Chart */}
          <div className="flex flex-col bg-white dark:bg-[#1A1A1A] border border-[#111111]/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#111111]/40 dark:text-white/40" />
              <h2 className="text-lg font-bold text-[#111111] dark:text-white">Cost Trend</h2>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-20" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 10 }} 
                    className="text-[#111111]/60 dark:text-white/60"
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => {
                      if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
                      if (v >= 1000) return (v / 1000).toFixed(0) + 'k';
                      return v;
                    }}
                    tick={{ fontSize: 10 }}
                    className="text-[#111111]/60 dark:text-white/60"
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#111' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col mt-4">
           {/* Custom Full-Page Empty State */}
           <div className="w-full bg-[#111111]/[0.02] dark:bg-white/[0.02] border border-[#111111]/5 dark:border-white/10 rounded-[2rem] p-8 md:p-16 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
             
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 p-8 md:p-16 opacity-5 pointer-events-none">
                <Ruler className="w-48 h-48 md:w-64 md:h-64 rotate-45" />
             </div>
             <div className="absolute bottom-0 left-0 p-8 md:p-12 opacity-5 pointer-events-none">
                <Building2 className="w-40 h-40 md:w-56 md:h-56 -rotate-12" />
             </div>

             {/* Illustration (Construction Character / Abstract Tools) */}
             <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                 {/* Blueprint glow */}
                 <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-60"></div>
                 
                 {/* Hard Hat Character abstracted */}
                 <div className="relative z-10 w-28 h-28 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-3xl shadow-xl flex items-center justify-center -translate-y-4 -translate-x-6 rotate-12">
                   <HardHat className="w-14 h-14 text-white" strokeWidth={2.5} />
                 </div>
                 
                 {/* Blueprint Document */}
                 <div className="absolute z-0 w-24 h-32 bg-white dark:bg-[#1A1A1A] border-2 border-[#111111]/10 dark:border-white/10 rounded-xl shadow-lg -rotate-12 translate-x-10 translate-y-4 flex flex-col items-center justify-center p-3">
                   <div className="w-full h-2 bg-[#111111]/10 dark:bg-white/10 rounded mb-2"></div>
                   <div className="w-full h-2 bg-blue-500/20 dark:bg-blue-400/20 rounded mb-2"></div>
                   <div className="w-3/4 h-2 bg-[#111111]/10 dark:bg-white/10 rounded mb-auto"></div>
                   <FileText className="w-8 h-8 text-[#111111]/20 dark:text-white/20 mt-2" />
                 </div>
             </div>

             <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#111111] dark:text-white tracking-tight mb-4 relative z-10">
               Your first estimate is 60 seconds away.
             </h2>
             <p className="text-sm md:text-base text-[#111111]/60 dark:text-white/60 mb-10 max-w-md relative z-10 font-medium">
               Don't waste time on manual calculations. Let Civil Pro do the heavy lifting for your construction cost estimates.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
               <button 
                 onClick={() => onSelectModule('house')}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg"
               >
                 <Home className="w-5 h-5" />
                 Start House Estimator
               </button>
               <button 
                 onClick={() => onSelectModule('calculators')}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#222] text-[#111111] dark:text-white border border-[#111111]/10 dark:border-white/10 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm"
               >
                 <Box className="w-5 h-5 text-orange-500" />
                 Browse Materials
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
