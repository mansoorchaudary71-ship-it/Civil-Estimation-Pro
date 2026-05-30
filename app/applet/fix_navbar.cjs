const fs = require('fs');
let s = fs.readFileSync('src/components/TopNavbar.tsx', 'utf8');

// Header background
s = s.replace(/className=\{\`fixed top-0 left-0 right-0 z-\[110\] transition-all duration-300 \$\{[\s\S]*?\}\`/g, 
  'className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 bg-white border-b border-slate-200 ${scrolled ? "py-3 shadow-sm" : "py-4"}`');

// Text colors
s = s.replace(/text-slate-300 hover:text-white/g, 'text-slate-700 hover:text-slate-900');

// Specifically for the app name
s = s.replace(/scrolled \? \"text-white\" : \"text-white\"/g, 'scrolled ? "text-slate-900" : "text-slate-900"');

// Mobile Hamburger and Bell
s = s.replace(/className=\"p-2 text-white\"/g, 'className="p-2 text-slate-800"');

// There might be some other bg-[#0A0F1E] in mega menu or tool icons? We should be careful. 
// "bg-white/10" in tools dropdown? 
s = s.replace(/bg-white\/10 text-white/g, 'bg-slate-100 text-slate-900'); 
s = s.replace(/bg-[#141b2d]\/80/g, 'bg-white/95');

fs.writeFileSync('src/components/TopNavbar.tsx', s, 'utf8');
