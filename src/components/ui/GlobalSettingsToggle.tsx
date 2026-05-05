import React from "react";
import { motion } from "motion/react";
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
    <div className="flex items-center w-full max-w-full overflow-hidden">
      <div className="relative inline-flex items-center gap-0.5 sm:gap-1 p-1 bg-white/60 hover:bg-white/80 transition-colors backdrop-blur-xl border border-gray-200/50 rounded-full shadow-sm">
        
        {/* Toggle A: Units */}
        <div className="flex relative">
          {["SI", "FPS"].map((val) => {
            const isActive = settings.measurement === val;
            return (
              <button
                key={val}
                onClick={() => handleUnitChange(val as MeasurementSystem)}
                className={`relative px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide uppercase transition-colors z-10 ${
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="unit-pill"
                    className="absolute inset-0 bg-emerald-600/90 rounded-full shadow-[0_2px_8px_-2px_rgba(5,150,105,0.4)] -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                {val === "SI" ? "m/mm" : "ft/in"}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-4 sm:h-5 bg-gray-300 mx-0.5 sm:mx-1 rounded-full" />

        {/* Toggle B: Currency */}
        <div className="flex relative">
          {["PKR", "USD", "SAR", "INR"].map((val) => {
            const isActive = settings.currency === val;
            return (
              <button
                key={val}
                onClick={() => handleCurrencyChange(val as Currency)}
                className={`relative px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide uppercase transition-colors z-10 ${
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="curr-pill"
                    className="absolute inset-0 bg-emerald-600/90 rounded-full shadow-[0_2px_8px_-2px_rgba(5,150,105,0.4)] -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                {val}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
