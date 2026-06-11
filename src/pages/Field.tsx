import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Camera, FileText, Map, AlertCircle, ChevronRight, Upload, X, Clock } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import { useProjectStore } from '@/store/projectStore';
import { FieldReport, FieldFile } from '@/types';
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
    photos: [] as FieldFile[],
    trajectory: {} as FieldFile,
    issues: '',
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const trajectoryInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const saveData: Omit<FieldReport, 'id'> = {
        ...formData,
        projectId: id,
        photos: formData.photos.map(f => ({ name: f.name, uploadTime: f.uploadTime })),
        trajectory: formData.trajectory.name ? { name: formData.trajectory.name, uploadTime: formData.trajectory.uploadTime } : ({} as FieldFile),
      };
      if (editingReport) {
        updateFieldReport(editingReport.id, saveData);
      } else {
        addFieldReport(saveData);
      }
    }
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({
      date: '',
      flightRecords: '',
      photos: [],
      trajectory: {} as FieldFile,
      issues: '',
    });
  };

  const handleEdit = (report: FieldReport) => {
    setEditingReport(report);
    setFormData({
      date: report.date,
      flightRecords: report.flightRecords,
      photos: report.photos as unknown as FieldFile[],
      trajectory: report.trajectory as unknown as FieldFile,
      issues: report.issues,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (reportId: string) => {
    if (confirm('确定要删除这个外业报告吗？关联的照片和轨迹文件也会被删除。')) {
      deleteFieldReport(reportId);
    }
  };

  const handleAdd = () => {
    setEditingReport(null);
    setFormData({
      date: '',
      flightRecords: '',
      photos: [],
      trajectory: {} as FieldFile,
      issues: '',
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: FieldFile[] = Array.from(files).map(file => ({
        name: file.name,
        uploadTime: new Date().toISOString(),
        size: file.size,
        type: file.type,
      }));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleTrajectoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        trajectory: {
          name: file.name,
          uploadTime: new Date().toISOString(),
          size: file.size,
          type: file.type,
        },
      }));
    }
    if (trajectoryInputRef.current) {
      trajectoryInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const removeTrajectory = () => {
    setFormData(prev => ({
      ...prev,
      trajectory: {} as FieldFile,
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRecords = reports.length;
  const totalPhotos = reports.reduce((sum, r) => sum + (Array.isArray(r.photos) ? r.photos.length : 0), 0);
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
              <p className="text-sm text-gray-600 mb-3">{report.flightRecords}</p>
              
              <div className="space-y-2 mb-3">
                {Array.isArray(report.photos) && report.photos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <Camera className="w-3 h-3" />
                      照片 ({report.photos.length}张)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(report.photos as unknown as FieldFile[]).map((photo, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                          {photo.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {report.trajectory && typeof report.trajectory === 'object' && (report.trajectory as FieldFile).name && (
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <Map className="w-3 h-3" />
                      轨迹文件
                    </p>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                      {(report.trajectory as FieldFile).name}
                    </span>
                  </div>
                )}
              </div>
              
              {report.issues && (
                <div className="p-2 bg-yellow-50 text-yellow-700 text-xs rounded">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">照片上传</label>
            <input
              ref={photoInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">点击上传照片 (支持 JPG、PNG)</p>
            </button>
            {formData.photos.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{photo.name}</span>
                      <span className="text-xs text-gray-400">({formatFileSize(photo.size || 0)})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(photo.uploadTime || '')}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">轨迹文件</label>
            <input
              ref={trajectoryInputRef}
              type="file"
              accept=".gpx,.kml"
              onChange={handleTrajectoryUpload}
              className="hidden"
              id="trajectory-upload"
            />
            <button
              type="button"
              onClick={() => trajectoryInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">点击上传轨迹文件 (支持 GPX、KML)</p>
            </button>
            {formData.trajectory.name && (
              <div className="mt-2 flex items-center justify-between px-3 py-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700">{formData.trajectory.name}</span>
                  <span className="text-xs text-gray-400">({formatFileSize(formData.trajectory.size || 0)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(formData.trajectory.uploadTime || '')}
                  </span>
                  <button
                    type="button"
                    onClick={removeTrajectory}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </div>
            )}
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
