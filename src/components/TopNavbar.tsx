import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import Logo from './Logo';
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

  const navLinks = [
    { name: 'Home', id: 'home' as ModuleId },
    { name: 'My Estimates', id: 'my-estimates' as ModuleId },
    { name: 'Tools', id: 'calculators' as ModuleId },
    { name: 'About', id: 'about' as ModuleId },
  ];

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

  return (
    <div className="w-full max-w-7xl mx-auto relative shrink-0 z-40 px-3 md:px-8 pt-4 md:pt-8 pb-2 md:pb-4">
      <div className="w-full px-3 md:px-6 py-2 md:py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/60 dark:border-slate-700/50 rounded-full transition-all duration-300 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        
        {/* Left: Text navigation links */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-start">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => onNavigate?.(link.id)}
              className="px-5 py-2.5 text-[14px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-full transition-all duration-300 whitespace-nowrap"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile Left: Hamburger */}
        <div className="lg:hidden flex items-center justify-start flex-1">
          <button 
            onClick={() => onOpenSidebar?.()}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Center: Logo perfectly centered */}
        <div className="flex items-center justify-center gap-3 cursor-pointer group shrink-0 px-2 sm:px-4">
          <div className="w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:scale-110 text-indigo-600 dark:text-indigo-400">
            <Logo className="w-8 h-8" />
          </div>
          <span className="hidden sm:block font-black text-[19px] tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
            Civil Estimation Pro
          </span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center justify-end gap-3 shrink-0 flex-1">
          <div className="hidden sm:block">
            <GlobalSettingsToggle />
          </div>
          <div className="h-5 w-px bg-slate-200/50 dark:bg-slate-700/50 hidden lg:block mx-1" />
          
          {!isAuthenticated ? (
            <>
              <button 
                onClick={onOpenAuth}
                className="hidden md:block px-5 py-2.5 rounded-full text-[14px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 whitespace-nowrap"
              >
                Sign In
              </button>
              <button 
                onClick={onOpenAuth}
                className="px-6 py-2.5 rounded-full text-[14px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="lg:hidden">
                {user?.photoURL && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-600 dark:text-slate-400">
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div ref={profileRef} className="hidden lg:block relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-600 dark:text-slate-400 group-hover:text-amber-600">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-700/80 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 ring-1 ring-slate-900/5 dark:ring-white/10">
                    <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Settings className="w-4 h-4" /> Account Settings
                      </button>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

