import React from 'react';
import { Home, FileText, Wrench, User, Info } from 'lucide-react';
import { ModuleId } from './Sidebar';

interface BottomNavBarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onOpenProfile: () => void;
}

export default function BottomNavBar({ activeModule, onSelectModule, onOpenProfile }: BottomNavBarProps) {
  const isHome = activeModule === 'home';
  const isAbout = activeModule === 'about';
  const isMyEstimates = activeModule === 'my-estimates';
  const isTools = activeModule !== 'home' && activeModule !== 'my-estimates' && activeModule !== 'rates' && activeModule !== 'about' && activeModule !== 'contact' && activeModule !== 'careers' && activeModule !== 'blog';

  return (
    <div className="fixed bottom-[15px] left-0 right-0 z-[80] flex justify-center md:hidden pointer-events-none">
      <nav 
        className="pointer-events-auto flex items-center justify-around w-[90%] max-w-md px-2 py-3 rounded-[50px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-[10px] border border-white/40 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        style={{ WebkitBackdropFilter: "blur(10px)" }}
      >
        <NavItem 
          icon={<Home strokeWidth={2.5} />} 
          label="Home" 
          isActive={isHome} 
          onClick={() => onSelectModule('home')} 
        />
        <NavItem 
          icon={<FileText strokeWidth={2.5} />} 
          label="Estimates" 
          isActive={isMyEstimates}
          onClick={() => onSelectModule('my-estimates')} 
        />
        <NavItem 
          icon={<Wrench strokeWidth={2.5} />} 
          label="Tools" 
          isActive={isTools} 
          onClick={() => onSelectModule('calculators')} 
        />
        <NavItem 
          icon={<Info strokeWidth={2.5} />} 
          label="About" 
          isActive={isAbout} 
          onClick={() => onSelectModule('about')} 
        />
        <NavItem 
          icon={<User strokeWidth={2.5} />} 
          label="Profile" 
          isActive={false} 
          onClick={onOpenProfile} 
        />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center flex-1 w-0 gap-1 rounded-2xl transition-all duration-300 ease-out ${isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
      <div className={`flex items-center justify-center transition-all duration-300 ease-out ${isActive ? '-translate-y-1 scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5 group-active:scale-95'} [&>svg]:w-[22px] [&>svg]:h-[22px]`}>
        {isActive ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 blur-sm opacity-40 rounded-full" />
            <div className="relative text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-cyan-500">
               {/* As text-transparent bg-clip-text might not work fully for SVG strokes unless it's specifically styled, we use an icon wrapper */}
               <svg width="0" height="0" className="absolute hidden">
                 <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop stopColor="#6366f1" offset="0%" />
                   <stop stopColor="#22d3ee" offset="100%" />
                 </linearGradient>
               </svg>
               <div style={{ stroke: 'url(#activeGradient)' }} className="[&>svg]:stroke-[url(#activeGradient)]">
                 {icon}
               </div>
            </div>
          </div>
        ) : (
          icon
        )}
      </div>
      <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100 font-extrabold' : 'opacity-70 group-hover:opacity-100'}`}>
        {label}
      </span>
      {/* Active Indicator Line */}
      <div className={`absolute -bottom-2 w-8 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_2px_8px_rgba(99,102,241,0.5)] transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
    </button>
  );
}

