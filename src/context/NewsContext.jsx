import { createContext, useContext, useState, useEffect } from 'react';
import { GUARDIAN_DATA } from '../data/guardianData';
import client, { appwriteService, DATABASE_ID, COLLECTION_ID_ARTICLES, PROJECT_ID } from '../lib/appwrite';

const NewsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

const getInitialArticles = () => {
  return [
    ...GUARDIAN_DATA.headlines.map(a => ({ ...a, section: 'headlines' })),
    ...GUARDIAN_DATA.sport.map(a => ({ ...a, section: 'sport' })),
    ...GUARDIAN_DATA.opinion.map(a => ({ ...a, section: 'opinion' })),
    ...GUARDIAN_DATA.culture.map(a => ({ ...a, section: 'culture' })),
    ...GUARDIAN_DATA.lifestyle.map(a => ({ ...a, section: 'lifestyle' })),
  ];
};

// ─── keyFigures JSON packing ──────────────────────────────────────────────────
// Appwrite's collection has hit the 23-attribute limit.
// We pack 8 overflow string fields into the existing `keyFigures` field as JSON.
// Format stored in Appwrite:  {"_kf":"...", "imageCaption":"...", ...}
// The "_kf" key holds the actual key-figures text.

const PACKED_KEYS = [
  'imageCaption', 'imageCredit', 'imageAlt',
  'tags', 'coAuthor', 'ogTitle', 'ogDescription', 'relatedArticles',
];

function packKeyFigures(article) {
  const packed = {};
  const kf = article.keyFigures || '';
  // Only pack into JSON if any overflow field is non-empty
  const hasOverflow = PACKED_KEYS.some(k => article[k]);
  if (hasOverflow || (typeof kf === 'string' && kf.startsWith('{'))) {
    const bag = { _kf: kf };
    PACKED_KEYS.forEach(k => {
      if (article[k] !== undefined && article[k] !== null && article[k] !== '') {
        bag[k] = article[k];
      }
    });
    return JSON.stringify(bag);
  }
  return kf; // plain text passthrough
}

function unpackKeyFigures(doc) {
  const kf = doc.keyFigures || '';
  if (typeof kf === 'string' && kf.startsWith('{')) {
    try {
      const bag = JSON.parse(kf);
      const { _kf, ...overflow } = bag;
      return { ...doc, keyFigures: _kf || '', ...overflow };
    } catch {
      // fall through
    }
  }
  return doc;
}

// ─── Attribute whitelist (only real Appwrite columns) ────────────────────────
const APPWRITE_ATTRIBUTES = [
  'headline', 'kicker', 'trail', 'body', 'image', 'videoUrl',
  'keyFigures', 'pillar', 'section', 'type', 'author', 'isLive', 'liveUpdates', 'series',
  'status', 'publishAt', 'slug', 'metaTitle', 'metaDescription',
  'isSensitive', 'imageFocalX', 'imageFocalY', 'format',
];

