const fs = require('fs');

function cleanFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    const startStr = '            // Build safe styles instead of dynamic strings';
    const endStr = '          })}';

    const startIdx = content.indexOf(startStr);
    const endIdx = content.indexOf(endStr, startIdx);

    if (startIdx > -1 && endIdx > -1) {
        let isVolumeEstimator = path.includes('VolumeEstimator');
        let isUnitConverter = path.includes('UnitConverter');
        let setCall = isVolumeEstimator ? 'setActiveShape' : (isUnitConverter ? 'setActiveCategory' : 'setActiveShape');
        let idProp = 's.id';

        const replacement = `            return (
              <button
                key={${idProp}}
                onClick={() => ${setCall}(${idProp})}
                className={\`relative flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] border transition-all duration-200 overflow-hidden group hover:border-[color:var(--theme-color)] hover:bg-[color:var(--theme-bg-light)] \${isActive ? 'shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}\`}
                style={{
                  '--theme-color': \`var(--color-\${baseColor}-500)\`,
                  '--theme-color-hover': \`var(--color-\${baseColor}-600)\`,
                  '--theme-bg': \`color-mix(in srgb, var(--color-\${baseColor}-500) 10%, transparent)\`,
                  '--theme-bg-light': \`color-mix(in srgb, var(--color-\${baseColor}-500) 5%, transparent)\`,
                  borderColor: isActive ? 'var(--theme-color)' : undefined,
                  backgroundColor: isActive ? 'var(--theme-bg-light)' : undefined
                } as React.CSSProperties}
              >
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: 'var(--theme-bg)',
                    color: 'var(--theme-color)'
                  }}
                >
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className={\`text-[11px] font-extrabold text-center leading-tight tracking-wide \${isActive ? '' : 'text-slate-600 dark:text-slate-400 group-hover:[color:var(--theme-color-hover)]'}\`} style={{ color: isActive ? 'var(--theme-color-hover)' : undefined }}>{s.label}</span>
              </button>
            )\n`;
                
        content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Cleaned", path);
    } else {
        console.log("Could not find blocks in", path);
    }
}

cleanFile('src/components/modules/AreaCalculator.tsx');
cleanFile('src/components/modules/VolumeEstimator.tsx');
cleanFile('src/components/modules/UnitConverter.tsx');