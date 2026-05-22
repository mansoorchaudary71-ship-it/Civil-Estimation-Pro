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
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:to-violet-500 dark:before:from-indigo-400 dark:before:to-violet-400'
  },
  emerald: {
    bg: 'bg-emerald-50/50 dark:bg-emerald-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-emerald-500 before:to-teal-500 dark:before:from-emerald-400 dark:before:to-teal-400'
  },
  amber: {
    bg: 'bg-amber-50/50 dark:bg-amber-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-amber-500 before:to-orange-500 dark:before:from-amber-400 dark:before:to-orange-400'
  },
  rose: {
    bg: 'bg-rose-50/50 dark:bg-rose-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-rose-500 before:to-pink-500 dark:before:from-rose-400 dark:before:to-pink-400'
  },
  blue: {
    bg: 'bg-blue-50/50 dark:bg-blue-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-blue-500 before:to-indigo-500 dark:before:from-blue-400 dark:before:to-indigo-400'
  },
  fuchsia: {
    bg: 'bg-fuchsia-50/50 dark:bg-fuchsia-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500 dark:from-fuchsia-400 dark:to-purple-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-fuchsia-500 before:to-purple-500 dark:before:from-fuchsia-400 dark:before:to-purple-400'
  },
  teal: {
    bg: 'bg-teal-50/50 dark:bg-teal-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 dark:from-teal-400 dark:to-emerald-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-teal-500 before:to-emerald-500 dark:before:from-teal-400 dark:before:to-emerald-400'
  },
  orange: {
    bg: 'bg-orange-50/50 dark:bg-orange-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-orange-500 before:to-amber-500 dark:before:from-orange-400 dark:before:to-amber-400'
  },
  violet: {
    bg: 'bg-violet-50/50 dark:bg-violet-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-violet-500 before:to-fuchsia-500 dark:before:from-violet-400 dark:before:to-fuchsia-400'
  },
  cyan: {
    bg: 'bg-cyan-50/50 dark:bg-cyan-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-cyan-500 before:to-blue-500 dark:before:from-cyan-400 dark:before:to-blue-400'
  },
  sky: {
    bg: 'bg-sky-50/50 dark:bg-sky-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-400 dark:to-indigo-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-sky-500 before:to-indigo-500 dark:before:from-sky-400 dark:before:to-indigo-400'
  },
  lime: {
    bg: 'bg-lime-50/50 dark:bg-lime-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-lime-500 before:to-emerald-500 dark:before:from-lime-400 dark:before:to-emerald-400'
  },
  pink: {
    bg: 'bg-pink-50/50 dark:bg-pink-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-400 dark:to-rose-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-pink-500 before:to-rose-500 dark:before:from-pink-400 dark:before:to-rose-400'
  },
  purple: {
    bg: 'bg-purple-50/50 dark:bg-purple-500/10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-500 dark:from-purple-400 dark:to-violet-400',
    border: 'before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-purple-500 before:to-violet-500 dark:before:from-purple-400 dark:before:to-violet-400'
  }
};

const cyclicColors = ['indigo', 'emerald', 'amber', 'rose', 'blue', 'fuchsia', 'teal', 'orange', 'violet', 'cyan', 'sky', 'lime', 'pink', 'purple'];

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
      className={`snap-start group relative z-10 flex-shrink-0 flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 font-bold text-[15px] sm:text-[16px] tracking-tight transition-all duration-300 rounded-[24px] sm:rounded-t-[24px] sm:rounded-b-none overflow-hidden ${activeClasses}`}
    >
      {icon && (
        <span className={`w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isActive ? themeClasses.text.replace('text-transparent bg-clip-text ', '') : 'opacity-70'}`}>
             {React.cloneElement(icon as React.ReactElement, {
                className: `${(icon as React.ReactElement).props.className || ''} w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`
             })}
        </span>
      )}
      <span className={`whitespace-nowrap leading-none pt-[1px] ${isActive ? themeClasses.text : 'opacity-80'}`}>
        {label}
      </span>
    </button>
  );
}
