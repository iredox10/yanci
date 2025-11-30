import { PILLARS } from '../../data/guardianData';
import { FaQuoteLeft } from 'react-icons/fa6';

const OpinionCard = ({ data }) => {
  return (
    <article className="flex flex-col h-full bg-white border border-gray-100 p-8 group cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden rounded-sm">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-yanci-accent/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yanci-accent p-0.5">
              {data.image ? (
                <img src={data.image} alt={data.author} className="w-full h-full object-cover rounded-full" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-yanci-primary text-white flex items-center justify-center font-serif text-xl font-bold rounded-full">
                  {data.author[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yanci-accent text-yanci-primary rounded-full p-1">
              <LuQuote className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-yanci-accent mb-1">Ra'ayi</div>
            <div className="font-serif font-bold text-lg text-yanci-dark leading-none">
              {data.author}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-serif font-bold text-yanci-dark leading-tight mb-4 group-hover:text-yanci-primary transition-colors flex-1">
          <span className="bg-gradient-to-r from-yanci-accent/0 to-yanci-accent/0 bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-500 pb-1">
            {data.headline}
          </span>
        </h3>

        {data.quote && (
          <div className="relative pl-4 border-l-2 border-yanci-accent/30 mt-auto">
            <p className="text-sm font-serif text-gray-500 leading-relaxed italic line-clamp-3">
              “{data.quote}”
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default OpinionCard;
