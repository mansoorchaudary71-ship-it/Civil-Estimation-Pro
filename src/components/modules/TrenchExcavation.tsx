import React, { useState } from 'react';
import { Truck, Calculator, Ruler, Hash, Plus, Layers, ArrowRight, Activity } from 'lucide-react';
import ShareButtonWithPopup from './ShareMenu';
import { useSettings } from '../../context/SettingsContext';
import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';

export default function TrenchExcavationEstimator() {
  const { settings, formatCurrency, convertAmount, convertAmountToRaw } = useSettings();
  const isMetric = settings.measurement === 'SI';
  const unitL = isMetric ? 'm' : 'ft';
  const unitA = isMetric ? 'm²' : 'ft²';
  const unitV = isMetric ? 'm³' : 'ft³';

  const [length, setLength] = useState<string>('100');
  const [bottomWidth, setBottomWidth] = useState<string>('1');
  const [topWidth, setTopWidth] = useState<string>('2');
  const [depth, setDepth] = useState<string>('1.5');
  
  const [pipeDiameter, setPipeDiameter] = useState<string>('');
  const [beddingDepth, setBeddingDepth] = useState<string>('');

  const L = parseFloat(length) || 0;
  const W_b = parseFloat(bottomWidth) || 0;
  const W_t = parseFloat(topWidth) || 0;
  const D = parseFloat(depth) || 0;

  const crossSectionArea = ((W_b + W_t) / 2) * D;
  const totalExcavationVolume = crossSectionArea * L;

  const D_pipe = parseFloat(pipeDiameter) || 0;
  const D_bedding = parseFloat(beddingDepth) || 0;

  let beddingMaterialVolume = 0;
  if (D_bedding > 0 || D_pipe > 0) {
    const pipeVolume = Math.PI * Math.pow(D_pipe / 2, 2) * L;
    const beddingBoxVolume = W_b * D_bedding * L;
    beddingMaterialVolume = Math.max(0, beddingBoxVolume - pipeVolume);
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-10 block">
          <div>
            <h1 className="text-4xl hover:tracking-wide transition-all duration-300 font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent pb-1">
              Trench Excavation Estimator
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Calculate total excavated volume and bedding material using a trapezoidal cross-section.
            </p>
            <div className="mt-5 w-fit"><GlobalSettingsToggle align="left" /></div>
          </div>
          
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                  <Ruler className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Trench Dimensions</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Trench Length (L) [{unitL}]</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-shadow"
                    value={length}
                    onChange={e => setLength(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Bottom Width [{unitL}]</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-shadow"
                      value={bottomWidth}
                      onChange={e => setBottomWidth(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Top Width [{unitL}]</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-shadow"
                      value={topWidth}
                      onChange={e => setTopWidth(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Depth [{unitL}]</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-shadow"
                    value={depth}
                    onChange={e => setDepth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] mt-6">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Bedding Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Pipe Diameter [{unitL}]</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                    value={pipeDiameter}
                    onChange={e => setPipeDiameter(e.target.value)}
                    placeholder={`e.g. 0.3 ${unitL}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Bedding Depth [{unitL}]</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                    value={beddingDepth}
                    onChange={e => setBeddingDepth(e.target.value)}
                    placeholder={`e.g. 0.5 ${unitL}`}
                  />
                </div>
                <p className="text-xs text-gray-400 font-medium px-1">
                  Leave empty if bedding calculation is not required.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-[1.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Results</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 p-5 rounded-[1.25rem] border border-white/20 backdrop-blur-sm">
                    <div className="text-teal-100 text-sm font-medium mb-1">Total Excavated Volume</div>
                    <div className="text-4xl font-extrabold tracking-tight text-white">
                      {totalExcavationVolume.toFixed(2)} <span className="text-xl font-medium text-teal-200">{unitV}</span>
                    </div>
                  </div>

                  {(D_bedding > 0 || D_pipe > 0) && (
                    <div className="bg-white/10 p-5 rounded-[1.25rem] border border-white/20 backdrop-blur-sm transition-all duration-300">
                        <div className="text-indigo-100 text-sm font-medium mb-1">Bedding Material Volume</div>
                        <div className="text-3xl font-extrabold tracking-tight text-white">
                        {beddingMaterialVolume.toFixed(2)} <span className="text-lg font-medium text-indigo-200/70">{unitV}</span>
                        </div>
                    </div>
                  )}

                  <table className="w-full text-left mt-2 border-collapse">
                    <tbody className="divide-y divide-white/10 text-sm font-medium">
                      <tr>
                        <td className="py-3 text-gray-400">Trapezoidal Area</td>
                        <td className="py-3 text-right text-white font-mono">{crossSectionArea.toFixed(2)} {unitA}</td>
                      </tr>
                      {D_pipe > 0 && (
                        <tr>
                          <td className="py-3 text-gray-400">Pipe Volume</td>
                          <td className="py-3 text-right text-white font-mono">{(Math.PI * Math.pow(D_pipe / 2, 2) * L).toFixed(2)} {unitV}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <ShareButtonWithPopup 
              activeTab="Trench Excavation"
              data={{
                "Total Excavated Volume": `${totalExcavationVolume.toFixed(2)} ${unitV}`,
                ...(D_bedding > 0 || D_pipe > 0 ? { "Bedding Volume": `${beddingMaterialVolume.toFixed(2)} ${unitV}` } : {})
              }}
              exportFormat={{
                inputs: {
                  "Length": `${L.toFixed(2)} ${unitL}`,
                  "Bottom Width": `${W_b.toFixed(2)} ${unitL}`,
                  "Top Width": `${W_t.toFixed(2)} ${unitL}`,
                  "Depth": `${D.toFixed(2)} ${unitL}`,
                  "Pipe Diameter": `${D_pipe.toFixed(2)} ${unitL}`,
                  "Bedding Depth": `${D_bedding.toFixed(2)} ${unitL}`,
                },
                breakdown: {
                    "Total Excavated Volume": `${totalExcavationVolume.toFixed(2)} ${unitV}`,
                    ...(D_bedding > 0 || D_pipe > 0 ? { "Bedding Volume": `${beddingMaterialVolume.toFixed(2)} ${unitV}` } : {})
                }
              }}
              title="Trench Excavation Estimator"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
