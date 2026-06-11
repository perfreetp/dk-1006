import { useState } from 'react';
import { Plus, Edit2, Trash2, Plane, Box, Search, User, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { useProjectStore } from '@/store/projectStore';
import { Requirement, RequirementType, RequirementPriority } from '@/types';
import { teamMembers } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';

const typeConfig: Record<RequirementType, { label: string; icon: typeof Plane; color: string }> = {
  aerial: { label: '航摄', icon: Plane, color: 'bg-blue-100 text-blue-700' },
  modeling: { label: '建模', icon: Box, color: 'bg-purple-100 text-purple-700' },
  inspection: { label: '巡查', icon: Search, color: 'bg-green-100 text-green-700' },
};

const priorityConfig: Record<RequirementPriority, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  high: { label: '高', variant: 'danger' },
  medium: { label: '中', variant: 'warning' },
  low: { label: '低', variant: 'default' },
};

const statusConfig = {
  pending: { label: '待执行', variant: 'default' as const },
  in_progress: { label: '进行中', variant: 'info' as const },
  completed: { label: '已完成', variant: 'success' as const },
};

export default function Requirements() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getRequirementsByProjectId, addRequirement, updateRequirement, deleteRequirement } = useProjectStore();
  const project = getProjectById(id || '');
  const requirements = getRequirementsByProjectId(id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [formData, setFormData] = useState({
    type: 'aerial' as RequirementType,
    name: '',
    description: '',
    priority: 'medium' as RequirementPriority,
    assignee: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      if (editingRequirement) {
        updateRequirement(editingRequirement.id, { ...formData, projectId: id });
      } else {
        addRequirement({ ...formData, projectId: id });
      }
    }
    setIsModalOpen(false);
    setEditingRequirement(null);
    setFormData({
      type: 'aerial',
      name: '',
      description: '',
      priority: 'medium',
      assignee: '',
      status: 'pending',
    });
  };

  const handleEdit = (requirement: Requirement) => {
    setEditingRequirement(requirement);
    setFormData({
      type: requirement.type,
      name: requirement.name,
      description: requirement.description,
      priority: requirement.priority,
      assignee: requirement.assignee,
      status: requirement.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (requirementId: string) => {
    if (confirm('确定要删除这个需求吗？')) {
      deleteRequirement(requirementId);
    }
  };

  const handleAdd = () => {
    setEditingRequirement(null);
    setFormData({
      type: 'aerial',
      name: '',
      description: '',
      priority: 'medium',
      assignee: '',
      status: 'pending',
    });
    setIsModalOpen(true);
  };

  const aerialCount = requirements.filter(r => r.type === 'aerial').length;
  const modelingCount = requirements.filter(r => r.type === 'modeling').length;
  const inspectionCount = requirements.filter(r => r.type === 'inspection').length;
  const completedCount = requirements.filter(r => r.status === 'completed').length;
  const progress = requirements.length > 0 ? Math.round((completedCount / requirements.length) * 100) : 0;

  return (
    <Layout title={`${project?.name || '项目'} - 需求拆解`}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{aerialCount}</p>
              <p className="text-sm text-gray-500">航摄任务</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Box className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{modelingCount}</p>
              <p className="text-sm text-gray-500">建模任务</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{inspectionCount}</p>
              <p className="text-sm text-gray-500">巡查任务</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{progress}%</p>
              <p className="text-sm text-gray-500">完成进度</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${id}/planning`}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>下一步：计划安排</span>
          </Link>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          添加需求
        </Button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">任务类型</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">任务名称</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">描述</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">优先级</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">负责人</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((requirement) => {
                const TypeIcon = typeConfig[requirement.type].icon;
                return (
                  <tr key={requirement.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[requirement.type].color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig[requirement.type].label}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">{requirement.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate" title={requirement.description}>
                      {requirement.description}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={priorityConfig[requirement.priority].variant}>
                        {priorityConfig[requirement.priority].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-700">{requirement.assignee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusConfig[requirement.status].variant}>
                        {statusConfig[requirement.status].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(requirement)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(requirement.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {requirements.length === 0 && (
            <div className="text-center py-12">
              <Box className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无需求数据</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRequirement(null);
        }}
        title={editingRequirement ? '编辑需求' : '新建需求'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任务类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as RequirementType })}
              className="form-select"
            >
              <option value="aerial">航摄任务</option>
              <option value="modeling">建模任务</option>
              <option value="inspection">巡查任务</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as RequirementPriority })}
                className="form-select"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="form-select"
                required
              >
                <option value="">请选择负责人</option>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'in_progress' | 'completed' })}
              className="form-select"
            >
              <option value="pending">待执行</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingRequirement ? '保存修改' : '创建需求'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
