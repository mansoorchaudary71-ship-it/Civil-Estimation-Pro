import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolWrapper } from '../components/ToolWrapper';
// Assume specific tool component gets imported
import ToolComponent from '../components/modules/labour-calculator';

export default function labourCalculatorPage() {
  const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Labour & Workforce",
  "description": "Calculate labour cost, worker allocation, and daily burn rates for your project.",
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
        <title>Labour & Workforce | Free Online Civil Engineering Calculator</title>
        <meta name="description" content="Calculate labour cost, worker allocation, and daily burn rates for your project." />
        <meta name="keywords" content="free online labour & workforce, project costing software, civil engineering calculator, construction estimation app" />
        <link rel="canonical" href="https://civilestimation.pro/tools/labour-calculator" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <ToolWrapper title="Labour & Workforce" category="Project Costing">
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
