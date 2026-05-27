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
import EstimationWorkflow from "./EstimationWorkflow";
import ExcelPromo from "./ExcelPromo";

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
  const theme = getCategoryTheme(mod.category, mod.id);
  const diffColors: Record<string, string> = {
    "Beginner": "bg-emerald-400",
    "Intermediate": "bg-amber-400",
    "Advanced": "bg-rose-500"
  };

  const pillClass = mod.styleStyle === "solid"
    ? "bg-black/10 border border-white/10 text-white"
    : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:border-slate-300 dark:group-hover:border-slate-600";
    
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
      onClick={() => onSelect(mod.id)}
      id={`module-card-${mod.id}`}
      title={mod.desc}
      className={`group relative flex flex-col h-full w-full p-6 text-left rounded-3xl cursor-pointer transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)] focus-visible:ring-offset-2 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-black/50 border ${theme.border} ${
        mod.styleStyle === "solid"
          ? `${theme.bg} text-white`
          : "bg-[var(--bg-card)] hover:bg-[var(--bg-primary)]"
      }`}
    >
      {/* Badges absolutely positioned overlapping border */}
      <div className="absolute -top-3 -right-3 flex flex-col items-end gap-2 z-20 pointer-events-none">
        {mod.isPopular && (
          <span className={`text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-orange-400 to-rose-500 text-white py-1 px-3 rounded-full shadow-lg shadow-orange-500/30 ring-4 ${mod.styleStyle === "solid" ? "ring-transparent" : "ring-[var(--bg-card)]"}`}>
            Popular
          </span>
        )}
        {mod.isNew && (
          <span className={`text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-[var(--accent-purple)] to-indigo-500 text-white py-1 px-3 rounded-full shadow-lg shadow-purple-500/30 ring-4 ${mod.styleStyle === "solid" ? "ring-transparent" : "ring-[var(--bg-card)]"}`}>
            New
          </span>
        )}
        {mod.premium && (
          <span className={`text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-500 text-white py-1 px-3 rounded-full shadow-lg shadow-amber-500/30 ring-4 ${mod.styleStyle === "solid" ? "ring-transparent" : "ring-[var(--bg-card)]"} flex items-center gap-1 group-hover:scale-110 transition-transform`}>
            <Sparkles className="w-3 h-3 flex-shrink-0" /> Pro
          </span>
        )}
      </div>

      {/* Header (Icon + Title) */}
      <div className="flex items-start gap-4 mb-4 w-full pr-8 flex-shrink-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 shadow-sm ${
          mod.styleStyle === 'solid' ? 'bg-white/25 backdrop-blur-sm' : theme.bg
        }`}>
          <mod.icon className={`w-6 h-6 ${mod.styleStyle === 'solid' ? 'text-white' : theme.text}`} strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-left flex flex-col justify-center min-h-[48px]">
          <h4 className={`text-[17px] font-bold tracking-tight leading-snug line-clamp-2 ${mod.styleStyle === 'solid' ? 'text-white' : 'text-[var(--text-primary)]'}`}>
            {mod.title}
          </h4>
          <span className={`text-[10px] font-black uppercase tracking-wider mt-1 block line-clamp-1 ${mod.styleStyle === 'solid' ? 'text-white/80' : theme.textRaw}`}>
            {mod.category}
          </span>
        </div>
      </div>
      
      {/* Body (Description) */}
      <p className={`text-[14px] leading-relaxed line-clamp-2 mb-6 text-left w-full flex-grow ${mod.styleStyle === 'solid' ? 'text-white/90' : 'text-[var(--color-slate-500)] dark:text-slate-400 transition-colors'}`}>
        {mod.desc}
      </p>

      {/* Footer (Difficulty + Time) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-y-2 mt-auto pt-5 border-t border-black/5 dark:border-white/10 flex-shrink-0">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${pillClass}`} title={`Difficulty: ${mod.difficulty || 'Beginner'}`}>
           <span className={`w-2.5 h-2.5 rounded-full ${diffColors[(mod.difficulty as string)] || diffColors['Beginner']}`} />
           <span className="text-[11.5px] font-bold leading-none">
             {mod.difficulty || 'Beginner'}
           </span>
        </div>
        
        <div className="flex items-center gap-2">
           {isUsed && (
             <span className="flex items-center gap-1.5 text-[11.5px] font-bold leading-none text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full" title="You have used this tool">
               <CheckSquare className="w-3.5 h-3.5" /> Used
             </span>
           )}
           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${pillClass}`} title="Estimated time">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[11.5px] font-bold leading-none">
                {mod.estimatedTime || '~2 mins'}
              </span>
           </div>
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
    <div className="relative flex-1 w-full flex flex-col font-sans mb-12">
      <SEO 
        title="Dashboard" 
        description="Civil Estimation Pro: Advanced estimators for live construction rate analysis, house estimating, and comprehensive BOQ calculators." 
        canonicalUrl="https://civilestimationpro.com" 
      />

      <style>{`
        @keyframes custom-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(15deg); }
        }
        .waving-hand {
          display: inline-block;
          animation: custom-bounce 1.5s ease-in-out infinite;
          transform-origin: bottom right;
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-in {
          animation: float-up 0.5s ease backwards;
        }
      `}</style>
      
      {/* Expanded Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.035] dark:opacity-[0.06]" style={{ maskImage: "linear-gradient(to bottom, white 0%, white 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, white 0%, white 60%, transparent 100%)" }}>
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blueprint-grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <pattern id="blueprint-grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#blueprint-grid-small)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint-grid-large)" className="text-indigo-900 dark:text-indigo-100" />
         </svg>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col relative z-10">
        
        {/* MASSIVE HERO SECTION */}
        <div className="relative w-full max-w-[1400px] mx-auto mt-12 md:mt-24 mb-16 px-4 lg:px-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
          
          <h1 className="text-5xl md:text-6xl font-sans font-black tracking-tight text-[var(--primary-dark)] dark:text-white mb-6 max-w-4xl mx-auto drop-shadow-sm flex flex-col justify-center items-center text-center">
            <span className="block mb-2">Free Civil Engineering</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 font-extrabold drop-shadow-sm pb-2">
              Estimation Platform
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-medium text-center">
            Calculate material quantities, generate BOQs, and estimate project costs instantly with 40+ professional engineering tools.
          </p>
          
          <div className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-full border border-purple-100 dark:border-purple-800/50 shadow-sm animate-in fade-in zoom-in duration-1000 delay-300">
             <div className="flex -space-x-3 mr-2">
                <img src="https://i.pravatar.cc/100?img=11" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" alt="Civil Engineer Avatar 1" title="Expert Civil Engineer" loading="lazy" />
                <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" alt="Civil Engineer Avatar 2" title="Expert Quantity Surveyor" loading="lazy" />
                <img src="https://i.pravatar.cc/100?img=13" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" alt="Civil Engineer Avatar 3" title="Expert Site Engineer" loading="lazy" />
             </div>
             <span className="font-bold text-purple-700 dark:text-purple-300 tracking-wide text-sm md:text-base cursor-default">{engineersCount === 10000 ? '10,000+' : engineersCount.toLocaleString('en-US')} Engineers Trust Us</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
               onClick={() => {
                 const elm = document.getElementById('search-bar-container');
                 elm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
               }}
               className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full font-bold text-lg shadow-[0_8px_30px_rgba(147,51,234,0.3)] hover:shadow-[0_8px_40px_rgba(147,51,234,0.4)] transition-all hover:-translate-y-1 active:scale-95"
            >
              Start Estimating for Free
            </button>
            <button
               onClick={() => {
                 const elm = document.getElementById('category-filter-section');
                 elm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
               }}
               className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-full font-bold text-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group active:scale-95"
            >
              View All Tools <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden">
               {/* Shine effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] hover:animate-[shimmer_2s_infinite] dark:via-white/5 pointer-events-none" />
               
               <div className="flex flex-col items-center text-center p-2 group">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Box className="w-6 h-6 text-purple-600 dark:text-purple-400"/>
                  </div>
                  <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white mb-1 tracking-tight">40+</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Professional Tools</p>
               </div>
               <div className="flex flex-col items-center text-center p-2 group">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400"/>
                  </div>
                  <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white mb-1 tracking-tight">100%</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Free Forever</p>
               </div>
               <div className="flex flex-col items-center text-center p-2 group">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Map className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                  </div>
                  <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white mb-1 tracking-tight">15+</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Countries Trusted</p>
               </div>
               <div className="flex flex-col items-center text-center p-2 group">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400"/>
                  </div>
                  <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white mb-1 tracking-tight">AI</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Powered Estimates</p>
               </div>
            </div>
          </div>
        </div>

        {/* Complete Estimation Workflow Section */}
        <EstimationWorkflow onSelectModule={onSelectModule} />

        {/* Tool category cards */}
        <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-16" id="search-bar-container">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const count = category === "All Tools" 
                ? ALL_MODULES.length 
                : ALL_MODULES.filter(m => m.category === category).length;
                
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`group relative overflow-hidden flex flex-col p-5 rounded-[2rem] text-left transition-all duration-300 ease-out border outline-none 
                    ${activeCategory === category 
                      ? "bg-purple-600 text-white border-purple-500 shadow-[0_8px_30px_rgba(147,51,234,0.3)] scale-[1.02] z-10" 
                      : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20"
                    }`}
                >
                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <span className="font-bold text-sm md:text-base leading-tight mb-4 tracking-tight pr-2">{category}</span>
                    <div className={`mt-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full w-max mt-2 transition-colors duration-300 ${
                      activeCategory === category 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-700 dark:group-hover:bg-purple-900/50 dark:group-hover:text-purple-300'
                    }`}>
                      <Layers className="w-3 h-3" />
                      {count} Tools
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {user && (
          <div className="w-full mb-12 px-4 lg:px-8">
            <PostLoginDashboard onSelectModule={handleSelect} />
          </div>
        )}

    {/* BENTO BOX GRID LAYOUT */}
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 z-20 relative">
      
      {/* RIGHT COLUMN: Main Tool Container */}
      <div className="lg:col-span-12 xl:col-span-12 bg-transparent lg:p-4 flex flex-col min-h-[700px]">
        
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--primary-dark)] dark:text-white tracking-tight flex items-center gap-3">
              {activeCategory}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-slate-500 font-medium">Select a calculator to initiate a new estimate.</p>
              {settings.usedTools && (
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800 hidden md:block">
                  You've used {settings.usedTools.length}/{ALL_MODULES.length} tools
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full md:max-w-[500px] xl:max-w-[600px] shrink-0 flex items-center relative group" id="search-bar-container">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full opacity-25 blur-lg group-hover:opacity-60 transition-all duration-700 ease-in-out"></div>
            <div 
              className="relative flex items-center w-full h-[64px] rounded-full bg-white/90 dark:bg-[#1f2229]/95 backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.15)] hover:scale-[1.01] border border-white dark:border-slate-800/80"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setIsAiChatOpen(true); }}
                title="Ask AI Assistant"
                className="ml-5 w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110"
              >
                <Sparkles className="w-[24px] h-[24px] text-indigo-500 group-hover:animate-pulse" strokeWidth={2} />
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools & calculators..."
                className="w-full h-full bg-transparent border-none outline-none text-[16px] md:text-[17px] font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 cursor-text"
              />
              <div className="mr-3 shrink-0 flex items-center gap-1">
                {searchTerm && (
                  <button onClick={(e) => { e.stopPropagation(); setSearchTerm(""); }} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200">
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                )}
                <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200">
                  <Mic className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for You */}
        {activeCategory === "All Tools" && !searchTerm && recommendedModules.length > 0 && (
          <div className="mb-14 fade-in">
            <h3 className="text-xl font-bold flex flex-col tracking-tight text-[var(--primary-dark)] dark:text-white mb-6">
              Recommended for {settings.role}
              <div className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {recommendedModules.map((m, idx) => (
                <ToolCard key={`rec-${m.id}`} mod={m} onSelect={handleSelect} isUsed={settings.usedTools && settings.usedTools.includes(m.id)} idx={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="flex flex-col w-full">
            {groupsToDisplay.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-[var(--primary-dark)] dark:text-slate-200">No calculators found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search term or category.</p>
              </div>
            ) : (
              groupsToDisplay.map((groupName) => (
                <div key={groupName} className="flex flex-col mb-8 sm:mb-10 last:mb-0">
                   {activeCategory === "All Tools" && (
                     <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 pl-4 sm:pl-6 mb-3 uppercase tracking-wider">
                       {groupName}
                     </h3>
                   )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {groupedModules[groupName].map((mod, idx) => (
                      <ToolCard key={mod.id} mod={mod} onSelect={handleSelect} isUsed={settings.usedTools && settings.usedTools.includes(mod.id)} idx={idx} />
                    ))}
                  </div>
                </div>
              ))
            )}
        </div>
        
        {/* Featured Tool Spotlight */}
        <div className="w-full mt-24 mb-16">
           <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex-1 relative z-10 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-xs font-bold tracking-wider uppercase mb-6">
                    <Sparkles className="w-4 h-4" /> Featured Tool of the Week
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                    Master RCC Estimator
                 </h2>
                 <p className="text-indigo-200 text-lg md:text-xl font-medium mb-8 max-w-xl mx-auto md:mx-0">
                    The unified hub for Slab, Column, Beam, Staircase, and BBS calculations. Save hours of manual work with auto-generated steel weight estimations.
                 </p>
                 <button 
                    onClick={() => handleSelect('master-rcc')}
                    className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-lg group"
                 >
                    Try it Now <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              
              <div className="relative z-10 w-full max-w-md pointer-events-none hidden md:block">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-white font-bold text-lg">RCC Master</span>
                          <span className="text-emerald-300 font-medium text-sm">Concrete Tech</span>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="h-3 bg-white/20 rounded-full w-full"></div>
                       <div className="h-3 bg-white/20 rounded-full w-4/5"></div>
                       <div className="h-3 bg-white/20 rounded-full w-5/6"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Testimonials */}
        <div className="w-full mb-24 text-center">
           <h3 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-12">
              Trusted by 10,000+ Engineers
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Ahmed Al-Farsi", role: "Project Manager", company: "Commercial Construction", country: "UAE", text: "Civil Estimation Pro has literally given me my weekends back. Using the Professional BOQ Generator, I can compile complete client tenders in 15 minutes instead of hours. The accuracy of the embedded ISO code checks makes our bids bulletproof.", rating: 5 },
                { name: "Maria Gonzalez", role: "Quantity Surveyor", company: "Infrastructure Firm", country: "Spain", text: "The earthworks and chainage volume calculator is by far the best I've used online. It handles complex slope inputs effortlessly and provides exact cut/fill volumes. Saved my team days of tedious manual spreadsheet work.", rating: 5 },
                { name: "John Davis", role: "Contractor", company: "Residential Builders", country: "United States", text: "As a small builder, getting quick material estimates is crucial. The House Estimator tool is incredibly accurate for our grey structure planning. I just input the plot size, and within a minute I have the exact bricks, cement, and steel needed.", rating: 5 },
                { name: "Liam O'Connor", role: "Site Engineer", company: "MEP & Fit-out Contractors", country: "Ireland", text: "I constantly use the Unit Converter and Volume & Tank Capacity tools while on site. Being able to access these reliably on my phone has streamlined my daily quality checks. Highly recommend for any field engineer.", rating: 5 },
                { name: "Rajesh Kumar", role: "Civil Engineer", company: "Structural Design", country: "India", text: "The Concrete Mix Design tool is phenomenal. Generating a compliant mix design report traditionally took up a lot of my drafting time, but now it's instantaneous. It computes target mean strength and water-cement ratios flawlessly.", rating: 5 },
                { name: "Emily Watson", role: "Civil Engineering Student", company: "University Level", country: "UK", text: "This platform has been a lifesaver for my university projects. The visual BBS generator helped me finally understand bar bending schedules and deductions. It turns confusing theoretical formulas into clear, practical outputs.", rating: 5 }
              ].map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                   <div className="flex gap-1 mb-4">
                     {[...Array(t.rating)].map((_, i) => <Sparkles key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
                   </div>
                   <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 italic leading-relaxed text-sm">
                     "{t.text}"
                   </p>
                   <div className="mt-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold mb-3">
                        {t.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>
                      <span className="text-xs font-medium text-slate-500">{t.role} • {t.company}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{t.country}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Newsletter Signup */}
        <div className="w-full mb-16 max-w-4xl mx-auto">
           <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/10 border border-orange-200 dark:border-orange-900/50 rounded-[3rem] p-8 md:p-12 text-center shadow-lg">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                 Get Weekly Construction Cost Updates
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto font-medium text-lg">
                 Join our newsletter to receive the latest material rate variations and estimation tips directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                 <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-6 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
                 />
                 <button 
                    type="submit" 
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors shadow-md"
                 >
                    Subscribe
                 </button>
              </form>
           </div>
        </div>

        {/* Free Excel Promo Section */}
        <div className="w-full mb-16">
          <ExcelPromo />
        </div>

      </div>
    </div>

    {/* AI Chat Bottom Sheet Modal */}
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${isAiChatOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
        onClick={() => setIsAiChatOpen(false)}
      />

      {/* Bottom Sheet Modal */}
      <div 
        className={`fixed bottom-0 left-0 right-0 h-[65vh] bg-bg-card shadow-[0_-20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.4)] rounded-t-[40px] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isAiChatOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-5 pb-3 shrink-0 cursor-pointer" onClick={() => setIsAiChatOpen(false)}>
          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" />
        </div>

        <div className="px-6 flex items-center justify-between pb-2 border-b border-border-color">
          <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Assistant
          </h3>
          <button onClick={() => setIsAiChatOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {aiMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'system' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`px-5 py-3 rounded-2xl max-w-[85%] font-medium text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* Input area */}
        <div className="p-6 pt-4 shrink-0 w-full max-w-4xl mx-auto bg-bg-card border-t border-slate-50 dark:border-slate-800/50">
          <div className="relative group">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full opacity-60 group-focus-within:opacity-100 blur-[3px] transition-all duration-300"></div>
            <div className="relative flex items-center bg-bg-card rounded-full px-5 py-2.5 border border-transparent shadow-sm">
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
                className="w-full bg-transparent border-none outline-none text-[16px] text-slate-800 dark:text-slate-100 px-2 py-2 placeholder:text-slate-400"
              />
              <button 
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 text-white rounded-full transition-all hover:scale-105 active:scale-95 ml-2 shrink-0"
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
      </div>
    </div>
  );
}
