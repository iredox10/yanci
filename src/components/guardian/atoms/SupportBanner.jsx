import { FaHeart } from 'react-icons/fa6';

const SupportBanner = () => {
  return (
    <div className="my-16 p-8 md:p-12 bg-[#0f3036] rounded-3xl text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c59d5f]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
      
      <div className="relative z-10 max-w-2xl">
        <div className="w-12 h-12 bg-[#c59d5f] rounded-xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
          <FaHeart className="text-white text-xl" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif font-black mb-4 leading-tight">
          Taimaka wa aikin jarida mai zaman kansa a Arewa.
        </h2>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Yanci tana kawo muku rahotanni ingantattu cikin harshen Hausa. Tallafin ku zai taimaka mana mu ci gaba da fadin gaskiya ba tare da tsoro ba.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-4 bg-[#c59d5f] text-[#0f3036] font-bold rounded-full hover:bg-white transition-all shadow-xl">
            Tallafa Mana Yanzu
          </button>
          <button className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/10 transition-all">
            Karin Bayani
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportBanner;
