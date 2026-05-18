import React from 'react';

export interface MetricInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  error?: string;
  containerClassName?: string;
}

export const MetricInput = React.forwardRef<HTMLInputElement, MetricInputProps>(
  ({ className, containerClassName = '', label, unit, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
    
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-slate-50/80 dark:bg-slate-800/80 border ${
              error 
                ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                : 'border-slate-200 dark:border-slate-700/80 focus:ring-indigo-500/50 focus:border-indigo-500'
            } text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 ${
              unit ? 'pr-12' : ''
            } focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700 font-semibold text-sm ${className || ''}`}
            {...props}
          />
          {unit && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-slate-700 dark:text-slate-700 text-sm font-bold select-none">{unit}</span>
            </div>
          )}
        </div>
        {error && <span className="text-xs font-medium text-red-500 mt-1.5 ml-1 block animate-in fade-in">{error}</span>}
      </div>
    );
  }
);

MetricInput.displayName = 'MetricInput';
