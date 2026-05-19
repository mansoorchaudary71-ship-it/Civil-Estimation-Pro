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
      className={`relative flex flex-col items-center justify-center flex-1 w-0 gap-1 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isActive ? 'text-[#6c63ff] dark:text-[#8b85ff]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
      <div className={`flex items-center justify-center transition-all duration-500 will-change-transform ${isActive ? '-translate-y-2 scale-110 drop-shadow-[0_0_12px_rgba(108,99,255,0.4)]' : 'drop-shadow-none hover:scale-105'} [&>svg]:w-[24px] [&>svg]:h-[24px]`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap truncate max-w-full px-0.5 transition-all duration-300 ${isActive ? 'opacity-100 drop-shadow-[0_0_8px_rgba(108,99,255,0.8)]' : 'opacity-70'}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute -top-1 w-1 h-1 rounded-full bg-[#6c63ff] shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
      )}
    </button>
  );
}

