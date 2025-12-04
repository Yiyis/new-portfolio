import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load environment variables from .env.local if it exists
const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get domain from environment or use default
const DOMAIN = process.env.VITE_SITE_URL || 'https://yiyishao.com';

// Sanity Client Configuration
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

async function generateSitemap() {
  try {
    // Fetch all projects
    const query = `*[_type == "project" && defined(slug.current)] {
      "slug": slug.current,
      isProtected
    }`;
    
    const projects = await client.fetch(query);
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' }, // Home
      { url: '/about', priority: '0.8', changefreq: 'monthly' }, // About
    ];
    
    // Project pages (exclude protected projects from sitemap)
    const projectPages = projects
      .filter(project => !project.isProtected && project.slug)
      .map(project => ({
        url: `/project/${project.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
      }));
    
    // Combine all pages
    const allPages = [...staticPages, ...projectPages];
    
    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    
    // Write to public directory
    const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
    writeFileSync(outputPath, sitemap, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   - ${staticPages.length} static pages`);
    console.log(`   - ${projectPages.length} project pages`);
    console.log(`   - Total: ${allPages.length} URLs`);
    console.log(`   - Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();

