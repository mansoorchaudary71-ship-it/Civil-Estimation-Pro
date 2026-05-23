import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

export interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'dark' | 'info' | 'purple' | 'cyan' | 'pink' | 'yellow';
  className?: string;
  delay?: number;
  status?: 'normal' | 'high' | 'exceeds';
  comparisonText?: string;
  explanation?: string;
  secondaryUnit?: string;
  secondaryValue?: string | number;
}

const statusConfig = {
  normal: { icon: CheckCircle, className: 'text-emerald-500 bg-emerald-500/10', label: 'Normal' },
  high: { icon: AlertTriangle, className: 'text-amber-500 bg-amber-500/10', label: 'High' },
  exceeds: { icon: AlertTriangle, className: 'text-rose-500 bg-rose-500/10', label: 'Exceeds limits' }
};

function parseAndFormat(strValue: string | number) {
  const str = String(strValue);
  const numericMatch = str.match(/-?[\d,.]+/);
  if (!numericMatch) return { num: 0, prefix: str, suffix: '', decimals: 0, isNumeric: false };
  
  const numStr = numericMatch[0].replace(/,/g, '');
  const num = parseFloat(numStr);
  const index = str.indexOf(numericMatch[0]);
  const prefix = str.substring(0, index);
  const suffix = str.substring(index + numericMatch[0].length);
  
  const decimalsMatch = numStr.match(/\.(\d+)/);
  const decimals = decimalsMatch ? decimalsMatch[1].length : 0;

  return { num, prefix, suffix, decimals, isNumeric: !isNaN(num) };
}

