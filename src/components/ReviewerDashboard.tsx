import { useNavigate } from 'react-router';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Bell,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { mockWorkpacks, getCurrentUser } from '../lib/mockData';

export function ReviewerDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Get workpacks for this reviewer
  const myWorkpacks = mockWorkpacks.filter(
    w => w.assignedReviewer === currentUser.name
  );

  const pendingReview = myWorkpacks.filter(w => w.status === 'pending_review');
  const approved = myWorkpacks.filter(w => w.status === 'approved');
  const revisionRequested = myWorkpacks.filter(w => w.status === 'revision_requested');

  // Recent notifications
  const notifications = [
    {
      id: '1',
      message: 'New workpack assigned: Foundation and Structural Steel Installation',
      time: '2 hours ago',
      type: 'new',
    },
    {
      id: '2',
      message: 'Contractor responded to revision request on WP-003',
      time: '5 hours ago',
      type: 'update',
    },
    {
      id: '3',
      message: 'Reminder: 3 workpacks pending your review',
      time: '1 day ago',
      type: 'reminder',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'revision_requested': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_review': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'revision_requested': return 'Revision Requested';
      default: return status;
    }
  };

  const handleViewAllWorkpacks = () => {
    navigate('/dashboard/workpacks');
  };

  const handleReviewWorkpack = (workpackId: string) => {
    navigate(`/dashboard/workpack/${workpackId}/review`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reviewer Dashboard</h1>
        <p className="text-slate-600 mt-1">Review and manage workpack submissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-semibold text-slate-900">{pendingReview.length}</div>
          <div className="text-sm text-slate-600 mt-1">Pending Review</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{approved.length}</div>
          <div className="text-sm text-slate-600 mt-1">Approved</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{revisionRequested.length}</div>
          <div className="text-sm text-slate-600 mt-1">Need Revision</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{myWorkpacks.length}</div>
          <div className="text-sm text-slate-600 mt-1">Total Assigned</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workpacks Waiting for Review */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Workpacks Waiting for Review</h2>
              <p className="text-sm text-slate-600 mt-1">Items requiring your attention</p>
            </div>
            <button
              onClick={handleViewAllWorkpacks}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingReview.length > 0 ? (
              pendingReview.slice(0, 4).map((workpack) => (
                <div
                  key={workpack.id}
                  className="p-6 hover:bg-slate-50 transition-all cursor-pointer"
                  onClick={() => handleReviewWorkpack(workpack.id)}
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
                        <span>Submitted by: {workpack.submittedBy}</span>
                        <span>•</span>
                        <span>{new Date(workpack.submittedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewWorkpack(workpack.id);
                      }}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="p-4 bg-slate-100 rounded-full inline-block mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">No workpacks pending review</p>
              </div>
            )}
          </div>
        </div>

        {/* Notification Panel */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-slate-50 transition-all">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'new' ? 'bg-blue-100' :
                    notification.type === 'update' ? 'bg-green-100' :
                    'bg-amber-100'
                  }`}>
                    <Bell className={`w-4 h-4 ${
                      notification.type === 'new' ? 'text-blue-600' :
                      notification.type === 'update' ? 'text-green-600' :
                      'text-amber-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 mb-1">{notification.message}</p>
                    <p className="text-xs text-slate-500">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleViewAllWorkpacks}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-left hover:shadow-lg transition-all group"
        >
          <div className="p-3 bg-blue-600 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Review Queue</h3>
          <p className="text-sm text-slate-600">View all workpacks for review</p>
        </button>

        <button 
          onClick={() => navigate('/dashboard/workpacks')}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 text-left hover:shadow-lg transition-all group"
        >
          <div className="p-3 bg-emerald-600 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Approved Items</h3>
          <p className="text-sm text-slate-600">View approved workpacks</p>
        </button>

        <button 
          onClick={() => navigate('/dashboard/workpacks')}
          className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 text-left hover:shadow-lg transition-all group"
        >
          <div className="p-3 bg-slate-600 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Review History</h3>
          <p className="text-sm text-slate-600">View past review activities</p>
        </button>
      </div>
    </div>
  );
}