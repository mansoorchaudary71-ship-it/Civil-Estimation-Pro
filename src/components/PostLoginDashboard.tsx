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
      <div className="flex flex-col gap-4 mb-4 relative z-10 w-full overflow-hidden rounded-[40px]">
        
        {/* Welcome & Button */}
        <div className="flex flex-col items-center text-center gap-4 bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[40px] p-6 sm:p-8 md:p-12 shadow-md hover:shadow-xl transition-shadow relative group w-full box-border">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none rounded-[40px]"></div>
          <div className="z-10 relative flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--primary-dark)] dark:text-white tracking-tight mb-3">
              Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Ready to calculate your next project? Pick up where you left off or start a new estimate.
            </p>
          </div>
          
          <button 
            onClick={() => onSelectModule('calculators')}
            className="z-10 mt-2 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 shadow-md w-full md:w-auto min-w-[250px] flex items-center justify-center group/btn"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
          <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
          Recent Estimates
        </h2>
        {estimates.length > 0 && (
          <button 
            onClick={() => onSelectModule('my-estimates')}
            className="text-[13px] font-bold text-[var(--accent-blue)] hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : estimates.length > 0 ? (
        <div className="flex flex-col bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] overflow-hidden shadow-md">
          {recentEstimates.map((est, index) => (
            <div key={est.id} className={`flex items-center justify-between p-4 sm:p-5 ${index !== recentEstimates.length - 1 ? 'border-b border-slate-200/50' : ''} hover:bg-white/50 transition-colors group/est`}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[16px] sm:text-[17px] text-slate-900 dark:text-white leading-tight mb-0.5">{est.name}</span>
                  <div className="flex items-center gap-2 text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400">
                    <span>{est.date}</span>
                    <span>•</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{est.totalCost > 0 ? formatCurrency(est.totalCost) : '-'}</span>
                  </div>
                </div>
              </div>
              <button 
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-full transition-colors group-hover/est:bg-indigo-50 dark:group-hover/est:bg-indigo-900 group-hover/est:text-indigo-600 dark:group-hover/est:text-indigo-300"
              >
                Resume
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">No recent estimates</p>
          <p className="text-slate-500 font-medium text-sm">Create a new estimate to get started</p>
        </div>
      )}
    </div>
    </div>
  );
}
