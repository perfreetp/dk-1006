import { Project, Requirement, Plan, Risk, FieldReport, Deliverable } from '@/types';

export const clients = ['杭州市规划和自然资源局', '苏州市自然资源和规划局'];
export const regions = ['杭州主城区', '苏州高铁新城'];
export const teamMembers = ['张伟', '李明', '赵华', '王强', '李娜'];
export const equipmentList = ['DJI M300 + P1', 'DJI M600 Pro', 'Phantom 4 RTK'];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: '杭州城市航拍项目',
    client: '杭州市规划和自然资源局',
    region: '杭州主城区',
    budget: 580000,
    deliveryDate: '2024-08-30',
    status: 'in_progress',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-15',
  },
  {
    id: '2',
    name: '苏州高铁新城规划项目',
    client: '苏州市自然资源和规划局',
    region: '苏州高铁新城',
    budget: 420000,
    deliveryDate: '2024-09-15',
    status: 'pending',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-10',
  },
];

export const mockRequirements: Requirement[] = [
  {
    id: 'r1',
    projectId: '1',
    type: 'aerial',
    name: '航摄任务-钱塘江沿岸',
    description: '覆盖钱塘江两岸各500米范围，地面分辨率优于10cm',
    priority: 'high',
    assignee: '张伟',
    status: 'completed',
  },
  {
    id: 'r2',
    projectId: '1',
    type: 'modeling',
    name: '三维建模-西湖周边',
    description: '西湖周边3公里范围三维模型，精度优于20cm',
    priority: 'high',
    assignee: '李娜',
    status: 'in_progress',
  },
  {
    id: 'r3',
    projectId: '1',
    type: 'inspection',
    name: '基础设施巡检',
    description: '主要道路路面状况巡查',
    priority: 'medium',
    assignee: '王强',
    status: 'pending',
  },
];

export const mockPlans: Plan[] = [
  {
    id: 'p1',
    projectId: '1',
    batchName: '第一批-钱塘江区域',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    backupDate: '2024-06-25',
    personnel: '张伟、李明、赵华',
    equipment: 'DJI M300 + P1',
  },
  {
    id: 'p2',
    projectId: '1',
    batchName: '第二批-西湖区域',
    startDate: '2024-06-22',
    endDate: '2024-06-28',
    backupDate: '2024-06-30',
    personnel: '张伟、王强',
    equipment: 'DJI M300 + P1',
  },
];

export const mockRisks: Risk[] = [
  {
    id: 'risk1',
    projectId: '1',
    type: 'airspace',
    description: '萧山机场净空保护区限制',
    level: 'high',
    status: 'active',
    mitigation: '已申请临时空域，正在等待审批',
  },
  {
    id: 'risk2',
    projectId: '1',
    type: 'weather',
    description: '梅雨季节影响作业进度',
    level: 'medium',
    status: 'resolved',
    mitigation: '制定备用作业计划',
  },
  {
    id: 'risk3',
    projectId: '1',
    type: 'takeoff',
    description: '部分起降点需要协调场地使用',
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
    photos: [
      { name: 'IMG_001.jpg', uploadTime: '2024-06-15T10:30:00', size: 2048000 },
      { name: 'IMG_002.jpg', uploadTime: '2024-06-15T10:35:00', size: 2100000 },
      { name: 'IMG_003.jpg', uploadTime: '2024-06-15T10:40:00', size: 1980000 },
    ],
    trajectory: { name: 'flight_track_20240615.gpx', uploadTime: '2024-06-15T15:00:00', size: 512000 },
    issues: '部分区域云层较厚，影像质量略有影响',
    status: 'has_issues',
  },
  {
    id: 'fr2',
    projectId: '1',
    date: '2024-06-16',
    flightRecords: '飞行时长：5小时15分，飞行高度：140米，覆盖面积：15平方公里',
    photos: [
      { name: 'IMG_004.jpg', uploadTime: '2024-06-16T09:00:00', size: 2150000 },
      { name: 'IMG_005.jpg', uploadTime: '2024-06-16T09:05:00', size: 2200000 },
    ],
    trajectory: { name: 'flight_track_20240616.gpx', uploadTime: '2024-06-16T14:30:00', size: 548000 },
    issues: '无异常情况，飞行顺利',
    status: 'completed',
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
    reviewRound: 1,
    statusHistory: [
      { status: 'pending', date: '2024-06-20', comment: '首次提交' },
      { status: 'reviewing', date: '2024-06-21', comment: '审核中' },
      { status: 'approved', date: '2024-06-22', comment: '数据完整，质量达标' },
    ],
    lastReviewDate: '2024-06-22',
  },
  {
    id: 'd2',
    projectId: '1',
    name: '三维模型成果',
    filePath: '/deliverables/model_3d.obj',
    version: 'v0.9',
    status: 'reviewing',
    reviewComments: '模型精度需提高',
    reviewRound: 2,
    statusHistory: [
      { status: 'pending', date: '2024-06-18', comment: '首次提交' },
      { status: 'reviewing', date: '2024-06-19', comment: '审核中' },
      { status: 'rejected', date: '2024-06-20', comment: '模型精度需提高' },
      { status: 'pending', date: '2024-06-21', comment: '重新提交v0.9' },
      { status: 'reviewing', date: '2024-06-22', comment: '第二轮审核中' },
    ],
    lastReviewDate: '2024-06-22',
  },
  {
    id: 'd3',
    projectId: '1',
    name: '质量检查报告',
    filePath: '/deliverables/quality_report.pdf',
    version: 'v1.0',
    status: 'pending',
    reviewComments: '',
    reviewRound: 0,
    statusHistory: [],
  },
];
