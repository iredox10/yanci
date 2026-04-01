/**
 * NotificationPrompt — shows a dismissible prompt asking readers to enable push notifications.
 *
 * Appears as a small banner at the bottom of the screen on the homepage.
 * Only shows if:
 * - Push is supported
 * - Permission is not yet granted or denied
 * - User hasn't dismissed it before
 */

import { useState, useEffect } from 'react';
import { FaBell, FaXmark } from 'react-icons/fa6';
import { usePushNotifications, requestNotificationPermission } from '../hooks/usePushNotifications';

const DISMISSED_KEY = 'yanci_notification_prompt_dismissed';

export default function NotificationPrompt() {
  const { isSupported, isSubscribed, permission, enablePush } = usePushNotifications();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (
      isSupported &&
      !isSubscribed &&
      permission !== 'denied' &&
      permission !== 'granted' &&
      !dismissed
    ) {
      // Show after 5 seconds on site
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, isSubscribed, permission]);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  const handleEnable = async () => {
    await enablePush();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
      <div className="bg-[#0f3036] text-white rounded-xl shadow-2xl p-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
          aria-label="Close notification prompt"
        >
          <FaXmark size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#c59d5f]/20 rounded-xl flex items-center justify-center shrink-0">
            <FaBell className="w-6 h-6 text-[#c59d5f]" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">Sami Labarai Kai Tsaye</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-3">
              Kada ka rasa wani labari! Ba da izinin sanarwa don samun labarai na gaggawa kai tsaye.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleEnable}
                className="px-4 py-2 bg-[#c59d5f] text-[#0f3036] text-xs font-bold rounded-lg hover:bg-[#d4a85f] transition-colors"
              >
                Ba da Izini
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                Yanzu A'a
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
