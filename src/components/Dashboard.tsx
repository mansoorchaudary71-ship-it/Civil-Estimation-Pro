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
  { id: "calculators", title: "Construction Material", desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.", category: "TOOLS", icon: HardHat },
  { id: "house", title: "House Estimator", desc: "Complete residential cost breakdown from grey structure to finishing.", category: "RESIDENTIAL", icon: Home, premium: true, color: "navy" },
  { id: "area-calculator", title: "Area Calculator", desc: "Calculate area & perimeter for multiple 2D shapes.", category: "TOOLS", icon: Scaling },
  { id: "volume-estimator", title: "Volume Estimator", desc: "Calculate volumes, capacity & surface area.", category: "TOOLS", icon: Container },
  { id: "unit-converter", title: "Unit Converter", desc: "Convert units across 15 engineering categories.", category: "TOOLS", icon: Repeat },
  { id: "metal-weight", title: "Metal Weight", desc: "Calculate section weights of steel profiles.", category: "TOOLS", icon: Anvil },
  { id: "mep-calculator", title: "Energy & MEP Calculators", desc: "Estimate solar capacity, water heating, and AC sizing.", category: "TOOLS", icon: Zap },
  { id: "master-rcc", title: "Master RCC Estimator", desc: "Unified hub for Slab, Column, Beam, Staircase, and BBS calculations.", category: "STRUCTURAL", icon: Building2 },
  { id: "master-quantity", title: "Master Quantity & Estimation", desc: "23 comprehensive calculators for specialized construction items.", category: "TOOLS", icon: ClipboardList },
  { id: "earthworks", title: "Earthworks", desc: "Calculate site preparation, excavation and hauling volumes.", category: "SITE PREP", icon: Shovel },
  { id: "road-pavement", title: "Road & Pavement Estimator", desc: "Comprehensive tool for flexible, rigid, pavement & sewerage calculations.", category: "INFRA", icon: Route },
  { id: "chainage", title: "Chainage Volume", desc: "Road highway chainage extraction calculations.", category: "INFRA", icon: Map },
  { id: "interiors-finishes", title: "Interiors & Finishes", desc: "Tiles, painting, doors, wood framing, and termite treatments.", category: "INTERIORS", icon: Paintbrush },
  { id: "formwork", title: "Formwork & Scaffold", desc: "Shuttering and scaffolding material computations.", category: "STRUCTURAL", icon: Hammer },
  { id: "gradient-calculator", title: "Gradient & Slope", desc: "Dynamic bidirectional slope and elevation calculator.", category: "SITE_PREP", icon: Maximize2 },
  { id: "takeoff", title: "Plan Measure", desc: "Area & linear extraction.", category: "2D TAKEOFF", icon: Ruler },
  { id: "rates", title: "Live DB Rates", desc: "Centralized database for local market prices.", category: "DATA", icon: TrendingUp },
  { id: "ai", title: "AI Assistant", desc: "Ask anything about construction", category: "GEMINI PRO", icon: Sparkles, premium: true, color: "electric" },
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
  const [activeCategory, setActiveCategory] = useState("All");

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const searchPlaceholders = [
    "Search 'cement for 5 marla'...",
    "Search 'steel quantity slab'...",
    "Search 'brickwork calculation'...",
    "Search 'paint for interior wall'...",
    "Search 'excavation volume'..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previousModule && !["home", "my-estimates", "pricing", "about", "careers", "contact", "blog"].includes(previousModule)) {
      const prevMod = ALL_MODULES.find((m) => m.id === previousModule);
      if (prevMod) {
        setActiveCategory("All");
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
    "All",
    ...Array.from(
      new Set(
        ALL_MODULES.map((m) => {
          if (
            m.id === "calculators" ||
            m.id === "house" ||
            m.id === "master-quantity"
          )
            return "POPULAR";
          return m.category;
        }),
      ),
    ),
  ];

  const filteredModules = ALL_MODULES.filter((m) => {
    const matchesSearch =
      !searchTerm ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());

    let groupName = m.category;
    if (
      m.id === "calculators" ||
      m.id === "house" ||
      m.id === "master-quantity"
    ) {
      groupName = "POPULAR";
    }

    const matchesCategory =
      activeCategory === "All" || groupName === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const groupsToDisplay: string[] = [];
  const groupedModules: Record<string, typeof ALL_MODULES> = {};

  filteredModules.forEach((mod) => {
    let groupName = mod.category;
    if (
      mod.id === "calculators" ||
      mod.id === "house" ||
      mod.id === "master-quantity"
    ) {
      groupName = "POPULAR";
    }

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

      <div className="flex-1 px-4 md:px-8 py-6 pb-32 md:pb-32 w-full max-w-7xl mx-auto flex flex-col relative z-0">
        
        {/* Removed Mobile Header per top navigation consolidation request */}


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
          <div className="inline-flex items-center rounded-full bg-[#111111] dark:bg-white pl-1.5 pr-5 py-1.5 mb-8 shadow-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2A2A2A] dark:bg-slate-200 mr-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFDF70] dark:text-[#FFA000]" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-white dark:text-[#111111]">
              / For Quantity Surveyors & Engineers
            </span>
          </div>
          
          <h1 className="font-heading text-[3.5rem] sm:text-[4.5rem] md:text-[5rem] lg:text-[6.5rem] leading-[0.95] font-black tracking-tighter text-[#111111] dark:text-white uppercase mb-8 max-w-5xl mx-auto">
            ACCURATE<br/>ESTIMATES<br/>IN SECONDS
          </h1>

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
    <div className="relative w-full max-w-[1400px] mx-auto z-10 flex flex-col items-center">
      
      {/* Frosted Glass Search Bar Container */}
      <div className="w-full relative z-20 flex justify-end mt-4 md:mt-8 px-0">
            <style>{`
              input.civil-search-input[type="text"] {
                  background: transparent !important;
                  background-color: transparent !important;
                  border: none !important;
                  box-shadow: none !important;
                  padding: 0 !important;
                  outline: none !important;
                  -webkit-appearance: none !important;
              }
              input.civil-search-input[type="text"]:focus {
                  background: transparent !important;
                  background-color: transparent !important;
                  border: none !important;
                  box-shadow: none !important;
                  outline: none !important;
                  -webkit-appearance: none !important;
                  outline-offset: 0 !important;
              }
              input.civil-search-input[type="text"]:-webkit-autofill,
              input.civil-search-input[type="text"]:-webkit-autofill:hover, 
              input.civil-search-input[type="text"]:-webkit-autofill:focus, 
              input.civil-search-input[type="text"]:-webkit-autofill:active {
                  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
                  transition: background-color 5000s ease-in-out 0s;
                  -webkit-text-fill-color: rgba(255,255,255,0.8) !important;
              }
            `}</style>

            <div className="w-full md:w-[70%] flex flex-col gap-3">
              {/* Search Bar Outer Wrapper */}
              <div 
                className="group relative flex items-center w-full h-[56px] rounded-[100px] border-2 bg-gradient-to-r from-yellow-200/20 to-yellow-100/10 backdrop-blur-md transition-all duration-300 pl-[20px] pr-[6px]"
                style={{ 
                  borderColor: 'rgba(239,159,39,0.3)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(239,159,39,0.7)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239,159,39,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(239,159,39,0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                
                {/* Search Icon */}
                <Search className="w-5 h-5 shrink-0" style={{ color: 'rgba(239,159,39,0.7)' }} strokeWidth={2.5} />
                
                {/* Input Area */}
                <div className="relative flex-1 h-full mx-3 flex items-center overflow-hidden">
                  {!searchTerm && (
                     <div className="absolute inset-0 flex flex-col pointer-events-none w-full text-left font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        {searchPlaceholders.map((text, idx) => (
                          <div 
                            key={idx}
                            className={`absolute inset-0 flex items-center w-full text-[16px] truncate transition-all duration-500 ease-in-out
                              ${idx === currentPlaceholder 
                                ? 'opacity-100 translate-y-0' 
                                : idx < currentPlaceholder 
                                  ? 'opacity-0 -translate-y-8' 
                                  : 'opacity-0 translate-y-8'
                              }`}
                          >
                            {text}
                          </div>
                        ))}
                     </div>
                  )}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="civil-search-input absolute inset-0 w-full h-full border-0 focus:ring-0 focus:outline-none focus:border-0 p-0 text-[16px] font-medium outline-none bg-transparent"
                    style={{ 
                      color: 'rgba(0,0,0,0.8)',
                      backgroundColor: 'transparent',
                      boxShadow: 'none'
                    }}
                    placeholder=""
                  />
                </div>
                
                {/* AI Search Pill Button */}
                <button className="flex items-center justify-center gap-1 rounded-[100px] shrink-0 transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: '#EF9F27',
                    color: '#1a1208',
                    padding: '6px 10px',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  <Wand2 className="w-4 h-4" strokeWidth={2.5} />
                  <span>Search</span>
                </button>

              </div>
              
              {/* Quick Chips Below */}
              <div className="flex justify-end gap-2 flex-wrap text-sm">
                <button 
                  onClick={() => setActiveCategory("TOOLS")}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                    activeCategory === "TOOLS" 
                      ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border-[#14b8a6]/30' 
                      : 'bg-transparent text-white/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  Calculators
                </button>

                <button 
                  onClick={() => setActiveCategory("POPULAR")}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                    activeCategory === "POPULAR" 
                      ? 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30' 
                      : 'bg-transparent text-white/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  Materials
                </button>

                <button 
                  onClick={() => setActiveCategory("REPORTS")}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                    activeCategory === "REPORTS" 
                      ? 'bg-[#f43f5e]/20 text-[#fb7185] border-[#f43f5e]/30' 
                      : 'bg-transparent text-white/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  Reports
                </button>

                <button 
                  onClick={() => setActiveCategory("INDIGO")}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                    activeCategory === "INDIGO" 
                      ? 'bg-[#6366f1]/20 text-[#818cf8] border-[#6366f1]/30' 
                      : 'bg-transparent text-white/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  Insights
                </button>

                {activeCategory !== "All" && (
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className="ml-2 text-[12px] text-white/40 hover:text-white/80 uppercase font-bold tracking-wider underline decoration-white/20 underline-offset-4 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* CATEGORY TABS AND TOOL CARDS */}
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 relative z-10 mt-8">
          {/* CATEGORY TABS */}
          <div className="mt-4 px-1 md:px-0 relative mb-12">
            <div className="flex flex-row overflow-x-auto md:flex-wrap items-center md:justify-center gap-2 w-full max-w-5xl mx-auto pb-4 md:pb-0 scrollbar-hide snap-x">
              {categories.map((category, idx) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`stagger-in flex-shrink-0 relative px-5 py-2.5 rounded-full whitespace-nowrap text-sm md:text-[15px] font-bold transition-all duration-300 snap-center overflow-hidden border ${
                    activeCategory === category
                      ? "text-slate-900 border-slate-200 bg-white shadow-sm"
                      : "text-slate-500 border-transparent hover:bg-slate-100/50 hover:text-slate-800"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MODULAR CARDS GRID */}
          <div className="flex flex-col gap-12 w-full">
            {groupsToDisplay.map((groupName) => (
              <div key={groupName} className="flex flex-col gap-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 pl-2 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-slate-900 block"></span>
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
                        className="stagger-in col-span-1 border border-slate-200/80 dark:border-white/10 hover:border-transparent p-6 rounded-[24px] bg-white dark:bg-[#1A1A1A] transition-all duration-300 ease-out flex flex-col relative text-left group min-h-[220px] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_-16px_rgba(255,255,255,0.05)] hover:-translate-y-1.5"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {/* Colored Accent Top Bar */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${theme.bg} transition-transform origin-left group-hover:scale-x-105`}></div>
                        
                        {/* Card Content */}
                        <div className="relative z-10 w-full flex-1 flex flex-col pt-1">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-[18px] ${theme.bg} ${theme.text} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out shadow-sm`}>
                              <mod.icon className="w-7 h-7" strokeWidth={2} />
                            </div>
                            
                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-white/40">
                              {mod.category}
                            </div>
                          </div>

                          <h3 className="text-[18px] font-bold text-[#111111] dark:text-white mb-1.5 leading-tight tracking-tight font-sans group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {mod.title}
                          </h3>
                          <p className="text-[13px] text-[#111111]/50 dark:text-white/50 font-medium leading-relaxed mb-6 line-clamp-2">
                            {mod.desc}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
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
