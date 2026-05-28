import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ModuleId } from "../App";
import { useAuth } from "../contexts/AuthContext";
import {
  Calculator, Sparkles, Truck, Route, Waves, Paintbrush, Home, 
  TrendingUp, Hammer, Layers, BoxSelect, Search, Menu, CheckSquare, 
  Map, Grid2X2, Box, ArrowRightLeft, Weight, Spline, ArrowRight,
  ChevronRight, ChevronDown, HardHat, Scaling, Container, Repeat, Anvil, Building2, Building, 
  Blocks, Shovel, Pickaxe, Cone, Droplet, PaintBucket, Ruler, Columns, FolderOpen,
  ClipboardList, Maximize2, FileSpreadsheet, Zap, Wand2, ArrowUpRight, LineChart, Sun, X, Mic, Clock, BarChart, ShieldCheck, Users, Activity, Droplets, Triangle, Bug, Layout, Square
} from "lucide-react";
import { SEO } from "./SEO";
import Logo from "./Logo";
import RecentEstimates from "./RecentEstimates";
import PremiumHero from "./PremiumHero";
import ExcelPromo from "./ExcelPromo";
import SmartSearch from "./SmartSearch";

import PostLoginDashboard from "./PostLoginDashboard";
import { useSettings } from "../context/SettingsContext";

