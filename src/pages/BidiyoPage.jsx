import React, { useState } from 'react';
import { FaPlay, FaClock } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';

const BidiyoPage = () => {
    const { articles } = useNews();
    // Mock video articles - using any article with an image for now
    const videoArticles = articles.slice(0, 8);
    const [activeVideo, setActiveVideo] = useState(videoArticles[0]);

    return (
        <div className="bg-[#121212] min-h-screen font-sans text-gray-200">
            <GuardianNav />

            {/* Cinema Mode Hero */}
            <div className="relative bg-black">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-12 gap-0">
                        {/* Main Video Player Area */}
                        <div className="lg:col-span-9 relative aspect-video bg-black group cursor-pointer">
                            <img src={activeVideo?.image} alt={activeVideo?.headline} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-1 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                    <FaPlay className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest">Kallo Yanzu</span>
                                    <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><FaClock /> 12:45</span>
                                </div>
                                <h1 className="font-serif font-black text-3xl md:text-5xl text-white leading-tight max-w-4xl">
                                    {activeVideo?.headline}
                                </h1>
                            </div>
                        </div>

                        {/* Up Next Playlist */}
                        <div className="lg:col-span-3 bg-[#1c1917] border-l border-gray-800 h-full max-h-[600px] overflow-y-auto custom-scrollbar">
                            <div className="p-4 border-b border-gray-800 bg-[#262626] sticky top-0 z-10">
                                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Na Gaba</h3>
                            </div>
                            <div className="divide-y divide-gray-800">
                                {videoArticles.slice(1).map((video, idx) => (
                                    <div
                                        key={video.id}
                                        onClick={() => setActiveVideo(video)}
                                        className="p-4 flex gap-3 hover:bg-[#262626] transition-colors cursor-pointer group"
                                    >
                                        <div className="w-24 aspect-video bg-gray-800 relative flex-shrink-0">
                                            <img src={video.image} alt={video.headline} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded-sm">
                                                04:20
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-300 group-hover:text-white line-clamp-2 leading-snug mb-1">
                                                {video.headline}
                                            </h4>
                                            <span className="text-xs text-gray-500">Yanci TV</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <h2 className="font-serif font-black text-3xl text-white">Sabbin Bidiyo</h2>
                    <div className="flex gap-4 text-sm font-bold text-gray-500">
                        <button className="text-white border-b-2 border-red-600 pb-4 -mb-4.5">Duka</button>
                        <button className="hover:text-white transition-colors">Labarai</button>
                        <button className="hover:text-white transition-colors">Wasanni</button>
                        <button className="hover:text-white transition-colors">Nishadi</button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videoArticles.map(video => (
                        <div key={video.id} className="group cursor-pointer">
                            <div className="aspect-video bg-gray-800 relative mb-3 overflow-hidden rounded-sm">
                                <img src={video.image} alt={video.headline} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center pl-1">
                                        <FaPlay className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                                    03:15
                                </div>
                            </div>
                            <h3 className="font-bold text-lg leading-tight text-white group-hover:text-red-500 transition-colors mb-2">
                                {video.headline}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>12K views</span>
                                <span>•</span>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <GuardianFooter />
        </div>
    );
};

export default BidiyoPage;
