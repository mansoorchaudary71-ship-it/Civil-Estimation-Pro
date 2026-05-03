import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'PKR' | 'USD' | 'INR' | 'AED' | 'SAR' | 'GBP';
export type MeasurementSystem = 'FPS' | 'SI';

interface SettingsState {
  currency: Currency;
  measurement: MeasurementSystem;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  formatCurrency: (amount: number) => string;
}

const defaultSettings: SettingsState = {
  currency: 'PKR',
  measurement: 'FPS', // FPS = ft, sqft, cft; SI = m, sqm, cum
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
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

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
