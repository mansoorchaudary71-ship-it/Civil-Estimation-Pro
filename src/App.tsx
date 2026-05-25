/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
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
import CbrTestCalculator from "./components/modules/CbrTestCalculator";
import VolumeEstimator from "./components/modules/VolumeEstimator";
import UnitConverter from "./components/modules/UnitConverter";
import PermeabilityCalculator from "./components/modules/PermeabilityCalculator";
import DirectShearTestCalculator from "./components/modules/DirectShearTestCalculator";
import RoofPitchCalculator from "./components/modules/RoofPitchCalculator";
import MetalWeightCalculator from "./components/modules/MetalWeightCalculator";
import GradientCalculator from "./components/modules/GradientCalculator";
import PrecastWallCalculator from "./components/modules/PrecastWallCalculator";
import AntiTermiteCalculator from "./components/modules/AntiTermiteCalculator";
import BarBendingSchedule from "./components/modules/BarBendingSchedule";
import StaircaseCalculator from "./components/modules/StaircaseCalculator";
import ColumnEstimator from "./components/modules/ColumnEstimator";
import BeamCalculator from "./components/modules/BeamCalculator";
import MasterQuantityEstimator from "./components/modules/MasterQuantityEstimator";
import MasterRccStructure from "./components/modules/MasterRccStructure";
import SlabEstimator from "./components/modules/SlabEstimator";
import EnergyMepCalculator from "./components/modules/EnergyMepCalculator";
import RainwaterHarvesting from "./components/modules/RainwaterHarvesting";
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
import { ProjectProvider } from "./context/ProjectContext";

import MasterSieveAnalysis from "./components/modules/MasterSieveAnalysis";
import AggregateBlendingCalculator from "./components/modules/AggregateBlendingCalculator";
import SolarRoofCalculator from "./components/modules/SolarRoofCalculator";
import ProjectManager from "./components/modules/ProjectManager";
import ReinforcementVisualizer from "./components/modules/ReinforcementVisualizer";
import BOQGenerator from "./components/modules/BOQGenerator";
import MixDesignCalculator from "./components/modules/MixDesignCalculator";
import RetainingWallCalculator from "./components/modules/RetainingWallCalculator";
import LabourCalculator from "./components/modules/LabourCalculator";
import IsolatedFootingCalculator from "./components/modules/IsolatedFootingCalculator";
import SiteProgressTracker from "./components/modules/SiteProgressTracker";

import { WelcomeModal } from "./components/ui/WelcomeModal";
import { HelpGuideModal } from "./components/ui/HelpGuideModal";
import Dashboard, { ALL_MODULES, getCategoryTheme } from "./components/Dashboard";
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
  Map as MapIcon, Layers, Hammer, Sparkles, Mountain, Route, Droplet, Activity, Droplets, Triangle, Bug,
  LineChart, ChevronDown, ChevronUp, Sun, Building, HelpCircle, BarChart, ClipboardList
} from "lucide-react";

import { GlobalSettingsToggle } from "./components/ui/GlobalSettingsToggle";
import { Users, Clock } from "lucide-react";

import MobileToolsSheet from "./components/MobileToolsSheet";

