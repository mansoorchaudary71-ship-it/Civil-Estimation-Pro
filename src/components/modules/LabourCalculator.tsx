import React, { useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  CheckCircle,
  TrendingDown,
  Download,
  CalendarClock
} from "lucide-react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useSettings } from "../../context/SettingsContext";
import { CalculationHistory } from "../ui/CalculationHistory";
import { generateProfessionalPDF } from "../../utils/pdfGenerator";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

interface LabourTask {
  id: string;
  name: string;
  qty: number;
  unit: string;
  rate: number;
  workers: number;
  days: number;
}

const commonTasks = [
  { name: "Excavation", unit: "m³", defaultRate: 350 },
  { name: "Brickwork", unit: "m³", defaultRate: 900 },
  { name: "Plastering", unit: "sqm", defaultRate: 150 },
  { name: "Painting", unit: "sqm", defaultRate: 80 },
  { name: "Concreting", unit: "m³", defaultRate: 500 },
  { name: "Steel Binding", unit: "kg", defaultRate: 8 },
  { name: "Formwork", unit: "sqm", defaultRate: 200 },
  { name: "Custom", unit: "units", defaultRate: 0 },
];

export default function LabourCalculator() {
  const { settings, formatCurrency } = useSettings();
  const [tasks, setTasks] = useState<LabourTask[]>([
    { id: uuidv4(), name: "Excavation", qty: 100, unit: "m³", rate: 350, workers: 4, days: 5 }
  ]);

  const handleAddTask = () => {
    setTasks([...tasks, { id: uuidv4(), name: "Brickwork", qty: 0, unit: "m³", rate: 900, workers: 2, days: 3 }]);
  };

  const handleRemoveTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateTask = (id: string, field: keyof LabourTask, value: any) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        if (field === "name") {
          const preset = commonTasks.find(pt => pt.name === value);
          if (preset) {
            updated.unit = preset.unit;
            updated.rate = preset.defaultRate;
          }
        }
        return updated;
      }
      return t;
    }));
  };

  const calculateTotalProjectCost = () => {
    return tasks.reduce((sum, t) => sum + (t.qty * t.rate), 0);
  };

  const calculateMaxEstimatedDays = () => {
    return Math.max(0, ...tasks.map(t => t.days));
  };

  const calculateSumActualDays = () => {
    return tasks.reduce((sum, t) => sum + (t.days || 0), 0);
  };

  const totalCost = calculateTotalProjectCost();
  // We can interpret daily burn rate either as sequential or concurrent.
  // Sequential total burn rate:
  const sequentialDays = calculateSumActualDays();
  const overallBurnRate = sequentialDays > 0 ? totalCost / sequentialDays : 0;

  const handleExportPDF = async () => {
    const tableData = tasks.map(t => {
      const itemCost = t.qty * t.rate;
      return [
        t.name,
        `${t.qty} @ ${formatCurrency(t.rate)}`,
        t.unit,
        formatCurrency(itemCost).replace(/[^0-9.,]/g, '')
      ];
    });

    const chartData = tasks.map(t => ({
      label: t.name,
      value: t.qty * t.rate,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));

    try {
      const doc = await generateProfessionalPDF({
        title: "Labour & Workforce Estimate",
        toolId: "labour-calculator",
        inputs: {
          "Total Tasks": tasks.length,
          "Total Duration": `${sequentialDays} Days`,
          "Total Workers": tasks.reduce((sum, t) => sum + t.workers, 0)
        },
        tableData,
        chartData,
        grandTotal: totalCost
      });
      doc.save("Labour_Cost_Estimate.pdf");
      toast.success("PDF Downloaded Successfully");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-text-primary p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-slate-200 text-slate-900 rounded-[24px] shadow hover:bg-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Export Bill
            </button>
            <GlobalSettingsToggle align="left" showCurrency={true} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Workspace */}
          <div className="lg:col-span-3 bg-bg-card rounded-[24px] shadow-sm border border-border-color overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-lg text-slate-800">Work Items</h3>
                <button 
                  onClick={handleAddTask}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold rounded-[16px] hover:bg-indigo-100 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task, index) => {
                  const itemCost = task.qty * task.rate;
                  const itemBurnRate = task.days > 0 ? (itemCost / task.days) : 0;
                  const wagePerWorker = (task.workers > 0 && task.days > 0) ? (itemCost / (task.workers * task.days)) : 0;

                  return (
                    <div key={task.id} className="p-5 bg-white border border-slate-200 rounded-[24px] shadow-sm space-y-4 transition-all duration-300 hover:border-indigo-300 relative">
                      {tasks.length > 1 && (
                        <button 
                          onClick={() => handleRemoveTask(task.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="flex items-center gap-3 pr-10">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                          {index + 1}
                        </div>
                        <select 
                          value={task.name}
                          onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                          className="flex-1 bg-transparent border-none text-lg font-bold text-slate-800 focus:ring-0 p-0 cursor-pointer"
                        >
                          {commonTasks.map(ct => (
                            <option key={ct.name} value={ct.name} className="">{ct.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</label>
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              value={task.qty} 
                              onChange={(e) => updateTask(task.id, 'qty', parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-200 rounded-[24px] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-0"
                            />
                            <input 
                              type="text" 
                              value={task.unit} 
                              onChange={(e) => updateTask(task.id, 'unit', e.target.value)}
                              className="w-16 bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-200 rounded-[24px] px-2 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-center text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rate/Unit</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
                                {settings.currency.substring(0,2)}
                            </span>
                            <input 
                              type="number" 
                              value={task.rate} 
                              onChange={(e) => updateTask(task.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-200 rounded-[24px] pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-0"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workers</label>
                          <input 
                            type="number"
                            value={task.workers} 
                            onChange={(e) => updateTask(task.id, 'workers', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-200 rounded-[24px] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Days (Est.)</label>
                          <input 
                            type="number" 
                            value={task.days} 
                            onChange={(e) => updateTask(task.id, 'days', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 border border-slate-200 rounded-[24px] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        </div>
                        
                        <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col justify-end pb-1 lg:items-end">
                           <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 lg:hidden">Item Total</div>
                           <div className="text-lg font-semibold tabular-nums tracking-tight text-indigo-600">
                             {formatCurrency(itemCost)}
                           </div>
                        </div>
                      </div>
                      
                      {/* Sub-analytics for the item */}
                      <div className="pt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-500 bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 p-3 rounded-[24px] border border-slate-100">
                         <div className="flex items-center gap-1.5">
                            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                            Daily Burn: <span className="font-bold text-slate-700">{formatCurrency(itemBurnRate)}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-sky-500" />
                            Est. Per Worker: <span className="font-bold text-slate-700">{formatCurrency(wagePerWorker)}/day</span>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-4">Overall Project Labour</h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{formatCurrency(totalCost)}</p>
                  <p className="text-sm text-slate-500 mt-1">Total Labour Estimate</p>
                </div>
                
                <div className="w-full h-px bg-slate-100"></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-bold text-rose-400 w-full truncate">{formatCurrency(overallBurnRate)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Average Daily Burn</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                      {sequentialDays} <span className="text-xs">Days</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Total Duration</p>
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#F5F5F7]"></div>

                <div>
                   <p className="text-lg font-bold text-sky-400 flex items-center gap-1">
                      {tasks.reduce((sum, t) => sum + t.workers, 0)} <span className="text-xs">Workers</span>
                   </p>
                   <p className="text-xs text-slate-400 mt-0.5">Max Workforce Required</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-6">
              <h3 className="font-bold text-indigo-800 text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Piece-Rate Advice
              </h3>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Piece-rate estimating (by volume/area) reduces risk compared to daily wages. The daily burn rates here are derived from the total piece-rate amount divided by the estimated timeline constraint.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <CalculationHistory
        calculatorId="labour_workforce"
        estimationName="Labour & Workforce Estimate"
        currentInputs={{ tasks: tasks.length }}
        currentResults={{ total: totalCost, burn: overallBurnRate }}
        summaryGeneration={(inputs, res) => `Total: Rs ${res.total} - Tasks: ${inputs.tasks}`}
        onRestore={(savedInputs) => {}}
      />
    </div>
  );
}
