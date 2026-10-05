import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Video,
  ChevronRight,
  Sparkles,
  Trophy,
  ArrowRight,
  ListChecks,
  Compass,
  Mountain,
  Route,
  Building2,
  Box,
  Activity,
  Crosshair,
  Sun,
  Gauge,
  Bug,
  Crown,
} from 'lucide-react';
import { ACADEMY_MODULES } from '../data/academyData';
import { AcademyModule } from '../types';
import { NavTab } from './Sidebar';

interface AcademyViewProps {
  onNavigateToTab: (tab: NavTab) => void;
  onAskAi: (topic: string) => void;
  onFindVideo: (topic: string) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  onNavigateToTab,
  onAskAi,
  onFindVideo,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [completedModules, setCompletedModules] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mapforge_completed_modules');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  const activeModule = ACADEMY_MODULES.find((m) => m.id === selectedModuleId) || ACADEMY_MODULES[0];

  const handleSelectModule = (id: number) => {
    setSelectedModuleId(id);
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);
  };

  const handleQuizSubmit = (correctIndex: number) => {
    if (selectedQuizAnswer === null) return;
    setIsQuizSubmitted(true);
    if (selectedQuizAnswer === correctIndex) {
      if (!completedModules.includes(activeModule.id)) {
        const next = [...completedModules, activeModule.id];
        setCompletedModules(next);
        localStorage.setItem('mapforge_completed_modules', JSON.stringify(next));
      }
    }
  };

  const iconMap: Record<string, React.ElementType> = {
    Compass,
    Mountain,
    Route,
    Building2,
    Box,
    Activity,
    Crosshair,
    Sun,
    Gauge,
    Bug,
    Crown,
  };

  const ActiveIcon = iconMap[activeModule.iconName] || BookOpen;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-950/40 via-zinc-900 to-zinc-900 border border-yellow-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>CURRICULUM • 11 PROFESSIONAL MODULES</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
            Map Creation Academy
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
            Master the complete end-to-end level design pipeline for battle royale maps. Study terrain heightmaps, sightline control, modular collision, performance profiling, and competitive game flow.
          </p>
        </div>

        {/* Progress badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 shrink-0">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">
              Academy Progress
            </span>
            <span className="text-sm font-bold text-yellow-400 font-mono">
              {completedModules.length} / {ACADEMY_MODULES.length} Complete
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules list on left (1 col), content on right (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module navigation list */}
        <div className="lg:col-span-4 space-y-2">
          <div className="px-1 text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-2">
            Course Modules
          </div>

          <div className="space-y-1.5 max-h-[750px] overflow-y-auto pr-1">
            {ACADEMY_MODULES.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              const isCompleted = completedModules.includes(mod.id);
              const ModIcon = iconMap[mod.iconName] || BookOpen;

              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                        isSelected
                          ? 'bg-yellow-500 text-zinc-950'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {mod.id}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-zinc-200 truncate group-hover:text-yellow-300 transition">
                        {mod.title.replace(`Module ${mod.id}: `, '')}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {mod.subtitle}
                      </div>
                    </div>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Module Detail View */}
        <div className="lg:col-span-8 space-y-6">
          {/* Module Title Card */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest block font-bold">
                    MODULE {activeModule.id} OF 11
                  </span>
                  <h2 className="text-xl md:text-2xl font-['Chakra_Petch'] font-bold text-white">
                    {activeModule.title.replace(`Module ${activeModule.id}: `, '')}
                  </h2>
                </div>
              </div>

              {/* Action Buttons: Ask AI & Find Tutorial */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAskAi(`I am studying ${activeModule.title}. Can you explain advanced best practices?`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-400 border border-zinc-700 transition"
                  title="Ask AI Assistant about this module"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => onFindVideo(`${activeModule.title.replace(`Module ${activeModule.id}: `, '')} level design tutorial`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-red-400 border border-zinc-700 transition"
                  title="Find tutorial videos on this topic"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Find Tutorial</span>
                </button>
              </div>
            </div>

            {/* Beginner explanation */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider font-mono mb-1.5">
                Core Concept
              </h3>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                {activeModule.beginnerExplanation}
              </p>
            </div>

            {/* Step by step lesson */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-yellow-500" />
                Step-by-Step Level Design Workflow
              </h3>

              <div className="space-y-2">
                {activeModule.stepByStepLesson.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80 text-xs text-zinc-200 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical task */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Hands-on Practical Task</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeModule.practicalTask}
              </p>
            </div>

            {/* Common Mistakes & Troubleshooting Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Common mistakes */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <span className="text-xs font-semibold text-red-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Common Pitfalls
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {activeModule.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Troubleshooting */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <span className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Troubleshooting Tips
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {activeModule.troubleshooting.map((tb, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{tb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Knowledge Check Quiz */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-yellow-500/30 space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-yellow-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Module Knowledge Check
                </span>
                {completedModules.includes(activeModule.id) && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Module Mastered
                  </span>
                )}
              </div>

              <div className="text-xs md:text-sm font-medium text-zinc-100">
                {activeModule.quiz.question}
              </div>

              <div className="space-y-2">
                {activeModule.quiz.options.map((opt, idx) => {
                  let optStyle = 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300';
                  if (isQuizSubmitted) {
                    if (idx === activeModule.quiz.correctIndex) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium';
                    } else if (idx === selectedQuizAnswer) {
                      optStyle = 'bg-red-950/60 border-red-500 text-red-200';
                    }
                  } else if (selectedQuizAnswer === idx) {
                    optStyle = 'bg-yellow-500/10 border-yellow-500 text-yellow-300';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isQuizSubmitted && setSelectedQuizAnswer(idx)}
                      disabled={isQuizSubmitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] shrink-0 font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {!isQuizSubmitted ? (
                <button
                  onClick={() => handleQuizSubmit(activeModule.quiz.correctIndex)}
                  disabled={selectedQuizAnswer === null}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                    selectedQuizAnswer !== null
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950 shadow-md shadow-yellow-500/20'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <div
                  className={`p-3.5 rounded-xl text-xs space-y-1 border ${
                    selectedQuizAnswer === activeModule.quiz.correctIndex
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {selectedQuizAnswer === activeModule.quiz.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct! Module Marked Complete.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Not quite right. Review the explanation below:</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    {activeModule.quiz.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
