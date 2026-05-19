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
import PropertyAreaCalculator from "./components/modules/PropertyAreaCalculator";
import GeotechnicalCalculator from "./components/modules/GeotechnicalCalculator";
import AggregateTestsCalculator from "./components/modules/AggregateTestsCalculator";
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

import MasterSieveAnalysis from "./components/modules/MasterSieveAnalysis";
import AggregateBlendingCalculator from "./components/modules/AggregateBlendingCalculator";
import SolarRoofCalculator from "./components/modules/SolarRoofCalculator";

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
  LineChart, ChevronDown, ChevronUp, Sun, Building
} from "lucide-react";
import { GlobalSettingsToggle } from "./components/ui/GlobalSettingsToggle";
import { OnboardingModal } from "./components/ui/OnboardingModal";

import MobileToolsSheet from "./components/MobileToolsSheet";

export const ALL_TOOLS = [
  { id: "ai", title: "AI Assistant", category: "AI & Automation", icon: <Sparkles className="w-4 h-4" /> },
  { id: "takeoff", title: "2D Takeoff", category: "AI & Automation", icon: <MapIcon className="w-4 h-4" /> },
  { id: "house", title: "House Estimator", category: "Core Estimators", icon: <Home className="w-4 h-4" /> },
  { id: "master-quantity", title: "Master Quantity", category: "Core Estimators", icon: <Calculator className="w-4 h-4" /> },
  { id: "master-rcc", title: "Master RCC Structure", category: "Core Estimators", icon: <Layers className="w-4 h-4" /> },
  { id: "calculators", title: "Material Estimator", category: "Core Estimators", icon: <Hammer className="w-4 h-4" /> },
  { id: "earthworks", title: "Earthworks", category: "Site & Infrastructure", icon: <Mountain className="w-4 h-4" /> },
  { id: "chainage", title: "Road Earthworks", category: "Site & Infrastructure", icon: <Route className="w-4 h-4" /> },
  { id: "geotechnical", title: "Geotechnical & Soil Tests", category: "Site & Infrastructure", icon: <Droplet className="w-4 h-4" /> },
  { id: "master-sieve", title: "Master Sieve Analysis", category: "Site & Infrastructure", icon: <LineChart className="w-4 h-4" /> },
  { id: "aggregate-blending", title: "Aggregate Blending Calculator", category: "Site & Infrastructure", icon: <Layers className="w-4 h-4" /> },
  { id: "solar-roof", title: "Solar Roof Calculator", category: "Site & Infrastructure", icon: <Sun className="w-4 h-4" /> },
  { id: "road-pavement", title: "Road & Pavement", category: "Site & Infrastructure", icon: <Route className="w-4 h-4" /> },
  { id: "interiors-finishes", title: "Interiors & Finishes", category: "Finishes & Specs", icon: <Box className="w-4 h-4" /> },
  { id: "formwork", title: "Formwork & Scaffold", category: "Finishes & Specs", icon: <Layers className="w-4 h-4" /> },
  { id: "metal-weight", title: "Metal Weight Calculator", category: "Finishes & Specs", icon: <Weight className="w-4 h-4" /> },
  { id: "area-calculator", title: "Area Calculator", category: "Analysis & Tools", icon: <Square className="w-4 h-4" /> },
  { id: "property-area", title: "Property Area Calculator", category: "Analysis & Tools", icon: <Building className="w-4 h-4" /> },
  { id: "volume-estimator", title: "Volume & Tank Capacity", category: "Analysis & Tools", icon: <Box className="w-4 h-4" /> },
  { id: "unit-converter", title: "Universal Unit Converter", category: "Analysis & Tools", icon: <ArrowRightLeft className="w-4 h-4" /> },
  { id: "mep-calculator", title: "Energy & MEP", category: "Analysis & Tools", icon: <Zap className="w-4 h-4" /> },
  { id: "gradient-calculator", title: "Gradient & Slope", category: "Analysis & Tools", icon: <LineChart className="w-4 h-4" /> },
  { id: "rates", title: "Market Rates", category: "Analysis & Tools", icon: <LineChart className="w-4 h-4" /> },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModule, setActiveModule] = useState<ModuleId>("home");
  const [previousModule, setPreviousModule] = useState<ModuleId | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Core Estimators");
  const scrollRef = useRef<HTMLDivElement>(null);

  const toolsByCategory = ALL_TOOLS.reduce((acc, tool) => {
    const cat = tool.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {} as Record<string, typeof ALL_TOOLS[0][]>);
  
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
        
        <TopNavbar 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onNavigate={handleSelectModule} 
        />

        {/* Existing Mobile Sidebar Menu overlay */}
        <Sidebar 
          activeModule={activeModule} 
          onSelectModule={handleSelectModule} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenAuth={() => { setIsSidebarOpen(false); setIsAuthOpen(true); }}
          onOpenProfile={() => { setIsSidebarOpen(false); setIsProfileOpen(true); }}
        />

        <main id="main-content" className="flex-1 flex flex-col md:flex-row gap-6 bg-transparent overflow-hidden relative w-full h-full md:px-6 md:pb-6 md:pt-4 transition-all duration-300">
          
          {/* Left Navigation Hub (Tools Sidebar, 25% on tablet/desktop) */}
          <div className="hidden md:flex w-1/4 flex-col min-h-0 overflow-hidden relative transition-all duration-300">
             <div className="md:border md:border-slate-200 dark:md:border-slate-700/40 md:bg-white/60 dark:md:bg-slate-900/60 md:backdrop-blur-xl md:rounded-[32px] md:shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden w-full transition-colors duration-300 relative">
                
                {/* Sticky Search Bar */}
                <div className="shrink-0 p-6 pb-4 bg-transparent">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center flex-1 h-[48px] bg-transparent rounded-[50px] border-2 border-[var(--accent-vibrant)] transition-all group overflow-hidden">
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tools..." 
                        className="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-[14px] font-medium text-[var(--primary-dark)] dark:text-white placeholder:text-slate-400 pl-4 pr-3"
                      />
                    </div>
                    <button className="w-[48px] h-[48px] flex items-center justify-center shrink-0 rounded-full border-2 border-[var(--accent-vibrant)] text-[var(--accent-vibrant)] hover:bg-[var(--accent-vibrant)] hover:text-white transition-colors cursor-default md:cursor-pointer">
                      <Search className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                  {Object.entries(toolsByCategory).map(([category, tools]) => {
                     const filteredTools = tools.filter(tool => tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.category?.toLowerCase().includes(searchTerm.toLowerCase()));
                     if (searchTerm && filteredTools.length === 0) return null;
                     
                     const isExpanded = expandedCategory === category || searchTerm !== "";
                     
                     return (
                       <div key={category} className="mb-3">
                         <button
                           onClick={() => setExpandedCategory(isExpanded && !searchTerm ? null : category)}
                           className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
                         >
                           <span className="font-bold text-[13px] uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-[var(--primary-dark)] dark:group-hover:text-white transition-colors">{category}</span>
                           {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                         </button>
                         
                         {isExpanded && (
                           <div className="mt-1 space-y-1 pl-2 pr-2">
                             {(searchTerm ? filteredTools : tools).map(tool => (
                               <button
                                 key={tool.id}
                                 onClick={() => handleSelectModule(tool.id as ModuleId)}
                                 className={`group flex items-center gap-3 w-full p-2.5 rounded-xl border border-transparent transition-all duration-200 text-left relative ${activeModule === tool.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:scale-[1.01] hover:border-slate-100 dark:hover:border-slate-700'}`}
                               >
                                 <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeModule === tool.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-[var(--accent-vibrant)] group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20'}`}>
                                   {tool.icon}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <h4 className={`font-semibold text-[13px] truncate transition-colors ${activeModule === tool.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300 group-hover:text-[var(--primary-dark)] dark:group-hover:text-white'}`}>{tool.title}</h4>
                                 </div>
                                 {activeModule === tool.id && (
                                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full"></div>
                                 )}
                               </button>
                             ))}
                           </div>
                         )}
                       </div>
                     );
                  })}
                  {searchTerm && Object.values(toolsByCategory).flat().filter(tool => tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.category?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No tools found matching "{searchTerm}"
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* Main Content Area (75% on tablet/desktop) */}
          <div className="w-full md:w-3/4 flex flex-col min-h-0 overflow-hidden relative transition-all duration-300">
            <div className="md:border md:border-slate-200 dark:md:border-slate-700/40 md:shadow-sm md:bg-white/50 dark:md:bg-slate-900/50 md:backdrop-blur-sm md:rounded-[32px] flex-1 flex flex-col min-h-0 overflow-hidden relative w-full transition-colors duration-300">
            
            {["home", "my-estimates", "about", "careers", "contact", "blog", "privacy", "terms", "cookies"].includes(activeModule) ? (
            <div ref={scrollRef} className="flex-1 flex flex-col min-h-0 relative w-full overflow-y-auto pb-24 md:pb-0">
              <div className="flex flex-col min-h-full relative w-full">
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
            <div className="flex-1 flex flex-col min-h-0 relative w-full bg-white dark:bg-[#0e0d07] md:bg-transparent dark:md:bg-transparent pb-24 md:pb-0">
               {/* We remove AppHeader for Desktop, handle differently inside module wrappers if needed, but for now we keep ModuleWrapper and conditionally hide AppHeader inside it on desktop */}
              {activeModule === "takeoff" && <ModuleWrapper title="2D Takeoff" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Takeoff /></ModuleWrapper>}
              {activeModule === "area-calculator" && <ModuleWrapper title="Area Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AreaCalculator /></ModuleWrapper>}
              {activeModule === "property-area" && <ModuleWrapper title="Property Area" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><PropertyAreaCalculator /></ModuleWrapper>}
              {activeModule === "volume-estimator" && <ModuleWrapper title="Volume & Tank Capacity" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}><VolumeEstimator /></ModuleWrapper>}
              {activeModule === "unit-converter" && <ModuleWrapper title="Universal Unit Converter" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><UnitConverter /></ModuleWrapper>}
              {activeModule === "metal-weight" && <ModuleWrapper title="Metal Weight Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MetalWeightCalculator /></ModuleWrapper>}
              {activeModule === "mep-calculator" && <ModuleWrapper title="Energy & MEP Calculators" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EnergyMepCalculator /></ModuleWrapper>}
              {activeModule === "gradient-calculator" && <ModuleWrapper title="Gradient & Slope Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GradientCalculator /></ModuleWrapper>}
              {activeModule === "master-rcc" && <ModuleWrapper title="Master RCC Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterRccStructure onNavigate={handleSelectModule} /></ModuleWrapper>}
              {activeModule === "master-quantity" && <ModuleWrapper title="Master Quantity Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterQuantityEstimator /></ModuleWrapper>}
              {activeModule === "calculators" && <ModuleWrapper title="Construction Material Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Calculators /></ModuleWrapper>}
              {activeModule === "ai" && <ModuleWrapper title="AI Assistant" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AIAssistant /></ModuleWrapper>}
              {activeModule === "earthworks" && <ModuleWrapper title="Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EarthworksEstimator /></ModuleWrapper>}
              {activeModule === "chainage" && <ModuleWrapper title="Road Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ChainageVolumeEstimator /></ModuleWrapper>}
              {activeModule === "geotechnical" && <ModuleWrapper title="Geotechnical & Soil Tests" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GeotechnicalCalculator /></ModuleWrapper>}
              {activeModule === "master-sieve" && <ModuleWrapper title="Master Sieve Analysis" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterSieveAnalysis /></ModuleWrapper>}
              {activeModule === "aggregate-blending" && <ModuleWrapper title="Aggregate Blending Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AggregateBlendingCalculator /></ModuleWrapper>}
              {activeModule === "aggregate-tests" && <ModuleWrapper title="Aggregate Tests" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AggregateTestsCalculator /></ModuleWrapper>}
              {activeModule === "solar-roof" && <ModuleWrapper title="Solar Roof Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><SolarRoofCalculator /></ModuleWrapper>}
              {activeModule === "road-pavement" && <ModuleWrapper title="Road & Pavement Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoadPavementEstimator /></ModuleWrapper>}
              {activeModule === "interiors-finishes" && <ModuleWrapper title="Interiors & Finishes" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><InteriorsFinishesEstimator /></ModuleWrapper>}
              {activeModule === "house" && <ModuleWrapper title="House Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><HouseEstimator /></ModuleWrapper>}
              {activeModule === "formwork" && <ModuleWrapper title="Formwork & Scaffold" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><FormworkEstimator /></ModuleWrapper>}
              {activeModule === "rates" && <ModuleWrapper title="Market Rates" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RateAnalysis /></ModuleWrapper>}
            </div>
          )}
          
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
        <MobileToolsSheet 
          isOpen={isMobileToolsOpen} 
          onClose={() => setIsMobileToolsOpen(false)} 
          onSelectModule={handleSelectModule}
        />

        {/* Floating Tools Button (Mobile Only) */}
        {!isMobileToolsOpen && (
          <button
            onClick={() => setIsMobileToolsOpen(true)}
            className="md:hidden fixed bottom-24 right-5 z-[45] w-14 h-14 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,107,0,0.4)] hover:bg-[#e66000] active:scale-95 transition-all outline-none"
            aria-label="Open Tools"
          >
            <Hammer className="w-6 h-6" />
          </button>
        )}
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
