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
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-amber-500/20 dark:from-orange-500/10 dark:to-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-rose-500/10 to-orange-500/10 dark:from-rose-500/5 dark:to-orange-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header section */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-500/20 dark:to-amber-500/20 text-orange-600 dark:text-orange-400 rounded-xl shadow-sm border border-orange-200/50 dark:border-white/5">
          {icon || <Layers className="w-4 h-4 flex-shrink-0" />}
        </div>
        <h3 className="font-bold uppercase tracking-widest text-xs text-slate-700 dark:text-slate-300">{title}</h3>
      </div>

      {/* Hero Total Section */}
      <div className="mb-10 relative z-10">
        {totalLabel && (
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm sm:text-base mb-3">{totalLabel}</p>
        )}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[clamp(3rem,10vw,4.5rem)] leading-none font-black tracking-tighter bg-gradient-to-r from-orange-500 to-rose-400 dark:from-orange-400 dark:to-rose-300 bg-clip-text text-transparent break-all sm:break-normal">
            {totalValue}
          </span>
          <div className="flex flex-col text-left">
            {totalUnit && (
              <span className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">{totalUnit}</span>
            )}
            {subtitle && (
              <span className="text-sm font-medium text-slate-500 dark:text-slate-500">{subtitle}</span>
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
