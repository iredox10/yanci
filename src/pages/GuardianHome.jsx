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
  FaEnvelope,
  FaTrophy,
  FaMedal,
  FaStar,
  FaFutbol,
  FaBasketball,
  FaVolleyball,
  FaPersonRunning,
  FaUsers,
  FaChartLine,
  FaTv,
  FaCircle,
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

        {/* Sport Section - Enhanced Modern Design */}
        <section className="py-20 bg-gradient-to-b from-[#0f3036] via-[#1a454c] to-[#0f3036] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c59d5f' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Floating Decorations */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#2c7a7b]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#c59d5f]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c59d5f] to-[#d4a85f] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#c59d5f]/30">
                  <FaTrophy className="w-7 h-7 text-[#0f3036]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c59d5f]">Wasanni</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-black text-white">Sakamako da Labarai</h2>
                </div>
              </div>

              {/* Sports Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'football', icon: FaFutbol, label: 'Kwallon Kafa', active: true },
                  { id: 'basketball', icon: FaBasketball, label: 'Basketball', active: false },
                  { id: 'athletics', icon: FaPersonRunning, label: 'Gudun', active: false },
                  { id: 'tabletennis', icon: FaStar, label: 'Tennis', active: false },
                ].map((sport) => {
                  const Icon = sport.icon;
                  return (
                    <button
                      key={sport.id}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        sport.active
                          ? 'bg-[#c59d5f] text-[#0f3036] shadow-lg shadow-[#c59d5f]/30'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{sport.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column - Live Matches & Standings */}
              <div className="lg:col-span-4 space-y-6">
                {/* Live Match Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-[#0f3036] to-[#1a454c] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Kai Tsaye</span>
                    </div>
                    <span className="text-[#c59d5f] text-xs font-bold">Premier League</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0f3036] to-[#1a454c] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                          YS
                        </div>
                        <span className="font-bold text-sm text-[#1c1917]">Yanci Stars</span>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-3 text-3xl font-black">
                          <span className="text-[#0f3036]">3</span>
                          <span className="text-gray-300">:</span>
                          <span className="text-gray-400">2</span>
                        </div>
                        <div className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                          90+2'
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                          CR
                        </div>
                        <span className="font-bold text-sm text-gray-500">City Royals</span>
                      </div>
                    </div>

                    {/* Match Timeline */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-8 text-gray-400 font-mono">88'</span>
                        <FaCircle className="w-2 h-2 text-[#c59d5f]" />
                        <span className="flex-1 text-gray-600">Ahmed - Yanci Stars</span>
                        <span className="font-bold text-[#0f3036]">3-2</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-8 text-gray-400 font-mono">72'</span>
                        <FaCircle className="w-2 h-2 text-gray-400" />
                        <span className="flex-1 text-gray-600">Johnson - City Royals</span>
                        <span className="font-bold">2-2</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-8 text-gray-400 font-mono">45'</span>
                        <FaCircle className="w-2 h-2 text-[#c59d5f]" />
                        <span className="flex-1 text-gray-600">Musa - Yanci Stars</span>
                        <span className="font-bold text-[#0f3036]">2-1</span>
                      </div>
                    </div>

                    <button className="w-full mt-6 py-3 bg-gradient-to-r from-[#0f3036] to-[#1a454c] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <FaTv className="w-4 h-4" /> Kallon Kai Tsaye
                    </button>
                  </div>
                </div>

                {/* League Standings */}
                <div className="bg-white/95 backdrop-blur rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaChartLine className="w-5 h-5 text-[#0f3036]" />
                      <span className="font-bold text-sm">Tsarin Gasar NPFL</span>
                    </div>
                    <span className="text-xs text-gray-400">2024/25</span>
                  </div>
                  <div className="p-2">
                    {[
                      { pos: 1, team: 'Yanci Stars', p: 24, gd: '+35', pts: 58 },
                      { pos: 2, team: 'Enyimba', p: 24, gd: '+28', pts: 52 },
                      { pos: 3, team: 'Rangers', p: 24, gd: '+22', pts: 49 },
                      { pos: 4, team: 'Kano Pillars', p: 24, gd: '+18', pts: 46 },
                      { pos: 5, team: 'Shooting Stars', p: 24, gd: '+12', pts: 42 },
                    ].map((team) => (
                      <div
                        key={team.pos}
                        className={`flex items-center gap-3 p-2.5 rounded-lg text-sm ${
                          team.pos === 1
                            ? 'bg-gradient-to-r from-[#c59d5f]/20 to-transparent border-l-4 border-[#c59d5f]'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          team.pos <= 3 ? 'bg-[#0f3036] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {team.pos}
                        </span>
                        <span className="flex-1 font-bold text-[#1c1917]">{team.team}</span>
                        <span className="text-gray-400 text-xs w-8 text-center">{team.p}</span>
                        <span className="text-gray-400 text-xs w-10 text-center">{team.gd}</span>
                        <span className="font-bold text-[#0f3036] w-8 text-center">{team.pts}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#0f3036] hover:text-[#c59d5f] transition-colors border-t border-gray-100">
                    Duba cikakken tebur
                  </button>
                </div>
              </div>

              {/* Center Column - Upcoming Matches */}
              <div className="lg:col-span-4">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="w-5 h-5 text-[#2c7a7b]" />
                      <span className="font-bold text-lg">Wasannin Wannan Mako</span>
                    </div>
                    <span className="text-xs px-3 py-1 bg-[#2c7a7b]/10 text-[#2c7a7b] rounded-full font-bold">5 Wasanni</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { league: 'NPFL', home: 'Yanci Stars', away: 'Enyimba', date: 'Yau', time: '16:00', stadium: 'Ahmadu Bello', odds: { home: 1.85, draw: 3.20, away: 4.50 } },
                      { league: 'Premier League', home: 'Super Eagles', away: 'Black Stars', date: 'Gobe', time: '20:00', stadium: 'Moshood Abiola', odds: { home: 1.45, draw: 4.00, away: 6.50 } },
                      { league: 'CAF CL', home: 'Rangers', away: 'Al Ahly', date: 'Alhamis', time: '18:00', stadium: 'Awka Stadium', odds: { home: 2.10, draw: 3.10, away: 3.40 } },
                      { league: 'NPFL', home: 'Kano Pillars', away: 'Shooting Stars', date: 'Juma\'a', time: '15:30', stadium: 'Sani Abacha', odds: { home: 1.95, draw: 3.15, away: 3.80 } },
                    ].map((match, idx) => (
                      <div
                        key={idx}
                        className="group p-4 rounded-xl border border-gray-100 hover:border-[#2c7a7b]/30 hover:shadow-lg transition-all cursor-pointer bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2c7a7b] bg-[#2c7a7b]/10 px-2 py-1 rounded-full">
                            {match.league}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FaClock className="w-3 h-3" />
                            {match.date}, {match.time}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1 text-center">
                            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#0f3036] to-[#1a454c] rounded-xl flex items-center justify-center text-white font-bold mb-1 group-hover:scale-110 transition-transform">
                              {match.home.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs font-bold text-[#1c1917]">{match.home}</span>
                          </div>

                          <div className="px-4">
                            <span className="text-lg font-black text-gray-300">VS</span>
                          </div>

                          <div className="flex-1 text-center">
                            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-bold mb-1 group-hover:scale-110 transition-transform">
                              {match.away.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs font-bold text-gray-600">{match.away}</span>
                          </div>
                        </div>

                        <div className="text-center mb-3">
                          <span className="text-[10px] text-gray-400">{match.stadium}</span>
                        </div>

                        {/* Odds */}
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-gray-50 rounded-lg text-xs font-bold hover:bg-[#2c7a7b] hover:text-white transition-colors">
                            1 <span className="text-[10px] opacity-70 ml-1">{match.odds.home}</span>
                          </button>
                          <button className="flex-1 py-2 bg-gray-50 rounded-lg text-xs font-bold hover:bg-[#2c7a7b] hover:text-white transition-colors">
                            X <span className="text-[10px] opacity-70 ml-1">{match.odds.draw}</span>
                          </button>
                          <button className="flex-1 py-2 bg-gray-50 rounded-lg text-xs font-bold hover:bg-[#2c7a7b] hover:text-white transition-colors">
                            2 <span className="text-[10px] opacity-70 ml-1">{match.odds.away}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-3 border-2 border-[#0f3036] text-[#0f3036] rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#0f3036] hover:text-white transition-all flex items-center justify-center gap-2">
                    <FaCalendar className="w-4 h-4" /> Duba Jadawalin Duka
                  </button>
                </div>
              </div>

              {/* Right Column - Sports News */}
              <div className="lg:col-span-4">
                <div className="space-y-6">
                  {/* Player of the Week Card */}
                  <div className="bg-gradient-to-br from-[#c59d5f] to-[#d4a85f] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <FaStar className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Dan Wasan Makon</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                          AM
                        </div>
                        <div>
                          <h3 className="font-serif text-2xl font-bold">Ahmed Musa</h3>
                          <p className="text-white/80 text-sm">Yanci Stars</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="text-center">
                              <p className="text-xl font-black">5</p>
                              <p className="text-[10px] uppercase tracking-wider opacity-70">Kwallaye</p>
                            </div>
                            <div className="w-px h-8 bg-white/30" />
                            <div className="text-center">
                              <p className="text-xl font-black">3</p>
                              <p className="text-[10px] uppercase tracking-wider opacity-70">Taimakawa</p>
                            </div>
                            <div className="w-px h-8 bg-white/30" />
                            <div className="text-center">
                              <p className="text-xl font-black">9.2</p>
                              <p className="text-[10px] uppercase tracking-wider opacity-70">Maki</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Latest Sports News */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <FaNewspaper className="w-5 h-5 text-[#c59d5f]" />
                        Sabbin Labarai
                      </h3>
                      <a href="/wasanni" className="text-xs text-[#c59d5f] hover:underline flex items-center gap-1">
                        Duba duka <FaChevronRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="space-y-4">
                      {sportArticles.slice(0, 3).map((article, idx) => (
                        <Link
                          key={article.id}
                          to={`/article/${article.id}`}
                          className="group flex gap-4 p-4 bg-white/95 backdrop-blur rounded-xl hover:bg-white transition-all cursor-pointer"
                        >
                          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={article.image}
                              alt={article.headline}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2c7a7b] mb-1 block">
                              {article.kicker}
                            </span>
                            <h4 className="font-serif font-bold text-[#1c1917] leading-snug group-hover:text-[#0f3036] transition-colors line-clamp-2 text-sm">
                              {article.headline}
                            </h4>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                              <FaClock className="w-3 h-3" />
                              <span>2h ago</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <FaClock className="w-4 h-4 text-[#c59d5f]" />
                      Saurin Labarai
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-black text-[#c59d5f]">12</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider">Kwallaye a yau</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-black text-white">8</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider">Wasannin da suka gama</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-black text-white">5</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider">Wasannin gobe</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-black text-[#c59d5f]">3</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider">Kai tsaye</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sports Categories Grid */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FaFutbol, title: 'NPFL', subtitle: 'Nigerian Premier League', color: 'from-green-500 to-emerald-600' },
                { icon: FaUsers, title: 'Super Eagles', subtitle: 'Kungiyar Kasa', color: 'from-[#0f3036] to-[#1a454c]' },
                { icon: FaBasketball, title: 'NBA', subtitle: 'Basketball USA', color: 'from-orange-500 to-red-500' },
                { icon: FaMedal, title: 'Gasar Olympics', subtitle: '2024 Paris', color: 'from-blue-500 to-indigo-600' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    className="group p-6 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-white/60">{item.subtitle}</p>
                  </button>
                );
              })}
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
