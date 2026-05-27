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
    <div className="fixed bottom-0 left-0 right-0 z-[80] md:hidden w-full pointer-events-none">
      <nav 
        className="w-full h-[64px] pointer-events-auto"
        style={{
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex w-full h-[64px]">
          {NAV_ITEMS.map((item) => {
            const isActive = localActive === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                className="relative flex-1 flex flex-col items-center justify-center h-full active:bg-[#E8541A]/[0.15] transition-colors"
                aria-label={item.label}
              >
                <div className="relative flex flex-col items-center justify-center z-10 w-full h-full">
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="relative flex flex-col items-center justify-center pointer-events-none"
                    style={{ padding: '6px 18px' }}
                  >
                    {/* Floating Pill Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-pill"
                        className="absolute inset-0 bg-[#E8541A] z-[-1]"
                        style={{ borderRadius: '20px' }}
                        transition={{
                          type: "tween",
                          ease: [0.34, 1.56, 0.64, 1],
                          duration: 0.4
                        }}
                      />
                    )}
                    
                    <Icon 
                      size={22} 
                      strokeWidth={1.5} 
                      className={`mb-[2px] transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#9CA3AF]'
                      }`}
                      fill={isActive ? "currentColor" : "none"}
                    />
                    <span 
                      className={`font-semibold tracking-[0.3px] transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#9CA3AF]'
                      }`}
                      style={{ 
                        fontSize: '10px',
                        fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif"
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
