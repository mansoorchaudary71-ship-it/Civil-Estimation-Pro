import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolWrapper } from '../components/ToolWrapper';
// Assume specific tool component gets imported
import ToolComponent from '../components/modules/boq';

export default function boqPage() {
  const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Professional BOQ Generator",
  "description": "Create, format, and export professional Bills of Quantities and itemized estimates.",
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
        <title>Professional BOQ Generator | Free Online Civil Engineering Calculator</title>
        <meta name="description" content="Create, format, and export professional Bills of Quantities and itemized estimates." />
        <meta name="keywords" content="free online professional boq generator, quantity estimator software, civil engineering calculator, construction estimation app" />
        <link rel="canonical" href="https://civilestimation.pro/tools/boq" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <ToolWrapper title="Professional BOQ Generator" category="Quantity Estimator">
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
