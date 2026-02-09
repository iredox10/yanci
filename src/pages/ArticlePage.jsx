import { useParams, Link } from 'react-router-dom';
import { 
  FaClock, 
  FaShareNodes, 
  FaBookmark, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaComment,
  FaHeart,
  FaArrowUp,
  FaLink,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaCalendar,
  FaTags,
  FaUser,
  FaNewspaper,
  FaFire,
  FaLayerGroup,
  FaPenNib
} from 'react-icons/fa6';
import { useState, useEffect, useRef, useMemo } from 'react';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';
import { PILLARS } from '../data/guardianData';
import LiveArticlePage from './LiveArticlePage';

// Import Atoms
import MapAtom from '../components/guardian/atoms/MapAtom';
import HighlightAtom from '../components/guardian/atoms/HighlightAtom';
import SupportBanner from '../components/guardian/atoms/SupportBanner';
import SeriesHeader from '../components/guardian/atoms/SeriesHeader';

const ArticlePage = () => {
  const { id } = useParams();
  const { getArticleById, articles } = useNews();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const articleRef = useRef(null);

  // Fallback to first article if not found
  const article = useMemo(() => getArticleById(id) || articles[0], [id, getArticleById, articles]);

  const pillarColor = useMemo(() => PILLARS[article?.pillar]?.main || '#0f3036', [article]);

  // Calculate article stats
  const stats = useMemo(() => {
    const text = article?.body?.replace(/<[^>]*>/g, ' ') || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const time = Math.max(1, Math.ceil(words / 200));
    return { words, time };
  }, [article]);

  // Get series articles
  const seriesArticles = useMemo(() => {
    if (!article?.series) return [];
    return articles.filter(a => a.series === article.series && a.id !== article.id);
  }, [article, articles]);

  // Related articles (if no series)
  const relatedArticles = useMemo(() => {
    return articles
      .filter(a => a.section === article?.section && a.id !== article?.id)
      .slice(0, 5);
  }, [article, articles]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBody = (bodyHtml) => {
    if (!bodyHtml) return null;

    const parts = bodyHtml.split(/(<div class="yanci-atom-[^>]*>.*?<\/div>)/g);

    return parts.map((part, index) => {
      if (part.includes('yanci-atom-map')) {
        const urlMatch = part.match(/data-url="([^"]*)"/);
        return <MapAtom key={index} url={urlMatch ? urlMatch[1] : ''} />;
      }
      if (part.includes('yanci-atom-highlight')) {
        const contentMatch = part.match(/>(.*?)<\/div>/);
        return (
          <HighlightAtom key={index} pillar={article.pillar}>
            <div dangerouslySetInnerHTML={{ __html: contentMatch ? contentMatch[1] : '' }} />
          </HighlightAtom>
        );
      }
      
      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  if (!article) return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#c59d5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Ana loda labarin...</p>
      </div>
    </div>
  );

  if (article.isLive) {
    return <LiveArticlePage />;
  }

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917] selection:bg-[#c59d5f] selection:text-white" ref={articleRef}>
      <GuardianNav />

      {/* Reading Progress Bar */}
      <div className="fixed top-[48px] left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full transition-all duration-150"
          style={{ width: `${readingProgress}%`, backgroundColor: pillarColor }}
        />
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* LEFT 1/4 - METADATA & STATS */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#0f3036] transition-colors mb-8 group"
              >
                <FaChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                KOMA BAYA
              </Link>

              <div className="space-y-8">
                {/* Author Info */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: pillarColor }}>Marubuci</span>
                  <p className="font-serif text-xl font-bold text-[#0f3036] leading-tight">{article.author || "Yanci Wakili"}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <FaPenNib className="w-3 h-3" /> Wakili na Musamman
                  </p>
                </div>

                {/* Article Stats */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">KALMOMI</span>
                    <span className="text-sm font-black text-[#0f3036]">{stats.words}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">LOKACI</span>
                    <span className="text-sm font-black text-[#0f3036]">{stats.time} MIN</span>
                  </div>
                </div>

                {/* Date Info */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">An wallafa</span>
                  <div className="flex flex-col text-sm font-medium text-gray-600 leading-snug">
                    <span>Litinin, 9 Feb 2026</span>
                    <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">10:30 WAT</span>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="pt-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-4">Raba Labarin</span>
                  <div className="flex flex-wrap gap-2">
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all">
                      <FaTwitter className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-all">
                      <FaFacebook className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366] transition-all">
                      <FaWhatsapp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isBookmarked ? 'bg-[#c59d5f] border-[#c59d5f] text-white' : 'text-gray-400 border-gray-200 hover:text-[#c59d5f] hover:border-[#c59d5f]'}`}
                    >
                      <FaBookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 3/4 - CONTENT & DYNAMIC SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* MAIN CONTENT AREA */}
              <div className="lg:col-span-2">
                <SeriesHeader title={article.series} />
                
                <header className="mb-10">
                  <span 
                    className="inline-block px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm shadow-sm"
                    style={{ backgroundColor: pillarColor }}
                  >
                    {article.kicker || article.pillar}
                  </span>
                  
                  <h1 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] text-[#0f3036] mb-8">
                    {article.headline}
                  </h1>
                  
                  <p className="text-2xl font-serif text-gray-600 leading-relaxed border-l-4 pl-8 py-2 italic" style={{ borderColor: pillarColor }}>
                    {article.trail || "Takaitaccen bayani game da labarin zai kasance a nan domin baiwa mai karatu haske game da abin da ya faru."}
                  </p>
                </header>

                {article.image && (
                  <figure className="mb-12 group">
                    <div className="aspect-video w-full overflow-hidden rounded-sm shadow-sm">
                      <img 
                        src={article.image} 
                        alt={article.headline} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="mt-4 flex items-center justify-between text-[11px] text-gray-400 font-medium uppercase tracking-wider px-2">
                      <span>{article.imageCaption || "Getty Images / Yanci Press"}</span>
                      <span>Hoto: {article.author || "Editorial"}</span>
                    </figcaption>
                  </figure>
                )}

                <div className="yanci-article-body">
                  {article.body ? (
                    <div className="space-y-6">
                      {renderBody(article.body)}
                    </div>
                  ) : (
                    <div className="font-body text-xl leading-[1.8] text-gray-800 space-y-8 italic text-gray-400">
                      Babu abun da ke cikin wannan labarin a yanzu.
                    </div>
                  )}
                </div>

                <SupportBanner />

                <div className="mt-16 pt-10 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group">
                        <FaHeart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-lg">234</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-[#0f3036] transition-colors">
                        <FaComment className="w-6 h-6" />
                        <span className="font-bold text-lg">45</span>
                      </button>
                    </div>
                    <div className="flex gap-4">
                      {['#Najeriya', '#Siyasa', '#TattalinArziki'].map(tag => (
                        <span key={tag} className="text-xs font-bold hover:underline cursor-pointer uppercase tracking-widest" style={{ color: pillarColor }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SIDEBAR */}
              <aside className="lg:col-span-1 space-y-16">
                {/* Series Articles Block */}
                {article.series && seriesArticles.length > 0 && (
                  <div className="bg-[#fbf8f3] p-6 border-t-4 shadow-sm" style={{ borderTopColor: pillarColor }}>
                    <div className="flex items-center gap-2 mb-6">
                      <FaLayerGroup className="text-[#0f3036] text-xs" />
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f3036]">Daga Shirin / In Series</h3>
                    </div>
                    <div className="space-y-6">
                      {seriesArticles.map((item) => (
                        <Link key={item.id} to={`/article/${item.id}`} className="group block">
                          <h4 className="font-serif font-bold text-sm leading-snug group-hover:underline decoration-gray-300 underline-offset-4">
                            {item.headline}
                          </h4>
                          <span className="text-[10px] text-gray-400 mt-2 block uppercase font-bold tracking-widest">{item.kicker}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Articles Block */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f3036] mb-8 border-b-2 border-[#0f3036] pb-2 w-fit">Labarai Masu Alaka</h3>
                  <div className="space-y-8">
                    {relatedArticles.map((item, idx) => (
                      <Link key={item.id} to={`/article/${item.id}`} className="group block">
                        <div className="flex gap-4">
                          <span className="text-3xl font-serif font-black text-gray-100 group-hover:text-[#c59d5f]/20 transition-colors">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-serif font-bold text-base leading-snug group-hover:underline decoration-[#c59d5f] underline-offset-4">
                              {item.headline}
                            </h4>
                            <span className="text-[10px] text-gray-400 mt-2 block uppercase font-bold tracking-widest">{item.kicker}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Block */}
                <div className="bg-surface-tertiary p-8 border-t-4 border-[#0f3036] rounded-sm">
                  <h3 className="font-serif text-2xl font-black text-[#0f3036] mb-4 leading-tight text-center">Yanci Newsletter</h3>
                  <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">Ku kasance da rahotannin gaskiya kowane safiya.</p>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Adireshin imel..."
                      className="w-full bg-white border border-gray-200 p-4 text-sm outline-none focus:border-[#c59d5f] transition-all"
                    />
                    <button className="w-full bg-[#0f3036] text-[#c59d5f] font-black text-sm py-4 hover:bg-black transition-all uppercase tracking-widest shadow-lg">
                      Yi Rajista
                    </button>
                  </form>
                </div>
              </aside>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Expanded Link Section */}
      <section className="bg-[#0a2125] py-20 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-serif font-black">Karin Labarai</h2>
            <Link to="/" className="text-sm font-bold text-[#c59d5f] hover:underline uppercase tracking-widest flex items-center gap-2">
              Duba Duka <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {articles.filter(a => a.id !== article.id).slice(0, 4).map(item => (
              <Link key={item.id} to={`/article/${item.id}`} className="group block">
                <div className="aspect-[16/10] rounded-sm overflow-hidden mb-6 bg-white/5">
                  <img src={item.image} alt={item.headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c59d5f] mb-2 block">{item.kicker}</span>
                <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-[#c59d5f] transition-colors">{item.headline}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 w-14 h-14 bg-[#c59d5f] text-[#0f3036] rounded-full shadow-2xl flex items-center justify-center hover:bg-white transition-all z-40 animate-fade-in-up"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}

      <GuardianFooter />
    </div>
  );
};

export default ArticlePage;
