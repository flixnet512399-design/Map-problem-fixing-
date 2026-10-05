import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  Search,
  BookOpen,
  Video,
  FileCode2,
} from 'lucide-react';
import { ErrorSolution } from '../types';
import { apiService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';

interface ErrorSolverViewProps {
  onFindVideo: (topic: string) => void;
}

export const ErrorSolverView: React.FC<ErrorSolverViewProps> = ({ onFindVideo }) => {
  const { language, editor } = useSettings();
  const { activeProject, addSavedProblem } = useProjects();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<ErrorSolution | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const sampleErrors = [
    {
      label: 'Lightmass UV Overlap',
      text: 'Error: StaticMesh /Game/Environment/Meshes/SM_BridgeArch has overlapping UVs on Channel 1 by 19.4%. Lightmass will produce dark black shading seams.',
    },
    {
      label: 'World Partition Cell Overflow',
      text: 'WorldPartition: Error: Cell (X: 14, Y: -8) exceeds memory allocation threshold (148.2 MB / 128.0 MB max). Level streaming hitch detected.',
    },
    {
      label: 'Missing Collision Preset',
      text: 'Physics: Warning: StaticMeshActor_39 has collision enabled with NoCollision profile. Raycast traces will pass through geometry in game mode.',
    },
    {
      label: 'Texture Streaming Pool Limit',
      text: 'LogContentStreaming: Warning: Texture streaming pool overbudget by 420.50 MB! Total budgeted: 2000.00 MB, Requested: 2420.50 MB.',
    },
  ];

  const handleSolve = async (customError?: string) => {
    const errText = customError || errorMessage;
    if (!errText.trim() || isLoading) return;

    if (customError) setErrorMessage(customError);
    setIsLoading(true);
    setErrorStatus(null);
    setSolution(null);

    try {
      const res = await apiService.solveError({
        errorMessage: errText,
        editor,
        language,
      });
      setSolution(res);
    } catch (err: any) {
      console.error('Error solver error:', err);
      setErrorStatus(err.message || 'Failed to analyze error log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const text = `Error Category: ${solution.errorCategory}\nLikely Cause: ${solution.likelyCause}\nSeverity: ${solution.severity}\nFix Steps:\n${solution.fixSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\nRelated Docs: ${solution.relatedDocs}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToProject = () => {
    if (!activeProject || !solution) return;
    addSavedProblem(
      activeProject.id,
      `[${solution.errorCategory}] ${errorMessage.slice(0, 70)}...`,
      `Cause: ${solution.likelyCause}\nFix Steps:\n${solution.fixSteps.join('\n')}`
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ENGINE CRASH & LOG DIAGNOSTIC ENGINE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
          Error Log Solver
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
          Paste build logs, Lightmass cooking crash messages, collision warnings, or World Partition packaging errors to get immediate, actionable fixes.
        </p>
      </div>

      {/* Input box */}
      <div className="rounded-2xl p-5 bg-zinc-900 border border-zinc-800 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 font-['Chakra_Petch'] uppercase tracking-wider block">
          Paste your error message or log callstack here *
        </label>
        <textarea
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          placeholder="Paste error logs (e.g. 'LogOutputDevice: Error: PackagingResults: Error: Unknown Cook Failure...', 'Lightmass UV overlapping', etc.)"
          rows={5}
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/60 rounded-xl p-3 text-xs md:text-sm text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none transition resize-none leading-relaxed"
        />

        {/* Quick sample error chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-500">Quick test error logs:</span>
          {sampleErrors.map((sample) => (
            <button
              key={sample.label}
              onClick={() => handleSolve(sample.text)}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border border-zinc-800 transition"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleSolve()}
          disabled={!errorMessage.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-lg ${
            errorMessage.trim() && !isLoading
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 shadow-red-600/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
              <span>Analyzing stack trace & compiler logs...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Diagnose & Solve Error</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-red-500/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
          <div className="text-sm font-semibold text-red-300 font-mono">
            Classifying error severity & extracting root cause...
          </div>
        </div>
      )}

      {/* Error state */}
      {errorStatus && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-xs flex items-center justify-between">
          <span>{errorStatus}</span>
          <button
            onClick={() => handleSolve()}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800/60 text-white rounded text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Solution Output */}
      {solution && (
        <div className="rounded-2xl p-6 bg-zinc-900 border border-red-500/40 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${
                  solution.severity === 'Critical'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {solution.severity} SEVERITY
              </span>
              <span className="font-['Chakra_Petch'] font-bold text-base text-zinc-100">
                {solution.errorCategory}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySolution}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Solution'}</span>
              </button>

              {activeProject && (
                <button
                  onClick={handleSaveToProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900/80 border border-red-500/40 text-xs text-red-300 transition"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved to Project' : 'Save to Project Notes'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Likely Cause */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider block mb-1">
              Likely Underlying Cause
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {solution.likelyCause}
            </p>
          </div>

          {/* Step-by-Step Fix */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider block">
              Step-by-Step Resolution
            </span>
            <div className="space-y-2">
              {solution.fixSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Docs & Video Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-400 font-mono uppercase block mb-1">
                Related Documentation / Config
              </span>
              <p className="text-xs text-zinc-300 font-mono">
                {solution.relatedDocs}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 font-mono uppercase block mb-1">
                  Video Walkthrough Query
                </span>
                <p className="text-xs text-red-300 truncate max-w-[240px]">
                  "{solution.videoSearchQuery}"
                </p>
              </div>

              <button
                onClick={() => onFindVideo(solution.videoSearchQuery)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1 transition shrink-0"
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
};
