import { useState, useEffect } from 'react';
import { FaWhatsapp, FaXmark, FaMessage } from 'react-icons/fa6';

const WhatsAppTipLine = ({ phoneNumber = '2348000000000', defaultMessage = 'Sannu! Ina son aika da labari ga Yanci.' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show after 3 seconds, but respect dismissal
    const dismissed = localStorage.getItem('yanci_whatsapp_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('yanci_whatsapp_dismissed', 'true');
  };

  const handleReopen = () => {
    setIsVisible(true);
    setIsDismissed(true);
    localStorage.removeItem('yanci_whatsapp_dismissed');
  };

  if (!isVisible && !isDismissed) return null;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group"
        aria-label="Send news tip via WhatsApp"
      >
        <FaWhatsapp className="w-7 h-7" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Aika Labari
        </span>
      </a>

      {/* Tip Line Banner (auto-shows once) */}
      {isVisible && !isDismissed && (
        <div className="fixed bottom-24 right-6 z-50 max-w-xs bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up" role="dialog" aria-label="WhatsApp tip line">
          <div className="bg-green-500 p-3 flex items-center gap-3">
            <FaWhatsapp className="w-6 h-6 text-white" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Aika Labari</p>
              <p className="text-xs text-green-100 truncate">Ka san wani labari? Aika mana!</p>
            </div>
            <button onClick={handleDismiss} className="p-1 text-white/80 hover:text-white transition-colors" aria-label="Dismiss">
              <FaXmark className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              Ka ga wani abu? Ka san labarin da bai fito ba? Aika mana ta WhatsApp — mu za su duba mu buga.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm transition-colors"
            >
              <FaMessage className="w-4 h-4" /> Aika ta WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Reopen button (after dismissal) */}
      {isDismissed && !isVisible && (
        <button
          onClick={handleReopen}
          className="fixed bottom-24 right-6 z-50 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-md text-xs font-bold text-green-600 hover:bg-green-50 transition-colors flex items-center gap-1.5"
          aria-label="Open WhatsApp tip line"
        >
          <FaWhatsapp className="w-3 h-3" /> Aika Labari
        </button>
      )}
    </>
  );
};

export default WhatsAppTipLine;
