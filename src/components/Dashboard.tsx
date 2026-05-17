import React, { useState, useEffect } from "react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator, Sparkles, Truck, Route, Waves, Paintbrush, Home, 
  TrendingUp, Hammer, Layers, BoxSelect, Search, Menu, CheckSquare, 
  Map, Grid2X2, Box, ArrowRightLeft, Weight, Spline, ArrowRight,
  ChevronRight, HardHat, Scaling, Container, Repeat, Anvil, Building2, 
  Blocks, Shovel, Pickaxe, Cone, Droplet, PaintBucket, Ruler, Columns, 
  ClipboardList, Maximize2, FileSpreadsheet, Zap
} from "lucide-react";
import { SEO } from "./SEO";
import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";

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

      <div className="flex-1 px-4 md:px-8 py-6 pb-24 w-full max-w-7xl mx-auto flex flex-col relative z-0">
        
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center transition-all duration-500 text-orange-500">
              <Logo className="w-8 h-8" />
            </div>
            <span className="font-bold text-[1.1rem] tracking-tight text-slate-800">
              Civil Estimation Pro
            </span>
          </div>
          <button
            onClick={onOpenSidebar}
            className="p-2.5 -mr-2 rounded-full text-slate-500 bg-white/50 hover:bg-white/80 transition-all border border-slate-200/50"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center mt-10 sm:mt-16 px-4 mb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.1] font-bold tracking-tight text-slate-900 mb-4 max-w-[900px] mx-auto font-sans">
            Estimate Smarter &amp; <span className="text-blue-600">Faster.</span>
          </h1>
          <p className="text-slate-500 font-medium text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-6 text-balance">
            Access powerful, precise calculators for brickwork, concrete, plastering, and infrastructure projects.
          </p>
        </div>

        {/* SEARCH BAR WIDGET */}
        <div className="mb-10 lg:mb-14 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 px-4">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative w-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-full bg-white flex items-center p-1.5 md:p-2 pl-6 md:pl-8">
              <input
                type="text"
                placeholder="Search materials or calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-lg text-slate-800 font-medium outline-none transition-all placeholder:text-slate-400 font-sans border-0 focus:ring-0 py-2 md:py-3 w-full min-w-0"
              />
              <button className="h-10 w-10 md:h-12 md:w-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shrink-0 ml-2 border-none outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS AND TOOL CARDS */}
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
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
                        className={`stagger-in col-span-1 border p-6 rounded-[24px] transition-all duration-300 flex flex-col relative text-left group min-h-[180px] overflow-hidden bg-white hover:bg-slate-50 border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]`}
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {/* Card Content */}
                        <div className="relative z-10 w-full flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-[16px] ${theme.fill} border ${theme.border} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 ${theme.text}`}>
                              <mod.icon className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            
                            <div className={`inline-flex items-center px-3 py-1 rounded-full border ${theme.border} ${theme.bg} text-[10px] font-bold tracking-widest uppercase ${theme.text}`}>
                              {mod.category}
                            </div>
                          </div>

                          <h3 className="text-[17px] font-bold text-slate-900 mb-2 leading-tight transition-colors font-sans group-hover:text-cyan-600">
                            {mod.title}
                          </h3>
                          <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-auto">
                            {mod.desc}
                          </p>
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
