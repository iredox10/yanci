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
export const COLLECTION_ID_SETTINGS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_SETTINGS;
export const COLLECTION_ID_ROLES = import.meta.env.VITE_APPWRITE_COLLECTION_ID_ROLES;
export const COLLECTION_ID_INVITATIONS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_INVITATIONS;
export const COLLECTION_ID_REVISIONS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_REVISIONS;
export const COLLECTION_ID_VIEWS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_VIEWS;
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

    // ─── Site Settings CRUD ──────────────────────────────────────────────────
    getSettings: async () => {
        try {
            if (!COLLECTION_ID_SETTINGS) return null;
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_SETTINGS, [Query.limit(1)]);
            return response.documents[0] || null;
        } catch { return null; }
    },
    updateSettings: async (data) => {
        try {
            const existing = await appwriteService.getSettings();
            if (existing) {
                return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_SETTINGS, existing.$id, data);
            }
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_SETTINGS, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: updateSettings :: error", error); throw error; }
    },

    // ─── Roles CRUD ──────────────────────────────────────────────────────────
    getRoles: async () => {
        try {
            if (!COLLECTION_ID_ROLES) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_ROLES, [Query.orderDesc('priority')]);
            return response.documents;
        } catch { return []; }
    },
    createRole: async (data) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_ROLES, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: createRole :: error", error); throw error; }
    },
    updateRole: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_ROLES, id, data);
        } catch (error) { console.error("AppwriteService :: updateRole :: error", error); throw error; }
    },
    deleteRole: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_ROLES, id);
            return true;
        } catch (error) { console.error("AppwriteService :: deleteRole :: error", error); return false; }
    },

    // ─── Invitations CRUD ────────────────────────────────────────────────────
    getInvitations: async () => {
        try {
            if (!COLLECTION_ID_INVITATIONS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_INVITATIONS, [Query.orderDesc('$createdAt')]);
            return response.documents;
        } catch { return []; }
    },
    createInvitation: async (data) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_INVITATIONS, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: createInvitation :: error", error); throw error; }
    },
    updateInvitation: async (id, data) => {
        try {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID_INVITATIONS, id, data);
        } catch (error) { console.error("AppwriteService :: updateInvitation :: error", error); throw error; }
    },
    deleteInvitation: async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_INVITATIONS, id);
            return true;
        } catch (error) { console.error("AppwriteService :: deleteInvitation :: error", error); return false; }
    },
    getInvitationByToken: async (token) => {
        try {
            if (!COLLECTION_ID_INVITATIONS) return null;
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_INVITATIONS, [Query.equal('token', token), Query.limit(1)]);
            return response.documents[0] || null;
        } catch { return null; }
    },

    // ─── Article Revisions CRUD ──────────────────────────────────────────────
    getRevisions: async (articleId) => {
        try {
            if (!COLLECTION_ID_REVISIONS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_REVISIONS, [Query.equal('article_id', articleId), Query.orderDesc('$createdAt'), Query.limit(50)]);
            return response.documents;
        } catch { return []; }
    },
    createRevision: async (data) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_REVISIONS, ID.unique(), data);
        } catch (error) { console.error("AppwriteService :: createRevision :: error", error); throw error; }
    },

    // ─── Article Views (Backend Analytics) ───────────────────────────────────
    trackView: async (data) => {
        try {
            return await databases.createDocument(DATABASE_ID, COLLECTION_ID_VIEWS, ID.unique(), {
                article_id: data.articleId,
                session_id: data.sessionId || null,
                ip_hash: data.ipHash || null,
                referrer: data.referrer || null,
                section: data.section || null,
                country: data.country || null,
                device: data.device || null,
                viewed_at: new Date().toISOString(),
            });
        } catch (error) { console.error("AppwriteService :: trackView :: error", error); }
    },
    getArticleViews: async (articleId) => {
        try {
            if (!COLLECTION_ID_VIEWS) return 0;
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_VIEWS, [Query.equal('article_id', articleId), Query.limit(1)]);
            return response.total;
        } catch { return 0; }
    },
    getMostReadArticles: async (limit = 10) => {
        try {
            if (!COLLECTION_ID_VIEWS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_VIEWS, [Query.limit(1000)]);
            const counts = {};
            response.documents.forEach(doc => {
                counts[doc.article_id] = (counts[doc.article_id] || 0) + 1;
            });
            return Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([articleId, views]) => ({ articleId, views }));
        } catch { return []; }
    },
    getViewsBySection: async () => {
        try {
            if (!COLLECTION_ID_VIEWS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_VIEWS, [Query.limit(1000)]);
            const counts = {};
            response.documents.forEach(doc => {
                const section = doc.section || 'unknown';
                counts[section] = (counts[section] || 0) + 1;
            });
            return Object.entries(counts).map(([section, views]) => ({ section, views }));
        } catch { return []; }
    },
    getTotalViews: async () => {
        try {
            if (!COLLECTION_ID_VIEWS) return 0;
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_VIEWS, [Query.limit(1)]);
            return response.total;
        } catch { return 0; }
    },
    getViewsByDateRange: async (startDate, endDate) => {
        try {
            if (!COLLECTION_ID_VIEWS) return [];
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_VIEWS, [Query.greaterThanEqual('viewed_at', startDate.toISOString()), Query.lessThanEqual('viewed_at', endDate.toISOString()), Query.limit(1000)]);
            const daily = {};
            response.documents.forEach(doc => {
                const date = doc.viewed_at?.slice(0, 10) || 'unknown';
                daily[date] = (daily[date] || 0) + 1;
            });
            return Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0])).map(([date, views]) => ({ date, views }));
        } catch { return []; }
    },
    getUniqueVisitors: async () => {
        try {
            if (!COLLECTION_ID_VIEWS) return 0;
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_VIEWS, [Query.limit(1000)]);
            const sessions = new Set();
            response.documents.forEach(doc => { if (doc.session_id) sessions.add(doc.session_id); });
            return sessions.size;
        } catch { return 0; }
    },
};

export default client;
