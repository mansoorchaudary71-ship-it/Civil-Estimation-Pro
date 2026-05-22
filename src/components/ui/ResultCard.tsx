import React from 'react';
import { motion } from 'motion/react';

export interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'dark' | 'info' | 'purple' | 'cyan' | 'pink' | 'yellow';
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
  const accentColors: Record<string, string> = {
    primary: 'text-orange-600 dark:text-orange-400',
    secondary: 'text-indigo-500 dark:text-indigo-400',
    success: 'text-emerald-500 dark:text-emerald-400',
    warning: 'text-rose-500 dark:text-rose-400',
    info: 'text-blue-500 dark:text-blue-400',
    purple: 'text-purple-500 dark:text-purple-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    pink: 'text-pink-500 dark:text-pink-400',
    yellow: 'text-amber-500 dark:text-amber-400',
    neutral: 'text-slate-600 dark:text-slate-400',
    dark: 'text-slate-800 dark:text-slate-200'
  };

  const bgStyles: Record<string, string> = {
    primary: 'bg-white dark:bg-white/5',
    secondary: 'bg-white dark:bg-white/5',
    success: 'bg-white dark:bg-white/5',
    warning: 'bg-white dark:bg-white/5',
    info: 'bg-white dark:bg-white/5',
    purple: 'bg-white dark:bg-white/5',
    cyan: 'bg-white dark:bg-white/5',
    pink: 'bg-white dark:bg-white/5',
    yellow: 'bg-white dark:bg-white/5',
    neutral: 'bg-white dark:bg-white/5',
    dark: 'bg-slate-50 dark:bg-slate-900/50'
  };

  // Auto-assign colorful variants to create a One UI / Gemini mixed-gradient feel.
  // We override legacy hardcoded variants to ensure visual variety across the interface, unless it's strictly neutral or dark.
  let activeVariant = variant;
  if (variant !== 'neutral' && variant !== 'dark') {
    const mixedVariants = ['primary', 'secondary', 'success', 'warning', 'info', 'purple', 'cyan', 'pink', 'yellow'];
    let hash = 0;
    const hashStr = title + (unit ? String(unit) : '');
    for (let i = 0; i < hashStr.length; i++) {
        hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    activeVariant = mixedVariants[Math.abs(hash) % mixedVariants.length];
  }

  const accentColor = accentColors[activeVariant] || accentColors.neutral;
  const bgStyle = bgStyles[activeVariant] || bgStyles.neutral;

  const textGradients: Record<string, string> = {
    primary: 'bg-gradient-to-br from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-br from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300 bg-clip-text text-transparent',
    success: 'bg-gradient-to-br from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent',
    warning: 'bg-gradient-to-br from-rose-500 to-orange-500 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent',
    info: 'bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent',
    purple: 'bg-gradient-to-br from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-300 bg-clip-text text-transparent',
    cyan: 'bg-gradient-to-br from-cyan-600 to-sky-500 dark:from-cyan-400 dark:to-sky-300 bg-clip-text text-transparent',
    pink: 'bg-gradient-to-br from-pink-600 to-rose-500 dark:from-pink-400 dark:to-rose-300 bg-clip-text text-transparent',
    yellow: 'bg-gradient-to-br from-amber-600 to-yellow-500 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent',
    neutral: 'bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent',
    dark: 'text-slate-800 dark:text-white',
  };

  const textGrad = textGradients[activeVariant] || textGradients.neutral;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`relative p-5 sm:p-6 rounded-[28px] backdrop-blur-3xl border border-slate-200/50 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 w-full overflow-hidden ${bgStyle} ${className}`}
    >
      <div className="flex items-center justify-between gap-3 w-full relative z-10">
        <div className="flex items-center gap-2 max-w-[80%]">
           {icon && (
            <div className={`p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex-shrink-0 border border-slate-100 dark:border-white/5 ${accentColor}`}>
              {icon}
            </div>
          )}
          <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate ${accentColor}`}>
            {title}
          </h4>
        </div>
        {badge && (
          <div className="flex-shrink-0 flex items-center bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-col w-full relative z-10 mt-1 overflow-hidden">
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span className={`text-[clamp(1.5rem,7vw,3rem)] leading-none font-black tracking-tighter break-words max-w-full ${textGrad}`}>
            {value}
          </span>
          {unit && (
            <span className={`text-[13px] sm:text-sm font-semibold ml-1 shrink-0 ${accentColor}`}>
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
