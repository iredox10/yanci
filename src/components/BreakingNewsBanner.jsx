import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appwriteService } from '../lib/appwrite';
import { FaBolt, FaXmark } from 'react-icons/fa6';

const BreakingNewsBanner = () => {
  const [breakingArticle, setBreakingArticle] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkBreaking = async () => {
      try {
        const articles = await appwriteService.getArticles();
        const now = new Date();
        const active = articles.find(a => {
          if (!a.is_breaking) return false;
          if (a.breaking_until) {
            const until = new Date(a.breaking_until);
            return now <= until;
          }
          return true;
        });
        if (active) setBreakingArticle(active);
      } catch {}
    };
    checkBreaking();
    const interval = setInterval(checkBreaking, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!breakingArticle || dismissed) return null;

  return (
    <div className="bg-red-700 text-white relative overflow-hidden" role="alert" aria-live="assertive">
      <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-700 to-red-600 animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <FaBolt className="w-4 h-4 animate-pulse text-yellow-300" />
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Breaking</span>
        </div>
        <Link to={`/article/${breakingArticle.$id}`} className="flex-1 text-sm font-bold hover:underline truncate">
          {breakingArticle.headline || 'Breaking News'}
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss breaking news"
        >
          <FaXmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BreakingNewsBanner;
