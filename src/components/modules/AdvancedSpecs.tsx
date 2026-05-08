import React, { useState } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { Sliders, ChevronDown, ChevronUp } from "lucide-react";
export type SpecsState = {
  foundationDepth: string;
  termiteProofing: boolean;
  dpcLayers: string;
  backfillSand: string;
  brickQuality: string;
  steelGrade: string;
  cementSandRatio: string;
  concreteMixRatio: string;
  slabThickness: string;
  lintelThickness: string;
  flooringType: string;
  internalWallFinish: string;
  exteriorFinish: string;
  ceilingType: string;
  roofTreatment: string;
  mainGate: string;
  windowFrames: string;
  mainDoor: string;
  internalDoors: string;
  includeWardrobes: boolean;
  wardrobeMaterial: string;
  plumbingPipes: string;
  sanitaryFittings: string;
  electricalWiring: string;
  switchesBoards: string;
};
export const initialSpecs: SpecsState = {
  foundationDepth: "3",
  termiteProofing: true,
  dpcLayers: "Single",
  backfillSand: "Ravi",
  brickQuality: "A-Class",
  steelGrade: "Grade 60",
  cementSandRatio: "1:4",
  concreteMixRatio: "1:2:4",
  slabThickness: "6",
  lintelThickness: "9",
  flooringType: "Porcelain Tiles",
  internalWallFinish: "Plastic Emulsion",
  exteriorFinish: "Weather Shield",
  ceilingType: "False Ceiling (Gypsum)",
  roofTreatment: "Standard (Bitumen coating + Polythene sheet + Mud)",
  mainGate: "16-gauge Steel",
  windowFrames: "Aluminum (1.2mm)",
  mainDoor: "Solid Ash Wood",
  internalDoors: "Flush Doors",
  includeWardrobes: true,
  wardrobeMaterial: "Lasani",
  plumbingPipes: "PPRC standard",
  sanitaryFittings: "Standard",
  electricalWiring: "3/0.29 & 7/0.29 Standard",
  switchesBoards: "Local Standard",
};
interface Props {
  specs: SpecsState;
  setSpecs: React.Dispatch<React.SetStateAction<SpecsState>>;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}
