import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Calendar,
  AlertTriangle,
  Camera,
  Package,
  ChevronLeft,
  ChevronRight,
  Plane,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'projects', label: '项目列表', icon: FolderKanban, path: '/' },
  { id: 'requirements', label: '需求拆解', icon: ClipboardList, path: '/projects/:id/requirements' },
  { id: 'planning', label: '计划安排', icon: Calendar, path: '/projects/:id/planning' },
  { id: 'risk', label: '风险登记', icon: AlertTriangle, path: '/projects/:id/risk' },
  { id: 'field', label: '外业执行', icon: Camera, path: '/projects/:id/field' },
  { id: 'delivery', label: '交付管理', icon: Package, path: '/projects/:id/delivery' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.replace(':id', ''));
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

        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path === '/projects/:id/requirements' ? '/' : item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-accent-500 text-white'
                      : 'hover:bg-primary-500 text-gray-200'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
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
