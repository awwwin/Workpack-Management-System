import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { mockWorkpacks } from '../lib/mockData';

export function StatusTracking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const workpack = mockWorkpacks.find(w => w.id === id);

  if (!workpack) {
    return <div>Workpack not found</div>;
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { color: 'slate', icon: FileText, text: 'Draft' };
      case 'pending_review':
        return { color: 'amber', icon: Clock, text: 'Pending Review' };
      case 'approved':
        return { color: 'emerald', icon: CheckCircle, text: 'Approved' };
      case 'rejected':
        return { color: 'red', icon: XCircle, text: 'Rejected' };
      case 'revision_requested':
        return { color: 'orange', icon: AlertCircle, text: 'Revision Requested' };
      default:
        return { color: 'slate', icon: FileText, text: status };
    }
  };

  const statusInfo = getStatusInfo(workpack.status);
  const StatusIcon = statusInfo.icon;

  // Workflow stages
  const stages = [
    { id: 1, name: 'Created', status: 'completed' },
    { id: 2, name: 'Submitted', status: workpack.status !== 'draft' ? 'completed' : 'pending' },
    { id: 3, name: 'Under Review', status: workpack.status === 'pending_review' ? 'current' : workpack.status !== 'draft' ? 'completed' : 'pending' },
    { id: 4, name: 'Decision', status: workpack.status === 'approved' || workpack.status === 'rejected' ? 'completed' : 'pending' },
  ];

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-600';
      case 'current': return 'bg-blue-600';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">Status Tracking</h1>
          <p className="text-slate-600 mt-1">View workpack details and progress</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`bg-gradient-to-r from-${statusInfo.color}-500 to-${statusInfo.color}-600 rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Current Status: {statusInfo.text}</h2>
            </div>
            <p className="text-white/90">Workpack ID: {workpack.id}</p>
          </div>
          <div className="text-right">
            <p className="text-white/90 text-sm mb-1">Last Updated</p>
            <p className="font-semibold">
              {new Date(workpack.timeline[workpack.timeline.length - 1].date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Approval Workflow</h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200"></div>
              
              {/* Stages */}
              <div className="space-y-6 relative">
                {stages.map((stage) => (
                  <div key={stage.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(stage.status)} relative z-10`}>
                      {stage.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                      {stage.status === 'current' && <Clock className="w-5 h-5 text-white" />}
                      {stage.status === 'pending' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className={`font-medium ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                        {stage.name}
                      </p>
                      <p className={`text-sm ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {stage.status === 'completed' ? 'Completed' : stage.status === 'current' ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workpack Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Workpack Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">{workpack.title}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {workpack.projectName}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {workpack.submittedBy}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(workpack.submittedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 mb-2">Description</h5>
                <p className="text-slate-700 leading-relaxed">{workpack.description}</p>
              </div>

              {workpack.assignedReviewer && (
                <div>
                  <h5 className="font-medium text-slate-900 mb-2">Assigned Reviewer</h5>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{workpack.assignedReviewer}</p>
                      <p className="text-sm text-slate-600">Reviewer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              <div>
                <h5 className="font-medium text-slate-900 mb-2">Supporting Documents</h5>
                <div className="space-y-2">
                  {workpack.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{doc}</span>
                      </div>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-all">
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Review History
            </h3>
            <div className="space-y-4">
              {workpack.timeline.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-900">{event.event}</p>
                    <p className="text-xs text-slate-600 mt-1">{event.user}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          {workpack.comments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Comments</h3>
              <div className="space-y-4">
                {workpack.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-slate-900">{comment.author}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.content}</p>
                      </div>
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
