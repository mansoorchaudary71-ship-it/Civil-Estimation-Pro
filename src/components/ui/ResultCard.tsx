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
    primary: 'bg-[#F0F0C0] dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-100',
    secondary: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 text-blue-900 dark:text-blue-100',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50 text-amber-900 dark:text-amber-100',
    neutral: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100',
  };

  const iconColors = {
    primary: 'text-[#1A1A1A] dark:text-indigo-400 bg-[#F0F0C0]/80 dark:bg-indigo-900/50',
    secondary: 'text-[#1A1A1A] dark:text-blue-400 bg-blue-100/80 dark:bg-blue-900/50',
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/50',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/50',
    neutral: 'text-slate-600 dark:text-slate-700 bg-slate-200/80 dark:bg-slate-700/50',
  };

  const baseClass = variants[variant] || variants.neutral;
  const bgClass = iconColors[variant] || iconColors.neutral;

  return (
    <div className={`p-5 rounded-2xl border ${baseClass} flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest leading-snug truncate">
          {title}
        </h4>
        {icon && (
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${bgClass}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mt-auto flex-wrap sm:flex-nowrap">
        <span className="text-fluid-metric font-black tracking-tight break-all sm:break-normal">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-bold opacity-70 flex-shrink-0">
            {unit}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs opacity-70 mt-3 font-medium line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
