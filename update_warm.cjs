const fs = require('fs');
const path = require('path');

function replaceWarm(dirpath) {
  if (!fs.existsSync(dirpath)) return;
  const files = fs.readdirSync(dirpath);
  for (const file of files) {
    const fullPath = path.join(dirpath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceWarm(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We need to apply a warm background (stone-50) and a subtle transition effect (hover:bg-stone-100) to main card backgrounds.
      // Many tool modules use combinations like "bg-white p-6", "bg-white border", "bg-white rounded" for the tool container wrapper.
      // We will replace raw "bg-white" with "bg-stone-50 hover:bg-stone-100 transition-colors duration-500".
      
      content = content.replace(/\bbg-white\b/g, "bg-[#FAFAF8] hover:bg-[#FDFCF9] transition-colors duration-500");
      content = content.replace(/bg-white\/80/g, "bg-[#FAFAF8]/80 hover:bg-[#FDFCF9]/90 transition-colors duration-500");
      content = content.replace(/bg-white\/60/g, "bg-[#FAFAF8]/60 hover:bg-[#FDFCF9]/70 transition-colors duration-500");
      content = content.replace(/bg-white\/90/g, "bg-[#FAFAF8]/90 hover:bg-[#FDFCF9]/95 transition-colors duration-500");
      
      if (content !== fs.readFileSync(fullPath, 'utf8')) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

replaceWarm('./src/components/modules');
replaceWarm('./src/components/ui');

// Also update App.tsx context
let appContent = fs.readFileSync('./src/App.tsx', 'utf8');
appContent = appContent.replace(/\bbg-white\b/g, "bg-[#FAFAF8] transition-colors duration-500");
fs.writeFileSync('./src/App.tsx', appContent, 'utf8');

// Also update Dashboard?
let dashContent = fs.readFileSync('./src/components/Dashboard.tsx', 'utf8');
dashContent = dashContent.replace(/\bbg-white\b/g, "bg-[#FAFAF8] hover:bg-[#FDFCF9] transition-colors duration-500");
fs.writeFileSync('./src/components/Dashboard.tsx', dashContent, 'utf8');

