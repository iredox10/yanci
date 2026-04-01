#!/usr/bin/env node
/**
 * scripts/generate-sitemap.js
 *
 * Generates a dynamic sitemap.xml including all article URLs from seed data
 * and a Google News sitemap for Google News inclusion.
 *
 * Run: node scripts/generate-sitemap.js
 *
 * Output: public/sitemap.xml, public/sitemap-news.xml
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.VITE_SITE_URL || 'https://yanci.ng';

// Seed data matching what the RSS script uses
const GUARDIAN_DATA = {
  headlines: [
    { id: 1, kicker: 'Kai Tsaye', headline: "Majalisa ta amince da dokar tsare bayanan dijital domin kare 'yan kasa", trail: 'Sabuwar dokar za ta tilasta kamfanonin fasaha bin sharudan adana bayanai a cikin kasar.', pillar: 'news', section: 'headlines', author: 'Yanci' },
    { id: 2, kicker: 'Bincike', headline: 'Dalilin da ya sa kudin Naira ke kara kwanciyar hankali a kasuwar duniya', pillar: 'news', section: 'headlines', author: 'Yanci' },
    { id: 3, kicker: 'Sufuri', headline: 'Sabon tsarin jirgin kasa mai sauri ya fara gwaji tsakanin Abuja da Kaduna', pillar: 'news', section: 'headlines', author: 'Yanci' },
    { id: 4, kicker: 'Makaman Haske', headline: 'Gidaje 12,000 a Arewa maso Gabas sun koma amfani da hasken rana', pillar: 'news', section: 'headlines', author: 'Yanci' },
  ],
  sport: [
    { id: 5, kicker: 'AFCON 2025', headline: 'An sanar da sabbin sunaye cikin jerin Super Eagles kafin wasan sada zumunci', pillar: 'sport', section: 'sport', author: 'Yanci' },
    { id: 6, kicker: 'Gasara', headline: 'Ndidi ya kafa sabon rikodi na kwace kwallon 18 a wasa guda', pillar: 'sport', section: 'sport', author: 'Yanci' },
  ],
  opinion: [
    { id: 7, author: 'Rahama Ibrahim', headline: 'Yadda siyasar kula da bayanai ke tsare martabar dimokuradiyya', pillar: 'opinion', section: 'opinion' },
    { id: 8, author: 'Dr. Garba Kurfi', headline: 'Matakin tattabarun kudade ga kananan kamfanoni', pillar: 'opinion', section: 'opinion' },
  ],
  culture: [
    { id: 9, kicker: 'Kida', headline: 'Sabon sautin Arewa fusion ya mamaye jerin Spotify Afrika', pillar: 'culture', section: 'culture', author: 'Yanci' },
    { id: 10, kicker: 'Fina-finai', headline: 'Nollywood ta samu gurbin nuna fina-finai biyu a Cannes 2025', pillar: 'culture', section: 'culture', author: 'Yanci' },
  ],
  lifestyle: [
    { id: 11, kicker: 'Lafiya', headline: 'Likita ya bayyana tsarin motsa jiki na minti 15 da ke rage hawan jini', pillar: 'lifestyle', section: 'lifestyle', author: 'Yanci' },
    { id: 12, kicker: 'Kasuwanci', headline: 'Matashiya daga Bauchi ta kafa dakin gwaje-gwajen kayan kwalliya na farko', pillar: 'lifestyle', section: 'lifestyle', author: 'Yanci' },
    { id: 13, kicker: 'Ilimi', headline: 'Yadda makarantu masu zaman kansu ke amfani da AI wajen koyar da lissafi', pillar: 'lifestyle', section: 'lifestyle', author: 'Yanci' },
  ],
};

const allArticles = [
  ...GUARDIAN_DATA.headlines.map(a => ({ ...a, section: 'headlines' })),
  ...GUARDIAN_DATA.sport.map(a => ({ ...a, section: 'sport' })),
  ...GUARDIAN_DATA.opinion.map(a => ({ ...a, section: 'opinion' })),
  ...GUARDIAN_DATA.culture.map(a => ({ ...a, section: 'culture' })),
  ...GUARDIAN_DATA.lifestyle.map(a => ({ ...a, section: 'lifestyle' })),
];

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const now = new Date().toISOString();

// ─── Standard Sitemap ────────────────────────────────────────────────────────
const staticPages = [
  { path: '/', changefreq: 'hourly', priority: '1.0' },
  { path: '/labarai', changefreq: 'hourly', priority: '0.9' },
  { path: '/siyasa', changefreq: 'hourly', priority: '0.9' },
  { path: '/kasuwanci', changefreq: 'hourly', priority: '0.8' },
  { path: '/wasanni', changefreq: 'hourly', priority: '0.8' },
  { path: '/fasaha', changefreq: 'daily', priority: '0.7' },
  { path: '/raayi', changefreq: 'daily', priority: '0.7' },
  { path: '/aladu', changefreq: 'daily', priority: '0.7' },
  { path: '/bidiyo', changefreq: 'daily', priority: '0.6' },
  { path: '/search', changefreq: 'never', priority: '0.3' },
];

const articleUrls = allArticles.map(a => {
  const url = a.slug ? `/${a.slug}` : `/article/${a.id}`;
  return {
    path: url,
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: now,
  };
});

// Collect unique tags for tag pages
const tagSet = new Set();
allArticles.forEach(a => {
  if (a.tags) {
    a.tags.split(',').forEach(t => {
      const clean = t.trim();
      if (clean) tagSet.add(clean);
    });
  }
});

const tagUrls = [...tagSet].map(tag => ({
  path: `/tag/${encodeURIComponent(tag)}`,
  changefreq: 'weekly',
  priority: '0.5',
}));

// Collect unique authors for author pages
const authorSet = new Set();
allArticles.forEach(a => {
  if (a.author) authorSet.add(a.author);
});

const authorUrls = [...authorSet].map(author => ({
  path: `/author/${encodeURIComponent(author)}`,
  changefreq: 'weekly',
  priority: '0.5',
}));

const allPages = [...staticPages, ...articleUrls, ...tagUrls, ...authorUrls];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// ─── Google News Sitemap ─────────────────────────────────────────────────────
// Google News sitemap should only contain articles published in the last 2 days
// and must include <news:news> tags
const newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allArticles.map(a => {
  const url = a.slug ? `${SITE_URL}/${a.slug}` : `${SITE_URL}/article/${a.id}`;
  return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <name>Yanci</name>
        <language>ha</language>
      </news:publication>
      <news:publication_date>${now}</news:publication_date>
      <news:title>${esc(a.headline)}</news:title>
      ${a.kicker ? `<news:keywords>${esc(a.kicker)}</news:keywords>` : ''}
      <news:genres>Blog</news:genres>
    </news:news>
  </url>`;
}).join('\n')}
</urlset>
`;

// ─── Write files ─────────────────────────────────────────────────────────────
const publicDir = path.resolve(__dirname, '../public');

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
console.log(`[sitemap] written → ${sitemapPath} (${allPages.length} URLs)`);

const newsSitemapPath = path.join(publicDir, 'sitemap-news.xml');
fs.writeFileSync(newsSitemapPath, newsXml, 'utf-8');
console.log(`[sitemap-news] written → ${newsSitemapPath} (${allArticles.length} articles)`);

console.log('[sitemap] Done.');
