import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    useEffect(() => {
        if (currentTrack) {
            audioRef.current.src = currentTrack.src;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
        }
    }, [currentTrack]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => {
                console.error("Playback failed:", e);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const playTrack = (track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
        setIsExpanded(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const closePlayer = () => {
        setIsPlaying(false);
        setIsExpanded(false);
        setTimeout(() => setCurrentTrack(null), 300); // Wait for animation
    };

    const value = {
        isPlaying,
        currentTrack,
        isExpanded,
        volume,
        setIsExpanded,
        setVolume,
        playTrack,
        togglePlay,
        closePlayer
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};
