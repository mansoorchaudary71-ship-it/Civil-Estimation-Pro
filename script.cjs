const fs = require("fs");
const updateInputs = (filePath) => {
  let code = fs.readFileSync(filePath, "utf-8");
  
  const regex = /className="w-full bg-transparent dark:bg-slate-800 border border-slate-200 p-3 rounded-xl mt-1 font-medium focus:ring-2 (focus:ring-[a-z]+-500)"/g;
  
  code = code.replace(regex, `className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl mt-1 font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 $1 focus:border-transparent transition-all placeholder:text-slate-400"`);
  
  fs.writeFileSync(filePath, code);
  console.log(`Updated ${filePath}`);
}

updateInputs("src/components/modules/AreaCalculator.tsx");
updateInputs("src/components/modules/VolumeEstimator.tsx");
