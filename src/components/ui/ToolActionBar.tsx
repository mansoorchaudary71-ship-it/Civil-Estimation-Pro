import React from 'react';
import { Home, History, Save, Share2, Printer } from 'lucide-react';

interface ToolActionBarProps {
  onHome?: () => void;
  onHistory?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
}

export function ToolActionBar({ onHome, onHistory, onSave, onShare, onPrint }: ToolActionBarProps) {
  return (
    <div className="sticky bottom-0 left-0 w-full z-[100] flex justify-center pb-safe mb-4 pt-4 px-2 pointer-events-none">
      <div className="flex items-center gap-2 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-full shadow-lg max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pointer-events-auto">
        <button 
          onClick={onHome}
          className="flex flex-none justify-center items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-bg-primary border border-border-color text-slate-700 dark:text-slate-300 rounded-full font-bold text-sm transition-colors whitespace-nowrap drop-shadow-sm"
        >
          <Home className="w-4 h-4" strokeWidth={2.5} />
          Dashboard
        </button>
        
        <button 
          onClick={onHistory}
          className="flex flex-none justify-center items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm transition-colors whitespace-nowrap drop-shadow-sm"
        >
          <History className="w-4 h-4" strokeWidth={2.5} />
          History
        </button>
        
        <button 
          onClick={onSave}
          className="flex flex-none justify-center items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-sm transition-colors whitespace-nowrap drop-shadow-sm"
        >
          <Save className="w-4 h-4" strokeWidth={2.5} />
          Save
        </button>
        
        <button 
          onClick={onShare}
          className="flex flex-none justify-center items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-full font-bold text-sm transition-colors whitespace-nowrap drop-shadow-sm"
        >
          <Share2 className="w-4 h-4" strokeWidth={2.5} />
          Share
        </button>

        <button 
          onClick={onPrint}
          className="flex flex-none justify-center items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-full font-bold text-sm transition-colors whitespace-nowrap drop-shadow-sm"
        >
          <Printer className="w-4 h-4" strokeWidth={2.5} />
          Print
        </button>
      </div>
    </div>
  );
}
