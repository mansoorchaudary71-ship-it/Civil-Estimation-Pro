import React, { useState, useEffect } from "react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
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
  ChevronRight,
  HardHat,
  Scaling,
  Container,
  Repeat,
  Anvil,
  Building2,
  Blocks,
  Shovel,
  Pickaxe,
  Cone,
  Droplet,
  PaintBucket,
  Ruler,
  Columns,
  ClipboardList,
} from "lucide-react";
import { SEO } from "./SEO";

import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";

export const ALL_MODULES = [
  {
    id: "calculators",
    title: "Construction Material",
    desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.",
    category: "TOOLS",
    icon: HardHat,
  },
  {
    id: "house",
    title: "House Estimator",
    desc: "Complete residential cost breakdown from grey structure to finishing.",
    category: "RESIDENTIAL",
    icon: Home,
    premium: true,
    color: "navy",
  },
  {
    id: "area-calculator",
    title: "Area Calculator",
    desc: "Calculate area & perimeter for multiple 2D shapes.",
    category: "TOOLS",
    icon: Scaling,
  },
  {
    id: "volume-estimator",
    title: "Volume Estimator",
    desc: "Calculate volumes, capacity & surface area.",
    category: "TOOLS",
    icon: Container,
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    desc: "Convert units across 15 engineering categories.",
    category: "TOOLS",
    icon: Repeat,
  },
  {
    id: "metal-weight",
    title: "Metal Weight",
    desc: "Calculate section weights of steel profiles.",
    category: "TOOLS",
    icon: Anvil,
  },
  {
    id: "rcc-calculator",
    title: "RCC Structure",
    desc: "Calculate concrete & steel for slabs, columns.",
    category: "TOOLS",
    icon: Building2,
  },
  {
    id: "staircase-calculator",
    title: "Staircase Calculator",
    desc: "Concrete & steel quantity for RCC staircases.",
    category: "TOOLS",
    icon: Layers,
  },
  {
    id: "master-quantity",
    title: "Master Quantity & Estimation",
    desc: "23 comprehensive calculators for specialized construction items.",
    category: "TOOLS",
    icon: ClipboardList,
  },
  {
    id: "column-estimator",
    title: "Column Estimator",
    desc: "Detailed concrete volume and material breakdown for columns.",
    category: "TOOLS",
    icon: Columns,
  },
  {
    id: "earthworks",
    title: "Earthworks",
    desc: "Calculate site preparation, excavation and hauling volumes.",
    category: "SITE PREP",
    icon: Shovel,
  },
  {
    id: "trench",
    title: "Trench Excavation",
    desc: "Pipe trenching and bedding volume estimations.",
    category: "SITE PREP",
    icon: Pickaxe,
  },
  {
    id: "gridEarthwork",
    title: "Grid Method Volume",
    desc: "Leveling volume estimation using the grid method.",
    category: "SITE PREP",
    icon: Grid2X2,
  },
  {
    id: "road",
    title: "Flexible Pavement",
    desc: "Asphalt road layer estimations and material costs.",
    category: "INFRA",
    icon: Cone,
  },
  {
    id: "rigid-pavement",
    title: "Rigid Pavement",
    desc: "Concrete road design material estimations.",
    category: "INFRA",
    icon: Route,
  },
  {
    id: "chainage",
    title: "Chainage Volume",
    desc: "Road highway chainage extraction calculations.",
    category: "INFRA",
    icon: Map,
  },
  {
    id: "sewerage",
    title: "Sewerage & Drainage",
    desc: "Pipes, manholes, and septic tank estimations.",
    category: "INFRA",
    icon: Droplet,
  },
  {
    id: "formwork",
    title: "Formwork & Scaffold",
    desc: "Shuttering and scaffolding material computations.",
    category: "STRUCTURAL",
    icon: Hammer,
  },
  {
    id: "finishing",
    title: "Finishing Works",
    desc: "Tiles, paint, doors, and window estimations.",
    category: "INTERIORS",
    icon: PaintBucket,
  },
  {
    id: "takeoff",
    title: "Plan Measure",
    desc: "Area & linear extraction.",
    category: "2D TAKEOFF",
    icon: Ruler,
  },
  {
    id: "rates",
    title: "Live DB Rates",
    desc: "Centralized database for local market prices.",
    category: "DATA",
    icon: TrendingUp,
  },
  {
    id: "ai",
    title: "AI Assistant",
    desc: "Ask anything about construction",
    category: "GEMINI PRO",
    icon: Sparkles,
    premium: true,
    color: "electric",
  },
];

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  previousModule?: string | null;
}

