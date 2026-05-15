const fs = require('fs');
const file = 'src/components/modules/RigidPavementEstimator.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1\.5 ml-1"/g, 'label className="block text-[10px] xl:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 ml-1 truncate" title={""}');
fs.writeFileSync(file, content);
console.log('Fixed labels');