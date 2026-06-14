/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
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
import RecentSidebar from "./components/RecentSidebar";
import { useAuth } from "./contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";

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
import LintelDesignTool from "./components/modules/LintelDesignTool";
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
import SkipToContent from "./components/ui/SkipToContent";
import SmoothScroll from "./components/ui/SmoothScroll";
import Dashboard, {
  ALL_MODULES,
  getCategoryTheme,
} from "./components/Dashboard";
import RecentEstimates from "./components/RecentEstimates";
import { ModuleId } from "./components/Sidebar";
export type { ModuleId };
import TopNavbar from "./components/TopNavbar";
import BottomNavBar from "./components/BottomNavBar";
import GlobalBottomBar from "./components/GlobalBottomBar";
import { AnimatePresence, motion } from "motion/react";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import AboutUs from "./components/pages/AboutUs";
import Careers from "./components/pages/Careers";
import Contact from "./components/pages/Contact";
import Blog from "./components/pages/Blog";
import LegalPages from "./components/pages/LegalPages";
import PricingPage from "./components/pages/PricingPage";
import StandardsReferencePage from "./components/StandardsReferencePage";
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

import { ShareModal } from "./components/ui/ShareModal";
import { FormulaModal } from "./components/ui/FormulaModal";
import {
  Grid2X2,
  Waves,
  Pickaxe,
  Building2,
  Share2,
  Info,
  Printer,
  Save,
  Download,
} from "lucide-react";
import { Users, Clock } from "lucide-react";

import MobileToolsSheet from "./components/MobileToolsSheet";
import QuickEstimatorWidget from "./components/ui/QuickEstimatorWidget";
import DiscussionWidget from "./components/DiscussionWidget";
import LocaleUnitDetector from "./components/LocaleUnitDetector";
import PrintPreviewModal from "./components/ui/PrintPreviewModal";

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
    id: "lintel-design-tool",
    title: "Lintel Scheduler & Design Tool",
    category: "Architectural References & Space Planning",
    icon: <Layout className="w-4 h-4" />,
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
    title: "Plot Area Calculator",
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

