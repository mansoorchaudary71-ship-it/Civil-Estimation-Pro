import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface MarketRates {
  cement: number; // per bag (50kg)
  steel: number; // per kg
  bricks: number; // per piece (using divided by 1000 from db)
  sand: number; // per cft
  crush: number; // per cft
  tiles: number; // per box
  paint: number; // per liter
  laborGrey: number; // per sq.ft
  laborFinish: number; // per sq.ft base multiplier
  overheadMarkup: number; // percentage
}

const defaultRates: MarketRates = {
  cement: 1450,
  steel: 280,
  bricks: 18, 
  sand: 90,
  crush: 250,
  tiles: 1200,
  paint: 300,
  laborGrey: 500,
  laborFinish: 600,
  overheadMarkup: 15,
};

const COMPANY_RATES_STORAGE_KEY = "company_material_rates";

interface MarketRatesContextType {
  marketRates: MarketRates;
  customRates: Partial<MarketRates>;
  companyRates: Partial<MarketRates>;
  rates: MarketRates; // Effective rates (custom over market)
  lastUpdated: string | null;
  updateRate: (key: keyof MarketRates, value: number) => void; 
  setCustomRate: (key: keyof MarketRates, value: number | null) => void;
  setCompanyRate: (key: keyof MarketRates, value: number | null) => void;
  resetCustomRates: () => void;
  isCustomRate: (key: keyof MarketRates) => boolean;
  isCompanyRate: (key: keyof MarketRates) => boolean;
}

const MarketRatesContext = createContext<MarketRatesContextType | undefined>(undefined);

export function MarketRatesProvider({ children }: { children: ReactNode }) {
  const [marketRates, setMarketRates] = useState<MarketRates>(defaultRates);
  const [customRates, setCustomRates] = useState<Partial<MarketRates>>({});
  const [companyRates, setCompanyRates] = useState<Partial<MarketRates>>(() => {
    try {
      const saved = localStorage.getItem(COMPANY_RATES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load company rates from localStorage", e);
      return {};
    }
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'ok' && data.data) {
           const apiRates = data.data;
           setMarketRates(prev => ({
             ...prev,
             cement: apiRates.cement || prev.cement,
             steel: apiRates.steel || prev.steel,
             bricks: apiRates.bricks ? apiRates.bricks / 1000 : prev.bricks, // API returns per 1000 Nos
             sand: apiRates.sand || prev.sand,
             crush: apiRates.crush || prev.crush,
             laborGrey: apiRates.laborGrey || prev.laborGrey,
             laborFinish: apiRates.laborFinish || prev.laborFinish
           }));
           // Format Date nicely
           const dateStr = new Date(apiRates.last_updated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
           });
           setLastUpdated(dateStr);
        }
      })
      .catch(err => console.warn('Failed to fetch automated rates, using defaults.', err));
  }, []);

  const updateRate = (key: keyof MarketRates, value: number) => {
    setMarketRates(prev => ({ ...prev, [key]: value }));
  };

  const setCustomRate = (key: keyof MarketRates, value: number | null) => {
    setCustomRates(prev => {
      const updated = { ...prev };
      if (value === null || isNaN(value)) {
        delete updated[key];
      } else {
        updated[key] = value;
      }
      return updated;
    });
  };

  const setCompanyRate = (key: keyof MarketRates, value: number | null) => {
    setCompanyRates(prev => {
      const updated = { ...prev };
      if (value === null || isNaN(value)) {
        delete updated[key];
      } else {
        updated[key] = value;
      }
      localStorage.setItem(COMPANY_RATES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const resetCustomRates = () => {
    setCustomRates({});
  };

  const isCustomRate = (key: keyof MarketRates) => {
    return customRates[key] !== undefined;
  };

  const isCompanyRate = (key: keyof MarketRates) => {
    return companyRates[key] !== undefined;
  };

  // Precedence: Custom > Company > Market
  const rates: MarketRates = { ...marketRates, ...companyRates, ...customRates };

  return (
    <MarketRatesContext.Provider value={{ marketRates, customRates, companyRates, rates, lastUpdated, updateRate, setCustomRate, setCompanyRate, resetCustomRates, isCustomRate, isCompanyRate }}>
      {children}
    </MarketRatesContext.Provider>
  );
}

export function useMarketRates() {
  const context = useContext(MarketRatesContext);
  if (context === undefined) {
    throw new Error('useMarketRates must be used within a MarketRatesProvider');
  }
  return context;
}

