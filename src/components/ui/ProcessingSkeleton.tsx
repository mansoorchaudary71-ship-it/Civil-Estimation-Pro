import React from 'react';

export interface ProcessingSkeletonProps {
  count?: number;
}

export function ProcessingSkeleton({ count = 4 }: ProcessingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="p-5 rounded-2xl border border-border-color bg-white/50 dark:bg-slate-900/50 flex flex-col h-full overflow-hidden animate-pulse min-h-[140px]"
        >
          <div className="flex items-start justify-between gap-3 mb-6">
            <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded-md w-1/2"></div>
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-xl flex-shrink-0"></div>
          </div>
          <div className="mt-auto">
            <div className="h-8 bg-slate-200 dark:bg-slate-700/50 rounded-lg w-2/3 mb-3"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded-sm w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
