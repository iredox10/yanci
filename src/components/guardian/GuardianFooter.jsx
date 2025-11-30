import { FaEnvelope, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const GuardianFooter = () => (
  <footer className="bg-[#0f3036] text-white pt-20 pb-10 mt-20 border-t-8 border-[#c59d5f] relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Brand Column */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="font-serif text-4xl font-black tracking-tighter mb-4">Yanci<span className="text-yanci-accent">.</span></h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-md">
              Jarida mai zaman kanta da ke ba da labarai a Hausa, bisa gudummawar masu karatu. Muna kare gaskiya da al'adunmu na Arewa.
            </p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-sm border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-yanci-accent text-sm uppercase tracking-widest mb-2">Kasance da mu</h4>
            <p className="text-xs text-gray-400 mb-4">Samu labarai masu zafi kai tsaye a akwatin imel naka.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Adireshin imel" 
                className="bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-sm w-full focus:outline-none focus:border-yanci-accent transition-colors placeholder-gray-500"
              />
              <button className="bg-yanci-accent text-yanci-primary px-4 py-2 rounded-sm hover:bg-white transition-colors">
                <FaEnvelope className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yanci-accent hover:text-yanci-primary transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        
        {/* Links Columns */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-yanci-accent border-b border-white/10 pb-3 mb-6 uppercase tracking-wider text-xs">Labarai</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['Najeriya', 'Afirka', 'Duniya', 'Fasaha', 'Siyasa', 'Tsaro'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white hover:translate-x-1 transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-yanci-accent border-b border-white/10 pb-3 mb-6 uppercase tracking-wider text-xs">Ra'ayi</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['Sharhin Edita', 'Masu Kololuwa', 'Wasikun Masu Karatu', 'Tattaunawa', 'Bincike'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white hover:translate-x-1 transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-yanci-accent border-b border-white/10 pb-3 mb-6 uppercase tracking-wider text-xs">Al'adu</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['Kiɗa', 'Fina-finai', 'Adabi', 'Tarihi', 'Abinci', 'Sutura'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white hover:translate-x-1 transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-yanci-accent border-b border-white/10 pb-3 mb-6 uppercase tracking-wider text-xs">Kamfani</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['Game da Mu', 'Tuntube Mu', 'Ayyuka', 'Talla', 'Dokoki'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white hover:translate-x-1 transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium tracking-wide">
        <p>&copy; 2025 Yanci Media Ltd. An kiyaye haƙƙin mallaka.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Dokoki</a>
          <a href="#" className="hover:text-white transition-colors">Tsare Sirri</a>
          <a href="#" className="hover:text-white transition-colors">Taswirar Shafin</a>
        </div>
      </div>
    </div>
  </footer>
);

export default GuardianFooter;
