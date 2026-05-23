import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
  faqs?: Array<{q: string, a: string}>;
  category?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, canonicalUrl, schema, faqs, category }) => {
  const fullTitle = `${title} | Civil Estimation Pro - Free Civil Engineering Calculator`;

  const webAppSchema = schema || {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "applicationCategory": "EngineeringApplication",
    "offers": {"@type": "Offer", "price": "0"},
    "description": description,
    "featureList": "Live calculation, metric/imperial units, custom export"
  };

  const domain = "https://y71-ship-it.github.io";
  const url = canonicalUrl || domain;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": domain },
      category ? { "@type": "ListItem", "position": 2, "name": category, "item": `${domain}/#` } : null,
      { "@type": "ListItem", "position": category ? 3 : 2, "name": title, "item": url }
    ].filter(Boolean)
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={`civil engineering calculator, ${keywords}`} />}
      <link rel="canonical" href={url} />
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">
        {JSON.stringify(webAppSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};
