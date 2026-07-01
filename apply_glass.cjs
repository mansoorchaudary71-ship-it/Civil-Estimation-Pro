const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    let stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  });
}

walk('src', (filepath) => {
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf-8');
    let original = content;

    // Replace generic flat backgrounds with glassmorphism
    // Old: bg-white border border-slate-100 rounded-2xl p-6 shadow-sm
    content = content.replace(/bg-white border border-slate-100 rounded-2xl p-6 shadow-sm/g, 'bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-sm');
    content = content.replace(/bg-white border border-slate-100 rounded-3xl p-5 shadow-sm/g, 'bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-sm');
    content = content.replace(/bg-white border-t border-slate-100/g, 'bg-white/70 backdrop-blur-md border-t border-white/20');
    content = content.replace(/bg-white p-6 md:p-8 rounded-\[2rem\] shadow-\[0_10px_40px_rgb\(0,0,0,0\.04\)\] border border-slate-100/g, 'bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-white/20');
    content = content.replace(/bg-white \[\#161c2e\]\/70 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-slate-100/g, 'bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/20');
    content = content.replace(/bg-white border border-slate-200 shadow-sm/g, 'bg-white/70 backdrop-blur-md border border-white/20 shadow-sm');

    // Hero section
    content = content.replace(/bg-white\/90 backdrop-blur-sm border border-gray-200/g, 'bg-white/70 backdrop-blur-md border border-white/20');
    content = content.replace(/bg-white\/90 backdrop-blur-xl border border-gray-100 shadow-2xl/g, 'bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl');
    
    // Convert old CTAs (#FF5F15 and orange to deep blue/teal)
    // Deep vivid blue: #0ea5e9 or #2563eb (blue-600)
    content = content.replace(/bg-\[\#FF5F15\]/g, 'bg-blue-600');
    content = content.replace(/text-\[\#FF5F15\]/g, 'text-blue-600');
    content = content.replace(/border-t-orange-500/g, 'border-t-blue-600');
    content = content.replace(/border-orange-100/g, 'border-blue-100');
    content = content.replace(/shadow-\[0_4px_14px_rgba\(255,95,21,0\.3\)\]/g, 'shadow-[0_4px_14px_rgba(37,99,235,0.3)]');
    content = content.replace(/hover:shadow-\[0_6px_20px_rgba\(255,95,21,0\.4\)\]/g, 'hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]');
    content = content.replace(/hover:bg-\[\#ea580c\]/g, 'hover:bg-blue-700');
    content = content.replace(/bg-orange-50/g, 'bg-blue-50');
    content = content.replace(/text-orange-600/g, 'text-blue-600');
    content = content.replace(/text-orange-700/g, 'text-blue-700');
    content = content.replace(/text-orange-500/g, 'text-blue-500');
    content = content.replace(/bg-orange-100/g, 'bg-blue-100');
    content = content.replace(/bg-orange-500/g, 'bg-blue-600');
    content = content.replace(/bg-orange-600/g, 'bg-blue-700');
    content = content.replace(/ring-orange-500/g, 'ring-blue-600');
    content = content.replace(/border-orange-500/g, 'border-blue-600');
    content = content.replace(/border-orange-200/g, 'border-blue-200');
    content = content.replace(/from-orange-50/g, 'from-blue-50');
    content = content.replace(/to-orange-100/g, 'to-blue-100');

    // Check Hero CTA specifics
    content = content.replace(/focus:ring-2/g, 'focus:ring-2 focus:ring-blue-500 focus:outline-none');
    
    // Find generic "bg-white" and replace with "bg-white/70 backdrop-blur-md border border-white/20" if it's a card
    // We'll leave the more specific ones or do manual regex

    if (content !== original) {
      fs.writeFileSync(filepath, content);
    }
  }
});
