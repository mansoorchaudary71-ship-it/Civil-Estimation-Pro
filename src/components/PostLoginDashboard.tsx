import React, { useState, useEffect } from 'react';
import { ModuleId } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { ALL_MODULES } from './Dashboard';
import { getMyEstimates } from '../lib/estimates';
import { ArrowRight, Home, Box, Ruler, Building2, Plus, FileText, Clock, HardHat } from 'lucide-react';
import { useGlobalSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';

const PHRASES = [
  "Create New Estimate",
  "Calculate Materials",
  "Estimate Project Cost",
  "Start New Project"
];

interface PostLoginDashboardProps {
  onSelectModule: (id: ModuleId) => void;
}

export default function PostLoginDashboard({ onSelectModule }: PostLoginDashboardProps) {
  const { user } = useAuth();
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useGlobalSettings();
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="flex flex-col gap-4 mb-4 relative z-10 w-full overflow-hidden rounded-[12px]">
        
        {/* Gemini Colorful Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-400 blur-[40px] opacity-20 dark:opacity-40 animate-pulse pointer-events-none"></div>

        {/* Welcome & Button */}
        <div className="flex flex-col items-center text-center gap-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[12px] p-6 sm:p-8 md:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-2xl relative group w-full box-border">
          {/* Subtle gradient border effect inside the card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-white/0 pointer-events-none rounded-[12px]"></div>

          <div className="z-10 relative flex flex-col items-center">
            <h1 className="text-[18px] md:text-[28px] lg:text-[28px] font-black text-text-primary tracking-tight mb-3">
              Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Ready to calculate your next project? Pick up where you left off or start a new estimate.
            </p>
          </div>
          
          <button 
            onClick={() => onSelectModule('calculators')}
            className="z-10 mt-2 relative overflow-hidden bg-[#1A1C20] dark:bg-white text-white dark:text-[#1A1C20] rounded-full px-6 py-3 sm:px-8 sm:py-4 font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] shadow-slate-900/20 dark:shadow-white/10 w-full md:w-auto min-w-[250px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center justify-center gap-2 relative z-10 w-full">
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <div className="relative overflow-hidden flex items-center justify-start h-6 min-w-[200px]">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={phraseIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute left-0 whitespace-nowrap"
                  >
                    {PHRASES[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    {/* Recent Estimates Section */}
    <div className="w-full flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#111111] dark:text-white flex items-center gap-2 tracking-tight">
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
        <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border border-border-color/60 rounded-[12px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          {recentEstimates.map((est, index) => (
            <div key={est.id} className={`flex items-center justify-between p-4 sm:p-5 ${index !== recentEstimates.length - 1 ? 'border-b border-border-color/60' : ''} hover:bg-slate-50/80 dark:hover:bg-[#6B46C1]/40 transition-colors`}>
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
                className="px-5 py-2.5 bg-bg-primary hover:bg-slate-200 dark:hover:bg-[#6B46C1] text-text-primary text-sm font-bold rounded-full transition-all"
              >
                Resume
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-[#111111]/[0.02] dark:bg-white/[0.02] border border-[#111111]/5 dark:border-white/5 rounded-[12px] text-center">
          <div className="w-16 h-16 rounded-[12px] bg-white dark:bg-[#222] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#111111]/5 dark:border-white/5 flex items-center justify-center mb-4">
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
