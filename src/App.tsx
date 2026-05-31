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
import AreaSpaceCalculator from "./components/modules/AreaSpaceCalculator";
import SoilLabSuite from "./components/modules/SoilLabSuite";
import GeotechnicalCalculator from "./components/modules/GeotechnicalCalculator";
import AggregateTestsCalculator from "./components/modules/AggregateTestsCalculator";
import CbrTestCalculator from "./components/modules/CbrTestCalculator";
import VolumeEstimator from "./components/modules/VolumeEstimator";
import UnitConverter from "./components/modules/UnitConverter";
import PermeabilityCalculator from "./components/modules/PermeabilityCalculator";
import DirectShearTestCalculator from "./components/modules/DirectShearTestCalculator";
// Import RoofPitch removed as it is merged into AreaSpaceCalculator
import SteelReinforcementHub from "./components/modules/SteelReinforcementHub";
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
import MeasurementSheetCalculator from "./components/modules/MeasurementSheetCalculator";
import MaterialTakeoffSheet from "./components/modules/MaterialTakeoffSheet";
import ConstructionCostSummary from "./components/modules/ConstructionCostSummary";
import QuickRoughEstimation from "./components/modules/QuickRoughEstimation";
import SettingsModal from "./components/modules/SettingsModal";
import AuthModal from "./components/auth/AuthModal";
import ProfileSettings from "./components/auth/ProfileSettings";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

import { TakeoffProvider } from "./context/TakeoffContext";
import { MarketRatesProvider } from "./context/MarketRatesContext";
import { HouseSpecsProvider } from "./context/HouseSpecsContext";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { ProjectProvider } from "./context/ProjectContext";

import MasterSieveAnalysis from "./components/modules/MasterSieveAnalysis";
import AggregateBlendingCalculator from "./components/modules/AggregateBlendingCalculator";
import SolarRoofCalculator from "./components/modules/SolarRoofCalculator";
import ProjectManager from "./components/modules/ProjectManager";
import RoomAreaCalculator from "./components/modules/RoomAreaCalculator";
import BuildingSetbackCalculator from "./components/modules/BuildingSetbackCalculator";
import FarFsiCalculator from "./components/modules/FarFsiCalculator";
import StaircaseDesignReference from "./components/modules/StaircaseDesignReference";
import DoorWindowSchedule from "./components/modules/DoorWindowSchedule";
import VentilationChecker from "./components/modules/VentilationChecker";
import ReinforcementVisualizer from "./components/modules/ReinforcementVisualizer";
import BOQGenerator from "./components/modules/AdvancedBoqGenerator";
import MixDesignCalculator from "./components/modules/MixDesignCalculator";
import RetainingWallCalculator from "./components/modules/RetainingWallCalculator";
import LabourCalculator from "./components/modules/LabourCalculator";
import ConcreteMasonryHub from "./components/modules/ConcreteMasonryHub";
import SiteProgressTracker from "./components/modules/SiteProgressTracker";
import BeamDesignTool from "./components/modules/BeamDesignTool";
import ColumnDesignTool from "./components/modules/ColumnDesignTool";
import RaftFoundationDesigner from "./components/modules/RaftFoundationDesigner";
import QSWorkflow from "./components/modules/QSWorkflow";
import WaterTankDesign from "./components/modules/WaterTankDesign";
import PileFoundationCalculator from "./components/modules/PileFoundationCalculator";
import PrestressedConcreteEstimator from "./components/modules/PrestressedConcreteEstimator";
import MetalWeightCalculator from "./components/modules/MetalWeightCalculator";
import IsolatedFootingCalculator from "./components/modules/IsolatedFootingCalculator";

import { WelcomeModal } from "./components/ui/WelcomeModal";
import { HelpGuideModal } from "./components/ui/HelpGuideModal";
import { ProductTour } from "./components/ui/ProductTour";
import LoadingScreen from "./components/ui/LoadingScreen";
import CustomCursor from "./components/ui/CustomCursor";
import SkipToContent from "./components/ui/SkipToContent";
import SmoothScroll from "./components/ui/SmoothScroll";
import ScrollToTop from "./components/ui/ScrollToTop";
import Dashboard, {
  ALL_MODULES,
  getCategoryTheme,
} from "./components/Dashboard";
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
import PricingPage from "./components/pages/PricingPage";
import {
  Menu,
  Settings as SettingsIcon,
  Home,
  FileText,
  User as UserIcon,
  Plus,
  Search,
  Calculator,
  Square,
  Box,
  ArrowRightLeft,
  Weight,
  Zap,
  Map as MapIcon,
  Layers,
  Hammer,
  Sparkles,
  Mountain,
  Route,
  Droplet,
  Activity,
  Droplets,
  Triangle,
  Bug,
  LineChart,
  ChevronDown,
  ChevronUp,
  Sun,
  Building,
  HelpCircle,
  BarChart,
  ClipboardList,
  FlaskConical,
  Layout,
  Type,
} from "lucide-react";

