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
    <div className="w-full max-w-7xl mx-auto relative shrink-0 z-40 px-4 md:px-8 pt-5 pb-3">
      <div className="w-full px-4 md:px-8 py-3 transition-all duration-300 flex items-center justify-between">
        
        {/* Left: Logo perfectly centered */}
        <div className="flex items-center justify-start gap-2 cursor-pointer group shrink-0 px-2 sm:px-4">
          <div className="flex items-center justify-center transition-all duration-500 text-slate-900">
            {/* Custom stylized 'P' icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
            </svg>
          </div>
          <span className="hidden sm:block font-bold text-lg md:text-xl tracking-tight text-slate-900 font-sans">
            PreviewLinks
          </span>
        </div>

        {/* Center: Text navigation links */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-start ml-8">
          {[
            { name: 'Integration', id: 'integration' },
            { name: 'Pricing', id: 'pricing' },
            { name: 'Blog', id: 'blog' },
          ].map((link) => (
            <button 
              key={link.name} 
              onClick={() => onNavigate?.(link.id as ModuleId)}
              className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile Left: Hamburger */}
        <div className="lg:hidden flex items-center justify-start ml-4">
          <button 
            onClick={() => onOpenSidebar?.()}
            className="p-2 rounded-md text-slate-800 hover:bg-slate-200 transition-all duration-300"
          >
            <Menu className="w-6 h-6 transform group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center justify-end gap-4 shrink-0 flex-1">
          <div className="hidden sm:block">
            <GlobalSettingsToggle />
          </div>
          
          {!isAuthenticated ? (
            <>
              <button 
                onClick={onOpenAuth}
                className="hidden md:block px-5 py-2.5 rounded-full text-[14px] font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 transition-all duration-300 whitespace-nowrap"
              >
                Sign in
              </button>
              <button 
                onClick={onOpenAuth}
                className="px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all duration-300 whitespace-nowrap"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="lg:hidden">
                {user?.photoURL && (
                  <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center border border-[rgba(255,255,255,0.1)] overflow-hidden">
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div ref={profileRef} className="hidden lg:block relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-all group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden text-slate-500 transition-all">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-slate-900 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-[120%] w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <Settings className="w-4 h-4" /> Account Settings
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
