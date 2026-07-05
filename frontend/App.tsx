import React, { useState, useMemo, useEffect } from 'react';
import { Home, Search, Clock, ChevronLeft, PlayCircle, LayoutGrid, Play } from 'lucide-react';
import { ViewMode, Album, Track } from './types';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import AlbumDetailView from './components/AlbumDetailView';
import LibraryView from './components/LibraryView';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.music.kyawhtet.com";

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [viewStack, setViewStack] = useState<ViewMode[]>([ViewMode.HOME]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorite_tracks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorite_tracks', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Fetch albums with tracks
  useEffect(() => {
    fetch(`${API_BASE_URL}/albums-with-tracks`)
      .then(res => res.json())
      .then(data => {
        const mappedAlbums: Album[] = data.map((a: any) => {
          const coverArt = a.cover.startsWith('http') ? a.cover : `${API_BASE_URL}${a.cover}`;
          return {
            id: a.id,
            artistId: 1,
            artistName: 'Local Artist',
            title: a.name,
            coverArt: coverArt,
            tracks: a.tracks?.map((t: any) => ({
              id: t.track_id,
              title: t.name,
              filename: `${API_BASE_URL}/stream/${t.track_id}`,
              duration: t.duration || 180,
              trackNumber: t.track_id,
              artistName: 'Local Artist',
              coverArt: coverArt
            }))
          };
        });

        setAlbums(mappedAlbums);
      })
      .catch(err => {
        console.error("Failed to fetch albums:", err);
      });
  }, []);

  // Tracks for selected album
  const tracks = useMemo(() => {
    if (selectedAlbum?.tracks) return selectedAlbum.tracks;
    return [];
  }, [selectedAlbum]);

  // Navigation
  const navigateTo = (newView: ViewMode, album: Album | null = null) => {
    if (album) setSelectedAlbum(album);
    setView(newView);
    setViewStack(prev => [...prev, newView]);
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      const newStack = [...viewStack];
      newStack.pop();
      setView(newStack[newStack.length - 1]);
    }
  };

  const handleAlbumClick = (album: Album) => navigateTo(ViewMode.ALBUM_DETAIL, album);

  const playTrack = (track: Track, fromQueue: Track[] = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (fromQueue.length > 0) {
      setQueue(fromQueue);
    } else if (selectedAlbum?.tracks) {
      setQueue(selectedAlbum.tracks);
    }
  };

  const handleNext = () => {
    if (!currentTrack || queue.length === 0) return;

    if (repeatMode === 'one') {
      // Re-trigger play of same track
      const t = { ...currentTrack };
      setCurrentTrack(null);
      setTimeout(() => setCurrentTrack(t), 10);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let nextIndex = currentIndex + 1;

    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    if (nextIndex < queue.length) {
      setCurrentTrack(queue[nextIndex]);
    } else if (repeatMode === 'all') {
      setCurrentTrack(queue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      setCurrentTrack(queue[prevIndex]);
    } else if (repeatMode === 'all') {
      setCurrentTrack(queue[queue.length - 1]);
    }
  };

  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return albums;
    const q = searchQuery.toLowerCase();
    return albums.filter(
      a => a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q)
    );
  }, [albums, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#f5f5f7] dark:bg-black overflow-hidden select-none">
      <div className="hidden md:block">
        <Sidebar currentView={view} setView={(v) => navigateTo(v)} />
      </div>

      <main className="flex-1 flex flex-col relative overflow-y-auto pb-48 md:pb-32">
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 md:p-6 !bg-[#d8d8d8]/85 dark:!bg-[#1c1c1e]/85 glass border-b border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-3 md:space-x-6">
            <button
              onClick={goBack}
              disabled={viewStack.length <= 1}
              className={`p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors ${viewStack.length <= 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft className="w-5 h-5 text-[#fa233b]" />
            </button>

            <div className="relative group max-w-[200px] md:max-w-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#fa233b] transition-colors" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (view !== ViewMode.SEARCH) navigateTo(ViewMode.SEARCH);
                }}
                className="bg-black/5 dark:bg-white/10 border-none rounded-lg pl-9 pr-4 py-1.5 text-sm w-full md:w-64 focus:ring-1 focus:ring-[#fa233b] transition-all outline-none"
              />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {view === ViewMode.HOME && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-8">Listen Now</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
                {albums.slice(0, 6).map(album => (
                  <AlbumItem key={album.id} album={album} onClick={() => handleAlbumClick(album)} />
                ))}
              </div>
            </div>
          )}

          {view === ViewMode.SEARCH && (
            <div className="animate-in fade-in duration-500">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-8">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse'}
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
                {filteredAlbums.map(album => (
                  <AlbumItem key={album.id} album={album} onClick={() => handleAlbumClick(album)} />
                ))}
              </div>
            </div>
          )}

          {view === ViewMode.ALBUM_DETAIL && selectedAlbum && (
            <AlbumDetailView
              album={selectedAlbum}
              tracks={tracks}
              currentTrackId={currentTrack?.id}
              onPlayTrack={playTrack}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
            />
          )}

          {view === ViewMode.FAVORITES && (
            <LibraryView
              albums={albums}
              onAlbumClick={handleAlbumClick}
              onPlayTrack={playTrack}
              currentTrackId={currentTrack?.id}
              initialFilter="Favorites"
              favoriteIds={favoriteIds}
            />
          )}

          {(view === ViewMode.ARTISTS || view === ViewMode.ALBUMS || view === ViewMode.SONGS || view === ViewMode.PLAYLISTS || view === ViewMode.RECENTLY_ADDED) && (
            <LibraryView
              albums={albums}
              onAlbumClick={handleAlbumClick}
              onPlayTrack={playTrack}
              currentTrackId={currentTrack?.id}
              favoriteIds={favoriteIds}
              initialFilter={
                view === ViewMode.ARTISTS
                  ? 'Artists'
                  : view === ViewMode.SONGS
                    ? 'Songs'
                    : view === ViewMode.PLAYLISTS
                      ? 'Playlists'
                      : 'Albums'
              }
            />
          )}
        </div>
      </main>

      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isShuffling={isShuffling}
        setIsShuffling={setIsShuffling}
        repeatMode={repeatMode}
        setRepeatMode={setRepeatMode}
        isFavorite={currentTrack ? favoriteIds.includes(currentTrack.id) : false}
        onToggleFavorite={() => currentTrack && toggleFavorite(currentTrack.id)}
      />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 !bg-[#ebebeb]/90 dark:!bg-[#1c1c1e]/90 glass border-t border-black/5 dark:border-white/10 z-[60] flex items-center justify-around h-16 pb-safe">
        <MobileNavItem view={ViewMode.HOME} label="Listen Now" active={view === ViewMode.HOME} onClick={() => navigateTo(ViewMode.HOME)} />
        <MobileNavItem view={ViewMode.SEARCH} label="Browse" active={view === ViewMode.SEARCH} onClick={() => navigateTo(ViewMode.SEARCH)} />
        <MobileNavItem view={ViewMode.FAVORITES} label="Favorites" active={view === ViewMode.FAVORITES} onClick={() => navigateTo(ViewMode.FAVORITES)} />
        <MobileNavItem view={ViewMode.RECENTLY_ADDED} label="Library" active={view === ViewMode.RECENTLY_ADDED} onClick={() => navigateTo(ViewMode.RECENTLY_ADDED)} />
      </nav>
    </div>
  );
};

const MobileNavItem: React.FC<{ label: string; active: boolean; onClick: () => void; view: ViewMode }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 flex-1 transition-colors ${active ? 'text-[#fa233b]' : 'text-gray-500 dark:text-gray-400'}`}
  >
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const AlbumItem: React.FC<{ album: Album; onClick: () => void }> = ({ album, onClick }) => (
  <div onClick={(e) => { e.preventDefault(); onClick(); }} className="group cursor-pointer flex flex-col space-y-2 md:space-y-3">
    <div className="relative aspect-square overflow-hidden rounded-xl shadow-md group-hover:scale-[1.02] transition-transform duration-300">
      <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <Play className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    </div>
    <div className="flex flex-col px-1">
      <span className="font-semibold text-[13px] md:text-[15px] truncate">{album.title}</span>
      <span className="text-[#86868b] text-[12px] md:text-[14px] truncate">{album.artistName}</span>
    </div>
  </div>
);

export default App;

