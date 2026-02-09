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
  FaFire
} from 'react-icons/fa6';
import { useState, useEffect, useRef } from 'react';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';
import { PILLARS } from '../data/guardianData';
import LiveArticlePage from './LiveArticlePage';

const ArticlePage = () => {
  const { id } = useParams();
  const { getArticleById, articles } = useNews();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const articleRef = useRef(null);

  // Fallback to first article if not found
  const article = getArticleById(id) || articles[0];

  // Calculate reading time
  const readingTime = article?.body ? Math.ceil(article.body.split(' ').length / 200) : 5;

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

  // Mock body text in Hausa with rich content
  const bodyText = [
    {
      type: 'paragraph',
      content: "A wani taro da aka gudanar a babban birnin tarayya Abuja, masu ruwa da tsaki sun tattauna muhimmancin wannan sabon tsari. Gwamnatin tarayya ta bayyana cewa wannan mataki zai taimaka wajen bunkasa tattalin arzikin kasa da kuma samar da ayyukan yi ga matasa. Wannan ci gaba na zuwa ne a daidai lokacin da kasar ke fuskantar kalubale daban-daban."
    },
    {
      type: 'image',
      src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop",
      caption: "Ministan yana bayanin sabon tsarin tattalin arziki ga manema labarai a Abuja",
      credit: "Yanci Press / Amina Hassan"
    },
    {
      type: 'paragraph',
      content: "Ministan yada labarai, a yayin da yake zantawa da manema labarai, ya jaddada cewa wannan ba karamin ci gaba bane ga kasarmu. 'Muna sa ran ganin sauye-sauye masu ma'ana a cikin watanni masu zuwa,' ya ce. Ya kuma yi kira ga 'yan kasa da su bayar da goyon baya domin ganin an cimma nasara."
    },
    {
      type: 'quote',
      quote: "Wannan ba karamin ci gaba bane ga kasarmu. Muna sa ran ganin sauye-sauye masu ma'ana a cikin watanni masu zuwa.",
      author: "Ministan Yada Labarai",
      role: "Gwamnatin Tarayya"
    },
    {
      type: 'paragraph',
      content: "Sai dai, wasu masana tattalin arziki sun nuna damuwa kan yadda za a aiwatar da tsarin. Sun yi nuni da cewa akwai bukatar a samar da kyakkyawan yanayi ga masu zuba jari kafin a fara ganin sakamako mai dorewa. Wannan na nufin cewa dole ne a dage wajen tsara tsarin da ya dace."
    },
    {
      type: 'subheading',
      content: "Kungiyoyin Farar Hula Sun Yi Kira"
    },
    {
      type: 'paragraph',
      content: "A bangare guda, kungiyoyin farar hula sun yi kira ga gwamnati da ta tabbatar da cewa an yi amfani da kudaden da za a samu ta hanyar da ta dace. Sun ce zasu sanya ido sosai domin ganin ba a samu almubazzaranci ba. Wannan ya nuna cewa jama'a sun fi kwarewa game da yadda ake gudanar da harkokin gwamnati."
    },
    {
      type: 'paragraph',
      content: "Wannan ci gaba na zuwa ne a daidai lokacin da kasar ke fuskantar kalubale daban-daban, ciki har da hauhawar farashin kayayyaki da kuma matsalar tsaro a wasu yankuna. Ana sa ran cewa idan aka yi amfani da wannan dama yadda ya kamata, za a samu sauki sosai a rayuwar 'yan kasa."
    },
    {
      type: 'list',
      items: [
        "Samun kudin shiga mai dorewa ga gwamnati",
        "Kaiwa ga masana'antun gida",
        "Samar da ayyukan yi ga matasa",
        "Inganta harkokin kasuwanci",
        "Karfafa tattalin arzikin kasa"
      ]
    },
    {
      type: 'paragraph',
      content: "Daga karshe, an yi kira ga dukkan bangarori da su hada kai domin ciyar da kasar gaba. 'Ci gaban kasa nauyi ne da ya rataya a wuyan kowa,' in ji shugaban taron. Wannan ya nuna muhimmancin hadin kai wajen cimma burin da aka sanya wa gaba."
    }
  ];

  // Get related articles
  const relatedArticles = articles
    .filter(a => a.section === article.section && a.id !== article.id)
    .slice(0, 4);

  // Get trending articles
  const trendingArticles = articles
    .filter(a => a.id !== article.id)
    .slice(0, 5);

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]" ref={articleRef}>
      <GuardianNav />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#c59d5f] to-[#d4a85f] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0f3036] transition-colors group"
          >
            <FaChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Koma zuwa Labarai
          </Link>
        </div>

        {/* Article Header */}
        <header className="max-w-[900px] mx-auto mb-12">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span 
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded-full"
              style={{ backgroundColor: PILLARS[article.pillar]?.main || '#0f3036' }}
            >
              {article.kicker || article.pillar}
            </span>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <FaCalendar className="w-3.5 h-3.5" />
                29 Nuwamba, 2025
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5">
                <FaClock className="w-3.5 h-3.5" />
                {readingTime} min read
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5">
                <FaEye className="w-3.5 h-3.5" />
                12.5K views
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] text-[#0f3036] mb-6">
            {article.headline}
          </h1>

          {/* Subheadline / Trail */}
          <p className="text-xl md:text-2xl font-serif text-gray-600 leading-relaxed border-l-4 border-[#c59d5f] pl-6">
            {article.trail || "Takaitaccen bayani game da labarin zai kasance a nan domin baiwa mai karatu haske game da abin da ya faru da dalilin da ya sa yake da muhimmanci."}
          </p>
        </header>

        {/* Author Bar */}
        <div className="max-w-[900px] mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-y border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0f3036] to-[#1a454c] text-[#c59d5f] flex items-center justify-center font-serif font-bold text-2xl shadow-lg">
                {article.author ? article.author[0] : 'Y'}
              </div>
              <div>
                <p className="font-bold text-[#0f3036] text-lg">{article.author || "Yanci Wakili"}</p>
                <p className="text-sm text-gray-500">Marubucin Yanci • Abuja</p>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0f3036] text-white rounded-full text-sm font-bold hover:bg-[#1a454c] transition-all"
                >
                  <FaShareNodes className="w-4 h-4" />
                  Raba
                </button>
                
                {/* Share Menu Dropdown */}
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px] z-20">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                      <FaFacebook className="w-5 h-5 text-[#3b5998]" />
                      Facebook
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                      <FaTwitter className="w-5 h-5 text-black" />
                      Twitter / X
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                      <FaWhatsapp className="w-5 h-5 text-[#25d366]" />
                      WhatsApp
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                      <FaTelegram className="w-5 h-5 text-[#0088cc]" />
                      Telegram
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                      <FaEnvelope className="w-5 h-5 text-gray-600" />
                      Imel
                    </button>
                    <div className="border-t border-gray-100 my-2" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                      <FaLink className="w-5 h-5 text-gray-600" />
                      Kwafi hanya
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-full border transition-all ${
                  isBookmarked 
                    ? 'bg-[#c59d5f] border-[#c59d5f] text-white' 
                    : 'border-gray-300 text-gray-500 hover:border-[#c59d5f] hover:text-[#c59d5f]'
                }`}
              >
                <FaBookmark className="w-5 h-5" />
              </button>

              <button className="p-2.5 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-all">
                <FaPrint className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Hero Image */}
            {article.image && (
              <figure className="mb-10">
                <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src={article.image} 
                    alt={article.headline} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-bold text-[#0f3036]">Hoto:</span> {article.imageCaption || "Getty Images / Yanci Press"}
                  </span>
                  <span className="text-gray-400">{article.imageCredit || ""}</span>
                </figcaption>
              </figure>
            )}

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {article.body ? (
                <div
                  className="font-body text-lg leading-[1.8] text-gray-800 space-y-6"
                  dangerouslySetInnerHTML={{ __html: article.body }}
                />
              ) : (
                <div className="font-body text-lg leading-[1.8] text-gray-800 space-y-6">
                  {bodyText.map((block, idx) => {
                    if (block.type === 'paragraph') {
                      return (
                        <p 
                          key={idx}
                          className={idx === 0 ? 'first-letter:text-6xl first-letter:font-black first-letter:text-[#0f3036] first-letter:float-left first-letter:mr-4 first-letter:mt-[-8px]' : ''}
                        >
                          {block.content}
                        </p>
                      );
                    }
                    
                    if (block.type === 'subheading') {
                      return (
                        <h2 key={idx} className="text-2xl font-serif font-bold text-[#0f3036] mt-10 mb-4">
                          {block.content}
                        </h2>
                      );
                    }
                    
                    if (block.type === 'quote') {
                      return (
                        <blockquote key={idx} className="my-10 py-8 px-8 bg-gradient-to-r from-[#0f3036] to-[#1a454c] rounded-2xl shadow-xl relative overflow-hidden">
                          <div className="absolute top-4 left-4 text-8xl text-[#c59d5f]/20 font-serif">"</div>
                          <p className="font-serif text-2xl font-bold italic text-white mb-4 relative z-10 leading-relaxed">
                            {block.quote}
                          </p>
                          <footer className="relative z-10">
                            <p className="text-[#c59d5f] font-bold">{block.author}</p>
                            <p className="text-white/60 text-sm">{block.role}</p>
                          </footer>
                        </blockquote>
                      );
                    }
                    
                    if (block.type === 'image') {
                      return (
                        <figure key={idx} className="my-10">
                          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                            <img src={block.src} alt={block.caption} className="w-full h-full object-cover" />
                          </div>
                          <figcaption className="mt-3 text-sm text-gray-500 flex items-center justify-between">
                            <span>{block.caption}</span>
                            <span className="text-gray-400">{block.credit}</span>
                          </figcaption>
                        </figure>
                      );
                    }
                    
                    if (block.type === 'list') {
                      return (
                        <ul key={idx} className="my-8 space-y-3 bg-gray-50 p-6 rounded-xl">
                          {block.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-2 h-2 rounded-full bg-[#c59d5f] mt-2.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <FaTags className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-500">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Najeriya', 'Siyasa', 'Tattalin Arziki', 'Gwamnati', 'Ci Gaba'].map(tag => (
                  <span 
                    key={tag}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-[#0f3036] hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="mt-10 flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                  <FaHeart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">234</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-[#0f3036] transition-colors">
                  <FaComment className="w-6 h-6" />
                  <span className="font-bold">45</span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Raba wannan labari:</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <FaFacebook className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <FaTwitter className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0f3036] to-[#1a454c] text-[#c59d5f] flex items-center justify-center font-serif font-bold text-3xl shrink-0">
                  {article.author ? article.author[0] : 'Y'}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-[#0f3036] mb-2">
                    Game da marubucin labari
                  </h3>
                  <p className="font-bold text-lg mb-2">{article.author || "Yanci Wakili"}</p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Marubuci ne mai fama da shekaru 10 na rubuta labarai a fannin siyasa da tattalin arziki. 
                    Ya samu lambobin yabo daban-daban a fagen jarida.
                  </p>
                  <button className="text-[#c59d5f] font-bold text-sm hover:underline flex items-center gap-1">
                    Duba labaransa <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Sticky Container */}
            <div className="sticky top-24 space-y-8">
              {/* Newsletter */}
              <div className="bg-gradient-to-br from-[#0f3036] to-[#1a454c] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#c59d5f]/20 rounded-full -mr-20 -mt-20 blur-2xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#c59d5f] rounded-xl flex items-center justify-center mb-4">
                    <FaEnvelope className="w-7 h-7 text-[#0f3036]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">Kada a barku a baya</h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Samu labaran Yanci kai tsaye a imel. Muna aiko muku da muhimman labarai kowane safiya.
                  </p>
                  <input 
                    type="email" 
                    placeholder="Adireshin imel..."
                    className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-sm mb-3 focus:outline-none focus:border-[#c59d5f] transition-colors placeholder-gray-400"
                  />
                  <button className="w-full bg-[#c59d5f] text-[#0f3036] font-bold py-4 rounded-xl hover:bg-white transition-all shadow-lg">
                    Yi Rajista Yanzu
                  </button>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Masu karatu 50,000+ sun riga sun yi rajista
                  </p>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0f3036] mb-6 flex items-center gap-2">
                  <FaNewspaper className="w-4 h-4" />
                  Labarai Masu Alaka
                </h3>
                <div className="space-y-5">
                  {relatedArticles.length > 0 ? relatedArticles.map((item, idx) => (
                    <Link 
                      to={`/article/${item.id}`} 
                      key={item.id} 
                      className="group flex gap-4"
                    >
                      <span className="text-2xl font-serif font-black text-gray-200 group-hover:text-[#c59d5f] transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-[#1c1917] group-hover:text-[#0f3036] transition-colors leading-snug mb-1 line-clamp-2">
                          {item.headline}
                        </h4>
                        <span className="text-xs text-gray-400">{item.kicker || item.pillar}</span>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-gray-500 text-sm">Babu labarai masu alaka a yanzu.</p>
                  )}
                </div>
              </div>

              {/* Trending */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#8a2c2c] mb-6 flex items-center gap-2">
                  <FaFire className="w-4 h-4" />
                  Labarai Masu Zafi
                </h3>
                <div className="space-y-4">
                  {trendingArticles.slice(0, 4).map((item, idx) => (
                    <Link 
                      to={`/article/${item.id}`} 
                      key={item.id} 
                      className="group block py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: PILLARS[item.pillar]?.main || '#0f3036' }}
                        >
                          {item.kicker || item.pillar}
                        </span>
                        <span className="text-xs text-gray-400">{Math.floor(Math.random() * 10 + 1)}h</span>
                      </div>
                      <h4 className="font-serif font-bold text-[#1c1917] group-hover:text-[#0f3036] transition-colors leading-snug text-sm">
                        {item.headline}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0f3036] mb-4">
                  Batutuwan da suka fi Shahara
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['#Najeriya', '#Siyasa', '#TattalinArziki', '#Wasanni', '#Fasaha', '#Lafiya', '#Ilimi', '#Noma'].map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-[#0f3036] hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* More Articles Section */}
        <section className="mt-20 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#0f3036]">Karin Labarai</h2>
            <Link 
              to="/" 
              className="text-sm font-bold text-[#c59d5f] hover:underline flex items-center gap-1"
            >
              Duba duka <FaChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.filter(a => a.id !== article.id).slice(0, 4).map(item => (
              <Link 
                key={item.id}
                to={`/article/${item.id}`}
                className="group block"
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img 
                    src={item.image} 
                    alt={item.headline}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span 
                  className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ backgroundColor: PILLARS[item.pillar]?.main || '#0f3036' }}
                >
                  {item.kicker || item.pillar}
                </span>
                <h3 className="font-serif font-bold text-[#1c1917] group-hover:text-[#0f3036] transition-colors leading-snug line-clamp-2">
                  {item.headline}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#c59d5f] text-[#0f3036] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#d4a85f] transition-all z-40 hover:scale-110"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}

      <GuardianFooter />
    </div>
  );
};

export default ArticlePage;