export function ResultCard({
  title,
  value,
  unit,
  icon,
  badge,
  description,
  variant = 'neutral',
  className = '',
  delay = 0,
  status,
  comparisonText,
  explanation,
  secondaryUnit,
  secondaryValue,
}: ResultCardProps) {
  const accentColors: Record<string, string> = {
    primary: 'text-orange-600 dark:text-orange-400',
    secondary: 'text-indigo-500 dark:text-indigo-400',
    success: 'text-emerald-500 dark:text-emerald-400',
    warning: 'text-rose-500 dark:text-rose-400',
    info: 'text-blue-500 dark:text-blue-400',
    purple: 'text-purple-500 dark:text-purple-400',
    cyan: 'text-cyan-500 dark:text-cyan-400',
    pink: 'text-pink-500 dark:text-pink-400',
    yellow: 'text-amber-500 dark:text-amber-400',
    violet: 'text-violet-500 dark:text-violet-400',
    fuchsia: 'text-fuchsia-500 dark:text-fuchsia-400',
    lime: 'text-lime-500 dark:text-lime-400',
    sky: 'text-sky-500 dark:text-sky-400',
    neutral: 'text-slate-600 dark:text-slate-400',
    dark: 'text-slate-800 dark:text-slate-200'
  };

  const bgStyles: Record<string, string> = {
    primary: 'bg-white dark:bg-white/5',
    secondary: 'bg-white dark:bg-white/5',
    success: 'bg-white dark:bg-white/5',
    warning: 'bg-white dark:bg-white/5',
    info: 'bg-white dark:bg-white/5',
    purple: 'bg-white dark:bg-white/5',
    cyan: 'bg-white dark:bg-white/5',
    pink: 'bg-white dark:bg-white/5',
    yellow: 'bg-white dark:bg-white/5',
    violet: 'bg-white dark:bg-white/5',
    fuchsia: 'bg-white dark:bg-white/5',
    lime: 'bg-white dark:bg-white/5',
    sky: 'bg-white dark:bg-white/5',
    neutral: 'bg-white dark:bg-white/5',
    dark: 'bg-bg-primary/50'
  };

  // Auto-assign colorful variants to create a One UI / Gemini mixed-gradient feel.
  // We override legacy hardcoded variants to ensure visual variety across the interface.
  const mixedVariants = ['primary', 'secondary', 'success', 'warning', 'info', 'purple', 'cyan', 'pink', 'yellow', 'violet', 'fuchsia', 'lime', 'sky'];
  let hash = 0;
  const hashStr = title + (unit ? String(unit) : '') + String(value);
  for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const activeVariant = mixedVariants[Math.abs(hash) % mixedVariants.length];

  const accentColor = accentColors[activeVariant] || accentColors.neutral;
  const bgStyle = bgStyles[activeVariant] || bgStyles.neutral;

  const textGradients: Record<string, string> = {
    primary: 'bg-gradient-to-br from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-br from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent',
    success: 'bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent',
    warning: 'bg-gradient-to-br from-rose-500 to-orange-500 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent',
    info: 'bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent',
    purple: 'bg-gradient-to-br from-purple-500 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent',
    cyan: 'bg-gradient-to-br from-cyan-500 to-sky-500 dark:from-cyan-400 dark:to-sky-400 bg-clip-text text-transparent',
    pink: 'bg-gradient-to-br from-pink-500 to-rose-500 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent',
    yellow: 'bg-gradient-to-br from-amber-500 to-yellow-500 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent',
    violet: 'bg-gradient-to-br from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent',
    fuchsia: 'bg-gradient-to-br from-fuchsia-500 to-pink-500 dark:from-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent',
    lime: 'bg-gradient-to-br from-lime-500 to-emerald-500 dark:from-lime-400 dark:to-emerald-400 bg-clip-text text-transparent',
    sky: 'bg-gradient-to-br from-sky-500 to-blue-500 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent',
    neutral: 'bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent',
    dark: 'text-text-primary',
  };

  const textGrad = textGradients[activeVariant] || textGradients.neutral;

  // 1. Parsing & Animation
  const parsed = parseAndFormat(value);
  const animatedRaw = useCountUp(parsed.num, 800);
  
  // Conditionally animate if it is actually a number
  const displayValue = parsed.isNumeric 
    ? `${parsed.prefix}${animatedRaw.toLocaleString(undefined, { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })}${parsed.suffix}`
    : value;

  const [expanded, setExpanded] = useState(false);
  const statusDetails = status ? statusConfig[status] : null;
  const StatusIcon = statusDetails ? statusDetails.icon : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`relative p-5 sm:p-6 rounded-[28px] backdrop-blur-3xl border border-slate-200/50 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 w-full overflow-hidden ${bgStyle} ${className}`}
    >
      {/* 4. Subtle background gradient based on accentColor implicitly added by bgStyles (which we will update to be gradients) */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-current to-transparent pointer-events-none ${accentColor}`} />

      <div className="flex items-start justify-between gap-3 w-full relative z-10">
        <div className="flex flex-col max-w-[80%]">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`p-1.5 rounded-xl bg-bg-primary flex-shrink-0 border border-slate-100 dark:border-white/5 ${accentColor}`}>
                {icon}
              </div>
            )}
            <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate flex items-center gap-1 ${accentColor}`}>
              {title}
              {explanation && (
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
                  title="What does this mean?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </h4>
          </div>
          
          {/* 3. Mini sparkline comparison */}
          {comparisonText && (
            <div className={`flex items-center gap-1.5 mt-2 ${accentColor}`}>
               <div className="flex items-end gap-[3px] h-3.5 opacity-70">
                 <div className="w-1 bg-current h-1/3 rounded-full" />
                 <div className="w-1 bg-current h-2/3 rounded-full" />
                 <div className="w-1 bg-current h-full rounded-full animate-pulse" />
               </div>
               <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{comparisonText}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {badge && (
            <div className="flex-shrink-0 flex items-center bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {badge}
            </div>
          )}
          {/* 2. Color-coded status indicator */}
          {statusDetails && StatusIcon && (
            <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${statusDetails.className}`}>
              <StatusIcon className="w-3 h-3" />
              {statusDetails.label}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full relative z-10 mt-1 overflow-hidden">
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span className={`text-[clamp(1.5rem,7vw,3rem)] leading-none font-black tracking-tighter break-words max-w-full ${textGrad}`}>
            {displayValue}
          </span>
          {unit && (
            <span className={`text-[13px] sm:text-sm font-semibold ml-1 shrink-0 ${accentColor}`}>
              {unit}
            </span>
          )}
        </div>
        
        {/* 6. Unit conversion automatically */}
        {secondaryValue !== undefined && secondaryUnit && (
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            = {typeof secondaryValue === 'number' ? secondaryValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : secondaryValue} {secondaryUnit}
          </div>
        )}

        {description && !secondaryValue && (
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-full break-words mt-1">
            {description}
          </div>
        )}
      </div>

      {/* 5. What does this mean? expandable section */}
      <AnimatePresence>
        {expanded && explanation && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-10"
          >
            <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-white/10">
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <Info className={`w-4 h-4 mt-0.5 opacity-80 ${accentColor}`} />
                <p className="text-[11px] sm:text-xs opacity-90 leading-relaxed font-medium">
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
