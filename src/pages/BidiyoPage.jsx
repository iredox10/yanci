import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaClock, FaXmark, FaExpand, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import { useNews } from '../context/NewsContext';
import SEO from '../components/SEO';

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^#&?]{11})/,
    /youtube\.com\/watch\?v=([^#&?]{11})/,
    /youtube\.com\/embed\/([^#&?]{11})/,
    /youtube\.com\/v\/([^#&?]{11})/,
    /youtube\.com\/shorts\/([^#&?]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  // If it's already just an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

// YouTube thumbnail fallback
function getYouTubeThumbnail(videoId, quality = 'hqdefault') {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// Embedded YouTube player component
function YouTubePlayer({ videoId, title, onClose }) {
  if (!videoId) return null;
  return (
    <div className="relative w-full aspect-video bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
        >
          <FaXmark size={14} />
        </button>
      )}
    </div>
  );
}

// Video thumbnail card — shows thumbnail or article image, plays on click
function VideoCard({ article, isActive, onClick, size = 'normal' }) {
  const youtubeId = extractYouTubeId(article?.videoUrl);
  const thumbnail =
    (youtubeId ? getYouTubeThumbnail(youtubeId) : null) ||
    article?.image ||
    'https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=640';

  if (size === 'playlist') {
    return (
      <div
        onClick={onClick}
        className={`p-3 flex gap-3 hover:bg-[#262626] transition-colors cursor-pointer group ${
          isActive ? 'bg-[#262626] border-l-2 border-red-600' : ''
        }`}
      >
        <div className="w-28 aspect-video bg-gray-800 relative flex-shrink-0 rounded overflow-hidden">
          <img src={thumbnail} alt={article?.headline} className="w-full h-full object-cover" />
          {isActive ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center pl-0.5">
                <FaPlay size={12} className="text-white" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <FaPlay size={12} className="text-white" />
            </div>
          )}
          {youtubeId && (
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded-sm">
              YT
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-gray-300 group-hover:text-white line-clamp-2 leading-snug mb-1">
            {article?.headline}
          </h4>
          <span className="text-xs text-gray-500">{article?.kicker || 'Yanci TV'}</span>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div className="aspect-video bg-gray-800 relative mb-3 overflow-hidden rounded">
        <img
          src={thumbnail}
          alt={article?.headline}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center pl-1">
            <FaPlay size={18} />
          </div>
        </div>
        {youtubeId && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            YouTube
          </div>
        )}
      </div>
      <h3 className="font-bold text-base leading-tight text-white group-hover:text-red-400 transition-colors mb-1 line-clamp-2">
        {article?.headline}
      </h3>
      <p className="text-xs text-gray-500">{article?.kicker || 'Yanci TV'}</p>
    </div>
  );
}

const CATEGORIES = ['Duka', 'Labarai', 'Wasanni', 'Nishadi'];

const BidiyoPage = () => {
  const { articles } = useNews();
  // Prioritize articles that have a videoUrl; fall back to all articles
  const videoArticles = [
    ...articles.filter((a) => a.videoUrl),
    ...articles.filter((a) => !a.videoUrl),
  ].slice(0, 12);

  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Duka');
  const heroRef = useRef(null);

  const featured = videoArticles[0] || null;

  const handlePlay = (article) => {
    setActiveVideo(article);
    setIsPlaying(true);
    // Scroll hero into view
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStopPlaying = () => {
    setIsPlaying(false);
  };

  const activeItem = activeVideo || featured;
  const youtubeId = extractYouTubeId(activeItem?.videoUrl);
  const heroThumbnail =
    (youtubeId ? getYouTubeThumbnail(youtubeId, 'maxresdefault') : null) ||
    activeItem?.image ||
    'https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=1280';

  return (
    <div className="bg-[#121212] min-h-screen font-sans text-gray-200">
      <SEO
        title="Bidiyo — Yanci TV"
        description="Kalli bidiyon labarai, wasan kafa, da al'adu daga Najeriya a Yanci TV."
        url="/bidiyo"
      />
      <GuardianNav />

      {/* Cinema Mode Hero */}
      <div className="relative bg-black" ref={heroRef}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Main Video Player Area */}
            <div className="lg:col-span-9">
              {isPlaying && youtubeId ? (
                <YouTubePlayer
                  videoId={youtubeId}
                  title={activeItem?.headline}
                  onClose={handleStopPlaying}
                />
              ) : (
                <div
                  className="relative aspect-video bg-black group cursor-pointer"
                  onClick={() => {
                    if (youtubeId) {
                      setIsPlaying(true);
                    }
                  }}
                >
                  <img
                    src={heroThumbnail}
                    alt={activeItem?.headline}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-1 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                      <FaPlay className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                        {youtubeId ? 'YouTube' : 'Kallo Yanzu'}
                      </span>
                      <span className="text-xs font-bold text-gray-400">{activeItem?.kicker || 'Yanci TV'}</span>
                    </div>
                    <h1 className="font-serif font-black text-3xl md:text-4xl text-white leading-tight max-w-4xl line-clamp-3">
                      {activeItem?.headline}
                    </h1>
                    {activeItem?.trail && (
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2 max-w-2xl">{activeItem.trail}</p>
                    )}
                    {!youtubeId && (
                      <p className="text-gray-500 text-xs mt-3 italic">
                        Babu hanyar bidiyo — ƙara videoUrl a cikin edita
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Up Next Playlist */}
            <div className="lg:col-span-3 bg-[#1c1917] border-l border-gray-800 max-h-[600px] overflow-y-auto">
              <div className="p-4 border-b border-gray-800 bg-[#262626] sticky top-0 z-10">
                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Na Gaba</h3>
              </div>
              <div className="divide-y divide-gray-800">
                {videoArticles.slice(0, 10).map((video) => (
                  <VideoCard
                    key={video.id}
                    article={video}
                    isActive={activeItem?.id === video.id}
                    onClick={() => handlePlay(video)}
                    size="playlist"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        {/* Category Filters */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <h2 className="font-serif font-black text-3xl text-white">Sabbin Bidiyo</h2>
          <div className="flex gap-4 text-sm font-bold text-gray-500">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`transition-colors pb-1 ${
                  activeCategory === cat
                    ? 'text-white border-b-2 border-red-600'
                    : 'hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoArticles.map((video) => (
            <VideoCard
              key={video.id}
              article={video}
              isActive={activeItem?.id === video.id}
              onClick={() => handlePlay(video)}
            />
          ))}
        </div>

        {/* Empty state */}
        {videoArticles.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <FaPlay size={40} className="mx-auto mb-4 opacity-30" />
            <p>Ba a sami bidiyo ba tukuna</p>
          </div>
        )}

        {/* How to add videos — editorial note */}
        <div className="mt-12 p-6 bg-[#1c1917] rounded-lg border border-gray-800">
          <h3 className="font-bold text-white mb-2">Yadda ake ƙara bidiyo</h3>
          <p className="text-gray-400 text-sm">
            Don ƙara bidiyo na YouTube, sanya hanyar YouTube a cikin filin <code className="text-yanci-accent bg-black/30 px-1 rounded">videoUrl</code> yayin ƙirƙira labari a edita.
            Misali: <code className="text-yanci-accent bg-black/30 px-1 rounded">https://youtu.be/VIDEO_ID</code>
          </p>
        </div>
      </main>

      <GuardianFooter />
    </div>
  );
};

export default BidiyoPage;
