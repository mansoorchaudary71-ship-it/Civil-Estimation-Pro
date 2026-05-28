import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  LockOpen,
  Bookmark,
  Sparkles,
  Clock,
  ArrowRight,
} from "lucide-react";

export const getCategoryThemeNew = (category: string) => {
  if (category.includes("Concrete") || category.includes("Masonry"))
    return {
      color: "orange",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100/80",
      text: "text-orange-600",
      border: "border-orange-200",
      gradient: "from-orange-500 to-amber-500",
    };
  if (category.includes("Structural") || category.includes("Water"))
    return {
      color: "blue",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100/80",
      text: "text-blue-600",
      border: "border-blue-200",
      gradient: "from-blue-500 to-cyan-500",
    };
  if (category.includes("Road") || category.includes("Site"))
    return {
      color: "green",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100/80",
      text: "text-emerald-600",
      border: "border-emerald-200",
      gradient: "from-emerald-500 to-teal-500",
    };
  if (category.includes("Quantity") || category.includes("Architectural"))
    return {
      color: "purple",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100/80",
      text: "text-purple-600",
      border: "border-purple-200",
      gradient: "from-purple-500 to-indigo-500",
    };
  if (category.includes("AI"))
    return {
      color: "teal",
      bg: "bg-teal-50",
      iconBg: "bg-teal-100/80",
      text: "text-teal-600",
      border: "border-teal-200",
      gradient: "from-teal-400 to-emerald-400",
    };
  return {
    color: "indigo",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100/80",
    text: "text-indigo-600",
    border: "border-indigo-200",
    gradient: "from-indigo-500 to-blue-500",
  };
};

const diffColors: Record<string, string> = {
  Beginner: "bg-emerald-500 text-white",
  Intermediate: "bg-amber-500 text-white",
  Advanced: "bg-red-500 text-white",
};

export default function ToolCard({
  mod,
  onSelect,
  isUsed,
}: {
  mod: any;
  onSelect: (id: string) => void;
  isUsed?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(isUsed || false);
  const theme = getCategoryThemeNew(mod.category);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(mod.id)}
      className={`group relative flex flex-col h-full w-full text-left bg-white rounded-[24px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 ${
        mod.premium
          ? "border-amber-300/60 shadow-[0_4px_12px_rgba(245,158,11,0.05)] md:hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.2)]"
          : "shadow-sm"
      }`}
    >
      {/* Top Bar with Tags */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="flex flex-col items-start gap-1.5 focus:outline-none">
          {mod.premium && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-white/20 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                PRO
              </span>
              {isHovered ? (
                <LockOpen className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </div>
          )}
          {mod.isNew && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-white/20 relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-shadow">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
              />
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">
                NEW
              </span>
            </div>
          )}
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors backdrop-blur-md ${isBookmarked ? "bg-amber-100 text-amber-500" : "bg-white/80 text-slate-300 hover:text-slate-500"} shadow-sm border border-slate-100/50`}
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }
          }}
        >
          <Bookmark
            className="w-4 h-4"
            strokeWidth={isBookmarked ? 3 : 2}
            fill={isBookmarked ? "currentColor" : "none"}
          />
        </div>
      </div>

      {/* Hero Visual Area */}
      <div
        className={`relative h-[160px] w-full p-6 flex flex-col justify-end transition-colors duration-500 ${theme.bg}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent z-0 pointer-events-none" />

        {/* Large Category Icon Overlay */}
        <div
          className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-10 md:opacity-5 transition-transform duration-500 ${isHovered ? "scale-110 rotate-[-10deg]" : "scale-100 rotate-0"} ${theme.text}`}
        >
          <mod.icon className="w-full h-full" strokeWidth={1} />
        </div>

        <div className="relative z-10 flex">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${theme.gradient} text-white transition-transform duration-300 md:group-hover:scale-110 md:group-hover:-translate-y-2`}
          >
            <mod.icon className="w-8 h-8" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6 z-10 bg-white">
        <div className="mb-4 flex-grow">
          <div
            className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.text}`}
          >
            {mod.category}
          </div>
          <h3
            className="text-base font-bold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            {mod.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-1 leading-relaxed">
            {mod.desc}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${diffColors[mod.difficulty as string] || diffColors["Beginner"]}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {mod.difficulty || "Beginner"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {mod.estimatedTime || "2 min"}
              </span>
            </div>
          </div>

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"}`}
          >
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-0.5" : "translate-x-0"}`}
            />
          </div>
        </div>
      </div>

      {/* Quick Preview Thumbnail (Hover Reveal) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden md:flex absolute inset-x-0 bottom-0 top-[160px] bg-slate-900/95 backdrop-blur-xl p-6 flex-col border-t border-slate-700 pointer-events-none z-30"
          >
            <h4 className="text-white font-bold text-sm mb-3 opacity-90 uppercase tracking-widest text-[10px]">
              Quick Preview
            </h4>

            {/* Mock skeleton UI representing a tool preview */}
            <div className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-4 flex flex-col gap-3 overflow-hidden shadow-inner">
              <div className="h-4 w-1/3 bg-slate-700 rounded-full animate-pulse" />
              <div className="h-6 w-full bg-slate-700/50 rounded-lg" />
              <div className="h-6 w-full bg-slate-700/50 rounded-lg" />
              <div className="h-6 w-3/4 bg-slate-700/50 rounded-lg" />

              <div className="mt-auto flex justify-end gap-2">
                <div className="h-8 w-20 bg-indigo-500/20 rounded-lg border border-indigo-500/30" />
                <div className="h-8 w-20 bg-indigo-500 flex items-center justify-center rounded-lg shadow-lg shadow-indigo-500/20">
                  <span className="w-10 h-1.5 bg-indigo-200 rounded-full opacity-80" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
