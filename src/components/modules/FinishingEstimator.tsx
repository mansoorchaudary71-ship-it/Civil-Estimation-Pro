import React, { useState, useMemo } from 'react';
import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';
import { PaintBucket, CheckSquare, Maximize, MinusCircle, Plus, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMarketRates } from '../../context/MarketRatesContext';
import { useSettings } from '../../context/SettingsContext';
import ShareButtonWithPopup from './ShareMenu';

interface Deduction {
  id: string;
  name: string;
  area: number;
}

export default function FinishingEstimator() {
  const { formatCurrency } = useSettings();
  const { rates } = useMarketRates();
  const [totalArea, setTotalArea] = useState<string>('200'); // sqm
  
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: '1', name: 'Door', area: 2.1 },
    { id: '2', name: 'Window', area: 1.44 }
  ]);
  const [newDeductionName, setNewDeductionName] = useState('Window');
  const [newDeductionArea, setNewDeductionArea] = useState('1.5');

  // Plaster inputs
  const [plasterThickness, setPlasterThickness] = useState<string>('12'); // mm
  const [mortarRatio, setMortarRatio] = useState<string>('4'); // 1:4

  // Tile inputs
  const [tileWidth, setTileWidth] = useState<string>('600'); // mm
  const [tileLength, setTileLength] = useState<string>('600'); // mm
  const [tilesPerBox, setTilesPerBox] = useState<string>('4'); // pcs

  // Paint inputs
  const [paintCoverage, setPaintCoverage] = useState<string>('12'); // sqm per liter

  const addDeduction = () => {
    if (parseFloat(newDeductionArea) > 0) {
      setDeductions([...deductions, { 
        id: Math.random().toString(36).substr(2, 9), 
        name: newDeductionName || 'Deduction', 
        area: parseFloat(newDeductionArea) 
      }]);
      setNewDeductionName('');
      setNewDeductionArea('');
    }
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const calcNetArea = () => {
    const total = parseFloat(totalArea) || 0;
    const ded = deductions.reduce((acc, curr) => acc + (curr.area || 0), 0);
    return Math.max(0, total - ded);
  };

  const results = useMemo(() => {
    const netArea = calcNetArea();

    // Plaster Work
    const pThickness = parseFloat(plasterThickness) || 12; // mm
    const mRatio = parseFloat(mortarRatio) || 4; // 1:mRatio
    const wetVolumeOption = (netArea * pThickness) / 1000; // m3
    const dryVolume = wetVolumeOption * 1.33; // 33% extra for mortar
    const cementVolume = dryVolume / (1 + mRatio);
    const cementBags = Math.ceil((cementVolume * 1440) / 50); // 1440 kg/m3 density of cement, 50kg/bag
    const sandVolumeCft = cementVolume * mRatio * 35.3147; 

    // Tile Work
    const tW = parseFloat(tileWidth) || 600;
    const tL = parseFloat(tileLength) || 600;
    const tpb = parseFloat(tilesPerBox) || 4;
    const tileArea = (tW * tL) / 1000000; // m2
    const totalTileAreaReq = netArea * 1.05; // 5% wastage
    const numTiles = tileArea > 0 ? totalTileAreaReq / tileArea : 0;
    const boxesReq = tpb > 0 ? Math.ceil(numTiles / tpb) : 0;

    // Paint Work
    const pc = parseFloat(paintCoverage) || 12;
    const paintLiters = netArea / pc;

    return {
      netArea,
      cementBags,
      sandVolumeCft: sandVolumeCft.toFixed(2),
      boxesReq,
      paintLiters: paintLiters.toFixed(2),
    };
  }, [totalArea, deductions, plasterThickness, mortarRatio, tileWidth, tileLength, tilesPerBox, paintCoverage]);

  const costData = useMemo(() => {
    const costCement = results.cementBags * rates.cement;
    const costSand = parseFloat(results.sandVolumeCft) * rates.sand;
    const costTiles = results.boxesReq * rates.tiles;
    const costPaint = parseFloat(results.paintLiters) * rates.paint;
    
    return [
      { name: 'Cement', qty: `${results.cementBags.toFixed(1)} Bags`, value: costCement, color: '#64748b' },
      { name: 'Sand', qty: `${results.sandVolumeCft} cft`, value: costSand, color: '#f59e0b' },
      { name: 'Tiles', qty: `${Math.ceil(results.boxesReq)} Boxes`, value: costTiles, color: '#0ea5e9' },
      { name: 'Paint', qty: `${results.paintLiters} L`, value: costPaint, color: '#ec4899' },
    ];
  }, [results, rates]);

  const totalCost = costData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-full overflow-y-auto bg-[#fafafa] text-gray-900 font-sans p-6 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent pb-2">
            Finishing Works Estimator
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            Calculate plaster, tile, and paint quantities with dynamic cost distributions.
          </p>
            <div className="mt-5 w-fit"><GlobalSettingsToggle /></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <section className="lg:col-span-7 space-y-6">

            {/* Base Dimensions & Deductions Container */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                  <Maximize className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-800">Space Dimensions</h2>
                  <p className="text-xs text-gray-500">Define base area and deductions</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Total Surface Area (m²)</label>
                <input 
                  type="number"
                  className="w-full bg-gray-50/50 border border-gray-200 focus:bg-white rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
                  value={totalArea}
                  onChange={e => setTotalArea(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-600">Deductions (Doors, Windows, etc.)</label>
                {deductions.map(d => (
                  <div key={d.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
                    <span className="font-medium text-gray-700">{d.name} <span className="text-gray-400 font-normal ml-2">{d.area} m²</span></span>
                    <button onClick={() => removeDeduction(d.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="E.g. Door"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    value={newDeductionName}
                    onChange={e => setNewDeductionName(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Area (m²)"
                    className="w-32 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    value={newDeductionArea}
                    onChange={e => setNewDeductionArea(e.target.value)}
                  />
                  <button onClick={addDeduction} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg transition-transform hover:scale-105">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-8 p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl flex justify-between items-center border border-indigo-500/20">
                <span className="text-indigo-800 font-bold">Net Operative Area</span>
                <span className="text-2xl font-black text-indigo-700 font-mono">{calcNetArea().toFixed(2)} m²</span>
              </div>
            </div>

            {/* Material Specific Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plaster Parameters */}
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/40">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">P</span>
                  Plaster Specs
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thickness (mm)</label>
                    <input type="number" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500/30" value={plasterThickness} onChange={e => setPlasterThickness(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mortar Ratio (1:X)</label>
                    <div className="flex bg-gray-50/50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-500/30">
                      <span className="px-4 py-3 bg-gray-100 text-gray-500 font-bold">1 :</span>
                      <input type="number" className="flex-1 bg-transparent px-4 py-3 focus:outline-none" value={mortarRatio} onChange={e => setMortarRatio(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tile & Paint Parameters */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/40">
                  <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-sky-500" />
                    Tiling Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Tile (W x L) mm</label>
                      <div className="flex gap-1">
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-center" value={tileWidth} onChange={e => setTileWidth(e.target.value)} />
                        <span className="text-gray-400 py-2">x</span>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-center" value={tileLength} onChange={e => setTileLength(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Pcs / Box</label>
                      <input type="number" className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" value={tilesPerBox} onChange={e => setTilesPerBox(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/40">
                  <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <PaintBucket className="w-5 h-5 text-pink-500" />
                    Paint Coverage
                  </h3>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Coverage (m² / Liter)</label>
                    <input type="number" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/30" value={paintCoverage} onChange={e => setPaintCoverage(e.target.value)} />
                  </div>
                </div>
              </div>

            </div>

          </section>

          {/* Visualization & Results Section */}
          <section className="lg:col-span-5 space-y-6">
            
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
               
               <div className="relative z-10 flex flex-col gap-6">
                 <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                   <PieChartIcon className="w-5 h-5" /> Cost Distribution
                 </h2>

                 <div className="h-64 cursor-pointer">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={costData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                         animationDuration={1500}
                         animationEasing="ease-out"
                       >
                         {costData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                         ))}
                       </Pie>
                       <Tooltip 
                         formatter={(value: number) => formatCurrency(value)}
                         contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                         itemStyle={{ color: '#fff', fontWeight: 600 }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>

                 <div className="space-y-3">
                   {costData.map((d, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                         <span className="text-gray-300 font-medium">{d.name} <span className="text-gray-500 ml-1">({d.qty})</span></span>
                       </div>
                       <span className="font-mono font-semibold">{formatCurrency(d.value)}</span>
                     </div>
                   ))}
                   <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-end">
                      <span className="text-gray-400 font-medium pb-1">Total Estimated Cost</span>
                      <span className="text-3xl font-black tracking-tight">{formatCurrency(totalCost)}</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Cement</div>
                 <div className="text-3xl font-black text-slate-700">{results.cementBags}</div>
                 <div className="text-slate-400 text-xs font-semibold mt-1">Bags (50kg)</div>
               </div>
               <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center">
                 <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Sand</div>
                 <div className="text-3xl font-black text-amber-600">{results.sandVolumeCft}</div>
                 <div className="text-amber-400/80 text-xs font-semibold mt-1">CFT</div>
               </div>
               <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute top-0 w-full h-1 bg-sky-400" />
                 <div className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-2">Tiles</div>
                 <div className="text-3xl font-black text-sky-600">{results.boxesReq}</div>
                 <div className="text-sky-400/80 text-xs font-semibold mt-1">Boxes</div>
               </div>
               <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute top-0 w-full h-1 bg-pink-400" />
                 <div className="text-pink-500 text-xs font-bold uppercase tracking-widest mb-2">Paint</div>
                 <div className="text-3xl font-black text-pink-600">{results.paintLiters}</div>
                 <div className="text-pink-400/80 text-xs font-semibold mt-1">Liters</div>
               </div>
            </div>

          </section>

        </div>
      </div>
      
      <ShareButtonWithPopup 
        activeTab="Finishing"
        data={costData.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.qty }), {} as Record<string, string>)}
        exportFormat={{
          inputs: {
            "Total Area": `${totalArea} m²`,
            "Net Area": `${results.netArea.toFixed(2)} m²`,
            "Plaster Settings": `${plasterThickness}mm at 1:${mortarRatio}`,
            "Tile Settings": `${tileWidth}x${tileLength}mm, ${tilesPerBox}/box`,
            "Paint Setting": `${paintCoverage} sqm/L`
          },
          breakdown: costData.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.qty }), {} as Record<string, string>),
          rates: rates,
        }}
        title="Finishing Works Estimator"
      />
    </div>
  );
}