export const getCategoryTheme = (category: string, id: string) => {
  if (id === "calculators")
    return {
      text: "text-[#ef4444]",
      blob: "bg-gradient-to-br from-[#ef4444]/40 to-transparent",
      border: "border-[#ef4444]/30 dark:border-[#ef4444]/30",
    };
  if (id === "area-calculator")
    return {
      text: "text-[#f97316]",
      blob: "bg-gradient-to-br from-[#f97316]/40 to-transparent",
      border: "border-[#f97316]/30 dark:border-[#f97316]/30",
    };
  if (id === "volume-estimator")
    return {
      text: "text-[#0ea5e9]",
      blob: "bg-gradient-to-br from-[#0ea5e9]/40 to-transparent",
      border: "border-[#0ea5e9]/30 dark:border-[#0ea5e9]/30",
    };
  if (id === "unit-converter")
    return {
      text: "text-[#a855f7]",
      blob: "bg-gradient-to-br from-[#a855f7]/40 to-transparent",
      border: "border-[#a855f7]/30 dark:border-[#a855f7]/30",
    };
  if (id === "metal-weight")
    return {
      text: "text-[#475569]",
      blob: "bg-gradient-to-br from-[#475569]/40 to-transparent",
      border: "border-[#475569]/30 dark:border-[#475569]/30",
    };
  if (id === "rcc-calculator")
    return {
      text: "text-[#6366f1]",
      blob: "bg-gradient-to-br from-[#6366f1]/40 to-transparent",
      border: "border-[#6366f1]/30 dark:border-[#6366f1]/30",
    };
  if (id === "master-quantity")
    return {
      text: "text-[#3b82f6]",
      blob: "bg-gradient-to-br from-[#3b82f6]/40 to-transparent",
      border: "border-[#3b82f6]/30 dark:border-[#3b82f6]/30",
    };
  if (id === "column-estimator")
    return {
      text: "text-[#8b5cf6]",
      blob: "bg-gradient-to-br from-[#8b5cf6]/40 to-transparent",
      border: "border-[#8b5cf6]/30 dark:border-[#8b5cf6]/30",
    };
  if (id === "takeoff")
    return {
      text: "text-[#10b981]",
      blob: "bg-gradient-to-br from-[#10b981]/40 to-transparent",
      border: "border-[#10b981]/30 dark:border-[#10b981]/30",
    };

  if (category === "SITE PREP")
    return {
      text: "text-[#f97316]",
      blob: "bg-gradient-to-br from-[#f97316]/40 to-transparent",
      border: "border-[#f97316]/30 dark:border-[#f97316]/30",
    };
  if (category === "INFRA")
    return {
      text: "text-[#3b82f6]",
      blob: "bg-gradient-to-br from-[#3b82f6]/40 to-transparent",
      border: "border-[#3b82f6]/30 dark:border-[#3b82f6]/30",
    };
  if (category === "INTERIORS")
    return {
      text: "text-[#d946ef]",
      blob: "bg-gradient-to-br from-[#d946ef]/40 to-transparent",
      border: "border-[#d946ef]/30 dark:border-[#d946ef]/30",
    };
  if (category === "STRUCTURAL")
    return {
      text: "text-[#ef4444]",
      blob: "bg-gradient-to-br from-[#ef4444]/40 to-transparent",
      border: "border-[#ef4444]/30 dark:border-[#ef4444]/30",
    };
  if (category === "DATA")
    return {
      text: "text-[#0ea5e9]",
      blob: "bg-gradient-to-br from-[#0ea5e9]/40 to-transparent",
      border: "border-[#0ea5e9]/30 dark:border-[#0ea5e9]/30",
    };
  if (category === "GEMINI PRO")
    return {
      text: "text-[#6366f1]",
      blob: "bg-gradient-to-br from-[#6366f1]/40 to-transparent",
      border: "border-[#6366f1]/30 dark:border-[#6366f1]/30",
    };

  return {
    text: "text-[#64748b]",
    blob: "bg-gradient-to-br from-[#64748b]/40 to-transparent",
    border: "border-[#64748b]/30 dark:border-[#64748b]/30",
  };
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

  return (
    <div className="flex-1 px-4 md:px-8 py-6 pb-12 w-full max-w-7xl mx-auto flex flex-col font-sans">
      <SEO 
        title="Dashboard" 
        description="Civil Estimation Pro: Advanced estimators for live construction rate analysis, house estimating, and comprehensive BOQ calculators." 
        canonicalUrl="https://civilestimationpro.com" 
      />
      <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-[1.1rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
            Civil Estimation Pro
          </span>
        </div>
        <button
          onClick={onOpenSidebar}
          className="p-2 -mr-2 text-slate-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center mt-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white flex items-center justify-center gap-2 flex-wrap">
          {user ? (
            <>Welcome back, <span className="relative"><span className="relative z-10 text-indigo-600 dark:text-indigo-400">{user.displayName || "User"}</span><svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 dark:text-indigo-900/50 -z-0" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" /></svg></span></>
          ) : (
            <>Welcome to Civil <span className="relative whitespace-nowrap"><span className="relative z-10 text-indigo-600 dark:text-indigo-400">Estimation Pro</span><svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 dark:text-indigo-900/50 -z-0" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,15 Q30,5 100,15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" /></svg></span></>
          )}{" "}
          <span
            className="text-3xl md:text-5xl animate-bounce origin-bottom hover:animate-none cursor-default inline-block"
            style={{ animationDuration: "2s", animationIterationCount: 2 }}
          >
            👋
          </span>
        </h1>
        <div className="text-slate-500 dark:text-slate-400 mt-1 flex flex-col items-center gap-1 font-medium text-base">
          <p>
            {user ? "Ready to continue your estimates?" : "What would you like to estimate today?"}
          </p>
          {!user && (
            <p className="text-sm font-normal">
              <button 
                onClick={onOpenAuth}
                className="text-amber-600 hover:text-amber-700 hover:underline font-semibold"
              >
                Sign In
              </button>{" "}
              to save your estimates and access more features.
            </p>
          )}
        </div>
      </div>

      <div className="mb-8 md:mb-10 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
        <div className="relative group w-full max-w-2xl mx-auto drop-shadow-md">
          <div className="absolute inset-y-0 left-[20px] md:left-[24px] flex items-center pointer-events-none z-10">
            <Search className="text-slate-400 dark:text-slate-500 w-5 h-5 md:w-6 md:h-6 transition-colors group-focus-within:text-indigo-500" />
          </div>
          <input
            type="text"
            placeholder="Search tools, materials, or projects."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 rounded-full py-3 md:py-4 pl-[50px] md:pl-[60px] pr-5 md:pr-6 text-base md:text-lg font-medium text-slate-800 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-white/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.05)] focus:shadow-[0_10px_40px_rgba(99,102,241,0.15)]"
          />
        </div>

        <div className="mt-6 md:mt-8 px-2 md:px-0">
          <div className="flex flex-row overflow-x-auto md:flex-wrap items-center md:justify-center gap-2 md:gap-3 w-full max-w-5xl mx-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 rounded-full whitespace-nowrap text-[13px] md:text-[15px] font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transform scale-105"
                    : "bg-white/60 backdrop-blur-md text-slate-600 border border-white/50 hover:bg-white hover:shadow-md dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        {groupsToDisplay.map((groupName) => (
          <div key={groupName} className="flex flex-col gap-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 pl-2 text-center md:text-left">
              {groupName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full">
              {groupedModules[groupName].map((mod) => {
                if (mod.id === "house") {
                  return (
                    <button
                      key={mod.id}
                      id={`module-card-${mod.id}`}
                      onClick={() => onSelectModule(mod.id as ModuleId)}
                      className="col-span-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 p-6 rounded-[28px] transition-all duration-300 flex flex-col items-center relative text-center group hover:-translate-y-2 shadow-[0_12px_40px_rgba(79,70,229,0.25)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.4)] min-h-[220px] overflow-hidden"
                    >
                      <div className="absolute right-[-10%] bottom-[-5%] text-indigo-300/10 group-hover:text-indigo-300/20 transition-all duration-500 pointer-events-none group-active:scale-95 group-active:-rotate-6">
                        <Home
                          className="w-[160px] h-[160px] md:w-[180px] md:h-[180px]"
                          strokeWidth={1}
                        />
                      </div>

                      <div className="relative z-10 w-full flex-1 flex flex-col items-center">
                        <div className="relative w-14 h-14 flex items-center justify-center mb-4 shrink-0">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/40 to-transparent blur-[16px] transition-transform duration-500 group-hover:scale-150"></div>
                          <mod.icon className="relative z-10 w-7 h-7 text-indigo-50 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-indigo-300/30 bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-widest uppercase text-indigo-50 shadow-sm mb-4">
                          <span className="truncate">{mod.category}</span>
                        </div>

                        <h3 className="text-[20px] font-bold text-white mb-2 leading-tight">
                          {mod.title}
                        </h3>

                        <div className="flex flex-row flex-wrap justify-center gap-2 mt-auto pt-2 w-full">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-indigo-300/40 bg-white/10 backdrop-blur-md text-[12px] font-medium text-indigo-50 transition-colors group-hover:bg-white/20">
                            Grey Structure
                          </div>
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-indigo-300/40 bg-white/10 backdrop-blur-md text-[12px] font-medium text-indigo-50 transition-colors group-hover:bg-white/20">
                            Finishing
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }

                const theme = getCategoryTheme(mod.category, mod.id);
                return (
                  <button
                    key={mod.id}
                    id={`module-card-${mod.id}`}
                    onClick={() => onSelectModule(mod.id as ModuleId)}
                    className="col-span-1 bg-white/70 backdrop-blur-xl dark:bg-slate-900/70 p-6 rounded-[28px] transition-all duration-300 flex flex-col items-center relative text-center group hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] border border-white/60 hover:border-white dark:border-slate-700/50 dark:hover:border-slate-600 min-h-[220px] overflow-hidden"
                  >
                    <div className="relative z-10 w-full flex-1 flex flex-col items-center">
                      <div className="relative w-14 h-14 flex items-center justify-center mb-4 shrink-0">
                        <div
                          className={`absolute inset-0 rounded-full ${theme.blob} blur-[16px] transition-transform duration-500 group-hover:scale-150`}
                        ></div>
                        <mod.icon
                          className={`relative z-10 w-7 h-7 ${theme.text} transition-transform duration-300 group-hover:scale-110`}
                          strokeWidth={2.5}
                        />
                      </div>

                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full border ${theme.border} bg-white/50 backdrop-blur-sm dark:bg-slate-800/80 shadow-sm text-[11px] font-bold tracking-widest uppercase ${theme.text} mb-3`}
                      >
                        <span className="truncate">{mod.category}</span>
                      </div>

                      <h3 className="text-[18px] font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                        {mod.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3 mt-auto">
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
  );
}
