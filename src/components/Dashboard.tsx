import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator, Sparkles, Truck, Route, Waves, Paintbrush, Home, 
  TrendingUp, Hammer, Layers, BoxSelect, Search, Menu, CheckSquare, 
  Map, Grid2X2, Box, ArrowRightLeft, Weight, Spline, ArrowRight,
  ChevronRight, ChevronDown, HardHat, Scaling, Container, Repeat, Anvil, Building2, Building, 
  Blocks, Shovel, Pickaxe, Cone, Droplet, PaintBucket, Ruler, Columns, FolderOpen,
  ClipboardList, Maximize2, FileSpreadsheet, Zap, Wand2, ArrowUpRight, LineChart, Sun, X, Mic, Clock, BarChart, ShieldCheck, Users
} from "lucide-react";
import { SEO } from "./SEO";
import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";
import { ThreeJSBlueprintHero } from "./ThreeJSBlueprintHero";

import PostLoginDashboard from "./PostLoginDashboard";
import { useSettings } from "../context/SettingsContext";

export const ALL_MODULES = [
  { id: "tracker", title: "Site Progress Tracker", desc: "Track construction timelines, visual Gantt charts, budget burn, and photo updates.", category: "Analysis", icon: BarChart, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-blue-500", difficulty: "Beginner", estimatedTime: "~3 mins", isNew: true },
  { id: "projects", title: "Project Manager", desc: "Group calculations by project, view aggregated costs and timelines.", category: "Analysis", icon: FolderOpen, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-blue-500", difficulty: "Beginner", estimatedTime: "~1 min", isNew: true },
  { id: "labour-calculator", title: "Labour & Workforce", desc: "Calculate labour cost, worker allocation, and daily burn rates for your project.", category: "Project Costing", icon: Users, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-green-500", difficulty: "Intermediate", estimatedTime: "~2 mins", isNew: true },
  { id: "boq", title: "Professional BOQ Generator", desc: "Create, format, and export professional Bills of Quantities and itemized estimates.", category: "Quantity", icon: ClipboardList, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Advanced", estimatedTime: "~5 mins", isNew: true },
  { id: "retaining-wall", title: "Retaining Wall Estimator", desc: "Calculate stability factors, concrete volume, and reinforcement for cantilever retaining walls.", category: "Concrete Tech", icon: ShieldCheck, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", difficulty: "Advanced", estimatedTime: "~5 mins", isNew: true },
  { id: "mix-design", title: "Concrete Mix Design", desc: "IS 10262 performance-based concrete mix calculator and report generator.", category: "Concrete Tech", icon: Droplet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", difficulty: "Advanced", estimatedTime: "~4 mins", isNew: true },
  { id: "isolated-footing", title: "Isolated Footing Calculator", desc: "Detailed estimations for concrete, steel mesh, excavation and working space.", category: "Concrete Tech", icon: Box, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", difficulty: "Intermediate", estimatedTime: "~3 mins", isNew: true },
  { id: "calculators", title: "Construction Material", desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.", category: "Concrete Tech", icon: HardHat, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", iconClass: "", difficulty: "Beginner", estimatedTime: "~2 mins", isPopular: true },
  { id: "reinforcement", title: "Reinforcement Detailing Visualizer", desc: "Interactive 2D rebar detailing for beams, columns & slabs with IS 456 checks.", category: "Concrete Tech", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", difficulty: "Intermediate", estimatedTime: "~3 mins", isNew: true },
  { id: "house", title: "House Estimator", desc: "Complete residential cost breakdown from grey structure to finishing.", category: "Quantity", icon: Home, premium: true, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Advanced", estimatedTime: "~15 mins", isPopular: true },
  { id: "area-calculator", title: "Area Calculator", desc: "Calculate area & perimeter for multiple 2D shapes.", category: "Quantity", icon: Scaling, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Beginner", estimatedTime: "~1 min" },
  { id: "property-area", title: "Property Area Calculator", desc: "Calculate Carpet Area, Built-up Area and Super Built-up Area.", category: "Quantity", icon: Building, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Beginner", estimatedTime: "~2 mins" },
  { id: "volume-estimator", title: "Volume & Tank Capacity", desc: "Calculate volumes, tank capacity & surface area.", category: "Quantity", icon: Container, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Intermediate", estimatedTime: "~3 mins" },
  { id: "unit-converter", title: "Unit Converter", desc: "Convert units across 15 engineering categories.", category: "Quantity", icon: Repeat, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Beginner", estimatedTime: "~1 min" },
  { id: "metal-weight", title: "Metal Weight", desc: "Calculate section weights of steel profiles.", category: "Quantity", icon: Anvil, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-purple-500", difficulty: "Intermediate", estimatedTime: "~3 mins" },
  { id: "mep-calculator", title: "Energy & MEP Calculators", desc: "Estimate solar capacity, water heating, and AC sizing.", category: "MEP", icon: Zap, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-cyan-500", difficulty: "Intermediate", estimatedTime: "~5 mins", isNew: true },
  { id: "rainwater-harvesting", title: "Rainwater Harvesting", desc: "Calculate collectible rainwater volume and recommend tank sizes.", category: "MEP", icon: Droplet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-cyan-500", difficulty: "Beginner", estimatedTime: "~3 mins", isNew: true },
  { id: "master-rcc", title: "Master RCC Estimator", desc: "Unified hub for Slab, Column, Beam, Staircase, and BBS calculations.", category: "Concrete Tech", icon: Building2, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", iconClass: "", difficulty: "Advanced", estimatedTime: "~10 mins", isPopular: true },
  { id: "staircase-calculator", title: "Staircase Calculator", desc: "Detailed staircase material and BOQ generator.", category: "Concrete Tech", icon: TrendingUp, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "bbs-generator", title: "BBS Generator", desc: "Bar Bending Schedule generator.", category: "Concrete Tech", icon: FileSpreadsheet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#111827] backdrop-blur-md text-[var(--primary-dark)] dark:text-white border-amber-500", difficulty: "Advanced", estimatedTime: "~10 mins" },
  { id: "master-quantity", title: "Master Quantity & Estimation", desc: "23 comprehensive calculators for specialized construction items.", category: "Quantity Estimator", icon: ClipboardList, styleStyle: "solid", colorClass: "bg-[var(--accent-blue)] text-[var(--primary-dark)] shadow-[0_8px_30px_rgba(0,207,232,0.3)]", iconClass: "text-[var(--primary-dark)] opacity-90", difficulty: "Advanced", estimatedTime: "~20 mins" },
  { id: "earthworks", title: "Earthworks", desc: "Calculate site preparation, excavation and hauling volumes.", category: "Road Construction", icon: Shovel, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "road-pavement", title: "Road & Pavement Estimator", desc: "Comprehensive tool for flexible, rigid, pavement & sewerage calculations.", category: "Road Construction", icon: Route, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~15 mins" },
  { id: "chainage", title: "Chainage Volume", desc: "Road highway chainage extraction calculations.", category: "Road Construction", icon: Map, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "interiors-finishes", title: "Interiors & Finishes", desc: "Tiles, painting, doors, wood framing, and termite treatments.", category: "Quantity Estimator", icon: Paintbrush, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~3 mins" },
  { id: "formwork", title: "Formwork & Scaffold", desc: "Shuttering and scaffolding material computations.", category: "Concrete Tech", icon: Hammer, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~4 mins" },
  { id: "gradient-calculator", title: "Gradient & Slope", desc: "Dynamic bidirectional slope and elevation calculator.", category: "Road Construction", icon: Maximize2, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins" },
  { id: "takeoff", title: "Plan Measure", desc: "Area & linear extraction.", category: "Quantity Estimator", icon: Ruler, styleStyle: "solid", colorClass: "bg-[var(--accent-purple)] text-white shadow-[0_8px_30px_rgba(115,103,240,0.3)]", iconClass: "text-white opacity-90", difficulty: "Advanced", estimatedTime: "~10 mins", isPopular: true },
  { id: "rates", title: "Live DB Rates", desc: "Centralized database for local market prices.", category: "Quantity Estimator", icon: TrendingUp, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~1 min", isPopular: true },
  { id: "ai", title: "AI Assistant", desc: "Ask anything about construction", category: "Quantity Estimator", icon: Sparkles, premium: true, styleStyle: "solid", colorClass: "bg-[var(--primary-dark)] text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]", iconClass: "text-white opacity-90", difficulty: "Beginner", estimatedTime: "~1 min", isNew: true },
  { id: "geotechnical", title: "Geotechnical & Soil Tests", desc: "Process lab data for water content, Specific Gravity, LL, and CBR.", category: "Soil Tests", icon: Cone, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "master-sieve", title: "Master Sieve Analysis", desc: "Dynamic gradation validator driven by specification databases.", category: "Soil Tests", icon: LineChart, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~8 mins" },
  { id: "aggregate-blending", title: "Aggregate Blending", desc: "Blend 2 to 4 stockpiles to meet target grading specifications.", category: "Soil Tests", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~10 mins" },
  { id: "aggregate-tests", title: "Aggregate Tests", desc: "Calculate impact, crushing, abrasion values and water absorption.", category: "Concrete Tech", icon: Box, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~4 mins" },
  { id: "solar-roof", title: "Solar Roof Calculator", desc: "Estimate required solar system size, panels, and ROI.", category: "MEP", icon: Sun, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-[#6B46C1]/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins", isNew: true }
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
    return { textRaw: "text-[#4338CA] dark:text-[#818CF8]", text: "text-white", bg: "bg-[#4338CA] dark:bg-[#4338CA]", stroke: "stroke-[#4338CA]", baseHex: "#4338CA", border: "border-[#4338CA] dark:border-[#4338CA]" };
  }
  
  switch (category) {
    case "Concrete Tech":
      return { textRaw: "text-[#E55A2B] dark:text-[#ff8a65]", text: "text-white", bg: "bg-[#E55A2B] dark:bg-[#E55A2B]", stroke: "stroke-[#E55A2B]", baseHex: "#E55A2B", border: "border-[#E55A2B] dark:border-[#E55A2B]" };
    case "Quantity Estimator":
      return { textRaw: "text-[#6B46C1] dark:text-[#9F7AEA]", text: "text-white", bg: "bg-[#6B46C1] dark:bg-[#6B46C1]", stroke: "stroke-[#6B46C1]", baseHex: "#6B46C1", border: "border-[#6B46C1] dark:border-[#6B46C1]" };
    case "Road Construction":
      return { textRaw: "text-[#0D9488] dark:text-[#2DD4BF]", text: "text-white", bg: "bg-[#0D9488] dark:bg-[#0D9488]", stroke: "stroke-[#0D9488]", baseHex: "#0D9488", border: "border-[#0D9488] dark:border-[#0D9488]" };
    case "Soil Tests":
      return { textRaw: "text-[#D97706] dark:text-[#FBBF24]", text: "text-white", bg: "bg-[#D97706] dark:bg-[#D97706]", stroke: "stroke-[#D97706]", baseHex: "#D97706", border: "border-[#D97706] dark:border-[#D97706]" };
    case "MEP":
      return { textRaw: "text-[#2563EB] dark:text-[#60A5FA]", text: "text-white", bg: "bg-[#2563EB] dark:bg-[#2563EB]", stroke: "stroke-[#2563EB]", baseHex: "#2563EB", border: "border-[#2563EB] dark:border-[#2563EB]" };
    case "Analysis & Tools":
      return { textRaw: "text-[#4338CA] dark:text-[#818CF8]", text: "text-white", bg: "bg-[#4338CA] dark:bg-[#4338CA]", stroke: "stroke-[#4338CA]", baseHex: "#4338CA", border: "border-[#4338CA] dark:border-[#4338CA]" };
    default:
      return { textRaw: "text-[#4338CA] dark:text-[#818CF8]", text: "text-white", bg: "bg-[#4338CA] dark:bg-[#4338CA]", stroke: "stroke-[#4338CA]", baseHex: "#4338CA", border: "border-slate-500 dark:border-slate-500" };
  }
};

const ToolCard = ({ mod, onSelect, isUsed }: { mod: any, onSelect: (id: string) => void, isUsed?: boolean }) => {
  const theme = getCategoryTheme(mod.category, mod.id);
  const diffColors: Record<string, string> = {
    "Beginner": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Intermediate": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    "Advanced": "bg-orange-500/20 text-orange-400 border-orange-500/30"
  };
  
  const difficultyClass = diffColors[mod.difficulty] || diffColors["Beginner"];
  const isPro = !!mod.premium;

  return (
    <button
      onClick={() => onSelect(mod.id)}
      id={`module-card-${mod.id}`}
      title={mod.desc}
      className={`group relative overflow-hidden flex flex-col items-start p-5 rounded-2xl cursor-pointer transition-all duration-500 ease-out outline-none text-left w-full h-[220px]
        bg-[#111827] border border-white/10 shadow-lg
        hover:-translate-y-2 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)]
        ${isPro ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-900/40 before:to-transparent before:z-0' : ''}
      `}
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
      }}
    >
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-tr from-transparent to-white/20" />
      {/* Category Border Glow */}
      <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme.bg}`} />

      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20 pointer-events-none">
        {mod.isPopular && (
           <span className="relative overflow-hidden text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white py-1 px-2.5 rounded-full shadow-lg">
             Popular
             <div className="absolute inset-0 -translate-x-[100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
           </span>
        )}
        {mod.isNew && (
           <span className="relative overflow-hidden text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-1 px-2.5 rounded-full shadow-lg">
             New
             <div className="absolute inset-0 -translate-x-[100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
           </span>
        )}
        {isPro && (
           <span className="text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg flex items-center gap-1 group-hover:scale-110 transition-transform">
             <Sparkles className="w-3 h-3 flex-shrink-0" /> PRO
           </span>
        )}
      </div>

      <div className="flex items-start gap-3 mb-3 w-full pr-14 relative z-10">
        {/* 3D icon styled container */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-300 transform-gpu group-hover:[transform:perspective(500px)_rotateY(15deg)]"
        >
          <mod.icon className={`w-6 h-6 transition-transform duration-500 group-hover:scale-110 ${theme.textRaw.replace('text-', 'text-!').replace('dark:', '')} text-purple-400`} strokeWidth={2} />
        </div>
        <div className="flex-1 flex flex-col justify-center h-full pt-1">
          <h4 className="text-[15px] md:text-base font-bold tracking-tight leading-tight line-clamp-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
            {mod.title}
          </h4>
          <span className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 block line-clamp-1 py-0.5 px-2 rounded w-fit ${theme.bg} text-white/90`}>
            {mod.category}
          </span>
        </div>
      </div>
      
      <p className="text-xs md:text-sm line-clamp-2 md:line-clamp-2 mb-4 relative z-10 w-full text-slate-400 group-hover:text-slate-300 transition-colors">
        {mod.desc}
      </p>

      {/* Badges row */}
      <div className="mt-auto flex items-center gap-2 relative z-10 w-full mb-1 group-hover:opacity-0 transition-opacity duration-300">
         <div className={`flex items-center text-[10px] font-semibold uppercase px-2 py-1 rounded-md border ${difficultyClass}`}>
            {mod.difficulty || 'Beginner'}
         </div>
         <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/5 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            {mod.estimatedTime || '~2 mins'}
         </div>
         {isUsed && (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md ml-auto">
               <CheckSquare className="w-3 h-3" /> Used
            </div>
         )}
      </div>

      {/* Hover action block */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-[100%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-end justify-center h-[80px]">
        <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-bold flex items-center gap-2 border border-white/20 shadow-lg">
          Open Tool <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </button>
  );
};

export default function Dashboard({
  onSelectModule,
  onOpenSidebar,
  onOpenSettings,
  onOpenAuth,
  previousModule,
}: DashboardProps) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tools");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: string, content: string }[]>([
    { role: 'system', content: 'Hi there! I am your AI assistant. Ask me anything about calculations, materials, or which tool to use.' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [engineersCount, setEngineersCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 2000;
    const target = 10000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setEngineersCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, []);

  let recommendedIds: string[] = [];
  if (settings.role === 'Civil Engineer') {
    recommendedIds = ['master-rcc', 'road-pavement', 'earthworks', 'takeoff'];
  } else if (settings.role === 'Quantity Surveyor') {
    recommendedIds = ['master-quantity', 'house', 'rates', 'takeoff'];
  } else if (settings.role === 'Student') {
    recommendedIds = ['calculators', 'bbs-generator', 'unit-converter', 'ai'];
  } else if (settings.role === 'Contractor') {
    recommendedIds = ['house', 'formwork', 'rates', 'interiors-finishes'];
  }
  const recommendedModules = ALL_MODULES.filter(m => recommendedIds.includes(m.id));

  const handleSelect = (id: string) => {
    if (settings.trackToolUse) settings.trackToolUse(id);
    onSelectModule(id as ModuleId);
  };

  useEffect(() => {
    if (isAiChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiChatOpen]);

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
      
      {/* FULL-VIEWPORT HERO SECTION */}
      <div className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#1a0533] to-[#0a0f1e] pt-12 md:pt-0">
        
        {/* Animated Grid & Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ maskImage: "linear-gradient(to bottom, white 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, white 0%, transparent 100%)" }}>
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="blueprint-grid-hero" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60a5fa" strokeWidth="0.5"/>
                  <path d="M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="#60a5fa" strokeWidth="0.1" opacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blueprint-grid-hero)" />
           </svg>
        </div>
        
        {/* Particle System overlay (pure CSS) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* 3D Isometric Building Scene */}
        <ThreeJSBlueprintHero />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col items-center justify-center text-center mt-8 md:mt-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <h1 className="text-5xl lg:text-[72px] font-sans font-black tracking-tight text-white mb-6 max-w-5xl mx-auto drop-shadow-2xl leading-[1.1]">
            <span className="block mb-2">Build Smarter.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-orange-400 font-extrabold pb-2 inline-block">
              Estimate Faster.
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 drop-shadow-md">
            The world's most advanced civil engineering estimation toolkit. Used by 10,000+ engineers across 15+ countries.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 w-full">
            <button
               onClick={() => {
                 const elm = document.getElementById('search-bar-container');
                 elm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
               }}
               className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all hover:scale-105 active:scale-95 animate-[pulse_3s_infinite] hover:animate-none border border-orange-400 border-opacity-50"
            >
              Start Estimating Free
            </button>
            <button
               className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg shadow-lg border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group active:scale-95"
            >
              Watch Demo <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          {/* Floating Animated Stat Cards */}
          <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4">
             {/* Card 1 */}
             <div className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors group">
                <Box className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-extrabold text-2xl text-white tracking-tight">35+</h4>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Tools</p>
             </div>
             {/* Card 2 */}
             <div className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors group">
                <CheckSquare className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-extrabold text-2xl text-white tracking-tight">100%</h4>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Free</p>
             </div>
             {/* Card 3 */}
             <div className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors group">
                <Map className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-extrabold text-2xl text-white tracking-tight">15+</h4>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Countries</p>
             </div>
             {/* Card 4 */}
             <div className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors group">
                <Sparkles className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-extrabold text-2xl text-white tracking-tight">AI</h4>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Powered</p>
             </div>
          </div>
        </div>
      </div>
      
      {/* TRUST SECTION */}
      <div className="w-full bg-[#050814] py-12 flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
        <h4 className="text-slate-500 font-bold text-sm tracking-wider uppercase mb-8">Trusted by engineers at</h4>
        <div className="w-full relative flex overflow-x-hidden mb-12">
          <div className="animate-[scroll-right_30s_linear_infinite] whitespace-nowrap flex items-center gap-16 px-8">
            {/* Logos Placeholder (Blurred Shapes) */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 opacity-50 contrast-50 grayscale blend-luminosity hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-slate-700 to-slate-500" />
                <div className="w-24 h-4 rounded bg-slate-700" />
              </div>
            ))}
            {/* Dup for infinite scroll */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i + 8} className="flex items-center gap-2 opacity-50 contrast-50 grayscale blend-luminosity hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-slate-700 to-slate-500" />
                <div className="w-24 h-4 rounded bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-4 text-center">
           <div className="flex items-center gap-2 text-slate-300 font-medium">
             <div className="flex gap-0.5 text-yellow-500">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
             </div>
             4.9/5 from 500+ reviews
           </div>
           <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600" />
           <div className="text-slate-300 font-medium">
             10,000+ Engineers
           </div>
           <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600" />
           <div className="text-slate-400 text-sm">
             Last updated: May 2026
           </div>
        </div>
      </div>
      
      {/* Scroll animation keyframes addition */}
      <style>{`
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col relative z-10 pt-16">


        {/* Tool category cards */}
        <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-16" id="search-bar-container">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const count = category === "All Tools" 
                ? ALL_MODULES.length 
                : ALL_MODULES.filter(m => m.category === category).length;
                
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`group relative overflow-hidden flex flex-col p-5 rounded-[12px] text-left transition-all duration-300 ease-out border outline-none 
                    ${activeCategory === category 
                      ? "bg-purple-600 text-white border-purple-500 shadow-[0_8px_30px_rgba(147,51,234,0.3)] scale-[1.02] z-10" 
                      : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400 transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 bg-gradient-to-br hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20"
                    }`}
                >
                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <span className="font-bold text-sm md:text-base leading-tight mb-4 tracking-tight pr-2">{category}</span>
                    <div className={`mt-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full w-max mt-2 transition-colors duration-300 ${
                      activeCategory === category 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-[#6B46C1] text-[#4B5563] group-hover:bg-purple-100 group-hover:text-purple-700 dark:group-hover:bg-purple-900/50 dark:group-hover:text-purple-300'
                    }`}>
                      <Layers className="w-3 h-3" />
                      {count} Tools
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {user && (
          <div className="w-full mb-12 px-4 lg:px-8">
            <PostLoginDashboard onSelectModule={handleSelect} />
          </div>
        )}

    {/* BENTO BOX GRID LAYOUT */}
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 z-20 relative">
      
      {/* RIGHT COLUMN: Main Tool Container */}
      <div className="lg:col-span-12 xl:col-span-12 bg-transparent lg:p-4 flex flex-col min-h-[700px]">
        
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-[28px] md:text-[28px] font-extrabold text-[var(--primary-dark)] dark:text-white tracking-tight flex items-center gap-3">
              {activeCategory}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-[#4B5563] font-medium">Select a calculator to initiate a new estimate.</p>
              {settings.usedTools && (
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800 hidden md:block">
                  You've used {settings.usedTools.length}/{ALL_MODULES.length} tools
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full md:max-w-[500px] xl:max-w-[600px] shrink-0 flex flex-col relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full opacity-25 blur-lg group-focus-within:opacity-60 transition-all duration-700 ease-in-out"></div>
            <div className="relative flex items-center w-full h-[56px] rounded-full bg-white/90 dark:bg-[#1f2229]/95 backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.15)] border border-white dark:border-slate-800/80">
              <div className="ml-5 shrink-0 flex items-center">
                <Search className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools or ask AI..."
                className="w-full h-full bg-transparent border-none outline-none text-[16px] text-slate-700 dark:text-slate-200 px-3 placeholder-slate-400"
              />
              <div className="mr-2 shrink-0 flex items-center gap-1">
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200">
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                )}
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200" title="Voice Search">
                  <Mic className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button 
                  onClick={() => setIsAiChatOpen(true)}
                  className="p-2 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-600 dark:text-purple-400 transition-colors duration-200 flex items-center gap-1.5 px-3"
                  title="Ask AI"
                >
                  <Sparkles className="w-4 h-4 group-hover:animate-pulse" strokeWidth={2} />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">AI</span>
                </button>
              </div>
            </div>
            {/* AI Suggestion Dropdown (shown when focus but empty) */}
            {!searchTerm && (
              <div className="absolute top-[110%] left-0 right-0 p-4 rounded-xl bg-white/95 dark:bg-[#1f2229]/95 backdrop-blur-xl border border-white/20 shadow-2xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-50 transform translate-y-2 group-focus-within:translate-y-0 text-left pointer-events-none group-focus-within:pointer-events-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
                </p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setSearchTerm("Concrete mix for M30"); }} className="text-sm text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg text-left transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                    "Concrete mix for M30 grade without fly ash..."
                  </button>
                  <button onClick={() => { setSearchTerm("Retaining wall"); }} className="text-sm text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg text-left transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                    "Retaining wall stability check rules..."
                  </button>
                  <button onClick={() => { setSearchTerm("Labour required for 100m3 slab"); }} className="text-sm text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-lg text-left transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                    "Labour required for 100m3 slab pouring?"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommended for You */}
        {activeCategory === "All Tools" && !searchTerm && recommendedModules.length > 0 && (
          <div className="mb-14 fade-in">
            <h3 className="text-[18px] font-bold flex flex-col tracking-tight text-[var(--primary-dark)] dark:text-white mb-6">
              Recommended for {settings.role}
              <div className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {recommendedModules.map((m, idx) => (
                <ToolCard key={`rec-${m.id}`} mod={m} onSelect={handleSelect} isUsed={settings.usedTools && settings.usedTools.includes(m.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Tool of the Week */}
        {activeCategory === "All Tools" && !searchTerm && (
          <div className="mb-14 w-full relative rounded-[24px] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.2)]" onClick={() => handleSelect('mix-design')}>
             <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-900 animate-[bg-shift_10s_ease_infinite] z-0" style={{ backgroundSize: '200% 200%' }} />
             
             {/* Particles Overlay */}
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 md:p-12 gap-8 md:gap-12 w-full h-full">
                <div className="flex-1 flex flex-col items-start min-w-[50%]">
                   <div className="flex items-center gap-2 mb-4">
                     <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">Featured Tool of the week</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg leading-[1.1]">
                      Concrete Mix Design <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">Pro IS-10262</span>
                   </h2>
                   <p className="text-white/80 text-lg md:text-xl font-medium mb-8 max-w-lg leading-relaxed">
                      Generate performance-based mix designs instantly. Fully compliant with latest IS standards with professional PDF report generation.
                   </p>
                   <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-indigo-900 rounded-full font-bold text-lg shadow-xl hover:shadow-[0_8px_30px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 group/btn w-full sm:w-auto">
                      Try it Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
                   </button>
                </div>

                <div className="flex-1 w-full relative perspective-[1000px] h-[250px] md:h-[350px] transform-gpu">
                   <div className="absolute inset-0 md:group-hover:rotate-y-[-10deg] md:group-hover:rotate-x-[5deg] md:group-hover:-translate-y-4 transition-all duration-700 ease-out preserve-3d">
                      <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 absolute flex items-center justify-center" style={{ transform: 'translateZ(20px)' }}>
                         {/* Mock screenshot visualization */}
                         <div className="w-full h-full relative">
                            {/* App Header mockup */}
                            <div className="h-10 bg-slate-800 w-full flex items-center px-4 gap-2 border-b border-white/10">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                              <div className="h-4 w-40 bg-slate-700 rounded ml-4"></div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div className="h-4 w-32 bg-slate-700 rounded"></div>
                                <div className="h-12 w-full bg-slate-800 rounded border border-white/5"></div>
                                <div className="h-12 w-full bg-slate-800 rounded border border-white/5"></div>
                                <div className="h-12 w-full bg-slate-800 rounded border border-white/5"></div>
                              </div>
                              <div className="space-y-4">
                                <div className="h-40 w-full bg-gradient-to-br from-indigo-900 to-purple-900 rounded border border-white/10 flex items-end p-2 gap-2">
                                   <div className="w-full h-[60%] bg-white/20 rounded-t"></div>
                                   <div className="w-full h-[80%] bg-indigo-500 rounded-t"></div>
                                   <div className="w-full h-[40%] bg-white/20 rounded-t"></div>
                                </div>
                              </div>
                            </div>
                         </div>
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-2xl border border-black/5 transform translate-z-[60px] flex items-center gap-3">
                         <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                           <CheckSquare className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</p>
                           <p className="text-slate-900 font-black text-lg">IS 10262 Validated</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             <style>{`
                @keyframes bg-shift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
             `}</style>
          </div>
        )}

        {/* Tools Grid */}
        <div className="flex flex-col w-full">
            {groupsToDisplay.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-[18px] font-bold text-[var(--primary-dark)] dark:text-slate-200">No calculators found</h3>
                <p className="text-[#4B5563] mt-2">Try adjusting your search term or category.</p>
              </div>
            ) : (
              groupsToDisplay.map((groupName) => (
                <div key={groupName} className="flex flex-col mb-8 sm:mb-10 last:mb-0">
                   {activeCategory === "All Tools" && (
                     <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 pl-4 sm:pl-6 mb-3 uppercase tracking-wider">
                       {groupName}
                     </h3>
                   )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {groupedModules[groupName].map((mod) => (
                      <ToolCard key={mod.id} mod={mod} onSelect={handleSelect} isUsed={settings.usedTools && settings.usedTools.includes(mod.id)} />
                    ))}
                  </div>
                </div>
              ))
            )}
        </div>
        
        {/* Featured Tool Spotlight */}
        <div className="w-full mt-24 mb-16">
           <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[12px] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex-1 relative z-10 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-[12px] font-medium text-[#6B7280] uppercase mb-6">
                    <Sparkles className="w-4 h-4" /> Featured Tool of the Week
                 </div>
                 <h2 className="text-[28px] md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                    Master RCC Estimator
                 </h2>
                 <p className="text-indigo-200 text-lg md:text-[18px] font-medium mb-8 max-w-xl mx-auto md:mx-0">
                    The unified hub for Slab, Column, Beam, Staircase, and BBS calculations. Save hours of manual work with auto-generated steel weight estimations.
                 </p>
                 <button 
                    onClick={() => handleSelect('master-rcc')}
                    className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] group"
                 >
                    Try it Now <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              
              <div className="relative z-10 w-full max-w-md pointer-events-none hidden md:block">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 bg-emerald-500 rounded-[12px] flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-white font-bold text-lg">RCC Master</span>
                          <span className="text-emerald-300 font-medium text-sm">Concrete Tech</span>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="h-3 bg-white/20 rounded-full w-full"></div>
                       <div className="h-3 bg-white/20 rounded-full w-4/5"></div>
                       <div className="h-3 bg-white/20 rounded-full w-5/6"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Testimonials */}
        <div className="w-full mb-24 text-center">
           <h3 className="text-[18px] md:text-[28px] font-black tracking-tight text-slate-900 dark:text-white mb-12">
              Trusted by 10,000+ Engineers
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Michael R.", role: "Civil Engineer", text: "Reduced my estimation time by 80%. The steel weight auto-deductions are incredibly accurate.", rating: 5 },
                { name: "Sarah K.", role: "Quantity Surveyor", text: "The live rate analysis with instant BOQ generation has completely transformed our bidding process.", rating: 5 },
                { name: "David T.", role: "Contractor", text: "Easy to use on site. I run earthwork volumes directly on my phone and export to PDF instantly.", rating: 5 }
              ].map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] p-8 flex flex-col items-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                   <div className="flex gap-1 mb-4">
                     {[...Array(t.rating)].map((_, i) => <Sparkles key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
                   </div>
                   <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 italic leading-relaxed">
                     "{t.text}"
                   </p>
                   <div className="mt-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold mb-3">
                        {t.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>
                      <span className="text-sm font-medium text-[#4B5563]">{t.role}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Newsletter Signup */}
        <div className="w-full mb-16 max-w-4xl mx-auto">
           <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/10 border border-orange-200 dark:border-orange-900/50 rounded-[12px] p-8 md:p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <h3 className="text-[18px] md:text-[28px] font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                 Get Weekly Construction Cost Updates
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto font-medium text-lg">
                 Join our newsletter to receive the latest material rate variations and estimation tips directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                 <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-6 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] dark:text-white"
                 />
                 <button 
                    type="submit" 
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                 >
                    Subscribe
                 </button>
              </form>
           </div>
        </div>

      </div>
    </div>

    {/* AI Chat Bottom Sheet Modal */}
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${isAiChatOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
        onClick={() => setIsAiChatOpen(false)}
      />

      {/* Bottom Sheet Modal */}
      <div 
        className={`fixed bottom-0 left-0 right-0 h-[65vh] bg-bg-card shadow-[0_-20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.4)] rounded-t-[40px] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isAiChatOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-5 pb-3 shrink-0 cursor-pointer" onClick={() => setIsAiChatOpen(false)}>
          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-[#6B46C1] hover:bg-slate-300 dark:hover:bg-[#6B46C1] transition-colors" />
        </div>

        <div className="px-6 flex items-center justify-between pb-2 border-b border-border-color">
          <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Assistant
          </h3>
          <button onClick={() => setIsAiChatOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#6B46C1] text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {aiMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'system' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`px-5 py-3 rounded-[12px] max-w-[85%] font-medium text-[15px] leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${msg.role === 'user' ? 'bg-[#6B46C1] text-white rounded-tr-sm' : 'bg-slate-50 border border-slate-100 dark:bg-[#6B46C1] dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* Input area */}
        <div className="p-[20px] pt-4 shrink-0 w-full max-w-4xl mx-auto bg-bg-card border-t border-slate-50 dark:border-slate-800/50">
          <div className="relative group">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full opacity-60 group-focus-within:opacity-100 blur-[3px] transition-all duration-300"></div>
            <div className="relative flex items-center bg-bg-card rounded-full px-5 py-2.5 border border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <input 
                type="text" 
                value={aiMessage} 
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiMessage.trim()) {
                    setAiMessages(prev => [...prev, { role: 'user', content: aiMessage.trim() }]);
                    setAiMessage("");
                    setTimeout(() => {
                      setAiMessages(prev => [...prev, { role: 'system', content: 'I can help with that. Could you provide a bit more context about the materials or calculator you need?' }]);
                    }, 1000);
                  }
                }}
                placeholder="Ask your assistant..." 
                className="w-full bg-transparent border-none outline-none text-[16px] text-slate-800 dark:text-slate-100 px-2 py-2 placeholder:text-slate-400"
              />
              <button 
                className="p-2.5 bg-[#6B46C1] hover:bg-[#6B46C1] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shadow-indigo-500/20 text-white rounded-full transition-all hover:scale-105 active:scale-95 ml-2 shrink-0"
                onClick={() => {
                  if (aiMessage.trim()) {
                    setAiMessages(prev => [...prev, { role: 'user', content: aiMessage.trim() }]);
                    setAiMessage("");
                    setTimeout(() => {
                      setAiMessages(prev => [...prev, { role: 'system', content: 'I can help with that. Could you provide a bit more context about the materials or calculator you need?' }]);
                    }, 1000);
                  }
                }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
