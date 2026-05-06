import React, { useState } from "react";
import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';
import { Copy, Droplet, Box, Hammer, PaintBucket, Scaling, ArrowRightLeft, Layers, Columns, Container, Spline, Calculator, Save } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { ConcreteMortarCalculator, BrickworkCalculator, PlasterCalculator, SteelCalculator } from "../../utils/calculators";
import ShareButtonWithPopup from "./ShareMenu";
import RccStructureCalculator from "./RccStructureCalculator";
import MasterQuantityEstimator from "./MasterQuantityEstimator";
import { saveEstimate } from "../../lib/estimates";
import { useAuth } from "../../contexts/AuthContext";

export default function ConstructionMaterialEstimator() {
  const { formatCurrency, settings } = useSettings();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  
  const isSI = settings.measurement === "SI";
  const unitFt = isSI ? "m" : "ft";
  const unitIn = isSI ? "cm" : "in";
  const unitVol = isSI ? "m³" : "cft";
  const unitArea = isSI ? "m²" : "sq.ft";

  const tabs = [
    { id: "concrete", label: "Concrete", icon: Box },
    { id: "bricks", label: "Bricks", icon: Columns },
    { id: "blocks", label: "Blocks", icon: Container },
    { id: "plaster", label: "Plaster", icon: PaintBucket },
    { id: "steel", label: "Steel", icon: Layers },
    { id: "rcc", label: "RCC Structure", icon: Spline },
    { id: "master", label: "Master Quantities", icon: Calculator },
    { id: "water", label: "Water", icon: Droplet },
  ] as const;
  
  const [showCost, setShowCost] = useState(false);
  const [rates, setRates] = useState({
    cement: 1200,
    sand: 60,
    aggregate: 80,
    water: 1,
    steel: 260,
    bricks: 15,
    blocks: 50
  });

  const fullTabs = [
    ...tabs,
    { id: "cement", label: "Cement", icon: Box },
    { id: "sand", label: "Sand", icon: Scaling },
  ] as const;
  
  type TabId = typeof fullTabs[number]["id"];
  const [activeTab, setActiveTab] = useState<TabId>("concrete");

  // Project Cart state
  interface CartItem {
    id: string;
    name: string;
    type: string;
    cementBags: number;
    sandVol: number;
    aggregateVol: number;
    waterLiters: number;
    steelKg?: number;
    bricksCount?: number;
    blocksCount?: number;
    unitVol: string;
    rawExport: Record<string, any>;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [elementName, setElementName] = useState<string>("");

  // Global inputs
  const [wastage, setWastage] = useState("5"); 

  // Concrete
  const [cLength, setCLength] = useState("10"); 
  const [cWidth, setCWidth] = useState("10"); 
  const [cDepth, setCDepth] = useState(isSI ? "0.15" : "0.5"); 
  const [cMix, setCMix] = useState("1:2:4"); 
  const [cWcRatio, setCWcRatio] = useState("0.5");
  
  // Bricks
  const [bWallL, setBWallL] = useState("20"); 
  const [bWallH, setBWallH] = useState("10"); 
  const [bWallT, setBWallT] = useState(isSI ? "22" : "9"); // cm or inches
  interface Opening {
    id: string;
    type: 'Door' | 'Window' | 'Ventilator';
    quantity: number;
    length: number;
    height: number;
  }
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [newOpening, setNewOpening] = useState<Omit<Opening, 'id'>>({ type: 'Door', quantity: 1, length: 0, height: 0 });
  
  const [brickL, setBrickL] = useState(isSI ? "22.8" : "9"); // cm or inches
  const [brickW, setBrickW] = useState(isSI ? "11.4" : "4.5"); 
  const [brickH, setBrickH] = useState(isSI ? "7.6" : "3"); 
  const [bJoint, setBJoint] = useState(isSI ? "1" : "0.39"); // cm or inches
  const [bMix, setBMix] = useState("1:4"); 

  // Blocks
  const [blockL, setBlockL] = useState(isSI ? "40" : "16"); // cm or inches
  const [blockW, setBlockW] = useState(isSI ? "20" : "8"); 
  const [blockH, setBlockH] = useState(isSI ? "20" : "8"); 
  const [blockJoint, setBlockJoint] = useState(isSI ? "1" : "0.39"); 

  // Plaster
  const [pArea, setPArea] = useState("200"); 
  const [pThick, setPThick] = useState(isSI ? "1.2" : "0.5"); // cm or in
  const [pMix, setPMix] = useState("1:4");
  
  // Steel
  const [sDia, setSDia] = useState("12"); // mm
  const [sSpan, setSSpan] = useState("10"); // m or ft
  const [sSpace, setSSpace] = useState("150"); // mm or inches
  const [sBarL, setSBarL] = useState(isSI ? "12" : "40"); // m or ft
  const [sOverlap, setSOverlap] = useState("50");

  // Water
  const [wCementKg, setWCementKg] = useState("50");
  const [wWcRatio, setWWcRatio] = useState("0.5");

  const parseNum = (val: string) => parseFloat(val) || 0;

  let content = null;
  let currentExportData: Record<string, any> = {};
  let currentExportInputs: Record<string, any> = {};
  let currentCartItem: Omit<CartItem, 'id' | 'name'> | null = null;

  if (activeTab === "concrete") {
    const calc = new ConcreteMortarCalculator(
      parseNum(cLength), parseNum(cWidth), parseNum(cDepth), cMix, parseNum(wastage), parseNum(cWcRatio), isSI
    );
    const res = calc.calculate();
    
    currentExportInputs = {
      "Dimensions": `Length: ${cLength} ${unitFt} | Width: ${cWidth} ${unitFt} | Depth: ${cDepth} ${unitFt}`,
      "Mix Ratio": cMix,
      "W/C Ratio": cWcRatio,
      "Wastage Allowed": `${wastage}%`
    };

    currentExportData = {
      "Concrete Mixed Volume": `${res.totalWetVolume.toFixed(2)} ${unitVol}`,
      [`Dry Volume (+${wastage}% waste)`]: `${(res.totalWetVolume * 1.54 * (1 + parseNum(wastage)/100)).toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`,
      "Aggregate Required": `${res.aggregateVol.toFixed(2)} ${unitVol}`,
      "Water Required": `${res.waterLiters.toFixed(1)} L`
    };
    
    currentCartItem = {
      type: "Concrete",
      cementBags: res.cementBags,
      sandVol: res.sandVol,
      aggregateVol: res.aggregateVol,
      waterLiters: res.waterLiters,
      unitVol,
      rawExport: currentExportData
    };
    
    content = (
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2">Concrete Slab / Footing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Length ({unitFt})</label>
              <input type="number" value={cLength} onChange={e => setCLength(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Width ({unitFt})</label>
              <input type="number" value={cWidth} onChange={e => setCWidth(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Depth ({unitFt})</label>
              <input type="number" value={cDepth} onChange={e => setCDepth(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-center h-32 relative text-[10px] font-bold text-blue-500/80">
             <svg viewBox="0 0 120 80" className="w-full h-full absolute inset-0 opacity-20 pointer-events-none">
                <path d="M30,50 L90,50 L105,30 L45,30 Z" fill="currentColor"/>
                <path d="M30,50 L30,60 L90,60 L90,50 M90,60 L105,40 L105,30" fill="none" stroke="currentColor" strokeWidth="2"/>
             </svg>
             <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 bg-blue-50">L {cLength}</span>
             <span className="absolute right-10 top-6 px-2 bg-blue-50">W {cWidth}</span>
             <span className="absolute left-8 bottom-6 px-2 bg-blue-50">D {cDepth}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Mix Ratio</label>
              <select value={cMix} onChange={e => setCMix(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium">
                <option value="1:5:10">1:5:10 (M5)</option>
                <option value="1:4:8">1:4:8 (M7.5)</option>
                <option value="1:3:6">1:3:6 (M10)</option>
                <option value="1:2:4">1:2:4 (M15)</option>
                <option value="1:1.5:3">1:1.5:3 (M20)</option>
                <option value="1:1:2">1:1:2 (M25)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">W/C Ratio (0.45-0.6)</label>
              <input type="number" step="0.01" value={cWcRatio} onChange={e => setCWcRatio(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
          </div>
        </div>
    );
  } else if (activeTab === "bricks" || activeTab === "blocks") {
    
    const l = activeTab === "bricks" ? brickL : blockL;
    const w = activeTab === "bricks" ? brickW : blockW;
    const h = activeTab === "bricks" ? brickH : blockH;
    const j = activeTab === "bricks" ? bJoint : blockJoint;

    // Convert cm/inches to appropriate units in calculator 
    // The calculator expects base units for wall (like meters or feet)
    // but the brick dimensions are in cm or inches. Our calculator code expects everything mathematically scaled?
    // Wait, let's normalize everything to the base unit (Meters or Feet).
    const conv = isSI ? 100 : 12; // cm to m, or inches to feet

    const totalDeductionArea = openings.reduce((acc, op) => acc + (op.quantity * op.length * op.height), 0);

    const calc = new BrickworkCalculator(
      parseNum(bWallL), parseNum(bWallH), parseNum(bWallT) / conv, 
      totalDeductionArea, 
      parseNum(l) / conv, parseNum(w) / conv, parseNum(h) / conv, 
      parseNum(j) / conv, 
      bMix, parseNum(wastage), isSI
    );
    const res = calc.calculate();

    const setL = activeTab === "bricks" ? setBrickL : setBlockL;
    const setW = activeTab === "bricks" ? setBrickW : setBlockW;
    const setH = activeTab === "bricks" ? setBrickH : setBlockH;
    const setJ = activeTab === "bricks" ? setBJoint : setBlockJoint;

    currentExportInputs = {
      "Wall Dimensions": `L: ${bWallL} ${unitFt} | H: ${bWallH} ${unitFt} | T: ${bWallT} ${unitIn}`,
      "Deductions Area": `${totalDeductionArea.toFixed(2)} ${unitArea}`,
      "Unit Dimensions": `L: ${l} ${unitIn} | W: ${w} ${unitIn} | H: ${h} ${unitIn}`,
      "Mortar Joint": `${j} ${unitIn}`,
      "Mix Ratio": bMix,
      "Wastage Allowed": `${wastage}%`
    };

    currentExportData = {
      "Net Wall Volume": `${res.netWallVol.toFixed(2)} ${unitVol}`,
      "Total Units Required": `${res.numBricks} nos`,
      "Mortar Volume": `${res.mortarWetVol.toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`
    };

    currentCartItem = {
      type: activeTab === "bricks" ? "Bricks" : "Blocks",
      cementBags: res.cementBags,
      sandVol: res.sandVol,
      aggregateVol: 0,
      waterLiters: 0,
      bricksCount: activeTab === "bricks" ? res.numBricks : undefined,
      blocksCount: activeTab === "blocks" ? res.numBricks : undefined,
      unitVol,
      rawExport: currentExportData
    } as any;

    content = (
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-500">{activeTab} Wall </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Wall Length ({unitFt})</label>
              <input type="number" value={bWallL} onChange={e => setBWallL(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Wall Height ({unitFt})</label>
              <input type="number" value={bWallH} onChange={e => setBWallH(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Wall Thick ({unitIn})</label>
              <input type="number" value={bWallT} onChange={e => setBWallT(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
          </div>
          
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 flex items-center justify-center h-32 relative text-[10px] font-bold text-amber-600/80">
             <svg viewBox="0 0 120 80" className="w-full h-full absolute inset-0 opacity-20 pointer-events-none">
                <path d="M20,60 L80,60 L80,20 L20,20 Z" fill="currentColor"/>
                <path d="M80,60 L95,45 L95,5 L80,20 M20,20 L35,5 L95,5" fill="none" stroke="currentColor" strokeWidth="2"/>
             </svg>
             <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 bg-amber-50">L {bWallL}</span>
             <span className="absolute left-4 top-1/2 -translate-y-1/2 px-2 bg-amber-50">H {bWallH}</span>
             <span className="absolute right-10 bottom-6 px-2 bg-amber-50">T {bWallT}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center mb-4">
              Add Deductions
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px]">Total: {openings.reduce((acc, op) => acc + (op.quantity * op.length * op.height), 0).toFixed(2)} {unitArea}</span>
            </h4>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-2">
                <select 
                  className="bg-slate-50 border p-2 rounded-lg text-xs font-medium"
                  value={newOpening.type}
                  onChange={e => setNewOpening({...newOpening, type: e.target.value as any})}
                >
                  <option value="Door">Door</option>
                  <option value="Window">Window</option>
                  <option value="Ventilator">Ventilator</option>
                </select>
                <div>
                  <input type="number" placeholder="Qty" value={newOpening.quantity || ''} onChange={e => setNewOpening({...newOpening, quantity: parseFloat(e.target.value)})} className="w-full bg-slate-50 border p-2 rounded-lg text-xs font-medium" />
                </div>
                <div>
                  <input type="number" placeholder={`L (${unitFt})`} value={newOpening.length || ''} onChange={e => setNewOpening({...newOpening, length: parseFloat(e.target.value)})} className="w-full bg-slate-50 border p-2 rounded-lg text-xs font-medium" />
                </div>
                <div>
                  <input type="number" placeholder={`H (${unitFt})`} value={newOpening.height || ''} onChange={e => setNewOpening({...newOpening, height: parseFloat(e.target.value)})} className="w-full bg-slate-50 border p-2 rounded-lg text-xs font-medium" />
                </div>
              </div>
              <button 
                onClick={() => {
                  if (newOpening.quantity && newOpening.length && newOpening.height) {
                    setOpenings([...openings, { ...newOpening, id: Math.random().toString(36).substr(2, 9) } as Opening]);
                    setNewOpening({ type: 'Door', quantity: 1, length: 0, height: 0 });
                  }
                }}
                className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                disabled={!newOpening.quantity || !newOpening.length || !newOpening.height}
              >
                + Add Opening
              </button>
            </div>
            
            {openings.length > 0 && (
              <div className="mt-4 space-y-2">
                {openings.map(op => (
                  <div key={op.id} className="flex items-center justify-between bg-slate-50 p-2 rounded text-xs">
                    <span className="font-semibold text-slate-600">{op.quantity}x {op.type}</span>
                    <span className="text-slate-500">{op.length}×{op.height} {unitFt}</span>
                    <span className="font-bold text-slate-700">{(op.quantity * op.length * op.height).toFixed(2)} {unitArea}</span>
                    <button onClick={() => setOpenings(openings.filter(o => o.id !== op.id))} className="text-red-400 hover:text-red-600">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 className="font-bold border-b pb-2 pt-4 uppercase text-sm tracking-widest text-slate-500">Unit Dimensions ({unitIn})</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Length</label>
              <input type="number" value={l} onChange={e => setL(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Width</label>
              <input type="number" value={w} onChange={e => setW(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Height</label>
              <input type="number" value={h} onChange={e => setH(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Joint Thick ({unitIn})</label>
              <input type="number" value={j} onChange={e => setJ(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
             </div>
             <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Mortar Mix</label>
              <select value={bMix} onChange={e => setBMix(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium">
                <option value="1:3">1:3</option>
                <option value="1:4">1:4</option>
                <option value="1:5">1:5</option>
                <option value="1:6">1:6</option>
              </select>
             </div>
          </div>
        </div>
    );
  } else if (activeTab === "steel") {
    const calc = new SteelCalculator(
      parseNum(sDia), parseNum(sSpan), parseNum(sSpace), parseNum(sBarL), parseNum(sOverlap), 1, parseNum(wastage), isSI
    );
    const res = calc.calculate();
    
    currentExportInputs = {
      "Bar Diameter": `${sDia} mm/in#`,
      "Span/Length": `${sSpan} ${unitFt}`,
      "Spacing": `${sSpace} mm/in`,
      "Standard Bar Length": `${sBarL} ${unitFt}`,
      "Overlap Factor": `${sOverlap}xD`,
      "Wastage Allowed": `${wastage}%`
    };

    currentExportData = {
      "Total Bars Needed": `${res.numBars} nos`,
      "Weight per Unit": `${res.weightPerUnitLength.toFixed(3)} kg`,
      "Total Cut Length": `${res.totalLengthAllBars.toFixed(2)} ${unitFt}`,
      "Total Weight": `${res.totalWeightKg.toFixed(1)} kg`
    };

    currentCartItem = {
      type: "Steel",
      cementBags: 0,
      sandVol: 0,
      aggregateVol: 0,
      waterLiters: 0,
      steelKg: res.totalWeightKg,
      unitVol,
      rawExport: currentExportData
    };

    content = (
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-500">Steel Reinforcement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Bar Dia (mm/in#)</label>
              <input type="number" value={sDia} onChange={e => setSDia(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Span Length ({unitFt})</label>
              <input type="number" value={sSpan} onChange={e => setSSpan(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Spacing ({isSI ? 'mm' : 'inch'})</label>
              <input type="number" value={sSpace} onChange={e => setSSpace(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Standard Bar Length ({unitFt})</label>
              <input type="number" value={sBarL} onChange={e => setSBarL(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Overlap Factor (xD)</label>
              <input type="number" value={sOverlap} onChange={e => setSOverlap(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
          </div>
        </div>
    );
  } else if (activeTab === "plaster") {
    const conv = isSI ? 100 : 12;
    const calc = new PlasterCalculator(
      parseNum(pArea), parseNum(pThick)/conv, pMix, parseNum(wastage), isSI
    );
    const res = calc.calculate();
    
    currentExportInputs = {
      "Surface Area": `${pArea} ${unitArea}`,
      "Thickness": `${pThick} ${unitIn}`,
      "Mix Ratio": pMix,
      "Wastage Allowed": `${wastage}%`
    };

    currentExportData = {
      "Total Wet Volume": `${res.totalWetVolume.toFixed(2)} ${unitVol}`,
      "Cement Required": `${res.cementBags.toFixed(2)} Bags`,
      "Sand Required": `${res.sandVol.toFixed(2)} ${unitVol}`
    };

    currentCartItem = {
      type: "Plaster",
      cementBags: res.cementBags,
      sandVol: res.sandVol,
      aggregateVol: 0,
      waterLiters: 0,
      unitVol,
      rawExport: currentExportData
    };

    content = (
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-500">Plaster / Mortar</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Surface Area ({unitArea})</label>
              <input type="number" value={pArea} onChange={e => setPArea(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Thickness ({unitIn})</label>
              <input type="number" value={pThick} onChange={e => setPThick(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Mix Ratio</label>
              <select value={pMix} onChange={e => setPMix(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium">
                <option value="1:3">1:3</option>
                <option value="1:4">1:4</option>
                <option value="1:5">1:5</option>
                <option value="1:6">1:6</option>
              </select>
            </div>
          </div>
          
          <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-200 flex items-center justify-center h-32 relative text-[10px] font-bold text-slate-500">
             <svg viewBox="0 0 120 80" className="w-full h-full absolute inset-0 opacity-20 pointer-events-none">
                <path d="M30,70 L90,60 L90,20 L30,30 Z" fill="currentColor"/>
             </svg>
             <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-slate-50">Area: {pArea} {unitArea}</span>
             <span className="absolute bottom-4 right-10 px-2 bg-slate-50">T: {pThick} {unitIn}</span>
          </div>
        </div>
    );
  } else if (activeTab === "water") {
    // Basic Water Calculator based on cement weight
    const waterCalc = parseNum(wCementKg) * parseNum(wWcRatio);
    
    currentExportInputs = {
      "Weight of Cement": `${wCementKg} kg`,
      "W/C Ratio": `${wWcRatio}`
    };

    currentExportData = {
      "Weight of Cement": `${wCementKg} kg`,
      "W/C Ratio": `${wWcRatio}`,
      "Required Water": `${waterCalc.toFixed(1)} L (${(waterCalc / 3.785).toFixed(2)} Gallons)`
    };

    currentCartItem = {
      type: "Water",
      cementBags: 0,
      sandVol: 0,
      aggregateVol: 0,
      waterLiters: waterCalc,
      unitVol,
      rawExport: currentExportData
    };

    content = (
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border w-full">
        <h3 className="font-bold border-b pb-2 uppercase text-sm tracking-widest text-slate-500">Water Requirements</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Weight of Cement (kg)</label>
              <input type="number" value={wCementKg} onChange={e => setWCementKg(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">W/C Ratio (0.45-0.6)</label>
              <input type="number" step="0.01" value={wWcRatio} onChange={e => setWWcRatio(e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-medium" />
            </div>
          </div>
        </div>
    );
  } else if (activeTab === "rcc") {
    content = (
      <div className="w-full relative col-span-1 lg:col-span-2 space-y-4">
        <RccStructureCalculator isEmbedded={true} />
      </div>
    );
  } else if (activeTab === "master") {
    content = (
      <div className="w-full relative col-span-1 lg:col-span-2 space-y-4">
        <MasterQuantityEstimator isEmbedded={true} />
      </div>
    );
  } else if (activeTab === "cement" || activeTab === "sand") {
    content = (
      <div className="bg-slate-50 border p-12 rounded-3xl text-center text-slate-500 max-w-xl mx-auto mt-8">
        <Layers className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Use Standard Modules</h3>
        <p>For standalone {activeTab} estimations, please rely on the Concrete, Plaster, or Block modules which accurately calculate the constituent cement/sand ratios from overall dimensions.</p>
      </div>
    )
  }

  const addToCart = () => {
    if (!currentCartItem) return;
    const item: CartItem = {
      ...currentCartItem,
      id: Math.random().toString(36).substr(2, 9),
      name: elementName || `${currentCartItem.type} Element`
    };
    setCart([...cart, item]);
    setElementName("");
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const totalCement = cart.reduce((acc, item) => acc + item.cementBags, 0);
  const totalSand = cart.reduce((acc, item) => acc + item.sandVol, 0);
  const totalAgg = cart.reduce((acc, item) => acc + item.aggregateVol, 0);
  const totalWater = cart.reduce((acc, item) => acc + item.waterLiters, 0);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 text-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
           <div>
             <h1 className="text-3xl font-black text-gray-900 mb-2">Construction Material Estimator</h1>
             <p className="text-gray-500 font-medium">Accurate estimations for concrete, bricks, steel, blocks, and mortar.</p>
             <div className="mt-4"><GlobalSettingsToggle /></div>
           </div>
           <div className="flex flex-wrap items-center gap-4">
             <div className="bg-white px-4 py-3 rounded-xl border flex items-center gap-2 shadow-sm">
                <span className="text-xs font-bold text-gray-500">WASTAGE</span>
                <input type="number" value={wastage} onChange={e => setWastage(e.target.value)} className="w-14 text-center font-bold bg-gray-50 rounded border-none p-1 focus:ring-2 focus:ring-indigo-500" />
                <span className="text-xs font-bold text-gray-500">%</span>
             </div>
             </div>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
           {fullTabs.map((tab) => {
             const Icon = tab.icon;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/20" : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"}`}
               >
                 <Icon className="w-4 h-4" />
                 {tab.label}
               </button>
             )
           })}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {content}
            {(activeTab !== "cement" && activeTab !== "sand" && activeTab !== "rcc" && activeTab !== "master") && (
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white space-y-4 shadow-xl sticky top-6 self-start z-10">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">Material Breakdown</h3>
                    <label className="flex items-center gap-2 cursor-pointer text-xs bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition">
                       <input type="checkbox" checked={showCost} onChange={e => setShowCost(e.target.checked)} className="accent-indigo-500 w-4 h-4 rounded" />
                       Cost Est.
                    </label>
                 </div>
                 
                 {Object.entries(currentExportData).map(([key, val]) => {
                    let colorClass = "text-slate-400";
                    if (key.includes("Cement")) colorClass = "text-blue-400 font-bold";
                    else if (key.includes("Sand")) colorClass = "text-amber-400 font-bold";
                    else if (key.includes("Aggregate")) colorClass = "text-gray-400 font-bold";
                    else if (key.includes("Water")) colorClass = "text-cyan-400 font-bold";
                    else if (key.toLowerCase().includes("weight") || key.includes("Steel")) colorClass = "text-indigo-400 font-bold";
                    else if (key.includes("Units Required")) colorClass = "text-rose-400 font-bold";
                    
                    return (
                      <div key={key} className="flex justify-between border-b border-slate-800 pb-3 pt-2">
                         <span className={colorClass}>{key}</span> 
                         <span className={key.includes("Units Required") ? "font-mono font-bold text-white uppercase text-xl" : "font-mono font-bold text-white"}>{val}</span>
                      </div>
                    );
                 })}

                 {showCost && currentCartItem && (
                    <div className="pt-4 mt-4 border-t-2 border-slate-700 space-y-3">
                       <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                          {currentCartItem.cementBags > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Cement (per bag)</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.cement} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, cement: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                          {currentCartItem.sandVol > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Sand (per {currentCartItem.unitVol})</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.sand} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, sand: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                          {(currentCartItem.aggregateVol || 0) > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Aggregate (per {currentCartItem.unitVol})</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.aggregate} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, aggregate: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                          {currentCartItem.steelKg !== undefined && currentCartItem.steelKg > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Steel (per kg)</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.steel} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, steel: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                          {currentCartItem.bricksCount !== undefined && currentCartItem.bricksCount > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Bricks (per unit)</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.bricks} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, bricks: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                          {currentCartItem.blocksCount !== undefined && currentCartItem.blocksCount > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Blocks (per unit)</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.blocks} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, blocks: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                          {currentCartItem.waterLiters > 0 && (
                            <div className="col-span-2 sm:col-span-1">
                               <label className="text-slate-400 mb-1 block">Water (per L)</label>
                               <input type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono" value={rates.water} onChange={e => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val) && val < 0) return;
                                 setRates({...rates, water: isNaN(val) ? 0 : val});
                               }} />
                            </div>
                          )}
                       </div>
                       <div className="flex justify-between items-center pt-2">
                          <span className="text-slate-300 font-bold uppercase tracking-wider text-sm">Estimated Cost</span>
                          <span className="text-2xl font-black text-green-400">
                             {formatCurrency(
                               (currentCartItem.cementBags * rates.cement) + 
                               (currentCartItem.sandVol * rates.sand) + 
                               ((currentCartItem.aggregateVol || 0) * rates.aggregate) + 
                               (currentCartItem.waterLiters * rates.water) +
                               ((currentCartItem.steelKg || 0) * rates.steel) +
                               ((currentCartItem.bricksCount || 0) * rates.bricks) +
                               ((currentCartItem.blocksCount || 0) * rates.blocks)
                             )}
                          </span>
                       </div>
                    </div>
                 )}
              </div>
            )}
          </div>
          
          {currentCartItem && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-end pb-12 sm:pb-0">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Element Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Footing A, Slab B, Retaining Wall" 
                  value={elementName}
                  onChange={e => setElementName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-xl mt-1 font-medium focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <button 
                onClick={addToCart}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/20 whitespace-nowrap"
              >
                + Add to Estimate
              </button>
            </div>
          )}

          {Object.keys(currentExportData).length > 0 && (
             <ShareButtonWithPopup 
               activeTab={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
               data={currentExportData} 
               exportFormat={{
                 inputs: currentExportInputs,
                 breakdown: currentExportData,
                 rates: rates,
                 cartItem: currentCartItem
               }}
               title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Estimation`} 
             />
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-8 bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative">
            <h2 className="text-xl font-black mb-6">Project Cart ({cart.length} Elements)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between border border-slate-700/50">
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{item.type}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-400 hover:text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl border border-indigo-500/30 self-start">
                 <h3 className="font-bold text-indigo-200 text-sm uppercase tracking-widest mb-6">Accumulated Total</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                      <span className="text-indigo-100/70 font-semibold">Cement</span> 
                      <span className="font-mono font-bold text-white">{totalCement.toFixed(2)} Bags</span>
                   </div>
                   <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                      <span className="text-indigo-100/70 font-semibold">Sand</span> 
                      <span className="font-mono font-bold text-white">{totalSand.toFixed(2)} {isSI ? "m³" : "cft"}</span>
                   </div>
                   <div className="flex justify-between border-b border-indigo-500/30 pb-3">
                      <span className="text-indigo-100/70 font-semibold">Aggregate</span> 
                      <span className="font-mono font-bold text-white">{totalAgg.toFixed(2)} {isSI ? "m³" : "cft"}</span>
                   </div>
                   <div className="flex justify-between pt-1">
                      <span className="text-indigo-100/70 font-semibold">Water</span> 
                      <span className="font-mono font-bold text-white">{totalWater.toFixed(1)} L</span>
                   </div>
                 </div>
              </div>
            </div>
             
             <div className="mt-6 flex flex-wrap gap-4 items-center">
               <ShareButtonWithPopup 
                   activeTab="Project Cart"
                   data={{
                     "Elements": cart.length,
                     "Total Cement": `${totalCement.toFixed(2)} Bags`,
                     "Total Sand": `${totalSand.toFixed(2)} ${isSI ? "m³" : "cft"}`,
                     "Total Aggregate": `${totalAgg.toFixed(2)} ${isSI ? "m³" : "cft"}`,
                     "Total Water": `${totalWater.toFixed(1)} L`,
                   }} 
                   exportFormat={{
                     inputs: { "Cart Elements": String(cart.length) },
                     breakdown: {
                       "Total Cement": `${totalCement.toFixed(2)} Bags`,
                       "Total Sand": `${totalSand.toFixed(2)} ${isSI ? "m³" : "cft"}`,
                       "Total Aggregate": `${totalAgg.toFixed(2)} ${isSI ? "m³" : "cft"}`,
                       "Total Water": `${totalWater.toFixed(1)} L`
                     },
                     rates: rates,
                     cartItem: {
                       cementBags: totalCement,
                       sandVol: totalSand,
                       aggregateVol: totalAgg,
                       waterLiters: totalWater,
                       unitVol: isSI ? "m³" : "cft"
                     }
                   }}
                   title={`Combined Material Estimate`} 
                 />

                 {user && (
                   <button 
                     onClick={async () => {
                       if (cart.length === 0) return;
                       setIsSaving(true);
                       setSaveMessage("");
                       try {
                         const payload = {
                           cart,
                           totals: {
                             cementBags: totalCement,
                             sandVol: totalSand,
                             aggregateVol: totalAgg,
                             waterLiters: totalWater,
                             steelKg: cart.reduce((acc, item) => acc + (item.steelKg || 0), 0),
                             bricksCount: cart.reduce((acc, item) => acc + (item.bricksCount || 0), 0),
                             blocksCount: cart.reduce((acc, item) => acc + (item.blocksCount || 0), 0),
                             unitVol: isSI ? "m³" : "cft"
                           },
                           rates
                         };
                         const projName = prompt("Enter project element/estimate name:", "My Material Estimate");
                         if (projName) {
                           await saveEstimate(projName, payload);
                           setSaveMessage("Saved successfully!");
                           setTimeout(() => setSaveMessage(""), 3000);
                         }
                       } catch (e) {
                         setSaveMessage("Failed to save.");
                       } finally {
                         setIsSaving(false);
                       }
                     }}
                     disabled={isSaving}
                     className="mt-6 sm:mt-0 bg-green-600/20 text-green-400 hover:bg-green-600/30 px-6 py-4 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                   >
                     {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-5 h-5" /> Save to Profile</>}
                   </button>
                 )}
                 {saveMessage && <span className="text-sm font-bold text-green-400 ml-4">{saveMessage}</span>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}