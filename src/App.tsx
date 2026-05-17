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
import SewerageEstimator from "./components/modules/SewerageEstimator";
import FinishingEstimator from "./components/modules/FinishingEstimator";
import HouseEstimator from "./components/modules/HouseEstimator";
import RateAnalysis from "./components/modules/RateAnalysis";
import FormworkEstimator from "./components/modules/FormworkEstimator";
import AreaCalculator from "./components/modules/AreaCalculator";
import VolumeEstimator from "./components/modules/VolumeEstimator";
import UnitConverter from "./components/modules/UnitConverter";
import MetalWeightCalculator from "./components/modules/MetalWeightCalculator";
import GradientCalculator from "./components/modules/GradientCalculator";
import RccStructureCalculator from "./components/modules/RccStructureCalculator";
import BarBendingSchedule from "./components/modules/BarBendingSchedule";
import StaircaseCalculator from "./components/modules/StaircaseCalculator";
import ColumnEstimator from "./components/modules/ColumnEstimator";
import BeamCalculator from "./components/modules/BeamCalculator";
import MasterQuantityEstimator from "./components/modules/MasterQuantityEstimator";
import MasterRccStructure from "./components/modules/MasterRccStructure";
import SlabEstimator from "./components/modules/SlabEstimator";
import EnergyMepCalculator from "./components/modules/EnergyMepCalculator";
import InteriorsFinishesEstimator from "./components/modules/InteriorsFinishes";
import RoadPavementEstimator from "./components/modules/RoadPavementEstimator";
import SettingsModal from "./components/modules/SettingsModal";
import AuthModal from "./components/auth/AuthModal";
import ProfileSettings from "./components/auth/ProfileSettings";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

import { TakeoffProvider } from "./context/TakeoffContext";
import { MarketRatesProvider } from "./context/MarketRatesContext";
import { HouseSpecsProvider } from "./context/HouseSpecsContext";
import { SettingsProvider } from "./context/SettingsContext";

