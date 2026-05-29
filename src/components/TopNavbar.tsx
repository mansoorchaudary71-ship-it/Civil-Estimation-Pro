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
} from "lucide-react";

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
      // Find the main scroll container, if not just use window
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

  const categories = [
    {
      title: "Quantity Estimator",
      icon: Calculator,
      count: 12,
      id: "master-quantity",
    },
    { title: "Concrete Tech", icon: Box, count: 8, id: "master-rcc" },
    { title: "Structural Design", icon: Building, count: 6, id: "house" },
    { title: "Road Construction", icon: Truck, count: 4, id: "road-pavement" },
    {
      title: "Architectural",
      icon: Building2,
      count: 5,
      id: "interiors-finishes",
    },
    { title: "AI Tools", icon: Cpu, count: 2, id: "ai" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo Left */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate && onNavigate("home")}
          >
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 font-bold text-xl tracking-tighter"
              style={{ fontFamily: "Clash Display, sans-serif" }}
            >
              C
            </div>
            <span
              className={`font-bold text-lg hidden sm:block ${scrolled ? "text-slate-900" : "text-slate-800"}`}
              style={{ fontFamily: "Clash Display, sans-serif" }}
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
                className={`flex items-center gap-1.5 font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                aria-haspopup="menu"
                aria-expanded={toolsDropdownOpen}
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              >
                Tools{" "}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {toolsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] border border-slate-100 p-6 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {categories.map((cat, idx) => (
                        <div
                          key={idx}
                          role="button"
                          tabIndex={0}
                          className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group/item outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onNavigate && onNavigate(cat.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setToolsDropdownOpen(false);
                              onNavigate && onNavigate(cat.id);
                            }
                          }}
                        >
                          <div className="mt-0.5 w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                            <cat.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 group-hover/item:text-indigo-600 transition-colors">
                              {cat.title}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">
                              {cat.count} Calculators
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className={`font-bold transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              onClick={() => onNavigate && onNavigate("pricing")}
            >
              Pricing
            </button>
            <button
              className={`font-bold transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              onClick={() => onNavigate && onNavigate("blog")}
            >
              Blog
            </button>
          </nav>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className={`font-bold px-4 py-2 transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              onClick={() => onOpenAuth && onOpenAuth()}
            >
              Sign In
            </button>
            <button
              className="bg-[#F59E0B] hover:bg-[#fbbf24] text-slate-900 font-bold px-6 py-2.5 rounded-full shadow-[0_4px_16px_-4px_rgba(245,158,11,0.5)] hover:shadow-[0_8px_20px_-4px_rgba(245,158,11,0.6)] transition-all hover:-translate-y-0.5"
              onClick={() => onNavigate && onNavigate("house")}
            >
              Start Free
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
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
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-lg font-bold text-xl tracking-tighter"
                style={{ fontFamily: "Clash Display, sans-serif" }}
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
                  className="w-full bg-slate-100 text-slate-900 font-medium rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
              </div>
            </div>

            <div className="flex-1 px-5 flex flex-col gap-6">
              <div
                className="font-bold text-slate-900 text-2xl"
                style={{ fontFamily: "Clash Display, sans-serif" }}
              >
                Categories
              </div>
              <div className="flex flex-col gap-5">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className="flex items-center justify-between group outline-none"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate && onNavigate(cat.id);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base text-slate-900">
                          {cat.title}
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                          {cat.count} Calculators
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
                className="w-full py-4 text-center font-bold text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate("pricing");
                }}
              >
                Pricing
              </button>
              <button
                className="w-full py-4 text-center font-bold text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth && onOpenAuth();
                }}
              >
                Sign In
              </button>
              <button
                className="w-full py-4 rounded-xl font-bold text-slate-900 bg-[#F59E0B] hover:bg-[#fbbf24] shadow-[0_4px_16px_-4px_rgba(245,158,11,0.5)] transition-all"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate("house");
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
