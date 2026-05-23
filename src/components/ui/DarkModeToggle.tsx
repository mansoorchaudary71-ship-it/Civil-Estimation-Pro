import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function DarkModeToggle({ isMobile }: { isMobile?: boolean }) {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    // Determine current theme ignoring 'system' to act as a direct toggle
    let isCurrentlyDark = false;
    if (settings.theme === 'system') {
      isCurrentlyDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isCurrentlyDark = settings.theme === 'dark';
    }
    
    updateSettings({ theme: isCurrentlyDark ? 'light' : 'dark' });
  };

  const isDarkMode = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isMobile) {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center justify-between text-left text-[18px] font-bold text-[#111111] dark:text-white group"
      >
        <div className="flex items-center gap-3">
          {isDarkMode ? <Moon className="w-5 h-5 text-amber-500" /> : <Sun className="w-5 h-5 text-orange-500" />}
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </div>
        <div className="w-10 h-6 rounded-full bg-slate-200 dark:bg-[#6B46C1] relative transition-colors duration-300">
           <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isDarkMode ? 'left-5' : 'left-1'}`}></div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#6B46C1] border border-slate-700 text-amber-400 hover:bg-[#6B46C1] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5' 
          : 'bg-white border border-slate-200 text-amber-500 hover:bg-slate-50 transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
      }`}
      title="Toggle Dark Mode"
    >
      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
