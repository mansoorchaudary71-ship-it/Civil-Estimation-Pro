import fs from 'fs';
import path from 'path';

const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('DynamicSEOContent')) {
  // Add import
  appContent = appContent.replace(
    /import \{ SEO \} from "\.\/components\/SEO";/,
    `import { SEO } from "./components/SEO";\nimport { DynamicSEOContent } from "./components/ui/DynamicSEOContent";`
  );

  // Modify ModuleWrapper to include DynamicSEOContent
  appContent = appContent.replace(
    /\{children\}/,
    `<DynamicSEOContent title={title} category={moduleDef?.category} position="top" />
                  {children}
                  <DynamicSEOContent title={title} category={moduleDef?.category} position="bottom" onNavigate={setActiveModule} />`
  );
  
  fs.writeFileSync(appPath, appContent);
  console.log('App.tsx updated with DynamicSEOContent.');
} else {
  console.log('DynamicSEOContent already in App.tsx');
}
