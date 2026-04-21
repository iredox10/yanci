import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaClock, FaShareNodes, FaBookmark, FaFacebook, FaTwitter,
  FaPrint, FaTowerBroadcast, FaRotate, FaLocationDot, FaArrowDown,
  FaTriangleExclamation, FaCirclePlay, FaFilter, FaThumbtack,
  FaArrowUp, FaChevronDown, FaMagnifyingGlass, FaXmark, FaStar,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';

const EmbedRenderer = ({ content }) => {
  if (!content) return null;
  const lines = content.split('\n');
  return (
    <>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const ytMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
        if (ytMatch) {
          return (
            <div key={idx} className="my-4 aspect-video rounded-lg overflow-hidden shadow-sm">
              <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          );
        }
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
        return <p key={idx} className="mb-2 whitespace-pre-wrap">{line}</p>;
      })}
    </>
  );
};

const LiveArticlePage = () => {
  const { id } = useParams();
  const { getArticleById } = useNews();
  const article = getArticleById(id) || getArticleById(3);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all | key | summary
  const [showNewBadge, setShowNewBadge] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const lastSeenCount = useRef(0);
  const feedRef = useRef(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'noopener,noreferrer');
  const shareTwitter = (text = '') => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text || article?.headline || '')}`, '_blank', 'noopener,noreferrer');
  const handleNativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article?.headline || 'Yanci Live', url: currentUrl }); } catch {}
    } else {
      alert("Browser baya goyon bayan wannan tsarin raba labari.");
    }
  };

  // Track new updates
  useEffect(() => {
    const updates = article?.liveUpdates || [];
    if (updates.length > lastSeenCount.current && lastSeenCount.current > 0) {
      setNewCount(updates.length - lastSeenCount.current);
      setShowNewBadge(true);
    }
    lastSeenCount.current = updates.length;
  }, [article?.liveUpdates]);

  // Auto-refresh
  useEffect(() => {
    let interval;
    if (isAutoRefreshing) {
      interval = setInterval(() => { /* In production, poll API here */ }, 30000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefreshing]);

  // Load Twitter widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const scrollToLatest = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setShowNewBadge(false);
    setNewCount(0);
  }, []);

  if (!article) return <div className="min-h-screen flex items-center justify-center">Ana Lodawa...</div>;

  const sortedUpdates = [...(article.liveUpdates || [])].sort((a, b) => (b.timestamp || b.id) - (a.timestamp || a.id));

  const filteredUpdates = sortedUpdates.filter(u => {
    if (filterType === 'key') return u.isKeyEvent;
    if (filterType === 'summary') return u.isSummary;
    return true;
  });

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#121212] leading-[1.1] mb-6 max-w-4xl">{article.headline}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">{(article.author || 'Y')[0]}</div>
              <span><span className="text-[#121212] font-bold underline decoration-[#ffe500] decoration-2 underline-offset-2">{article.author || 'Yanci Staff'}</span></span>
            </div>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-2">
              <FaClock className="text-gray-400" /> An fara {article.liveStartTime ? new Date(article.liveStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
            </span>
          </div>
        </div>
      </header>

      {/* Sticky Control Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
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
            {/* New Updates Badge */}
            {showNewBadge && newCount > 0 && (
              <button onClick={scrollToLatest} className="flex items-center gap-2 px-3 py-1.5 bg-[#ffe500] text-[#121212] rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-[#ffd000] transition-colors animate-bounce-in">
                <FaArrowDown className="w-3 h-3" /> {newCount} New Update{newCount > 1 ? 's' : ''}
              </button>
            )}
            <button onClick={() => setIsAutoRefreshing(!isAutoRefreshing)} className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${isAutoRefreshing ? 'bg-[#e3f2fd] text-[#0562c1] border-[#0562c1]/20' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
              <FaRotate className={`w-3 h-3 ${isAutoRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isAutoRefreshing ? 'Auto-refresh ON' : 'OFF'}</span>
            </button>
            <button onClick={handleNativeShare} className="p-2 text-gray-400 hover:text-[#121212] transition-colors"><FaShareNodes className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <main className="max-w-[1240px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Feed Column */}
          <div className="lg:col-span-8 relative" ref={feedRef}>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              <FaFilter className="w-3 h-3 text-gray-400 shrink-0" />
              {[
                { key: 'all', label: 'All Updates', count: sortedUpdates.length },
                { key: 'key', label: 'Key Events', count: keyEvents.length },
                { key: 'summary', label: 'Summaries', count: sortedUpdates.filter(u => u.isSummary).length },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    filterType === f.key
                      ? 'bg-[#0f3036] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Timeline Line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gray-100 hidden md:block"></div>

            {/* Pinned Post */}
            {pinnedPost && filterType === 'all' && (
              <div className="mb-12 md:pl-8 relative">
                <div className="bg-[#fff0f0] border-l-[6px] border-[#cc0000] p-6 md:p-8 rounded-r-lg shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#cc0000] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 flex items-center gap-1 w-fit rounded-sm">
                      <FaThumbtack className="w-2.5 h-2.5 -rotate-45" /> Daka
                    </span>
                    <span className="text-xs font-bold text-[#cc0000]">{pinnedPost.time}</span>
                  </div>
                  {pinnedPost.title && <h2 className="text-2xl md:text-3xl font-serif font-black text-[#121212] mb-4 leading-tight">{pinnedPost.title}</h2>}
                  {pinnedPost.image && <figure className="mb-6 rounded overflow-hidden"><img src={pinnedPost.image} alt={pinnedPost.title} className="w-full h-auto object-cover" /></figure>}
                  {pinnedPost.images && pinnedPost.images.length > 0 && (
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                      {pinnedPost.images.map((img, i) => <img key={i} src={img} alt="" className="w-32 h-32 object-cover rounded-lg shrink-0" />)}
                    </div>
                  )}
                  <div className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed">
                    <EmbedRenderer content={pinnedPost.content} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#cc0000]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daga {pinnedPost.author || 'Edita'}</span>
                    <div className="flex gap-3">
                      <button onClick={shareFacebook} className="text-gray-400 hover:text-[#1877F2]"><FaFacebook /></button>
                      <button onClick={() => shareTwitter(pinnedPost.title)} className="text-gray-400 hover:text-[#1DA1F2]"><FaTwitter /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Updates Feed */}
            <div>
              {filteredUpdates.map((event) => (
                <article key={event.id} id={event.id} className="relative md:pl-8 pb-12 mb-12 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0 group">
                  <div className={`hidden md:flex absolute left-0 top-[24px] w-4 h-4 rounded-full border-[3px] border-white z-10 shadow-sm transition-transform group-hover:scale-110 ${event.isKeyEvent ? 'bg-[#cc0000] ring-4 ring-[#cc0000]/10' : event.isSummary ? 'bg-[#0562c1]' : 'bg-[#121212]'}`}></div>
                  <div className="md:hidden flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${event.isKeyEvent ? 'text-[#cc0000]' : 'text-gray-500'}`}>{event.time}</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                  <div>
                    <header className="flex items-start justify-between mb-4">
                      <div className="flex flex-col">
                        <time className="hidden md:block text-xs font-extrabold text-[#cc0000] uppercase tracking-widest mb-1.5">{event.time}</time>
                        <div className="flex flex-wrap gap-2">
                          {event.isKeyEvent && <span className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000] border border-[#cc0000] px-2 py-0.5 rounded-sm bg-[#fff0f0]">Muhimmin Abu</span>}
                          {event.isSummary && <span className="text-[10px] font-bold uppercase tracking-widest text-[#0562c1] border border-[#0562c1] bg-[#e3f2fd] px-2 py-0.5 rounded-sm">Takaitawa</span>}
                        </div>
                      </div>
                    </header>
                    {event.title && <h3 className="text-xl md:text-2xl font-serif font-black text-[#121212] mb-3 leading-tight hover:text-[#cc0000] transition-colors cursor-pointer">{event.title}</h3>}
                    {event.image && <figure className="mb-5 rounded overflow-hidden bg-gray-100"><img src={event.image} alt={event.title} className="w-full h-auto object-cover" /><figcaption className="text-[10px] text-gray-500 mt-2 px-1 flex items-center gap-1 uppercase tracking-wider font-medium"><FaLocationDot className="w-3 h-3 text-gray-400" /> Kai tsaye daga wajen</figcaption></figure>}
                    {event.images && event.images.length > 0 && (
                      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                        {event.images.map((img, i) => <img key={i} src={img} alt="" className="w-32 md:w-48 h-32 md:h-48 object-cover rounded-lg shrink-0 border" />)}
                      </div>
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
                        <button onClick={handleNativeShare} className="text-gray-400 hover:text-[#121212] text-xs font-bold flex items-center gap-1"><FaShareNodes /> Raba</button>
                      </div>
                    </footer>
                  </div>
                </article>
              ))}

              {filteredUpdates.length === 0 && (
                <div className="text-center py-20">
                  <FaMagnifyingGlass className="mx-auto text-3xl text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">No updates match this filter.</p>
                  <button onClick={() => setFilterType('all')} className="mt-4 text-[#c59d5f] font-bold text-sm hover:underline">Show all updates</button>
                </div>
              )}
            </div>

            {/* Jump to Top */}
            <button onClick={scrollToLatest} className="w-full py-5 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-[#cc0000] hover:text-[#cc0000] transition-all mt-16 rounded-lg flex items-center justify-center gap-2">
              <FaArrowUp /> Back to Top
            </button>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-20 space-y-8">
              {keyEvents.length > 0 && (
                <div className="bg-white border text-[#121212] rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#121212] px-5 py-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><FaStar className="text-[#ffe500]" /> Muhimman Abubuwa</h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {keyEvents.map(event => (
                      <a key={event.id} href={`#${event.id}`} className="block p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-bold text-[#cc0000]">{event.time}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{event.author || 'Edita'}</span>
                        </div>
                        <p className="font-serif font-bold text-sm leading-snug group-hover:underline decoration-[#cc0000] underline-offset-2">{event.title || 'Babban Ci Gaba'}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

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
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><FaLocationDot /> Taswira Kai Tsaye</h3>
                  <div className="aspect-square rounded overflow-hidden border border-gray-200">
                    <iframe src={article.mapEmbedUrl} className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
                  </div>
                </div>
              )}

              {article.keyFigures && (
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Manyan Mutane</h3>
                  <div className="space-y-4">
                    {article.keyFigures.split('\n').map((line, idx) => {
                      const parts = line.split('-');
                      const initial = parts[0]?.trim()?.charAt(0) || '?';
                      if (!parts[0]) return null;
                      return (
                        <div key={idx} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-full bg-[#f6f6f6] border border-gray-200 flex items-center justify-center font-serif font-bold text-[#121212] group-hover:bg-[#ffe500] transition-colors">{initial}</div>
                          <div>
                            <p className="font-bold text-xs text-gray-900">{parts[0]?.trim()}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{parts[1]?.trim()}</p>
                          </div>
                        </div>
                      );
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
