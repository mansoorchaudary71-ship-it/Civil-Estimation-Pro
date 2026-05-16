import { useState } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator,
  FileSpreadsheet,
  PencilRuler,
  Sparkles,
  Settings,
  HardHat,
  Truck,
  Route,
  Waves,
  Paintbrush,
  Home,
  TrendingUp,
  Hammer,
  ClipboardList,
  LayoutDashboard,
  Layers,
  Maximize2,
  Grid2X2,
  ArrowUp,
  Triangle,
  Box,
  ChevronDown,
  CheckSquare,
  Map,
  User,
  LogOut,
  ArrowRightLeft,
  Weight,
  Spline,
  Columns,
} from "lucide-react";

export type ModuleId =
  | "home"
  | "takeoff"
  | "calculators"
  | "ai"
  | "earthworks"
  | "gridEarthwork"
  | "trench"
  | "chainage"
  | "road"
  | "rigid-pavement"
  | "sewerage"
  | "finishing"
  | "house"
  | "rates"
  | "formwork"
  | "area-calculator"
  | "volume-estimator"
  | "unit-converter"
  | "metal-weight"
  | "rcc-calculator"
  | "staircase-calculator"
  | "column-estimator"
  | "master-quantity"
  | "gradient-calculator"
  | "bbs-generator"
  | "about"
  | "careers"
  | "contact"
  | "blog"
  | "my-estimates"
  | "pricing"
  | "privacy"
  | "terms"
  | "cookies";

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    house: false,
    road: false,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navItems = [
    { id: "home" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "rates" as const, label: "Market Rates", icon: TrendingUp },
    {
      id: "house" as const,
      label: "House Estimator",
      icon: Home,
      subItems: [
        { label: "Ground Floor", icon: Grid2X2 },
        { label: "First Floor", icon: ArrowUp },
        { label: "Roof", icon: Triangle },
      ],
    },
    { id: "formwork" as const, label: "Formwork & Scaffold", icon: Hammer },
    { id: "earthworks" as const, label: "Earthworks", icon: Truck },
    {
      id: "gridEarthwork" as const,
      label: "Grid Method Earthwork",
      icon: Grid2X2,
    },
    { id: "trench" as const, label: "Trench Excavation", icon: CheckSquare },
    { id: "chainage" as const, label: "Road Earthworks", icon: Map },
    {
      id: "road" as const,
      label: "Road Estimator",
      icon: Route,
      subItems: [
        { label: "Layer Thickness", icon: Layers },
        { label: "Cross Section", icon: Maximize2 },
      ],
    },
    { id: "rigid-pavement" as const, label: "Rigid Pavement", icon: Route },
    { id: "sewerage" as const, label: "Sewerage & Drainage", icon: Waves },
    { id: "finishing" as const, label: "Finishing Works", icon: Paintbrush },
    { id: "takeoff" as const, label: "2D Takeoff", icon: PencilRuler },
    {
      id: "area-calculator" as const,
      label: "Area Calculator",
      icon: Triangle,
    },
    { id: "volume-estimator" as const, label: "Volume Estimator", icon: Box },
    {
      id: "unit-converter" as const,
      label: "Unit Converter",
      icon: ArrowRightLeft,
    },
    { id: "metal-weight" as const, label: "Metal Weight", icon: Weight },
    { id: "rcc-calculator" as const, label: "RCC Structure", icon: Spline },
    { id: "staircase-calculator" as const, label: "Staircase", icon: Layers },
    {
      id: "gradient-calculator" as const,
      label: "Gradient & Slope",
      icon: Maximize2,
    },
    {
      id: "bbs-generator" as const,
      label: "BBS Generator",
      icon: FileSpreadsheet,
    },
    {
      id: "column-estimator" as const,
      label: "Column Estimator",
      icon: Columns,
    },
    {
      id: "master-quantity" as const,
      label: "Master Quantity & Estimation",
      icon: Calculator,
    },
    {
      id: "calculators" as const,
      label: "Material Estimator",
      icon: Calculator,
    },
    { id: "ai" as const, label: "AI Assistant", icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[60] transform transition-all duration-300 ease-in-out flex flex-col w-[280px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-r border-slate-200/50 dark:border-slate-800/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-[100dvh] shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Profile Header section (acts as Profile tab on mobile) */}
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-indigo-100 to-white dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border border-indigo-200 dark:border-slate-600 font-bold overflow-hidden text-indigo-600 dark:text-indigo-400">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.displayName?.[0]?.toUpperCase() || (
                        <User className="w-5 h-5" />
                      )}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 w-full">
                <button
                  onClick={onOpenProfile}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Account
                </button>
                <button
                  onClick={async () => {
                    await logOut();
                    onClose?.();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold text-red-600 dark:text-red-400 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white hover:text-red-700 dark:hover:bg-slate-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[14px] font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[14px] font-bold text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 transition-all font-sans tracking-wide"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto pb-24 md:pb-4 scrollbar-hide">
          <div className="px-4 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const isExpanded = expanded[item.id];

            return (
              <div key={item.id} className="flex flex-col mb-1.5 px-1">
                <button
                  onClick={() => onSelectModule(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-[14px] transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold rounded-full shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] border border-indigo-100 dark:border-indigo-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white font-medium rounded-full",
                  )}
                >
                  <Icon className={cn("w-[18px] h-[18px]")} />
                  {item.label}

                  {item.id === "ai" && (
                    <span className="ml-auto bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-500 text-[10px] px-2 py-0.5 rounded font-bold">
                      Beta
                    </span>
                  )}

                  {item.subItems && (
                    <div
                      className={`ml-auto p-1 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      onClick={(e) => toggleExpand(item.id, e)}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {item.subItems && isExpanded && (
                  <div className="ml-7 border-l border-slate-200 dark:border-slate-800 pl-3 mt-1.5 mb-1 space-y-1.5 relative">
                    <div className="absolute top-0 -left-[1px] w-0.5 h-full bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 transition-all opacity-50" />
                    {item.subItems.map((sub, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <sub.icon className="w-[15px] h-[15px]" />
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Settings / Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
            <Settings className="w-[18px] h-[18px]" />
            Workspace Settings
          </button>
        </div>
      </div>
    </>
  );
}
