import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Requirement, Plan, Risk, FieldReport, Deliverable, RetakeTask, CollaborationTask } from '@/types';
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
  retakeTasks: RetakeTask[];
  collaborationTasks: CollaborationTask[];
  
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
  
  addRetakeTask: (task: Omit<RetakeTask, 'id' | 'createdAt'>) => void;
  updateRetakeTask: (id: string, updates: Partial<RetakeTask>) => void;
  deleteRetakeTask: (id: string) => void;
  
  getProjectById: (id: string) => Project | undefined;
  getRequirementsByProjectId: (projectId: string) => Requirement[];
  getPlansByProjectId: (projectId: string) => Plan[];
  getRisksByProjectId: (projectId: string) => Risk[];
  getFieldReportsByProjectId: (projectId: string) => FieldReport[];
  getDeliverablesByProjectId: (projectId: string) => Deliverable[];
  getRetakeTasksByProjectId: (projectId: string) => RetakeTask[];
  getAllCollaborationTasks: () => CollaborationTask[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: mockProjects,
      requirements: mockRequirements,
      plans: mockPlans,
      risks: mockRisks,
      fieldReports: mockFieldReports,
      deliverables: mockDeliverables,
      retakeTasks: [],
      collaborationTasks: [],

      addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString().split('T')[0];
        const newProject: Project = {
          ...project,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id: string, updates: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p
          ),
        }));
      },

      deleteProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          requirements: state.requirements.filter((r) => r.projectId !== id),
          plans: state.plans.filter((p) => p.projectId !== id),
          risks: state.risks.filter((r) => r.projectId !== id),
          fieldReports: state.fieldReports.filter((f) => f.projectId !== id),
          deliverables: state.deliverables.filter((d) => d.projectId !== id),
        }));
      },

      addRequirement: (requirement: Omit<Requirement, 'id'>) => {
        const newRequirement: Requirement = { ...requirement, id: generateId() };
        set((state) => ({ requirements: [...state.requirements, newRequirement] }));
      },

      updateRequirement: (id: string, updates: Partial<Requirement>) => {
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteRequirement: (id: string) => {
        set((state) => ({ requirements: state.requirements.filter((r) => r.id !== id) }));
      },

      addPlan: (plan: Omit<Plan, 'id'>) => {
        const newPlan: Plan = { ...plan, id: generateId() };
        set((state) => ({ plans: [...state.plans, newPlan] }));
      },

      updatePlan: (id: string, updates: Partial<Plan>) => {
        set((state) => ({
          plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deletePlan: (id: string) => {
        set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));
      },

      addRisk: (risk: Omit<Risk, 'id'>) => {
        const newRisk: Risk = { ...risk, id: generateId() };
        set((state) => ({ risks: [...state.risks, newRisk] }));
      },

      updateRisk: (id: string, updates: Partial<Risk>) => {
        set((state) => ({
          risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      deleteRisk: (id: string) => {
        set((state) => ({ risks: state.risks.filter((r) => r.id !== id) }));
      },

      addFieldReport: (report: Omit<FieldReport, 'id'>) => {
        const newReport: FieldReport = { ...report, id: generateId() };
        set((state) => ({ fieldReports: [...state.fieldReports, newReport] }));
      },

      updateFieldReport: (id: string, updates: Partial<FieldReport>) => {
        set((state) => ({
          fieldReports: state.fieldReports.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        }));
      },

      deleteFieldReport: (id: string) => {
        set((state) => ({ fieldReports: state.fieldReports.filter((f) => f.id !== id) }));
      },

      addDeliverable: (deliverable: Omit<Deliverable, 'id'>) => {
        const newDeliverable: Deliverable = { ...deliverable, id: generateId() };
        set((state) => ({ deliverables: [...state.deliverables, newDeliverable] }));
      },

      updateDeliverable: (id: string, updates: Partial<Deliverable>) => {
        set((state) => {
          const deliverables = state.deliverables.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          );
          
          if (updates.status === 'approved') {
            const updatedDeliverable = deliverables.find(d => d.id === id);
            if (updatedDeliverable) {
              const retakeTasks = state.retakeTasks.filter(t => t.deliverableId !== id);
              return { deliverables, retakeTasks };
            }
          }
          
          return { deliverables };
        });
      },

      deleteDeliverable: (id: string) => {
        set((state) => ({ 
          deliverables: state.deliverables.filter((d) => d.id !== id),
          retakeTasks: state.retakeTasks.filter((t) => t.deliverableId !== id),
        }));
      },

      addRetakeTask: (task: Omit<RetakeTask, 'id' | 'createdAt'>) => {
        const newTask: RetakeTask = {
          ...task,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ retakeTasks: [...state.retakeTasks, newTask] }));
      },

      updateRetakeTask: (id: string, updates: Partial<RetakeTask>) => {
        set((state) => ({
          retakeTasks: state.retakeTasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteRetakeTask: (id: string) => {
        set((state) => ({ retakeTasks: state.retakeTasks.filter((t) => t.id !== id) }));
      },

      getProjectById: (id: string) => get().projects.find((p) => p.id === id),
      getRequirementsByProjectId: (projectId: string) =>
        get().requirements.filter((r) => r.projectId === projectId),
      getPlansByProjectId: (projectId: string) => get().plans.filter((p) => p.projectId === projectId),
      getRisksByProjectId: (projectId: string) => get().risks.filter((r) => r.projectId === projectId),
      getFieldReportsByProjectId: (projectId: string) =>
        get().fieldReports.filter((f) => f.projectId === projectId),
      getDeliverablesByProjectId: (projectId: string) =>
        get().deliverables.filter((d) => d.projectId === projectId),
      getRetakeTasksByProjectId: (projectId: string) =>
        get().retakeTasks.filter((t) => t.projectId === projectId),
      getAllCollaborationTasks: () => {
        const tasks: CollaborationTask[] = [];
        const state = get();
        
        state.risks.filter(r => r.status === 'active').forEach(risk => {
          const project = state.projects.find(p => p.id === risk.projectId);
          tasks.push({
            id: `risk-${risk.id}`,
            projectId: risk.projectId,
            type: 'risk',
            typeId: risk.id,
            description: `风险待处理: ${risk.description}`,
            priority: risk.level,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
          });
        });
        
        state.fieldReports.filter(f => f.status === 'has_issues' && !f.resolution).forEach(report => {
          const project = state.projects.find(p => p.id === report.projectId);
          tasks.push({
            id: `field-${report.id}`,
            projectId: report.projectId,
            type: 'field_report',
            typeId: report.id,
            description: `外业问题待处理: ${report.date}`,
            priority: 'high',
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
          });
        });
        
        state.retakeTasks.filter(t => t.status === 'pending').forEach(task => {
          const project = state.projects.find(p => p.id === task.projectId);
          const deliverable = state.deliverables.find(d => d.id === task.deliverableId);
          tasks.push({
            id: `retake-${task.id}`,
            projectId: task.projectId,
            type: 'retake',
            typeId: task.id,
            description: `补拍待执行: ${task.description}`,
            priority: 'medium',
            status: 'pending',
            createdAt: task.createdAt,
            dueDate: task.targetDate,
          });
        });
        
        state.deliverables.filter(d => d.status === 'reviewing').forEach(deliverable => {
          const project = state.projects.find(p => p.id === deliverable.projectId);
          tasks.push({
            id: `delivery-${deliverable.id}`,
            projectId: deliverable.projectId,
            type: 'delivery',
            typeId: deliverable.id,
            description: `交付物待验收: ${deliverable.name}`,
            priority: 'medium',
            status: 'pending',
            createdAt: deliverable.lastReviewDate || new Date().toISOString().split('T')[0],
          });
        });
        
        return tasks.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      },
    }),
    {
      name: 'flight-task-storage',
    }
  )
);
