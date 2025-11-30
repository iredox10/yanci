import React from 'react';
import { FaMusic, FaFilm, FaPalette } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';

const AladuPage = () => {
    const { articles } = useNews();
    const cultureArticles = articles.filter(a => a.section === 'culture');

    return (
        <div className="bg-[#1c1917] min-h-screen font-sans text-white">
            <GuardianNav />

            {/* Hero Header */}
            <div className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542351967-d5ae722fed71?w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="max-w-[1400px] mx-auto">
                        <span className="text-[#eacca0] font-bold uppercase tracking-widest text-sm mb-4 block">Al'adu & Rayuwa</span>
                        <h1 className="font-serif font-black text-6xl md:text-9xl tracking-tighter text-white mb-6">
                            Al'adu<span className="text-[#eacca0]">.</span>
                        </h1>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                {/* Filter Bar */}
                <div className="flex gap-8 border-b border-gray-800 pb-4 mb-12 overflow-x-auto">
                    <button className="text-[#eacca0] font-bold text-lg border-b-2 border-[#eacca0] pb-4 -mb-4.5">Duka</button>
                    <button className="text-gray-500 font-bold text-lg hover:text-white transition-colors">Waka</button>
                    <button className="text-gray-500 font-bold text-lg hover:text-white transition-colors">Fina-finai</button>
                    <button className="text-gray-500 font-bold text-lg hover:text-white transition-colors">Abinci</button>
                    <button className="text-gray-500 font-bold text-lg hover:text-white transition-colors">Sutura</button>
                </div>

                {/* Masonry-style Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {cultureArticles.map((story, idx) => (
                        <div key={story.id} className="break-inside-avoid group cursor-pointer">
                            <div className="relative overflow-hidden rounded-sm mb-4">
                                <img src={story.image} alt={story.headline} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#eacca0]">{story.kicker}</span>
                            </div>
                            <h3 className={`font-serif font-bold leading-tight mb-2 group-hover:text-[#eacca0] transition-colors ${idx % 3 === 0 ? 'text-3xl' : 'text-xl'}`}>
                                {story.headline}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Wani bincike kan yadda fina-finan Kannywood suke canza tunanin matasa...
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default AladuPage;
