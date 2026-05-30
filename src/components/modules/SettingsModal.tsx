import React, { useState } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import {
  X,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Laptop,
  User,
  Ruler,
  Palette,
  Camera,
} from "lucide-react";
import {
  useSettings,
  Currency,
  MeasurementSystem,
  Theme,
} from "../../context/SettingsContext";
type Tab = "account" | "measurements" | "appearance";
export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("account");
  /* We add this dummy state for account details to provide the visual ly complete mockup */ const [
    name,
    setName,
  ] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  if (!isOpen) return null;
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "account", label: "Account Details", icon: User },
    { id: "measurements", label: "Measurement Units", icon: Ruler },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 backdrop-blur-md p-4 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 transition-opacity">
      <div
        className="bg-white/80 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] sm:h-[650px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-700 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-transparent/50 border-r border-slate-200/50 p-6 flex flex-col shrink-0 overflow-y-auto">
          <div className="flex items-center gap-3 mb-10 pt-2">
            <div className="w-10 h-10 bg-gradient-to-tr rounded-[24px] flex items-center justify-center shadow-md shadow-blue-500/20">
              <SettingsIcon className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary leading-tight">
                Preferences
              </h2>
            </div>
          </div>
          <div className="flex-1 space-y-2 flex flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-[24px] font-semibold transition-all ${isActive ? "bg-bg-card text-indigo-600  shadow-sm border border-border-color/50" : "text-slate-700  hover:bg-slate-100/50  rounded-[24px] border border-slate-200 shadow-sm text-slate-800  hover:text-slate-900 border border-transparent"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-indigo-600 " : "text-slate-700   "}`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="hidden md:block mt-auto pb-2">
            <p className="text-xs text-slate-700 font-medium px-4">
              Civil Estimation Pro Settings
              <br />
              Version 1.0.4
            </p>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-transparent">
          <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-border-color/50">
            <h3 className="text-2xl font-bold text-text-primary capitalize">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-card hover:bg-slate-100 text-slate-700 hover:text-slate-800 border border-border-color shadow-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
            <div className="max-w-xl mx-auto md:mx-0">
              {/* Mobile Header */}
              <h3 className="md:hidden text-2xl font-bold text-text-primary capitalize mb-6">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              {activeTab === "account" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg overflow-hidden relative">
                        <span className="relative z-10 w-full h-full flex items-center justify-center">
                          {name.charAt(0)}
                        </span>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                          <Camera className="w-6 h-6 text-slate-900" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">
                        Profile Picture
                      </h4>
                      <p className="text-sm text-slate-700 mb-3">
                        Visible to other team members.
                      </p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-bg-card border border-border-color rounded-[24px] text-sm font-semibold text-slate-700 hover:bg-transparent transition-colors shadow-sm">
                          Upload New
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-bg-card border border-border-color rounded-[24px] px-4 py-3.5 text-text-primary font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-bg-card border border-border-color rounded-[24px] px-4 py-3.5 text-text-primary font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "measurements" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-5 mb-6">
                    <p className="text-sm font-medium text-blue-700">
                      This preference affects all calculation modules globally.
                      Some legacy fields may still expect native inputs.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                      <label
                        className={`relative flex items-center justify-between p-5 rounded-[24px] border-2 cursor-pointer transition-all ${settings.measurement === "SI" ? "border-blue-500 bg-blue-50/50 " : "border-border-color hover:border-slate-300 : bg-bg-card"}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-text-primary mb-1">
                            Metric (SI)
                          </span>
                          <span className="text-sm font-medium text-slate-700">
                            Meters, Sq.Meters, Cu.Meters
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${settings.measurement === "SI" ? "border-blue-500 bg-blue-500" : "border-border-color"}`}
                        >
                          {settings.measurement === "SI" && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="measurement"
                          className="hidden"
                          checked={settings.measurement === "SI"}
                          onChange={() => updateSettings({ measurement: "SI" })}
                        />
                      </label>
                      <label
                        className={`relative flex items-center justify-between p-5 rounded-[24px] border-2 cursor-pointer transition-all ${settings.measurement === "FPS" ? "border-blue-500 bg-blue-50/50 " : "border-border-color hover:border-slate-300 : bg-bg-card"}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-text-primary mb-1">
                            Imperial (FPS)
                          </span>
                          <span className="text-sm font-medium text-slate-700">
                            Feet, Inches, Sq.Ft, Cu.Ft
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${settings.measurement === "FPS" ? "border-blue-500 bg-blue-500" : "border-border-color"}`}
                        >
                          {settings.measurement === "FPS" && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="measurement"
                          className="hidden"
                          checked={settings.measurement === "FPS"}
                          onChange={() =>
                            updateSettings({ measurement: "FPS" })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "appearance" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-4">
                      Color Theme
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "system", label: "System", icon: Laptop },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isActive = settings.theme === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() =>
                              updateSettings({ theme: t.id as Theme })
                            }
                            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border-2 transition-all ${isActive ? "border-blue-500 bg-blue-50/50 " : "border-border-color hover:border-slate-300 : bg-bg-card"}`}
                          >
                            <div
                              className={`p-3 rounded-full ${isActive ? "bg-blue-100  text-indigo-600 " : "bg-bg-primary text-slate-700 "}`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <span
                              className={`font-bold ${isActive ? "text-blue-700 " : "text-slate-700  "}`}
                            >
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="h-px w-full bg-slate-200 my-8" />
                  {/* Additional visually pleasing mock toggles for appearance tab */}
                  <div className="space-y-6">
                    <h4 className="text-base font-bold text-slate-800 mb-4">
                      Display Options
                    </h4>
                    <div className="flex items-center justify-between px-4 py-3 bg-bg-card rounded-[24px] border border-border-color shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary">
                          Compact Mode
                        </span>
                        <span className="text-sm text-slate-700">
                          Reduce padding to fit more data on screen
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-bg-card rounded-[24px] border border-border-color shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary">
                          Animations
                        </span>
                        <span className="text-sm text-slate-700">
                          Enable UI transitions and micro-animations
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-12 max-w-xl mx-auto md:mx-0 flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-gradient-to-r hover:from-blue-700 hover: text-slate-900 font-bold rounded-[24px] shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    
      </div>
  );
}
