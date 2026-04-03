import { useParams, Link } from 'react-router-dom';
import {
  FaShareNodes,
  FaBookmark,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaArrowUp,
  FaChevronRight,
  FaEnvelope,
  FaPrint,
  FaClock,
  FaPlay,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import { useState, useEffect, useRef, useMemo } from 'react';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';
import { PILLARS } from '../data/guardianData';
import LiveArticlePage from './LiveArticlePage';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import CommentsSection from '../components/CommentsSection';
import { useViewTracker } from '../hooks/useViewTracker';
import { useAnalytics } from '../hooks/useAnalytics';

// Import Atoms
import MapAtom from '../components/guardian/atoms/MapAtom';
import HighlightAtom from '../components/guardian/atoms/HighlightAtom';
import ReviewAtom from '../components/guardian/atoms/ReviewAtom';
import ProfileAtom from '../components/guardian/atoms/ProfileAtom';
import ImageAtom from '../components/guardian/atoms/ImageAtom';

const ArticlePage = () => {
  const { id } = useParams();
  const { getArticleById, articles } = useNews();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sensitiveAccepted, setSensitiveAccepted] = useState(false);
  const articleRef = useRef(null);
  const { trackView } = useViewTracker();
  const { trackArticleView } = useAnalytics();

  // Fallback to first article if not found
  const article = useMemo(() => getArticleById(id) || articles[0], [id, getArticleById, articles]);

  const pillarColor = useMemo(() => {
    const p = article?.pillar;
    if (p === 'sport') return '#0084c6';
    if (p === 'culture') return '#a1845c';
    if (p === 'lifestyle') return '#bb3b80';
    if (p === 'opinion') return '#e05e00';
    return '#c70000';
  }, [article]);

  const stats = useMemo(() => {
    const text = article?.body?.replace(/<[^>]*>/g, ' ') || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const time = Math.max(1, Math.ceil(words / 200));
    return { words, time };
  }, [article]);

  const relatedArticles = useMemo(() => {
    return articles
      .filter(a => a.section === article?.section && a.id !== article?.id)
      .slice(0, 4);
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

  // Track this article view once on mount
  useEffect(() => {
    if (article?.id) {
      trackView(article.id);
      trackArticleView(article);
    }
  }, [article, trackView, trackArticleView]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(article?.headline || '');
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareWhatsapp = () => {
    const text = encodeURIComponent(`${article?.headline || ''} - ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.headline || 'Yanci',
          text: article?.trail || '',
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      alert("Browser baya goyon bayan wannan tsarin raba labari.");
    }
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
      if (part.includes('yanci-atom-review')) {
        const titleMatch = part.match(/data-title="([^"]*)"/);
        const ratingMatch = part.match(/data-rating="([^"]*)"/);
        return <ReviewAtom key={index} title={titleMatch?.[1]} rating={ratingMatch?.[1]} />;
      }
      if (part.includes('yanci-atom-profile')) {
        const nameMatch = part.match(/data-name="([^"]*)"/);
        const roleMatch = part.match(/data-role="([^"]*)"/);
        const imageMatch = part.match(/data-image="([^"]*)"/);
        const descMatch = part.match(/data-desc="([^"]*)"/);
        return (
          <ProfileAtom
            key={index}
            name={nameMatch?.[1]}
            role={roleMatch?.[1]}
            image={imageMatch?.[1]}
            description={descMatch?.[1]}
          />
        );
      }
      if (part.includes('yanci-atom-image')) {
        const srcMatch = part.match(/data-src="([^"]*)"/);
        const captionMatch = part.match(/data-caption="([^"]*)"/);
        const creditMatch = part.match(/data-credit="([^"]*)"/);
        return (
          <ImageAtom
            key={index}
            src={srcMatch?.[1]}
            caption={captionMatch?.[1]}
            credit={creditMatch?.[1]}
          />
        );
      }
      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  if (!article) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (article.isLive) {
    return <LiveArticlePage />;
  }

  return (
    <div className="bg-white min-h-screen font-serif text-[#121212] selection:bg-[#cc0000] selection:text-white" ref={articleRef}>
      <SEO
        title={article.metaTitle || article.headline}
        description={article.metaDescription || article.trail}
        image={article.image}
        url={article.slug ? `/${article.slug}` : `/article/${article.id}`}
        type="article"
        article={{
          publishedTime: article.$createdAt || new Date().toISOString(),
          modifiedTime: article.$updatedAt,
          author: article.author,
          section: article.section,
        }}
      />
      <GuardianNav />

      {/* Sensitive Content Warning */}
      {article.isSensitive && !sensitiveAccepted && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTriangleExclamation className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="font-serif font-black text-2xl mb-3">Abun Ciki Mai Kula</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Wannan labari ya ƙunshi bayanan da zasu iya damun wasu masu karatu. Don Allah ka tabbata kana son ci gaba da karantawa.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSensitiveAccepted(true)}
                className="flex-1 py-3 bg-[#121212] text-white font-bold rounded-lg hover:bg-[#333] transition-colors"
              >
                Na Fahimta, Ci Gaba
              </button>
              <Link
                to="/"
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Komawa Gida
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-gray-100">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%`, backgroundColor: pillarColor }}
        />
      </div>

      <main className="pb-32 pt-10 md:pt-16" id="main-content" role="main" aria-label="Babban ciki">

        {/* CENTERED COLUMN LAYOUT */}
        <article className="max-w-[780px] mx-auto px-5 md:px-0">

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Link
                to={`/section/${article.section}`}
                className="font-sans font-extrabold text-sm tracking-widest uppercase hover:underline"
                style={{ color: pillarColor }}
              >
                {article.section || "News"}
              </Link>
              <span className="text-gray-300 text-xs">/</span>
              <span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <FaClock className="text-gray-400" /> {stats.time} Min Read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-8 text-[#121212] tracking-tight">
              {article.headline}
            </h1>

            <div className="text-xl md:text-2xl font-serif text-gray-600 leading-[1.6] mb-10 border-l-4 border-gray-200 pl-6 py-1">
              {article.trail || "Takaitaccen bayani game da wannan labari mai mahimmanci."}
            </div>

            {/* Simplified Meta Data - Centered Focus */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-t border-b border-gray-100 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl text-[#121212]">
                  {(article.author || "Y")[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mb-0.5">Written by</span>
                  <Link
                    to={`/author/${encodeURIComponent(article.author || 'Yanci Staff')}`}
                    className="text-base font-sans font-bold text-[#121212] hover:underline transition-colors"
                    style={{ color: pillarColor }}
                  >
                    {article.author || "Yanci Staff"}
                  </Link>
                  {article.coAuthor && (
                    <Link
                      to={`/author/${encodeURIComponent(article.coAuthor)}`}
                      className="text-xs font-sans text-gray-500 hover:underline transition-colors mt-0.5"
                    >
                      Tare da {article.coAuthor}
                    </Link>
                  )}
                </div>
              </div>

              {/* Last Updated Timestamp */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaClock className="w-3 h-3" />
                <span>
                  {article.$updatedAt
                    ? `An sabawa: ${new Date(article.$updatedAt).toLocaleDateString('ha-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                    : article.$createdAt
                    ? `An buga: ${new Date(article.$createdAt).toLocaleDateString('ha-NG', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : ''}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mr-2 hidden sm:block">Share</span>
                <button onClick={shareFacebook} className="w-10 h-10 rounded-full border border-gray-100 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300" title="Facebook">
                  <FaFacebook size={16} />
                </button>
                <button onClick={shareTwitter} className="w-10 h-10 rounded-full border border-gray-100 hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300" title="Twitter">
                  <FaTwitter size={16} />
                </button>
                <button onClick={shareWhatsapp} className="w-10 h-10 rounded-full border border-gray-100 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300" title="Whatsapp">
                  <FaWhatsapp size={16} />
                </button>
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button onClick={handleNativeShare} className="w-10 h-10 border border-gray-100 hover:border-[#121212] hover:bg-[#121212] hover:text-white rounded-full flex items-center justify-center text-gray-400 transition-all duration-300" title="Share via Device">
                    <FaShareNodes size={16} />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Image - Full width of the container */}
          {article.image && (
            <figure className="mb-12 w-full -mx-5 md:mx-0 md:w-full group">
              <div className="relative overflow-hidden bg-gray-100 rounded-sm shadow-sm">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-auto object-cover block transform transition-transform duration-[1.5s] group-hover:scale-105"
                  style={{
                    objectPosition: article.imageFocalX != null && article.imageFocalY != null
                      ? `${article.imageFocalX}% ${article.imageFocalY}%`
                      : undefined,
                  }}
                />
              </div>
              <figcaption className="mt-3 px-5 md:px-0 text-sm text-gray-500 font-sans flex items-start gap-1.5 leading-tight">
                <FaChevronRight size={10} className="mt-1 text-[#121212]" />
                <span dangerouslySetInnerHTML={{ __html: `${article.imageCaption} <span class="text-gray-300 mx-1">|</span> <span class="uppercase tracking-widest text-[10px] font-bold">Photo: ${article.author}</span>` }} />
              </figcaption>
            </figure>
          )}

          {/* Content Body - Larger Font & Better Spacing */}
          <div className="prose prose-xl max-w-none text-[#121212] prose-headings:font-bold prose-headings:font-serif prose-headings:tracking-tight prose-p:font-serif prose-p:text-[1.35rem] prose-p:leading-[1.8] prose-p:mb-8 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-10 prose-a:text-[#c70000] prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-2 hover:prose-a:underline-offset-2 prose-blockquote:border-l-[6px] prose-blockquote:border-[#c70000] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-2xl prose-blockquote:text-gray-900 prose-blockquote:rounded-r-lg">
            {article.body ? (
              <div className="drop-cap-container">
                {renderBody(article.body)}
              </div>
            ) : (
              <p className="italic text-gray-400 text-center py-12">Ana loda labarin...</p>
            )}
          </div>

          {/* Article Footer - Tags */}
          <div className="mt-20 pt-10 border-t border-gray-200">
            <h4 className="text-xs font-bold font-sans uppercase tracking-widest text-gray-400 mb-6">Taken Labarai</h4>
            <div className="flex flex-wrap gap-3">
              {(article.tags
                ? article.tags.split(',').map(t => t.trim()).filter(Boolean)
                : ['Najeriya', 'Arewa', 'Labarai']
              ).map(tag => (
                <Link
                  key={tag}
                  to={`/tag/${encodeURIComponent(tag)}`}
                  className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-700 hover:bg-[#121212] hover:text-white hover:border-[#121212] cursor-pointer transition-all duration-300 font-sans shadow-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Inline Ad Unit */}
          <AdSlot variant="inline" />

          {/* Comments Section */}
          <CommentsSection articleId={article.id} />

        </article>

        {/* RELATED SECTION - MOVED TO BOTTOM */}
        <section className="bg-gray-50 py-20 mt-24 border-t border-gray-200">
          <div className="max-w-[1240px] mx-auto px-5 md:px-6">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black font-serif text-[#121212]">
                More Stories
              </h3>
              <Link to="/" className="text-xs font-bold font-sans uppercase tracking-widest text-[#c70000] hover:underline flex items-center gap-2">
                View All <FaArrowUp className="rotate-90" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {relatedArticles.map(item => (
                <Link key={item.id} to={`/article/${item.id}`} className="group block h-full">
                  <div className="aspect-[3/2] bg-gray-200 mb-5 overflow-hidden relative rounded-sm shadow-sm">
                    <img src={item.image} alt={item.headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    {item.pillar === 'music' && <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"><FaPlay className="text-white w-10 h-10 drop-shadow-md" /></div>}
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold font-sans uppercase tracking-widest text-[#c70000]">{item.section || "News"}</span>
                    <h4 className="font-serif font-bold text-xl leading-tight group-hover:text-[#c70000] transition-colors line-clamp-3">
                      {item.headline}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Banner Ad above footer */}
      <div className="max-w-[780px] mx-auto px-5 md:px-0 pb-8">
        <AdSlot variant="banner" />
      </div>

      <GuardianFooter />

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 w-14 h-14 bg-[#121212] text-white rounded-full hover:bg-[#c70000] border-2 border-white shadow-2xl flex items-center justify-center transition-all duration-300 z-50 animate-bounce-in"
          aria-label="Back to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ArticlePage;
