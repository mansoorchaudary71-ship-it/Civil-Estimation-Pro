import React, { useState } from "react";
import { Bookmark, BookmarkCheck, ArrowRight, Box } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { motion } from "motion/react";

const CARD  = "#FFFFFF";
const CARDH = "#FAFAFA";
const T1    = "#1C1917";  // stone-900
const T2    = "#57534E";  // stone-600
const T3    = "#A8A29E";  // stone-400

const CAT_COLORS: Record<string, { c: string, glow: string }> = {
  "ROAD PAVEMENT":       { c: "#F59E0B", glow: "rgba(245,158,11,0.15)"  },
  "QUANTITY ESTIMATION": { c: "#3B82F6", glow: "rgba(59,130,246,0.15)"  },
  "CONCRETE":            { c: "#8B5CF6", glow: "rgba(139,92,246,0.15)" },
  "MEP":                 { c: "#10B981", glow: "rgba(16,185,129,0.15)"  },
  "DEFAULT":             { c: "#6366F1", glow: "rgba(99,102,241,0.15)" }, 
};

export const getCategorySpec = (category: string) => {
  const cat = (category || "").toUpperCase();
  if (cat.includes("ROAD") || cat.includes("PAVEMENT") || cat.includes("HIGHWAY")) return CAT_COLORS["ROAD PAVEMENT"];
  if (cat.includes("QUANTITY") || cat.includes("ESTIMATION") || cat.includes("ANALYSIS")) return CAT_COLORS["QUANTITY ESTIMATION"];
  if (cat.includes("CONCRETE") || cat.includes("STRUCTURE") || cat.includes("MASONRY") || cat.includes("DESIGN")) return CAT_COLORS["CONCRETE"];
  if (cat.includes("MEP") || cat.includes("ENERGY") || cat.includes("WATER") || cat.includes("PLUMBING")) return CAT_COLORS["MEP"];
  return CAT_COLORS["DEFAULT"];
};

const LEVEL_MAP: Record<number, string> = { 1: "Basic", 2: "Moderate", 3: "Advanced" };

function Dots({ level, color }: { level: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{
          display: "block", width: 5, height: 5, borderRadius: "50%",
          background: i <= level ? color : "rgba(0,0,0,0.10)",
        }} />
      ))}
    </span>
  );
}

export default function ToolCard({
  mod,
  onSelect,
}: {
  mod: any;
  onSelect: (id: string) => void;
}) {
  const { settings, updateSettings } = useSettings();
  const [hov, setHov] = useState(false);

  if (!mod) return null;

  const cfg = getCategorySpec(mod.category);
  const favoriteTools = settings?.favoriteTools || [];
  const saved = favoriteTools.includes(mod.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      updateSettings({ favoriteTools: favoriteTools.filter((id) => id !== mod.id) });
    } else {
      updateSettings({ favoriteTools: [...favoriteTools, mod.id] });
    }
  };

  const IconComponent = mod.icon || Box;

  // Add variety to the level indicator based on ID character length 
  const level = mod.level || ((mod.id.length % 3) + 1);

  return (
    <motion.div
      onClick={() => onSelect(mod.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        opacity: { duration: 0.3 }
      }}
      className="w-full relative overflow-hidden flex flex-col group font-sans"
      style={{
        background: hov ? CARDH : CARD,
        borderTop: `1px solid ${hov ? cfg.c + "42" : "rgba(0,0,0,0.06)"}`,
        borderRight: `1px solid ${hov ? cfg.c + "42" : "rgba(0,0,0,0.06)"}`,
        borderBottom: `1px solid ${hov ? cfg.c + "42" : "rgba(0,0,0,0.06)"}`,
        borderLeft: `3px solid ${cfg.c}`,
        borderRadius: 14,
        padding: "18px 16px 16px",
        gap: 12,
        cursor: "pointer",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov
          ? `0 20px 56px ${cfg.glow}, 0 10px 20px -5px rgba(0,0,0,0.05)`
          : "0 2px 14px rgba(0,0,0,0.05)",
        transition: "all 0.20s ease",
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 90, height: 90, borderRadius: "50%",
        background: cfg.c, opacity: hov ? 0.08 : 0.03,
        filter: "blur(28px)", pointerEvents: "none",
        transition: "opacity 0.30s",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: `${cfg.c}14`, border: `1px solid ${cfg.c}24`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <motion.div
             animate={{ scale: hov ? 1.1 : 1, rotate: hov ? [0, -5, 5, 0] : 0 }}
             transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <IconComponent size={19} color={cfg.c} strokeWidth={1.75} />
          </motion.div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, color: T3, letterSpacing: "0.08em" }}>
            {mod.id?.slice(0, 2).toUpperCase() || "01"}
          </span>
          <button
            onClick={toggleFavorite}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", lineHeight: 0 }}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              {saved ? <BookmarkCheck size={16} color={cfg.c} /> : <Bookmark size={15} color={T3} strokeWidth={2.5} />}
            </motion.div>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: T1, lineHeight: 1.35, flex: 1 }}>
          {mod.title}
        </span>
        {mod.isNew && (
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.06em",
            color: cfg.c, background: `${cfg.c}18`,
            border: `1px solid ${cfg.c}32`,
            padding: "2px 7px", borderRadius: 5,
            whiteSpace: "nowrap", marginTop: 1, flexShrink: 0,
          }}>NEW</span>
        )}
      </div>

      <p style={{
        margin: 0, fontSize: 12.5, color: T2, lineHeight: 1.65,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {mod.desc || "No description available."}
      </p>

      <div className="mt-auto" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Dots level={level} color={cfg.c} />
          <span style={{ fontSize: 11, color: T3, fontWeight: 600 }}>{LEVEL_MAP[level] || "Moderate"}</span>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 5,
          background: hov ? cfg.c : "transparent",
          border: `1px solid ${hov ? "transparent" : cfg.c + "48"}`,
          color: hov ? "#FFFFFF" : cfg.c,
          padding: "5px 12px", borderRadius: 8,
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          transition: "all 0.18s", fontFamily: "inherit",
        }}>
          Open 
          <motion.div animate={{ x: hov ? 3 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
             <ArrowRight size={13} strokeWidth={2.5} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}

