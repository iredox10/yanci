import { useParams } from 'react-router-dom';
import { FaClock, FaShareNodes, FaBookmark, FaFacebook, FaTwitter, FaLinkedin, FaPrint } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';
import LiveArticlePage from './LiveArticlePage';

const ArticlePage = () => {
  const { id } = useParams();
  const { getArticleById, articles } = useNews();

  // Fallback to first article if not found
  const article = getArticleById(id) || articles[0];

  if (!article) return <div>Loading...</div>;

  if (article.isLive) {
    return <LiveArticlePage />;
  }

  // Mock body text in Hausa
  const bodyText = [
    "A wani taro da aka gudanar a babban birnin tarayya Abuja, masu ruwa da tsaki sun tattauna muhimmancin wannan sabon tsari. Gwamnatin tarayya ta bayyana cewa wannan mataki zai taimaka wajen bunkasa tattalin arzikin kasa da kuma samar da ayyukan yi ga matasa.",
    "Ministan yada labarai, a yayin da yake zantawa da manema labarai, ya jaddada cewa: 'Wannan ba karamin ci gaba bane ga kasarmu. Muna sa ran ganin sauye-sauye masu ma'ana a cikin watanni masu zuwa.' Ya kuma yi kira ga 'yan kasa da su bayar da goyon baya domin ganin an cimma nasara.",
    "Sai dai, wasu masana tattalin arziki sun nuna damuwa kan yadda za a aiwatar da tsarin. Sun yi nuni da cewa akwai bukatar a samar da kyakkyawan yanayi ga masu zuba jari kafin a fara ganin sakamako mai dorewa.",
    "A bangare guda, kungiyoyin farar hula sun yi kira ga gwamnati da ta tabbatar da cewa an yi amfani da kudaden da za a samu ta hanyar da ta dace. Sun ce zasu sanya ido sosai domin ganin ba a samu almubazzaranci ba.",
    "Wannan ci gaba na zuwa ne a daidai lokacin da kasar ke fuskantar kalubale daban-daban, ciki har da hauhawar farashin kayayyaki da kuma matsalar tsaro a wasu yankuna. Ana sa ran cewa idan aka yi amfani da wannan dama yadda ya kamata, za a samu sauki sosai.",
    "Daga karshe, an yi kira ga dukkan bangarori da su hada kai domin ciyar da kasar gaba. 'Ci gaban kasa nauyi ne da ya rataya a wuyan kowa,' in ji shugaban taron."
  ];

  return (
    <div className="bg-[#f4f1ea] min-h-screen font-sans text-[#1c1917] selection:bg-[#c59d5f] selection:text-[#0f3036]">
      <GuardianNav />

      <main className="max-w-[1000px] mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Breadcrumbs & Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8a2c2c]">
            <span>Labarai</span>
            <span className="text-gray-400">/</span>
            <span>{article.pillar === 'news' ? 'Najeriya' : article.pillar}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> An wallafa: 29 Nuwamba, 2025</span>
          </div>
        </div>

        {/* Headline Section */}
        <article>
          <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight text-[#0f3036] mb-6">
            {article.headline}
          </h1>

          <p className="text-xl font-serif text-gray-600 leading-relaxed mb-8 border-l-4 border-[#c59d5f] pl-4">
            {article.trail || "Takaitaccen bayani game da labarin zai kasance a nan domin baiwa mai karatu haske."}
          </p>

          {/* Author & Share */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 py-4 border-y border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0f3036] text-[#c59d5f] flex items-center justify-center font-serif font-bold text-lg">
                {article.author ? article.author[0] : 'Y'}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f3036]">{article.author || "Yanci Wakili"}</p>
                <p className="text-xs text-gray-500">Abuja</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#3b5998] hover:text-white hover:border-transparent transition-colors"><FaFacebook className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#000000] hover:text-white hover:border-transparent transition-colors"><FaTwitter className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#0077b5] hover:text-white hover:border-transparent transition-colors"><FaLinkedin className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#0f3036] hover:text-white hover:border-transparent transition-colors"><FaBookmark className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#0f3036] hover:text-white hover:border-transparent transition-colors"><FaPrint className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Main Image */}
          {article.image && (
            <figure className="mb-10">
              <div className="aspect-video w-full overflow-hidden rounded-sm shadow-sm">
                <img src={article.image} alt={article.headline} className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <span className="font-bold text-[#0f3036]">Hoto:</span> Getty Images / Yanci Press
              </figcaption>
            </figure>
          )}

          {/* Article Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 font-body text-lg leading-loose text-gray-800 space-y-6">
              {article.body ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-[#0f3036] prose-a:no-underline hover:prose-a:underline prose-img:rounded-sm"
                  dangerouslySetInnerHTML={{ __html: article.body }}
                />
              ) : (
                <>
                  <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#0f3036] first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                    {bodyText[0]}
                  </p>
                  {bodyText.slice(1).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}

                  {/* In-article Quote */}
                  <blockquote className="my-8 p-6 bg-white border-l-4 border-[#c59d5f] shadow-sm">
                    <p className="font-serif text-xl font-bold italic text-[#0f3036] mb-4">
                      "Wannan ba karamin ci gaba bane ga kasarmu. Muna sa ran ganin sauye-sauye masu ma'ana."
                    </p>
                    <footer className="text-sm font-bold text-gray-500 uppercase tracking-wider">— Ministan Yada Labarai</footer>
                  </blockquote>

                  <p>{bodyText[0]}</p>
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Related News */}
              <div className="bg-white p-6 border-t-4 border-[#8a2c2c] shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#8a2c2c] mb-4">Labarai Masu Alaka</h3>
                <div className="space-y-4">
                  {articles.filter(a => a.section === 'headlines' && a.id !== article.id).slice(0, 3).map(item => (
                    <a href={`/article/${item.id}`} key={item.id} className="block group">
                      <h4 className="font-serif font-bold text-[#1c1917] group-hover:text-[#8a2c2c] transition-colors mb-1">{item.headline}</h4>
                      <span className="text-xs text-gray-400">Minti 30 da suka wuce</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-[#0f3036] text-white p-6 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c59d5f] opacity-10 rounded-full -mr-10 -mt-10"></div>
                <h3 className="font-serif text-xl font-bold mb-2 relative z-10">Kada a barku a baya</h3>
                <p className="text-sm text-gray-300 mb-4 relative z-10">Samu labaran Yanci kai tsaye a imel.</p>
                <input type="email" placeholder="Imel din ku" className="w-full bg-white/10 border border-white/20 p-2 rounded-sm text-sm mb-2 focus:outline-none focus:border-[#c59d5f]" />
                <button className="w-full bg-[#c59d5f] text-[#0f3036] font-bold text-sm py-2 rounded-sm hover:bg-white transition-colors">Yi Rajista</button>
              </div>
            </aside>
          </div>
        </article>

      </main>

      <GuardianFooter />
    </div>
  );
};

export default ArticlePage;
