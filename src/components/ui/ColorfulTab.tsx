import React from 'react';

interface ColorfulTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  colorTheme?: 'blue' | 'indigo' | 'orange' | 'teal' | 'rose' | 'emerald' | 'amber' | 'cyan' | 'slate';
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

export default function ColorfulTab({ id, label, icon, isActive, onClick, colorTheme = 'indigo' }: ColorfulTabProps) {
  const activeClasses = isActive 
    ? colorMap[colorTheme] + ' shadow-sm scale-105' 
    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800 border-transparent hover:text-slate-700 dark:hover:text-slate-300';

  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border ${activeClasses}`}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
