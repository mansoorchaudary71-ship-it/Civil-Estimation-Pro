import React, { useState, useEffect } from "react";
import { Home, History, Save, User, Share2 } from "lucide-react";
import ShareButtonWithPopup from "./modules/ShareMenu";
import toast from "react-hot-toast";

export default function GlobalBottomBar() {
  const [calcData, setCalcData] = useState<any>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => setCalcData(e.detail);
    const handleClear = () => setCalcData(null);
    window.addEventListener("update-calc-data", handleUpdate);
    window.addEventListener("clear-calc-data", handleClear);
    return () => {
      window.removeEventListener("update-calc-data", handleUpdate);
      window.removeEventListener("clear-calc-data", handleClear);
    };
  }, []);

  const handleGoHome = () => {
    window.dispatchEvent(new CustomEvent("go-home"));
  };

  const openProfile = () => {
    window.dispatchEvent(new CustomEvent("open-profile"));
  };

  const triggerHistory = () => {
    if (!calcData) {
      toast.error("Please open a tool to view its history");
      return;
    }
    window.dispatchEvent(new CustomEvent("trigger-global-history"));
  };

  const triggerSave = () => {
    if (!calcData) {
      toast.error("Please open a tool to save a calculation");
      return;
    }
    window.dispatchEvent(new CustomEvent("trigger-global-save"));
  };

  const isSavingLocal = calcData?.isSavingLocal;
  const isSavingCloud = calcData?.isSavingCloud;
  const historyLength = calcData?.historyLength || 0;
  const disabled = isSavingLocal || isSavingCloud;

  return (
    <div
      className="fixed bottom-4 md:bottom-6 left-0 right-0 z-[100] flex justify-center w-full font-sans px-2 pointer-events-none"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <div className="flex items-stretch justify-between w-full max-w-[420px] sm:max-w-[550px] rounded-full border border-white/50 dark:border-slate-700/50 p-1.5 bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] pointer-events-auto gap-1 mx-auto flex-nowrap overflow-visible">
        {/* Dashboard Button */}
        <button
          type="button"
          onClick={handleGoHome}
          className="flex-1 min-w-[60px] sm:min-w-[70px] min-h-[50px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2 sm:py-2.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 group border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20"
          aria-label="Back to Dashboard"
        >
          <Home
            className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[11px] sm:text-[13px] font-bold truncate">
            Home
          </span>
        </button>

        {/* History Button */}
        <button
          type="button"
          onClick={triggerHistory}
          className="flex-1 min-w-[60px] sm:min-w-[70px] min-h-[50px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2 sm:py-2.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all text-slate-700 dark:text-slate-300 hover:text-orange-700 dark:hover:text-orange-300 group relative border border-transparent hover:border-orange-200 dark:hover:border-orange-500/20"
          aria-label="View History"
        >
          <History
            className="w-[18px] h-[18px] text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[11px] sm:text-[13px] font-bold truncate">
            History
          </span>
          {historyLength > 0 && (
            <span className="absolute top-0 right-1 sm:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 z-10 border-none">
              {historyLength}
            </span>
          )}
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={triggerSave}
          disabled={disabled}
          className="flex-1 min-w-[60px] sm:min-w-[70px] min-h-[50px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2 sm:py-2.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50 group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20"
          aria-label="Save Calculation"
        >
          {disabled ? (
            <Save
              className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400 animate-pulse flex-shrink-0"
              strokeWidth={2}
            />
          ) : (
            <Save
              className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0"
              strokeWidth={2}
            />
          )}
          <span className="text-[11px] sm:text-[13px] font-bold truncate">
            Save
          </span>
        </button>

        {/* Share Button */}
        {calcData ? (
          <ShareButtonWithPopup
            activeTab={calcData.calculatorId}
            title={calcData.estimationName || "Calculation"}
            data={calcData.currentResults || calcData.currentInputs || {}}
            exportFormat={
              calcData.savePayload || {
                inputs: calcData.currentInputs || {},
                breakdown: calcData.currentResults || {},
              }
            }
            containerClassName="flex-1 min-w-[60px] sm:min-w-[70px] m-0 p-0 flex pointer-events-auto items-stretch h-full min-h-[50px]"
            popupPosition="top"
            triggerClassName="w-full h-full min-h-[50px] flex-col sm:flex-row flex items-center justify-center gap-1 sm:gap-1.5 px-1 py-2 sm:py-2.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 group border border-transparent hover:border-purple-200 dark:hover:border-purple-500/20"
            triggerContent={
              <>
                <Share2
                  className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="text-[11px] sm:text-[13px] font-bold truncate">
                  Share
                </span>
              </>
            }
          />
        ) : (
          <button
            type="button"
            onClick={() => toast.error("Please open a tool to share")}
            className="flex-1 w-full h-full min-h-[50px] flex-col sm:flex-row flex items-center justify-center gap-1 sm:gap-1.5 px-1 py-2 sm:py-2.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 group border border-transparent hover:border-purple-200 dark:hover:border-purple-500/20"
          >
            <Share2
              className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0"
              strokeWidth={2}
            />
            <span className="text-[11px] sm:text-[13px] font-bold truncate">
              Share
            </span>
          </button>
        )}

        {/* Profile Button */}
        <button
          type="button"
          onClick={openProfile}
          className="flex-1 min-w-[60px] sm:min-w-[70px] min-h-[50px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2 sm:py-2.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 group border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
          aria-label="Open Profile"
        >
          <User
            className="w-[18px] h-[18px] text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[11px] sm:text-[13px] font-bold truncate">
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
