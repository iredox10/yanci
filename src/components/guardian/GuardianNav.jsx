import { useState, useEffect } from 'react';
import { FaChevronDown, FaBars, FaMagnifyingGlass, FaUser, FaXmark, FaGlobe } from 'react-icons/fa6';

const GuardianNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDate = new Date().toLocaleDateString('ha-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <header className="font-sans relative z-50">
        {/* 1. Top Utility Bar (Darkest) */}
        <div className="bg-[#0a2125] text-gray-300 text-xs py-2 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-yanci-accent font-bold">{currentDate}</span>
              <span className="hidden md:inline text-gray-500">|</span>
              <span className="hidden md:flex items-center gap-1 hover:text-white cursor-pointer">
                <FaGlobe className="w-3 h-3" /> International
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Ayyuka</a>
              <a href="#" className="hover:text-white transition-colors">Tuntube Mu</a>
              <button className="flex items-center gap-1 font-bold text-white hover:text-yanci-accent transition-colors">
                <FaUser className="w-3 h-3" /> Shiga
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Brand Header (Primary Color) */}
        <div className={`bg-[#0f3036] text-white transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6 md:py-8'}`}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between">

            {/* Logo Area */}
            <div className="flex items-center gap-6">
              <a href="/" className="group flex items-center gap-3">
                <img src="/pwa-192x192.png" alt="Yanci Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                <h1 className={`font-serif font-black tracking-tighter leading-none transition-all duration-300 ${isScrolled ? 'text-3xl' : 'text-4xl md:text-6xl'}`}>
                  Yanci<span className="text-yanci-accent">.</span>
                </h1>
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              <button className="hidden md:flex bg-yanci-accent text-[#0f3036] px-5 py-2 rounded-full font-bold text-sm hover:bg-white transition-all items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Tallafa mana <FaChevronDown className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-yanci-accent">
                  <FaMagnifyingGlass className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 font-bold"
                >
                  <div className="flex flex-col gap-1.5 items-end">
                    <span className="w-6 h-0.5 bg-white"></span>
                    <span className="w-4 h-0.5 bg-white"></span>
                    <span className="w-6 h-0.5 bg-white"></span>
                  </div>
                  <span className="hidden md:inline text-sm uppercase tracking-wider">Rukuni</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sticky Navigation Bar (Accent/Contrast) */}
        <div className={`bg-[#1a454c] border-y border-[#2a5d66] sticky top-0 z-40 shadow-md transition-transform duration-300 ${isScrolled ? 'translate-y-0' : 'translate-y-0'}`}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <nav className="flex items-center justify-between h-12 overflow-x-auto no-scrollbar">
              <ul className="flex items-center gap-1 md:gap-6 text-sm font-bold text-gray-200 whitespace-nowrap">
                {[
                  { label: 'Labarai', path: '/labarai' },
                  { label: 'Siyasa', path: '/siyasa' },
                  { label: 'Kasuwanci', path: '/kasuwanci' },
                  { label: 'Wasanni', path: '/wasanni' },
                  { label: 'Fasaha', path: '/fasaha' },
                  { label: 'Ra\'ayi', path: '/raayi' },
                  { label: 'Al\'adu', path: '/aladu' },
                  { label: 'Bidiyo', path: '/bidiyo' }
                ].map((item, idx) => (
                  <li key={item.label}>
                    <a
                      href={item.path}
                      className={`block px-3 py-3 hover:text-white hover:bg-[#0f3036] transition-colors border-b-2 border-transparent hover:border-yanci-accent ${idx === 0 ? 'text-white border-yanci-accent bg-[#0f3036]' : ''}`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-yanci-accent pl-4 border-l border-[#2a5d66]">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                KAI TSAYE
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile/Mega Menu Overlay */}
      <div className={`fixed inset-0 bg-[#0f3036]/98 backdrop-blur-xl z-[60] transition-all duration-500 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
        <div className="max-w-[1400px] mx-auto px-6 py-8 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
            <h2 className="font-serif font-black text-3xl text-white">Yanci<span className="text-yanci-accent">.</span></h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
            >
              <FaXmark className="w-8 h-8 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-12 text-white">
            <div className="space-y-8">
              <h3 className="text-yanci-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Labarai</h3>
              <ul className="space-y-4 text-xl font-serif font-bold">
                {[
                  { label: 'Najeriya', path: '/labarai' },
                  { label: 'Afirka', path: '/labarai' },
                  { label: 'Duniya', path: '/labarai' },
                  { label: 'Siyasa', path: '/siyasa' },
                  { label: 'Tsaro', path: '/labarai' },
                  { label: 'Lafiya', path: '/labarai' }
                ].map((item) => (
                  <li key={item.label}><a href={item.path} className="hover:text-yanci-accent transition-colors block hover:translate-x-2 duration-300">{item.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="text-[#90cfff] font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Wasanni</h3>
              <ul className="space-y-4 text-xl font-serif font-bold">
                {[
                  { label: 'Kwallon Kafa', path: '/wasanni' },
                  { label: 'NPFL', path: '/wasanni' },
                  { label: 'Premier League', path: '/wasanni' },
                  { label: 'La Liga', path: '/wasanni' },
                  { label: 'Champions League', path: '/wasanni' }
                ].map((item) => (
                  <li key={item.label}><a href={item.path} className="hover:text-[#90cfff] transition-colors block hover:translate-x-2 duration-300">{item.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="text-[#eacca0] font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Al'adu & Rayuwa</h3>
              <ul className="space-y-4 text-xl font-serif font-bold">
                {[
                  { label: 'Fina-finai', path: '/aladu' },
                  { label: 'Waka', path: '/aladu' },
                  { label: 'Abinci', path: '/aladu' },
                  { label: 'Sutura', path: '/aladu' },
                  { label: 'Tarihi', path: '/aladu' }
                ].map((item) => (
                  <li key={item.label}><a href={item.path} className="hover:text-[#eacca0] transition-colors block hover:translate-x-2 duration-300">{item.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0a2125] p-6 rounded-lg border border-white/5">
              <h3 className="text-white font-bold mb-4">Biyan Kuɗi</h3>
              <p className="text-gray-400 text-sm mb-6">Samun labarai masu inganci yana bukatar tallafi. Taimaka mana mu ci gaba da aiki.</p>
              <button className="w-full bg-yanci-accent text-[#0f3036] py-3 rounded font-bold hover:bg-white transition-colors">
                Bada Tallafi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuardianNav;
