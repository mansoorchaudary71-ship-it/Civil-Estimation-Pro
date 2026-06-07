const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/@layer base {[\s\S]*?}/, `@layer base {
  html, body, #root {
    background-color: #FFFFFF !important;
    background-image: linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px) !important;
    background-size: 40px 40px !important;
    color: #0F172A !important;
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif !important;
    letter-spacing: -0.01em !important;
    min-height: 100vh;
  }

  /* Force light theme across all routes without patching every file */
  .dark,
  [class*="bg-[#0B1120]"],
  [class*="bg-[#0A0F1E]"],
  [class*="bg-[#111827]"],
  [class*="bg-[#1E293B]"],
  [class*="bg-[#0F172A]"],
  [class*="bg-[#252525]"],
  [class*="dark:bg-[#"],
  [class*="dark:bg-slate-900"],
  [class*="dark:bg-slate-800"],
  [class*="bg-slate-900"],
  [class*="bg-slate-800"] {
    background-color: #FFFFFF !important;
  }

  /* Text overrides */
  [class*="text-[#E2E8F0]"],
  [class*="text-[#F1F5F9]"],
  [class*="text-[#94A3B8]"],
  [class*="text-slate-400"],
  [class*="text-slate-300"],
  [class*="text-slate-200"],
  [class*="text-white"] {
    color: #334155 !important;
  }

  /* Border overrides */
  [class*="border-[rgba(255,255,255,"] {
    border-color: #E2E8F0 !important;
  }
}`);

// Also remove Fix 1 which enforces dark backgrounds
css = css.replace(/\/\* FIX 1: Unify background theme — remove white tool grid \*\/[\s\S]*?\.tool-card {/, '.tool-card {');
css = css.replace(/background-color: #0B1120 !important;\s*color: #E2E8F0 !important;/g, '');

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Updated index.css');
