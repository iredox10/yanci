import { 
  FaArrowUpRightFromSquare, 
  FaTowerBroadcast, 
  FaWandMagicSparkles, 
  FaArrowTrendUp, 
  FaPlay, 
  FaCalendar,
  FaFire,
  FaBookmark,
  FaShareNodes,
  FaChevronRight,
  FaClock,
  FaEye,
  FaNewspaper,
  FaEnvelope
} from 'react-icons/fa6';
import { useState, useEffect, useRef } from 'react';
import GuardianFooter from '../components/guardian/GuardianFooter';
import GuardianNav from '../components/guardian/GuardianNav';
import NewsCard from '../components/guardian/NewsCard';
import OpinionCard from '../components/guardian/OpinionCard';
import SectionContainer from '../components/guardian/SectionContainer';
import { PILLARS } from '../data/guardianData';
import { useNews } from '../context/NewsContext';
import { useAudio } from '../context/AudioContext';
import { Link } from 'react-router-dom';

const highlightPanels = [
  {
    id: 'economy',
    tag: 'Kasuwanci',
    title: 'Kasuwar hannayen jari ta yi sama da kashi 4 cikin yini biyu',
    copy: 'Masu zuba jari sun amince da kudurin gwamnati na saukaka haraji ga masana\u2019antun kere-kere.',
    icon: FaArrowTrendUp,
    accent: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'radio',
    tag: 'Sauti',
    title: 'Shirin rediyon Yanci Live ya dawo da sabbin makalu daga jihohi 8',
    copy: 'Masu sauraro na iya kallo kai tsaye tare da mika tambaya daga manhajar mu.',
    icon: FaTowerBroadcast,
    accent: '#3b82f6',
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 'innovation',
    tag: 'Kirkire-kirkire',
    title: 'Matasa a Zaria sun ƙirƙiri manhajar gano gonaki ta tauraron dan adam',
    copy: 'Aikin ya samu tallafin dala 150,000 daga hadin gwiwar ƙungiyoyin noma na duniya.',
    icon: FaWandMagicSparkles,
    accent: '#8b5cf6',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
];

// Animated counter hook
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref: countRef };
};

