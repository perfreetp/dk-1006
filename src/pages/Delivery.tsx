import { useState } from 'react';
import { Plus, Edit2, Trash2, Package, CheckCircle, Clock, XCircle, Download, FileText, Calendar, Percent, AlertTriangle, RefreshCw, Check } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { useProjectStore } from '@/store/projectStore';
import { Deliverable, RetakeTask } from '@/types';
import { useParams } from 'react-router-dom';

const statusConfig: Record<Deliverable['status'], { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  pending: { label: '待提交', variant: 'default' },
  reviewing: { label: '审核中', variant: 'info' },
  approved: { label: '已通过', variant: 'success' },
  rejected: { label: '需修改', variant: 'danger' },
};

const retakeStatusConfig: Record<RetakeTask['status'], { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  pending: { label: '待执行', variant: 'warning' },
  in_progress: { label: '执行中', variant: 'info' },
  completed: { label: '已完成', variant: 'success' },
};

export default function Delivery() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getDeliverablesByProjectId, addDeliverable, updateDeliverable, deleteDeliverable, getRequirementsByProjectId, getPlansByProjectId, getFieldReportsByProjectId, addRetakeTask, getRetakeTasksByProjectId, updateRetakeTask, deleteRetakeTask } = useProjectStore();
  const project = getProjectById(id || '');
  const deliverables = getDeliverablesByProjectId(id || '');
  const requirements = getRequirementsByProjectId(id || '');
  const plans = getPlansByProjectId(id || '');
  const fieldReports = getFieldReportsByProjectId(id || '');
  const retakeTasks = getRetakeTasksByProjectId(id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState<Deliverable | null>(null);
  const [currentDeliverableId, setCurrentDeliverableId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    filePath: '',
    version: '',
    status: 'pending' as Deliverable['status'],
    reviewComments: '',
    needsRetake: false,
    retakeDescription: '',
    retakeDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      if (editingDeliverable) {
        updateDeliverable(editingDeliverable.id, { 
          ...formData, 
          projectId: id,
          reviewComments: formData.needsRetake ? `${formData.reviewComments}\n【需补拍】${formData.retakeDescription}` : formData.reviewComments,
        });
      } else {
        addDeliverable({ 
          ...formData, 
          projectId: id,
          reviewComments: formData.needsRetake ? `${formData.reviewComments}\n【需补拍】${formData.retakeDescription}` : formData.reviewComments,
        });
      }
      
      if (formData.needsRetake && formData.retakeDescription) {
        addRetakeTask({
          projectId: id,
          deliverableId: editingDeliverable?.id || currentDeliverableId,
          description: formData.retakeDescription,
          status: 'pending',
          targetDate: formData.retakeDate,
        });
      }
    }
    setIsModalOpen(false);
    setEditingDeliverable(null);
    setFormData({
      name: '',
      filePath: '',
      version: 'v1.0',
      status: 'pending',
      reviewComments: '',
      needsRetake: false,
      retakeDescription: '',
      retakeDate: '',
    });
  };

  const handleEdit = (deliverable: Deliverable) => {
    setEditingDeliverable(deliverable);
    setCurrentDeliverableId(deliverable.id);
    const needsRetake = deliverable.reviewComments?.includes('【需补拍】') || false;
    let reviewComments = deliverable.reviewComments || '';
    let retakeDescription = '';
    if (needsRetake) {
      const parts = reviewComments.split('【需补拍】');
      reviewComments = parts[0].trim();
      retakeDescription = parts[1]?.trim() || '';
    }
    setFormData({
      name: deliverable.name,
      filePath: deliverable.filePath,
      version: deliverable.version,
      status: deliverable.status,
      reviewComments,
      needsRetake,
      retakeDescription,
      retakeDate: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (deliverableId: string) => {
    if (confirm('确定要删除这个交付物吗？关联的补拍任务也会被删除。')) {
      deleteDeliverable(deliverableId);
    }
  };

  const handleAdd = () => {
    setEditingDeliverable(null);
    setCurrentDeliverableId('');
    setFormData({
      name: '',
      filePath: '',
      version: 'v1.0',
      status: 'pending',
      reviewComments: '',
      needsRetake: false,
      retakeDescription: '',
      retakeDate: '',
    });
    setIsModalOpen(true);
  };

  const handleRetakeComplete = (taskId: string) => {
    updateRetakeTask(taskId, { status: 'completed' });
  };

  const handleRetakeDelete = (taskId: string) => {
    if (confirm('确定要删除这个补拍任务吗？')) {
      deleteRetakeTask(taskId);
    }
  };

  const approvedCount = deliverables.filter(d => d.status === 'approved').length;
  const reviewingCount = deliverables.filter(d => d.status === 'reviewing').length;
  const pendingCount = deliverables.filter(d => d.status === 'pending').length;
  const rejectedCount = deliverables.filter(d => d.status === 'rejected').length;
  const deliveryProgress = deliverables.length > 0 ? Math.round((approvedCount / deliverables.length) * 100) : 0;

  const completedRequirements = requirements.filter(r => r.status === 'completed').length;
  const requirementProgress = requirements.length > 0 ? Math.round((completedRequirements / requirements.length) * 100) : 0;

  const pendingRetakeCount = retakeTasks.filter(t => t.status === 'pending').length;
  const completedRetakeCount = retakeTasks.filter(t => t.status === 'completed').length;
  const retakeProgress = retakeTasks.length > 0 ? Math.round((completedRetakeCount / retakeTasks.length) * 100) : 0;

  return (
    <Layout title={`${project?.name || '项目'} - 交付管理`}>
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{approvedCount}</p>
              <p className="text-sm text-gray-500">已通过</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{reviewingCount}</p>
              <p className="text-sm text-gray-500">审核中</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-sm text-gray-500">待提交</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{rejectedCount}</p>
              <p className="text-sm text-gray-500">需修改</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingRetakeCount}</p>
              <p className="text-sm text-gray-500">待补拍</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-accent-500" />
            项目进度汇总
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">交付物完成率</span>
                <span className="text-sm font-bold text-gray-800">{deliveryProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-accent-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryProgress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">需求完成率</span>
                <span className="text-sm font-bold text-gray-800">{requirementProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${requirementProgress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">补拍完成率</span>
                <span className="text-sm font-bold text-gray-800">{retakeProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${retakeProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-4">项目统计</h4>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{requirements.length}</p>
                <p className="text-xs text-gray-500">需求总数</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{plans.length}</p>
                <p className="text-xs text-gray-500">飞行批次</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{fieldReports.length}</p>
                <p className="text-xs text-gray-500">外业记录</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{deliverables.length}</p>
                <p className="text-xs text-gray-500">交付物</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{retakeTasks.length}</p>
                <p className="text-xs text-gray-500">补拍任务</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            项目时间线
          </h3>
          <div className="space-y-4">
            <div className="relative pl-6 pb-4">
              <div className="absolute left-2 top-1 w-3 h-3 bg-primary-500 rounded-full"></div>
              <div className="absolute left-2.5 top-4 w-0.5 h-full bg-gray-200"></div>
              <p className="text-sm font-medium text-gray-800">项目创建</p>
              <p className="text-xs text-gray-500">{project?.createdAt}</p>
            </div>
            <div className="relative pl-6 pb-4">
              <div className="absolute left-2 top-1 w-3 h-3 bg-blue-400 rounded-full"></div>
              <p className="text-sm font-medium text-gray-800">需求拆解完成</p>
              <p className="text-xs text-gray-500">进行中</p>
            </div>
            <div className="relative pl-6 pb-4">
              <div className="absolute left-2 top-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p className="text-sm font-medium text-gray-800">计划安排</p>
              <p className="text-xs text-gray-500">进行中</p>
            </div>
            <div className="relative pl-6 pb-4">
              <div className="absolute left-2 top-1 w-3 h-3 bg-orange-400 rounded-full"></div>
              <p className="text-sm font-medium text-gray-800">外业执行</p>
              <p className="text-xs text-gray-500">进行中</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 w-3 h-3 bg-gray-300 rounded-full"></div>
              <p className="text-sm font-medium text-gray-800">成果交付</p>
              <p className="text-xs text-gray-500">{project?.deliveryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {retakeTasks.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">补拍任务安排</h3>
          </div>
          <div className="space-y-3">
            {retakeTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    创建于 {task.createdAt} | 目标日期: {task.targetDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={retakeStatusConfig[task.status].variant}>
                    {retakeStatusConfig[task.status].label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleRetakeComplete(task.id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="标记完成"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRetakeDelete(task.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-500" />
            成果交付物
          </h3>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            添加交付物
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">文件名称</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">版本</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">审核意见</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {deliverables.map((deliverable) => (
                <tr key={deliverable.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-800">{deliverable.name}</span>
                      {deliverable.reviewComments?.includes('【需补拍】') && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{deliverable.version}</td>
                  <td className="py-4 px-4">
                    <Badge variant={statusConfig[deliverable.status].variant}>
                      {statusConfig[deliverable.status].label}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 max-w-xs" title={deliverable.reviewComments}>
                    <div className="truncate">{deliverable.reviewComments || '-'}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEdit(deliverable)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(deliverable.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {deliverables.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无交付物数据</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeliverable(null);
        }}
        title={editingDeliverable ? '编辑交付物' : '新建交付物'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文件名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文件路径</label>
            <input
              type="text"
              value={formData.filePath}
              onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
              className="form-input"
              placeholder="/deliverables/file.zip"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">版本号</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="form-input"
                placeholder="v1.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Deliverable['status'] })}
                className="form-select"
              >
                <option value="pending">待提交</option>
                <option value="reviewing">审核中</option>
                <option value="approved">已通过</option>
                <option value="rejected">需修改</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">审核意见</label>
            <textarea
              value={formData.reviewComments}
              onChange={(e) => setFormData({ ...formData, reviewComments: e.target.value })}
              className="form-textarea"
              rows={3}
              placeholder="验收意见、修改建议等"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.needsRetake}
                onChange={(e) => setFormData({ ...formData, needsRetake: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">需要补拍</span>
            </label>
          </div>
          {formData.needsRetake && (
            <div className="space-y-3 bg-orange-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">补拍说明</label>
                <textarea
                  value={formData.retakeDescription}
                  onChange={(e) => setFormData({ ...formData, retakeDescription: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  placeholder="请描述需要补拍的内容和要求"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">补拍截止日期</label>
                <input
                  type="date"
                  value={formData.retakeDate}
                  onChange={(e) => setFormData({ ...formData, retakeDate: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingDeliverable ? '保存修改' : '创建交付物'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
