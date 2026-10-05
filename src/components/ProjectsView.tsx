import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ExternalLink,
  Edit2,
  Save,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { Project } from '../types';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    calculateProgress,
  } = useProjects();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMapSize, setNewMapSize] = useState<Project['mapSize']>('4x4km');
  const [newTheme, setNewTheme] = useState('Desert Canyon');
  const [newPlayers, setNewPlayers] = useState(64);
  const [newNotes, setNewNotes] = useState('');

  // Active project notes editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(activeProject?.notes || '');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createProject({
      name: newName,
      description: newDesc,
      mapSize: newMapSize,
      theme: newTheme,
      targetPlayers: newPlayers,
      notes: newNotes,
    });

    setNewName('');
    setNewDesc('');
    setNewNotes('');
    setShowCreateModal(false);
  };

  const handleSaveNotes = () => {
    if (!activeProject) return;
    updateProject(activeProject.id, { notes: notesDraft });
    setIsEditingNotes(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>PROJECT REPOSITORY & PERSISTENCE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
            Level Design Workspaces
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
            Store map specifications, design bibles, checklist milestones, AI solutions, and 2D canvas layouts. All projects persist in your browser database.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Map Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isActive = proj.id === activeProjectId;
          const prog = calculateProgress(proj);

          return (
            <div
              key={proj.id}
              onClick={() => {
                setActiveProjectId(proj.id);
                setNotesDraft(proj.notes);
              }}
              className={`p-5 rounded-2xl border transition duration-200 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-zinc-900 border-amber-500/60 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700 font-semibold">
                    {proj.mapSize}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="font-['Chakra_Petch'] font-bold text-base text-zinc-100 mb-1 line-clamp-1">
                  {proj.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                  {proj.description || 'Level design conceptual map.'}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Progress</span>
                    <span className="text-amber-400 font-bold">{prog}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                </div>

                {/* Metadata badges */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/80 mb-3">
                  <div>Theme: {proj.theme}</div>
                  <div>Players: {proj.targetPlayers}</div>
                  <div>POIs: {proj.mapElements.length}</div>
                  <div>Solved: {proj.savedProblems.length}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(proj.updatedAt).toLocaleDateString()}
                </span>

                {projects.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete project "${proj.name}"?`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Project Detail & Level Design Bible */}
      {activeProject && (
        <div className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">
                ACTIVE PROJECT WORKBENCH
              </span>
              <h2 className="text-xl md:text-2xl font-['Chakra_Petch'] font-bold text-white">
                {activeProject.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {isEditingNotes ? (
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setNotesDraft(activeProject.notes);
                    setIsEditingNotes(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Design Notes</span>
                </button>
              )}
            </div>
          </div>

          {/* Level Design Bible / Notes Area */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Level Design Bible & Map Specifications
            </span>

            {isEditingNotes ? (
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={8}
                className="w-full bg-zinc-950 border border-amber-500/50 rounded-xl p-3 text-xs md:text-sm text-zinc-100 font-mono focus:outline-none transition leading-relaxed"
                placeholder="Document map lore, pacing objectives, POI loot hierarchies, terrain erosion rules..."
              />
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs md:text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {activeProject.notes || 'No design notes yet. Click "Edit Design Notes" to record terrain rules, pacing, and POI targets.'}
              </div>
            )}
          </div>

          {/* Saved Problems Log */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
              Logged Solutions & Engine Fixes ({activeProject.savedProblems.length})
            </span>

            {activeProject.savedProblems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeProject.savedProblems.map((sp) => (
                  <div key={sp.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                    <div className="font-semibold text-amber-400">{sp.problem}</div>
                    <div className="text-zinc-400 text-[11px] line-clamp-3 whitespace-pre-wrap">
                      {sp.solution}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 pt-1">
                      Recorded: {sp.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-500">
                No solutions saved to this project yet. Use "Save to Project Notes" in the AI Assistant or Error Solver to log fixes here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-['Chakra_Petch'] font-bold text-base text-zinc-100">
                Create New Map Project
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Iron Archipelago – 8x8 Island"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short concept summary..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Map Dimensions</label>
                  <select
                    value={newMapSize}
                    onChange={(e) => setNewMapSize(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                  >
                    <option value="1x1km">1x1km (Fast CQC)</option>
                    <option value="2x2km">2x2km (Skirmish)</option>
                    <option value="4x4km">4x4km (Standard)</option>
                    <option value="8x8km">8x8km (Grand BR)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Target Players</label>
                  <select
                    value={newPlayers}
                    onChange={(e) => setNewPlayers(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                  >
                    <option value={32}>32 Players</option>
                    <option value={64}>64 Players</option>
                    <option value={100}>100 Players</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Theme / Biome</label>
                <input
                  type="text"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder="e.g. Snow Mountain / Forest"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Initial Level Design Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key choke points, major bridges, high-tier military compounds..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
