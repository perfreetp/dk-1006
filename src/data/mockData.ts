import { Project, Requirement, Plan, Risk, FieldReport, Deliverable } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: '北京市朝阳区航摄项目',
    client: '北京测绘研究院',
    region: '北京市朝阳区',
    budget: 150000,
    deliveryDate: '2024-12-31',
    status: 'in_progress',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10',
  },
  {
    id: '2',
    name: '上海市浦东新区建模项目',
    client: '上海城市规划局',
    region: '上海市浦东新区',
    budget: 280000,
    deliveryDate: '2024-11-15',
    status: 'completed',
    createdAt: '2024-02-20',
    updatedAt: '2024-11-10',
  },
  {
    id: '3',
    name: '广州市天河区巡查项目',
    client: '广州国土资源局',
    region: '广州市天河区',
    budget: 85000,
    deliveryDate: '2024-08-20',
    status: 'pending',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01',
  },
  {
    id: '4',
    name: '深圳市南山区综合测绘项目',
    client: '深圳测绘有限公司',
    region: '深圳市南山区',
    budget: 320000,
    deliveryDate: '2024-10-01',
    status: 'delayed',
    createdAt: '2024-03-10',
    updatedAt: '2024-09-15',
  },
];

export const mockRequirements: Requirement[] = [
  {
    id: 'r1',
    projectId: '1',
    type: 'aerial',
    name: '航摄区域A',
    description: '完成朝阳区北部区域航摄，覆盖面积约50平方公里',
    priority: 'high',
    assignee: '张伟',
    status: 'in_progress',
  },
  {
    id: 'r2',
    projectId: '1',
    type: 'aerial',
    name: '航摄区域B',
    description: '完成朝阳区南部区域航摄，覆盖面积约45平方公里',
    priority: 'medium',
    assignee: '李明',
    status: 'pending',
  },
  {
    id: 'r3',
    projectId: '1',
    type: 'modeling',
    name: '三维建模',
    description: '基于航摄数据进行三维建模，精度要求5cm',
    priority: 'high',
    assignee: '王芳',
    status: 'pending',
  },
  {
    id: 'r4',
    projectId: '1',
    type: 'inspection',
    name: '质量巡查',
    description: '对航摄成果进行质量检查和验收',
    priority: 'low',
    assignee: '刘洋',
    status: 'pending',
  },
];

export const mockPlans: Plan[] = [
  {
    id: 'p1',
    projectId: '1',
    batchName: '第一批飞行',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    backupDate: '2024-06-25',
    personnel: '张伟、李明',
    equipment: '无人机A、无人机B',
  },
  {
    id: 'p2',
    projectId: '1',
    batchName: '第二批飞行',
    startDate: '2024-06-22',
    endDate: '2024-06-27',
    backupDate: '2024-07-02',
    personnel: '张伟、王芳',
    equipment: '无人机A、无人机C',
  },
];

export const mockRisks: Risk[] = [
  {
    id: 'rk1',
    projectId: '1',
    type: 'airspace',
    description: '朝阳区北部区域存在临时空域管制，需提前申请',
    level: 'high',
    status: 'active',
    mitigation: '已提交空域申请，等待批复',
  },
  {
    id: 'rk2',
    projectId: '1',
    type: 'weather',
    description: '预计下周有雷阵雨天气，可能影响飞行',
    level: 'medium',
    status: 'active',
    mitigation: '密切关注天气预报，调整飞行计划',
  },
  {
    id: 'rk3',
    projectId: '1',
    type: 'takeoff',
    description: '起降点周边有建筑工地，需协调施工时间',
    level: 'low',
    status: 'resolved',
    mitigation: '已与施工方协调，确定飞行时间段',
  },
];

export const mockFieldReports: FieldReport[] = [
  {
    id: 'fr1',
    projectId: '1',
    date: '2024-06-15',
    flightRecords: '飞行时长：4小时30分，飞行高度：150米，覆盖面积：12平方公里',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    trajectory: 'trajectory_20240615.gpx',
    issues: '部分区域云层较厚，影像质量略有影响',
  },
  {
    id: 'fr2',
    projectId: '1',
    date: '2024-06-16',
    flightRecords: '飞行时长：5小时15分，飞行高度：140米，覆盖面积：15平方公里',
    photos: ['photo4.jpg', 'photo5.jpg'],
    trajectory: 'trajectory_20240616.gpx',
    issues: '无异常情况，飞行顺利',
  },
];

export const mockDeliverables: Deliverable[] = [
  {
    id: 'd1',
    projectId: '1',
    name: '航摄原始影像数据',
    filePath: '/deliverables/aerial_raw.zip',
    version: 'v1.0',
    status: 'approved',
    reviewComments: '数据完整，质量达标',
  },
  {
    id: 'd2',
    projectId: '1',
    name: '三维模型成果',
    filePath: '/deliverables/model_3d.obj',
    version: 'v0.9',
    status: 'reviewing',
    reviewComments: '',
  },
  {
    id: 'd3',
    projectId: '1',
    name: '质量检查报告',
    filePath: '/deliverables/quality_report.pdf',
    version: 'v1.0',
    status: 'pending',
    reviewComments: '',
  },
];

export const clients = [
  '北京测绘研究院',
  '上海城市规划局',
  '广州国土资源局',
  '深圳测绘有限公司',
  '成都地理信息中心',
];

export const regions = [
  '北京市朝阳区',
  '北京市海淀区',
  '上海市浦东新区',
  '广州市天河区',
  '深圳市南山区',
  '成都市锦江区',
];

export const teamMembers = [
  '张伟',
  '李明',
  '王芳',
  '刘洋',
  '陈静',
  '赵强',
];

export const equipmentList = [
  '无人机A',
  '无人机B',
  '无人机C',
  '测绘相机X1',
  '测绘相机X2',
  'GPS设备',
];
