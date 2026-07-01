const fs = require('fs');

const routesPath = './src/routes.jsx';
let routesContent = fs.readFileSync(routesPath, 'utf8');

// The mapping of toolId to component names in App.tsx:
const toolMap = {
  "qs-workflow": "QSWorkflow",
  "quick-estimation": "QuickRoughEstimation",
  "master-quantity": "MasterQuantityEstimator",
  "house": "HouseEstimator",
  "material-takeoff": "MaterialTakeoffSheet",
  "cost-summary": "ConstructionCostSummary",
  "measurement-sheet": "MeasurementSheetCalculator",
  "boq": "BOQGenerator",
  "takeoff": "Takeoff",
  "rates": "RateAnalysis",
  "interiors-finishes": "InteriorsFinishes",
  "area-space-calculator": "AreaSpaceCalculator",
  "volume-estimator": "VolumeEstimator",
  "metal-weight": "MetalWeightCalculator",
  "unit-converter": "UnitConverter",
  "ai": "AIAssistant",
  "master-rcc": "MasterRccCore",
  "calculators": "Calculators",
  "bbs-generator": "BarBendingSchedule",
  "reinforcement": "ReinforcementVisualizer",
  "isolated-footing": "IsolatedFootingCalculator",
  "retaining-wall": "RetainingWallCalculator",
  "staircase-calculator": "StaircaseCalculator",
  "aggregate-tests": "AggregateTestsCalculator",
  "formwork": "FormworkEstimator",
  "road-pavement": "RoadPavementEstimator",
  "earthworks": "Earthworks",
  "chainage": "ChainageVolume",
  "gradient-calculator": "GradientCalculator",
  "anti-termite": "AntiTermiteCalculator",
  "geotechnical": "GeotechnicalCalculator",
  "cbr-test": "CbrTestCalculator",
  "master-sieve": "MasterSieveAnalysis",
  "aggregate-blending": "AggregateBlendingCalculator",
  "direct-shear": "DirectShearTestCalculator",
  "permeability-test": "PermeabilityCalculator",
  "mep-calculator": "EnergyMepCalculator",
  "solar-roof": "SolarRoofCalculator",
  "rainwater-harvesting": "RainwaterHarvesting",
  "projects": "ProjectManager",
  "tracker": "SiteProgressTracker",
  "labour-calculator": "LabourCalculator",
  "beam-design": "BeamDesignTool",
  "column-design": "ColumnDesignTool",
  "raft-foundation": "RaftFoundationDesigner",
  "water-tank-design": "WaterTankDesign",
  "pile-foundation": "PileFoundationCalculator",
  "prestressed-concrete": "PrestressedConcreteEstimator",
  "room-area-calculator": "RoomAreaCalculator",
  "building-setback-calculator": "BuildingSetbackCalculator",
  "far-fsi-calculator": "FarFsiCalculator",
  "door-window-schedule": "DoorWindowSchedule",
  "ventilation-checker": "VentilationChecker"
};

let lazyImports = `import React, { Suspense } from 'react';\nimport { ToolLoadingSkeleton } from './components/ui/ToolLoadingSkeleton';\n\n`;

for (const [id, comp] of Object.entries(toolMap)) {
  lazyImports += `const ${comp} = React.lazy(() => import("./components/modules/${comp}"));\n`;
}

lazyImports += `\nconst LazyTool = ({ children }) => (
  <Suspense fallback={<ToolLoadingSkeleton />}>
    {children}
  </Suspense>
);\n\n`;

// Insert after import { Navigate } from 'react-router-dom';
routesContent = routesContent.replace("import { Navigate } from 'react-router-dom';", "import { Navigate } from 'react-router-dom';\n" + lazyImports);

// Replace { path: "...", element: <ToolRenderer toolId="..." /> }
// with { path: "...", element: <LazyTool><Component /></LazyTool> }
routesContent = routesContent.replace(/\{\s*path:\s*"([^"]+)",\s*element:\s*<ToolRenderer\s+toolId="([^"]+)"\s*\/>\s*\}/g, (match, path, toolId) => {
  const comp = toolMap[toolId];
  if (!comp) {
    console.log(`Missing comp for ${toolId}`);
    return match;
  }
  return `{ path: "${path}", element: <LazyTool><${comp} /></LazyTool> }`;
});

// Remove ToolRenderer component definition at the bottom
routesContent = routesContent.replace(/\/\*\*[\s\S]*?function ToolRenderer[\s\S]*?\}$/, '');

fs.writeFileSync(routesPath, routesContent);
