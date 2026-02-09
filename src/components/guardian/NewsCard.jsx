import { PILLARS } from '../../data/guardianData';
import { FaClock, FaShareNodes, FaBookmark, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const NewsCard = ({ data, variant = 'standard', featured = false }) => {
  const colors = PILLARS[data.pillar] || PILLARS.news;
  const kickerStyle = { color: colors.main };

  // Hero Card (Large, Immersive)
  if (data.type === 'hero' || variant === 'hero') {
    return (
      <Link 
        to={`/article/${data.id}`} 
        className="group relative h-full min-h-[500px] md:min-h-[600px] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer block"
      >
        <div className="absolute inset-0">
          <img 
            src={data.image} 
            alt={data.headline} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          {/* Animated overlay on hover */}
          <div className="absolute inset-0 bg-[#0f3036]/0 group-hover:bg-[#0f3036]/10 transition-colors duration-500" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
          <div className="transform transition-all duration-500 group-hover:-translate-y-2">
            {/* Category Tag */}
            <span 
              className="inline-block px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-widest text-[#0f3036] rounded-full shadow-lg"
              style={{ backgroundColor: colors.main }}
            >
              {data.kicker}
            </span>
            
            {/* Headline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4 text-white group-hover:text-white transition-colors">
              {data.headline}
            </h2>
            
            {/* Trail Text */}
            {data.trail && (
              <p className="text-lg md:text-xl text-gray-200 font-serif leading-relaxed max-w-3xl border-l-4 pl-4 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 hidden md:block"
                 style={{ borderColor: colors.main }}
              >
                {data.trail}
              </p>
            )}
            
            {/* Meta Info */}
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-300 border-t border-white/20 pt-6">
              <span className="flex items-center gap-2">
                <FaClock className="w-4 h-4" /> Minti 15 da suka wuce
              </span>
              <span className="flex items-center gap-2">
                <span 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.main }}
                />
                Abuja
              </span>
              <div className="flex-1" />
              {/* Action buttons - show on hover */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                  <FaShareNodes className="w-4 h-4" />
                </button>
                <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                  <FaBookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors.main}40 0%, transparent 50%)`
          }}
        />
      </Link>
    );
  }

  // Compact Card (Sidebar / List)
  if (data.type === 'compact') {
    return (
      <Link 
        to={`/article/${data.id}`} 
        className="group flex gap-4 py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50/50 transition-all px-3 -mx-3 rounded-xl"
      >
        <div className="flex-1 min-w-0">
          <span 
            className="text-[10px] font-bold uppercase tracking-widest block mb-2"
            style={kickerStyle}
          >
            {data.kicker}
          </span>
          <h3 className="text-lg font-serif font-bold text-[#1c1917] leading-snug group-hover:text-[#0f3036] transition-colors line-clamp-2">
            {data.headline}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> 2h</span>
            <span>3 min read</span>
          </div>
        </div>
        {data.image && (
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img 
              src={data.image} 
              alt={data.headline} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
        )}
      </Link>
    );
  }

  // Featured Card (Larger variant)
  if (featured) {
    return (
      <Link 
        to={`/article/${data.id}`} 
        className="group block h-full"
      >
        <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
          {data.image && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <img 
                src={data.image} 
                alt={data.headline} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Category badge on image */}
              <span 
                className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-full"
                style={{ backgroundColor: colors.main }}
              >
                {data.kicker}
              </span>
            </div>
          )}
          <div className="p-6">
            <h3 className="text-2xl font-serif font-bold text-[#1c1917] leading-tight mb-3 group-hover:text-[#0f3036] transition-colors">
              {data.headline}
            </h3>
            {data.trail && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                {data.trail}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-600">Rahama Ibrahim</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> 4h</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaBookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Card (Grid) - Default
  return (
    <Link 
      to={`/article/${data.id}`} 
      className="group block h-full"
    >
      <div className="h-full flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden hover:border-gray-200">
        {data.image && (
          <div className="relative aspect-[3/2] overflow-hidden">
            <img 
              src={data.image} 
              alt={data.headline} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              loading="lazy" 
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Bookmark button - appears on hover */}
            <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-white shadow-lg">
              <FaBookmark className="w-4 h-4 text-gray-600 hover:text-[#0f3036]" />
            </button>
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-[10px] font-bold uppercase tracking-widest"
              style={kickerStyle}
            >
              {data.kicker}
            </span>
            {!data.image && (
              <button className="text-gray-300 hover:text-[#0f3036] transition-colors">
                <FaBookmark className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <h3 className="text-lg font-serif font-bold text-[#1c1917] leading-tight mb-3 group-hover:text-[#0f3036] transition-colors flex-1">
            {data.headline}
          </h3>
          
          {data.trail && !data.image && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {data.trail}
            </p>
          )}

          <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Rahama Ibrahim</span>
            <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> 4h</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
