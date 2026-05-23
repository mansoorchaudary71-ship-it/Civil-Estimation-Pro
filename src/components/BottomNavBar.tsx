import React from 'react';
import { ModuleId } from './Sidebar';
import { useSettings } from '../context/SettingsContext';
import { ALL_MODULES } from './Dashboard';

interface BottomNavBarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onOpenProfile: () => void;
}

export default function BottomNavBar({ activeModule, onSelectModule, onOpenProfile }: BottomNavBarProps) {
  const { settings } = useSettings();
  
  // Get 5 most used tools, or default to some popular ones
  const defaultTools = ['house', 'calculators', 'takeoff', 'rates', 'formwork'];
  
  let topTools: string[] = [];
  if (settings.usedTools && settings.usedTools.length > 0) {
    topTools = [...settings.usedTools].reverse().slice(0, 5); // Just using most recent as 'most used' for now
  } 
  
  // Fill the rest with defaults
  if (topTools.length < 5) {
    const remaining = defaultTools.filter(id => !topTools.includes(id));
    topTools = [...topTools, ...remaining].slice(0, 5);
  }

  const bottomModules = topTools.map(id => ALL_MODULES.find(m => m.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-[15px] left-0 right-0 z-[80] flex justify-center md:hidden pointer-events-none">
      <nav 
        className="pointer-events-auto flex items-center justify-around w-[95%] max-w-md px-1 py-3 rounded-[12px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-[10px] border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      >
        {bottomModules.map(m => {
          if (!m) return null;
          const isActive = activeModule === m.id;
          return (
            <NavItem 
              key={m.id}
              icon={<m.icon strokeWidth={2.5} />} 
              label={m.title.slice(0, 8) + (m.title.length > 8 ? '.' : '')} 
              isActive={isActive} 
              onClick={() => onSelectModule(m.id as ModuleId)} 
            />
          );
        })}
      </nav>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center flex-1 w-0 gap-1 rounded-[12px] transition-all duration-300 ease-out ${isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
      <div className={`flex items-center justify-center transition-all duration-300 ease-out ${isActive ? '-translate-y-1 scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5 group-active:scale-95'} [&>svg]:w-[22px] [&>svg]:h-[22px]`}>
        {isActive ? (
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 blur-sm opacity-40 rounded-full" />
             <div className="relative text-[var(--accent-vibrant)] dark:text-cyan-400">
                 {icon}
             </div>
          </div>
        ) : (
          icon
        )}
      </div>
      <span className={`text-[9px] font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100 font-extrabold' : 'opacity-70 group-hover:opacity-100'}`}>
        {label}
      </span>
      {/* Active Indicator Line */}
      <div className={`absolute -bottom-2 w-8 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_2px_8px_rgba(99,102,241,0.5)] transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
    </button>
  );
}

