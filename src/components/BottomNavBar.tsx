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

  // Make the bottom nav an ultra-modern frosted glass element.
  return (
    <nav className="fixed bottom-6 left-6 right-6 z-40 bg-slate-900/90 backdrop-blur-[20px] border border-slate-700/50 rounded-full shadow-lg flex items-center justify-around px-2 py-3 md:hidden overflow-visible" style={{ WebkitBackdropFilter: "blur(20px)" }}>
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
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center flex-1 w-0 gap-1 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isActive ? 'text-[#6c63ff]' : 'text-[#a0aec0] hover:text-white'}`}
    >
      <div className={`flex items-center justify-center transition-all duration-500 will-change-transform ${isActive ? '-translate-y-3 scale-110 drop-shadow-[0_0_12px_rgba(108,99,255,0.6)]' : 'drop-shadow-sm hover:scale-105'} [&>svg]:w-[24px] [&>svg]:h-[24px]`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap truncate max-w-full px-0.5 transition-all duration-300 ${isActive ? 'opacity-100 drop-shadow-[0_0_8px_rgba(108,99,255,0.8)] translate-y-1' : 'opacity-70'}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#6c63ff] animate-pulse shadow-[0_0_10px_rgba(108,99,255,1)]" />
      )}
    </button>
  );
}
