import fs from 'fs';
import path from 'path';

// Update index.html with meta tags and preconnects
const indexPath = 'index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Add preconnect
if (!indexHtml.includes('rel="preconnect"')) {
  indexHtml = indexHtml.replace('</head>', `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <meta name="description" content="Civil Estimation Pro - The most comprehensive free civil engineering and construction estimation suite. Calculate concrete, steel, earthwork, roads, and more.">
    <meta name="keywords" content="civil engineering calculator, construction estimation, BOQ generator, concrete calculator">
    <meta name="author" content="Civil Estimation Pro">
    <link rel="canonical" href="https://civilestimationpro.com/">
    <meta property="og:title" content="Civil Estimation Pro - Free Civil Engineering Calculators">
    <meta property="og:description" content="Advanced estimators for live construction rate analysis, house estimating, and comprehensive BOQ calculators.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
  </head>`);
  fs.writeFileSync(indexPath, indexHtml);
  console.log('Updated index.html');
}
