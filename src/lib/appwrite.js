import { Client, Databases, Storage, ID, Query } from 'appwrite';

export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID_ARTICLES = import.meta.env.VITE_APPWRITE_COLLECTION_ID_ARTICLES;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
export const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);

export const appwriteService = {
    getArticles: async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_ARTICLES,
                [Query.orderDesc('$createdAt')]
            );
            return response.documents;
        } catch (error) {
            console.error("AppwriteService :: getArticles :: error", error);
            return [];
        }
    },

    createArticle: async (article) => {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_ARTICLES,
                ID.unique(),
                article
            );
        } catch (error) {
            console.error("AppwriteService :: createArticle :: error", error);
            throw error;
        }
    },

    updateArticle: async (id, data) => {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_ARTICLES,
                id,
                data
            );
        } catch (error) {
            console.error("AppwriteService :: updateArticle :: error", error);
            throw error;
        }
    },

    deleteArticle: async (id) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID_ARTICLES,
                id
            );
            return true;
        } catch (error) {
            console.error("AppwriteService :: deleteArticle :: error", error);
            return false;
        }
    },
    
    updateLiveUpdates: async (articleId, updates) => {
         try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_ARTICLES,
                articleId,
                {
                    liveUpdates: updates.map(u => JSON.stringify(u))
                }
            );
        } catch (error) {
            console.error("AppwriteService :: updateLiveUpdates :: error", error);
            throw error;
        }
    },

    uploadFile: async (file) => {
        try {
            return await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("AppwriteService :: uploadFile :: error", error);
            throw error;
        }
    },

    getFilePreview: (fileId) => {
        try {
            return storage.getFileView(BUCKET_ID, fileId).href;
        } catch (error) {
            console.error("AppwriteService :: getFilePreview :: error", error);
            return null;
        }
    }
};

export default client;
