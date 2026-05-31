import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Tilt from "react-parallax-tilt";
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
  idx,
}: {
  mod: any;
  onSelect: (id: string) => void;
  isUsed?: boolean;
  idx?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(isUsed || false);
  const theme = getCategoryThemeNew(mod.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (idx || 0) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full w-full rounded-[24px]"
    >
      <Tilt
        tiltMaxAngleX={4}
        tiltMaxAngleY={4}
        perspective={1000}
        scale={1.02}
        transitionSpeed={400}
        glareEnable={true}
        glareMaxOpacity={0.12}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="24px"
        className="h-full w-full rounded-[24px]"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => onSelect(mod.id)}
          className={`group relative flex flex-col h-full w-full text-left bg-white rounded-[24px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden transition-all duration-300 md:hover:shadow-[0_20px_40px_-12px_rgba(99,102,241,0.25)] border ${
            mod.premium
              ? "border-amber-300/60 shadow-[0_4px_12px_rgba(245,158,11,0.05)] md:hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.3)]"
              : `${theme.border} shadow-sm`
          }`}
        >
      {/* Top Bar with Tags */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="flex flex-col items-start gap-1.5 focus:outline-none">
          {mod.premium && (
            <div className="group/pro relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-white/20 backdrop-blur-md cursor-pointer">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                PRO
              </span>
              {isHovered ? (
                <LockOpen className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              {/* Tooltip */}
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover/pro:flex flex-col whitespace-nowrap bg-white text-slate-900 text-[10px] px-3 py-2 rounded-[16px] shadow-xl border border-slate-700 z-50 pointer-events-none">
                <div className="font-bold text-amber-400 mb-0.5">Premium Tool</div>
                <div className="text-slate-300">Upgrade for $29/mo to unlock</div>
                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white border-b border-r border-slate-700 rotate-45 transform border border-slate-200 shadow-sm" />
              </div>
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
            className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg bg-gradient-to-br ${theme.gradient} text-white transition-transform duration-300 md:group-hover:scale-110 md:group-hover:-translate-y-2`}
          >
            <mod.icon className="w-8 h-8" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6 z-10 bg-white relative">
        <div className="mb-4 flex-grow">
          <div
            className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.text}`}
          >
            {mod.category}
          </div>
          <h3
            className="text-base font-semibold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors"
            
          >
            {mod.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
            {mod.desc}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded border border-transparent ${diffColors[mod.difficulty as string] || diffColors["Beginner"]}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {mod.difficulty || "Beginner"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {mod.estimatedTime || "2 min"}
              </span>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {mod.usageCount || Math.floor((mod.id.length * 1024 + 5000) % 30000).toLocaleString("en-US")} uses
          </div>
        </div>

        {/* Hover Reveal Button overlaying the footer area slightly */}
        <div className="absolute left-0 right-0 bottom-0 p-6 translate-y-[20px] md:group-hover:translate-y-0 transition-all duration-300 opacity-0 md:group-hover:opacity-100 pointer-events-none md:pointer-events-auto bg-gradient-to-t from-white via-white to-transparent pt-12">
          <div className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-[24px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-colors">
            Open Tool <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.button>
    </Tilt>
  </motion.div>
  );
}
