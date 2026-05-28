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
      className="fixed bottom-3 md:bottom-5 left-0 right-0 z-[100] flex justify-center w-full font-sans px-2 pointer-events-none"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <div className="flex items-stretch justify-between w-auto min-w-[280px] max-w-[92vw] sm:max-w-md rounded-full border border-white/60 dark:border-slate-700/60 p-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] pointer-events-auto gap-0.5 mx-auto flex-nowrap overflow-visible">
        {/* Dashboard Button */}
        <button
          type="button"
          onClick={handleGoHome}
          className="flex-1 min-w-[50px] sm:min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 group"
          aria-label="Back to Dashboard"
        >
          <Home
            className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-none">
            Home
          </span>
        </button>

        {/* History Button */}
        <button
          type="button"
          onClick={triggerHistory}
          className="flex-1 min-w-[50px] sm:min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 group relative"
          aria-label="View History"
        >
          <History
            className="w-[18px] h-[18px] text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-none">
            History
          </span>
          {historyLength > 0 && (
            <span className="absolute top-0 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-white dark:ring-slate-900 z-10 border-none">
              {historyLength}
            </span>
          )}
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={triggerSave}
          disabled={disabled}
          className="flex-1 min-w-[50px] sm:min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-50 group"
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
          <span className="text-[10px] sm:text-[11px] font-semibold leading-none">
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
            containerClassName="flex-1 min-w-[50px] sm:min-w-[56px] m-0 p-0 flex pointer-events-auto items-stretch h-full min-h-[44px]"
            popupPosition="top"
            triggerClassName="w-full h-full min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 group"
            triggerContent={
              <>
                <Share2
                  className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="text-[10px] sm:text-[11px] font-semibold leading-none">
                  Share
                </span>
              </>
            }
          />
        ) : (
          <button
            type="button"
            onClick={() => toast.error("Please open a tool to share")}
            className="flex-1 min-w-[50px] sm:min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 group"
          >
            <Share2
              className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0"
              strokeWidth={2}
            />
            <span className="text-[10px] sm:text-[11px] font-semibold leading-none">
              Share
            </span>
          </button>
        )}

        {/* Profile Button */}
        <button
          type="button"
          onClick={openProfile}
          className="flex-1 min-w-[50px] sm:min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 group"
          aria-label="Open Profile"
        >
          <User
            className="w-[18px] h-[18px] text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-none">
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
