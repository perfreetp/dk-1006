import { create } from 'zustand';
import { Project, Requirement, Plan, Risk, FieldReport, Deliverable } from '@/types';
import {
  mockProjects,
  mockRequirements,
  mockPlans,
  mockRisks,
  mockFieldReports,
  mockDeliverables,
} from '@/data/mockData';

interface ProjectStore {
  projects: Project[];
  requirements: Requirement[];
  plans: Plan[];
  risks: Risk[];
  fieldReports: FieldReport[];
  deliverables: Deliverable[];
  
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addRequirement: (requirement: Omit<Requirement, 'id'>) => void;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;
  
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  
  addRisk: (risk: Omit<Risk, 'id'>) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  
  addFieldReport: (report: Omit<FieldReport, 'id'>) => void;
  updateFieldReport: (id: string, updates: Partial<FieldReport>) => void;
  deleteFieldReport: (id: string) => void;
  
  addDeliverable: (deliverable: Omit<Deliverable, 'id'>) => void;
  updateDeliverable: (id: string, updates: Partial<Deliverable>) => void;
  deleteDeliverable: (id: string) => void;
  
  getProjectById: (id: string) => Project | undefined;
  getRequirementsByProjectId: (projectId: string) => Requirement[];
  getPlansByProjectId: (projectId: string) => Plan[];
  getRisksByProjectId: (projectId: string) => Risk[];
  getFieldReportsByProjectId: (projectId: string) => FieldReport[];
  getDeliverablesByProjectId: (projectId: string) => Deliverable[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: mockProjects,
  requirements: mockRequirements,
  plans: mockPlans,
  risks: mockRisks,
  fieldReports: mockFieldReports,
  deliverables: mockDeliverables,

  addProject: (project) => {
    const now = new Date().toISOString().split('T')[0];
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      requirements: state.requirements.filter((r) => r.projectId !== id),
      plans: state.plans.filter((p) => p.projectId !== id),
      risks: state.risks.filter((r) => r.projectId !== id),
      fieldReports: state.fieldReports.filter((f) => f.projectId !== id),
      deliverables: state.deliverables.filter((d) => d.projectId !== id),
    }));
  },

  addRequirement: (requirement) => {
    const newRequirement: Requirement = { ...requirement, id: generateId() };
    set((state) => ({ requirements: [...state.requirements, newRequirement] }));
  },

  updateRequirement: (id, updates) => {
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteRequirement: (id) => {
    set((state) => ({ requirements: state.requirements.filter((r) => r.id !== id) }));
  },

  addPlan: (plan) => {
    const newPlan: Plan = { ...plan, id: generateId() };
    set((state) => ({ plans: [...state.plans, newPlan] }));
  },

  updatePlan: (id, updates) => {
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deletePlan: (id) => {
    set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));
  },

  addRisk: (risk) => {
    const newRisk: Risk = { ...risk, id: generateId() };
    set((state) => ({ risks: [...state.risks, newRisk] }));
  },

  updateRisk: (id, updates) => {
    set((state) => ({
      risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  },

  deleteRisk: (id) => {
    set((state) => ({ risks: state.risks.filter((r) => r.id !== id) }));
  },

  addFieldReport: (report) => {
    const newReport: FieldReport = { ...report, id: generateId() };
    set((state) => ({ fieldReports: [...state.fieldReports, newReport] }));
  },

  updateFieldReport: (id, updates) => {
    set((state) => ({
      fieldReports: state.fieldReports.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  },

  deleteFieldReport: (id) => {
    set((state) => ({ fieldReports: state.fieldReports.filter((f) => f.id !== id) }));
  },

  addDeliverable: (deliverable) => {
    const newDeliverable: Deliverable = { ...deliverable, id: generateId() };
    set((state) => ({ deliverables: [...state.deliverables, newDeliverable] }));
  },

  updateDeliverable: (id, updates) => {
    set((state) => ({
      deliverables: state.deliverables.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
  },

  deleteDeliverable: (id) => {
    set((state) => ({ deliverables: state.deliverables.filter((d) => d.id !== id) }));
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
  getRequirementsByProjectId: (projectId) =>
    get().requirements.filter((r) => r.projectId === projectId),
  getPlansByProjectId: (projectId) => get().plans.filter((p) => p.projectId === projectId),
  getRisksByProjectId: (projectId) => get().risks.filter((r) => r.projectId === projectId),
  getFieldReportsByProjectId: (projectId) =>
    get().fieldReports.filter((f) => f.projectId === projectId),
  getDeliverablesByProjectId: (projectId) =>
    get().deliverables.filter((d) => d.projectId === projectId),
}));
