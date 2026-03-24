import { useNavigate } from 'react-router';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { mockWorkpacks } from '../lib/mockData';

export function ContractorDashboard() {
  const navigate = useNavigate();

  // Calculate statistics
  const totalWorkpacks = mockWorkpacks.length;
  const pendingReview = mockWorkpacks.filter(w => w.status === 'pending_review').length;
  const approved = mockWorkpacks.filter(w => w.status === 'approved').length;
  const rejected = mockWorkpacks.filter(w => w.status === 'rejected').length;
  const revisionRequested = mockWorkpacks.filter(w => w.status === 'revision_requested').length;

  // Get recent workpacks
  const recentWorkpacks = mockWorkpacks.slice(0, 5);

  // Calculate completion rate for progress indicator
  const completionRate = ((approved / totalWorkpacks) * 100).toFixed(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-700';
      case 'pending_review': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'revision_requested': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'pending_review': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'revision_requested': return 'Revision Requested';
      default: return status;
    }
  };

  const handleViewAll = () => {
    navigate('/dashboard/workpacks');
  };

  const handleViewWorkpack = (id: string) => {
    navigate(`/dashboard/workpack/${id}/status`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contractor Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your workpacks and submissions</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/create-workpack')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
        >
          <PlusCircle className="w-5 h-5" />
          Create Workpack
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-semibold text-slate-900">{totalWorkpacks}</div>
          <div className="text-sm text-slate-600 mt-1">Total Workpacks</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{pendingReview}</div>
          <div className="text-sm text-slate-600 mt-1">Pending Review</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{approved}</div>
          <div className="text-sm text-slate-600 mt-1">Approved</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{revisionRequested}</div>
          <div className="text-sm text-slate-600 mt-1">Need Revision</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{rejected}</div>
          <div className="text-sm text-slate-600 mt-1">Rejected</div>
        </div>
      </div>

      {/* Completion Rate Progress */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Workpack Completion Rate</h3>
            <p className="text-sm text-white/80">Track your approval success</p>
          </div>
          <div className="text-4xl font-bold">{completionRate}%</div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
          <div>
            <div className="text-2xl font-semibold">{approved}</div>
            <div className="text-xs text-white/80">Approved</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{pendingReview}</div>
            <div className="text-xs text-white/80">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{totalWorkpacks}</div>
            <div className="text-xs text-white/80">Total</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <p className="text-sm text-slate-600 mt-1">Your latest workpack submissions</p>
          </div>
          <button
            onClick={handleViewAll}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {recentWorkpacks.map((workpack) => (
            <div
              key={workpack.id}
              className="p-6 hover:bg-slate-50 transition-all cursor-pointer"
              onClick={() => handleViewWorkpack(workpack.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{workpack.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workpack.status)}`}>
                      {getStatusText(workpack.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{workpack.projectName}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>ID: {workpack.id}</span>
                    <span>•</span>
                    <span>Submitted: {new Date(workpack.submittedDate).toLocaleDateString()}</span>
                    {workpack.assignedReviewer && (
                      <>
                        <span>•</span>
                        <span>Reviewer: {workpack.assignedReviewer}</span>
                      </>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/dashboard/create-workpack')}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all group"
        >
          <div className="p-3 bg-blue-600 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Create New Workpack</h3>
          <p className="text-sm text-slate-600">Start a new workpack submission</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/workpacks')}
          className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all group"
        >
          <div className="p-3 bg-amber-600 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">View Pending Reviews</h3>
          <p className="text-sm text-slate-600">Track workpacks under review</p>
        </button>

        <button 
          onClick={() => navigate('/dashboard/reports')}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all group"
        >
          <div className="p-3 bg-emerald-600 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">View Reports</h3>
          <p className="text-sm text-slate-600">Analytics and statistics</p>
        </button>
      </div>
    </div>
  );
}