import React from 'react';

interface ColorfulTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  colorTheme?: 'blue' | 'indigo' | 'orange' | 'teal' | 'rose' | 'emerald' | 'amber' | 'cyan' | 'slate';
}

const activeBgStyles = {
  blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 border-transparent',
  indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-transparent',
  orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20 border-transparent',
  teal: 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20 border-transparent',
  rose: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/20 border-transparent',
  emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20 border-transparent',
  amber: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 border-transparent',
  cyan: 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-500/20 border-transparent',
  slate: 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-md shadow-slate-500/20 border-transparent',
};

const inactiveBgStyle = 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-transparent shadow-sm hover:shadow cursor-pointer border border-slate-200/50 dark:border-slate-800';

export default function ColorfulTab({ id, label, icon, isActive, onClick, colorTheme = 'indigo' }: ColorfulTabProps) {
  const activeClasses = isActive ? activeBgStyles[colorTheme] + ' ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-' + colorTheme + '-500/50 scale-[1.02]' : inactiveBgStyle;

  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border ${activeClasses}`}
    >
      {icon && (
        <span className={`w-5 h-5 flex items-center justify-center ${isActive ? 'text-white/90' : 'text-slate-400 group-hover:text-slate-600'}`}>
          {icon}
        </span>
      )}
      <span className="whitespace-nowrap tracking-wide">{label}</span>
    </button>
  );
}
