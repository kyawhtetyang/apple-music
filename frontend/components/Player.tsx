import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  MoreHorizontal,
  List,
  Heart
} from 'lucide-react';
import { Track } from '../types';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  isShuffling: boolean;
  setIsShuffling: (shuffling: boolean) => void;
  repeatMode: 'none' | 'one' | 'all';
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const Player: React.FC<PlayerProps> = ({
  track,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrevious,
  isShuffling,
  setIsShuffling,
  repeatMode,
  setRepeatMode,
  isFavorite,
  onToggleFavorite
}) => {
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && track) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Playback prevented or failed:", e));
      }
    }
  }, [track]);

  // Handle play/pause toggles
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  if (!track || !track.filename) return null;

  // Use full R2 URL directly
  const streamUrl = track.filename;

  // Format time helper
  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(Math.max(x / rect.width, 0), 1);
      audioRef.current.currentTime = pct * duration;
    }
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setVolume(pct);
  };

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-20 md:h-24 !bg-[#ebebeb]/90 dark:!bg-[#1c1c1e]/90 glass border-t border-black/5 dark:border-white/5 z-50 px-4 md:px-6 flex items-center justify-between shadow-lg">
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      {/* Track Info */}
      <div className="flex items-center w-full md:w-1/3 min-w-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0 group relative cursor-pointer">
          <img
            src={track.coverArt || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3 md:ml-4 min-w-0 flex-1 md:flex-none pr-4 md:pr-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-[14px] md:text-[15px] font-bold leading-tight truncate">{track.title}</h3>
            <button onClick={onToggleFavorite} className="focus:outline-none hover:scale-110 transition-transform">
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#fa233b] text-[#fa233b]' : 'text-[#86868b]'}`} />
            </button>
          </div>
          <p className="text-[12px] md:text-[13px] text-[#86868b] leading-tight truncate">{track.artistName}</p>
        </div>

        {/* Mobile Quick Play */}
        <div className="flex items-center md:hidden space-x-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 text-black dark:text-white">
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <button onClick={onNext} className="p-2 text-black dark:text-white">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden md:flex flex-col items-center w-1/3">
        <div className="flex items-center space-x-8 mb-2">
          <button
            onClick={() => setIsShuffling(!isShuffling)}
            className={`transition-colors ${isShuffling ? 'text-[#fa233b]' : 'text-[#86868b] hover:text-[#fa233b]'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={onPrevious} className="text-black dark:text-white hover:scale-110 transition-transform">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-110 transition-transform shadow-sm"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <button onClick={onNext} className="text-black dark:text-white hover:scale-110 transition-transform">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={() => {
              if (repeatMode === 'none') setRepeatMode('all');
              else if (repeatMode === 'all') setRepeatMode('one');
              else setRepeatMode('none');
            }}
            className={`transition-colors relative ${repeatMode !== 'none' ? 'text-[#fa233b]' : 'text-[#86868b] hover:text-[#fa233b]'}`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-[#fa233b] text-white rounded-full w-3 h-3 flex items-center justify-center">1</span>}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-2 px-4 group">
          <span className="text-[10px] font-medium text-[#86868b] w-8 text-right">{formatTime(currentTime)}</span>
          <div onClick={handleSeek} className="flex-1 h-1 bg-black/10 dark:bg-white/20 rounded-full relative cursor-pointer">
            <div className="absolute top-0 left-0 h-full bg-black/40 dark:bg-white/60 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            <div className="absolute h-3 w-3 bg-white dark:bg-gray-300 rounded-full shadow-md top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
          </div>
          <span className="text-[10px] font-medium text-[#86868b] w-8">{duration ? `-${formatTime(duration - currentTime)}` : '0:00'}</span>
        </div>
      </div>

      {/* Volume & Utility */}
      <div className="hidden md:flex items-center justify-end w-1/3 space-x-4">
        <button className="text-[#86868b] hover:text-[#fa233b] transition-colors"><List className="w-5 h-5" /></button>
        <div className="flex items-center space-x-2 w-32">
          <Volume2 className="w-4 h-4 text-[#86868b]" />
          <div onClick={handleVolume} className="flex-1 h-1 bg-black/10 dark:bg-white/20 rounded-full relative group cursor-pointer">
            <div className="absolute top-0 left-0 h-full bg-[#fa233b] rounded-full group-hover:shadow-[0_0_8px_rgba(250,35,59,0.4)]" style={{ width: `${volume}%` }} />
          </div>
        </div>
        <button className="text-[#86868b] hover:text-[#fa233b] transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
      </div>
    </div>
  );
};

export default Player;


