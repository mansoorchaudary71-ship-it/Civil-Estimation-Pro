import React, { useState } from 'react';
import { Truck, Calculator, Ruler, Hash, Plus, Layers, ArrowRight, Grid2X2 } from 'lucide-react';
import ShareButtonWithPopup from './ShareMenu';
import { useSettings } from '../../context/SettingsContext';
import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';

export default function GridEarthworkEstimator() {
  const { settings, formatCurrency, convertAmount, convertAmountToRaw } = useSettings();
  const isMetric = settings.measurement === 'SI';
  const unitL = isMetric ? 'm' : 'ft';
  const unitA = isMetric ? 'm²' : 'ft²';
  const unitV = isMetric ? 'm³' : 'ft³';

  const [gridLength, setGridLength] = useState<string>('10');
  const [gridWidth, setGridWidth] = useState<string>('10');

  const [cornerTL, setCornerTL] = useState({ existing: '100.5', proposed: '100.0' });
  const [cornerTR, setCornerTR] = useState({ existing: '100.8', proposed: '100.0' });
  const [cornerBL, setCornerBL] = useState({ existing: '100.2', proposed: '100.0' });
  const [cornerBR, setCornerBR] = useState({ existing: '100.4', proposed: '100.0' });

  const L = parseFloat(gridLength) || 0;
  const W = parseFloat(gridWidth) || 0;
  const area = L * W;

  const tlE = parseFloat(cornerTL.existing) || 0;
  const tlP = parseFloat(cornerTL.proposed) || 0;
  
  const trE = parseFloat(cornerTR.existing) || 0;
  const trP = parseFloat(cornerTR.proposed) || 0;
  
  const blE = parseFloat(cornerBL.existing) || 0;
  const blP = parseFloat(cornerBL.proposed) || 0;
  
  const brE = parseFloat(cornerBR.existing) || 0;
  const brP = parseFloat(cornerBR.proposed) || 0;

  const tlDiff = tlE - tlP;
  const trDiff = trE - trP;
  const blDiff = blE - blP;
  const brDiff = brE - brP;

  const avgExisting = (tlE + trE + blE + brE) / 4;
  const avgProposed = (tlP + trP + blP + brP) / 4;
  const avgDepth = (tlDiff + trDiff + blDiff + brDiff) / 4;

  const totalVolume = Math.abs(avgDepth) * area;
  const isCut = avgDepth > 0;
  const isFill = avgDepth < 0;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-10 block">
          <div>
            <h1 className="text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent pb-1">
              Grid Method Earthwork
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Calculate leveling volume by comparing existing and proposed elevations at grid corners.
            </p>
            <div className="mt-5 w-fit"><GlobalSettingsToggle align="left" /></div>
          </div>
          
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Grid2X2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Grid Dimensions</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Length [{unitL}]</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={gridLength}
                    onChange={e => setGridLength(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Width [{unitL}]</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={gridWidth}
                    onChange={e => setGridWidth(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl font-medium text-gray-600 flex justify-between">
                <span>Grid Area:</span>
                <span className="font-bold text-gray-800">{area.toFixed(2)} {unitA}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Corner Elevations</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-6 relative">
                {/* Visual Connector Lines */}
                <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-100 -translate-y-1/2" />
                <div className="absolute left-1/2 top-6 bottom-6 w-0.5 bg-gray-100 -translate-x-1/2" />

                {/* Top Left */}
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Top Left 
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-md text-gray-500">Corner 1</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Existing</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerTL.existing} onChange={e => setCornerTL({...cornerTL, existing: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Proposed</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerTL.proposed} onChange={e => setCornerTL({...cornerTL, proposed: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Top Right */}
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Top Right
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-md text-gray-500">Corner 2</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Existing</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerTR.existing} onChange={e => setCornerTR({...cornerTR, existing: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Proposed</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerTR.proposed} onChange={e => setCornerTR({...cornerTR, proposed: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Bottom Left */}
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Bottom Left
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-md text-gray-500">Corner 3</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Existing</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerBL.existing} onChange={e => setCornerBL({...cornerBL, existing: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Proposed</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerBL.proposed} onChange={e => setCornerBL({...cornerBL, proposed: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Bottom Right */}
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl relative z-10 shadow-sm hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    Bottom Right
                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-md text-gray-500">Corner 4</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Existing</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerBR.existing} onChange={e => setCornerBR({...cornerBR, existing: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Proposed</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={cornerBR.proposed} onChange={e => setCornerBR({...cornerBR, proposed: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className={`bg-gradient-to-br ${isFill ? 'from-indigo-600 to-purple-700' : isCut ? 'from-amber-500 to-orange-600' : 'from-slate-700 to-slate-800'} rounded-[1.5rem] p-8 shadow-2xl relative overflow-hidden transition-colors duration-500`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Results</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 p-5 rounded-[1.25rem] border border-white/20 backdrop-blur-sm">
                    <div className="text-white/80 text-sm font-medium mb-1">Average Existing Elevation</div>
                    <div className="text-2xl font-bold text-white">
                      {avgExisting.toFixed(3)} <span className="opacity-70 text-lg">{unitL}</span>
                    </div>
                  </div>
                  <div className="bg-white/10 p-5 rounded-[1.25rem] border border-white/20 backdrop-blur-sm">
                    <div className="text-white/80 text-sm font-medium mb-1">Average Proposed Level</div>
                    <div className="text-2xl font-bold text-white">
                      {avgProposed.toFixed(3)} <span className="opacity-70 text-lg">{unitL}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-[1.25rem] border bg-white/20 border-white/30 backdrop-blur-sm mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-sm font-medium text-white/90">
                        {isCut ? 'Average Cut Depth' : isFill ? 'Average Fill Depth' : 'Average Depth'}
                      </div>
                      <div className="text-white font-bold text-xl uppercase tracking-wider">
                        {isCut ? 'CUT' : isFill ? 'FILL' : 'LEVEL'}
                      </div>
                    </div>
                    <div className="text-4xl font-black tracking-tight text-white mb-4">
                      {Math.abs(avgDepth).toFixed(3)} <span className="text-xl font-medium opacity-80">{unitL}</span>
                    </div>
                    
                    <div className="h-px w-full bg-white/20 my-4"></div>

                    <div className="text-base font-medium text-white/90 mb-1">Total {isCut ? 'Cut' : isFill ? 'Fill' : ''} Volume</div>
                    <div className="text-5xl font-black tracking-tighter text-white">
                      {totalVolume.toFixed(2)} <span className="text-2xl font-medium opacity-80">{unitV}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ShareButtonWithPopup 
              activeTab="Grid Earthwork"
              data={{
                "Average Depth": `${Math.abs(avgDepth).toFixed(3)} ${unitL} ${isCut ? '(Cut)' : isFill ? '(Fill)' : ''}`,
                "Total Volume": `${totalVolume.toFixed(2)} ${unitV} ${isCut ? '(Cut)' : isFill ? '(Fill)' : ''}`
              }}
              exportFormat={{
                inputs: {
                  "Grid Area": `${area.toFixed(2)} ${unitA}`,
                  "Average Existing": `${avgExisting.toFixed(3)} ${unitL}`,
                  "Average Proposed": `${avgProposed.toFixed(3)} ${unitL}`,
                },
                breakdown: {
                  "Average Depth": `${Math.abs(avgDepth).toFixed(3)} ${unitL} ${isCut ? '(Cut)' : isFill ? '(Fill)' : ''}`,
                  "Total Volume": `${totalVolume.toFixed(2)} ${unitV} ${isCut ? '(Cut)' : isFill ? '(Fill)' : ''}`
                }
              }}
              title="Grid Method Earthwork Estimator"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
