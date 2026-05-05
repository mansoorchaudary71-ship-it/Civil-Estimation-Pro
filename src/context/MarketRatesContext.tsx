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

interface MarketRatesContextType {
  marketRates: MarketRates;
  customRates: Partial<MarketRates>;
  rates: MarketRates; // Effective rates (custom over market)
  lastUpdated: string | null;
  updateRate: (key: keyof MarketRates, value: number) => void; 
  setCustomRate: (key: keyof MarketRates, value: number | null) => void;
  resetCustomRates: () => void;
  isCustomRate: (key: keyof MarketRates) => boolean;
}

const MarketRatesContext = createContext<MarketRatesContextType | undefined>(undefined);

export function MarketRatesProvider({ children }: { children: ReactNode }) {
  const [marketRates, setMarketRates] = useState<MarketRates>(defaultRates);
  const [customRates, setCustomRates] = useState<Partial<MarketRates>>({});
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

  const resetCustomRates = () => {
    setCustomRates({});
  };

  const isCustomRate = (key: keyof MarketRates) => {
    return customRates[key] !== undefined;
  };

  const rates: MarketRates = { ...marketRates, ...customRates };

  return (
    <MarketRatesContext.Provider value={{ marketRates, customRates, rates, lastUpdated, updateRate, setCustomRate, resetCustomRates, isCustomRate }}>
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

