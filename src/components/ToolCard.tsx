import React, { useState } from "react";
import { motion } from "motion/react";
import { Bookmark, Clock, ArrowRight, Sparkles, Lock, LockOpen, Activity } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export const getCategoryThemeNew = (category: string) => {
  const cat = (category || "").toLowerCase();
  
  if (cat.includes('estimator') || cat.includes('mep') || cat.includes('analysis')) {
    return { border: 'border-emerald-200', text: 'text-emerald-600', iconBg: 'bg-emerald-50', iconColorBorder: 'border-emerald-600' };
  }
  if (cat.includes('concrete') || cat.includes('structure') || cat.includes('steel') || cat.includes('masonry')) {
    return { border: 'border-sky-200', text: 'text-sky-600', iconBg: 'bg-sky-50', iconColorBorder: 'border-sky-600' };
  }
  if (cat.includes('road') || cat.includes('pavement') || cat.includes('highway') || cat.includes('earthwork') || cat.includes('chainage')) {
    return { border: 'border-teal-200', text: 'text-teal-600', iconBg: 'bg-teal-50', iconColorBorder: 'border-teal-600' };
  }
  if (cat.includes('soil') || cat.includes('geotechnical') || cat.includes('foundation') || cat.includes('test')) {
    return { border: 'border-orange-200', text: 'text-orange-600', iconBg: 'bg-orange-50', iconColorBorder: 'border-orange-600' };
  }
  
  return { border: 'border-indigo-200', text: 'text-indigo-600', iconBg: 'bg-indigo-50', iconColorBorder: 'border-indigo-600' };
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
      className={`relative flex w-full h-full flex-col text-left bg-white rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-xl border-[1.5px] ${theme.iconColorBorder} hover:border-[2px] p-6 md:p-8 group overflow-hidden`}
    >
      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        {(settings.toolUsageStats?.[mod.id] ?? 0) >= 3 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-600" title={`Used ${(settings.toolUsageStats?.[mod.id] || 0)} times`}>
            <Activity className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase whitespace-nowrap">Frequently Used</span>
          </div>
        )}
        {mod.premium && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-600">
            {isHovered ? <LockOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span className="text-[10px] font-bold uppercase">Pro</span>
          </div>
        )}
        {mod.isNew && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-purple-50 text-purple-600">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase">New</span>
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isBookmarked ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
          onClick={toggleFavorite}
        >
          <Bookmark className="w-4 h-4" strokeWidth={isBookmarked ? 2.5 : 2} fill={isBookmarked ? "currentColor" : "none"} />
        </div>
      </div>

      <div className="flex items-center gap-4 z-10 pr-24">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.text}`}>
          {mod.icon && <mod.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />}
        </div>
        
        <div className="flex-1 pt-1 min-w-0 flex flex-col justify-center">
          <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} mb-1`}>
            {mod.category || "General"}
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-800 leading-tight group-hover:text-slate-900 truncate whitespace-normal line-clamp-2">
            {mod.title}
          </h3>
        </div>
      </div>

      <p className="mt-5 mb-auto text-sm text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-3">
        {mod.desc}
      </p>

      <div className="flex items-center justify-between gap-3 pt-5 mt-6 border-t border-slate-100">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
          <div className={`w-2 h-2 rounded-full ${diffDot}`} />
          <span className="text-[11px] font-semibold text-slate-600">{diffText}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] font-semibold">{estTime}</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0 delay-75" />
        </div>
      </div>
    </motion.button>
  );
}
