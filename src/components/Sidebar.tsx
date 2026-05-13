import {
  LayoutDashboard,
  FolderKanban,
  User,
  Settings,
  ChevronRight,
  Lock,
  FileText,
  CheckSquare,
  Folder,
  Trash2,
  Calendar,
  BarChart3,
  PlusCircle,
} from 'lucide-react';
import { cn } from './ui/utils';
import { Separator } from './ui/separator';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  currentRole?: 'contractor' | 'reviewer' | 'admin';
}

export function Sidebar({ activeView, onViewChange, currentRole = 'contractor' }: SidebarProps) {
  const navGroups = [
    {
      label: '',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Workpacks',
      items: [
        { id: 'workpacks', label: 'My Workpacks', icon: FileText },
        { id: 'create-workpack', label: 'Create Workpack', icon: PlusCircle },
      ],
    },
    {
      label: 'Collaboration',
      items: [
        { id: 'meetings', label: 'Meetings', icon: Calendar },
      ],
    },
    {
      label: 'Insights',
      items: [
        { id: 'reports', label: 'Reports', icon: BarChart3 },
      ],
    },
  ];

  if (currentRole !== 'contractor') {
    navGroups.push({
      label: 'System',
      items: [
        { id: 'trash', label: 'Trash', icon: Trash2 },
      ],
    });
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white">PM</span>
          </div>
          <span>Project Manager</span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {navGroups.map((group) => (
            <div key={group.label || 'main'}>
              {group.label && (
                <div className="px-4 mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {group.label}
                </div>
              )}

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onViewChange(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          activeView === item.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {activeView === item.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center gap-2 px-4 py-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Personal Workspace</span>
          </div>

          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onViewChange('personal-dashboard')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                  activeView === 'personal-dashboard'
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="flex-1 text-left">Dashboard</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => onViewChange('personal-projects')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                  activeView === 'personal-projects'
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Folder className="w-4 h-4" />
                <span className="flex-1 text-left">My Projects</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">2</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => onViewChange('personal-tasks')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                  activeView === 'personal-tasks'
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <CheckSquare className="w-4 h-4" />
                <span className="flex-1 text-left">Tasks</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">8</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">Need help?</p>
          <button className="text-blue-600 text-sm mt-1 hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}