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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const { settings, updateSettings } = useSettings();
  
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logOut, signInWithGoogle } = useAuth();
  
  const isAuthenticated = !!user;

  // Clear auth error after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      setIsAuthLoading(true);
      await signInWithGoogle();
      setIsMobileMenuOpen(false);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/popup-blocked') {
        setAuthError("Popup blocked. Please open this app in a new tab to sign in.");
      } else {
        setAuthError(error?.message || "Failed to sign in.");
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

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
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 pointer-events-auto bg-white backdrop-blur-md ${scrolled ? 'border-b border-slate-200 shadow-sm' : 'border-b border-transparent'} flex items-center h-16 md:h-18 px-4 md:px-6`}>
        <div className="mx-auto max-w-[1400px] w-full flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 justify-start cursor-pointer group shrink-0" onClick={() => onNavigate?.('home' as ModuleId)}>
            <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 text-purple-600 group-hover:scale-105 group-hover:rotate-6 bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-1.5">
              <Logo className="w-full h-full" />
            </div>
            <span className="font-heading font-black text-xl md:text-2xl text-slate-900 tracking-tight">
              Civil Estimation Pro
            </span>
          </div>

          {/* Center: Nav links (Desktop/Tablet >= 1024px) */}
          <div className="hidden lg:flex items-center justify-center gap-2 xl:ml-8">
            {navItems.filter(link => link.id !== 'home').map((link) => (
              <button 
                key={link.name}
                onClick={() => onNavigate?.(link.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-purple-600 hover:bg-slate-50 transition-all duration-300"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right: Action Buttons & Menu Toggle */}
          <div className="flex items-center justify-end flex-1 gap-2 md:gap-4">
            
            <div className="flex items-center gap-3">

              <div className="hidden md:flex items-center">
                <button 
                  onClick={() => onNavigate?.('contact' as ModuleId)}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-slate-100 shadow-sm transition-all duration-300 active:scale-95"
                  title="Support"
                >
                  <div className="font-bold text-lg font-heading">?</div>
                </button>
              </div>

              {/* Desktop Auth / Profile */}
              <div className="hidden md:block">
                {!isAuthenticated ? (
                  <div className="relative">
                    <button 
                      onClick={() => onOpenAuth?.()}
                      disabled={isAuthLoading}
                      className="text-sm font-bold text-purple-600 hover:text-purple-700 px-2 underline-offset-4 hover:underline transition-all whitespace-nowrap"
                      title="Sign In"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <div ref={profileRef} className="relative">
                    <button 
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="h-10 pl-1.5 pr-3 rounded-full bg-slate-50 shadow-sm border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300"
                    >
                      {user?.photoURL ? (
                          <img src={user.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200 ring-2 ring-white" />
                      ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-200 ring-2 ring-white">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                      )}
                      <span className="hidden sm:block truncate max-w-[100px] tracking-tight">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 top-[120%] w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                          <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{user?.displayName || 'User'}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                            <User className="w-4 h-4" /> My Profile
                          </button>
                          <button onClick={() => { setIsProfileMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                            <Settings className="w-4 h-4" /> Account Settings
                          </button>
                          <div className="h-px bg-slate-100 my-2" />
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="hidden lg:block">
                <button 
                  onClick={() => onNavigate?.('house' as ModuleId)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  Start Estimating
                </button>
              </div>
            </div>

            {/* Mobile Action Cluster */}
            <div className="md:hidden flex items-center gap-1.5 p-1 rounded-full bg-slate-50 border border-slate-200 backdrop-blur-sm shadow-sm">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                     onOpenProfile?.();
                  } else {
                     onOpenAuth?.();
                  }
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-150 active:scale-95"
              >
                {isAuthenticated && user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-white shadow-sm">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-slate-700 transition-transform duration-150 active:scale-95"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={2} />
                )}
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* ------------------------------------------- */}
      {/* MOBILE HAMBURGER MENU OVERLAY               */}
      {/* ------------------------------------------- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="md:hidden fixed inset-y-0 right-0 w-[85vw] max-w-[340px] bg-white/90 backdrop-blur-3xl shadow-2xl border-l border-white/40 z-[100] flex flex-col animate-in slide-in-from-right duration-300">
             
            {/* Header / Start Estimating CTA */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
               <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.('house' as ModuleId);
                  }}
                  className="flex-1 py-3 px-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_4px_14px_rgba(79,70,229,0.3)] text-center transition-transform active:scale-[0.98]"
                >
                  Start Estimating
               </button>
               <button onClick={() => setIsMobileMenuOpen(false)} className="ml-3 w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-6">
              
              {/* Primary Navigation */}
              <nav className="flex flex-col gap-1 px-4 py-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate?.(item.id);
                    }}
                    className="flex items-center px-4 py-3.5 rounded-full text-left text-[15px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

              {/* Preferences Grouping */}
              <div className="px-4">
                <div className="bg-white/50 rounded-3xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] p-5 flex flex-col gap-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
                  
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 mb-1 relative z-10">Preferences</span>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[14px] font-bold text-slate-700">Theme</span>
                    <DarkModeToggle isMobile />
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[14px] font-bold text-slate-700">Help / Support</span>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate?.('contact' as ModuleId);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <div className="font-bold text-md cursor-pointer">?</div>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 relative z-10">
                     <label className="text-[14px] font-bold text-slate-700">Unit System</label>
                     <div className="flex bg-slate-200/50 rounded-xl p-1 shadow-inner">
                       <button
                         onClick={() => updateSettings({ measurement: 'FPS' })}
                         className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all duration-300 ${settings.measurement === 'FPS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                       >
                         Imperial (ft)
                       </button>
                       <button
                         onClick={() => updateSettings({ measurement: 'SI' })}
                         className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all duration-300 ${settings.measurement === 'SI' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                       >
                         Metric (m)
                       </button>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2.5 relative z-10">
                     <label className="text-[14px] font-bold text-slate-700">Currency</label>
                     <select
                       value={settings.currency}
                       onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
                       className="w-full bg-slate-200/50 rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-700 outline-none shadow-inner border border-transparent focus:border-indigo-500/30 transition-all cursor-pointer"
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

            </div>

            {/* Fixed Bottom: User Profile & Account Actions */}
            <div className="shrink-0 p-4 border-t border-slate-200/50 bg-white/40 backdrop-blur-md">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl shadow-sm border border-white/60 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-slate-600 font-bold overflow-hidden ring-2 ring-indigo-500/20 bg-slate-100">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User Profile" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-1 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); onOpenProfile?.(); }}>
                    <p className="text-[14px] font-bold text-slate-900 truncate">{user?.displayName || "Account"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-rose-500/80 hover:text-rose-600 bg-rose-50/50 hover:bg-rose-100 transition-colors shrink-0"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 relative z-10 w-full mb-1">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isAuthLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full text-[14px] font-bold text-slate-700 bg-white/80 shadow-sm border border-slate-200/60 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Login" loading="lazy" className="w-5 h-5 bg-white rounded-full p-0.5 shadow-sm" />
                    {isAuthLoading ? "Signing in..." : "Sign in with Google"}
                  </button>
                  {authError && (
                    <div className="text-red-500 text-[11px] text-center border border-red-500/20 bg-red-500/10 rounded-lg p-2 font-medium">
                      {authError}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </>
  );
}
