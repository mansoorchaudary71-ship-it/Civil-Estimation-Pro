import React, { useState, useEffect } from 'react';
import { History, Save, Trash2, ChevronRight, X, CloudUpload, Home, Share2, Bookmark } from 'lucide-react';
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import ShareButtonWithPopup from "../modules/ShareMenu";
import { CalculationExplanation, CalculationExplanationOptions } from "./CalculationExplanation";

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
  savePayload?: any;
  estimationName?: string;
  explanation?: CalculationExplanationOptions;
}

function getDefaultExplanation(calculatorId: string, currentInputs: any, currentResults: any): CalculationExplanationOptions | undefined {
  const hasInputs = currentInputs && Object.values(currentInputs).some((v: any) => v && v !== "0" && v !== 0);
  
  switch(true) {
    case calculatorId.includes("area_calculator"):
      if (!hasInputs) return { hasInputs, genericFormula: [{ label: "Area", formula: "Length × Width" }] };
      return { hasInputs, activeBreakdown: [{ label: "Area", formula: "Base × Height", result: currentResults?.Area || "" }] };
      
    case calculatorId.includes("volume_estimator"):
      // Handled manually in VolumeEstimator
      return undefined;
      
    case calculatorId.includes("metal_weight"):
      if (!hasInputs) return { hasInputs, genericFormula: [{ label: "Weight", formula: "(Diameter² / 162) × Length" }], notes: ["Rule of Thumb: Weight of Steel = D²/162 kg/m"] };
      return { hasInputs, activeBreakdown: [{ label: "Weight", formula: `(d² / 162.28) × L`, result: currentResults?.["Total Weight"] || "" }], notes: ["Rule of Thumb: Weight of Steel = D²/162 kg/m"] };
      
    case calculatorId.includes("brickwork"):
    case calculatorId.includes("material_calc_bricks"):
      if (!hasInputs) return { 
        hasInputs, 
        genericFormula: [
          { label: "Volume of Wall", formula: "Length × Height × Thickness" },
          { label: "No. of Bricks", formula: "Volume of Wall / Volume of 1 Brick with Mortar" },
          { label: "Dry Mortar", formula: "Total Mortar Volume × 1.33" }
        ],
        notes: ["1.33 is the dry volume conversion factor for mortar", "Standard Mortar Joint is 10mm"]
      };
      return { 
        hasInputs, 
        activeBreakdown: [
          { label: "Bricks", formula: `Wall Vol / Brick Vol`, result: currentResults?.["Bricks Required"] || "" },
        ],
        notes: ["1.33 is the dry volume conversion factor for mortar"]
      };

    default:
      // Fallback
      if (!hasInputs) return { 
        hasInputs, 
        genericFormula: [{ label: "Calculation", formula: "Input × Factor" }] 
      };
      const breakdowns = [];
      if (currentResults && Object.keys(currentResults).length > 0) {
        breakdowns.push({
          label: "Result",
          formula: "Calculated from inputs",
          result: Object.values(currentResults)[0] as string
        });
      }
      return { hasInputs, activeBreakdown: breakdowns };
  }
}

