import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, FolderPlus, CheckCircle, ChevronDown } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

export interface MaterialSummaryProps {
  title?: string;
  subtitle?: string;
  totalValue: string | number;
  totalUnit?: string;
  totalLabel?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function MaterialSummary({
  title = "MATERIAL SUMMARY",
  subtitle,
  totalValue,
  totalUnit,
  totalLabel,
  icon,
  children,
  className = ""
}: MaterialSummaryProps) {
  const { projects, activeProjectId, addEstimateToProject } = useProjects();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const activeProj = projects.find(p => p.id === activeProjectId);

  const handleSave = (projectId: string) => {
    // Attempt to extract material data from children
    const extractedMaterials: Record<string, { quantity: number; unit: string }> = {};
    
    // Quick helper to recursively parse React children
    const parseChildren = (node: React.ReactNode) => {
       React.Children.forEach(node, child => {
          if (!React.isValidElement(child)) return;
          
          if (typeof child.type === 'function' || typeof child.type === 'object') {
             const props: any = child.props;
             if (props && props.title && props.value !== undefined) {
                // Determine unit
                let unit = props.unit || 'units';
                if (!unit && props.title.toLowerCase().includes('cost')) unit = '$';
                
                // Try to parse the value
                const valStr = String(props.value).replace(/,/g, '').replace(/[a-zA-Z]/g, '');
                const num = parseFloat(valStr) || 0;
                extractedMaterials[props.title] = { quantity: num, unit };
             }
             if (props.children) parseChildren(props.children);
          } else if (child.props && (child.props as any).children) {
             parseChildren((child.props as any).children); // HTML elements with children
          }
       });
    };
    
    parseChildren(children);

    let parsedCost = 0;
    const costStr = String(totalValue).replace(/,/g, '').replace(/[^\d.-]/g, '');
    parsedCost = parseFloat(costStr) || 0;

    addEstimateToProject(projectId, {
       toolId: window.location.pathname,
       name: title,
       cost: parsedCost,
       materials: extractedMaterials,
       category: 'Estimate'
    });
    
    setSaveStatus('saved');
    setShowProjectSelect(false);
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-[4px] border-l-[#6B46C1] rounded-[32px] p-6 sm:p-8 overflow-visible relative shadow-sm ${className}`}
    >
      {/* Header section with Save button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-[#6B46C1] dark:text-[#8b5cf6] rounded-xl shadow-sm border border-purple-100 dark:border-purple-800/50">
            {icon || <Layers className="w-4 h-4 flex-shrink-0" />}
          </div>
          <h3 className="font-bold uppercase tracking-widest text-xs bg-gradient-to-r from-[#6B46C1] to-orange-500 bg-clip-text text-transparent drop-shadow-sm">{title}</h3>
        </div>

        {/* Global Save to Project Button */}
        {projects.length > 0 && (
          <div className="relative">
            {saveStatus === 'saved' ? (
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all">
                 <CheckCircle className="w-4 h-4" /> Saved to Project
              </span>
            ) : activeProj && !showProjectSelect ? (
              <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm hover:shadow transition-shadow">
                 <button onClick={() => handleSave(activeProj.id)} className="flex items-center gap-2 text-[#6B46C1] dark:text-[#8b5cf6] font-bold text-xs sm:text-sm px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <FolderPlus className="w-4 h-4" /> Save to: {activeProj.name}
                 </button>
                 <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 my-auto mx-1"></div>
                 <button onClick={() => setShowProjectSelect(true)} className="px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                 </button>
              </div>
            ) : (
               <div className="absolute right-0 top-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-64 p-2 z-50">
                 <div className="flex justify-between items-center mb-2 px-2 pt-1">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Project</span>
                   <button onClick={() => setShowProjectSelect(false)} className="text-slate-400 hover:text-slate-600"><ChevronDown className="w-4 h-4 rotate-180" /></button>
                 </div>
                 {projects.map(p => (
                    <button key={p.id} onClick={() => handleSave(p.id)} className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-[#6B46C1] dark:hover:text-[#8b5cf6] rounded-lg transition-colors mb-1 truncate">
                       {p.name}
                    </button>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>

      {/* Hero Total Section */}
      <div className="mb-10 relative z-10 w-full">
        {totalLabel && (
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm sm:text-base mb-3">{totalLabel}</p>
        )}
        <div className="flex flex-row items-baseline flex-wrap gap-x-2 gap-y-1 max-w-full overflow-hidden">
          <span className="text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-black tracking-tighter bg-gradient-to-r from-[#6B46C1] to-orange-500 bg-clip-text text-transparent break-words max-w-full">
            {totalValue}
          </span>
          <div className="flex flex-col text-left shrink-0">
            {totalUnit && (
              <span className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">{totalUnit}</span>
            )}
            {subtitle && (
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{subtitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Children (Cards/Breakdowns) */}
      <div className="flex flex-col gap-4 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
