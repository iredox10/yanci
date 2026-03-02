import { Link, useNavigate } from 'react-router-dom';
import { FaHouse, FaArrowLeft, FaMagnifyingGlass, FaNewspaper } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { useNews } from '../context/NewsContext';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { articles } = useNews();
  const recentArticles = articles.slice(0, 4);

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title="Shafin Ba a Samu Ba — Yanci"
        description="Ba a samu wannan shafin ba. Koma gidan yanar gizon Yanci."
      />
      <GuardianNav />

      <main className="max-w-[900px] mx-auto px-4 md:px-6 py-24">
        {/* 404 Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#0f3036]/5 mb-8">
            <FaNewspaper className="w-10 h-10 text-[#0f3036]/40" />
          </div>

          <div className="font-serif font-black text-[120px] md:text-[180px] leading-none text-[#0f3036]/10 select-none mb-0">
            404
          </div>

          <h1 className="font-serif font-black text-3xl md:text-4xl text-[#0f3036] -mt-4 mb-4">
            Ba a Samu Wannan Shafin Ba
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Wataƙila an share wannan labari, ko kuma an canza adireshin. Zaka iya nemo abin da kake nema a ƙasa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-[#0f3036] text-[#0f3036] font-bold text-sm uppercase tracking-widest hover:bg-[#0f3036] hover:text-white transition-all duration-200 rounded-sm"
            >
              <FaArrowLeft className="w-4 h-4" />
              Koma Baya
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-[#0f3036] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#0f3036]/80 transition-all duration-200 rounded-sm"
            >
              <FaHouse className="w-4 h-4" />
              Gidan Yanar Gizo
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-2 px-6 py-3 bg-[#c59d5f] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#c59d5f]/80 transition-all duration-200 rounded-sm"
            >
              <FaMagnifyingGlass className="w-4 h-4" />
              Nema Labari
            </Link>
          </div>
        </div>

        {/* Recent articles fallback */}
        {recentArticles.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="font-serif font-black text-2xl text-[#0f3036] mb-8">
              Labaran Kwanan Nan
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group block"
                >
                  {article.image && (
                    <div className="aspect-[3/2] overflow-hidden bg-gray-100 mb-3 rounded-sm">
                      <img
                        src={article.image}
                        alt={article.headline}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a2c2c] block mb-1">
                    {article.section || article.pillar}
                  </span>
                  <h3 className="font-serif font-bold text-base leading-snug text-[#1c1917] group-hover:text-[#0f3036] transition-colors line-clamp-2">
                    {article.headline}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <GuardianFooter />
    </div>
  );
};

export default NotFoundPage;
