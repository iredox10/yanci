/**
 * Social Auto-Post Script
 * Posts new articles to Twitter/X and Facebook when triggered.
 * 
 * USAGE:
 *   node scripts/social-auto-post.js <article_id>
 * 
 * SETUP:
 *   1. Create Twitter Developer App at https://developer.twitter.com
 *   2. Create Facebook Page Access Token at https://developers.facebook.com
 *   3. Add credentials to .env (see below)
 * 
 * AUTOMATION:
 *   - Run manually after publishing an article
 *   - Or set up as Appwrite Cloud Function triggered on article creation
 *   - Or use cron: 0 * * * * node scripts/social-auto-post.js --check-recent
 */

import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://yanci.ng';

// ─── Appwrite API ────────────────────────────────────────────────────────────

const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_HOST = '151.101.131.52';
const APPWRITE_PROJECT = process.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_KEY = process.env.APPWRITE_API_KEY;
const APPWRITE_DB = process.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_ARTICLES = process.env.VITE_APPWRITE_COLLECTION_ID_ARTICLES;

function appwriteApi(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: APPWRITE_HOST, port: 443, path: '/v1' + path, method,
      headers: {
        'Host': 'fra.cloud.appwrite.io',
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT,
        'X-Appwrite-Key': APPWRITE_KEY,
      },
      servername: 'fra.cloud.appwrite.io',
      timeout: 10000,
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, (res) => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); } catch { resolve(chunks); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getArticle(id) {
  return await appwriteApi('GET', `/databases/${APPWRITE_DB}/collections/${APPWRITE_ARTICLES}/documents/${id}`);
}

async function getRecentArticles(hours = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const result = await appwriteApi('GET', `/databases/${APPWRITE_DB}/collections/${APPWRITE_ARTICLES}/documents?queries[]=${encodeURIComponent(`$createdAt >= "${since}"`)}&queries[]=${encodeURIComponent('$orderAsc($createdAt)')}`);
  return result.documents || [];
}

async function markPosted(id) {
  await appwriteApi('PATCH', `/databases/${APPWRITE_DB}/collections/${APPWRITE_ARTICLES}/documents/${id}`, { social_posted: true });
}

// ─── Twitter/X API ───────────────────────────────────────────────────────────

async function postToTwitter(text, url) {
  if (!TWITTER_BEARER_TOKEN) {
    console.log('⚠ Twitter credentials not configured');
    return false;
  }

  const tweetText = text.length > 250 ? text.slice(0, 247) + '...' : text;
  const fullText = `${tweetText}\n\n${url}`;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ text: fullText });
    const opts = {
      hostname: 'api.twitter.com', port: 443, path: '/2/tweets', method: 'POST',
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 10000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.data?.id) {
            console.log('✅ Posted to Twitter: https://twitter.com/i/web/status/' + parsed.data.id);
            resolve(true);
          } else {
            console.error('❌ Twitter error:', parsed);
            resolve(false);
          }
        } catch { resolve(false); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Facebook API ────────────────────────────────────────────────────────────

async function postToFacebook(title, url, imageUrl) {
  if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN) {
    console.log('⚠ Facebook credentials not configured');
    return false;
  }

  const body = new URLSearchParams({
    message: title,
    link: url,
    ...(imageUrl ? { picture: imageUrl } : {}),
    access_token: FACEBOOK_ACCESS_TOKEN,
  }).toString();

  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'graph.facebook.com', port: 443,
      path: `/${FACEBOOK_PAGE_ID}/feed`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 10000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.id) {
            console.log('✅ Posted to Facebook: https://facebook.com/' + parsed.id);
            resolve(true);
          } else {
            console.error('❌ Facebook error:', parsed);
            resolve(false);
          }
        } catch { resolve(false); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const articleId = args.find(a => !a.startsWith('--'));

  if (args.includes('--check-recent')) {
    console.log('🔍 Checking for recent unposted articles...');
    const articles = await getRecentArticles(24);
    const unposted = articles.filter(a => !a.social_posted && a.status === 'published');
    
    if (unposted.length === 0) {
      console.log('✅ No new articles to post');
      return;
    }

    console.log(`📝 Found ${unposted.length} unposted article(s)`);
    for (const article of unposted) {
      await postArticle(article);
    }
    return;
  }

  if (!articleId) {
    console.log('Usage: node scripts/social-auto-post.js <article_id>');
    console.log('       node scripts/social-auto-post.js --check-recent');
    process.exit(1);
  }

  console.log(`📝 Fetching article ${articleId}...`);
  const article = await getArticle(articleId);
  await postArticle(article);
}

async function postArticle(article) {
  const headline = article.headline || article.title || 'New Article';
  const trail = article.trail || '';
  const url = `${SITE_URL}/article/${article.$id}`;
  const imageUrl = article.image || null;

  // Build tweet text
  const text = trail ? `${headline}: ${trail}` : headline;

  console.log(`\n📰 Posting: ${headline}`);
  console.log(`🔗 URL: ${url}`);

  const twitterOk = await postToTwitter(text, url);
  const facebookOk = await postToFacebook(headline, url, imageUrl);

  if (twitterOk || facebookOk) {
    try { await markPosted(article.$id); } catch {}
    console.log('\n✅ Done!');
  } else {
    console.log('\n⚠ No platforms posted (check credentials)');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
