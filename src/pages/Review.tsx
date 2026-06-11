import { useParams } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import Layout from '@/components/Layout/Layout';
import Badge from '@/components/UI/Badge';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Plane,
  ClipboardList,
  AlertTriangle,
  Camera,
  Package,
  RefreshCw,
  Download,
  Printer
} from 'lucide-react';

export default function Review() {
  const { id } = useParams<{ id: string }>();
  const { 
    getProjectById, 
    getRequirementsByProjectId, 
    getPlansByProjectId, 
    getRisksByProjectId,
    getFieldReportsByProjectId,
    getDeliverablesByProjectId,
    getRetakeTasksByProjectId
  } = useProjectStore();
  
  const project = getProjectById(id || '');
  const requirements = getRequirementsByProjectId(id || '');
  const plans = getPlansByProjectId(id || '');
  const risks = getRisksByProjectId(id || '');
  const fieldReports = getFieldReportsByProjectId(id || '');
  const deliverables = getDeliverablesByProjectId(id || '');
  const retakeTasks = getRetakeTasksByProjectId(id || '');

  const requirementStats = {
    total: requirements.length,
    completed: requirements.filter(r => r.status === 'completed').length,
    inProgress: requirements.filter(r => r.status === 'in_progress').length,
    pending: requirements.filter(r => r.status === 'pending').length,
    progress: requirements.length > 0 ? Math.round((requirements.filter(r => r.status === 'completed').length / requirements.length) * 100) : 0,
  };

  const planStats = {
    total: plans.length,
    withBackup: plans.filter(p => p.backupDate).length,
  };

  const riskStats = {
    total: risks.length,
    active: risks.filter(r => r.status === 'active').length,
    resolved: risks.filter(r => r.status === 'resolved').length,
    high: risks.filter(r => r.level === 'high' && r.status === 'active').length,
  };

  const fieldStats = {
    total: fieldReports.length,
    withIssues: fieldReports.filter(r => r.status === 'has_issues').length,
    completed: fieldReports.filter(r => r.status === 'completed').length,
    totalPhotos: fieldReports.reduce((sum, r) => sum + (Array.isArray(r.photos) ? r.photos.length : 0), 0),
  };

  const deliveryStats = {
    total: deliverables.length,
    approved: deliverables.filter(d => d.status === 'approved').length,
    reviewing: deliverables.filter(d => d.status === 'reviewing').length,
    pending: deliverables.filter(d => d.status === 'pending').length,
    rejected: deliverables.filter(d => d.status === 'rejected').length,
    progress: deliverables.length > 0 ? Math.round((deliverables.filter(d => d.status === 'approved').length / deliverables.length) * 100) : 0,
  };

  const retakeStats = {
    total: retakeTasks.length,
    pending: retakeTasks.filter(t => t.status === 'pending').length,
    inProgress: retakeTasks.filter(t => t.status === 'in_progress').length,
    completed: retakeTasks.filter(t => t.status === 'completed').length,
    progress: retakeTasks.length > 0 ? Math.round((retakeTasks.filter(t => t.status === 'completed').length / retakeTasks.length) * 100) : 0,
  };

  const overallProgress = Math.round(
    (requirementStats.progress * 0.2 + 
     deliveryStats.progress * 0.4 + 
     retakeStats.progress * 0.2 + 
     (riskStats.resolved / Math.max(riskStats.total, 1)) * 100 * 0.2)
  );

  const isOnSchedule = !retakeTasks.some(t => 
    t.status !== 'completed' && 
    t.targetDate && 
    new Date(t.targetDate) > new Date(project?.deliveryDate || '')
  );

  const handleExport = () => {
    const report = {
      project: project?.name,
      client: project?.client,
      region: project?.region,
      deliveryDate: project?.deliveryDate,
      createdAt: project?.createdAt,
      overallProgress,
      requirements: requirementStats,
      plans: planStats,
      risks: riskStats,
      field: fieldStats,
      delivery: deliveryStats,
      retake: retakeStats,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || '项目'}_复盘报告.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout title={`${project?.name || '项目'} - 项目复盘`}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{project?.name || '项目复盘报告'}</h1>
          <p className="text-gray-500 mt-1">生成时间: {new Date().toLocaleDateString('zh-CN')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            打印报告
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{overallProgress}%</p>
              <p className="text-primary-100 text-sm mt-1">整体进度</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{requirementStats.progress}%</p>
              <p className="text-sm text-gray-500">需求完成率</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{deliveryStats.progress}%</p>
              <p className="text-sm text-gray-500">交付完成率</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isOnSchedule ? 'bg-green-100' : 'bg-red-100'}`}>
              {isOnSchedule ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{isOnSchedule ? '正常' : '延期'}</p>
              <p className="text-sm text-gray-500">进度状态</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            需求拆解
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">需求总数</span>
              <span className="font-semibold text-gray-800">{requirementStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">已完成</span>
              <span className="font-semibold text-green-600">{requirementStats.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">进行中</span>
              <span className="font-semibold text-blue-600">{requirementStats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">待开始</span>
              <span className="font-semibold text-gray-500">{requirementStats.pending}</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">完成进度</span>
                <span className="text-xs font-medium text-gray-600">{requirementStats.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${requirementStats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-yellow-500" />
            计划安排
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">飞行批次</span>
              <span className="font-semibold text-gray-800">{planStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">含备用日期</span>
              <span className="font-semibold text-green-600">{planStats.withBackup}</span>
            </div>
            <div className="pt-2">
              {plans.slice(0, 3).map((plan) => (
                <div key={plan.id} className="p-2 bg-gray-50 rounded-lg mb-2">
                  <p className="text-sm font-medium text-gray-800">{plan.batchName}</p>
                  <p className="text-xs text-gray-500">{plan.startDate} ~ {plan.endDate}</p>
                </div>
              ))}
              {plans.length > 3 && (
                <p className="text-xs text-gray-400 text-center">还有 {plans.length - 3} 个批次...</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            风险登记
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">风险总数</span>
              <span className="font-semibold text-gray-800">{riskStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">待处理</span>
              <span className="font-semibold text-red-600">{riskStats.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">已解决</span>
              <span className="font-semibold text-green-600">{riskStats.resolved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">高风险</span>
              <Badge variant={riskStats.high > 0 ? 'danger' : 'success'}>
                {riskStats.high}
              </Badge>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">解决率</span>
                <span className="text-xs font-medium text-gray-600">
                  {riskStats.total > 0 ? Math.round((riskStats.resolved / riskStats.total) * 100) : 100}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${riskStats.total > 0 ? (riskStats.resolved / riskStats.total) * 100 : 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-500" />
            外业执行
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">记录总数</span>
              <span className="font-semibold text-gray-800">{fieldStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">照片总数</span>
              <span className="font-semibold text-green-600">{fieldStats.totalPhotos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">已完成</span>
              <span className="font-semibold text-green-600">{fieldStats.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">有问题</span>
              <Badge variant={fieldStats.withIssues > 0 ? 'danger' : 'success'}>
                {fieldStats.withIssues}
              </Badge>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            成果交付
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">交付物总数</span>
              <span className="font-semibold text-gray-800">{deliveryStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">已通过</span>
              <span className="font-semibold text-green-600">{deliveryStats.approved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">审核中</span>
              <span className="font-semibold text-blue-600">{deliveryStats.reviewing}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">需修改</span>
              <Badge variant={deliveryStats.rejected > 0 ? 'danger' : 'default'}>
                {deliveryStats.rejected}
              </Badge>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">完成进度</span>
                <span className="text-xs font-medium text-gray-600">{deliveryStats.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryStats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-500" />
            补拍任务
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">任务总数</span>
              <span className="font-semibold text-gray-800">{retakeStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">待执行</span>
              <span className="font-semibold text-orange-600">{retakeStats.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">执行中</span>
              <span className="font-semibold text-blue-600">{retakeStats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">已完成</span>
              <span className="font-semibold text-green-600">{retakeStats.completed}</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">完成进度</span>
                <span className="text-xs font-medium text-gray-600">{retakeStats.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${retakeStats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          项目信息
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">项目名称</p>
            <p className="font-medium text-gray-800">{project?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">客户名称</p>
            <p className="font-medium text-gray-800">{project?.client || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">作业区域</p>
            <p className="font-medium text-gray-800">{project?.region || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">预算金额</p>
            <p className="font-medium text-gray-800">¥{project?.budget.toLocaleString() || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">交付日期</p>
            <p className="font-medium text-gray-800">{project?.deliveryDate || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">创建日期</p>
            <p className="font-medium text-gray-800">{project?.createdAt || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">项目状态</p>
            <Badge variant={project?.status === 'completed' ? 'success' : 
                          project?.status === 'delayed' ? 'danger' :
                          project?.status === 'in_progress' ? 'info' : 'default'}>
              {{
                pending: '待开始',
                in_progress: '进行中',
                completed: '已完成',
                delayed: '已延期'
              }[project?.status || 'pending']}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">延期风险</p>
            <Badge variant={isOnSchedule ? 'success' : 'danger'}>
              {isOnSchedule ? '无' : '有'}
            </Badge>
          </div>
        </div>
      </div>
    </Layout>
  );
}
