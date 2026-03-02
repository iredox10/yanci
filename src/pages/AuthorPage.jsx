import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { FaEnvelope, FaTwitter, FaNewspaper } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { PILLARS } from '../data/guardianData';

const AuthorPage = () => {
  const { name } = useParams();
  const { articles } = useNews();
  const { staffList } = useAuth();

  const decodedName = useMemo(() => {
    try { return decodeURIComponent(name); } catch { return name; }
  }, [name]);

  // Find staff profile for this author name
  const staffProfile = useMemo(() => {
    return staffList?.find(
      s => s.name?.toLowerCase() === decodedName.toLowerCase()
    );
  }, [staffList, decodedName]);

  // All articles by this author (include coAuthor)
  const authorArticles = useMemo(() => {
    return articles.filter(
      a =>
        a.author?.toLowerCase() === decodedName.toLowerCase() ||
        a.coAuthor?.toLowerCase() === decodedName.toLowerCase()
    );
  }, [articles, decodedName]);

  // Group by pillar for stat breakdown
  const pillarBreakdown = useMemo(() => {
    const counts = {};
    authorArticles.forEach(a => {
      if (a.pillar) counts[a.pillar] = (counts[a.pillar] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [authorArticles]);

  // Determine dominant pillar for color theming
  const dominantPillar = pillarBreakdown[0]?.[0] || 'news';
  const colors = PILLARS[dominantPillar] || PILLARS.news;

  const heroArticle = authorArticles[0];
  const feedArticles = authorArticles.slice(1);

  // Role label map
  const ROLE_LABELS = {
    super_admin: 'Babban Edita',
    news_editor: 'Editan Labarai',
    sport_editor: 'Editan Wasanni',
    opinion_editor: "Editan Ra'ayi",
    culture_editor: "Editan Al'adu",
    lifestyle_editor: 'Editan Rayuwa',
    reporter: 'Mai Rahoto',
    contributor: 'Mai Gudunmawa',
  };

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title={`${decodedName} — Yanci`}
        description={`Labaran ${decodedName} daga Yanci — jarida ta Hausa.`}
      />
      <GuardianNav />

      {/* Author Header */}
      <div
        className="text-white py-12 border-b"
        style={{ backgroundColor: colors.main, borderColor: colors.dark }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-8">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-3xl font-black border-4 border-white/30"
              style={{ backgroundColor: colors.dark }}
            >
              {staffProfile?.avatar ? (
                <img
                  src={staffProfile.avatar}
                  alt={decodedName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white">
                  {decodedName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div
                className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70"
                style={{ color: colors.pastel }}
              >
                {staffProfile ? ROLE_LABELS[staffProfile.role] || staffProfile.role : 'Mai Rubuta Labarai'}
              </div>
              <h1 className="font-serif font-black text-4xl md:text-5xl tracking-tight mb-3">
                {decodedName}
              </h1>
              {staffProfile?.email && (
                <a
                  href={`mailto:${staffProfile.email}`}
                  className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  <FaEnvelope className="w-3.5 h-3.5" />
                  {staffProfile.email}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="text-4xl font-black">{authorArticles.length}</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-70">
                Labaran Da Aka Rubuta
              </div>
            </div>
          </div>

          {/* Pillar breakdown chips */}
          {pillarBreakdown.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6 border-t border-white/20 pt-6">
              {pillarBreakdown.map(([pillarKey, count]) => (
                <Link
                  key={pillarKey}
                  to={`/section/${pillarKey}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                  }}
                >
                  {pillarKey} <span className="opacity-60">({count})</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
        {authorArticles.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <FaNewspaper className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-serif text-2xl mb-2">Babu labaran {decodedName} tukuna.</p>
            <Link
              to="/"
              className="mt-4 inline-block px-6 py-3 bg-[#0f3036] text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-[#0f3036]/80 transition-all"
            >
              Gidan Yanar Gizo
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Main Feed */}
            <div className="lg:col-span-8">
              {heroArticle && (
                <div className="mb-10">
                  <NewsCard data={heroArticle} variant="hero" />
                </div>
              )}

              <AdSlot variant="inline" />

              {feedArticles.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h2
                    className="font-bold uppercase tracking-widest text-sm pb-2 border-b"
                    style={{ color: colors.main, borderColor: colors.main }}
                  >
                    Duk Labarai
                  </h2>
                  {feedArticles.map(article => (
                    <article
                      key={article.id}
                      className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-6 last:border-0 group"
                    >
                      {article.image && (
                        <Link
                          to={`/article/${article.id}`}
                          className="sm:w-44 flex-shrink-0 aspect-[3/2] overflow-hidden bg-gray-100 rounded-sm"
                        >
                          <img
                            src={article.image}
                            alt={article.headline}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      )}
                      <div className="flex-1">
                        <Link
                          to={`/section/${article.section}`}
                          className="text-[10px] font-bold uppercase tracking-widest block mb-1 hover:underline"
                          style={{ color: colors.main }}
                        >
                          {article.section || article.pillar}
                        </Link>
                        <Link to={`/article/${article.id}`}>
                          <h3 className="font-serif font-bold text-xl leading-snug mb-2 group-hover:text-[#0f3036] transition-colors">
                            {article.headline}
                          </h3>
                          {article.trail && (
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                              {article.trail}
                            </p>
                          )}
                        </Link>
                        {article.tags && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {article.tags
                              .split(',')
                              .slice(0, 3)
                              .map(t => t.trim())
                              .filter(Boolean)
                              .map(t => (
                                <Link
                                  key={t}
                                  to={`/tag/${encodeURIComponent(t)}`}
                                  className="text-[10px] font-bold px-2 py-0.5 border border-gray-200 rounded-full hover:border-[#0f3036] hover:text-[#0f3036] transition-all"
                                >
                                  #{t}
                                </Link>
                              ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* About panel */}
                {staffProfile && (
                  <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">
                      Game Da Marubuci
                    </h3>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {staffProfile.bio || `${decodedName} yana rubutu a Yanci.`}
                    </div>
                    {staffProfile.email && (
                      <a
                        href={`mailto:${staffProfile.email}`}
                        className="mt-4 flex items-center gap-2 text-xs font-bold text-[#0f3036] hover:underline"
                      >
                        <FaEnvelope className="w-3 h-3" />
                        Tuntuba
                      </a>
                    )}
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

export default AuthorPage;
