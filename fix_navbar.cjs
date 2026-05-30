const fs = require('fs');

let str = fs.readFileSync('src/components/TopNavbar.tsx', 'utf8');

str = str.replace(
  'className="btn-micro bg-[#F59E0B] hover:bg-[#fbbf24] text-slate-900 font-bold px-6 py-2.5 rounded-full shadow-[0_4px_16px_-4px_rgba(245,158,11,0.5)] hover:shadow-[0_8px_20px_-4px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-2"',
  'className="btn-micro bg-white hover:bg-slate-50 text-slate-900 font-semibold px-7 py-2.5 rounded hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-transform flex items-center justify-center gap-2"'
);

fs.writeFileSync('src/components/TopNavbar.tsx', str);
