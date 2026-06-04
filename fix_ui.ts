import * as fs from 'fs';
let code = fs.readFileSync('src/components/modules/UnitConverter.tsx', 'utf-8');

const replacementCategories = `const categories: { id: Category; label: string; icon: any; color: string }[] = [
  { id: "Length", label: "Length", icon: Ruler, color: "text-emerald-500 bg-emerald-100/50 " },
  { id: "Area", label: "Area", icon: Square, color: "text-blue-500 bg-blue-100/50 " },
  { id: "Volume", label: "Volume", icon: Box, color: "text-purple-500 bg-purple-100/50 " },
  { id: "Mass", label: "Mass (Weignt)", icon: Scale, color: "text-rose-500 bg-rose-100/50 " },
  { id: "Density", label: "Density", icon: Droplets, color: "text-teal-500 bg-teal-100/50 " },
  { id: "Force", label: "Force", icon: Hammer, color: "text-orange-500 bg-orange-100/50 " },
  { id: "Pressure & Stress", label: "Pressure / Stress", icon: Gauge, color: "text-red-500 bg-red-100/50 " },
  { id: "Torque & Moment", label: "Torque / Moment", icon: RotateCcw, color: "text-indigo-600 bg-indigo-50/50 " },
  { id: "Velocity", label: "Velocity", icon: GaugeCircle, color: "text-sky-500 bg-sky-100/50 " },
  { id: "Angle", label: "Angle", icon: Compass, color: "text-yellow-500 bg-yellow-100/50 " },
  { id: "Temperature", label: "Temperature", icon: Thermometer, color: "text-pink-500 bg-pink-100/50 " },
  { id: "Energy & Work", label: "Energy & Work", icon: Wrench, color: "text-fuchsia-500 bg-fuchsia-100/50 " },
  { id: "Power", label: "Power", icon: Zap, color: "text-amber-500 bg-amber-100/50 " },
  { id: "Volumetric Flow", label: "Volumetric Flow", icon: Wind, color: "text-cyan-500 bg-cyan-100/50 " },
  { id: "Dynamic Viscosity", label: "Dynamic Viscosity", icon: FlaskConical, color: "text-violet-500 bg-violet-100/50 " }
];`;

code = code.replace(/const categories: \{ id: Category; label: string; icon: any; color: string \}.*?\];/s, replacementCategories);

// Find the UI classes for inputs to add some glassmorphism
// "bg-bg-card rounded-[2.5rem] p-8 md:p-12 border border-border-color shadow-xl shadow-slate-200/50"
const uiPattern1 = /bg-bg-card rounded-\[2\.5rem\] p-8 md:p-12 border border-border-color shadow-xl shadow-slate-200\/50/g;
code = code.replace(uiPattern1, 'bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-slate-700/50 shadow-2xl overflow-hidden relative');

const uiPattern2 = /flex-1 w-full bg-transparent rounded-\[24px\] border border-slate-200 shadow-sm text-slate-800 p-6 md:p-8 rounded-\[2rem\] border border-border-color transition-all hover:border-fuchsia-300/g;
code = code.replace(uiPattern2, 'flex-1 w-full bg-slate-800/40 backdrop-blur-xl rounded-[2rem] border border-slate-700 shadow-inner p-6 md:p-8 transition-all hover:border-fuchsia-500/50 hover:bg-slate-800/60 flex flex-col items-center justify-center relative');

code = code.replace(/text-slate-800/g, 'text-slate-100');

code = code.replace(/className=\"block text-xs font-bold text-fuchsia-600 uppercase tracking-widest mb-4\"/g, 'className="block text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-4 drop-shadow-md z-10"');

const selectPattern = /className=\"w-full bg-bg-card border border-border-color text-text-primary px-4 py-3 rounded-\[24px\] font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500\/20 focus:border-fuchsia-500 transition-all outline-none\"/g;
code = code.replace(selectPattern, 'className="w-full bg-slate-950/50 border border-slate-600 text-slate-100 px-4 py-3 rounded-[24px] font-bold text-sm mb-6 focus:ring-4 focus:ring-fuchsia-500/30 focus:border-fuchsia-500 transition-all outline-none shadow-inner z-10"');


const inputPattern = /className=\"w-full bg-transparent border-0 text-\[clamp\(1\.75rem,5vw,2\.5rem\)\] break-all sm:text-\[clamp\(1\.75rem,5vw,2\.5rem\)\] break-all font-semibold tabular-nums tracking-tight text-text-primary placeholder-slate-300 focus:ring-0 focus:outline-none p-0 text-center whitespace-nowrap\"/g;
code = code.replace(inputPattern, 'className="w-full bg-transparent border-0 text-[clamp(1.75rem,5vw,2.5rem)] font-bold tabular-nums tracking-tight text-white placeholder-white/20 focus:ring-0 focus:outline-none p-0 text-center drop-shadow-lg z-10"');

const toValuePattern = /className=\"w-full overflow-hidden text-center text-\[clamp\(1\.75rem,5vw,2\.5rem\)\] break-all sm:text-\[clamp\(1\.75rem,5vw,2\.5rem\)\] break-all font-semibold tabular-nums tracking-tight text-text-primary py-2\"/g;
code = code.replace(toValuePattern, 'className="w-full overflow-hidden text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold tabular-nums tracking-tight text-white py-2 drop-shadow-lg z-10"');

code = code.replace(/text-text-primary/g, 'text-slate-100');
code = code.replace(/bg-fuchsia-50/g, 'bg-fuchsia-900/30');
code = code.replace(/text-fuchsia-700/g, 'text-fuchsia-300');
code = code.replace(/border-fuchsia-100/g, 'border-fuchsia-500/30');

fs.writeFileSync('src/components/modules/UnitConverter.tsx', code);
