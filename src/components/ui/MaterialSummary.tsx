import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react'; // Default icon

export interface MaterialSummaryProps {
  title?: string;
  subtitle?: string;
  totalValue: string | number;
  totalUnit?: string;
  totalLabel?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function MaterialSummary({
  title = "MATERIAL SUMMARY",
  subtitle,
  totalValue,
  totalUnit,
  totalLabel,
  icon,
  children,
  className = ""
}: MaterialSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`w-full bg-slate-50/80 dark:bg-[#1A1C24]/80 backdrop-blur-3xl border border-slate-200/50 dark:border-white/5 rounded-[32px] p-6 sm:p-8 overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] ${className}`}
    >
      {/* Soft Glow Background Effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header section */}
      <div className="flex items-center gap-2 mb-8 relative z-10 text-indigo-600 dark:text-indigo-400">
        {icon || <Layers className="w-5 h-5 flex-shrink-0" />}
        <h3 className="font-extrabold uppercase tracking-[0.15em] text-[11px] sm:text-xs">{title}</h3>
      </div>

      {/* Hero Total Section */}
      <div className="mb-10 relative z-10">
        {totalLabel && (
          <p className="text-slate-500 dark:text-white/50 font-semibold text-sm sm:text-base mb-3">{totalLabel}</p>
        )}
        <div className="flex items-baseline gap-2 flex-wrap text-slate-800 dark:text-white">
          <span className="text-6xl sm:text-7xl font-black tracking-tighter whitespace-nowrap">
            {totalValue}
          </span>
          <div className="flex flex-col text-left">
            {totalUnit && (
              <span className="text-lg sm:text-xl font-bold text-slate-600 dark:text-white/60">{totalUnit}</span>
            )}
            {subtitle && (
              <span className="text-sm font-semibold text-slate-400 dark:text-white/40">{subtitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Children (Cards/Breakdowns) */}
      <div className="flex flex-col gap-4 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
