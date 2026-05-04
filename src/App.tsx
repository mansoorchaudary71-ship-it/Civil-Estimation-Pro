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
      <div className="flex flex-row h-screen w-full bg-[#f2f2f7] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        <Sidebar 
          activeModule={activeModule} 
          onSelectModule={(id) => {
            setActiveModule(id);
            setIsSidebarOpen(false);
          }} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col bg-[#f2f2f7] dark:bg-slate-950 overflow-hidden relative w-full h-full transition-colors duration-300">
          {activeModule === "home" ? (
            <Dashboard onSelectModule={setActiveModule} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />
          ) : (
            <div className="flex-1 flex flex-col min-h-0 relative w-full">
              {activeModule === "takeoff" && <ModuleWrapper title="2D Takeoff" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Takeoff /></ModuleWrapper>}
              {activeModule === "calculators" && <ModuleWrapper title="Construction Material Estimator" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Calculators /></ModuleWrapper>}
              {activeModule === "ai" && <ModuleWrapper title="AI Assistant" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AIAssistant /></ModuleWrapper>}
              {activeModule === "earthworks" && <ModuleWrapper title="Earthworks" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EarthworksEstimator /></ModuleWrapper>}
              {activeModule === "road" && <ModuleWrapper title="Road Estimator" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoadEstimator /></ModuleWrapper>}
              {activeModule === "sewerage" && <ModuleWrapper title="Sewerage" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><SewerageEstimator /></ModuleWrapper>}
              {activeModule === "finishing" && <ModuleWrapper title="Finishing Works" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><FinishingEstimator /></ModuleWrapper>}
              {activeModule === "house" && <ModuleWrapper title="House Estimator" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><HouseEstimator /></ModuleWrapper>}
              {activeModule === "formwork" && <ModuleWrapper title="Formwork & Scaffold" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><FormworkEstimator /></ModuleWrapper>}
              {activeModule === "rates" && <ModuleWrapper title="Market Rates" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RateAnalysis /></ModuleWrapper>}
            </div>
          )}
        </main>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
      </TakeoffProvider>
    </MarketRatesProvider>
    </HouseSpecsProvider>
    </SettingsProvider>
  );
}

function AppHeader({ title, onOpenSidebar, onOpenSettings }: { title: string; onOpenSidebar: () => void; onOpenSettings: () => void }) {
  return (
    <div className="flex items-center px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 shrink-0 h-14 transition-colors duration-300">
      <button onClick={onOpenSidebar} className="p-2 mr-3 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white flex-1 truncate pr-2">{title}</h1>
      <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors">
        <SettingsIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

function ModuleWrapper({ 
  title, 
  setActiveModule, 
  setIsSidebarOpen, 
  setIsSettingsOpen, 
  children 
}: { 
  title: string; 
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void; 
  setIsSidebarOpen: (val: boolean) => void; 
  setIsSettingsOpen: (val: boolean) => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col min-h-0">
      <AppHeader title={title} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-1 shrink-0 p-4 md:p-6 pb-2">
            {children}
          </div>
          <div className="shrink-0 px-4 py-8 mt-auto flex justify-center pb-[max(2rem,env(safe-area-inset-bottom))]">
             <button 
                onClick={() => setActiveModule("home")}
                className="group relative flex items-center justify-center gap-2.5 w-full sm:max-w-xs px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg font-bold shadow-xl shadow-blue-900/20 dark:shadow-indigo-900/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ring-4 ring-white/30 dark:ring-slate-900/50"
             >
               <svg className="w-5 h-5 -ml-1 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               <span className="tracking-wide">Back to Dashboard</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
