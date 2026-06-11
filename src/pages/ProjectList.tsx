import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar, DollarSign, ClipboardList, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { useProjectStore } from '@/store/projectStore';
import { Project, ProjectStatus } from '@/types';
import { clients, regions } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  pending: { label: '待启动', variant: 'default' },
  in_progress: { label: '进行中', variant: 'info' },
  completed: { label: '已完成', variant: 'success' },
  delayed: { label: '已延期', variant: 'danger' },
};

export default function ProjectList() {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    region: '',
    budget: '',
    deliveryDate: '',
    status: 'pending' as ProjectStatus,
  });
  
  const navigate = useNavigate();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = !filterClient || project.client === filterClient;
    const matchesRegion = !filterRegion || project.region === filterRegion;
    return matchesSearch && matchesClient && matchesRegion;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
      });
    } else {
      addProject({
        ...formData,
        budget: parseFloat(formData.budget) || 0,
      });
    }
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      client: '',
      region: '',
      budget: '',
      deliveryDate: '',
      status: 'pending',
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client: project.client,
      region: project.region,
      budget: project.budget.toString(),
      deliveryDate: project.deliveryDate,
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      deleteProject(id);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      client: '',
      region: '',
      budget: '',
      deliveryDate: '',
      status: 'pending',
    });
    setIsModalOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    localStorage.setItem('currentProjectId', projectId);
    navigate(`/projects/${projectId}/requirements`);
  };

  return (
    <Layout title="项目列表" searchPlaceholder="搜索项目或客户..." onSearch={setSearchQuery}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="form-select w-48"
          >
            <option value="">全部客户</option>
            {clients.map((client) => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="form-select w-48"
          >
            <option value="">全部区域</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          新建项目
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="card hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                {project.name}
              </h3>
              <Badge variant={statusConfig[project.status].variant}>
                {statusConfig[project.status].label}
              </Badge>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-gray-400" />
                <span>{project.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{project.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>{project.budget.toLocaleString()} 元</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>交付日期: {project.deliveryDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">更新于 {project.updatedAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>查看详情</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">暂无项目数据</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        title={editingProject ? '编辑项目' : '新建项目'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">客户</label>
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="form-select"
                required
              >
                <option value="">请选择客户</option>
                {clients.map((client) => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="form-select"
                required
              >
                <option value="">请选择区域</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">预算 (元)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">交付日期</label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              className="form-select"
            >
              <option value="pending">待启动</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="delayed">已延期</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingProject ? '保存修改' : '创建项目'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
