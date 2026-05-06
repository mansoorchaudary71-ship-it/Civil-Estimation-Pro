import React, { useState, useRef, useEffect } from 'react';
import { Layers, Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
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
    <>
      <div className="w-full px-4 py-3 bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 shrink-0 h-14 transition-colors duration-300 flex items-center justify-between relative z-30">
          
          <div className="flex items-center gap-2 lg:gap-3 cursor-pointer group shrink-0">
            <div className="w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Logo className="w-8 h-8" />
            </div>
            <span className="font-bold text-[1.1rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
              Civil Estimation Pro
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-1 flex-1 px-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <GlobalSettingsToggle />
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  Sign In
                </button>
                <button 
                  onClick={onOpenAuth}
                  className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-sm hover:shadow transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden text-blue-600 dark:text-blue-400">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Settings className="w-4 h-4" /> Account Settings
                      </button>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden text-blue-600 dark:text-blue-400">
                 {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
              </div>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
      </div>

      <div 
        className={`md:hidden absolute top-14 left-0 w-full px-4 mb-4 z-20 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 rounded-3xl p-4 shadow-xl flex flex-col gap-2 relative shadow-black/10 mt-2">
          {isAuthenticated && (
             <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 mb-2 flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
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
              className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left pl-4"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuth?.(); }}
                className="px-4 py-3 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md flex justify-center mt-2 hover:from-blue-600 hover:to-purple-700"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenProfile?.(); }} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                <Settings className="w-5 h-5 text-slate-500" /> Account Settings
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left mt-1"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
