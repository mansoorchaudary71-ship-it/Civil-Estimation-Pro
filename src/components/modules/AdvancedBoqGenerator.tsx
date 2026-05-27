import React, { useState, useMemo } from "react";
import { Download, Save, Printer, Plus, Trash2, FileSpreadsheet, Building, Calculator, ChevronRight, FileText, Settings2, DollarSign } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useMarketRates } from "../../context/MarketRatesContext";
import { generateBOQExcel, generateBOQPDF } from "../../utils/boq-reports";
import { CalculationHistory } from '../ui/CalculationHistory';

type TradeScope = "Excavation" | "PCC" | "RCC" | "Masonry" | "Plaster" | "Tiles" | "Paint" | "Steel";

type MeasurementRow = {
  id: string;
  description: string;
  nos: number;
  length: number;
  width: number;
  depth: number;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
};

const TRADE_UNITS: Record<TradeScope, string> = {
  Excavation: "cu.m",
  PCC: "cu.m",
  RCC: "cu.m",
  Masonry: "sq.m",
  Plaster: "sq.m",
  Tiles: "sq.m",
  Paint: "sq.m",
  Steel: "kg"
};

const TRADE_RATES_MAP: Record<TradeScope, keyof ReturnType<typeof useMarketRates>['rates']> = {
  Excavation: "laborGrey", // mapping for typescript
  PCC: "cement", // approximate mapping
  RCC: "cement",
  Masonry: "bricks",
  Plaster: "cement",
  Tiles: "tiles",
  Paint: "paint",
  Steel: "steel"
};


