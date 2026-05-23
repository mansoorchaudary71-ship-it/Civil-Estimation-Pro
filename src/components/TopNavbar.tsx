import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown, ArrowRight } from 'lucide-react';
import { CurrencySelector } from './ui/CurrencySelector';
import { GlobalSettingsToggle } from './ui/GlobalSettingsToggle';
import { DarkModeToggle } from './ui/DarkModeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useSettings, MeasurementSystem, Currency } from '../context/SettingsContext';
import { ModuleId } from './Sidebar';
import Logo from './Logo';

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
  
  const { settings, updateSettings } = useSettings();
  
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logOut, signInWithGoogle } = useAuth();
  
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
    { name: 'Home', id: 'home' as ModuleId },
    { name: 'Estimator', id: 'house' as ModuleId },
    { name: 'Materials', id: 'calculators' as ModuleId },
    { name: 'Reports', id: 'my-estimates' as ModuleId },
    { name: 'Contact', id: 'contact' as ModuleId },
  ];

  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    
    // Swipe left to close drawer (since it slides from left)
    if (diff > 50) {
      setIsMobileMenuOpen(false);
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <>
      <nav className="w-full sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-5 py-4 md:px-8 border-b border-border-color/50 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors duration-300">
        <div className="w-full flex items-center justify-between mx-auto max-w-[1400px]">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 justify-start cursor-pointer group shrink-0" onClick={() => onNavigate?.('home' as ModuleId)}>
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 text-[var(--accent-vibrant)] group-hover:scale-105 group-hover:rotate-3 shadow-glass bg-bg-card rounded-[12px] p-1.5">
              <Logo className="w-full h-full" />
            </div>
            <span className="font-sans font-extrabold text-[22px] text-[var(--primary-dark)] dark:text-white tracking-tight">
              Civil Estimation Pro
            </span>
          </div>

          {/* Center: Slash navigation links (Desktop/Tablet >= 768px) */}
          <div className="hidden md:flex items-center justify-start ml-12 bg-white/60 dark:bg-[#6B46C1]/60 backdrop-blur-md px-6 py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-white/80 dark:border-slate-700/50">
            {navItems.filter(link => link.id !== 'home').map((link, index, arr) => (
              <React.Fragment key={link.name}>
                <button 
                  onClick={() => onNavigate?.(link.id)}
                  className="relative text-[14px] font-semibold text-[#4B5563] hover:text-[var(--primary-dark)] dark:text-slate-300 dark:hover:text-white transition-colors tracking-tight group"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                </button>
                {index < arr.length - 1 && (
                  <span className="mx-4 text-slate-300 dark:text-slate-600 font-light select-none">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Right: Hamburger (Visible < 768px) */}
          <div className="md:hidden flex items-center justify-end">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-bg-card shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-border-color flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#6B46C1] transition-all duration-300"
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Right: Action Buttons (Desktop >= 768px) */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-4">
            <CurrencySelector />
            <DarkModeToggle />
            <GlobalSettingsToggle />

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate?.('contact' as ModuleId)}
                className="w-10 h-10 rounded-full bg-bg-card shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-border-color flex items-center justify-center text-[#4B5563] hover:text-[var(--accent-vibrant)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                title="Support"
              >
                <div className="font-bold text-lg">?</div>
              </button>
              
              {!isAuthenticated ? (
                <button 
                  onClick={signInWithGoogle}
                  className="px-5 h-9 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_2px_12px_rgba(249,115,22,0.5)] border-none flex items-center justify-center gap-2 text-white transition-all transform duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_4px_16px_rgba(249,115,22,0.8)]"
                  title="Get Started"
                >
                  <span className="text-sm font-bold tracking-tight">Get Started</span>
                </button>
              ) : (
                <div ref={profileRef} className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="h-10 pl-1.5 pr-2 rounded-full bg-bg-card shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-border-color flex items-center gap-2 text-[14px] font-semibold text-slate-700 dark:text-slate-200 transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {user?.photoURL ? (
                       <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-full object-cover shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-slate-600" />
                    ) : (
                       <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#6B46C1] flex items-center justify-center border border-slate-200 dark:border-slate-600">
                         <User className="w-4 h-4 text-[#4B5563]" />
                       </div>
                    )}
                    <span className="truncate max-w-[100px]">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400">
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-[140%] w-56 bg-bg-card border border-border-color rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-border-color bg-bg-primary/50">
                        <p className="text-sm font-bold text-text-primary truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#6B46C1] transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </button>
                        <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#6B46C1] transition-colors">
                          <Settings className="w-4 h-4" /> Account Settings
                        </button>
                        <div className="h-px bg-slate-200 dark:bg-[#6B46C1] my-1" />
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
              className="px-6 py-2.5 rounded-full text-[14px] font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 whitespace-nowrap shadow-[0_4px_14px_rgba(99,102,241,0.3)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_6px_20px_rgba(34,211,238,0.4)] hover:-translate-y-0.5"
            >
              Start Estimating
            </button>
          </div>
        </div>
      </nav>

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
          <div 
            className="absolute top-0 left-0 bottom-0 w-[85vw] max-w-[340px] bg-white dark:bg-[#111111] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 ease-out"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#111111]/10 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center text-orange-500">
                  <Logo className="w-full h-full" />
                </div>
                <span className="font-heading font-black text-[18px] tracking-tighter text-[#111111] dark:text-white">
                  Civil Estimation Pro
                </span>
              </div>
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
                <DarkModeToggle isMobile />
                
                <div className="flex flex-col gap-3">
                   <label className="text-[14px] font-bold text-[#111111] dark:text-white">Unit System</label>
                   <div className="flex bg-[#111111]/5 dark:bg-white/5 rounded-[12px] p-1 border border-[#111111]/10 dark:border-white/10">
                     <button
                       onClick={() => updateSettings({ measurement: 'FPS' })}
                       className={`flex-1 py-2 text-sm font-bold rounded-[12px] transition-colors ${settings.measurement === 'FPS' ? 'bg-white dark:bg-[#222] text-[#111111] dark:text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#111111]/10 dark:border-white/10' : 'text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white'}`}
                     >
                       Imperial (ft)
                     </button>
                     <button
                       onClick={() => updateSettings({ measurement: 'SI' })}
                       className={`flex-1 py-2 text-sm font-bold rounded-[12px] transition-colors ${settings.measurement === 'SI' ? 'bg-white dark:bg-[#222] text-[#111111] dark:text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#111111]/10 dark:border-white/10' : 'text-[#111111]/60 dark:text-white/60 hover:text-[#111111] dark:hover:text-white'}`}
                     >
                       Metric (m)
                     </button>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[14px] font-bold text-[#111111] dark:text-white">Currency</label>
                   <select
                     value={settings.currency}
                     onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
                     className="w-full bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-white/10 rounded-[12px] py-2.5 px-3 text-sm font-bold text-[#111111] dark:text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] focus:ring-2 focus:ring-[#6B46C1] focus:border-[#6B46C1] outline-none"
                   >
                     <option value="USD">USD ($) - US Dollar</option>
                     <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                     <option value="INR">INR (₹) - Indian Rupee</option>
                     <option value="AED">AED - UAE Dirham</option>
                     <option value="SAR">SAR - Saudi Riyal</option>
                     <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                     <option value="GBP">GBP (£) - British Pound</option>
                   </select>
                </div>
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
                      className="flex-1 py-2.5 rounded-[12px] text-[14px] font-bold text-[#111111] dark:text-white bg-white dark:bg-[#222] border border-[#111111]/10 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 py-2.5 rounded-[12px] text-[14px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); signInWithGoogle(); }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[12px] text-[15px] font-bold text-[#111111] dark:text-white bg-white dark:bg-[#222] border border-[#111111]/10 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
                  Sign In with Google
                </button>
              )}
            </div>
            
            {/* Added padding to clear sticky CTA at the bottom */}
            <div className="h-24 shrink-0 bg-[#111111]/5 dark:bg-white/5"></div>
          </div>
        </div>
      )}
    </>
  );
}
