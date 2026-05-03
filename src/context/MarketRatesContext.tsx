import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MarketRates {
  cement: number; // per bag (50kg)
  steel: number; // per kg
  bricks: number; // per piece
  sand: number; // per cft
  crush: number; // per cft
  tiles: number; // per box
  paint: number; // per liter
  laborGrey: number; // per sq.ft
  laborFinish: number; // per sq.ft base multiplier
  overheadMarkup: number; // percentage
}

const defaultRates: MarketRates = {
  cement: 1200,
  steel: 250,
  bricks: 15,
  sand: 40,
  crush: 50,
  tiles: 1200,
  paint: 300,
  laborGrey: 450,
  laborFinish: 1200,
  overheadMarkup: 15,
};

interface MarketRatesContextType {
  rates: MarketRates;
  updateRate: (key: keyof MarketRates, value: number) => void;
}

const MarketRatesContext = createContext<MarketRatesContextType | undefined>(undefined);

export function MarketRatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<MarketRates>(defaultRates);

  const updateRate = (key: keyof MarketRates, value: number) => {
    setRates(prev => ({ ...prev, [key]: value }));
  };

  return (
    <MarketRatesContext.Provider value={{ rates, updateRate }}>
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
