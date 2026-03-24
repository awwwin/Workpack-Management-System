import { Outlet, useNavigate, useLocation } from 'react-router';
import { 
  Package, 
  LayoutDashboard, 
  FileText, 
  Search, 
  User,
  Settings,
  LogOut,
  PlusCircle,
  CheckCircle,
  Users,
  BarChart3,
  Zap,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { getCurrentUser } from '../lib/mockData';
import { useState } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoPanel, setShowDemoPanel] = useState(true);

  const handleLogout = () => {
    navigate('/');
  };

  const handleRoleSwitch = (role: 'contractor' | 'reviewer' | 'admin') => {
    localStorage.setItem('userRole', role);
    navigate(`/dashboard/${role}`);
    window.location.reload();
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { 
        id: 'dashboard',
        path: `/dashboard/${currentUser.role}`, 
        label: 'Dashboard', 
        icon: LayoutDashboard 
      },
    ];

    if (currentUser.role === 'contractor') {
      return [
        ...baseItems,
        { id: 'create-workpack', path: '/dashboard/create-workpack', label: 'Create Workpack', icon: PlusCircle },
        { id: 'workpacks', path: '/dashboard/workpacks', label: 'My Workpacks', icon: FileText },
        { id: 'reports', path: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
      ];
    }

    if (currentUser.role === 'reviewer') {
      return [
        ...baseItems,
        { id: 'workpacks', path: '/dashboard/workpacks', label: 'Review Queue', icon: CheckCircle },
        { id: 'reports', path: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
      ];
    }

    if (currentUser.role === 'admin') {
      return [
        ...baseItems,
        { id: 'workpacks', path: '/dashboard/workpacks', label: 'All Workpacks', icon: FileText },
        { id: 'reports', path: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
        { id: 'user-management', path: '/dashboard/user-management', label: 'User Management', icon: Users },
        { id: 'system-settings', path: '/dashboard/system-settings', label: 'System Settings', icon: Settings },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">PACK-D</div>
              <div className="text-xs text-slate-500 capitalize">{currentUser.role}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === `/dashboard/${currentUser.role}` && location.pathname === '/dashboard');
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-500">{currentUser.email}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown 
              isOpen={showProfileMenu} 
              onClose={() => setShowProfileMenu(false)} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workpacks, projects..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-6">
              <NotificationDropdown />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}