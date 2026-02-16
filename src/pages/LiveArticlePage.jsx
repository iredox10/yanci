import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock, FaShareNodes, FaBookmark, FaFacebook, FaTwitter, FaLinkedin, FaPrint, FaTowerBroadcast, FaRotate, FaLocationDot, FaArrowDown, FaTriangleExclamation, FaCirclePlay, FaFilter, FaThumbtack } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';

const LiveArticlePage = () => {
  const { id } = useParams();
  const { getArticleById } = useNews();

  // Try to find the article by ID, or fallback to the known live article (ID 3) if not found or if ID is missing
  const article = getArticleById(id) || getArticleById(3);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

  // Auto-refresh logic (mainly for non-realtime fallback or to ensure freshness)
  useEffect(() => {
    let interval;
    if (isAutoRefreshing) {
      interval = setInterval(() => {
        // In a real app with polling, we'd fetch here. 
        // With Appwrite realtime, this might just be a visual indicator or a safety poll.
        // For now, we'll just log (or if we had a re-fetch function, call it).
        console.log('Auto-refreshing live details...');
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefreshing]);

  // Load Twitter widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const EmbedRenderer = ({ content }) => {
    if (!content) return null;

    // Simple parser: split by newlines, check for exact URL matches
    const lines = content.split('\n');

    return (
      <>
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // YouTube
          const ytMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
          if (ytMatch) {
            return (
              <div key={idx} className="my-4 aspect-video rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          // Twitter/X
          const twMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([\w_]+)\/status\/(\d+)/);
          if (twMatch) {
            return (
              <div key={idx} className="my-4 flex justify-center">
                <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                  <a href={`https://twitter.com/${twMatch[1]}/status/${twMatch[2]}`}></a>
                </blockquote>
              </div>
            );
          }

          // Regular Text
          return <p key={idx} className="mb-2 whitespace-pre-wrap">{line}</p>;
        })}
      </>
    );
  };


  if (!article) return <div>Ana Lodawa...</div>;

  const sortedUpdates = (article.liveUpdates || []).sort((a, b) => new Date(b.timestamp || b.id) - new Date(a.timestamp || a.id));
  const timeline = sortedUpdates;
  const keyEvents = sortedUpdates.filter(u => u.isKeyEvent);
  const pinnedPost = sortedUpdates.find(u => u.isPinned);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-[#ffe500] selection:text-black">
      <GuardianNav />

      {/* Main Header */}
      <header className="bg-[#f6f6f6] border-b border-gray-200 py-12 md:py-16">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#cc0000] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 py-1 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full"></span> Kai Tsaye
            </span>
            <span className="text-[#cc0000] font-bold text-xs uppercase tracking-widest">Sufuri</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#121212] leading-[1.1] mb-6 max-w-4xl">
            {article.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">IS</div>
                <div className="w-8 h-8 rounded-full bg-[#ffe500] text-black flex items-center justify-center text-xs font-bold ring-2 ring-white">AY</div>
              </div>
              <span><span className="text-[#121212] font-bold underline decoration-[#ffe500] decoration-2 underline-offset-2">Ibrahim Sani</span> da <span className="text-[#121212] font-bold underline decoration-[#ffe500] decoration-2 underline-offset-2">Amina Yusuf</span></span>
            </div>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-2">
              <FaClock className="text-gray-400" /> An fara 09:00 AM
            </span>
          </div>
        </div>
      </header>

      {/* Sticky Control Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#cc0000] font-bold text-xs uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#cc0000] animate-pulse"></span>
              <span className="hidden sm:inline">Kai Tsaye</span>
            </div>
            <span className="w-px h-4 bg-gray-200"></span>
            <span className="text-xs font-bold text-gray-500">
              Sabuwar wallafa <span className="text-gray-900">Yanzu</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${isAutoRefreshing ? 'bg-[#e3f2fd] text-[#0562c1] border-[#0562c1]/20' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`}
            >
              <FaRotate className={`w-3 h-3 ${isAutoRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAutoRefreshing ? 'Sake Sabuntawa: Kunne' : 'A Kashe'}</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-[#121212] transition-colors">
              <FaShareNodes className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1240px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Feed Column */}
          <div className="lg:col-span-8 relative">

            {/* Timeline Line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gray-100 hidden md:block"></div>

            {/* Pinned Post */}
            {pinnedPost && (
              <div className="mb-12 md:pl-8 relative">
                <div className="bg-[#fff0f0] border-l-[6px] border-[#cc0000] p-6 md:p-8 rounded-r-lg shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#cc0000] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 flex items-center gap-1 w-fit rounded-sm">
                      <FaThumbtack className="w-2.5 h-2.5 -rotate-45" /> Daka
                    </span>
                    <span className="text-xs font-bold text-[#cc0000]">{pinnedPost.time}</span>
                  </div>
                  {pinnedPost.title && (
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-[#121212] mb-4 leading-tight hover:underline decoration-[#cc0000] underline-offset-4 decoration-2 cursor-pointer">
                      {pinnedPost.title}
                    </h2>
                  )}
                  {pinnedPost.image && (
                    <figure className="mb-6 rounded overflow-hidden">
                      <img src={pinnedPost.image} alt={pinnedPost.title} className="w-full h-auto object-cover" />
                    </figure>
                  )}
                  <div className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed">
                    <EmbedRenderer content={pinnedPost.content} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#cc0000]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Daga {pinnedPost.author || 'Edita'}
                    </span>
                    <div className="flex gap-3">
                      <button className="text-gray-400 hover:text-[#1877F2]"><FaFacebook /></button>
                      <button className="text-gray-400 hover:text-[#1DA1F2]"><FaTwitter /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Updates Feed */}
            <div className="">
              {timeline.map((event) => (
                <article key={event.id} id={event.id} className={`relative md:pl-8 pb-12 mb-12 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0 group ${event.isKeyEvent ? 'is-key-event' : ''}`}>
                  {/* Timeline Dot (Desktop) */}
                  <div className={`hidden md:flex absolute left-0 top-[24px] w-4 h-4 rounded-full border-[3px] border-white z-10 shadow-sm transition-transform group-hover:scale-110 
                    ${event.isKeyEvent ? 'bg-[#cc0000] ring-4 ring-[#cc0000]/10' : event.isSummary ? 'bg-[#0562c1]' : 'bg-[#121212]'}`}>
                  </div>

                  {/* Mobile Time Stamp */}
                  <div className="md:hidden flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${event.isKeyEvent ? 'text-[#cc0000]' : 'text-gray-500'}`}>
                      {event.time}
                    </span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>

                  {/* Card Content */}
                  <div className={`
                    p-0 transition-all duration-300
                    ${event.isKeyEvent ? '' : ''}
                  `}>
                    <header className="flex items-start justify-between mb-4">
                      <div className="flex flex-col">
                        {/* Desktop Time */}
                        <time className="hidden md:block text-xs font-extrabold text-[#cc0000] uppercase tracking-widest mb-1.5">
                          {event.time}
                        </time>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {event.isKeyEvent && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000] border border-[#cc0000] px-2 py-0.5 rounded-sm bg-[#fff0f0]">
                              Muhimmin Abu
                            </span>
                          )}
                          {event.isSummary && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0562c1] border border-[#0562c1] bg-[#e3f2fd] px-2 py-0.5 rounded-sm">
                              Takaitawa
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interaction Actions (Start hidden, show on hover?) */}
                    </header>

                    {event.title && (
                      <h3 className="text-xl md:text-2xl font-serif font-black text-[#121212] mb-3 leading-tight hover:text-[#cc0000] transition-colors cursor-pointer">
                        {event.title}
                      </h3>
                    )}

                    {event.image && (
                      <figure className="mb-5 rounded overflow-hidden bg-gray-100">
                        <img src={event.image} alt={event.title} className="w-full h-auto object-cover" />
                        <figcaption className="text-[10px] text-gray-500 mt-2 px-1 flex items-center gap-1 uppercase tracking-wider font-medium">
                          <FaLocationDot className="w-3 h-3 text-gray-400" /> Kai tsaye daga wajen
                        </figcaption>
                      </figure>
                    )}

                    <div className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed">
                      <EmbedRenderer content={event.content} />
                    </div>

                    <footer className="mt-4 pt-4 flex items-center justify-between border-t border-transparent group-hover:border-gray-100 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[9px]">{event.author?.[0] || 'E'}</span>
                        {event.author || 'Edita'}
                      </span>
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-[#121212] text-xs font-bold flex items-center gap-1"><FaShareNodes /> Raba</button>
                      </div>
                    </footer>
                  </div>
                </article>
              ))}
            </div>

            <button className="w-full py-5 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-[#cc0000] hover:text-[#cc0000] transition-all mt-16 rounded-lg flex items-center justify-center gap-2">
              <FaRotate /> Kara Ganin Labarai
            </button>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-20 space-y-8">

              {/* Key Events Widget */}
              {keyEvents.length > 0 && (
                <div className="bg-white border text-[#121212] rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#121212] px-5 py-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <FaFilter className="text-[#ffe500]" /> Muhimman Abubuwa
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {keyEvents.map(event => (
                      <a key={event.id} href={`#${event.id}`} className="block p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-bold text-[#cc0000]">{event.time}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{event.author || 'Edita'}</span>
                        </div>
                        <p className="font-serif font-bold text-sm leading-snug group-hover:underline decoration-[#cc0000] underline-offset-2">
                          {event.title || 'Babban Ci Gaba'}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Multimedia Widgets */}
              {article.videoUrl && (
                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-900 bg-black">
                  <div className="aspect-video relative">
                    <iframe src={article.videoUrl} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                  </div>
                  <div className="p-3 bg-[#121212] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse"></span> Bibi Kai Tsaye
                    </span>
                  </div>
                </div>
              )}

              {article.mapEmbedUrl && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaLocationDot /> Taswira Kai Tsaye
                  </h3>
                  <div className="aspect-square rounded overflow-hidden border border-gray-200">
                    <iframe src={article.mapEmbedUrl} className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
                  </div>
                </div>
              )}

              {/* Key Figures */}
              {article.keyFigures && (
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">
                    Manyan Mutane
                  </h3>
                  <div className="space-y-4">
                    {article.keyFigures.split('\n').map((line, idx) => {
                      const parts = line.split('-');
                      const initial = parts[0]?.trim()?.charAt(0) || '?';
                      if (!parts[0]) return null;
                      return (
                        <div key={idx} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-full bg-[#f6f6f6] border border-gray-200 flex items-center justify-center font-serif font-bold text-[#121212] group-hover:bg-[#ffe500] transition-colors">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-gray-900">{parts[0]?.trim()}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{parts[1]?.trim()}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </main>

      <GuardianFooter />
    </div>
  );
};

export default LiveArticlePage;
