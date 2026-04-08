import React, { useState } from 'react';
import { FaMusic, FaFilm, FaPalette } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';

const FILTERS = [
  { label: 'Duka', icon: null, filter: () => true },
  { label: 'Waka', icon: FaMusic, filter: (a) => a.kicker?.toLowerCase().includes('kida') || a.kicker?.toLowerCase().includes('waka') || a.tags?.toLowerCase().includes('kida') },
  { label: 'Fina-finai', icon: FaFilm, filter: (a) => a.kicker?.toLowerCase().includes('fina') || a.kicker?.toLowerCase().includes('film') || a.tags?.toLowerCase().includes('fina-finai') },
  { label: 'Abinci', icon: FaPalette, filter: (a) => a.kicker?.toLowerCase().includes('abinci') || a.tags?.toLowerCase().includes('abinci') },
  { label: 'Sutura', icon: FaPalette, filter: (a) => a.kicker?.toLowerCase().includes('sutura') || a.tags?.toLowerCase().includes('sutura') },
];

const AladuPage = () => {
    const { articles } = useNews();
    const [activeFilter, setActiveFilter] = useState('Duka');
    const cultureArticles = articles.filter(a => a.section === 'culture');
    const currentFilter = FILTERS.find(f => f.label === activeFilter)?.filter || (() => true);
    const filteredArticles = cultureArticles.filter(currentFilter);

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
                    {FILTERS.map(f => (
                        <button
                            key={f.label}
                            onClick={() => setActiveFilter(f.label)}
                            className={`font-bold text-lg pb-4 -mb-4.5 transition-colors ${
                                activeFilter === f.label
                                    ? 'text-[#eacca0] border-b-2 border-[#eacca0]'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Masonry-style Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {filteredArticles.length > 0 ? filteredArticles.map((story, idx) => (
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
                            {story.trail && (
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {story.trail}
                                </p>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-lg">Babu labarai a wannan rukuni tukuna.</p>
                        </div>
                    )}
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default AladuPage;
