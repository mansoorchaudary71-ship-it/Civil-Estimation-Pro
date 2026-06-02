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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden w-full font-sans pointer-events-auto"
      style={{
        background: "rgba(13, 17, 23, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.action ? item.action() : onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors"
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? "text-[#F59E0B]" : "text-slate-400 hover:text-slate-200"}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#F59E0B]" : "text-slate-400"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-[#F59E0B]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
