import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function Layout({ children, title, searchPlaceholder, onSearch }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 transition-all duration-300">
        <Header title={title} searchPlaceholder={searchPlaceholder} onSearch={onSearch} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
