import { LuArrowUpRight, LuRadio, LuSparkles, LuTrendingUp, LuPlay, LuCalendar } from 'react-icons/lu';
import GuardianFooter from '../components/guardian/GuardianFooter';
import GuardianNav from '../components/guardian/GuardianNav';
import NewsCard from '../components/guardian/NewsCard';
import OpinionCard from '../components/guardian/OpinionCard';
import SectionContainer from '../components/guardian/SectionContainer';
import { PILLARS } from '../data/guardianData';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';

const highlightPanels = [
  {
    id: 'economy',
    tag: 'Kasuwanci',
    title: 'Kasuwar hannayen jari ta yi sama da kashi 4 cikin yini biyu',
    copy: 'Masu zuba jari sun amince da kudurin gwamnati na saukaka haraji ga masana’antun kere-kere.',
    icon: LuTrendingUp,
    accent: PILLARS.news.main,
  },
  {
    id: 'radio',
    tag: 'Sauti',
    title: 'Shirin rediyon Yanci Live ya dawo da sabbin makalu daga jihohi 8',
    copy: 'Masu sauraro na iya kallo kai tsaye tare da mika tambaya daga manhajar mu.',
    icon: LuRadio,
    accent: '#005689',
  },
  {
    id: 'innovation',
    tag: 'Kirkire-kirkire',
    title: 'Matasa a Zaria sun ƙirƙiri manhajar gano gonaki ta tauraron dan adam',
    copy: 'Aikin ya samu tallafin dala 150,000 daga hadin gwiwar ƙungiyoyin noma na duniya.',
    icon: LuSparkles,
    accent: '#bb3b80',
  },
];

