const fs = require('fs');
let h = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
h = h.replace(/rounded-\[2.5rem\]/g, 'rounded-b-[2.5rem]');
h = h.replace(/mt-8/g, 'mt-0');
fs.writeFileSync('src/components/HeroSection.tsx', h, 'utf8');
let s = fs.readFileSync('src/components/TopNavbar.tsx', 'utf8');
s = s.replace(/className=\\{\\`fixed top-0 left-0 right-0 z-\\[110\\] transition-all duration-300 \\$\\{[\\s\\S]*?\\}\\`/g, 
  'className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 bg-white border-b border-slate-200 ${scrolled ? "py-3 shadow-sm" : "py-4"}`}');
s = s.replace(/text-slate-300 hover:text-white/g, 'text-slate-700 hover:text-slate-900');
s = s.replace(/scrolled \\? "text-white" : "text-white"/g, 'scrolled ? "text-slate-900" : "text-slate-900"');
s = s.replace(/className="p-2 text-white"/g, 'className="p-2 text-slate-800"');
fs.writeFileSync('src/components/TopNavbar.tsx', s, 'utf8');