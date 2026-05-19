import React from 'react';

export interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral';
  className?: string;
}

export function ResultCard({
  title,
  value,
  unit,
  icon,
  description,
  variant = 'neutral',
  className = ''
}: ResultCardProps) {
  const variants = {
    primary: 'bg-indigo-500/10 dark:bg-indigo-500/10 border-indigo-200/50 dark:border-indigo-800/30 text-indigo-900 dark:text-indigo-100',
    secondary: 'bg-blue-500/10 dark:bg-blue-500/10 border-blue-200/50 dark:border-blue-800/30 text-blue-900 dark:text-blue-100',
    success: 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100',
    warning: 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-200/50 dark:border-amber-800/30 text-amber-900 dark:text-amber-100',
    neutral: 'bg-slate-500/5 dark:bg-slate-500/5 border-slate-200/50 dark:border-slate-800/30 text-slate-900 dark:text-slate-100',
  };

  const iconColors = {
    primary: 'text-indigo-500 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm',
    secondary: 'text-blue-500 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm',
    success: 'text-emerald-500 dark:text-emerald-400 bg-white dark:bg-slate-900 shadow-sm',
    warning: 'text-amber-500 dark:text-amber-400 bg-white dark:bg-slate-900 shadow-sm',
    neutral: 'text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm',
  };
  
  const badgeColors = {
    primary: 'bg-indigo-500 text-white shadow-indigo-500/20',
    secondary: 'bg-blue-500 text-white shadow-blue-500/20',
    success: 'bg-emerald-500 text-white shadow-emerald-500/20',
    warning: 'bg-amber-500 text-white shadow-amber-500/20',
    neutral: 'bg-slate-700 text-white shadow-slate-500/20',
  };

  const baseClass = variants[variant] || variants.neutral;
  const bgClass = iconColors[variant] || iconColors.neutral;
  const badgeClass = badgeColors[variant] || badgeColors.neutral;

  return (
    <div className={`p-5 rounded-[24px] border ${baseClass} flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 min-w-0 overflow-hidden backdrop-blur-xl group relative ${className}`}>
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 ease-out" />
      
      <div className="flex items-start justify-between gap-3 mb-5 relative z-10">
        <h4 className="text-xs font-black opacity-80 uppercase tracking-widest leading-snug truncate">
          {title}
        </h4>
        {icon && (
          <div className={`p-2.5 rounded-full flex-shrink-0 ${bgClass} transition-transform group-hover:scale-110 duration-300`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mt-auto flex-wrap sm:flex-nowrap relative z-10">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight break-all sm:break-normal px-4 py-1.5 rounded-full shadow-lg ${badgeClass}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-bold opacity-80 flex-shrink-0 bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded-full border border-current/10">
            {unit}
          </span>
        )}
      </div>
      {description && (
        <p className="text-[11px] opacity-75 mt-4 font-bold line-clamp-2 leading-relaxed tracking-wide relative z-10">
          {description}
        </p>
      )}
    </div>
  );
}
