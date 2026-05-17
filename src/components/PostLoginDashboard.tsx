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
        <div className="flex-1 flex flex-col items-center text-center gap-5 bg-white dark:bg-[#1A1A1A] border border-[#111111]/5 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          {/* Decorative background effects could go here */}
          <div className="z-10 relative">
            <h1 className="text-3xl md:text-4xl font-black text-[#111111] dark:text-white tracking-tight mb-3">
              Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-[#111111]/70 dark:text-white/70 font-medium text-lg max-w-xl mx-auto">
              Ready to calculate your next project? Pick up where you left off or start a new estimate.
            </p>
          </div>
          
          <button 
            onClick={() => onSelectModule('calculators')}
            className="z-10 flex items-center justify-center gap-3 bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-[16px] shadow-lg mt-2 w-full md:w-auto min-w-[280px]"
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
            className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111] dark:border-white"></div>
        </div>
      ) : estimates.length > 0 ? (
        <div className="flex flex-col bg-white dark:bg-[#1A1A1A] border border-[#111111]/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
          {recentEstimates.map((est, index) => (
            <div key={est.id} className={`flex items-center justify-between p-4 px-6 ${index !== recentEstimates.length - 1 ? 'border-b border-[#111111]/5 dark:border-white/5' : ''} hover:bg-[#111111]/[0.02] dark:hover:bg-white/[0.02] transition-colors`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[16px] text-[#111111] dark:text-white leading-tight mb-0.5">{est.name}</span>
                  <div className="flex items-center gap-2 text-[13px] text-[#111111]/60 dark:text-white/60 font-medium">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                      {est.type}
                    </span>
                    <span>•</span>
                    <span>{est.date}</span>
                    <span>•</span>
                    <span className="text-[#111111] dark:text-white font-bold">{est.totalCost > 0 ? formatCurrency(est.totalCost) : '-'}</span>
                  </div>
                </div>
              </div>
              <button 
                className="px-5 py-2.5 bg-[#111111]/5 dark:bg-white/5 hover:bg-[#111111]/10 dark:hover:bg-white/10 text-[#111111] dark:text-white text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
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
