
import React from 'react';
import { Server, Database, Code, Shield, Cpu, Activity } from 'lucide-react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="mt-8 max-w-5xl mx-auto pb-20 prose prose-invert">
      <div className="bg-gradient-to-r from-green-900 to-black p-10 rounded-3xl mb-12 shadow-2xl border border-green-800/30">
        <h1 className="text-4xl font-black mb-4 flex items-center">
          <Server className="mr-4 w-10 h-10 text-green-500" />
          MusicApp System Architecture
        </h1>
        <p className="text-xl text-gray-300">
          Scaling local music playback to 100,000+ tracks with a production-grade
          Python (FastAPI) + React stack.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center text-green-400">
            <Database className="mr-3 w-6 h-6" />
            Database Schema (PostgreSQL)
          </h2>
          <div className="bg-[#111] p-6 rounded-xl border border-white/5 font-mono text-sm">
            <pre className="text-green-300">
{`-- Normalized for high-performance lookups
CREATE TABLE artists (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  bio TEXT,
  image_url TEXT
);

CREATE TABLE albums (
  id UUID PRIMARY KEY,
  artist_id UUID REFERENCES artists(id),
  title TEXT NOT NULL,
  release_year INT,
  cover_art TEXT
);

CREATE TABLE tracks (
  id UUID PRIMARY KEY,
  album_id UUID REFERENCES albums(id),
  artist_id UUID REFERENCES artists(id),
  title TEXT NOT NULL,
  track_number INT,
  duration INT, -- In seconds
  file_path TEXT UNIQUE, -- Indexed
  bitrate INT,
  genre TEXT
);`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-400">
            <Shield className="mr-3 w-6 h-6" />
            Module Responsibilities
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-900/40 p-2 rounded mr-3 mt-1"><Code className="w-4 h-4 text-blue-400" /></span>
              <div>
                <strong className="block text-white">Scanner Service (Background)</strong>
                <p className="text-sm text-gray-400">Recursively crawls dirs using OS event hooks. Idempotent hashing prevents duplicates.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-900/40 p-2 rounded mr-3 mt-1"><Cpu className="w-4 h-4 text-blue-400" /></span>
              <div>
                <strong className="block text-white">Metadata Extractor</strong>
                <p className="text-sm text-gray-400">Powered by <code>mutagen</code>. Handles MP3, FLAC, M4A with fallback to file-path parsing if tags missing.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-900/40 p-2 rounded mr-3 mt-1"><Activity className="w-4 h-4 text-blue-400" /></span>
              <div>
                <strong className="block text-white">Audio Streaming API</strong>
                <p className="text-sm text-gray-400">Chunked file streaming with Range requests support (important for seeking in browsers).</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-white/5 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Scalability Bottlenecks & Solutions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 underline decoration-yellow-500">Indexing Lag</h3>
            <p className="text-sm text-gray-400">
              100k tracks take time to parse.
              <br/><br/>
              <strong>Fix:</strong> Use a Producer-Consumer pattern with <code>Redis/Celery</code>. Filesystem watchers only trigger incremental scans.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2 underline decoration-yellow-500">Browser RAM</h3>
            <p className="text-sm text-gray-400">
              Rendering 10,000 tracks in a DOM table crashes browsers.
              <br/><br/>
              <strong>Fix:</strong> Use <code>react-window</code> for virtualization and server-side pagination for search.
            </p>
          </div>
        </div>
      </div>

      <div className="p-10 bg-[#050505] rounded-3xl border border-green-900/20">
        <h2 className="text-2xl font-bold mb-6 text-green-500">AI Enhancement Roadmap</h2>
        <p className="text-gray-400 mb-6">
          Phase 4 & 5 integration for "Smart Recommendations":
        </p>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/20">
              <span className="text-green-500 font-bold">01</span>
            </div>
            <div>
              <h4 className="font-bold text-white">Thematic Metadata Enrichment</h4>
              <p className="text-sm text-gray-400 italic">"Use Gemini to analyze track lyrics and artist bios to generate 'Mood' and 'Activity' tags automatically."</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/20">
              <span className="text-green-500 font-bold">02</span>
            </div>
            <div>
              <h4 className="font-bold text-white">Hybrid Recommendation Engine</h4>
              <p className="text-sm text-gray-400 italic">"Combine Collaborative Filtering (user history) with Content-Based Filtering (AI-derived genres) to create daily 'Local Mixes'."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;




