import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import { useProjectStore } from '@/store/projectStore';
import { Plan } from '@/types';
import { teamMembers, equipmentList } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';

export default function Planning() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getPlansByProjectId, addPlan, updatePlan, deletePlan } = useProjectStore();
  const project = getProjectById(id || '');
  const plans = getPlansByProjectId(id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    batchName: '',
    startDate: '',
    endDate: '',
    backupDate: '',
    personnel: '',
    equipment: '',
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      if (editingPlan) {
        updatePlan(editingPlan.id, { ...formData, projectId: id });
      } else {
        addPlan({ ...formData, projectId: id });
      }
    }
    setIsModalOpen(false);
    setEditingPlan(null);
    setFormData({
      batchName: '',
      startDate: '',
      endDate: '',
      backupDate: '',
      personnel: '',
      equipment: '',
    });
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      batchName: plan.batchName,
      startDate: plan.startDate,
      endDate: plan.endDate,
      backupDate: plan.backupDate,
      personnel: plan.personnel,
      equipment: plan.equipment,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (planId: string) => {
    if (confirm('确定要删除这个计划吗？')) {
      deletePlan(planId);
    }
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      batchName: '',
      startDate: '',
      endDate: '',
      backupDate: '',
      personnel: '',
      equipment: '',
    });
    setIsModalOpen(true);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getPlansForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return plans.filter(plan => {
      return dateStr >= plan.startDate && dateStr <= plan.endDate;
    });
  };

  const formatDateRange = (plan: Plan) => {
    return `${plan.startDate} ~ ${plan.endDate}`;
  };

  return (
    <Layout title={`${project?.name || '项目'} - 计划安排`}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4" />
                添加计划
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                    day === null ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {day !== null && (
                    <>
                      <div className="text-sm font-medium text-gray-800 mb-1">{day}</div>
                      <div className="space-y-1">
                        {getPlansForDate(day).map((plan) => (
                          <div
                            key={plan.id}
                            className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded cursor-pointer hover:bg-primary-200"
                            title={plan.batchName}
                          >
                            {plan.batchName}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">飞行批次列表</h3>
              <Link
                to={`/projects/${id}/risk`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                下一步：风险登记
              </Link>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{plan.batchName}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateRange(plan)}</span>
                    </div>
                    {plan.backupDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span className="text-yellow-600">备用: {plan.backupDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>{plan.personnel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3" />
                      <span>{plan.equipment}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {plans.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">暂无计划</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">资源统计</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">飞行批次</span>
                <span className="text-lg font-bold text-gray-800">{plans.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">参与人员</span>
                <span className="text-lg font-bold text-gray-800">
                  {new Set(plans.flatMap(p => p.personnel.split('、'))).size}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">设备数量</span>
                <span className="text-lg font-bold text-gray-800">
                  {new Set(plans.flatMap(p => p.equipment.split('、'))).size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        title={editingPlan ? '编辑计划' : '新建计划'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">批次名称</label>
            <input
              type="text"
              value={formData.batchName}
              onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备用日期（可选）</label>
            <input
              type="date"
              value={formData.backupDate}
              onChange={(e) => setFormData({ ...formData, backupDate: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">参与人员</label>
            <select
              value={formData.personnel}
              onChange={(e) => setFormData({ ...formData, personnel: e.target.value })}
              className="form-select"
              required
            >
              <option value="">请选择人员</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">使用设备</label>
            <select
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="form-select"
              required
            >
              <option value="">请选择设备</option>
              {equipmentList.map((equipment) => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingPlan ? '保存修改' : '创建计划'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
