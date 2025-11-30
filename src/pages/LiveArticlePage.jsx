import { useParams } from 'react-router-dom';
import { LuClock, LuShare2, LuBookmark, LuFacebook, LuTwitter, LuLinkedin, LuPrinter, LuRadio, LuRefreshCw, LuMapPin, LuArrowDown, LuTriangleAlert, LuCirclePlay, LuFilter } from 'react-icons/lu';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { GUARDIAN_DATA } from '../data/guardianData';

const LiveArticlePage = () => {
  const { id } = useParams();
  const article = GUARDIAN_DATA.headlines.find(h => h.id.toString() === id) || GUARDIAN_DATA.headlines[2];

  const keyEvents = [
    { time: "10:45", title: "Ministan Sufuri ya isa tashar Idu", id: "event-1" },
    { time: "09:55", title: "Shugaban NRC ya yi jawabi", id: "event-4" },
  ];

  const timeline = [
    {
      id: "event-1",
      time: "10:45 AM",
      relativeTime: "Yanzu",
      title: "Ministan Sufuri ya isa tashar Idu",
      content: "Ministan Sufuri ya isa tashar jirgin kasa ta Idu domin kaddamar da gwajin farko. Ya samu tarba daga manyan jami'an hukumar jiragen kasa ta Najeriya (NRC). An shimfida jajayen darduma domin tarbar sa, yayin da jami'an tsaro ke kula da komai.",
      image: "https://images.unsplash.com/photo-1517093157656-b9ecc94e484d?w=800&auto=format&fit=crop",
      author: "Ibrahim Sani",
      role: "Wakili na Musamman",
      avatar: "IS",
      isKey: true,
      type: "standard"
    },
    {
      id: "event-2",
      time: "10:30 AM",
      relativeTime: "Minti 15 da suka wuce",
      title: "Fasinjoji sun fara shiga jirgi",
      content: "Fasinjojin farko da aka gayyata domin gwajin sun fara shiga jirgin. Ana gudanar da binciken tsaro mai tsauri kafin shiga. Wani fasinja, Malam Audu, ya ce: 'Wannan abin a yaba ne kwarai da gaske.'",
      author: "Amina Yusuf",
      role: "Editan Labarai",
      avatar: "AY",
      isKey: false,
      type: "quote"
    },
    {
      id: "event-3",
      time: "10:15 AM",
      relativeTime: "Minti 30 da suka wuce",
      title: "Jami'an tsaro sun mamaye tashar",
      content: "Jami'an tsaro na hadin gwiwa sun mamaye tashar jirgin kasa ta Idu da Rigasa domin tabbatar da tsaro yayin gwajin. An ga motocin sojoji da na 'yan sanda a harabar tashar.",
      author: "Ibrahim Sani",
      role: "Wakili na Musamman",
      avatar: "IS",
      isKey: false,
      type: "standard"
    },
    {
      id: "event-4",
      time: "09:55 AM",
      relativeTime: "Awa 1 da ta wuce",
      title: "Shugaban NRC ya yi jawabi",
      content: "Shugaban Hukumar Jiragen Kasa ta Najeriya (NRC) ya yi jawabi ga manema labarai, inda ya bayyana cewa wannan sabon jirgi zai rage lokacin tafiya da kashi 40%. Ya kuma kara da cewa an sanya na'urorin tsaro na zamani a cikin jirgin.",
      author: "Amina Yusuf",
      role: "Editan Labarai",
      avatar: "AY",
      isKey: true,
      type: "standard"
    }
  ];

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
              <LuRefreshCw className="w-3 h-3" /> Sabuntawa ta atomatik
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
                <span className="flex items-center gap-1"><LuClock className="w-4 h-4" /> An fara: 09:00 AM</span>
              </div>
            </header>

            {/* Pinned Summary */}
            <div className="bg-[#fbf8f3] border-l-4 border-[#8a2c2c] p-6 shadow-sm mb-10 relative rounded-r-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#8a2c2c] text-white p-1.5 rounded-full">
                  <LuTriangleAlert className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-[#8a2c2c] uppercase tracking-widest text-sm">Muhimman Abubuwa</h3>
              </div>
              <ul className="space-y-4">
                {keyEvents.map((event, idx) => (
                  <li key={idx} className="flex items-start gap-4 group cursor-pointer hover:bg-white p-3 rounded-sm transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                    <span className="font-mono font-bold text-[#0f3036] text-sm whitespace-nowrap pt-1">{event.time}</span>
                    <div className="flex-1">
                      <span className="text-[#1c1917] font-serif font-bold text-lg leading-tight group-hover:text-[#8a2c2c] transition-colors block mb-1">{event.title}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Je zuwa labarin <LuArrowDown className="w-3 h-3" />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

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
                  <LuFilter className="w-3 h-3" /> Zaba
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0f3036] text-white rounded-full text-xs font-bold hover:bg-[#1c478a] transition-colors shadow-sm">
                  <LuRefreshCw className="w-3 h-3" /> Sabunta
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0 relative border-l-2 border-gray-200 ml-4 md:ml-6">
              {timeline.map((event, idx) => (
                <article key={event.id} id={event.id} className={`relative pl-8 md:pl-12 pb-12 last:pb-0 group ${event.isKey ? 'is-key-event' : ''}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-[#f4f1ea] ${event.isKey ? 'bg-[#8a2c2c] w-5 h-5 left-[-11px]' : 'bg-gray-400'} group-hover:scale-125 transition-transform z-10`}></div>
                  
                  {/* Time Stamp */}
                  <div className="flex items-center gap-3 mb-3">
                    <time className={`font-bold text-sm ${event.isKey ? 'text-[#8a2c2c]' : 'text-gray-500'}`}>{event.time}</time>
                    <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-100 rounded-full">{event.relativeTime}</span>
                    {event.isKey && <span className="text-[10px] font-bold uppercase tracking-widest text-[#c59d5f] border border-[#c59d5f] px-2 py-0.5 rounded-sm">Muhimmi</span>}
                  </div>

                  {/* Content Card */}
                  <div className={`bg-white p-6 rounded-sm shadow-sm border ${event.isKey ? 'border-t-4 border-t-[#8a2c2c] border-x-gray-100 border-b-gray-100' : 'border-gray-100'} hover:shadow-md transition-shadow`}>
                    
                    {/* Author Info */}
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${event.author === 'Ibrahim Sani' ? 'bg-[#0f3036]' : 'bg-[#c59d5f]'}`}>
                        {event.avatar}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{event.author}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{event.role}</span>
                    </div>

                    <h3 className="font-serif font-bold text-xl md:text-2xl text-[#1c1917] mb-3 leading-tight">
                      {event.title}
                    </h3>

                    {event.image && (
                      <figure className="mb-4">
                        <img src={event.image} alt={event.title} className="w-full h-auto rounded-sm" />
                        <figcaption className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <LuMapPin className="w-3 h-3" /> Tashar Idu, Abuja
                        </figcaption>
                      </figure>
                    )}

                    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-body">
                      <p>{event.content}</p>
                    </div>

                    {/* Social Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#3b5998] transition-colors">
                          <LuFacebook className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors">
                          <LuTwitter className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-xs font-bold text-[#0f3036] hover:text-[#c59d5f] transition-colors flex items-center gap-1">
                        <LuShare2 className="w-3 h-3" /> Raba
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="w-full py-4 bg-white border border-gray-200 text-[#0f3036] font-bold text-sm uppercase tracking-widest hover:bg-[#0f3036] hover:text-white transition-colors mt-8 rounded-sm shadow-sm">
              Loda Karin Labarai
            </button>

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Live Video Placeholder */}
            <div className="bg-[#1c1917] text-white rounded-sm overflow-hidden shadow-lg sticky top-20">
              <div className="bg-[#8a2c2c] px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <LuCirclePlay className="w-4 h-4" /> Bidiyo Kai Tsaye
                </span>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </div>
              <div className="aspect-video bg-gray-800 relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform bg-black/30 backdrop-blur-sm">
                    <LuCirclePlay className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-bold text-sm text-white shadow-black drop-shadow-md">Tashar Idu: Ana ci gaba da gwajin jirgi</p>
                </div>
              </div>
            </div>

            {/* Key Figures */}
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

            {/* Map Placeholder */}
            <div className="bg-[#fbf8f3] border border-[#c59d5f]/20 p-6 rounded-sm">
              <h3 className="font-bold text-[#c59d5f] uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <LuMapPin className="w-4 h-4" /> Taswira
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

      </main>

      <GuardianFooter />
    </div>
  );
};

export default LiveArticlePage;
