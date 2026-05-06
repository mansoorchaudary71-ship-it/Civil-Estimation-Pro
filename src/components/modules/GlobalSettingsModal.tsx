import React from 'react';
import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';
import { X, Check } from 'lucide-react';
import { useMarketRates } from '../../context/MarketRatesContext';
import { useSettings } from '../../context/SettingsContext';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSettingsModal({ isOpen, onClose }: GlobalSettingsModalProps) {
  const { rates, updateRate } = useMarketRates();
  const { settings } = useSettings();
  
  // Local state for edits
  const [localRates, setLocalRates] = React.useState({
    cement: rates.cement,
    steel: rates.steel * 1000, // stored per kg in context, per ton in modal
    bricks: rates.bricks * 1000, // stored per piece in context, per 1000 in modal
    sand: rates.sand,
    crush: rates.crush,
  });

  React.useEffect(() => {
    if (isOpen) {
      setLocalRates({
        cement: rates.cement,
        steel: rates.steel * 1000,
        bricks: rates.bricks * 1000,
        sand: rates.sand,
        crush: rates.crush,
      });
    }
  }, [isOpen, rates]);

  if (!isOpen) return null;

  const handleChange = (key: keyof typeof localRates, value: string) => {
    const num = parseFloat(value);
    setLocalRates(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num
    }));
  };

  const handleSave = () => {
    updateRate('cement', localRates.cement);
    updateRate('steel', localRates.steel / 1000);
    updateRate('bricks', localRates.bricks / 1000);
    updateRate('sand', localRates.sand);
    updateRate('crush', localRates.crush);
    onClose();
  };

  const currencySymbol = settings.currency === 'PKR' ? 'Rs' : (settings.currency === 'USD' ? '$' : settings.currency);

  const InputRow = ({ label, unit, value, onChangeKey }: { label: string, unit: string, value: number, onChangeKey: keyof typeof localRates }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
      <div className="flex flex-col">
        <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">per {unit}</span>
      </div>
      <div className="relative flex flex-col w-full sm:w-48">
        <div className="relative flex items-center w-full">
          <span className="absolute left-3 text-slate-400 font-medium text-sm">{currencySymbol}</span>
          <input 
            type="number"
            min="0"
            step="any"
            value={value || ''}
            onChange={(e) => {
               const val = parseFloat(e.target.value);
               if (!isNaN(val) && val < 0) return;
               handleChange(onChangeKey, e.target.value);
            }}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-800 dark:text-white font-medium transition-shadow"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Global Settings
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Update market unit rates to reflect real-time prices.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2">
          <InputRow label="Cement" unit="50kg Bag" value={localRates.cement} onChangeKey="cement" />
          <InputRow label="Steel" unit="Ton" value={localRates.steel} onChangeKey="steel" />
          <InputRow label="Bricks" unit="1000 Bricks" value={localRates.bricks} onChangeKey="bricks" />
          <InputRow label="Sand" unit="CFT" value={localRates.sand} onChangeKey="sand" />
          <InputRow label="Crush" unit="CFT" value={localRates.crush} onChangeKey="crush" />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0 bg-slate-100/50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Check className="w-4 h-4" />
            Save Rates
          </button>
        </div>
      </div>
    </div>
  );
}
