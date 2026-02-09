import { PILLARS } from '../../data/guardianData';
import { FaQuoteLeft } from 'react-icons/fa6';

const OpinionCard = ({ data, featured = false }) => {
  return (
    <article className={`group cursor-pointer relative overflow-hidden transition-all duration-500 ${
      featured 
        ? 'bg-gradient-to-br from-[#fdf6ed] to-[#f8f0e5] rounded-2xl p-8 h-full flex flex-col' 
        : 'bg-white border border-gray-100 p-6 rounded-xl h-full flex flex-col hover:shadow-xl hover:border-[#e05e00]/20'
    }`}>
      {/* Decorative Background Element */}
      <div className={`absolute top-0 right-0 bg-[#e05e00]/5 rounded-bl-full transition-transform group-hover:scale-150 duration-700 ${
        featured ? 'w-32 h-32 -mr-8 -mt-8' : 'w-24 h-24 -mr-4 -mt-4'
      }`} />
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-[#e05e00] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            Namijin Ra'ayi
          </span>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`flex items-center gap-4 ${featured ? 'mb-8' : 'mb-6'}`}>
          <div className="relative">
            <div className={`rounded-full overflow-hidden border-2 border-[#e05e00] p-0.5 shadow-lg ${
              featured ? 'w-16 h-16' : 'w-14 h-14'
            }`}>
              {data.image ? (
                <img 
                  src={data.image} 
                  alt={data.author} 
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0f3036] to-[#1a454c] text-white flex items-center justify-center font-serif text-2xl font-bold rounded-full">
                  {data.author[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#e05e00] text-white rounded-full p-1.5 shadow-lg">
              <FaQuoteLeft className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#e05e00] mb-1">Ra'ayi</div>
            <div className={`font-serif font-bold text-[#1c1917] leading-none group-hover:text-[#e05e00] transition-colors ${
              featured ? 'text-xl' : 'text-lg'
            }`}>
              {data.author}
            </div>
            {featured && (
              <div className="text-xs text-gray-500 mt-1">Marubuci & Masani</div>
            )}
          </div>
        </div>

        <h3 className={`font-serif font-bold text-[#1c1917] leading-tight mb-4 group-hover:text-[#e05e00] transition-colors flex-1 ${
          featured ? 'text-3xl md:text-4xl' : 'text-xl'
        }`}>
          <span className="bg-gradient-to-r from-[#e05e00]/0 to-[#e05e00]/0 bg-[length:0%_3px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_3px] transition-all duration-500 pb-1">
            {data.headline}
          </span>
        </h3>

        {data.quote && (
          <div className="relative pl-4 border-l-2 border-[#e05e00]/30 mt-auto">
            <p className={`font-serif text-gray-500 leading-relaxed italic line-clamp-3 ${
              featured ? 'text-base' : 'text-sm'
            }`}>
              "{data.quote}"
            </p>
          </div>
        )}

        {featured && (
          <div className="mt-6 pt-6 border-t border-[#e05e00]/10 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>5 min read</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Yau</span>
            </div>
            <button className="px-4 py-2 bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#bd5318] transition-colors">
              Karanta
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default OpinionCard;