const GuardianHome = () => {
  const { articles, ticker } = useNews();

  const headlines = articles.filter(a => a.section === 'headlines');
  const heroStory = headlines.find((headline) => headline.type === 'hero') ?? headlines[0];
  const supportingHeadlines = headlines.filter((headline) => headline.id !== heroStory?.id);
  
  const opinionArticles = articles.filter(a => a.section === 'opinion');
  const sportArticles = articles.filter(a => a.section === 'sport');
  const lifestyleArticles = articles.filter(a => a.section === 'lifestyle');
  const cultureArticles = articles.filter(a => a.section === 'culture');

  return (
    <div className="bg-[#f4f1ea] min-h-screen font-sans text-[#1c1917] selection:bg-[#c59d5f] selection:text-[#0f3036]">
      <GuardianNav />

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-20">
        
        {/* Ticker - Moved to top for urgency */}
        {ticker?.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-sm py-3 px-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8a2c2c] whitespace-nowrap z-10 bg-white pr-4 border-r border-gray-100">
              <span className="w-2 h-2 bg-[#8a2c2c] rounded-full animate-pulse"></span>
              Labarai Masu Zafi
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-12 animate-marquee whitespace-nowrap font-medium text-sm text-[#0f3036]">
                {[...ticker, ...ticker].map((item, index) => (
                  <span key={`${item}-${index}`} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rotate-45 bg-gray-300 inline-block" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Hero Section - Bento Grid Style */}
        {heroStory && (
          <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Main Hero - Spans 8 columns */}
            <div className="lg:col-span-8">
              <NewsCard data={heroStory} variant="hero" />
            </div>

            {/* Sidebar - Spans 4 columns */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white border-t-4 border-[#0f3036] p-6 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#0f3036]">Labarai na yau</h3>
                  <a href="#" className="text-xs font-bold text-[#c59d5f] hover:underline">Duba duka</a>
                </div>
                <div className="space-y-0 divide-y divide-gray-100 flex-1">
                  {supportingHeadlines.slice(0, 4).map((item) => (
                    <Link to={`/article/${item.id}`} key={item.id} className="group cursor-pointer py-4 first:pt-0 last:pb-0 block">
                      <div className="flex gap-3 mb-2">
                        {item.isLive ? (
                          <span className="text-[10px] uppercase font-bold tracking-widest text-white bg-[#8a2c2c] px-2 py-0.5 rounded-sm animate-pulse">Kai Tsaye</span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a2c2c]">{item.kicker}</span>
                        )}
                        <span className="text-[10px] text-gray-400 font-medium">10:30 AM</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold leading-snug text-[#1c1917] group-hover:text-[#0f3036] transition-colors mb-1">
                        {item.headline}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#c59d5f] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        Karanta <LuArrowUpRight />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Highlights - Feature Panels */}
        <section className="grid gap-6 md:grid-cols-3">
          {highlightPanels.map((panel) => {
            const Icon = panel.icon;
            return (
              <article key={panel.id} className="bg-[#0f3036] text-white p-8 rounded-sm shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-white/10 text-[#c59d5f] backdrop-blur-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c59d5f]">{panel.tag}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 leading-tight">{panel.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 border-l-2 border-[#c59d5f]/30 pl-4">{panel.copy}</p>
                  <button className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all text-white">
                    Bincika <LuArrowUpRight />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Opinion Section - Editorial Layout */}
        <SectionContainer
          title="Ra'ayi & Sharhi"
          accent={PILLARS.opinion.main}
          ctaLabel="Duba duk ra'ayoyi"
        >
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opinionArticles.map((item) => (
              <OpinionCard key={item.id} data={item} />
            ))}
            
            {/* Editorial Column */}
            <div className="bg-[#1c1917] text-white p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#c59d5f] mb-4 block">Sharhin Edita</span>
                <h3 className="font-serif text-2xl font-bold leading-tight mb-4 group-hover:text-[#c59d5f] transition-colors">
                  Matakan tsaron bayanai su ci gaba da zama ginshikin cigaba domin kare martabar kasa.
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                  A yayin da duniya ke kara dunkulewa waje guda ta hanyar fasahar zamani, ya zama wajibi mu...
                </p>
              </div>
              <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c59d5f] rounded-full flex items-center justify-center text-[#0f3036] font-serif font-bold text-xl">Y</div>
                <div>
                  <p className="text-sm font-bold">Yanci Edita</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Muryar Gaskiya</p>
                </div>
              </div>
            </div>

            {/* Letters Column */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#c59d5f] transition-colors">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block group-hover:text-[#c59d5f] transition-colors">Wasikun Masu Karatu</span>
                <div className="space-y-6">
                  <div>
                    <p className="font-serif text-lg font-bold text-[#1c1917] mb-2">"Tsarin jirgin kasa ya yi kyau, amma..."</p>
                    <p className="text-sm text-gray-600 line-clamp-2">Ina so in yaba wa gwamnati kan wannan kokari, sai dai akwai gyara a bangaren...</p>
                    <p className="text-xs font-bold text-gray-400 mt-2">— Musa D., Zaria</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-serif text-lg font-bold text-[#1c1917] mb-2">"Farashin mai ya shafi komai"</p>
                    <p className="text-xs font-bold text-gray-400 mt-2">— Amina K., Kano</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 text-xs font-bold uppercase tracking-wider text-[#0f3036] flex items-center gap-2 group-hover:gap-3 transition-all">
                Aiko da naka <LuArrowUpRight />
              </button>
            </div>
          </div>
        </SectionContainer>

        {/* Sport Section - Dynamic Layout */}
        <section className="bg-gray-50 -mx-4 md:-mx-6 px-4 md:px-6 py-16 border-y border-gray-200">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl font-serif font-black text-[#2c7a7b] flex items-center gap-3">
                <span className="w-4 h-10 bg-[#2c7a7b] block rounded-sm"></span>
                Wasanni
              </h2>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#2c7a7b] hover:text-white hover:border-transparent transition-all">
                  <LuCalendar className="w-4 h-4" />
                </button>
                <a href="#" className="px-6 py-2 border border-[#2c7a7b] text-[#2c7a7b] font-bold text-sm uppercase tracking-wider hover:bg-[#2c7a7b] hover:text-white transition-all rounded-sm flex items-center gap-2">
                  Duba sakamakon yau <LuArrowUpRight />
                </a>
              </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-12">
              {/* Live Score Card */}
              <div className="md:col-span-4 bg-[#0f3036] text-white rounded-sm p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2c7a7b] opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm animate-pulse">Kai Tsaye</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gasara ta kasa</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0f3036] font-black text-xl">Y</div>
                        <span className="text-2xl font-serif font-bold">Yanci Stars</span>
                      </div>
                      <span className="text-4xl font-black text-[#c59d5f]">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white font-black text-xl">C</div>
                        <span className="text-2xl font-serif font-bold text-gray-300">City Royals</span>
                      </div>
                      <span className="text-4xl font-black text-gray-500">2</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-black text-[#c59d5f] font-mono">90<span className="animate-pulse">'</span> +2</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Ƙarin lokaci</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-[#2c7a7b] mb-1">
                        <LuPlay className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold uppercase">Kalli Yanzu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sport News Grid */}
              <div className="md:col-span-8 grid gap-6 sm:grid-cols-2">
                {sportArticles.map((item) => (
                  <NewsCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle & Culture - Masonry-ish */}
        <section className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between border-b-2 border-gray-200 pb-3 mb-8">
              <h2 className="text-2xl font-serif font-black text-[#d69e2e] flex items-center gap-2">
                <span className="w-3 h-8 bg-[#d69e2e] block"></span>
                Rayuwar Yanci
              </h2>
              <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#d69e2e] transition-colors">Bincika ƙarin</a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {lifestyleArticles.map((item, idx) => (
                <article key={item.id} className={`bg-white p-8 shadow-sm hover:shadow-lg transition-all border-t-4 border-transparent hover:border-[#d69e2e] group ${idx === 0 ? 'sm:col-span-2 bg-orange-50/50' : ''}`}>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d69e2e] mb-3 block">{item.kicker}</span>
                  <h3 className={`${idx === 0 ? 'text-3xl' : 'text-xl'} font-serif font-bold text-[#1c1917] leading-tight group-hover:text-[#d69e2e] transition-colors mb-3`}>{item.headline}</h3>
                  {idx === 0 && <p className="text-gray-600 mb-4 max-w-xl">Binciken masana ya nuna cewa motsa jiki na yau da kullum yana rage haɗarin cututtukan zuciya da kashi 40%.</p>}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Minti 5</span>
                    <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-[#d69e2e] group-hover:text-white group-hover:border-transparent transition-all">
                      <LuArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#1c1917] text-white p-8 h-full rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-black text-white border-b-4 border-[#c59d5f] pb-2 inline-block">Al'adu</h2>
                  <LuSparkles className="w-6 h-6 text-[#c59d5f]" />
                </div>
                
                <div className="space-y-8 flex-1">
                  {cultureArticles.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="aspect-video rounded-sm overflow-hidden mb-3">
                        <img src={item.image} alt={item.headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#c59d5f] mb-2 block">{item.kicker}</span>
                      <h3 className="text-lg font-serif font-bold leading-snug group-hover:text-[#c59d5f] transition-colors">{item.headline}</h3>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-3 border border-white/20 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#1c1917] transition-all">
                  Duba duka
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <GuardianFooter />
    </div>
  );
};

export default GuardianHome;
