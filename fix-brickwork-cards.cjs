const fs = require('fs');

const fileNames = [
  'src/components/modules/Brickwork9InchModule.tsx',
  'src/components/modules/InteriorsFinishes.tsx'
];

fileNames.forEach(fileName => {
  if (!fs.existsSync(fileName)) return;

  let txt = fs.readFileSync(fileName, 'utf8');

  // We want to replace the hardcoded div blocks with ResultCard
  
  // They look like:
  /*
              <div className={`bg-slate-800/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center ${""}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-blue-400">{<Box className="w-5 h-5 text-white" />}</div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{"Total Bricks Estimated"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{results.noOfBricks.toLocaleString()}</span>
                  {"pcs" && <span className="text-sm font-semibold text-slate-300">{"pcs"}</span>}
                </div>
                {null && <p className="text-[10px] font-medium text-slate-500 mt-2">{null}</p>}
              </div>
  */

  // Let's use a regex to match these blocks
  // They always start with {/* Hardcoded Result Reverted */} and end after </div></div></div> (with some text in between)

  const regex = /\{\/\* Hardcoded Result Reverted \*\/\}\s*<div className=\{`bg-slate-800\/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \$\{""\}`\}>\s*<div className="flex items-center gap-2 mb-2">\s*(?:<div className="[^"]*">\{<([A-Za-z0-9]+)\s+[^>]*>\}<\/div>)*\s*<span className="text-slate-400 text-xs font-bold uppercase tracking-widest">\{"([^"]+)"\}<\/span>\s*<\/div>\s*<div className="flex items-baseline gap-2">\s*<span className="text-3xl font-black text-white">\{([^}]+)\}<\/span>\s*(?:\{"[^"]+"\s*&&\s*<span[^>]*>\{"([^"]+)"\}<\/span>\}|\{[^&&]+\s*&&\s*<span[^>]*>\{[^}]+\}<\/span>\})\s*<\/div>\s*(?:\{([^&]+)\s*&&\s*<p[^>]*>\{[^}]+\}<\/p>\})\s*<\/div>/g;

  // Let's write a replacer that uses regex with named groups, but to keep it simple:
  // Actually, standard regex with capturing groups.

  let replaced = txt;

  // Since it's tricky to parse JSX with Regex, let's use a simpler match:
  // Look for the whole block:
  const blockRegex = /\{\/\* Hardcoded Result Reverted \*\/\}\s*<div className=\{`bg-slate-800\/50 px-4 py-4 rounded-2xl border border-slate-700 flex flex-col justify-center \$\{""\}`\}>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;

  // I'll parse it with standard JS
  
  let newLines = [];
  let isInBlock = false;
  let blockLines = [];
  
  let lines = txt.split('\n');
  for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('/* Hardcoded Result Reverted */')) {
        isInBlock = true;
        blockLines = [];
    }
    
    if (isInBlock) {
        blockLines.push(lines[i]);
        if (lines[i].trim() === '</div>' && blockLines.length > 5) {
            let blockStr = blockLines.join('\n');
            if (blockStr.includes('bg-slate-800/50') && blockStr.includes('<span className="text-3xl')) {
                // Parse out title
                let titleMatch = blockStr.match(/uppercase tracking-widest">\{"([^"]+)"\}/);
                let titleMatch2 = blockStr.match(/uppercase tracking-widest">\{`([^`]+)`\}/);
                let title = titleMatch ? titleMatch[1] : (titleMatch2 ? titleMatch2[1] : "");
                
                // value 
                let valMatch = blockStr.match(/<span className="text-3xl[^>]*>\{([^}]+)\}<\/span>/);
                let value = valMatch ? valMatch[1] : "";
                
                // unit string literal form: `{"unit" &&`
                let unitMatch = blockStr.match(/\{"([^"]+)" &&/);
                // unit variable form `{uArea &&`
                let uAreaMatch = blockStr.match(/\{uArea &&/);
                // unit ternary form `results.isSI ? ...`
                let isSiMatch = blockStr.match(/results\.isSI \? '[^']+' : '[^']+'/);
                let unitValue = unitMatch ? `"${unitMatch[1]}"` : (uAreaMatch ? 'uArea' : (isSiMatch ? isSiMatch[0] : '""'));

                // Try finding descriptions
                let descMatch = blockStr.match(/\{([^&]+) && <p/);
                let descVar = descMatch && descMatch[1].trim() !== 'null' ? descMatch[1].trim() : undefined;

                let iconMatch = blockStr.match(/<([A-Z][A-Za-z0-9]+)\s+className="[^"]*w-[45]/);
                let iconStr = iconMatch ? ` icon={<${iconMatch[1]} className="w-5 h-5 text-indigo-500" />}` : '';
                
                let rep = `              <ResultCard
                title={"${title}"}
                value={${value}}
                unit={${unitValue}}
                variant="primary"${iconStr}${descVar ? `\n                description={${descVar}}` : ''}
              />`;
                
                newLines.push(rep);
                isInBlock = false;
                continue;
            } else {
                newLines.push(...blockLines);
                isInBlock = false;
                continue;
            }
        }
    } else {
        newLines.push(lines[i]);
    }
  }

  const finalTxt = newLines.join('\n');
  if (finalTxt !== txt) {
    // Add import statement
    if (!finalTxt.includes('ResultCard')) {
        let importMatch = finalTxt.match(/import\s+[^;]+;\n/g);
        let lastImport = importMatch[importMatch.length - 1];
        replaced = finalTxt.replace(lastImport, lastImport + `import { ResultCard } from "../ui/ResultCard";\n`);
    } else {
        replaced = finalTxt;
    }
    fs.writeFileSync(fileName, replaced);
    console.log("Replaced fixed blocks with ResultCard in " + fileName);
  } else {
    console.log("No changes in " + fileName);
  }
});
