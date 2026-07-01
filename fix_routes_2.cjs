const fs = require('fs');

const routesPath = './src/routes.jsx';
let routesContent = fs.readFileSync(routesPath, 'utf8');

// remove mix-design route
routesContent = routesContent.replace(/\{\s*path:\s*"mix-design-calculator",\s*element:\s*<ToolRenderer\s+toolId="mix-design"\s*\/>\s*\},/g, '');

fs.writeFileSync(routesPath, routesContent);
