const fs = require('fs');
let c = fs.readFileSync('src/index.css', 'utf8');

c = c.replace(/\.dark body \{[\s\S]*?min-height: 100vh;\s*\}/g, '.dark body {\n    background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);\n    color: var(--text-primary);\n    min-height: 100vh;\n  }');

c = c.replace(/\.dark \{[\s\S]*?--foreground: 214 32% 91%;\s*\}/g, '.dark {\n    /* The Dominant Base (60%) */\n    --bg-main: #f8f9fa;\n    --bg-surface: #ffffff;\n    --bg-surface-glass: rgba(255, 255, 255, 0.7);\n\n    /* The Secondary Anchor (30%) - NO BLACK */\n    --text-primary: #1a1a3a;\n    --text-secondary: #4b5563;\n    --border-light: rgba(44, 48, 64, 0.08);\n\n    /* Fallbacks for existing variables */\n    --bg-primary: var(--bg-main);\n    --bg-card: var(--bg-surface);\n    --border-color: var(--border-light);\n  }');

fs.writeFileSync('src/index.css', c, 'utf8');