const GuardianHome = () => {
  const { articles, ticker } = useNews();
  const { playTrack } = useAudio();
  const [activeTab, setActiveTab] = useState('latest');
  const [isVisible, setIsVisible] = useState({});

  const headlines = articles.filter(a => a.section === 'headlines');
  const heroStory = headlines.find((headline) => headline.type === 'hero') ?? headlines[0];
  const supportingHeadlines = headlines.filter((headline) => headline.id !== heroStory?.id);

  const opinionArticles = articles.filter(a => a.section === 'opinion');
  const sportArticles = articles.filter(a => a.section === 'sport');
  const lifestyleArticles = articles.filter(a => a.section === 'lifestyle');
  const cultureArticles = articles.filter(a => a.section === 'culture');

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [articles]);

  const stats = [
    { label: 'Labarai', value: 12500, suffix: '+' },
    { label: 'Masu karatu', value: 500, suffix: 'K+' },
    { label: 'Kasashen duniya', value: 45, suffix: '' },
  ];

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917] selection:bg-[#c59d5f] selection:text-white overflow-x-hidden">
      <GuardianNav />

      <main className="relative">
        {/* Breaking News Ticker - Modern Glassmorphism */}
        {ticker?.length > 0 && (
          <section className="sticky top-[48px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">
              <div className="flex items-center gap-4 py-2.5">
                <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 animate-pulse">
                  <FaFire className="w-3 h-3" />
                  <span className="hidden sm:inline">Kai Tsaye</span>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {[...ticker, ...ticker, ...ticker].map((item, index) => (
                      <span key={`${item}-${index}`} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#0f3036] cursor-pointer transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c59d5f]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="text-xs font-bold text-[#0f3036] hover:text-[#c59d5f] transition-colors shrink-0 flex items-center gap-1">
                  Duba duka <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Hero Section - Modern Bento Grid with Parallax */}
        {heroStory && (
          <section className="relative pt-8 pb-16 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c59d5f]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0f3036]/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative">
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Main Hero */}
                <div 
                  id="hero-section"
                  data-animate
                  className={`lg:col-span-8 transition-all duration-1000 ${isVisible['hero-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <NewsCard data={heroStory} variant="hero" />
                </div>

                {/* Sidebar - Latest News */}
                <div 
                  id="sidebar-section"
                  data-animate
                  className={`lg:col-span-4 transition-all duration-1000 delay-200 ${isVisible['sidebar-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                      {['latest', 'popular'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
                            activeTab === tab 
                              ? 'text-[#0f3036] border-b-2 border-[#c59d5f] bg-gray-50/50' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {tab === 'latest' ? 'Sabbi' : 'Fiye da Sauran'}
                        </button>
                      ))}
                    </div>

                    <div className="p-4">
                      <div className="space-y-0">
                        {supportingHeadlines.slice(0, 5).map((item, index) => (
                          <Link 
                            to={`/article/${item.id}`} 
                            key={item.id} 
                            className="group flex gap-4 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/50 -mx-4 px-4 transition-all rounded-lg"
                          >
                            <span className="text-2xl font-serif font-black text-gray-200 group-hover:text-[#c59d5f] transition-colors w-8 shrink-0">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                {item.isLive && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse">
                                    Kai Tsaye
                                  </span>
                                )}
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8a2c2c]">{item.kicker}</span>
                              </div>
                              <h3 className="font-serif text-base font-bold text-[#1c1917] leading-snug group-hover:text-[#0f3036] transition-colors line-clamp-2">
                                {item.headline}
                              </h3>
                              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-medium">
                                <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> 2h</span>
                                <span className="flex items-center gap-1"><FaEye className="w-3 h-3" /> 12.5K</span>
                              </div>
                            </div>
                            {item.image && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.headline} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                      <button className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#0f3036] hover:text-[#c59d5f] transition-colors flex items-center justify-center gap-2 group">
                        Duba labarai duka 
                        <FaArrowUpRightFromSquare className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Feature Cards - Modern Glassmorphism */}
        <section 
          id="features-section"
          data-animate
          className={`py-16 transition-all duration-1000 ${isVisible['features-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {highlightPanels.map((panel, index) => {
                const Icon = panel.icon;
                return (
                  <article 
                    key={panel.id} 
                    className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${panel.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Decorative circle */}
                    <div 
                      className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"
                      style={{ backgroundColor: panel.accent }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div 
                          className="p-3 rounded-xl text-white shadow-lg"
                          style={{ backgroundColor: panel.accent }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span 
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: panel.accent }}
                        >
                          {panel.tag}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-serif font-bold text-[#1c1917] leading-tight mb-3 group-hover:text-[#0f3036] transition-colors">
                        {panel.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        {panel.copy}
                      </p>
                      
                      <button 
                        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all group-hover:gap-3"
                        style={{ color: panel.accent }}
                      >
                        Bincika 
                        <FaArrowUpRightFromSquare className="w-3 h-3" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section - Modern Design */}
        <section 
          id="stats-section"
          data-animate
          className={`py-16 bg-[#0f3036] relative overflow-hidden transition-all duration-1000 ${isVisible['stats-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const { count, ref } = useCountUp(stat.value);
                return (
                  <div 
                    key={stat.label}
                    ref={ref}
                    className="text-center group"
                  >
                    <div className="text-5xl md:text-6xl font-serif font-black text-white mb-2">
                      {count.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest text-[#c59d5f]">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Opinion Section - Editorial Magazine Style */}
        <section 
          id="opinion-section"
          data-animate
          className={`py-20 transition-all duration-1000 ${isVisible['opinion-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e05e00] mb-2 block">Ra'ayi & Sharhi</span>
                <h2 className="text-4xl font-serif font-black text-[#1c1917]">Ra'ayoyin Masana</h2>
              </div>
              <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#0f3036] hover:text-[#c59d5f] transition-colors group">
                Duba duk ra'ayoyi 
                <FaChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opinionArticles.map((item, index) => (
                <div 
                  key={item.id}
                  className={`${index === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <OpinionCard data={item} featured={index === 0} />
                </div>
              ))}

              {/* Editorial Card */}
              <div className="bg-gradient-to-br from-[#1c1917] to-[#2d2a26] text-white p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#c59d5f]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-[#c59d5f]/20 text-[#c59d5f] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    Sharhin Edita
                  </span>
                  <h3 className="font-serif text-2xl font-bold leading-tight mb-4 group-hover:text-[#c59d5f] transition-colors">
                    Matakan tsaron bayanai su ci gaba da zama ginshikin cigaba.
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                    A yayin da duniya ke kara dunkulewa waje guda ta hanyar fasahar zamani, ya zama wajibi mu dage wajen kare bayanai.
                  </p>
                </div>
                
                <div className="relative z-10 mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c59d5f] to-[#d4a85f] rounded-full flex items-center justify-center text-[#0f3036] font-serif font-bold text-xl shadow-lg">
                    Y
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Yanci Edita</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Muryar Gaskiya</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Mini Card */}
              <div className="bg-gradient-to-br from-[#f8f7f4] to-[#f0ede8] p-8 rounded-2xl border border-gray-100 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="w-12 h-12 bg-[#0f3036] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <FaEnvelope className="w-6 h-6 text-[#c59d5f]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1c1917] mb-2">Tafiyar da Wasiku</h3>
                  <p className="text-sm text-gray-600 mb-4">Samu labarai kai tsaye a cikin akwatin saƙonku kowane safiya.</p>
                </div>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Adireshin imel..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59d5f]/20 focus:border-[#c59d5f] transition-all"
                  />
                  <button className="w-full py-3 bg-[#0f3036] text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#1a454c] transition-colors shadow-lg shadow-[#0f3036]/20">
                    Yi Rajista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sport Section - Dynamic with Live Score */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2c7a7b] to-[#319795] rounded-xl flex items-center justify-center shadow-lg">
                  <FaFire className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2c7a7b]">Wasanni</span>
                  <h2 className="text-3xl font-serif font-black text-[#1c1917]">Sakamako da Labarai</h2>
                </div>
              </div>
              <div className="hidden md:flex gap-3">
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold hover:bg-[#2c7a7b] hover:text-white hover:border-transparent transition-all">
                  Kwallon Kafa
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold hover:bg-[#2c7a7b] hover:text-white hover:border-transparent transition-all">
                  NBA
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold hover:bg-[#2c7a7b] hover:text-white hover:border-transparent transition-all">
                  Tennis
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Live Score Card - Modern Design */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-br from-[#0f3036] to-[#1a454c] text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                  {/* Animated background glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c59d5f]/10 rounded-full blur-3xl animate-pulse" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <span className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-full animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                        Kai Tsaye
                      </span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Premier League</span>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#0f3036] font-black text-2xl shadow-lg">
                            Y
                          </div>
                          <div>
                            <span className="text-xl font-serif font-bold block">Yanci Stars</span>
                            <span className="text-xs text-gray-400">Gida</span>
                          </div>
                        </div>
                        <span className="text-5xl font-black text-[#c59d5f]">3</span>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl font-black text-white/30 font-mono">VS</p>
                          <p className="text-sm text-gray-400 mt-1">90:00 +2</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl backdrop-blur-sm opacity-70">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-2xl">
                            C
                          </div>
                          <div>
                            <span className="text-xl font-serif font-bold block text-gray-300">City Royals</span>
                            <span className="text-xs text-gray-500">Baƙo</span>
                          </div>
                        </div>
                        <span className="text-5xl font-black text-gray-500">2</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Kwallaye</p>
                          <p className="text-lg font-bold">Ahmed (2)</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Katin Ruwa</p>
                          <p className="text-lg font-bold text-yellow-400">2</p>
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-[#c59d5f] text-[#0f3036] font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white transition-all shadow-lg flex items-center gap-2">
                        <FaPlay className="w-4 h-4" /> Kalli Yanzu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upcoming Matches */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Wasannin da ke nan gaba</h4>
                  {[
                    { home: 'Super Eagles', away: 'Black Stars', time: '18:00', date: 'Yau' },
                    { home: 'Kano Pillars', away: 'Enyimba', time: '16:30', date: 'Gobe' },
                  ].map((match, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2c7a7b]/30 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-[#0f3036]">{match.time}</p>
                          <p className="text-xs text-gray-400">{match.date}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div>
                          <p className="text-sm font-bold">{match.home} <span className="text-gray-400">vs</span> {match.away}</p>
                          <p className="text-xs text-gray-400">NPFL</p>
                        </div>
                      </div>
                      <FaChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2c7a7b] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sport News Grid */}
              <div className="lg:col-span-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  {sportArticles.map((item, index) => (
                    <div key={item.id} className={index === 0 ? 'sm:col-span-2' : ''}>
                      <NewsCard data={item} featured={index === 0} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle & Culture - Magazine Layout */}
        <section 
          id="lifestyle-section"
          data-animate
          className={`py-20 transition-all duration-1000 ${isVisible['lifestyle-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Lifestyle Section */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#d69e2e] to-[#ecc94b] rounded-lg flex items-center justify-center">
                    <FaNewspaper className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d69e2e]">Rayuwa</span>
                    <h2 className="text-2xl font-serif font-black text-[#1c1917]">Rayuwar Yanci</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {lifestyleArticles.map((item, idx) => (
                    <article 
                      key={item.id} 
                      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 ${idx === 0 ? 'flex flex-col md:flex-row' : 'flex gap-4 p-4'}`}
                    >
                      {item.image && (
                        <div className={`overflow-hidden ${idx === 0 ? 'md:w-1/2 aspect-video md:aspect-auto' : 'w-24 h-24 rounded-lg shrink-0'}`}>
                          <img 
                            src={item.image} 
                            alt={item.headline}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className={`${idx === 0 ? 'p-6 md:w-1/2 flex flex-col justify-center' : 'flex-1 min-w-0'}`}>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#d69e2e] mb-2 block">{item.kicker}</span>
                        <h3 className={`font-serif font-bold text-[#1c1917] leading-tight group-hover:text-[#d69e2e] transition-colors ${idx === 0 ? 'text-2xl mb-3' : 'text-lg mb-2'}`}>
                          {item.headline}
                        </h3>
                        {idx === 0 && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            Binciken masana ya nuna cewa motsa jiki na yau da kullum yana rage haɗarin cututtukan zuciya da kashi 40%.
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> 5h</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>5 min read</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Culture Section - Card Stack */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#a1845c] to-[#c4a574] rounded-lg flex items-center justify-center">
                    <FaWandMagicSparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a1845c]">Al'adu</span>
                    <h2 className="text-2xl font-serif font-black text-[#1c1917]">Al'adu & Fasaha</h2>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1c1917] to-[#2d2a26] rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&auto=format&fit=crop" 
                      alt="Culture background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    {cultureArticles.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.headline}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c59d5f] mb-1 block">{item.kicker}</span>
                            <h3 className="font-serif text-base font-bold leading-snug group-hover:text-[#c59d5f] transition-colors line-clamp-2">
                              {item.headline}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <FaClock className="w-3 h-3" /> 3h
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-4 border border-white/20 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#1c1917] transition-all relative z-10">
                    Duka labarai na al'adu
                  </button>
                </div>

                {/* Trending Topics */}
                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Batutuwan da suka fi shahara</h4>
                  <div className="flex flex-wrap gap-2">
                    {['#Nollywood', '#Afrobeats', '#NigerianFood', '#Fashion', '#Tech', '#Startups'].map((tag) => (
                      <span 
                        key={tag}
                        className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-[#0f3036] hover:text-white transition-all cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section - Full Width */}
        <section className="py-20 bg-[#0f3036] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#c59d5f]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#2c7a7b]/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-[#c59d5f] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FaEnvelope className="w-8 h-8 text-[#0f3036]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
                Kasance tare da mu
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Samu labarai masu inganci, ra'ayoyi masu zurfi, da rahotanni na musamman kai tsaye a cikin akwatin saƙonku.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Adireshin imel..."
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c59d5f]/50 focus:border-[#c59d5f] transition-all"
                />
                <button className="px-8 py-4 bg-[#c59d5f] text-[#0f3036] font-bold uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-lg whitespace-nowrap">
                  Yi Rajista
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                Masu karatu 50,000+ sun riga sun yi rajista. Kana iya soke rajista a kowane lokaci.
              </p>
            </div>
          </div>
        </section>
      </main>

      <GuardianFooter />
    </div>
  );
};

export default GuardianHome;
