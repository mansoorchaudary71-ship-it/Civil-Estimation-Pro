import React, { useState, useRef, useEffect } from "react";
import { Settings, ChevronDown, Ruler, DollarSign } from "lucide-react";
import { useSettings, MeasurementSystem, Currency } from "../../context/SettingsContext";

export function GlobalSettingsToggle() {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-500 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900"
        title="Regional & Unit Settings"
      >
        <span className="hidden sm:inline-block tracking-wide">
          {settings.measurement === "SI" ? "M/MM" : "FT/IN"} &bull; {settings.currency}
        </span>
        <span className="sm:hidden tracking-wide text-xs">
          {settings.currency}
        </span>
        <Settings className="w-4 h-4 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-3">
             <div className="mb-2 text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pl-1">
               <Ruler className="w-3.5 h-3.5"/> Unit System
             </div>
             <div className="grid grid-cols-2 gap-1.5 mb-4">
               {["SI", "FPS"].map((val) => {
                 const isActive = settings.measurement === val;
                 return (
                   <button
                     key={val}
                     onClick={() => {
                        updateSettings({ measurement: val as MeasurementSystem });
                     }}
                     className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors ${
                        isActive 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-500 ring-1 ring-amber-600/20" 
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                   >
                     {val === "SI" ? "Metric (m)" : "Imperial (ft)"}
                   </button>
                 );
               })}
             </div>
             
             <div className="mb-2 text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pl-1">
               <DollarSign className="w-3.5 h-3.5"/> Currency
             </div>
             <div className="grid grid-cols-2 gap-1.5">
               {["PKR", "USD", "SAR", "INR"].map((val) => {
                 const isActive = settings.currency === val;
                 return (
                   <button
                     key={val}
                     onClick={() => {
                        updateSettings({ currency: val as Currency });
                     }}
                     className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors ${
                        isActive 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-500 ring-1 ring-amber-600/20" 
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                   >
                     {val}
                   </button>
                 );
               })}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
