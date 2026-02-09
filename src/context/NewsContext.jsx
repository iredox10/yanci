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
          // Parse liveUpdates if they are stored as strings
          const parsedDocs = docs.map(doc => ({
            ...doc,
            id: doc.$id, // Ensure ID compatibility
            liveUpdates: doc.liveUpdates ? doc.liveUpdates.map(u => typeof u === 'string' ? JSON.parse(u) : u) : []
          }));
          setArticles(parsedDocs);
        } catch (error) {
          console.error("Failed to fetch from Appwrite", error);
          // Fallback?
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to LocalStorage/Mock
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
        const doc = {
            ...payload,
            id: payload.$id,
            liveUpdates: payload.liveUpdates ? payload.liveUpdates.map(u => typeof u === 'string' ? JSON.parse(u) : u) : []
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

    return () => {
      unsubscribe();
    };
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
        // Appwrite is strict about unknown attributes. 
        // If you get an 'Unknown attribute' error, add the field in Appwrite Console 
        // or add it to this list.
        const allowedAttributes = [
          'headline', 'kicker', 'trail', 'body', 'image', 'videoUrl', 
          'keyFigures', 'pillar', 'section', 'type', 'author', 'isLive', 'liveUpdates'
        ];

        const cleanArticle = {};
        allowedAttributes.forEach(attr => {
          if (Object.prototype.hasOwnProperty.call(newArticle, attr)) {
            cleanArticle[attr] = newArticle[attr];
          }
        });

        const doc = await appwriteService.createArticle(cleanArticle);
        return doc.$id;
      } catch (error) {
        console.error("Failed to create article", error);
        alert(`Failed to save to cloud: ${error.message}`);
        return null;
      }
    } else {
      const id = Date.now(); // Simple ID for local
      setArticles(prev => [{ ...newArticle, id }, ...prev]);
      return id;
    }
  };

  const updateArticle = async (id, updatedData) => {
    if (isAppwriteConfigured) {
        try {
            const allowedAttributes = [
              'headline', 'kicker', 'trail', 'body', 'image', 'videoUrl', 
              'keyFigures', 'pillar', 'section', 'type', 'author', 'isLive', 'liveUpdates', 'series'
            ];

            const cleanData = {};
            allowedAttributes.forEach(attr => {
              if (Object.prototype.hasOwnProperty.call(updatedData, attr)) {
                cleanData[attr] = updatedData[attr];
              }
            });

            await appwriteService.updateArticle(id, cleanData);
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
            const currentUpdates = article.liveUpdates || [];
            const newUpdates = [newUpdate, ...currentUpdates];
            try {
                await appwriteService.updateLiveUpdates(articleId, newUpdates);
            } catch (error) {
                console.error("Failed to add live update", error);
            }
        }
    } else {
        setArticles(prevArticles => prevArticles.map(article => {
        if (String(article.id) === String(articleId)) {
            const updates = article.liveUpdates ? [newUpdate, ...article.liveUpdates] : [newUpdate];
            return { ...article, liveUpdates: updates };
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
            liveUpdates: article.liveUpdates.filter(u => String(u.id) !== String(updateId)) 
            };
        }
        return article;
        }));
    }
  };

  const getArticlesBySection = (section) => {
    return articles.filter(a => a.section === section);
  };
  
  const getArticlesByPillar = (pillar) => {
    return articles.filter(a => a.pillar === pillar);
  };

  const getArticleById = (id) => {
    return articles.find(a => String(a.id) === String(id));
  };

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
      getArticleById
    }}>
      {children}
    </NewsContext.Provider>
  );
};
