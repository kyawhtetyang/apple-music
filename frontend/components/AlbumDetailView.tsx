
import React from 'react';
import { Play, Shuffle, MoreHorizontal, Heart, Share, Download } from 'lucide-react';
import { Album, Track } from '../types';

interface AlbumDetailViewProps {
  album: Album;
  tracks: Track[];
  currentTrackId?: number;
  onPlayTrack: (track: Track, fromQueue?: Track[]) => void;
  favoriteIds?: number[];
  toggleFavorite: (id: number) => void;
}

const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album,
  tracks,
  currentTrackId,
  onPlayTrack,
  favoriteIds = [],
  toggleFavorite
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start mb-10 md:mb-12">
        {/* Large Artwork */}
        <div className="w-56 h-56 md:w-80 md:h-80 flex-shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.15)] md:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden group">
          <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-1">{album.title}</h1>
          <h2 className="text-lg md:text-2xl font-bold text-[#fa233b] hover:underline cursor-pointer mb-2">{album.artistName}</h2>
          <p className="text-[#86868b] font-semibold text-xs md:text-sm mb-6 uppercase tracking-wider">
            {album.genre} • {album.releaseYear}
          </p>

          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
            <button
              onClick={() => onPlayTrack(tracks[0], tracks)}
              className="flex items-center space-x-2 bg-[#fa233b] hover:bg-[#ff3b4e] text-white px-6 md:px-8 py-2 md:py-2.5 rounded-lg font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all text-sm md:text-base"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play</span>
            </button>
            <button className="flex items-center space-x-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-6 md:px-8 py-2 md:py-2.5 rounded-lg font-bold active:scale-95 transition-all text-sm md:text-base">
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="w-full overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 text-[10px] md:text-[11px] font-bold text-[#86868b] uppercase tracking-widest">
              <th className="px-2 md:px-4 py-3 w-8 md:w-12 text-center">#</th>
              <th className="px-2 md:px-4 py-3">Song</th>
              <th className="px-2 md:px-4 py-3 text-right">Time</th>
              <th className="px-2 md:px-4 py-3 w-8 md:w-12"></th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, idx) => {
              const active = currentTrackId === track.id;
              const isFav = favoriteIds.includes(track.id);
              return (
                <tr
                  key={track.id}
                  className={`group border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${active ? 'bg-black/5 dark:bg-white/10' : ''}`}
                >
                  <td
                    onClick={() => onPlayTrack(track, tracks)}
                    className={`px-2 md:px-4 py-4 text-center text-xs md:text-sm font-semibold ${active ? 'text-[#fa233b]' : 'text-[#86868b]'}`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    onClick={() => onPlayTrack(track, tracks)}
                    className="px-2 md:px-4 py-4 min-w-0"
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`text-[14px] md:text-[15px] font-semibold truncate ${active ? 'text-[#fa233b]' : ''}`}>{track.title}</span>
                      {isFav && <Heart className="w-3 h-3 fill-[#fa233b] text-[#fa233b] flex-shrink-0" />}
                    </div>
                  </td>
                  <td
                    onClick={() => onPlayTrack(track, tracks)}
                    className="px-2 md:px-4 py-4 text-right text-xs md:text-sm font-medium text-[#86868b] whitespace-nowrap"
                  >
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </td>
                  <td className="px-2 md:px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
                      className="p-1.5 md:opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-all"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-[#fa233b] text-[#fa233b]' : 'text-[#86868b]'}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 text-[10px] md:text-xs text-[#86868b] font-medium uppercase tracking-widest px-4 text-center md:text-left">
          {tracks.length} Songs • Total Time: {Math.floor(tracks.reduce((a, b) => a + b.duration, 0) / 60)} Minutes
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailView;




