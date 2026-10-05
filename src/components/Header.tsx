import React from 'react';
import {
  Compass,
  Cpu,
  Globe2,
  Settings as SettingsIcon,
  Download,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenExport }) => {
  const { language, setLanguage } = useSettings();
  const { projects, activeProject, setActiveProjectId, calculateProgress } = useProjects();

  const progress = activeProject ? calculateProgress(activeProject) : 0;

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
          <Compass className="w-6 h-6 text-zinc-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-['Chakra_Petch'] font-bold text-lg tracking-wide text-zinc-100">
              MAPFORGE <span className="text-amber-500">AI</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              V2.4 TACTICAL
            </span>
          </div>
          <p className="text-xs text-zinc-400 hidden sm:block">
            PUBG Map Creation & Level Design Assistant
          </p>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Active Project Selector */}
        {activeProject && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition">
            <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <select
              value={activeProject.id}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                  {p.name} ({p.mapSize})
                </option>
              ))}
            </select>
            <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
              {progress}%
            </div>
          </div>
        )}

        {/* Language selector */}
        <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800 text-xs">
          <Globe2 className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1 shrink-0" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              language === 'en'
                ? 'bg-amber-500 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('roman_ur')}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              language === 'roman_ur'
                ? 'bg-amber-500 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Roman Urdu"
          >
            Roman UR
          </button>
          <button
            onClick={() => setLanguage('ur')}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              language === 'ur'
                ? 'bg-amber-500 text-zinc-950 font-semibold font-serif'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="اردو"
          >
            اردو
          </button>
        </div>

        {/* Export Project Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800 text-xs transition"
          title="Export Project & Docs"
        >
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden lg:inline">Export</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 border border-zinc-800 transition"
          title="Settings & Level Design Preferences"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
