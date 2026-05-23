import fs from 'fs';
import path from 'path';

const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('URLSearchParams')) {
  // Update useState
  appContent = appContent.replace(
    /const \[activeModule, setActiveModule\] = useState<ModuleId>\("home"\);/,
    `const [activeModule, setActiveModule] = useState<ModuleId>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tool = params.get("tool");
      if (tool) return tool as ModuleId;
    }
    return "home";
  });`
  );

  // Add useEffect to update URL
  appContent = appContent.replace(
    /useEffect\(\(\) => \{[\s\S]*?if \(activeModule !== "home"[\s\S]*?\}, \[activeModule, previousModule\]\);/m,
    `useEffect(() => {
    if (typeof window !== "undefined") {
      const newUrl = activeModule === "home" ? "/" : "/?tool=" + activeModule;
      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.pushState({}, "", newUrl);
      }
    }
    if (activeModule !== "home" || !previousModule || ["home", "my-estimates", "pricing", "about", "careers", "contact", "blog"].includes(previousModule)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeModule, previousModule]);`
  );
  
  fs.writeFileSync(appPath, appContent);
  console.log('App.tsx updated for basic routing.');
} else {
  console.log('App.tsx already has routing logic.');
}
