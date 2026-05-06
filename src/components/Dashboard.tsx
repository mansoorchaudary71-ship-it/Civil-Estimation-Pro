import React, { useState } from 'react';
import { ModuleId } from '../App';
import { 
  Calculator, 
  Sparkles, 
  Truck,
  Route,
  Waves,
  Paintbrush,
  Home,
  TrendingUp,
  Hammer,
  Layers,
  BoxSelect,
  Search,
  Menu,
  CheckSquare,
  Map,
  Grid2X2,
  Box,
  ArrowRightLeft,
  Weight,
  Spline,
  ArrowRight,
  ChevronRight,
  HardHat,
  Scaling,
  Container,
  Repeat,
  Anvil,
  Building2,
  Blocks,
  Shovel,
  Pickaxe,
  Cone,
  Droplet,
  PaintBucket,
  Ruler
} from "lucide-react";

import Logo from './Logo';
import RecentEstimates from './RecentEstimates';

const ALL_MODULES = [
  { id: 'calculators', title: 'Construction Material', desc: 'Accurate estimations for concrete, bricks, steel, blocks, mortar.', category: 'TOOLS', icon: HardHat },
  { id: 'house', title: 'House Estimator', desc: 'Complete residential cost breakdown from grey structure to finishing.', category: 'RESIDENTIAL', icon: Home, premium: true, color: 'navy' },
  { id: 'area-calculator', title: 'Area Calculator', desc: 'Calculate area & perimeter for multiple 2D shapes.', category: 'TOOLS', icon: Scaling },
  { id: 'volume-estimator', title: 'Volume Estimator', desc: 'Calculate volumes, capacity & surface area.', category: 'TOOLS', icon: Container },
  { id: 'unit-converter', title: 'Unit Converter', desc: 'Convert units across 15 engineering categories.', category: 'TOOLS', icon: Repeat },
  { id: 'metal-weight', title: 'Metal Weight', desc: 'Calculate section weights of steel profiles.', category: 'TOOLS', icon: Anvil },
  { id: 'rcc-calculator', title: 'RCC Structure', desc: 'Calculate concrete & steel for slabs, columns.', category: 'TOOLS', icon: Building2 },
  { id: 'master-quantity', title: 'Master Quantity', desc: '23 comprehensive calculators for specialized construction items.', category: 'TOOLS', icon: Blocks },
  { id: 'earthworks', title: 'Earthworks', desc: 'Calculate site preparation, excavation and hauling volumes.', category: 'SITE PREP', icon: Shovel },
  { id: 'trench', title: 'Trench Excavation', desc: 'Pipe trenching and bedding volume estimations.', category: 'SITE PREP', icon: Pickaxe },
  { id: 'gridEarthwork', title: 'Grid Method Volume', desc: 'Leveling volume estimation using the grid method.', category: 'SITE PREP', icon: Grid2X2 },
  { id: 'road', title: 'Flexible Pavement', desc: 'Asphalt road layer estimations and material costs.', category: 'INFRA', icon: Cone },
  { id: 'rigid-pavement', title: 'Rigid Pavement', desc: 'Concrete road design material estimations.', category: 'INFRA', icon: Route },
  { id: 'chainage', title: 'Chainage Volume', desc: 'Road highway chainage extraction calculations.', category: 'INFRA', icon: Map },
  { id: 'sewerage', title: 'Sewerage & Drainage', desc: 'Pipes, manholes, and septic tank estimations.', category: 'INFRA', icon: Droplet },
  { id: 'formwork', title: 'Formwork & Scaffold', desc: 'Shuttering and scaffolding material computations.', category: 'STRUCTURAL', icon: Hammer },
  { id: 'finishing', title: 'Finishing Works', desc: 'Tiles, paint, doors, and window estimations.', category: 'INTERIORS', icon: PaintBucket },
  { id: 'takeoff', title: 'Plan Measure', desc: 'Area & linear extraction.', category: '2D TAKEOFF', icon: Ruler },
  { id: 'rates', title: 'Live DB Rates', desc: 'Centralized database for local market prices.', category: 'DATA', icon: TrendingUp },
  { id: 'ai', title: 'AI Assistant', desc: 'Ask anything about construction', category: 'GEMINI PRO', icon: Sparkles, premium: true, color: 'electric' },
];

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
}

