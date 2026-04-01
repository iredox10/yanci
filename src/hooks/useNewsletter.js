/**
 * useNewsletter — manages newsletter subscriptions stored in localStorage or Appwrite.
 *
 * Usage:
 *   const { subscribe, subscribers, loading } = useNewsletter();
 *   await subscribe('user@example.com');
 */

import { useState, useEffect, useCallback } from 'react';

const NEWSLETTER_KEY = 'yanci_newsletter_subscribers';

function getSubscribers() {
  try {
    const raw = localStorage.getItem(NEWSLETTER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSubscriber(email) {
  const subs = getSubscribers();
  if (subs.some((s) => s.email === email)) return false;
  const updated = [{ email, subscribedAt: new Date().toISOString() }, ...subs];
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(updated));
  return true;
}

function removeSubscriber(email) {
  const subs = getSubscribers();
  const updated = subs.filter((s) => s.email !== email);
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(updated));
  return true;
}

export function useNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSubscribers(getSubscribers());
    setLoading(false);
  }, []);

  const subscribe = useCallback(async (email) => {
    const success = addSubscriber(email);
    if (success) {
      setSubscribers(getSubscribers());
    }
    return success;
  }, []);

  const unsubscribe = useCallback(async (email) => {
    removeSubscriber(email);
    setSubscribers(getSubscribers());
  }, []);

  return { subscribe, unsubscribe, subscribers, loading, count: subscribers.length };
}

export default useNewsletter;
