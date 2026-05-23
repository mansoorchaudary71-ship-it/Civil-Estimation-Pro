import React from 'react';
import { Calculator } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Ready for Calculation",
  message = "Enter dimensions to generate an estimate",
  icon = <Calculator className="w-12 h-12 text-slate-300 dark:text-slate-600" />
}: EmptyStateProps) {
  return (
    <div className="w-full flex justify-center items-center p-12 border-2 border-dashed border-border-color rounded-[12px] bg-slate-50/50 dark:bg-slate-900/20 text-center animate-in fade-in duration-500 min-h-[300px]">
      <div className="flex flex-col items-center max-w-sm">
        <div className="mb-4 bg-bg-card p-[20px] rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 dark:ring-slate-800">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}
