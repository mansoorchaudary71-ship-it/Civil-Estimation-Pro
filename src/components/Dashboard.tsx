import React, { useState, useEffect } from "react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator, Sparkles, Truck, Route, Waves, Paintbrush, Home, 
  TrendingUp, Hammer, Layers, BoxSelect, Search, Menu, CheckSquare, 
  Map, Grid2X2, Box, ArrowRightLeft, Weight, Spline, ArrowRight,
  ChevronRight, ChevronDown, HardHat, Scaling, Container, Repeat, Anvil, Building2, 
  Blocks, Shovel, Pickaxe, Cone, Droplet, PaintBucket, Ruler, Columns, 
  ClipboardList, Maximize2, FileSpreadsheet, Zap, Wand2
} from "lucide-react";
import { SEO } from "./SEO";
import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";

import PostLoginDashboard from "./PostLoginDashboard";

export const ALL_MODULES = [
  { id: "calculators", title: "Construction Material", desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.", category: "Concrete Tech", icon: HardHat },
  { id: "house", title: "House Estimator", desc: "Complete residential cost breakdown from grey structure to finishing.", category: "Quantity Estimator", icon: Home, premium: true, color: "navy" },
  { id: "area-calculator", title: "Area Calculator", desc: "Calculate area & perimeter for multiple 2D shapes.", category: "Quantity Estimator", icon: Scaling },
  { id: "volume-estimator", title: "Volume Estimator", desc: "Calculate volumes, capacity & surface area.", category: "Quantity Estimator", icon: Container },
  { id: "unit-converter", title: "Unit Converter", desc: "Convert units across 15 engineering categories.", category: "Quantity Estimator", icon: Repeat },
  { id: "metal-weight", title: "Metal Weight", desc: "Calculate section weights of steel profiles.", category: "Quantity Estimator", icon: Anvil },
  { id: "mep-calculator", title: "Energy & MEP Calculators", desc: "Estimate solar capacity, water heating, and AC sizing.", category: "MEP", icon: Zap },
  { id: "master-rcc", title: "Master RCC Estimator", desc: "Unified hub for Slab, Column, Beam, Staircase, and BBS calculations.", category: "Concrete Tech", icon: Building2 },
  { id: "master-quantity", title: "Master Quantity & Estimation", desc: "23 comprehensive calculators for specialized construction items.", category: "Quantity Estimator", icon: ClipboardList },
  { id: "earthworks", title: "Earthworks", desc: "Calculate site preparation, excavation and hauling volumes.", category: "Road Construction", icon: Shovel },
  { id: "road-pavement", title: "Road & Pavement Estimator", desc: "Comprehensive tool for flexible, rigid, pavement & sewerage calculations.", category: "Road Construction", icon: Route },
  { id: "chainage", title: "Chainage Volume", desc: "Road highway chainage extraction calculations.", category: "Road Construction", icon: Map },
  { id: "interiors-finishes", title: "Interiors & Finishes", desc: "Tiles, painting, doors, wood framing, and termite treatments.", category: "Quantity Estimator", icon: Paintbrush },
  { id: "formwork", title: "Formwork & Scaffold", desc: "Shuttering and scaffolding material computations.", category: "Concrete Tech", icon: Hammer },
  { id: "gradient-calculator", title: "Gradient & Slope", desc: "Dynamic bidirectional slope and elevation calculator.", category: "Road Construction", icon: Maximize2 },
  { id: "takeoff", title: "Plan Measure", desc: "Area & linear extraction.", category: "Quantity Estimator", icon: Ruler },
  { id: "rates", title: "Live DB Rates", desc: "Centralized database for local market prices.", category: "Quantity Estimator", icon: TrendingUp },
  { id: "ai", title: "AI Assistant", desc: "Ask anything about construction", category: "Quantity Estimator", icon: Sparkles, premium: true, color: "electric" },
  { id: "geotechnical", title: "Geotechnical & Soil Tests", desc: "Process lab data for water content, Specific Gravity, Sieve, LL, and CBR.", category: "Soil Tests", icon: Cone },
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
    { text: "text-indigo-600", bg: "bg-indigo-50", fill: "bg-indigo-100", border: "border-indigo-100" },
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

      <div className="flex-1 px-4 md:px-8 py-6 w-full max-w-7xl mx-auto flex flex-col relative z-0">
        
        {/* Removed Mobile Header per top navigation consolidation request */}

        {/* STICKY SEARCH AND CATEGORIES CONTAINER - MOVED TO TOP */}
        <div className="sticky top-0 -mx-4 px-4 md:-mx-8 md:px-8 -mt-6 pt-6 pb-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8 z-50 shadow-md">
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto px-4 mb-4">
            <div className="relative flex items-center w-full h-[52px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200">
              <Search className="w-5 h-5 ml-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full border-0 focus:ring-0 focus:outline-none p-0 text-[15px] font-medium outline-none bg-transparent mx-3 text-slate-900 dark:text-white"
                placeholder="Search estimators, materials, tests..."
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          {/* CATEGORY TABS */}
          <div className="w-full px-4 overflow-x-auto scrollbar-hide py-2">
            <div className="flex flex-row items-center gap-2 w-full max-w-6xl mx-auto md:justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-indigo-600 text-white shadow-md border border-indigo-600"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {user ? (
          <PostLoginDashboard onSelectModule={onSelectModule} />
        ) : (
          <>
            {/* FULL-WIDTH HERO SECTION */}
            <div className="relative w-full max-w-[1400px] mx-auto mt-8 md:mt-16 mb-20 px-4 lg:px-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
          
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

          {/* Tag */}
          <div className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 pl-2 pr-5 py-1.5 mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 mr-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 tracking-wide uppercase">
              For Quantity Surveyors & Engineers
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto">
            Accurate Estimates in Seconds
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
             The complete toolkit for civil engineers and quantity surveyors to calculate precise quantities, analyze rates, and generate professional reports.
          </p>

          {/* Social Proof Strip - Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16 px-4">
            {/* Trust Signal 1 */}
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#B89B5E] dark:text-[#CBB576]">12,400+</span>
              <span className="text-[13px] font-medium text-[#111111]/60 dark:text-white/60">estimates created</span>
            </div>
            
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#111111]/10 dark:bg-white/10"></div>
            
            {/* Trust Signal 2 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#B89B5E] dark:text-[#CBB576]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <span className="text-[14px] font-bold text-[#B89B5E] dark:text-[#CBB576]">4.8</span>
              <span className="text-[13px] font-medium text-[#111111]/60 dark:text-white/60">from engineers</span>
            </div>

            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#111111]/10 dark:bg-white/10"></div>
            
            {/* Trust Signal 3 */}
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-[#B89B5E] dark:text-[#CBB576]" strokeWidth={2.5} />
              <span className="text-[13px] font-medium text-[#111111]/60 dark:text-white/60">Used across PK & Middle East</span>
            </div>
          </div>


        </div>
      </>
    )}

    {/* SEARCH AND TOOLS - ALWAYS VISIBLE */}
    <div className="relative w-full max-w-[1400px] mx-auto z-20 flex flex-col items-center">
      
      {/* MODULAR CARDS GRID */}
      <div className="flex flex-col w-full px-4 lg:px-8 mt-10">
            {groupsToDisplay.map((groupName) => (
              <div key={groupName} className="flex flex-col gap-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 pl-2 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-slate-900 dark:bg-slate-300 block"></span>
                  {groupName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full">
                  {groupedModules[groupName].map((mod, idx) => {
                    const theme = getCategoryTheme(mod.category, mod.id);
                    
                    return (
                      <button
                        key={mod.id}
                        id={`module-card-${mod.id}`}
                        onClick={() => onSelectModule(mod.id as ModuleId)}
                        className="stagger-in col-span-1 border border-slate-200/80 dark:border-white/10 hover:border-transparent p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] transition-all duration-300 ease-out flex flex-col relative text-left group min-h-[220px] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_-16px_rgba(255,255,255,0.05)] hover:-translate-y-1.5"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {/* Colored Accent Top Bar */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${theme.bg} transition-transform origin-left group-hover:scale-x-105`}></div>
                        
                        {/* Card Content */}
                        <div className="relative z-10 w-full flex-1 flex flex-col pt-1">
                          <div className="flex justify-between items-start mb-5">
                            <div className={`w-12 h-12 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out shadow-sm`}>
                              <mod.icon className="w-6 h-6" strokeWidth={2} />
                            </div>
                            
                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-white/40">
                              {mod.category}
                            </div>
                          </div>

                          <h3 className="text-[17px] font-bold text-[#111111] dark:text-white mb-1.5 leading-tight tracking-tight font-sans group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {mod.title}
                          </h3>
                          <p className="text-[13px] text-[#111111]/50 dark:text-white/50 font-medium leading-relaxed mb-5 line-clamp-2">
                            {mod.desc}
                          </p>

                          <div className="mt-auto w-full flex flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-[#111111]/30 dark:text-white/30 group-hover:text-[#111111] dark:group-hover:text-white transition-colors">
                              Calculate now
                            </span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/5 group-hover:bg-[#111111] dark:group-hover:bg-white transition-colors duration-300">
                              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/40 group-hover:text-white dark:group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
