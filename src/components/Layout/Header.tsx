import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function Header({ title, searchPlaceholder = '搜索项目...', onSearch }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-xl font-bold text-primary-600">{title}</h1>
      
      <div className="flex items-center gap-4">
        {onSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
        
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">管理员</span>
        </div>
      </div>
    </header>
  );
}
