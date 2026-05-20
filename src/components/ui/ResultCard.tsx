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
    primary: 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-800/50 shadow-[0_4px_24px_rgba(79,70,229,0.06)] dark:shadow-[0_4px_24px_rgba(79,70,229,0.2)] text-indigo-900 dark:text-indigo-100',
    secondary: 'bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-800/50 shadow-[0_4px_24px_rgba(59,130,246,0.06)] dark:shadow-[0_4px_24px_rgba(59,130,246,0.2)] text-blue-900 dark:text-blue-100',
    success: 'bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-800/50 shadow-[0_4px_24px_rgba(16,185,129,0.06)] dark:shadow-[0_4px_24px_rgba(16,185,129,0.2)] text-emerald-900 dark:text-emerald-100',
    warning: 'bg-white dark:bg-slate-900 border-amber-100 dark:border-amber-800/50 shadow-[0_4px_24px_rgba(245,158,11,0.06)] dark:shadow-[0_4px_24px_rgba(245,158,11,0.2)] text-amber-900 dark:text-amber-100',
    neutral: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-slate-900 dark:text-slate-100',
  };

  const iconColors = {
    primary: 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40',
    secondary: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40',
    success: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40',
    warning: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/40',
    neutral: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800',
  };

  const baseClass = variants[variant] || variants.neutral;
  const bgClass = iconColors[variant] || iconColors.neutral;

  return (
    <div className={`p-5 sm:p-6 min-h-[140px] rounded-[24px] border ${baseClass} flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg break-words w-full ${className}`}>
      <div className="flex items-start justify-between gap-3 w-full">
        <h4 className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-wider leading-relaxed text-balance">
          {title}
        </h4>
        {icon && (
          <div className={`p-2.5 rounded-full flex-shrink-0 ${bgClass}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black tracking-tight break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold opacity-70">
              {unit}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[11px] sm:text-xs opacity-75 font-medium leading-relaxed max-w-full break-words">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
