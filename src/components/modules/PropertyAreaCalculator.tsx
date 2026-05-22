import React, { useState, useMemo } from "react";
import { Building, Plus, Trash2, Maximize, Ruler, Home } from "lucide-react";
import { useGlobalSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { parseNum } from "../../utils/mathHelpers";

interface Room {
  id: string;
  name: string;
  length: string;
  width: string;
}

export default function PropertyAreaCalculator() {
  const { currentUnit } = useGlobalSettings();
  const isMetric = currentUnit === "Metric";
  const unitStr = isMetric ? "m" : "ft";
  const areaUnitStr = isMetric ? "m²" : "sq.ft";

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
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const results = useMemo(() => {
    let carpet = 0;
    rooms.forEach(r => {
      carpet += parseNum(r.length) * parseNum(r.width);
    });
    const builtUp = carpet + parseNum(wallArea) + parseNum(balconyArea);
    const superBuiltUp = builtUp * (1 + parseNum(commonAreaPercent) / 100);
    return {
      carpet,
      builtUp,
      superBuiltUp
    };
  }, [rooms, wallArea, balconyArea, commonAreaPercent]);

  const carpetAreaFormatted = `${results.carpet.toFixed(2)} ${areaUnitStr}`;
  const builtUpAreaFormatted = `${results.builtUp.toFixed(2)} ${areaUnitStr}`;
  const superBuiltUpAreaFormatted = `${results.superBuiltUp.toFixed(2)} ${areaUnitStr}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-500/20">
          <Building className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Property Area Estimator</h2>
          <p className="text-slate-400 text-sm">Calculate Carpet, Built-up & Super Built-up Area</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Maximize className="w-5 h-5 text-indigo-400" /> Carpet Area (Rooms)
            </h3>
            
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <div key={room.id} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-12 sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Room Name"
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg p-3 text-white text-sm"
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3 relative">
                    <input
                      type="number"
                      placeholder={`Length`}
                      value={room.length}
                      onChange={(e) => updateRoom(room.id, "length", e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg p-3 text-white text-sm font-mono"
                    />
                    <span className="absolute right-3 top-3 text-slate-500 text-xs">{unitStr}</span>
                  </div>
                  <div className="col-span-5 sm:col-span-3 relative">
                    <input
                      type="number"
                      placeholder={`Width`}
                      value={room.width}
                      onChange={(e) => updateRoom(room.id, "width", e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg p-3 text-white text-sm font-mono"
                    />
                    <span className="absolute right-3 top-3 text-slate-500 text-xs">{unitStr}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-2 flex justify-end">
                    {rooms.length > 1 && (
                      <button onClick={() => removeRoom(room.id)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addRoom} className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium hover:text-indigo-300">
              <Plus className="w-4 h-4" /> Add Room
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Wall Area</label>
              <div className="relative">
                <input
                  type="number"
                  value={wallArea}
                  onChange={(e) => setWallArea(e.target.value)}
                  className="w-full bg-slate-800 border-[1px] border-slate-700 focus:border-indigo-500/50 rounded-xl p-3 text-white font-mono"
                />
                <span className="absolute right-4 top-3 text-slate-500">{areaUnitStr}</span>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Balcony Area</label>
              <div className="relative">
                <input
                  type="number"
                  value={balconyArea}
                  onChange={(e) => setBalconyArea(e.target.value)}
                  className="w-full bg-slate-800 border-[1px] border-slate-700 focus:border-indigo-500/50 rounded-xl p-3 text-white font-mono"
                />
                <span className="absolute right-4 top-3 text-slate-500">{areaUnitStr}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Common Area Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  value={commonAreaPercent}
                  onChange={(e) => setCommonAreaPercent(e.target.value)}
                  className="w-full bg-slate-800 border-[1px] border-slate-700 focus:border-indigo-500/50 rounded-xl p-3 text-white font-mono"
                />
                <span className="absolute right-4 top-3 text-slate-500">%</span>
              </div>
            </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="text-indigo-300 font-semibold mb-6 flex items-center gap-2">
              <Ruler className="w-5 h-5" /> Results
            </h3>
            
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Carpet Area</div>
                <div className="text-2xl font-black text-white">{carpetAreaFormatted}</div>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Built-Up Area</div>
                <div className="text-2xl font-black text-white">{builtUpAreaFormatted}</div>
              </div>
              
              <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/30">
                <div className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">Super Built-Up Area</div>
                <div className="text-3xl font-black text-indigo-100">{superBuiltUpAreaFormatted}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CalculationHistory 
        calculatorId="property_area_v1"
        currentInputs={{ rooms, wallArea, balconyArea, commonAreaPercent, isMetric }}
        currentResults={{ carpetAreaFormatted, builtUpAreaFormatted, superBuiltUpAreaFormatted }}
        explanation={{ hasInputs: false }}
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
