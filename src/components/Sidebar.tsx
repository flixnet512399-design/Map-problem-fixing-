import React from 'react';
import {
  Home,
  MessageSquare,
  Cpu,
  Search,
  Video,
  Camera,
  Map as MapIcon,
  GraduationCap,
  Wrench,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  Flame,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';

export type NavTab =
  | 'home'
  | 'chat'
  | 'deep_solve'
  | 'search'
  | 'videos'
  | 'screenshot'
  | 'planner'
  | 'academy'
  | 'troubleshoot'
  | 'error_solver'
  | 'projects'
  | 'checklist';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useSettings();
  const { activeProject, calculateProgress } = useProjects();
  const progress = activeProject ? calculateProgress(activeProject) : 0;

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'chat', label: t('aiAssistant'), icon: MessageSquare },
    {
      id: 'deep_solve',
      label: t('deepSolve'),
      icon: Cpu,
      badge: 'DEEP',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    { id: 'search', label: t('aiSearch'), icon: Search, badge: 'WEB', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'videos', label: t('videoFinder'), icon: Video },
    { id: 'screenshot', label: t('screenshot'), icon: Camera, badge: 'VISION', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'planner', label: t('mapPlanner'), icon: MapIcon, badge: '2D CANVAS', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'academy', label: t('academy'), icon: GraduationCap },
    { id: 'troubleshoot', label: t('troubleshoot'), icon: Wrench },
    { id: 'error_solver', label: t('errorSolver'), icon: AlertTriangle },
    { id: 'projects', label: t('projects'), icon: FolderKanban },
    { id: 'checklist', label: t('checklist'), icon: CheckSquare },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/95 flex flex-col shrink-0 select-none">
      {/* Navigation list */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
          Studio Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    item.badgeColor || 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active project mini card in sidebar */}
      {activeProject && (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Active Map
            </span>
            <span className="text-[10px] font-mono text-zinc-400">{activeProject.mapSize}</span>
          </div>
          <div className="text-xs font-semibold text-zinc-200 truncate mb-2">
            {activeProject.name}
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
            <span>Checklist</span>
            <span className="text-amber-400 font-bold">{progress}% Completed</span>
          </div>
        </div>
      )}

      {/* Ethical / Anti-Cheat Notice */}
      <div className="px-4 py-3 border-t border-zinc-900 bg-zinc-950 text-[10px] text-zinc-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
        <span className="truncate">Level Design & Modding Studio Only</span>
      </div>
    </aside>
  );
};
