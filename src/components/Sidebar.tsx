import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { 
  Search, Settings, X, ChevronDown, User, LogOut, 
  Home, Layers, Calculator, Building2, Zap, Route, 
  FlaskConical, MapPin, Ruler, Boxes, Sun, Truck, Mountain,
  Sparkles,
  LayoutDashboard
} from "lucide-react";

export type ModuleId =
  | "home"
  | "takeoff"
  | "calculators"
  | "ai"
  | "earthworks"
  | "chainage"
  | "road-pavement"
  | "house"
  | "rates"
  | "formwork"
  | "area-calculator"
  | "volume-estimator"
  | "unit-converter"
  | "metal-weight"
  | "slab-estimator"
  | "beam-calculator"
  | "eight-bar-column"
  | "ten-bar-column"
  | "beam-calculator"
  | "staircase-calculator"
  | "column-estimator"
  | "master-rcc"
  | "master-quantity"
  | "gradient-calculator"
  | "mep-calculator"
  | "interiors-finishes"
  | "geotechnical"
  | "bbs-generator"
  | "about"
  | "careers"
  | "contact"
  | "blog"
  | "my-estimates"
  | "pricing"
  | "privacy"
  | "terms"
  | "cookies"
  | "property-area"
  | "master-sieve"
  | "aggregate-blending"
  | "aggregate-tests"
  | "solar-roof";

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

type SubTool = {
  id: string;
  label: string;
};

type PrimaryTool = {
  id: ModuleId;
  label: string;
  icon: any;
  subTools: SubTool[];
};

type MainCategory = {
  id: string;
  label: string;
  icon: any;
  tools: PrimaryTool[];
};

const SIDEBAR_DATA: MainCategory[] = [
  {
    id: "concrete-tech",
    label: "Concrete Tech",
    icon: Building2,
    tools: [
      {
        id: "calculators",
        label: "Construction Material",
        icon: Boxes,
        subTools: [
          { id: "cm-concrete", label: "Concrete Estimator" },
          { id: "cm-brick", label: "Brick Estimator" },
          { id: "cm-steel", label: "Steel Estimator" },
          { id: "cm-block", label: "Block Estimator" },
          { id: "cm-mortar", label: "Mortar Estimator" },
        ]
      },
      {
        id: "master-rcc",
        label: "Master RCC Estimator",
        icon: Layers,
        subTools: [
          { id: "rcc-slab", label: "Slab Calculator" },
          { id: "rcc-column", label: "Column Calculator" },
          { id: "rcc-beam", label: "Beam Calculator" },
          { id: "rcc-staircase", label: "Staircase Calculator" },
          { id: "rcc-bbs", label: "BBS (Bar Bending Schedule)" },
        ]
      },
      {
        id: "formwork",
        label: "Formwork & Scaffold",
        icon: Ruler,
        subTools: [
          { id: "fw-shuttering", label: "Shuttering Materials" },
          { id: "fw-scaffolding", label: "Scaffolding Materials" },
        ]
      },
      {
        id: "aggregate-tests",
        label: "Aggregate Tests",
        icon: FlaskConical,
        subTools: [
          { id: "at-impact", label: "Impact Value" },
          { id: "at-crushing", label: "Crushing Value" },
          { id: "at-abrasion", label: "Abrasion Value" },
          { id: "at-water", label: "Water Absorption" },
        ]
      }
    ]
  },
  {
    id: "quantity-estimator",
    label: "Quantity Estimator",
    icon: Calculator,
    tools: [
      {
        id: "house",
        label: "House Estimator",
        icon: Home,
        subTools: [
          { id: "he-grey", label: "Grey Structure" },
          { id: "he-finishing", label: "Finishing Works" },
        ]
      },
      {
        id: "property-area",
        label: "Property Area Calculator",
        icon: MapPin,
        subTools: [
          { id: "pa-carpet", label: "Carpet Area" },
          { id: "pa-builtup", label: "Built-up Area" },
          { id: "pa-super", label: "Super Built-up Area" },
        ]
      },
      {
        id: "volume-estimator",
        label: "Volume & Tank Capacity",
        icon: Boxes,
        subTools: [
          { id: "vt-underground", label: "Underground Tank" },
          { id: "vt-overhead", label: "Overhead Tank" },
          { id: "vt-standard", label: "Standard Volumes" },
        ]
      }
    ]
  },
  {
    id: "mep",
    label: "MEP",
    icon: Zap,
    tools: [
      {
        id: "mep-calculator",
        label: "Energy & MEP Calculators",
        icon: Zap,
        subTools: [
          { id: "mep-water", label: "Water Heating" },
          { id: "mep-ac", label: "AC Sizing" },
        ]
      },
      {
        id: "solar-roof",
        label: "Solar Roof Calculator",
        icon: Sun,
        subTools: [
          { id: "sr-system", label: "System Size" },
          { id: "sr-panel", label: "Panel Count" },
          { id: "sr-roi", label: "ROI Calculator" },
        ]
      }
    ]
  },
  {
    id: "road-construction",
    label: "Road Construction",
    icon: Route,
    tools: [
      {
        id: "earthworks",
        label: "Earthworks",
        icon: Mountain,
        subTools: [
          { id: "ew-site", label: "Site Preparation" },
          { id: "ew-excavation", label: "Excavation Volume" },
          { id: "ew-hauling", label: "Hauling Volume" },
        ]
      },
      {
        id: "road-pavement",
        label: "Road & Pavement Estimator",
        icon: Truck,
        subTools: [
          { id: "rp-flexible", label: "Flexible Pavement" },
          { id: "rp-rigid", label: "Rigid Pavement" },
          { id: "rp-sewerage", label: "Sewerage" },
        ]
      }
    ]
  },
  {
    id: "soil-tests",
    label: "Soil Tests",
    icon: FlaskConical,
    tools: [
      {
        id: "geotechnical",
        label: "Geotechnical & Soil Tests",
        icon: Layers,
        subTools: [
          { id: "gt-wc", label: "Water Content" },
          { id: "gt-sg", label: "Specific Gravity" },
          { id: "gt-ll", label: "Liquid Limit (LL)" },
          { id: "gt-cbr", label: "CBR" },
        ]
      },
      {
        id: "aggregate-blending",
        label: "Aggregate Blending",
        icon: Boxes,
        subTools: [
          { id: "ab-2", label: "2-Stockpile Blend" },
          { id: "ab-3", label: "3-Stockpile Blend" },
          { id: "ab-4", label: "4-Stockpile Blend" },
        ]
      }
    ]
  }
];

