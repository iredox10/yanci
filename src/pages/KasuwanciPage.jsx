import React from 'react';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';

const KasuwanciPage = () => {
    const { articles } = useNews();
    const businessArticles = articles.filter(a => a.section === 'lifestyle'); // Using lifestyle as proxy for business for now

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-sans text-[#1c1917]">
            <GuardianNav />

            {/* Market Data Header */}
            <div className="bg-[#0f3036] text-white py-3 border-b border-gray-700 overflow-x-auto">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex gap-8 whitespace-nowrap text-sm font-mono">
                    <span className="flex items-center gap-2"><span className="text-gray-400">USD/NGN</span> 1,650.00 <span className="text-red-400 flex items-center"><FaArrowTrendDown /> -0.5%</span></span>
                    <span className="flex items-center gap-2"><span className="text-gray-400">GBP/NGN</span> 2,100.00 <span className="text-green-400 flex items-center"><FaArrowTrendUp /> +0.2%</span></span>
                    <span className="flex items-center gap-2"><span className="text-gray-400">BTC</span> $95,000 <span className="text-green-400 flex items-center"><FaArrowTrendUp /> +1.5%</span></span>
                    <span className="flex items-center gap-2"><span className="text-gray-400">DANGOTE</span> 240.50 <span className="text-green-400 flex items-center"><FaArrowTrendUp /> +0.1%</span></span>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 py-12">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <h1 className="font-serif font-black text-5xl tracking-tighter text-[#0f3036] mb-4">
                        Kasuwanci<span className="text-[#2c7a7b]">.</span>
                    </h1>
                    <div className="flex gap-6 text-sm font-bold text-gray-600">
                        <a href="#" className="hover:text-[#0f3036]">Kasuwa</a>
                        <a href="#" className="hover:text-[#0f3036]">Tattalin Arziki</a>
                        <a href="#" className="hover:text-[#0f3036]">Fasahar Kudi</a>
                        <a href="#" className="hover:text-[#0f3036]">Noma</a>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {businessArticles.map((story, idx) => (
                            <article key={story.id} className="flex flex-col md:flex-row gap-6 group cursor-pointer border-b border-gray-200 pb-8 last:border-0">
                                <div className="md:w-1/3 aspect-video bg-gray-100">
                                    {/* Placeholder for business charts/images */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                        <FaArrowTrendUp className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#2c7a7b]">{story.kicker}</span>
                                    </div>
                                    <h3 className="font-serif font-bold text-2xl mb-3 group-hover:text-[#2c7a7b] transition-colors">{story.headline}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Binciken masana ya nuna cewa manufofin babban banki na baya-bayan nan sun fara haifar da da mai ido...
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-[#0f3036] text-white p-6">
                            <h3 className="font-bold border-b border-gray-600 pb-2 mb-4">Binciken Kasuwa</h3>
                            <ul className="space-y-4">
                                <li className="flex justify-between items-center">
                                    <span className="text-sm">Man Fetur</span>
                                    <span className="font-mono font-bold">$82.40</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-sm">Zinari</span>
                                    <span className="font-mono font-bold">$2,040.10</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default KasuwanciPage;