const getCategoryTheme = (category: string, id: string) => {
  if (id === 'calculators') return { text: 'text-[#ef4444]', blob: 'bg-gradient-to-br from-[#ef4444]/40 to-transparent', border: 'border-[#ef4444]/30 dark:border-[#ef4444]/30' };
  if (id === 'area-calculator') return { text: 'text-[#f97316]', blob: 'bg-gradient-to-br from-[#f97316]/40 to-transparent', border: 'border-[#f97316]/30 dark:border-[#f97316]/30' };
  if (id === 'volume-estimator') return { text: 'text-[#0ea5e9]', blob: 'bg-gradient-to-br from-[#0ea5e9]/40 to-transparent', border: 'border-[#0ea5e9]/30 dark:border-[#0ea5e9]/30' };
  if (id === 'unit-converter') return { text: 'text-[#a855f7]', blob: 'bg-gradient-to-br from-[#a855f7]/40 to-transparent', border: 'border-[#a855f7]/30 dark:border-[#a855f7]/30' };
  if (id === 'metal-weight') return { text: 'text-[#475569]', blob: 'bg-gradient-to-br from-[#475569]/40 to-transparent', border: 'border-[#475569]/30 dark:border-[#475569]/30' };
  if (id === 'rcc-calculator') return { text: 'text-[#6366f1]', blob: 'bg-gradient-to-br from-[#6366f1]/40 to-transparent', border: 'border-[#6366f1]/30 dark:border-[#6366f1]/30' };
  if (id === 'master-quantity') return { text: 'text-[#3b82f6]', blob: 'bg-gradient-to-br from-[#3b82f6]/40 to-transparent', border: 'border-[#3b82f6]/30 dark:border-[#3b82f6]/30' };
  if (id === 'takeoff') return { text: 'text-[#10b981]', blob: 'bg-gradient-to-br from-[#10b981]/40 to-transparent', border: 'border-[#10b981]/30 dark:border-[#10b981]/30' };

  if (category === 'SITE PREP') return { text: 'text-[#f97316]', blob: 'bg-gradient-to-br from-[#f97316]/40 to-transparent', border: 'border-[#f97316]/30 dark:border-[#f97316]/30' };
  if (category === 'INFRA') return { text: 'text-[#3b82f6]', blob: 'bg-gradient-to-br from-[#3b82f6]/40 to-transparent', border: 'border-[#3b82f6]/30 dark:border-[#3b82f6]/30' };
  if (category === 'INTERIORS') return { text: 'text-[#d946ef]', blob: 'bg-gradient-to-br from-[#d946ef]/40 to-transparent', border: 'border-[#d946ef]/30 dark:border-[#d946ef]/30' };
  if (category === 'STRUCTURAL') return { text: 'text-[#ef4444]', blob: 'bg-gradient-to-br from-[#ef4444]/40 to-transparent', border: 'border-[#ef4444]/30 dark:border-[#ef4444]/30' };
  if (category === 'DATA') return { text: 'text-[#0ea5e9]', blob: 'bg-gradient-to-br from-[#0ea5e9]/40 to-transparent', border: 'border-[#0ea5e9]/30 dark:border-[#0ea5e9]/30' };
  if (category === 'GEMINI PRO') return { text: 'text-[#6366f1]', blob: 'bg-gradient-to-br from-[#6366f1]/40 to-transparent', border: 'border-[#6366f1]/30 dark:border-[#6366f1]/30' };
  
  return { text: 'text-[#64748b]', blob: 'bg-gradient-to-br from-[#64748b]/40 to-transparent', border: 'border-[#64748b]/30 dark:border-[#64748b]/30' };
};

