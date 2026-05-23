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
  const { user, logOut, signInWithGoogle } = useAuth();
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
        <div className="flex items-center justify-between px-6 py-5 shrink-0 lg:hidden">
          <div className="text-[20px] font-black tracking-tighter text-text-primary uppercase">
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
          
          {/* Top Search bar as in 2nd image */}
          <div className="flex items-center gap-3 w-full mb-8 mt-2 px-2">
            <button className="flex-1 flex items-center justify-between h-[46px] px-5 rounded-[24px] border border-[#ff9f43] dark:border-[#ff7f50] text-[#ff9f43] dark:text-[#ff7f50] bg-transparent hover:bg-[#ff9f43]/5 dark:hover:bg-[#ff7f50]/10 transition-colors">
              <span className="text-[14px] font-medium opacity-80">Search tools.</span>
            </button>
            <button className="w-[46px] h-[46px] shrink-0 rounded-full border border-[#ff9f43] dark:border-[#ff7f50] text-[#ff9f43] dark:text-[#ff7f50] flex items-center justify-center hover:bg-[#ff9f43]/5 dark:hover:bg-[#ff7f50]/10 transition-colors">
              <Search className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Standalone Items */}
          <div className="flex flex-col mb-6 px-1">
            <button
              onClick={() => handleSelectStandalone("home")}
              className={cn(
                "flex items-center gap-4 px-3 py-3 w-full rounded-[20px] transition-all duration-300",
                activeModule === "home"
                  ? "bg-bg-primary/60"
                  : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm bg-[#54a0ff]")}>
                <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className={cn(
                "flex-1 text-left text-[15px] font-medium tracking-tight",
                activeModule === "home" ? "text-text-primary font-semibold" : "text-slate-700 dark:text-slate-300"
              )}>Dashboard</span>
            </button>
            <button
              onClick={() => handleSelectStandalone("takeoff")}
              className={cn(
                "flex items-center gap-4 px-3 py-3 w-full rounded-[20px] transition-all duration-300",
                activeModule === "takeoff"
                  ? "bg-bg-primary/60"
                  : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm bg-[#1dd1a1]")}>
                <Layers className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className={cn(
                "flex-1 text-left text-[15px] font-medium tracking-tight",
                activeModule === "takeoff" ? "text-text-primary font-semibold" : "text-slate-700 dark:text-slate-300"
              )}>2D Takeoff</span>
            </button>
            <button
              onClick={() => handleSelectStandalone("ai")}
              className={cn(
                "flex items-center gap-4 px-3 py-3 w-full rounded-[20px] transition-all duration-300",
                activeModule === "ai"
                  ? "bg-bg-primary/60"
                  : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm bg-[#8b6cff]")}>
                 <Sparkles className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className={cn(
                "flex-1 text-left text-[15px] font-medium tracking-tight",
                activeModule === "ai" ? "text-text-primary font-semibold" : "text-slate-700 dark:text-slate-300"
              )}>AI Civil Assistant</span>
            </button>
          </div>

          <div className="w-full h-px bg-slate-200/50 dark:bg-slate-700/50 mb-6" />

          <div className="flex flex-col gap-2 pb-6">
            <h3 className="px-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Core Estimators</h3>
            
            {SIDEBAR_DATA.map((category, idx) => {
              const isCategoryExpanded = expandedCategory === category.id;
              
              return (
                <div key={category.id} className="flex flex-col mb-1">
                  {/* Category Header */}
                  <button 
                    onClick={() => setExpandedCategory(isCategoryExpanded ? null : category.id)}
                    className="flex justify-between items-center px-4 py-3 w-full group"
                  >
                    <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                      {category.label}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isCategoryExpanded && "rotate-180")} />
                  </button>

                  {/* Primary Tools */}
                  {isCategoryExpanded && (
                    <div className="flex flex-col gap-1 mt-1 mb-3 animate-in slide-in-from-top-2 fade-in duration-200 px-2">
                      {category.tools.map((tool, tIdx) => {
                        const isToolExpanded = expandedTool === tool.id;
                        const colors = ['bg-[#8b6cff]', 'bg-[#ff6b6b]', 'bg-[#54a0ff]', 'bg-[#1dd1a1]', 'bg-[#ff9f43]', 'bg-[#c6e33e]'];
                        const iconBg = colors[(idx + tIdx) % colors.length];

                        return (
                          <div key={tool.id} className="flex flex-col">
                            <button 
                              onClick={() => {
                                setExpandedTool(isToolExpanded ? null : tool.id);
                              }}
                              className={cn(
                                "flex items-center gap-4 px-3 py-3 w-full rounded-[20px] transition-all",
                                isToolExpanded || activeModule === tool.id
                                  ? "bg-bg-primary/60"
                                  : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                              )}
                            >
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm", iconBg)}>
                                <tool.icon className="w-5 h-5" strokeWidth={2} />
                              </div>
                              <span className={cn(
                                "flex-1 text-left text-[15px] font-medium tracking-tight",
                                isToolExpanded || activeModule === tool.id ? "text-text-primary font-semibold" : "text-slate-700 dark:text-slate-300"
                              )}>
                                {tool.label}
                              </span>
                              {tool.subTools.length > 0 && (
                                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300 opacity-50 text-slate-400", isToolExpanded && "rotate-180")} />
                              )}
                            </button>

                            {/* Sub-tools list */}
                            {tool.subTools.length > 0 && (
                              <div 
                                className={cn(
                                  "flex flex-col ml-[28px] pl-6 border-l-2 border-border-color overflow-hidden transition-all duration-300",
                                  isToolExpanded ? "max-h-[500px] mt-2 mb-2 opacity-100 py-1" : "max-h-0 opacity-0"
                                )}
                              >
                                {tool.subTools.map(subTool => {
                                  const isSubActive = activeSubTool === subTool.id;
                                  return (
                                    <button
                                      key={subTool.id}
                                      onClick={() => handleSelectSubTool(tool.id, subTool.id)}
                                      className={cn(
                                        "text-left py-2.5 text-[14px] transition-all relative group",
                                        isSubActive 
                                          ? "text-text-primary font-medium" 
                                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                      )}
                                    >
                                      {isSubActive && (
                                        <span className="absolute left-[-26px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-200" />
                                      )}
                                      <span className="relative z-10 transition-transform duration-200 block group-hover:translate-x-1">
                                        {subTool.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
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
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-300 bg-bg-card border border-border-color shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Account
                </button>
                <button
                  onClick={async () => { await logOut(); onClose?.(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-600 dark:text-red-400 bg-bg-card border border-border-color shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onClose?.(); signInWithGoogle?.(); }}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[14px] font-bold text-slate-700 dark:text-slate-200 bg-bg-card border border-border-color shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
                Sign In with Google
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}

