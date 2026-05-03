import React, { useState, useMemo, useReducer } from 'react';
import { Home, Layers, PaintRoller, Sliders, LayoutDashboard, Settings, ChevronUp, ChevronDown, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMarketRates } from '../../context/MarketRatesContext';
import { useSettings } from '../../context/SettingsContext';
import ExportShareModal from './ExportShareModal';
import AdvancedSpecs, { SpecsState, initialSpecs } from './AdvancedSpecs';

type GeometryState = {
  plotSizeUnit: 'marla' | 'sqyd' | 'sqft';
  plotSizeValue: string;
  coveredAreaUnit: 'pct' | 'sqft' | 'sqm' | 'sqyd' | 'rooms';
  coveredAreaValue: string;
  roomHeight: string;
  stories: number;
  rooms: {
    bedrooms: number;
    washrooms: number;
    kitchens: number;
    drawingDining: number;
  };
  roomAreas: {
    bedrooms: string;
    washrooms: string;
    kitchens: string;
    drawingDining: string;
  };
  roomAreaUnit: 'sqft' | 'sqm' | 'sqyd';
};

type GeometryAction =
  | { type: 'SET_PLOT_SIZE_UNIT'; payload: 'marla' | 'sqyd' | 'sqft' }
  | { type: 'SET_PLOT_SIZE_VALUE'; payload: string }
  | { type: 'SET_COVERED_AREA_UNIT'; payload: 'pct' | 'sqft' | 'sqm' | 'sqyd' | 'rooms' }
  | { type: 'SET_COVERED_AREA_VALUE'; payload: string }
  | { type: 'SET_ROOM_HEIGHT'; payload: string }
  | { type: 'SET_STORIES'; payload: number }
  | { type: 'SET_ROOMS'; payload: Partial<GeometryState['rooms']> }
  | { type: 'INCREMENT_ROOM'; payload: keyof GeometryState['rooms'] }
  | { type: 'DECREMENT_ROOM'; payload: keyof GeometryState['rooms'] }
  | { type: 'SET_ROOM_AREA'; payload: { room: keyof GeometryState['roomAreas'], area: string } }
  | { type: 'SET_ROOM_AREA_UNIT'; payload: 'sqft' | 'sqm' | 'sqyd' };

const initialGeometry: GeometryState = {
  plotSizeUnit: 'marla',
  plotSizeValue: '5',
  coveredAreaUnit: 'pct',
  coveredAreaValue: '80',
  roomHeight: '10.5',
  stories: 2,
  rooms: {
    bedrooms: 3,
    washrooms: 3,
    kitchens: 1,
    drawingDining: 1,
  },
  roomAreas: {
    bedrooms: '150',
    washrooms: '45',
    kitchens: '100',
    drawingDining: '220',
  },
  roomAreaUnit: 'sqft'
};

function geometryReducer(state: GeometryState, action: GeometryAction): GeometryState {
  switch (action.type) {
    case 'SET_PLOT_SIZE_UNIT': return { ...state, plotSizeUnit: action.payload };
    case 'SET_PLOT_SIZE_VALUE': return { ...state, plotSizeValue: action.payload };
    case 'SET_COVERED_AREA_UNIT': return { ...state, coveredAreaUnit: action.payload };
    case 'SET_COVERED_AREA_VALUE': return { ...state, coveredAreaValue: action.payload };
    case 'SET_ROOM_HEIGHT': return { ...state, roomHeight: action.payload };
    case 'SET_STORIES': return { ...state, stories: action.payload };
    case 'SET_ROOMS': return { ...state, rooms: { ...state.rooms, ...action.payload } };
    case 'INCREMENT_ROOM': return { ...state, rooms: { ...state.rooms, [action.payload]: state.rooms[action.payload] + 1 } };
    case 'DECREMENT_ROOM': return { ...state, rooms: { ...state.rooms, [action.payload]: Math.max(0, state.rooms[action.payload] - 1) } };
    case 'SET_ROOM_AREA': return { ...state, roomAreas: { ...state.roomAreas, [action.payload.room]: action.payload.area } };
    case 'SET_ROOM_AREA_UNIT': return { ...state, roomAreaUnit: action.payload };
    default: return state;
  }
}

