import React, { useState, useEffect } from 'react';
import { ModuleId } from './Sidebar';
import { Compass, Clock, Bookmark, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavBarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onOpenProfile: () => void;
}

export default function BottomNavBar({ activeModule, onSelectModule, onOpenProfile }: BottomNavBarProps) {
  const [localActive, setLocalActive] = useState('home');

  useEffect(() => {
    // Optionally sync with external activeModule if it matches our bottom nav categories
    if (['home', 'my-estimates', 'saved', 'profile'].includes(activeModule)) {
      setLocalActive(activeModule === 'my-estimates' ? 'recent' : activeModule);
    }
  }, [activeModule]);

  const NAV_ITEMS = [
    { id: 'home', label: 'All Tools', icon: Compass },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: UserIcon }
  ];

  const handleTabClick = (id: string) => {
    setLocalActive(id);
    if (id === 'profile') {
      onOpenProfile();
    } else if (id === 'recent') {
      onSelectModule('my-estimates' as ModuleId);
    } else if (id === 'saved') {
      onSelectModule('saved' as ModuleId);
    } else {
      onSelectModule(id as ModuleId);
    }
  };

  return (
    // REPLACE THIS SECTION
    <div className="fixed bottom-4 left-4 right-4 z-[80] md:hidden pointer-events-none flex justify-center">
      <nav 
        className="w-full max-w-sm h-[68px] pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_16px_40px_-8px_rgba(26,26,58,0.2)] rounded-full px-2"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 0px)', // adjust for safe area only if necessary, but it's floating so it usually is fine without it.
        }}
      >
        <div className="flex w-full h-[68px] items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = localActive === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                className="relative flex-1 flex flex-col items-center justify-center h-14 rounded-full active:scale-95 transition-all outline-none"
                aria-label={item.label}
              >
                <div className="relative flex flex-col items-center justify-center z-10 w-full h-full">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="relative flex flex-col items-center justify-center pointer-events-none w-full h-full rounded-full"
                  >
                    {/* Floating Pill Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-pill"
                        className="absolute inset-x-1 inset-y-0.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 shadow-[0_4px_16px_rgba(236,72,153,0.4)] rounded-full z-[-1]"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                    
                    <Icon 
                      size={20} 
                      strokeWidth={isActive ? 2 : 1.5} 
                      className={`mb-1 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#4A4E69]'
                      }`}
                      fill={isActive ? "currentColor" : "none"}
                    />
                    <span 
                      className={`font-semibold tracking-wide transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#4A4E69]'
                      }`}
                      style={{ 
                        fontSize: '9px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
