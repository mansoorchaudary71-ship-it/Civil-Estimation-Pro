import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, Search, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ALL_MODULES } from "./Dashboard";

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
  const [activeTab, setActiveTab] = useState("Home");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentCalculators, setRecentCalculators] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecent = () => {
      try {
        const history = JSON.parse(localStorage.getItem("recent_calculators") || "[]");
        setRecentCalculators(history);
      } catch (e) {
        setRecentCalculators([]);
      }
    };
    fetchRecent();
    window.addEventListener("recent_calculators_updated", fetchRecent);
    return () => window.removeEventListener("recent_calculators_updated", fetchRecent);
  }, []);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecentSearches(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const links = [
    { name: "Calculators", id: "home" },
    { name: "AI Estimator", id: "ai" },
    { name: "Pricing", id: "pricing" },
  ];

  const handleNavigate = (link: {name: string, id: string}) => {
    setActiveTab(link.name);
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(link.id === "ai" ? "ai" : "home"); 
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-[120] bg-white/90 backdrop-blur-md border-b border-slate-200 transition-colors shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { setActiveTab("Calculators"); onNavigate && onNavigate("home"); }}
          >
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm group-hover:bg-[#112240] transition-colors">
              CE
            </div>
            <span className="font-bold text-[17px] text-slate-900 tracking-tight hidden sm:block">
              Civil Estimation <span className="text-[#FF5F15]">Pro</span>
            </span>
            <span className="font-bold text-[17px] text-slate-900 tracking-tight sm:hidden">
              Civil Pro
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button 
                key={link.name}
                className={cn(
                  "relative text-[14px] font-semibold transition-colors hover:text-[#FF5F15]",
                  activeTab === link.name ? "text-[#FF5F15]" : "text-slate-600"
                )}
                onClick={() => handleNavigate(link)}
              >
                {link.name}
                {activeTab === link.name && (
                  <motion.div 
                    layoutId="activeTabNav"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#FF5F15] rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
             <button
               className="hidden md:flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors border border-slate-200/60"
               onClick={onOpenRecent}
               title="Recent Tools"
             >
               <History className="w-3.5 h-3.5" />
               <span className="text-xs font-semibold">Recent</span>
             </button>
             <div className="relative" ref={searchRef}>
               <button 
                 onClick={() => setShowRecentSearches(!showRecentSearches)}
                 className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 px-2.5 py-2 rounded-full transition-colors border border-slate-200/60"
               >
                 <Search className="w-4 h-4" />
               </button>
               
               <AnimatePresence>
                 {showRecentSearches && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.96 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.96 }}
                     transition={{ duration: 0.2 }}
                     className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)] border border-slate-200 overflow-hidden z-50"
                   >
                     <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                       <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                         <History className="w-3.5 h-3.5" /> Recently Accessed
                       </h4>
                     </div>
                     <div className="p-2">
                       {recentCalculators.length > 0 ? (
                         <div className="space-y-1 max-h-[300px] overflow-y-auto">
                           {recentCalculators.map((id, index) => {
                             const mod = ALL_MODULES.find(m => m.id === id);
                             if (!mod) return null;
                             return (
                               <button 
                                 key={`${id}-${index}`}
                                 onClick={() => {
                                   if (onNavigate) {
                                     onNavigate(id);
                                     setShowRecentSearches(false);
                                   }
                                 }}
                                 className="w-full text-left flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group"
                               >
                                 <div className="w-8 h-8 rounded-lg bg-[#FFFFFF]/5 group-hover:bg-[#FF5F15]/10 flex items-center justify-center text-[#FFFFFF] group-hover:text-[#FF5F15] transition-colors border border-slate-100 group-hover:border-[#FF5F15]/20">
                                   {mod.icon ? <mod.icon className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                                 </div>
                                 <div className="flex-1 overflow-hidden">
                                   <div className="text-[14px] font-bold text-slate-800 truncate group-hover:text-[#FF5F15] transition-colors">{mod.title}</div>
                                   <div className="text-[11px] text-slate-500 font-medium truncate">{mod.category}</div>
                                 </div>
                               </button>
                             );
                           })}
                         </div>
                       ) : (
                         <div className="text-[13px] text-slate-600 text-center py-6 font-medium">No recent tools accesses</div>
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <button 
               className="text-[13px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm active:scale-95 hidden sm:flex items-center justify-center"
               onClick={() => {}}
             >
                Login
             </button>

             <button 
               className="md:hidden p-2 text-slate-600 hover:text-[#FFFFFF] hover:bg-slate-100 rounded-full transition-colors"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               aria-label="Toggle mobile menu"
             >
               {isMobileMenuOpen ? (
                 <X className="w-6 h-6" />
               ) : (
                 <Menu className="w-6 h-6" />
               )}
             </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[115] bg-white/95 backdrop-blur-xl md:hidden pt-20 px-6 pb-6 flex flex-col border-b border-slate-200"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {links.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-left text-2xl font-bold tracking-tight group"
                  onClick={() => handleNavigate(link)}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "transition-colors",
                      activeTab === link.name ? "text-[#FF5F15]" : "text-slate-900 group-hover:text-[#FF5F15]"
                    )}>
                      {link.name}
                    </span>
                    {activeTab === link.name && (
                        <div className="w-2 h-2 rounded-full bg-[#FF5F15]" />
                    )}
                  </div>
                  <ArrowRight className={cn(
                    "w-6 h-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
                    activeTab === link.name ? "text-[#FF5F15]" : "text-slate-600"
                  )} />
                </motion.button>
              ))}
            </nav>
            
            <div className="mt-auto pb-4 flex flex-col gap-3">
               <button 
                 className="w-full text-base font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 py-4 rounded-full transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                 onClick={() => { setIsMobileMenuOpen(false); }}
               >
                  Login
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
