import React, { useState } from 'react';
import { Layers, Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function TopNavbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'My Estimates', href: '#' },
    { name: 'Tools', href: '#' },
    { name: 'Pricing', href: '#' },
  ];

  return (
    <>
      {/* Standard Header to match AppHeader aesthetic and prevent "hovering" over content */}
      <div className="w-full px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 h-14 transition-colors duration-300 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-2 lg:gap-3 cursor-pointer group shrink-0">
            {onOpenSidebar && (
              <button onClick={onOpenSidebar} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors md:hidden">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[1.1rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
              Civil Pro
            </span>
          </div>

          {/* Center Links (Desktop) */}
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

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300">
              Sign In
            </button>
            <button className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-sm hover:shadow transition-all duration-300">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 mb-4 relative z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 rounded-3xl p-4 shadow-xl flex flex-col gap-2">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 my-2" />
            <button className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left pl-4">
              Sign In
            </button>
            <button className="px-4 py-3 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md flex justify-center mt-2">
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
}
