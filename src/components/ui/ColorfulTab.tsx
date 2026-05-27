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

const tabStyles: Record<string, { text: string, border: string }> = {
  blue: { text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500' },
  red: { text: 'text-red-600 dark:text-red-400', border: 'border-red-500' },
  emerald: { text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500' },
  purple: { text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500' },
  orange: { text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500' },
  teal: { text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500' },
  fuchsia: { text: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'border-fuchsia-500' },
  amber: { text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500' },
  indigo: { text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' },
};

const cyclicColors = ['indigo', 'emerald', 'amber', 'red', 'blue', 'fuchsia', 'teal', 'orange', 'purple'];

const getHashStr = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function ColorfulTab({ id, label, icon, isActive, onClick, index }: ColorfulTabProps) {
  let themeObj;
  
  if (index !== undefined) {
    themeObj = tabStyles[cyclicColors[index % cyclicColors.length]];
  } else {
    // Deterministic index based on id
    const hash = getHashStr(id || label);
    themeObj = tabStyles[cyclicColors[hash % cyclicColors.length]];
  }

  // Active state: white bg, shadow-sm, coloured border-b-3, tinted text
  // Inactive state: transparent or very faint gray bg, transparent border-b-3, muted text
  const activeClasses = isActive 
    ? `bg-white dark:bg-[#151821] shadow-sm shadow-slate-200/50 dark:shadow-black/20 border-b-[3px] ${themeObj.border} z-20` 
    : 'bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 border-b-[3px] border-transparent z-10';

  const textClasses = isActive 
    ? `${themeObj.text} opacity-100` 
    : 'text-slate-500 dark:text-slate-400 opacity-80 group-hover:opacity-100 group-hover:text-slate-700 dark:group-hover:text-slate-300';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: isActive ? 0 : -1 }}
      whileTap={{ scale: 0.98 }}
      className={`relative snap-start group flex-shrink-0 flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 transition-colors duration-300 rounded-t-xl rounded-b-none ${activeClasses}`}
    >
      {icon && (
        <span className={`w-[18px] h-[18px] flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'} ${textClasses}`}>
          {React.cloneElement(icon as React.ReactElement<any>, {
            className: `${(icon as React.ReactElement<any>).props.className || ''} w-full h-full`
          })}
        </span>
      )}
      <span className={`whitespace-nowrap pt-[1px] text-[14px] sm:text-[15px] font-bold tracking-tight transition-colors duration-300 ${textClasses}`}>
        {label}
      </span>
    </motion.button>
  );
}

// Reusable generic tab list component
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export function TabsComponent({ 
  tabs, 
  activeTab, 
  onChange,
  className = ""
}: { 
  tabs: TabItem[], 
  activeTab: string, 
  onChange: (id: string) => void,
  className?: string
}) {
  return (
    <div className={`flex w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-slate-200/60 dark:border-slate-800/60 ${className}`}>
      <div className="flex px-1 min-w-max">
        {tabs.map((tab, idx) => (
          <ColorfulTab
            key={tab.id}
            id={tab.id}
            index={idx}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}
