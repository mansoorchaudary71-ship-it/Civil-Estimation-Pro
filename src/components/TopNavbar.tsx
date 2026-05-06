import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { GlobalSettingsToggle } from './ui/GlobalSettingsToggle';
import { useAuth } from '../contexts/AuthContext';

export default function TopNavbar({ 
  onOpenSidebar, 
  onOpenAuth, 
  onOpenProfile 
}: { 
  onOpenSidebar?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logOut } = useAuth();
  
  const isAuthenticated = !!user;

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'My Estimates', href: '#' },
    { name: 'Tools', href: '#' },
    { name: 'Pricing', href: '#' },
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
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full relative shrink-0 z-40">
      <div className="w-full px-4 pt-4 pb-2">
        <div className="w-full px-4 sm:px-6 py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-full transition-colors duration-300 flex items-center justify-between relative z-30 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-900/5 dark:ring-white/10">
          
          <div className="flex items-center gap-2 lg:gap-3 cursor-pointer group shrink-0 pl-1 sm:pl-2">
            <div className="w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:scale-105 text-slate-800 dark:text-white">
              <Logo className="w-8 h-8" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-800 dark:text-slate-100">
              Civil Estimation Pro
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-2 flex-1 px-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 rounded-full transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 pr-1 sm:pr-2">
            <GlobalSettingsToggle />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block mx-1" />
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  Sign In
                </button>
                <button 
                  onClick={onOpenAuth}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 shadow-lg shadow-amber-500/30 active:scale-95 transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
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
            )}
          </div>

          <div className="md:hidden flex items-center gap-3 pr-1">
            <GlobalSettingsToggle />
            {isAuthenticated && (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-600 dark:text-slate-400">
                 {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
              </div>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden absolute top-[4.5rem] left-0 w-full px-4 mb-4 z-20 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-3xl p-4 shadow-xl flex flex-col gap-2 relative mt-4 ring-1 ring-slate-900/5 dark:ring-white/10">
          {isAuthenticated && (
             <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 mb-2 flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
             </div>
          )}
          
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="px-4 py-3 rounded-lg text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 my-2" />
          
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuth?.(); }}
                className="px-4 py-3 rounded-xl text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-slate-800 transition-colors text-left pl-4"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuth?.(); }}
                className="px-4 py-3 rounded-xl text-base font-bold text-white bg-amber-600 shadow-md flex justify-center mt-2 hover:bg-amber-700 transition-colors"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenProfile?.(); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <Settings className="w-5 h-5 text-slate-500" /> Account Settings
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left mt-1"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
