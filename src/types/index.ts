export interface Project {
  id: string;
  name: string;
  client: string;
  region: string;
  budget: number;
  deliveryDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  type: 'aerial' | 'modeling' | 'inspection';
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Plan {
  id: string;
  projectId: string;
  batchName: string;
  startDate: string;
  endDate: string;
  backupDate: string;
  personnel: string;
  equipment: string;
}

export interface Risk {
  id: string;
  projectId: string;
  type: 'airspace' | 'weather' | 'takeoff';
  description: string;
  level: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  mitigation: string;
}

export interface FieldFile {
  name: string;
  uploadTime?: string;
  size?: number;
  type?: string;
}

export interface FieldReport {
  id: string;
  projectId: string;
  date: string;
  flightRecords: string;
  photos: FieldFile[] | string[];
  trajectory: FieldFile | string;
  issues: string;
  status: 'completed' | 'pending_review' | 'has_issues';
  resolution?: string;
  resolutionTime?: string;
}

export interface RetakeTask {
  id: string;
  projectId: string;
  deliverableId: string;
  fieldReportId?: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  targetDate: string;
  completedAt?: string;
}

export interface DeliverableStatusHistory {
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  date: string;
  comment?: string;
}

export interface Deliverable {
  id: string;
  projectId: string;
  name: string;
  filePath: string;
  version: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  reviewComments: string;
  reviewRound: number;
  statusHistory: DeliverableStatusHistory[];
  lastReviewDate?: string;
}

export interface CollaborationTask {
  id: string;
  projectId: string;
  type: 'risk' | 'field_report' | 'retake' | 'delivery';
  typeId: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
  dueDate?: string;
}

export type ProjectStatus = Project['status'];
export type RequirementType = Requirement['type'];
export type RequirementPriority = Requirement['priority'];
export type RiskType = Risk['type'];
export type RiskLevel = Risk['level'];
