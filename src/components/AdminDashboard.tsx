import { useEffect,useState } from 'react';
import { 
  Users,
  FileText, 
  Settings, 
  TrendingUp,
  UserPlus,
  Shield,
  Layout,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'workflows'>('overview');
  const { showToast, ToastContainer } = useToast();
  const [users, setUsers] = useState<any[]>([]);
const [workpacks, setWorkpacks] = useState<any[]>([]);
const userMap = Object.fromEntries(
  users.map((u) => [u.id, u.full_name || u.email || 'Unknown User'])
);

useEffect(() => {
  async function loadAdminDashboard() {
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Users fetch error:', usersError.message);
      return;
    }

    const { data: workpacksData, error: workpacksError } = await supabase
      .from('workpacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (workpacksError) {
      console.error('Workpacks fetch error:', workpacksError.message);
      return;
    }

    setUsers(usersData || []);
    setWorkpacks(workpacksData || []);
  }

  loadAdminDashboard();
}, []);

  // Statistics
const totalUsers = users.length;
const contractors = users.filter(u => u.role === 'contractor').length;
const reviewers = users.filter(u => u.role === 'reviewer').length;
const totalWorkpacks = workpacks.length;
const pendingReview = workpacks.filter(w => w.status === 'pending_review').length;
const approved = workpacks.filter(w => w.status === 'approved').length;
const rejected = workpacks.filter(w => w.status === 'rejected').length;
const revisionRequested = workpacks.filter(w => w.status === 'revision_requested').length;

  // Mock templates
  const templates = [
    { id: 1, name: 'Foundation Work', category: 'Structural', usage: 24, status: 'active' },
    { id: 2, name: 'HVAC Installation', category: 'Mechanical', usage: 18, status: 'active' },
    { id: 3, name: 'Electrical Wiring', category: 'Electrical', usage: 32, status: 'active' },
    { id: 4, name: 'Plumbing Systems', category: 'Plumbing', usage: 15, status: 'active' },
    { id: 5, name: 'Fire Protection', category: 'Safety', usage: 12, status: 'draft' },
  ];

  // Mock workflows
  const workflows = [
    { id: 1, name: 'Standard Review', steps: 4, approvers: 2, status: 'active' },
    { id: 2, name: 'Fast Track', steps: 2, approvers: 1, status: 'active' },
    { id: 3, name: 'Critical Review', steps: 6, approvers: 3, status: 'active' },
    { id: 4, name: 'Safety Review', steps: 5, approvers: 2, status: 'inactive' },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Manage system settings, users, and configurations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{totalUsers}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Total Users</div>
          <div className="mt-2 text-xs text-slate-500">
            {contractors} Contractors, {reviewers} Reviewers
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{totalWorkpacks}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Total Workpacks</div>
          <div className="mt-2 text-xs text-slate-500">
            {pendingReview} pending review
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{approved}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Approved</div>
          <div className="mt-2 text-xs text-slate-500">
            This month
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Layout className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{templates.length}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Templates</div>
          <div className="mt-2 text-xs text-slate-500">
            {templates.filter(t => t.status === 'active').length} active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
              }`}
            >
              <span className="font-medium">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
              }`}
            >
              <span className="font-medium">Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`py-4 px-2 border-b-2 transition-all ${
                activeTab === 'workflows'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
              }`}
            >
              <span className="font-medium">Approval Workflows</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="p-3 bg-blue-600 rounded-xl inline-block mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Pending Reviews</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingReview}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Workpacks awaiting review</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                  <div className="p-3 bg-emerald-600 rounded-xl inline-block mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Approved</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{approved}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Successfully approved</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="p-3 bg-orange-600 rounded-xl inline-block mb-4">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Revisions</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {revisionRequested}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Revision requested</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                  <div className="p-3 bg-red-600 rounded-xl inline-block mb-4">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Rejected</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{rejected}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Rejected submissions</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">System Activity</h3>
                <div className="space-y-3">
                  {workpacks.slice(0, 5).map((wp) => (
                    <div key={wp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{wp.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">by {userMap[wp.created_by] || 'Unknown User'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        wp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        wp.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
                        wp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700 dark:text-slate-300'
                      }`}>
                        {wp.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Workpack Templates</h3>
                <button 
                  onClick={() => showToast('Template creation coming soon!', 'info')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  <Layout className="w-4 h-4" />
                  Create Template
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{template.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{template.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 dark:text-slate-300'
                      }`}>
                        {template.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 dark:text-slate-300">Used {template.usage} times</p>
                      <button 
                        onClick={() => showToast('Template editing coming soon!', 'info')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Approval Workflows</h3>
                <button 
                  onClick={() => showToast('Workflow creation coming soon!', 'info')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  <Shield className="w-4 h-4" />
                  Create Workflow
                </button>
              </div>
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{workflow.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {workflow.steps} steps • {workflow.approvers} approvers required
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 dark:text-slate-300'
                      }`}>
                        {workflow.status}
                      </span>
                      <button 
                        onClick={() => showToast('Workflow settings coming soon!', 'info')}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-all"
                      >
                        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}