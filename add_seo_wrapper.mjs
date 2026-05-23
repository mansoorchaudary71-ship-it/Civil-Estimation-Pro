import fs from 'fs';
import path from 'path';

const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('import { SEO }')) {
  // Add import
  appContent = appContent.replace(
    /import \{ Toaster \} from "react-hot-toast";/,
    `import { Toaster } from "react-hot-toast";\nimport { SEO } from "./components/SEO";`
  );

  // Modify ModuleWrapper
  appContent = appContent.replace(
    /<div className="h-full flex flex-col min-h-0 bg-transparent">/,
    `<div className="h-full flex flex-col min-h-0 bg-transparent">
      {(() => {
        const moduleDef = ALL_MODULES.find(m => m.id === activeModule);
        const desc = moduleDef ? moduleDef.description : title;
        const keywords = moduleDef ? \`civil engineering calculator, \${title.toLowerCase()} calculator, \${title.toLowerCase()} estimation\` : "civil estimation pro, construction calculator";
        const canonicalUrl = \`https://civilestimationpro.com/?tool=\${activeModule}\`;
        
        const schema = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": title,
          "applicationCategory": "EngineeringApplication",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
          "description": desc,
          "featureList": ["Live updates", "Export to PDF", "Material estimation"],
          "url": canonicalUrl
        };
        
        return <SEO title={title} description={desc} keywords={keywords} canonicalUrl={canonicalUrl} schema={schema} />;
      })()}`
  );
  
  fs.writeFileSync(appPath, appContent);
  console.log('App.tsx updated with ModuleWrapper SEO logic.');
} else {
  console.log('SEO already imported in App.tsx');
}
