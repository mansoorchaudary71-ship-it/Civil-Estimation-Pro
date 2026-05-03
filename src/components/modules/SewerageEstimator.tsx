import React, { useState } from 'react';
import { Waves, Ruler, CircleDashed, ArrowDownRight, AlignVerticalJustifyStart, ArrowRight, ChevronDown } from 'lucide-react';

export default function SewerageEstimator() {
  const [openSection, setOpenSection] = useState<string>('manhole');

  // Trench State
  const [trenchLength, setTrenchLength] = useState<string>('100');
  const [trenchWidth, setTrenchWidth] = useState<string>('1.5');
  const [trenchDepth, setTrenchDepth] = useState<string>('2.5');

  // Manhole State
  const [mhType, setMhType] = useState<'circular' | 'square'>('circular');
  const [mhDepth, setMhDepth] = useState<string>('3');
  const [mhInnerDim, setMhInnerDim] = useState<string>('1.2'); // Diameter or Side
  const [mhWallThick, setMhWallThick] = useState<string>('0.23'); // 230mm brickwork

  // Invert Level State
  const [startIL, setStartIL] = useState<string>('100'); // m
  const [ilLength, setIlLength] = useState<string>('50'); // m
  const [ilGradient, setIlGradient] = useState<string>('200'); // 1 in 200

  // Pipe Sections State
  const [pipeLength, setPipeLength] = useState<string>('100');
  const [pipeSectionLen, setPipeSectionLen] = useState<string>('2.5'); // standard 2.5m RCC pipe

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  // Calculations
  const tL = parseFloat(trenchLength) || 0;
  const tW = parseFloat(trenchWidth) || 0;
  const tD = parseFloat(trenchDepth) || 0;
  const trenchVol = tL * tW * tD;

  const mD = parseFloat(mhDepth) || 0;
  const mDim = parseFloat(mhInnerDim) || 0;
  const mW = parseFloat(mhWallThick) || 0;
  let mhMaterialVol = 0;
  if (mhType === 'circular') {
    const outerR = (mDim / 2) + mW;
    const innerR = mDim / 2;
    mhMaterialVol = Math.PI * (outerR * outerR - innerR * innerR) * mD;
  } else {
    const outerSide = mDim + 2 * mW;
    mhMaterialVol = (outerSide * outerSide - mDim * mDim) * mD;
  }

  const sIL = parseFloat(startIL) || 0;
  const iL = parseFloat(ilLength) || 0;
  const iG = parseFloat(ilGradient) || 1; // prevent divide by zero
  const drop = iG > 0 ? iL / iG : 0;
  const endIL = sIL - drop;

  const pL = parseFloat(pipeLength) || 0;
  const pS = parseFloat(pipeSectionLen) || 1;
  const pipeCount = pS > 0 ? Math.ceil(pL / pS) : 0;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent pb-1">
            Sewerage & Drainage Calculator
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Calculate excavation volumes, manhole material, pipe sections, and invert levels for municipal infrastructure.
          </p>
        </header>

        <div className="space-y-4">
          
          {/* Manhole Material Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection('manhole')}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <CircleDashed className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Manhole Calculator</h2>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === 'manhole' ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out ${openSection === 'manhole' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Shape</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mhType === 'circular' ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => setMhType('circular')}
                        >
                          Circular
                        </button>
                        <button 
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mhType === 'square' ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => setMhType('square')}
                        >
                          Square
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Depth (m)</label>
                         <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50" value={mhDepth} onChange={e => setMhDepth(e.target.value)} />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Inner {mhType === 'circular' ? 'Dia' : 'Side'} (m)</label>
                         <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50" value={mhInnerDim} onChange={e => setMhInnerDim(e.target.value)} />
                       </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Wall Thickness (m)</label>
                      <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50" value={mhWallThick} onChange={e => setMhWallThick(e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 flex flex-col justify-center">
                    <div className="text-teal-800 text-sm font-semibold mb-1">Brickwork / Concrete Volume</div>
                    <div className="flex items-end gap-2">
                       <span className="text-5xl font-black text-teal-600 tracking-tighter">{mhMaterialVol.toFixed(2)}</span>
                       <span className="text-xl font-medium text-teal-500 mb-1">m³</span>
                    </div>
                    <p className="text-teal-600/70 text-xs mt-3 bg-teal-100/50 p-2 rounded-lg">
                      Excludes base slab and top cover. Calculates strictly wall material.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trench Excavation Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection('trench')}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlignVerticalJustifyStart className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Trench Excavation</h2>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === 'trench' ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out ${openSection === 'trench' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="grid grid-cols-2 gap-4 h-fit">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Length (m)</label>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50" value={trenchLength} onChange={e => setTrenchLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Width (m)</label>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50" value={trenchWidth} onChange={e => setTrenchWidth(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Depth (m)</label>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50" value={trenchDepth} onChange={e => setTrenchDepth(e.target.value)} />
                      </div>
                   </div>
                   <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col justify-center">
                      <div className="text-amber-800 text-sm font-semibold mb-1">Total Excavation Volume</div>
                      <div className="flex items-end gap-2">
                         <span className="text-5xl font-black text-amber-600 tracking-tighter">{trenchVol.toFixed(2)}</span>
                         <span className="text-xl font-medium text-amber-500 mb-1">m³</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Invert Level Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection('il')}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Invert Level (IL) Calculator</h2>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === 'il' ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out ${openSection === 'il' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Starting IL (m)</label>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={startIL} onChange={e => setStartIL(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Length (m)</label>
                          <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={ilLength} onChange={e => setIlLength(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Gradient (1 in X)</label>
                          <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 overflow-hidden">
                             <div className="px-3 text-sm text-gray-400 font-medium">1 :</div>
                             <input type="number" className="w-full flex-1 bg-transparent text-gray-800 py-3 pr-4 focus:outline-none" value={ilGradient} onChange={e => setIlGradient(e.target.value)} />
                          </div>
                        </div>
                      </div>
                   </div>
                   <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center">
                      <div className="text-blue-800 text-sm font-semibold mb-1">Ending Invert Level</div>
                      <div className="flex items-end gap-2">
                         <span className="text-5xl font-black text-blue-600 tracking-tighter">{endIL.toFixed(3)}</span>
                         <span className="text-xl font-medium text-blue-500 mb-1">m</span>
                      </div>
                      <div className="text-blue-600/70 text-sm mt-3 font-medium">
                        Drop: <strong className="text-blue-700">{drop.toFixed(3)} m</strong>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipe Sections Accordion */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection('pipe')}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Waves className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Pipe Count Calculator</h2>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === 'pipe' ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out ${openSection === 'pipe' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4 h-fit">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Total Run Length (m)</label>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={pipeLength} onChange={e => setPipeLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">One Pipe Section Length (m)</label>
                        <input type="number" className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={pipeSectionLen} onChange={e => setPipeSectionLen(e.target.value)} />
                      </div>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                      <div className="text-indigo-800 text-sm font-semibold mb-1">Required Pipes</div>
                      <div className="flex items-base gap-2 mt-1">
                         <span className="text-6xl font-black text-indigo-600 tracking-tighter leading-none">{pipeCount}</span>
                         <span className="text-lg font-medium text-indigo-500">sections</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
