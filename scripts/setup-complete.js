/**
 * Complete Appwrite setup script (using https module for DNS workaround)
 * Creates all collections, attributes, permissions, and initial admin users.
 * 
 * USAGE: node scripts/setup-complete.js
 */

import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

// fra.cloud.appwrite.io resolves to 151.101.131.52
const HOST = '151.101.131.52';
const SERVERNAME = 'fra.cloud.appwrite.io';

function api(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: HOST,
      port: 443,
      path: `/v1${path}`,
      method,
      headers: {
        'Host': SERVERNAME,
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
      servername: SERVERNAME,
    };
    const req = https.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => chunks += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(chunks);
          if (!res.ok && res.statusCode >= 400) {
            reject(new Error(`${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`${res.statusCode}: ${chunks}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function createCollection(name, attributes) {
  try {
    const collection = await api('POST', `/databases/${DATABASE_ID}/collections`, {
      collectionId: 'unique()',
      name,
      permissions: [],
    });
    console.log(`  ✓ Collection "${name}" created: ${collection.$id}`);

    for (const attr of attributes) {
      try {
        const attrPath = `/databases/${DATABASE_ID}/collections/${collection.$id}/attributes`;
        switch (attr.type) {
          case 'string':
            await api('POST', `${attrPath}/string`, { key: attr.key, size: attr.size ?? 255, required: attr.required ?? false, default: attr.default ?? null, array: false });
            break;
          case 'integer':
            await api('POST', `${attrPath}/integer`, { key: attr.key, required: attr.required ?? false, min: attr.min ?? null, max: attr.max ?? null, default: attr.default ?? null, array: false });
            break;
          case 'float':
            await api('POST', `${attrPath}/float`, { key: attr.key, required: attr.required ?? false, min: attr.min ?? null, max: attr.max ?? null, default: attr.default ?? null, array: false });
            break;
          case 'boolean':
            await api('POST', `${attrPath}/boolean`, { key: attr.key, required: attr.required ?? false, default: attr.default ?? null, array: false });
            break;
        }
        console.log(`    ✓ Attribute "${attr.key}" added`);
      } catch (err) {
        console.log(`    ⚠ Attribute "${attr.key}": ${err.message}`);
      }
    }
    return collection.$id;
  } catch (err) {
    if (err.message.includes('already exists')) {
      const list = await api('GET', `/databases/${DATABASE_ID}/collections`);
      const existing = list.collections?.find(c => c.name === name);
      if (existing) {
        console.log(`  → Collection "${name}" already exists: ${existing.$id}`);
        return existing.$id;
      }
    }
    throw err;
  }
}

async function createUser(name, email, password, labels = []) {
  try {
    const user = await api('POST', '/users', { userId: 'unique()', email, password, name });
    if (labels.length > 0) {
      await api('PUT', `/users/${user.$id}/labels`, { labels });
    }
    console.log(`  ✓ User "${name}" (${email}) created`);
    return user;
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log(`  → User "${email}" already exists`);
      return null;
    }
    throw err;
  }
}

async function createDocument(collectionId, data) {
  return await api('POST', `/databases/${DATABASE_ID}/collections/${collectionId}/documents`, {
    documentId: 'unique()',
    data,
    permissions: [],
  });
}

async function main() {
  console.log('\n🚀 Setting up Yanci Appwrite project...\n');

  console.log('📦 Creating Highlights collection...');
  const highlightsId = await createCollection('highlights', [
    { type: 'string', key: 'tag', size: 100, required: true },
    { type: 'string', key: 'title', size: 500, required: true },
    { type: 'string', key: 'copy', size: 1000, required: true },
    { type: 'string', key: 'icon', size: 50, required: false, default: 'trend' },
    { type: 'string', key: 'accent', size: 20, required: false, default: '#10b981' },
    { type: 'string', key: 'gradient', size: 100, required: false },
    { type: 'integer', key: 'order', required: false, default: 0 },
  ]);

  console.log('\n📦 Creating Homepage Stats collection...');
  const statsId = await createCollection('homepage_stats', [
    { type: 'string', key: 'label', size: 100, required: true },
    { type: 'integer', key: 'value', required: true, default: 0 },
    { type: 'string', key: 'suffix', size: 20, required: false },
    { type: 'string', key: 'icon', size: 50, required: false },
    { type: 'integer', key: 'order', required: false, default: 0 },
  ]);

  console.log('\n📦 Creating Sports Data collection...');
  const sportsId = await createCollection('sports', [
    { type: 'string', key: 'liveMatches', size: 65535, required: false },
    { type: 'string', key: 'standings', size: 65535, required: false },
    { type: 'string', key: 'fixtures', size: 65535, required: false },
    { type: 'string', key: 'playerOfWeek', size: 65535, required: false },
  ]);

  console.log('\n📦 Creating Homepage Layout collection...');
  const layoutId = await createCollection('homepage_layout', [
    { type: 'string', key: 'sections', size: 65535, required: true },
  ]);

  console.log('\n🌱 Seeding initial data...');

  // Highlights
  try {
    const existing = await api('GET', `/databases/${DATABASE_ID}/collections/${highlightsId}/documents`);
    if (existing.total === 0) {
      await createDocument(highlightsId, { tag: 'Kasuwanci', title: 'Kasuwar hannayen jari ta yi sama da kashi 4 cikin yini biyu', copy: 'Masu zuba jari sun amince da kudurin gwamnati.', icon: 'trend', accent: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/20', order: 0 });
      await createDocument(highlightsId, { tag: 'Sauti', title: 'Shirin rediyon Yanci Live ya dawo da sabbin makalu', copy: 'Masu sauraro na iya kallo kai tsaye.', icon: 'radio', accent: '#3b82f6', gradient: 'from-blue-500/20 to-indigo-500/20', order: 1 });
      await createDocument(highlightsId, { tag: 'Kirkire-kirkire', title: 'Matasa a Zaria sun ƙirƙira manhajar gano gonaki', copy: 'Aikin ya samu tallafin dala 150,000.', icon: 'innovation', accent: '#8b5cf6', gradient: 'from-violet-500/20 to-purple-500/20', order: 2 });
      console.log('  ✓ 3 highlights seeded');
    } else {
      console.log('  → Highlights already seeded');
    }
  } catch (err) { console.log(`  ⚠ ${err.message}`); }

  // Stats
  try {
    const existing = await api('GET', `/databases/${DATABASE_ID}/collections/${statsId}/documents`);
    if (existing.total === 0) {
      await createDocument(statsId, { label: 'Labarai', value: 12500, suffix: '+', icon: 'article', order: 0 });
      await createDocument(statsId, { label: 'Masu karatu', value: 500, suffix: 'K+', icon: 'reader', order: 1 });
      await createDocument(statsId, { label: 'Kasashen duniya', value: 45, suffix: '', icon: 'globe', order: 2 });
      console.log('  ✓ 3 stats seeded');
    } else {
      console.log('  → Stats already seeded');
    }
  } catch (err) { console.log(`  ⚠ ${err.message}`); }

  // Sports
  try {
    const existing = await api('GET', `/databases/${DATABASE_ID}/collections/${sportsId}/documents`);
    if (existing.total === 0) {
      await createDocument(sportsId, {
        liveMatches: JSON.stringify([{ id: 1, league: 'NPFL', homeTeam: 'Yanci Stars', awayTeam: 'City Royals', homeScore: 3, awayScore: 2, minute: "90+2'", isLive: true, events: [], streamUrl: '' }]),
        standings: JSON.stringify([{ pos: 1, team: 'Yanci Stars', p: 24, w: 18, d: 4, l: 2, gf: 52, ga: 17, gd: '+35', pts: 58 }]),
        fixtures: JSON.stringify([{ id: 1, league: 'NPFL', home: 'Yanci Stars', away: 'Enyimba', date: 'Yau', time: '16:00', stadium: 'Ahmadu Bello', odds: { home: 1.85, draw: 3.20, away: 4.50 } }]),
        playerOfWeek: JSON.stringify({ name: 'Ahmed Musa', team: 'Yanci Stars', initials: 'AM', goals: 5, assists: 3, rating: 9.2 }),
      });
      console.log('  ✓ Sports data seeded');
    } else {
      console.log('  → Sports already seeded');
    }
  } catch (err) { console.log(`  ⚠ ${err.message}`); }

  // Layout
  try {
    const existing = await api('GET', `/databases/${DATABASE_ID}/collections/${layoutId}/documents`);
    if (existing.total === 0) {
      await createDocument(layoutId, {
        sections: JSON.stringify([
          { id: 'ticker', label: 'Breaking News Ticker', enabled: true, order: 0 },
          { id: 'hero', label: 'Hero Story + Sidebar', enabled: true, order: 1 },
          { id: 'highlights', label: 'Highlight Panels (3 cards)', enabled: true, order: 2 },
          { id: 'stats', label: 'Statistics Counter', enabled: true, order: 3 },
          { id: 'opinion', label: 'Opinion Section', enabled: true, order: 4 },
          { id: 'sport', label: 'Sports Section', enabled: true, order: 5 },
          { id: 'lifestyle', label: 'Lifestyle & Culture', enabled: true, order: 6 },
          { id: 'elections', label: 'Election Hub Widget', enabled: false, order: 7 },
          { id: 'newsletter', label: 'Newsletter CTA', enabled: true, order: 8 },
        ]),
      });
      console.log('  ✓ Homepage layout seeded');
    } else {
      console.log('  → Layout already seeded');
    }
  } catch (err) { console.log(`  ⚠ ${err.message}`); }

  // Users
  console.log('\n👥 Creating admin users...');
  const adminUsers = [
    { name: 'Babban Admin', email: 'admin@yanci.ng', password: 'Admin@1234', labels: ['superadmin'] },
    { name: 'Editan Labarai', email: 'labarai@yanci.ng', password: 'Labarai@1234', labels: ['superadmin', 'news'] },
    { name: 'Editan Wasanni', email: 'wasanni@yanci.ng', password: 'Wasanni@1234', labels: ['superadmin', 'sport'] },
    { name: "Editan Ra'ayi", email: 'raayi@yanci.ng', password: 'Raayi@1234', labels: ['superadmin', 'opinion'] },
    { name: "Editan Al'adu", email: 'aladu@yanci.ng', password: 'Aladu@1234', labels: ['superadmin', 'culture'] },
    { name: 'Editan Rayuwa', email: 'rayuwa@yanci.ng', password: 'Rayuwa@1234', labels: ['superadmin', 'lifestyle'] },
  ];
  for (const u of adminUsers) await createUser(u.name, u.email, u.password, u.labels);

  // Summary
  console.log('\n📝 Add these to your .env:');
  console.log(`VITE_APPWRITE_COLLECTION_ID_HIGHLIGHTS=${highlightsId}`);
  console.log(`VITE_APPWRITE_COLLECTION_ID_HOMEPAGE_STATS=${statsId}`);
  console.log(`VITE_APPWRITE_COLLECTION_ID_SPORTS=${sportsId}`);
  console.log(`VITE_APPWRITE_COLLECTION_ID_HOMEPAGE_LAYOUT=${layoutId}`);

  console.log('\n🔑 Admin Credentials:');
  console.log('  admin@yanci.ng    → Admin@1234 (Super Admin)');
  console.log('  labarai@yanci.ng  → Labarai@1234 (News Editor)');
  console.log('  wasanni@yanci.ng  → Wasanni@1234 (Sports Editor)');
  console.log("  raayi@yanci.ng    → Raayi@1234 (Opinion Editor)");
  console.log("  aladu@yanci.ng    → Aladu@1234 (Culture Editor)");
  console.log('  rayuwa@yanci.ng   → Rayuwa@1234 (Lifestyle Editor)');
  console.log('\n✅ Setup complete!\n');
}

main().catch(err => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