export default function AdvancedBoqGenerator() {
  const { settings, formatCurrency } = useSettings();
  const { rates } = useMarketRates();
  
  const [step, setStep] = useState<number>(1);
  
  // Step 1: Detail
  const [projectData, setProjectData] = useState({
    name: "New Residential Project",
    client: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    engineer: "",
    plotSize: "",
    coveredArea: "",
    floors: "1"
  });
  
  const [scopes, setScopes] = useState<TradeScope[]>(["Excavation", "PCC"]);
  const toggleScope = (scope: TradeScope) => {
    setScopes(prev => prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]);
  };
  
  // Step 2 & 3: Measurements
  const [measurements, setMeasurements] = useState<Record<TradeScope, MeasurementRow[]>>({
    Excavation: [], PCC: [], RCC: [], Masonry: [], Plaster: [], Tiles: [], Paint: [], Steel: []
  });

  const getAutoRate = (scope: TradeScope) => {
    const key = TRADE_RATES_MAP[scope];
    return (rates as any)[key] || 0;
  };

  const addRow = (scope: TradeScope) => {
    const newRow: MeasurementRow = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      nos: 1, length: 0, width: 0, depth: 0, quantity: 0,
      unit: TRADE_UNITS[scope],
      rate: getAutoRate(scope),
      amount: 0
    };
    setMeasurements(prev => ({ ...prev, [scope]: [...prev[scope], newRow] }));
  };

  const updateRow = (scope: TradeScope, id: string, field: keyof MeasurementRow, value: any) => {
    setMeasurements(prev => {
      const scopeRows = prev[scope].map(row => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          // Auto calculate logic
          if (["nos", "length", "width", "depth"].includes(field)) {
            // Simplified calculation mapping: n * L * W * D. If 0, assume 1 except NOS.
            const l = updated.length || 1;
            const w = updated.width || 1;
            const d = updated.depth || 1; // Sometimes depth is not used, so if it's 0 we should ignore it rather than multiply by 0
            
            // To be accurate: 
            let qty = Number(updated.nos) || 0;
            if (updated.length) qty *= Number(updated.length);
            if (updated.width) qty *= Number(updated.width);
            if (updated.depth) qty *= Number(updated.depth);
            
            updated.quantity = qty;
          }
          updated.amount = updated.quantity * updated.rate;
          return updated;
        }
        return row;
      });
      return { ...prev, [scope]: scopeRows };
    });
  };

  const deleteRow = (scope: TradeScope, id: string) => {
    setMeasurements(prev => ({
      ...prev,
      [scope]: prev[scope].filter(r => r.id !== id)
    }));
  };

  // Calculations
  const subtotals = useMemo(() => {
    const subs: Record<TradeScope, number> = {} as any;
    scopes.forEach(scope => {
      subs[scope] = measurements[scope].reduce((sum, row) => sum + row.amount, 0);
    });
    return subs;
  }, [measurements, scopes]);

  const grandTotal = useMemo(() => {
    return Object.values(subtotals).reduce((sum, val) => sum + (val || 0), 0);
  }, [subtotals]);

  // Exports
  const handleExportPDF = () => {
    const allItems: any[] = [];
    scopes.forEach(scope => {
      measurements[scope].forEach(row => {
        allItems.push({
          id: row.id,
          division: scope,
          description: row.description,
          unit: row.unit,
          quantity: row.quantity,
          rate: row.rate
        });
      });
    });
    generateBOQPDF(allItems, projectData.name || "Project", grandTotal, 0, 0, grandTotal, settings.currency);
  };

  const handleExportExcel = () => {
     const allItems: any[] = [];
    scopes.forEach(scope => {
      measurements[scope].forEach(row => {
        allItems.push({
          id: row.id,
          division: scope,
          description: row.description,
          unit: row.unit,
          quantity: row.quantity,
          rate: row.rate
        });
      });
    });
    generateBOQExcel(allItems, projectData.name || "Project", grandTotal, 0, 0, grandTotal, settings.currency);
  };

  const StepIndicator = ({ num, title }: { num: number, title: string }) => (
    <div className={`flex items-center gap-2 ${step === num ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === num ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
        {num}
      </div>
      <span className={`font-semibold hidden md:block ${step === num ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>{title}</span>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Building className="w-7 h-7 text-purple-600" />
            Professional BOQ Auto-Generator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive 4-step wizard to generate highly accurate construction BOQs.</p>
        </div>
        
        {/* Stepper Navigation */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
          <StepIndicator num={1} title="Setup" />
          <div className="w-4 md:w-8 h-[2px] bg-slate-200 dark:bg-slate-700"></div>
          <StepIndicator num={2} title="Measure" />
          <div className="w-4 md:w-8 h-[2px] bg-slate-200 dark:bg-slate-700"></div>
          <StepIndicator num={3} title="Rates" />
          <div className="w-4 md:w-8 h-[2px] bg-slate-200 dark:bg-slate-700"></div>
          <StepIndicator num={4} title="Output" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:shadow-none print:border-none">
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-400 border-b border-purple-100 dark:border-purple-900/30 pb-2">Project Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                  <input type="text" value={projectData.name} onChange={e => setProjectData({...projectData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                    <input type="text" value={projectData.client} onChange={e => setProjectData({...projectData, client: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input type="date" value={projectData.date} onChange={e => setProjectData({...projectData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input type="text" value={projectData.location} onChange={e => setProjectData({...projectData, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Engineer</label>
                    <input type="text" value={projectData.engineer} onChange={e => setProjectData({...projectData, engineer: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-400 border-b border-purple-100 dark:border-purple-900/30 pb-2">Site Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plot Size</label>
                    <input type="text" placeholder="e.g. 50x90" value={projectData.plotSize} onChange={e => setProjectData({...projectData, plotSize: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Floors</label>
                    <input type="number" min="1" value={projectData.floors} onChange={e => setProjectData({...projectData, floors: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-400 border-b border-purple-100 dark:border-purple-900/30 pb-2">Select Trade Scope</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(TRADE_UNITS) as TradeScope[]).map(scope => (
                  <label key={scope} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${scopes.includes(scope) ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopes.includes(scope) ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'}`}>
                      {scopes.includes(scope) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{scope}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button disabled={scopes.length===0} onClick={() => setStep(2)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30">
                Continue Setup <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b-2 border-purple-500 pb-2">Measurement Input</h3>
            
            {scopes.map(scope => (
              <div key={scope} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-4 border-b border-purple-200 dark:border-purple-800 flex justify-between items-center">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300">{scope} Measurements</h4>
                  <button onClick={() => addRow(scope)} className="flex items-center gap-1.5 text-sm font-semibold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                </div>
                
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-slate-500 dark:text-slate-400">
                        <th className="pb-3 pr-4 font-semibold w-[35%]">Description</th>
                        <th className="pb-3 pr-4 font-semibold w-16">Nos</th>
                        <th className="pb-3 pr-4 font-semibold w-24">Length</th>
                        <th className="pb-3 pr-4 font-semibold w-24">Width</th>
                        <th className="pb-3 pr-4 font-semibold w-24">Depth</th>
                        <th className="pb-3 pr-4 font-semibold w-24 text-right">Quantity</th>
                        <th className="pb-3 font-semibold text-center w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {measurements[scope].length === 0 && (
                        <tr><td colSpan={7} className="text-center py-6 text-slate-400 italic">No measurements added.</td></tr>
                      )}
                      {measurements[scope].map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 pr-4">
                            <input type="text" placeholder="Item spec..." value={row.description} onChange={(e) => updateRow(scope, row.id, 'description', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500" />
                          </td>
                          <td className="py-2 pr-4">
                            <input type="number" value={row.nos || ""} onChange={(e) => updateRow(scope, row.id, 'nos', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-purple-500" />
                          </td>
                          <td className="py-2 pr-4">
                            <input type="number" placeholder="L" value={row.length || ""} onChange={(e) => updateRow(scope, row.id, 'length', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-purple-500" />
                          </td>
                          <td className="py-2 pr-4">
                            <input type="number" placeholder="W" value={row.width || ""} onChange={(e) => updateRow(scope, row.id, 'width', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-purple-500" />
                          </td>
                          <td className="py-2 pr-4">
                            <input type="number" placeholder="D/H" value={row.depth || ""} onChange={(e) => updateRow(scope, row.id, 'depth', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-purple-500" />
                          </td>
                          <td className="py-2 pr-4 text-right">
                            <div className="bg-slate-200 dark:bg-slate-800 px-3 py-2 rounded-lg font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-normal">{row.unit}</span>
                              {row.quantity.toFixed(2)}
                            </div>
                          </td>
                          <td className="py-2 text-center">
                            <button onClick={() => deleteRow(scope, row.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30">
                Continue to Rates <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b-2 border-purple-500 pb-2">Rate Entry & Overrides</h3>
            <p className="text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm border border-blue-100 dark:border-blue-800">
              Base rates have been auto-populated from Live DB. Review and override if necessary before generating final BOQ.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {scopes.map(scope => {
                if (measurements[scope].length === 0) return null;
                return (
                  <div key={scope} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                      {scope}
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm">
                        <tbody>
                          {measurements[scope].map(row => (
                            <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="p-4 w-1/2">{row.description || <span className="text-slate-400 italic">Unnamed item</span>}</td>
                              <td className="p-4 w-1/6 font-semibold text-slate-600 text-right">{row.quantity.toFixed(2)} {row.unit}</td>
                              <td className="p-4 w-1/6">
                                <div className="relative">
                                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input type="number" value={row.rate} onChange={(e) => updateRow(scope, row.id, 'rate', parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg py-2 pl-8 pr-2 outline-none focus:border-purple-500" />
                                </div>
                              </td>
                              <td className="p-4 w-1/6 text-right font-bold text-purple-700 dark:text-purple-400">
                                {formatCurrency(row.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">Back</button>
              <button onClick={() => setStep(4)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30">
                Generate BOQ <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in duration-500 relative">
            
            {/* Header Actions */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 print:hidden">
              <button onClick={() => setStep(3)} className="px-5 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Edit Rates</button>
              <div className="flex items-center gap-3">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <button onClick={handleExportPDF} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> PDF Report
                </button>
              </div>
            </div>

            {/* Print Output View */}
            <div className="bg-white text-slate-900 border border-slate-200 p-8 sm:p-12 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.05)] print:shadow-none print:border-none print:m-0 print:p-0 w-full max-w-5xl mx-auto font-sans">
              
              <div className="border-b-4 border-purple-800 pb-6 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-purple-900 uppercase tracking-tight mb-2">Bill of Quantities</h1>
                  <h2 className="text-xl font-semibold text-slate-700">{projectData.name}</h2>
                </div>
                <div className="text-right text-sm text-slate-500 space-y-1">
                  <div><span className="font-semibold text-slate-700">Date:</span> {projectData.date}</div>
                  <div><span className="font-semibold text-slate-700">Client:</span> {projectData.client}</div>
                  <div><span className="font-semibold text-slate-700">Ref:</span> BOQ-{new Date().getFullYear()}-{Math.floor(Math.random()*1000)}</div>
                </div>
              </div>

              <div className="flex gap-12 mb-10 text-sm">
                <div className="space-y-2 flex-1">
                  <div className="flex border-b border-slate-100 pb-1"><div className="w-32 font-bold text-slate-700">Location</div><div>{projectData.location}</div></div>
                  <div className="flex border-b border-slate-100 pb-1"><div className="w-32 font-bold text-slate-700">Plot Size</div><div>{projectData.plotSize}</div></div>
                  <div className="flex border-b border-slate-100 pb-1"><div className="w-32 font-bold text-slate-700">Floors</div><div>{projectData.floors}</div></div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex border-b border-slate-100 pb-1"><div className="w-32 font-bold text-slate-700">Prepared By</div><div>{projectData.engineer}</div></div>
                  <div className="flex border-b border-slate-100 pb-1"><div className="w-32 font-bold text-slate-700">Currency</div><div>{settings.currency}</div></div>
                  <div className="flex border-b border-slate-100 pb-1"><div className="w-32 font-bold text-slate-700">Standard</div><div>Civil Estimation Pro</div></div>
                </div>
              </div>

              <table className="w-full text-left text-sm mb-12 empty-cells-show">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 uppercase tracking-wider text-xs border-b-2 border-slate-800">
                    <th className="py-3 px-4 font-bold w-12 text-center">No.</th>
                    <th className="py-3 px-4 font-bold">Description</th>
                    <th className="py-3 px-4 font-bold w-16 text-center">Unit</th>
                    <th className="py-3 px-4 font-bold w-24 text-right">Quantity</th>
                    <th className="py-3 px-4 font-bold w-28 text-right">Rate</th>
                    <th className="py-3 px-4 font-bold w-36 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scopes.map((scope, scopeIdx) => {
                    const rows = measurements[scope];
                    if (rows.length === 0) return null;
                    const sub = subtotals[scope];

                    return (
                      <React.Fragment key={scope}>
                        {/* Section Header */}
                        <tr className="bg-slate-50">
                          <td className="py-3 px-4 font-bold text-purple-900 text-center">{scopeIdx + 1}.0</td>
                          <td colSpan={5} className="py-3 px-4 font-bold text-purple-900 uppercase tracking-wide">{scope} Works</td>
                        </tr>
                        {/* Items */}
                        {rows.map((row, rowIdx) => (
                          <tr key={row.id}>
                            <td className="py-2.5 px-4 text-center text-slate-500">{scopeIdx + 1}.{rowIdx + 1}</td>
                            <td className="py-2.5 px-4 text-slate-800 font-medium">{row.description}</td>
                            <td className="py-2.5 px-4 text-center text-slate-600">{row.unit}</td>
                            <td className="py-2.5 px-4 text-right font-semibold">{row.quantity.toFixed(2)}</td>
                            <td className="py-2.5 px-4 text-right text-slate-600">{row.rate.toFixed(2)}</td>
                            <td className="py-2.5 px-4 text-right font-bold tabular-nums">{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                        {/* Subtotal Row */}
                        <tr className="bg-white">
                          <td colSpan={4}></td>
                          <td className="py-3 px-4 text-right font-bold text-slate-700 bg-slate-50 italic">Subtotal</td>
                          <td className="py-3 px-4 text-right font-bold text-purple-800 bg-slate-50 tabular-nums">
                            {sub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>

              <div className="flex justify-end pt-8 border-t-2 border-slate-800">
                <div className="w-80">
                  <div className="flex justify-between items-center mb-2 text-slate-600">
                    <span className="font-bold uppercase tracking-wider text-sm">Grand Total Amount</span>
                  </div>
                  <div className="text-4xl font-black text-purple-900 tabular-nums flex justify-between items-center bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <span className="text-xl text-purple-600 font-bold">{settings.currency}</span>
                    {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-400 mt-3 italic text-right">Errors and Omissions Excepted. Validate rates before executing works.</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    
      <CalculationHistory calculatorId="advancedboqgenerator_tool" currentInputs={{}} />
</div>
  );
}
