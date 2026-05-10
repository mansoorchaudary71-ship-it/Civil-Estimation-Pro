import React, { useState, useEffect } from 'react';
import { ModuleId } from '../App';
import { Clock, FolderOpen, ArrowRight, Home, Truck, Droplets, HardHat, Loader2, GripVertical } from 'lucide-react';
import { getMyEstimates, updateEstimateStatus, updateEstimateOrders } from '../lib/estimates';
import { useAuth } from '../contexts/AuthContext';

interface Estimate {
  id: string;
  title: string;
  date: string;
  type: ModuleId;
  typeLabel: string;
  color: string;
  icon: React.ReactNode;
  progress: number;
  status: string;
  order?: number;
}

export default function RecentEstimates({ onSelectModule }: { onSelectModule: (id: ModuleId) => void }) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      setEstimates([]);
      return;
    }
    const loadEstimates = async () => {
      setLoading(true);
      try {
        const data: any[] | null = await getMyEstimates();
        if (data) {
          const formatted = data.sort((a: any, b: any) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            return b.createdAt - a.createdAt;
          }).map((d: any) => ({
            id: d.id,
            title: d.name,
            date: new Date(d.createdAt).toLocaleDateString(),
            type: 'calculators' as ModuleId,
            typeLabel: 'Material Estimate',
            color: 'from-[#ef4444] to-[#f97316]',
            icon: <HardHat className="w-5 h-5 text-white" />,
            progress: 100,
            status: d.status || 'To Do',
            order: d.order,
          }));
          setEstimates(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEstimates();
  }, [user]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    setEstimates(prev => prev.map(est => est.id === id ? { ...est, status: newStatus } : est));
    try {
      await updateEstimateStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(targetId);
    if (!draggedId || draggedId === targetId) return;

    const originalEstimates = [...estimates];
    const draggedIndex = originalEstimates.findIndex(est => est.id === draggedId);
    const targetIndex = originalEstimates.findIndex(est => est.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newEstimates = [...originalEstimates];
      const [draggedItem] = newEstimates.splice(draggedIndex, 1);
      newEstimates.splice(targetIndex, 0, draggedItem);
      setEstimates(newEstimates);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedId(null);
    setDragOverId(null);
    
    try {
      if (estimates.length > 0) {
         await updateEstimateOrders(estimates.map((est, idx) => ({ id: est.id, order: idx })));
      }
    } catch (err) {
       console.error("Failed to update estimate order", err);
    }
  };

  if (!user) {
    return (
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            Recent Estimates
          </h3>
        </div>
        <div className="w-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 shadow-inner">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Sign in to save estimates</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">Your saved estimates will appear here once you sign in and start estimating.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 mb-6 py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }
  
  if (estimates.length === 0) {
    return (
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            Recent Estimates
          </h3>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {estimates.map((est) => (
           <div 
             key={est.id}
             draggable
             onDragStart={(e) => handleDragStart(e, est.id)}
             onDragOver={(e) => handleDragOver(e, est.id)}
             onDrop={handleDrop}
             className={`group relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border ${dragOverId === est.id ? 'border-indigo-500 shadow-indigo-500/20' : 'border-white/40 dark:border-slate-800/60'} rounded-[2rem] p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${draggedId === est.id ? 'opacity-50' : 'opacity-100'}`}
             onClick={() => onSelectModule(est.type)}
           >
             {/* Background Glow */}
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${est.color} opacity-5 dark:opacity-15 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`} />
             
             <div className="flex items-start justify-between mb-5 relative z-10">
               <div className="flex items-center gap-3">
                 <div className="cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 p-1" onPointerDown={e => e.stopPropagation()}>
                   <GripVertical className="w-5 h-5" />
                 </div>
                 <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${est.color} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300`}>
                   {est.icon}
                 </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <div className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-100 dark:border-slate-700 shadow-sm">
                   {est.typeLabel}
                 </div>
                 <select
                   value={est.status}
                   onClick={(e) => e.stopPropagation()}
                   onChange={(e) => handleStatusChange(e, est.id)}
                   className={`text-xs font-bold rounded-lg px-2 py-1.5 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-colors ${
                     est.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                     est.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                     'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                   }`}
                 >
                   <option value="To Do">To Do</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Completed">Completed</option>
                 </select>
               </div>
             </div>
             
             <div className="relative z-10 mb-6">
               <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                 {est.title}
               </h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">Created {est.date}</p>
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
