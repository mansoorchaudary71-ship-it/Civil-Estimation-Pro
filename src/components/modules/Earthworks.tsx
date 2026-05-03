import React, { useState } from 'react';
import { Truck, Calculator, Ruler, Hash, Plus, Layers, ArrowRight } from 'lucide-react';

export default function EarthworksEstimator() {
  const [length, setLength] = useState<string>('100');
  const [area1, setArea1] = useState<string>('50');
  const [area2, setArea2] = useState<string>('40');
  const [areaM, setAreaM] = useState<string>('47');
  
  const [bulkingFactor, setBulkingFactor] = useState<string>('15');
  const [shrinkageFactor, setShrinkageFactor] = useState<string>('10');
  const [truckCapacity, setTruckCapacity] = useState<string>('800');

  // Prismoidal Formula: V = (L / 6) * (A1 + 4*Am + A2)
  const l = parseFloat(length) || 0;
  const a1 = parseFloat(area1) || 0;
  const a2 = parseFloat(area2) || 0;
  const am = parseFloat(areaM) || 0;
  
  const solidVolume = (l / 6) * (a1 + 4 * am + a2);
  
  const bulkPct = parseFloat(bulkingFactor) || 0;
  const shrinkPct = parseFloat(shrinkageFactor) || 0;
  const tCap = parseFloat(truckCapacity) || 0;

  const looseVolume = solidVolume * (1 + bulkPct / 100);
  const compactedVolume = solidVolume * (1 - shrinkPct / 100);
  const truckTrips = tCap > 0 ? Math.ceil(looseVolume / tCap) : 0;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 text-gray-900 font-sans p-6 md:p-8">
      {/* SEO hidden tags for Earthworks, if needed, though typically React Helmet is better. We'll use standard semantic HTML. */}
      
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent pb-1">
            Earthworks & Hauling Estimator
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Calculate accurate excavation volumes using the Prismoidal Formula and estimate hauling constraints.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Inputs Section */}
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Ruler className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Prismoidal Input</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Length (L)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={length}
                    onChange={e => setLength(e.target.value)}
                    placeholder="Enter length..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">End Area 1 (A₁)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                      value={area1}
                      onChange={e => setArea1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">End Area 2 (A₂)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                      value={area2}
                      onChange={e => setArea2(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Middle Area (Aₘ)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
                    value={areaM}
                    onChange={e => setAreaM(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Factors & Hauling</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Swell Factor (%)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                      value={bulkingFactor}
                      onChange={e => setBulkingFactor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Shrink Factor (%)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                      value={shrinkageFactor}
                      onChange={e => setShrinkageFactor(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Truck Capacity (Volume)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                    value={truckCapacity}
                    onChange={e => setTruckCapacity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(79,70,229,0.2)] relative overflow-hidden">
              {/* Decorative background shapes */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-900/40 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Calculation Results</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 p-5 rounded-[1.25rem] border border-white/20 backdrop-blur-sm">
                    <div className="text-blue-100 text-sm font-medium mb-1">Solid Volume (Bank Measure)</div>
                    <div className="text-4xl font-extrabold tracking-tight">
                      {solidVolume.toFixed(2)} <span className="text-xl font-medium text-blue-200">units³</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-[1.25rem] border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="text-blue-100 text-xs font-medium mb-1">Loose Volume (Swell)</div>
                      <div className="text-2xl font-bold">
                        {looseVolume.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-[1.25rem] border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="text-indigo-100 text-xs font-medium mb-1">Compacted Volume</div>
                      <div className="text-2xl font-bold">
                        {compactedVolume.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hauling Summary */}
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Total Truck Trips</h3>
                <p className="text-sm text-gray-500 font-medium">Based on loose volume & capacity</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-4xl font-black text-indigo-600 tracking-tighter">
                  {truckTrips}
                </div>
                <div className="text-gray-400 mt-2">trips</div>
              </div>
            </div>
          </section>

        </div>
        
        {/* Analytics Table */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
             <div className="p-2 bg-gray-50 text-gray-600 rounded-xl">
                <Layers className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold tracking-tight text-gray-800">Earthwork Volume Data Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Parameter</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Value</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">Length</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{l.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">Distance between end sections</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">End Areas</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{a1.toFixed(2)} / {a2.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">A1 and A2</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">Middle Area</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{am.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">Am (used in Prismoidal formula)</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 border-l-2 border-blue-500">Solid Volume</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{solidVolume.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">Bank measure before swell</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 border-l-2 border-indigo-500">Hauling Trips</td>
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">{truckTrips} trips</td>
                  <td className="px-6 py-4 text-gray-500">@ {tCap.toFixed(2)} capacity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
