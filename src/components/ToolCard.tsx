import React, { useState, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { Bookmark, ArrowRight } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

// Define the 4 professional, modern colors
const THEME_COLORS = {
  navy: {
    bgFrom: "#0f172a",
    bgTo: "#1e293b",
    blob1: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
    blob2: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    iconColor: "text-slate-800",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
  },
  grey: {
    bgFrom: "#64748b",
    bgTo: "#94a3b8",
    blob1: "linear-gradient(135deg, #64748b 0%, #cbd5e1 100%)",
    blob2: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
    iconColor: "text-slate-500",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
  },
  orange: {
    bgFrom: "#f97316",
    bgTo: "#ea580c",
    blob1: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
    blob2: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
    iconColor: "text-orange-600",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
  green: {
    bgFrom: "#166534",
    bgTo: "#15803d",
    blob1: "linear-gradient(135deg, #166534 0%, #22c55e 100%)",
    blob2: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
    iconColor: "text-green-700",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
  },
};

const getThemeColorForCategory = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("estimator") || cat.includes("mep") || cat.includes("analysis") || cat.includes("environment")) {
    return "green";
  }
  if (cat.includes("concrete") || cat.includes("structure") || cat.includes("steel") || cat.includes("masonry") || cat.includes("design")) {
    return "navy";
  }
  if (cat.includes("soil") || cat.includes("geotechnical") || cat.includes("foundation") || cat.includes("test") || cat.includes("road")) {
    return "orange";
  }
  return "grey";
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
  const [mousePos, setMousePos] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLButtonElement>(null);
  const { settings, updateSettings } = useSettings();

  const themeKey = getThemeColorForCategory(mod.category) as keyof typeof THEME_COLORS;
  const theme = THEME_COLORS[themeKey];

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

  // 3D Mouse Tracking Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Dampen effect for subtle premium tilt
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;

    setMousePos({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to center
    setMousePos({ rotateX: 0, rotateY: 0 });
  };

  return (
    <>
      <style>{`
        @keyframes liquidMorph1 {
          0% { border-radius: 42% 58% 63% 37% / 42% 40% 60% 58%; }
          50% { border-radius: 58% 42% 37% 63% / 60% 58% 40% 42%; }
          100% { border-radius: 42% 58% 63% 37% / 42% 40% 60% 58%; }
        }
        @keyframes liquidMorph2 {
          0% { border-radius: 63% 37% 58% 42% / 60% 40% 58% 42%; }
          50% { border-radius: 37% 63% 42% 58% / 40% 60% 42% 58%; }
          100% { border-radius: 63% 37% 58% 42% / 60% 40% 58% 42%; }
        }

        .tc-blob-1, .tc-blob-2 {
          position: absolute;
          width: 140px;
          height: 140px;
          bottom: -40px;
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease;
          filter: blur(12px);
          z-index: 0;
          pointer-events: none;
        }
        .tc-blob-1 {
          left: -10%;
          animation: liquidMorph1 6s infinite linear;
        }
        .tc-blob-2 {
          right: -10%;
          animation: liquidMorph2 7s infinite linear;
        }

        .tool-card-container:hover .tc-blob-1 {
          transform: scale(3.5) translateY(-20px);
          opacity: 0.8;
        }
        .tool-card-container:hover .tc-blob-2 {
          transform: scale(3.5) translateY(-30px);
          opacity: 0.7;
        }
      `}</style>
      <motion.button
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.4, delay: (idx || 0) * 0.05 }}
        onClick={() => onSelect(mod.id)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="tool-card-container group relative flex w-full flex-col text-left bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer overflow-hidden min-h-[190px]"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${mousePos.rotateX}deg) rotateY(${mousePos.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease",
          boxShadow: isHovered 
            ? `0 20px 40px rgba(0,0,0,0.1), 0 0 40px ${theme.bgFrom}33` 
            : "0 8px 30px rgba(0,0,0,0.04)"
        }}
      >
        {/* Hidden Gooey Background Blobs */}
        <div 
          className="tc-blob-1" 
          style={{ background: theme.blob1 }} 
        />
        <div 
          className="tc-blob-2" 
          style={{ background: theme.blob2 }} 
        />

        {/* Glassmorphic Content Layer */}
        <div className="relative z-10 p-6 flex flex-col h-full w-full bg-white/40 backdrop-blur-[6px] transition-colors duration-500 group-hover:bg-white/10 group-hover:backdrop-blur-[12px]">
          <div className="flex justify-between items-start mb-4 w-full">
            {/* Morphing Icon Container */}
            <div 
              className={`p-3 bg-white rounded-2xl shadow-sm border border-white/50 transition-all duration-500 group-hover:shadow-lg ${theme.iconColor} group-hover:text-white group-hover:bg-white/20 group-hover:border-white/30`}
              style={{
                transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              }}
            >
              {mod.icon && <mod.icon className="w-6 h-6 md:w-7 md:h-7 transition-colors duration-500" strokeWidth={1.5} />}
            </div>
            
            <div 
              className="flex items-center gap-2"
              style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
            >
              {mod.category && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText} transition-all duration-500 group-hover:bg-white/30 group-hover:text-white group-hover:backdrop-blur-sm`}>
                  {mod.category}
                </span>
              )}
              
              <div
                role="button"
                tabIndex={0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm z-20 ${
                  isBookmarked 
                    ? "bg-amber-100 text-amber-600 border-amber-200 group-hover:bg-amber-400 group-hover:text-white group-hover:border-amber-400" 
                    : "bg-white/80 text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-white group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white"
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

          <div 
            className="flex flex-col flex-1"
            style={{ transform: isHovered ? "translateZ(40px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
          >
            <h3 className="text-lg font-bold mb-1 text-gray-900 group-hover:text-white transition-colors duration-500">
              {mod.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 group-hover:text-white/90 transition-colors duration-500">
              {mod.desc}
            </p>
          </div>

          {/* Action indicator on hover */}
          <div 
            className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 text-white flex items-center justify-center px-4 py-2 rounded-full bg-slate-900 hover:bg-orange-500 hover:scale-105 border border-slate-700/50 shadow-sm"
            style={{ transform: isHovered ? "translateZ(50px) translateX(0)" : "translateZ(0px) translateX(-10px)" }}
            onClick={(e) => {
              // The card itself has an onClick, so this button is mostly visual,
              // but we can ensure it doesn't propagate if we wanted to.
            }}
          >
            <span className="text-[13px] font-bold mr-1.5">Open Tool</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </motion.button>
    </>
  );
}

