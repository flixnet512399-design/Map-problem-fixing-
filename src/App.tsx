import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ProjectProvider } from './context/ProjectContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { AIAssistantView } from './components/AIAssistantView';
import { DeepSolveView } from './components/DeepSolveView';
import { AISearchView } from './components/AISearchView';
import { VideoFinderView } from './components/VideoFinderView';
import { ScreenshotAnalyzerView } from './components/ScreenshotAnalyzerView';
import { MapPlannerView } from './components/MapPlannerView';
import { AcademyView } from './components/AcademyView';
import { TroubleshootingView } from './components/TroubleshootingView';
import { ErrorSolverView } from './components/ErrorSolverView';
import { ProjectsView } from './components/ProjectsView';
import { ChecklistView } from './components/ChecklistView';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Cross-view triggers for seamless workflows
  const handleAskAiFromExternal = (prompt: string) => {
    setCurrentTab('chat');
  };

  const handleFindVideoFromExternal = (topic: string) => {
    setCurrentTab('videos');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/50">
          {currentTab === 'home' && (
            <HomeView
              onSelectTab={setCurrentTab}
              onQuickChatPrompt={handleAskAiFromExternal}
            />
          )}

          {currentTab === 'chat' && <AIAssistantView />}

          {currentTab === 'deep_solve' && <DeepSolveView />}

          {currentTab === 'search' && <AISearchView />}

          {currentTab === 'videos' && <VideoFinderView />}

          {currentTab === 'screenshot' && <ScreenshotAnalyzerView />}

          {currentTab === 'planner' && <MapPlannerView />}

          {currentTab === 'academy' && (
            <AcademyView
              onNavigateToTab={setCurrentTab}
              onAskAi={handleAskAiFromExternal}
              onFindVideo={handleFindVideoFromExternal}
            />
          )}

          {currentTab === 'troubleshoot' && (
            <TroubleshootingView
              onAskAi={handleAskAiFromExternal}
              onFindVideo={handleFindVideoFromExternal}
            />
          )}

          {currentTab === 'error_solver' && (
            <ErrorSolverView onFindVideo={handleFindVideoFromExternal} />
          )}

          {currentTab === 'projects' && <ProjectsView />}

          {currentTab === 'checklist' && <ChecklistView />}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ProjectProvider>
        <MainApp />
      </ProjectProvider>
    </SettingsProvider>
  );
}
