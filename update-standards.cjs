const fs = require('fs');
let code = fs.readFileSync('src/components/StandardsReferencePage.tsx', 'utf8');

// Theming changes
code = code.replace(/bg-\[#0A0F1E\]/g, 'bg-[#FAF8F5]');
code = code.replace(/bg-gradient-to-b from-\[#0D1525\] to-\[#0A0F1E\]/g, 'bg-[#FAF8F5]');
code = code.replace(/bg-\[#0D1525\]/g, 'bg-white');
code = code.replace(/border-slate-800\/60/g, 'border-[#E8E4D9]');
code = code.replace(/border-slate-800/g, 'border-[#E8E4D9]');
code = code.replace(/text-slate-400/g, 'text-[#8B8476]');
code = code.replace(/text-slate-300/g, 'text-[#6A6458]');
code = code.replace(/text-slate-500/g, 'text-[#A39D93]');
code = code.replace(/text-slate-700/g, 'text-[#4A443B]');
code = code.replace(/text-white/g, 'text-[#4A443B]');
code = code.replace(/bg-slate-800\/60/g, 'bg-white');
code = code.replace(/bg-slate-800\/80/g, 'bg-white');
code = code.replace(/bg-slate-800/g, 'bg-white');
code = code.replace(/border-slate-700\/50/g, 'border-[#E8E4D9]');
code = code.replace(/text-slate-900/g, 'text-[#4A443B]');
code = code.replace(/bg-slate-700/g, 'bg-[#F2EFE9]');
code = code.replace(/bg-slate-900\/50/g, 'bg-[#F2EFE9]');

fs.writeFileSync('src/components/StandardsReferencePage.tsx', code);
