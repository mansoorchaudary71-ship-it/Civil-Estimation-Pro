import React from 'react';
import { Home, History, Save, Share2 } from 'lucide-react';

interface ToolActionBarProps {
  onHome?: () => void;
  onHistory?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function ToolActionBar({ onHome, onHistory, onSave, onShare }: ToolActionBarProps) {
  return (
    <div className="mt-8 flex justify-center w-full pb-4 px-2">
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button 
          onClick={onHome}
          className="flex flex-none justify-center items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold text-sm transition-colors whitespace-nowrap drop-shadow-sm"
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
      </div>
    </div>
  );
}
