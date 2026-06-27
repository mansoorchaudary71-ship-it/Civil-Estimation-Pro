import React, { useState } from 'react';
import { ClipboardList, Info, Printer, Save, Download, Share2, Settings } from 'lucide-react';
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
  const isMetric = settings.measurement === 'SI';

  const toggleMetric = () => {
    updateSettings({ measurement: isMetric ? 'FPS' : 'SI' });
  };

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
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 mt-4 transition-colors">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
             <ClipboardList className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
           </div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <button 
             onClick={() => setIsFormulaModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 border border-transparent"
           >
             <Info className="w-4 h-4" />
             Formulas
           </button>
           <button 
             onClick={handlePrint}
             className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
           >
             <Printer className="w-4 h-4" />
             Print
           </button>
           <button 
             onClick={handleSaveDraft}
             className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
           >
             <Save className="w-4 h-4" />
             Save Draft
           </button>
           <button 
             onClick={handleLoadDraft}
             className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
           >
             <Download className="w-4 h-4" />
             Load Draft
           </button>
           <button 
             onClick={handleShare}
             className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
           >
             <Share2 className="w-4 h-4" />
             Share
           </button>
           <button 
             onClick={toggleMetric}
             className="flex items-center gap-2 px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors ml-1"
           >
             {isMetric ? 'Metric' : 'Imperial'}
             <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
           </button>
        </div>
      </div>
      
      <div className="w-full mt-2">
        <CodeReferences moduleId={id} />
      </div>

      <FormulaModal 
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        title={title}
        formulaDescription="Calculations follow standardized civil engineering guidelines for material density and proportioning. Specific details can be referenced from structural design codes."
      />
    </div>
  );
}
