import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { GlobalSettingsToggle } from './ui/GlobalSettingsToggle';
import { useAuth } from '../contexts/AuthContext';
import { ModuleId } from './Sidebar';

export default function TopNavbar({ 
  onOpenSidebar, 
  onOpenAuth, 
  onOpenProfile,
  onNavigate
}: { 
  onOpenSidebar?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (id: ModuleId) => void;
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logOut } = useAuth();
  
  const isAuthenticated = !!user;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await logOut();
    setIsProfileMenuOpen(false);
  };

  const navItems = [
    { name: 'Estimator', id: 'house' as ModuleId },
    { name: 'Materials', id: 'calculators' as ModuleId },
    { name: 'Reports', id: 'my-estimates' as ModuleId },
    { name: 'Contact', id: 'contact' as ModuleId },
  ];

  return (
    <div className="w-full relative shrink-0 z-40 bg-transparent px-6 py-4 md:px-12 md:py-6">
      <div className="w-full flex items-center justify-between mx-auto max-w-[1400px]">
        
        {/* Left: Logo */}
        <div className="flex items-center justify-start cursor-pointer group shrink-0" onClick={() => onNavigate?.('home' as ModuleId)}>
          <span className="font-heading font-black text-2xl md:text-3xl tracking-tighter text-[#111111] dark:text-white">
            Civil Pro.
          </span>
        </div>

        {/* Center: Slash navigation links */}
        <div className="hidden lg:flex items-center justify-start ml-12">
          {navItems.map((link, index) => (
            <React.Fragment key={link.name}>
              <button 
                onClick={() => onNavigate?.(link.id)}
                className="text-[15px] font-medium text-slate-500 hover:text-[#111111] dark:hover:text-white transition-colors tracking-tight"
              >
                {link.name}
              </button>
              {index < navItems.length - 1 && (
                <span className="mx-4 text-slate-300 dark:text-slate-700 font-light select-none">/</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Left: Hamburger */}
        <div className="lg:hidden flex items-center justify-start ml-4">
          <button 
            onClick={() => onOpenSidebar?.()}
            className="p-2 rounded-md text-[#111111] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <Menu className="w-6 h-6 transform group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center justify-end flex-1 gap-6">
          <div className="hidden md:block">
            <GlobalSettingsToggle />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate?.('contact' as ModuleId)}
              className="text-[15px] font-medium text-slate-500 hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              Support
            </button>
            
            {!isAuthenticated ? (
              <button 
                onClick={onOpenAuth}
                className="text-[15px] font-medium text-slate-500 hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                Login
              </button>
            ) : (
              <div ref={profileRef} className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 text-[15px] font-medium text-slate-500 hover:text-[#111111] dark:hover:text-white transition-colors"
                >
                  <span className="truncate max-w-[100px]">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-[140%] w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="text-sm font-bold text-[#111111] dark:text-white truncate">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Settings className="w-4 h-4" /> Account Settings
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => onNavigate?.('house' as ModuleId)}
            className="px-6 py-2.5 rounded-full text-[15px] font-semibold text-white bg-[#111111] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap hidden sm:block"
          >
            Start Estimating
          </button>
        </div>
      </div>
    </div>
  );
}
