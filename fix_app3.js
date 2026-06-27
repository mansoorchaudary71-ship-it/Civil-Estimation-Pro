const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import { ToolArticleWidget } from "./components/ui/ToolArticleWidget";
`;

appTsx = appTsx.replace('import { RelatedCalculators } from "./components/calculators/RelatedCalculators";', importsToAdd + '\nimport { RelatedCalculators } from "./components/calculators/RelatedCalculators";');

const oldModuleWrapperEnd = `
        <div className="mt-16 space-y-12 pb-12">
          <ProTipsWidget moduleId={id} />
          <CodeReferences moduleId={id} />
          <ToolPageFooter 
            toolName={actualTitle} 
            standards={["IS Codes", "NBC", "ACI", "BS", "MORTH"]} 
            formulaDescription="Estimations are calculated based on standard civil engineering formulas and latest regional guidelines."
            difficulty="Intermediate"
            lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            category={category}
          />
          <GlobalFAQ moduleId={id} />
          <RelatedCalculators category={category} currentSlug={id} />
          <FeedbackWidget toolName={actualTitle} />
          <DiscussionWidget moduleId={id} toolName={actualTitle} />
        </div>
`;

const newModuleWrapperEnd = `
        <div className="mt-16 space-y-12 pb-12">
          <ProTipsWidget moduleId={id} />
          <CodeReferences moduleId={id} />
          <ToolArticleWidget toolName={actualTitle} />
          <GlobalFAQ moduleId={id} />
          <RelatedCalculators category={category} currentSlug={id} />
          <FeedbackWidget toolName={actualTitle} />
          <DiscussionWidget moduleId={id} toolName={actualTitle} />
          <ToolPageFooter 
            toolName={actualTitle} 
            standards={["IS Codes", "NBC", "ACI", "BS", "MORTH"]} 
            formulaDescription="Estimations are calculated based on standard civil engineering formulas and latest regional guidelines."
            difficulty="Intermediate"
            lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            category={category}
          />
        </div>
`;

appTsx = appTsx.replace(oldModuleWrapperEnd, newModuleWrapperEnd);

fs.writeFileSync('src/App.tsx', appTsx);
console.log("App.tsx modified successfully with ToolArticleWidget and correct order!");
