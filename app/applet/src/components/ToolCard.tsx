import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, LockOpen, CheckSquare, Clock, ArrowRight, Sparkles } from "lucide-react";

export const getCategoryThemeNew = (category: string) => {
  const cat = (category || "").toLowerCase();
  
  if (cat.includes('estimator') || cat.includes('mep') || cat.includes('analysis')) {
    return {
      border: 'border-emerald-500',
      text: 'text-emerald-700',
      bgSolid: 'bg-emerald-600',
    };
  }
  if (cat.includes('concrete') || cat.includes('structure') || cat.includes('steel') || cat.includes('masonry')) {
    return {
      border: 'border-sky-500',
      text: 'text-sky-700',
      bgSolid: 'bg-sky-600',
    };
  }
  if (cat.includes('road') || cat.includes('pavement') || cat.includes('highway') || cat.includes('earthwork') || cat.includes('chainage') || cat.includes('site') || cat.includes('infrastructure')) {
    return {
      border: 'border-teal-500',
      text: 'text-teal-700',
      bgSolid: 'bg-teal-600',
    };
  }
  if (cat.includes('soil') || cat.includes('geotechnical') || cat.includes('foundation') || cat.includes('test')) {
    return {
      border: 'border-orange-400',
      text: 'text-orange-600',
      bgSolid: 'bg-orange-500',
    };
  }
  
  return {
    border: 'border-indigo-500',
    text: 'text-indigo-700',
    bgSolid: 'bg-indigo-600',
  };
};

export default function ToolCard({
  tool: mod,
  onSelect,
  idx,
}: {
  tool: any; // Using tool for prop matching Dashboard
  mod?: any; // To support both usages if they vary
  onSelect: (id: string) => void;
  idx?: number;
}) {
  const toolData = mod || arguments[0].tool; // fallback to handle either naming
  const theme = getCategoryThemeNew(toolData.category);

  let diffDot = "bg-orange-400";
  let diffText = toolData.difficulty || "Intermediate";
  const diffUpper = (toolData.difficulty || "").toUpperCase();
  if (diffUpper.includes("ADVANCED")) {
    diffDot = "bg-red-500";
    diffText = "Advanced";
  } else if (diffUpper.includes("BEGINNER")) {
    diffDot = "bg-orange-400";
    diffText = "Beginner";
  }

  const estTime = toolData.estimatedTime || (diffText === "Beginner" ? "~2 mins" : diffText === "Advanced" ? "~15 mins" : "~5 mins");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (idx || 0) * 0.05 }}
      onClick={() => onSelect(toolData.id)}
      className={`relative flex h-full flex-col bg-white rounded-[32px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border ${theme.border} p-6 md:p-8 lg:p-10 group overflow-hidden shadow-sm`}
    >
      {toolData.isNew && (
        <div className="absolute top-6 right-0 bg-[#7000FF] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-l-full z-10 shadow-sm">
          NEW
        </div>
      )}
      
      <div className="flex items-center gap-4 z-10 pr-12">
        <div className={`w-[52px] h-[52px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center shrink-0 shadow-sm ${theme.bgSolid}`}>
          {toolData.icon && <toolData.icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />}
        </div>
        
        <div className="flex-1 pt-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-[18px] md:text-[20px] font-bold text-slate-900 leading-[1.25] mb-1.5 group-hover:text-slate-700 truncate whitespace-normal line-clamp-2">
            {toolData.title}
          </h3>
          <div className={`text-[11px] font-bold uppercase tracking-[0.1em] ${theme.text}`}>
            {toolData.category || "General"}
          </div>
        </div>
      </div>

      <p className="mt-5 mb-auto text-[15px] text-slate-500 leading-[1.65] line-clamp-2 md:line-clamp-3">
        {toolData.desc}
      </p>

      <div className="flex items-center justify-between gap-3 pt-5 mt-6 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-100 bg-slate-50">
          <div className={`w-2 h-2 rounded-full ${diffDot}`} />
          <span className="text-[11px] md:text-[12px] font-semibold text-slate-600">{diffText}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600">
            <CheckSquare className="w-[14px] h-[14px]" />
            <span className="text-[11px] md:text-[12px] font-semibold">Used</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-slate-500">
            <Clock className="w-[13px] h-[13px]" />
            <span className="text-[11px] md:text-[12px] font-semibold">{estTime}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
