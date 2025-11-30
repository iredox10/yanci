import React from 'react';
import { FaMicrochip, FaRobot } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';

const FasahaPage = () => {
    const { articles } = useNews();
    // Mock tech articles
    const techArticles = articles.filter(a => a.section === 'culture' || a.section === 'lifestyle').slice(0, 5);

    return (
        <div className="bg-[#0f172a] min-h-screen font-sans text-gray-100">
            <GuardianNav />

            <div className="relative overflow-hidden py-20 border-b border-gray-800">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#553c9a]/20 to-transparent"></div>
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex items-center gap-3 text-[#e9d8fd] mb-4">
                        <FaMicrochip className="w-6 h-6 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Fasaha & Kirkira</span>
                    </div>
                    <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter text-white mb-6">
                        Fasaha<span className="text-[#553c9a]">.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        Binciken duniyar dijital, daga AI zuwa Blockchain, da yadda suke canza rayuwar Hausawa.
                    </p>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {techArticles.map((story, idx) => (
                        <article key={story.id} className={`group cursor-pointer ${idx === 0 ? 'lg:col-span-3 grid md:grid-cols-2 gap-8 mb-8' : ''}`}>
                            <div className={`overflow-hidden rounded-lg ${idx === 0 ? 'aspect-video' : 'aspect-[4/3]'}`}>
                                <img src={story.image} alt={story.headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#e9d8fd] bg-[#553c9a] px-2 py-1 rounded-sm">
                                        {idx === 0 ? 'Babban Labari' : 'Sabon Labari'}
                                    </span>
                                </div>
                                <h3 className={`font-serif font-bold leading-tight mb-3 group-hover:text-[#e9d8fd] transition-colors ${idx === 0 ? 'text-4xl' : 'text-xl'}`}>
                                    {story.headline}
                                </h3>
                                {idx === 0 && (
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        Sabuwar manhajar da matasan Kano suka kirkira tana taimakawa wajen gano cututtukan shuka ta hanyar daukar hoto da waya...
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default FasahaPage;
