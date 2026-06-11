import { useState } from 'react';
import {
  FolderKanban,
  ClipboardList,
  Calendar,
  AlertTriangle,
  Camera,
  Package,
  ChevronLeft,
  ChevronRight,
  Plane,
  AlertCircle,
  FileText,
  Bell,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';

interface NavItem {
  id: string;
  label: string;
  icon: typeof FolderKanban;
  path: string;
  isGlobal?: boolean;
}

const navItems: NavItem[] = [
  { id: 'projects', label: '项目列表', icon: FolderKanban, path: '/' },
  { id: 'collaborations', label: '协作提醒', icon: Bell, path: '/collaborations', isGlobal: true },
  { id: 'requirements', label: '需求拆解', icon: ClipboardList, path: '/projects/:id/requirements' },
  { id: 'planning', label: '计划安排', icon: Calendar, path: '/projects/:id/planning' },
  { id: 'risk', label: '风险登记', icon: AlertTriangle, path: '/projects/:id/risk' },
  { id: 'field', label: '外业执行', icon: Camera, path: '/projects/:id/field' },
  { id: 'delivery', label: '交付管理', icon: Package, path: '/projects/:id/delivery' },
  { id: 'review', label: '项目复盘', icon: FileText, path: '/projects/:id/review' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const { getProjectById, getAllCollaborationTasks } = useProjectStore();
  
  const currentProjectId = params.id || localStorage.getItem('currentProjectId') || '';
  const currentProject = currentProjectId ? getProjectById(currentProjectId) : null;
  const taskCount = getAllCollaborationTasks().length;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/collaborations') return location.pathname === '/collaborations';
    return location.pathname.startsWith(path.replace(':id', ''));
  };

  const getNavPath = (path: string) => {
    if (path === '/') return '/';
    if (path === '/collaborations') return '/collaborations';
    if (currentProjectId) {
      return path.replace(':id', currentProjectId);
    }
    return '/';
  };

  const handleNavClick = (item: NavItem) => {
    if (!item.isGlobal && !currentProjectId && params.id) {
      alert('请先选择一个项目');
      return false;
    }
    if (currentProjectId) {
      localStorage.setItem('currentProjectId', currentProjectId);
    }
    return true;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary-600 text-white transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b border-primary-500">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-accent-400" />
              <span className="font-bold text-lg">飞行协同</span>
            </div>
          )}
          {collapsed && <Plane className="w-8 h-8 text-accent-400" />}
        </div>

        {currentProject && !collapsed && (
          <div className="px-4 py-3 bg-primary-700 border-b border-primary-500">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent-400" />
              <span className="text-xs text-gray-300">当前项目</span>
            </div>
            <p className="text-sm font-medium mt-1 truncate">{currentProject.name}</p>
          </div>
        )}

        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={getNavPath(item.path)}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative ${
                    isActive(item.path)
                      ? 'bg-accent-500 text-white'
                      : 'hover:bg-primary-500 text-gray-200'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  {!collapsed && item.id === 'collaborations' && taskCount > 0 && (
                    <span className="absolute right-2 top-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {taskCount > 9 ? '9+' : taskCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-12 flex items-center justify-center border-t border-primary-500 hover:bg-primary-500 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
