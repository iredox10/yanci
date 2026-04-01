/**
 * Push Notification Manager for Yanci PWA
 *
 * Handles:
 * - Requesting notification permission
 * - Subscribing to push notifications via VAPID
 * - Sending subscription to server (Appwrite)
 * - Receiving and displaying push notifications
 *
 * Usage:
 *   import { requestNotificationPermission, subscribeToPush } from './usePushNotifications';
 *   await requestNotificationPermission();
 *   await subscribeToPush();
 */

import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
const NOTIFICATIONS_COLLECTION = import.meta.env.VITE_NOTIFICATIONS_COLLECTION || '';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';

// Convert VAPID public key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if browser supports push notifications
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Get current notification permission status
export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

// Request notification permission from user
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[Push] Notifications not supported');
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('[Push] Error requesting permission:', error);
    return 'denied';
  }
}

// Subscribe to push notifications
export async function subscribeToPush() {
  if (!isPushSupported()) {
    console.warn('[Push] Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('[Push] Already subscribed to push');
      return subscription;
    }

    // Create new subscription
    if (!VAPID_PUBLIC_KEY) {
      console.warn('[Push] No VAPID public key configured');
      return null;
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('[Push] Subscribed to push notifications');
    return subscription;
  } catch (error) {
    console.error('[Push] Error subscribing:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('[Push] Unsubscribed from push notifications');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Push] Error unsubscribing:', error);
    return false;
  }
}

// Send subscription to server (Appwrite)
async function sendSubscriptionToServer(subscription) {
  if (!DATABASE_ID || !NOTIFICATIONS_COLLECTION) {
    console.warn('[Push] No Appwrite collection configured for notifications');
    return;
  }

  try {
    const { Client, Databases, ID } = await import('appwrite');
    const client = new Client();
    client.setEndpoint('https://cloud.appwrite.io/v1').setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');
    const databases = new Databases(client);

    await databases.createDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION,
      ID.unique(),
      {
        endpoint: subscription.endpoint,
        keys: JSON.stringify(subscription.keys),
        userAgent: navigator.userAgent,
        subscribedAt: new Date().toISOString(),
      }
    );

    console.log('[Push] Subscription saved to server');
  } catch (error) {
    console.error('[Push] Error saving subscription:', error);
  }
}

// React hook for managing push notifications
export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState(getNotificationPermission());
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isPushSupported()) return;

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('[Push] Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  // Enable push notifications
  const enablePush = useCallback(async () => {
    setLoading(true);

    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm === 'granted') {
        const subscription = await subscribeToPush();
        if (subscription) {
          setIsSubscribed(true);
          await sendSubscriptionToServer(subscription);
        }
      }
    } catch (error) {
      console.error('[Push] Error enabling push:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Disable push notifications
  const disablePush = useCallback(async () => {
    setLoading(true);

    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
    } catch (error) {
      console.error('[Push] Error disabling push:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    permission,
    isSubscribed,
    loading,
    isSupported: isPushSupported(),
    enablePush,
    disablePush,
  };
}

export default usePushNotifications;
