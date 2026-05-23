const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // TYPOGRAPHY
            // Page titles (usually h1, textual classes like text-3xl) -> 28px (#1A1A2E)
            content = content.replace(/text-3xl|text-4xl/g, 'text-[28px]');
            // Section headers (h2, h3 usually text-xl, text-2xl) -> 18px (#374151)
            content = content.replace(/text-xl|text-2xl/g, 'text-[18px]');
            content = content.replace(/text-slate-800(?! dark:)/g, 'text-[#374151]');
            // Labels (text-sm font-bold uppercase) -> 12px Medium #6B7280
            content = content.replace(/text-sm font-bold.*?uppercase/g, 'text-[12px] font-medium text-[#6B7280] uppercase');
            content = content.replace(/text-xs font-bold.*?uppercase/g, 'text-[12px] font-medium text-[#6B7280] uppercase');
            // Body text
            content = content.replace(/text-slate-500(?! dark:)/g, 'text-[#4B5563]');
            
            // CARDS
            // Replace rounded classes
            content = content.replace(/rounded-(?:3xl|2xl|xl|lg|md|\[\d+rem\]|\[\d+px\])/g, 'rounded-[12px]');
            // Shadow
            content = content.replace(/shadow-(?:sm|md|lg|xl)/g, 'shadow-[0_2px_12px_rgba(0,0,0,0.08)]');
            // Hover effect on cards (if it has hover:shadow)
            content = content.replace(/hover:shadow(?:-md|-lg|-xl|)/g, 'transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]');
            // Padding uniform 20px for major containers identified by bg-bg-card
            content = content.replace(/bg-bg-card([^>]*?)p-(?:6|8|4|5|10|12)\b/g, 'bg-bg-card$1p-[20px]');
            // Also handle if padding comes before bg-bg-card
            content = content.replace(/p-(?:6|8|4|5|10|12)\b([^>]*?)bg-bg-card/g, 'p-[20px]$1bg-bg-card');
            
            // Inputs: Height 44px (h-11), 1.5px solid #E5E7EB, focus #6B46C1, 8px radius, 14px text
            // Replace standard input classes. Usually they have `px-4 py-3`, `focus:ring-X`.
            content = content.replace(/focus:border-(?:blue|indigo|emerald|orange|cyan|fuchsia)-(?:500|400|600)/g, 'focus:border-[#6B46C1]');
            content = content.replace(/focus:ring-(?:blue|indigo|emerald|orange|cyan|fuchsia)-(?:500|400|600)(?:\/50|\/20)?/g, 'focus:ring-[#6B46C1]');

            // Buttons: Purple #6B46C1
            // Primary Buttons (usually bg-slate-800, bg-indigo-600, bg-blue-600)
            content = content.replace(/bg-(?:blue|indigo|slate)-(?:600|800|700)\b/g, 'bg-[#6B46C1]');
            content = content.replace(/hover:bg-(?:blue|indigo|slate)-(?:700|900|800)\b/g, 'hover:bg-[#5a3a9f]');
            
            // Result values (gradient text)
            // Current ResultCard uses: text-[clamp(1.5rem,7vw,3rem)] ... bg-gradient-to-br from-[#6B46C1] to-orange-500
            // We want 32-48px Bold gradient purple-to-orange
            content = content.replace(/from-\[#6B46C1\] to-(?:orange|rose)-500/g, 'from-[#6B46C1] to-[#F97316]');
            content = content.replace(/text-\[clamp.*?\]/g, 'text-[32px] md:text-[48px]');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

// Apply overrides directly to index.css
const indexCssPath = path.join(__dirname, 'src/index.css');
if (fs.existsSync(indexCssPath)) {
    const overrideCode = `

/* === STRICT UI REDESIGN STANDARDS (Civil Estimation Pro) === */
@layer utilities {
  /* BACKGROUND */
  body, #root { background: #F8F7FF !important; background-image: none !important; color: #4B5563 !important; }
  .dark body, .dark #root { background: #0F0F1A !important; }
  
  /* TYPOGRAPHY */
  h1 { font-size: 28px !important; font-weight: 700 !important; color: #1A1A2E !important; }
  .dark h1 { color: #FFFFFF !important; }
  h2, h3, h4, h5, h6 { font-size: 18px !important; font-weight: 600 !important; color: #374151 !important; }
  .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 { color: #E2E8F0 !important; }
  label, .label-text { font-size: 12px !important; font-weight: 500 !important; text-transform: uppercase !important; color: #6B7280 !important; }
  
  /* RESULT PANELS */
  .result-card, [class*="border-l-[4px]"] { background-color: #FFFFFF !important; border-left: 4px solid #6B46C1 !important; border-radius: 12px !important; padding: 20px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important; border-top: none !important; border-right: none !important; border-bottom: none !important; }
  .dark .result-card, .dark [class*="border-l-[4px]"] { background-color: #1A1A2E !important; }
  
  /* RESULT VALUES */
  .result-value, [class*="text-\[clamp"] { font-size: clamp(32px, 5vw, 48px) !important; font-weight: 700 !important; background: linear-gradient(90deg, #6B46C1, #F97316) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; color: transparent !important; }
  
  /* CARDS */
  .bg-bg-card, .card { background-color: #FFFFFF !important; border-radius: 12px !important; padding: 20px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important; border: none !important; transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
  .dark .bg-bg-card, .dark .card { background-color: #1A1A2E !important; }
  .bg-bg-card:hover, .card:hover { transform: translateY(-2px) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important; }
  
  /* INPUT FIELDS */
  input[type="text"], input[type="number"], input[type="email"], select, textarea { height: 44px !important; border: 1.5px solid #E5E7EB !important; border-radius: 8px !important; font-size: 14px !important; background-color: #FFFFFF !important; transition: all 0.2s ease !important; padding: 0 16px !important; color: #4B5563 !important; }
  textarea { height: auto !important; min-height: 88px !important; padding: 12px 16px !important; }
  .dark input[type="text"], .dark input[type="number"], .dark input[type="email"], .dark select, .dark textarea { background-color: #0F0F1A !important; border-color: #2E2E48 !important; color: white !important; }
  input[type="text"]:focus, input[type="number"]:focus, input[type="email"]:focus, select:focus, textarea:focus { border-color: #6B46C1 !important; box-shadow: 0 0 0 1px #6B46C1 !important; outline: none !important; }
}
`;
    if (!fs.readFileSync(indexCssPath, 'utf8').includes('STRICT UI REDESIGN STANDARDS')) {
        fs.appendFileSync(indexCssPath, overrideCode);
        console.log('Appended UI overrides to index.css');
    }
}

// Run the replacement
processDir(path.join(__dirname, 'src/components'));