import React from 'react';

interface ColorfulTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  colorTheme?: 'blue' | 'indigo' | 'orange' | 'teal' | 'rose' | 'emerald' | 'amber' | 'cyan' | 'slate' | 'violet' | 'pink' | 'fuchsia' | 'lime' | 'red' | 'yellow' | 'sky' | 'purple' | 'zinc' | 'stone' | 'neutral' | 'gray';
}

const activeBgStyles: Record<string, string> = {
  blue: 'text-blue-600 border-b-[4px] border-blue-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  indigo: 'text-indigo-600 border-b-[4px] border-indigo-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  orange: 'text-orange-600 border-b-[4px] border-orange-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  teal: 'text-teal-600 border-b-[4px] border-teal-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  rose: 'text-rose-600 border-b-[4px] border-rose-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  emerald: 'text-emerald-600 border-b-[4px] border-emerald-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  amber: 'text-amber-600 border-b-[4px] border-amber-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  cyan: 'text-cyan-600 border-b-[4px] border-cyan-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  slate: 'text-slate-800 border-b-[4px] border-slate-800 bg-white dark:bg-slate-800 dark:text-slate-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  violet: 'text-violet-600 border-b-[4px] border-violet-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  pink: 'text-pink-600 border-b-[4px] border-pink-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  fuchsia: 'text-fuchsia-600 border-b-[4px] border-fuchsia-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  lime: 'text-lime-600 border-b-[4px] border-lime-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  red: 'text-red-600 border-b-[4px] border-red-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  yellow: 'text-yellow-600 border-b-[4px] border-yellow-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  sky: 'text-sky-600 border-b-[4px] border-sky-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  purple: 'text-purple-600 border-b-[4px] border-purple-600 bg-white dark:bg-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  zinc: 'text-zinc-800 border-b-[4px] border-zinc-800 bg-white dark:bg-slate-800 dark:text-zinc-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  stone: 'text-stone-800 border-b-[4px] border-stone-800 bg-white dark:bg-slate-800 dark:text-stone-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  neutral: 'text-neutral-800 border-b-[4px] border-neutral-800 bg-white dark:bg-slate-800 dark:text-neutral-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
  gray: 'text-gray-800 border-b-[4px] border-gray-800 bg-white dark:bg-slate-800 dark:text-gray-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl rounded-b-none',
};

export default function ColorfulTab({ id, label, icon, isActive, onClick, colorTheme = 'indigo' }: ColorfulTabProps) {
  const themeClasses = activeBgStyles[colorTheme] || activeBgStyles['indigo'];

  return (
    <button
      onClick={onClick}
      className={`snap-start group relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 font-bold text-sm transition-all duration-300 ${isActive ? themeClasses + ' opacity-100' : 'text-slate-700 dark:text-slate-700 bg-transparent opacity-80 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 rounded-t-xl rounded-b-none'}`}
    >
      {icon && (
        <span className="w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="whitespace-nowrap tracking-wide">{label}</span>
    </button>
  );
}
