// Post-build step: bake the rendered page, structured data, sitemap and
// robots.txt into build/, so crawlers that don't run JavaScript see the
// full content. Runs after `vite build` and the SSR build of entry-server.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const buildDir = fileURLToPath(new URL("build/", root));
const ssrDir = fileURLToPath(new URL("build-ssr/", root));

const sitemap = (siteUrl, date) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${date}</lastmod>
  </url>
</urlset>
`;

async function prerender() {
  const { render, structuredData, SITE_URL } = await import(pathToFileURL(`${ssrDir}entry-server.js`).href);
  if (!SITE_URL) throw new Error("VITE_SITE_URL is not set (see .env)");

  const indexPath = `${buildDir}index.html`;
  let html = readFileSync(indexPath, "utf8");
  if (!html.includes('<div id="root"></div>')) throw new Error("build/index.html has no empty #root to fill");

  // Replacer functions, so "$&"-style sequences in the content stay literal.
  const app = render();
  html = html.replace('<div id="root"></div>', () => `<div id="root">${app}</div>`);

  // JSON-LD; escape "<" so content can never close the script tag early.
  const jsonLd = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
  html = html.replace("</head>", () => `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
  writeFileSync(indexPath, html);

  writeFileSync(`${buildDir}sitemap.xml`, sitemap(SITE_URL, new Date().toISOString().slice(0, 10)));
  writeFileSync(`${buildDir}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  return app.length;
}

try {
  const size = await prerender();
  console.log(`prerendered index.html (${(size / 1024).toFixed(1)} kB of HTML), sitemap.xml, robots.txt`);
} finally {
  // Remove the temporary SSR bundle even when a step above fails.
  rmSync(ssrDir, { recursive: true, force: true });
}
