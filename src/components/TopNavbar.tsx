import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function TopNavbar({
  onNavigate,
  onOpenSidebar
}: {
  onOpenSidebar?: () => void;
  onNavigate?: (id: string) => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

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

  // Clean up on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const links = [
    { name: "Home", id: "home" },
    { name: "Tools", id: "tools" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Pricing", id: "pricing" },
    { name: "About", id: "about" },
  ];

  const handleNavigate = (link: {name: string, id: string}) => {
    setActiveTab(link.name);
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate("home"); 
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[120] bg-white/90 backdrop-blur-[12px] border-b border-slate-200 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { setActiveTab("Home"); onNavigate && onNavigate("home"); }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0072de] to-indigo-600 text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-lg shadow-[#0072de]/20">
              CE
            </div>
            <span className="font-bold text-[16px] text-slate-900 tracking-tight hidden sm:block">
              Civil Estimation <span className="text-[#0072de]">Pro</span>
            </span>
            <span className="font-bold text-[15px] text-slate-900 tracking-tight sm:hidden">
              Civil Pro
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button 
                key={link.name}
                className={cn(
                  "relative text-[14px] font-medium transition-colors hover:text-[#0072de]",
                  activeTab === link.name ? "text-[#0072de]" : "text-slate-600"
                )}
                onClick={() => handleNavigate(link)}
              >
                {link.name}
                {activeTab === link.name && (
                  <motion.div 
                    layoutId="activeTabNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0072de] rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
             <button 
               className="text-[13px] font-bold tracking-tight text-white bg-[#0072de] hover:bg-[#005bb5] px-4 py-1.5 rounded-full transition-all shadow-md active:scale-95 flex items-center gap-1.5"
               onClick={() => onNavigate && onNavigate("home")}
             >
                Start Free
             </button>

             <button 
               className="md:hidden p-1.5 text-slate-600 hover:text-[#0072de] transition-colors"
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
                      activeTab === link.name ? "text-[#0072de]" : "text-slate-800 group-hover:text-[#0072de]"
                    )}>
                      {link.name}
                    </span>
                    {activeTab === link.name && (
                        <div className="w-2 h-2 rounded-full bg-[#0072de]" />
                    )}
                  </div>
                  <ArrowRight className={cn(
                    "w-6 h-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
                    activeTab === link.name ? "text-[#0072de]" : "text-slate-400"
                  )} />
                </motion.button>
              ))}
            </nav>
            
            <div className="mt-auto pb-4">
               <button 
                 className="w-full text-base font-bold text-white bg-[#0072de] hover:bg-[#005bb5] py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                 onClick={() => { setIsMobileMenuOpen(false); onNavigate && onNavigate("home"); }}
               >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
