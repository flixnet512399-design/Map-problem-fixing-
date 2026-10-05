import React, { useState } from 'react';
import {
  Wrench,
  Search,
  AlertTriangle,
  CheckCircle2,
  Video,
  MessageSquare,
  HelpCircle,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TROUBLESHOOTING_DATABASE } from '../data/troubleshootingData';
import { TroubleshootingItem } from '../types';

interface TroubleshootingViewProps {
  onAskAi: (prompt: string) => void;
  onFindVideo: (topic: string) => void;
}

export const TroubleshootingView: React.FC<TroubleshootingViewProps> = ({
  onAskAi,
  onFindVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(TROUBLESHOOTING_DATABASE[0].id);

  const categories = [
    'All',
    'Terrain',
    'Objects',
    'Buildings',
    'Collision',
    'Lighting',
    'Textures',
    'Performance',
    'Loading',
    'Errors',
    'Gameplay',
    'UI',
    'Navigation',
  ];

  const filteredItems = TROUBLESHOOTING_DATABASE.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.problem.toLowerCase().includes(q) ||
      item.likelyCause.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.fix.some((step) => step.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-900 border border-orange-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono mb-2">
          <Wrench className="w-3.5 h-3.5" />
          <span>KNOWLEDGE BASE & FIX REGISTRY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
          Troubleshooting Center
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
          Instant solutions for common map creation defects: terrain seam tearing, missing building collision, lightmap bake shadows, streaming memory overflows, and foliage cull distance bugs.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-orange-500/60 p-2 flex items-center gap-2 shadow-lg">
          <Search className="w-5 h-5 text-zinc-400 ml-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by keyword (e.g. collision, lightmap, draw calls, terrain, crash)..."
            className="w-full bg-transparent text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none px-2 py-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* 12 Categories Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-zinc-950 font-bold shadow-md shadow-orange-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono px-1">
        <span>Showing {filteredItems.length} documented solutions</span>
        <span>Category: {selectedCategory}</span>
      </div>

      {/* Problems Accordion List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const severityColors = {
            Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
            Warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            Moderate: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          };

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden transition duration-200 hover:border-zinc-700 shadow-sm"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 md:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      severityColors[item.severity]
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.category}
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-semibold text-zinc-100 text-xs md:text-sm">
                    {item.problem}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-zinc-800/80 text-xs text-zinc-300">
                  {/* Likely Cause */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                    <span className="font-semibold text-amber-400 font-mono uppercase tracking-wider block mb-1">
                      Likely Cause
                    </span>
                    <p className="text-zinc-300 leading-relaxed">{item.likelyCause}</p>
                  </div>

                  {/* Primary Fix */}
                  <div className="space-y-2">
                    <span className="font-semibold text-emerald-400 font-mono uppercase tracking-wider block">
                      Primary Step-by-Step Fix
                    </span>
                    <div className="space-y-1.5">
                      {item.fix.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-200 flex items-start gap-2.5"
                        >
                          <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alternative Fix */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                    <span className="font-semibold text-cyan-400 font-mono uppercase tracking-wider block mb-1">
                      Alternative Solution If Primary Fails
                    </span>
                    <p className="text-zinc-300 leading-relaxed">{item.alternativeFix}</p>
                  </div>

                  {/* How to test & prevention */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                      <span className="font-semibold text-zinc-300 font-mono uppercase block mb-1">
                        How To Verify / Test
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {item.howToTest}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                      <span className="font-semibold text-zinc-300 font-mono uppercase block mb-1">
                        Prevention Strategy
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {item.prevention}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: Ask AI & Find Video */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500">
                      ID: {item.id} • Verified Workflow
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onAskAi(`I have this problem: "${item.problem}". Cause: ${item.likelyCause}. Can you help me adapt this solution for my map?`)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-medium transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Ask AI Assistant</span>
                      </button>

                      <button
                        onClick={() =>
                          onFindVideo(`${item.problem} tutorial fix`)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 font-medium transition"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Find Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-zinc-200 text-sm">No Documented Problems Found</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              No existing article matches your search "{searchQuery}". You can paste your exact error in the Error Solver or ask MapForge AI directly.
            </p>
            <button
              onClick={() => onAskAi(`Help me troubleshoot: ${searchQuery}`)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
            >
              Ask MapForge AI To Diagnose
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
