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
        <div className="p-2 bg-amber-50 text-amber-600 rounded-[16px]">
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
        

        <div className="space-y-4">
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="tiles" title="Tiles & Flooring Calculator" icon={LayoutGrid} />
            {openSections["tiles"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <TilesCalculator />
               </div>
            )}
          </div>
          
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
            <AccordionHeader id="paint" title="Paint Calculator" icon={Paintbrush} />
            {openSections["paint"] && (
               <div className="p-6 md:p-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <PaintCalculator />
               </div>
            )}
          </div>

          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden transition-all">
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
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
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
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
           <InputGroup label={`Tile Length (${isSI ? 'mm' : 'in'})`}>
            <input
              type="number"
              min="1"
              value={tileLength}
              onChange={(e) => setTileLength(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
        </div>
        
        <InputGroup label="Tiles per Box">
            <input
              type="number"
              min="1"
              value={tilesPerBox}
              onChange={(e) => setTilesPerBox(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
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
            <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 [#252834]/90 backdrop-blur-md border border-slate-200/60 shadow-sm [0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden group">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-400 bg-clip-text text-transparent">Estimate Results</h3>
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
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
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
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
           <InputGroup label="Wastage (%)">
            <input
              type="number"
              min="0"
              value={wastage}
              onChange={(e) => setWastage(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </InputGroup>
        </div>
        
         <InputGroup label={`Coverage (${isSI ? 'm²/Liter' : 'sqft/Gallon'})`}>
            <input
              type="number"
              min="1"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
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
          <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 [#252834]/90 backdrop-blur-md border border-slate-200/60 shadow-sm [0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden group">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Estimate Results</h3>
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
  const uLen = isSI ? "m" : "ft";
  const uArea = isSI ? "m²" : "sq.ft";

  const [wallLength, setWallLength] = useState<number | "">(isSI ? 5 : 16);
  const [wallHeight, setWallHeight] = useState<number | "">(isSI ? 3 : 10);
  const [deductions, setDeductions] = useState<{name: string, w: number, h: number, qty: number}[]>([
    { name: "Door", w: isSI ? 0.9 : 3, h: isSI ? 2.1 : 7, qty: 1 }
  ]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...deductions];
    (newItems[index] as any)[field] = value ? Number(value) : "";
    setDeductions(newItems);
  };

  const addItem = () => setDeductions([...deductions, { name: "Window", w: isSI ? 1 : 3, h: isSI ? 1.2 : 4, qty: 1 }]);
  const removeItem = (index: number) => setDeductions(deductions.filter((_, i) => i !== index));

  const grossArea = Number(wallLength) * Number(wallHeight);
  const totalDeduction = deductions.reduce((sum, item) => sum + (item.w * item.h * item.qty), 0);
  const netArea = grossArea - totalDeduction;

  const renderPreview = () => {
    if (!wallLength || !wallHeight) return null;
    const wl = Number(wallLength);
    const wh = Number(wallHeight);
    if (wl <= 0 || wh <= 0) return null;

    const displayRatio = Math.min(Math.max(wl / wh, 0.5), 5); // Constrain for UI sanity

    let currentX = 0; // Simple auto-layout from left to right

    return (
      <div className="mt-8 p-5 bg-slate-50/50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-200 rounded-[24px]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-700">Proportional Preview</h4>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-bg-card shadow-sm px-2 py-1 rounded-[16px]">
            {wl}{uLen} × {wh}{uLen}
          </span>
        </div>
        
        <div 
          className="relative w-full mx-auto bg-white [#1A1C24] border-2 border-indigo-200 overflow-hidden rounded-[16px] shadow-sm" 
          style={{ aspectRatio: displayRatio }}
        >
          {/* Wall Grid Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #6366f1 1px, transparent 1px), linear-gradient(180deg, #6366f1 1px, transparent 1px)', backgroundSize: 'min(5%, 20px) min(5%, 20px)' }}></div>
          
          {deductions.flatMap((op, oIdx) => {
            return Array.from({ length: Number(op.qty) || 0 }).map((_, qIdx) => {
               const isDoor = op.name.toLowerCase().includes("door");
               const opW = Number(op.w) || 0;
               const opH = Number(op.h) || 0;
               
               const maxW = Math.min(opW, wl);
               const maxH = Math.min(opH, wh);

               if (maxW <= 0 || maxH <= 0) return null;

               const pctW = (maxW / wl) * 100;
               const pctH = (maxH / wh) * 100;
               
               // Next position
               const xPos = currentX;
               currentX += maxW + (wl * 0.05); // add 5% gap
               if (currentX > wl - maxW) currentX = 0; // wrap to beginning if it exceeds

               const leftPct = (xPos / wl) * 100;

               return (
                 <div
                   key={`${oIdx}-${qIdx}`}
                   className="absolute bg-rose-500/10 backdrop-blur-md border-2 border-rose-400 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                   style={{
                     width: `${pctW}%`,
                     height: `${pctH}%`,
                     left: `${leftPct}%`,
                     bottom: isDoor ? '0' : `calc(50% - ${pctH / 2}%)`,
                   }}
                 >
                   <div className="bg-white/90 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 rounded px-1.5 py-0.5">
                     <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 truncate whitespace-nowrap">
                       {op.name}
                     </span>
                   </div>
                 </div>
               );
            });
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label={`Wall Length (${uLen})`}>
            <input
              type="number"
              min="0"
              value={wallLength}
              onChange={(e) => setWallLength(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. 5"
            />
          </InputGroup>
          <InputGroup label={`Wall Height (${uLen})`}>
            <input
              type="number"
              min="0"
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[24px] px-4 text-slate-800 font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. 3"
            />
          </InputGroup>
        </div>

        <div className="space-y-3 pt-4 border-t border-border-color">
          <label className="text-sm font-bold text-slate-700">Openings / Deductions</label>
          <div className="space-y-2">
            {deductions.map((item, index) => (
              <div key={index} className="flex gap-2 items-center bg-white border border-border-color p-2 rounded-[24px]">
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => {
                    const newItems = [...deductions];
                    newItems[index].name = e.target.value;
                    setDeductions(newItems);
                  }}
                  className="w-24 px-2 py-1.5 text-sm bg-bg-card border border-slate-200 rounded outline-none font-medium text-slate-700" 
                />
                <input type="number" placeholder="W" value={item.w || ""} onChange={(e) => updateItem(index, 'w', e.target.value)} className="w-16 px-2 py-1.5 text-sm bg-bg-card border border-slate-200 rounded outline-none font-medium text-slate-700" />
                <input type="number" placeholder="H" value={item.h || ""} onChange={(e) => updateItem(index, 'h', e.target.value)} className="w-16 px-2 py-1.5 text-sm bg-bg-card border border-slate-200 rounded outline-none font-medium text-slate-700" />
                <input type="number" placeholder="Qty" value={item.qty || ""} onChange={(e) => updateItem(index, 'qty', e.target.value)} className="w-16 px-2 py-1.5 text-sm bg-bg-card border border-slate-200 rounded outline-none font-medium text-slate-700" />
                <button onClick={() => removeItem(index)} className="p-1.5 px-2.5 text-rose-500 hover:bg-rose-50 rounded transition-colors ml-auto mr-1"><span className="font-bold">X</span></button>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="text-sm font-bold text-amber-600 hover:text-amber-700 mt-2 inline-flex items-center gap-1">+ Add Opening</button>
        </div>
      </div>

      <div className="flex flex-col h-full">
        {grossArea > 0 ? (
          <>
            <MaterialSummary
               title="Estimate Results"
               totalLabel="Net Printable / Plaster Area"
               totalValue={netArea > 0 ? netArea.toFixed(2) : "0"}
               totalUnit={uArea}
             >
               <div className="grid grid-cols-1 gap-4 mt-6">
                 <ResultCard title="Total Deductions" value={totalDeduction.toFixed(2)} unit={uArea} variant="warning" />
                 <ResultCard title="Gross Wall Area (No Deductions)" value={grossArea.toFixed(2)} unit={uArea} variant="neutral" />
               </div>
             </MaterialSummary>
             
             {/* 2D Canvas Preview */}
             {renderPreview()}
          </>
        ) : (
          <div className="relative p-5 sm:p-6 rounded-[24px] bg-white/80 [#252834]/90 backdrop-blur-md border border-slate-200/60 shadow-sm [0_4px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden group h-full justify-center">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-2 text-center bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Estimate Results</h3>
            <div className="text-center text-slate-500 py-8">
              Enter wall dimensions to calculate net area and see the proportional preview.
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
