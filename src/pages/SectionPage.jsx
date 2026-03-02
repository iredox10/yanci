import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { useNews } from '../context/NewsContext';
import { PILLARS } from '../data/guardianData';

// Map section slugs → display names (Hausa)
const SECTION_LABELS = {
  headlines: 'Labarai',
  siyasa: 'Siyasa',
  kasuwanci: 'Kasuwanci',
  sport: 'Wasanni',
  fasaha: 'Fasaha',
  opinion: "Ra'ayi",
  culture: "Al'adu",
  lifestyle: 'Rayuwa',
  lafiya: 'Lafiya',
  ilimi: 'Ilimi',
  zabe: 'Zabe',
  duniya: 'Duniya',
  afirka: 'Afirka',
  najeriya: 'Najeriya',
};

// Map section → pillar for color theming
const SECTION_TO_PILLAR = {
  headlines: 'news',
  siyasa: 'news',
  kasuwanci: 'lifestyle',
  sport: 'sport',
  fasaha: 'lifestyle',
  opinion: 'opinion',
  culture: 'culture',
  lifestyle: 'lifestyle',
  lafiya: 'lifestyle',
  ilimi: 'lifestyle',
  zabe: 'news',
  duniya: 'news',
  afirka: 'news',
  najeriya: 'news',
};

const SectionPage = () => {
  const { id: sectionId } = useParams();
  const { articles } = useNews();

  const sectionLabel = SECTION_LABELS[sectionId] || sectionId;
  const pillar = SECTION_TO_PILLAR[sectionId] || 'news';
  const colors = PILLARS[pillar] || PILLARS.news;

  // Articles for this section; fallback to pillar if section is a pillar name
  const sectionArticles = useMemo(() => {
    return articles.filter(
      a => a.section === sectionId || a.pillar === sectionId
    );
  }, [articles, sectionId]);

  const heroStory = sectionArticles[0];
  const subStories = sectionArticles.slice(1, 4);
  const feedStories = sectionArticles.slice(4);

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title={`${sectionLabel} — Yanci`}
        description={`Duk labaran ${sectionLabel} daga Yanci — jarida ta Hausa.`}
      />
      <GuardianNav />

      {/* Section Header */}
      <div
        className="text-white py-10 border-b"
        style={{ backgroundColor: colors.main, borderColor: colors.dark }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
            Yanci
          </div>
          <h1 className="font-serif font-black text-5xl md:text-7xl tracking-tighter mb-4">
            {sectionLabel}<span style={{ color: colors.pastel }}>.</span>
          </h1>
          <p className="text-sm opacity-70 max-w-lg">
            Duk labaran {sectionLabel} da ke fitowa daga Yanci, jarida ta Hausa.
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">

        {sectionArticles.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <p className="font-serif text-2xl mb-2">Babu labari a nan tukuna.</p>
            <p className="text-sm">Dawo nan gaba ko nema labari.</p>
            <Link
              to="/search"
              className="mt-6 inline-block px-6 py-3 text-sm font-bold uppercase tracking-widest text-white rounded-sm transition-all duration-200"
              style={{ backgroundColor: colors.main }}
            >
              Nema Labari
            </Link>
          </div>
        ) : (
          <>
            {/* Hero + sub stories */}
            {heroStory && (
              <section className="mb-12">
                <div className="grid md:grid-cols-12 gap-8">
                  {/* Hero */}
                  <div className="md:col-span-8">
                    <NewsCard data={heroStory} variant="hero" />
                  </div>

                  {/* Sub stories */}
                  {subStories.length > 0 && (
                    <div
                      className="md:col-span-4 bg-white p-6 border-t-4"
                      style={{ borderColor: colors.main }}
                    >
                      <h3
                        className="font-bold uppercase tracking-widest text-sm mb-4"
                        style={{ color: colors.main }}
                      >
                        Mafi Daukar Hankali
                      </h3>
                      <ul className="space-y-4 divide-y divide-gray-100">
                        {subStories.map(story => (
                          <li key={story.id} className="pt-4 first:pt-0">
                            <Link
                              to={`/article/${story.id}`}
                              className="group block"
                            >
                              <span
                                className="text-[10px] font-bold uppercase tracking-widest block mb-1"
                                style={{ color: colors.main }}
                              >
                                {story.kicker}
                              </span>
                              <h4 className="font-serif font-bold text-lg leading-tight group-hover:underline transition-colors line-clamp-2">
                                {story.headline}
                              </h4>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Ad unit */}
            <AdSlot variant="banner" />

            {/* Feed grid */}
            {feedStories.length > 0 && (
              <section className="mt-12">
                <div
                  className="flex items-center gap-2 mb-8 border-b pb-2"
                  style={{ borderColor: colors.main }}
                >
                  <span
                    className="font-bold uppercase tracking-widest text-sm"
                    style={{ color: colors.main }}
                  >
                    {sectionLabel} — Ƙarin Labari
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {feedStories.map(story => (
                    <NewsCard key={story.id} data={story} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <GuardianFooter />
    </div>
  );
};

export default SectionPage;
