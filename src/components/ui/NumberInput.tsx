import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  unit?: string;
  value: number | string;
  onChange: (value: number | "") => void;
  requirePositive?: boolean;
  error?: string;
  containerClassName?: string;
  step?: string | number;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, containerClassName = '', label, unit, value, onChange, requirePositive = false, error, id, onBlur, onFocus, step = "any", ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
    
    const [localValue, setLocalValue] = useState<string>(value?.toString() ?? "");
    const [internalError, setInternalError] = useState<string | null>(null);

    useEffect(() => {
      const parsedLocal = parseFloat(localValue);
      const parsedProp = (value === "" || value === null || value === undefined) ? NaN : Number(value);
      
      if (value === "") {
         if (localValue !== "") setLocalValue("");
      } else if (!isNaN(parsedProp) && parsedProp !== parsedLocal) {
         setLocalValue(value.toString());
      }
    }, [value]);

    const triggerChange = (newLocalValue: string, numValue: number | typeof NaN) => {
      setLocalValue(newLocalValue);
      if (newLocalValue === "" || isNaN(numValue)) {
        onChange("");
        if (requirePositive) {
          setInternalError("A valid value is required");
        } else {
          setInternalError(null);
        }
      } else {
        onChange(numValue);
        if (requirePositive && numValue <= 0) {
          setInternalError("Value must be greater than 0");
        } else {
          setInternalError(null);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (rawValue === "") {
        triggerChange("", NaN);
        return;
      }
      const numValue = parseFloat(rawValue);
      if (isNaN(numValue) || numValue < 0) return;
      triggerChange(rawValue, numValue);
    };

    const handleIncrement = (amount: number) => {
      const current = parseFloat(localValue) || 0;
      const stepVal = step === "any" ? 1 : Number(step);
      const next = current + (amount * stepVal);
      if (next < 0) return;
      triggerChange(next.toString(), next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (['-', 'e', 'E', '+'].includes(e.key)) {
        e.preventDefault();
      }
      // Handle keyboard up/down arrows manually since we disabled default spinner
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleIncrement(-1);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      if (onFocus) {
        onFocus(e);
      }
    };

    const displayError = error || internalError;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            type="number"
            min="0"
            step={step}
            inputMode="decimal"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            onFocus={handleFocus}
            aria-invalid={!!displayError}
            aria-errormessage={displayError ? `${inputId}-error` : undefined}
            className={`w-full bg-slate-50/80 dark:bg-slate-800/80 border ${
              displayError 
                ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                : 'border-border-color/80 focus:ring-indigo-500/50 focus:border-indigo-500'
            } text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 ${
              unit ? 'pr-20' : 'pr-8'
            } focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700 dark:placeholder:text-slate-400 font-semibold text-sm ${className || ''}`}
            {...props}
          />
          <div className={`absolute right-0 top-0 bottom-0 flex items-center pr-2 ${unit ? 'mr-12' : ''}`}>
            <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-1">
              <button 
                type="button" 
                tabIndex={-1} 
                className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5" 
                onClick={() => handleIncrement(1)}
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button 
                type="button" 
                tabIndex={-1} 
                className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5" 
                onClick={() => handleIncrement(-1)}
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          {unit && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-bold select-none">{unit}</span>
            </div>
          )}
        </div>
        {displayError && (
          <span id={`${inputId}-error`} className="text-xs font-bold text-red-500 mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1">
            {displayError}
          </span>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
