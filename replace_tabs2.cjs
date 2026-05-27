const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if it doesn't contain ColorfulTab
  if (!content.includes('ColorfulTab')) return;

  // Replace <div ...> ... {tabs.map((tab, idx) => { ... <ColorfulTab ... /> ... })} ... </div>
  const regex = /<div[^>]*className="[^"]*overflow-x-auto[^"]*"[^>]*>\s*\{[a-zA-Z0-9_]+\.map\s*\(\s*\(\s*([a-zA-Z0-9_]+)\s*(?:,\s*[a-zA-Z0-9_]+)?\s*\)\s*=>\s*\{?\s*(?:const\s+[^;]+;)*?\s*(?:return\s*)?\(\s*<ColorfulTab[\s\S]*?onClick=\{([^}]+)\}[\s\S]*?\/>\s*\);?\s*\}?\s*\)\}\s*<\/div>/g;

  content = content.replace(regex, (match, tabVar, onClickStr) => {
    // E.g., tabVar is "tab" or "t"
    // onClick={ () => { setActiveTab(tab.id); resetEstimate(); } } -> click string is () => { ... }
    
    // Attempt to extract the array name
    const arrayMatch = match.match(/\{([a-zA-Z0-9_]+)\.map/);
    const arrayName = arrayMatch ? arrayMatch[1] : 'tabs';

    // We can just construct a safe, generic onTabChange that passes the id
    // and if there's multiple statements, we can execute them
    let newOnClick = '';
    if (onClickStr.includes('resetEstimate')) {
      newOnClick = `(id) => { setActiveTab(id as any); resetEstimate(); }`;
    } else {
      newOnClick = `(id) => setActiveTab(id as any)`;
    }
    
    return `<UniversalTabs 
          tabs={${arrayName}.map(t => ({ id: t.id, label: t.label, icon: t.icon ? <t.icon className="w-5 h-5" /> : undefined }))} 
          activeTab={activeTab} 
          onTabChange={${newOnClick}} 
        />`;
  });

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
