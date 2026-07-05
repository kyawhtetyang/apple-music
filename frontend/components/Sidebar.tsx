
import React from 'react';
import {
  PlayCircle,
  LayoutGrid,
  Users,
  Music,
  Search,
  Radio as RadioIcon,
  Clock,
  Heart,
  ListMusic,
  Shuffle,
  Repeat,
  MoreHorizontal,
  List
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const NavLink = ({ view, icon: Icon, label }: { view: ViewMode; icon: any; label: string }) => {
    const active = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex items-center space-x-3 px-3 py-2 w-full rounded-lg transition-all ${active ? 'bg-[#fa233b] text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
      >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#fa233b]'}`} />
        <span className="font-semibold text-sm">{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 border-r border-black/5 dark:border-white/10 p-6 flex flex-col h-full bg-[#ebebeb] dark:bg-[#1c1c1e]/50 glass">
      <div className="mb-10 px-2 flex items-center space-x-2">
        <Music className="w-7 h-7 text-[#fa233b] fill-[#fa233b]" />
        <span className="text-xl font-bold tracking-tight">MusicApp</span>
      </div>

      <nav className="space-y-6">
        <div>
          <h2 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest px-3 mb-2">Apple Music</h2>
          <div className="space-y-1">
            <NavLink view={ViewMode.HOME} icon={PlayCircle} label="Listen Now" />
            <NavLink view={ViewMode.SEARCH} icon={LayoutGrid} label="Browse" />
            <NavLink view={ViewMode.RADIO} icon={RadioIcon} label="Radio" />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest px-3 mb-2">Library</h2>
          <div className="space-y-1">
            <NavLink view={ViewMode.RECENTLY_ADDED} icon={Clock} label="Recently Added" />
            <NavLink view={ViewMode.PLAYLISTS} icon={ListMusic} label="Playlists" />
            <NavLink view={ViewMode.ARTISTS} icon={Users} label="Artists" />
            <NavLink view={ViewMode.ALBUMS} icon={LayoutGrid} label="Albums" />
            <NavLink view={ViewMode.SONGS} icon={Music} label="Songs" />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest px-3 mb-2">My Collections</h2>
          <div className="space-y-1">
            <button
              onClick={() => setView(ViewMode.FAVORITES)}
              className={`flex items-center space-x-3 px-3 py-2 w-full rounded-lg transition-all group ${currentView === ViewMode.FAVORITES ? 'bg-[#fa233b] text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Heart className={`w-5 h-5 ${currentView === ViewMode.FAVORITES ? 'text-white' : 'text-[#fa233b]'}`} />
              <span className="font-semibold text-sm">All Favorites</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;




