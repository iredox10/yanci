import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaQuoteLeft } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';

const SiyasaPage = () => {
    const { articles } = useNews();

    // Filter for politics/siyasa related articles (mocking the filter for now)
    // In a real app, we'd filter by category 'politics' or 'siyasa'
    const politicsArticles = articles.filter(a => a.section === 'headlines' || a.section === 'opinion').slice(0, 10);

    const heroStory = politicsArticles[0];
    const subHeroStories = politicsArticles.slice(1, 3);
    const opinionStories = politicsArticles.slice(3, 7);
    const feedStories = politicsArticles.slice(7);

    return (
        <div className="bg-[#f4f1ea] min-h-screen font-sans text-[#1c1917]">
            <GuardianNav />

            {/* Siyasa Header */}
            <div className="bg-[#8a2c2c] text-white py-12 border-b border-[#a33f3f]">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <h1 className="font-serif font-black text-5xl md:text-7xl tracking-tighter mb-6">
                        Siyasa<span className="text-[#ffbac8]">.</span>
                    </h1>
                    <div className="flex flex-wrap gap-6 text-sm font-bold border-t border-[#a33f3f] pt-4">
                        <a href="#" className="hover:text-[#ffbac8] transition-colors">Zabe 2027</a>
                        <a href="#" className="hover:text-[#ffbac8] transition-colors">Majalisa</a>
                        <a href="#" className="hover:text-[#ffbac8] transition-colors">Fadar Shugaban Kasa</a>
                        <a href="#" className="hover:text-[#ffbac8] transition-colors">Siyasar Jihohi</a>
                        <a href="#" className="hover:text-[#ffbac8] transition-colors">Jam'iyyu</a>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 space-y-16">

                {/* Top Section: The Political Agenda */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-t border-[#8a2c2c] pt-2">
                        <span className="text-[#8a2c2c] font-bold uppercase tracking-widest text-sm">Babban Labari</span>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Main Hero */}
                        <div className="lg:col-span-8 group cursor-pointer">
                            {heroStory && (
                                <>
                                    <div className="aspect-[5/3] overflow-hidden mb-4 relative">
                                        <img src={heroStory.image} alt={heroStory.headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute bottom-0 left-0 bg-[#8a2c2c] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                                            Sharhi
                                        </div>
                                    </div>
                                    <h2 className="font-serif font-bold text-3xl md:text-5xl leading-tight mb-4 group-hover:text-[#8a2c2c] transition-colors">
                                        {heroStory.headline}
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                                        Yayin da jam'iyyun siyasa ke shirin tunkarar zaben cike gurbi, masana sun yi gargadin cewa...
                                    </p>

                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#8a2c2c]">
                                        <span className="bg-[#ffbac8] text-[#8a2c2c] px-2 py-1 rounded-full">Siyasa</span>
                                        <span className="text-gray-400">2h ago</span>
                                        <span className="text-gray-400 flex items-center gap-1"><FaChevronRight className="w-3 h-3" /></span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Side Stories */}
                        <div className="lg:col-span-4 flex flex-col gap-8 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-8 lg:pt-0">
                            {subHeroStories.map(story => (
                                <article key={story.id} className="group cursor-pointer">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a2c2c]">{story.kicker}</span>
                                    </div>
                                    <h3 className="font-serif font-bold text-2xl leading-snug mb-2 group-hover:text-[#8a2c2c] transition-colors">
                                        {story.headline}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                        Ana ci gaba da tafka muhawara kan sabuwar dokar zabe da majalisa ta amince da ita...
                                    </p>
                                    {story.author && (
                                        <div className="text-xs font-bold text-gray-500">Daga {story.author}</div>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mid Section: Voices of the House (Opinion) */}
                <section className="bg-[#fdf0e7] -mx-4 md:-mx-6 px-4 md:px-6 py-12 border-y border-[#e05e00]">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="font-serif font-black text-3xl text-[#e05e00]">Muryar 'Yan Siyasa</h2>
                            <a href="#" className="text-sm font-bold text-[#e05e00] hover:underline flex items-center gap-1">
                                Duba duka <FaChevronRight className="w-3 h-3" />
                            </a>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {opinionStories.map((story, idx) => (
                                <article key={story.id} className="relative pt-8 group cursor-pointer">
                                    <div className="absolute top-0 left-4 text-6xl text-[#e05e00]/20 font-serif font-black z-0">“</div>
                                    <div className="relative z-10 border-t-2 border-[#e05e00] pt-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                                                {/* Placeholder avatar */}
                                                <img src={`https://i.pravatar.cc/150?u=${story.id}`} alt="Author" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            </div>
                                            <div className="text-xs font-bold text-[#e05e00] uppercase tracking-wider">
                                                {story.author || 'Yanci Columnist'}
                                            </div>
                                        </div>
                                        <h3 className="font-serif font-bold text-xl leading-tight mb-2 group-hover:underline decoration-[#e05e00] decoration-2 underline-offset-4">
                                            {story.headline}
                                        </h3>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom Section: Feed */}
                <section className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                            <span className="text-[#1c1917] font-bold text-lg">Labaran Siyasa</span>
                        </div>

                        <div className="space-y-8">
                            {feedStories.map(story => (
                                <article key={story.id} className="flex flex-col md:flex-row gap-6 group cursor-pointer border-b border-gray-100 pb-8 last:border-0">
                                    <div className="md:w-1/3 aspect-[3/2] overflow-hidden">
                                        <img src={story.image} alt={story.headline} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a2c2c]">{story.kicker}</span>
                                            <span className="text-[10px] text-gray-400">|</span>
                                            <span className="text-[10px] font-bold text-gray-400">Abuja</span>
                                        </div>
                                        <h3 className="font-serif font-bold text-2xl mb-2 group-hover:text-[#8a2c2c] transition-colors">
                                            {story.headline}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                            Gwamnatin tarayya ta bayyana cewa za ta dauki matakin gaggawa kan batun tsaro a yankunan da ke fama da rikici...
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <button className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-sm transition-colors text-gray-600">
                                                <span className="mr-1">💬</span> 24
                                            </button>
                                            <button className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-sm transition-colors text-gray-600">
                                                <span className="mr-1">🔗</span> Raba
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-[#f3f4f6] p-6 rounded-sm sticky top-24">
                            <h3 className="font-bold text-[#1c1917] mb-4 border-b border-gray-300 pb-2">Zabe 2027</h3>
                            <div className="space-y-4">
                                <div className="bg-white p-4 shadow-sm border-l-4 border-[#8a2c2c]">
                                    <div className="text-xs font-bold text-gray-500 mb-1">Kidayar Kwanaki</div>
                                    <div className="font-mono text-2xl font-black text-[#8a2c2c]">784 <span className="text-sm text-gray-400 font-sans font-normal">Kwanaki</span></div>
                                </div>
                                <div className="bg-white p-4 shadow-sm">
                                    <h4 className="font-bold text-sm mb-2">Jam'iyyu Masu Karfi</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold">APC</span>
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="w-[65%] h-full bg-blue-500"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold">PDP</span>
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="w-[45%] h-full bg-green-500"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold">LP</span>
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="w-[30%] h-full bg-red-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <GuardianFooter />
        </div>
    );
};

export default SiyasaPage;
