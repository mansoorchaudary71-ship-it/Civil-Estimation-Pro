import React, { useState } from 'react';
import { ClipboardList, Info, Printer, Save, Download, Share2, Settings, BookOpen } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { CodeReferences } from './CodeReferences';
import { FormulaModal } from './FormulaModal';
import toast from 'react-hot-toast';

interface ToolHeaderProps {
  id: string;
  title: string;
}

export function ToolHeader({ id, title }: ToolHeaderProps) {
  const { settings, updateSettings } = useSettings();
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const isMetric = settings.measurement === 'SI';

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    window.dispatchEvent(new Event('action-save-draft'));
  };

  const handleLoadDraft = () => {
    window.dispatchEvent(new Event('action-load-draft'));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - Civil Estimation Pro`,
        url: window.location.href,
      }).catch((err) => console.log('Share canceled or failed', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-8 mt-4">
      {/* Title & Settings Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-[20px] flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
             <ClipboardList className="w-7 h-7 text-blue-600 dark:text-blue-400" />
           </div>
           <div>
             <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h1>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Standard Engineering Tool</p>
           </div>
        </div>
        
        {/* Metric/Imperial Toggle (Focus Block) */}
        <div className="print:hidden flex items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-[20px] border border-slate-200/60 dark:border-slate-700/50 shrink-0">
           <button
             onClick={() => updateSettings({ measurement: 'SI' })}
             className={`px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all duration-200 ${isMetric ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
           >
             Metric
           </button>
           <button
             onClick={() => updateSettings({ measurement: 'FPS' })}
             className={`px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all duration-200 ${!isMetric ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
           >
             Imperial
           </button>
        </div>
      </div>

      {/* Unified Action Bar */}
      <div className="print:hidden flex flex-wrap items-center gap-2 p-2.5 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-[28px] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
         <button 
           onClick={() => setIsFormulaModalOpen(true)}
           className="flex items-center gap-2.5 px-5 py-3 rounded-[20px] bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
         >
           <Info className="w-5 h-5" />
           <span className="text-sm">Formulas</span>
         </button>
         
         <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
         
         <button 
           onClick={handlePrint}
           className="flex items-center gap-2.5 px-5 py-3 rounded-[20px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
         >
           <Printer className="w-5 h-5" />
           <span className="text-sm">Print</span>
         </button>
         <button 
           onClick={handleSaveDraft}
           className="flex items-center gap-2.5 px-5 py-3 rounded-[20px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
         >
           <Save className="w-5 h-5" />
           <span className="text-sm">Save Draft</span>
         </button>
         <button 
           onClick={handleLoadDraft}
           className="flex items-center gap-2.5 px-5 py-3 rounded-[20px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
         >
           <Download className="w-5 h-5" />
           <span className="text-sm">Load Draft</span>
         </button>
         <button 
           onClick={handleShare}
           className="flex items-center gap-2.5 px-5 py-3 rounded-[20px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
         >
           <Share2 className="w-5 h-5" />
           <span className="text-sm">Share</span>
         </button>
         <div className="flex-1"></div>
         <button 
           onClick={() => setShowReferences(!showReferences)}
           className={`flex items-center gap-2.5 px-5 py-3 rounded-[20px] font-medium transition-colors ${showReferences ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
         >
           <BookOpen className="w-5 h-5" />
           <span className="text-sm hidden sm:inline">References</span>
         </button>
      </div>
      
      {showReferences && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <CodeReferences moduleId={id} />
        </div>
      )}

      <FormulaModal 
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        title={title}
        formulaDescription="Calculations follow standardized civil engineering guidelines for material density and proportioning. Specific details can be referenced from structural design codes."
      />
    </div>
  );
}
