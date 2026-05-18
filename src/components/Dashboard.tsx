import React, { useState, useEffect } from "react";
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
    { text: "text-[#1A1A1A]", bg: "bg-[#F0F0C0]", fill: "bg-[#F0F0C0]", border: "border-indigo-100" },
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
            <div className="inline-flex flex-row items-center bg-[#1A1A1A] p-1 rounded-full shrink-0 shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-shrink-0 px-[18px] py-[8px] rounded-full text-[13px] transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-[#EDED78] text-[#1A1A1A] font-semibold shadow-sm"
                      : "bg-transparent text-[#888888] hover:bg-white/10 hover:text-[#F5F5F0]"
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
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 z-20 relative">
      
      {/* LEFT COLUMN: Widgets & AI Assistant */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        
        {/* Quick Info Widget 1: Stats */}
        <div className="bg-[#1A1A1A] rounded-[16px] px-[22px] py-[20px] border-none flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase">Community Pulse</span>
            <div className="bg-[#EDED78]/12 p-[6px] rounded-[8px]">
              <ArrowUpRight className="w-4 h-4 text-[#EDED78]" />
            </div>
          </div>
          <div>
            <div className="text-[#EDED78] text-[32px] font-bold leading-none tracking-tight">12,400+</div>
            <p className="text-[#888888] text-[12px] mt-1.5 font-medium">Detailed estimates generated this month</p>
          </div>
        </div>

        {/* Quick Info Widget 2: Unit Converter */}
        <div 
          className="bg-[#FFFFFF] border border-black/5 rounded-[12px] p-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:border-[#EDED78] transition-colors group"
          onClick={() => onSelectModule('unit-converter')}
        >
          <div className="flex items-center gap-4">
            <div className="w-[36px] h-[36px] bg-[#F0F0C0] text-[#5C5C00] rounded-[10px] flex items-center justify-center group-hover:scale-105 transition-transform">
               <Repeat className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-semibold text-[15px] leading-tight text-[#1A1A1A] mb-1">Unit Converter</h4>
              <span className="text-[12px] font-medium text-[#888888]">15 engineering metrics</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#EDED78] transition-transform group-hover:translate-x-1" />
        </div>

        {/* AI Assistant Card (Accent Card) */}
        <div 
          className="mt-auto bg-[#1A1A1A] rounded-[20px] p-[24px] relative overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[auto]"
          onClick={() => onSelectModule('ai')}
        >
          <div className="w-10 h-10 bg-[#EDED78] rounded-full flex items-center justify-center mb-6 shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
             <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
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
              className="w-full px-[28px] py-[10px] bg-[#EDED78] hover:bg-[#e4e466] text-[#1A1A1A] text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
               Ask AI <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Main Tool Container */}
      <div className="lg:col-span-8 xl:col-span-9 bg-[#FFFFFF] border border-black/5 rounded-[40px] p-6 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col min-h-[700px]">
        
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-3">
              {activeCategory}
            </h2>
            <p className="text-[#888888] font-medium mt-1">Select a calculator to initiate a new estimate.</p>
          </div>
          
          <div className="w-full md:max-w-xs shrink-0">
            <div className="relative flex items-center w-full h-[48px] rounded-full border border-black/10 bg-[#FFFFFF] shadow-sm focus-within:outline focus-within:outline-2 focus-within:outline-[#EDED78] focus-within:border-transparent transition-all duration-200">
              <Search className="w-5 h-5 ml-4 shrink-0 text-[#888888]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools..."
                className="w-full h-full bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder:text-[#888888] pl-3 pr-4 rounded-full"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mr-4 text-[#888888] hover:text-[#1A1A1A] text-xs font-bold">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex flex-col w-full">
            {groupsToDisplay.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">No calculators found</h3>
                <p className="text-slate-500 dark:text-slate-500">Try adjusting your search term or category.</p>
              </div>
            ) : (
              groupsToDisplay.map((groupName) => (
                <div key={groupName} className="flex flex-col gap-6 mb-10 last:mb-0">
                   {activeCategory === "All Tools" && (
                     <h3 className="text-[13px] font-bold text-[#1A1A1A] tracking-wider uppercase flex items-center gap-2">
                       <span className="w-[18px] h-[18px] rounded-full bg-[#EDED78] text-[#1A1A1A] flex items-center justify-center text-[14px]">
                         +
                       </span>
                       {groupName}
                     </h3>
                   )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
                    {groupedModules[groupName].map((mod, idx) => {
                      return (
                        <button
                          key={mod.id}
                          id={`module-card-${mod.id}`}
                          onClick={() => onSelectModule(mod.id as ModuleId)}
                          className="stagger-in p-[16px] px-[18px] rounded-[14px] bg-[#FFFFFF] border border-black/5 transition-all duration-300 ease-out flex flex-col relative text-left group min-h-[140px] overflow-hidden hover:border-[#EDED78] hover:shadow-[0_4px_16px_rgba(237,237,120,0.15)] block w-full"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="relative z-10 w-full flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <div className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-[#F0F0C0] text-[#5C5C00] text-[10px] font-semibold tracking-widest uppercase w-fit">
                                {mod.category}
                              </div>
                              <div className="w-[28px] h-[28px] rounded-full bg-[#1A1A1A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-[#EDED78]" />
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F0F0C0] text-[#5C5C00] flex items-center justify-center shrink-0">
                                <mod.icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                              </div>
                              <h4 className="text-[15px] font-semibold text-[#1A1A1A] leading-tight tracking-tight">
                                {mod.title}
                              </h4>
                            </div>

                            <p className="text-[12px] text-[#888888] font-medium leading-[1.5] line-clamp-2 mt-auto">
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
