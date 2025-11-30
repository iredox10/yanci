import React from 'react';
import { FaFutbol, FaTrophy } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';

const WasanniPage = () => {
    const { articles } = useNews();
    const sportArticles = articles.filter(a => a.section === 'sport');

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-[#1c1917]">
            <GuardianNav />

            {/* Scoreboard Header */}
            <div className="bg-[#1a4e4f] text-white py-4 border-b border-[#2c7a7b] overflow-x-auto">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex gap-8 whitespace-nowrap">
                    <div className="flex items-center gap-3 bg-[#0f3036] px-4 py-2 rounded-sm">
                        <span className="text-xs font-bold text-[#b2f5ea]">NPFL</span>
                        <span className="font-bold">Kano Pillars 2 - 1 Enyimba</span>
                        <span className="text-xs text-red-400 animate-pulse">FT</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#0f3036] px-4 py-2 rounded-sm">
                        <span className="text-xs font-bold text-[#b2f5ea]">EPL</span>
                        <span className="font-bold">Man City 1 - 1 Liverpool</span>
                        <span className="text-xs text-green-400">HT</span>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                <div className="flex items-end justify-between mb-8 border-b-4 border-[#2c7a7b] pb-2">
                    <h1 className="font-serif font-black text-5xl md:text-7xl text-[#2c7a7b] tracking-tighter">
                        Wasanni<span className="text-[#b2f5ea]">.</span>
                    </h1>
                    <div className="flex gap-4 text-sm font-bold text-[#2c7a7b]">
                        <a href="#" className="hover:underline">Kwallon Kafa</a>
                        <a href="#" className="hover:underline">Dambe</a>
                        <a href="#" className="hover:underline">Gudu</a>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Feature */}
                    <div className="lg:col-span-8">
                        {sportArticles[0] && (
                            <div className="relative group cursor-pointer mb-12">
                                <div className="aspect-video overflow-hidden rounded-sm mb-4">
                                    <img src={sportArticles[0].image} alt={sportArticles[0].headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="absolute top-4 left-4 bg-[#2c7a7b] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                                    Babban Labari
                                </div>
                                <h2 className="font-serif font-black text-4xl md:text-6xl leading-none mb-4 group-hover:text-[#2c7a7b] transition-colors">
                                    {sportArticles[0].headline}
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl">
                                    Kocin Super Eagles ya bayyana cewa kungiyar ta shirya tsaf domin tunkarar gasar cin kofin duniya...
                                </p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            {sportArticles.slice(1).map(story => (
                                <NewsCard key={story.id} data={story} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-[#2c7a7b] text-white p-6 rounded-sm">
                            <h3 className="font-bold border-b border-[#b2f5ea]/30 pb-2 mb-4 flex items-center gap-2">
                                <FaTrophy /> Jadawalin Gasar
                            </h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-[#b2f5ea] text-left">
                                        <th className="pb-2">Kungiya</th>
                                        <th className="pb-2">W</th>
                                        <th className="pb-2">Maki</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#b2f5ea]/20">
                                    <tr className="font-bold">
                                        <td className="py-2">1. Remo Stars</td>
                                        <td className="py-2">12</td>
                                        <td className="py-2">28</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">2. Rivers Utd</td>
                                        <td className="py-2">12</td>
                                        <td className="py-2">26</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">3. Enyimba</td>
                                        <td className="py-2">11</td>
                                        <td className="py-2">22</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default WasanniPage;
