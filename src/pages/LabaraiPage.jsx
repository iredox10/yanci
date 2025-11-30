import React from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import NewsCard from '../components/guardian/NewsCard';
import { useNews } from '../context/NewsContext';
import { PILLARS } from '../data/guardianData';

const LabaraiPage = () => {
    const { articles } = useNews();
    const newsArticles = articles.filter(a => a.section === 'headlines');
    const heroStory = newsArticles[0];
    const mainFeed = newsArticles.slice(1);

    return (
        <div className="bg-[#f4f1ea] min-h-screen font-sans text-[#1c1917]">
            <GuardianNav />

            {/* Header */}
            <div className="bg-[#8a2c2c] text-white py-8 border-b border-[#a33f3f]">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <h1 className="font-serif font-black text-5xl tracking-tighter mb-4">
                        Labarai<span className="text-[#ffbac8]">.</span>
                    </h1>
                    <div className="flex gap-6 text-sm font-bold border-t border-[#a33f3f] pt-4">
                        <a href="#" className="hover:text-[#ffbac8]">Najeriya</a>
                        <a href="#" className="hover:text-[#ffbac8]">Afirka</a>
                        <a href="#" className="hover:text-[#ffbac8]">Duniya</a>
                        <a href="#" className="hover:text-[#ffbac8]">Yanayi</a>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                {/* Hero Section */}
                <section className="mb-12">
                    {heroStory && (
                        <div className="grid md:grid-cols-12 gap-8">
                            <div className="md:col-span-8">
                                <NewsCard data={heroStory} variant="hero" />
                            </div>
                            <div className="md:col-span-4 bg-white p-6 border-t-4 border-[#8a2c2c]">
                                <h3 className="font-bold text-[#8a2c2c] uppercase tracking-widest text-sm mb-4">Mafi Daukar Hankali</h3>
                                <ul className="space-y-4 divide-y divide-gray-100">
                                    {mainFeed.slice(0, 5).map(story => (
                                        <li key={story.id} className="pt-4 first:pt-0">
                                            <a href="#" className="group">
                                                <h4 className="font-serif font-bold text-lg leading-tight group-hover:text-[#8a2c2c] transition-colors">{story.headline}</h4>
                                                <span className="text-xs text-gray-500 mt-1 block">Minti 30 da suka wuce</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </section>

                {/* Main Feed */}
                <section className="grid md:grid-cols-3 gap-8">
                    {mainFeed.map(story => (
                        <NewsCard key={story.id} data={story} />
                    ))}
                </section>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default LabaraiPage;
