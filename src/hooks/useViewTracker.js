/**
 * useViewTracker — tracks article view counts in localStorage.
 *
 * Usage:
 *   const { trackView, getViewCount, getMostRead } = useViewTracker();
 *   trackView(articleId);                 // call on article page mount
 *   getViewCount(articleId)               // → number
 *   getMostRead(articles, limit)          // → articles[] sorted by views desc
 */

import { useCallback } from 'react';

const STORAGE_KEY = 'yanci_article_views';

function getViewStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setViewStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota exceeded — ignore
  }
}

export function useViewTracker() {
  const trackView = useCallback((articleId) => {
    if (!articleId) return;
    const store = getViewStore();
    const key = String(articleId);
    store[key] = (store[key] || 0) + 1;
    setViewStore(store);
  }, []);

  const getViewCount = useCallback((articleId) => {
    const store = getViewStore();
    return store[String(articleId)] || 0;
  }, []);

  const getMostRead = useCallback(
    (articles = [], limit = 5) => {
      if (!Array.isArray(articles)) return [];
      const store = getViewStore();
      return [...articles]
        .sort((a, b) => (store[String(b.id)] || 0) - (store[String(a.id)] || 0))
        .slice(0, limit);
    },
    []
  );

  return { trackView, getViewCount, getMostRead };
}
