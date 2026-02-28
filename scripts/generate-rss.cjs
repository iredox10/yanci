#!/usr/bin/env node
/**
 * scripts/generate-rss.js
 *
 * Generates static RSS 2.0 feeds from the guardianData seed file.
 * Run: node scripts/generate-rss.js
 *
 * Output: public/rss/index.xml, public/rss/labarai.xml, public/rss/wasanni.xml,
 *         public/rss/rayi.xml, public/rss/alaadu.xml, public/rss/rayuwa.xml
 *
 * Integrate into build: add "node scripts/generate-rss.js && " before vite build
 * in package.json "build" script.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.VITE_SITE_URL || 'https://yanci.ng';
const SITE_TITLE = 'Yanci — Labarai da Gaskiya';
const SITE_DESCRIPTION = 'Jaridun labarai na Hausa — harkokin siyasa, wasanni, ra\'ayi da al\'adu.';
const SITE_LANG = 'ha';

// Inline the seed data (avoid ES-module import in CommonJS script)
const GUARDIAN_DATA = {
  headlines: [
    { id: 1, kicker: 'Kai Tsaye', headline: "Majalisa ta amince da dokar tsare bayanan dijital domin kare \u2018yan kasa", trail: 'Sabuwar dokar za ta tilasta kamfanonin fasaha bin sharudan adana bayanai a cikin kasar.', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&auto=format&fit=crop', pillar: 'news', author: 'Yanci' },
    { id: 2, kicker: 'Bincike', headline: 'Dalilin da ya sa kudin Naira ke kara kwanciyar hankali a kasuwar duniya', pillar: 'news', author: 'Yanci' },
    { id: 3, kicker: 'Sufuri', headline: 'Sabon tsarin jirgin kasa mai sauri ya fara gwaji tsakanin Abuja da Kaduna', pillar: 'news', author: 'Yanci' },
    { id: 4, kicker: 'Makaman Haske', headline: 'Gidaje 12,000 a Arewa maso Gabas sun koma amfani da hasken rana', pillar: 'news', author: 'Yanci' },
  ],
  sport: [
    { id: 5, kicker: 'AFCON 2025', headline: 'An sanar da sabbin sunaye cikin jerin Super Eagles kafin wasan sada zumunci', image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&auto=format&fit=crop', pillar: 'sport', author: 'Yanci' },
    { id: 6, kicker: 'Gasara', headline: 'Ndidi ya kafa sabon rikodi na kwace kwallon 18 a wasa guda', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&auto=format&fit=crop', pillar: 'sport', author: 'Yanci' },
  ],
  opinion: [
    { id: 7, author: 'Rahama Ibrahim', headline: 'Yadda siyasar kula da bayanai ke tsare martabar dimokuradiyya', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop', pillar: 'opinion' },
    { id: 8, author: 'Dr. Garba Kurfi', headline: 'Matakin tattabarun kudade ga kananan kamfanoni', pillar: 'opinion' },
  ],
  culture: [
    { id: 9, kicker: 'Kida', headline: 'Sabon sautin Arewa fusion ya mamaye jerin Spotify Afrika', image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1200&auto=format&fit=crop', pillar: 'culture', author: 'Yanci' },
    { id: 10, kicker: 'Fina-finai', headline: 'Nollywood ta samu gurbin nuna fina-finai biyu a Cannes 2025', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop', pillar: 'culture', author: 'Yanci' },
  ],
  lifestyle: [
    { id: 11, kicker: 'Lafiya', headline: 'Likita ya bayyana tsarin motsa jiki na minti 15 da ke rage hawan jini', pillar: 'lifestyle', author: 'Yanci' },
    { id: 12, kicker: 'Kasuwanci', headline: 'Matashiya daga Bauchi ta kafa dakin gwaje-gwajen kayan kwalliya na farko', pillar: 'lifestyle', author: 'Yanci' },
    { id: 13, kicker: 'Ilimi', headline: 'Yadda makarantu masu zaman kansu ke amfani da AI wajen koyar da lissafi', pillar: 'lifestyle', author: 'Yanci' },
  ],
};

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildFeed({ title, description, link, items }) {
  const now = new Date().toUTCString();
  const itemsXml = items.map((item) => {
    const url = `${SITE_URL}/article/${item.id}`;
    return `
    <item>
      <title>${esc(item.headline)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(item.trail || item.kicker || '')}</description>
      <author>${esc(item.author || 'Yanci')}</author>
      <pubDate>${now}</pubDate>
      ${item.image ? `<enclosure url="${esc(item.image)}" type="image/jpeg" length="0" />` : ''}
    </item>`.trim();
  }).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>${esc(title)}</title>
    <link>${link}</link>
    <description>${esc(description)}</description>
    <language>${SITE_LANG}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${link.replace(SITE_URL, SITE_URL + '/rss')}" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>
`;
}

const allArticles = [
  ...GUARDIAN_DATA.headlines.map(a => ({ ...a, section: 'headlines' })),
  ...GUARDIAN_DATA.sport.map(a => ({ ...a, section: 'sport' })),
  ...GUARDIAN_DATA.opinion.map(a => ({ ...a, section: 'opinion' })),
  ...GUARDIAN_DATA.culture.map(a => ({ ...a, section: 'culture' })),
  ...GUARDIAN_DATA.lifestyle.map(a => ({ ...a, section: 'lifestyle' })),
];

const feeds = [
  {
    filename: 'index.xml',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    link: SITE_URL,
    items: allArticles,
  },
  {
    filename: 'labarai.xml',
    title: 'Yanci — Labarai',
    description: 'Sabbin labarai na siyasa da tattalin arziki daga Yanci.',
    link: `${SITE_URL}/labarai`,
    items: GUARDIAN_DATA.headlines,
  },
  {
    filename: 'wasanni.xml',
    title: 'Yanci — Wasanni',
    description: 'Labarai na wasanni da kwallon kafa daga Yanci.',
    link: `${SITE_URL}/wasanni`,
    items: GUARDIAN_DATA.sport,
  },
  {
    filename: 'rayi.xml',
    title: "Yanci — Ra'ayi",
    description: "Ra'ayi da sharhi daga masana a Yanci.",
    link: `${SITE_URL}/rayi`,
    items: GUARDIAN_DATA.opinion,
  },
  {
    filename: 'alaadu.xml',
    title: "Yanci — Al'adu",
    description: "Al'adu, fasaha, da kiɗa daga Yanci.",
    link: `${SITE_URL}/alaadu`,
    items: GUARDIAN_DATA.culture,
  },
  {
    filename: 'rayuwa.xml',
    title: 'Yanci — Rayuwa',
    description: 'Rayuwa, lafiya, da kasuwanci daga Yanci.',
    link: `${SITE_URL}/rayuwa`,
    items: GUARDIAN_DATA.lifestyle,
  },
];

const outDir = path.resolve(__dirname, '../public/rss');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

feeds.forEach(({ filename, ...rest }) => {
  const xml = buildFeed(rest);
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`[rss] written → public/rss/${filename}`);
});

console.log('[rss] All feeds generated.');
