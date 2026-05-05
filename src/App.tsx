/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import AIAssistant from "./components/modules/AIAssistant";
import Calculators from "./components/modules/Calculators";
import Takeoff from "./components/modules/Takeoff";
import EarthworksEstimator from "./components/modules/Earthworks";
import GridEarthworkEstimator from "./components/modules/GridEarthwork";
import TrenchExcavationEstimator from "./components/modules/TrenchExcavation";
import ChainageVolumeEstimator from "./components/modules/ChainageVolume";
import RoadEstimator from "./components/modules/RoadEstimator";
import RigidPavementEstimator from "./components/modules/RigidPavementEstimator";
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

import Dashboard from "./components/Dashboard";
import Sidebar, { ModuleId } from "./components/Sidebar";
export type { ModuleId };
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import AboutUs from "./components/pages/AboutUs";
import Careers from "./components/pages/Careers";
import Contact from "./components/pages/Contact";
import Blog from "./components/pages/Blog";
import { Menu, Settings as SettingsIcon } from "lucide-react";
import { GlobalSettingsToggle } from "./components/ui/GlobalSettingsToggle";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [activeModule]);

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
          {["home", "about", "careers", "contact", "blog"].includes(activeModule) ? (
            <div ref={scrollRef} className="flex-1 flex flex-col min-h-0 relative w-full overflow-y-auto">
              <TopNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />
              {activeModule === "home" && <Dashboard onSelectModule={setActiveModule} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />}
              {activeModule === "about" && <div className="p-8 pt-12"><AboutUs /></div>}
              {activeModule === "careers" && <div className="p-8 pt-12"><Careers /></div>}
              {activeModule === "contact" && <div className="p-8 pt-12"><Contact /></div>}
              {activeModule === "blog" && <div className="p-8 pt-12"><Blog /></div>}
              <Footer onNavigate={setActiveModule} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 relative w-full">
              {activeModule === "takeoff" && <ModuleWrapper title="2D Takeoff" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Takeoff /></ModuleWrapper>}
              {activeModule === "calculators" && <ModuleWrapper title="Construction Material Estimator" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Calculators /></ModuleWrapper>}
              {activeModule === "ai" && <ModuleWrapper title="AI Assistant" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AIAssistant /></ModuleWrapper>}
              {activeModule === "earthworks" && <ModuleWrapper title="Earthworks" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EarthworksEstimator /></ModuleWrapper>}
              {activeModule === "gridEarthwork" && <ModuleWrapper title="Grid Method Earthwork" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GridEarthworkEstimator /></ModuleWrapper>}
              {activeModule === "trench" && <ModuleWrapper title="Trench Excavation" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><TrenchExcavationEstimator /></ModuleWrapper>}
              {activeModule === "chainage" && <ModuleWrapper title="Road Earthworks" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ChainageVolumeEstimator /></ModuleWrapper>}
              {activeModule === "road" && <ModuleWrapper title="Road Estimator" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoadEstimator /></ModuleWrapper>}
              {activeModule === "rigid-pavement" && <ModuleWrapper title="Rigid Pavement Estimator" activeModule={activeModule} setActiveModule={setActiveModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RigidPavementEstimator /></ModuleWrapper>}
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

import Breadcrumb, { BreadcrumbItem } from "./components/Breadcrumb";

function AppHeader({ title, onOpenSidebar, onOpenSettings, onGoHome }: { title: string; onOpenSidebar: () => void; onOpenSettings: () => void; onGoHome?: () => void }) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", isHome: true, onClick: onGoHome },
    { label: "Tools", onClick: onGoHome },
    { label: title }
  ];

  return (
    <div className="flex items-center px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 shrink-0 h-14 transition-colors duration-300">
      <button onClick={onOpenSidebar} className="p-2 mr-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 mr-4 shrink-0 hidden md:flex cursor-pointer" onClick={onGoHome}>
         <Logo className="w-6 h-6" />
         <span className="font-bold text-[1rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
           Civil Estimation Pro
         </span>
      </div>
      
      {onGoHome ? (
        <div className="flex-1 pr-2 overflow-x-hidden flex items-center">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      ) : (
        <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white flex-1 truncate pr-2">{title}</h1>
      )}

      <div className="hidden sm:flex mr-3">
        <GlobalSettingsToggle />
      </div>

      <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors">
        <SettingsIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

function ModuleWrapper({ 
  title, 
  activeModule,
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
      <AppHeader 
        title={title} 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setActiveModule("home")}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center">
          <div className="flex-1 shrink-0 p-4 md:p-6 pb-2 w-full max-w-7xl">
            {children}
          </div>
          
          <div className="w-full p-6 pb-24 md:pb-12 flex justify-center shrink-0">
            <button 
              onClick={() => setActiveModule("home")}
              className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-full shadow-[0_8px_20px_-6px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_25px_-8px_rgba(168,85,247,0.5)] transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 group focus:outline-none focus:ring-4 focus:ring-purple-500/30"
            >
              <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </div>
              <span className="tracking-wide">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