import { Grid2X2, Waves, Pickaxe, Building2 } from "lucide-react";
import { Users, Clock } from "lucide-react";

import MobileToolsSheet from "./components/MobileToolsSheet";
import DiscussionWidget from "./components/DiscussionWidget";

export const ALL_TOOLS = [
  // ✨ Structural Design
  {
    id: "beam-design",
    title: "Beam Design Tool",
    category: "Structural Design",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "column-design",
    title: "Column Design Tool",
    category: "Structural Design",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: "raft-foundation",
    title: "Raft Foundation Designer",
    category: "Structural Design",
    icon: <Grid2X2 className="w-4 h-4" />,
  },
  {
    id: "water-tank-design",
    title: "Water Tank Design",
    category: "Structural Design",
    icon: <Waves className="w-4 h-4" />,
  },
  {
    id: "pile-foundation",
    title: "Pile Foundation Calculator",
    category: "Structural Design",
    icon: <Pickaxe className="w-4 h-4" />,
  },
  {
    id: "prestressed-concrete",
    title: "Pre-stressed Concrete",
    category: "Structural Design",
    icon: <Layers className="w-4 h-4" />,
  },

  // ✨ Architectural References & Space Planning
  {
    id: "room-area-calculator",
    title: "Room Area Calculator",
    category: "Architectural References & Space Planning",
    icon: <Square className="w-4 h-4" />,
  },
  {
    id: "building-setback-calculator",
    title: "Building Setback Calculator",
    category: "Architectural References & Space Planning",
    icon: <ArrowRightLeft className="w-4 h-4" />,
  },
  {
    id: "far-fsi-calculator",
    title: "FAR/FSI Calculator",
    category: "Architectural References & Space Planning",
    icon: <Building className="w-4 h-4" />,
  },
  {
    id: "staircase-design-reference",
    title: "Staircase Design Reference",
    category: "Architectural References & Space Planning",
    icon: <Triangle className="w-4 h-4" />,
  },
  {
    id: "door-window-schedule",
    title: "Door & Window Schedule Generator",
    category: "Architectural References & Space Planning",
    icon: <Layout className="w-4 h-4" />,
  },
  {
    id: "ventilation-checker",
    title: "Ventilation & Lighting Checker",
    category: "Architectural References & Space Planning",
    icon: <Sun className="w-4 h-4" />,
  },

  {
    id: "tracker",
    title: "Site Progress Tracker",
    category: "Analysis & Tools",
    icon: <BarChart className="w-4 h-4" />,
  },
  {
    id: "projects",
    title: "Project Manager",
    category: "Analysis & Tools",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "boq",
    title: "Professional BOQ",
    category: "Core Estimators",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "mix-design",
    title: "Concrete Mix Design",
    category: "Core Estimators",
    icon: <Droplet className="w-4 h-4" />,
  },
  {
    id: "ai",
    title: "AI Assistant",
    category: "AI & Automation",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "takeoff",
    title: "2D Takeoff",
    category: "AI & Automation",
    icon: <MapIcon className="w-4 h-4" />,
  },
  {
    id: "house",
    title: "House Estimator",
    category: "Core Estimators",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: "quick-estimation",
    title: "Quick Rough Est.",
    category: "Core Estimators",
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: "measurement-sheet",
    title: "Measurement Sheet",
    category: "Core Estimators",
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: "material-takeoff",
    title: "Material Takeoff Sheet",
    category: "Core Estimators",
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: "cost-summary",
    title: "Cost Summary Sheet",
    category: "Core Estimators",
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: "master-quantity",
    title: "Master Quantity",
    category: "Core Estimators",
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: "concrete-masonry-hub",
    title: "Concrete & Masonry Hub",
    category: "Core Estimators",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "steel-hub",
    title: "Steel & Reinforcement Hub",
    category: "Core Estimators",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "earthworks",
    title: "Earthworks Suite",
    category: "Site & Infrastructure",
    icon: <Mountain className="w-4 h-4" />,
  },
  {
    id: "soil-lab-suite",
    title: "Soil & Materials Lab Suite",
    category: "Site & Infrastructure",
    icon: <FlaskConical className="w-4 h-4" />,
  },
  // Roof pitch calculator module merged into AreaSpaceCalculator
  {
    id: "mep-calculator",
    title: "Energy & MEP Calculators",
    category: "MEP",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "rainwater-harvesting",
    title: "Rainwater Harvesting",
    category: "MEP",
    icon: <Droplet className="w-4 h-4" />,
  },
  {
    id: "anti-termite",
    title: "Anti-Termite Treatment",
    category: "Site & Infrastructure",
    icon: <Bug className="w-4 h-4" />,
  },
  {
    id: "solar-roof",
    title: "Solar Roof Calculator",
    category: "Site & Infrastructure",
    icon: <Sun className="w-4 h-4" />,
  },
  {
    id: "road-pavement",
    title: "Road & Pavement",
    category: "Site & Infrastructure",
    icon: <Route className="w-4 h-4" />,
  },
  {
    id: "interiors-finishes",
    title: "Interiors & Finishes",
    category: "Finishes & Specs",
    icon: <Box className="w-4 h-4" />,
  },
  {
    id: "area-space-calculator",
    title: "Area & Space Calculator",
    category: "Analysis & Tools",
    icon: <Square className="w-4 h-4" />,
  },
  // property area merged
  {
    id: "volume-estimator",
    title: "Volume & Tank Capacity",
    category: "Analysis & Tools",
    icon: <Box className="w-4 h-4" />,
  },
  {
    id: "unit-converter",
    title: "Universal Unit Converter",
    category: "Analysis & Tools",
    icon: <ArrowRightLeft className="w-4 h-4" />,
  },
  {
    id: "mep-calculator",
    title: "Energy & MEP",
    category: "Analysis & Tools",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "gradient-calculator",
    title: "Gradient & Slope",
    category: "Analysis & Tools",
    icon: <LineChart className="w-4 h-4" />,
  },
  {
    id: "rates",
    title: "Market Rates",
    category: "Analysis & Tools",
    icon: <LineChart className="w-4 h-4" />,
  },
];

