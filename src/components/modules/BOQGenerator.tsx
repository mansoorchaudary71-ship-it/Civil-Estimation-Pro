import React, { useState, useMemo } from "react";
import { MaterialSummary } from "../ui/MaterialSummary";
import {
  FileDown,
  FileText,
  Plus,
  Trash2,
  Save,
  Download,
  Settings2,
  FileSpreadsheet,
  Percent,
  Calculator,
  FileOutput,
} from "lucide-react";
import { formatCurrency } from "../../utils/unitConverter";

interface BOQItem {
  id: string;
  division: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
}

const DEFAULT_DIVISIONS = [
  "01 - General Requirements",
  "02 - Site Work & Earthwork",
  "03 - Concrete",
  "04 - Masonry",
  "05 - Metals",
  "06 - Wood & Plastics",
  "07 - Thermal & Moisture Protection",
  "08 - Doors & Windows",
  "09 - Finishes (Plaster, Flooring, Paint)",
  "15 - Mechanical / Plumbing",
  "16 - Electrical",
];

const STANDARD_TEMPLATES: Record<string, BOQItem[]> = {
  "Residential House": [
    {
      id: "1",
      division: "02 - Site Work & Earthwork",
      description: "Excavation for foundation",
      unit: "m³",
      quantity: 120,
      rate: 15,
    },
    {
      id: "2",
      division: "03 - Concrete",
      description: "PCC (1:4:8) for foundation bed",
      unit: "m³",
      quantity: 15,
      rate: 85,
    },
    {
      id: "3",
      division: "03 - Concrete",
      description: "RCC (1:2:4) in columns, beams, slab",
      unit: "m³",
      quantity: 65,
      rate: 150,
    },
    {
      id: "4",
      division: "04 - Masonry",
      description: "First class brickwork in cement mortar (1:6)",
      unit: "m³",
      quantity: 85,
      rate: 110,
    },
    {
      id: "5",
      division: "09 - Finishes (Plaster, Flooring, Paint)",
      description: "Internal Plastering (1:4)",
      unit: "m²",
      quantity: 450,
      rate: 12,
    },
    {
      id: "6",
      division: "09 - Finishes (Plaster, Flooring, Paint)",
      description: "Vitrified Tile Flooring",
      unit: "m²",
      quantity: 120,
      rate: 35,
    },
  ],
  "Boundary Wall": [
    {
      id: "1",
      division: "02 - Site Work & Earthwork",
      description: "Trench excavation",
      unit: "m³",
      quantity: 45,
      rate: 12,
    },
    {
      id: "2",
      division: "03 - Concrete",
      description: "PCC Foundation base",
      unit: "m³",
      quantity: 10,
      rate: 80,
    },
    {
      id: "3",
      division: "04 - Masonry",
      description: '9" brick wall',
      unit: "m³",
      quantity: 38,
      rate: 105,
    },
    {
      id: "4",
      division: "09 - Finishes (Plaster, Flooring, Paint)",
      description: "External Plaster",
      unit: "m²",
      quantity: 200,
      rate: 14,
    },
  ],
  "Road 1km": [
    {
      id: "1",
      division: "02 - Site Work & Earthwork",
      description: "Clearing and grubbing",
      unit: "m²",
      quantity: 15000,
      rate: 2,
    },
    {
      id: "2",
      division: "02 - Site Work & Earthwork",
      description: "Subgrade preparation",
      unit: "m³",
      quantity: 5000,
      rate: 8,
    },
    {
      id: "3",
      division: "03 - Concrete",
      description: "Granular Sub Base (GSB)",
      unit: "m³",
      quantity: 2500,
      rate: 25,
    },
    {
      id: "4",
      division: "03 - Concrete",
      description: "Wet Mix Macadam (WMM)",
      unit: "m³",
      quantity: 1500,
      rate: 35,
    },
    {
      id: "5",
      division: "09 - Finishes (Plaster, Flooring, Paint)",
      description: "Bituminous Macadam (BM)",
      unit: "m³",
      quantity: 700,
      rate: 120,
    },
    {
      id: "6",
      division: "09 - Finishes (Plaster, Flooring, Paint)",
      description: "Asphalt Concrete (AC)",
      unit: "m³",
      quantity: 400,
      rate: 150,
    },
  ],
};

