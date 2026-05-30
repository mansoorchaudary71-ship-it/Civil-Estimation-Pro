const fs = require('fs');

let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace('mb-12 bg-white', 'bg-white'); // removing mb-12 on dashboard container
dashboard = dashboard.replace('w-full mb-24 rounded-none', 'w-full mb-0 rounded-none'); // the gradient banner
dashboard = dashboard.replace(/className="max-w-7xl mx-auto px-4 my-32"/g, 'className="max-w-7xl mx-auto px-4 my-0"');
dashboard = dashboard.replace(/className="mt-32 w-full"/g, 'className="w-full"');
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
// remove empty spaces in App.tsx
appTsx = appTsx.replace(/pb-\[64px\] md:pb-32/g, ''); 
appTsx = appTsx.replace(/pb-\[64px\] md:pb-0/g, '');
fs.writeFileSync('src/App.tsx', appTsx);

console.log("Removed margins/gaps");
