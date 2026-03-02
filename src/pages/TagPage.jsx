import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { FaTag, FaChevronRight } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { useNews } from '../context/NewsContext';

const TagPage = () => {
  const { tag } = useParams();
  const { articles } = useNews();

  // Decode URI (tags may include spaces as %20 or +)
  const decodedTag = useMemo(() => {
    try { return decodeURIComponent(tag); } catch { return tag; }
  }, [tag]);

  // Match articles whose `tags` field (comma-separated string from keyFigures pack) contains this tag
  const taggedArticles = useMemo(() => {
    return articles.filter(a => {
      if (!a.tags) return false;
      const tagList = a.tags
        .split(',')
        .map(t => t.trim().toLowerCase());
      return tagList.includes(decodedTag.toLowerCase());
    });
  }, [articles, decodedTag]);

  const heroStory = taggedArticles[0];
  const feedStories = taggedArticles.slice(1);

  // Build a related-tags list from co-occurring tags across these articles
  const relatedTags = useMemo(() => {
    const freq = {};
    taggedArticles.forEach(a => {
      if (!a.tags) return;
      a.tags.split(',').forEach(t => {
        const clean = t.trim();
        if (clean.toLowerCase() !== decodedTag.toLowerCase() && clean) {
          freq[clean] = (freq[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);
  }, [taggedArticles, decodedTag]);

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title={`#${decodedTag} — Yanci`}
        description={`Duk labaran da suka shafi "${decodedTag}" daga Yanci jarida ta Hausa.`}
      />
      <GuardianNav />

      {/* Tag Header */}
      <div className="bg-[#0f3036] text-white py-10 border-b border-[#0f3036]/60">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 text-[#c59d5f] text-xs font-bold uppercase tracking-widest mb-3">
            <FaTag className="w-3 h-3" />
            Taken Labari
          </div>
          <h1 className="font-serif font-black text-5xl md:text-7xl tracking-tighter mb-4 text-white">
            {decodedTag}
          </h1>
          <p className="text-sm text-white/60">
            {taggedArticles.length > 0
              ? `Labari ${taggedArticles.length} da suka shafi wannan taken`
              : 'Babu labarin da aka samu tukuna'}
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        {taggedArticles.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <FaTag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-serif text-2xl mb-2">Babu labari a wannan taken tukuna.</p>
            <p className="text-sm mb-6">Dawo nan gaba ko nema labari daban.</p>
            <Link
              to="/search"
              className="inline-block px-6 py-3 bg-[#0f3036] text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-[#0f3036]/80 transition-all"
            >
              Nema Labari
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Main Feed */}
            <div className="lg:col-span-8">
              {/* Hero */}
              {heroStory && (
                <div className="mb-10">
                  <NewsCard data={heroStory} variant="hero" />
                </div>
              )}

              {/* Ad */}
              <AdSlot variant="inline" />

              {/* Feed */}
              {feedStories.length > 0 && (
                <div className="mt-8 space-y-6">
                  {feedStories.map(story => (
                    <article
                      key={story.id}
                      className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-6 last:border-0 group"
                    >
                      {story.image && (
                        <Link
                          to={`/article/${story.id}`}
                          className="sm:w-44 flex-shrink-0 aspect-[3/2] overflow-hidden bg-gray-100 rounded-sm"
                        >
                          <img
                            src={story.image}
                            alt={story.headline}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Link
                            to={`/section/${story.section}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#8a2c2c] hover:underline"
                          >
                            {story.section}
                          </Link>
                        </div>
                        <Link to={`/article/${story.id}`}>
                          <h3 className="font-serif font-bold text-xl leading-snug mb-2 group-hover:text-[#0f3036] transition-colors">
                            {story.headline}
                          </h3>
                          {story.trail && (
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                              {story.trail}
                            </p>
                          )}
                        </Link>
                        {story.author && (
                          <div className="mt-2 text-xs text-gray-400 font-medium">
                            Daga{' '}
                            <Link
                              to={`/author/${encodeURIComponent(story.author)}`}
                              className="text-[#0f3036] hover:underline font-bold"
                            >
                              {story.author}
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Related Tags */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {relatedTags.length > 0 && (
                  <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">
                      Masu Alaƙa
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedTags.map(t => (
                        <Link
                          key={t}
                          to={`/tag/${encodeURIComponent(t)}`}
                          className="px-3 py-1.5 text-xs font-bold border border-gray-200 hover:border-[#0f3036] hover:text-[#0f3036] transition-all rounded-full"
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <AdSlot variant="sidebar" />
              </div>
            </aside>
          </div>
        )}
      </main>

      <GuardianFooter />
    </div>
  );
};

export default TagPage;
