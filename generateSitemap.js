import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://civilestimationpro.com';

const categories = [
  'quantity-estimation',
  'concrete',
  'road-pavement',
  'geotechnical',
  'mep',
  'structural-design',
  'architectural',
  'standards',
  'resources'
];

const tools = [
  // Quantity Estimation
  { path: '/calculators/quantity-estimation/guided-qs-workflow-tool', priority: 0.9 },
  { path: '/calculators/quantity-estimation/quick-rough-estimator', priority: 0.8 },
  { path: '/calculators/quantity-estimation/master-quantity-estimator', priority: 0.9 },
  { path: '/calculators/quantity-estimation/house-construction-cost-calculator', priority: 0.9 },
  { path: '/calculators/quantity-estimation/material-takeoff-generator', priority: 0.8 },
  { path: '/calculators/quantity-estimation/cost-summary-generator', priority: 0.8 },
  { path: '/calculators/quantity-estimation/measurement-sheet-calculator', priority: 0.8 },
  { path: '/calculators/quantity-estimation/boq-generator', priority: 0.9 },
  { path: '/calculators/quantity-estimation/plan-measure-tool', priority: 0.8 },
  { path: '/calculators/quantity-estimation/live-rates-calculator', priority: 0.8 },
  { path: '/calculators/quantity-estimation/interiors-finishes-estimator', priority: 0.8 },
  { path: '/calculators/quantity-estimation/area-space-calculator', priority: 0.7 },
  { path: '/calculators/quantity-estimation/volume-tank-capacity-calculator', priority: 0.7 },
  { path: '/calculators/quantity-estimation/metal-weight-calculator', priority: 0.7 },
  { path: '/calculators/quantity-estimation/unit-converter-tool', priority: 0.7 },
  { path: '/calculators/quantity-estimation/ai-assistant-tool', priority: 0.8 },
  { path: '/calculators/quantity-estimation/project-manager-tool', priority: 0.8 },
  { path: '/calculators/quantity-estimation/site-progress-tracker-tool', priority: 0.8 },
  { path: '/calculators/quantity-estimation/labour-workforce-estimator', priority: 0.8 },

  // Concrete
  { path: '/calculators/concrete/master-rcc-estimator', priority: 0.9 },
  { path: '/calculators/concrete/construction-material-calculator', priority: 0.9 },
  { path: '/calculators/concrete/mix-design-calculator', priority: 0.9 },
  { path: '/calculators/concrete/bbs-generator', priority: 0.9 },
  { path: '/calculators/concrete/reinforcement-detailing-visualizer-tool', priority: 0.8 },
  { path: '/calculators/concrete/isolated-footing-calculator', priority: 0.8 },
  { path: '/calculators/concrete/retaining-wall-estimator', priority: 0.8 },
  { path: '/calculators/concrete/staircase-calculator', priority: 0.8 },
  { path: '/calculators/concrete/aggregate-tests-calculator', priority: 0.8 },
  { path: '/calculators/concrete/formwork-scaffold-estimator', priority: 0.8 },

  // Road Pavement
  { path: '/calculators/road-pavement/road-pavement-estimator', priority: 0.9 },
  { path: '/calculators/road-pavement/earthworks-excavation-calculator', priority: 0.9 },
  { path: '/calculators/road-pavement/chainage-volume-calculator', priority: 0.8 },
  { path: '/calculators/road-pavement/gradient-slope-calculator', priority: 0.8 },
  { path: '/calculators/road-pavement/anti-termite-calculator', priority: 0.7 },

  // Geotechnical
  { path: '/calculators/geotechnical/sieve-analysis-grading-calculator', priority: 0.9 },
  { path: '/calculators/geotechnical/geotechnical-soil-tests-calculator', priority: 0.8 },
  { path: '/calculators/geotechnical/cbr-test-calculator', priority: 0.8 },
  { path: '/calculators/geotechnical/aggregate-blending-calculator', priority: 0.8 },
  { path: '/calculators/geotechnical/direct-shear-test-calculator', priority: 0.8 },
  { path: '/calculators/geotechnical/permeability-calculator', priority: 0.7 },

  // MEP
  { path: '/calculators/mep/energy-mep-calculator', priority: 0.8 },
  { path: '/calculators/mep/solar-roof-calculator', priority: 0.8 },
  { path: '/calculators/mep/rainwater-harvesting-calculator', priority: 0.8 },

  // Structural Design
  { path: '/calculators/structural-design/beam-design-tool', priority: 0.9 },
  { path: '/calculators/structural-design/column-design-tool', priority: 0.9 },
  { path: '/calculators/structural-design/raft-foundation-calculator', priority: 0.8 },
  { path: '/calculators/structural-design/water-tank-design-calculator', priority: 0.8 },
  { path: '/calculators/structural-design/pile-foundation-calculator', priority: 0.9 },
  { path: '/calculators/structural-design/prestressed-concrete-estimator', priority: 0.8 },

  // Architectural
  { path: '/calculators/architectural/room-area-calculator', priority: 0.7 },
  { path: '/calculators/architectural/building-setback-calculator', priority: 0.8 },
  { path: '/calculators/architectural/far-fsi-calculator', priority: 0.8 },
  { path: '/calculators/architectural/door-window-schedule-generator', priority: 0.8 },
  { path: '/calculators/architectural/ventilation-lighting-checker-tool', priority: 0.8 }
];

const staticPages = [
  { path: '/', priority: 1.0 },
  { path: '/about', priority: 0.5 },
  { path: '/pricing', priority: 0.8 },
  { path: '/contact', priority: 0.5 },
  { path: '/standards', priority: 0.8 }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <priority>${page.priority.toFixed(1)}</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('\\n')}
${categories.map(cat => `  <url>
    <loc>${BASE_URL}/calculators/${cat}</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('\\n')}
${tools.map(t => `  <url>
    <loc>${BASE_URL}${t.path}</loc>
    <priority>${t.priority.toFixed(1)}</priority>
    <changefreq>monthly</changefreq>
  </url>`).join('\\n')}
</urlset>`;

fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap, 'utf8');

console.log('Sitemap successfully generated at public/sitemap.xml');
