import { useState, useEffect } from 'react';
import { LuChevronDown, LuMenu, LuSearch, LuUser, LuX } from 'react-icons/lu';

const GuardianNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f3036] shadow-lg py-2' : 'bg-[#0f3036] py-4'} text-white font-sans border-b-4 border-[#c59d5f]`}>
        {/* Top Utility Bar - Hidden on Scroll */}
        <div className={`max-w-[1400px] mx-auto px-6 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'} hidden md:block`}>
          <div className="flex justify-between items-center text-xs font-medium tracking-wider text-gray-300 border-b border-white/10 pb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Asabar, 29 ga Nuwamba, 2025
            </span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-yanci-accent transition-colors">Bugun Yau</a>
              <a href="#" className="hover:text-yanci-accent transition-colors">Ayyuka</a>
              <a href="#" className="hover:text-yanci-accent transition-colors">Tuntube Mu</a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 text-sm font-bold hover:text-yanci-accent transition-colors group"
            >
              <div className="p-1 border border-white/20 rounded group-hover:border-yanci-accent transition-colors">
                <LuMenu className="w-6 h-6" />
              </div>
              <span className="hidden lg:inline">Rukuni</span>
            </button>
            
            <a href="/" className="flex flex-col group">
              <div className="font-serif font-black text-4xl tracking-tighter leading-none text-white group-hover:text-gray-100 transition-colors">
                Yanci<span className="text-yanci-accent">.</span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className={`hidden lg:flex items-center gap-8 text-sm font-bold tracking-wide transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute'}`}>
            {['Labarai', 'Ra\'ayi', 'Wasanni', 'Al\'adu', 'Rayuwa'].map((item) => (
              <a key={item} href="#" className="hover:text-yanci-accent transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-yanci-accent after:transition-all hover:after:w-full">
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 text-sm font-bold">
            <button className="hidden md:flex bg-yanci-accent text-yanci-primary px-6 py-2.5 rounded-sm hover:bg-white transition-all items-center gap-2 font-serif shadow-lg shadow-yanci-accent/20 hover:shadow-yanci-accent/40 transform hover:-translate-y-0.5">
              Tallafa mana <LuChevronDown className="w-4 h-4" />
            </button>
            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            <button className="flex items-center gap-2 hover:text-yanci-accent transition-colors group">
              <LuUser className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
              <span className="hidden md:inline">Shiga</span>
            </button>
            <button className="hover:text-yanci-accent transition-colors p-2 hover:bg-white/5 rounded-full" aria-label="Bincike">
              <LuSearch className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed nav */}
      <div className={`${isScrolled ? 'h-20' : 'h-32'} transition-all duration-300 hidden md:block`}></div>
      <div className="h-20 md:hidden"></div>

      {/* Mobile/Mega Menu Overlay */}
      <div className={`fixed inset-0 bg-yanci-primary/95 backdrop-blur-sm z-40 transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-[1400px] mx-auto px-6 py-24 h-full overflow-y-auto">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <LuX className="w-8 h-8 text-white" />
          </button>
          
          <div className="grid md:grid-cols-4 gap-12 text-white">
            <div className="space-y-6">
              <h3 className="text-yanci-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-4">Rukuni</h3>
              <ul className="space-y-4 text-2xl font-serif font-bold">
                {['Labarai', 'Ra\'ayi', 'Wasanni', 'Al\'adu', 'Rayuwa', 'Kari'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-yanci-accent transition-colors block hover:translate-x-2 duration-300">{item}</a></li>
                ))}
              </ul>
            </div>
            {/* Add more menu columns here if needed */}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuardianNav;
