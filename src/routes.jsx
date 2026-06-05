import { Navigate } from 'react-router-dom';

/* 
 * NOTE: This is a routing configuration array designed for React Router v6.
 * You can load these routes directly into createBrowserRouter() or useRoutes().
 * 
 * Example usage:
 * const router = createBrowserRouter(routes);
 * return <RouterProvider router={router} />;
 */

export const routes = [
  {
    path: "/",
    async lazy() {
      const { default: Dashboard } = await import("./components/Dashboard");
      return { element: <Dashboard /> };
    }
  },
  {
    path: "/about",
    async lazy() {
      const { default: AboutUs } = await import("./components/pages/AboutUs");
      return { element: <AboutUs /> };
    }
  },
  {
    path: "/pricing",
    async lazy() {
      const { default: PricingPage } = await import("./components/pages/PricingPage");
      return { element: <PricingPage /> };
    }
  },
  {
    path: "/standards",
    async lazy() {
      const { default: StandardsReferencePage } = await import("./components/StandardsReferencePage");
      return { element: <StandardsReferencePage /> };
    }
  },

  // Legacy route redirect
  {
    path: "/tools/*",
    element: <Navigate to="/calculators" replace />
  },
  {
    path: "/calculators",
    async lazy() {
      // In a real implementation setup, this could go to an overarching 'All Tools' view
      const { default: Dashboard } = await import("./components/Dashboard");
      return { element: <Dashboard /> };
    }
  },

  /**
   * Tool Routes (Hierarchical & Keyword-Rich)
   */
  {
    path: "/calculators/quantity-estimation",
    children: [
      { path: "guided-qs-workflow-tool", element: <ToolRenderer toolId="qs-workflow" /> },
      { path: "quick-rough-estimator", element: <ToolRenderer toolId="quick-estimation" /> },
      { path: "master-quantity-estimator", element: <ToolRenderer toolId="master-quantity" /> },
      { path: "area-plot-converter-marla-kanal", async lazy() { const { default: MarlaConverterPage } = await import("./components/pages/MarlaConverterPage"); return { element: <MarlaConverterPage /> }; } },
      { path: "house-construction-cost-calculator", async lazy() { const { default: PakistanCostCalculatorPage } = await import("./components/pages/PakistanCostCalculatorPage"); return { element: <PakistanCostCalculatorPage /> }; } },
      { path: "material-takeoff-generator", element: <ToolRenderer toolId="material-takeoff" /> },
      { path: "cost-summary-generator", element: <ToolRenderer toolId="cost-summary" /> },
      { path: "measurement-sheet-calculator", element: <ToolRenderer toolId="measurement-sheet" /> },
      { path: "boq-generator", element: <ToolRenderer toolId="boq" /> },
      { path: "plan-measure-tool", element: <ToolRenderer toolId="takeoff" /> },
      { path: "live-rates-calculator", element: <ToolRenderer toolId="rates" /> },
      { path: "interiors-finishes-estimator", element: <ToolRenderer toolId="interiors-finishes" /> },
      { path: "area-space-calculator", element: <ToolRenderer toolId="area-space-calculator" /> },
      { path: "volume-tank-capacity-calculator", element: <ToolRenderer toolId="volume-estimator" /> },
      { path: "metal-weight-calculator", element: <ToolRenderer toolId="metal-weight" /> },
      { path: "unit-converter-tool", element: <ToolRenderer toolId="unit-converter" /> },
      { path: "ai-assistant-tool", element: <ToolRenderer toolId="ai" /> },
      { path: "project-manager-tool", element: <ToolRenderer toolId="projects" /> },
      { path: "site-progress-tracker-tool", element: <ToolRenderer toolId="tracker" /> },
      { path: "labour-workforce-estimator", element: <ToolRenderer toolId="labour-calculator" /> },
    ]
  },
  {
    path: "/calculators/concrete",
    children: [
      { path: "master-rcc-estimator", element: <ToolRenderer toolId="master-rcc" /> },
      { path: "construction-material-calculator", element: <ToolRenderer toolId="calculators" /> },
      { path: "mix-design-calculator", element: <ToolRenderer toolId="mix-design" /> },
      { path: "bbs-generator", element: <ToolRenderer toolId="bbs-generator" /> },
      { path: "reinforcement-detailing-visualizer-tool", element: <ToolRenderer toolId="reinforcement" /> },
      { path: "isolated-footing-calculator", element: <ToolRenderer toolId="isolated-footing" /> },
      { path: "retaining-wall-estimator", element: <ToolRenderer toolId="retaining-wall" /> },
      { path: "staircase-calculator", element: <ToolRenderer toolId="staircase-calculator" /> },
      { path: "aggregate-tests-calculator", element: <ToolRenderer toolId="aggregate-tests" /> },
      { path: "formwork-scaffold-estimator", element: <ToolRenderer toolId="formwork" /> },
    ]
  },
  {
    path: "/calculators/road-pavement",
    children: [
      { path: "road-pavement-estimator", element: <ToolRenderer toolId="road-pavement" /> },
      { path: "earthworks-excavation-calculator", element: <ToolRenderer toolId="earthworks" /> },
      { path: "chainage-volume-calculator", element: <ToolRenderer toolId="chainage" /> },
      { path: "gradient-slope-calculator", element: <ToolRenderer toolId="gradient-calculator" /> },
      { path: "anti-termite-calculator", element: <ToolRenderer toolId="anti-termite" /> },
    ]
  },
  {
    path: "/calculators/geotechnical",
    children: [
      { path: "sieve-analysis-grading-calculator", element: <ToolRenderer toolId="master-sieve" /> },
      { path: "geotechnical-soil-tests-calculator", element: <ToolRenderer toolId="geotechnical" /> },
      { path: "cbr-test-calculator", element: <ToolRenderer toolId="cbr-test" /> },
      { path: "aggregate-blending-calculator", element: <ToolRenderer toolId="aggregate-blending" /> },
      { path: "direct-shear-test-calculator", element: <ToolRenderer toolId="direct-shear" /> },
      { path: "permeability-calculator", element: <ToolRenderer toolId="permeability-test" /> },
    ]
  },
  {
    path: "/calculators/mep",
    children: [
      { path: "energy-mep-calculator", element: <ToolRenderer toolId="mep-calculator" /> },
      { path: "solar-roof-calculator", element: <ToolRenderer toolId="solar-roof" /> },
      { path: "rainwater-harvesting-calculator", element: <ToolRenderer toolId="rainwater-harvesting" /> },
    ]
  },
  {
    path: "/calculators/structural-design",
    children: [
      { path: "beam-design-tool", element: <ToolRenderer toolId="beam-design" /> },
      { path: "column-design-tool", element: <ToolRenderer toolId="column-design" /> },
      { path: "raft-foundation-calculator", element: <ToolRenderer toolId="raft-foundation" /> },
      { path: "water-tank-design-calculator", element: <ToolRenderer toolId="water-tank-design" /> },
      { path: "pile-foundation-calculator", element: <ToolRenderer toolId="pile-foundation" /> },
      { path: "prestressed-concrete-estimator", element: <ToolRenderer toolId="prestressed-concrete" /> },
    ]
  },
  {
    path: "/calculators/architectural",
    children: [
      { path: "room-area-calculator", element: <ToolRenderer toolId="room-area-calculator" /> },
      { path: "building-setback-calculator", element: <ToolRenderer toolId="building-setback-calculator" /> },
      { path: "far-fsi-calculator", element: <ToolRenderer toolId="far-fsi-calculator" /> },
      { path: "door-window-schedule-generator", element: <ToolRenderer toolId="door-window-schedule" /> },
      { path: "ventilation-lighting-checker-tool", element: <ToolRenderer toolId="ventilation-checker" /> },
    ]
  }
];

/**
 * Demo component depicting how a generic ToolRenderer might consume the toolId 
 * while maintaining the correct React Router context.
 */
function ToolRenderer({ toolId }) {
  // Real implementation would render the specific <ModuleRenderer id={toolId} />
  // alongside ToolSEOMeta dynamically fetching the right headers.
  return <div data-tool-id={toolId}>Implementing Tool...</div>;
}
