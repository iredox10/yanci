import { Client, Storage, ID, Permission, Role } from 'node-appwrite';

// Configuration
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

const BUCKET_NAME = 'Media';

if (!PROJECT_ID || !API_KEY) {
    console.error("Error: Please set VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY in your .env file.");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const storage = new Storage(client);

async function setupStorage() {
    console.log("🚀 Starting Storage Setup...");

    try {
        console.log(`Checking for bucket: ${BUCKET_NAME}...`);
        const buckets = await storage.listBuckets();
        const existingBucket = buckets.buckets.find(b => b.name === BUCKET_NAME);
        
        let bucketId;

        if (existingBucket) {
            console.log(`✅ Bucket '${BUCKET_NAME}' already exists (${existingBucket.$id}).`);
            bucketId = existingBucket.$id;
        } else {
            console.log(`Creating bucket: ${BUCKET_NAME}...`);
            const bucket = await storage.createBucket(
                ID.unique(), 
                BUCKET_NAME, 
                [Permission.read(Role.any())], // Permissions: Public Read
                false, // File Security
                true, // Enabled
                undefined, // Max File Size (default)
                ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm'] // Allowed extensions
            );
            bucketId = bucket.$id;
            console.log(`✅ Bucket created: ${bucketId}`);
            
            // Explicitly update permissions just in case
            await storage.updateBucket(
                bucketId,
                BUCKET_NAME,
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()), // Allow creation for now (refine in prod)
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ],
                false, // file security
                true, // enabled
                undefined, // max size
                ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm']
            );
             console.log(`✅ Permissions updated.`);
        }

        console.log("--------------------------------------------------");
        console.log("🎉 Storage Setup Complete!");
        console.log("--------------------------------------------------");
        console.log("Add this to your .env file:");
        console.log(`VITE_APPWRITE_BUCKET_ID=${bucketId}`);
        console.log("--------------------------------------------------");

    } catch (e) {
        console.error("Failed to setup storage:", e);
    }
}

setupStorage();
