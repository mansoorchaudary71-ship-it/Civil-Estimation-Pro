import React from 'react';
import { Building2, Users, Target, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          About Civil Estimation Pro
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 dark:text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          We are building the next generation of estimation and takeoff tools for the modern construction professional.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-700 dark:text-slate-300 leading-relaxed">
            To empower civil engineers, contractors, and estimators with intuitive, precise, and fast software that eliminates manual errors and saves hours of calculation time.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Our Vision</h2>
          <p className="text-slate-600 dark:text-slate-700 dark:text-slate-300 leading-relaxed">
            We envision a construction industry where digital tools seamlessly bridge the gap between design and execution, bringing unprecedented accuracy to every project.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-screen" />
        <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
          <div className="pt-4 md:pt-0">
            <div className="text-4xl font-extrabold text-white mb-2">10k+</div>
            <div className="text-slate-700 dark:text-slate-300 font-medium">Active Users</div>
          </div>
          <div className="pt-8 md:pt-0">
             <div className="text-4xl font-extrabold text-white mb-2">1M+</div>
             <div className="text-slate-700 dark:text-slate-300 font-medium">Estimates Generated</div>
          </div>
          <div className="pt-8 md:pt-0">
             <div className="text-4xl font-extrabold text-white mb-2">15+</div>
             <div className="text-slate-700 dark:text-slate-300 font-medium">Years Experience</div>
          </div>
          <div className="pt-8 md:pt-0">
             <div className="text-4xl font-extrabold text-white mb-2">24/7</div>
             <div className="text-slate-700 dark:text-slate-300 font-medium">Expert Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
