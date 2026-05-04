import React, { useState } from 'react';
import { ModuleId } from '../App';
import { Clock, FolderOpen, ArrowRight, Home, Truck, Droplets } from 'lucide-react';

interface Estimate {
  id: string;
  title: string;
  date: string;
  type: ModuleId;
  typeLabel: string;
  color: string;
  icon: React.ReactNode;
}

const DUMMY_ESTIMATES: Estimate[] = [
  {
    id: '1',
    title: 'Smith Residence Reno',
    date: 'Oct 24, 2024',
    type: 'house',
    typeLabel: 'House Estimator',
    color: 'from-blue-500 to-indigo-600',
    icon: <Home className="w-5 h-5 text-white" />
  },
  {
    id: '2',
    title: 'Highway 42 Extension',
    date: 'Oct 20, 2024',
    type: 'earthworks',
    typeLabel: 'Earthworks',
    color: 'from-amber-500 to-orange-500',
    icon: <Truck className="w-5 h-5 text-white" />
  },
  {
    id: '3',
    title: 'Downtown Sewer Upgrade',
    date: 'Oct 15, 2024',
    type: 'sewerage',
    typeLabel: 'Sewerage',
    color: 'from-emerald-500 to-teal-500',
    icon: <Droplets className="w-5 h-5 text-white" />
  }
];

export default function RecentEstimates({ onSelectModule }: { onSelectModule: (id: ModuleId) => void }) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  
  if (estimates.length === 0) {
    return (
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            Recent Estimates
          </h3>
          <button 
            onClick={() => setEstimates(DUMMY_ESTIMATES)}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20"
          >
            Show Examples
          </button>
        </div>
        <div className="w-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 shadow-inner">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No Projects Yet</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">Create a new estimate from the modules above to see it appear in your saved projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-500" />
          Recent Estimates
        </h3>
        <button 
          onClick={() => setEstimates([])}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {estimates.map((est) => (
           <div 
             key={est.id}
             className="group relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-[2rem] p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
             onClick={() => onSelectModule(est.type)}
           >
             {/* Background Glow */}
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${est.color} opacity-5 dark:opacity-15 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`} />
             
             <div className="flex items-start justify-between mb-5 relative z-10">
               <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${est.color} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300`}>
                 {est.icon}
               </div>
               <div className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-100 dark:border-slate-700 shadow-sm">
                 {est.typeLabel}
               </div>
             </div>
             
             <div className="relative z-10 mb-6">
               <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                 {est.title}
               </h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Created {est.date}</p>
             </div>
             
             <button className="relative z-10 mt-auto w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white font-bold py-3.5 rounded-[1rem] flex items-center justify-center gap-2 transition-all duration-300">
               Open Project
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        ))}
      </div>
    </div>
  );
}