function prepareForAppwrite(article) {
  // Pack overflow fields into keyFigures
  const packed = { ...article, keyFigures: packKeyFigures(article) };
  // Strip non-Appwrite keys
  const clean = {};
  APPWRITE_ATTRIBUTES.forEach(attr => {
    if (Object.prototype.hasOwnProperty.call(packed, attr)) {
      clean[attr] = packed[attr];
    }
  });
  return clean;
}

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [ticker] = useState(GUARDIAN_DATA.ticker);
  const [loading, setLoading] = useState(true);
  const [isAppwriteConfigured] = useState(!!PROJECT_ID && !!DATABASE_ID && !!COLLECTION_ID_ARTICLES);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (isAppwriteConfigured) {
        try {
          const docs = await appwriteService.getArticles();
          const parsedDocs = docs.map(doc => {
            const unpacked = unpackKeyFigures(doc);
            return {
              ...unpacked,
              id: doc.$id,
              liveUpdates: doc.liveUpdates
                ? doc.liveUpdates.map(u => typeof u === 'string' ? JSON.parse(u) : u)
                : [],
            };
          });
          setArticles(parsedDocs);
        } catch (error) {
          console.error("Failed to fetch from Appwrite", error);
        } finally {
          setLoading(false);
        }
      } else {
        const saved = localStorage.getItem('yanci_articles');
        setArticles(saved ? JSON.parse(saved) : getInitialArticles());
        setLoading(false);
      }
    };

    loadData();
  }, [isAppwriteConfigured]);

  // Realtime Subscription
  useEffect(() => {
    if (!isAppwriteConfigured) return;

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_ARTICLES}.documents`,
      (response) => {
        const { events, payload } = response;
        const unpacked = unpackKeyFigures(payload);
        const doc = {
          ...unpacked,
          id: payload.$id,
          liveUpdates: payload.liveUpdates
            ? payload.liveUpdates.map(u => typeof u === 'string' ? JSON.parse(u) : u)
            : [],
        };

        if (events.includes('databases.*.collections.*.documents.*.create')) {
          setArticles(prev => [doc, ...prev]);
        }
        if (events.includes('databases.*.collections.*.documents.*.update')) {
          setArticles(prev => prev.map(a => a.id === doc.id ? doc : a));
        }
        if (events.includes('databases.*.collections.*.documents.*.delete')) {
          setArticles(prev => prev.filter(a => a.id !== doc.id));
        }
      }
    );

    return () => { unsubscribe(); };
  }, [isAppwriteConfigured]);

  // LocalStorage Sync (Only if NOT using Appwrite)
  useEffect(() => {
    if (!isAppwriteConfigured && !loading) {
      localStorage.setItem('yanci_articles', JSON.stringify(articles));
    }
  }, [articles, isAppwriteConfigured, loading]);

  const addArticle = async (article) => {
    const newArticle = { ...article, liveUpdates: [] };

    if (isAppwriteConfigured) {
      try {
        const clean = prepareForAppwrite(newArticle);
        const doc = await appwriteService.createArticle(clean);
        return doc.$id;
      } catch (error) {
        console.error("Failed to create article", error);
        alert(`Failed to save to cloud: ${error.message}`);
        return null;
      }
    } else {
      const id = Date.now();
      setArticles(prev => [{ ...newArticle, id }, ...prev]);
      return id;
    }
  };

  const updateArticle = async (id, updatedData) => {
    if (isAppwriteConfigured) {
      try {
        const clean = prepareForAppwrite(updatedData);
        await appwriteService.updateArticle(id, clean);
      } catch (error) {
        console.error("Failed to update article", error);
        alert(`Failed to update cloud: ${error.message}`);
      }
    } else {
      setArticles(articles.map(a => String(a.id) === String(id) ? { ...a, ...updatedData } : a));
    }
  };

  const deleteArticle = async (id) => {
    if (isAppwriteConfigured) {
      try {
        await appwriteService.deleteArticle(id);
      } catch (error) {
        console.error("Failed to delete article", error);
      }
    } else {
      setArticles(articles.filter(a => String(a.id) !== String(id)));
    }
  };

  // Live Update Functions
  const addLiveUpdate = async (articleId, updateData) => {
    const newUpdate = { ...updateData, id: Date.now(), timestamp: new Date().toISOString() };

    if (isAppwriteConfigured) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        const newUpdates = [newUpdate, ...(article.liveUpdates || [])];
        try {
          await appwriteService.updateLiveUpdates(articleId, newUpdates);
        } catch (error) {
          console.error("Failed to add live update", error);
        }
      }
    } else {
      setArticles(prevArticles => prevArticles.map(article => {
        if (String(article.id) === String(articleId)) {
          return { ...article, liveUpdates: [newUpdate, ...(article.liveUpdates || [])] };
        }
        return article;
      }));
    }
  };

  const deleteLiveUpdate = async (articleId, updateId) => {
    if (isAppwriteConfigured) {
      const article = articles.find(a => String(a.id) === String(articleId));
      if (article) {
        const newUpdates = article.liveUpdates.filter(u => String(u.id) !== String(updateId));
        try {
          await appwriteService.updateLiveUpdates(articleId, newUpdates);
        } catch (error) {
          console.error("Failed to delete live update", error);
        }
      }
    } else {
      setArticles(prevArticles => prevArticles.map(article => {
        if (String(article.id) === String(articleId)) {
          return {
            ...article,
            liveUpdates: article.liveUpdates.filter(u => String(u.id) !== String(updateId)),
          };
        }
        return article;
      }));
    }
  };

  const getArticlesBySection = (section) => articles.filter(a => a.section === section);
  const getArticlesByPillar = (pillar) => articles.filter(a => a.pillar === pillar);
  const getArticleById = (id) => articles.find(a => String(a.id) === String(id));

  return (
    <NewsContext.Provider value={{
      articles,
      ticker,
      loading,
      addArticle,
      updateArticle,
      deleteArticle,
      addLiveUpdate,
      deleteLiveUpdate,
      getArticlesBySection,
      getArticlesByPillar,
      getArticleById,
    }}>
      {children}
    </NewsContext.Provider>
  );
};
