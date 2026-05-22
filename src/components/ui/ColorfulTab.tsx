import React from 'react';

interface ColorfulTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  colorTheme?: string;
  index?: number;
}

const activeBgStyles: Record<string, { bg: string, text: string, border: string }> = {
  indigo: {
    bg: 'bg-indigo-50/50 dark:bg-indigo-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-indigo-600 before:to-purple-600 dark:before:from-indigo-400 dark:before:to-purple-400'
  },
  emerald: {
    bg: 'bg-emerald-50/50 dark:bg-emerald-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-emerald-600 before:to-teal-600 dark:before:from-emerald-400 dark:before:to-teal-400'
  },
  amber: {
    bg: 'bg-amber-50/50 dark:bg-amber-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-amber-600 before:to-orange-600 dark:before:from-amber-400 dark:before:to-orange-400'
  },
  rose: {
    bg: 'bg-rose-50/50 dark:bg-rose-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-rose-600 before:to-pink-600 dark:before:from-rose-400 dark:before:to-pink-400'
  },
  blue: {
    bg: 'bg-blue-50/50 dark:bg-blue-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-blue-600 before:to-cyan-600 dark:before:from-blue-400 dark:before:to-cyan-400'
  },
  fuchsia: {
    bg: 'bg-fuchsia-50/50 dark:bg-fuchsia-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 dark:from-fuchsia-400 dark:to-purple-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-fuchsia-600 before:to-purple-600 dark:before:from-fuchsia-400 dark:before:to-purple-400'
  },
  teal: {
    bg: 'bg-teal-50/50 dark:bg-teal-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-teal-600 before:to-emerald-600 dark:before:from-teal-400 dark:before:to-emerald-400'
  },
  orange: {
    bg: 'bg-orange-50/50 dark:bg-orange-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-orange-600 before:to-amber-600 dark:before:from-orange-400 dark:before:to-amber-400'
  },
};

const cyclicColors = ['indigo', 'emerald', 'amber', 'rose', 'blue', 'fuchsia', 'teal', 'orange'];

export default function ColorfulTab({ id, label, icon, isActive, onClick, colorTheme = 'indigo', index }: ColorfulTabProps) {
  let theme = colorTheme;
  if (index !== undefined) {
     theme = cyclicColors[index % cyclicColors.length];
  } else if (colorTheme === 'slate') {
     theme = cyclicColors[(label.length) % cyclicColors.length];
  }

  const themeClasses = activeBgStyles[theme] || activeBgStyles['indigo'];
  const activeClasses = isActive ? themeClasses.bg + ' ' + themeClasses.border : 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50';

  return (
    <button
      onClick={onClick}
      className={`snap-start group relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 font-bold text-sm transition-all duration-300 rounded-t-lg overflow-hidden ${activeClasses}`}
    >
      {icon && (
        <span className={`w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isActive ? themeClasses.text.replace('text-transparent bg-clip-text ', '') : 'opacity-70'}`}>
             {React.cloneElement(icon as React.ReactElement, {
                className: `${(icon as React.ReactElement).props.className || ''} ${isActive ? 'drop-shadow-sm' : ''}`
             })}
        </span>
      )}
      <span className={`whitespace-nowrap tracking-wide leading-none pt-[1px] ${isActive ? themeClasses.text : 'opacity-80'}`}>
        {label}
      </span>
    </button>
  );
}
