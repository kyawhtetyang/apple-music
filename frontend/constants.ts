
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.music.kyawhtet.com";

export const COLORS = {
  appleRed: '#fa233b',
  appleBlue: '#007aff',
  bgLight: '#f5f5f7',
  bgDark: '#000000',
  secondaryGray: '#86868b'
};

export const MOCK_ALBUMS = [
  { id: 1, artistId: 1, artistName: 'Pink Floyd', title: 'The Dark Side of the Moon', coverArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17', releaseYear: 1973, genre: 'Rock' },
  { id: 2, artistId: 2, artistName: 'Radiohead', title: 'Kid A', coverArt: 'https://images.unsplash.com/photo-1514525253361-bee8a187499b', releaseYear: 2000, genre: 'Electronic' },
];

export const MOCK_TRACKS = [
  { id: 1, albumId: 1, artistId: 1, artistName: 'Pink Floyd', albumTitle: 'The Dark Side of the Moon', title: 'Speak to Me', trackNumber: 1, duration: 65, filename: '#' },
  { id: 2, albumId: 1, artistId: 1, artistName: 'Pink Floyd', albumTitle: 'The Dark Side of the Moon', title: 'Breathe', trackNumber: 2, duration: 169, filename: '#' },
];



