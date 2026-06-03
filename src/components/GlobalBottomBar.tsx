import React from "react";
import { Home, FolderOpen, User, LayoutGrid } from "lucide-react";

export default function GlobalBottomBar({
  activeModule,
  onNavigate,
  onOpenProfile,
  onOpenSearch
}: {
  activeModule: string;
  onNavigate: (module: string) => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
}) {
  const navItems = [
    { id: "home", icon: Home, label: "Home", color: "text-blue-600" },
    { id: "search", icon: LayoutGrid, label: "Tools", action: onOpenSearch, color: "text-purple-600" },
    { id: "my-estimates", icon: FolderOpen, label: "Estimates", color: "text-emerald-600" },
    { id: "profile", icon: User, label: "Profile", action: onOpenProfile, color: "text-rose-600" },
  ];

  return (
    <div
      className="fixed z-[9998] md:hidden flex justify-around items-center h-[54px] left-6 right-6 rounded-[32px] overflow-hidden bg-white/70 dark:bg-[#121212]/70 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => item.action ? item.action() : onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 p-1 transition-all ${
              isActive ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Icon 
              className={`w-[20px] h-[20px] ${item.color} ${isActive ? "opacity-100" : "opacity-80"}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-[9px] font-semibold tracking-tight ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