export default function HouseEstimator() {
  const { rates } = useMarketRates();
  const { formatCurrency, settings } = useSettings();
  const [geoState, dispatch] = useReducer(geometryReducer, initialGeometry);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [specs, setSpecs] = useState<SpecsState>(initialSpecs);
  const [isSpecsAccordionOpen, setIsSpecsAccordionOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'grey' | 'finishing' | 'summary'>('summary');
  const [finishQuality, setFinishQuality] = useState<number>(1); // 1: Standard, 2: Premium, 3: Luxury
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const plotAreaSqft = useMemo(() => {
    const val = parseFloat(geoState.plotSizeValue) || 0;
    if (geoState.plotSizeUnit === 'marla') return val * 225;
    if (geoState.plotSizeUnit === 'sqyd') return val * 9;
    return val;
  }, [geoState.plotSizeUnit, geoState.plotSizeValue]);

  const coveredAreaSqft = useMemo(() => {
    if (geoState.coveredAreaUnit === 'pct') {
      const pct = parseFloat(geoState.coveredAreaValue) || 0;
      return plotAreaSqft * (pct / 100);
    } else if (geoState.coveredAreaUnit === 'rooms') {
      let multiplier = 1;
      if (geoState.roomAreaUnit === 'sqm') multiplier = 10.7639;
      if (geoState.roomAreaUnit === 'sqyd') multiplier = 9;
      
      // Sum the areas of all rooms, and add 25% for circulation (corridors, walls, stairs)
      const sum = (geoState.rooms.bedrooms * (parseFloat(geoState.roomAreas.bedrooms) || 0)) +
                  (geoState.rooms.washrooms * (parseFloat(geoState.roomAreas.washrooms) || 0)) +
                  (geoState.rooms.kitchens * (parseFloat(geoState.roomAreas.kitchens) || 0)) +
                  (geoState.rooms.drawingDining * (parseFloat(geoState.roomAreas.drawingDining) || 0));
      // Return total covered area per floor roughly (assuming rooms are spread across stories, returning total but then divided by stories as this represents floor area, wait: builtUpArea is coveredAreaSqft * stories).
      // Let's divide by stories to get the average footprint per floor.
      return Math.max(0, (sum * multiplier * 1.25) / geoState.stories);
    }
    const val = parseFloat(geoState.coveredAreaValue) || 0;
    if (geoState.coveredAreaUnit === 'sqm') return val * 10.7639;
    if (geoState.coveredAreaUnit === 'sqyd') return val * 9;
    
    return val;
  }, [geoState.coveredAreaUnit, geoState.coveredAreaValue, geoState.rooms, geoState.roomAreas, geoState.roomAreaUnit, geoState.stories, plotAreaSqft]);

  const builtUpArea = coveredAreaSqft * geoState.stories;

    const estimates = useMemo(() => {
    const stories = geoState.stories;
    const roomHeight = parseFloat(geoState.roomHeight) || 10.5;
    
    // Step 1: Generate Standard Assumptions
    const totalWallLength = coveredAreaSqft * 0.15;
    const wallThickness = 0.75; // 9 inches
    const slabThickness = 0.5; // 6 inches
    const foundationDepth = 3; 
    const foundationWidth = 3;
    const openingDeduction = 0.85;

    // Step 2: Apply Exact Formulas
    // 1. Excavation
    const excavationVolumeCft = totalWallLength * foundationWidth * foundationDepth;
    
    // 2. Brickwork
    const totalHeight = (roomHeight * stories) + foundationDepth;
    const brickworkVolume = totalWallLength * totalHeight * wallThickness * openingDeduction;
    const totalBricksNos = Math.ceil(brickworkVolume * 13.5);
    
    const brickworkDryMortar = brickworkVolume * 0.3;
    const cementBw = (1/5) * brickworkDryMortar;
    const sandBw = (4/5) * brickworkDryMortar;
    
    // 3. RCC
    const slabVolume = coveredAreaSqft * slabThickness * stories;
    const rcWetVolume = slabVolume * 1.25; // Slab + 25% for beams/columns
    const rccDryVolume = rcWetVolume * 1.54;
    
    const cementRcc = (1/7) * rccDryVolume;
    const sandRcc = (2/7) * rccDryVolume;
    const crushRcc = (4/7) * rccDryVolume;
    
    // 4. Steel
    const steelKgResult = rcWetVolume * 0.015 * 222.2;
    const steelMetricTons = steelKgResult / 1000;
    
    // 5. Plastering
    const plasterArea = totalWallLength * (roomHeight * stories) * 2 * openingDeduction;
    const plasterWetVol = plasterArea * (0.5 / 12);
    const plasterDryVol = plasterWetVol * 1.27;
    const cementPlaster = (1/5) * plasterDryVol;
    const sandPlaster = (4/5) * plasterDryVol;
    
    // Totals
    const cementBagsTotal = Math.ceil((cementBw + cementRcc + cementPlaster) / 1.25);
    const sandCftTotal = Math.ceil(sandBw + sandRcc + sandPlaster);
    const crushCftTotal = Math.ceil(crushRcc);
    const steelKg = Math.ceil(steelKgResult);
    const bricksCount = totalBricksNos;

    // Grey Structure Costs
    const costCement = cementBagsTotal * rates.cement;
    const costSteel = steelKg * rates.steel;
    const costBricks = bricksCount * rates.bricks;
    const costSand = sandCftTotal * rates.sand;
    const costCrush = crushCftTotal * rates.crush;
    const costLabor = builtUpArea * rates.laborGrey;
    
    const totalGrey = costCement + costSteel + costBricks + costSand + costCrush + costLabor;

    // Finishing Costs Multiplier
    const qualityMultiplier = finishQuality === 1 ? 1 : finishQuality === 2 ? 1.6 : 2.5;
    const finishRate = rates.laborFinish * qualityMultiplier;
    
    const baseMepPct = 0.20;
    const extraWashrooms = Math.max(0, geoState.rooms.washrooms - geoState.rooms.bedrooms);
    const mepMultiplier = 1 + (extraWashrooms * 0.05) + (geoState.rooms.kitchens * 0.05);

    const costTiles = builtUpArea * (finishRate * 0.35); // 35% of finishing
    const costPaint = builtUpArea * (finishRate * 0.20); // 20%
    const costWoodwork = builtUpArea * (finishRate * 0.25) * (1 + geoState.rooms.bedrooms * 0.02); // 25% + bonus for bedrooms
    const costMep = builtUpArea * (finishRate * baseMepPct) * mepMultiplier; 

    const totalFinishing = costTiles + costPaint + costWoodwork + costMep;

    return {
      cementBags: cementBagsTotal, 
      steelKg: steelKg, 
      bricksCount: bricksCount, 
      sandCft: sandCftTotal, 
      crushCft: crushCftTotal,
      excavationCft: Math.ceil(excavationVolumeCft),
      steelTons: steelMetricTons,

      costCement, costSteel, costBricks, costSand, costCrush, costLabor, totalGrey,
      costTiles, costPaint, costWoodwork, costMep, totalFinishing,
      totalCost: totalGrey + totalFinishing
    };
  }, [coveredAreaSqft, builtUpArea, finishQuality, rates, geoState]);

  const greyCostData = [
    { name: 'Cement', value: estimates.costCement, color: '#94a3b8' },
    { name: 'Steel', value: estimates.costSteel, color: '#334155' },
    { name: 'Bricks', value: estimates.costBricks, color: '#b91c1c' },
    { name: 'Sand', value: estimates.costSand, color: '#fcd34d' },
    { name: 'Crush', value: estimates.costCrush, color: '#a3a3a3' },
    { name: 'Labor', value: estimates.costLabor, color: '#0369a1' },
  ];

  const finishingCostData = [
    { name: 'Tiles & Floor', value: estimates.costTiles, color: '#0ea5e9' },
    { name: 'Paint & Ceiling', value: estimates.costPaint, color: '#ec4899' },
    { name: 'Woodwork', value: estimates.costWoodwork, color: '#8b5cf6' },
    { name: 'Electric & Plumbing', value: estimates.costMep, color: '#10b981' },
  ];

  const summaryData = [
    { name: 'Grey Structure', value: estimates.totalGrey, color: '#64748b' },
    { name: 'Finishing Works', value: estimates.totalFinishing, color: '#8b5cf6' },
  ];

  const getQualityLabel = (val: number) => {
    switch(val) {
      case 1: return 'Standard';
      case 2: return 'Premium';
      case 3: return 'Luxury';
      default: return 'Standard';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#f8fafc] text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent pb-2">
              Complete House Estimator
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              Precise civil engineering estimations for grey structure and finishing works.
            </p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Built-up</span>
            <span className="text-2xl font-black text-indigo-600 tracking-tighter">{builtUpArea.toFixed(0)} <span className="text-sm font-medium text-indigo-400">sq.ft</span></span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Controls Overlay */}
          <section className="lg:col-span-4 space-y-6">
            {/* Plot & Geometry Accordion */}
            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Home className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Plot & Geometry</h2>
                </div>
                <div className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  {isAccordionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Basic View (when closed) */}
              {!isAccordionOpen && (
                <div className="space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Plot Size</span>
                    <span className="font-bold text-slate-800">{geoState.plotSizeValue} {geoState.plotSizeUnit.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Covered Area</span>
                    <span className="font-bold text-slate-800">
                      {geoState.coveredAreaUnit === 'rooms' 
                        ? `${coveredAreaSqft.toFixed(0)} Sq.Ft/fl` 
                        : `${geoState.coveredAreaValue} ${geoState.coveredAreaUnit === 'pct' ? '%' : geoState.coveredAreaUnit === 'sqm' ? 'Sq.M' : geoState.coveredAreaUnit === 'sqyd' ? 'Sq.Yd' : 'Sq.Ft'}/fl`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Stories</span>
                    <span className="font-bold text-slate-800">{geoState.stories}</span>
                  </div>
                  <button onClick={() => setIsAccordionOpen(true)} className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors">
                    Edit Detailed Geometry
                  </button>
                </div>
              )}

              {/* Detailed View (when open) */}
              {isAccordionOpen && (
                <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plot Size</label>
                      <input type="number" value={geoState.plotSizeValue} onChange={(e) => dispatch({ type: 'SET_PLOT_SIZE_VALUE', payload: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unit</label>
                      <select value={geoState.plotSizeUnit} onChange={(e) => dispatch({ type: 'SET_PLOT_SIZE_UNIT', payload: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium appearance-none">
                        <option value="marla">Marla</option>
                        <option value="sqyd">Sq.Yd</option>
                        <option value="sqft">Sq.Ft</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={geoState.coveredAreaUnit === 'rooms' ? 'opacity-50 pointer-events-none' : ''}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Covered / Floor</label>
                      <input type="number" value={geoState.coveredAreaValue} onChange={(e) => dispatch({ type: 'SET_COVERED_AREA_VALUE', payload: e.target.value })} disabled={geoState.coveredAreaUnit === 'rooms'} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium disabled:bg-slate-100 disabled:text-slate-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Area Type</label>
                      <select value={geoState.coveredAreaUnit} onChange={(e) => dispatch({ type: 'SET_COVERED_AREA_UNIT', payload: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium appearance-none">
                        <option value="pct">% of Plot</option>
                        <option value="sqft">Fixed Sq.Ft</option>
                        <option value="sqm">Fixed Sq.M</option>
                        <option value="sqyd">Fixed Sq.Yd</option>
                        <option value="rooms">From Rooms</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stories</label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => dispatch({ type: 'SET_STORIES', payload: Math.max(1, geoState.stories - 1) })} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center">-</button>
                        <span className="font-bold text-lg w-6 text-center">{geoState.stories}</span>
                        <button onClick={() => dispatch({ type: 'SET_STORIES', payload: geoState.stories + 1 })} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Room Ht (ft)</label>
                      <input type="number" step="0.5" value={geoState.roomHeight} onChange={(e) => dispatch({ type: 'SET_ROOM_HEIGHT', payload: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-600">Room Configuration</h3>
                      <select 
                        value={geoState.roomAreaUnit} 
                        onChange={(e) => dispatch({ type: 'SET_ROOM_AREA_UNIT', payload: e.target.value as any })}
                        className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="sqft">Sq.Ft</option>
                        <option value="sqm">Sq.M</option>
                        <option value="sqyd">Sq.Yd</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      {(Object.keys(geoState.rooms) as Array<keyof GeometryState['rooms']>).map((room) => (
                        <div key={room} className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{room.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 w-[5.5rem]">
                              <button onClick={() => dispatch({ type: 'DECREMENT_ROOM', payload: room })} className="w-7 h-7 rounded text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center">-</button>
                              <span className="font-bold text-sm flex-1 text-center">{geoState.rooms[room]}</span>
                              <button onClick={() => dispatch({ type: 'INCREMENT_ROOM', payload: room })} className="w-7 h-7 rounded text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center">+</button>
                            </div>
                            <div className="flex-1 relative">
                              <input 
                                type="number" 
                                value={geoState.roomAreas[room]} 
                                onChange={(e) => dispatch({ type: 'SET_ROOM_AREA', payload: { room, area: e.target.value } })}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm pr-10" 
                                placeholder="Area"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                                {geoState.roomAreaUnit === 'sqft' ? 'sf' : geoState.roomAreaUnit === 'sqm' ? 'm²' : 'yd²'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {geoState.coveredAreaUnit === 'rooms' && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 mt-2">
                        <p className="text-xs text-blue-600 font-medium leading-relaxed">
                          * Covered area is being calculated dynamically from room sizes plus +25% factor for circulation, stairs, and walls.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <div className="bg-white/80 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                  <Sliders className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Finish Quality</h2>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-black text-violet-600 tracking-tighter">{getQualityLabel(finishQuality)}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">x{finishQuality === 1 ? '1.0' : finishQuality === 2 ? '1.6' : '2.5'} Multiplier</span>
                 </div>
                 <input type="range" min="1" max="3" step="1" value={finishQuality} onChange={(e) => setFinishQuality(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600" />
                 <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-2">
                    <span>Std</span>
                    <span>Prem</span>
                    <span>Lux</span>
                 </div>
              </div>
            </div>

            <AdvancedSpecs specs={specs} setSpecs={setSpecs} isOpen={isSpecsAccordionOpen} setIsOpen={setIsSpecsAccordionOpen} />
          </section>

          {/* Results Area */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Custom Segmented Control */}
            <div className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-1.5 bg-white border border-slate-200 shadow-sm rounded-2xl w-full sm:w-fit relative">
              <button onClick={() => setActiveTab('summary')} className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                <LayoutDashboard className="w-[18px] h-[18px]" /> <span className="whitespace-nowrap">Summary</span>
              </button>
              <button onClick={() => setActiveTab('grey')} className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'grey' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                <Layers className="w-[18px] h-[18px]" /> <span className="whitespace-nowrap">Grey Structure</span>
              </button>
              <button onClick={() => setActiveTab('finishing')} className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'finishing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                <PaintRoller className="w-[18px] h-[18px]" /> <span className="whitespace-nowrap">Finishing</span>
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden transition-all duration-300">
               
               {activeTab === 'summary' && (
                 <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
                   <h3 className="text-xl font-bold text-slate-800 mb-6">Total Project Estimate</h3>
                   <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-1">
                     
                     <div className="w-full md:w-1/2 h-64 relative" id="export-chart-target">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie data={summaryData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" animationDuration={1000}>
                             {summaryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                           </Pie>
                           <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                         </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total</span>
                          <span className="text-lg font-black text-slate-800">{formatCurrency(estimates.totalCost)}</span>
                       </div>
                     </div>
                     
                     <div className="w-full md:w-1/2 space-y-6">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative overflow-hidden group flex flex-col justify-center min-w-0">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500" />
                          <div className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-1 pl-2 truncate">Grey Structure</div>
                          <div className="text-xl sm:text-2xl font-black text-slate-800 pl-2 truncate" title={formatCurrency(estimates.totalGrey)}>{formatCurrency(estimates.totalGrey)}</div>
                          <div className="text-slate-400 text-xs md:text-sm font-medium mt-1 pl-2 truncate">Foundation, Framing, Masonry</div>
                        </div>
                        <div className="bg-violet-50 p-5 rounded-2xl border border-violet-100 relative overflow-hidden flex flex-col justify-center min-w-0">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                          <div className="text-violet-600 text-xs md:text-sm font-bold uppercase tracking-widest mb-1 pl-2 truncate">Finishing Works</div>
                          <div className="text-xl sm:text-2xl font-black text-violet-800 pl-2 truncate" title={formatCurrency(estimates.totalFinishing)}>{formatCurrency(estimates.totalFinishing)}</div>
                          <div className="text-violet-500/80 text-xs md:text-sm font-medium mt-1 pl-2 truncate">{getQualityLabel(finishQuality)} Grade Finishing</div>
                        </div>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === 'grey' && (
                 <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                     <h3 className="text-xl font-bold text-slate-800">Grey Structure Breakdown</h3>
                     <div className="text-2xl font-black text-indigo-600 tracking-tighter bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-100">
                       {formatCurrency(estimates.totalGrey)}
                     </div>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center min-w-0">
                        <div className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate" title={estimates.cementBags.toFixed(0)}>{estimates.cementBags.toFixed(0)} <span className="text-xs font-normal">bags</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">Cement</div>
                        <div className="text-sm font-bold text-indigo-600 mt-2">{formatCurrency(estimates.costCement)}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center min-w-0">
                        <div className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate" title={(estimates.steelKg / 1000).toFixed(1)}>{(estimates.steelKg / 1000).toFixed(1)} <span className="text-xs font-normal">tons</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">Steel</div>
                        <div className="text-sm font-bold text-indigo-600 mt-2">{formatCurrency(estimates.costSteel)}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center min-w-0">
                        <div className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate" title={`${(estimates.bricksCount / 1000).toFixed(0)}k`}>{(estimates.bricksCount / 1000).toFixed(0)}k <span className="text-xs font-normal">qty</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">Bricks</div>
                        <div className="text-sm font-bold text-indigo-600 mt-2">{formatCurrency(estimates.costBricks)}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center min-w-0">
                        <div className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate" title={estimates.sandCft.toFixed(0)}>{estimates.sandCft.toFixed(0)} <span className="text-xs font-normal">cft</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">Sand</div>
                        <div className="text-sm font-bold text-indigo-600 mt-2">{formatCurrency(estimates.costSand)}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center min-w-0 md:col-span-1 col-span-2">
                        <div className="text-xl sm:text-2xl font-black text-slate-600 tracking-tighter truncate" title={estimates.crushCft.toFixed(0)}>{estimates.crushCft.toFixed(0)} <span className="text-xs font-normal">cft</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">Crush</div>
                        <div className="text-sm font-bold text-indigo-600 mt-2">{formatCurrency(estimates.costCrush)}</div>
                     </div>
                   </div>

                                      <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Detailed Exact BOQ</h3>
                   <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mb-8">
                     <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs tracking-wider">
                         <tr>
                           <th className="px-6 py-4 font-bold">Item Description</th>
                           <th className="px-6 py-4 font-bold text-right">Exact Quantity</th>
                           <th className="px-6 py-4 font-bold text-right">Unit</th>
                         </tr>
                       </thead>
                       <tbody className="text-slate-800 divide-y divide-slate-100">
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Total Bricks</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.bricksCount.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Nos</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Cement (50Kg Bags)</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.cementBags.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Bags</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Sand</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.sandCft.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Cubic Feet</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Crush / Aggregate</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.crushCft.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Cubic Feet</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Steel Reinforcement</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.steelTons.toFixed(3)}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Metric Tons</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Excavation Volume</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.excavationCft.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Cubic Feet</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>

                   <div className="flex-1 min-h-[250px] w-full relative mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={greyCostData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 600}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} tickFormatter={(val) => `${settings.currency === "PKR" ? "RS" : settings.currency} ${(val / 1000).toFixed(0)}k`} />
                         <Tooltip 
                           cursor={{fill: '#F8FAFC'}} 
                           contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }} 
                           formatter={(value: number) => formatCurrency(value)} 
                         />
                         <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                           {greyCostData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </div>
               )}

               {activeTab === 'finishing' && (
                 <div className="animate-in fade-in slide-in-from-left-8 duration-500 h-full flex flex-col">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                     <h3 className="text-xl font-bold text-slate-800">Finishing Breakdown</h3>
                     <div className="text-2xl font-black text-violet-600 tracking-tighter bg-violet-50 px-4 py-1.5 rounded-xl border border-violet-100">
                       {formatCurrency(estimates.totalFinishing)}
                     </div>
                   </div>
                   <p className="text-sm font-medium text-violet-500 mb-6">Based on {getQualityLabel(finishQuality)} Grade settings ({specs.flooringType}, {specs.wardrobeMaterial})</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start mb-8">
                      {finishingCostData.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: item.color }} />
                           <div className="flex justify-between items-start pl-2 min-w-0">
                             <div className="min-w-0 flex-1 pr-2">
                                <div className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate" title={formatCurrency(item.value)}>{formatCurrency(item.value)}</div>
                                <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-400 mt-1 truncate">{item.name}</div>
                             </div>
                             <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-20 shrink-0" style={{ backgroundColor: item.color }}>
                               <Settings className="w-5 h-5 mix-blend-multiply" style={{ color: item.color }} />
                             </div>
                           </div>
                        </div>
                      ))}
                   </div>

                                      <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Detailed Exact BOQ</h3>
                   <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mb-8">
                     <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs tracking-wider">
                         <tr>
                           <th className="px-6 py-4 font-bold">Item Description</th>
                           <th className="px-6 py-4 font-bold text-right">Exact Quantity</th>
                           <th className="px-6 py-4 font-bold text-right">Unit</th>
                         </tr>
                       </thead>
                       <tbody className="text-slate-800 divide-y divide-slate-100">
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Total Bricks</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.bricksCount.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Nos</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Cement (50Kg Bags)</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.cementBags.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Bags</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Sand</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.sandCft.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Cubic Feet</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Crush / Aggregate</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.crushCft.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Cubic Feet</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Steel Reinforcement</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.steelTons.toFixed(3)}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Metric Tons</td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium">Excavation Volume</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{estimates.excavationCft.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right text-slate-500 text-xs">Cubic Feet</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>

                   <div className="flex-1 min-h-[250px] w-full relative mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={finishingCostData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 600}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} tickFormatter={(val) => `${settings.currency === "PKR" ? "RS" : settings.currency} ${(val / 1000).toFixed(0)}k`} />
                         <Tooltip 
                           cursor={{fill: '#F8FAFC'}} 
                           contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }} 
                           formatter={(value: number) => formatCurrency(value)} 
                         />
                         <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                           {finishingCostData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </div>
               )}

            </div>

          </section>

        </div>
      </div>

      {/* Floating Share Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl shadow-indigo-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-indigo-600/20"
        >
          <Share2 className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <ExportShareModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        estimates={estimates}
        geoState={geoState}
        plotAreaSqft={plotAreaSqft}
        builtUpArea={builtUpArea}
        finishQuality={finishQuality}
        greyCostData={greyCostData}
        finishingCostData={finishingCostData}
        summaryData={summaryData}
      />
    </div>
  );
}
