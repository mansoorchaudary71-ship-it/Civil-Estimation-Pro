import React from 'react';
import { motion } from 'motion/react';

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
    bg: 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  emerald: {
    bg: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  amber: {
    bg: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  rose: {
    bg: 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-md shadow-rose-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  blue: {
    bg: 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  fuchsia: {
    bg: 'bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-md shadow-fuchsia-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  teal: {
    bg: 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md shadow-teal-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  orange: {
    bg: 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  violet: {
    bg: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-md shadow-violet-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  cyan: {
    bg: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md shadow-cyan-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  sky: {
    bg: 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md shadow-sky-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  lime: {
    bg: 'bg-gradient-to-r from-lime-500 to-emerald-500 shadow-md shadow-lime-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  pink: {
    bg: 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
  },
  purple: {
    bg: 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-md shadow-purple-500/20 text-white',
    text: 'text-white',
    border: 'border-transparent'
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
  const activeClasses = isActive ? themeClasses.bg + ' ' + themeClasses.border : 'bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/50';

  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: isActive ? 1.02 : 1 }}
      whileHover={{ scale: isActive ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`snap-start group relative z-10 flex-shrink-0 flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 font-bold text-[15px] sm:text-[16px] tracking-tight transition-all duration-300 rounded-[24px] sm:rounded-t-[24px] sm:rounded-b-none overflow-hidden ${activeClasses}`}
    >
      {icon && (
        <span className={`w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isActive ? themeClasses.text + ' opacity-100 scale-110' : 'text-slate-500 dark:text-slate-400 opacity-70 group-hover:opacity-100 group-hover:text-slate-800 dark:group-hover:text-slate-200'}`}>
             {React.cloneElement(icon as React.ReactElement<any>, {
                className: `${(icon as React.ReactElement<any>).props.className || ''} w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`
             })}
        </span>
      )}
      <span className={`whitespace-nowrap leading-none pt-[1px] transition-colors duration-300 ${isActive ? themeClasses.text + ' opacity-100 font-extrabold' : 'text-slate-600 dark:text-slate-400 opacity-80 group-hover:opacity-100 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>
        {label}
      </span>
    </motion.button>
  );
}
