/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import AIAssistant from "./components/modules/AIAssistant";
import Calculators from "./components/modules/Calculators";
import Takeoff from "./components/modules/Takeoff";
import EarthworksEstimator from "./components/modules/Earthworks";
import RoadEstimator from "./components/modules/RoadEstimator";
import SewerageEstimator from "./components/modules/SewerageEstimator";
import FinishingEstimator from "./components/modules/FinishingEstimator";
import HouseEstimator from "./components/modules/HouseEstimator";
import RateAnalysis from "./components/modules/RateAnalysis";
import FormworkEstimator from "./components/modules/FormworkEstimator";
import SettingsModal from "./components/modules/SettingsModal";

import { TakeoffProvider } from "./context/TakeoffContext";
import { MarketRatesProvider } from "./context/MarketRatesContext";
import { HouseSpecsProvider } from "./context/HouseSpecsContext";
import { SettingsProvider } from "./context/SettingsContext";

export type ModuleId = "home" | "takeoff" | "calculators" | "ai" | "earthworks" | "road" | "sewerage" | "finishing" | "house" | "rates" | "formwork";

import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import { Menu, Settings as SettingsIcon } from "lucide-react";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <SettingsProvider>
    <HouseSpecsProvider>
    <MarketRatesProvider>
      <TakeoffProvider>
      <div className="flex flex-row h-screen w-full bg-[#f2f2f7] overflow-hidden font-sans">
        
        <Sidebar 
          activeModule={activeModule} 
          onSelectModule={(id) => {
            setActiveModule(id);
            setIsSidebarOpen(false);
          }} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col bg-[#f2f2f7] overflow-y-auto relative w-full h-full">
          {activeModule === "home" && <Dashboard onSelectModule={setActiveModule} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />}
          {activeModule === "takeoff" && <div className="h-full flex flex-col"><AppHeader title="2D Takeoff" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><Takeoff /></div></div>}
          {activeModule === "calculators" && <div className="h-full flex flex-col"><AppHeader title="Core Calculators" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><Calculators /></div></div>}
          {activeModule === "ai" && <div className="h-full flex flex-col"><AppHeader title="AI Assistant" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><AIAssistant /></div></div>}
          {activeModule === "earthworks" && <div className="h-full flex flex-col"><AppHeader title="Earthworks" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><EarthworksEstimator /></div></div>}
          {activeModule === "road" && <div className="h-full flex flex-col"><AppHeader title="Road Estimator" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><RoadEstimator /></div></div>}
          {activeModule === "sewerage" && <div className="h-full flex flex-col"><AppHeader title="Sewerage" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><SewerageEstimator /></div></div>}
          {activeModule === "finishing" && <div className="h-full flex flex-col"><AppHeader title="Finishing Works" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><FinishingEstimator /></div></div>}
          {activeModule === "house" && <div className="h-full flex flex-col"><AppHeader title="House Estimator" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><HouseEstimator /></div></div>}
          {activeModule === "formwork" && <div className="h-full flex flex-col"><AppHeader title="Formwork & Scaffold" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><FormworkEstimator /></div></div>}
          {activeModule === "rates" && <div className="h-full flex flex-col"><AppHeader title="Market Rates" onBack={() => setActiveModule("home")} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /><div className="flex-1 overflow-y-auto"><RateAnalysis /></div></div>}
        </main>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
      </TakeoffProvider>
    </MarketRatesProvider>
    </HouseSpecsProvider>
    </SettingsProvider>
  );
}

function AppHeader({ title, onBack, onOpenSidebar, onOpenSettings }: { title: string; onBack: () => void; onOpenSidebar: () => void; onOpenSettings: () => void }) {
  return (
    <div className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shrink-0 h-14">
      <button onClick={onOpenSidebar} className="p-2 mr-1 -ml-2 rounded-full hover:bg-gray-100 text-gray-500">
        <Menu className="w-5 h-5" />
      </button>
      <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-100 text-blue-500 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <h1 className="text-lg font-bold text-gray-800 flex-1">{title}</h1>
      <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
        <SettingsIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
