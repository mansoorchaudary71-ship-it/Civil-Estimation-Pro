import React from 'react';

interface UnitToggleGroupProps {
  units: { id: string; label: string }[];
  activeUnit: string;
  onChange: (unit: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function UnitToggleGroup({ units, activeUnit, onChange, size = 'md' }: UnitToggleGroupProps) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5'
  };

  return (
    <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-full shadow-inner border border-slate-200/50 dark:border-slate-700/50 w-fit">
      {units.map((unit) => (
        <button
          key={unit.id}
          onClick={() => onChange(unit.id)}
          className={`relative z-10 flex items-center justify-center font-bold tracking-wide rounded-full transition-all duration-300 ${sizeClasses[size]} ${
            activeUnit === unit.id
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-600'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 border border-transparent'
          }`}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
}
