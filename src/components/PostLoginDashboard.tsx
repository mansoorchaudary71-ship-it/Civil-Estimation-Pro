import React, { useState, useEffect } from 'react';
import { ModuleId } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { ALL_MODULES } from './Dashboard';
import { getMyEstimates } from '../lib/estimates';
import { ArrowRight, Home, Box, Ruler, Building2, Plus, FileText, Clock, HardHat } from 'lucide-react';
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
      type: e.type && e.type !== 'material_calculation' ? e.type : 'General',
    };
  });

  const chartData = [...recentEstimates].reverse().map((e, idx) => ({
    name: e.name.length > 10 ? e.name.substring(0, 10) + '...' : e.name,
    cost: e.totalCost || 0,
  }));

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
    <div className="w-full flex justify-between">
      {/* Header & Primary Action Column */}
      <div className="w-full flex gap-4 flex-col">
        
        {/* Welcome & Button */}
        <div className="flex-1 flex flex-col items-center text-center gap-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden">
          {/* Decorative background effects could go here */}
          <div className="z-10 relative">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-lg max-w-xl mx-auto">
              Ready to calculate your next project? Pick up where you left off or start a new estimate.
            </p>
          </div>
          
          <button 
            onClick={() => onSelectModule('calculators')}
            className="z-10 flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-[16px] shadow-lg mt-2 w-full md:w-auto min-w-[280px]"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
            Create New Estimate
          </button>
        </div>
      </div>
    </div>

    {/* Recent Estimates Section */}
    <div className="w-full flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#111111] dark:text-white flex items-center gap-2 tracking-tight">
          <Clock className="w-5 h-5 text-orange-500" />
          Recent Estimates
        </h2>
        {estimates.length > 0 && (
          <button 
            onClick={() => onSelectModule('my-estimates')}
            className="text-[13px] font-bold text-indigo-600 dark:text-blue-400 hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
        </div>
      ) : estimates.length > 0 ? (
        <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-slate-800/60 rounded-[32px] overflow-hidden shadow-sm">
          {recentEstimates.map((est, index) => (
            <div key={est.id} className={`flex items-center justify-between p-4 sm:p-5 ${index !== recentEstimates.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/60' : ''} hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors`}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#ff9f43] dark:bg-[#ff7f50] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[16px] sm:text-[17px] text-slate-900 dark:text-slate-100 leading-tight mb-0.5">{est.name}</span>
                  <div className="flex items-center gap-2 text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400">
                    <span>{est.date}</span>
                    <span>•</span>
                    <span className="text-slate-800 dark:text-slate-300 font-medium">{est.totalCost > 0 ? formatCurrency(est.totalCost) : '-'}</span>
                  </div>
                </div>
              </div>
              <button 
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-full transition-all"
              >
                Resume
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-[#111111]/[0.02] dark:bg-white/[0.02] border border-[#111111]/5 dark:border-white/5 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-white dark:bg-[#222] shadow-sm border border-[#111111]/5 dark:border-white/5 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-[#111111]/20 dark:text-white/20" />
          </div>
          <p className="text-[#111111] dark:text-white font-bold text-lg mb-1">No recent estimates</p>
          <p className="text-[#111111]/60 dark:text-white/60 font-medium text-sm">Create a new estimate to get started</p>
        </div>
      )}
    </div>
    </div>
  );
}
