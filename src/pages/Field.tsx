import { useState } from 'react';
import { Plus, Edit2, Trash2, Camera, FileText, Map, AlertCircle, ChevronRight, Upload, ImageIcon } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import { useProjectStore } from '@/store/projectStore';
import { FieldReport } from '@/types';
import { useParams, Link } from 'react-router-dom';

export default function Field() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, getFieldReportsByProjectId, addFieldReport, updateFieldReport, deleteFieldReport } = useProjectStore();
  const project = getProjectById(id || '');
  const reports = getFieldReportsByProjectId(id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<FieldReport | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    flightRecords: '',
    photos: [] as string[],
    trajectory: '',
    issues: '',
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      if (editingReport) {
        updateFieldReport(editingReport.id, { ...formData, projectId: id });
      } else {
        addFieldReport({ ...formData, projectId: id });
      }
    }
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({
      date: '',
      flightRecords: '',
      photos: [],
      trajectory: '',
      issues: '',
    });
  };

  const handleEdit = (report: FieldReport) => {
    setEditingReport(report);
    setFormData({
      date: report.date,
      flightRecords: report.flightRecords,
      photos: report.photos,
      trajectory: report.trajectory,
      issues: report.issues,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (reportId: string) => {
    if (confirm('确定要删除这个外业报告吗？')) {
      deleteFieldReport(reportId);
    }
  };

  const handleAdd = () => {
    setEditingReport(null);
    setFormData({
      date: '',
      flightRecords: '',
      photos: [],
      trajectory: '',
      issues: '',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        alert('上传成功');
      }
    }, 200);
  };

  const totalRecords = reports.length;
  const totalPhotos = reports.reduce((sum, r) => sum + r.photos.length, 0);
  const reportsWithIssues = reports.filter(r => r.issues && r.issues !== '无异常情况，飞行顺利').length;

  return (
    <Layout title={`${project?.name || '项目'} - 外业执行`}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalRecords}</p>
              <p className="text-sm text-gray-500">飞行记录</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalPhotos}</p>
              <p className="text-sm text-gray-500">照片数量</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Map className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalRecords}</p>
              <p className="text-sm text-gray-500">轨迹文件</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{reportsWithIssues}</p>
              <p className="text-sm text-gray-500">问题上报</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${id}/delivery`}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>下一步：交付管理</span>
          </Link>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          添加记录
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            飞行记录列表
          </h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-800">{report.date}</span>
                    {report.issues && report.issues !== '无异常情况，飞行顺利' && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        有问题
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(report)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{report.flightRecords}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {report.photos.length} 张照片
                  </span>
                  {report.trajectory && (
                    <span className="flex items-center gap-1">
                      <Map className="w-3 h-3" />
                      轨迹文件
                    </span>
                  )}
                </div>
                {report.issues && (
                  <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-xs rounded">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    {report.issues}
                  </div>
                )}
              </div>
            ))}
            
            {reports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">暂无飞行记录</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-500" />
              快速上传照片
            </h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={handleFileUpload}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">上传中... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">点击或拖拽上传照片</p>
                  <p className="text-xs text-gray-400">支持 JPG、PNG 格式，单次最多上传 10 张</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-purple-500" />
              轨迹文件上传
            </h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={handleFileUpload}
            >
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <Map className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">点击或拖拽上传轨迹文件</p>
                <p className="text-xs text-gray-400">支持 GPX、KML 格式</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReport(null);
        }}
        title={editingReport ? '编辑记录' : '新建外业记录'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">飞行记录</label>
            <textarea
              value={formData.flightRecords}
              onChange={(e) => setFormData({ ...formData, flightRecords: e.target.value })}
              className="form-textarea"
              rows={3}
              placeholder="飞行时长、高度、覆盖面积等"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">照片数量</label>
            <input
              type="number"
              value={formData.photos.length}
              onChange={(e) => setFormData({ ...formData, photos: Array(parseInt(e.target.value) || 0).fill('') })}
              className="form-input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">轨迹文件</label>
            <input
              type="text"
              value={formData.trajectory}
              onChange={(e) => setFormData({ ...formData, trajectory: e.target.value })}
              className="form-input"
              placeholder="文件名.gpx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">问题说明（可选）</label>
            <textarea
              value={formData.issues}
              onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
              className="form-textarea"
              rows={3}
              placeholder="现场遇到的问题、异常情况等"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingReport ? '保存修改' : '创建记录'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
