import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiX, FiClock, FiTag } from 'react-icons/fi';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';
import { PILLARS } from '../data/guardianData';
import { useAnalytics } from '../hooks/useAnalytics';

const SECTION_LABELS = {
  headlines: 'Labarai',
  sport: 'Wasanni',
  opinion: "Ra'ayi",
  culture: "Al'adu",
  lifestyle: 'Rayuwa',
};

const PILLAR_LABELS = {
  news: 'Labarai',
  sport: 'Wasanni',
  opinion: "Ra'ayi",
  culture: "Al'adu",
  lifestyle: 'Rayuwa',
};

function highlightText(text, query) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function SearchResultCard({ article, query }) {
  const pillar = article.pillar || 'news';
  const color = PILLARS[pillar]?.main || '#8a2c2c';

  return (
    <Link
      to={`/article/${article.id}`}
      className="flex gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors group"
    >
      {article.image && (
        <img
          src={article.image}
          alt={article.headline}
          className="w-24 h-20 object-cover rounded flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color }}
          >
            {article.kicker || PILLAR_LABELS[pillar] || pillar}
          </span>
          {article.isLive && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:underline line-clamp-2">
          {highlightText(article.headline, query)}
        </h3>
        {article.trail && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {highlightText(article.trail, query)}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          {article.author && (
            <span className="flex items-center gap-1">
              <FiTag size={11} />
              {article.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FiClock size={11} />
            {SECTION_LABELS[article.section] || article.section}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const { articles } = useNews();
  const { trackSearch } = useAnalytics();

  // Sync URL param → input when navigating back
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter((a) => {
      const inHeadline = a.headline?.toLowerCase().includes(q);
      const inTrail = a.trail?.toLowerCase().includes(q);
      const inKicker = a.kicker?.toLowerCase().includes(q);
      const inAuthor = a.author?.toLowerCase().includes(q);
      const inBody = a.body?.toLowerCase().includes(q);
      return inHeadline || inTrail || inKicker || inAuthor || inBody;
    });
  }, [query, articles]);

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return results;
    return results.filter((a) => a.pillar === activeFilter || a.section === activeFilter);
  }, [results, activeFilter]);

  // Count per pillar for filter chips
  const pillarCounts = useMemo(() => {
    const counts = {};
    results.forEach((a) => {
      const key = a.pillar || 'news';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [results]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    setActiveFilter('all');
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  // Fire analytics event after results are computed
  useEffect(() => {
    if (query.trim()) {
      trackSearch(query.trim(), results.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, results.length]);

  const clearSearch = () => {
    setInputValue('');
    setQuery('');
    setActiveFilter('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <GuardianNav />

      {/* Search Header */}
      <div className="bg-[#0f3036] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nemi labarai..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-lg text-gray-900 text-lg bg-white border-0 outline-none focus:ring-2 focus:ring-[#c59d5f]"
            />
            {inputValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            )}
          </form>
          {query && (
            <p className="text-gray-300 text-sm mt-3">
              {filteredResults.length > 0
                ? `An sami sakamakon ${filteredResults.length} na "${query}"`
                : `Ba a sami sakamakon "${query}" ba`}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter chips */}
        {results.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#0f3036] text-white border-[#0f3036]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#0f3036]'
              }`}
            >
              Duka ({results.length})
            </button>
            {Object.entries(pillarCounts).map(([pillar, count]) => (
              <button
                key={pillar}
                onClick={() => setActiveFilter(pillar)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === pillar
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                }`}
                style={
                  activeFilter === pillar
                    ? { backgroundColor: PILLARS[pillar]?.main || '#8a2c2c' }
                    : {}
                }
              >
                {PILLAR_LABELS[pillar] || pillar} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {!query && (
          <div className="text-center py-20">
            <FiSearch className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Rubuta kalma don neman labarai</p>
          </div>
        )}

        {query && filteredResults.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">Ba a sami sakamako ba</p>
            <p className="text-gray-400 text-sm">
              Gwada wani kalma daban ko taƙaitaccen kalma
            </p>
          </div>
        )}

        {filteredResults.length > 0 && (
          <div>
            {filteredResults.map((article) => (
              <SearchResultCard key={article.id} article={article} query={query} />
            ))}
          </div>
        )}
      </div>

      <GuardianFooter />
    </div>
  );
}
