import React from "react";
import { Bookmark, ArrowRight, Box } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

// Define the 4 professional, modern colors cleanly
const THEME_COLORS = {
  navy: {
    bgHover: "hover:bg-slate-50",
    iconColor: "text-slate-800",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800",
    iconBg: "bg-white",
    borderHover: "hover:border-slate-300",
    iconColorBorder: "border-slate-800",
    text: "text-slate-800",
    border: "border-slate-200"
  },
  grey: {
    bgHover: "hover:bg-slate-50",
    iconColor: "text-slate-500",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    iconBg: "bg-white",
    borderHover: "hover:border-slate-300",
    iconColorBorder: "border-slate-500",
    text: "text-slate-500",
    border: "border-slate-200"
  },
  orange: {
    bgHover: "hover:bg-[#FF5F15]/5",
    iconColor: "text-[#FF5F15]",
    badgeBg: "bg-[#FF5F15]/10",
    badgeText: "text-[#FF5F15]",
    iconBg: "bg-white",
    borderHover: "hover:border-[#FF5F15]/30",
    iconColorBorder: "border-[#FF5F15]",
    text: "text-[#FF5F15]",
    border: "border-[#FF5F15]/20"
  },
  green: {
    bgHover: "hover:bg-green-50",
    iconColor: "text-green-700",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
    iconBg: "bg-white",
    borderHover: "hover:border-green-300",
    iconColorBorder: "border-green-700",
    text: "text-green-700",
    border: "border-green-200"
  },
};

export const getCategoryThemeNew = (category: string) => {
  const cat = (category || "").toLowerCase();
  let themeKey: keyof typeof THEME_COLORS = "grey";
  if (cat.includes("estimator") || cat.includes("mep") || cat.includes("analysis") || cat.includes("environment")) {
    themeKey = "green";
  } else if (cat.includes("concrete") || cat.includes("structure") || cat.includes("steel") || cat.includes("masonry") || cat.includes("design")) {
    themeKey = "navy";
  } else if (cat.includes("soil") || cat.includes("geotechnical") || cat.includes("foundation") || cat.includes("test") || cat.includes("road")) {
    themeKey = "orange";
  }
  return THEME_COLORS[themeKey];
};

export default function ToolCard({
  mod,
  onSelect,
}: {
  mod: any;
  onSelect: (id: string) => void;
}) {
  const { settings, updateSettings } = useSettings();

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
    <button
      onClick={() => onSelect(mod.id)}
      className={`group w-full flex flex-col text-left bg-white rounded-2xl border border-slate-200 p-5 min-h-[170px] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${theme.borderHover} ${theme.bgHover}`}
      style={{
        // Strip out any potentially buggy properties
        transform: "translateZ(0)", 
        backfaceVisibility: "hidden",
      }}
    >
      <div className="flex justify-between items-start mb-3 w-full">
        {/* Simple Flat Icon Container */}
        <div 
          className={`p-2.5 rounded-xl border border-slate-100 shadow-sm transition-transform duration-200 group-hover:scale-105 ${theme.iconBg} ${theme.iconColor}`}
        >
          <IconComponent className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        
        <div className="flex items-center gap-2">
          {mod.category && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
              {mod.category}
            </span>
          )}
          
          <div
            role="button"
            tabIndex={0}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors border shadow-sm ${
              isBookmarked 
                ? "bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200" 
                : "bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50"
            }`}
            onClick={toggleFavorite}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              strokeWidth={isBookmarked ? 2.5 : 2}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-2">
        <h3 className="text-base font-bold mb-1 text-slate-900 group-hover:text-indigo-700 transition-colors">
          {mod.title || "Untitled Tool"}
        </h3>
        <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
          {mod.desc || "No description available."}
        </p>
      </div>
    </button>
  );
}

