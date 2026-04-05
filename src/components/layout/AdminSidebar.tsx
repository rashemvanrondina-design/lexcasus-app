import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn, getInitials } from '../../lib/utils';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  CreditCard,
  LogOut,
  X,
  Settings,
  BookOpen,
  Megaphone, // 🟢 AMENDMENT: Imported the Megaphone icon
} from 'lucide-react';

// 🟢 AMENDMENT: Added the Popups & Promos route to the array
const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/questions', label: 'Bar Questions', icon: FlaskConical },
  { path: '/admin/codals', label: 'E-Codals', icon: BookOpen },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/admin/promos', label: 'Popups & Promos', icon: Megaphone },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, mobileSidebarOpen, closeMobileSidebar } = useUIStore();

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-navy-900 dark:bg-navy-950 border-r border-navy-800 dark:border-navy-900 flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-navy-800',
          sidebarOpen ? 'justify-between' : 'justify-center'
        )}>
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2.5" onClick={closeMobileSidebar}>
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-navy-900" />
              </div>
              <span className="text-lg font-bold text-white">LexCasus Admin</span>
            </Link>
          )}
          {!sidebarOpen && (
            <Link to="/admin" onClick={closeMobileSidebar}>
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-navy-900" />
              </div>
            </Link>
          )}
          <button onClick={closeMobileSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={cn(
                  'sidebar-item',
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold-500/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gold-400">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gold-400">Administrator</p>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;