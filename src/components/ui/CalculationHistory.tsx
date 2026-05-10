import React, { useState, useEffect } from 'react';
import { History, Save, Trash2, ChevronRight, X, CloudUpload, Home, Share2 } from 'lucide-react';
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import ShareButtonWithPopup from "../modules/ShareMenu";

interface HistoryItem {
  id: string;
  name: string;
  date: number;
  inputs: Record<string, any>;
  results: Record<string, any>;
  summary: string;
}

interface CalculationHistoryProps {
  calculatorId: string;
  currentInputs: Record<string, any>;
  currentResults?: Record<string, any>;
  summaryGeneration?: (inputs: Record<string, any>, results: Record<string, any>) => string;
  onRestore: (inputs: Record<string, any>) => void;
  savePayload?: { inputs: any; breakdown: any };
  estimationName?: string;
}

export function CalculationHistory({
  calculatorId,
  currentInputs,
  currentResults,
  summaryGeneration,
  onRestore,
  savePayload,
  estimationName = "Estimate"
}: CalculationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem(`calc_history_${calculatorId}`);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, [calculatorId]);

  const saveHistory = () => {
    if (!currentInputs || Object.keys(currentInputs).length === 0) return;
    
    setIsSavingLocal(true);
    let summary = 'Calculation';
    if (summaryGeneration && currentResults) {
      summary = summaryGeneration(currentInputs, currentResults);
    } else {
      summary = `${Object.values(currentInputs)[0] || 'Unknown'} - ${new Date().toLocaleDateString()}`;
    }

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      name: `Local Save ${new Date().toLocaleTimeString()}`,
      date: Date.now(),
      inputs: { ...currentInputs },
      results: { ...(currentResults || {}) },
      summary
    };

    const newHistory = [newItem, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem(`calc_history_${calculatorId}`, JSON.stringify(newHistory));
    toast.success("Saved to local history");
    
    setTimeout(() => {
      setIsSavingLocal(false);
    }, 500);
  };

  const handleCloudSave = async () => {
    if (!user) {
      toast.error("Please login to save to cloud");
      return;
    }
    
    const payloadToSave = savePayload || {
      inputs: currentInputs,
      breakdown: currentResults || {}
    };
    
    setIsSavingCloud(true);
    try {
      const projName = prompt("Enter a name for this estimate:", `My ${estimationName}`);
      if (projName) {
        await saveEstimate(projName, payloadToSave);
        toast.success("Saved to cloud Profile successfully!");
      }
    } catch (e) {
      toast.error("Failed to save to cloud.");
    } finally {
      setIsSavingCloud(false);
    }
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem(`calc_history_${calculatorId}`, JSON.stringify(newHistory));
  };

  const handleGoHome = () => {
    window.dispatchEvent(new CustomEvent('go-home'));
  };

  const baseBtnClass = "group relative flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full transition-all duration-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-12 mb-8 px-4 relative z-10 font-sans">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-full p-2 flex gap-1.5 sm:gap-2">
          
          {/* Dashboard Button: Slate */}
          <button
            onClick={handleGoHome}
            className={`${baseBtnClass} bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:hover:text-slate-100 focus:ring-slate-500`}
            title="Back to Dashboard"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
            <span className="truncate hidden sm:inline">Dashboard</span>
            <span className="truncate sm:hidden">Dash</span>
          </button>

          {/* History Button: Indigo */}
          <button
            onClick={() => setIsOpen(true)}
            className={`${baseBtnClass} bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30 dark:hover:text-indigo-200 focus:ring-indigo-500`}
            title="View History"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
            <span className="truncate">History</span>
            {history.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-indigo-500 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>

          {/* Local Save Button: Emerald */}
          <button
            onClick={() => {
              if (!currentInputs || Object.keys(currentInputs).length === 0) {
                toast.error("Nothing to save yet");
                return;
              }
              saveHistory();
            }}
            disabled={isSavingLocal}
            className={`${baseBtnClass} bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30 dark:hover:text-emerald-200 focus:ring-emerald-500 disabled:opacity-50`}
            title="Save Local"
          >
            {isSavingLocal ? (
               <Save className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            ) : (
               <Save className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
            )}
            <span className="truncate hidden sm:inline">Save Local</span>
            <span className="truncate sm:hidden">Save</span>
          </button>

          {/* Cloud Save Button: Cyan/Blueish */}
          {user && (
            <button
              onClick={handleCloudSave}
              disabled={isSavingCloud}
              className={`${baseBtnClass} bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-200 focus:ring-cyan-500 disabled:opacity-50`}
              title="Save to Cloud"
            >
              {isSavingCloud ? (
                <CloudUpload className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              ) : (
                <CloudUpload className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
              )}
              <span className="truncate hidden sm:inline">Save Cloud</span>
              <span className="truncate sm:hidden">Cloud</span>
            </button>
          )}

          {/* Share Button: Amber/Orange */}
          <div className={`${baseBtnClass} !p-0 !bg-transparent`}>
            <ShareButtonWithPopup
              activeTab={calculatorId}
              title={estimationName || "Calculation"}
              data={currentResults || currentInputs || {}}
              exportFormat={savePayload || { inputs: currentInputs || {}, breakdown: currentResults || {} }}
              triggerClassName={`group w-full h-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full transition-all duration-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30 dark:hover:text-amber-200 focus:ring-amber-500`}
              triggerContent={
                <>
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
                  <span className="truncate">Share</span>
                </>
              }
            />
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Calculation History
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500">
                  <History className="w-12 h-12 mb-3 opacity-20" />
                  <p>No history saved yet.</p>
                  <p className="text-sm mt-1">Save a calculation to see it here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50 group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="pr-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{item.name}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{new Date(item.date).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700/50 line-clamp-2">
                      {item.summary}
                    </p>
                    
                    <button
                      onClick={() => {
                        onRestore(item.inputs);
                        setIsOpen(false);
                      }}
                      className="w-full py-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-center gap-1"
                    >
                      Restore Inputs <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {history.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
                <button
                  onClick={() => {
                    if (window.confirm('Clear all history for this calculator?')) {
                      setHistory([]);
                      localStorage.removeItem(`calc_history_${calculatorId}`);
                    }
                  }}
                  className="w-full py-2.5 text-slate-500 hover:text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Clear All History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
