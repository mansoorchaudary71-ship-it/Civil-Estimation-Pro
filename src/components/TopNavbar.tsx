import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronDown,
  Calculator,
  Building,
  Box,
  Truck,
  Building2,
  Cpu,
  Search,
  ArrowRight,
  Bell,
  Star,
  Sparkles,
} from "lucide-react";

import { ALL_MODULES } from "./Dashboard";
import { getCategoryThemeNew } from "./ToolCard";

export default function TopNavbar({
  onNavigate,
  onOpenSidebar,
  onOpenAuth,
  onOpenProfile,
}: {
  onNavigate?: (id: string) => void;
  onOpenSidebar?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY =
        document.querySelector(".overflow-y-auto")?.scrollTop || window.scrollY;
      setScrolled(scrollY > 60);
    };

    const container = document.querySelector(".overflow-y-auto");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const megaMenuColumns = [
    { title: "Quantity Estimator", filter: ["Quantity Estimator"] },
    { title: "Concrete Tech", filter: ["Concrete Tech"] },
    { title: "Structural Design", filter: ["Structural Design"] },
    { title: "Road & Soil", filter: ["Road Construction", "Soil Tests"] },
  ];

  const featuredTool = ALL_MODULES.find((m) => m.id === "ai") || ALL_MODULES[0];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 bg-white border-b border-slate-200 ${scrolled ? "py-3 shadow-sm" : "py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo Left */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate && onNavigate("home")}
          >
            <div
              className={`w-10 h-10 rounded-[24px] bg-gradient-to-br from-[#F59E0B] to-amber-600 flex items-center justify-center text-slate-900 shadow-lg font-bold text-xl tracking-tighter transition-all group-hover:scale-105 ${scrolled ? "shadow-amber-500/20" : ""}`}
              
            >
              C
            </div>
            <span
              className={`font-bold text-lg hidden sm:block ${
                scrolled ? "text-slate-900" : "text-slate-900"
              }`}
              
            >
              Civil Estimation Pro
            </span>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Tools Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                id="app-sidebar-trigger"
                className={`flex items-center gap-1.5 font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 ${
                  scrolled
                    ? "text-slate-700 hover:text-slate-900"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                aria-haspopup="menu"
                aria-expanded={toolsDropdownOpen}
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              >
                Tools
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    toolsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {toolsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[900px] bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100/50 p-6 flex flex-col gap-6"
                  >
                    {/* Search Bar inside Mega Menu */}
                    <div className="relative w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search 50+ tools, calculators, templates..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-[24px] py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      />
                    </div>

                    <div className="flex gap-8">
                      {/* 4 Category Columns */}
                      <div className="flex-1 grid grid-cols-4 gap-6">
                        {megaMenuColumns.map((col, idx) => {
                          const tools = ALL_MODULES.filter((m) =>
                            col.filter.includes(m.category),
                          ).slice(0, 3);
                          return (
                            <div key={idx} className="flex flex-col gap-3">
                              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">
                                {col.title}
                              </h3>
                              {tools.map((mod) => {
                                const theme = getCategoryThemeNew(mod.category);
                                return (
                                  <button
                                    key={mod.id}
                                    className={`flex items-start gap-3 p-3 -mx-3 rounded-[24px] hover:bg-slate-50 transition-colors cursor-pointer text-left group/item`}
                                    onClick={() => {
                                      setToolsDropdownOpen(false);
                                      onNavigate && onNavigate(mod.id);
                                    }}
                                  >
                                    <div
                                      className={`mt-0.5 w-10 h-10 shrink-0 rounded-[24px] ${theme.bg} ${theme.text} flex items-center justify-center group-hover/item:scale-110 transition-transform`}
                                    >
                                      <mod.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-sm text-slate-900 group-hover/item:text-indigo-600 transition-colors line-clamp-1">
                                        {mod.title}
                                      </div>
                                      <div className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
                                        {mod.desc}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                              <button
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-2 flex items-center gap-1 group/more"
                                onClick={() => {
                                  setToolsDropdownOpen(false);
                                  onNavigate && onNavigate(tools[0].id); // navigate to a generic tool or dashboard
                                }}
                              >
                                View All{" "}
                                <ArrowRight className="w-3 h-3 group-hover/more:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Featured Tool Spotlight */}
                      <div className="w-[280px] shrink-0 border-l border-slate-100 pl-8 flex flex-col">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />{" "}
                          Featured Tool
                        </h3>
                        <div
                          className="relative flex-1 rounded-[24px] bg-gradient-to-br from-indigo-500 rounded-[24px] overflow-hidden cursor-pointer group/featured p-6 flex flex-col justify-end min-h-[160px]"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onNavigate && onNavigate(featuredTool.id);
                          }}
                        >
                          <div className="absolute inset-0 bg-[#F5F5F7] z-0"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent z-0"></div>

                          <featuredTool.icon className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500/20 group-hover/featured:scale-110 group-hover/featured:rotate-[-10deg] transition-transform duration-500 z-0" />

                          <div className="relative z-10">
                            <div className="w-12 h-12 rounded-[24px] bg-white/10 backdrop-blur-md flex items-center justify-center text-slate-900 mb-4 shadow-xl">
                              <featuredTool.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                              {featuredTool.title}
                            </h4>
                            <p className="text-indigo-200 text-sm line-clamp-2">
                              {featuredTool.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className={`font-bold transition-colors ${
                scrolled
                  ? "text-slate-700 hover:text-slate-900"
                  : "text-slate-700 hover:text-slate-900"
              }`}
              onClick={() => onNavigate && onNavigate("pricing")}
            >
              Pricing
            </button>
            <button
              className={`font-bold transition-colors ${
                scrolled
                  ? "text-slate-700 hover:text-slate-900"
                  : "text-slate-700 hover:text-slate-900"
              }`}
              onClick={() => onNavigate && onNavigate("blog")}
            >
              Blog
            </button>
          </nav>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            <button
              className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0A0F1E] rounded-full animate-pulse"></span>
            </button>

            <button
              className={`font-bold px-3 py-2 transition-colors ${
                scrolled
                  ? "text-slate-700 hover:text-slate-900"
                  : "text-slate-700 hover:text-slate-900"
              }`}
              onClick={() => onOpenAuth && onOpenAuth()}
            >
              Log In
            </button>
            <button
              className="btn-micro bg-white hover:bg-slate-50 text-slate-900 font-semibold px-7 py-2.5 rounded hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-transform flex items-center justify-center gap-2"
              onClick={() => onNavigate && onNavigate("dashboard")}
            >
              Start Free
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button
              className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#0A0F1E] rounded-full"></span>
            </button>
            <button
              className="p-2 text-slate-800"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] bg-white flex flex-col pt-4 overflow-y-auto"
          >
            <div className="px-5 flex items-center justify-between mb-8">
              <div
                className="w-10 h-10 rounded-[24px] bg-gradient-to-br from-[#F59E0B] to-amber-600 flex items-center justify-center text-slate-900 shadow-lg font-bold text-xl tracking-tighter"
                
              >
                C
              </div>
              <button
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-5 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="w-full bg-slate-100 text-slate-900 font-medium rounded-[24px] py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
              </div>
            </div>

            <div className="flex-1 px-5 flex flex-col gap-6">
              <div
                className="font-bold text-slate-900 text-2xl"
                
              >
                Categories
              </div>
              <div className="flex flex-col gap-5">
                {megaMenuColumns.map((cat, idx) => (
                  <button
                    key={idx}
                    className="flex items-center justify-between group outline-none"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate && onNavigate("dashboard");
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Box className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base text-slate-900">
                          {cat.title}
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                          Top Tools & Calculators
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 mt-auto bg-slate-50 flex flex-col gap-3">
              <button
                className="w-full py-4 text-center font-bold text-slate-900 hover:bg-slate-200/50 rounded-[24px] transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate("pricing");
                }}
              >
                Pricing
              </button>
              <button
                className="w-full py-4 text-center font-bold text-slate-900 hover:bg-slate-200/50 rounded-[24px] transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth && onOpenAuth();
                }}
              >
                Sign In
              </button>
              <button
                className="w-full py-4 rounded-[24px] font-bold text-slate-900 bg-[#F59E0B] hover:bg-[#fbbf24] shadow-[0_4px_16px_-4px_rgba(245,158,11,0.5)] transition-all"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate("dashboard");
                }}
              >
                Start Estimating Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
