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
      <header className="sticky top-0 left-0 right-0 z-[120] bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 transition-colors">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 h-[60px] flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group h-12"
            onClick={() => { setActiveTab("Calculators"); onNavigate && onNavigate("home"); }}
          >
            <div className="w-8 h-8 rounded-[10px] bg-[#0f172a] dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[13px] tracking-tighter shadow-sm group-hover:bg-[#FF5F15] dark:group-hover:bg-[#FF5F15] dark:group-hover:text-white transition-colors">
              CE
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight hidden sm:block">
              Civil Estimation <span className="text-[#FF5F15]">Pro</span>
            </span>
            <span className="font-bold text-[19px] text-slate-900 dark:text-white tracking-tight sm:hidden">
              Civil Pro
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 h-full">
            {links.map((link) => (
              <button 
                key={link.name}
                className={cn(
                  "relative h-12 px-2 text-[15px] font-semibold transition-colors hover:text-[#FF5F15] dark:hover:text-[#FF5F15]",
                  activeTab === link.name ? "text-[#FF5F15]" : "text-gray-600"
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

          <div className="flex items-center gap-2">
             <button
               className="hidden md:flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 h-12 px-4 rounded-full transition-colors border border-black/5 dark:border-white/5 text-[15px] font-semibold"
               onClick={onOpenRecent}
               title="Recent Tools"
             >
               <History className="w-[18px] h-[18px]" />
               <span>Recent</span>
             </button>
             <div className="relative" ref={searchRef}>
               <button 
                 onClick={() => setShowRecentSearches(!showRecentSearches)}
                 className="flex items-center justify-center w-12 h-12 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors border border-black/5 dark:border-white/5"
                 aria-label="Search"
               >
                 <Search className="w-5 h-5" />
               </button>
               
               <AnimatePresence>
                 {showRecentSearches && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.96 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.96 }}
                     transition={{ duration: 0.2 }}
                     className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] border border-black/5 dark:border-white/10 overflow-hidden z-50"
                   >
                     <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50">
                       <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                         <History className="w-4 h-4" /> Recently Accessed
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
                                 className="w-full text-left flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group min-h-[48px]"
                               >
                                 <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-[#FF5F15]/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#FF5F15] transition-colors border border-black/5 dark:border-white/5 group-hover:border-[#FF5F15]/20 shrink-0">
                                   {mod.icon ? <mod.icon className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
                                 </div>
                                 <div className="flex-1 overflow-hidden">
                                   <div className="text-[15px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#FF5F15] transition-colors">{mod.title}</div>
                                   <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{mod.category}</div>
                                 </div>
                               </button>
                             );
                           })}
                         </div>
                       ) : (
                         <div className="text-[15px] text-slate-500 dark:text-slate-400 text-center py-8 font-medium">No recent tools accesses</div>
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <button 
               className="hidden sm:flex items-center justify-center text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-black/10 dark:border-white/10 h-12 px-6 rounded-full transition-all duration-300 shadow-sm active:scale-95 text-[15px] font-bold"
               onClick={() => {}}
             >
                Login
             </button>

             <button 
               className="md:hidden flex items-center justify-center w-12 h-12 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
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
            className="fixed inset-0 z-[115] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl md:hidden pt-[80px] px-6 pb-8 flex flex-col border-b border-black/5 dark:border-white/10"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {links.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-left text-[26px] font-bold tracking-tight group min-h-[48px]"
                  onClick={() => handleNavigate(link)}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "transition-colors",
                      activeTab === link.name ? "text-[#FF5F15]" : "text-slate-900 dark:text-white group-hover:text-[#FF5F15]"
                    )}>
                      {link.name}
                    </span>
                    {activeTab === link.name && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F15]" />
                    )}
                  </div>
                  <ArrowRight className={cn(
                    "w-6 h-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
                    activeTab === link.name ? "text-[#FF5F15]" : "text-slate-600 dark:text-slate-400"
                  )} />
                </motion.button>
              ))}
            </nav>
            
            <div className="mt-auto pb-4 flex flex-col gap-3">
               <button 
                 className="w-full h-14 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 text-[17px] font-bold"
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
