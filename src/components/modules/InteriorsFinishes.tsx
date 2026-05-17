import React, { useState } from "react";
import { Paintbrush, Hammer, LayoutGrid, Bug, AppWindow, PaintBucket, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useSettings } from "../../context/SettingsContext";

export default function InteriorsFinishesEstimator() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tiles: true,
    paint: false,
    doorsWindows: false,
    framing: false,
    termite: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const AccordionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: any }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors focus:outline-none"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800">{title}</h3>
      </div>
      {openSections[id] ? (
        <ChevronUp className="w-5 h-5 text-slate-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-400" />
      )}
    </button>
  );

  return (
    <div className="w-full pb-20 mt-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <PaintBucket className="w-8 h-8 text-amber-600" />
            Interiors & Finishes
          </h1>
          <p className="text-slate-500 font-medium">
            Estimate quantities for tiles, paint, doors/windows, wood framing, and anti-termite treatment.
          </p>
          <div className="mt-4">
             <GlobalSettingsToggle align="left" showCurrency={false} />
          </div>
        </header>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="tiles" title="Tiles & Flooring Calculator" icon={LayoutGrid} />
            {openSections["tiles"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <TilesCalculator />
               </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="paint" title="Paint Calculator" icon={Paintbrush} />
            {openSections["paint"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <PaintCalculator />
               </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="doorsWindows" title="Doors & Windows Deductions" icon={AppWindow} />
            {openSections["doorsWindows"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <DoorsWindowsCalculator />
               </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="framing" title="Wood Framing Calculator" icon={Hammer} />
            {openSections["framing"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                   <FramingCalculator />
               </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="termite" title="Termite Treatment Calculator" icon={Bug} />
            {openSections["termite"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <TermiteCalculator />
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Calculators ---

function TilesCalculator() {
  const { settings } = useSettings();
  const isSI = settings.measurement === "SI";
  const uArea = isSI ? "m²" : "sq.ft";
  
  const [area, setArea] = useState<number | "">("");
  const [tileWidth, setTileWidth] = useState<number | "">(isSI ? 600 : 24);
  const [tileLength, setTileLength] = useState<number | "">(isSI ? 600 : 24);
  const [tilesPerBox, setTilesPerBox] = useState<number | "">(4);

  const calculateTiles = () => {
    if (!area || !tileWidth || !tileLength) return null;

    let totalArea = Number(area);
    let tW = Number(tileWidth);
    let tL = Number(tileLength);
    let tpb = Number(tilesPerBox) || 1;

    let tileArea = tW * tL;
    if (isSI) {
      // mm to m2
      tileArea = tileArea / 1000000;
    } else {
      // inches to sq ft
      tileArea = tileArea / 144;
    }

    const totalTileAreaReq = totalArea * 1.05; // 5% wastage
    const numTiles = tileArea > 0 ? totalTileAreaReq / tileArea : 0;
    const boxesReq = tpb > 0 ? Math.ceil(numTiles / tpb) : 0;

    return {
      numTiles: Math.ceil(numTiles),
      boxesReq,
    };
  };

  const results = calculateTiles();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputGroup label={`Total Room Area (${uArea})`}>
          <input
            type="number"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="e.g. 500"
          />
        </InputGroup>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup label={`Tile Width (${isSI ? 'mm' : 'in'})`}>
            <input
              type="number"
              min="1"
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
           <InputGroup label={`Tile Length (${isSI ? 'mm' : 'in'})`}>
            <input
              type="number"
              min="1"
              value={tileLength}
              onChange={(e) => setTileLength(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
        </div>
        
        <InputGroup label="Tiles per Box">
            <input
              type="number"
              min="1"
              value={tilesPerBox}
              onChange={(e) => setTilesPerBox(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
        </InputGroup>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
        
        {results ? (
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Required Tiles (inc. 5% waste)</p>
              <div className="text-4xl font-black text-white flex items-baseline gap-2">
                {results.numTiles} <span className="text-xl text-amber-400 font-bold">tiles</span>
              </div>
            </div>
            
             <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-1">Boxes Required</p>
              <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                {results.boxesReq} <span className="text-sm font-normal text-slate-400">boxes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            Enter area and tile size to calculate.
          </div>
        )}
      </div>
    </div>
  );
}

function PaintCalculator() {
  const { settings } = useSettings();
  const isSI = settings.measurement === "SI";
  const [area, setArea] = useState<number | "">("");
  const [coats, setCoats] = useState<number | "">(2);
  const [coverage, setCoverage] = useState<number | "">(isSI ? 12 : 350); 
  const [wastage, setWastage] = useState<number | "">(10); 

  const calculatePaint = () => {
    if (!area || !coats || !coverage) return null;

    let areaSqm = Number(area);
    if (!isSI) {
      areaSqm = areaSqm / 10.764; // convert sq ft to sq m
    }

    let c = Number(coverage);
    if (!isSI) {
      c = c / 10.764 / 3.78541; // convert sq ft/gal to sq m/L (approx)
    }

    const unadjustedLiters = (areaSqm / c) * Number(coats);
    const wasteFactor = 1 + (Number(wastage) || 0) / 100;
    const totalLiters = unadjustedLiters * wasteFactor;

    const gallons = totalLiters / 3.78541;

    return {
      liters: totalLiters.toFixed(2),
      gallons: gallons.toFixed(2),
    };
  };

  const results = calculatePaint();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputGroup label={`Total Area (${isSI ? 'Sq M' : 'Sq Ft'})`}>
          <input
            type="number"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="e.g. 500"
          />
        </InputGroup>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Number of Coats">
            <input
              type="number"
              min="1"
              value={coats}
              onChange={(e) => setCoats(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
           <InputGroup label="Wastage (%)">
            <input
              type="number"
              min="0"
              value={wastage}
              onChange={(e) => setWastage(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
        </div>
        
         <InputGroup label={`Coverage (${isSI ? 'm²/Liter' : 'sqft/Gallon'})`}>
            <input
              type="number"
              min="1"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>

      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
        
        {results ? (
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Required Paint</p>
              <div className="text-4xl font-black text-white flex items-baseline gap-2">
                {results.liters} <span className="text-xl text-amber-400 font-bold">Liters</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-1">In Gallons (US)</p>
              <p className="text-2xl font-bold">{results.gallons} <span className="text-sm font-normal text-slate-400">gals</span></p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            Enter wall/ceiling area and coats to calculate.
          </div>
        )}
      </div>
    </div>
  );
}

function DoorsWindowsCalculator() {
  const { settings } = useSettings();
  const isSI = settings.measurement === "SI";
  const uArea = isSI ? "m²" : "sq.ft";

  const [grossArea, setGrossArea] = useState<number | "">("");
  const [deductions, setDeductions] = useState<{name: string, w: number, h: number, qty: number}[]>([
    { name: "Door", w: isSI ? 0.9 : 3, h: isSI ? 2.1 : 7, qty: 1 }
  ]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...deductions];
    (newItems[index] as any)[field] = value ? Number(value) : "";
    setDeductions(newItems);
  };

  const addItem = () => setDeductions([...deductions, { name: "Window", w: 0, h: 0, qty: 1 }]);
  const removeItem = (index: number) => setDeductions(deductions.filter((_, i) => i !== index));

  const totalDeduction = deductions.reduce((sum, item) => sum + (item.w * item.h * item.qty), 0);
  const netArea = Number(grossArea) - totalDeduction;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <InputGroup label={`Gross Wall Area (${uArea})`}>
          <input
            type="number"
            min="0"
            value={grossArea}
            onChange={(e) => setGrossArea(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="e.g. 1000"
          />
        </InputGroup>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Openings / Deductions</label>
          {deductions.map((item, index) => (
            <div key={index} className="flex gap-2 items-center bg-slate-50 border border-slate-200 p-2 rounded-xl">
              <input 
                type="text" 
                value={item.name} 
                onChange={(e) => {
                  const newItems = [...deductions];
                  newItems[index].name = e.target.value;
                  setDeductions(newItems);
                }}
                className="w-24 px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none" 
              />
              <input type="number" placeholder="W" value={item.w || ""} onChange={(e) => updateItem(index, 'w', e.target.value)} className="w-16 px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none" />
              <input type="number" placeholder="H" value={item.h || ""} onChange={(e) => updateItem(index, 'h', e.target.value)} className="w-16 px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none" />
              <input type="number" placeholder="Qty" value={item.qty || ""} onChange={(e) => updateItem(index, 'qty', e.target.value)} className="w-16 px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none" />
              <button onClick={() => removeItem(index)} className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded">X</button>
            </div>
          ))}
          <button onClick={addItem} className="text-sm font-bold text-amber-600 hover:text-amber-700">+ Add Opening</button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
        
        {grossArea ? (
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Net Printable / Plaster Area</p>
              <div className="text-4xl font-black text-emerald-400 flex items-baseline gap-2">
                {netArea > 0 ? netArea.toFixed(2) : 0} <span className="text-xl text-emerald-600 font-bold">{uArea}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-1">Total Deductions</p>
              <p className="text-2xl font-bold text-rose-400">{totalDeduction.toFixed(2)} <span className="text-sm font-normal text-rose-600">{uArea}</span></p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            Enter gross wall area to calculate net dimensions.
          </div>
        )}
      </div>
    </div>
  );
}

function FramingCalculator() {
  const [length, setLength] = useState<number | "">("");
  const [spacing, setSpacing] = useState<number | "">(16);
  const { settings } = useSettings();
  const isSI = settings.measurement === "SI";

  const calculateFraming = () => {
    if (!length || !spacing) return null;

    let l = Number(length);
    let s = Number(spacing); // In inches or cm based on unit

    if (!isSI) {
      // spacing is in inches, length is in feet
      const lengthInches = l * 12;
      const studs = Math.ceil(lengthInches / s) + 1; // 1 extra for the end
      const plateLength = 8;
      const platesReq = Math.ceil(l / plateLength) * 3;

      return {
        studs: studs,
        plates: platesReq,
        plateLengthDesc: "8ft",
      };
    } else {
      // spacing is in cm, length is in meters
      const lengthCm = l * 100;
      const studs = Math.ceil(lengthCm / s) + 1;
      const plateLength = 2.44;
      const platesReq = Math.ceil(l / plateLength) * 3;

      return {
        studs: studs,
        plates: platesReq,
        plateLengthDesc: "2.44m",
      };
    }
  };

  const results = calculateFraming();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputGroup label={`Wall Length (${!isSI ? 'Feet' : 'Meters'})`}>
          <input
            type="number"
            min="0"
            value={length}
            onChange={(e) => setLength(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="e.g. 20"
          />
        </InputGroup>
        
        <InputGroup label={`Stud Spacing (${!isSI ? 'Inches' : 'Centimeters'})`}>
          <input
            type="number"
            min="0"
            value={spacing}
            onChange={(e) => setSpacing(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder={!isSI ? '16 or 24' : '40 or 60'}
          />
        </InputGroup>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
        
        {results ? (
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Studs Required</p>
              <div className="text-4xl font-black text-white flex items-baseline gap-2">
                {results.studs} <span className="text-xl text-amber-400 font-bold">studs</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-1">Top & Bottom Plates ({results.plateLengthDesc} boards)</p>
              <p className="text-2xl font-bold">{results.plates} <span className="text-sm font-normal text-slate-400">boards</span></p>
            </div>
            <div className="mt-2 text-slate-400 text-xs">
              ℹ️ Assumes 1 bottom plate and 2 top plates. Extra framing needed for doors/windows.
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            Enter wall length and spacing to calculate framing.
          </div>
        )}
      </div>
    </div>
  );
}

function TermiteCalculator() {
  const { settings } = useSettings();
  const isSI = settings.measurement === "SI";
  const [area, setArea] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">(5); // liters per sq m
  
  const calculateTermite = () => {
    if (!area || !rate) return null;

    let sqmArea = Number(area);
    if (!isSI) {
      sqmArea = sqmArea / 10.764;
    }

    const liters = sqmArea * Number(rate);

    return {
      liters: liters.toFixed(1),
      gallons: (liters / 3.78541).toFixed(1)
    };
  };

  const results = calculateTermite();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputGroup label={`Foundation Area (${isSI ? 'Sq M' : 'Sq Ft'})`}>
          <input
            type="number"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="e.g. 150"
          />
        </InputGroup>

        <InputGroup label="Application Rate (Liters/m²)">
          <input
            type="number"
            min="0"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="e.g. 5"
          />
          <p className="text-xs text-slate-400 mt-1">Standard pre-construction rate is 5 Liters per sq. meter.</p>
        </InputGroup>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
        
        {results ? (
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Chemical Emulsion Required</p>
              <div className="text-4xl font-black text-white flex items-baseline gap-2">
                {results.liters} <span className="text-xl text-amber-400 font-bold">Liters</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm mb-1">In Gallons (US)</p>
              <p className="text-xl font-bold">{results.gallons} <span className="text-sm font-normal text-slate-400">gals</span></p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            Enter foundation area to calculate chemical emulsion.
          </div>
        )}
      </div>
    </div>
  );
}

function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
