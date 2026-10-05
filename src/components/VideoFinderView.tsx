import React, { useState } from 'react';
import {
  Video,
  Play,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Film,
  Compass,
  Layers,
} from 'lucide-react';
import { VideoResult } from '../types';
import { apiService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const VideoFinderView: React.FC = () => {
  const { editor } = useSettings();
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [directSearchUrl, setDirectSearchUrl] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [results, setResults] = useState<VideoResult[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const sampleVideoProblems = [
    'My building has no collision in custom map',
    'How to make auto slope landscape material with triplanar rock',
    'Unreal Engine 5 World Partition landscape streaming setup',
    'How to make road splines that deform terrain smoothly',
    'Foliage culling and draw calls optimization guide',
  ];

  const handleFindVideos = async (overrideProblem?: string) => {
    const p = (overrideProblem || problem).trim();
    if (!p || isLoading) return;

    if (overrideProblem) setProblem(overrideProblem);
    setIsLoading(true);
    setErrorStatus(null);
    setResults([]);
    setExplanation(null);

    try {
      const res = await apiService.findVideos(p, editor);
      setSearchQuery(res.searchQuery);
      setDirectSearchUrl(res.directSearchUrl);
      setExplanation(res.explanation);
      setResults(res.results || []);
    } catch (err: any) {
      console.error('Video finder error:', err);
      setErrorStatus(err.message || 'Failed to search for tutorial videos.');
    } finally {
      setIsLoading(false);
    }
  };

  const curatedPlaylists = [
    {
      title: 'PUBG WOW / Custom Map Level Design Masterclass',
      creator: 'Official Game Dev Channels',
      query: 'PUBG WOW custom map editor tutorial beginner to advanced',
      topics: 'Device triggers, boundary barriers, spawn points, combat flow',
    },
    {
      title: 'Unreal Engine 5 Open World Landscapes & Biomes',
      creator: 'Epic Games / Unreal Sensei',
      query: 'Unreal Engine 5 landscape tutorial auto material heightmap',
      topics: 'Heightmaps, triplanar auto-slope, erosion brushes, water rivers',
    },
    {
      title: 'Modular Building Kits & Accurate Collision Setup',
      creator: 'Environment Art Guild',
      query: 'Unreal Engine modular building collision custom UCX tutorial',
      topics: 'Simple box collision, window sills, stair landings, crouch peeking',
    },
    {
      title: 'Large Map Optimization: Draw Calls, HLODs & Nanite',
      creator: 'Technical Level Design Tech',
      query: 'Unreal Engine large map optimization HLOD draw calls HISM',
      topics: 'Instanced static meshes, distance culling, streaming pools',
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-2">
          <Film className="w-3.5 h-3.5" />
          <span>TUTORIAL & VIDEO DISCOVERY ENGINE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
          Find Tutorial Videos
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
          Describe any level design bottleneck or visual error. MapForge AI formulates an optimized technical video query and finds matching developer walkthroughs.
        </p>
      </div>

      {/* Input section */}
      <div className="space-y-3">
        <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-red-500/60 p-2 flex items-center gap-2 shadow-xl transition">
          <Video className="w-5 h-5 text-zinc-400 ml-2.5 shrink-0" />
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFindVideos();
            }}
            placeholder='e.g. "My building has no collision" or "How to create road splines"'
            className="w-full bg-transparent text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none px-2 py-1.5"
          />
          <button
            onClick={() => handleFindVideos()}
            disabled={!problem.trim() || isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition shrink-0 ${
              problem.trim() && !isLoading
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Find Video'}
          </button>
        </div>

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-400">Try common problems:</span>
          {sampleVideoProblems.map((sp) => (
            <button
              key={sp}
              onClick={() => handleFindVideos(sp)}
              className="text-xs px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border border-zinc-800 transition"
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-red-500/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
          <div className="text-sm font-semibold text-red-300 font-mono">
            Formulating precise query & querying video registries...
          </div>
        </div>
      )}

      {/* Error state */}
      {errorStatus && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-xs flex items-center justify-between">
          <span>{errorStatus}</span>
          <button
            onClick={() => handleFindVideos()}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800/60 text-white rounded text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Generated Search Query & Direct 1-Click Button */}
      {searchQuery && (
        <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
              Generated Targeted Search Query
            </span>
            <span className="font-mono text-xs text-amber-400 font-semibold">
              "{searchQuery}"
            </span>
          </div>

          <a
            href={directSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition shadow-md shadow-red-600/20 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch YouTube Search</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* AI Explanation / Context */}
      {explanation && (
        <div className="rounded-2xl p-5 bg-zinc-900/80 border border-zinc-800 text-xs md:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
          {explanation}
        </div>
      )}

      {/* Video / Tutorial Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-['Chakra_Petch'] font-semibold text-xs text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-red-400" />
            Found Video Guides & Tutorials ({results.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((video, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-red-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-red-400 mb-1">
                    <span>{video.creator}</span>
                    <span className="text-zinc-500">Video #{idx + 1}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-100 group-hover:text-red-300 transition line-clamp-2 mb-1.5">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3">
                    {video.whyItHelps}
                  </p>
                </div>

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-xs font-medium text-red-400 hover:text-red-300 pt-2 border-t border-zinc-800"
                >
                  <span className="flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Tutorial Video</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curated High-Impact Playlists */}
      <div className="space-y-3 pt-4 border-t border-zinc-800/80">
        <h2 className="font-['Chakra_Petch'] font-semibold text-xs text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          Recommended Core Curriculum Playlists
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {curatedPlaylists.map((pl) => (
            <div
              key={pl.title}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-amber-400 block mb-1">
                  {pl.creator}
                </span>
                <h3 className="text-xs font-semibold text-zinc-100 mb-1">
                  {pl.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mb-3">
                  Key Topics: {pl.topics}
                </p>
              </div>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(pl.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between text-xs font-medium text-zinc-300 hover:text-amber-400 pt-2 border-t border-zinc-800/80"
              >
                <span>Find Playlists on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