export default function BOQGenerator() {
  const [items, setItems] = useState<BOQItem[]>([]);
  const [contingencyPct, setContingencyPct] = useState(5);
  const [gstPct, setGstPct] = useState(18);
  const [projectName, setProjectName] = useState("Untitled Project BOQ");

  const handleAddItem = () => {
    const newItem: BOQItem = {
      id: Math.random().toString(36).substr(2, 9),
      division: DEFAULT_DIVISIONS[0],
      description: "",
      unit: "m³",
      quantity: 0,
      rate: 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (
    id: string,
    field: keyof BOQItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const loadTemplate = (templateName: string) => {
    if (STANDARD_TEMPLATES[templateName]) {
      setItems(
        STANDARD_TEMPLATES[templateName].map((i) => ({
          ...i,
          id: Math.random().toString(36).substr(2, 9),
        })),
      );
      setProjectName(`${templateName} BOQ`);
    }
  };

  // Group items by division
  const groupedItems = useMemo(() => {
    const groups: Record<string, BOQItem[]> = {};
    items.forEach((item) => {
      if (!groups[item.division]) groups[item.division] = [];
      groups[item.division].push(item);
    });
    // Sort divisions
    return Object.keys(groups)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = groups[key];
          return acc;
        },
        {} as Record<string, BOQItem[]>,
      );
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const contingencyAmount = subtotal * (contingencyPct / 100);
  const taxableAmount = subtotal + contingencyAmount;
  const gstAmount = taxableAmount * (gstPct / 100);
  const grandTotal = taxableAmount + gstAmount;

  const exportCSV = () => {
    let csv = "Division,Description,Unit,Quantity,Rate,Amount\n";
    items.forEach((item) => {
      csv += `"${item.division}","${item.description}","${item.unit}",${item.quantity},${item.rate},${item.quantity * item.rate}\n`;
    });
    csv += `\nSubtotal,,,,,${subtotal}\n`;
    csv += `Contingency (${contingencyPct}%),,,,,${contingencyAmount}\n`;
    csv += `GST (${gstPct}%),,,,,${gstAmount}\n`;
    csv += `Grand Total,,,,,${grandTotal}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${projectName.replace(/\s+/g, "_")}_BOQ.csv`;
    link.href = url;
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[12px] border border-slate-200 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-[12px]">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-[18px] sm:text-[28px] font-black text-slate-800 dark:text-white bg-transparent border-none outline-none hover:bg-slate-50 dark:hover:bg-[#6B46C1] rounded-[12px] px-2 py-1 -ml-2 transition-colors w-full max-w-md"
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">
              Professional Bill of Quantities Generator
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            onChange={(e) => {
              if (e.target.value) loadTemplate(e.target.value);
              e.target.value = "";
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#6B46C1] dark:hover:bg-[#6B46C1] text-slate-700 dark:text-slate-300 font-bold rounded-[12px] outline-none transition-colors border border-slate-200 dark:border-slate-700"
          >
            <option value="">Load Template...</option>
            {Object.keys(STANDARD_TEMPLATES).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold rounded-[12px] transition-colors border border-emerald-200 dark:border-emerald-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-[#6B46C1] hover:bg-[#6B46C1] text-white font-bold rounded-[12px] transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          >
            <FileOutput className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#6B46C1]/30">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> BOQ Items
              </h3>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6B46C1] text-white font-bold rounded-[12px] text-sm hover:bg-[#6B46C1] transition"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-[#6B46C1]/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                    <th className="p-4 w-48">Division</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 w-24">Unit</th>
                    <th className="p-4 w-28 text-right">Quantity</th>
                    <th className="p-4 w-32 text-right">Rate</th>
                    <th className="p-4 w-32 text-right">Amount</th>
                    <th className="p-4 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-12 text-center text-slate-400 font-medium border-t border-dashed border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50"
                      >
                        No items added yet. Click "Add Item" or load a template.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(groupedItems).map(([division, divItems]) => (
                      <React.Fragment key={division}>
                        <tr className="bg-slate-50/80 dark:bg-[#6B46C1]/30 border-y border-slate-200 dark:border-slate-800">
                          <td
                            colSpan={7}
                            className="px-4 py-2.5 font-bold text-indigo-700 dark:text-indigo-400 text-sm"
                          >
                            {division}
                          </td>
                        </tr>
                        {divItems.map((item, idx) => (
                          <tr
                            key={item.id}
                            className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-[#6B46C1]/20 transition-colors"
                          >
                            <td className="p-2 align-top">
                              <select
                                value={item.division}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "division",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 bg-transparent text-xs font-semibold rounded outline-none border border-transparent focus:border-indigo-300 dark:focus:border-[#6B46C1] focus:bg-white dark:focus:bg-[#6B46C1] transition-all truncate"
                              >
                                {DEFAULT_DIVISIONS.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                                {!DEFAULT_DIVISIONS.includes(item.division) && (
                                  <option value={item.division}>
                                    {item.division}
                                  </option>
                                )}
                              </select>
                            </td>
                            <td className="p-2 align-top">
                              <textarea
                                value={item.description}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Item description..."
                                className="w-full p-2 bg-transparent text-sm font-medium rounded outline-none border border-transparent focus:border-indigo-300 dark:focus:border-[#6B46C1] focus:bg-white dark:focus:bg-[#6B46C1] transition-all resize-none min-h-[40px]"
                                rows={1}
                              />
                            </td>
                            <td className="p-2 align-top">
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "unit",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 bg-transparent text-sm rounded outline-none border border-transparent focus:border-indigo-300 dark:focus:border-[#6B46C1] focus:bg-white dark:focus:bg-[#6B46C1] transition-all"
                              />
                            </td>
                            <td className="p-2 align-top">
                              <input
                                type="number"
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "quantity",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="w-full p-2 bg-transparent text-sm text-right font-bold rounded outline-none border border-transparent focus:border-indigo-300 dark:focus:border-[#6B46C1] focus:bg-white dark:focus:bg-[#6B46C1] transition-all"
                              />
                            </td>
                            <td className="p-2 align-top text-right">
                              <div className="flex items-center">
                                <span className="text-slate-400 ml-2">$</span>
                                <input
                                  type="number"
                                  value={item.rate || ""}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      item.id,
                                      "rate",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-full p-2 bg-transparent text-sm text-right font-bold text-emerald-600 dark:text-emerald-400 rounded outline-none border border-transparent focus:border-indigo-300 dark:focus:border-[#6B46C1] focus:bg-white dark:focus:bg-[#6B46C1] transition-all"
                                />
                              </div>
                            </td>
                            <td className="p-4 align-top text-right font-black text-slate-800 dark:text-white tabular-nums">
                              {(item.quantity * item.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="p-2 align-top text-center">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-[12px] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-[4px] border-l-[#6B46C1] p-6 rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] relative overflow-hidden">
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-5 dark:opacity-5 text-slate-800 dark:text-white"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            ></div>

            <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2 relative z-10">
              <Settings2 className="w-5 h-5 text-[#6B46C1]" /> Financial
              Summary
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-white tabular-nums">
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    Contingency <Percent className="w-3 h-3" />
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={contingencyPct}
                      onChange={(e) =>
                        setContingencyPct(Number(e.target.value) || 0)
                      }
                      className="w-12 px-1 py-0.5 bg-slate-50 dark:bg-[#6B46C1] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded text-right text-xs"
                    />
                    <span className="font-bold tabular-nums text-orange-500">
                      +$
                      {contingencyAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Taxable Amount</span>
                  <span className="font-bold text-slate-800 dark:text-white tabular-nums">
                    ${taxableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    GST/VAT <Percent className="w-3 h-3" />
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={gstPct}
                      onChange={(e) => setGstPct(Number(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 bg-slate-50 dark:bg-[#6B46C1] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded text-right text-xs"
                    />
                    <span className="font-bold tabular-nums text-rose-500 dark:text-rose-400">
                      +$
                      {gstAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Grand Total
                </span>
                <p className="text-[28px] font-black bg-gradient-to-r from-[#6B46C1] to-[#F97316] bg-clip-text text-transparent mt-1 tabular-nums tracking-tight">
                  $
                  {grandTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <MaterialSummary
            title="Summary Stats"
            totalValue={items.length}
            totalUnit="Items"
          >
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white dark:bg-[#6B46C1] p-4 rounded-[12px] border border-slate-100 dark:border-slate-700">
                <div className="text-[12px] font-medium text-[#6B7280] uppercase text-[#4B5563] mb-1">
                  Divisions
                </div>
                <div className="text-[18px] font-black text-indigo-600 dark:text-indigo-400">
                  {Object.keys(groupedItems).length}
                </div>
              </div>
              <div className="bg-white dark:bg-[#6B46C1] p-4 rounded-[12px] border border-slate-100 dark:border-slate-700">
                <div className="text-[12px] font-medium text-[#6B7280] uppercase text-[#4B5563] mb-1">
                  Total QTY
                </div>
                <div className="text-[18px] font-black text-emerald-600 dark:text-emerald-400">
                  {items
                    .reduce((s, i) => s + i.quantity, 0)
                    .toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </MaterialSummary>
        </div>
      </div>
    </div>
  );
}
