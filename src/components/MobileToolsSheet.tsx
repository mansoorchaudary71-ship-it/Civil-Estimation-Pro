import React, { useState } from 'react';
import { Search, X, Hammer, Sparkles, Map as MapIcon, Square, Box, ArrowRightLeft, Weight, Zap, LineChart, Layers, Calculator, Mountain, Route, Droplet, Home, ShieldCheck, Users } from 'lucide-react';
import { ModuleId } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';

export const ALL_TOOLS = [
  { id: "ai", title: "AI Assistant", icon: <Sparkles className="w-4 h-4" /> },
  { id: "labour-calculator", title: "Labour & Workforce", icon: <Users className="w-4 h-4" /> },
  { id: "takeoff", title: "2D Takeoff", icon: <MapIcon className="w-4 h-4" /> },
  { id: "retaining-wall", title: "Retaining Wall Estimator", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "isolated-footing", title: "Isolated Footing Calculator", icon: <Box className="w-4 h-4" /> },
  { id: "area-calculator", title: "Area Calculator", icon: <Square className="w-4 h-4" /> },
  { id: "volume-estimator", title: "Volume Estimator", icon: <Box className="w-4 h-4" /> },
  { id: "unit-converter", title: "Universal Unit Converter", icon: <ArrowRightLeft className="w-4 h-4" /> },
  { id: "metal-weight", title: "Metal Weight Calculator", icon: <Weight className="w-4 h-4" /> },
  { id: "mep-calculator", title: "Energy & MEP Calculators", icon: <Zap className="w-4 h-4" /> },
  { id: "rainwater-harvesting", title: "Rainwater Harvesting", icon: <Droplet className="w-4 h-4" /> },
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

interface MobileToolsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (id: ModuleId) => void;
}

export default function MobileToolsSheet({ isOpen, onClose, onSelectModule }: MobileToolsSheetProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = ALL_TOOLS.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[70] md:hidden flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-border-color/50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-[32px] will-change-transform"
            style={{ maxHeight: '85vh' }}
          >
            <div className="flex justify-center pt-3 pb-2 w-full touch-none cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-[#6B46C1] rounded-full" />
            </div>

            <div className="px-6 pb-2 pt-1 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-100">Tools Directory</h2>
              <button 
                className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center text-[#4B5563] hover:text-[#374151] transition-colors"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex flex-1 items-center h-[52px] bg-transparent rounded-[12px] border-2 border-indigo-500 transition-all overflow-hidden group">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tools & calculations..." 
                    className="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-[15px] font-medium text-[var(--primary-dark)] dark:text-white placeholder:text-slate-400 pl-5 pr-3"
                  />
                </div>
                <button className="w-[52px] h-[52px] flex items-center justify-center shrink-0 rounded-full border-2 border-indigo-500 text-indigo-500 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all">
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2 max-h-[60vh]">
              <div className="flex flex-col gap-2">
                {filteredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectModule(tool.id as ModuleId);
                      onClose();
                    }}
                    className="group relative flex items-center gap-[20px] w-full p-3.5 bg-bg-card/80 rounded-[12px] border border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 text-left active:scale-95"
                  >
                    {/* Border Draw SVG Effect */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <rect 
                        x="1" y="1" 
                        width="calc(100% - 2px)" height="calc(100% - 2px)" 
                        rx="15" ry="15" 
                        fill="none" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out [stroke-dasharray:1500] [stroke-dashoffset:1500] group-hover:[stroke-dashoffset:0] group-active:[stroke-dashoffset:0] opacity-0 group-hover:opacity-100 group-active:opacity-100 stroke-[var(--accent-vibrant)]"
                      />
                    </svg>

                    <div className="flex-shrink-0 w-12 h-12 rounded-[12px] bg-bg-primary flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-[#5a3a9f]/20 transition-colors relative z-10">
                      {typeof tool.icon === 'function' ? (() => {
                        const Icon = tool.icon as any;
                        return <Icon className="w-6 h-6" />
                      })() : (
                        React.isValidElement(tool.icon) && React.cloneElement(tool.icon as React.ReactElement, { className: "w-6 h-6" } as any)
                      )}
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <h4 className="font-semibold text-base text-[var(--primary-dark)] dark:text-slate-200 truncate group-hover:text-[var(--accent-vibrant)] transition-colors">{tool.title}</h4>
                    </div>
                  </button>
                ))}
                {filteredTools.length === 0 && (
                  <div className="text-center py-8 text-[#4B5563] font-medium">
                    No tools found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
