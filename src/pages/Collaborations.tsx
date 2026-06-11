import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Camera, RefreshCw, Package, ChevronRight, Check } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Badge from '@/components/UI/Badge';
import { useProjectStore } from '@/store/projectStore';
import { CollaborationTask } from '@/types';

const priorityConfig = {
  high: { label: '高', variant: 'danger' as const },
  medium: { label: '中', variant: 'warning' as const },
  low: { label: '低', variant: 'default' as const },
};

const typeConfig = {
  risk: { label: '风险', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  field_report: { label: '外业问题', icon: Camera, color: 'bg-orange-100 text-orange-600' },
  retake: { label: '补拍任务', icon: RefreshCw, color: 'bg-yellow-100 text-yellow-600' },
  delivery: { label: '待验收', icon: Package, color: 'bg-blue-100 text-blue-600' },
};

export default function Collaborations() {
  const navigate = useNavigate();
  const { projects, getAllCollaborationTasks } = useProjectStore();
  const tasks = getAllCollaborationTasks();

  const handleTaskClick = (task: CollaborationTask) => {
    if (task.type === 'risk') {
      navigate(`/projects/${task.projectId}/risk`);
    } else if (task.type === 'field_report') {
      navigate(`/projects/${task.projectId}/field`);
    } else if (task.type === 'retake') {
      navigate(`/projects/${task.projectId}/delivery`);
    } else if (task.type === 'delivery') {
      navigate(`/projects/${task.projectId}/delivery`);
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || '未知项目';
  };

  const tasksByPriority = {
    high: tasks.filter(t => t.priority === 'high'),
    medium: tasks.filter(t => t.priority === 'medium'),
    low: tasks.filter(t => t.priority === 'low'),
  };

  const riskCount = tasks.filter(t => t.type === 'risk').length;
  const fieldCount = tasks.filter(t => t.type === 'field_report').length;
  const retakeCount = tasks.filter(t => t.type === 'retake').length;
  const deliveryCount = tasks.filter(t => t.type === 'delivery').length;

  return (
    <Layout title="协作提醒">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">协作提醒</h1>
        <p className="text-gray-500 mt-1">待处理任务汇总</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => tasksByPriority.high.length > 0 && handleTaskClick(tasksByPriority.high[0])}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{riskCount}</p>
              <p className="text-sm text-gray-500">待处理风险</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => tasksByPriority.high.length > 0 && handleTaskClick(tasksByPriority.high[0])}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Camera className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{fieldCount}</p>
              <p className="text-sm text-gray-500">待审核问题</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/projects/${projects[0]?.id}/delivery`)}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{retakeCount}</p>
              <p className="text-sm text-gray-500">待补拍任务</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/projects/${projects[0]?.id}/delivery`)}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{deliveryCount}</p>
              <p className="text-sm text-gray-500">待验收交付物</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            待办任务列表
          </h3>
          <Badge variant={tasks.length > 0 ? 'danger' : 'success'}>
            {tasks.length} 项待处理
          </Badge>
        </div>

        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const typeInfo = typeConfig[task.type];
              const priorityInfo = priorityConfig[task.priority];
              
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
                      <typeInfo.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{task.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getProjectName(task.projectId)} | 创建于 {task.createdAt}
                        {task.dueDate && ` | 截止 ${task.dueDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={priorityInfo.variant}>
                      {priorityInfo.label}优先级
                    </Badge>
                    <Badge variant="default">
                      {typeInfo.label}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Check className="w-16 h-16 mx-auto text-green-300 mb-4" />
              <p className="text-gray-500">暂无待处理任务</p>
              <p className="text-sm text-gray-400 mt-1">所有任务都已处理完成</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
