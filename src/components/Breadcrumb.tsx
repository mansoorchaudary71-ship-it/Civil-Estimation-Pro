import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isHome?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-1.5 text-sm max-w-full overflow-x-auto no-scrollbar py-2" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label + index} className="flex items-center whitespace-nowrap">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 mx-0.5 sm:mx-1 shrink-0" />
            )}
            
            {isLast ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
                {item.isHome && <Home className="w-3.5 h-3.5" />}
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-all"
              >
                {item.isHome && <Home className="w-3.5 h-3.5" />}
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