export function CalculationHistory({
  calculatorId,
  currentInputs,
  currentResults,
  summaryGeneration,
  onRestore,
  savePayload,
  estimationName = "Estimate",
  explanation
}: CalculationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveType, setSaveType] = useState("General");
  const { user } = useAuth();

  const finalExplanationOpts = explanation || getDefaultExplanation(calculatorId, currentInputs, currentResults);


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
    setSaveName(`My ${estimationName}`);
    setSaveType("General");
    setIsSaveModalOpen(true);
  };

  const confirmCloudSave = async () => {
    if (!saveName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    const payloadToSave = savePayload || {
      inputs: currentInputs,
      breakdown: currentResults || {}
    };
    
    setIsSavingCloud(true);
    try {
      await saveEstimate(saveName, payloadToSave, saveType);
      toast.success("Saved to cloud Profile successfully!");
      setIsSaveModalOpen(false);
    } catch (e) {
      toast.error("Failed to save to cloud.");
    } finally {
      setIsSavingCloud(false);
    }
  };

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this calculation?")) {
      const newHistory = history.filter(h => h.id !== id);
      setHistory(newHistory);
      localStorage.setItem(`calc_history_${calculatorId}`, JSON.stringify(newHistory));
    }
  };

  const handleGoHome = () => {
    window.dispatchEvent(new CustomEvent('go-home'));
  };

  const baseBtnClass = "relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 group focus:outline-none";
  const iconWrapperClass = "w-[42px] h-[42px] rounded-2xl flex items-center justify-center transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]";

  return (
    <>
      {/* Bottom Navigation Action Bar */}
      <div className="flex justify-center w-full mt-12 mb-8 font-sans px-4">
        <div className="flex items-center justify-between w-full max-w-[420px] rounded-full border border-slate-300/80 dark:border-slate-600/60 p-1.5 bg-transparent pointer-events-auto">
          
          {/* Dashboard Button */}
          <button
            onClick={handleGoHome}
            className="flex flex-1 items-center justify-center gap-1.5 px-1 sm:px-2 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 group"
            aria-label="Back to Dashboard"
          >
            <Home className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="text-[12px] sm:text-[13px] font-semibold">Dashbo...</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 px-1 sm:px-2 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 group relative"
            aria-label="View History"
          >
            <History className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="text-[12px] sm:text-[13px] font-semibold">History</span>
            {history.length > 0 && (
              <span className="absolute -top-0.5 right-0 sm:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm">
                {history.length}
              </span>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={() => {
              if (!currentInputs || Object.keys(currentInputs).length === 0) {
                toast.error("Nothing to save yet");
                return;
              }
              saveHistory();
              if (user) {
                handleCloudSave();
              }
            }}
            disabled={isSavingLocal || isSavingCloud}
            className="flex flex-1 items-center justify-center gap-1.5 px-1 sm:px-2 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 disabled:opacity-50 group"
            aria-label="Save Calculation"
          >
            {isSavingLocal || isSavingCloud ? (
              <Save className="w-[18px] h-[18px] animate-pulse" strokeWidth={2} />
            ) : (
              <Save className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2} />
            )}
            <span className="text-[12px] sm:text-[13px] font-semibold">Save</span>
          </button>

          {/* Share Button */}
          <ShareButtonWithPopup
            activeTab={calculatorId}
            title={estimationName || "Calculation"}
            data={currentResults || currentInputs || {}}
            exportFormat={savePayload || { inputs: currentInputs || {}, breakdown: currentResults || {} }}
            containerClassName="flex-1 m-0 p-0 !flex"
            popupPosition="top"
            triggerClassName="flex flex-1 items-center justify-center gap-1.5 px-1 sm:px-2 py-2.5 w-full rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 group"
            triggerContent={
              <>
                <Share2 className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="text-[12px] sm:text-[13px] font-semibold">Share</span>
              </>
            }
          />

        </div>
      </div>
      
      {finalExplanationOpts && (
        <div className="w-full flex justify-center mt-2 mb-4 px-4 sm:px-0">
          <CalculationExplanation {...finalExplanationOpts} />
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Calculation History
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-700 dark:text-slate-700">
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
                        <p className="text-[11px] text-slate-700 dark:text-slate-700">{new Date(item.date).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="text-slate-700 hover:text-red-500 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
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
                  className="w-full py-2.5 text-slate-700 hover:text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Clear All History
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center font-sans px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSaveModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out p-6 pt-7 animate-in zoom-in-95">
            <button 
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <CloudUpload className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Save Estimate</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Save to your cloud profile</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5">Project Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                  placeholder="e.g. Dream House Ground Floor"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5">Estimate Type</label>
                <div className="relative">
                  <select
                    value={saveType}
                    onChange={(e) => setSaveType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium appearance-none"
                  >
                    <option value="General">General</option>
                    <option value="House">House</option>
                    <option value="Slab">Slab</option>
                    <option value="Beam">Beam</option>
                    <option value="Column">Column</option>
                    <option value="Blockwork">Block/Brickwork</option>
                    <option value="Plastering">Plastering</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                disabled={isSavingCloud}
              >
                Cancel
              </button>
              <button
                onClick={confirmCloudSave}
                disabled={isSavingCloud || !saveName.trim()}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingCloud ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Estimate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
