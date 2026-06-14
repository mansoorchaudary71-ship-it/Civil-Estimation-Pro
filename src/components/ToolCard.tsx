import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Bookmark,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  LockOpen,
  Activity,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export const getCategoryThemeNew = (category: string) => {
  const cat = (category || "").toLowerCase();

  if (
    cat.includes("estimator") ||
    cat.includes("mep") ||
    cat.includes("analysis")
  ) {
    return {
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconColorBorder: "border-emerald-300",
    };
  }
  if (
    cat.includes("concrete") ||
    cat.includes("structure") ||
    cat.includes("steel") ||
    cat.includes("masonry")
  ) {
    return {
      border: "border-sky-200",
      text: "text-sky-700",
      iconBg: "bg-sky-100",
      iconColorBorder: "border-sky-300",
    };
  }
  if (
    cat.includes("road") ||
    cat.includes("pavement") ||
    cat.includes("highway") ||
    cat.includes("earthwork") ||
    cat.includes("chainage")
  ) {
    return {
      border: "border-teal-200",
      text: "text-teal-700",
      iconBg: "bg-teal-100",
      iconColorBorder: "border-teal-300",
    };
  }
  if (
    cat.includes("soil") ||
    cat.includes("geotechnical") ||
    cat.includes("foundation") ||
    cat.includes("test")
  ) {
    return {
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-100",
      iconColorBorder: "border-orange-300",
    };
  }

  return {
    border: "border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-100",
    iconColorBorder: "border-indigo-300",
  };
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
      updateSettings({
        favoriteTools: favoriteTools.filter((id) => id !== mod.id),
      });
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

  const estTime =
    mod.estimatedTime ||
    (diffText === "Beginner"
      ? "~2 mins"
      : diffText === "Advanced"
        ? "~15 mins"
        : "~5 mins");

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (idx || 0) * 0.05 }}
      onClick={() => onSelect(mod.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex w-full h-full flex-col text-left bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-md rounded-3xl p-6 border border-white dark:border-gray-800/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none dark:hover:bg-[#1c243a]/80 transition-all duration-300 cursor-pointer active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-4 w-full">
        <div className="p-3 bg-gray-100 dark:bg-[#222b45] rounded-2xl group-hover:scale-110 transition-transform duration-300 text-slate-800 dark:text-slate-200">
          {mod.icon && <mod.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />}
        </div>
        
        <div className="flex items-center gap-2">
          {mod.category && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              {mod.category}
            </span>
          )}
          
          <div
            role="button"
            tabIndex={0}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border shadow-sm z-20 ${
              isBookmarked 
                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 border-amber-200 dark:border-amber-500/30" 
                : "bg-white/50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            onClick={toggleFavorite}
          >
            <Bookmark
              className="w-4 h-4"
              strokeWidth={isBookmarked ? 2.5 : 2}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
        {mod.title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {mod.desc}
      </p>
    </motion.button>
  );
}
