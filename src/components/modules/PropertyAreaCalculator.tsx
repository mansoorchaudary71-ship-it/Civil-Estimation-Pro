import React, { useState, useMemo } from "react";
import { Building, Plus, Trash2, Maximize, Ruler, Home } from "lucide-react";
import { useGlobalSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { CIVIL_CONSTANTS } from "../../utils/unitConverter";

interface Room {
  id: string;
  name: string;
  length: string;
  width: string;
}

export default function PropertyAreaCalculator() {
  const { currentUnit, setCurrentUnit } = useGlobalSettings();
  const isMetric = currentUnit === "Metric";

  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Living Room", length: "", width: "" },
  ]);
  const [wallArea, setWallArea] = useState("");
  const [balconyArea, setBalconyArea] = useState("");
  const [commonAreaPercent, setCommonAreaPercent] = useState("20");

  const addRoom = () => {
    setRooms([
      ...rooms,
      { id: Date.now().toString(), name: `Room ${rooms.length + 1}`, length: "", width: "" },
    ]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const updateRoom = (id: string, field: keyof Room, value: string) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const calculate = () => {
    let carpetArea = 0;
    rooms.forEach((r) => {
      const l = parseFloat(r.length) || 0;
      const w = parseFloat(r.width) || 0;
      carpetArea += l * w;
    });

    const wArea = parseFloat(wallArea) || 0;
    const bArea = parseFloat(balconyArea) || 0;
    const builtUpArea = carpetArea + wArea + bArea;

    const cPercent = parseFloat(commonAreaPercent) || 0;
    const superBuiltUpArea = builtUpArea + builtUpArea * (cPercent / 100);

    const formatSqmToSqft = (sqm: number) => sqm * Math.pow(CIVIL_CONSTANTS.M_TO_FT, 2);
    
    return {
      carpetArea,
      builtUpArea,
      superBuiltUpArea,
      carpetAreaFormatted: isMetric ? `${carpetArea.toFixed(2)} m²` : `${carpetArea.toFixed(2)} sq.ft`,
      builtUpAreaFormatted: isMetric ? `${builtUpArea.toFixed(2)} m²` : `${builtUpArea.toFixed(2)} sq.ft`,
      superBuiltUpAreaFormatted: isMetric ? `${superBuiltUpArea.toFixed(2)} m²` : `${superBuiltUpArea.toFixed(2)} sq.ft`,
      carpetSqft: formatSqmToSqft(isMetric ? carpetArea : carpetArea / Math.pow(CIVIL_CONSTANTS.M_TO_FT, 2)),
      builtUpSqft: formatSqmToSqft(isMetric ? builtUpArea : builtUpArea / Math.pow(CIVIL_CONSTANTS.M_TO_FT, 2)),
      superBuiltUpSqft: formatSqmToSqft(isMetric ? superBuiltUpArea : superBuiltUpArea / Math.pow(CIVIL_CONSTANTS.M_TO_FT, 2)),
    };
  };

  const { carpetArea, builtUpArea, superBuiltUpArea, carpetAreaFormatted, builtUpAreaFormatted, superBuiltUpAreaFormatted } = useMemo(calculate, [rooms, wallArea, balconyArea, commonAreaPercent, isMetric]);

  const explanationOpts = {
    hasInputs: carpetArea > 0,
    genericFormula: [
      { label: "Carpet Area", formula: "Sum of all useable room areas" },
      { label: "Built-up Area", formula: "Carpet Area + Wall Area + Balcony Area" },
      { label: "Super Built-up Area", formula: "Built-up Area + (Built-up Area × Common Area %)" }
    ],
    activeBreakdown: carpetArea > 0 ? [
      { label: "Total Carpet Area", formula: "Σ (L × W)", result: carpetAreaFormatted },
      { label: "Built-up Area", formula: `${carpetArea.toFixed(2)} + ${wallArea || 0} + ${balconyArea || 0}`, result: builtUpAreaFormatted },
      { label: "Super Built-up Area", formula: `${builtUpArea.toFixed(2)} + (${builtUpArea.toFixed(2)} × ${commonAreaPercent || 0}%)`, result: superBuiltUpAreaFormatted }
    ] : []
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Building className="w-8 h-8 text-indigo-600" /> Property Area Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          Calculate Carpet Area, Built-up Area, and Super Built-up area precisely using room dimensions.
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
              Unit System
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
              <button
                onClick={() => setCurrentUnit("Metric")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${isMetric ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-700 dark:text-slate-300"}`}
              >
                Metric (m/m²)
              </button>
              <button
                onClick={() => setCurrentUnit("Imperial")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${!isMetric ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-700 dark:text-slate-300"}`}
              >
                Imperial (ft/sq.ft)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-500" /> Carpet Area (Rooms)
            </h3>
            <div className="space-y-4 mb-6">
              {rooms.map((room, index) => (
                <div key={room.id} className="flex flex-wrap sm:flex-nowrap items-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className="w-full sm:w-1/3">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Room Name</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="w-1/2 sm:w-1/4">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Length ({isMetric ? "m" : "ft"})</label>
                    <input
                      type="number"
                      value={room.length}
                      onChange={(e) => updateRoom(room.id, "length", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="w-[calc(50%-3rem)] sm:w-1/4">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Width ({isMetric ? "m" : "ft"})</label>
                    <input
                      type="number"
                      value={room.width}
                      onChange={(e) => updateRoom(room.id, "width", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="0.0"
                    />
                  </div>
                  <button
                    onClick={() => removeRoom(room.id)}
                    disabled={rooms.length === 1}
                    className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addRoom}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Room
            </button>

            <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-8"></div>

            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Maximize className="w-5 h-5 text-indigo-500" /> Additional Areas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                  Wall Area ({isMetric ? "m²" : "sq.ft"})
                </label>
                <input
                  type="number"
                  value={wallArea}
                  onChange={(e) => setWallArea(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                  Balcony Area ({isMetric ? "m²" : "sq.ft"})
                </label>
                <input
                  type="number"
                  value={balconyArea}
                  onChange={(e) => setBalconyArea(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                  Common Area %
                </label>
                <input
                  type="number"
                  value={commonAreaPercent}
                  onChange={(e) => setCommonAreaPercent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-white shadow-xl flex flex-col items-center text-center">
            <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest mb-6 w-full text-left">
              Property Area Results
            </h3>
            
            <div className="w-full space-y-4">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Carpet Area</span>
                <span className="text-3xl font-black text-white">{carpetAreaFormatted}</span>
                <p className="text-[10px] text-slate-500 mt-1">Net usable floor area</p>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Built-Up Area</span>
                <span className="text-3xl font-black text-blue-400">{builtUpAreaFormatted}</span>
                <p className="text-[10px] text-slate-500 mt-1">Carpet + Wall + Balcony</p>
              </div>

              <div className="bg-indigo-600/20 p-5 rounded-2xl border border-indigo-500/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Building className="w-16 h-16" />
                </div>
                <span className="block text-indigo-300 text-xs font-bold uppercase mb-1">Super Built-Up Area</span>
                <span className="text-4xl font-black text-indigo-400">{superBuiltUpAreaFormatted}</span>
                <p className="text-[10px] text-indigo-300/70 mt-1">Chargeable area (incl. common amenities)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CalculationHistory 
        calculatorId="property_area_v1"
        currentInputs={{ rooms, wallArea, balconyArea, commonAreaPercent, isMetric }}
        currentResults={{ carpetAreaFormatted, builtUpAreaFormatted, superBuiltUpAreaFormatted }}
        explanation={explanationOpts}
        summaryGeneration={(ins, res) => `Super Built-up Area: ${res.superBuiltUpAreaFormatted}`}
        onRestore={(ins) => {
          if (ins.rooms) setRooms(ins.rooms);
          if (ins.wallArea !== undefined) setWallArea(ins.wallArea);
          if (ins.balconyArea !== undefined) setBalconyArea(ins.balconyArea);
          if (ins.commonAreaPercent !== undefined) setCommonAreaPercent(ins.commonAreaPercent);
        }}
      />
    </div>
  );
}