export const ALL_TOOLS = [
  { id: "tracker", title: "Site Progress Tracker", category: "Analysis & Tools", icon: <BarChart className="w-4 h-4" /> },
  { id: "projects", title: "Project Manager", category: "Analysis & Tools", icon: <Layers className="w-4 h-4" /> },
  { id: "boq", title: "Professional BOQ", category: "Core Estimators", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "mix-design", title: "Concrete Mix Design", category: "Core Estimators", icon: <Droplet className="w-4 h-4" /> },
  { id: "ai", title: "AI Assistant", category: "AI & Automation", icon: <Sparkles className="w-4 h-4" /> },
  { id: "takeoff", title: "2D Takeoff", category: "AI & Automation", icon: <MapIcon className="w-4 h-4" /> },
  { id: "house", title: "House Estimator", category: "Core Estimators", icon: <Home className="w-4 h-4" /> },
  { id: "master-quantity", title: "Master Quantity", category: "Core Estimators", icon: <Calculator className="w-4 h-4" /> },
  { id: "master-rcc", title: "Master RCC Structure", category: "Core Estimators", icon: <Layers className="w-4 h-4" /> },
  { id: "reinforcement", title: "Reinforcement Detailing Visualizer", category: "Core Estimators", icon: <Layers className="w-4 h-4" /> },
  { id: "calculators", title: "Material Estimator", category: "Core Estimators", icon: <Hammer className="w-4 h-4" /> },
  { id: "earthworks", title: "Earthworks", category: "Site & Infrastructure", icon: <Mountain className="w-4 h-4" /> },
  { id: "chainage", title: "Road Earthworks", category: "Site & Infrastructure", icon: <Route className="w-4 h-4" /> },
  { id: "geotechnical", title: "Geotechnical & Soil Tests", category: "Site & Infrastructure", icon: <Droplet className="w-4 h-4" /> },
  { id: "cbr-test", title: "CBR Test Calculator", category: "Site & Infrastructure", icon: <Activity className="w-4 h-4" /> },
  { id: "permeability-test", title: "Permeability Calculator", category: "Site & Infrastructure", icon: <Droplets className="w-4 h-4" /> },
  { id: "direct-shear", title: "Direct Shear Test", category: "Site & Infrastructure", icon: <Layers className="w-4 h-4" /> },
  { id: "roof-pitch", title: "Roof Pitch Calculator", category: "Analysis & Tools", icon: <Triangle className="w-4 h-4" /> },
  { id: "mep-calculator", title: "Energy & MEP Calculators", category: "MEP", icon: <Zap className="w-4 h-4" /> },
  { id: "rainwater-harvesting", title: "Rainwater Harvesting", category: "MEP", icon: <Droplet className="w-4 h-4" /> },
  { id: "anti-termite", title: "Anti-Termite Treatment", category: "Site & Infrastructure", icon: <Bug className="w-4 h-4" /> },
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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
      <ProjectProvider>
      <div className="flex flex-col h-[100dvh] w-full bg-transparent font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Toaster position="bottom-right" />
        
        <TopNavbar 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onNavigate={handleSelectModule} 
        />

        <div className="flex flex-1 min-h-0 relative w-full">
          {/* Main Sidebar (Mobile Overlay + Persistent Desktop) */}
          <Sidebar 
            activeModule={activeModule} 
            onSelectModule={handleSelectModule} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpenAuth={() => { setIsSidebarOpen(false); setIsAuthOpen(true); }}
            onOpenProfile={() => { setIsSidebarOpen(false); setIsProfileOpen(true); }}
          />

          <main id="main-content" className="flex-1 flex flex-col bg-transparent relative w-full min-h-0 md:px-6 md:pb-6 md:pt-4 transition-all duration-300">
            <div className="w-full h-full flex-1 flex flex-col min-h-0 relative transition-all duration-300">
              <div className="md:border md:border-slate-200 dark:md:border-slate-700/40 md:shadow-sm md:bg-white/50 dark:md:bg-slate-900/50 md:backdrop-blur-sm md:rounded-[32px] flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300">
            
            {["home", "my-estimates", "about", "careers", "contact", "blog", "privacy", "terms", "cookies"].includes(activeModule) ? (
            <div ref={scrollRef} className="flex-1 flex flex-col min-h-0 relative w-full overflow-x-hidden overflow-y-auto pb-32 md:pb-0">
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
            <div className="flex-1 flex flex-col min-h-0 relative w-full bg-transparent pb-32 md:pb-0">
               {/* We remove AppHeader for Desktop, handle differently inside module wrappers if needed, but for now we keep ModuleWrapper and conditionally hide AppHeader inside it on desktop */}
              {activeModule === "tracker" && <ModuleWrapper title="Site Progress Tracker" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><SiteProgressTracker /></ModuleWrapper>}
              {activeModule === "projects" && <ModuleWrapper title="Project Manager" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ProjectManager /></ModuleWrapper>}
              {activeModule === "labour-calculator" && <ModuleWrapper title="Labour & Workforce" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><LabourCalculator /></ModuleWrapper>}
              {activeModule === "boq" && <ModuleWrapper title="Professional BOQ Generator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><BOQGenerator /></ModuleWrapper>}
              {activeModule === "mix-design" && <ModuleWrapper title="Concrete Mix Design" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MixDesignCalculator /></ModuleWrapper>}
              {activeModule === "retaining-wall" && <ModuleWrapper title="Retaining Wall Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RetainingWallCalculator /></ModuleWrapper>}
              {activeModule === "isolated-footing" && <ModuleWrapper title="Isolated Footing Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><IsolatedFootingCalculator /></ModuleWrapper>}
              {activeModule === "takeoff" && <ModuleWrapper title="2D Takeoff" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Takeoff /></ModuleWrapper>}
              {activeModule === "area-calculator" && <ModuleWrapper title="Area Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AreaCalculator /></ModuleWrapper>}
              {activeModule === "property-area" && <ModuleWrapper title="Property Area" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><PropertyAreaCalculator /></ModuleWrapper>}
              {activeModule === "volume-estimator" && <ModuleWrapper title="Volume & Tank Capacity" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}><VolumeEstimator /></ModuleWrapper>}
              {activeModule === "unit-converter" && <ModuleWrapper title="Universal Unit Converter" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><UnitConverter /></ModuleWrapper>}
              {activeModule === "metal-weight" && <ModuleWrapper title="Metal Weight Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MetalWeightCalculator /></ModuleWrapper>}
              {activeModule === "mep-calculator" && <ModuleWrapper title="Energy & MEP Calculators" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EnergyMepCalculator /></ModuleWrapper>}
              {activeModule === "rainwater-harvesting" && <ModuleWrapper title="Rainwater Harvesting" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RainwaterHarvesting /></ModuleWrapper>}
              {activeModule === "gradient-calculator" && <ModuleWrapper title="Gradient & Slope Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GradientCalculator /></ModuleWrapper>}
              {activeModule === "master-rcc" && <ModuleWrapper title="Master RCC Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterRccStructure onNavigate={handleSelectModule} /></ModuleWrapper>}
              {activeModule === "reinforcement" && <ModuleWrapper title="Reinforcement Detailing Visualizer" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ReinforcementVisualizer /></ModuleWrapper>}
              {activeModule === "master-quantity" && <ModuleWrapper title="Master Quantity Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterQuantityEstimator /></ModuleWrapper>}
              {activeModule === "calculators" && <ModuleWrapper title="Construction Material Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><Calculators /></ModuleWrapper>}
              {activeModule === "ai" && <ModuleWrapper title="AI Assistant" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AIAssistant /></ModuleWrapper>}
              {activeModule === "earthworks" && <ModuleWrapper title="Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><EarthworksEstimator /></ModuleWrapper>}
              {activeModule === "chainage" && <ModuleWrapper title="Road Earthworks" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><ChainageVolumeEstimator /></ModuleWrapper>}
              {activeModule === "precast-wall" && <ModuleWrapper title="Precast Wall Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><PrecastWallCalculator /></ModuleWrapper>}
              {activeModule === "geotechnical" && <ModuleWrapper title="Geotechnical & Soil Tests" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><GeotechnicalCalculator /></ModuleWrapper>}
              {activeModule === "cbr-test" && <ModuleWrapper title="CBR Test Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><CbrTestCalculator /></ModuleWrapper>}
              {activeModule === "permeability-test" && <ModuleWrapper title="Permeability Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><PermeabilityCalculator /></ModuleWrapper>}
              {activeModule === "direct-shear" && <ModuleWrapper title="Direct Shear Test Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><DirectShearTestCalculator /></ModuleWrapper>}
              {activeModule === "roof-pitch" && <ModuleWrapper title="Roof Pitch Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoofPitchCalculator /></ModuleWrapper>}
              {activeModule === "anti-termite" && <ModuleWrapper title="Anti-Termite Treatment Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AntiTermiteCalculator /></ModuleWrapper>}
              {activeModule === "master-sieve" && <ModuleWrapper title="Master Sieve Analysis" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><MasterSieveAnalysis /></ModuleWrapper>}
              {activeModule === "aggregate-blending" && <ModuleWrapper title="Aggregate Blending Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AggregateBlendingCalculator /></ModuleWrapper>}
              {activeModule === "aggregate-tests" && <ModuleWrapper title="Aggregate Tests" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><AggregateTestsCalculator /></ModuleWrapper>}
              {activeModule === "solar-roof" && <ModuleWrapper title="Solar Roof Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><SolarRoofCalculator /></ModuleWrapper>}
              {activeModule === "road-pavement" && <ModuleWrapper title="Road & Pavement Estimator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><RoadPavementEstimator /></ModuleWrapper>}
              
              {/* Restored individual calculators */}
              {activeModule === "staircase-calculator" && <ModuleWrapper title="Staircase Calculator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><StaircaseCalculator /></ModuleWrapper>}
              {activeModule === "bbs-generator" && <ModuleWrapper title="BBS Generator" activeModule={activeModule} setActiveModule={handleSelectModule} setIsSidebarOpen={setIsSidebarOpen} setIsSettingsOpen={setIsSettingsOpen}><BarBendingSchedule /></ModuleWrapper>}

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
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <ProfileSettings isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <WelcomeModal />
        <HelpGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        
        {/* Floating Help Button */}
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-110 flex items-center justify-center group focus:outline-none"
          title="Help Guide"
        >
          <HelpCircle className="w-6 h-6 group-hover:text-amber-500 transition-colors" />
        </button>

        <MobileToolsSheet 
          isOpen={isMobileToolsOpen} 
          onClose={() => setIsMobileToolsOpen(false)} 
          onSelectModule={handleSelectModule}
        />
      </div>
      </ProjectProvider>
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
  const moduleDef = ALL_MODULES.find(m => m.id === activeModule);

  const genericFaqs = moduleDef ? [
    { q: `Is the ${moduleDef.title} Calculator free to use?`, a: `Yes, all core calculation features for the ${moduleDef.title.toLowerCase()} are completely free for all users.` },
    { q: `How accurate are the results from the ${moduleDef.title} Calculator?`, a: `Estimations follow standard civil engineering formulas and practices. Always verify critical computations.` },
    { q: `Can I use this ${moduleDef.category.toLowerCase()} tool on my mobile phone?`, a: `Absolutely. The ${moduleDef.title} Calculator is fully responsive and optimized for seamless use on smartphones and tablets.` },
    { q: `What engineering formulas does this tool use?`, a: `It strictly uses internationally recognized civil engineering formulas relevant to the ${moduleDef.category.toLowerCase()} field.` },
    { q: `Do I need to sign up to use the ${moduleDef.title} Calculator?`, a: `No registration is required. You can use the ${moduleDef.title} Calculator immediately in your browser.` },
    { q: `Is my calculation data saved securely?`, a: `All calculations for the ${moduleDef.title} Calculator are processed locally in your browser to assure data privacy.` },
    { q: `Can I export the results from the ${moduleDef.title} Calculator?`, a: `Yes, you can copy the results or use our platform features to export the final calculations to PDF or save them.` },
    { q: `How often is the ${moduleDef.title} Calculator updated?`, a: `Our ${moduleDef.category.toLowerCase()} tools and standard rates are regularly updated to ensure high accuracy and reliability.` },
    { q: `Are Metric and Imperial units both supported?`, a: `The ${moduleDef.title} Calculator supports smart unit inputs allowing seamless operations for global projects.` },
    { q: `Who built the ${moduleDef.title} Calculator?`, a: `This tool was developed by Civil Estimation Pro's engineering validation team.` },
    { q: `Can I request a new feature for the ${moduleDef.title}?`, a: `We love user feedback. Reach out to us if you need more capabilities for the ${moduleDef.title} Calculator.` },
    { q: `Is this tool suitable for students?`, a: `Yes, it is highly recommended for academic learning, providing real-world exposure to ${moduleDef.category.toLowerCase()} estimation.` },
    { q: `Does this replace professional structural software?`, a: `While highly accurate, the ${moduleDef.title} Calculator is designed for quick estimations and shouldn't replace certified comprehensive structural reports.` },
    { q: `Can I embed the ${moduleDef.title} Calculator on my site?`, a: `Currently, the tool is exclusively available on Civil Estimation Pro.` },
    { q: `What if I encounter a bug in the ${moduleDef.title} Calculator?`, a: `Please report it using our feedback form so we can immediately fix any issues.` }
  ] : [];

  return (
    <div className="h-full flex flex-col min-h-0 bg-transparent">
      {moduleDef && (
        <Helmet>
          <title>{`${moduleDef.title} Calculator – Free Online ${moduleDef.category} Tool | Civil Estimation Pro`}</title>
          <meta name="description" content={`Free ${moduleDef.title} Calculator online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`} />
          <meta name="keywords" content={`civil engineering calculator, ${moduleDef.title.toLowerCase()}, ${moduleDef.category.toLowerCase()} calculator`} />
          <link rel="canonical" href={`https://civilestimationpro.com/tools/${moduleDef.id}`} />
          
          <meta property="og:title" content={`${moduleDef.title} Calculator | Civil Estimation Pro`} />
          <meta property="og:description" content={`Free ${moduleDef.title} Calculator online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://civilestimationpro.com/tools/${moduleDef.id}`} />
          <meta property="og:site_name" content="Civil Estimation Pro" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${moduleDef.title} Calculator | Civil Estimation Pro`} />
          <meta name="twitter:description" content={`Free ${moduleDef.title} Calculator online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`} />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": `${moduleDef.title} Calculator`,
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "Web Browser",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "128"
                  },
                  "description": moduleDef.desc
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": genericFaqs.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": f.a
                    }
                  }))
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://civilestimationpro.com"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": moduleDef.title,
                      "item": `https://civilestimationpro.com/tools/${moduleDef.id}`
                    }
                  ]
                }
              ]
            })}
          </script>
        </Helmet>
      )}
      <AppHeader 
        title={title} 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setActiveModule("home")}
      />

      <div className="flex-1 overflow-y-auto w-full max-w-full">
        <div className="min-h-full flex flex-col items-center pb-[140px] md:pb-[140px]">
          <div className="w-full max-w-full">
            
            {/* Added breadcrumb for desktop */}
            <div className="hidden md:flex ml-8 mt-6 mb-2">
              <Breadcrumb items={[
                { label: "Home", isHome: true, onClick: () => setActiveModule("home") },
                { label: title }
              ]} />
            </div>

            {(() => {
              let themeHex = '#54a0ff';
              if (moduleDef) {
                 const theme = getCategoryTheme(moduleDef.category, moduleDef.id);
                 const match = theme.bg.match(/#([a-fA-F0-9]{6})/);
                 if (match) themeHex = match[0];
              }
              return (
                <div 
                  className="flex-1 shrink-0 px-4 md:px-8 pb-6 w-full themed-tool-container relative"
                  style={{ '--tool-theme-color': themeHex } as React.CSSProperties}
                >
                  {moduleDef && (
                    <div className="mb-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {moduleDef.title} Calculator
                        </h1>
                        {moduleDef.isPopular && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 text-sm font-semibold whitespace-nowrap">
                            🔥 Most popular this week
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl text-base mb-4">
                        {moduleDef.desc}
                      </p>

                      {/* Social Signals */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500 flex">
                            {"★".repeat(5)}
                          </span>
                          <span className="font-medium ml-1">4.9/5</span>
                          <span>(128 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>Calculated by 10,000+ engineers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {children}
                  
                  {moduleDef && (
                    <>
                      <div className="mt-8 mb-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl text-base mb-8">
                          Your calculation updates strictly in real-time above. All numerical estimations generated by the <strong>{moduleDef.title} Calculator</strong> are automatically derived using your defined input parameters and globally recognized {moduleDef.category.toLowerCase()} formulas.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">How to Use the {moduleDef.title} Calculator</h2>
                            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
                              <li>Select your preferred units of measurement</li>
                              <li>Input the primary dimensions and parameters</li>
                              <li>Review any standard constants and adjust if necessary</li>
                              <li>Check the real-time generated results and summaries</li>
                              <li>Export the calculation to PDF or save it for later</li>
                            </ol>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{moduleDef.title} Details</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                              This tool is specifically designed for civil engineers, contractors, and students to calculate requirements with unparalleled speed and accuracy. Our implementation seamlessly integrates the latest engineering guidelines to ensure you receive a robust estimation process directly in your browser.
                            </p>
                          </div>
                        </div>

                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                          {genericFaqs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                              <h3 className="font-medium text-sm text-slate-800 dark:text-slate-200">{faq.q}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{faq.a}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Related Tools */}
                      <div className="mt-8 mb-6 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Related Engineering Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {ALL_MODULES.filter(m => m.category === moduleDef.category && m.id !== moduleDef.id).slice(0, 3).map(related => (
                            <button
                              key={related.id}
                              onClick={() => setActiveModule(related.id as any)}
                              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
                            >
                              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{related.title}</h3>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{related.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comments / Discussion Widget */}
                      <div className="mt-8 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Discussion & Comments</h2>
                          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                            1,423 engineers found this helpful
                          </span>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500">M</div>
                             <div className="flex-1">
                               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800">
                                 <div className="flex items-center justify-between mb-2">
                                   <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Muhammad A.</h4>
                                   <span className="text-xs text-slate-500">2 days ago</span>
                                 </div>
                                 <p className="text-sm text-slate-600 dark:text-slate-400">This {moduleDef.title.toLowerCase()} tool saved me hours of manual calculations. Highly recommended for quick site estimations!</p>
                               </div>
                             </div>
                           </div>
                           
                           <div className="mt-4 flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 font-bold text-indigo-600 dark:text-indigo-400"> You</div>
                             <div className="flex-1 relative">
                               <textarea 
                                 placeholder="Add a comment or ask a question..." 
                                 className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                 rows={3}
                               />
                               <button className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-colors">
                                 Post
                               </button>
                             </div>
                           </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
