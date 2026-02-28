/**
 * TrendingWidget — "Labarai Mafiya Karanta" (Most Read) widget.
 * Uses localStorage view counts + falls back to article order if no views recorded.
 *
 * Props:
 *  articles  – full articles array from useNews()
 *  limit     – number of items to show (default 5)
 *  title     – widget title (default "Labarai Mafiya Karanta")
 *  className – extra wrapper classes
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useViewTracker } from '../../hooks/useViewTracker';
import { FaFire } from 'react-icons/fa6';

export default function TrendingWidget({ articles = [], limit = 5, title, className = '' }) {
  const { getMostRead, getViewCount } = useViewTracker();

  const mostRead = useMemo(() => getMostRead(articles, limit), [articles, limit, getMostRead]);

  if (mostRead.length === 0) return null;

  return (
    <aside className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0f3036] text-white">
        <FaFire className="text-orange-400" size={14} />
        <h3 className="font-bold text-sm uppercase tracking-widest">
          {title || 'Labarai Mafiya Karanta'}
        </h3>
      </div>

      {/* List */}
      <ol className="divide-y divide-gray-100">
        {mostRead.map((article, index) => {
          const views = getViewCount(article.id);
          return (
            <li key={article.id}>
              <Link
                to={`/article/${article.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                {/* Rank number */}
                <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-black text-sm group-hover:bg-[#0f3036] group-hover:text-white transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#0f3036] transition-colors">
                    {article.headline}
                  </h4>
                  {views > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{views.toLocaleString()} ra'ayi</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
