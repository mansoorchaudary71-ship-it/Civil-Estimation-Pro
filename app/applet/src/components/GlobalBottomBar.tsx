import React, { useState } from "react";
import { Home, Search, FolderOpen, User, Sparkles, LayoutGrid } from "lucide-react";

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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none flex justify-center">
      <div className="mx-auto w-full max-w-md px-4 pb-6 pt-4 pointer-events-auto">
        <div className="flex items-center justify-between rounded-[32px] bg-white/70 dark:bg-[#1a1b1e]/70 backdrop-blur-[24px] px-8 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/5">
          <button 
            onClick={() => onNavigate("home")}
            className={`flex flex-col items-center justify-center transition-colors ${activeModule === "home" ? "text-[#0072de]" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <Home className="w-7 h-7" />
          </button>
          
          <button 
            onClick={() => onOpenSearch()}
            className="flex flex-col items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LayoutGrid className="w-7 h-7" />
          </button>

          <button 
            onClick={() => onNavigate("my-estimates")}
            className={`flex flex-col items-center justify-center transition-colors ${activeModule === "my-estimates" ? "text-[#0072de]" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <FolderOpen className="w-7 h-7" />
          </button>

          <button 
            onClick={onOpenProfile}
            className="flex flex-col items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <User className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
