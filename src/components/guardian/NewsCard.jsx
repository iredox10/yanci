import { PILLARS } from '../../data/guardianData';
import { LuClock, LuShare2, LuBookmark } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const NewsCard = ({ data, variant = 'standard' }) => {
  const colors = PILLARS[data.pillar] || PILLARS.news;
  const kickerStyle = { color: colors.main };

  // Hero Card (Large, Immersive)
  if (data.type === 'hero') {
    return (
      <Link to={`/article/${data.id}`} className="group relative h-full min-h-[500px] overflow-hidden rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer block">
        <div className="absolute inset-0">
          <img 
            src={data.image} 
            alt={data.headline} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest bg-yanci-accent text-yanci-primary rounded-sm">
              {data.kicker}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-4 text-white group-hover:text-yanci-accent transition-colors">
              {data.headline}
            </h2>
            {data.trail && (
              <p className="text-lg text-gray-200 font-serif leading-relaxed max-w-3xl border-l-4 border-yanci-accent pl-4 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
                {data.trail}
              </p>
            )}
            
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-300 border-t border-white/20 pt-6 mt-2">
              <span className="flex items-center gap-2">
                <LuClock className="w-4 h-4" /> Minti 15 da suka wuce
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-yanci-accent rounded-full"></span> Abuja
              </span>
              <div className="flex-1"></div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><LuShare2 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><LuBookmark className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Compact Card (Sidebar / List)
  if (data.type === 'compact') {
    return (
      <Link to={`/article/${data.id}`} className="group flex gap-4 py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-sm block">
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest block mb-2" style={kickerStyle}>
            {data.kicker}
          </span>
          <h3 className="text-lg font-serif font-bold text-yanci-dark leading-snug group-hover:text-yanci-primary transition-colors">
            {data.headline}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <LuClock className="w-3 h-3" /> 2h
          </div>
        </div>
        {data.image && (
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
            <img src={data.image} alt={data.headline} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
      </Link>
    );
  }

  // Standard Card (Grid)
  return (
    <Link to={`/article/${data.id}`} className="group h-full flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-sm overflow-hidden cursor-pointer block">
      {data.image && (
        <div className="relative aspect-[3/2] overflow-hidden">
          <img 
            src={data.image} 
            alt={data.headline} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={kickerStyle}>
            {data.kicker}
          </span>
          <button className="text-gray-300 hover:text-yanci-primary transition-colors"><LuBookmark className="w-4 h-4" /></button>
        </div>
        
        <h3 className="text-xl font-serif font-bold text-yanci-dark leading-tight mb-3 group-hover:text-yanci-primary transition-colors flex-1">
          {data.headline}
        </h3>
        
        {data.trail && !data.image && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{data.trail}</p>
        )}

        <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>Rahama Ibrahim</span>
          <span className="flex items-center gap-1"><LuClock className="w-3 h-3" /> 4h</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
