import * as fs from 'fs';

const filePath = 'src/components/modules/Calculators.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Colors
content = content.replace(/bg-\[\#18181b\]/g, 'bg-white');
content = content.replace(/bg-\[\#09090b\]/g, 'bg-slate-50');
content = content.replace(/border-\[\#27272a\]/g, 'border-slate-200');
content = content.replace(/text-\[\#fafafa\]/g, 'text-slate-900');
content = content.replace(/text-\[\#71717a\]/g, 'text-slate-500');
content = content.replace(/text-\[\#a1a1aa\]/g, 'text-slate-400');
content = content.replace(/text-white/g, 'text-slate-800');
content = content.replace(/hover:text-\[\#a1a1aa\]/g, 'hover:text-slate-700');
content = content.replace(/hover:bg-\[\#202024\]/g, 'hover:bg-slate-50');
content = content.replace(/focus:bg-\[\#09090b\]/g, 'focus:bg-white');

// Focus and accents
content = content.replace(/border-blue-500/g, 'border-indigo-500');
content = content.replace(/text-blue-400/g, 'text-indigo-600');
content = content.replace(/bg-blue-500/g, 'bg-indigo-500');

content = content.replace(/ring-blue-500\/20/g, 'ring-indigo-500/20');
content = content.replace(/focus-within:border-blue-500/g, 'focus-within:border-indigo-500');
content = content.replace(/focus-within:ring-blue-500\/20/g, 'focus-within:ring-indigo-500/20');

// Input fields
const oldInputClass = 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-800 transition-all';
const newInputClass = 'w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition-all shadow-sm';
content = content.replace(new RegExp(oldInputClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newInputClass);

// Select (same)
content = content.replace(/'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500\/20 focus:bg-white text-slate-800 transition-all'/g, `'${newInputClass}'`);

// Labels
const oldLabelClass = 'block text-\\[10px\\] font-semibold uppercase tracking-wider text-slate-500 mb-2';
const newLabelClass = 'block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2';
content = content.replace(new RegExp(oldLabelClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newLabelClass);

// Tabs
const oldTabsClass = 'pb-2 px-1 text-xs font-semibold capitalize border-b-2 transition-colors';
const newTabsClass = 'pb-3 px-4 text-sm font-bold capitalize border-b-2 transition-colors';
content = content.replace(new RegExp(oldTabsClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTabsClass);

content = content.replace(/border-transparent text-slate-500 hover:text-slate-700/g, 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300');

fs.writeFileSync(filePath, content, 'utf-8');
