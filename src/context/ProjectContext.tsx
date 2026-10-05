import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChecklistItem, MapElement, Project } from '../types';
import { DEFAULT_CHECKLIST, INITIAL_PROJECTS } from '../data/sampleProjects';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateChecklistItem: (projectId: string, itemId: string, completed: boolean) => void;
  updateMapElements: (projectId: string, elements: MapElement[]) => void;
  addSavedProblem: (projectId: string, problem: string, solution: string) => void;
  addSavedTutorial: (projectId: string, title: string, url: string) => void;
  resetToDefaults: () => void;
  calculateProgress: (project: Project) => number;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('mapforge_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    const saved = localStorage.getItem('mapforge_active_project_id');
    if (saved && projects.some((p) => p.id === saved)) {
      return saved;
    }
    return projects[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem('mapforge_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('mapforge_active_project_id', activeProjectId);
  }, [activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
  };

  const calculateProgress = (project: Project): number => {
    if (!project || !project.checklist || project.checklist.length === 0) return 0;
    const completed = project.checklist.filter((item) => item.completed).length;
    return Math.round((completed / project.checklist.length) * 100);
  };

  const createProject = (data: Partial<Project>): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name || 'New Custom Map Project',
      description: data.description || 'Level design and layout project.',
      mapSize: data.mapSize || '4x4km',
      theme: data.theme || 'Temperate Forest',
      targetPlayers: data.targetPlayers || 64,
      notes: data.notes || '',
      checklist: DEFAULT_CHECKLIST.map((item) => ({ ...item, completed: false })),
      mapElements: data.mapElements || [],
      savedProblems: [],
      savedTutorials: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectIdState(newProject.id);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) {
        return INITIAL_PROJECTS;
      }
      return filtered;
    });

    if (activeProjectId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setActiveProjectIdState(remaining[0].id);
      }
    }
  };

  const updateChecklistItem = (projectId: string, itemId: string, completed: boolean) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updatedChecklist = proj.checklist.map((item) =>
            item.id === itemId ? { ...item, completed } : item
          );
          return {
            ...proj,
            checklist: updatedChecklist,
            updatedAt: new Date().toISOString(),
          };
        }
        return proj;
      })
    );
  };

  const updateMapElements = (projectId: string, elements: MapElement[]) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            mapElements: elements,
            updatedAt: new Date().toISOString(),
          };
        }
        return proj;
      })
    );
  };

  const addSavedProblem = (projectId: string, problem: string, solution: string) => {
    const entry = {
      id: `sp-${Date.now()}`,
      problem,
      solution,
      date: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            savedProblems: [entry, ...proj.savedProblems],
            updatedAt: new Date().toISOString(),
          };
        }
        return proj;
      })
    );
  };

  const addSavedTutorial = (projectId: string, title: string, url: string) => {
    const entry = {
      id: `st-${Date.now()}`,
      title,
      url,
      date: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            savedTutorials: [entry, ...proj.savedTutorials],
            updatedAt: new Date().toISOString(),
          };
        }
        return proj;
      })
    );
  };

  const resetToDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    setActiveProjectIdState(INITIAL_PROJECTS[0].id);
    localStorage.removeItem('mapforge_projects');
    localStorage.removeItem('mapforge_active_project_id');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeProjectId,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,
        updateChecklistItem,
        updateMapElements,
        addSavedProblem,
        addSavedTutorial,
        resetToDefaults,
        calculateProgress,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
