import React, { useState, useEffect } from 'react';
import { ModuleId } from '../App';
import { Clock, FolderOpen, ArrowRight, Loader2, GripVertical, FileText } from 'lucide-react';
import { getMyEstimates, updateEstimateStatus, updateEstimateOrders } from '../lib/estimates';
import { useAuth } from '../contexts/AuthContext';
import { ALL_MODULES, getCategoryTheme } from './Dashboard';

interface Estimate {
  id: string;
  title: string;
  date: string;
  type: ModuleId;
  typeLabel: string;
  color: string;
  icon: any;
  progress: number;
  status: string;
  order?: number;
  desc: string;
  theme: any;
}

const mapCalculatorToModule = (calcId: string): ModuleId => {
  const mapping: Record<string, ModuleId> = {
    'area_v1': 'area-calculator',
    'volume_v1': 'volume-estimator',
    'unit_converter_v1': 'unit-converter',
    'metal_weight_v1': 'metal-weight',
    'rcc_slab_v1': 'master-rcc',
    'column_v1': 'column-estimator',
    'staircase_v1': 'staircase-calculator',
    'master_qty_v1': 'master-quantity',
    'calculators_v1': 'calculators',
    'ai_assistant_v1': 'ai',
    'earthworks_v1': 'earthworks',
    'grid_earthwork_v1': 'earthworks',
    'trench_excavation_v1': 'earthworks',
    'chainage_v1': 'chainage',
    'road_estimator_v1': 'road-pavement',
    'rigid_pavement_v1': 'road-pavement',
    'sewerage_v1': 'earthworks',
    'formwork_estimator_v1': 'formwork',
    'finishing_estimator_v1': 'interiors-finishes',
    'house_estimator_v1': 'house',
    'rate_analysis_v1': 'rates',
  };
  return mapping[calcId] || 'calculators';
};

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
          }).map((d: any) => {
            const modId = mapCalculatorToModule(d.payload?.calculatorId || '');
            const modInfo = ALL_MODULES.find(m => m.id === modId) || ALL_MODULES[0];
            const theme = getCategoryTheme(modInfo.category, modInfo.id);
            
            return {
              id: d.id,
              title: d.name,
              desc: d.type && d.type !== 'material_calculation' ? d.type : modInfo.title,
              date: new Date(d.createdAt).toLocaleDateString(),
              type: modId,
              typeLabel: modInfo.category,
              color: theme.bg,
              icon: modInfo.icon,
              progress: 100,
              status: d.status || 'To Do',
              order: d.order,
              theme: theme
            };
          });
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
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col font-sans mb-auto">
        <div className="mb-8 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center mt-6">
          <h1 className="text-[28px] md:text-[28px] font-extrabold tracking-tight text-text-primary flex items-center justify-center gap-2">
            My Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-base">
            Manage your saved construction projects and estimates
          </p>
        </div>
        <div className="w-full bg-bg-card opacity-90 backdrop-blur-xl border border-border-color rounded-[12px] p-[20px] flex flex-col items-center justify-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 bg-bg-primary rounded-[12px] flex items-center justify-center mb-4 text-slate-400 dark:text-[#4B5563] shadow-inner">
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
      <div className="flex-1 py-20 w-full flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col font-sans pb-12">
      <div className="mb-8 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center mt-6">
        <h1 className="text-[28px] md:text-[28px] font-extrabold tracking-tight text-text-primary flex items-center justify-center gap-2">
          My Projects
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-base">
          Manage your saved construction projects and estimates
        </p>
      </div>

      {estimates.length === 0 ? (
        <div className="w-full bg-bg-card opacity-90 backdrop-blur-xl border border-border-color rounded-[12px] p-[20px] flex flex-col items-center justify-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 bg-bg-primary rounded-[12px] flex items-center justify-center mb-4 text-slate-400 dark:text-[#4B5563] shadow-inner">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No Projects Yet</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">Create a new estimate from the modules globally to see it appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          {estimates.map((est: any) => {
            const Icon = est.icon;
            
            return (
              <div 
                key={est.id}
                draggable
                onDragStart={(e) => handleDragStart(e, est.id)}
                onDragOver={(e) => handleDragOver(e, est.id)}
                onDrop={handleDrop}
                className={`group relative col-span-1 bg-bg-card p-[20px] md:p-4 rounded-[12px] transition-all duration-300 flex flex-col items-center text-center border-2 border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer hover:-translate-y-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden ${dragOverId === est.id ? '!border-indigo-500 shadow-indigo-500/20' : ''} ${draggedId === est.id ? 'opacity-50' : 'opacity-100'}`}
                onClick={() => onSelectModule(est.type)}
                style={{ minHeight: "150px" }}
              >
                {/* Drag Handle Top Left */}
                <div className="absolute top-4 left-4 z-20 cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 p-1" onPointerDown={e => e.stopPropagation()}>
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {/* Status Selector Top Right */}
                <div className="absolute top-4 right-4 z-20">
                  <select
                    value={est.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(e, est.id)}
                    className={`text-[11px] font-bold rounded-[12px] px-2 py-1.5 border-none focus:ring-2 focus:ring-[#6B46C1] cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors ${
                      est.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      est.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-600 dark:bg-[#6B46C1] dark:text-slate-300'
                    }`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="relative z-10 w-full flex-1 flex flex-col items-center mt-6">
                  <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 shrink-0">
                    <div
                      className={`absolute inset-0 rounded-full ${est.theme.bg} opacity-20 blur-[12px] md:blur-[16px] transition-transform duration-500 group-hover:scale-150 group-active:scale-100`}
                    />
                    <Icon
                      className={`relative z-10 w-7 h-7 md:w-8 md:h-8 ${est.theme.textRaw} transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-active:rotate-12`}
                      strokeWidth={2.5}
                    />
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] border ${est.theme.border} bg-bg-primary shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[11px] md:text-[12px] font-bold tracking-[0.1em] uppercase ${est.theme.textRaw} mb-4`}
                  >
                    <span className="truncate">{est.typeLabel}</span>
                  </div>

                  <h3 className="text-[18px] md:text-[20px] font-extrabold text-text-primary mb-2 leading-[1.2]">
                    {est.title}
                  </h3>
                  
                  <div className="flex flex-col items-center mt-auto">
                    <p className="text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                      <FileText className="w-3 h-3 inline mr-1 opacity-70" /> {est.desc}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">Saved: {est.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
