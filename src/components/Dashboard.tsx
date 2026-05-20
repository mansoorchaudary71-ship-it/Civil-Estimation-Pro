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
  ClipboardList, Maximize2, FileSpreadsheet, Zap, Wand2, ArrowUpRight, LineChart, Sun, X
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
  { id: "staircase-calculator", title: "Staircase Calculator", desc: "Detailed staircase material and BOQ generator.", category: "Concrete Tech", icon: TrendingUp, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
  { id: "bbs-generator", title: "BBS Generator", desc: "Bar Bending Schedule generator.", category: "Concrete Tech", icon: FileSpreadsheet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white" },
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
    return { text: "text-white", bg: "bg-[#8b6cff] dark:bg-[#7158e2]", stroke: "stroke-[#8b6cff]", baseHex: "#8b6cff" };
  }
  
  switch (category) {
    case "Concrete Tech":
      return { text: "text-white", bg: "bg-[#ff6b6b] dark:bg-[#ee5253]", stroke: "stroke-[#ff6b6b]", baseHex: "#ee5253" };
    case "Quantity Estimator":
      return { text: "text-white", bg: "bg-[#54a0ff] dark:bg-[#2e86de]", stroke: "stroke-[#54a0ff]", baseHex: "#2e86de" };
    case "Road Construction":
      return { text: "text-white", bg: "bg-[#1dd1a1] dark:bg-[#10ac84]", stroke: "stroke-[#1dd1a1]", baseHex: "#10ac84" };
    case "Soil Tests":
      return { text: "text-white", bg: "bg-[#ff9f43] dark:bg-[#ff7f50]", stroke: "stroke-[#ff9f43]", baseHex: "#ff7f50" };
    case "MEP":
      return { text: "text-white", bg: "bg-[#c6e33e] dark:bg-[#a3cb38]", stroke: "stroke-[#c6e33e]", baseHex: "#a3cb38" };
    default:
      return { text: "text-white", bg: "bg-[#8b6cff] dark:bg-[#7158e2]", stroke: "stroke-[#8b6cff]", baseHex: "#8b6cff" };
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
          <div className="w-full mb-12 px-4 lg:px-8">
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
          
          <div className="w-full md:max-w-xs shrink-0 flex items-center">
            <div className="relative flex items-center w-full h-12 rounded-full bg-slate-100 dark:bg-slate-800 transition-all duration-300 focus-within:ring-2 focus-within:ring-slate-300 dark:focus-within:ring-slate-600">
              <Hammer className="w-[18px] h-[18px] ml-4 text-slate-400 dark:text-slate-500" strokeWidth={2.5} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full h-full bg-transparent border-none outline-none text-[15px] font-medium text-slate-800 dark:text-white placeholder:text-slate-500 px-3"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mr-3 p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex flex-col w-full">
            {groupsToDisplay.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center">
                <Hammer className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-[var(--primary-dark)] dark:text-slate-200">No calculators found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search term or category.</p>
              </div>
            ) : (
              groupsToDisplay.map((groupName) => (
                <div key={groupName} className="flex flex-col mb-8 sm:mb-10 last:mb-0">
                   {activeCategory === "All Tools" && (
                     <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 pl-4 sm:pl-6 mb-3 uppercase tracking-wider">
                       {groupName}
                     </h3>
                   )}
                  <div className="bg-white dark:bg-[#1a1a1a] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {groupedModules[groupName].map((mod, idx) => {
                      const theme = getCategoryTheme(mod.category, mod.id);
                      const isLast = idx === groupedModules[groupName].length - 1;
                      return (
                        <div key={mod.id} className="relative group">
                          <button
                            id={`module-card-${mod.id}`}
                            onClick={() => onSelectModule(mod.id as ModuleId)}
                            className={`w-full flex items-center p-4 sm:p-5 text-left transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 outline-none`}
                          >
                             <div className={`w-11 h-11 sm:w-[46px] sm:h-[46px] rounded-full flex items-center justify-center shrink-0 ${theme.bg}`}>
                               <mod.icon className={`w-5 h-5 sm:w-[22px] sm:h-[22px] ${theme.text}`} strokeWidth={2} />
                             </div>
                             
                             <div className="ml-4 sm:ml-5 flex-1 pr-2">
                               <h4 className="text-[17px] sm:text-[18px] font-medium text-slate-800 dark:text-slate-100 tracking-tight">
                                 {mod.title}
                               </h4>
                               <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-snug">
                                 {mod.desc}
                               </p>
                             </div>
                             
                             <div className="text-slate-300 dark:text-slate-600 pr-2">
                               <ChevronRight className="w-5 h-5" />
                             </div>
                          </button>
                          {!isLast && (
                            <div className="ml-20 sm:ml-[86px] h-[1px] bg-slate-100 dark:bg-slate-800/60 transition-colors"></div>
                          )}
                        </div>
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
