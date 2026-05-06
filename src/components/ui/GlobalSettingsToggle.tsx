import React from "react";
import { motion } from "motion/react";
import { Settings } from "lucide-react";
import { useSettings, MeasurementSystem, Currency } from "../../context/SettingsContext";

export function GlobalSettingsToggle() {
  const { settings, updateSettings } = useSettings();

  const handleUnitChange = (unit: MeasurementSystem) => {
    updateSettings({ measurement: unit });
  };

  const handleCurrencyChange = (curr: Currency) => {
    updateSettings({ currency: curr });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full max-w-full overflow-hidden">
      
      {/* Settings Icon container */}
      <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100 hover:rotate-45 transition-all duration-300 group flex items-center justify-center">
         <Settings className="w-5 h-5 text-gray-500 group-hover:text-gray-800 transition-colors" />
      </div>

      {/* Measurement Segmented Control */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-[3px] shadow-inner relative">
        {["SI", "FPS"].map((val) => {
          const isActive = settings.measurement === val;
          return (
            <button
              key={val}
              onClick={() => handleUnitChange(val as MeasurementSystem)}
              className={`relative px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-in-out z-10 w-[70px] flex items-center justify-center rounded-full ${
                isActive ? "text-slate-900 dark:text-slate-900" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="unit-active-bg"
                  className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-slate-200/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {val === "SI" ? "M/MM" : "FT/IN"}
            </button>
          );
        })}
      </div>

      {/* Soft Divider */}
      <div className="hidden sm:block w-[1px] h-6 bg-gray-200 dark:bg-slate-700" />

      {/* Currency Segmented Control */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-[3px] shadow-inner relative">
        {["PKR", "USD", "SAR", "INR"].map((val) => {
          const isActive = settings.currency === val;
          return (
            <button
              key={val}
              onClick={() => handleCurrencyChange(val as Currency)}
              className={`relative px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-in-out z-10 w-[60px] flex items-center justify-center rounded-full ${
                isActive ? "text-slate-900 dark:text-slate-900" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="currency-active-bg"
                  className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-slate-200/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {val}
            </button>
          );
        })}
      </div>

    </div>
  );
}
