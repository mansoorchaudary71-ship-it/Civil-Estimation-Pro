import React from 'react';
import { Layers } from 'lucide-react';

export default function PrestressedConcreteEstimator() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
         <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="text-pink-600" /> Pre-stressed Concrete Estimator
         </h2>
         <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-900 text-center">
            <p className="text-pink-800 dark:text-pink-200 font-medium">Evaluate tendon profiles, compute prestress losses (friction, anchorage slip, elastic shortening), and design sections per IS 1343:2012.</p>
         </div>
      </div>
    </div>
  );
}
