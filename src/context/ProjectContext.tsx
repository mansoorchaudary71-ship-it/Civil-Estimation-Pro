import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ProjectEstimate {
  id: string;
  toolId: string;
  name: string;
  cost: number;
  materials: Record<string, { quantity: number; unit: string }>;
  date: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  startDate: string;
  estimates: ProjectEstimate[];
}

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  addProject: (project: Omit<Project, 'id' | 'estimates'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addEstimateToProject: (projectId: string, estimate: Omit<ProjectEstimate, 'id' | 'date'>) => void;
  deleteEstimate: (projectId: string, estimateId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('civil_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse projects', e);
      }
    }
    
    const active = localStorage.getItem('civil_active_project');
    if (active) {
      setActiveProjectId(active);
    }
    
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('civil_projects', JSON.stringify(projects));
      if (activeProjectId) {
         localStorage.setItem('civil_active_project', activeProjectId);
      } else {
         localStorage.removeItem('civil_active_project');
      }
    }
  }, [projects, activeProjectId, loaded]);

  const addProject = (data: Omit<Project, 'id' | 'estimates'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newProject: Project = { ...data, id, estimates: [] };
    setProjects(prev => [...prev, newProject]);
    if (!activeProjectId) setActiveProjectId(id);
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const addEstimateToProject = (projectId: string, estimate: Omit<ProjectEstimate, 'id' | 'date'>) => {
    const newEst: ProjectEstimate = {
      ...estimate,
      id: Date.now().toString(36),
      date: new Date().toISOString()
    };
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, estimates: [...p.estimates, newEst] };
      }
      return p;
    }));
  };

  const deleteEstimate = (projectId: string, estimateId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, estimates: p.estimates.filter(e => e.id !== estimateId) };
      }
      return p;
    }));
  };

  return (
    <ProjectContext.Provider value={{
      projects, activeProjectId, setActiveProjectId,
      addProject, updateProject, deleteProject,
      addEstimateToProject, deleteEstimate
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within ProjectProvider');
  return context;
}
