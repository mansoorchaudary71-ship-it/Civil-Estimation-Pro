const fs = require('fs');
const path = require('path');

const content = `import React, { useState } from 'react';
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
  ChevronRight
} from "lucide-react";

import Logo from './Logo';
import RecentEstimates from './RecentEstimates';

const ALL_MODULES = [
  { id: 'calculators', title: 'Construction Material', desc: 'Accurate estimations for concrete, bricks, steel, blocks, mortar.', category: 'TOOLS', icon: Calculator },
  { id: 'area-calculator', title: 'Area Calculator', desc: 'Calculate area & perimeter for multiple 2D shapes.', category: 'TOOLS', icon: Grid2X2 },
  { id: 'volume-estimator', title: 'Volume Estimator', desc: 'Calculate volumes, capacity & surface area.', category: 'TOOLS', icon: Box },
  { id: 'unit-converter', title: 'Unit Converter', desc: 'Convert units across 15 engineering categories.', category: 'TOOLS', icon: ArrowRightLeft },
  { id: 'metal-weight', title: 'Metal Weight', desc: 'Calculate section weights of steel profiles.', category: 'TOOLS', icon: Weight },
  { id: 'rcc-calculator', title: 'RCC Structure', desc: 'Calculate concrete & steel for slabs, columns.', category: 'TOOLS', icon: Spline },
  { id: 'master-quantity', title: 'Master Quantity', desc: '23 comprehensive calculators for specialized construction items.', category: 'TOOLS', icon: Layers },
  { id: 'house', title: 'House Estimator', desc: 'Complete residential cost breakdown from grey structure to finishing.', category: 'RESIDENTIAL', icon: Home, premium: true, color: 'navy' },
  { id: 'takeoff', title: 'Plan Measure', desc: 'Area & linear extraction.', category: '2D TAKEOFF', icon: BoxSelect },
  { id: 'ai', title: 'AI Assistant', desc: 'Ask anything about construction', category: 'GEMINI PRO', icon: Sparkles, premium: true, color: 'electric' },
  { id: 'earthworks', title: 'Earthworks', desc: 'Calculate site preparation, excavation and hauling volumes.', category: 'SITE PREP', icon: Truck },
  { id: 'trench', title: 'Trench Excavation', desc: 'Pipe trenching and bedding volume estimations.', category: 'SITE PREP', icon: CheckSquare },
  { id: 'gridEarthwork', title: 'Grid Method Volume', desc: 'Leveling volume estimation using the grid method.', category: 'SITE PREP', icon: Grid2X2 },
  { id: 'road', title: 'Flexible Pavement', desc: 'Asphalt road layer estimations and material costs.', category: 'INFRASTRUCTURE', icon: Route },
  { id: 'rigid-pavement', title: 'Rigid Pavement', desc: 'Concrete road design material estimations.', category: 'INFRASTRUCTURE', icon: Layers },
  { id: 'chainage', title: 'Chainage Volume', desc: 'Road highway chainage extraction calculations.', category: 'INFRASTRUCTURE', icon: Map },
  { id: 'sewerage', title: 'Sewerage & Drainage', desc: 'Pipes, manholes, and septic tank estimations.', category: 'INFRASTRUCTURE', icon: Waves },
  { id: 'finishing', title: 'Finishing Works', desc: 'Tiles, paint, doors, and window estimations.', category: 'INTERIORS', icon: Paintbrush },
  { id: 'formwork', title: 'Formwork & Scaffold', desc: 'Shuttering and scaffolding material computations.', category: 'STRUCTURAL', icon: Hammer },
  { id: 'rates', title: 'Live DB Rates', desc: 'Centralized database for local market prices.', category: 'DATA', icon: TrendingUp },
];

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
}

const getIconStyles = (id: string) => {
  const styles: Record<string, string> = {
    calculators: 'bg-red-50 text-red-500',
    'area-calculator': 'bg-orange-50 text-orange-500',
    'volume-estimator': 'bg-teal-50 text-teal-500',
    'unit-converter': 'bg-fuchsia-50 text-fuchsia-500',
    'metal-weight': 'bg-slate-100 text-slate-600',
    'rcc-calculator': 'bg-indigo-50 text-indigo-500',
    'master-quantity': 'bg-blue-50 text-blue-500',
    takeoff: 'bg-emerald-50 text-emerald-500', 
    earthworks: 'bg-amber-50 text-amber-500',
    trench: 'bg-emerald-50 text-emerald-500',
  };
  return styles[id] || 'bg-blue-50 text-blue-500';
}

export default function Dashboard({ onSelectModule, onOpenSidebar, onOpenSettings }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = ALL_MODULES.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return m.title.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term) || m.category.toLowerCase().includes(term);
  });

  return (
    <div className="flex-1 px-4 md:px-8 py-6 pb-12 w-full max-w-7xl mx-auto flex flex-col font-sans">
      <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6" />
        </div>
        <button onClick={onOpenSidebar} className="p-2 -mr-2 text-slate-700 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8 flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white flex items-center gap-2">
           Welcome back, Alex <span className="text-2xl md:text-3xl animate-bounce origin-bottom hover:animate-none cursor-default inline-block" style={{animationDuration: '2s', animationIterationCount: 2}}>👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-base">Ready to continue your estimates?</p>
      </div>

      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
        <div className="relative group w-full max-w-2xl">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-400 dark:text-slate-500 w-5 h-5 transition-transform group-focus-within:text-blue-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search tools, materials, or projects." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-[1px] border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-full py-3.5 pl-12 pr-6 text-base font-semibold text-slate-800 dark:text-white shadow-sm focus:shadow-md outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        {filteredModules.map((mod) => {
          if (mod.id === 'house') {
            return (
              <button 
                key={mod.id} 
                onClick={() => onSelectModule(mod.id as ModuleId)} 
                className="col-span-2 relative bg-[#4f46e5] dark:bg-[#3730a3] p-5 md:p-6 rounded-[28px] flex flex-col items-start text-left hover:-translate-y-1 hover:shadow-lg transition-all overflow-hidden group min-h-[180px]"
              >
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                  <Home className="w-48 h-48 text-white" strokeWidth={1} />
                </div>
                <div className="relative z-10 w-full flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#a5b4fc] uppercase mb-2">
                       <Home className="w-3.5 h-3.5" />
                       <span>{mod.category}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight w-2/3">{mod.title}</h3>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="px-3 py-1 bg-white/20 border border-white/10 rounded-full text-[10px] font-semibold text-white backdrop-blur-sm">Grey Structure</span>
                    <span className="px-3 py-1 bg-white/20 border border-white/10 rounded-full text-[10px] font-semibold text-white backdrop-blur-sm">Finishing</span>
                  </div>
                </div>
              </button>
            );
          }
          
          if (mod.id === 'ai') {
            return (
              <button 
                key={mod.id} 
                onClick={() => onSelectModule(mod.id as ModuleId)} 
                className="col-span-2 relative bg-[#0f172a] p-5 md:p-6 rounded-[28px] border border-[#1e293b] flex flex-row justify-between items-center text-left hover:-translate-y-1 hover:shadow-lg transition-all overflow-hidden group min-h-[140px]"
              >
                <div className="relative z-10 flex flex-col items-start w-full pr-8">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase mb-2">
                     <Sparkles className="w-3.5 h-3.5 text-[#e2e8f0]" strokeWidth={1.5} />
                     <span>{mod.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1.5">{mod.title}</h3>
                  <p className="text-xs text-[#94a3b8] font-medium leading-relaxed">{mod.desc}</p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-white/70 group-hover:bg-[#334155] group-hover:text-white transition-all">
                   <ChevronRight className="w-5 h-5 stroke-[2]" />
                </div>
              </button>
            );
          }

          if (mod.id === 'takeoff') {
            return (
              <button 
                key={mod.id} 
                onClick={() => onSelectModule(mod.id as ModuleId)} 
                className="col-span-2 md:col-span-1 relative bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between items-start text-left hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden shadow-sm min-h-[160px]"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                   <mod.icon className="w-3.5 h-3.5" />
                   <span>{mod.category}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#0f172a] dark:text-white mb-1 leading-tight">{mod.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{mod.desc}</p>
                <div className="w-full flex justify-end mt-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-100 border-dashed">
                    <mod.icon className="w-6 h-6 border-dashed" strokeWidth={1.5} />
                  </div>
                </div>
              </button>
            );
          }

          const isTwoCol = mod.id === 'earthworks' || mod.id === 'trench' || mod.id === 'gridEarthwork';
          return (
            <button 
              key={mod.id} 
              onClick={() => onSelectModule(mod.id as ModuleId)} 
              className={\`col-span-\${isTwoCol ? '2 md:col-span-1' : '2 md:col-span-1'} p-5 md:p-6 rounded-[28px] bg-white dark:bg-slate-900 border-[1px] border-gray-100 dark:border-slate-800 transition-all flex flex-col items-start justify-between relative text-left group hover:-translate-y-1 hover:shadow-md shadow-sm min-h-[180px]\`}
            >
              <div className="relative z-10 w-full">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">
                   <mod.icon className="w-3.5 h-3.5" />
                   <span>{mod.category}</span>
                </div>
                <div className="text-xl font-bold text-[#0f172a] dark:text-white mb-2 leading-tight pr-4">{mod.title}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3 w-[85%]">{mod.desc}</p>
              </div>
              <div className="w-full flex justify-end mt-2">
                <div className={\`w-12 h-12 rounded-[14px] flex items-center justify-center group-hover:scale-105 transition-transform \${getIconStyles(mod.id)}\`}>
                  <mod.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src/components/Dashboard.tsx'), content);
console.log('Saved dashboard redesign.');
