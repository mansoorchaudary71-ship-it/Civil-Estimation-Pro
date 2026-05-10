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
  // Define what belongs to tools (most modules)
  const isTools = activeModule !== 'home' && activeModule !== 'my-estimates' && activeModule !== 'rates' && activeModule !== 'about' && activeModule !== 'contact' && activeModule !== 'careers' && activeModule !== 'blog';

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-around px-2 py-2 md:hidden">
      <NavItem 
        icon={<Home className="w-[22px] h-[22px]" />} 
        label="Home" 
        isActive={isHome} 
        onClick={() => onSelectModule('home')} 
      />
      <NavItem 
        icon={<FileText className="w-[22px] h-[22px]" />} 
        label="My Estimates" 
        isActive={isMyEstimates}
        onClick={() => onSelectModule('my-estimates')} 
      />
      <NavItem 
        icon={<Wrench className="w-[22px] h-[22px]" />} 
        label="Tools" 
        isActive={isTools} 
        onClick={() => onSelectModule('calculators')} 
      />
      <NavItem 
        icon={<Info className="w-[22px] h-[22px]" />} 
        label="About" 
        isActive={isAbout} 
        onClick={() => onSelectModule('about')} 
      />
      <NavItem 
        icon={<User className="w-[22px] h-[22px]" />} 
        label="Profile" 
        isActive={false} 
        onClick={onOpenProfile} 
      />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[64px] flex-1 py-1 gap-1 rounded-2xl transition-all duration-300 relative ${isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}`}
    >
      <div className={`flex items-center justify-center transition-transform ${isActive ? '-translate-y-1' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] whitespace-nowrap transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
      {isActive && (
        <div className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 font-bold" />
      )}
    </button>
  );
}
