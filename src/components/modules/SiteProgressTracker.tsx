import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MaterialSummary } from '../ui/MaterialSummary';
import { Calendar, CheckCircle, Image as ImageIcon, Link, BarChart, Upload, Trash2, Edit2, ChevronRight, FileOutput, Share2 } from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  actualCost: number;
  photos: string[];
}

const DEFAULT_PHASES: Phase[] = [
  { id: '1', name: 'Foundation', startDate: '2024-06-01', endDate: '2024-06-15', progress: 100, budget: 15000, actualCost: 14500, photos: [] },
  { id: '2', name: 'Structure', startDate: '2024-06-16', endDate: '2024-07-20', progress: 60, budget: 35000, actualCost: 22000, photos: [] },
  { id: '3', name: 'Roof', startDate: '2024-07-21', endDate: '2024-08-05', progress: 0, budget: 12000, actualCost: 0, photos: [] },
  { id: '4', name: 'Brickwork', startDate: '2024-08-06', endDate: '2024-08-25', progress: 0, budget: 18000, actualCost: 0, photos: [] },
  { id: '5', name: 'Plastering', startDate: '2024-08-26', endDate: '2024-09-10', progress: 0, budget: 8000, actualCost: 0, photos: [] },
  { id: '6', name: 'Flooring', startDate: '2024-09-11', endDate: '2024-09-25', progress: 0, budget: 15000, actualCost: 0, photos: [] },
  { id: '7', name: 'Paint', startDate: '2024-09-26', endDate: '2024-10-10', progress: 0, budget: 6000, actualCost: 0, photos: [] },
  { id: '8', name: 'Finishing', startDate: '2024-10-11', endDate: '2024-10-20', progress: 0, budget: 10000, actualCost: 0, photos: [] },
];

