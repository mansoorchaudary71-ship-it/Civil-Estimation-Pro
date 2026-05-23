import fs from 'fs';
import path from 'path';

// Extract all modules from App.tsx
const appCode = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{activeModule === "([^"]+)" && <ModuleWrapper [^>]*title="([^"]+)"/g;
let match;
const modules = [
  { id: 'home', title: 'Civil Estimation Pro' },
  { id: 'about', title: 'About Us' },
  { id: 'careers', title: 'Careers' },
  { id: 'contact', title: 'Contact' },
  { id: 'blog', title: 'Blog' }
];

while ((match = regex.exec(appCode)) !== null) {
  modules.push({ id: match[1], title: match[2] });
}

// Ensure unique IDs
const uniqueModules = Array.from(new Map(modules.map(m => [m.id, m])).values());

const domain = "https://civilestimationpro.com";

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const mod of uniqueModules) {
  const url = mod.id === 'home' ? domain + '/' : domain + '/?tool=' + mod.id;
  sitemap += `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${mod.id === 'home' ? '1.0' : '0.8'}</priority>
  </url>
`;
}

sitemap += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Created public/sitemap.xml with ' + uniqueModules.length + ' URLs');

const robots = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;
fs.writeFileSync('public/robots.txt', robots);
console.log('Created public/robots.txt');