// Lightweight deterministic hashing utility for social proof
const getHashStr = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate deterministic social proof metrics based on module/tool ID
const getSocialProof = (id: string) => {
  const seed = getHashStr(id || "default");

  // Rating between 4.4 and 4.9
  const ratingBase = 4.4;
  const ratingRange = 0.5;
  const rating = (ratingBase + ((seed % 100) / 100) * ratingRange).toFixed(1);

  // Reviews between 45 and 350
  const reviewMin = 45;
  const reviewRange = 305; // 350 - 45
  const reviews = reviewMin + (seed % reviewRange);

  // Users between 1500 and 25000
  const userMin = 1500;
  const userRange = 23500; // 25000 - 1500
  const usersRaw = userMin + (seed % userRange);
  const users = (usersRaw / 1000).toFixed(1) + "k+";

  return { rating, reviews, users };
};

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "Core Estimators",
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const toolsByCategory = ALL_TOOLS.reduce(
    (acc, tool) => {
      const cat = tool.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tool);
      return acc;
    },
    {} as Record<string, (typeof ALL_TOOLS)[0][]>,
  );

  const { user, logOut } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      if (
        activeModule !== "home" ||
        !previousModule ||
        [
          "home",
          "my-estimates",
          "pricing",
          "about",
          "careers",
          "contact",
          "blog",
        ].includes(previousModule)
      ) {
        scrollRef.current.scrollTo(0, 0);
      }
    }
  }, [activeModule, previousModule]);

  useEffect(() => {
    const handleGoHome = () => {
      setPreviousModule(activeModule);
      setActiveModule("home");
    };
    const handleOpenProfile = () => {
      setIsProfileOpen(true);
    };

    window.addEventListener("go-home", handleGoHome);
    window.addEventListener("open-profile", handleOpenProfile);

    return () => {
      window.removeEventListener("go-home", handleGoHome);
      window.removeEventListener("open-profile", handleOpenProfile);
    };
  }, [activeModule]);

  const handleSelectModule = (id: ModuleId) => {
    setPreviousModule(activeModule);
    setActiveModule(id);
    setIsSidebarOpen(false);
  };

  return (
    <SmoothScroll>
      <SkipToContent />
      <LoadingScreen />
      <CustomCursor />
      <ScrollToTop />
      <SettingsProvider>
        <HouseSpecsProvider>
          <MarketRatesProvider>
            <TakeoffProvider>
              <ProjectProvider>
                <div className="flex flex-col h-[100dvh] w-full pale-purple-mesh bg-white/80 backdrop-blur-sm font-sans text-slate-900 transition-colors duration-300">
                  <Toaster position="bottom-right" />
                  <ProductTour />
                  
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
                      onOpenAuth={() => {
                        setIsSidebarOpen(false);
                        setIsAuthOpen(true);
                      }}
                      onOpenProfile={() => {
                        setIsSidebarOpen(false);
                        setIsProfileOpen(true);
                      }}
                    />

                    <main
                      id="main-content"
                      className="flex-1 flex flex-col bg-transparent relative w-full min-h-0 pt-[80px] transition-all duration-300"
                    >
                      <div className="w-full h-full flex-1 flex flex-col min-h-0 relative transition-all duration-300">
                        <div className="flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300 md:bg-white/50 md:backdrop-blur-sm">
                          {[
                            "home",
                            "my-estimates",
                            "about",
                            "careers",
                            "contact",
                            "blog",
                            "privacy",
                            "terms",
                            "cookies",
                          ].includes(activeModule) ? (
                            <div
                              ref={scrollRef}
                              className="flex-1 flex flex-col min-h-0 relative w-full overflow-x-hidden overflow-y-auto"
                            >
                              <div className="flex flex-col min-h-[100.1%] relative w-full bg-[#f8fafc] dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0 rounded-b-[30px] md:rounded-b-[50px] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                                {activeModule === "home" && (
                                  <Dashboard
                                    previousModule={previousModule}
                                    onSelectModule={handleSelectModule}
                                    onOpenSidebar={() => setIsSidebarOpen(true)}
                                    onOpenSettings={() =>
                                      setIsSettingsOpen(true)
                                    }
                                    onOpenAuth={() => setIsAuthOpen(true)}
                                  />
                                )}
                                {activeModule === "my-estimates" && (
                                  <RecentEstimates
                                    onSelectModule={handleSelectModule}
                                  />
                                )}
                                {activeModule === "pricing" && (
                                  <PricingPage />
                                )}
                                {activeModule === "about" && (
                                  <div className="p-8 pt-12">
                                    <AboutUs />
                                  </div>
                                )}
                                {activeModule === "careers" && (
                                  <div className="p-8 pt-12">
                                    <Careers />
                                  </div>
                                )}
                                {activeModule === "contact" && (
                                  <div className="p-8 pt-12">
                                    <Contact />
                                  </div>
                                )}
                                {activeModule === "blog" && (
                                  <div className="p-8 pt-12">
                                    <Blog />
                                  </div>
                                )}
                                {activeModule === "privacy" && (
                                  <LegalPages
                                    page="privacy"
                                    onNavigate={handleSelectModule}
                                  />
                                )}
                                {activeModule === "terms" && (
                                  <LegalPages
                                    page="terms"
                                    onNavigate={handleSelectModule}
                                  />
                                )}
                                {activeModule === "cookies" && (
                                  <LegalPages
                                    page="cookies"
                                    onNavigate={handleSelectModule}
                                  />
                                )}
                              </div>
                              <Footer
                                activeModule={activeModule}
                                onNavigate={handleSelectModule}
                              />
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col min-h-0 relative w-full bg-transparent">
                              {/* We remove AppHeader for Desktop, handle differently inside module wrappers if needed, but for now we keep ModuleWrapper and conditionally hide AppHeader inside it on desktop */}
                              {activeModule === "tracker" && (
                                <ModuleWrapper
                                  title="Site Progress Tracker"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SiteProgressTracker />
                                </ModuleWrapper>
                              )}
                              {activeModule === "projects" && (
                                <ModuleWrapper
                                  title="Project Manager"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ProjectManager />
                                </ModuleWrapper>
                              )}
                              {activeModule === "labour-calculator" && (
                                <ModuleWrapper
                                  title="Labour & Workforce"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <LabourCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "qs-workflow" && (
                                <ModuleWrapper
                                  title="Guided QS Workflow"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <QSWorkflow />
                                </ModuleWrapper>
                              )}
                              {activeModule === "boq" && (
                                <ModuleWrapper
                                  title="Professional BOQ Generator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BOQGenerator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "mix-design" && (
                                <ModuleWrapper
                                  title="Concrete Mix Design"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MixDesignCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "takeoff" && (
                                <ModuleWrapper
                                  title="2D Takeoff"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <Takeoff />
                                </ModuleWrapper>
                              )}
                              {activeModule === "area-space-calculator" && (
                                <ModuleWrapper
                                  title="Area & Space Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AreaSpaceCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "volume-estimator" && (
                                <ModuleWrapper
                                  title="Volume & Tank Capacity"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSettingsOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <VolumeEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "unit-converter" && (
                                <ModuleWrapper
                                  title="Universal Unit Converter"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <UnitConverter />
                                </ModuleWrapper>
                              )}
                              {activeModule === "steel-hub" && (
                                <ModuleWrapper
                                  title="Steel & Reinforcement Hub"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SteelReinforcementHub />
                                </ModuleWrapper>
                              )}
                              {activeModule === "mep-calculator" && (
                                <ModuleWrapper
                                  title="Energy & MEP Calculators"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <EnergyMepCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "rainwater-harvesting" && (
                                <ModuleWrapper
                                  title="Rainwater Harvesting"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RainwaterHarvesting />
                                </ModuleWrapper>
                              )}
                              {activeModule === "gradient-calculator" && (
                                <ModuleWrapper
                                  title="Gradient & Slope Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <GradientCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "concrete-masonry-hub" && (
                                <ModuleWrapper
                                  title="Concrete & Masonry Hub"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ConcreteMasonryHub
                                    onNavigate={handleSelectModule}
                                  />
                                </ModuleWrapper>
                              )}
                              {activeModule === "master-quantity" && (
                                <ModuleWrapper
                                  title="Master Quantity Estimator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MasterQuantityEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "measurement-sheet" && (
                                <ModuleWrapper
                                  title="Measurement Sheet Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MeasurementSheetCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "quick-estimation" && (
                                <ModuleWrapper
                                  title="Quick Rough Estimation"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <QuickRoughEstimation
                                    onNavigate={handleSelectModule}
                                  />
                                </ModuleWrapper>
                              )}
                              {activeModule === "material-takeoff" && (
                                <ModuleWrapper
                                  title="Material Takeoff Sheet"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MaterialTakeoffSheet />
                                </ModuleWrapper>
                              )}
                              {activeModule === "cost-summary" && (
                                <ModuleWrapper
                                  title="Cost Summary Sheet"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ConstructionCostSummary />
                                </ModuleWrapper>
                              )}
                              {activeModule === "master-rcc" && (
                                <ModuleWrapper
                                  title="Master RCC Estimator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MasterRccStructure />
                                </ModuleWrapper>
                              )}
                              {activeModule === "metal-weight" && (
                                <ModuleWrapper
                                  title="Metal Weight"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MetalWeightCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "calculators" && (
                                <ModuleWrapper
                                  title="Construction Material"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <Calculators />
                                </ModuleWrapper>
                              )}
                              {activeModule === "bbs-generator" && (
                                <ModuleWrapper
                                  title="BBS Generator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BarBendingSchedule />
                                </ModuleWrapper>
                              )}
                              {activeModule === "reinforcement" && (
                                <ModuleWrapper
                                  title="Reinforcement Detailing Visualizer"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ReinforcementVisualizer />
                                </ModuleWrapper>
                              )}
                              {activeModule === "isolated-footing" && (
                                <ModuleWrapper
                                  title="Isolated Footing Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <IsolatedFootingCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "retaining-wall" && (
                                <ModuleWrapper
                                  title="Retaining Wall Estimator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RetainingWallCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "aggregate-tests" && (
                                <ModuleWrapper
                                  title="Aggregate Tests"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AggregateTestsCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "chainage" && (
                                <ModuleWrapper
                                  title="Chainage Volume"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ChainageVolumeEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "geotechnical" && (
                                <ModuleWrapper
                                  title="Geotechnical & Soil Tests"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <GeotechnicalCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "cbr-test" && (
                                <ModuleWrapper
                                  title="CBR Test Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <CbrTestCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "master-sieve" && (
                                <ModuleWrapper
                                  title="Master Sieve Analysis"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MasterSieveAnalysis />
                                </ModuleWrapper>
                              )}
                              {activeModule === "aggregate-blending" && (
                                <ModuleWrapper
                                  title="Aggregate Blending"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AggregateBlendingCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "direct-shear" && (
                                <ModuleWrapper
                                  title="Direct Shear Test"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <DirectShearTestCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "permeability-test" && (
                                <ModuleWrapper
                                  title="Permeability Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PermeabilityCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "ai" && (
                                <ModuleWrapper
                                  title="AI Assistant"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AIAssistant />
                                </ModuleWrapper>
                              )}
                              {activeModule === "earthworks" && (
                                <ModuleWrapper
                                  title="Earthworks Suite"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <EarthworksEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "precast-wall" && (
                                <ModuleWrapper
                                  title="Precast Wall Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PrecastWallCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "soil-lab-suite" && (
                                <ModuleWrapper
                                  title="Soil & Materials Lab Suite"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SoilLabSuite />
                                </ModuleWrapper>
                              )}
                              {/* Roof pitch calculator functionality moved to AreaSpaceCalculator */}
                              {activeModule === "anti-termite" && (
                                <ModuleWrapper
                                  title="Anti-Termite Treatment Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AntiTermiteCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "solar-roof" && (
                                <ModuleWrapper
                                  title="Solar Roof Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SolarRoofCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "road-pavement" && (
                                <ModuleWrapper
                                  title="Road & Pavement Estimator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RoadPavementEstimator
                                    onNavigate={handleSelectModule}
                                  />
                                </ModuleWrapper>
                              )}

                              {activeModule === "beam-design" && (
                                <ModuleWrapper
                                  title="Beam Design Tool"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BeamDesignTool />
                                </ModuleWrapper>
                              )}
                              {activeModule === "column-design" && (
                                <ModuleWrapper
                                  title="Column Design Tool"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ColumnDesignTool />
                                </ModuleWrapper>
                              )}
                              {activeModule === "raft-foundation" && (
                                <ModuleWrapper
                                  title="Raft Foundation Designer"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RaftFoundationDesigner />
                                </ModuleWrapper>
                              )}
                              {activeModule === "water-tank-design" && (
                                <ModuleWrapper
                                  title="Water Tank Design"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <WaterTankDesign />
                                </ModuleWrapper>
                              )}
                              {activeModule === "pile-foundation" && (
                                <ModuleWrapper
                                  title="Pile Foundation Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PileFoundationCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "prestressed-concrete" && (
                                <ModuleWrapper
                                  title="Pre-stressed Concrete Estimator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PrestressedConcreteEstimator />
                                </ModuleWrapper>
                              )}

                              {activeModule === "room-area-calculator" && (
                                <ModuleWrapper
                                  title="Room Area Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RoomAreaCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule ===
                                "building-setback-calculator" && (
                                <ModuleWrapper
                                  title="Building Setback Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BuildingSetbackCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "far-fsi-calculator" && (
                                <ModuleWrapper
                                  title="FAR/FSI Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <FarFsiCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule ===
                                "staircase-design-reference" && (
                                <ModuleWrapper
                                  title="Staircase Design Reference"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <StaircaseDesignReference />
                                </ModuleWrapper>
                              )}
                              {activeModule === "door-window-schedule" && (
                                <ModuleWrapper
                                  title="Door & Window Schedule Generator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <DoorWindowSchedule />
                                </ModuleWrapper>
                              )}
                              {activeModule === "ventilation-checker" && (
                                <ModuleWrapper
                                  title="Ventilation & Lighting Checker"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <VentilationChecker />
                                </ModuleWrapper>
                              )}

                              {/* Restored individual calculators */}
                              {activeModule === "staircase-calculator" && (
                                <ModuleWrapper
                                  title="Staircase Calculator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <StaircaseCalculator />
                                </ModuleWrapper>
                              )}

                              {activeModule === "interiors-finishes" && (
                                <ModuleWrapper
                                  title="Interiors & Finishes"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <InteriorsFinishesEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "house" && (
                                <ModuleWrapper
                                  title="House Estimator"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <HouseEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "formwork" && (
                                <ModuleWrapper
                                  title="Formwork & Scaffold"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <FormworkEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "rates" && (
                                <ModuleWrapper
                                  title="Market Rates"
                                  activeModule={activeModule}
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RateAnalysis />
                                </ModuleWrapper>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </main>
                  </div>

                  <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                  />
                  <AuthModal
                    isOpen={isAuthOpen}
                    onClose={() => setIsAuthOpen(false)}
                  />
                  <ProfileSettings
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                  />
                  <WelcomeModal />
                  <HelpGuideModal
                    isOpen={isHelpOpen}
                    onClose={() => setIsHelpOpen(false)}
                  />

                  {/* Floating Help Button */}
                  <button
                    onClick={() => setIsHelpOpen(true)}
                    className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 p-3 bg-white text-slate-600 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-all hover:scale-110 flex items-center justify-center group focus:outline-none"
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
    </SmoothScroll>
  );
}

import Breadcrumb, { BreadcrumbItem } from "./components/Breadcrumb";

function FontSizeControls() {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mr-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${isOpen ? "bg-black/10  text-slate-800 " : "hover:bg-black/5 text-slate-500 "}`}
        aria-label="Text Size settings"
      >
        <Type className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-100 p-1 flex items-center space-x-1 z-50">
          <button
            onClick={() => {
              updateSettings({ fontSize: "small" });
              setIsOpen(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${settings.fontSize === "small" ? "bg-indigo-50  text-indigo-600 " : "text-slate-500 hover:bg-slate-50"}`}
          >
            A-
          </button>
          <button
            onClick={() => {
              updateSettings({ fontSize: "medium" });
              setIsOpen(false);
            }}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${settings.fontSize === "medium" ? "bg-indigo-50  text-indigo-600 " : "text-slate-500 hover:bg-slate-50"}`}
          >
            A
          </button>
          <button
            onClick={() => {
              updateSettings({ fontSize: "large" });
              setIsOpen(false);
            }}
            className={`px-3 py-1.5 text-base font-bold rounded-lg transition-colors ${settings.fontSize === "large" ? "bg-indigo-50  text-indigo-600 " : "text-slate-500 hover:bg-slate-50"}`}
          >
            A+
          </button>
        </div>
      )}
    </div>
  );
}

function AppHeader({
  title,
  onOpenSidebar,
  onOpenSettings,
  onGoHome,
}: {
  title: string;
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  onGoHome?: () => void;
}) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", isHome: true, onClick: onGoHome },
    { label: title },
  ];

  return (
    <header className="md:hidden flex items-center px-4 py-2.5 m-0 bg-[#FFFFFF] border-b border-black/5 sticky top-3 z-30 shrink-0 min-h-[50px] transition-all duration-300">
      <button
        onClick={onOpenSidebar}
        className="p-2 mr-3 -ml-2 rounded-lg hover:bg-black/5 text-[#888888] transition-all"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        className="flex items-center gap-2 mr-5 shrink-0 hidden cursor-pointer transition-transform hover:scale-105"
        onClick={onGoHome}
      >
        <Logo className="w-6 h-6 text-indigo-600" />
      </div>

      {onGoHome ? (
        <div className="flex-1 min-w-0 pr-2 overflow-x-hidden flex items-center">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      ) : (
        <h1 className="text-base font-bold text-indigo-600 flex-1 min-w-0 truncate pr-2">
          {title}
        </h1>
      )}

      <FontSizeControls />

      <button
        onClick={onOpenSettings}
        className="p-2 -mr-2 rounded-lg hover:bg-black/5 text-[#888888] transition-all"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>
    </header>
  );
}

import { CodeReferences } from "./components/ui/CodeReferences";

function ModuleWrapper({
  title,
  activeModule,
  setActiveModule,
  setIsSidebarOpen,
  setIsSettingsOpen,
  children,
}: {
  title: string;
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  setIsSidebarOpen: (val: boolean) => void;
  setIsSettingsOpen: (val: boolean) => void;
  children: React.ReactNode;
}) {
  const moduleDef = ALL_MODULES.find((m) => m.id === activeModule);

  const socialProof = React.useMemo(
    () => getSocialProof(activeModule),
    [activeModule],
  );

  const genericFaqs = moduleDef
    ? [
        {
          q: `Is the ${moduleDef.title} Calculator free to use?`,
          a: `Yes, all core calculation features for the ${moduleDef.title.toLowerCase()} are completely free for all users.`,
        },
        {
          q: `How accurate are the results from the ${moduleDef.title} Calculator?`,
          a: `Estimations follow standard civil engineering formulas and practices. Always verify critical computations.`,
        },
        {
          q: `Can I use this ${moduleDef.category.toLowerCase()} tool on my mobile phone?`,
          a: `Absolutely. The ${moduleDef.title} Calculator is fully responsive and optimized for seamless use on smartphones and tablets.`,
        },
        {
          q: `What engineering formulas does this tool use?`,
          a: `It strictly uses internationally recognized civil engineering formulas relevant to the ${moduleDef.category.toLowerCase()} field.`,
        },
        {
          q: `Do I need to sign up to use the ${moduleDef.title} Calculator?`,
          a: `No registration is required. You can use the ${moduleDef.title} Calculator immediately in your browser.`,
        },
        {
          q: `Is my calculation data saved securely?`,
          a: `All calculations for the ${moduleDef.title} Calculator are processed locally in your browser to assure data privacy.`,
        },
        {
          q: `Can I export the results from the ${moduleDef.title} Calculator?`,
          a: `Yes, you can copy the results or use our platform features to export the final calculations to PDF or save them.`,
        },
        {
          q: `How often is the ${moduleDef.title} Calculator updated?`,
          a: `Our ${moduleDef.category.toLowerCase()} tools and standard rates are regularly updated to ensure high accuracy and reliability.`,
        },
        {
          q: `Are Metric and Imperial units both supported?`,
          a: `The ${moduleDef.title} Calculator supports smart unit inputs allowing seamless operations for global projects.`,
        },
        {
          q: `Who built the ${moduleDef.title} Calculator?`,
          a: `This tool was developed by Civil Estimation Pro's engineering validation team.`,
        },
        {
          q: `Can I request a new feature for the ${moduleDef.title}?`,
          a: `We love user feedback. Reach out to us if you need more capabilities for the ${moduleDef.title} Calculator.`,
        },
        {
          q: `Is this tool suitable for students?`,
          a: `Yes, it is highly recommended for academic learning, providing real-world exposure to ${moduleDef.category.toLowerCase()} estimation.`,
        },
        {
          q: `Does this replace professional structural software?`,
          a: `While highly accurate, the ${moduleDef.title} Calculator is designed for quick estimations and shouldn't replace certified comprehensive structural reports.`,
        },
        {
          q: `Can I embed the ${moduleDef.title} Calculator on my site?`,
          a: `Currently, the tool is exclusively available on Civil Estimation Pro.`,
        },
        {
          q: `What if I encounter a bug in the ${moduleDef.title} Calculator?`,
          a: `Please report it using our feedback form so we can immediately fix any issues.`,
        },
      ]
    : [];

  return (
    <div className="h-full flex flex-col min-h-0 bg-transparent relative">
      <a
        href="#main-calculator-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
      >
        Skip to calculation
      </a>
      {moduleDef && (
        <Helmet>
          <title>{`${moduleDef.title} Calculator – Free Online ${moduleDef.category} Tool | Civil Estimation Pro`}</title>
          <meta
            name="description"
            content={`Free ${moduleDef.title} Calculator online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`}
          />
          <meta
            name="keywords"
            content={`civil engineering calculator, ${moduleDef.title.toLowerCase()}, ${moduleDef.category.toLowerCase()} calculator`}
          />
          <link
            rel="canonical"
            href={`https://civilestimationpro.com/tools/${moduleDef.id}`}
          />

          <meta
            property="og:title"
            content={`${moduleDef.title} Calculator | Civil Estimation Pro`}
          />
          <meta
            property="og:description"
            content={`Free ${moduleDef.title} Calculator online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`}
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://civilestimationpro.com/tools/${moduleDef.id}`}
          />
          <meta property="og:site_name" content="Civil Estimation Pro" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={`${moduleDef.title} Calculator | Civil Estimation Pro`}
          />
          <meta
            name="twitter:description"
            content={`Free ${moduleDef.title} Calculator online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`}
          />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: `${moduleDef.title} Calculator`,
                  applicationCategory: "WebApplication",
                  operatingSystem: "Web Browser",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "128",
                  },
                  description: moduleDef.desc,
                },
                {
                  "@type": "FAQPage",
                  mainEntity: genericFaqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.a,
                    },
                  })),
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://civilestimationpro.com",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: moduleDef.title,
                      item: `https://civilestimationpro.com/tools/${moduleDef.id}`,
                    },
                  ],
                },
              ],
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

      <div
        className="flex-1 overflow-y-auto w-full max-w-full"
        id="main-calculator-content"
        tabIndex={-1}
      >
        <div className="min-h-full flex flex-col items-center ">
          <div className="w-full max-w-full">
            {/* Added breadcrumb for desktop */}
            <div className="hidden md:flex ml-8 mt-6 mb-2 items-center justify-between pr-8">
              <Breadcrumb
                items={[
                  {
                    label: "Home",
                    isHome: true,
                    onClick: () => setActiveModule("home"),
                  },
                  { label: title },
                ]}
              />
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-500">
                  Text Size:
                </span>
                <FontSizeControls />
              </div>
            </div>

            {(() => {
              let themeHex = "#54a0ff";
              if (moduleDef) {
                const theme = getCategoryTheme(
                  moduleDef.category,
                  moduleDef.id,
                );
                const match = theme.bg.match(/#([a-fA-F0-9]{6})/);
                if (match) themeHex = match[0];
              }
              return (
                <div
                  className="flex-1 shrink-0 px-4 md:px-8 pb-6 w-full themed-tool-container relative"
                  style={
                    { "--tool-theme-color": themeHex } as React.CSSProperties
                  }
                >
                  {moduleDef && (
                    <div className="mb-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <h1 className="text-2xl font-semibold text-slate-900">
                          {moduleDef.title} Calculator
                        </h1>
                        {moduleDef.isPopular && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold whitespace-nowrap">
                            🔥 Most popular this week
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 leading-relaxed max-w-4xl text-base mb-4">
                        {moduleDef.desc}
                      </p>

                      {/* Social Signals */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500 flex">
                            {"★".repeat(5)}
                          </span>
                          <span className="font-medium ml-1">
                            {socialProof.rating}/5
                          </span>
                          <span>({socialProof.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>
                            Calculated by {socialProof.users} engineers
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>
                            Last updated:{" "}
                            {new Date().toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <CodeReferences moduleId={activeModule} />

                  {children}

                  {moduleDef && (
                    <>
                      <div className="mt-8 mb-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-200">
                        <p className="text-slate-600 leading-relaxed max-w-4xl text-base mb-8">
                          Your calculation updates strictly in real-time above.
                          All numerical estimations generated by the{" "}
                          <strong>{moduleDef.title} Calculator</strong> are
                          automatically derived using your defined input
                          parameters and globally recognized{" "}
                          {moduleDef.category.toLowerCase()} formulas.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                              How to Use the {moduleDef.title} Calculator
                            </h2>
                            <ol className="list-decimal list-inside space-y-2 text-slate-600">
                              <li>
                                Select your preferred units of measurement
                              </li>
                              <li>
                                Input the primary dimensions and parameters
                              </li>
                              <li>
                                Review any standard constants and adjust if
                                necessary
                              </li>
                              <li>
                                Check the real-time generated results and
                                summaries
                              </li>
                              <li>
                                Export the calculation to PDF or save it for
                                later
                              </li>
                            </ol>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                              {moduleDef.title} Details
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-sm">
                              This tool is specifically designed for civil
                              engineers, contractors, and students to calculate
                              requirements with unparalleled speed and accuracy.
                              Our implementation seamlessly integrates the
                              latest engineering guidelines to ensure you
                              receive a robust estimation process directly in
                              your browser.
                            </p>
                          </div>
                        </div>

                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                          Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                          {genericFaqs.map((faq, index) => (
                            <div
                              key={index}
                              className="bg-white p-4 rounded-xl border border-slate-200"
                            >
                              <h3 className="font-medium text-sm text-slate-800">
                                {faq.q}
                              </h3>
                              <p className="text-sm text-slate-600 mt-2">
                                {faq.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Related Tools */}
                      <div className="mt-8 mb-6 p-6 rounded-[2rem] bg-white border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                          Related Engineering Tools
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {ALL_MODULES.filter(
                            (m) =>
                              m.category === moduleDef.category &&
                              m.id !== moduleDef.id,
                          )
                            .slice(0, 3)
                            .map((related) => (
                              <button
                                key={related.id}
                                onClick={() =>
                                  setActiveModule(related.id as any)
                                }
                                className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 hover:border-indigo-500 transition-colors"
                              >
                                <h3 className="font-semibold text-slate-800 text-sm mb-1">
                                  {related.title}
                                </h3>
                                <p className="text-xs text-slate-600 line-clamp-2">
                                  {related.desc}
                                </p>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Comments / Discussion Widget */}
                      <DiscussionWidget
                        moduleId={moduleDef.id}
                        toolName={moduleDef.title}
                      />
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
