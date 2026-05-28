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
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 pointer-events-auto bg-white backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center h-16 px-4 md:px-6`}>
        <div className="mx-auto max-w-[900px] w-full flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 justify-start cursor-pointer group shrink-0" onClick={() => onNavigate?.('home' as ModuleId)}>
            <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-orange-400 to-orange-600 shadow-md rounded-xl text-xl">
              🏗️
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              Civil Estimation Pro
            </span>
          </div>

          {/* Center: Nav links (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-6 flex-1 ml-8">
            {navItems.filter(link => link.id !== 'home').map((link) => (
              <button 
                key={link.name}
                onClick={() => onNavigate?.(link.id)}
                className="text-[15px] font-semibold text-slate-600 hover:text-purple-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0">
            
            <button 
              onClick={() => onNavigate?.('contact' as ModuleId)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-slate-50 transition-colors"
              title="Toggle Theme"
            >
              <Sun className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => onNavigate?.('contact' as ModuleId)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-slate-50 transition-colors hidden sm:flex"
              title="Support"
            >
              <div className="font-bold text-lg font-heading">?</div>
            </button>

            {!isAuthenticated ? (
                <button 
                  onClick={() => onOpenAuth?.()}
                  disabled={isAuthLoading}
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                >
                  Sign In
                </button>
            ) : (
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="h-10 pl-1 pr-3 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {user?.photoURL ? (
                      <img src={user.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                  )}
                  <span className="hidden sm:block truncate max-w-[80px]">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                </button>
            )}

            <button 
              onClick={() => onNavigate?.('house' as ModuleId)}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 shadow-md hover:shadow-lg transition-transform active:scale-95"
            >
              Start Esti...
            </button>
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
