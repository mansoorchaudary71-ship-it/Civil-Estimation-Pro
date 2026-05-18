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
import HouseEstimator from "./components/modules/HouseEstimator";
import RateAnalysis from "./components/modules/RateAnalysis";
import FormworkEstimator from "./components/modules/FormworkEstimator";
import AreaCalculator from "./components/modules/AreaCalculator";
import GeotechnicalCalculator from "./components/modules/GeotechnicalCalculator";
import VolumeEstimator from "./components/modules/VolumeEstimator";
import UnitConverter from "./components/modules/UnitConverter";
import MetalWeightCalculator from "./components/modules/MetalWeightCalculator";
import GradientCalculator from "./components/modules/GradientCalculator";
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
import { 
  Menu, Settings as SettingsIcon, Home, FileText, User as UserIcon, Plus, Search, 
  Calculator, Square, Box, ArrowRightLeft, Weight, Zap, 
  Map as MapIcon, Layers, Hammer, Sparkles, Mountain, Route, Droplet, 
  LineChart 
} from "lucide-react";
import { GlobalSettingsToggle } from "./components/ui/GlobalSettingsToggle";
import { OnboardingModal } from "./components/ui/OnboardingModal";

const ALL_TOOLS = [
  { id: "ai", title: "AI Assistant", icon: <Sparkles className="w-4 h-4" /> },
  { id: "takeoff", title: "2D Takeoff", icon: <MapIcon className="w-4 h-4" /> },
  { id: "area-calculator", title: "Area Calculator", icon: <Square className="w-4 h-4" /> },
  { id: "volume-estimator", title: "Volume Estimator", icon: <Box className="w-4 h-4" /> },
  { id: "unit-converter", title: "Universal Unit Converter", icon: <ArrowRightLeft className="w-4 h-4" /> },
  { id: "metal-weight", title: "Metal Weight Calculator", icon: <Weight className="w-4 h-4" /> },
  { id: "mep-calculator", title: "Energy & MEP Calculators", icon: <Zap className="w-4 h-4" /> },
  { id: "gradient-calculator", title: "Gradient & Slope Calculator", icon: <LineChart className="w-4 h-4" /> },
  { id: "master-rcc", title: "Master RCC Estimator", icon: <Layers className="w-4 h-4" /> },
  { id: "master-quantity", title: "Master Quantity Estimator", icon: <Calculator className="w-4 h-4" /> },
  { id: "calculators", title: "Construction Material Estimator", icon: <Hammer className="w-4 h-4" /> },
  { id: "earthworks", title: "Earthworks", icon: <Mountain className="w-4 h-4" /> },
  { id: "chainage", title: "Road Earthworks", icon: <Route className="w-4 h-4" /> },
  { id: "geotechnical", title: "Geotechnical & Soil Tests", icon: <Droplet className="w-4 h-4" /> },
  { id: "road-pavement", title: "Road & Pavement Estimator", icon: <Route className="w-4 h-4" /> },
  { id: "interiors-finishes", title: "Interiors & Finishes", icon: <Box className="w-4 h-4" /> },
  { id: "house", title: "House Estimator", icon: <Home className="w-4 h-4" /> },
  { id: "formwork", title: "Formwork & Scaffold", icon: <Layers className="w-4 h-4" /> },
  { id: "rates", title: "Market Rates", icon: <LineChart className="w-4 h-4" /> },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
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
      <div className="flex flex-col h-[100dvh] w-full bg-transparent overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Toaster position="bottom-right" />
        
        {/* Left Icon Sidebar */}
        <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[80px]  z-50 py-6 items-center border-r border-[#222]">
             {/* Top Logo Circle */}
             <div className="w-[42px] h-[42px] rounded-full bg-[#111111] flex items-center justify-center mb-8 cursor-pointer shrink-0 shadow-sm" onClick={() => handleSelectModule("home")}>
               <Logo className="w-5 h-5 text-white" />
             </div>

             <div className="flex flex-col items-center gap-3 w-full px-3">
               <button onClick={() => handleSelectModule("home")} className={`w-full aspect-square flex items-center justify-center rounded-[10px] transition-colors ${activeModule === "home" ? "bg-indigo-600 text-indigo-600" : "text-[#555555] hover:bg-white/[0.07] hover:text-[#CCCCCC]"}`} title="Home">
                 <Home className="w-5 h-5" strokeWidth={2.5} />
               </button>
               <button onClick={() => handleSelectModule("my-estimates")} className={`w-full aspect-square flex items-center justify-center rounded-[10px] transition-colors ${activeModule === "my-estimates" ? "bg-indigo-600 text-indigo-600" : "text-[#555555] hover:bg-white/[0.07] hover:text-[#CCCCCC]"}`} title="Estimates">
                 <FileText className="w-5 h-5" strokeWidth={2.5} />
               </button>
             </div>

             <div className="flex flex-col items-center gap-3 mt-auto w-full px-3">
               <button onClick={() => setIsProfileOpen(true)} className="w-full aspect-square flex items-center justify-center rounded-[10px] text-[#555555] hover:bg-white/[0.07] hover:text-[#CCCCCC] transition-colors" title="Profile">
                 <UserIcon className="w-5 h-5" strokeWidth={2.5} />
               </button>
               <button onClick={() => setIsSettingsOpen(true)} className="w-full aspect-square flex items-center justify-center rounded-[10px] text-[#555555] hover:bg-white/[0.07] hover:text-[#CCCCCC] transition-colors" title="Settings">
                 <SettingsIcon className="w-5 h-5" strokeWidth={2.5} />
               </button>
             </div>
        </div>

        {/* Global Header */}
        <header className="hidden md:flex items-center justify-end pointer-events-none px-6 py-5 absolute top-0 left-0 right-0 z-40 md:pl-[100px]">
           {/* Central / Right Control Bar */}
           <div className="pointer-events-auto flex items-center gap-3 px-3 py-2 bg-[#FFFFFF] rounded-full border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
               <button className="flex items-center gap-2 text-[14px] font-semibold text-[#888888] hover:text-indigo-600 px-3 py-1.5 transition-colors">
                  <Search className="w-4 h-4"/>
                  <span>Search</span>
               </button>
               <div className="w-px h-5 bg-black/10" />
               <div className="px-2">
                 <GlobalSettingsToggle />
               </div>
               <div className="w-px h-5 bg-black/10" />
               <button onClick={() => handleSelectModule("house")} className="flex items-center gap-2 text-[14px] font-semibold text-white bg-indigo-600 hover:bg-black px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm">
                  <Plus className="w-4 h-4"/>
                  <span>New Estimate</span>
               </button>
           </div>
        </header>

        {/* Existing Mobile Sidebar Menu overlay */}
        <Sidebar 
          activeModule={activeModule} 
          onSelectModule={handleSelectModule} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenAuth={() => { setIsSidebarOpen(false); setIsAuthOpen(true); }}
          onOpenProfile={() => { setIsSidebarOpen(false); setIsProfileOpen(true); }}
        />

        <main id="main-content" className="flex-1 flex flex-col md:flex-row gap-6 bg-transparent overflow-hidden relative w-full h-full md:pl-[110px] md:pt-24 md:pr-6 md:pb-6 transition-all duration-300">
          
          {/* Main Content Area (75% on tablet/desktop) */}
          <div className="w-full md:w-3/4 flex flex-col min-h-0 overflow-hidden relative transition-all duration-300">
            <div className="md:border md:border-slate-200 dark:md:border-slate-700/40 md:shadow-sm md:bg-white/50 dark:md:bg-slate-900/50 md:backdrop-blur-sm md:rounded-[32px] flex-1 flex flex-col min-h-0 overflow-hidden relative w-full transition-colors duration-300">
            
            {["home", "my-estimates", "about", "careers", "contact", "blog", "privacy", "terms", "cookies"].includes(activeModule) ? (
            <div ref={scrollRef} className="flex-1 flex flex-col min-h-0 relative w-full overflow-y-auto">
              <div className="flex flex-col min-h-full relative w-full">
                <div className="md:hidden">
                  <TopNavbar 
                    onOpenSidebar={() => setIsSidebarOpen(true)} 
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    onNavigate={handleSelectModule} 
                  />
                </div>
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
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 relative w-full bg-white dark:bg-[#0e0d07] md:bg-transparent dark:md:bg-transparent">
               {/* We remove AppHeader for Desktop, handle differently inside module wrappers if needed, but for now we keep ModuleWrapper and conditionally hide AppHeader inside it on desktop */}
              {activeModule === "takeoff" && <ModuleWrapper title="2D Takeoff" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Takeoff /></ModuleWrapper>}
              {activeModule === "area-calculator" && <ModuleWrapper title="Area Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AreaCalculator /></ModuleWrapper>}
              {activeModule === "volume-estimator" && <ModuleWrapper title="Volume Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}><VolumeEstimator /></ModuleWrapper>}
              {activeModule === "unit-converter" && <ModuleWrapper title="Universal Unit Converter" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><UnitConverter /></ModuleWrapper>}
              {activeModule === "metal-weight" && <ModuleWrapper title="Metal Weight Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MetalWeightCalculator /></ModuleWrapper>}
              {activeModule === "mep-calculator" && <ModuleWrapper title="Energy & MEP Calculators" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EnergyMepCalculator /></ModuleWrapper>}
              {activeModule === "gradient-calculator" && <ModuleWrapper title="Gradient & Slope Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GradientCalculator /></ModuleWrapper>}
              {activeModule === "master-rcc" && <ModuleWrapper title="Master RCC Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterRccStructure /></ModuleWrapper>}
              {activeModule === "master-quantity" && <ModuleWrapper title="Master Quantity Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterQuantityEstimator /></ModuleWrapper>}
              {activeModule === "calculators" && <ModuleWrapper title="Construction Material Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Calculators /></ModuleWrapper>}
              {activeModule === "ai" && <ModuleWrapper title="AI Assistant" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AIAssistant /></ModuleWrapper>}
              {activeModule === "earthworks" && <ModuleWrapper title="Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EarthworksEstimator /></ModuleWrapper>}
              {activeModule === "chainage" && <ModuleWrapper title="Road Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ChainageVolumeEstimator /></ModuleWrapper>}
              {activeModule === "geotechnical" && <ModuleWrapper title="Geotechnical & Soil Tests" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GeotechnicalCalculator /></ModuleWrapper>}
              {activeModule === "road-pavement" && <ModuleWrapper title="Road & Pavement Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoadPavementEstimator /></ModuleWrapper>}
              {activeModule === "interiors-finishes" && <ModuleWrapper title="Interiors & Finishes" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><InteriorsFinishesEstimator /></ModuleWrapper>}
              {activeModule === "house" && <ModuleWrapper title="House Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><HouseEstimator /></ModuleWrapper>}
              {activeModule === "formwork" && <ModuleWrapper title="Formwork & Scaffold" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><FormworkEstimator /></ModuleWrapper>}
              {activeModule === "rates" && <ModuleWrapper title="Market Rates" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RateAnalysis /></ModuleWrapper>}
            </div>
          )}
          
          </div>
          </div>

          {/* Right Sidebar Area (25% on tablet/desktop) */}
          <div className="hidden md:flex w-1/4 flex-col min-h-0 overflow-hidden relative transition-all duration-300">
             <div className="md:border md:border-slate-200 dark:md:border-slate-700/40 md:bg-white/60 dark:md:bg-slate-900/60 md:backdrop-blur-xl md:rounded-[32px] md:shadow-sm flex-1 flex flex-col min-h-0 overflow-y-auto w-full transition-colors duration-300 p-6 relative">
                
                {/* Sticky Search Bar */}
                <div className="sticky top-0 z-10 mb-6 bg-transparent pt-2 -mt-2">
                  <div className="absolute -inset-x-6 -top-6 bottom-[-24px] bg-gradient-to-b from-white/95 via-white/80 to-transparent dark:from-slate-900/95 dark:via-slate-900/80 dark:to-transparent backdrop-blur-[2px] z-[-1] pointer-events-none"></div>
                  <div className="relative flex items-center w-full h-12 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#FF6B00]/50 focus-within:border-[#FF6B00]">
                    <Search className="w-5 h-5 ml-4 mr-2 text-slate-400 shrink-0" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tools & calculations..." 
                      className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pb-6">
                  {ALL_TOOLS.filter(tool => tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.category?.toLowerCase().includes(searchTerm.toLowerCase())).map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectModule(tool.id as ModuleId)}
                      className="group flex items-center gap-3 w-full p-3 bg-white dark:bg-slate-800 rounded-[16px] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-[#FF6B00]/30 hover:-translate-y-0.5 transition-all duration-200 text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#FF6B00] group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate group-hover:text-[#FF6B00] transition-colors">{tool.title}</h4>
                        {tool.category && <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5 truncate">{tool.category}</p>}
                      </div>
                    </button>
                  ))}
                  {ALL_TOOLS.filter(tool => tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.category?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No tools found matching "{searchTerm}"
                    </div>
                  )}
                </div>
             </div>
          </div>

          <BottomNavBar 
            activeModule={activeModule} 
            onSelectModule={handleSelectModule} 
            onOpenProfile={() => setIsSidebarOpen(true)} 
          />
        </main>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <ProfileSettings isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <OnboardingModal onNavigate={handleSelectModule} />
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
    <header className="md:hidden flex items-center px-4 py-2.5 mx-2 mt-3 mb-3 bg-[#FFFFFF] border border-black/5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-3 z-30 shrink-0 min-h-[50px] transition-all duration-300">
      <button onClick={onOpenSidebar} className="p-2 mr-3 -ml-2 rounded-lg hover:bg-black/5 text-[#888888] transition-all">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 mr-5 shrink-0 hidden cursor-pointer transition-transform hover:scale-105" onClick={onGoHome}>
         <Logo className="w-6 h-6 text-indigo-600" />
      </div>
      
      {onGoHome ? (
        <div className="flex-1 min-w-0 pr-2 overflow-x-hidden flex items-center">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      ) : (
        <h1 className="text-base font-bold text-indigo-600 flex-1 min-w-0 truncate pr-2">{title}</h1>
      )}

      <button onClick={onOpenSettings} className="p-2 -mr-2 rounded-lg hover:bg-black/5 text-[#888888] transition-all">
        <SettingsIcon className="w-5 h-5" />
      </button>
    </header>
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
    <div className="h-full flex flex-col min-h-0 bg-transparent">
      <AppHeader 
        title={title} 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setActiveModule("home")}
      />

      <div className="flex-1 overflow-y-auto w-full max-w-full">
        <div className="min-h-full flex flex-col items-center pb-[130px] md:pb-6">
          <div className="w-full max-w-full">
            {/* Added breadcrumb for desktop */}
            <div className="hidden md:flex ml-8 mt-6 mb-2">
              <Breadcrumb items={[
                { label: "Home", isHome: true, onClick: () => setActiveModule("home") },
                { label: "Tools", onClick: () => setActiveModule("home") },
                { label: title }
              ]} />
            </div>
            <div className="flex-1 shrink-0 px-4 md:px-8 pb-6 w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