export const ALL_MODULES = [
  // 🚀 Guided Workflows
  { id: "qs-workflow", title: "Guided QS Workflow", desc: "Walks users through a complete sequence: Project Setup, Drawings, Substructure, Superstructure, Masonry, Services, BOQ Compilation, and final Report.", category: "Quantity Estimator", icon: Activity, styleStyle: "solid", colorClass: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30", difficulty: "Intermediate", estimatedTime: "~20 mins", isNew: true, isPopular: true },

  // 📦 QUANTITY ESTIMATOR
  { id: "quick-estimation", title: "Quick Rough Estimation", desc: "Get a lightning-fast preliminary budget and timeline in under 5 seconds based on simple inputs.", category: "Quantity Estimator", icon: Calculator, styleStyle: "solid", colorClass: "bg-indigo-600 text-white shadow-lg", difficulty: "Beginner", estimatedTime: "~1 min", isNew: true },
  { id: "master-quantity", title: "Master Quantity & Estimation", desc: "23 comprehensive calculators for specialized construction items.", category: "Quantity Estimator", icon: ClipboardList, styleStyle: "solid", colorClass: "bg-[var(--accent-blue)] text-[var(--primary-dark)] shadow-[0_8px_30px_rgba(0,207,232,0.3)]", iconClass: "text-[var(--primary-dark)] opacity-90", difficulty: "Advanced", estimatedTime: "~20 mins" },
  { id: "house", title: "House Estimator", desc: "Calculate complete residential construction costs from excavation to finishing. Contractors benefit by getting an accurate Civil Estimation Pro material breakdown instantly.", category: "Quantity Estimator", icon: Home, premium: true, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~15 mins", isPopular: true },
  { id: "material-takeoff", title: "Material Takeoff Sheet", desc: "Auto-calculate cement, sand, aggregate, block, and finishing material quantities based on built-up area and floors.", category: "Quantity Estimator", icon: Calculator, styleStyle: "solid", colorClass: "bg-orange-500 text-white shadow-lg", difficulty: "Beginner", estimatedTime: "~3 mins", isNew: true },
  { id: "cost-summary", title: "Cost Summary Sheet", desc: "Consolidate structural, finishing, and labour costs into a master cost summary with overhead and contingency calculations.", category: "Quantity Estimator", icon: ClipboardList, styleStyle: "solid", colorClass: "bg-emerald-600 text-white shadow-lg", difficulty: "Beginner", estimatedTime: "~6 mins", isNew: true },
  { id: "measurement-sheet", title: "Measurement Sheet Calculator", desc: "Interactive civil engineering measurement sheet with auto-calculating sections for excavation, PCC, RCC, and finishes.", category: "Quantity Estimator", icon: ClipboardList, styleStyle: "solid", colorClass: "bg-purple-600 text-white shadow-lg", difficulty: "Beginner", estimatedTime: "~5 mins", isNew: true },
  { id: "boq", title: "Professional BOQ Generator", desc: "Calculate and format standardized Bills of Quantities for construction projects. Quantity surveyors rely on Civil Estimation Pro to export precise, itemized cost documents.", category: "Quantity Estimator", icon: ClipboardList, styleStyle: "solid", colorClass: "bg-blue-600 text-white shadow-lg", difficulty: "Advanced", estimatedTime: "~5 mins", isNew: true },
  { id: "takeoff", title: "Plan Measure", desc: "Area & linear extraction.", category: "Quantity Estimator", icon: Ruler, styleStyle: "solid", colorClass: "bg-[var(--accent-purple)] text-white shadow-[0_8px_30px_rgba(115,103,240,0.3)]", iconClass: "text-white opacity-90", difficulty: "Advanced", estimatedTime: "~10 mins", isPopular: true },
  { id: "rates", title: "Live DB Rates", desc: "Centralized database for local market prices.", category: "Quantity Estimator", icon: TrendingUp, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~1 min", isPopular: true },
  { id: "interiors-finishes", title: "Interiors & Finishes", desc: "Tiles, painting, doors, wood framing, and termite treatments.", category: "Quantity Estimator", icon: Paintbrush, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~3 mins" },
  { id: "area-space-calculator", title: "Area & Space Calculator", desc: "Calculate dimensional areas, RERA property spaces, plots, and roof material.", category: "Quantity Estimator", icon: Scaling, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~3 mins" },
  { id: "volume-estimator", title: "Volume & Tank Capacity", desc: "Calculate volumes, tank capacity & surface area.", category: "Quantity Estimator", icon: Container, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~3 mins" },
  { id: "metal-weight", title: "Metal Weight", desc: "Calculate section weights of steel profiles.", category: "Quantity Estimator", icon: Anvil, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~3 mins" },
  { id: "unit-converter", title: "Unit Converter", desc: "Convert units across 15 engineering categories.", category: "Quantity Estimator", icon: Repeat, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~1 min" },
  { id: "ai", title: "AI Assistant", desc: "Ask anything about construction", category: "Quantity Estimator", icon: Sparkles, premium: true, styleStyle: "solid", colorClass: "bg-[var(--primary-dark)] text-white shadow-lg", iconClass: "text-white opacity-90", difficulty: "Beginner", estimatedTime: "~1 min", isNew: true },

  // 🏗️ CONCRETE TECH
  { id: "master-rcc", title: "Master RCC Estimator", desc: "This Civil Estimation Pro tool calculates quantities for slabs, columns, beams, and staircases. Structural engineers benefit from instant concrete and steel volume outputs.", category: "Concrete Tech", icon: Building2, styleStyle: "solid", colorClass: "bg-[var(--accent-teal)] text-white shadow-[0_8px_30px_rgba(32,201,151,0.3)]", iconClass: "text-white opacity-90", difficulty: "Advanced", estimatedTime: "~10 mins", isPopular: true },
  { id: "calculators", title: "Construction Material", desc: "Accurate estimations for concrete, bricks, steel, blocks, mortar.", category: "Concrete Tech", icon: HardHat, styleStyle: "solid", colorClass: "bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-[0_8px_30px_rgba(99,102,241,0.3)]", iconClass: "text-white opacity-90", difficulty: "Beginner", estimatedTime: "~2 mins", isPopular: true },
  { id: "mix-design", title: "Concrete Mix Design", desc: "Calculate IS 10262 compliant proportions for any concrete grade. Site engineers trust Civil Estimation Pro to output instant water-cement ratio reports.", category: "Concrete Tech", icon: Droplet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~4 mins", isNew: true },
  { id: "bbs-generator", title: "BBS Generator", desc: "Calculate core steel reinforcement cutting lengths and bend deductions. Civil engineers use this Civil Estimation Pro generator to output standardized bar schedules.", category: "Concrete Tech", icon: FileSpreadsheet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~10 mins" },
  { id: "reinforcement", title: "Reinforcement Detailing Visualizer", desc: "Interactive 2D rebar detailing for beams, columns & slabs with IS 456 checks.", category: "Concrete Tech", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~3 mins", isNew: true },
  { id: "isolated-footing", title: "Isolated Footing Calculator", desc: "Detailed estimations for concrete, steel mesh, excavation and working space.", category: "Concrete Tech", icon: Box, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~3 mins", isNew: true },
  { id: "retaining-wall", title: "Retaining Wall Estimator", desc: "Calculate structural stability, concrete volume, and rebar for cantilever walls. Civil Estimation Pro helps engineers output safe material quantities for earth-retaining structures.", category: "Concrete Tech", icon: ShieldCheck, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~5 mins", isNew: true },
  { id: "staircase-calculator", title: "Staircase Calculator", desc: "Detailed staircase material and BOQ generator.", category: "Concrete Tech", icon: TrendingUp, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "aggregate-tests", title: "Aggregate Tests", desc: "Calculate impact, crushing, abrasion values and water absorption.", category: "Concrete Tech", icon: Box, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~4 mins" },
  { id: "formwork", title: "Formwork & Scaffold", desc: "Shuttering and scaffolding material computations.", category: "Concrete Tech", icon: Hammer, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~4 mins" },

  // 🛣️ ROAD CONSTRUCTION
  { id: "road-pavement", title: "Road & Pavement Estimator", desc: "Calculate material quantities for flexible and rigid pavement layers. Highway engineers use this Civil Estimation Pro tool to output exact asphalt volumes.", category: "Road Construction", icon: Route, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~15 mins" },
  { id: "earthworks", title: "Earthworks & Excavation", desc: "Calculate precise cut, fill, and site preparation volumes for varied terrain. Surveyors use this Civil Estimation Pro tool to generate accurate excavation tonnage reports.", category: "Road Construction", icon: Shovel, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "chainage", title: "Chainage Volume", desc: "Road highway chainage extraction calculations.", category: "Road Construction", icon: Map, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "gradient-calculator", title: "Gradient & Slope", desc: "Dynamic bidirectional slope and elevation calculator.", category: "Road Construction", icon: Maximize2, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins" },
  { id: "anti-termite", title: "Anti-Termite Calculator", desc: "Calculate pre-construction termite chemical emulsion and concentrate requirements.", category: "Road Construction", icon: Bug, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins", isNew: true },

  // 🌱 SOIL TESTS
  { id: "geotechnical", title: "Geotechnical & Soil Tests", desc: "Process lab data for water content, Specific Gravity, LL, and CBR.", category: "Soil Tests", icon: Cone, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins" },
  { id: "cbr-test", title: "CBR Test Calculator", desc: "Calculate CBR with smart interactive load-penetration curve plotting.", category: "Soil Tests", icon: Activity, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins", isNew: true },
  { id: "master-sieve", title: "Master Sieve Analysis", desc: "Dynamic gradation validator driven by specification databases.", category: "Soil Tests", icon: LineChart, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~8 mins" },
  { id: "aggregate-blending", title: "Aggregate Blending", desc: "Blend 2 to 4 stockpiles to meet target grading specifications.", category: "Soil Tests", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~10 mins" },
  { id: "direct-shear", title: "Direct Shear Test", desc: "Calculate cohesion and friction angle using Mohr-Coulomb failure regression.", category: "Soil Tests", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~3 mins", isNew: true },
  { id: "permeability-test", title: "Permeability Calculator", desc: "Constant head and falling head permeability testing computation.", category: "Soil Tests", icon: Droplet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~2 mins", isNew: true },

  // ⚡ MEP
  { id: "mep-calculator", title: "Energy & MEP Calculators", desc: "Estimate solar capacity, water heating, and AC sizing.", category: "MEP", icon: Zap, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~5 mins", isNew: true },
  { id: "solar-roof", title: "Solar Roof Calculator", desc: "Estimate required solar system size, panels, and ROI.", category: "MEP", icon: Sun, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins", isNew: true },
  { id: "rainwater-harvesting", title: "Rainwater Harvesting", desc: "Calculate collectible rainwater volume and recommend tank sizes.", category: "MEP", icon: Droplet, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~3 mins", isNew: true },

  // 📊 ANALYSIS & TOOLS
  { id: "projects", title: "Project Manager", desc: "Group calculations by project, view aggregated costs and timelines.", category: "Analysis & Tools", icon: FolderOpen, styleStyle: "solid", colorClass: "bg-indigo-600 text-white shadow-lg", difficulty: "Beginner", estimatedTime: "~1 min", isNew: true },
  { id: "tracker", title: "Site Progress Tracker", desc: "Track construction timelines, visual Gantt charts, budget burn, and photo updates.", category: "Analysis & Tools", icon: BarChart, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~3 mins", isNew: true },
  { id: "labour-calculator", title: "Labour & Workforce", desc: "Calculate labour cost, worker allocation, and daily burn rates for your project.", category: "Analysis & Tools", icon: Users, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~2 mins", isNew: true },
  
  // 🏢 STRUCTURAL DESIGN
  { id: "beam-design", title: "Beam Design Tool", desc: "Limit State Method including deflection, shear design, and anchorage per IS 456:2000.", category: "Structural Design", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~10 mins", isNew: true },
  { id: "column-design", title: "Column Design Tool", desc: "Short/slender check and axial + biaxial bending capacity per IS 456 & 13920.", category: "Structural Design", icon: Building2, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~10 mins", isNew: true },
  { id: "raft-foundation", title: "Raft Foundation Designer", desc: "Design raft thickness, reinforcement, and check settlement per IS 2950.", category: "Structural Design", icon: Grid2X2, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~15 mins", isNew: true },
  { id: "water-tank-design", title: "Water Tank Design", desc: "Crack width checks for overhead/underground tanks per IS 3370.", category: "Structural Design", icon: Waves, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~12 mins", isNew: true },
  { id: "pile-foundation", title: "Pile Foundation Calculator", desc: "Friction & end bearing pile capacity, group efficiency per IS 2911.", category: "Structural Design", icon: Pickaxe, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~8 mins", isNew: true },
  { id: "prestressed-concrete", title: "Pre-stressed Concrete Estimator", desc: "Tendon layout and prestress losses per IS 1343:2012.", category: "Structural Design", icon: Layers, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Advanced", estimatedTime: "~10 mins", isNew: true },

  // ✨ ARCHITECTURAL REFERENCES & SPACE PLANNING
  { id: "room-area-calculator", title: "Room Area Calculator", desc: "Calculate net vs gross area and check NBC/RERA minimum room size compliance.", category: "Architectural References & Space Planning", icon: Square, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins", isNew: true },
  { id: "building-setback-calculator", title: "Building Setback Calculator", desc: "Auto-calculate front, rear setbacks, and side margins given plot size and zone.", category: "Architectural References & Space Planning", icon: ArrowRightLeft, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~3 mins", isNew: true },
  { id: "far-fsi-calculator", title: "FAR/FSI Calculator", desc: "Determine maximum permissible built-up area and floors based on FAR/FSI allowance.", category: "Architectural References & Space Planning", icon: Building, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins", isNew: true },
  { id: "staircase-design-reference", title: "Staircase Design Reference", desc: "Validate riser-going ergonomics, headroom clearance, and minimum stair widths.", category: "Architectural References & Space Planning", icon: Triangle, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Intermediate", estimatedTime: "~4 mins", isNew: true },
  { id: "door-window-schedule", title: "Door & Window Schedule", desc: "Generate schedules and calculate required lintel sizes for building openings.", category: "Architectural References & Space Planning", icon: Layout, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~5 mins", isNew: true },
  { id: "ventilation-checker", title: "Ventilation & Lighting Checker", desc: "Check if window and ventilation areas meet minimum NBC requirements based on floor area.", category: "Architectural References & Space Planning", icon: Sun, styleStyle: "glass", colorClass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[var(--primary-dark)] dark:text-white", difficulty: "Beginner", estimatedTime: "~2 mins", isNew: true }
];

interface DashboardProps {
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  previousModule?: string | null;
}

export const getCategoryTheme = (category: string, id: string) => {
  if (id === 'ai') {
    return { textRaw: "text-[#4338CA] dark:text-[#818CF8]", text: "text-white", bg: "bg-[#4338CA] dark:bg-[#4338CA]", stroke: "stroke-[#4338CA]", baseHex: "#4338CA", border: "border-[#4338CA] dark:border-[#4338CA]" };
  }
  
  switch (category) {
    case "Concrete Tech":
      return { textRaw: "text-[#E55A2B] dark:text-[#ff8a65]", text: "text-white", bg: "bg-[#E55A2B] dark:bg-[#E55A2B]", stroke: "stroke-[#E55A2B]", baseHex: "#E55A2B", border: "border-[#E55A2B] dark:border-[#E55A2B]" };
    case "Quantity Estimator":
      return { textRaw: "text-[#6B46C1] dark:text-[#9F7AEA]", text: "text-white", bg: "bg-[#6B46C1] dark:bg-[#6B46C1]", stroke: "stroke-[#6B46C1]", baseHex: "#6B46C1", border: "border-[#6B46C1] dark:border-[#6B46C1]" };
    case "Structural Design":
      return { textRaw: "text-[#BE185D] dark:text-[#F472B6]", text: "text-white", bg: "bg-[#BE185D] dark:bg-[#BE185D]", stroke: "stroke-[#BE185D]", baseHex: "#BE185D", border: "border-[#BE185D] dark:border-[#BE185D]" };
    case "Road Construction":
      return { textRaw: "text-[#0D9488] dark:text-[#2DD4BF]", text: "text-white", bg: "bg-[#0D9488] dark:bg-[#0D9488]", stroke: "stroke-[#0D9488]", baseHex: "#0D9488", border: "border-[#0D9488] dark:border-[#0D9488]" };
    case "Soil Tests":
      return { textRaw: "text-[#D97706] dark:text-[#FBBF24]", text: "text-white", bg: "bg-[#D97706] dark:bg-[#D97706]", stroke: "stroke-[#D97706]", baseHex: "#D97706", border: "border-[#D97706] dark:border-[#D97706]" };
    case "MEP":
      return { textRaw: "text-[#2563EB] dark:text-[#60A5FA]", text: "text-white", bg: "bg-[#2563EB] dark:bg-[#2563EB]", stroke: "stroke-[#2563EB]", baseHex: "#2563EB", border: "border-[#2563EB] dark:border-[#2563EB]" };
    case "Architectural References & Space Planning":
      return { textRaw: "text-[#EC4899] dark:text-[#F472B6]", text: "text-white", bg: "bg-[#EC4899] dark:bg-[#EC4899]", stroke: "stroke-[#EC4899]", baseHex: "#EC4899", border: "border-[#EC4899] dark:border-[#EC4899]" };
    case "Analysis & Tools":
      return { textRaw: "text-[#4338CA] dark:text-[#818CF8]", text: "text-white", bg: "bg-[#4338CA] dark:bg-[#4338CA]", stroke: "stroke-[#4338CA]", baseHex: "#4338CA", border: "border-[#4338CA] dark:border-[#4338CA]" };
    default:
      return { textRaw: "text-[#4338CA] dark:text-[#818CF8]", text: "text-white", bg: "bg-[#4338CA] dark:bg-[#4338CA]", stroke: "stroke-[#4338CA]", baseHex: "#4338CA", border: "border-slate-500 dark:border-slate-500" };
  }
};

const ToolCard = ({ mod, onSelect, isUsed, idx = 0 }: { mod: any, onSelect: (id: string) => void, isUsed?: boolean, idx?: number }) => {
  const diffColors: Record<string, string> = {
    "Beginner": "bg-[#10B981]",
    "Intermediate": "bg-[#F59E0B]",
    "Advanced": "bg-[#EF4444]"
  };

  // Determine standard, gradient, or special card styles
  let cardClass = "bg-white border border-slate-200 shadow-sm hover:shadow-lg text-slate-800";
  let titleClass = "text-slate-900";
  let descClass = "text-slate-500";
  let categoryClass = "text-slate-400";
  let iconWrapClass = "bg-slate-50 text-slate-600 border border-slate-200";
  let footerBorderClass = "border-slate-100";
  let pillClass = "bg-white border text-slate-600 border-slate-200";
  let dotPillClass = pillClass;

  const orangeCards = ["master-rcc", "calculators"];
  const purpleCards = ["boq", "takeoff", "qs-workflow", "master-quantity", "ai", "projects"];
  const tealCards = ["road-pavement"];
  const blueCards = ["mep-calculator"];

  if (orangeCards.includes(mod.id)) {
    cardClass = "bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg text-white border-none";
    titleClass = "text-white"; descClass = "text-orange-50"; categoryClass = "text-white/70";
    iconWrapClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    footerBorderClass = "border-white/20";
    pillClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    dotPillClass = "bg-white/90 text-slate-800 border-none backdrop-blur-sm";
  } else if (purpleCards.includes(mod.id)) {
    cardClass = "bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg text-white border-none";
    titleClass = "text-white"; descClass = "text-purple-50"; categoryClass = "text-white/70";
    iconWrapClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    footerBorderClass = "border-white/20";
    pillClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    dotPillClass = "bg-white/90 text-slate-800 border-none backdrop-blur-sm";
  } else if (tealCards.includes(mod.id)) {
    cardClass = "bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg text-white border-none";
    titleClass = "text-white"; descClass = "text-teal-50"; categoryClass = "text-white/70";
    iconWrapClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    footerBorderClass = "border-white/20";
    pillClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    dotPillClass = "bg-white/90 text-slate-800 border-none backdrop-blur-sm";
  } else if (blueCards.includes(mod.id)) {
    cardClass = "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg text-white border-none";
    titleClass = "text-white"; descClass = "text-blue-50"; categoryClass = "text-white/70";
    iconWrapClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    footerBorderClass = "border-white/20";
    pillClass = "bg-white/20 text-white border-none backdrop-blur-sm";
    dotPillClass = "bg-white/90 text-slate-800 border-none backdrop-blur-sm";
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(mod.id)}
      id={`module-card-${mod.id}`}
      title={mod.desc}
      className={`group relative flex flex-col h-full w-full p-5 text-left rounded-2xl cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-purple-600 ${cardClass}`}
    >
      {/* Badges on top right */}
      <div className="absolute -top-3 -right-2 flex items-center gap-1.5 z-20 pointer-events-none px-2">
         {mod.premium && (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-purple-500 to-purple-600 text-white py-1 px-2.5 rounded-full shadow-sm border border-white/50">
            Pro
          </span>
         )}
         {mod.isPopular && (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-400 text-slate-900 py-1 px-2.5 rounded-full shadow-sm border border-white/50">
            Popular
          </span>
         )}
         {mod.isNew && (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500 text-white py-1 px-2.5 rounded-full shadow-sm border border-white/50">
            New
          </span>
         )}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0 ${iconWrapClass}`}>
          <mod.icon className="w-5 h-5" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
           <span className={`text-[9px] font-bold uppercase tracking-widest ${categoryClass}`}>
             {mod.category}
           </span>
           <h4 className={`text-[13px] font-bold leading-tight mt-0.5 ${titleClass}`}>
             {mod.title}
           </h4>
        </div>
      </div>
      
      {/* Body */}
      <p className={`text-[11px] leading-relaxed mb-4 text-left w-full flex-grow line-clamp-2 ${descClass}`}>
        {mod.desc}
      </p>

      {/* Footer */}
      <div className={`w-full flex items-center flex-wrap gap-2 mt-auto pt-3 border-t ${footerBorderClass}`}>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${dotPillClass}`} title={`Difficulty: ${mod.difficulty || 'Beginner'}`}>
           <span className={`w-1.5 h-1.5 rounded-full ${diffColors[(mod.difficulty as string)] || diffColors['Beginner']}`} />
           <span className="text-[9px] font-bold uppercase">
             {mod.difficulty || 'Beginner'}
           </span>
        </div>
        
        {isUsed && (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase text-white bg-green-500 rounded-full border border-green-600 shadow-sm">
            ✓ Used
          </span>
        )}

        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${pillClass}`}>
          <Clock className="w-[10px] h-[10px]" />
          <span className="text-[9px] font-bold uppercase">
            {mod.estimatedTime || '~2 mins'}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default function Dashboard({
  onSelectModule,
  onOpenSidebar,
  onOpenSettings,
  onOpenAuth,
  previousModule,
}: DashboardProps) {
  const { user } = useAuth();
  const { settings, trackToolUse } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tools");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: string, content: string }[]>([
    { role: 'system', content: 'Hi there! I am your AI assistant. Ask me anything about calculations, materials, or which tool to use.' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [engineersCount, setEngineersCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 2000;
    const target = 10000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setEngineersCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, []);

  let recommendedIds: string[] = [];
  if (settings.role === 'Civil Engineer') {
    recommendedIds = ['master-rcc', 'house', 'boq', 'takeoff', 'road-pavement', 'earthworks'];
  } else if (settings.role === 'Quantity Surveyor') {
    recommendedIds = ['master-quantity', 'house', 'rates', 'takeoff'];
  } else if (settings.role === 'Student') {
    recommendedIds = ['calculators', 'bbs-generator', 'unit-converter', 'ai'];
  } else if (settings.role === 'Contractor') {
    recommendedIds = ['house', 'formwork', 'rates', 'interiors-finishes'];
  }
  const recommendedModules = recommendedIds
    .map(id => ALL_MODULES.find(m => m.id === id))
    .filter((m): m is typeof ALL_MODULES[0] => m !== undefined);

  const handleSelect = (id: string) => {
    if (trackToolUse) trackToolUse(id);
    onSelectModule(id as ModuleId);
  };

  useEffect(() => {
    if (isAiChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiChatOpen]);

  useEffect(() => {
    if (previousModule && !["home", "my-estimates", "pricing", "about", "careers", "contact", "blog"].includes(previousModule)) {
      const prevMod = ALL_MODULES.find((m) => m.id === previousModule);
      if (prevMod) {
        setActiveCategory("All Tools");
        setTimeout(() => {
          const elm = document.getElementById(`module-card-${previousModule}`);
          if (elm) {
            elm.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  }, [previousModule]);

  const categories = [
    "All Tools",
    "Quantity Estimator",
    "Structural Design",
    "Concrete Tech",
    "Architectural References & Space Planning",
    "Road Construction",
    "Soil Tests",
    "MEP",
    "Analysis & Tools"
  ];

  const filteredModules = ALL_MODULES.filter((m) => {
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const matchesSearch =
      searchWords.length === 0 ||
      searchWords.every(word =>
        m.title.toLowerCase().includes(word) ||
        m.desc.toLowerCase().includes(word) ||
        m.category.toLowerCase().includes(word)
      );

    const matchesCategory =
      activeCategory === "All Tools" || m.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const groupsToDisplay: string[] = [];
  const groupedModules: Record<string, typeof ALL_MODULES> = {};

  filteredModules.forEach((mod) => {
    const groupName = mod.category;
    
    if (!groupedModules[groupName]) {
      groupedModules[groupName] = [];
      groupsToDisplay.push(groupName);
    }
    groupedModules[groupName].push(mod);
  });

  // Handle particle creation purely via CSS in a style tag directly
  return (
    <>
      <div className="relative flex-1 w-full flex flex-col font-sans mb-12 bg-white text-slate-900 border-none">
        <SEO 
          title="Dashboard" 
          description="Civil Estimation Pro: Advanced estimators for live construction rate analysis, house estimating, and comprehensive BOQ calculators." 
          canonicalUrl="https://civilestimationpro.com" 
        />

        <div className="w-full max-w-[900px] mx-auto px-4 z-10 w-full overflow-hidden flex flex-col">
          
          {/* HERO SECTION */}
          <div className="flex flex-col items-center justify-center text-center mt-16 mb-12">
             <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-slate-900">
               Free Civil Engineering<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">Estimation Platform</span>
             </h1>
             <p className="text-slate-600 text-base md:text-lg max-w-[600px] mt-4 mb-8">
               Calculate material quantities, generate BOQs, and estimate project costs instantly with 40+ professional engineering tools.
             </p>

             <div className="flex items-center gap-2 mb-8">
               <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700">A</div>
                 <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-700">R</div>
                 <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700">E</div>
               </div>
               <span className="text-sm font-semibold text-orange-600 ml-2">10,000+ Engineers Trust Us</span>
             </div>

             <div className="flex flex-col sm:flex-row items-center gap-4">
               <button 
                 onClick={() => handleSelect('house')}
                 className="px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
               >
                 Start Estimating for Free
               </button>
               <button 
                 onClick={() => {
                   document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
                 }}
                 className="px-6 py-3 rounded-full font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all font-semibold"
               >
                 View All Tools ›
               </button>
             </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 mb-12">
            <div className="flex flex-col items-center text-center">
              <span className="text-xl mb-1">📦</span>
              <span className="text-xs font-bold text-slate-700">40+ Professional Tools</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-xl mb-1">✅</span>
              <span className="text-xs font-bold text-slate-700">100% Free Forever</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-xl mb-1">🗺️</span>
              <span className="text-xs font-bold text-slate-700">15+ Countries Trusted</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-xl mb-1">🤖</span>
              <span className="text-xs font-bold text-slate-700">AI Powered Estimates</span>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="flex flex-col gap-10" id="tools-section">
            
            {/* SEARCH BAR */}
            <div className="w-full relative">
               <SmartSearch onSelect={(id) => {
                 if (id === 'ai') setIsAiChatOpen(true);
                 else handleSelect(id as any);
               }} />
            </div>

            {/* CATEGORY FILTER GRID (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => {
                const count = category === "All Tools" 
                  ? ALL_MODULES.length 
                  : ALL_MODULES.filter(m => m.category === category).length;
                  
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-left transition-all duration-200 border ${
                      isActive 
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-transparent shadow-md font-bold" 
                        : "bg-white text-slate-700 font-semibold border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <span className="tracking-tight text-sm">{category}</span>
                    <span className={`text-[10px] shrink-0 font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TOOLS GRID */}
            <div className="flex flex-col w-full mb-16">
                {groupsToDisplay.length === 0 ? (
                  <div className="py-24 text-center flex flex-col items-center">
                    <Search className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No calculators found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search term or category.</p>
                  </div>
                ) : (
                  groupsToDisplay.map((groupName) => (
                    <div key={groupName} className="flex flex-col mb-8 last:mb-0">
                       {activeCategory === "All Tools" && (
                         <h3 className="text-xs font-bold text-slate-400 pl-1 mb-4 uppercase tracking-wider">
                           {groupName}
                         </h3>
                       )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                        {groupedModules[groupName].map((mod, idx) => (
                          <ToolCard key={mod.id} mod={mod} onSelect={handleSelect} isUsed={settings.usedTools && settings.usedTools.includes(mod.id)} idx={idx} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
            </div>

            {/* FEATURED BANNER */}
            <div className="w-full mb-24 rounded-3xl overflow-hidden bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] p-8 md:p-10 text-white relative shadow-lg flex flex-col md:flex-row items-center gap-8 border-none">
              <div className="flex-1 z-10 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-bold tracking-wider uppercase mb-5 backdrop-blur-sm">
                    ⭐ FEATURED TOOL OF THE WEEK
                 </div>
                 <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                    Master RCC Estimator
                 </h2>
                 <p className="text-purple-100 text-sm md:text-base font-medium mb-6 max-w-md mx-auto md:mx-0">
                    The unified hub for Slab, Column, Beam, Staircase, and BBS calculations. Save hours of manual work with auto-generated steel weight estimations.
                 </p>
                 <button 
                    onClick={() => handleSelect('master-rcc')}
                    className="px-6 py-3 bg-white text-purple-700 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                 >
                    Try it Now ›
                 </button>
              </div>
              <div className="z-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl relative min-w-[240px]">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex flex-col items-center justify-center text-xl">
                      🏗️
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-sm">RCC Master</span>
                       <span className="text-purple-200 text-xs">Concrete Tech</span>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    {/* AI Chat Bottom Sheet Modal */}
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${isAiChatOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsAiChatOpen(false)}
      />

      {/* Bottom Sheet Modal */}
      <div 
        className={`fixed bottom-0 left-0 right-0 h-[65vh] bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-[40px] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isAiChatOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-5 pb-3 shrink-0 cursor-pointer" onClick={() => setIsAiChatOpen(false)}>
          <div className="w-16 h-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" />
        </div>

        <div className="px-6 flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Assistant
          </h3>
          <button onClick={() => setIsAiChatOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {aiMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'system' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`px-5 py-3 rounded-2xl max-w-[85%] font-medium text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* Input area */}
        <div className="p-6 pt-4 shrink-0 w-full max-w-4xl mx-auto bg-white border-t border-slate-100">
          <div className="relative group">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-60 group-focus-within:opacity-100 blur-[3px] transition-all duration-300"></div>
            <div className="relative flex items-center bg-white rounded-full px-5 py-2.5 border border-transparent shadow-sm">
              <input 
                type="text" 
                value={aiMessage} 
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiMessage.trim()) {
                    setAiMessages(prev => [...prev, { role: 'user', content: aiMessage.trim() }]);
                    setAiMessage("");
                    setTimeout(() => {
                      setAiMessages(prev => [...prev, { role: 'system', content: 'I can help with that. Could you provide a bit more context about the materials or calculator you need?' }]);
                    }, 1000);
                  }
                }}
                placeholder="Ask your assistant..." 
                className="w-full bg-transparent border-none outline-none text-[16px] text-slate-800 px-2 py-2 placeholder:text-slate-400"
              />
              <button 
                className="p-2.5 bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 text-white rounded-full transition-all hover:scale-105 active:scale-95 ml-2 shrink-0"
                onClick={() => {
                  if (aiMessage.trim()) {
                    setAiMessages(prev => [...prev, { role: 'user', content: aiMessage.trim() }]);
                    setAiMessage("");
                    setTimeout(() => {
                      setAiMessages(prev => [...prev, { role: 'system', content: 'I can help with that. Could you provide a bit more context about the materials or calculator you need?' }]);
                    }, 1000);
                  }
                }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
