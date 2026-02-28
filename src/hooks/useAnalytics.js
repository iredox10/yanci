/**
 * useAnalytics
 * Thin wrapper around Plausible (primary) or GA4 (secondary) analytics.
 *
 * Configuration (optional — set in .env):
 *   VITE_PLAUSIBLE_DOMAIN   e.g. "yanci.ng"
 *   VITE_GA4_MEASUREMENT_ID e.g. "G-XXXXXXXXXX"
 *
 * If neither is configured the hook silently no-ops so the app works
 * in development without any external dependency.
 *
 * Usage:
 *   const { trackEvent, trackPageView } = useAnalytics();
 *   trackPageView('/article/123', 'Hausa headline here');
 *   trackEvent('share', { article_id: '123', method: 'twitter' });
 */

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

// Inject Plausible script once
let plausibleInjected = false;
const injectPlausible = () => {
  if (plausibleInjected || !PLAUSIBLE_DOMAIN) return;
  if (document.querySelector('script[data-domain]')) {
    plausibleInjected = true;
    return;
  }
  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = PLAUSIBLE_DOMAIN;
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
  plausibleInjected = true;
};

// Inject GA4 gtag script once
let ga4Injected = false;
const injectGA4 = () => {
  if (ga4Injected || !GA4_ID) return;
  if (document.getElementById('gtag-script')) {
    ga4Injected = true;
    return;
  }
  const s = document.createElement('script');
  s.id = 'gtag-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line no-inner-declarations
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, { send_page_view: false });
  ga4Injected = true;
};

/**
 * Track a custom event.
 * @param {string} name  - event name (e.g. 'Article Read', 'Share', 'Search')
 * @param {object} [props] - key/value metadata
 */
const fireEvent = (name, props = {}) => {
  // Plausible
  if (PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible(name, { props });
  }
  // GA4
  if (GA4_ID && window.gtag) {
    window.gtag('event', name, props);
  }
  // Dev / fallback
  if (import.meta.env.DEV) {
    console.debug('[Analytics]', name, props);
  }
};

/**
 * Track a page view.
 * @param {string} path  - e.g. '/article/123'
 * @param {string} [title] - document title
 */
const firePageView = (path, title) => {
  // Plausible handles pageviews automatically via its script,
  // but we can also fire a manual one for SPA navigation.
  if (PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible('pageview', { u: `https://${PLAUSIBLE_DOMAIN}${path}` });
  }
  // GA4
  if (GA4_ID && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }
  if (import.meta.env.DEV) {
    console.debug('[Analytics] pageview', path, title);
  }
};

export const useAnalytics = () => {
  // Inject scripts on first hook call
  if (PLAUSIBLE_DOMAIN) injectPlausible();
  if (GA4_ID) injectGA4();

  return {
    /**
     * Fire a named event with optional metadata.
     */
    trackEvent: fireEvent,

    /**
     * Fire a page view — call on route changes.
     */
    trackPageView: firePageView,

    /**
     * Convenience: track an article view.
     * @param {{ id: string, headline: string, pillar: string, author: string }} article
     */
    trackArticleView: (article) => {
      fireEvent('Article Read', {
        article_id: String(article?.id ?? ''),
        headline: article?.headline ?? '',
        pillar: article?.pillar ?? '',
        author: article?.author ?? '',
      });
      firePageView(`/article/${article?.id}`, article?.headline);
    },

    /**
     * Track a search query.
     */
    trackSearch: (query, resultCount) => {
      fireEvent('Search', { query, results: resultCount });
    },

    /**
     * Track a share action.
     */
    trackShare: (articleId, method) => {
      fireEvent('Share', { article_id: String(articleId), method });
    },
  };
};

export default useAnalytics;
