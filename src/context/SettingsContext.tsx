import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'PKR' | 'USD' | 'INR' | 'AED' | 'SAR' | 'GBP';
export type MeasurementSystem = 'FPS' | 'SI';
export type Theme = 'light' | 'dark' | 'system';

export interface MaterialRates {
  cement: number;
  steel: number;
  bricks: number;
  sand: number;
  crush: number;
}

interface SettingsState {
  currency: Currency;
  measurement: MeasurementSystem;
  theme: Theme;
  rates: MaterialRates;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  formatCurrency: (amount: number, applyExchangeRate?: boolean) => string;
  convertAmount: (amount: number) => number;
  convertAmountToRaw: (amount: number) => number;
}

const defaultSettings: SettingsState = {
  currency: 'PKR',
  measurement: 'FPS', // FPS = ft, sqft, cft; SI = m, sqm, cum
  theme: 'system',
  rates: {
    cement: 1200,   // per 50kg bag
    steel: 260000,  // per ton
    bricks: 15000,  // per 1000
    sand: 60,       // per cft
    crush: 120,     // per cft
  }
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

  const getExchangeRate = (curr: Currency) => {
    switch (curr) {
      case 'USD': return 1 / 278;
      case 'SAR': return 1 / 74;
      case 'INR': return 1 / 3.33;
      case 'AED': return 1 / 75;
      case 'GBP': return 1 / 350;
      default: return 1; // PKR
    }
  };

  const formatCurrency = (amount: number, applyExchangeRate = true) => {
    const symbol = currencySymbols[settings.currency];
    const rate = getExchangeRate(settings.currency);
    const finalAmount = applyExchangeRate ? amount * rate : amount;
    return `${symbol} ${finalAmount.toLocaleString(undefined, { maximumFractionDigits: settings.currency === 'PKR' ? 0 : 2 })}`;
  };

  const convertAmount = (amount: number) => {
    const rate = getExchangeRate(settings.currency);
    return amount * rate;
  };

  const convertAmountToRaw = (amount: number) => {
    const rate = getExchangeRate(settings.currency);
    return amount / rate;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatCurrency, convertAmount, convertAmountToRaw }}>
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
