import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolWrapper } from '../components/ToolWrapper';
// Assume specific tool component gets imported
import ToolComponent from '../components/modules/mix-design';

export default function mixDesignPage() {
  const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Concrete Mix Design",
  "description": "IS 10262 performance-based concrete mix calculator and report generator.",
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
        <title>Concrete Mix Design | Free Online Civil Engineering Calculator</title>
        <meta name="description" content="IS 10262 performance-based concrete mix calculator and report generator." />
        <meta name="keywords" content="free online concrete mix design, concrete tech software, civil engineering calculator, construction estimation app" />
        <link rel="canonical" href="https://civilestimation.pro/tools/mix-design" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <ToolWrapper title="Concrete Mix Design" category="Concrete Tech">
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
