import { useEffect } from 'react';
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


  if (!article) return <div>Loading...</div>;

  const sortedUpdates = (article.liveUpdates || []).sort((a, b) => new Date(b.timestamp || b.id) - new Date(a.timestamp || a.id));
  const timeline = sortedUpdates;
  const keyEvents = sortedUpdates.filter(u => u.isKeyEvent);
  const pinnedPost = sortedUpdates.find(u => u.isPinned);

  return (
    <div className="bg-[#f4f1ea] min-h-screen font-sans text-[#1c1917] selection:bg-[#c59d5f] selection:text-[#0f3036]">
      <GuardianNav />

      {/* Sticky Live Header */}
      <div className="sticky top-0 z-40 bg-[#8a2c2c] text-white shadow-md border-b border-[#631a1a]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="font-bold uppercase tracking-widest text-xs md:text-sm">Kai Tsaye: Gwajin Jirgin Kasa</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button className="hidden md:flex items-center gap-1 hover:text-gray-200 transition-colors">
              <FaRotate className="w-3 h-3" /> Sabuntawa ta atomatik
            </button>
            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">Sabuwar wallafa: Yanzu</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Column */}
          <div className="lg:col-span-8">

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8a2c2c] mb-3">
                <span className="bg-[#8a2c2c] text-white px-2 py-1 rounded-sm">Labarai</span>
                <span className="text-gray-400">/</span>
                <span>Sufuri</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight text-[#0f3036] mb-4">
                {article.headline}
              </h1>
              <p className="text-xl font-serif text-gray-600 leading-relaxed border-l-4 border-[#c59d5f] pl-4 mb-6">
                Muna kawo muku labarai kai tsaye daga tashar Idu yayin da ake kaddamar da sabon tsarin jirgin kasa mai sauri wanda zai hada Abuja da Kaduna.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-y border-gray-200 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#0f3036] text-white flex items-center justify-center text-xs font-bold border-2 border-[#f4f1ea]">IS</div>
                    <div className="w-8 h-8 rounded-full bg-[#c59d5f] text-[#0f3036] flex items-center justify-center text-xs font-bold border-2 border-[#f4f1ea]">AY</div>
                  </div>
                  <span className="font-bold text-[#0f3036]">Ibrahim Sani</span> da <span className="font-bold text-[#0f3036]">Amina Yusuf</span>
                </div>
                <span className="hidden md:inline text-gray-300">|</span>
                <span className="flex items-center gap-1"><FaClock className="w-4 h-4" /> An fara: 09:00 AM</span>
              </div>
            </header>

            {/* Pinned Post */}
            {pinnedPost && (
              <div className="bg-white border-4 border-[#0f3036] p-6 shadow-md mb-8 relative">
                <div className="absolute top-0 right-0 bg-[#0f3036] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <FaThumbtack className="w-3 h-3 rotate-45" /> Pinned
                </div>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <span className="text-red-600 font-bold text-xs">{pinnedPost.time}</span>
                  <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">{pinnedPost.author}</span>
                </div>
                {pinnedPost.title && <h2 className="text-2xl font-serif font-black text-[#0f3036] mb-3 leading-tight">{pinnedPost.title}</h2>}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif">
                  <p className="whitespace-pre-wrap">{pinnedPost.content}</p>
                </div>
              </div>
            )}

            {/* Key Events Summary */}
            {keyEvents.length > 0 && (
              <div className="bg-[#fbf8f3] border-l-4 border-[#8a2c2c] p-6 shadow-sm mb-10 relative rounded-r-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#8a2c2c] text-white p-1.5 rounded-full">
                    <FaTriangleExclamation className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-[#8a2c2c] uppercase tracking-widest text-sm">Muhimman Abubuwa</h3>
                </div>
                <ul className="space-y-4">
                  {keyEvents.map((event) => (
                    <li key={event.id} className="flex items-start gap-4 group cursor-pointer hover:bg-white p-3 rounded-sm transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                      <span className="font-mono font-bold text-[#0f3036] text-sm whitespace-nowrap pt-1">{event.time}</span>
                      <div className="flex-1">
                        <a href={`#${event.id}`} className="text-[#1c1917] font-serif font-bold text-lg leading-tight group-hover:text-[#8a2c2c] transition-colors block mb-1">
                          {event.title || 'Update'}
                        </a>
                        <span className="text-xs text-gray-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Je zuwa labarin <FaArrowDown className="w-3 h-3" />
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Live Feed Controls */}
            <div className="sticky top-[60px] z-30 bg-[#f4f1ea]/95 backdrop-blur-sm py-4 mb-8 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-[#f4f1ea]"></span>
                </span>
                <h2 className="font-black text-xl text-[#0f3036]">Labarai Kai Tsaye</h2>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-600 hover:border-[#0f3036] hover:text-[#0f3036] transition-colors">
                  <FaFilter className="w-3 h-3" /> Zaba
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0f3036] text-white rounded-full text-xs font-bold hover:bg-[#1c478a] transition-colors shadow-sm">
                  <FaRotate className="w-3 h-3" /> Sabunta
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0 relative border-l-2 border-gray-200 ml-4 md:ml-6">
              {timeline.map((event) => (
                <article key={event.id} id={event.id} className={`relative pl-8 md:pl-12 pb-12 last:pb-0 group ${event.isKeyEvent ? 'is-key-event ' : ''}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-[#f4f1ea] ${event.isKeyEvent ? 'bg-[#8a2c2c] w-5 h-5 left-[-11px]' : event.isSummary ? 'bg-blue-600' : 'bg-gray-400'} group-hover:scale-125 transition-transform z-10`}></div>

                  {/* Time Stamp */}
                  <div className="flex items-center gap-3 mb-3">
                    <time className={`font-bold text-sm ${event.isKeyEvent ? 'text-[#8a2c2c]' : event.isSummary ? 'text-blue-800' : 'text-gray-500'}`}>{event.time}</time>
                    <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                      {/* Calculate relative time if needed, or just hide */}
                    </span>
                    {event.isKeyEvent && <span className="text-[10px] font-bold uppercase tracking-widest text-[#c59d5f] border border-[#c59d5f] px-2 py-0.5 rounded-sm">Muhimmi</span>}
                    {event.isSummary && <span className="text-[10px] font-bold uppercase tracking-widest text-blue-800 border-blue-800 bg-blue-100 px-2 py-0.5 rounded-sm">Summary</span>}
                    {event.isPinned && <span className="text-[10px] font-bold uppercase tracking-widest text-[#0f3036] border border-[#0f3036] px-2 py-0.5 rounded-sm flex items-center gap-1"><FaThumbtack className="w-2 h-2" /> Pinned</span>}
                  </div>

                  {/* Content Card */}
                  <div className={`p-6 rounded-sm shadow-sm border transition-shadow hover:shadow-md 
                    ${event.isKeyEvent ? 'bg-white border-t-4 border-t-[#8a2c2c] border-x-gray-100 border-b-gray-100' :
                      event.isSummary ? 'bg-blue-50 border-blue-100' :
                        'bg-white border-gray-100'}`}>

                    {/* Author Info */}
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#0f3036]`}>
                        {event.author ? event.author.charAt(0) : 'E'}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{event.author || 'Editor'}</span>
                    </div>

                    {event.title && (
                      <h3 className="font-serif font-bold text-xl md:text-2xl text-[#1c1917] mb-3 leading-tight">
                        {event.title}
                      </h3>
                    )}

                    {event.image && (
                      <figure className="mb-4">
                        <img src={event.image} alt={event.title} className="w-full h-auto rounded-sm" />
                        <figcaption className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <FaLocationDot className="w-3 h-3" /> Live Update
                        </figcaption>
                      </figure>
                    )}

                    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-body">
                      <EmbedRenderer content={event.content} />
                    </div>

                    {/* Social Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#3b5998] transition-colors">
                          <FaFacebook className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors">
                          <FaTwitter className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-xs font-bold text-[#0f3036] hover:text-[#c59d5f] transition-colors flex items-center gap-1">
                        <FaShareNodes className="w-3 h-3" /> Raba
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="w-full py-4 bg-white border border-gray-200 text-[#0f3036] font-bold text-sm uppercase tracking-widest hover:bg-[#0f3036] hover:text-white transition-colors mt-8 rounded-sm shadow-sm">
              Loda Karin Labarai
            </button>

          </div >

          {/* Sidebar Column */}
          < div className="lg:col-span-4" >
            <div className="sticky top-24 space-y-8">

              {/* Live Video Placeholder */}
              {article.videoUrl ? (
                <div className="bg-[#1c1917] text-white rounded-sm overflow-hidden shadow-lg">
                  <div className="bg-[#8a2c2c] px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <FaCirclePlay className="w-4 h-4" /> Bidiyo Kai Tsaye
                    </span>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  </div>
                  <div className="aspect-video bg-black relative">
                    <iframe
                      src={article.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1c1917] text-white rounded-sm overflow-hidden shadow-lg">
                  <div className="bg-[#8a2c2c] px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <FaCirclePlay className="w-4 h-4" /> Bidiyo Kai Tsaye
                    </span>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  </div>
                  <div className="aspect-video bg-gray-800 relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform bg-black/30 backdrop-blur-sm">
                        <FaCirclePlay className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-bold text-sm text-white shadow-black drop-shadow-md">{article.headline}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Figures */}
              {article.keyFigures ? (
                <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm">
                  <h3 className="font-bold text-[#0f3036] uppercase tracking-widest text-xs mb-4 border-b border-gray-100 pb-2">Masu Ruwa da Tsaki</h3>
                  <div className="space-y-4">
                    {article.keyFigures.split('\n').map((line, idx) => {
                      const parts = line.split('-');
                      const name = parts[0]?.trim();
                      const role = parts[1]?.trim();
                      if (!name) return null;
                      return (
                        <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                          <div className="w-12 h-12 rounded-full bg-[#0f3036] text-[#c59d5f] flex items-center justify-center font-bold text-sm">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1c1917] group-hover:text-[#c59d5f] transition-colors">{name}</p>
                            {role && <p className="text-xs text-gray-400">{role}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm">
                  <h3 className="font-bold text-[#0f3036] uppercase tracking-widest text-xs mb-4 border-b border-gray-100 pb-2">Masu Ruwa da Tsaki</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div>
                        <p className="font-bold text-sm text-[#1c1917] group-hover:text-[#c59d5f] transition-colors">Sa'idu Alkali</p>
                        <p className="text-xs text-gray-400">Ministan Sufuri</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div>
                        <p className="font-bold text-sm text-[#1c1917] group-hover:text-[#c59d5f] transition-colors">Fidet Okhiria</p>
                        <p className="text-xs text-gray-400">MD, NRC</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Placeholder */}
              <div className="bg-[#fbf8f3] border border-[#c59d5f]/20 p-6 rounded-sm">
                <h3 className="font-bold text-[#c59d5f] uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <FaLocationDot className="w-4 h-4" /> Taswira
                </h3>
                <div className="aspect-square bg-[#e5e0d8] rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-[#8a2c2c] rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[10px] font-bold rounded-sm shadow-sm">
                    Abuja - Kaduna Rail Line
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <GuardianFooter />
    </div>
  );
};

export default LiveArticlePage;
