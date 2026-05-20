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
    <div className="fixed bottom-5 left-0 right-0 z-[80] flex justify-center md:hidden pointer-events-none px-4">
      <nav 
        className="pointer-events-auto flex items-center justify-around w-full max-w-md px-2 py-3 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        style={{ WebkitBackdropFilter: "blur(20px)" }}
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
      className={`group relative flex flex-col items-center justify-center flex-1 w-0 gap-1.5 rounded-2xl transition-all duration-300 ease-out ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
      <div className={`flex items-center justify-center transition-all duration-300 ease-out ${isActive ? '-translate-y-1 scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5 group-active:scale-95'} [&>svg]:w-[22px] [&>svg]:h-[22px]`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100 font-extrabold' : 'opacity-70 group-hover:opacity-100'}`}>
        {label}
      </span>
      {/* Active Indicator Pille */}
      <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
    </button>
  );
}

