import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  Globe,
  Sparkles,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { GroundingSource } from '../types';
import { apiService } from '../services/api';

export const AISearchView: React.FC = () => {
  const { language } = useSettings();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const sampleSearchQueries = [
    'Why is my custom map object floating?',
    'How can I optimize a large map?',
    'Why is my terrain texture not appearing?',
    'Unreal Engine 5 World Partition landscape streaming distance settings',
    'PUBG WOW custom map device trigger collision setup',
  ];

  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery || query).trim();
    if (!q || isLoading) return;

    if (overrideQuery) setQuery(overrideQuery);
    setIsLoading(true);
    setErrorStatus(null);
    setAnswer(null);
    setSources([]);

    try {
      const res = await apiService.searchAI(q, language);
      setAnswer(res.answer);
      setSources(res.sources || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorStatus(err.message || 'AI Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>OFFICIAL DEVELOPER DOCS & WEB GROUNDING</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
          AI Level Design Search
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
          Search across official Epic Games / Unreal Engine documentation, PUBG developer forums, and technical level design manuals with real-time web grounding and verified citations.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-blue-500/60 p-2 flex items-center gap-2 shadow-xl transition">
          <Search className="w-5 h-5 text-zinc-400 ml-2.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder='e.g. "Why is my custom map object floating?" or "How can I optimize a large map?"'
            className="w-full bg-transparent text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none px-2 py-1.5"
          />
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition shrink-0 ${
              query.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Quick query pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-400" /> Common queries:
          </span>
          {sampleSearchQueries.map((sq) => (
            <button
              key={sq}
              onClick={() => handleSearch(sq)}
              className="text-xs px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-blue-300 border border-zinc-800 transition"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-blue-500/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <div className="text-sm font-semibold text-blue-300 font-mono">
            Searching official documentation & technical guides...
          </div>
          <p className="text-xs text-zinc-400 max-w-md">
            Grounded in real-world documentation for Unreal Engine, World Partition, and Battle Royale map workflows.
          </p>
        </div>
      )}

      {/* Error state */}
      {errorStatus && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorStatus}</span>
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800/60 text-white rounded text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search Result & Sources */}
      {answer && (
        <div className="space-y-6">
          {/* Main Answer Card */}
          <div className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h2 className="font-['Chakra_Petch'] font-semibold text-sm text-zinc-100 uppercase tracking-wide">
                  Technical Answer & Best Practices
                </h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                AI Search Synthesis
              </span>
            </div>

            <div
              className={`prose prose-invert max-w-none text-xs md:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap ${
                language === 'ur' ? 'font-serif text-right leading-loose' : ''
              }`}
            >
              {answer}
            </div>
          </div>

          {/* Sources List with Real Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-['Chakra_Petch'] font-semibold text-xs text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                Grounding Sources & Official References ({sources.length})
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Real Verified Links
              </span>
            </div>

            {sources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 mb-1">
                        <span className="truncate">{source.domain}</span>
                        <span className="text-zinc-500">Ref #{idx + 1}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-blue-300 transition line-clamp-2 mb-1.5">
                        {source.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3">
                        {source.snippet || 'Official developer guide and technical reference.'}
                      </p>
                    </div>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between text-xs font-medium text-blue-400 hover:text-blue-300 pt-2 border-t border-zinc-800"
                    >
                      <span>Open Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <span>Synthesis generated from internal technical level design manuals.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
