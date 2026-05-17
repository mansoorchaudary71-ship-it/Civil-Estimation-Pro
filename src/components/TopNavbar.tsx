import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown, ArrowRight } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || isSettingsDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isSettingsDrawerOpen]);

  const handleSignOut = async () => {
    await logOut();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Estimator', id: 'house' as ModuleId },
    { name: 'Materials', id: 'calculators' as ModuleId },
    { name: 'Reports', id: 'my-estimates' as ModuleId },
    { name: 'Contact', id: 'contact' as ModuleId },
  ];

  return (
    <>
      <div className="w-full relative shrink-0 z-40 bg-transparent px-5 py-4 md:px-12 md:py-6">
        <div className="w-full flex items-center justify-between mx-auto max-w-[1400px]">
          
          {/* Left: Logo */}
          <div className="flex items-center justify-start cursor-pointer group shrink-0" onClick={() => onNavigate?.('home' as ModuleId)}>
            <span className="font-heading font-black text-2xl md:text-3xl tracking-tighter text-[#111111] dark:text-white">
              Civil Pro.
            </span>
          </div>

          {/* Center: Slash navigation links (Desktop/Tablet >= 768px) */}
          <div className="hidden md:flex items-center justify-start ml-12">
            {navItems.map((link, index) => (
              <React.Fragment key={link.name}>
                <button 
                  onClick={() => onNavigate?.(link.id)}
                  className="text-[15px] font-medium text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white transition-colors tracking-tight"
                >
                  {link.name}
                </button>
                {index < navItems.length - 1 && (
                  <span className="mx-4 text-[#111111]/20 dark:text-white/20 font-light select-none">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Right: Hamburger (Visible < 768px) */}
          <div className="md:hidden flex items-center justify-end">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 rounded-xl text-[#111111] dark:text-white hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all duration-300"
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Right: Action Buttons (Desktop >= 768px) */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-6">
            <GlobalSettingsToggle />

            <div className="flex items-center gap-6">
              <button 
                onClick={() => onNavigate?.('contact' as ModuleId)}
                className="text-[15px] font-medium text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                Support
              </button>
              
              {!isAuthenticated ? (
                <button 
                  onClick={onOpenAuth}
                  className="text-[15px] font-medium text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white transition-colors"
                >
                  Login
                </button>
              ) : (
                <div ref={profileRef} className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 text-[15px] font-medium text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white transition-colors"
                  >
                    <span className="truncate max-w-[100px]">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-[140%] w-56 bg-white dark:bg-[#1A1A1A] border border-[#111111]/10 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-[#111111]/10 dark:border-white/10 bg-[#111111]/5 dark:bg-white/5">
                        <p className="text-sm font-bold text-[#111111] dark:text-white truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-[#111111]/60 dark:text-white/60 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#111111]/70 dark:text-white/70 hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </button>
                        <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#111111]/70 dark:text-white/70 hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors">
                          <Settings className="w-4 h-4" /> Account Settings
                        </button>
                        <div className="h-px bg-[#111111]/10 dark:bg-white/10 my-1" />
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
              className="px-6 py-2.5 rounded-full text-[15px] font-bold text-white dark:text-[#111111] bg-[#111111] dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-300 whitespace-nowrap shadow-md"
            >
              Start Estimating
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* FULL-WIDTH STICKY CTA FOR MOBILE (< 768px)  */}
      {/* ------------------------------------------- */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-40">
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            onNavigate?.('house' as ModuleId);
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[16px] font-bold text-white dark:text-[#111111] bg-[#111111] dark:bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-transform duration-200"
        >
          Start Estimating <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* ------------------------------------------- */}
      {/* MOBILE HAMBURGER MENU OVERLAY               */}
      {/* ------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#111111]/20 dark:bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-[340px] bg-white dark:bg-[#111111] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#111111]/10 dark:border-white/10 shrink-0">
              <span className="font-heading font-black text-xl tracking-tighter text-[#111111] dark:text-white">
                Civil Pro.
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-full text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
              <nav className="flex flex-col gap-5">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#111111]/40 dark:text-white/40 mb-1">Navigation</span>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate?.(item.id);
                    }}
                    className="flex justify-between items-center text-left text-[18px] font-bold text-[#111111] dark:text-white"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="h-px bg-[#111111]/10 dark:bg-white/10 my-2"></div>
              
              <nav className="flex flex-col gap-5">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#111111]/40 dark:text-white/40 mb-1">Preferences</span>
                <button
                  onClick={() => setIsSettingsDrawerOpen(true)}
                  className="flex items-center justify-between text-left text-[18px] font-bold text-[#111111] dark:text-white group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[#111111]/60 dark:text-white/60" />
                    Unit & Currency Settings
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#111111]/40 dark:text-white/40 -rotate-90" />
                </button>
              </nav>
            </div>

            {/* Footer Auth */}
            <div className="p-6 border-t border-[#111111]/10 dark:border-white/10 shrink-0 bg-[#111111]/5 dark:bg-white/5">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#111111]/10 dark:bg-white/10 flex items-center justify-center text-[#111111] dark:text-white font-bold overflow-hidden border border-white/20">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span>{user?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#111111] dark:text-white truncate">{user?.displayName || "User"}</p>
                      <p className="text-[12px] text-[#111111]/60 dark:text-white/60 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onOpenProfile?.(); }}
                      className="flex-1 py-2.5 rounded-xl text-[14px] font-bold text-[#111111] dark:text-white bg-white dark:bg-[#222] border border-[#111111]/10 dark:border-white/10 shadow-sm transition-colors"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 py-2.5 rounded-xl text-[14px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 shadow-sm transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenAuth?.(); }}
                  className="w-full py-3 rounded-xl text-[15px] font-bold text-[#111111] dark:text-white bg-white dark:bg-[#1A1A1A] border border-[#111111]/10 dark:border-white/10 shadow-sm transition-colors"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
            
            {/* Added padding to clear sticky CTA at the bottom */}
            <div className="h-24 shrink-0 bg-[#111111]/5 dark:bg-white/5"></div>
          </div>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* SETTINGS DRAWER (Imperial/PKR Toggle)       */}
      {/* ------------------------------------------- */}
      {isSettingsDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-[110] flex items-end">
          <div 
            className="absolute inset-0 bg-[#111111]/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSettingsDrawerOpen(false)}
          ></div>
          <div className="relative w-full bg-white dark:bg-[#111111] rounded-t-[32px] p-6 shadow-[0_-8px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom duration-300 ease-out">
            <div className="w-12 h-1.5 bg-[#111111]/20 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-bold text-[#111111] dark:text-white">Regional Settings</h3>
              <button onClick={() => setIsSettingsDrawerOpen(false)} className="p-2 -mr-2 text-[#111111]/60 dark:text-white/60">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Render the actual toggle component but forced into a larger format or just use the settings context? */}
            <div className="pb-8">
               <div className="mb-4">
                  <span className="text-[13px] font-bold text-[#111111]/50 dark:text-white/50 tracking-widest uppercase block mb-3">Unit System & Currency</span>
                  {/* Instead of importing the context, we can just render GlobalSettingsToggle forced inline if possible, but it's a relative dropdown.
                      Actually, let's wrap it in a flex container so it looks native, or we can just render the toggle. */}
                  <div className="scale-110 origin-top-left inline-block">
                    <GlobalSettingsToggle align="left" />
                  </div>
                  <p className="text-[13px] text-[#111111]/60 dark:text-white/60 mt-4 leading-relaxed">
                    Click the button above to switch between Metric (m) and Imperial (ft), and update your preferred currency for reports.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
