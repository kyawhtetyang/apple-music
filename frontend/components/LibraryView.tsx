
import React, { useState, useEffect, useMemo } from 'react';
import { Album, Track } from '../types';
import { Play, Heart } from 'lucide-react';

interface LibraryViewProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
  onPlayTrack: (track: Track, fromQueue?: Track[]) => void;
  currentTrackId?: number;
  initialFilter?: string;
  favoriteIds?: number[];
}

const LibraryView: React.FC<LibraryViewProps> = ({ albums, onAlbumClick, onPlayTrack, currentTrackId, initialFilter, favoriteIds = [] }) => {
  const [filter, setFilter] = useState(initialFilter || 'Albums');

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  const categories = ['Playlists', 'Artists', 'Albums', 'Songs', 'Favorites'];

  const allTracks = useMemo(() => {
    const tracks: Track[] = [];
    albums.forEach(album => {
      if (album.tracks) {
        album.tracks.forEach(track => {
          tracks.push({
            ...track,
            albumTitle: album.title,
            coverArt: album.coverArt
          } as any);
        });
      }
    });
    return tracks;
  }, [albums]);

  const favoriteTracks = useMemo(() => {
    return allTracks.filter(track => favoriteIds.includes(track.id));
  }, [allTracks, favoriteIds]);

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-8">{filter}</h1>

      <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === cat
              ? 'bg-[#fa233b] text-white shadow-md'
              : 'bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/20'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filter === 'Songs' || filter === 'Favorites' ? (
        <div className="flex flex-col space-y-1">
          {(filter === 'Favorites' ? favoriteTracks : allTracks).map((track, idx) => {
            const active = currentTrackId === track.id;
            const isFav = favoriteIds.includes(track.id);
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, filter === 'Favorites' ? favoriteTracks : allTracks)}
                className={`group flex items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${active ? 'bg-black/5 dark:bg-white/10' : ''}`}
              >
                <div className="w-10 h-10 rounded overflow-hidden mr-4 flex-shrink-0 relative">
                  <img src={track.coverArt || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm flex items-center space-x-2 ${active ? 'text-[#fa233b]' : ''}`}>
                    <span className="truncate">{track.title}</span>
                    {isFav && <Heart className="w-3 h-3 fill-[#fa233b] text-[#fa233b] flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-[#86868b] truncate">{track.artistName} — {track.albumTitle}</div>
                </div>
                <div className="text-xs text-[#86868b] ml-4 font-medium">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}
          {filter === 'Favorites' && favoriteTracks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-[#86868b]">
              <div className="bg-black/5 dark:bg-white/5 p-8 rounded-full mb-4">
                <Heart className="w-12 h-12 opacity-20" />
              </div>
              <p className="font-bold">No Favorites Yet</p>
              <p className="text-sm">Songs you heart will appear here.</p>
            </div>
          )}
        </div>
      ) : filter === 'Playlists' ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#86868b]">
          <div className="bg-black/5 dark:bg-white/5 p-8 rounded-full mb-4">
            <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          </div>
          <p className="font-bold">No Playlists Yet</p>
          <p className="text-sm">Your custom playlists will appear here.</p>
        </div>
      ) : filter === 'Artists' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from(new Set(albums.map(a => a.artistName))).map(name => (
            <div key={name} className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 shadow-md flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-bold text-gray-400 group-hover:scale-110 transition-transform duration-500">{name[0]}</span>
              </div>
              <span className="font-bold text-sm md:text-base group-hover:text-[#fa233b] transition-colors">{name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
          {albums.map(album => (
            <div
              key={album.id}
              onClick={() => onAlbumClick(album)}
              className="group cursor-pointer flex flex-col space-y-2 md:space-y-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] group-hover:scale-[1.02] transition-transform duration-300">
                <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Play className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
              <div className="flex flex-col px-1">
                <span className="font-semibold text-[13px] md:text-[15px] leading-tight truncate group-hover:text-[#fa233b] transition-colors">{album.title}</span>
                <span className="text-[#86868b] text-[12px] md:text-[14px] leading-tight truncate">{album.artistName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;


