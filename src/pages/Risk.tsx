import { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, Cloud, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { useProjectStore } from '@/store/projectStore';
import type { Risk, RiskType, RiskLevel } from '@/types';
import { useParams, Link } from 'react-router-dom';

const typeConfig: Record<RiskType, { label: string; icon: typeof AlertTriangle; color: string }> = {
  airspace: { label: '空域限制', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
  weather: { label: '天气窗口', icon: Cloud, color: 'bg-blue-100 text-blue-700' },
  takeoff: { label: '起降点条件', icon: MapPin, color: 'bg-yellow-100 text-yellow-700' },
};

const levelConfig: Record<RiskLevel, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  high: { label: '高', variant: 'danger' },
  medium: { label: '中', variant: 'warning' },
  low: { label: '低', variant: 'default' },
};

export default function Risk() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getRisksByProjectId, addRisk, updateRisk, deleteRisk } = useProjectStore();
  const project = getProjectById(id || '');
  const risks = getRisksByProjectId(id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [formData, setFormData] = useState({
    type: 'airspace' as RiskType,
    description: '',
    level: 'medium' as RiskLevel,
    status: 'active' as 'active' | 'resolved',
    mitigation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      if (editingRisk) {
        updateRisk(editingRisk.id, { ...formData, projectId: id });
      } else {
        addRisk({ ...formData, projectId: id });
      }
    }
    setIsModalOpen(false);
    setEditingRisk(null);
    setFormData({
      type: 'airspace',
      description: '',
      level: 'medium',
      status: 'active',
      mitigation: '',
    });
  };

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setFormData({
      type: risk.type,
      description: risk.description,
      level: risk.level,
      status: risk.status,
      mitigation: risk.mitigation,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (riskId: string) => {
    if (confirm('确定要删除这个风险吗？')) {
      deleteRisk(riskId);
    }
  };

  const handleAdd = () => {
    setEditingRisk(null);
    setFormData({
      type: 'airspace',
      description: '',
      level: 'medium',
      status: 'active',
      mitigation: '',
    });
    setIsModalOpen(true);
  };

  const activeRisks = risks.filter(r => r.status === 'active');
  const resolvedRisks = risks.filter(r => r.status === 'resolved');
  const highLevelRisks = risks.filter(r => r.level === 'high' && r.status === 'active').length;

  return (
    <Layout title={`${project?.name || '项目'} - 风险登记`}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{risks.length}</p>
              <p className="text-sm text-gray-500">风险总数</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{highLevelRisks}</p>
              <p className="text-sm text-gray-500">高风险</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Cloud className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeRisks.length}</p>
              <p className="text-sm text-gray-500">待处理</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{resolvedRisks.length}</p>
              <p className="text-sm text-gray-500">已解决</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${id}/field`}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>下一步：外业执行</span>
          </Link>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          添加风险
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            待处理风险
          </h3>
          <div className="space-y-3">
            {activeRisks.map((risk) => {
              const TypeIcon = typeConfig[risk.type].icon;
              return (
                <div
                  key={risk.id}
                  className="p-4 bg-red-50 rounded-lg border border-red-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig[risk.type].color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig[risk.type].label}
                      </span>
                      <Badge variant={levelConfig[risk.level].variant}>
                        {levelConfig[risk.level].label}风险
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(risk)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(risk.id)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                  {risk.mitigation && (
                    <div className="text-xs text-gray-500 bg-red-100/50 px-2 py-1.5 rounded">
                      <span className="font-medium">应对措施：</span>
                      {risk.mitigation}
                    </div>
                  )}
                </div>
              );
            })}
            
            {activeRisks.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">暂无待处理风险</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            已解决风险
          </h3>
          <div className="space-y-3">
            {resolvedRisks.map((risk) => {
              const TypeIcon = typeConfig[risk.type].icon;
              return (
                <div
                  key={risk.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig[risk.type].color} opacity-70`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig[risk.type].label}
                      </span>
                      <Badge variant="success">已解决</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(risk)}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(risk.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-through">{risk.description}</p>
                  {risk.mitigation && (
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1.5 rounded">
                      <span className="font-medium">处理方式：</span>
                      {risk.mitigation}
                    </div>
                  )}
                </div>
              );
            })}
            
            {resolvedRisks.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">暂无已解决风险</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRisk(null);
        }}
        title={editingRisk ? '编辑风险' : '新建风险'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">风险类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as RiskType })}
              className="form-select"
            >
              <option value="airspace">空域限制</option>
              <option value="weather">天气窗口</option>
              <option value="takeoff">起降点条件</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">风险描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as RiskLevel })}
              className="form-select"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'resolved' })}
              className="form-select"
            >
              <option value="active">待处理</option>
              <option value="resolved">已解决</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应对措施（可选）</label>
            <textarea
              value={formData.mitigation}
              onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingRisk ? '保存修改' : '创建风险'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