export default function Dashboard({ onSelectModule, onOpenSidebar, onOpenSettings }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = ALL_MODULES.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return m.title.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term) || m.category.toLowerCase().includes(term);
  });

  const groupsToDisplay: string[] = [];
  const groupedModules: Record<string, typeof ALL_MODULES> = {};

  filteredModules.forEach(mod => {
    let groupName = mod.category;
    if (mod.id === 'calculators' || mod.id === 'house') {
      groupName = 'POPULAR';
    }

    if (!groupedModules[groupName]) {
      groupedModules[groupName] = [];
      groupsToDisplay.push(groupName);
    }
    groupedModules[groupName].push(mod);
  });

  return (
    <div className="flex-1 px-4 md:px-8 py-6 pb-12 w-full max-w-7xl mx-auto flex flex-col font-sans">
      <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-[1.1rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
            Civil Estimation Pro
          </span>
        </div>
        <button onClick={onOpenSidebar} className="p-2 -mr-2 text-slate-700 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center mt-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white flex items-center justify-center gap-2">
           Welcome back, Alex <span className="text-2xl md:text-3xl animate-bounce origin-bottom hover:animate-none cursor-default inline-block" style={{animationDuration: '2s', animationIterationCount: 2}}>👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-base">Ready to continue your estimates?</p>
      </div>

      <div className="mb-10 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
        <div className="relative group w-full max-w-2xl rounded-full p-[1px] bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 shadow-sm focus-within:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
          <div className="absolute inset-y-0 left-[24px] flex items-center pointer-events-none z-10">
            <Search className="text-slate-400 dark:text-slate-500 w-5 h-5 transition-colors group-focus-within:text-red-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search tools, materials, or projects." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full bg-white dark:bg-slate-900 rounded-full py-3.5 pl-[46px] pr-6 text-base font-semibold text-slate-800 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        {groupsToDisplay.map((groupName) => (
          <div key={groupName} className="flex flex-col gap-5">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 pl-2">
              {groupName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full">
              {groupedModules[groupName].map((mod) => {
                if (mod.id === 'house') {
                  return (
                    <button 
                      key={mod.id} 
                      onClick={() => onSelectModule(mod.id as ModuleId)} 
                      className="col-span-1 bg-gradient-to-br from-[#4c1d95] via-[#3730a3] to-[#312e81] p-5 md:p-6 rounded-[28px] md:rounded-[32px] transition-all duration-300 flex flex-col items-start relative text-left group hover:-translate-y-1 shadow-[0_8px_30px_rgba(76,29,149,0.15)] h-[160px] md:h-[180px] overflow-hidden"
                    >
                      <div className="absolute right-[-10%] bottom-[-5%] text-indigo-300/10 group-hover:text-indigo-300/20 transition-all duration-500 pointer-events-none group-active:scale-95 group-active:-rotate-6">
                         <Home className="w-[180px] h-[180px] md:w-[220px] md:h-[220px]" strokeWidth={1} />
                      </div>
                      
                      <div className="relative z-10 w-full flex-1 flex flex-col items-start pr-0">
                        <div className="w-full flex justify-between items-start mb-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-400/30 bg-white/5 backdrop-blur-sm text-[11px] md:text-[12px] font-bold tracking-[0.1em] uppercase text-[#a5b4fc] shadow-sm">
                             <mod.icon className="w-4 h-4 md:w-[15px] md:h-[15px]" strokeWidth={2.5} />
                             <span className="truncate">{mod.category}</span>
                          </div>
                          
                          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ml-2 shrink-0">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/40 to-transparent blur-[12px] md:blur-[16px] transition-transform duration-500 group-hover:scale-150 group-active:scale-100"></div>
                            <mod.icon className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-indigo-200 transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-active:rotate-12" strokeWidth={2.5} />
                          </div>
                        </div>
                        
                        <h3 className="text-[20px] md:text-[24px] font-extrabold text-white mb-2 leading-[1.15]">{mod.title}</h3>
                        
                        <div className="flex flex-row flex-wrap gap-2 mt-auto pb-0 w-full">
                           <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-[10px] md:rounded-full border border-indigo-400/40 bg-white/5 backdrop-blur-md text-[12px] md:text-[13px] font-medium text-indigo-50 transition-colors group-hover:bg-white/10 group-hover:border-indigo-400/60">
                             Grey Structure
                           </div>
                           <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-[10px] md:rounded-full border border-indigo-400/40 bg-white/5 backdrop-blur-md text-[12px] md:text-[13px] font-medium text-indigo-50 transition-colors group-hover:bg-white/10 group-hover:border-indigo-400/60">
                             Finishing
                           </div>
                        </div>
                      </div>
                    </button>
                  );
                }

                const theme = getCategoryTheme(mod.category, mod.id);
                return (
                  <button 
                    key={mod.id} 
                    onClick={() => onSelectModule(mod.id as ModuleId)} 
                    className={`col-span-1 bg-[#FFFFFF] dark:bg-slate-900 p-5 md:p-6 rounded-[28px] md:rounded-[32px] transition-all duration-300 flex flex-col items-start relative text-left group hover:-translate-y-1 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border ${theme.border} h-[160px] md:h-[180px] overflow-hidden`}
                  >
                    <div className="relative z-10 w-full flex-1 flex flex-col items-start pr-0">
                      <div className="w-full flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} bg-slate-50 dark:bg-slate-800/80 shadow-sm text-[11px] md:text-[12px] font-bold tracking-[0.1em] uppercase ${theme.text}`}>
                           <mod.icon className="w-4 h-4 md:w-[15px] md:h-[15px]" strokeWidth={2.5} />
                           <span className="truncate">{mod.category}</span>
                        </div>
                        
                        <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ml-2 shrink-0">
                          <div className={`absolute inset-0 rounded-full ${theme.blob} blur-[12px] md:blur-[16px] transition-transform duration-500 group-hover:scale-150 group-active:scale-100`}></div>
                          <mod.icon className={`relative z-10 w-6 h-6 md:w-7 md:h-7 ${theme.text} transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-active:rotate-12`} strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      <h3 className="text-[20px] md:text-[24px] font-extrabold text-[#0f172a] dark:text-white mb-2 leading-[1.15]">{mod.title}</h3>
                      <p className="text-[13px] md:text-[14px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 md:line-clamp-3">{mod.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