export default function SiteProgressTracker() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [isClientDemo, setIsClientDemo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('site_progress_data');
    if (saved) {
      try {
         setPhases(JSON.parse(saved));
      } catch (e) {
         setPhases(DEFAULT_PHASES);
      }
    } else {
      // Setup some dynamic dates relative to today for demo
      const today = new Date();
      const demoPhases = DEFAULT_PHASES.map((p, i) => {
         const start = new Date(today);
         start.setDate(today.getDate() + (i * 15) - 30); // start 30 days ago
         const end = new Date(start);
         end.setDate(start.getDate() + 14);
         return { ...p, startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
      });
      setPhases(demoPhases);
    }
  }, []);

  useEffect(() => {
    if (phases.length > 0) {
      localStorage.setItem('site_progress_data', JSON.stringify(phases));
    }
  }, [phases]);

  // Calculations
  const metrics = useMemo(() => {
    if (phases.length === 0) return { overallProgress: 0, totalBudget: 0, totalCost: 0, daysAheadBehind: 0 };
    
    let totalBudget = 0;
    let totalCost = 0;
    let totalProgressWeight = 0;
    
    // To calculate days ahead/behind, we compare expected progress vs actual
    // Simple metric: if total actual cost > total budget (relative to progress), we are over burn.
    // Time delta: sum of (budget * expected progress) vs (budget * actual progress)
    let expectedWeight = 0;
    const today = new Date().getTime();

    phases.forEach(p => {
      totalBudget += p.budget;
      totalCost += p.actualCost;
      totalProgressWeight += (p.progress / 100) * p.budget;
      
      const s = new Date(p.startDate).getTime();
      const e = new Date(p.endDate).getTime();
      
      let expectedPct = 0;
      if (today >= e) expectedPct = 100;
      else if (today > s && e > s) {
         expectedPct = ((today - s) / (e - s)) * 100;
      }
      expectedWeight += (expectedPct / 100) * p.budget;
    });

    const overallProgress = totalBudget > 0 ? (totalProgressWeight / totalBudget) * 100 : 0;
    const expectedProgress = totalBudget > 0 ? (expectedWeight / totalBudget) * 100 : 0;
    
    // Simple days estimation (1% progress = ~X days). Hacky but visually effective.
    const progressDiff = overallProgress - expectedProgress;
    const projectDuration = phases.length > 0 ? (new Date(phases[phases.length-1].endDate).getTime() - new Date(phases[0].startDate).getTime()) / (1000*60*60*24) : 0;
    const daysAheadBehind = Math.round((progressDiff / 100) * projectDuration);

    return { overallProgress, totalBudget, totalCost, daysAheadBehind };
  }, [phases]);

  // Gantt Chart Logic
  const ganttScale = useMemo(() => {
     if (phases.length === 0) return { start: new Date(), end: new Date(), days: 1 };
     let minDate = new Date(phases[0].startDate).getTime();
     let maxDate = new Date(phases[0].endDate).getTime();
     phases.forEach(p => {
       const s = new Date(p.startDate).getTime();
       const e = new Date(p.endDate).getTime();
       if (s < minDate) minDate = s;
       if (e > maxDate) maxDate = e;
     });
     
     // Add padding
     minDate -= (1000 * 60 * 60 * 24 * 7); // 1 week before
     maxDate += (1000 * 60 * 60 * 24 * 7); // 1 week after
     
     return {
        start: minDate,
        end: maxDate,
        days: (maxDate - minDate) / (1000 * 60 * 60 * 24)
     };
  }, [phases]);

  const handleUpdatePhase = (id: string, field: keyof Phase, value: any) => {
     setPhases(phases.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedPhase) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
       const b64 = reader.result as string;
       setPhases(phases.map(p => {
         if (p.id === selectedPhase) {
           return { ...p, photos: [...p.photos, b64] };
         }
         return p;
       }));
    };
    reader.readAsDataURL(file);
  };

  const handleShare = () => {
     setIsClientDemo(true);
     setTimeout(() => setIsClientDemo(false), 5000); // Reset after 5s just for demo
     alert('Shareable link copied to clipboard! (Demo feature)');
  };

  const activePhase = phases.find(p => p.id === selectedPhase);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
         <div>
           <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <BarChart className="w-8 h-8" />
              </div>
              Site Progress Tracker
           </h2>
           <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Track timelines, budgets, and visual progress.</p>
         </div>
         <div className="flex gap-2">
            <button onClick={handleShare} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2">
               <Share2 className="w-5 h-5" /> Share
            </button>
            <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2">
               <FileOutput className="w-5 h-5" /> Report
            </button>
         </div>
       </div>

       {isClientDemo && (
          <div className="bg-indigo-600 text-white p-3 text-center rounded-xl font-bold text-sm mb-4 animate-pulse">
             Client View Active - Read Only Mode
          </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          <div className="lg:col-span-3 space-y-6">
             {/* Scorecards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-center">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                   <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 relative z-10">Overall Progress</p>
                   <div className="flex items-end gap-2 relative z-10">
                     <h3 className="text-4xl font-black text-slate-800 dark:text-white leading-none">{metrics.overallProgress.toFixed(1)}<span className="text-2xl text-slate-400">%</span></h3>
                   </div>
                   <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden relative z-10 border border-slate-200 dark:border-slate-700">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${metrics.overallProgress}%` }}></div>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-center">
                   <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 relative z-10">Cost & Burn</p>
                   <div className="flex items-end gap-2 relative z-10">
                     <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">${(metrics.totalCost / 1000).toFixed(1)}k</h3>
                     <span className="text-sm font-bold text-slate-500 mb-1">/ ${(metrics.totalBudget / 1000).toFixed(1)}k</span>
                   </div>
                   <p className={`text-xs font-bold mt-3 relative z-10 ${metrics.totalCost > metrics.totalBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {metrics.totalCost > metrics.totalBudget ? `-$${(metrics.totalCost - metrics.totalBudget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Over Budget` : `+$${(metrics.totalBudget - metrics.totalCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Under Budget`}
                   </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-center">
                   <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 relative z-10">Schedule Status</p>
                   {metrics.daysAheadBehind > 0 ? (
                      <h3 className="text-3xl font-black text-emerald-500 leading-none">{metrics.daysAheadBehind} <span className="text-lg text-emerald-600/50">Days Ahead</span></h3>
                   ) : metrics.daysAheadBehind < 0 ? (
                      <h3 className="text-3xl font-black text-rose-500 leading-none">{Math.abs(metrics.daysAheadBehind)} <span className="text-lg text-rose-600/50">Days Behind</span></h3>
                   ) : (
                      <h3 className="text-3xl font-black text-slate-500 leading-none">On Track</h3>
                   )}
                   <p className="text-xs font-bold mt-3 relative z-10 text-slate-400">Based on expected % vs actual %</p>
                </div>
             </div>

             {/* Dynamic CSS Gantt Chart */}
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Execution Timeline</h3>
                
                <div className="relative">
                   {/* Grid lines */}
                   <div className="absolute inset-0 flex justify-between px-32 ml-4">
                      {Array.from({length: 6}).map((_, i) => (
                         <div key={i} className="w-px h-full bg-slate-100 dark:bg-slate-800/50"></div>
                      ))}
                   </div>

                   {/* Phases */}
                   <div className="space-y-4 relative z-10">
                      {phases.map((phase) => {
                         const startTs = new Date(phase.startDate).getTime();
                         const endTs = new Date(phase.endDate).getTime();
                         const leftPct = ((startTs - ganttScale.start) / (ganttScale.end - ganttScale.start)) * 100;
                         const widthPct = ((endTs - startTs) / (ganttScale.end - ganttScale.start)) * 100;
                         
                         const isSelected = selectedPhase === phase.id;

                         return (
                            <div key={phase.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => setSelectedPhase(phase.id)}>
                               <div className={`w-32 truncate text-sm font-bold text-right transition-colors ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                  {phase.name}
                               </div>
                               <div className="flex-1 h-10 relative bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition">
                                  <div 
                                     className={`absolute h-6 top-2 rounded-lg shadow-sm overflow-hidden border border-black/5 transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-emerald-500 ring-offset-white dark:ring-offset-slate-900' : ''}`}
                                     style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: '#e2e8f0' }}
                                  >
                                     <div 
                                        className={`h-full transition-all ${phase.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                        style={{ width: `${phase.progress}%` }}
                                     ></div>
                                  </div>
                               </div>
                               <div className="w-12 text-sm font-bold text-slate-500 text-right">
                                  {phase.progress}%
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             {/* Detail Panel */}
             {activePhase ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm sticky top-6">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-slate-800 dark:text-white">{activePhase.name}</h3>
                      <button onClick={() => setSelectedPhase(null)} className="text-slate-400 hover:text-slate-600"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                   </div>
                   
                   <div className="space-y-5">
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Progress (%)</label>
                         <input 
                            type="range" 
                            min="0" max="100" 
                            value={activePhase.progress} 
                            onChange={(e) => handleUpdatePhase(activePhase.id, 'progress', parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                            disabled={isClientDemo}
                         />
                         <div className="text-right mt-1 font-black text-indigo-600 dark:text-indigo-400">{activePhase.progress}%</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                            <input 
                               type="date" 
                               value={activePhase.startDate} 
                               onChange={(e) => handleUpdatePhase(activePhase.id, 'startDate', e.target.value)}
                               className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold outline-none"
                               disabled={isClientDemo}
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                            <input 
                               type="date" 
                               value={activePhase.endDate} 
                               onChange={(e) => handleUpdatePhase(activePhase.id, 'endDate', e.target.value)}
                               className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold outline-none"
                               disabled={isClientDemo}
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Budget</label>
                            <div className="flex items-center">
                               <span className="bg-slate-100 dark:bg-slate-800 px-2 py-2 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-500">$</span>
                               <input 
                                  type="number" 
                                  value={activePhase.budget} 
                                  onChange={(e) => handleUpdatePhase(activePhase.id, 'budget', parseFloat(e.target.value)||0)}
                                  className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm font-semibold outline-none"
                                  disabled={isClientDemo}
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Actual Cost</label>
                            <div className="flex items-center">
                               <span className="bg-slate-100 dark:bg-slate-800 px-2 py-2 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-500">$</span>
                               <input 
                                  type="number" 
                                  value={activePhase.actualCost} 
                                  onChange={(e) => handleUpdatePhase(activePhase.id, 'actualCost', parseFloat(e.target.value)||0)}
                                  className={`w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm font-bold outline-none ${activePhase.actualCost > activePhase.budget ? 'text-rose-600' : 'text-emerald-600'}`}
                                  disabled={isClientDemo}
                               />
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                         <div className="flex justify-between items-center mb-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Site Photos ({activePhase.photos.length})</label>
                            <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700">
                               <Upload className="w-3 h-3" /> Upload
                            </button>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                         </div>
                         
                         {activePhase.photos.length === 0 ? (
                            <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                               <ImageIcon className="w-6 h-6 opacity-50" />
                            </div>
                         ) : (
                            <div className="grid grid-cols-2 gap-2">
                               {activePhase.photos.map((p, idx) => (
                                  <div key={idx} className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
                                     <img src={p} alt={`Progess ${idx}`} className="w-full h-full object-cover" />
                                     <button 
                                        onClick={() => {
                                           const newPhotos = [...activePhase.photos];
                                           newPhotos.splice(idx, 1);
                                           handleUpdatePhase(activePhase.id, 'photos', newPhotos);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                                     >
                                        <Trash2 className="w-3 h-3" />
                                     </button>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 rounded-[2rem] text-center flex flex-col items-center justify-center min-h-[400px]">
                   <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                   <h3 className="font-bold text-slate-500 mb-1">Select a Phase</h3>
                   <p className="text-sm text-slate-400">Click on any phase in the timeline to edit progress, budgets, and upload photos.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
