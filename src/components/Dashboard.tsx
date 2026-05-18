import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator, Sparkles, Truck, Route, Waves, Paintbrush, Home, 
  TrendingUp, Hammer, Layers, BoxSelect, Search, Menu, CheckSquare, 
  Map, Grid2X2, Box, ArrowRightLeft, Weight, Spline, ArrowRight,
  ChevronRight, ChevronDown, HardHat, Scaling, Container, Repeat, Anvil, Building2, 
  Blocks, Shovel, Pickaxe, Cone, Droplet, PaintBucket, Ruler, Columns, 
  ClipboardList, Maximize2, FileSpreadsheet, Zap, Wand2, ArrowUpRight
} from "lucide-react";
import { SEO } from "./SEO";
import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";

import PostLoginDashboard from "./PostLoginDashboard";

export const ALL_MODULES = [
  { id: "calculators", title: "Construction Material", desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.", category: "Concrete Tech", icon: HardHat, styleStyle: "solid", colorClass: "bg-[var(--accent-vibrant)] text-white shadow-[0_8px_30px_rgba(255,159,67,0.3)]", iconClass: "text-white opacity-90" },
  { id: "house", title: "House Estimator", desc: "Complete residential cost breakdown from grey structure to finishing.", category: "Quantity Estimator", icon: Home, premium: true, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "area-calculator", title: "Area Calculator", desc: "Calculate area & perimeter for multiple 2D shapes.", category: "Quantity Estimator", icon: Scaling, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "volume-estimator", title: "Volume Estimator", desc: "Calculate volumes, capacity & surface area.", category: "Quantity Estimator", icon: Container, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "unit-converter", title: "Unit Converter", desc: "Convert units across 15 engineering categories.", category: "Quantity Estimator", icon: Repeat, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "metal-weight", title: "Metal Weight", desc: "Calculate section weights of steel profiles.", category: "Quantity Estimator", icon: Anvil, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "mep-calculator", title: "Energy & MEP Calculators", desc: "Estimate solar capacity, water heating, and AC sizing.", category: "MEP", icon: Zap, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "master-rcc", title: "Master RCC Estimator", desc: "Unified hub for Slab, Column, Beam, Staircase, and BBS calculations.", category: "Concrete Tech", icon: Building2, styleStyle: "solid", colorClass: "bg-[var(--accent-teal)] text-white shadow-[0_8px_30px_rgba(32,201,151,0.3)]", iconClass: "text-white opacity-90" },
  { id: "master-quantity", title: "Master Quantity & Estimation", desc: "23 comprehensive calculators for specialized construction items.", category: "Quantity Estimator", icon: ClipboardList, styleStyle: "solid", colorClass: "bg-[var(--accent-blue)] text-[var(--primary-dark)] shadow-[0_8px_30px_rgba(0,207,232,0.3)]", iconClass: "text-[var(--primary-dark)] opacity-90" },
  { id: "earthworks", title: "Earthworks", desc: "Calculate site preparation, excavation and hauling volumes.", category: "Road Construction", icon: Shovel, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "road-pavement", title: "Road & Pavement Estimator", desc: "Comprehensive tool for flexible, rigid, pavement & sewerage calculations.", category: "Road Construction", icon: Route, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "chainage", title: "Chainage Volume", desc: "Road highway chainage extraction calculations.", category: "Road Construction", icon: Map, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "interiors-finishes", title: "Interiors & Finishes", desc: "Tiles, painting, doors, wood framing, and termite treatments.", category: "Quantity Estimator", icon: Paintbrush, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "formwork", title: "Formwork & Scaffold", desc: "Shuttering and scaffolding material computations.", category: "Concrete Tech", icon: Hammer, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "gradient-calculator", title: "Gradient & Slope", desc: "Dynamic bidirectional slope and elevation calculator.", category: "Road Construction", icon: Maximize2, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "takeoff", title: "Plan Measure", desc: "Area & linear extraction.", category: "Quantity Estimator", icon: Ruler, styleStyle: "solid", colorClass: "bg-[var(--accent-purple)] text-white shadow-[0_8px_30px_rgba(115,103,240,0.3)]", iconClass: "text-white opacity-90" },
  { id: "rates", title: "Live DB Rates", desc: "Centralized database for local market prices.", category: "Quantity Estimator", icon: TrendingUp, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "ai", title: "AI Assistant", desc: "Ask anything about construction", category: "Quantity Estimator", icon: Sparkles, premium: true, styleStyle: "solid", colorClass: "bg-[var(--primary-dark)] text-white shadow-lg", iconClass: "text-white opacity-90" },
  { id: "geotechnical", title: "Geotechnical & Soil Tests", desc: "Process lab data for water content, Specific Gravity, Sieve, LL, and CBR.", category: "Soil Tests", icon: Cone, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" }
];

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  previousModule?: string | null;
}

export const getCategoryTheme = (category: string, id: string) => {
  const colors = [
    { text: "text-indigo-600", bg: "bg-indigo-50", fill: "bg-indigo-50", border: "border-indigo-100" },
    { text: "text-orange-600", bg: "bg-orange-50", fill: "bg-orange-100", border: "border-orange-100" },
    { text: "text-sky-600", bg: "bg-sky-50", fill: "bg-sky-100", border: "border-sky-100" },
    { text: "text-emerald-600", bg: "bg-emerald-50", fill: "bg-emerald-100", border: "border-emerald-100" },
    { text: "text-purple-600", bg: "bg-purple-50", fill: "bg-purple-100", border: "border-purple-100" },
    { text: "text-rose-600", bg: "bg-rose-50", fill: "bg-rose-100", border: "border-rose-100" },
  ];
  
  // Deterministic color based on id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  
  if (id === 'ai') return colors[0]; // Primary purple
  if (id === 'house') return colors[1]; // Accent orange

  return colors[index];
};

export default function Dashboard({
  onSelectModule,
  onOpenSidebar,
  onOpenSettings,
  onOpenAuth,
  previousModule,
}: DashboardProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tools");

  useEffect(() => {
    if (previousModule && !["home", "my-estimates", "pricing", "about", "careers", "contact", "blog"].includes(previousModule)) {
      const prevMod = ALL_MODULES.find((m) => m.id === previousModule);
      if (prevMod) {
        setActiveCategory("All Tools");
        setTimeout(() => {
          const elm = document.getElementById(`module-card-${previousModule}`);
          if (elm) {
            elm.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  }, [previousModule]);

  const categories = [
    "All Tools",
    "Quantity Estimator",
    "Concrete Tech",
    "Road Construction",
    "Soil Tests",
    "MEP"
  ];

  const filteredModules = ALL_MODULES.filter((m) => {
    const matchesSearch =
      !searchTerm ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All Tools" || m.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const groupsToDisplay: string[] = [];
  const groupedModules: Record<string, typeof ALL_MODULES> = {};

  filteredModules.forEach((mod) => {
    const groupName = mod.category;
    
    if (!groupedModules[groupName]) {
      groupedModules[groupName] = [];
      groupsToDisplay.push(groupName);
    }
    groupedModules[groupName].push(mod);
  });

  // Handle particle creation purely via CSS in a style tag directly
  return (
    <div className="relative flex-1 w-full flex flex-col font-sans mb-12">
      <SEO 
        title="Dashboard" 
        description="Civil Estimation Pro: Advanced estimators for live construction rate analysis, house estimating, and comprehensive BOQ calculators." 
        canonicalUrl="https://civilestimationpro.com" 
      />

      <style>{`
        @keyframes custom-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(15deg); }
        }
        .waving-hand {
          display: inline-block;
          animation: custom-bounce 1.5s ease-in-out infinite;
          transform-origin: bottom right;
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-in {
          animation: float-up 0.5s ease backwards;
        }
      `}</style>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col relative z-0">
        
        {/* MASSIVE HERO SECTION */}
        <div className="relative w-full max-w-[1400px] mx-auto mt-8 md:mt-16 mb-16 px-4 lg:px-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
          
          {/* Subtle Isometric Grid Background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 h-[200%] pointer-events-none overflow-hidden opacity-[0.05] dark:opacity-[0.08]" style={{ maskImage: "radial-gradient(ellipse at center, white, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, white, transparent 70%)" }}>
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="isometric-grid" width="60" height="34.641" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                    <path d="M30 0 L60 17.32 L30 34.641 L0 17.32 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    <path d="M30 0 L30 34.641" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#isometric-grid)" className="text-slate-900 dark:text-white" />
             </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto drop-shadow-sm">
            Civil Estimation Pro
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
             Generate highly accurate engineering estimates in seconds. The complete toolkit for civil engineers and quantity surveyors.
          </p>

          {/* CATEGORY TABS */}
          <div className="w-full flex justify-start sm:justify-center overflow-x-auto scrollbar-hide pb-2 px-2">
            <div className="inline-flex flex-row items-center gap-1 shrink-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative flex-shrink-0 px-[24px] py-[10px] rounded-[50px] text-[14px] font-semibold transition-all duration-300 outline-none ${
                    activeCategory === category
                      ? "text-white"
                      : "bg-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#1E293B] shadow-sm rounded-[50px] z-[-1]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {user && (
          <div className="w-full mb-12">
            <PostLoginDashboard onSelectModule={onSelectModule} />
          </div>
        )}

    {/* BENTO BOX GRID LAYOUT */}
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 z-20 relative">
      
      {/* LEFT COLUMN: Widgets & AI Assistant */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        
        {/* Quick Info Widget 1: Stats */}
        <div className=" rounded-[16px] px-[22px] py-[20px] border-none flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase">Community Pulse</span>
            <div className="bg-indigo-600/12 p-[6px] rounded-[8px]">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="text-white text-[32px] font-bold leading-none tracking-tight">12,400+</div>
            <p className="text-[#888888] text-[12px] mt-1.5 font-medium">Detailed estimates generated this month</p>
          </div>
        </div>

        {/* Quick Info Widget 2: Unit Converter */}
        <div 
          className="bg-white border border-slate-200 rounded-xl p-[16px] shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-colors group"
          onClick={() => onSelectModule('unit-converter')}
        >
          <div className="flex items-center gap-4">
            <div className="w-[36px] h-[36px] bg-indigo-50 text-indigo-600 rounded-[10px] flex items-center justify-center group-hover:scale-105 transition-transform">
               <Repeat className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-semibold text-[15px] leading-tight text-indigo-600 mb-1">Unit Converter</h4>
              <span className="text-[12px] font-medium text-[#888888]">15 engineering metrics</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
        </div>

        {/* AI Assistant Card (Accent Card) */}
        <div 
          className="mt-auto  rounded-[20px] p-[24px] relative overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[auto]"
          onClick={() => onSelectModule('ai')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
             <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          
          <h3 className="text-[20px] font-bold text-[#F5F5F0] mb-3 leading-tight tracking-tight">
            Ready to start a new takeoff or need AI assistance?
          </h3>
          <p className="text-[#888888] mb-8 text-[13px] leading-relaxed">
            Use AI to instantly extract quantities from plans or ask complex engineering queries.
          </p>
          
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 mt-auto relative z-10 w-full">
            <button 
              onClick={(e) => { e.stopPropagation(); onSelectModule('takeoff'); }} 
              className="w-full px-[24px] py-[10px] bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-[#F5F5F0] text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Ruler className="w-4 h-4" /> 2D Takeoff
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onSelectModule('ai'); }} 
              className="w-full px-[28px] py-[10px] bg-indigo-600 hover:bg-[#e4e466] text-indigo-600 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
               Ask AI <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Main Tool Container */}
      <div className="lg:col-span-8 xl:col-span-9 bg-transparent p-2 lg:p-6 flex flex-col min-h-[700px]">
        
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--primary-dark)] dark:text-white tracking-tight flex items-center gap-3">
              {activeCategory}
            </h2>
            <p className="text-slate-500 font-medium mt-2">Select a calculator to initiate a new estimate.</p>
          </div>
          
          <div className="w-full md:max-w-md shrink-0">
            <div className="relative flex items-center w-full h-[54px] rounded-[50px] bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgba(255,159,67,0.12)] transition-all duration-300 group overflow-hidden">
              <Search className="w-5 h-5 ml-6 shrink-0 text-slate-400 group-focus-within:text-[var(--accent-vibrant)] transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools & calculations..."
                className="w-full h-full bg-transparent border-none outline-none text-[15px] font-medium text-[var(--primary-dark)] dark:text-white placeholder:text-slate-400 pl-4 pr-5"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mr-5 text-slate-400 hover:text-[var(--primary-dark)] dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wide">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex flex-col w-full">
            {groupsToDisplay.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-[var(--primary-dark)] dark:text-slate-200">No calculators found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search term or category.</p>
              </div>
            ) : (
              groupsToDisplay.map((groupName) => (
                <div key={groupName} className="flex flex-col gap-6 mb-12 last:mb-0">
                   {activeCategory === "All Tools" && (
                     <h3 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.15em] uppercase flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-[var(--accent-vibrant)]"></span>
                       {groupName}
                     </h3>
                   )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full auto-rows-max">
                    {groupedModules[groupName].map((mod, idx) => {
                      const isSolid = mod.styleStyle === "solid";
                      return (
                        <button
                          key={mod.id}
                          id={`module-card-${mod.id}`}
                          onClick={() => onSelectModule(mod.id as ModuleId)}
                          className={`stagger-in p-6 rounded-[24px] transition-all duration-300 ease-out flex flex-col relative text-left group min-h-[160px] overflow-hidden block w-full hover:-translate-y-1 hover:shadow-lg ${mod.colorClass || 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white shadow-sm'}`}
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="relative z-10 w-full flex-1 flex flex-col">
                            {/* Icon at top left */}
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${isSolid ? 'bg-black/10' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                <mod.icon className={`w-6 h-6 ${mod.iconClass || (isSolid ? 'text-white' : 'text-[var(--accent-vibrant)]')}`} strokeWidth={2} />
                              </div>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                <ArrowRight className={`w-5 h-5 ${isSolid ? 'text-white' : 'text-[var(--accent-vibrant)]'}`} />
                              </div>
                            </div>

                            <h4 className={`text-[17px] font-extrabold leading-tight tracking-tight mb-2 ${isSolid ? 'text-white' : 'text-[var(--primary-dark)] dark:text-white'}`}>
                              {mod.title}
                            </h4>

                            <p className={`text-[13px] font-medium leading-[1.6] line-clamp-2 mt-auto ${isSolid ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                              {mod.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
