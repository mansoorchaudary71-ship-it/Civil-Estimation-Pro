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
  Settings as SettingsIcon,
  CheckSquare,
  Map,
  Grid2X2,
  Flame,
  Clock
} from "lucide-react";

import Logo from './Logo';

import RecentEstimates from './RecentEstimates';

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
    <div className="flex-1 px-4 md:px-8 py-6 md:py-10 pb-12 w-full max-w-7xl mx-auto flex flex-col">
      <div className="mb-6 flex justify-between items-center px-1 hidden">
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

      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, Alex <span className="text-2xl animate-bounce origin-bottom hover:animate-none cursor-default inline-block" style={{animationDuration: '2s', animationIterationCount: 2}}>👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Ready to continue your estimates?</p>
        </div>
        <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all cursor-default">
          <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-500 rounded-xl relative">
             <div className="absolute inset-0 bg-orange-400/20 blur animate-pulse" />
             <Flame className="w-5 h-5 fill-orange-500/20 relative z-10" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">12 Day Streak</div>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">24 projects done</div>
          </div>
        </div>
      </div>

      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
        <div className="relative group w-full mb-8">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-blue-500/70 dark:text-blue-400/70 w-5 h-5 transition-transform group-focus-within:scale-110 group-focus-within:text-blue-600" />
          </div>
          <input 
            type="text" 
            placeholder="Search tools, materials, or projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100/80 dark:bg-slate-900/80 border border-transparent focus:bg-white focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl py-4 pl-14 pr-6 text-base font-medium text-gray-800 dark:text-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.06)] focus:shadow-[inset_0_2px_5px_rgba(0,0,0,0.02),0_0_0_4px_rgba(59,130,246,0.1)] outline-none transition-all placeholder:text-gray-500 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Jump Back In Section */}
        {searchTerm === "" && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4 px-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Jump Back In</h3>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:-mx-8 md:px-8 snap-x no-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <div className="snap-start shrink-0 w-[280px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[24px] border border-white/60 dark:border-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer group" onClick={() => onSelectModule('road')}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg"><Route className="w-4 h-4" strokeWidth={2.5}/></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Road Estimator</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">2h ago</span>
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-3 truncate dark:text-white">Highway Alpha Expansion</h4>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>In Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full w-3/4 group-hover:scale-y-110 transition-transform origin-left"></div>
                  </div>
                </div>
              </div>

              <div className="snap-start shrink-0 w-[280px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[24px] border border-white/60 dark:border-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer group" onClick={() => onSelectModule('house')}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Home className="w-4 h-4" strokeWidth={2.5}/></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">House Estimator</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Yesterday</span>
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-3 truncate dark:text-white">Villa 4BHK Plot 12</h4>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>Grey Structure Done</span>
                    <span className="text-blue-600 dark:text-blue-400">40%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[40%] group-hover:scale-y-110 transition-transform origin-left"></div>
                  </div>
                </div>
              </div>

              <div className="snap-start shrink-0 w-[280px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[24px] border border-white/60 dark:border-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer group" onClick={() => onSelectModule('rigid-pavement')}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><Route className="w-4 h-4" strokeWidth={2.5}/></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rigid Pavement</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">3 days ago</span>
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-3 truncate dark:text-white">City Center PQC Panel</h4>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>Almost Complete</span>
                    <span className="text-emerald-600 dark:text-emerald-400">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-[90%] group-hover:scale-y-110 transition-transform origin-left"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {searchTerm ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
           {/* Fallback to flat grid while searching */}
           {match('construction material estimator tools concrete bricks steel') && (
            <button onClick={() => onSelectModule('calculators')} className="col-span-2 relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[32px] border border-white/60 dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
              <div className="relative z-10 w-full mb-1">
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calculator className="w-4 h-4"/> TOOLS</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white mb-1">Material Estimator</div>
              </div>
            </button>
           )}
           {match('house estimator residential turnkey grey structure finishing') && (
            <button onClick={() => onSelectModule('house')} className="col-span-2 relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6 rounded-[32px] border border-blue-400/50 dark:border-blue-700 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(37,99,235,0.2)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all overflow-hidden group">
              <div className="relative z-10 w-full mb-1">
                <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Home className="w-4 h-4"/> RESIDENTIAL</div>
                <div className="text-2xl font-black text-white leading-tight">House Estimator</div>
              </div>
            </button>
           )}
           {match('2d takeoff plan measure area linear extraction') && (
            <button onClick={() => onSelectModule('takeoff')} className="col-span-2 relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[32px] border border-white/60 dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all overflow-hidden group">
              <div className="relative z-10 w-full mb-1">
                <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><PencilRuler className="w-4 h-4"/> 2D TAKEOFF</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white mb-1">Plan Measure</div>
              </div>
            </button>
           )}
           {match('ai assistant gemini pro ask anything about construction') && (
            <button onClick={() => onSelectModule('ai')} className="col-span-2 relative bg-[#09090b] dark:bg-slate-950 p-6 rounded-[32px] border border-white/10 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all overflow-hidden group">
              <div className="relative z-10 w-full mb-1">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> GEMINI PRO</div>
                <div className="text-2xl font-black text-white mb-1">AI Assistant</div>
              </div>
            </button>
           )}
           
           {/* Other icons rendered plainly */}
           {[ 
             { id: 'earthworks', t: 'Earthworks', keys: 'earthworks site prep', icon: <Truck/>, c: 'text-amber-600', bg: 'bg-amber-100' },
             { id: 'trench', t: 'Trench Excavation', keys: 'trench excavation bedding', icon: <CheckSquare/>, c: 'text-teal-600', bg: 'bg-teal-100' },
             { id: 'gridEarthwork', t: 'Grid Method', keys: 'grid method earthwork leveling', icon: <Grid2X2/>, c: 'text-indigo-600', bg: 'bg-indigo-100' },
             { id: 'chainage', t: 'Chainage Vol', keys: 'chainage volume road highway', icon: <Map/>, c: 'text-amber-600', bg: 'bg-amber-100' },
             { id: 'road', t: 'Road Estimator', keys: 'road estimator infrastructure', icon: <Route/>, c: 'text-slate-600', bg: 'bg-slate-200' },
             { id: 'rigid-pavement', t: 'Rigid Pavement', keys: 'rigid pavement concrete', icon: <Layers/>, c: 'text-gray-600', bg: 'bg-gray-200' },
             { id: 'sewerage', t: 'Sewerage', keys: 'sewerage drainage utilities', icon: <Waves/>, c: 'text-cyan-600', bg: 'bg-cyan-100' },
             { id: 'finishing', t: 'Finishing Works', keys: 'finishing works interiors', icon: <Paintbrush/>, c: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
             { id: 'formwork', t: 'Formwork', keys: 'formwork scaffold structural', icon: <Hammer/>, c: 'text-violet-600', bg: 'bg-violet-100' },
             { id: 'rates', t: 'Market Rates', keys: 'market rates live db', icon: <TrendingUp/>, c: 'text-emerald-600', bg: 'bg-emerald-100' },
           ].map(item => match(item.keys) && (
             <button key={item.id} onClick={() => onSelectModule(item.id as ModuleId)} className="col-span-1 relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-[28px] border border-white/60 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden group min-h-[140px]">
               <div className={`relative z-10 w-12 h-12 rounded-2xl ${item.bg} dark:bg-slate-800 ${item.c} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                 {item.icon}
               </div>
               <div className="text-base font-black text-slate-800 dark:text-white leading-tight">{item.t}</div>
             </button>
           ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* PRIMARY TOOLS (Full Width Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* CONSTRUCTION MATERIAL ESTIMATOR */}
            <button onClick={() => onSelectModule('calculators')} className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-white/60 dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calculator className="w-4 h-4"/> TOOLS</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white mb-1">Construction Material</div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Accurate estimations for concrete, bricks, steel, blocks, and mortar.</p>
              </div>
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/10 rounded-3xl flex items-center justify-center p-2.5 gap-1.5 text-red-500 dark:text-red-400 transition-transform duration-300 group-hover:scale-110 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                <Calculator className="w-10 h-10 fill-red-500/20" strokeWidth={2.5} />
              </div>
            </button>

            {/* HOUSE ESTIMATOR */}
            <button onClick={() => onSelectModule('house')} className="relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6 md:p-8 rounded-[32px] border border-blue-400/50 dark:border-blue-700 flex flex-col text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(37,99,235,0.2)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all overflow-hidden group min-h-[160px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:blur-2xl transition-all" />
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <Home className="w-40 h-40 text-white fill-white/20" strokeWidth={1} />
              </div>
              <div className="relative z-10 w-full mb-4">
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Home className="w-3 h-3"/> RESIDENTIAL</div>
                <div className="text-2xl font-black text-white leading-tight max-w-[200px]">House Estimator</div>
              </div>
              <div className="relative z-10 flex gap-2 w-full mt-auto">
                <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">Grey Structure</div>
                <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">Finishing</div>
              </div>
            </button>

            {/* 2D TAKEOFF */}
            <button onClick={() => onSelectModule('takeoff')} className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-white/60 dark:border-slate-800 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl -ml-20 -mt-20 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><PencilRuler className="w-4 h-4"/> 2D TAKEOFF</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white mb-1">Plan Measure</div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Area & Linear extraction.</p>
              </div>
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/10 rounded-3xl flex items-center justify-center p-2.5 gap-1.5 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                <BoxSelect className="w-10 h-10 fill-green-500/20" strokeWidth={2.5} />
              </div>
            </button>

            {/* AI ASSISTANT */}
            <button onClick={() => onSelectModule('ai')} className="relative bg-[#09090b] dark:bg-slate-950 p-6 md:p-8 rounded-[32px] border border-white/10 flex justify-between items-center text-left hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 drop-shadow-sm"><Sparkles className="w-3.5 h-3.5 fill-purple-400/50"/> GEMINI PRO</div>
                <div className="text-2xl font-black text-white mb-1 drop-shadow-sm">AI Assistant</div>
                <p className="text-sm font-medium text-gray-400">Ask anything about construction</p>
              </div>
              <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-white/20 transition-colors shadow-[inset_0_2px_8px_rgba(255,255,255,0.2)] group-hover:scale-105">
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </div>
            </button>
          </div>

          {[
            {
              category: "Site Prep",
              items: [
                { id: 'earthworks', t: 'Earthworks', keys: 'earthworks site prep', icon: <Truck className="w-7 h-7 fill-amber-500/20" strokeWidth={2.5} />, c: 'text-amber-600 dark:text-amber-400', bg: 'from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/10' },
                { id: 'trench', t: 'Trench Excavation', keys: 'trench excavation bedding', icon: <CheckSquare className="w-7 h-7 fill-teal-500/20" strokeWidth={2.5} />, c: 'text-teal-600 dark:text-teal-400', bg: 'from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-800/10' },
                { id: 'gridEarthwork', t: 'Grid Method Volume', keys: 'grid method earthwork leveling', icon: <Grid2X2 className="w-7 h-7 fill-indigo-500/20" strokeWidth={2.5} />, c: 'text-indigo-600 dark:text-indigo-400', bg: 'from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/10' },
              ]
            },
            {
              category: "Infrastructure",
              items: [
                { id: 'road', t: 'Flexible Pavement', keys: 'road estimator infrastructure', icon: <Route className="w-7 h-7 fill-slate-500/20" strokeWidth={2.5} />, c: 'text-slate-600 dark:text-slate-400', bg: 'from-slate-200 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/10' },
                { id: 'rigid-pavement', t: 'Rigid Pavement', keys: 'rigid concrete road', icon: <Layers className="w-7 h-7 fill-blue-500/20" strokeWidth={2.5} />, c: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-200 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/10' },
                { id: 'chainage', t: 'Chainage Volume', keys: 'chainage volume road highway', icon: <Map className="w-7 h-7 fill-amber-500/20" strokeWidth={2.5} />, c: 'text-amber-600 dark:text-amber-400', bg: 'from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/10' },
                { id: 'sewerage', t: 'Sewerage & Drainage', keys: 'sewerage drainage utilities', icon: <Waves className="w-7 h-7 fill-cyan-500/20" strokeWidth={2.5} />, c: 'text-cyan-600 dark:text-cyan-400', bg: 'from-cyan-100 to-cyan-50 dark:from-cyan-900/40 dark:to-cyan-800/10' },
              ]
            },
            {
              category: "Interiors & Structural",
              items: [
                { id: 'finishing', t: 'Finishing Works', keys: 'finishing works interiors', icon: <Paintbrush className="w-7 h-7 fill-fuchsia-500/20" strokeWidth={2.5} />, c: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'from-fuchsia-100 to-fuchsia-50 dark:from-fuchsia-900/40 dark:to-fuchsia-800/10' },
                { id: 'formwork', t: 'Formwork & Scaffold', keys: 'formwork scaffold structural', icon: <Hammer className="w-7 h-7 fill-violet-500/20" strokeWidth={2.5} />, c: 'text-violet-600 dark:text-violet-400', bg: 'from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-800/10' },
              ]
            },
            {
              category: "Market Data",
              items: [
                { id: 'rates', t: 'Live DB Rates', keys: 'market rates live db', icon: <TrendingUp className="w-7 h-7 fill-emerald-500/20" strokeWidth={2.5} />, c: 'text-emerald-600 dark:text-emerald-400', bg: 'from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/10' },
              ]
            }
          ].map((section, idx) => (
            <div key={idx} className="flex flex-col gap-2 relative">
              <h2 className="text-sm font-bold text-slate-400/80 uppercase tracking-widest pl-1">{section.category}</h2>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 pt-1 no-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
                {section.items.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => onSelectModule(item.id as ModuleId)}
                    className="w-[160px] md:w-[180px] shrink-0 snap-start relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-[28px] border border-white/60 dark:border-slate-800 flex flex-col justify-between text-left hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all overflow-hidden group min-h-[160px]"
                  >
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] gap-1.5 text-current" style={{ color: 'inherit' }}>
                       <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} rounded-2xl -z-10`} />
                       <div className={`${item.c}`}>{item.icon}</div>
                    </div>
                    <div className="relative z-10 mt-auto">
                       <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 opacity-80">{section.category.split(' ')[0]}</div>
                       <div className="text-base font-black text-slate-800 dark:text-white leading-tight">{item.t}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

        </div>
      )}


      <RecentEstimates onSelectModule={onSelectModule} />
    </div>
  );
}