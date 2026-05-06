const fs = require('fs');

function redesignFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find where `const outerColorMap` starts
  const startIndex = content.indexOf('            // Build safe styles instead of dynamic strings');
  if (startIndex === -1) {
    console.log("Could not find start in", filePath);
    return;
  }
  
  // Find where the map ends
  const endMarker = '            )\n          })}';
  const endIndex = content.indexOf(endMarker, startIndex);
  if (endIndex === -1) {
    console.log("Could not find end in", filePath);
    return;
  }
  
  const replacement = `            // Soft Duotone aesthetic mappings
            const duotoneMap: Record<string, { button: string; iconContainer: string; text: string }> = {
              emerald: { button: isActive ? "border-emerald-500 bg-emerald-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-500/5", iconContainer: "bg-emerald-500/10 text-emerald-500", text: isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" },
              blue: { button: isActive ? "border-blue-500 bg-blue-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-500/5", iconContainer: "bg-blue-500/10 text-blue-500", text: isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" },
              purple: { button: isActive ? "border-purple-500 bg-purple-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-500/5", iconContainer: "bg-purple-500/10 text-purple-500", text: isActive ? "text-purple-700 dark:text-purple-400" : "text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" },
              rose: { button: isActive ? "border-rose-500 bg-rose-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-500/5", iconContainer: "bg-rose-500/10 text-rose-500", text: isActive ? "text-rose-700 dark:text-rose-400" : "text-slate-600 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" },
              pink: { button: isActive ? "border-pink-500 bg-pink-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-500/5", iconContainer: "bg-pink-500/10 text-pink-500", text: isActive ? "text-pink-700 dark:text-pink-400" : "text-slate-600 dark:text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400" },
              amber: { button: isActive ? "border-amber-500 bg-amber-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-500/5", iconContainer: "bg-amber-500/10 text-amber-500", text: isActive ? "text-amber-700 dark:text-amber-400" : "text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400" },
              orange: { button: isActive ? "border-orange-500 bg-orange-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-500/5", iconContainer: "bg-orange-500/10 text-orange-500", text: isActive ? "text-orange-700 dark:text-orange-400" : "text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" },
              yellow: { button: isActive ? "border-yellow-500 bg-yellow-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-500/5", iconContainer: "bg-yellow-500/10 text-yellow-500", text: isActive ? "text-yellow-700 dark:text-yellow-400" : "text-slate-600 dark:text-slate-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400" },
              teal: { button: isActive ? "border-teal-500 bg-teal-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-500/5", iconContainer: "bg-teal-500/10 text-teal-500", text: isActive ? "text-teal-700 dark:text-teal-400" : "text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" },
              cyan: { button: isActive ? "border-cyan-500 bg-cyan-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-500/5", iconContainer: "bg-cyan-500/10 text-cyan-500", text: isActive ? "text-cyan-700 dark:text-cyan-400" : "text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" },
              indigo: { button: isActive ? "border-indigo-500 bg-indigo-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-500/5", iconContainer: "bg-indigo-500/10 text-indigo-500", text: isActive ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" },
              lime: { button: isActive ? "border-lime-500 bg-lime-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-lime-300 dark:hover:border-lime-700 hover:bg-lime-500/5", iconContainer: "bg-lime-500/10 text-lime-500", text: isActive ? "text-lime-700 dark:text-lime-400" : "text-slate-600 dark:text-slate-400 group-hover:text-lime-600 dark:group-hover:text-lime-400" },
              fuchsia: { button: isActive ? "border-fuchsia-500 bg-fuchsia-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:bg-fuchsia-500/5", iconContainer: "bg-fuchsia-500/10 text-fuchsia-500", text: isActive ? "text-fuchsia-700 dark:text-fuchsia-400" : "text-slate-600 dark:text-slate-400 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400" },
              violet: { button: isActive ? "border-violet-500 bg-violet-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-500/5", iconContainer: "bg-violet-500/10 text-violet-500", text: isActive ? "text-violet-700 dark:text-violet-400" : "text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400" },
              sky: { button: isActive ? "border-sky-500 bg-sky-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-500/5", iconContainer: "bg-sky-500/10 text-sky-500", text: isActive ? "text-sky-700 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" },
              red: { button: isActive ? "border-red-500 bg-red-500/5" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-500/5", iconContainer: "bg-red-500/10 text-red-500", text: isActive ? "text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400" },
            };
            
            const styles = duotoneMap[baseColor] || duotoneMap['blue'];
            
            return (
              <button
                key={s.id || (s as any).label}
                onClick={() => {
                  if (typeof setActiveShape === "function") setActiveShape(s.id);
                  else if (typeof setActiveCategory === "function") setActiveCategory(s.id);
                }}
                className={\`relative flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] border transition-all duration-200 overflow-hidden group \${styles.button}\`}
              >
                <div className={\`flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110 \${styles.iconContainer}\`}>
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className={\`text-[11px] font-extrabold text-center leading-tight tracking-wide \${styles.text}\`}>{s.label}</span>
              </button>
            )`;

  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("Updated", filePath);
}

redesignFile('src/components/modules/AreaCalculator.tsx');
redesignFile('src/components/modules/VolumeEstimator.tsx');
redesignFile('src/components/modules/UnitConverter.tsx');

// Also do it for AdvancedSpecs or others? The prompt only asked for "the sub-tool icons (such as the 2D shapes, 3D volume prisms, and unit conversion categories)"
