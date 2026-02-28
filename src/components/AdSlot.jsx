/**
 * AdSlot — reusable ad placeholder component.
 *
 * Usage:
 *   <AdSlot variant="banner" />        // Full-width leaderboard (728×90 / responsive)
 *   <AdSlot variant="sidebar" />       // Sidebar box (300×250)
 *   <AdSlot variant="inline" />        // In-article inline unit (responsive)
 *   <AdSlot variant="sponsored" article={article} /> // Sponsored content card
 *
 * When `adCode` prop is provided, it renders the raw ad HTML (e.g. Google AdSense snippet).
 * When `adCode` is absent it shows a grey placeholder (useful during development).
 *
 * Props:
 *  variant    – 'banner' | 'sidebar' | 'inline' | 'sponsored'
 *  adCode     – raw HTML string from ad network (optional)
 *  label      – override the "Tallace-tallace" label
 *  className  – extra classes on the wrapper
 */

import { useEffect, useRef } from 'react';

function AdLabel({ text = 'Tallace-tallace' }) {
  return (
    <div className="text-center mb-1">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium border border-gray-200 px-2 py-0.5 rounded-sm">
        {text}
      </span>
    </div>
  );
}

// Injects raw ad HTML into a div (needed for Google AdSense / DFP scripts)
function RawAdInjector({ html }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !html) return;
    ref.current.innerHTML = html;
    // Re-execute any <script> tags inside the ad code
    const scripts = ref.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }, [html]);
  return <div ref={ref} />;
}

// Placeholder shown when no ad code is configured
function AdPlaceholder({ width, height, label }) {
  return (
    <div
      className="flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 text-xs font-medium select-none"
      style={{ minHeight: height, width: '100%', maxWidth: width }}
    >
      {label || `Ad ${width}×${height}`}
    </div>
  );
}

export default function AdSlot({ variant = 'banner', adCode, label, className = '' }) {
  if (variant === 'banner') {
    return (
      <div className={`w-full my-4 ${className}`}>
        <AdLabel text={label || 'Tallace-tallace'} />
        <div className="flex justify-center">
          {adCode ? (
            <RawAdInjector html={adCode} />
          ) : (
            <AdPlaceholder width="728px" height="90px" label="Leaderboard 728×90" />
          )}
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`w-full my-4 ${className}`}>
        <AdLabel text={label || 'Tallace-tallace'} />
        {adCode ? (
          <RawAdInjector html={adCode} />
        ) : (
          <AdPlaceholder width="300px" height="250px" label="Box 300×250" />
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`w-full my-6 py-2 border-t border-b border-gray-200 ${className}`}>
        <AdLabel text={label || 'Tallace-tallace'} />
        {adCode ? (
          <RawAdInjector html={adCode} />
        ) : (
          <AdPlaceholder width="100%" height="120px" label="In-article unit" />
        )}
      </div>
    );
  }

  if (variant === 'sponsored') {
    // Sponsored content card — wraps around an article-like object
    return null; // rendered via SponsoredContentLabel below
  }

  return null;
}

/**
 * SponsoredContentLabel — badge to mark sponsored articles.
 * Place inside any article card or at the top of an article page.
 */
export function SponsoredContentLabel({ sponsor }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
      Abun Tallafi
      {sponsor && <span className="font-normal text-amber-600">· {sponsor}</span>}
    </div>
  );
}