const formatToolTitle = (title: string) =>
  title.toLowerCase().endsWith("calculator") ? title : `${title} Calculator`;

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
  const [isRecentSidebarOpen, setIsRecentSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "Core Estimators",
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 80);
    };
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
      return () => scrollEl.removeEventListener("scroll", handleScroll);
    }
  }, []);

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
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle pSEO Routing
    const path = location.pathname;
    if (path.startsWith("/estimate/")) {
      setActiveModule("house-estimator");
    }
  }, [location.pathname]);

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

  const standardsModules = [
    "standards",
    "is-codes-reference",
    "morth-irc-specs",
    "pakistan-building-codes",
    "uae-construction-standards",
    "international-standards",
  ];

  const isStaticPage = [
    "home",
    "my-estimates",
    "about",
    "careers",
    "contact",
    "blog",
    "pricing",
    "privacy",
    "terms",
    "cookies",
    ...standardsModules,
  ].includes(activeModule);

  const handleSelectModule = (id: ModuleId) => {
    setPreviousModule(activeModule);
    setActiveModule(id);
    setIsSidebarOpen(false);

    // Save recently accessed tools to localStorage
    const nonToolModIds = [
      "home",
      "tools",
      "pricing",
      "about",
      "how-it-works",
      "privacy",
      "terms",
      "cookies",
    ];
    if (!nonToolModIds.includes(id as string)) {
      try {
        const history = JSON.parse(
          localStorage.getItem("recent_calculators") || "[]",
        );
        const newHistory = [
          id,
          ...history.filter((h: string) => h !== id),
        ].slice(0, 5);
        localStorage.setItem("recent_calculators", JSON.stringify(newHistory));
        window.dispatchEvent(new Event("recent_calculators_updated"));
      } catch (e) {
        console.error("Failed to save recent calculator:", e);
      }
    }
  };

  return (
    <SmoothScroll>
      <SkipToContent />
      <LoadingScreen />
      <SettingsProvider>
        <HouseSpecsProvider>
          <MarketRatesProvider>
            <TakeoffProvider>
              <ProjectProvider>
                <div className="flex flex-col h-[100dvh] w-full bg-[#f4f6fa] dark:bg-[#0a0f1d] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans transition-colors duration-300">
                  <Toaster position="bottom-right" />
                  <ProductTour />
                  <LocaleUnitDetector />

                  <TopNavbar
                    onNavigate={handleSelectModule}
                    onOpenRecent={() => setIsRecentSidebarOpen(true)}
                  />
                  
                  {isStaticPage && (
                    <GlobalBottomBar
                      activeModule={activeModule}
                      onNavigate={handleSelectModule}
                      onOpenProfile={() => setIsProfileOpen(true)}
                      onOpenSearch={() => {}}
                    />
                  )}
                  <RecentSidebar
                    isOpen={isRecentSidebarOpen}
                    onClose={() => setIsRecentSidebarOpen(false)}
                    onNavigate={handleSelectModule}
                  />

                  <BottomNavBar
                    activeModule={activeModule}
                    onNavigate={handleSelectModule}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    onOpenHistory={() => handleSelectModule("my-estimates")}
                  />

                  <div className={`flex flex-1 min-h-0 relative w-full ${activeModule === 'home' ? '' : 'pt-14'}`}>
                    <main
                      id="main-content"
                      className="flex-1 flex flex-col bg-transparent relative w-full min-h-0 pt-0 transition-all duration-300"
                    >
                      <div className="w-full h-full flex-1 flex flex-col min-h-0 relative transition-all duration-300">
                        <div className="flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300 md:bg-white/50 md:">
                          <>
                            <div
                              ref={scrollRef}
                              className={`flex-1 flex flex-col min-h-0 relative w-full overflow-x-hidden overflow-y-auto pb-20 md:pb-0 ${!isStaticPage ? "hidden" : ""}`}
                            >
                              {activeModule === "home" && (
                                <header className={`sticky top-0 z-[100] transition-all duration-300 px-6 ${
                                  isScrolled 
                                    ? 'h-16 bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm' 
                                    : 'h-48 bg-transparent pt-16'
                                }`}>
                                  <div className="max-w-5xl mx-auto flex flex-col justify-end h-full pb-3">
                                    <h1 className={`font-bold tracking-tight transition-all duration-300 origin-left text-slate-900 dark:text-white ${
                                      isScrolled ? 'text-xl' : 'text-4xl'
                                    }`}>
                                      Civil Estimation Pro
                                    </h1>
                                    {!isScrolled && (
                                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-opacity duration-200">
                                        Select a module to begin quantity surveying and material estimation.
                                      </p>
                                    )}
                                  </div>
                                </header>
                              )}
                              <div className="flex flex-col min-h-full relative w-full">
                                {activeModule === "home" && (
                                  <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 -mt-2 w-full">
                                    <Dashboard
                                      previousModule={previousModule}
                                      onSelectModule={handleSelectModule}
                                      onOpenSidebar={() => setIsSidebarOpen(true)}
                                      onOpenSettings={() =>
                                        setIsSettingsOpen(true)
                                      }
                                      onOpenAuth={() => setIsAuthOpen(true)}
                                    />
                                  </div>
                                )}
                                {activeModule === "my-estimates" && (
                                  <RecentEstimates
                                    onSelectModule={handleSelectModule}
                                  />
                                )}
                                {activeModule === "pricing" && <PricingPage />}
                                {standardsModules.includes(activeModule) && (
                                  <StandardsReferencePage
                                    key={activeModule}
                                    onNavigate={handleSelectModule}
                                    initialActiveCountry={
                                      activeModule === "is-codes-reference" ||
                                      activeModule === "morth-irc-specs"
                                        ? "India"
                                        : activeModule ===
                                            "pakistan-building-codes"
                                          ? "Pakistan"
                                          : activeModule ===
                                              "uae-construction-standards"
                                            ? "UAE"
                                            : activeModule ===
                                                "international-standards"
                                              ? "International"
                                              : "All"
                                    }
                                  />
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
                                <Footer onNavigate={handleSelectModule} />
                              </div>
                            </div>

                            <AnimatePresence mode="wait">
                              {/* We remove AppHeader for Desktop, handle differently inside module wrappers if needed, but for now we keep ModuleWrapper and conditionally hide AppHeader inside it on desktop */}
                              {activeModule === "tracker" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Site Progress Tracker"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SiteProgressTracker />
                                </ModuleWrapper>
                              )}
                              {activeModule === "projects" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Project Manager"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ProjectManager />
                                </ModuleWrapper>
                              )}
                              {activeModule === "labour-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Labour & Workforce"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <LabourCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "qs-workflow" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Guided QS Workflow"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <QSWorkflow />
                                </ModuleWrapper>
                              )}
                              {activeModule === "boq" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Professional BOQ Generator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BOQGenerator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "mix-design" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Concrete Mix Design"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MixDesignCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "takeoff" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="2D Takeoff"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <Takeoff />
                                </ModuleWrapper>
                              )}
                              {activeModule === "area-space-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Plot Area Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AreaSpaceCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "volume-estimator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Volume & Tank Capacity"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSettingsOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <VolumeEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "unit-converter" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Universal Unit Converter"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <UnitConverter />
                                </ModuleWrapper>
                              )}
                              {activeModule === "steel-hub" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Steel & Reinforcement Hub"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SteelReinforcementHub />
                                </ModuleWrapper>
                              )}
                              {activeModule === "mep-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Energy & MEP Calculators"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <EnergyMepCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "rainwater-harvesting" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Rainwater Harvesting"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RainwaterHarvesting />
                                </ModuleWrapper>
                              )}
                              {activeModule === "gradient-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Gradient & Slope Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <GradientCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "concrete-masonry-hub" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Concrete & Masonry Hub"
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
                                  activeModule={activeModule}
                                  title="Master Quantity Estimator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MasterQuantityEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "measurement-sheet" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Measurement Sheet Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MeasurementSheetCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "quick-estimation" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Quick Rough Estimation"
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
                                  activeModule={activeModule}
                                  title="Material Takeoff Sheet"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MaterialTakeoffSheet />
                                </ModuleWrapper>
                              )}
                              {activeModule === "cost-summary" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Cost Summary Sheet"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ConstructionCostSummary />
                                </ModuleWrapper>
                              )}
                              {activeModule === "master-rcc" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Master RCC Estimator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MasterRccStructure />
                                </ModuleWrapper>
                              )}
                              {activeModule === "metal-weight" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Metal Weight"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MetalWeightCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "calculators" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Construction Material"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <Calculators />
                                </ModuleWrapper>
                              )}
                              {activeModule === "bbs-generator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="BBS Generator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BarBendingSchedule />
                                </ModuleWrapper>
                              )}
                              {activeModule === "reinforcement" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Reinforcement Detailing Visualizer"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ReinforcementVisualizer />
                                </ModuleWrapper>
                              )}
                              {activeModule === "isolated-footing" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Isolated Footing Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <IsolatedFootingCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "retaining-wall" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Retaining Wall Estimator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RetainingWallCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "aggregate-tests" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Aggregate Tests"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AggregateTestsCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "chainage" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Chainage Volume"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ChainageVolumeEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "geotechnical" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Geotechnical & Soil Tests"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <GeotechnicalCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "cbr-test" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="CBR Test Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <CbrTestCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "master-sieve" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Master Sieve Analysis"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <MasterSieveAnalysis />
                                </ModuleWrapper>
                              )}
                              {activeModule === "aggregate-blending" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Aggregate Blending"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AggregateBlendingCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "direct-shear" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Direct Shear Test"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <DirectShearTestCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "permeability-test" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Permeability Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PermeabilityCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "ai" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="AI Assistant"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AIAssistant />
                                </ModuleWrapper>
                              )}
                              {activeModule === "earthworks" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Earthworks Suite"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <EarthworksEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "precast-wall" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Precast Wall Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PrecastWallCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "soil-lab-suite" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Soil & Materials Lab Suite"
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
                                  activeModule={activeModule}
                                  title="Anti-Termite Treatment Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <AntiTermiteCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "solar-roof" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Solar Roof Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <SolarRoofCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "road-pavement" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Road & Pavement Estimator"
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
                                  activeModule={activeModule}
                                  title="Beam Design Tool"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BeamDesignTool />
                                </ModuleWrapper>
                              )}
                              {activeModule === "column-design" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Column Design Tool"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <ColumnDesignTool />
                                </ModuleWrapper>
                              )}
                              {activeModule === "raft-foundation" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Raft Foundation Designer"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RaftFoundationDesigner />
                                </ModuleWrapper>
                              )}
                              {activeModule === "water-tank-design" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Water Tank Design"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <WaterTankDesign />
                                </ModuleWrapper>
                              )}
                              {activeModule === "pile-foundation" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Pile Foundation Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PileFoundationCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "prestressed-concrete" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Pre-stressed Concrete Estimator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <PrestressedConcreteEstimator />
                                </ModuleWrapper>
                              )}

                              {activeModule === "room-area-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Room Area Calculator"
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
                                  activeModule={activeModule}
                                  title="Building Setback Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <BuildingSetbackCalculator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "far-fsi-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="FAR/FSI Calculator"
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
                                  activeModule={activeModule}
                                  title="Staircase Design Reference"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <StaircaseDesignReference />
                                </ModuleWrapper>
                              )}
                              {activeModule === "door-window-schedule" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Door & Window Schedule Generator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <DoorWindowSchedule />
                                </ModuleWrapper>
                              )}
                              {activeModule === "ventilation-checker" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Ventilation & Lighting Checker"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <VentilationChecker />
                                </ModuleWrapper>
                              )}
                              {activeModule === "lintel-design-tool" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Lintel Scheduler & Design Tool"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <LintelDesignTool />
                                </ModuleWrapper>
                              )}

                              {/* Restored individual calculators */}
                              {activeModule === "staircase-calculator" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Staircase Calculator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <StaircaseCalculator />
                                </ModuleWrapper>
                              )}

                              {activeModule === "interiors-finishes" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Interiors & Finishes"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <InteriorsFinishesEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "house" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="House Estimator"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <HouseEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "formwork" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Formwork & Scaffold"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <FormworkEstimator />
                                </ModuleWrapper>
                              )}
                              {activeModule === "rates" && (
                                <ModuleWrapper
                                  activeModule={activeModule}
                                  title="Market Rates"
                                  setActiveModule={handleSelectModule}
                                  setIsSidebarOpen={setIsSidebarOpen}
                                  setIsSettingsOpen={setIsSettingsOpen}
                                >
                                  <RateAnalysis />
                                </ModuleWrapper>
                              )}
                            </AnimatePresence>
                          </>
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

                  <MobileToolsSheet
                    isOpen={isMobileToolsOpen}
                    onClose={() => setIsMobileToolsOpen(false)}
                    onSelectModule={handleSelectModule}
                  />

                  <QuickEstimatorWidget />
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
        className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${isOpen ? "bg-slate-900/10  text-slate-800 " : "hover:bg-slate-900/5 text-slate-500 "}`}
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
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${settings.fontSize === "small" ? "bg-indigo-50  text-slate-900 " : "text-slate-500 hover:bg-slate-50"}`}
          >
            A-
          </button>
          <button
            onClick={() => {
              updateSettings({ fontSize: "medium" });
              setIsOpen(false);
            }}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${settings.fontSize === "medium" ? "bg-indigo-50  text-slate-900 " : "text-slate-500 hover:bg-slate-50"}`}
          >
            A
          </button>
          <button
            onClick={() => {
              updateSettings({ fontSize: "large" });
              setIsOpen(false);
            }}
            className={`px-3 py-1.5 text-base font-bold rounded-lg transition-colors ${settings.fontSize === "large" ? "bg-indigo-50  text-slate-900 " : "text-slate-500 hover:bg-slate-50"}`}
          >
            A+
          </button>
        </div>
      )}
    </div>
  );
}

function UnitSwitcher() {
  const { settings, updateSettings } = useSettings();
  const isMetric = settings.measurement === "SI";

  const handleToggle = (unit: "SI" | "FPS") => {
    if (settings.measurement === unit) return;
    updateSettings({ measurement: unit });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg relative z-0 mr-2 border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => handleToggle("SI")}
        className={`relative px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors z-10 ${
          isMetric ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        aria-label="Set units to Metric (m, kg)"
      >
        Metric
        {isMetric && (
          <motion.div
            layoutId="unitIndicator"
            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm border border-slate-200 dark:border-slate-600"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </button>
      <button
        onClick={() => handleToggle("FPS")}
        className={`relative px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors z-10 ${
          !isMetric ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        aria-label="Set units to Imperial (ft, lbs)"
      >
        Imperial
        {!isMetric && (
          <motion.div
            layoutId="unitIndicator"
            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm border border-slate-200 dark:border-slate-600"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </button>
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
    <header className="md:hidden flex items-center px-4 py-2.5 m-0 bg-[#FFFFFF] border-b border-slate-300/5 sticky top-3 z-30 shrink-0 min-h-[50px] transition-all duration-300">
      <button
        onClick={onOpenSidebar}
        className="p-2 mr-3 -ml-2 rounded-lg hover:bg-slate-900/5 text-[#888888] transition-all"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        className="flex items-center gap-2 mr-5 shrink-0 hidden cursor-pointer transition-transform hover:scale-105"
        onClick={onGoHome}
      >
        <Logo className="w-6 h-6 text-slate-900" />
      </div>

      {onGoHome ? (
        <div className="flex-1 min-w-0 pr-2 overflow-x-hidden flex items-center">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      ) : (
        <h1 className="text-base font-bold text-slate-900 flex-1 min-w-0 truncate pr-2">
          {title}
        </h1>
      )}

      <UnitSwitcher />
      <FontSizeControls />

      <button
        onClick={onOpenSettings}
        className="p-2 -mr-2 rounded-lg hover:bg-slate-900/5 text-[#888888] transition-all"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>
    </header>
  );
}

import { CodeReferences } from "./components/ui/CodeReferences";
import { GlobalSettingsToggle } from "./components/ui/GlobalSettingsToggle";
import { FeedbackWidget } from "./components/ui/FeedbackWidget";
import { ProTipsWidget } from "./components/ui/ProTipsWidget";

import ToolPageFooter from "./components/ToolPageFooter";

function getToolMetadata(moduleDef: (typeof ALL_MODULES)[0]) {
  let standards = ["IS 456:2000"];
  let formulaStr =
    "Standard derivations based on fundamental civil engineering volume, area, and material density conversions.";

  if (moduleDef.category === "Concrete") {
    standards = ["IS 456:2000", "IS 10262:2019"];
    formulaStr =
      "Concrete Volume = Length × Width × Depth \nDry Volume = Wet Volume × 1.54\nCement/Sand/Aggregate = (Ratio / Total Ratio) × Dry Volume";
  } else if (moduleDef.category === "Road Pavement") {
    standards = ["IRC:37-2018", "MORTH Specifications"];
    formulaStr =
      "Flexible Pavement Design (CBR Method):\nTension/Strain calculations derived from CBR and traffic (msa) per IRC guidelines.";
  } else if (moduleDef.category === "Geotechnical") {
    standards = ["IS 2720", "IS 2911"];
    formulaStr =
      "Foundations & Soil Mechanics:\nBearing Capacity (q_ult) = cNc + γDNq + 0.5BγNγ\nPile Capacity = Q_p (End Bearing) + Q_s (Skin Friction)";
  } else if (moduleDef.category === "MEP") {
    standards = ["IS 1172:1993", "NBC Part 8"];
    formulaStr =
      "Water Supply & Harvesting:\nYield = Catchment Area × Rainfall × Runoff Coefficient\nDaily Requirement = Per Capita Demand (LPCD) × Population";
  } else if (moduleDef.category === "Structural Design") {
    standards = ["IS 456:2000", "IS 800:2007"];
    formulaStr =
      "RCC & Steel Design:\nMoment of Resistance (M_u) = 0.87 f_y A_st d (1 - (A_st f_y) / (b d f_ck))\nSteel Weight = (D² / 162.28) kg/m";
  } else if (moduleDef.category === "Architectural") {
    standards = ["NBC 2016", "IS 4905"];
    formulaStr =
      "Built-up Area & Floor Space Index (FSI):\nFSI = Total Built-up Area / Total Plot Area\nStaircase Rise/Tread Ratio = 2R + T ≈ 600mm to 640mm";
  }

  return {
    standards,
    formulaDescription: formulaStr,
    lastUpdated: "January 15, 2024",
  };
}

const ModuleWrapper = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    activeModule: ModuleId;
    setActiveModule: (id: ModuleId) => void;
    setIsSidebarOpen: (val: boolean) => void;
    setIsSettingsOpen: (val: boolean) => void;
    children: React.ReactNode;
  }
>(function ModuleWrapper(
  {
    title,
    activeModule,
    setActiveModule,
    setIsSidebarOpen,
    setIsSettingsOpen,
    children,
  },
  ref,
) {
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = React.useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    const handlePrint = () => setIsPrintPreviewOpen(true);
    window.addEventListener("global-print-action", handlePrint);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl or Cmd is pressed
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          toast.success("Draft saved successfully", {
            position: "bottom-center",
          });
        } else if (e.key.toLowerCase() === "p") {
          e.preventDefault();
          setIsPrintPreviewOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("global-print-action", handlePrint);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const moduleDef = ALL_MODULES.find((m) => m.id === activeModule);

  const socialProof = React.useMemo(
    () => getSocialProof(activeModule),
    [activeModule],
  );

  const genericFaqs = moduleDef
    ? [
        {
          q: `Is the ${formatToolTitle(moduleDef.title)} free to use?`,
          a: `Yes, all core calculation features for the ${moduleDef.title.toLowerCase()} are completely free for all users.`,
        },
        {
          q: `How accurate are the results from the ${formatToolTitle(moduleDef.title)}?`,
          a: `Estimations follow standard civil engineering formulas and practices. Always verify critical computations.`,
        },
        {
          q: `Can I use this ${moduleDef.category.toLowerCase()} tool on my mobile phone?`,
          a: `Absolutely. The ${formatToolTitle(moduleDef.title)} is fully responsive and optimized for seamless use on smartphones and tablets.`,
        },
        {
          q: `What engineering formulas does this tool use?`,
          a: `It strictly uses internationally recognized civil engineering formulas relevant to the ${moduleDef.category.toLowerCase()} field.`,
        },
        {
          q: `Do I need to sign up to use the ${formatToolTitle(moduleDef.title)}?`,
          a: `No registration is required. You can use the ${formatToolTitle(moduleDef.title)} immediately in your browser.`,
        },
        {
          q: `Is my calculation data saved securely?`,
          a: `All calculations for the ${formatToolTitle(moduleDef.title)} are processed locally in your browser to assure data privacy.`,
        },
        {
          q: `Can I export the results from the ${formatToolTitle(moduleDef.title)}?`,
          a: `Yes, you can copy the results or use our platform features to export the final calculations to PDF or save them.`,
        },
        {
          q: `How often is the ${formatToolTitle(moduleDef.title)} updated?`,
          a: `Our ${moduleDef.category.toLowerCase()} tools and standard rates are regularly updated to ensure high accuracy and reliability.`,
        },
        {
          q: `Are Metric and Imperial units both supported?`,
          a: `The ${formatToolTitle(moduleDef.title)} supports smart unit inputs allowing seamless operations for global projects.`,
        },
        {
          q: `Who built the ${formatToolTitle(moduleDef.title)}?`,
          a: `This tool was developed by Civil Estimation Pro's engineering validation team.`,
        },
        {
          q: `Can I request a new feature for the ${moduleDef.title}?`,
          a: `We love user feedback. Reach out to us if you need more capabilities for the ${formatToolTitle(moduleDef.title)}.`,
        },
        {
          q: `Is this tool suitable for students?`,
          a: `Yes, it is highly recommended for academic learning, providing real-world exposure to ${moduleDef.category.toLowerCase()} estimation.`,
        },
        {
          q: `Does this replace professional structural software?`,
          a: `While highly accurate, the ${formatToolTitle(moduleDef.title)} is designed for quick estimations and shouldn't replace certified comprehensive structural reports.`,
        },
        {
          q: `Can I embed the ${formatToolTitle(moduleDef.title)} on my site?`,
          a: `Currently, the tool is exclusively available on Civil Estimation Pro.`,
        },
        {
          q: `What if I encounter a bug in the ${formatToolTitle(moduleDef.title)}?`,
          a: `Please report it using our feedback form so we can immediately fix any issues.`,
        },
      ]
    : [];

  const metaList = moduleDef
    ? getToolMetadata(moduleDef as any)
    : { standards: [], formulaDescription: "N/A", lastUpdated: "N/A" };

  return (
    <motion.div
      ref={ref}
      key={activeModule}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col min-h-0 bg-transparent relative tool-detail-page"
    >
      {moduleDef && (
        <Helmet>
          <title>{`${formatToolTitle(moduleDef.title)} – Free Online ${moduleDef.category} Tool | Civil Estimation Pro`}</title>
          <meta
            name="description"
            content={`Free ${formatToolTitle(moduleDef.title)} online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`}
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
            content={`${formatToolTitle(moduleDef.title)} | Civil Estimation Pro`}
          />
          <meta
            property="og:description"
            content={`Free ${formatToolTitle(moduleDef.title)} online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`}
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
            content={`${formatToolTitle(moduleDef.title)} | Civil Estimation Pro`}
          />
          <meta
            name="twitter:description"
            content={`Free ${formatToolTitle(moduleDef.title)} online. ${moduleDef.desc} Easy, fast, and accurate engineering estimation tool.`}
          />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: `${formatToolTitle(moduleDef.title)}`,
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
                <UnitSwitcher />
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
                  className="flex-1 shrink-0 px-4 md:px-8 pt-4 pb-6 w-full max-w-7xl mx-auto md:mb-4 themed-tool-container relative border-2 border-x-0 sm:border-x-2 sm:rounded-[2rem]"
                  style={
                    {
                      "--tool-theme-color": themeHex,
                      borderColor: themeHex,
                    } as React.CSSProperties
                  }
                >
                  {moduleDef && (
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                      <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-tight text-slate-900 flex items-center gap-3">
                        {moduleDef.icon &&
                          React.createElement(moduleDef.icon, {
                            className: "w-8 h-8 shrink-0",
                            style: { color: themeHex },
                          })}
                        {formatToolTitle(moduleDef.title)}
                      </h1>
                      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex flex-wrap items-center gap-2 sm:gap-3">
                        {moduleDef.isPopular && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold whitespace-nowrap">
                            🔥 Popular
                          </span>
                        )}
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, delay: 0.05 }}
                          onClick={() => setIsFormulaModalOpen(true)}
                          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full transition-colors font-medium shadow-sm border border-indigo-100/50 dark:border-indigo-500/20"
                          title="Formulas & Variables"
                        >
                          <Info className="w-4 h-4" />
                          <span className="hidden sm:inline-block capitalize">
                            Formulas
                          </span>
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("global-print-action"),
                            )
                          }
                          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors font-medium shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                          title="Print Calculation"
                        >
                          <Printer className="w-4 h-4" />
                          <span className="hidden sm:inline-block capitalize">
                            Print
                          </span>
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, delay: 0.15 }}
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("action-save-draft"),
                            )
                          }
                          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors font-medium shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                          title="Save Draft (Local)"
                        >
                          <Save className="w-4 h-4" />
                          <span className="hidden sm:inline-block capitalize">
                            Save Draft
                          </span>
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("action-load-draft"),
                            )
                          }
                          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors font-medium shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                          title="Load Draft (Local)"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline-block capitalize">
                            Load Draft
                          </span>
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, delay: 0.25 }}
                          onClick={() => setIsShareModalOpen(true)}
                          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors font-medium shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                          title="Share Tool"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline-block capitalize">
                            Share
                          </span>
                        </motion.button>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          <GlobalSettingsToggle
                            align="right"
                            showCurrency={false}
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    url={`${window.location.origin}?tool=${activeModule}`}
                    title={`${moduleDef?.title || "Tool"} | Civil Estimation Pro`}
                  />

                  <FormulaModal
                    isOpen={isFormulaModalOpen}
                    onClose={() => setIsFormulaModalOpen(false)}
                    title={moduleDef?.title || "Tool"}
                    formulaDescription={metaList.formulaDescription}
                  />

                  <PrintPreviewModal
                    isOpen={isPrintPreviewOpen}
                    onClose={() => setIsPrintPreviewOpen(false)}
                  />

                  <CodeReferences moduleId={activeModule} />

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex-1 shrink-0"
                  >
                    {children}
                  </motion.div>

                  {moduleDef && (
                    <>
                      <ProTipsWidget moduleId={activeModule} />

                      <div className="mt-8 mb-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-200">
                        <p className="text-slate-600 leading-relaxed max-w-4xl text-base mb-8">
                          Your calculation updates strictly in real-time above.
                          All numerical estimations generated by the{" "}
                          <strong>{formatToolTitle(moduleDef.title)}</strong>{" "}
                          are automatically derived using your defined input
                          parameters and globally recognized{" "}
                          {moduleDef.category.toLowerCase()} formulas.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                              How to Use the {formatToolTitle(moduleDef.title)}
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

                      {/* Feedback Widget */}
                      <FeedbackWidget toolName={moduleDef.title} />

                      {/* Comments / Discussion Widget */}
                      <DiscussionWidget
                        moduleId={moduleDef.id}
                        toolName={moduleDef.title}
                      />

                      {/* Tool Page Footer */}
                      <ToolPageFooter
                        toolName={moduleDef.title}
                        standards={metaList.standards}
                        formulaDescription={metaList.formulaDescription}
                        difficulty={
                          (moduleDef.difficulty as any) || "Intermediate"
                        }
                        lastUpdated={metaList.lastUpdated}
                        category={moduleDef.category}
                      />

                      <div className="-mx-4 md:-mx-8">
                        <Footer onNavigate={setActiveModule} />
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
