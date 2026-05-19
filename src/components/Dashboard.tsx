import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator, Sparkles, Truck, Route, Waves, Paintbrush, Home, 
  TrendingUp, Hammer, Layers, BoxSelect, Search, Menu, CheckSquare, 
  Map, Grid2X2, Box, ArrowRightLeft, Weight, Spline, ArrowRight,
  ChevronRight, ChevronDown, HardHat, Scaling, Container, Repeat, Anvil, Building2, Building, 
  Blocks, Shovel, Pickaxe, Cone, Droplet, PaintBucket, Ruler, Columns, 
  ClipboardList, Maximize2, FileSpreadsheet, Zap, Wand2, ArrowUpRight, LineChart, Sun
} from "lucide-react";
import { SEO } from "./SEO";
import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";

import PostLoginDashboard from "./PostLoginDashboard";

export const ALL_MODULES = [
  { id: "calculators", title: "Construction Material", desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.", category: "Concrete Tech", icon: HardHat, styleStyle: "solid", colorClass: "bg-[var(--accent-vibrant)] text-white shadow-[0_8px_30px_rgba(255,159,67,0.3)]", iconClass: "text-white opacity-90" },
  { id: "house", title: "House Estimator", desc: "Complete residential cost breakdown from grey structure to finishing.", category: "Quantity Estimator", icon: Home, premium: true, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "area-calculator", title: "Area Calculator", desc: "Calculate area & perimeter for multiple 2D shapes.", category: "Quantity Estimator", icon: Scaling, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "property-area", title: "Property Area Calculator", desc: "Calculate Carpet Area, Built-up Area and Super Built-up Area.", category: "Quantity Estimator", icon: Building, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "volume-estimator", title: "Volume & Tank Capacity", desc: "Calculate volumes, tank capacity & surface area.", category: "Quantity Estimator", icon: Container, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
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
  { id: "geotechnical", title: "Geotechnical & Soil Tests", desc: "Process lab data for water content, Specific Gravity, LL, and CBR.", category: "Soil Tests", icon: Cone, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "master-sieve", title: "Master Sieve Analysis", desc: "Dynamic gradation validator driven by specification databases.", category: "Soil Tests", icon: LineChart, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "aggregate-blending", title: "Aggregate Blending", desc: "Blend 2 to 4 stockpiles to meet target grading specifications.", category: "Soil Tests", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "aggregate-tests", title: "Aggregate Tests", desc: "Calculate impact, crushing, abrasion values and water absorption.", category: "Concrete Tech", icon: Box, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "solar-roof", title: "Solar Roof Calculator", desc: "Estimate required solar system size, panels, and ROI.", category: "MEP", icon: Sun, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" }
];

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  previousModule?: string | null;
}

export const getCategoryTheme = (category: string, id: string) => {
  if (id === 'ai') {
    return { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40", stroke: "stroke-indigo-500" };
  }
  
  switch (category) {
    case "Concrete Tech":
      return { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40", stroke: "stroke-orange-500" };
    case "Quantity Estimator":
      return { text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40", stroke: "stroke-sky-500" };
    case "Road Construction":
      return { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", stroke: "stroke-emerald-500" };
    case "Soil Tests":
      return { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40", stroke: "stroke-rose-500" };
    case "MEP":
      return { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40", stroke: "stroke-purple-500" };
    default:
      return { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40", stroke: "stroke-indigo-500" };
  }
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
      
      {/* Expanded Subtle Isometric Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.045] dark:opacity-[0.08]" style={{ maskImage: "linear-gradient(to bottom, white 0%, white 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, white 0%, white 60%, transparent 100%)" }}>
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="isometric-grid" width="60" height="34.641" patternUnits="userSpaceOnUse" patternTransform="scale(3)">
                <path d="M30 0 L60 17.32 L30 34.641 L0 17.32 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <path d="M30 0 L30 34.641" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#isometric-grid)" className="text-indigo-900 dark:text-indigo-100" />
         </svg>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col relative z-10">
        
        {/* MASSIVE HERO SECTION */}
        <div className="relative w-full max-w-[1400px] mx-auto mt-8 md:mt-16 mb-16 px-4 lg:px-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto drop-shadow-sm flex flex-wrap justify-center items-center gap-x-4">
            <span className="text-slate-900 dark:text-white">Civil Estimation</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500 font-extrabold drop-shadow-sm">
              Pro
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium capitalize">
             Generate <span className="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-200 dark:border-indigo-800 border-dashed">highly accurate</span> engineering estimates in seconds. The complete toolkit for <span className="text-slate-900 dark:text-slate-200 font-semibold">civil engineers</span> and <span className="text-slate-900 dark:text-slate-200 font-semibold">quantity surveyors</span>.
          </p>

          {/* CATEGORY TABS */}
          <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mb-8">
            <div className="flex flex-row items-center justify-start sm:justify-center gap-3 shrink-0 mx-auto px-4 w-max min-w-full">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 outline-none ${
                    activeCategory === category
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                      : "bg-slate-100/80 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {category}
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
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 z-20 relative">
      
      {/* RIGHT COLUMN: Main Tool Container */}
      <div className="lg:col-span-12 xl:col-span-12 bg-transparent lg:p-4 flex flex-col min-h-[700px]">
        
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--primary-dark)] dark:text-white tracking-tight flex items-center gap-3">
              {activeCategory}
            </h2>
            <p className="text-slate-500 font-medium mt-2">Select a calculator to initiate a new estimate.</p>
          </div>
          
          <div className="w-full md:max-w-md shrink-0 flex items-center gap-2">
            <div className="relative flex items-center flex-1 h-[54px] rounded-[50px] bg-transparent border-2 border-[var(--accent-vibrant)] transition-all duration-300 group overflow-hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools & calculations..."
                className="w-full h-full bg-transparent border-none outline-none text-[15px] font-medium text-[var(--primary-dark)] dark:text-white placeholder:text-slate-400 pl-6 pr-5"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mr-5 text-[var(--accent-vibrant)] hover:text-[#e68a35] transition-colors text-xs font-bold uppercase tracking-wide">
                  Clear
                </button>
              )}
            </div>
            <button className="w-[54px] h-[54px] rounded-[50px] flex items-center justify-center border-2 border-[var(--accent-vibrant)] bg-[var(--accent-vibrant)] text-white hover:bg-transparent hover:text-[var(--accent-vibrant)] transition-colors shrink-0">
               <Search className="w-5 h-5" strokeWidth={2.5} />
            </button>
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
                     <h3 className="text-[14px] font-extrabold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase flex items-center gap-4">
                       <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
                       {groupName}
                       <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></span>
                     </h3>
                   )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full auto-rows-max">
                    {groupedModules[groupName].map((mod, idx) => {
                      const theme = getCategoryTheme(mod.category, mod.id);
                      return (
                        <button
                          key={mod.id}
                          id={`module-card-${mod.id}`}
                          onClick={() => onSelectModule(mod.id as ModuleId)}
                          className={`stagger-in p-6 rounded-[24px] transition-all duration-300 ease-out flex flex-col relative text-left group min-h-[160px] overflow-hidden block w-full hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm`}
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          {/* Border Draw SVG Effect */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <rect 
                              x="2" y="2" 
                              width="calc(100% - 4px)" height="calc(100% - 4px)" 
                              rx="22" ry="22" 
                              fill="none" 
                              strokeWidth="3"
                              strokeLinecap="round"
                              className={`transition-all duration-700 ease-out [stroke-dasharray:2500] [stroke-dashoffset:2500] group-hover:[stroke-dashoffset:0] group-active:[stroke-dashoffset:0] opacity-0 group-hover:opacity-100 group-active:opacity-100 ${theme.text.replace('text-', 'stroke-')}`}
                            />
                          </svg>

                          <div className="relative z-10 w-full flex-1 flex flex-col">
                            {/* Icon at top left */}
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${theme.bg}`}>
                                <mod.icon className={`w-6 h-6 ${theme.text}`} strokeWidth={2} />
                              </div>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 ${theme.bg}`}>
                                <ArrowRight className={`w-4 h-4 ${theme.text}`} />
                              </div>
                            </div>

                            <h4 className={`text-[17px] font-extrabold leading-tight tracking-tight mb-2 text-slate-800 dark:text-white`}>
                              {mod.title}
                            </h4>

                            <p className={`text-[13px] font-medium leading-[1.6] line-clamp-2 mt-auto text-slate-500 dark:text-slate-400`}>
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
