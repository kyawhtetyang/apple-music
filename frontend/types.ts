
export interface Artist {
  id: number;
  name: string;
  bio?: string;
  imageUrl?: string;
}

export interface Album {
  id: number;
  artistId: number;
  artistName: string;
  title: string;
  coverArt?: string;
  releaseYear?: number;
  genre?: string;
}

export interface Track {
  id: number;
  albumId: number;
  artistId: number;
  artistName: string;
  albumTitle: string;
  title: string;
  trackNumber: number;
  duration: number; // in seconds
  filename: string;
  bitrate?: number;
  genre?: string;
}

export interface Playlist {
  id: number;
  name: string;
  description: string;
  trackIds: number[];
}

export enum ViewMode {
  HOME = 'HOME', // Listen Now
  RECENTLY_ADDED = 'RECENTLY_ADDED',
  ARTISTS = 'ARTISTS',
  ALBUMS = 'ALBUMS',
  SONGS = 'SONGS',
  PLAYLISTS = 'PLAYLISTS',
  RADIO = 'RADIO',
  SEARCH = 'SEARCH',
  ALBUM_DETAIL = 'ALBUM_DETAIL',
  ARTIST_DETAIL = 'ARTIST_DETAIL',
  PLAYLIST_DETAIL = 'PLAYLIST_DETAIL',
  ARCHITECTURE = 'ARCHITECTURE',
  FAVORITES = 'FAVORITES'
}




