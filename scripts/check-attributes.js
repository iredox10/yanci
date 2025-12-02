import { Client, Databases } from 'node-appwrite';

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.VITE_APPWRITE_COLLECTION_ID_ARTICLES;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function check() {
    try {
        const response = await databases.listAttributes(DATABASE_ID, COLLECTION_ID);
        console.log("Current Attributes:", response.attributes.map(a => `${a.key} (${a.type}, size: ${a.size})`));
        
        const required = ['headline', 'kicker', 'trail', 'body', 'image', 'videoUrl', 'keyFigures', 'pillar', 'section', 'type', 'author', 'isLive', 'liveUpdates'];
        const existing = response.attributes.map(a => a.key);
        
        const missing = required.filter(r => !existing.includes(r));
        
        if (missing.length > 0) {
            console.log("❌ Missing attributes:", missing);
        } else {
            console.log("✅ All attributes present.");
        }
    } catch (e) {
        console.error("Error checking attributes:", e);
    }
}

check();
