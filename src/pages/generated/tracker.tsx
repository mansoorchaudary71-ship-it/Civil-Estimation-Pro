import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolWrapper } from '../components/ToolWrapper';
// Assume specific tool component gets imported
import ToolComponent from '../components/modules/tracker';

export default function trackerPage() {
  const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Site Progress Tracker",
  "description": "Track construction timelines, visual Gantt charts, budget burn, and photo updates.",
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
        <title>Site Progress Tracker | Free Online Civil Engineering Calculator</title>
        <meta name="description" content="Track construction timelines, visual Gantt charts, budget burn, and photo updates." />
        <meta name="keywords" content="free online site progress tracker, analysis & tools software, civil engineering calculator, construction estimation app" />
        <link rel="canonical" href="https://civilestimation.pro/tools/tracker" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <ToolWrapper title="Site Progress Tracker" category="Analysis & Tools">
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
