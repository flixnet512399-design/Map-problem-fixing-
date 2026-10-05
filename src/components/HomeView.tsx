import React from 'react';
import {
  Compass,
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
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Layers,
  Layers3,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useProjects } from '../context/ProjectContext';
import { useSettings } from '../context/SettingsContext';
import { ACADEMY_MODULES } from '../data/academyData';

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void;
  onQuickChatPrompt?: (prompt: string, isDeep?: boolean) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, onQuickChatPrompt }) => {
  const { projects, activeProject, setActiveProjectId, calculateProgress } = useProjects();
  const { language } = useSettings();

  const progress = activeProject ? calculateProgress(activeProject) : 0;

  const quickActionCards: Array<{
    title: string;
    desc: string;
    tab: NavTab;
    icon: React.ElementType;
    color: string;
    border: string;
    badge?: string;
  }> = [
    {
      title: 'Ask AI',
      desc: 'Ask level design & map creation questions in English, Urdu or Roman Urdu',
      tab: 'chat',
      icon: MessageSquare,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400',
      border: 'hover:border-amber-500/50',
    },
    {
      title: 'Deep Problem Solve',
      desc: 'In-depth root-cause analysis, ranked causes, and step-by-step engine fix',
      tab: 'deep_solve',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400',
      border: 'hover:border-cyan-500/50',
      badge: 'DEEP THINK',
    },
    {
      title: 'AI Search',
      desc: 'Search official Unreal Engine, PUBG WOW & level design docs with live citations',
      tab: 'search',
      icon: Search,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400',
      border: 'hover:border-blue-500/50',
    },
    {
      title: 'Find Tutorial Video',
      desc: 'Generate targeted queries and find real video tutorials for complex map bugs',
      tab: 'videos',
      icon: Video,
      color: 'from-red-500/20 to-orange-500/10 text-red-400',
      border: 'hover:border-red-500/50',
    },
    {
      title: 'Analyze Screenshot',
      desc: 'Upload viewport or error screenshots for automatic visual diagnostic inspection',
      tab: 'screenshot',
      icon: Camera,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400',
      border: 'hover:border-emerald-500/50',
      badge: 'VISION AI',
    },
    {
      title: 'Open Map Planner',
      desc: 'Interactive 2D tactical canvas with AI layout generation and map design review',
      tab: 'planner',
      icon: MapIcon,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400',
      border: 'hover:border-purple-500/50',
      badge: '2D CANVAS',
    },
    {
      title: 'Map Creation Academy',
      desc: '11 comprehensive modules from terrain sculpting to competitive level design',
      tab: 'academy',
      icon: GraduationCap,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-300',
      border: 'hover:border-yellow-500/50',
      badge: '11 MODULES',
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl p-6 md:p-10 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI LEVEL DESIGN & TROUBLESHOOTING COPILOT</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-['Chakra_Petch'] font-bold tracking-tight text-white mb-3">
            MapForge <span className="text-amber-500">AI</span>
          </h1>

          <p className="text-lg md:text-xl font-medium text-amber-400/90 font-['Chakra_Petch'] tracking-wide mb-3">
            Learn. Build. Troubleshoot. Improve.
          </p>

          <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-6">
            The dedicated AI assistant for battle royale and custom game map creators. Master terrain heightmaps, modular building collision, transit flow, lighting baking, draw call optimization, and solve complex editor bugs.
          </p>

          {/* Core Action Button Group */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab('chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => onSelectTab('deep_solve')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 font-semibold text-sm border border-cyan-500/40 hover:border-cyan-400 transition shadow-lg shadow-cyan-950/40"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Deep Problem Solve</span>
            </button>

            <button
              onClick={() => onSelectTab('planner')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-700 hover:border-zinc-500 transition"
            >
              <MapIcon className="w-4 h-4 text-amber-400" />
              <span>Open Map Planner</span>
            </button>

            <button
              onClick={() => onSelectTab('academy')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-700 hover:border-zinc-500 transition"
            >
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              <span>Map Creation Academy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict Ethical / Anti-Cheat Notice */}
      <div className="rounded-xl p-4 bg-zinc-900/60 border border-emerald-900/40 flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-emerald-400 font-semibold">Educational & Level Design Assistant: </strong>
          MapForge AI is engineered for level designers, 3D environment artists, and custom game mode creators (Unreal Engine, PUBG World of Wonder / WOW, and Unity). In compliance with fair play policies, it strictly rejects inquiries regarding cheats, aimbots, memory exploits, or unauthorized game file tampering.
        </div>
      </div>

      {/* Main 7 Feature Navigation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-200 font-['Chakra_Petch'] tracking-wide uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            Studio Toolset
          </h2>
          <span className="text-xs text-zinc-400">Click any tool to launch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => onSelectTab(card.tab)}
                className={`text-left p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 ${card.border} transition duration-200 flex flex-col justify-between group hover:bg-zinc-900/90`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.color} border border-zinc-800`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {card.badge && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Chakra_Petch'] font-semibold text-zinc-100 text-sm mb-1 group-hover:text-amber-400 transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-normal mb-4">
                    {card.desc}
                  </p>
                </div>

                <div className="flex items-center text-xs font-medium text-amber-400/80 group-hover:text-amber-300 gap-1 pt-2 border-t border-zinc-800/80">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Recent Projects, Recent Problems & Academy Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active & Recent Projects */}
        <div className="rounded-xl p-5 bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-200 font-['Chakra_Petch'] flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-amber-500" />
                Recent Projects
              </h3>
              <button
                onClick={() => onSelectTab('projects')}
                className="text-xs text-amber-400 hover:text-amber-300"
              >
                View All
              </button>
            </div>

            {projects.slice(0, 3).map((project) => {
              const projProg = calculateProgress(project);
              const isActive = activeProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    onSelectTab('projects');
                  }}
                  className={`p-3 rounded-lg border mb-2 cursor-pointer transition ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-200 truncate max-w-[180px]">
                      {project.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{project.mapSize}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 my-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${projProg}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                    <span>{project.theme}</span>
                    <span className="text-amber-400">{projProg}% done</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onSelectTab('projects')}
            className="w-full mt-3 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            + Create New Map Project
          </button>
        </div>

        {/* Recent Problems & Solutions */}
        <div className="rounded-xl p-5 bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-200 font-['Chakra_Petch'] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Recent Solved Issues
              </h3>
              <button
                onClick={() => onSelectTab('troubleshoot')}
                className="text-xs text-amber-400 hover:text-amber-300"
              >
                Database
              </button>
            </div>

            {activeProject?.savedProblems && activeProject.savedProblems.length > 0 ? (
              activeProject.savedProblems.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 mb-2.5 text-xs"
                >
                  <div className="font-medium text-amber-400 mb-1 line-clamp-1">
                    {item.problem}
                  </div>
                  <div className="text-zinc-400 text-[11px] line-clamp-2">
                    {item.solution}
                  </div>
                  <div className="mt-1.5 text-[10px] font-mono text-zinc-400">
                    Logged: {item.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-400 p-4 text-center rounded-lg bg-zinc-950/40 border border-zinc-800/50">
                No recent problems recorded yet. Use the Troubleshooting center or AI Chat to log issues.
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTab('deep_solve')}
            className="w-full mt-3 py-2 text-xs font-semibold rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition"
          >
            Start Deep Problem Solve
          </button>
        </div>

        {/* Academy Learning Progress */}
        <div className="rounded-xl p-5 bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-200 font-['Chakra_Petch'] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-yellow-500" />
                Academy Study Track
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 border border-zinc-700">
                11 Modules Total
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {ACADEMY_MODULES.slice(0, 3).map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => onSelectTab('academy')}
                  className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-yellow-400 shrink-0">
                      {mod.id}
                    </span>
                    <span className="text-zinc-300 font-medium truncate">
                      {mod.title.replace(`Module ${mod.id}: `, '')}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('academy')}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/30 transition"
          >
            Explore All 11 Modules
          </button>
        </div>
      </div>
    </div>
  );
};
