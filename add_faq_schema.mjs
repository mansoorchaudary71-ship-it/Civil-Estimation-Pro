import fs from 'fs';
import path from 'path';

const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

const regex = /const schema = \{\s*"@context":.*?};/s;

const newSchema = `const schema = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": title,
              "applicationCategory": "EngineeringApplication",
              "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
              "description": desc,
              "featureList": ["Live updates", "Export to PDF", "Material estimation"],
              "url": canonicalUrl
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": \`How accurate is the \${title} calculator?\`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": \`The \${title} calculator uses standard engineering formulas and constants. However, actual site conditions and material variances mean you should add a 5-10% contingency to these estimates.\`
                  }
                },
                {
                  "@type": "Question",
                  "name": \`Can I save my \${title} results?\`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can click the 'Print / Convert to PDF' button to save or download a comprehensive report of your material quantities and costs."
                  }
                },
                {
                  "@type": "Question",
                  "name": \`Is this \${title} calculator free to use?\`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Civil Estimation Pro provides this and all other calculators completely free for students, contractors, and engineers."
                  }
                },
                   {
                  "@type": "Question",
                  "name": \`Does the \${title} tool work for different unit systems?\`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can toggle between SI (Metric) and FPS (Imperial) units globally using the settings menu or the unit toggles provided on the page."
                  }
                },
                {
                  "@type": "Question",
                  "name": \`Who should use the \${title} calculator?\`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": \`This tool is designed for civil engineers, quantity surveyors, building contractors, and architecture students who need quick, reliable estimates for \${title}.\`
                  }
                }
              ]
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://civilestimationpro.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": title,
                  "item": canonicalUrl
                }
              ]
            }
          ]
        };`;

appContent = appContent.replace(regex, newSchema);
fs.writeFileSync(appPath, appContent);
console.log('App.tsx schema updated with FAQ and BreadcrumbList');