import Dashboard from "./components/Dashboard";
import RecentEstimates from "./components/RecentEstimates";
import Sidebar, { ModuleId } from "./components/Sidebar";
export type { ModuleId };
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import AboutUs from "./components/pages/AboutUs";
import Careers from "./components/pages/Careers";
import Contact from "./components/pages/Contact";
import Blog from "./components/pages/Blog";
import LegalPages from "./components/pages/LegalPages";
import { Menu, Settings as SettingsIcon } from "lucide-react";
import { GlobalSettingsToggle } from "./components/ui/GlobalSettingsToggle";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("home");
  const [previousModule, setPreviousModule] = useState<ModuleId | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { user, logOut } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      if (activeModule !== "home" || !previousModule || ["home", "my-estimates", "pricing", "about", "careers", "contact", "blog"].includes(previousModule)) {
        scrollRef.current.scrollTo(0, 0);
      }
    }
  }, [activeModule, previousModule]);

  useEffect(() => {
    const handleGoHome = () => {
      setPreviousModule(activeModule);
      setActiveModule("home");
    };
    window.addEventListener('go-home', handleGoHome);
    return () => window.removeEventListener('go-home', handleGoHome);
  }, [activeModule]);

  const handleSelectModule = (id: ModuleId) => {
    setPreviousModule(activeModule);
    setActiveModule(id);
    setIsSidebarOpen(false);
  };

  return (
    <SettingsProvider>
    <HouseSpecsProvider>
    <MarketRatesProvider>
      <TakeoffProvider>
      <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-transparent overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Toaster position="bottom-right" />
        <Sidebar 
          activeModule={activeModule} 
          onSelectModule={handleSelectModule} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenAuth={() => { setIsSidebarOpen(false); setIsAuthOpen(true); }}
          onOpenProfile={() => { setIsSidebarOpen(false); setIsProfileOpen(true); }}
        />

        <main id="main-content" className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full h-full transition-colors duration-300">
          {["home", "my-estimates", "about", "careers", "contact", "blog", "privacy", "terms", "cookies"].includes(activeModule) ? (
            <div ref={scrollRef} className="flex-1 flex flex-col min-h-0 relative w-full overflow-y-auto pb-[110px] md:pb-0">
              <TopNavbar 
                onOpenSidebar={() => setIsSidebarOpen(true)} 
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onNavigate={handleSelectModule} 
              />
              {activeModule === "home" && <Dashboard previousModule={previousModule} onSelectModule={handleSelectModule} onOpenSidebar={() => setIsSidebarOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />}
              {activeModule === "my-estimates" && <RecentEstimates onSelectModule={handleSelectModule} />}
              {activeModule === "pricing" && <div className="p-8 pt-12 text-center text-slate-500">Pricing options coming soon.</div>}
              {activeModule === "about" && <div className="p-8 pt-12"><AboutUs /></div>}
              {activeModule === "careers" && <div className="p-8 pt-12"><Careers /></div>}
              {activeModule === "contact" && <div className="p-8 pt-12"><Contact /></div>}
              {activeModule === "blog" && <div className="p-8 pt-12"><Blog /></div>}
              {activeModule === "privacy" && <LegalPages page="privacy" onNavigate={handleSelectModule} />}
              {activeModule === "terms" && <LegalPages page="terms" onNavigate={handleSelectModule} />}
              {activeModule === "cookies" && <LegalPages page="cookies" onNavigate={handleSelectModule} />}
              <Footer activeModule={activeModule} onNavigate={handleSelectModule} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 relative w-full">
              {activeModule === "takeoff" && <ModuleWrapper title="2D Takeoff" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Takeoff /></ModuleWrapper>}
              {activeModule === "area-calculator" && <ModuleWrapper title="Area Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AreaCalculator /></ModuleWrapper>}
              {activeModule === "volume-estimator" && <ModuleWrapper title="Volume Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}><VolumeEstimator /></ModuleWrapper>}
              {activeModule === "unit-converter" && <ModuleWrapper title="Universal Unit Converter" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><UnitConverter /></ModuleWrapper>}
              {activeModule === "metal-weight" && <ModuleWrapper title="Metal Weight Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MetalWeightCalculator /></ModuleWrapper>}
              {activeModule === "mep-calculator" && <ModuleWrapper title="Energy & MEP Calculators" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EnergyMepCalculator /></ModuleWrapper>}
              {activeModule === "gradient-calculator" && <ModuleWrapper title="Gradient & Slope Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GradientCalculator /></ModuleWrapper>}
              {activeModule === "master-rcc" && <ModuleWrapper title="Master RCC Structure" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterRccStructure /></ModuleWrapper>}
              {activeModule === "rcc-calculator" && <ModuleWrapper title="RCC Structure Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RccStructureCalculator /></ModuleWrapper>}
              {activeModule === "master-quantity" && <ModuleWrapper title="Master Quantity Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterQuantityEstimator /></ModuleWrapper>}
              {activeModule === "calculators" && <ModuleWrapper title="Construction Material Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Calculators /></ModuleWrapper>}
              {activeModule === "ai" && <ModuleWrapper title="AI Assistant" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AIAssistant /></ModuleWrapper>}
              {activeModule === "earthworks" && <ModuleWrapper title="Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EarthworksEstimator /></ModuleWrapper>}
              {activeModule === "chainage" && <ModuleWrapper title="Road Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ChainageVolumeEstimator /></ModuleWrapper>}
              {activeModule === "road-pavement" && <ModuleWrapper title="Road & Pavement Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoadPavementEstimator /></ModuleWrapper>}
              {activeModule === "interiors-finishes" && <ModuleWrapper title="Interiors & Finishes" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><InteriorsFinishesEstimator /></ModuleWrapper>}
              {activeModule === "house" && <ModuleWrapper title="House Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><HouseEstimator /></ModuleWrapper>}
              {activeModule === "formwork" && <ModuleWrapper title="Formwork & Scaffold" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><FormworkEstimator /></ModuleWrapper>}
              {activeModule === "rates" && <ModuleWrapper title="Market Rates" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RateAnalysis /></ModuleWrapper>}
            </div>
          )}
          <BottomNavBar 
            activeModule={activeModule} 
            onSelectModule={handleSelectModule} 
            onOpenProfile={() => setIsSidebarOpen(true)} 
          />
        </main>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <ProfileSettings isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </div>
      </TakeoffProvider>
    </MarketRatesProvider>
    </HouseSpecsProvider>
    </SettingsProvider>
  );
}

import Breadcrumb, { BreadcrumbItem } from "./components/Breadcrumb";
import BottomNavBar from "./components/BottomNavBar";

function AppHeader({ title, onOpenSidebar, onOpenSettings, onGoHome }: { title: string; onOpenSidebar: () => void; onOpenSettings: () => void; onGoHome?: () => void }) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", isHome: true, onClick: onGoHome },
    { label: "Tools", onClick: onGoHome },
    { label: title }
  ];

  return (
    <div className="flex items-center px-4 md:px-6 py-2.5 mx-2 md:mx-4 mt-3 md:mt-6 mb-3 md:mb-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.04)] sticky top-3 md:top-6 z-30 shrink-0 min-h-[50px] md:min-h-[56px] transition-all duration-300">
      <button onClick={onOpenSidebar} className="p-2 mr-3 -ml-2 rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hidden md:block transition-all">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 mr-5 shrink-0 hidden md:flex cursor-pointer transition-transform hover:scale-105" onClick={onGoHome}>
         <Logo className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      
      {onGoHome ? (
        <div className="flex-1 min-w-0 pr-2 overflow-x-hidden flex items-center">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      ) : (
        <h1 className="text-[17px] font-bold text-slate-800 dark:text-white flex-1 min-w-0 truncate pr-2">{title}</h1>
      )}

      <div className="hidden sm:flex mx-3">
        <GlobalSettingsToggle />
      </div>

      <button onClick={onOpenSettings} className="p-2 -mr-2 rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 transition-all">
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

      <div className="flex-1 overflow-y-auto pb-[110px] md:pb-0">
        <div className="min-h-full flex flex-col items-center">
          <div className="flex-1 shrink-0 p-4 md:p-6 pb-6 w-full max-w-7xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
