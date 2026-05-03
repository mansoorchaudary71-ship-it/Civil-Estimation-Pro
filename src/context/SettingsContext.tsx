import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'PKR' | 'USD' | 'INR' | 'AED' | 'SAR' | 'GBP';
export type MeasurementSystem = 'FPS' | 'SI';
export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  currency: Currency;
  measurement: MeasurementSystem;
  theme: Theme;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  formatCurrency: (amount: number) => string;
}

const defaultSettings: SettingsState = {
  currency: 'PKR',
  measurement: 'FPS', // FPS = ft, sqft, cft; SI = m, sqm, cum
  theme: 'system',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  PKR: 'Rs',
  USD: '$',
  INR: '₹',
  AED: 'AED',
  SAR: 'SAR',
  GBP: '£',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Apply theme to document
    const isDark = 
      settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const formatCurrency = (amount: number) => {
    const symbol = currencySymbols[settings.currency];
    return `${symbol} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
