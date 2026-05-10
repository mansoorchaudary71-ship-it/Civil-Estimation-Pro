import React, { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, schema }) => {
  useEffect(() => {
    // Update title
    document.title = `${title} | Civil Estimation Pro`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Add JSON-LD Schema
    let script: HTMLScriptElement | null = null;
    if (schema) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      document.title = "Civil Estimation Pro";
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [title, description, keywords, schema]);

  return null;
};
