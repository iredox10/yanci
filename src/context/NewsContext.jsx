import { createContext, useContext, useState, useEffect } from 'react';
import { GUARDIAN_DATA } from '../data/guardianData';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  // Flatten the initial data for easier management
  const initialArticles = [
    ...GUARDIAN_DATA.headlines.map(a => ({ ...a, section: 'headlines' })), // pillar is already in object
    ...GUARDIAN_DATA.sport.map(a => ({ ...a, section: 'sport' })),
    ...GUARDIAN_DATA.opinion.map(a => ({ ...a, section: 'opinion' })),
    ...GUARDIAN_DATA.culture.map(a => ({ ...a, section: 'culture' })),
    ...GUARDIAN_DATA.lifestyle.map(a => ({ ...a, section: 'lifestyle' })),
  ];

  // Load from localStorage if available, else use initial data
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('yanci_articles');
    return saved ? JSON.parse(saved) : initialArticles;
  });

  const [ticker, setTicker] = useState(() => {
    const saved = localStorage.getItem('yanci_ticker');
    return saved ? JSON.parse(saved) : GUARDIAN_DATA.ticker;
  });

  useEffect(() => {
    localStorage.setItem('yanci_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('yanci_ticker', JSON.stringify(ticker));
  }, [ticker]);

  const addArticle = (article) => {
    const newArticle = { ...article, id: Date.now() };
    setArticles([newArticle, ...articles]);
  };

  const updateArticle = (id, updatedData) => {
    setArticles(articles.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteArticle = (id) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  const getArticlesBySection = (section) => {
    return articles.filter(a => a.section === section);
  };
  
  const getArticlesByPillar = (pillar) => {
    return articles.filter(a => a.pillar === pillar);
  };

  const getArticleById = (id) => {
    return articles.find(a => a.id === parseInt(id) || a.id === id);
  };

  return (
    <NewsContext.Provider value={{ 
      articles, 
      ticker,
      addArticle, 
      updateArticle, 
      deleteArticle, 
      getArticlesBySection,
      getArticlesByPillar,
      getArticleById
    }}>
      {children}
    </NewsContext.Provider>
  );
};
