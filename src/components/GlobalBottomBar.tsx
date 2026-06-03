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
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: LayoutGrid, label: "Tools", action: onOpenSearch },
    { id: "my-estimates", icon: FolderOpen, label: "Estimates" },
    { id: "profile", icon: User, label: "Account", action: onOpenProfile },
  ];

  return (
    <div
      className="fixed left-4 right-4 z-50 md:hidden font-sans pointer-events-auto rounded-full px-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)] h-[56px] flex items-center justify-around"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
        background: "rgba(13, 17, 23, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => item.action ? item.action() : onNavigate(item.id)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors rounded-full"
          >
            <Icon 
              className={`w-5 h-5 ${isActive ? "text-[#F59E0B]" : "text-slate-400 hover:text-slate-200"}`} 
              strokeWidth={isActive ? 2.5 : 2}
              fill={isActive ? "currentColor" : "none"}
            />
            <span className={`text-[10px] font-medium tracking-tight ${isActive ? "text-[#F59E0B]" : "text-slate-400"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
