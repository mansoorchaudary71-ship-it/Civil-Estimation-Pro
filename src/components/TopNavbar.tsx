import React, { useState, useEffect, useRef } from "react";
import { Menu, Search } from "lucide-react";
import { cn } from "../lib/utils";

export default function TopNavbar({
  onNavigate,
  onOpenRecent
}: {
  onNavigate?: (id: string) => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenRecent?: () => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 left-0 right-0 z-[120] bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 h-[64px] flex items-center justify-between">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate && onNavigate("home")}
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[14px] flex items-center justify-center font-bold text-[14px] sm:text-[15px] text-indigo-600 bg-indigo-50 border border-indigo-100 shadow-[0_2px_10px_rgba(79,70,229,0.06)] transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_4px_16px_rgba(79,70,229,0.12)]">
            CE
          </div>
          <span className="font-extrabold text-[17px] sm:text-[19px] text-slate-800 tracking-tight truncate">
            Civil Estimation <span className="text-indigo-500 font-bold">Pro</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
