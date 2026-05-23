import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

export interface ResultItemProps {
  label: string;
  value: number;
  unit: string;
  category?: 'concrete' | 'road' | 'soil' | 'mep' | 'quantity' | 'default';
  status?: 'normal' | 'high' | 'exceeds';
  comparisonText?: string;
  explanation?: string;
  secondaryUnit?: string;
  secondaryValue?: number;
}

const categoryColors = {
  concrete: 'from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-400 text-orange-500',
  quantity: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400 text-blue-500',
  road: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-emerald-500',
  soil: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400 text-amber-500',
  mep: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400 text-purple-500',
  default: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-indigo-500'
};

const statusConfig = {
  normal: { icon: CheckCircle, className: 'text-emerald-500 bg-emerald-500/10', label: 'Normal' },
  high: { icon: AlertTriangle, className: 'text-amber-500 bg-amber-500/10', label: 'High' },
  exceeds: { icon: AlertTriangle, className: 'text-rose-500 bg-rose-500/10', label: 'Exceeds limits' }
};

export function ResultItem({
  label,
  value,
  unit,
  category = 'default',
  status = 'normal',
  comparisonText,
  explanation,
  secondaryUnit,
  secondaryValue
}: ResultItemProps) {
  const [expanded, setExpanded] = useState(false);
  const animatedValue = useCountUp(value, 800);
  
  // Format based on integer vs float
  const displayValue = Number.isInteger(value) 
    ? Math.round(animatedValue) 
    : Number(animatedValue.toFixed(2));
    
  const colorClasses = categoryColors[category] || categoryColors.default;
  const statusDetails = statusConfig[status];
  const StatusIcon = statusDetails.icon;

  return (
    <div className={`p-4 rounded-2xl border bg-gradient-to-tr transition-all duration-300 w-full mb-3 ${colorClasses.split(' ').slice(0, 2).join(' ')} ${colorClasses.split(' ')[2]}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative z-10 w-full">
        {/* Left side labels */}
        <div className="flex flex-col flex-1 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold text-sm tracking-tight ${colorClasses.split(' ')[3]} dark:${colorClasses.split(' ')[4]}`}>
              {label}
            </span>
            {explanation && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {comparisonText && (
            <div className="flex items-center gap-1.5 mt-1.5">
               {/* Mini sparkline visualization */}
               <div className="flex items-end gap-0.5 h-3 opacity-70">
                 <div className="w-1 bg-current h-1/3 rounded-full" />
                 <div className="w-1 bg-current h-2/3 rounded-full" />
                 <div className="w-1 bg-current h-full rounded-full" />
               </div>
               <span className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">{comparisonText}</span>
            </div>
          )}
        </div>

        {/* Right side values */}
        <div className="flex flex-col sm:items-end justify-center min-w-[30%]">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-black tracking-tighter tabular-nums ${colorClasses.split(' ')[3]} dark:${colorClasses.split(' ')[4]}`}>
              {displayValue.toLocaleString()}
            </span>
            <span className={`text-sm font-bold opacity-80 ${colorClasses.split(' ')[3]} dark:${colorClasses.split(' ')[4]}`}>
              {unit}
            </span>
          </div>
          
          {/* Secondary unit conversion */}
          {secondaryValue !== undefined && secondaryUnit && (
            <div className="text-[11px] font-bold opacity-60 tabular-nums">
              = {secondaryValue.toLocaleString()} {secondaryUnit}
            </div>
          )}
          
          <div className={`mt-2 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${statusDetails.className} w-fit`}>
            <StatusIcon className="w-3 h-3" />
            {statusDetails.label}
          </div>
        </div>
      </div>
      
      {/* Expandable Explanation */}
      <AnimatePresence>
        {expanded && explanation && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-current/10">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 opacity-70" />
                <p className="text-sm opacity-90 leading-relaxed font-medium">
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
