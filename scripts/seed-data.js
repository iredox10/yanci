import { Client, Databases, ID } from 'node-appwrite';
import { GUARDIAN_DATA } from '../src/data/guardianData.js';

// Configuration
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.VITE_APPWRITE_COLLECTION_ID_ARTICLES;

if (!PROJECT_ID || !API_KEY || !DATABASE_ID || !COLLECTION_ID) {
    console.error("Error: Missing configuration. Check your .env file.");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function seed() {
    console.log("🌱 Starting Database Seed...");

    const allArticles = [
        ...GUARDIAN_DATA.headlines.map(a => ({ ...a, section: 'headlines' })),
        ...GUARDIAN_DATA.sport.map(a => ({ ...a, section: 'sport' })),
        ...GUARDIAN_DATA.opinion.map(a => ({ ...a, section: 'opinion' })),
        ...GUARDIAN_DATA.culture.map(a => ({ ...a, section: 'culture' })),
        ...GUARDIAN_DATA.lifestyle.map(a => ({ ...a, section: 'lifestyle' })),
    ];

    console.log(`Found ${allArticles.length} articles to seed.`);

    let successCount = 0;
    let failCount = 0;

    for (const article of allArticles) {
        try {
            // Prepare document data
            const docData = {
                headline: article.headline,
                kicker: article.kicker,
                trail: article.trail,
                body: article.body,
                image: article.image,
                pillar: article.pillar,
                section: article.section,
                type: article.type || 'standard',
                author: article.author,
                isLive: article.isLive || false,
                liveUpdates: [], // Initialize empty
                // Optional fields
                videoUrl: article.videoUrl,
                keyFigures: article.keyFigures
            };

            // Remove undefined fields
            Object.keys(docData).forEach(key => docData[key] === undefined && delete docData[key]);

            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                docData
            );
            process.stdout.write('.'); // Progress dot
            successCount++;
        } catch (error) {
            process.stdout.write('x');
            // console.error(`\nFailed to seed article "${article.headline}":`, error.message);
            failCount++;
        }
    }

    console.log("\n--------------------------------------------------");
    console.log(`✅ Seed Complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount} (Duplicates or errors)`);
    console.log("--------------------------------------------------");
    console.log("Don't forget to add a 'Web' platform for 'localhost' in your Appwrite Console");
    console.log("so your frontend can access this data!");
}

seed();
