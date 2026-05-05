const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'modules');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const importStr = `import { GlobalSettingsToggle } from '../ui/GlobalSettingsToggle';`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if missing
  if (!content.includes('GlobalSettingsToggle')) {
    content = content.replace(/(import .*?;\n)/, `$1${importStr}\n`);
  } else if (!content.includes('../ui/GlobalSettingsToggle') && !content.includes('GlobalSettingsToggle }')) {
    content = content.replace(/(import .*?;\n)/, `$1${importStr}\n`);
  }

  // Find the header structure and replace it to have the toggle right below the <p>
  // Let's remove any existing '<GlobalSettingsToggle />' first
  content = content.replace(/<div className="shrink-0[^>]*>\s*<GlobalSettingsToggle \/>\s*<\/div>/g, '');
  content = content.replace(/<GlobalSettingsToggle \/>/g, ''); // strip all

  // Then, insert it after the <p className="...">...</p> inside the header or equivalent top section
  
  if (file === "Calculators.tsx") {
    // Handling Calculators.tsx locally
    content = content.replace(
      /<p className="text-gray-500 font-medium">Accurate estimations for concrete, bricks, steel, blocks, and mortar.<\/p>\s*<\/div>\s*<div className="flex flex-wrap items-center gap-4">/,
      `<p className="text-gray-500 font-medium">Accurate estimations for concrete, bricks, steel, blocks, and mortar.</p>\n             <div className="mt-4"><GlobalSettingsToggle /></div>\n           </div>\n           <div className="flex flex-wrap items-center gap-4">`
    );
     // remove setLocalSI toggle
    content = content.replace(/<button onClick=\{\(\) => setLocalSI\(!localSI\)\}.*?<\/button>\s*<\/div>/s, '</div>');
  } else {
    // Find <p className="text-gray... mt-2...> ... </p>
    // And put <div className="mt-4"><GlobalSettingsToggle /></div> right after the </p>
    content = content.replace(
      /(<p className="text-gray-500 mt-2[^>]*>.*?<\/p>)/s,
      `$1\n            <div className="mt-5 w-fit"><GlobalSettingsToggle /></div>`
    );
  }

  // Some components had md:flex-row justify-between. Let's simplify headers if they have it
  content = content.replace(/<header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-4">/g, '<header className="mb-10 block">');
  content = content.replace(/<header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">/g, '<header className="mb-8 block">');

  fs.writeFileSync(filePath, content);
}
console.log("Success replacing headers");
