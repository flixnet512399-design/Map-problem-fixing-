import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Wrench,
  BookOpen,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';
import { apiService } from '../services/api';

export const DeepSolveView: React.FC = () => {
  const { language, editor: globalEditor, t } = useSettings();
  const { activeProject, addSavedProblem } = useProjects();

  const [problemDescription, setProblemDescription] = useState('');
  const [editor, setEditor] = useState<string>(globalEditor);
  const [subsystem, setSubsystem] = useState('Collision & Physics');
  const [attemptedSolutions, setAttemptedSolutions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const subsystems = [
    'Collision & Physics',
    'Landscape & Terrain Heightmap',
    'Shaders & Landscape Materials',
    'Draw Calls & HISM / Foliage',
    'LODs & HLOD Generation',
    'Lighting & Lumen / Lightmass',
    'Cooking & Packaging Errors',
    'World Partition & Streaming',
    'Navigation Mesh & Pathing',
    'Loot & Vehicle Spawning Logic',
  ];

  const handleDeepSolve = async () => {
    if (!problemDescription.trim() || isLoading) return;

    setIsLoading(true);
    setErrorStatus(null);
    setSolution(null);

    try {
      const fullPrompt = `[DEEP PROBLEM SOLVE REQUEST]
Target Editor/Engine: ${editor}
Affected Subsystem: ${subsystem}
Problem Description:
"""
${problemDescription}
"""
What the user has already tried:
"""
${attemptedSolutions || 'None yet'}
"""
Please perform a full root-cause investigation, rank likely causes by probability, provide exact step-by-step editor button procedures, recommended parameters, a verification checklist, and a backup method.`;

      const projectContext = activeProject
        ? {
            name: activeProject.name,
            theme: activeProject.theme,
            size: activeProject.mapSize,
            notes: activeProject.notes,
          }
        : undefined;

      const res = await apiService.sendChat({
        messages: [{ role: 'user', text: fullPrompt }],
        language,
        isDeepThink: true,
        projectContext,
      });

      setSolution(res.reply);
    } catch (err: any) {
      console.error('Deep solve error:', err);
      setErrorStatus(err.message || 'Deep solve analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToProject = () => {
    if (!activeProject || !solution) return;
    addSavedProblem(
      activeProject.id,
      `[Deep Solve: ${subsystem}] ${problemDescription.slice(0, 80)}...`,
      solution
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-900 border border-cyan-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>ADVANCED ROOT-CAUSE DIAGNOSTICS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
            Deep Problem Solver
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
            Engineered for tough engine errors, collision anomalies, streaming overflows, and shader compilation failures. MapForge AI performs multi-tier causal reasoning to uncover root causes and alternative fallbacks.
          </p>
        </div>

        <div className="text-right hidden md:block">
          <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            ENGINE REASONING LEVEL: HIGH
          </span>
        </div>
      </div>

      {/* Input Formulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-4 rounded-xl p-5 bg-zinc-900/80 border border-zinc-800">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 font-['Chakra_Petch'] uppercase tracking-wider mb-1.5">
              1. Describe The Problem In Detail *
            </label>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g. Players fall through the terrain when driving a vehicle at speeds > 80km/h over landscape spline roads, or landscape shadows turn pitch black after light baking..."
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl p-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 font-['Chakra_Petch'] uppercase tracking-wider mb-1.5">
                Target Editor / Engine
              </label>
              <select
                value={editor}
                onChange={(e) => setEditor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="Unreal Engine 5">Unreal Engine 5 (World Partition / Nanite / Lumen)</option>
                <option value="Unreal Engine 4">Unreal Engine 4 (Standard Landscape & Lightmass)</option>
                <option value="PUBG WOW Editor">PUBG World of Wonder (WOW) Editor</option>
                <option value="Unity / Generic">Unity Engine / Generic BR Editor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 font-['Chakra_Petch'] uppercase tracking-wider mb-1.5">
                Affected Engine Subsystem
              </label>
              <select
                value={subsystem}
                onChange={(e) => setSubsystem(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                {subsystems.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 font-['Chakra_Petch'] uppercase tracking-wider mb-1.5">
              What Have You Already Tried? (Optional)
            </label>
            <input
              type="text"
              value={attemptedSolutions}
              onChange={(e) => setAttemptedSolutions(e.target.value)}
              placeholder="e.g. Rebuilding collision, clearing swarm cache, toggling Two Sided Foliage..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleDeepSolve}
              disabled={!problemDescription.trim() || isLoading}
              className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                problemDescription.trim() && !isLoading
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{t('analyzing')}</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Execute Deep Problem Solve</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Diagnosis Checklist Guide */}
        <div className="rounded-xl p-5 bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              What Deep Solve Delivers
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="font-semibold text-zinc-200 block mb-0.5">1. Root-Cause Breakdown</span>
                Underlying physics matrix, memory allocator, or shader pipeline trace.
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="font-semibold text-zinc-200 block mb-0.5">2. Ranked Probabilities</span>
                High, moderate, and low probability culprit factors.
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="font-semibold text-zinc-200 block mb-0.5">3. Exact Editor Button Paths</span>
                Precise navigation steps inside Unreal Engine / Map Editor panels.
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="font-semibold text-zinc-200 block mb-0.5">4. Verification & Fallback</span>
                Objective PIE tests plus alternative methods if primary fails.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            Active Map: <span className="text-amber-400 font-semibold">{activeProject?.name || 'Standard'}</span> ({activeProject?.mapSize || '4x4km'})
          </div>
        </div>
      </div>

      {/* Loading state bar */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-cyan-500/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="text-sm font-semibold text-cyan-300 font-mono">
            {t('analyzing')}
          </div>
          <p className="text-xs text-zinc-400 max-w-md">
            Analyzing {subsystem} logic in {editor}. Generating multi-cause probability ranking, parameters, and verification checklist.
          </p>
        </div>
      )}

      {/* Error state */}
      {errorStatus && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorStatus}</span>
          </div>
          <button
            onClick={handleDeepSolve}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800/60 text-white rounded text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Solution Output Card */}
      {solution && (
        <div className="rounded-2xl p-6 bg-zinc-900 border border-cyan-500/40 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="font-['Chakra_Petch'] font-bold text-base text-zinc-100 uppercase tracking-wide">
                Deep Problem Diagnosis & Solution
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Solution'}</span>
              </button>

              {activeProject && (
                <button
                  onClick={handleSaveToProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-xs text-cyan-300 transition"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved to Project' : 'Save to Project'}</span>
                </button>
              )}
            </div>
          </div>

          <div
            className={`prose prose-invert max-w-none text-xs md:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap ${
              language === 'ur' ? 'font-serif text-right leading-loose' : ''
            }`}
          >
            {solution}
          </div>
        </div>
      )}
    </div>
  );
};
