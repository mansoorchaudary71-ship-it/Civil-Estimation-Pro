import React from 'react';
import { Calculator, Info, Lightbulb, CheckCircle2 } from 'lucide-react';

export interface CalculationExplanationOptions {
  hasInputs: boolean;
  genericFormula?: { label: string; formula: string }[];
  activeBreakdown?: { label: string; formula: string; result: string }[];
  notes?: string[];
}

export function CalculationExplanation({
  hasInputs,
  genericFormula = [],
  activeBreakdown = [],
  notes = []
}: CalculationExplanationOptions) {
  if (!genericFormula.length && !activeBreakdown.length && !notes.length) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-2 mb-8 font-sans">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-5 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-rose-500 to-amber-500 rounded-l-2xl" />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
            {hasInputs ? "Calculation Breakdown" : "Formulas Used"}
          </h3>
        </div>

        <div className="space-y-4">
          {!hasInputs ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Enter your dimensions to see the step-by-step calculation. Here are the formulas we use:
              </p>
              {genericFormula.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50">
                  <span className="text-[13px] sm:text-base font-medium dark:text-slate-500 dark:text-slate-400 block mb-1">
                    {item.label}
                  </span>
                  <div className="font-mono text-sm text-indigo-600 dark:text-indigo-400 overflow-x-auto pb-1">
                    {item.formula}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {activeBreakdown.map((step, idx) => {
                const colors = [
                  'text-indigo-600 dark:text-indigo-400',
                  'text-pink-600 dark:text-pink-400',
                  'text-amber-600 dark:text-amber-400',
                  'text-emerald-600 dark:text-emerald-400',
                  'text-sky-600 dark:text-sky-400',
                  'text-purple-600 dark:text-purple-400'
                ];
                const dotColors = [
                  'bg-indigo-400', 'bg-pink-400', 'bg-amber-400', 'bg-emerald-400', 'bg-sky-400', 'bg-purple-400'
                ];
                return (
                 <div key={idx} className="relative pl-6">
                  <div className={`absolute left-1 top-2 w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]} border border-white dark:border-slate-900 z-10`} />
                  {idx !== activeBreakdown.length - 1 && (
                    <div className="absolute left-[0.3125rem] top-4 w-[2px] h-full bg-slate-200 dark:bg-slate-700 -z-0" />
                  )}
                  <span className="text-base font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    {step.label}
                  </span>
                  <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50">
                    <div className="font-mono text-sm text-slate-600 dark:text-slate-300 mb-1 overflow-x-auto">
                      {step.formula}
                    </div>
                    <div className={`font-mono text-base font-medium flex items-center gap-2 ${colors[idx % colors.length]}`}>
                      <span className="text-slate-400 dark:text-slate-500">=</span> {step.result}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {notes && notes.length > 0 && (
            <div className="mt-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <span className="text-base font-medium text-emerald-800 dark:text-emerald-300 block">
                  Rule of Thumb / Notes
                </span>
                <ul className="space-y-1.5">
                  {notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-emerald-700 dark:text-emerald-400/90 flex gap-2">
                      <span className="text-emerald-500 dark:text-emerald-500/50 shrink-0 mt-0.5" aria-hidden="true">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
