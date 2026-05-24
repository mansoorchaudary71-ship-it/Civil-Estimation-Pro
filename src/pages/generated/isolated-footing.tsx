import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolWrapper } from '../components/ToolWrapper';
// Assume specific tool component gets imported
import ToolComponent from '../components/modules/isolated-footing';

export default function isolatedFootingPage() {
  const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Isolated Footing Calculator",
  "description": "Detailed estimations for concrete, steel mesh, excavation and working space.",
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
        <title>Isolated Footing Calculator | Free Online Civil Engineering Calculator</title>
        <meta name="description" content="Detailed estimations for concrete, steel mesh, excavation and working space." />
        <meta name="keywords" content="free online isolated footing calculator, concrete tech software, civil engineering calculator, construction estimation app" />
        <link rel="canonical" href="https://civilestimation.pro/tools/isolated-footing" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <ToolWrapper title="Isolated Footing Calculator" category="Concrete Tech">
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
