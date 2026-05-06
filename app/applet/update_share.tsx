import fs from 'fs';
import path from 'path';

const files = [
  'AreaCalculator.tsx',
  'ChainageVolume.tsx',
  'Earthworks.tsx',
  'FinishingEstimator.tsx',
  'FormworkEstimator.tsx',
  'GridEarthwork.tsx',
  'HouseEstimator.tsx',
  'MasterQuantityEstimator.tsx',
  'MetalWeightCalculator.tsx',
  'RccStructureCalculator.tsx',
  'RigidPavementEstimator.tsx',
  'RoadEstimator.tsx',
  'SewerageEstimator.tsx',
  'TrenchExcavation.tsx',
  'VolumeEstimator.tsx'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), 'src/components/modules', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add imports
  if (!content.includes('saveEstimate')) {
    content = content.replace(
      /(import .* from ["']\.\.?\/\.\.?\/utils\/.*["'];?)/,
      "$1\nimport { saveEstimate } from \"../../lib/estimates\";\nimport { useAuth } from \"../../contexts/AuthContext\";"
    );
    // If it didn't work (e.g. AreaCalculator doesn't have utils import)
    if (!content.includes('saveEstimate')) {
       content = content.replace(
         /(import ShareButtonWithPopup from ["']\.\/ShareMenu["'];?)/,
         "$1\nimport { saveEstimate } from \"../../lib/estimates\";\nimport { useAuth } from \"../../contexts/AuthContext\";"
       );
    }
  }

  // Add `Save` to lucide-react imports
  const lucideMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
  if (lucideMatch && !lucideMatch[1].includes('Save')) {
    content = content.replace(lucideMatch[0], lucideMatch[0].replace('}', ', Save }'));
  }

  // Add state hooks
  const componentMatch = content.match(/export default function \w+\(\) \{/);
  const componentMatch2 = content.match(/export const \w+ = \(\) => \{/);
  const match = componentMatch || componentMatch2;
  
  if (match && !content.includes('const [isSaving, setIsSaving]')) {
    content = content.replace(
      match[0],
      match[0] + "\n  const { user } = useAuth();\n  const [isSaving, setIsSaving] = useState(false);\n  const [saveMessage, setSaveMessage] = useState(\"\");"
    );
  }

  // Replace wrapper
  const shareButtonRegex = /(<div[^>]*>)\s*(<ShareButtonWithPopup[\s\S]*?\/>)\s*(<\/div>)/;
  const buttonMatch = content.match(shareButtonRegex);

  if (buttonMatch) {
    const originalWrapperOpen = buttonMatch[1];
    const shareComponent = buttonMatch[2];
    const originalWrapperClose = buttonMatch[3];

    // we should try to extract the module name for the prompt
    const titleMatch = content.match(/export default function (\w+)/);
    const modName = titleMatch ? titleMatch[1] : file.replace('.tsx', '');
    
    let dataProp = "{}";
    const dataMatch = shareComponent.match(/exportFormat=\{([^]+?)\}\s*(?:\/?>|title=)/);
    if (dataMatch) {
      dataProp = dataMatch[1].trim(); 
      if (dataProp.endsWith('}')) {
        // usually it matches perfectly because of the regex.
      }
    } else {
      const dataMatch2 = shareComponent.match(/data=\{([^]+?)\}\s*(?:\/?>|exportFormat=|title=)/);
      if (dataMatch2) {
        dataProp = dataMatch2[1].trim();
      }
    }

    const replacement = `
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            ${shareComponent}
            {user && (
              <button 
                onClick={async () => {
                  setIsSaving(true);
                  setSaveMessage("");
                  try {
                    const payload = ${dataProp.trim()};
                    const projName = prompt("Enter project element/estimate name:", "My ${modName} Estimate");
                    if (projName) {
                      await saveEstimate(projName, payload);
                      setSaveMessage("Saved successfully!");
                      setTimeout(() => setSaveMessage(""), 3000);
                    }
                  } catch (e) {
                    setSaveMessage("Failed to save.");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="bg-green-600/20 text-green-400 hover:bg-green-600/30 px-6 py-4 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save to Profile
                  </>
                )}
              </button>
            )}
            {saveMessage && <span className="text-sm font-bold text-green-400 ml-4">{saveMessage}</span>}
          </div>
`;

    content = content.replace(buttonMatch[0], replacement);
    fs.writeFileSync(filePath, content);
  }
}
