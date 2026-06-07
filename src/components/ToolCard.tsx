import React, { useState } from "react";
import { motion } from "motion/react";
import { Bookmark, Clock, ArrowRight, Sparkles, Lock, LockOpen, Activity } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export const getCategoryThemeNew = (category: string) => {
  const cat = (category || "").toLowerCase();
  
  if (cat.includes('estimator') || cat.includes('mep') || cat.includes('analysis')) {
    return { border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColorBorder: 'border-emerald-300' };
  }
  if (cat.includes('concrete') || cat.includes('structure') || cat.includes('steel') || cat.includes('masonry')) {
    return { border: 'border-sky-200', text: 'text-sky-700', iconBg: 'bg-sky-100', iconColorBorder: 'border-sky-300' };
  }
  if (cat.includes('road') || cat.includes('pavement') || cat.includes('highway') || cat.includes('earthwork') || cat.includes('chainage')) {
    return { border: 'border-teal-200', text: 'text-teal-700', iconBg: 'bg-teal-100', iconColorBorder: 'border-teal-300' };
  }
  if (cat.includes('soil') || cat.includes('geotechnical') || cat.includes('foundation') || cat.includes('test')) {
    return { border: 'border-orange-200', text: 'text-orange-700', iconBg: 'bg-orange-100', iconColorBorder: 'border-orange-300' };
  }
  
  return { border: 'border-indigo-200', text: 'text-indigo-700', iconBg: 'bg-indigo-100', iconColorBorder: 'border-indigo-300' };
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
  const { settings, updateSettings } = useSettings();
  const theme = getCategoryThemeNew(mod.category);

  const favoriteTools = settings.favoriteTools || [];
  const isBookmarked = favoriteTools.includes(mod.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      updateSettings({ favoriteTools: favoriteTools.filter(id => id !== mod.id) });
    } else {
      updateSettings({ favoriteTools: [...favoriteTools, mod.id] });
    }
  };

  let diffDot = "bg-orange-400";
  let diffText = mod.difficulty || "Intermediate";
  const diffUpper = (mod.difficulty || "").toUpperCase();
  if (diffUpper.includes("ADVANCED")) {
    diffDot = "bg-red-500";
    diffText = "Advanced";
  } else if (diffUpper.includes("BEGINNER")) {
    diffDot = "bg-emerald-500";
    diffText = "Beginner";
  }

  const estTime = mod.estimatedTime || (diffText === "Beginner" ? "~2 mins" : diffText === "Advanced" ? "~15 mins" : "~5 mins");

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (idx || 0) * 0.05 }}
      onClick={() => onSelect(mod.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative flex w-full h-full flex-col text-left rounded-[24px] cursor-pointer group overflow-hidden tool-card p-6 md:p-8`}
    >
      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        {(settings.toolUsageStats?.[mod.id] ?? 0) >= 3 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200" title={`Used ${(settings.toolUsageStats?.[mod.id] || 0)} times`}>
            <Activity className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-bold uppercase whitespace-nowrap">Frequently Used</span>
          </div>
        )}
        {mod.premium && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            {isHovered ? <LockOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span className="text-[10px] font-bold uppercase text-amber-600">Pro</span>
          </div>
        )}
        {mod.isNew && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span className="text-[10px] font-bold uppercase text-purple-600">New</span>
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${isBookmarked ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50"} shadow-sm`}
          onClick={toggleFavorite}
        >
          <Bookmark className="w-4 h-4" strokeWidth={isBookmarked ? 2.5 : 2} fill={isBookmarked ? "currentColor" : "none"} />
        </div>
      </div>

      <div className="flex items-center gap-4 z-10 pr-16 md:pr-24 w-full box-border">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.text} shadow-sm border border-white`}>
          {mod.icon && <mod.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />}
        </div>
        
        <div className="flex-1 pt-1 min-w-0 flex flex-col justify-center">
          <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} mb-1`}>
            {mod.category || "General"}
          </div>
          <h3 className="text-base md:text-lg font-bold leading-tight truncate whitespace-normal line-clamp-2 text-slate-800 group-hover:text-indigo-900 transition-colors">
            {mod.title}
          </h3>
        </div>
      </div>

      <div className="tool-card-body mt-5 mb-auto">
        <p className="text-sm text-slate-500 leading-relaxed tool-card-description group-hover:text-slate-600 transition-colors">
          {mod.desc}
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 pt-5 mt-6 border-t border-slate-200 w-full">
        <div className="flex flex-wrap items-center gap-2">
           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm whitespace-nowrap">
             <div className={`w-2 h-2 rounded-full shrink-0 ${diffDot}`} />
             <span className="text-[11px] font-semibold text-slate-600">{diffText}</span>
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm whitespace-nowrap">
             <Clock className="w-3 h-3 shrink-0 text-slate-400" />
             <span className="text-[11px] font-semibold text-slate-600">{estTime}</span>
           </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-[16px] font-bold text-xs shadow-md group-hover:bg-indigo-700 group-hover:shadow-lg transition-all group-hover:-translate-y-0.5 whitespace-nowrap mt-auto">
          <span className="hidden sm:inline-block">Open</span> Tool
          <ArrowRight className="w-3.5 h-3.5 -ml-1 group-hover:ml-0.5 transition-all shrink-0" />
        </div>
      </div>
    </motion.button>
  );
}
