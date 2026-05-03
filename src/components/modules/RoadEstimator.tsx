import React, { useState } from 'react';
import { Route, Calculator, Layers, Droplets, ArrowRight } from 'lucide-react';

export default function RoadEstimator() {
  const [length, setLength] = useState<string>('1000'); // meters
  const [width, setWidth] = useState<string>('7.5'); // meters
  const [camber, setCamber] = useState<string>('2.5'); // %

  const [sgThickness, setSgThickness] = useState<string>('500'); // mm
  const [sbThickness, setSbThickness] = useState<string>('300'); // mm
  const [wbmThickness, setWbmThickness] = useState<string>('200'); // mm
  const [asphaltThickness, setAsphaltThickness] = useState<string>('50'); // mm

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const c = parseFloat(camber) || 0;
  
  const sgT = parseFloat(sgThickness) || 0;
  const sbT = parseFloat(sbThickness) || 0;
  const wbmT = parseFloat(wbmThickness) || 0;
  const aspT = parseFloat(asphaltThickness) || 0;

  // Cross-slope camber calculations
  const halfWidth = w / 2;
  const riseAtCenter = halfWidth * (c / 100);
  const slantWidthPerSide = Math.sqrt(halfWidth * halfWidth + riseAtCenter * riseAtCenter);
  const actualSurfaceWidth = slantWidthPerSide * 2;
  const surfaceArea = l * actualSurfaceWidth;
  const baseArea = l * w;

  // Volumes in cubic meters (m³)
  const volSG = baseArea * (sgT / 1000);
  const volSB = baseArea * (sbT / 1000);
  const volWBM = baseArea * (wbmT / 1000);
  const volAsphalt = surfaceArea * (aspT / 1000); // typically wears on slant

  // Coats in Liters (Typical rates approximation)
  const primeCoatRate = 1.0; // Liters/m² over WBM
  const tackCoatRate = 0.25; // Liters/m² between asphalt layers or on prime
  
  const primeCoatVolume = baseArea * primeCoatRate;
  const tackCoatVolume = surfaceArea * tackCoatRate;

  // Height sum for visualization proportions
  const totalT_mm = sgT + sbT + wbmT + aspT;
  const getFlex = (t: number) => {
    if (totalT_mm === 0) return 1;
    return Math.max(t, totalT_mm * 0.1); // at least 10% proportional height to ensure text visibility
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent pb-1">
            Flexible Pavement Road Estimator
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Calculate material volumes, coat litrages, and visualize cross-sections for multi-layer road construction.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Route className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Geometry Input</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Length (meters)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                    value={length}
                    onChange={e => setLength(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Width (m)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                      value={width}
                      onChange={e => setWidth(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Camber (%)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-shadow"
                      value={camber}
                      onChange={e => setCamber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Layer Thickness (mm)</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Sub-Grade</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={sgThickness}
                      onChange={e => setSgThickness(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Sub-Base</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={sbThickness}
                      onChange={e => setSbThickness(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Base Course (WBM)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={wbmThickness}
                      onChange={e => setWbmThickness(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Asphalt Course</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-shadow"
                      value={asphaltThickness}
                      onChange={e => setAsphaltThickness(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visualization and Results Section */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ minHeight: '360px' }}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-8 text-white">
                 <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    Cross-Section Profile
                 </h2>
                 <div className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    Camber: {c}% | Rise: {(riseAtCenter*1000).toFixed(0)}mm
                 </div>
              </div>

              {/* Road Diagram */}
              <div className="relative z-10 flex-1 flex flex-col justify-end w-full max-w-sm mx-auto h-[250px] min-h-[250px] mt-8 overflow-visible">
                 <div className="absolute -top-6 w-full flex justify-between px-2 text-[10px] text-white/50 font-mono">
                    <span>Left</span><span>Center</span><span>Right</span>
                 </div>
                 
                 {/* The asphalt layer with slope */}
                 <div className="w-full relative perspective-[1000px] flex-shrink-0 transition-all duration-300" style={{ flexGrow: getFlex(aspT), flexBasis: 0, minHeight: '35px' }}>
                    <div className="absolute bottom-0 w-1/2 left-0 h-full bg-gray-800/90 border-t border-l border-b border-gray-600 rounded-tl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] transition-transform duration-300" style={{ transformOrigin: 'bottom right', transform: `skewY(-${c}deg)` }}></div>
                    <div className="absolute bottom-0 w-1/2 right-0 h-full bg-gray-800/90 border-t border-r border-b border-gray-600 rounded-tr shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] transition-transform duration-300" style={{ transformOrigin: 'bottom left', transform: `skewY(${c}deg)` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white z-10 font-mono tracking-wider">ASPHALT ({aspT}mm)</div>
                 </div>

                 {/* Base layers flat */}
                 <div className="w-full bg-[#8c7a6b] relative border-b border-[#5e4f43] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] flex-shrink-0 transition-all duration-300" style={{ flexGrow: getFlex(wbmT), flexBasis: 0, minHeight: '35px' }}>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white font-mono tracking-wider mix-blend-overlay">WBM ({wbmT}mm)</div>
                 </div>
                 
                 <div className="w-full bg-[#d0c1b0] relative border-b border-[#b09f8c] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] flex-shrink-0 transition-all duration-300" style={{ flexGrow: getFlex(sbT), flexBasis: 0, minHeight: '35px' }}>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-[#5e4f43] font-mono tracking-wider" style={{ textShadow: '0px 1px 2px rgba(255,255,255,0.3)' }}>SUB-BASE ({sbT}mm)</div>
                 </div>

                 <div className="w-full bg-[#a38a73] relative rounded-b-xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] flex-shrink-0 transition-all duration-300" style={{ flexGrow: getFlex(sgT), flexBasis: 0, minHeight: '35px' }}>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-[#3e342b] font-mono tracking-wider" style={{ textShadow: '0px 1px 2px rgba(255,255,255,0.2)' }}>SUB-GRADE ({sgT}mm)</div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-amber-200 transition-colors">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-500" /> Layer Volumes
                </h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Sub-Grade</span>
                    <span className="font-bold text-gray-900">{volSG.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Sub-Base</span>
                    <span className="font-bold text-gray-900">{volSB.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-600">WBM</span>
                    <span className="font-bold text-gray-900">{volWBM.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Asphalt</span>
                    <span className="font-bold text-gray-900">{volAsphalt.toFixed(2)} m³</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-orange-200 transition-colors">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-orange-500" /> Bitumen Coats (Approx.)
                </h3>
                <div className="space-y-4">
                   <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <div className="text-orange-800 text-xs font-semibold mb-1">Prime Coat (on WBM)</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-orange-600 leading-none">{primeCoatVolume.toFixed(1)}</span>
                        <span className="text-sm font-medium text-orange-400 mb-0.5">Liters</span>
                      </div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-gray-600 text-xs font-semibold mb-1">Tack Coat</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-gray-800 leading-none">{tackCoatVolume.toFixed(1)}</span>
                        <span className="text-sm font-medium text-gray-500 mb-0.5">Liters</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}
