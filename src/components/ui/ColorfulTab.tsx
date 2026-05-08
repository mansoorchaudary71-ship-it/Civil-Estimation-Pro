import React from 'react';

interface ColorfulTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  colorTheme?: 'blue' | 'indigo' | 'orange' | 'teal' | 'rose' | 'emerald' | 'amber' | 'cyan' | 'slate';
}

const activeBgStyles: Record<string, string> = {
  blue: 'text-blue-600 border-b-[3px] border-blue-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  indigo: 'text-indigo-600 border-b-[3px] border-indigo-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  orange: 'text-orange-600 border-b-[3px] border-orange-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  teal: 'text-teal-600 border-b-[3px] border-teal-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  rose: 'text-rose-600 border-b-[3px] border-rose-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  emerald: 'text-emerald-600 border-b-[3px] border-emerald-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  amber: 'text-amber-600 border-b-[3px] border-amber-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  cyan: 'text-cyan-600 border-b-[3px] border-cyan-600 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  slate: 'text-slate-800 border-b-[3px] border-slate-800 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
};

const inactiveBgStyle = 'bg-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer border-b-[3px] border-transparent rounded-xl';

export default function ColorfulTab({ id, label, icon, isActive, onClick, colorTheme = 'indigo' }: ColorfulTabProps) {
  const activeClasses = isActive ? activeBgStyles[colorTheme] : inactiveBgStyle;

  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-3 font-bold text-sm transition-all duration-300 ${activeClasses}`}
    >
      {icon && (
        <span className={`w-5 h-5 flex items-center justify-center ${isActive ? '' : 'text-slate-400 group-hover:text-slate-500'}`}>
          {icon}
        </span>
      )}
      <span className="whitespace-nowrap tracking-wide">{label}</span>
    </button>
  );
}
