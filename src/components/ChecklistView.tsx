import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export const ChecklistView: React.FC = () => {
  const { activeProject, updateChecklistItem, calculateProgress } = useProjects();

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-zinc-500">
        No active project selected. Please choose or create a project first.
      </div>
    );
  }

  const progress = calculateProgress(activeProject);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>PRODUCTION QA MILESTONES</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
          Map Development Checklist
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
          Track production stages from initial concept and heightmap erosion through to draw call profiling and final circle playtesting.
        </p>

        {/* Progress Display Bar */}
        <div className="mt-5 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              Project Progress: {activeProject.name}
            </span>
            <span className="text-amber-400 font-bold text-sm">
              Project Progress: {progress}%
            </span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pt-1">
            <span>
              {activeProject.checklist.filter((i) => i.completed).length} of{' '}
              {activeProject.checklist.length} Milestones Checked
            </span>
            <span>Target: 100% QA Passed</span>
          </div>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-3">
        {activeProject.checklist.map((item, idx) => {
          return (
            <div
              key={item.id}
              onClick={() => updateChecklistItem(activeProject.id, item.id, !item.completed)}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between group ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  className="mt-0.5 text-zinc-400 group-hover:text-amber-400 transition shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs md:text-sm font-medium transition ${
                        item.completed ? 'text-zinc-200 line-through opacity-75' : 'text-zinc-100'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {item.category}
                    </span>
                  </div>
                  {item.tips && (
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      {item.tips}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono text-zinc-600 shrink-0 ml-3 mt-1">
                Phase {idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
