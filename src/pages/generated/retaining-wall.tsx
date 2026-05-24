import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolWrapper } from '../components/ToolWrapper';
// Assume specific tool component gets imported
import ToolComponent from '../components/modules/retaining-wall';

export default function retainingWallPage() {
  const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Retaining Wall Estimator",
  "description": "Calculate stability factors, concrete volume, and reinforcement for cantilever retaining walls.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};
  
  return (
    <>
      <Helmet>
        <title>Retaining Wall Estimator | Free Online Civil Engineering Calculator</title>
        <meta name="description" content="Calculate stability factors, concrete volume, and reinforcement for cantilever retaining walls." />
        <meta name="keywords" content="free online retaining wall estimator, concrete tech software, civil engineering calculator, construction estimation app" />
        <link rel="canonical" href="https://civilestimation.pro/tools/retaining-wall" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <ToolWrapper title="Retaining Wall Estimator" category="Concrete Tech">
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
