/**
 * useComments — manages article comments stored in Appwrite or localStorage.
 *
 * Usage:
 *   const { comments, addComment, deleteComment, loading } = useComments(articleId);
 */

import { useState, useEffect, useCallback } from 'react';
import client, { appwriteService, DATABASE_ID, COLLECTION_ID_ARTICLES } from '../lib/appwrite';

const COMMENTS_STORAGE_KEY = 'yanci_comments';

function getLocalComments(articleId) {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[String(articleId)] || [];
  } catch {
    return [];
  }
}

function setLocalComments(articleId, comments) {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[String(articleId)] = comments;
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // quota exceeded
  }
}

export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAppwriteConfigured = !!DATABASE_ID && !!COLLECTION_ID_ARTICLES;

  useEffect(() => {
    if (!articleId) return;

    if (isAppwriteConfigured) {
      // In a real setup, you'd have a separate comments collection
      // For now, fall back to localStorage
      setComments(getLocalComments(articleId));
      setLoading(false);
    } else {
      setComments(getLocalComments(articleId));
      setLoading(false);
    }
  }, [articleId, isAppwriteConfigured]);

  const addComment = useCallback(
    (commentData) => {
      if (!articleId) return;
      const newComment = {
        id: Date.now().toString(),
        ...commentData,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      const updated = [newComment, ...comments];
      setComments(updated);
      setLocalComments(articleId, updated);
      return newComment;
    },
    [articleId, comments]
  );

  const deleteComment = useCallback(
    (commentId) => {
      if (!articleId) return;
      const updated = comments.filter((c) => c.id !== commentId);
      setComments(updated);
      setLocalComments(articleId, updated);
    },
    [articleId, comments]
  );

  const likeComment = useCallback(
    (commentId) => {
      if (!articleId) return;
      const updated = comments.map((c) =>
        c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
      );
      setComments(updated);
      setLocalComments(articleId, updated);
    },
    [articleId, comments]
  );

  return { comments, loading, addComment, deleteComment, likeComment };
}

export default useComments;
