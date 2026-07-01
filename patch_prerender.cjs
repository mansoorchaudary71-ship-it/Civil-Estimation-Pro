const fs = require('fs');
const file = './node_modules/vite-plugin-prerender/dist/index.mjs';
let content = fs.readFileSync(file, 'utf8');
content = `import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\n` + content;
fs.writeFileSync(file, content);
console.log('Patched vite-plugin-prerender');
