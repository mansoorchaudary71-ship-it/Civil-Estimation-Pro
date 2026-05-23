import React, { useState, useEffect } from 'react';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  unit?: string;
  value: number | string;
  onChange: (value: number | "") => void;
  requirePositive?: boolean;
  error?: string;
  containerClassName?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, containerClassName = '', label, unit, value, onChange, requirePositive = false, error, id, onBlur, ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
    
    // Internal state to hold the exact string being typed (preserves trailing decimals like "5.")
    const [localValue, setLocalValue] = useState<string>(value?.toString() ?? "");
    const [internalError, setInternalError] = useState<string | null>(null);

    // Sync local string state if the parent updates the value externally (e.g. resetting to 0)
    useEffect(() => {
      const parsedLocal = parseFloat(localValue);
      const parsedProp = (value === "" || value === null || value === undefined) ? NaN : Number(value);
      
      if (value === "") {
         if (localValue !== "") setLocalValue("");
      } else if (!isNaN(parsedProp) && parsedProp !== parsedLocal) {
         setLocalValue(value.toString());
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Handle the field being cleared - pass "" up to prevent NaN breaking the app safely
      if (rawValue === "") {
        setLocalValue("");
        onChange("");
        if (requirePositive) {
          setInternalError("A valid value is required");
        } else {
          setInternalError(null);
        }
        return;
      }

      const numValue = parseFloat(rawValue);
      
      // Block negative numbers or pure NaN strings completely
      if (isNaN(numValue) || numValue < 0) {
        return;
      }

      setLocalValue(rawValue);
      onChange(numValue);
      
      // Validate logical correctness
      if (requirePositive && numValue <= 0) {
        setInternalError("Value must be greater than 0");
      } else {
        setInternalError(null);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Strictly prevent negative signs and logical operators
      if (['-', 'e', 'E', '+'].includes(e.key)) {
        e.preventDefault();
      }
    };

    const displayError = error || internalError;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="number"
            min="0"
            step="any"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            className={`w-full bg-slate-50/80 dark:bg-[#6B46C1]/80 border ${
              displayError 
                ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                : 'border-border-color/80 focus:ring-[#6B46C1] focus:border-[#6B46C1]'
            } text-slate-800 dark:text-slate-100 rounded-[12px] px-4 py-3 ${
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
        {displayError && (
          <span className="text-xs font-semibold text-red-500 mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1">
            {displayError}
          </span>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
