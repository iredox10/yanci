import { Client, Databases, Storage, Account, ID, Query } from 'appwrite';

export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID_ARTICLES = import.meta.env.VITE_APPWRITE_COLLECTION_ID_ARTICLES;
export const COLLECTION_ID_ELECTIONS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_ELECTIONS;
export const COLLECTION_ID_CANDIDATES = import.meta.env.VITE_APPWRITE_COLLECTION_ID_CANDIDATES;
export const COLLECTION_ID_RESULTS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_RESULTS;
export const COLLECTION_ID_FACTCHECKS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_FACTCHECKS;
export const COLLECTION_ID_HIGHLIGHTS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_HIGHLIGHTS;
export const COLLECTION_ID_HOMEPAGE_STATS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_HOMEPAGE_STATS;
export const COLLECTION_ID_SPORTS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_SPORTS;
export const COLLECTION_ID_HOMEPAGE_LAYOUT = import.meta.env.VITE_APPWRITE_COLLECTION_ID_HOMEPAGE_LAYOUT;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
export const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

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
            const result = storage.getFileView(BUCKET_ID, fileId);
            return result.href ? result.href : result;
        } catch (error) {
            console.error("AppwriteService :: getFilePreview :: error", error);
            return null;
        }
    },

    // ─── Election CRUD ───────────────────────────────────────────────────────
    getElections: async () => {
        try {
            if (!COLLECTION_ID_ELECTIONS) return [];
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_ELECTIONS,
                [Query.orderDesc('$createdAt')]
            );
            return response.documents;
        } catch (error) {
            console.error("AppwriteService :: getElections :: error", error);
            return [];
        }
    },
    createElection: async (election) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_ELECTIONS, ID.unique(), election);
        } catch (error) {
            console.error("AppwriteService :: createElection :: error", error);
            throw error;
        }
    },
    updateElection: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_ELECTIONS, id, data);
        } catch (error) {
            console.error("AppwriteService :: updateElection :: error", error);
            throw error;
        }
    },
    deleteElection: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_ELECTIONS, id);
            return true;
        } catch (error) {
            console.error("AppwriteService :: deleteElection :: error", error);
            return false;
        }
    },

    // ─── Candidate CRUD ──────────────────────────────────────────────────────
    getCandidates: async (electionId) => {
        try {
            if (!COLLECTION_ID_CANDIDATES) return [];
            const queries = electionId ? [Query.equal('electionId', electionId)] : [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CANDIDATES, queries);
            return response.documents;
        } catch (error) {
            console.error("AppwriteService :: getCandidates :: error", error);
            return [];
        }
    },
    createCandidate: async (candidate) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_CANDIDATES, ID.unique(), candidate);
        } catch (error) {
            console.error("AppwriteService :: createCandidate :: error", error);
            throw error;
        }
    },
    updateCandidate: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_CANDIDATES, id, data);
        } catch (error) {
            console.error("AppwriteService :: updateCandidate :: error", error);
            throw error;
        }
    },
    deleteCandidate: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_CANDIDATES, id);
            return true;
        } catch (error) {
            console.error("AppwriteService :: deleteCandidate :: error", error);
            return false;
        }
    },

    // ─── Results CRUD ────────────────────────────────────────────────────────
    getResults: async (electionId) => {
        try {
            if (!COLLECTION_ID_RESULTS) return [];
            const queries = electionId ? [Query.equal('electionId', electionId)] : [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_RESULTS, queries);
            return response.documents;
        } catch (error) {
            console.error("AppwriteService :: getResults :: error", error);
            return [];
        }
    },
    createResult: async (result) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_RESULTS, ID.unique(), result);
        } catch (error) {
            console.error("AppwriteService :: createResult :: error", error);
            throw error;
        }
    },
    updateResult: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_RESULTS, id, data);
        } catch (error) {
            console.error("AppwriteService :: updateResult :: error", error);
            throw error;
        }
    },
    deleteResult: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_RESULTS, id);
            return true;
        } catch (error) {
            console.error("AppwriteService :: deleteResult :: error", error);
            return false;
        }
    },
    bulkCreateResults: async (results) => {
        try {
            const promises = results.map((r) => databases.createDocument(DATABASE_ID, COLLECTION_ID_RESULTS, ID.unique(), r));
            return await Promise.all(promises);
        } catch (error) {
            console.error("AppwriteService :: bulkCreateResults :: error", error);
            throw error;
        }
    },

    // ─── Fact-Check CRUD ─────────────────────────────────────────────────────
    getFactChecks: async (electionId) => {
        try {
            if (!COLLECTION_ID_FACTCHECKS) return [];
            const queries = electionId ? [Query.equal('electionId', electionId)] : [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_FACTCHECKS, queries);
            return response.documents;
        } catch (error) {
            console.error("AppwriteService :: getFactChecks :: error", error);
            return [];
        }
    },
    createFactCheck: async (factCheck) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_FACTCHECKS, ID.unique(), factCheck);
        } catch (error) {
            console.error("AppwriteService :: createFactCheck :: error", error);
            throw error;
        }
    },
    updateFactCheck: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_FACTCHECKS, id, data);
        } catch (error) {
            console.error("AppwriteService :: updateFactCheck :: error", error);
            throw error;
        }
    },
    deleteFactCheck: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_FACTCHECKS, id);
            return true;
        } catch (error) {
            console.error("AppwriteService :: deleteFactCheck :: error", error);
            return false;
        }
    },

    // ─── Highlights CRUD ─────────────────────────────────────────────────────
    getHighlights: async () => {
        try {
            if (!COLLECTION_ID_HIGHLIGHTS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_HIGHLIGHTS, [Query.orderAsc('order')]);
            return response.documents;
        } catch { return []; }
    },
    createHighlight: async (data) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_HIGHLIGHTS, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: createHighlight :: error", error); throw error; }
    },
    updateHighlight: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_HIGHLIGHTS, id, data);
        } catch (error) { console.error("AppwriteService :: updateHighlight :: error", error); throw error; }
    },
    deleteHighlight: async (id) => {
        try { await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_HIGHLIGHTS, id); return true; }
        catch (error) { console.error("AppwriteService :: deleteHighlight :: error", error); return false; }
    },

    // ─── Homepage Stats CRUD ─────────────────────────────────────────────────
    getHomepageStats: async () => {
        try {
            if (!COLLECTION_ID_HOMEPAGE_STATS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_HOMEPAGE_STATS, [Query.orderAsc('order')]);
            return response.documents;
        } catch { return []; }
    },
    createHomepageStat: async (data) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_HOMEPAGE_STATS, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: createHomepageStat :: error", error); throw error; }
    },
    updateHomepageStat: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_HOMEPAGE_STATS, id, data);
        } catch (error) { console.error("AppwriteService :: updateHomepageStat :: error", error); throw error; }
    },
    deleteHomepageStat: async (id) => {
        try { await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_HOMEPAGE_STATS, id); return true; }
        catch (error) { console.error("AppwriteService :: deleteHomepageStat :: error", error); return false; }
    },

    // ─── Sports Data CRUD ────────────────────────────────────────────────────
    getSportsData: async () => {
        try {
            if (!COLLECTION_ID_SPORTS) return null;
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_SPORTS, [Query.orderDesc('$updatedAt'), Query.limit(1)]);
            return response.documents[0] || null;
        } catch { return null; }
    },
    upsertSportsData: async (data) => {
        try {
            const existing = await appwriteService.getSportsData();
            if (existing) {
                return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_SPORTS, existing.$id, data);
            }
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_SPORTS, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: upsertSportsData :: error", error); throw error; }
    },

    // ─── Homepage Layout CRUD ────────────────────────────────────────────────
    getHomepageLayout: async () => {
        try {
            if (!COLLECTION_ID_HOMEPAGE_LAYOUT) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_HOMEPAGE_LAYOUT, [Query.orderAsc('order')]);
            return response.documents;
        } catch { return []; }
    },
    updateHomepageLayout: async (sections) => {
        try {
            const existing = await appwriteService.getHomepageLayout();
            if (existing.length > 0) {
                const doc = existing[0];
                return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_HOMEPAGE_LAYOUT, doc.$id, { sections: JSON.stringify(sections) });
            }
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_HOMEPAGE_LAYOUT, ID.unique(), { sections: JSON.stringify(sections) });
        } catch (error) { console.error("AppwriteService :: updateHomepageLayout :: error", error); throw error; }
    },
};

export default client;
