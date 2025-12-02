import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

// Configuration
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

const DATABASE_NAME = 'NewsDB';
const COLLECTION_NAME = 'Articles';

if (!PROJECT_ID || !API_KEY) {
    console.error("Error: Please set VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY in your .env file.");
    process.exit(1);
}

const client = new Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function setup() {
    console.log("🚀 Starting Appwrite Setup...");

    let dbId;
    let collectionId;

    // 1. Create Database (or find existing)
    try {
        console.log(`Checking for database: ${DATABASE_NAME}...`);
        const dbs = await databases.list();
        const existingDb = dbs.databases.find(db => db.name === DATABASE_NAME);
        
        if (existingDb) {
            console.log(`✅ Database '${DATABASE_NAME}' already exists (${existingDb.$id}).`);
            dbId = existingDb.$id;
        } else {
            console.log(`Creating database: ${DATABASE_NAME}...`);
            const db = await databases.create(ID.unique(), DATABASE_NAME);
            dbId = db.$id;
            console.log(`✅ Database created: ${dbId}`);
        }
    } catch (e) {
        console.error("Failed to manage database:", e);
        return;
    }

    // 2. Create Collection (or find existing)
    try {
        console.log(`Checking for collection: ${COLLECTION_NAME}...`);
        const colls = await databases.listCollections(dbId);
        const existingColl = colls.collections.find(c => c.name === COLLECTION_NAME);

        if (existingColl) {
            console.log(`✅ Collection '${COLLECTION_NAME}' already exists (${existingColl.$id}).`);
            collectionId = existingColl.$id;
        } else {
            console.log(`Creating collection: ${COLLECTION_NAME}...`);
            const coll = await databases.createCollection(dbId, ID.unique(), COLLECTION_NAME);
            collectionId = coll.$id;
            console.log(`✅ Collection created: ${collectionId}`);
        }

        // Set permissions (Public Read, Create, Update, Delete)
        // WARNING: This makes the database publicly writable. In production, restrict Create/Update/Delete.
        console.log("Setting permissions...");
        await databases.updateCollection(
            dbId,
            collectionId,
            COLLECTION_NAME,
            [
                Permission.read(Role.any()),
                Permission.create(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any())
            ]
        );
        console.log("✅ Permissions updated: Public Read, Create, Update, Delete enabled.");

    } catch (e) {
        console.error("Failed to manage collection:", e);
        return;
    }

    // 3. Create Attributes
    // Helper to ignore "Attribute already exists" errors
    const createAttribute = async (action, name) => {
        try {
            await action();
            console.log(`   + Attribute '${name}' created.`);
            await delay(500); // Small delay to prevent rate limits or race conditions
        } catch (e) {
            if (e.code === 409) {
                console.log(`   = Attribute '${name}' already exists.`);
            } else {
                console.error(`   ! Failed to create attribute '${name}':`, e.message);
            }
        }
    };

    console.log("Defining Schema...");

    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'headline', 255, true), 'headline');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'kicker', 255, false), 'kicker');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'trail', 5000, false), 'trail');
    // Body can be large (HTML), Appwrite string limit is roughly 1GB, but we set reasonable limit
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'body', 100000, false), 'body');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'image', 2048, false), 'image'); // URL
    
    // New fields
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'videoUrl', 2048, false), 'videoUrl');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'keyFigures', 5000, false), 'keyFigures');

    // Meta
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'pillar', 64, true), 'pillar');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'section', 64, true), 'section');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'type', 64, true), 'type');
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'author', 128, false), 'author');
    
    await createAttribute(() => databases.createBooleanAttribute(dbId, collectionId, 'isLive', true), 'isLive');
    
    // Live Updates: Array of Strings (each string is stringified JSON)
    // Size is per element. 10000 chars should cover a decent update with HTML.
    await createAttribute(() => databases.createStringAttribute(dbId, collectionId, 'liveUpdates', 10000, false, null, true), 'liveUpdates');

    console.log("--------------------------------------------------");
    console.log("🎉 Setup Complete!");
    console.log("--------------------------------------------------");
    console.log("Add these to your .env file:");
    console.log(`VITE_APPWRITE_DATABASE_ID=${dbId}`);
    console.log(`VITE_APPWRITE_COLLECTION_ID_ARTICLES=${collectionId}`);
    console.log("--------------------------------------------------");
    console.log("NOTE: Go to Appwrite Console > Database > Articles > Settings > Permissions");
    console.log("      And add 'Any' role with 'Read' access (and 'Create/Update/Delete' if testing publicly).");
}

setup();
