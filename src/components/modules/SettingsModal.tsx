import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Moon, Sun, Laptop } from 'lucide-react';
import { useSettings, Currency, MeasurementSystem, Theme } from '../../context/SettingsContext';

const currencies: { id: Currency; label: string; symbol: string }[] = [
  { id: 'USD', label: 'US Dollar', symbol: '$' },
  { id: 'PKR', label: 'Pakistani Rupee', symbol: 'Rs' },
  { id: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { id: 'AED', label: 'UAE Dirham', symbol: 'AED' },
  { id: 'SAR', label: 'KSA Riyal', symbol: 'SAR' },
  { id: 'GBP', label: 'British Pound', symbol: '£' },
];

const measurements: { id: MeasurementSystem; label: string; desc: string }[] = [
  { id: 'FPS', label: 'FPS System', desc: 'Feet, Inches, Sq.Ft, Cu.Ft' },
  { id: 'SI', label: 'SI System', desc: 'Meters, Sq.Meters, Cu.Meters' }
];

const themes: { id: Theme; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Laptop }
];

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 dark:bg-slate-900/80">
      <div 
        className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Preferences</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Configure your basic units</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex flex-col items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 dark:text-slate-400">Appearance</label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(t => {
                const Icon = t.icon;
                const isActive = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ theme: t.id })}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                      isActive 
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Currency</label>
            <div className="grid grid-cols-2 gap-3">
              {currencies.map(c => (
                <button
                  key={c.id}
                  onClick={() => updateSettings({ currency: c.id })}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    settings.currency === c.id 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className={`font-semibold ${settings.currency === c.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {c.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    settings.currency === c.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {c.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Measurement System */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Measurement System</label>
            <div className="flex flex-col gap-3">
              {measurements.map(m => (
                <button
                  key={m.id}
                  onClick={() => updateSettings({ measurement: m.id })}
                  className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${
                    settings.measurement === m.id 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className={`font-bold ${settings.measurement === m.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {m.label}
                  </span>
                  <span className={`text-sm mt-1 ${settings.measurement === m.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/50 mt-2">
              Note: Measurement system primarily updates labels. Value conversion is currently limited in some legacy modules.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-900/20 dark:shadow-white/10"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
