import React, { useState } from "react";
import { Paintbrush, Hammer, LayoutGrid, Bug, AppWindow, PaintBucket, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { MaterialSummary } from "../ui/MaterialSummary";
import { ResultCard } from "../ui/ResultCard";

export default function InteriorsFinishesEstimator() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tiles: true,
    paint: false,
    doorsWindows: false,
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

        <div className="flex flex-col h-full">
          {results ? (
            <MaterialSummary
               title="Estimate Results"
               totalLabel="Boxes Required"
               totalValue={results.boxesReq.toString()}
               totalUnit="boxes"
             >
               <div className="grid grid-cols-1 gap-4 mt-6">
                 <ResultCard title="Required Tiles (inc. 5% waste)" value={results.numTiles} unit="tiles" variant="neutral" />
               </div>
             </MaterialSummary>
          ) : (
            <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden group">
              <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
              <div className="text-center text-slate-500 py-8">
                Enter area and tile size to calculate.
              </div>
            </div>
          )}
        </div>
      <div className="col-span-1 md:col-span-2">
        <CalculationHistory
          calculatorId="tiles_calc_v1"
          currentInputs={{ area, tileWidth, tileLength, tilesPerBox }}
          onRestore={(ins) => {
            if (ins.area) setArea(ins.area);
            if (ins.tileWidth) setTileWidth(ins.tileWidth);
            if (ins.tileLength) setTileLength(ins.tileLength);
            if (ins.tilesPerBox) setTilesPerBox(ins.tilesPerBox);
          }}
        />
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

      <div className="flex flex-col h-full">
        {results ? (
            <MaterialSummary
               title="Estimate Results"
               totalLabel="Required Paint"
               totalValue={results.liters}
               totalUnit="Liters"
             >
               <div className="grid grid-cols-1 gap-4 mt-6">
                 <ResultCard title="In Gallons (US)" value={results.gallons} unit="gals" variant="neutral" />
               </div>
             </MaterialSummary>
        ) : (
          <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden group">
            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
            <div className="text-center text-slate-500 py-8">
              Enter wall/ceiling area and coats to calculate.
            </div>
          </div>
        )}
      </div>
      <div className="col-span-1 md:col-span-2">
        <CalculationHistory
          calculatorId="paint_calc_v1"
          currentInputs={{ area, coats, coverage, wastage }}
          onRestore={(ins) => {
            if (ins.area) setArea(ins.area);
            if (ins.coats) setCoats(ins.coats);
            if (ins.coverage) setCoverage(ins.coverage);
            if (ins.wastage) setWastage(ins.wastage);
          }}
        />
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

      <div className="flex flex-col h-full">
        {grossArea ? (
            <MaterialSummary
               title="Estimate Results"
               totalLabel="Net Printable / Plaster Area"
               totalValue={netArea > 0 ? netArea.toFixed(2) : "0"}
               totalUnit={uArea}
             >
               <div className="grid grid-cols-1 gap-4 mt-6">
                 <ResultCard title="Total Deductions" value={totalDeduction.toFixed(2)} unit={uArea} variant="warning" />
               </div>
             </MaterialSummary>
        ) : (
          <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#252834]/90 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden group">
            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">Estimate Results</h3>
            <div className="text-center text-slate-500 py-8">
              Enter gross area to calculate net dimensions.
            </div>
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
