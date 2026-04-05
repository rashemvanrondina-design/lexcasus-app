import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn, getInitials } from '../../lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  FlaskConical,
  MessageSquare,
  BookOpen,
  FileText,
  Scale,
  LogOut,
  X,
  Shield,
  Crown,
  User,
  CreditCard,
  AlertTriangle,
  Diamond // 🟢 Added Diamond for Premium+
} from 'lucide-react';

const clientNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/schedule', label: 'Schedule', icon: CalendarDays },
  { path: '/practice', label: 'Practice Bar', icon: FlaskConical },
  { path: '/chat', label: 'Legal Chat AI', icon: MessageSquare },
  { path: '/codals', label: 'E-Codals', icon: BookOpen },
  { path: '/notes', label: 'Notes', icon: FileText },
  { path: '/cases', label: 'Cases', icon: Scale },
];

const clientBottomItems = [
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/disclaimer', label: 'Disclaimer', icon: AlertTriangle },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, mobileSidebarOpen, closeMobileSidebar } = useUIStore();

  const subscription = user?.subscription || 'free'; 

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
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
          'flex items-center h-16 px-4 border-b border-navy-800 shrink-0',
          sidebarOpen ? 'justify-between' : 'justify-center'
        )}>
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2.5" onClick={closeMobileSidebar}>
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20">
                <Scale className="w-5 h-5 text-navy-900" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">LexCasus</span>
            </Link>
          )}
          {!sidebarOpen && (
            <Link to="/dashboard" onClick={closeMobileSidebar}>
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20">
                <Scale className="w-5 h-5 text-navy-900" />
              </div>
            </Link>
          )}
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {clientNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={cn(
                  'sidebar-item group relative',
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-gold-400" : "group-hover:text-gold-400")} />
                {sidebarOpen && (
                  <span className="flex-1 font-medium">{item.label}</span>
                )}
                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-navy-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-navy-800 py-3 px-3 space-y-1 shrink-0">
          {clientBottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={cn(
                  'sidebar-item group relative',
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 font-medium">{item.label}</span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-navy-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* 🟢 NEW: Constant Upsell for Free Users */}
        {sidebarOpen && subscription === 'free' && (
          <div className="px-4 pb-3 shrink-0">
            <Link 
              to="/billing" 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 rounded-xl text-sm font-bold shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all hover:-translate-y-0.5"
            >
              <Crown className="w-4 h-4" />
              Upgrade Plan
            </Link>
          </div>
        )}

        {/* User section */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-navy-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold-500/20 border border-gold-500/30 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-gold-400">
                  {getInitials(user?.name || 'Atty.')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  Atty. {user?.name || 'Counsel'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {subscription === 'premium_plus' ? (
                    <Diamond className="w-3 h-3 text-purple-400" />
                  ) : subscription === 'premium' ? (
                    <Crown className="w-3 h-3 text-gold-400" />
                  ) : (
                    <Shield className="w-3 h-3 text-gray-400" />
                  )}
                  
                  <span className={cn(
                    'text-[11px] font-semibold uppercase tracking-wider',
                    subscription === 'premium_plus' ? 'text-purple-400' :
                    subscription === 'premium' ? 'text-gold-400' : 'text-gray-400'
                  )}>
                    {subscription.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;