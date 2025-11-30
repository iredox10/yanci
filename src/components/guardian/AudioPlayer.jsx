import React from 'react';
import { FaPlay, FaPause, FaXmark, FaVolumeHigh, FaVolumeXmark, FaTowerBroadcast } from 'react-icons/fa6';
import { useAudio } from '../../context/AudioContext';

const AudioPlayer = () => {
    const { isPlaying, currentTrack, isExpanded, togglePlay, closePlayer, volume, setVolume } = useAudio();

    if (!currentTrack) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="bg-[#1c1917] text-white border-t-4 border-[#c59d5f] shadow-2xl">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">

                    {/* Track Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-[#c59d5f] rounded-sm flex items-center justify-center shrink-0 animate-pulse">
                            <FaTowerBroadcast className="w-6 h-6 text-[#1c1917]" />
                        </div>
                        <div className="truncate">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c59d5f] bg-white/10 px-2 py-0.5 rounded-sm">
                                    Yanci FM
                                </span>
                                {isPlaying && (
                                    <span className="flex gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                )}
                            </div>
                            <h4 className="font-serif font-bold text-lg leading-none truncate">{currentTrack.title}</h4>
                            <p className="text-xs text-gray-400 truncate mt-1">{currentTrack.author || 'Yanci Live Broadcast'}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        {/* Volume Control (Hidden on mobile) */}
                        <div className="hidden md:flex items-center gap-2 group">
                            <button
                                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {volume === 0 ? <FaVolumeXmark /> : <FaVolumeHigh />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#c59d5f] [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 bg-white text-[#1c1917] rounded-full flex items-center justify-center hover:bg-[#c59d5f] transition-colors shadow-lg"
                        >
                            {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-1" />}
                        </button>

                        {/* Close */}
                        <button
                            onClick={closePlayer}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-transparent hover:border-gray-600 rounded-full"
                        >
                            <FaXmark className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