export default function Sidebar({
  activeModule,
  onSelectModule,
  isOpen,
  onClose,
  onOpenAuth,
  onOpenProfile,
}: SidebarProps) {
  const { user, logOut } = useAuth();
  const isAuthenticated = !!user;
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedTool, setExpandedTool] = useState<ModuleId | null>(null);
  const [activeSubTool, setActiveSubTool] = useState<string | null>(null);

  useEffect(() => {
    let foundTool = null;
    let foundCategory = null;
    for (const category of SIDEBAR_DATA) {
      const tool = category.tools.find(t => t.id === activeModule);
      if (tool) {
        foundTool = tool;
        foundCategory = category;
        break;
      }
    }
    
    if (foundTool && foundCategory) {
      setExpandedCategory(foundCategory.id);
      setExpandedTool(foundTool.id);
      
      setActiveSubTool(prev => {
        if (foundTool.subTools.some(st => st.id === prev)) {
           return prev;
        }
        return foundTool.subTools[0]?.id || null;
      });
    }
  }, [activeModule]);

  const handleSelectStandalone = (id: ModuleId) => {
    onSelectModule(id);
    setExpandedCategory(null);
    setExpandedTool(null);
    setActiveSubTool(null);
    if (window.innerWidth < 1024) onClose?.();
  };

  const handleSelectSubTool = (toolId: ModuleId, subToolId: string) => {
    setActiveSubTool(subToolId);
    onSelectModule(toolId);
    if (window.innerWidth < 1024) onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col w-[85vw] max-w-[320px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 h-[100dvh] shadow-2xl lg:relative lg:translate-x-0 lg:w-full lg:max-w-[300px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0">
          <div className="text-[20px] font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Esti<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 lg:hidden">
            <button onClick={onClose} aria-label="Close menu" className="hover:text-slate-500 transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-2 rounded-full shadow-sm">
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <nav className="flex-1 overflow-y-auto w-full px-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Standalone Items */}
          <div className="flex flex-col gap-1 mb-6">
            <button
              onClick={() => handleSelectStandalone("home")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all duration-300",
                activeModule === "home"
                  ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                  : "hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold"
              )}
            >
              <LayoutDashboard className={cn("w-5 h-5", activeModule === "home" ? "text-white" : "text-indigo-500")} />
              <span className="flex-1 text-left">Dashboard</span>
            </button>
            <button
              onClick={() => handleSelectStandalone("takeoff")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all duration-300",
                activeModule === "takeoff"
                  ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                  : "hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold"
              )}
            >
              <Layers className={cn("w-5 h-5", activeModule === "takeoff" ? "text-white" : "text-teal-500")} />
              <span className="flex-1 text-left">2D Takeoff</span>
            </button>
            <button
              onClick={() => handleSelectStandalone("ai")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all duration-300",
                activeModule === "ai"
                  ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                  : "hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold"
              )}
            >
              <Sparkles className={cn("w-5 h-5", activeModule === "ai" ? "text-white" : "text-amber-500")} />
              <span className="flex-1 text-left">AI Civil Assistant</span>
            </button>
          </div>

          <div className="w-full h-px bg-slate-200/50 dark:bg-slate-700/50 mb-6" />

          {/* Accordion Categories */}
          <div className="flex flex-col gap-2 pb-6">
            <h3 className="px-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Estimators & Tools</h3>
            
            {SIDEBAR_DATA.map(category => {
              const isCategoryExpanded = expandedCategory === category.id;
              
              return (
                <div key={category.id} className="flex flex-col gap-1">
                  {/* Category Header */}
                  <button 
                    onClick={() => setExpandedCategory(isCategoryExpanded ? null : category.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all duration-300",
                      isCategoryExpanded 
                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-slate-100 dark:border-slate-700/50"
                        : "hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold"
                    )}
                  >
                    <category.icon className={cn("w-5 h-5", isCategoryExpanded ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400")} />
                    <span className="flex-1 text-left">{category.label}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300 opacity-70", isCategoryExpanded && "rotate-180")} />
                  </button>

                  {/* Primary Tools */}
                  {isCategoryExpanded && (
                    <div className="flex flex-col gap-1 mt-1 mb-1 animate-in slide-in-from-top-2 fade-in duration-200 pl-2 pr-1">
                      {category.tools.map(tool => {
                        const isToolExpanded = expandedTool === tool.id;
                        return (
                          <div key={tool.id} className="flex flex-col gap-1">
                            <button 
                              onClick={() => {
                                setExpandedTool(isToolExpanded ? null : tool.id);
                              }}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all",
                                isToolExpanded
                                  ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-bold"
                                  : "hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-medium"
                              )}
                            >
                              <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700", isToolExpanded && "border-indigo-200 dark:border-indigo-800")}>
                                <tool.icon className={cn("w-3.5 h-3.5", isToolExpanded ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500")} />
                              </div>
                              <span className="flex-1 text-left text-[14px]">{tool.label}</span>
                              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300 opacity-50", isToolExpanded && "rotate-180")} />
                            </button>

                            {/* Sub-tools list */}
                            <div 
                              className={cn(
                                "flex flex-col gap-0.5 pl-6 ml-6 border-l-2 border-indigo-100/50 dark:border-indigo-900/30 overflow-hidden transition-all duration-300",
                                isToolExpanded ? "max-h-[500px] mt-1 mb-2 opacity-100" : "max-h-0 opacity-0"
                              )}
                            >
                              {tool.subTools.map(subTool => {
                                const isSubActive = activeSubTool === subTool.id;
                                return (
                                  <button
                                    key={subTool.id}
                                    onClick={() => handleSelectSubTool(tool.id, subTool.id)}
                                    className={cn(
                                      "text-left px-4 py-2 text-[13px] rounded-r-xl transition-all relative group",
                                      isSubActive 
                                        ? "text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50/50 dark:bg-indigo-900/20" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 font-medium"
                                    )}
                                  >
                                    {isSubActive && (
                                      <span className="absolute left-[-2px] inset-y-0 w-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-r-full" />
                                    )}
                                    <span className="relative z-10 transition-transform duration-200 block group-hover:translate-x-1">
                                      {subTool.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1 px-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200 shadow-sm">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 truncate">{user?.displayName || "User"}</p>
                  <p className="text-[12px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onClose?.(); onOpenProfile?.(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Account
                </button>
                <button
                  onClick={async () => { await logOut(); onClose?.(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onClose?.(); onOpenAuth?.(); }}
                className="w-full py-3 rounded-xl text-[14px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => { onClose?.(); onOpenAuth?.(); }}
                className="w-full py-3 rounded-xl text-[14px] font-bold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}

