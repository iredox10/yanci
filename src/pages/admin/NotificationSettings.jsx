/**
 * NotificationSettings — admin panel component for managing push notifications.
 *
 * Allows admins to:
 * - Send breaking news push notifications to all subscribers
 * - View subscriber count
 * - Test notification delivery
 */

import { useState } from 'react';
import { FaBell, FaPaperPlane, FaUsers, FaTrash } from 'react-icons/fa6';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export default function NotificationSettings() {
  const { isSubscribed, enablePush, disablePush, isSupported, permission } = usePushNotifications();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [subscriberCount] = useState(0); // Would be fetched from Appwrite

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // In production, this would call an Appwrite Cloud Function
      // that sends the push notification via web-push library
      console.log('[Admin] Sending notification:', { title, body, url });

      // For local testing, show a local notification
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          data: { url },
          tag: 'breaking-news',
          renotify: true,
          requireInteraction: true,
        });
      }

      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error('[Admin] Error sending notification:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Push Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">
          Send breaking news alerts to readers who have installed the Yanci PWA.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notification Status</h3>
              <p className="text-sm text-gray-500">
                {isSupported ? 'Push notifications supported' : 'Push notifications not supported in this browser'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isSubscribed
                ? 'bg-green-100 text-green-700'
                : permission === 'denied'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isSubscribed ? 'Subscribed' : permission === 'denied' ? 'Blocked' : 'Not subscribed'}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers className="text-gray-400" />
            <span>{subscriberCount} subscribers</span>
          </div>
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <button
                onClick={disablePush}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <FaTrash className="w-3 h-3" /> Unsubscribe
              </button>
            ) : (
              <button
                onClick={enablePush}
                disabled={!isSupported}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                Subscribe to test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaPaperPlane className="text-gray-400" />
          Send Breaking News Alert
        </h3>

        {sent && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Notification sent successfully!
          </div>
        )}

        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Kai Tsaye: ..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Brief description of the breaking news..."
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL (optional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/article/123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={sending || !title || !body}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaPaperPlane className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send to All Subscribers'}
            </button>
          </div>
        </form>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-800 mb-2">Setup Required</h4>
        <p className="text-sm text-amber-700">
          To enable push notifications in production, you need to:
        </p>
        <ol className="text-sm text-amber-700 mt-2 list-decimal list-inside space-y-1">
          <li>Generate VAPID keys (run <code className="bg-amber-100 px-1 rounded">npx web-push generate-vapid-keys</code>)</li>
          <li>Add <code className="bg-amber-100 px-1 rounded">VITE_VAPID_PUBLIC_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env</code></li>
          <li>Deploy an Appwrite Cloud Function to handle push delivery via the <code className="bg-amber-100 px-1 rounded">web-push</code> library</li>
          <li>Create a <code className="bg-amber-100 px-1 rounded">notifications</code> collection in Appwrite to store subscriptions</li>
        </ol>
      </div>
    </div>
  );
}
