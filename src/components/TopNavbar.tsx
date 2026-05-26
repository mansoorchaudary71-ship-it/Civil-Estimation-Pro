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
      <nav className="w-full sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-5 py-4 md:px-8 border-b border-border-color/50 shadow-sm transition-colors duration-300">
        <div className="w-full flex items-center justify-between mx-auto max-w-[1400px]">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 md:gap-3 justify-start cursor-pointer group shrink-0" onClick={() => onNavigate?.('home' as ModuleId)}>
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 text-[var(--accent-vibrant)] group-hover:scale-105 group-hover:rotate-3 shadow-glass bg-bg-card rounded-xl p-1.5">
              <Logo className="w-full h-full" />
            </div>
            <span className="hidden md:block font-sans font-black text-[20px] md:text-[24px] text-[var(--primary-dark)] dark:text-white tracking-tight">
              Civil Estimation Pro
            </span>
          </div>

          {/* Center: Slash navigation links (Desktop/Tablet >= 768px) */}
          <div className="hidden md:flex items-center justify-start xl:ml-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-6 py-2.5 rounded-full shadow-sm border border-white/80 dark:border-slate-700/50">
            {navItems.filter(link => link.id !== 'home').map((link, index, arr) => (
              <React.Fragment key={link.name}>
                <button 
                  onClick={() => onNavigate?.(link.id)}
                  className="text-[14px] font-semibold text-slate-500 hover:text-[var(--primary-dark)] dark:text-slate-400 dark:hover:text-white transition-colors tracking-tight"
                >
                  {link.name}
                </button>
                {index < arr.length - 1 && (
                  <span className="mx-4 text-slate-300 dark:text-slate-600 font-light select-none">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right: Action Buttons & Menu Toggle */}
          <div className="flex items-center justify-end flex-1 gap-2 md:gap-4">
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:block">
                <DarkModeToggle />
              </div>

              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={() => onNavigate?.('contact' as ModuleId)}
                  className="w-10 h-10 rounded-full bg-bg-card shadow-sm border border-border-color flex items-center justify-center text-slate-500 hover:text-[var(--accent-vibrant)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  title="Support"
                >
                  <div className="font-bold text-lg">?</div>
                </button>
              </div>

              {!isAuthenticated ? (
                <button 
                  onClick={signInWithGoogle}
                  className="px-3 md:px-4 h-8 md:h-9 rounded-full bg-slate-900 dark:bg-white shadow-sm border border-slate-800 dark:border-slate-200 flex items-center justify-center gap-1.5 md:gap-2 text-white dark:text-slate-900 transition-all duration-300 whitespace-nowrap"
                  title="Sign In"
                >
                  <span className="text-xs md:text-sm font-semibold tracking-tight">Sign In</span>
                </button>
              ) : (
                <div ref={profileRef} className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="h-8 md:h-10 pl-1 md:pl-1.5 pr-1.5 md:pr-2 rounded-full bg-bg-card shadow-sm border border-border-color flex items-center gap-1 md:gap-2 text-[12px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="User Avatar" title="User Profile Photo" loading="lazy" className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-600" />
                    ) : (
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                          <User className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
                        </div>
                    )}
                    <span className="hidden sm:block truncate max-w-[80px] md:max-w-[100px]">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-slate-400">
                      <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-[140%] w-56 bg-bg-card border border-border-color rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-border-color bg-bg-primary/50">
                        <p className="text-sm font-bold text-text-primary truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </button>
                        <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <Settings className="w-4 h-4" /> Account Settings
                        </button>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button 
                onClick={() => onNavigate?.('house' as ModuleId)}
                className="px-3 md:px-6 py-1.5 md:py-2.5 rounded-full text-[12px] md:text-[14px] font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 whitespace-nowrap shadow-[0_4px_14px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)] hover:-translate-y-0.5"
              >
                <span className="hidden md:inline">Start Estimating</span>
                <span className="inline md:hidden">Start</span>
              </button>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-bg-card shadow-sm border border-border-color flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" strokeWidth={2} /> : <Menu className="w-4 h-4" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------- */}
      {/* MOBILE HAMBURGER MENU OVERLAY               */}
      {/* ------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-xl border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-300 ease-out z-[90]">
          <div className="flex flex-col max-h-[85vh] overflow-y-auto">
            {/* Nav Items */}
            <nav className="flex flex-col py-2 border-b border-slate-100 dark:border-slate-800/50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.(item.id);
                  }}
                  className="px-6 py-4 text-left text-[16px] font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col p-4 px-6 gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.('house' as ModuleId);
                  }}
                  className="w-full py-3.5 rounded-full text-[14px] font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-md text-center transition-transform active:scale-[0.98]"
                >
                  Start Estimating
                </button>
                {!isAuthenticated ? (
                  <button
                    onClick={signInWithGoogle}
                    className="w-full py-3.5 rounded-full text-[14px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md text-center transition-transform active:scale-[0.98]"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full py-3.5 rounded-full text-[14px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-center transition-transform active:scale-[0.98]"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </nav>

            <div className="px-6 py-4 flex flex-col gap-6 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Preferences</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme</span>
                  <DarkModeToggle isMobile />
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Help / Support</span>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate?.('contact' as ModuleId);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <div className="font-bold text-md cursor-pointer">?</div>
                  </button>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Unit System</label>
                   <div className="flex bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1">
                     <button
                       onClick={() => updateSettings({ measurement: 'FPS' })}
                       className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${settings.measurement === 'FPS' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                     >
                       Imperial (ft)
                     </button>
                     <button
                       onClick={() => updateSettings({ measurement: 'SI' })}
                       className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${settings.measurement === 'SI' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                     >
                       Metric (m)
                     </button>
                   </div>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Currency</label>
                   <select
                     value={settings.currency}
                     onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
                     className="w-full bg-slate-200/50 dark:bg-slate-800 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-900 dark:text-white outline-none"
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
              </div>
            </div>

            {/* Footer Auth & Action */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="User Profile" loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <span>{user?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate">{user?.displayName || "User"}</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onOpenProfile?.(); }}
                      className="flex-1 py-2.5 rounded-xl text-[14px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 py-2.5 rounded-xl text-[14px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); signInWithGoogle(); }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-[15px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mb-3"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Login" loading="lazy" className="w-5 h-5 bg-white rounded-full p-0.5" />
                  Sign In with Google
                </button>
              )}
              
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onNavigate?.('house' as ModuleId); }}
                className="w-full mt-3 px-6 py-3 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-md"
              >
                Start Estimating
              </button>
            </div>
            
            <div className="h-24 shrink-0"></div>
          </div>
        </div>
      )}
    </>
  );
}
