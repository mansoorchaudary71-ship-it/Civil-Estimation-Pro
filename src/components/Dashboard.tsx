import React, { useState } from 'react';
import { ModuleId } from '../App';
import { 
  Calculator, 
  FileSpreadsheet, 
  PencilRuler, 
  Sparkles, 
  HardHat,
  Truck,
  Route,
  Waves,
  Paintbrush,
  Home,
  TrendingUp,
  Hammer,
  ClipboardList,
  ChevronRight,
  Activity,
  Layers,
  BarChart3,
  BoxSelect,
  Search,
  Menu,
  Settings as SettingsIcon
} from "lucide-react";

import Logo from './Logo';

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
}

export default function Dashboard({ onSelectModule, onOpenSidebar, onOpenSettings }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const match = (keywords: string) => {
    if (!searchTerm) return true;
    return keywords.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-10 pb-12 w-full max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <button onClick={onOpenSidebar} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800/50 md:hidden transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">Civil Estimation Pro</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-sm">Select an estimator module</p>
          </div>
        </div>
        {onOpenSettings && (
          <button 
            onClick={onOpenSettings} 
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-sm transition-all flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <SettingsIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">Preferences</span>
          </button>
        )}
      </div>

      <div className="mb-8 relative group max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-blue-500 w-5 h-5 transition-transform group-focus-within:scale-110 group-focus-within:text-blue-600" />
        </div>
        <input 
          type="text" 
          placeholder="Search only" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-3xl py-4 flex-1 pl-12 pr-4 text-sm font-semibold text-gray-800 dark:text-white shadow-sm hover:shadow-md focus:shadow-md focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-medium"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* CONSTRUCTION MATERIAL ESTIMATOR */}
        {match('construction material estimator tools concrete bricks steel') && (
        <button 
          onClick={() => onSelectModule('calculators')}
          className="col-span-2 lg:col-span-2 relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calculator className="w-4 h-4"/> TOOLS</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">Construction Material Estimator</div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Accurate estimations for concrete, bricks, steel, blocks, and mortar.</p>
          </div>
          <div className="relative z-10 w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center p-2.5 gap-1.5 text-red-500 dark:text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
            <Calculator className="w-8 h-8" />
          </div>
        </button>
        )}



        {/* HOUSE ESTIMATOR */}
        {match('house estimator residential turnkey grey structure finishing') && (
        <button 
          onClick={() => onSelectModule('house')}
          className="col-span-2 lg:col-span-2 relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6 md:p-8 rounded-[32px] border border-blue-500 dark:border-blue-700 flex flex-col text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:blur-2xl transition-all" />
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
            <Home className="w-32 h-32 text-white" strokeWidth={1} />
          </div>
          
          <div className="relative z-10 w-full mb-4">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Home className="w-3 h-3"/> RESIDENTIAL</div>
            <div className="text-2xl font-black text-white leading-tight max-w-[200px]">House Estimator</div>
          </div>
          <div className="relative z-10 flex gap-2 w-full mt-auto">
            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white">Grey Structure</div>
            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white">Finishing</div>
          </div>
        </button>
        )}

        
        {/* 2D TAKEOFF */}
        {match('2d takeoff plan measure area linear extraction') && (
        <button 
          onClick={() => onSelectModule('takeoff')}
          className="col-span-2 lg:col-span-2 relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl -ml-20 -mt-20 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><PencilRuler className="w-4 h-4"/> 2D TAKEOFF</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">Plan Measure</div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Area & Linear extraction</p>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
            <BoxSelect className="w-8 h-8" />
          </div>
        </button>
        )}

        {/* EARTHWORKS */}
        {match('earthworks site prep') && (
        <button 
          onClick={() => onSelectModule('earthworks')}
          className="col-span-1 relative bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
             <Truck className="w-5 h-5" />
          </div>
          <div className="relative z-10 mt-auto">
             <div className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest mb-1">SITE PREP</div>
             <div className="text-base font-black text-gray-900 dark:text-white leading-tight">Earthworks</div>
          </div>
        </button>
        )}

        {/* ROAD ESTIMATOR */}
        {match('road estimator infrastructure') && (
        <button 
          onClick={() => onSelectModule('road')}
          className="col-span-1 relative bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 dark:bg-slate-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-500/10 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-4 group-hover:bg-slate-500 group-hover:text-white transition-colors duration-300">
             <Route className="w-5 h-5" />
          </div>
          <div className="relative z-10 mt-auto">
             <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">INFRASTRUCTURE</div>
             <div className="text-base font-black text-gray-900 dark:text-white leading-tight">Road Estimator</div>
          </div>
        </button>
        )}

        {/* SEWERAGE & DRAINAGE */}
        {match('sewerage drainage utilities') && (
        <button 
          onClick={() => onSelectModule('sewerage')}
          className="col-span-1 relative bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
             <Waves className="w-5 h-5" />
          </div>
          <div className="relative z-10 mt-auto">
             <div className="text-[10px] font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest mb-1">UTILITIES</div>
             <div className="text-base font-black text-gray-900 dark:text-white leading-tight">Sewerage &<br/>Drainage</div>
          </div>
        </button>
        )}

        {/* FINISHING WORKS */}
        {match('finishing works interiors') && (
        <button 
          onClick={() => onSelectModule('finishing')}
          className="col-span-1 relative bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-500 dark:text-fuchsia-400 flex items-center justify-center mb-4 group-hover:bg-fuchsia-500 group-hover:text-white transition-colors duration-300">
             <Paintbrush className="w-5 h-5" />
          </div>
          <div className="relative z-10 mt-auto">
             <div className="text-[10px] font-bold text-fuchsia-500 dark:text-fuchsia-400 uppercase tracking-widest mb-1">INTERIORS</div>
             <div className="text-base font-black text-gray-900 dark:text-white leading-tight">Finishing works</div>
          </div>
        </button>
        )}
        
        {/* FORMWORK & SCAFFOLD */}
        {match('formwork scaffold structural') && (
        <button 
          onClick={() => onSelectModule('formwork')}
          className="col-span-1 relative bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-500 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300">
             <Hammer className="w-5 h-5" />
          </div>
          <div className="relative z-10 mt-auto">
             <div className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-1">STRUCTURAL</div>
             <div className="text-base font-black text-gray-900 dark:text-white leading-tight">Formwork &<br/>Scaffold</div>
          </div>
        </button>
        )}

        {/* MARKET RATES (Small card now) */}
        {match('market rates live db') && (
        <button 
          onClick={() => onSelectModule('rates')}
          className="col-span-1 relative bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all overflow-hidden group min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-500 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
             <TrendingUp className="w-5 h-5" />
          </div>
          <div className="relative z-10 mt-auto">
             <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">MARKET</div>
             <div className="text-base font-black text-gray-900 dark:text-white leading-tight">Live DB Rates</div>
          </div>
        </button>
        )}

        {/* AI ASSISTANT */}
        {match('ai assistant gemini pro ask anything about construction') && (
        <button 
          onClick={() => onSelectModule('ai')}
          className="col-span-2 md:col-span-3 lg:col-span-4 relative bg-[#09090b] dark:bg-slate-950 p-6 md:p-8 rounded-[32px] border border-[#27272a] dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all overflow-hidden group lg:mt-4"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors duration-700" />
          
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5"/> 
              GEMINI PRO
            </div>
            <div className="text-2xl font-black text-white mb-1">AI Assistant</div>
            <p className="text-sm font-medium text-gray-400">Ask anything about construction</p>
          </div>
          
          <div className="relative z-10 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-white/20 transition-colors">
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        )}

      </div>
    </div>
  );
}