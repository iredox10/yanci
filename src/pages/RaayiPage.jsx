import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import OpinionCard from '../components/guardian/OpinionCard';
import { useNews } from '../context/NewsContext';

const RaayiPage = () => {
    const { articles } = useNews();
    const opinionArticles = articles.filter(a => a.section === 'opinion');

    return (
        <div className="bg-[#fbf8f3] min-h-screen font-sans text-[#1c1917]">
            <GuardianNav />

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                <div className="flex items-center justify-center mb-12">
                    <div className="text-center">
                        <h1 className="font-serif font-black text-6xl md:text-8xl text-[#e05e00] tracking-tighter mb-4">
                            Ra'ayi<span className="text-[#1c1917]">.</span>
                        </h1>
                        <p className="font-serif text-xl italic text-gray-600">"Muryar Gaskiya, Tunanin Yanci"</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Editorial Column */}
                    <div className="lg:col-span-1 border-r border-[#e05e00]/20 pr-8 hidden lg:block">
                        <h3 className="font-bold text-[#e05e00] uppercase tracking-widest text-sm mb-6 border-b border-[#e05e00] pb-2">Sharhin Edita</h3>
                        <div className="space-y-8">
                            <article>
                                <h4 className="font-serif font-bold text-xl leading-tight mb-2 hover:text-[#e05e00] cursor-pointer">
                                    Matsalar tsaro a Arewa tana bukatar sabon salo, ba wai sabon kwamiti ba.
                                </h4>
                                <p className="text-sm text-gray-500">Yanci Edita</p>
                            </article>
                            <article>
                                <h4 className="font-serif font-bold text-xl leading-tight mb-2 hover:text-[#e05e00] cursor-pointer">
                                    Me ya sa matasanmu suke barin kasar?
                                </h4>
                                <p className="text-sm text-gray-500">Yanci Edita</p>
                            </article>
                        </div>
                    </div>

                    {/* Main Opinion Grid */}
                    <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opinionArticles.map(story => (
                            <OpinionCard key={story.id} data={story} />
                        ))}
                    </div>
                </div>
            </div>

            <GuardianFooter />
        </div>
    );
};

export default RaayiPage;
