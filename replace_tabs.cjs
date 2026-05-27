const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if it doesn't contain ColorfulTab
  if (!content.includes('ColorfulTab')) return;

  // Replace imports
  content = content.replace(/import\s+(?:ColorfulTab|\{\s*ColorfulTab[^\}]*\})\s+from\s+['"\.\/]+(ui\/)?ColorfulTab['"];?\n?/g, '');
  
  // Add UniversalTabs import
  if (!content.includes('UniversalTabs')) {
    content = content.replace(/(import React.*?\n)/, '$1import { UniversalTabs } from "../ui/UniversalTabs";\n');
  }

  // Define regexes to match the flex container of tabs
  // E.g.: <div className="...overflow-x-auto..."> ... {tabs.map... <ColorfulTab ... /> ...} ... </div>
  
  const divRegex = /<div[^>]*className="[^"]*overflow-x-auto[^"]*"[^>]*>[\s\S]*?(?:\{\s*([a-zA-Z0-9_]+)\.map\s*\(\s*\(\s*([a-zA-Z0-9_]+)\s*(?:,\s*[a-zA-Z0-9_]+)?\s*\)[\s\S]*?<ColorfulTab[\s\S]*?<\/[a-zA-Z0-9_]+>|(?:\}\s*)?\}?)[\s\S]*?<\/div>/g;
  
  content = content.replace(divRegex, (match, arrayName, tabItem) => {
    // If we matched the array mapping
    if (arrayName) {
      // Find what the click handler is doing. Usually onClick={() => ... }
      const onClickMatch = match.match(/onClick=\{[^=>]+=>(?:\{)?(.*?)(\})?\}/);
      // Let's just create a generic replacement and hope it fits the most common pattern
      // Because we can't perfectly regex React click handlers if they are complex.
      // E.g., { setActiveTab(tab.id as any); resetEstimate(); }
      let setAction = `setActiveTab(id as any)`;
      if (match.includes('resetEstimate()')) {
        setAction = `{ setActiveTab(id as any); resetEstimate(); }`;
      } else if (match.includes('setMhType')) {
         setAction = `setMhType(id as any)`;
      } else if (match.includes('setTestType')) {
         setAction = `setTestType(id as any)`;
      }
      
      return `<UniversalTabs 
          tabs={${arrayName}.map(t => ({ id: t.id, label: t.label, icon: t.icon ? <t.icon className="w-5 h-5" /> : undefined }))} 
          activeTab={activeTab} 
          onTabChange={(id) => ${setAction}} 
        />`;
    }
    
    return match;
  });

  // Replace any standalone ColorfulTabs if any
  content = content.replace(/<ColorfulTab\s*[^>]*id=\{?["']([^"']+)["']\}?\s*label=\{?["']([^"']+)["']\}?\s*icon=\{([^\}]+)\}\s*isActive=\{([^\}]+)\}\s*onClick=\{([^\}]+)\}[^>]*\/>/g, 
  (match, id, label, icon, isActive, onClick) => {
    return `<UniversalTabs tabs={[{id: "${id}", label: "${label}", icon: ${icon}}]} activeTab={${isActive} ? "${id}" : ""} onTabChange={${onClick}} />`;
  });

  // Ensure import path is correct for different nesting levels
  const depth = (filePath.match(/src\/components\//) || filePath.includes('GlobalSettingsModal')) ? 2 : 1;
  const prefix = '../'.repeat(depth - 1);
  content = content.replace(/import \{ UniversalTabs \} from "\.\.\/ui\/UniversalTabs";/, 
    `import { UniversalTabs } from "${prefix}ui/UniversalTabs";`);

  fs.writeFileSync(filePath, content, 'utf8');
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      try {
        processFile(fullPath);
      } catch (e) {
        console.error("Error processing " + fullPath, e);
      }
    }
  }
}

traverse(path.join(__dirname, 'src'));
