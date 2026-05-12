import { useNavigate, useParams } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function StatusTracking() {
  const navigate = useNavigate();
  const { id } = useParams();
 const [workpack, setWorkpack] = useState<any>(null);

useEffect(() => {
  async function loadWorkpack() {
    const { data, error } = await supabase
      .from('workpacks')
      .select('*')
      .eq('id', Number(id))
      .maybeSingle();

    if (error) {
      console.error('Workpack fetch error:', error.message);
      return;
    }

    setWorkpack(data);
  }

  if (id) {
    loadWorkpack();
  }
}, [id]);

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

  const getStatusBannerClass = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gradient-to-r from-slate-500 to-slate-600';
    case 'pending_review':
      return 'bg-gradient-to-r from-amber-500 to-amber-600';
    case 'approved':
      return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    case 'rejected':
      return 'bg-gradient-to-r from-red-500 to-red-600';
    case 'revision_requested':
      return 'bg-gradient-to-r from-orange-500 to-orange-600';
    default:
      return 'bg-gradient-to-r from-slate-500 to-slate-600';
  }
};

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Status Tracking</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">View workpack details and progress</p>
        </div>
      </div>

      {/* Status Banner */}
     <div className={`${getStatusBannerClass(workpack.status)} rounded-xl p-6 text-white`}>
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
              {new Date(workpack.created_at).toLocaleDateString()}
              </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Approval Workflow</h3>
            
            <div className="relative">
              {/* Progress Line */}
             <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
              
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
                      <p className={`font-medium ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {stage.name}
                      </p>
                      <p className={`text-sm ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {stage.status === 'completed' ? 'Completed' : stage.status === 'current' ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workpack Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Workpack Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{workpack.title}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {workpack.project_name}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {workpack.created_by}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                   {new Date(workpack.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 dark:text-white mb-2">Description</h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{workpack.work_description}</p>
              </div>

              {workpack.reviewver_id && (
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-white mb-2">Assigned Reviewer</h5>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{workpack.reviewer_id}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Reviewer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              <div>
                <h5 className="font-medium text-slate-900 dark:text-white mb-2">Supporting Documents</h5>
                <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                      No supporting documents uploaded yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review History */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Review History
            </h3>
            <div className="space-y-4">
             <p className="text-sm text-slate-500 dark:text-slate-400">
             No review history yet.
              </p>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6" > 
             <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Comments</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">
                No comments yet.
               </p>
             </div>
        </div>
      </div>
    </div>
  );
}
