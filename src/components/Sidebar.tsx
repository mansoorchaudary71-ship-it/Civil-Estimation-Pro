import { cn } from "../lib/utils";
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
  LayoutDashboard
} from "lucide-react";

import Logo from './Logo';

export type ModuleId = "home" | "takeoff" | "calculators" | "ai" | "earthworks" | "road" | "sewerage" | "finishing" | "house" | "rates" | "formwork";

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeModule, onSelectModule, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: "home" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "rates" as const, label: "Market Rates", icon: TrendingUp },
    { id: "house" as const, label: "House Estimator", icon: Home },
    { id: "formwork" as const, label: "Formwork & Scaffold", icon: Hammer },
    { id: "earthworks" as const, label: "Earthworks", icon: Truck },
    { id: "road" as const, label: "Road Estimator", icon: Route },
    { id: "sewerage" as const, label: "Sewerage & Drainage", icon: Waves },
    { id: "finishing" as const, label: "Finishing Works", icon: Paintbrush },
    { id: "takeoff" as const, label: "2D Takeoff", icon: PencilRuler },
    { id: "calculators" as const, label: "Core Calculators", icon: Calculator },
    { id: "ai" as const, label: "AI Assistant", icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-screen shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* App Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Civil Estimation Pro</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-white text-slate-800 border border-slate-200" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px]")} />
                {item.label}
                {item.id === "ai" && (
                  <span className="ml-auto bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] px-2 py-0.5 rounded">
                    Beta
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings / Footer */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium">
            <Settings className="w-[18px] h-[18px]" />
            Workspace Settings
          </button>
        </div>
      </div>
    </>
  );
}
