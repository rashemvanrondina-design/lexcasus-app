import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';
import { Sun, Moon, Menu } from 'lucide-react';

const adminPageTitles: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/questions': 'Manage Bar Questions',
  '/admin/codals': 'Manage E-Codals',
  '/admin/users': 'User Management',
  '/admin/subscriptions': 'Subscription Control',
};

const AdminHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { sidebarOpen, toggleSidebar, toggleMobileSidebar } = useUIStore();

  const title = adminPageTitles[location.pathname] || 'Admin Panel';

  return (
    <header className={cn(
      'sticky top-0 z-30 h-16 bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-navy-800 flex items-center justify-between px-4 sm:px-6 transition-all duration-300',
      sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
    )}>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={toggleSidebar}
          className="hidden lg:block p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="badge-gold text-xs"
        >
          Admin Panel
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
