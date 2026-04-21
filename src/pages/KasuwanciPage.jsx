import React from 'react';
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';
import { useMarketRates } from '../hooks/useMarketRates';

const formatNumber = (num, decimals = 2) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return num.toFixed(decimals);
};

const ChangeIndicator = ({ value }) => {
    if (value === undefined || value === null) return <FaMinus className="w-3 h-3 text-gray-400" />;
    if (value > 0) return <span className="text-green-400 flex items-center gap-0.5"><FaArrowTrendUp className="w-3 h-3" /> +{value}%</span>;
    if (value < 0) return <span className="text-red-400 flex items-center gap-0.5"><FaArrowTrendDown className="w-3 h-3" /> {value}%</span>;
    return <FaMinus className="w-3 h-3 text-gray-400" />;
};

const KasuwanciPage = () => {
    const { articles } = useNews();
    const { rates, changes, loading, lastUpdated, error } = useMarketRates();
    const businessArticles = articles.filter(a => a.section === 'kasuwanci' || a.pillar === 'lifestyle');

    return (
        <div className="bg-[#f3f4f6] min-h-screen font-sans text-[#1c1917]">
            <GuardianNav />

            {/* Market Data Header - Live Rates */}
            <div className="bg-[#0f3036] text-white py-3 border-b border-gray-700 overflow-x-auto">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex gap-6 whitespace-nowrap text-sm font-mono">
                    {loading ? (
                        <span className="text-gray-400 animate-pulse">Ana loda farashin kasuwa...</span>
                    ) : (
                        <>
                            <span className="flex items-center gap-2">
                                <span className="text-gray-400">USD/NGN</span>
                                <span className="font-bold">₦{formatNumber(rates.usdNgn)}</span>
                                <ChangeIndicator value={changes.usdNgn} />
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-gray-400">GBP/NGN</span>
                                <span className="font-bold">₦{formatNumber(rates.gbpNgn)}</span>
                                <ChangeIndicator value={changes.gbpNgn} />
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-gray-400">BTC</span>
                                <span className="font-bold">${formatNumber(rates.btcUsd, 0)}</span>
                                <ChangeIndicator value={changes.btcUsd} />
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-gray-400">DANGOTE</span>
                                <span className="font-bold">₦{formatNumber(rates.dangote)}</span>
                                <ChangeIndicator value={changes.dangote} />
                            </span>
                            {lastUpdated && (
                                <span className="text-[10px] text-gray-500 ml-auto hidden md:block">
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </span>
                            )}
                        </>
                    )}
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
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                        <FaArrowTrendUp className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#2c7a7b]">{story.kicker}</span>
                                    </div>
                                    <h3 className="font-serif font-bold text-2xl mb-3 group-hover:text-[#2c7a7b] transition-colors">{story.headline}</h3>
                                    {story.trail && (
                                        <p className="text-gray-600 leading-relaxed">
                                            {story.trail}
                                        </p>
                                    )}
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
                                    <span className="text-sm">Man Fetur (Brent)</span>
                                    <span className="font-mono font-bold">${formatNumber(rates.brentCrude)}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-sm">Zinari (Gold)</span>
                                    <span className="font-mono font-bold">${formatNumber(rates.gold)}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-sm">EUR/NGN</span>
                                    <span className="font-mono font-bold">₦{formatNumber(rates.eurNgn)}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-sm">Ethereum</span>
                                    <span className="font-mono font-bold">${formatNumber(rates.ethUsd, 0)}</span>
                                </li>
                            </ul>
                            {error && (
                                <p className="text-[10px] text-gray-400 mt-4 text-center">
                                    Using cached rates — API unavailable
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default KasuwanciPage;
