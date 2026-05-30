const fs = require('fs');

let h = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// The main container has classes like: "w-full relative overflow-hidden bg-[#F5F5F7] rounded-[2.5rem] mb-16 pt-16 pb-20 px-6 lg:px-12 mt-8 shadow-2xl border border-slate-200"
// Wait no, in my earlier log it said:
//   "w-full relative overflow-hidden bg-[#F5F5F7] rounded-[2.5rem] mb-16 pt-16 pb-20 px-6 lg:px-12 mt-8 shadow-2xl border border-slate-200"
// And inside it: "absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]"
// And: "absolute inset-0 bg-gradient-to-b from-[#0A0F1E] to-[#1a1f3a] z-0"
// We need to change `rounded-[2.5rem]` to `rounded-b-[2.5rem]`, or just remove `rounded` from the top.
// Also remove `mt-8`.
// Let's replace:
h = h.replace(/rounded-\[2\.5rem\]/g, 'rounded-b-[2.5rem]');
h = h.replace(/mt-8/g, 'mt-0'); 

fs.writeFileSync('src/components/HeroSection.tsx', h, 'utf8');
