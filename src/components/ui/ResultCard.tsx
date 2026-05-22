import React from 'react';
import { motion } from 'motion/react';

export interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'dark';
  className?: string;
  delay?: number;
}

export function ResultCard({
  title,
  value,
  unit,
  icon,
  badge,
  description,
  variant = 'neutral',
  className = '',
  delay = 0,
}: ResultCardProps) {
  const accentColors = {
    primary: 'text-indigo-600 dark:text-indigo-400',
    secondary: 'text-blue-600 dark:text-blue-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    neutral: 'text-slate-600 dark:text-slate-400'
  };

  const bgStyles = {
    primary: 'bg-white dark:bg-white/5',
    secondary: 'bg-white dark:bg-white/5',
    success: 'bg-white dark:bg-white/5',
    warning: 'bg-white dark:bg-white/5',
    neutral: 'bg-white dark:bg-white/5'
  };

  const accentColor = accentColors[variant] || accentColors.neutral;
  const bgStyle = bgStyles[variant] || bgStyles.neutral;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`relative p-5 sm:p-6 rounded-[28px] backdrop-blur-3xl border border-slate-200/50 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 w-full overflow-hidden ${bgStyle} ${className}`}
    >
      <div className="flex items-center justify-between gap-3 w-full relative z-10">
        <div className="flex items-center gap-2">
           {icon && (
            <div className={`flex-shrink-0 ${accentColor}`}>
              {icon}
            </div>
          )}
          <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] ${accentColor}`}>
            {title}
          </h4>
        </div>
        {badge && (
          <div className="flex-shrink-0 flex items-center bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-col w-full relative z-10 mt-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black tracking-tighter whitespace-nowrap text-slate-800 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="text-[13px] sm:text-sm font-semibold ml-1 text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          )}
        </div>
        {description && (
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-full break-words mt-1">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );
}
