import React, { useState } from "react";
import { Bookmark, ArrowRight, Box } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { motion } from "motion/react";

// Define the 4 professional, modern colors cleanly
const THEME_COLORS = {
  purple: {
    gradient: "shadow-purple-500/40 bg-gradient-to-r from-purple-500 to-purple-600",
    button: "bg-purple-500 shadow-purple-500/20 hover:shadow-purple-500/40",
  },
  emerald: {
    gradient: "shadow-emerald-500/40 bg-gradient-to-r from-emerald-500 to-emerald-600",
    button: "bg-emerald-500 shadow-emerald-500/20 hover:shadow-emerald-500/40",
  },
  rose: {
    gradient: "shadow-rose-500/40 bg-gradient-to-r from-rose-500 to-rose-600",
    button: "bg-rose-500 shadow-rose-500/20 hover:shadow-rose-500/40",
  },
  amber: {
    gradient: "shadow-amber-500/40 bg-gradient-to-r from-amber-500 to-amber-600",
    button: "bg-amber-500 shadow-amber-500/20 hover:shadow-amber-500/40",
  },
  indigo: {
    gradient: "shadow-indigo-500/40 bg-gradient-to-r from-indigo-500 to-indigo-600",
    button: "bg-indigo-500 shadow-indigo-500/20 hover:shadow-indigo-500/40",
  },
  slate: {
    gradient: "shadow-slate-500/40 bg-gradient-to-r from-slate-500 to-slate-600",
    button: "bg-slate-500 shadow-slate-500/20 hover:shadow-slate-500/40",
  }
};

export const getCategoryThemeNew = (category: string) => {
  const cat = (category || "").toLowerCase();
  let themeKey: keyof typeof THEME_COLORS = "slate";
  if (cat.includes("estimator") || cat.includes("mep") || cat.includes("analysis") || cat.includes("environment")) {
    themeKey = "emerald";
  } else if (cat.includes("concrete") || cat.includes("structure") || cat.includes("steel") || cat.includes("masonry") || cat.includes("design")) {
    themeKey = "indigo";
  } else if (cat.includes("soil") || cat.includes("geotechnical") || cat.includes("foundation") || cat.includes("test") || cat.includes("road")) {
    themeKey = "amber";
  } else if (cat.includes("cost") || cat.includes("finance") || cat.includes("price")) {
    themeKey = "emerald";
  } else if (cat.includes("finishing") || cat.includes("architecture")) {
    themeKey = "rose";
  } else if (cat.includes("water") || cat.includes("plumbing")) {
    themeKey = "indigo";
  } else if (cat.includes("ai") || cat.includes("smart") || cat.includes("advanced") || cat.includes("planning") || cat.includes("management")) {
    themeKey = "purple";
  }
  return THEME_COLORS[themeKey] || THEME_COLORS.slate;
};

export default function ToolCard({
  mod,
  onSelect,
}: {
  mod: any;
  onSelect: (id: string) => void;
}) {
  const { settings, updateSettings } = useSettings();
  const [isHovered, setIsHovered] = useState(false);

  // Safety check, ensure we always render
  if (!mod) {
    return null;
  }

  const theme = getCategoryThemeNew(mod.category);

  const favoriteTools = settings?.favoriteTools || [];
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

  const IconComponent = mod.icon || Box;

  return (
    <motion.div
      onClick={() => onSelect(mod.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.01 }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        opacity: { duration: 0.3 }
      }}
      className="relative flex w-full flex-col rounded-2xl bg-stone-50 bg-clip-border text-slate-700 mt-6 cursor-pointer group outline-none"
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        boxShadow: isHovered 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
          : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
      }}
    >
      {/* Header graphic shifted up */}
      <motion.div 
        className={`relative mx-4 -mt-6 h-28 overflow-hidden rounded-xl bg-clip-border text-slate-900 shadow-lg flex items-center justify-center ${theme.gradient}`}
        animate={{ 
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -3 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut" 
          }}
        >
          <IconComponent className="w-10 h-10 opacity-90 drop-shadow-sm text-white" strokeWidth={1.5} />
        </motion.div>
        
        {/* Soft gloss effect overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? ["-100%", "100%"] : "-100%"
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </motion.div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h5 className="block font-sans text-[17px] font-bold leading-snug tracking-tight text-slate-900 group-hover:text-[#FF5F15] transition-colors duration-300">
            {mod.title || "Untitled Tool"}
          </h5>
          <motion.div
            role="button"
            tabIndex={0}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors shadow-sm ml-2 ${
              isBookmarked 
                ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                : "bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            }`}
            onClick={toggleFavorite}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              strokeWidth={isBookmarked ? 2.5 : 2}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </motion.div>
        </div>
        
        <p className="block font-sans text-[13px] font-medium leading-relaxed text-slate-500 line-clamp-2">
          {mod.desc || "No description available."}
        </p>
      </div>

      <div className="p-5 pt-0 mt-auto flex items-center justify-between">
        {mod.category && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100/80 text-slate-600 uppercase tracking-widest border border-slate-200/50">
            {mod.category}
          </span>
        )}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`select-none rounded-[10px] py-2 px-4 flex items-center gap-1.5 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-colors active:opacity-[0.85] active:shadow-none ml-auto ${theme.button}`}
        >
          <span>Open Tool</span>
          <motion.div
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}

