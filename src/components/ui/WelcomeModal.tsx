import React, { useState } from 'react';
import { Layers, Bot, FileText, CheckCircle2, ChevronRight, HardHat, GraduationCap, Calculator, Ruler } from 'lucide-react';
import { useSettings, UserRole, MeasurementSystem, Currency } from '../../context/SettingsContext';

export function WelcomeModal() {
  const { settings, updateSettings } = useSettings();
  
  const [role, setRole] = useState<UserRole>(settings.role);
  const [unit, setUnit] = useState<MeasurementSystem>(settings.measurement || 'SI');
  const [currency, setCurrency] = useState<Currency>(settings.currency || 'USD');

  if (settings.onboardingComplete) return null;

  const handleComplete = () => {
    updateSettings({
      role,
      measurement: unit,
      currency,
      onboardingComplete: true
    });
  };

  const roles = [
    { id: 'Civil Engineer', icon: <HardHat className="w-5 h-5" />, label: 'Civil Engineer' },
    { id: 'Quantity Surveyor', icon: <Calculator className="w-5 h-5" />, label: 'Quantity Surveyor' },
    { id: 'Student', icon: <GraduationCap className="w-5 h-5" />, label: 'Student' },
    { id: 'Contractor', icon: <Ruler className="w-5 h-5" />, label: 'Contractor' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome to Civil AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            The ultimate toolset for modern civil engineering & quantity surveying.
          </p>
        </div>

        <div className="overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900/50 flex-1 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">30+ Pro Tools</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Estimators, calculators, and rate analysis tools.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">AI Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart takeoff, chat analysis, and data validation.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Export Reports</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">One-click detailed BOQ generation (PDF/Excel).</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. Choose Your Role
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as UserRole)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    role === r.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300'
                  }`}
                >
                  <div className={role === r.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>{r.icon}</div>
                  <span className="font-medium text-sm">{r.label}</span>
                  {role === r.id && <CheckCircle2 className="w-4 h-4 ml-auto text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              2. System Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Unit System</label>
                <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setUnit('FPS')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === 'FPS' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Imperial (ft, sqft)
                  </button>
                  <button
                    onClick={() => setUnit('SI')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${unit === 'SI' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Metric (m, m²)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Primary Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm font-medium text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={handleComplete}
            disabled={!role}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
