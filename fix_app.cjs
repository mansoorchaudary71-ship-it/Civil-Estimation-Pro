const fs = require('fs');

let appStr = fs.readFileSync('src/App.tsx', 'utf8');

// App container
appStr = appStr.replace(
  'pt-[80px] md:px-6 md:pb-6 md:pt-[100px]',
  'pt-[80px]'
);

// MD border & rounded-[32px] container
appStr = appStr.replace(
  'md:rounded-[32px] flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300',
  'flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300'
);

appStr = appStr.replace(
  'className="md:border md:border-slate-200 dark:md:border-slate-700/40 md:shadow-sm md:bg-white/50 dark:md:bg-slate-900/50 md:backdrop-blur-sm flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300"',
  'className="flex-1 flex flex-col min-h-0 relative w-full transition-colors duration-300 md:bg-white/50 dark:md:bg-slate-900/50 md:backdrop-blur-sm"'
);

fs.writeFileSync('src/App.tsx', appStr);