export default function AdvancedSpecs({
  specs,
  setSpecs,
  isOpen,
  setIsOpen,
}: Props) {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const updateSpec = <K extends keyof SpecsState>(
    key: K,
    value: SpecsState[K],
  ) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };
  const toggleCategory = (idx: number) => {
    setOpenCategory((prev) => (prev === idx ? null : idx));
  };
  const renderDropdown = (
    label: string,
    specKey: keyof SpecsState,
    options: string[],
  ) => (
    <div className="space-y-2 col-span-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={specs[specKey] as string}
          onChange={(e) => updateSpec(specKey, e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium appearance-none text-sm"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
  const renderNumber = (
    label: string,
    specKey: keyof SpecsState,
    placeholder?: string,
  ) => (
    <div className="space-y-2 col-span-2 sm:col-span-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      <input
        type="number"
        value={specs[specKey] as string}
        onChange={(e) => updateSpec(specKey, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm"
      />
    </div>
  );
  const renderToggle = (label: string, specKey: keyof SpecsState) => (
    <div className="flex items-center justify-between col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={specs[specKey] as boolean}
          onChange={(e) => updateSpec(specKey, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
  return (
    <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl transition-all duration-300">
      <div
        className="flex items-center justify-between mb-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Sliders className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">
            Advanced Specifications
          </h2>
        </div>
        <div className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>
      {!isOpen && (
        <p className="text-sm text-slate-500 font-medium">
          Using standard smart defaults for accurate initial estimates.
        </p>
      )}
      {isOpen && (
        <div className="mt-6 space-y-3 animate-in fade-in zoom-in-95">
          {/* 1. Foundation & Substructure */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => toggleCategory(0)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
            >
              <span className="font-bold text-sm text-slate-800">
                1. Foundation & Substructure
              </span>
              {openCategory === 0 ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openCategory === 0 && (
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-100">
                {renderNumber("Foundation Depth (ft)", "foundationDepth")}
                {renderDropdown("DPC Layers", "dpcLayers", [
                  "Single",
                  "Double",
                ])}
                {renderToggle("Termite Proofing", "termiteProofing")}
                {renderDropdown("Backfill Sand Quality", "backfillSand", [
                  "Ravi",
                  "Chenab",
                ])}
              </div>
            )}
          </div>
          {/* 2. Superstructure (Grey Structure) */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => toggleCategory(1)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
            >
              <span className="font-bold text-sm text-slate-800">
                2. Superstructure (Grey Structure)
              </span>
              {openCategory === 1 ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openCategory === 1 && (
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-100">
                {renderDropdown("Brick Quality", "brickQuality", [
                  "A-Class",
                  "B-Class",
                  "Fly Ash",
                ])}
                {renderDropdown("Steel Grade", "steelGrade", [
                  "Grade 40",
                  "Grade 60",
                ])}
                {renderDropdown("Cement/Sand Mortar Ratio", "cementSandRatio", [
                  "1:3",
                  "1:4",
                  "1:5",
                ])}
                {renderDropdown("Concrete Mix Ratio", "concreteMixRatio", [
                  "1:1.5:3",
                  "1:2:4",
                  "1:3:6",
                ])}
                {renderNumber("Slab Thickness (in)", "slabThickness")}
                {renderNumber("Lintel Thickness (in)", "lintelThickness")}
              </div>
            )}
          </div>
          {/* 3. Finishing & Surfaces */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => toggleCategory(2)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
            >
              <span className="font-bold text-sm text-slate-800">
                3. Finishing & Surfaces
              </span>
              {openCategory === 2 ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openCategory === 2 && (
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-100">
                {renderDropdown("Flooring Type", "flooringType", [
                  "Ceramic Tiles",
                  "Porcelain Tiles",
                  "Marble",
                  "Terrazzo",
                ])}
                {renderDropdown("Internal Paint", "internalWallFinish", [
                  "Distemper",
                  "Matt Enamel",
                  "Plastic Emulsion",
                  "Wallpaper",
                ])}
                {renderDropdown("External Paint", "exteriorFinish", [
                  "Plaster & Paint",
                  "Rockwall",
                  "Weather Shield",
                  "Tiles",
                ])}
                {renderDropdown("Ceiling Type", "ceilingType", [
                  "Plaster",
                  "False Ceiling (Gypsum)",
                  "POP",
                ])}
                {renderDropdown(
                  "Roof Treatment & Insulation",
                  "roofTreatment",
                  [
                    "Standard (Bitumen coating + Polythene sheet + Mud)",
                    "Premium (Jumbolon insulation + Waterproofing chemicals + Brick tiles)",
                    "Luxury (Polyurethane spray + imported tiles)",
                  ],
                )}
              </div>
            )}
          </div>
          {/* 4. Woodwork & Openings (Doors/Windows) */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => toggleCategory(3)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
            >
              <span className="font-bold text-sm text-slate-800">
                4. Woodwork & Openings
              </span>
              {openCategory === 3 ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openCategory === 3 && (
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-100">
                {renderDropdown("Main Gate", "mainGate", [
                  "16-gauge Steel",
                  "14-gauge Steel",
                  "Wrought Iron",
                ])}
                {renderDropdown("Window Frames", "windowFrames", [
                  "Aluminum (1.2mm)",
                  "Aluminum (1.6mm)",
                  "UPVC",
                ])}
                {renderDropdown("Main Door Material", "mainDoor", [
                  "Solid Ash Wood",
                  "Solid Diyar",
                  "MDF",
                ])}
                {renderDropdown("Internal Doors", "internalDoors", [
                  "Flush Doors",
                  "Semi-Solid",
                  "Lamination",
                ])}
                {renderToggle("Include Wardrobes/Cabinets", "includeWardrobes")}
                {specs.includeWardrobes &&
                  renderDropdown("Wardrobes Material", "wardrobeMaterial", [
                    "UV",
                    "Lasani",
                    "Solid Wood",
                  ])}
              </div>
            )}
          </div>
          {/* 5. MEP (Mechanical, Electrical, Plumbing) */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => toggleCategory(4)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
            >
              <span className="font-bold text-sm text-slate-800">
                5. MEP Services
              </span>
              {openCategory === 4 ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openCategory === 4 && (
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-100">
                {renderDropdown("Plumbing Pipes", "plumbingPipes", [
                  "PPRC standard",
                  "PPRC Premium",
                  "UPVC",
                ])}
                {renderDropdown(
                  "Sanitary Fittings Quality",
                  "sanitaryFittings",
                  ["Standard", "Premium", "Luxury"],
                )}
                {renderDropdown("Electrical Wiring", "electricalWiring", [
                  "3/0.29 & 7/0.29 Standard",
                  "Premium Brand",
                ])}
                {renderDropdown("Switches & Boards", "switchesBoards", [
                  "Local Standard",
                  "Premium",
                ])}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
