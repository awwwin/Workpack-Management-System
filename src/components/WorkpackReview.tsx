import { useEffect,useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function WorkpackReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workpack, setWorkpack] = useState<any>(null);
  const [comment, setComment] = useState('');
const [comments, setComments] = useState<any[]>([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
  async function loadWorkpack() {
    const { data, error } = await supabase
      .from('workpacks')
      .select('*')
      .eq('id', Number(id))
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) {
      console.error('Workpack fetch error:', error.message);
      return;
    }

    setWorkpack(data);

    const { data: documentsData, error: documentsError } = await supabase
  .from('workpack_documents')
  .select('*')
  .eq('workpack_id', Number(id))
  .order('created_at', { ascending: true });

if (!documentsError) {
  setDocuments(documentsData || []);
}

const { data: commentsData, error: commentsError } = await supabase
  .from('workpack_comments')
  .select('*')
  .eq('workpack_id', Number(id))
  .order('created_at', { ascending: false });

if (!commentsError) {
  setComments(commentsData || []);
}

const { data: timelineData, error: timelineError } = await supabase
  .from('workpack_timeline')
  .select('*')
  .eq('workpack_id', Number(id))
  .order('created_at', { ascending: true });

if (!timelineError) {
  setTimeline(timelineData || []);
}

  }

  if (id) {
    loadWorkpack();
  }
}, [id]);

  if (!workpack) {
    return <div>Workpack not found</div>;
  }

const handleApprove = async () => {
  const { error } = await supabase
    .from('workpacks')
    .update({ status: 'approved' })
    .eq('id', Number(id));

  if (error) {
    toast.error(error.message);
    return;
  }

  await supabase.from('notifications').insert([
    {
      user_id: workpack.created_by,
      title: 'Workpack Approved',
      message: `Your workpack WP${String(workpack.id).padStart(3, '0')} has been approved`,
      type: 'success',
      read: false,
    },
  ]);

  toast.success('Workpack approved successfully!');
  navigate('/dashboard/workpacks');
};

const handleReject = async () => {
  const { error } = await supabase
    .from('workpacks')
    .update({ status: 'rejected' })
    .eq('id', Number(id));

  if (error) {
    toast.error(error.message);
    return;
  }

  await supabase.from('notifications').insert([
    {
      user_id: workpack.created_by,
      title: 'Workpack Rejected',
      message: `Your workpack WP${String(workpack.id).padStart(3, '0')} has been rejected`,
      type: 'warning',
      read: false,
    },
  ]);

  toast.error('Workpack rejected successfully!');
  navigate('/dashboard/workpacks');
};

const handleRequestRevision = async () => {
  const { error } = await supabase
    .from('workpacks')
    .update({ status: 'revision_requested' })
    .eq('id', Number(id));

  if (error) {
    toast.error(error.message);
    return;
  }

  await supabase.from('notifications').insert([
    {
      user_id: workpack.created_by,
      title: 'Revision Requested',
      message: `Your workpack WP${String(workpack.id).padStart(3, '0')} requires revision`,
      type: 'warning',
      read: false,
    },
  ]);

  toast.info('Revision request sent successfully!');
  navigate('/dashboard/workpacks');
};

const handleAddComment = async () => {
  if (!comment.trim()) return;

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    toast.error('User not found');
    return;
  }

  const { error } = await supabase.from('workpack_comments').insert([
    {
      workpack_id: Number(id),
      author_id: authData.user.id,
      content: comment,
    },
  ]);

  if (error) {
    toast.error(error.message);
    return;
  }

  const { data: commentsData } = await supabase
    .from('workpack_comments')
    .select('*')
    .eq('workpack_id', Number(id))
    .order('created_at', { ascending: false });

  setComments(commentsData || []);
  setComment('');
  toast.success('Comment added successfully!');
};


  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/workpacks')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Review Workpack</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Evaluate and provide feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workpack Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{workpack.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
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
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                ID: {workpack.id}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Work Description</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{workpack.work_description}</p>
            </div>

            {/* Supporting Documents */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Supporting Documents</h3>
      <div className="space-y-2">
  {documents.length > 0 ? (
    documents.map((doc) => (
      <div
        key={doc.id}
        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-slate-900 dark:text-white">{doc.file_name}</span>
        </div>
        <button className="p-2 hover:bg-slate-200 rounded-lg transition-all">
          <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
    ))
  ) : (
    <p className="text-sm text-slate-500">No supporting documents uploaded yet.</p>
  )}
</div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Comments & Feedback</h3>
            
            {/* Existing Comments */}
<div className="space-y-4 mb-6">
  {comments.length > 0 ? (
    comments.map((c) => (
      <div key={c.id} className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-slate-900 dark:text-white">{c.author_id}</span>
              <span className="text-xs text-slate-500">
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{c.content}</p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-slate-500">No comments yet.</p>
  )}
</div>

            {/* Add Comment */}
            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your review comments here..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleAddComment}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Add Comment
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Workpack Timeline</h3>
  <div className="space-y-4">
  {timeline.length > 0 ? (
    timeline.map((event, index) => (
      <div key={event.id} className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            index === timeline.length - 1 ? 'bg-blue-100' : 'bg-emerald-100'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              index === timeline.length - 1 ? 'bg-blue-600' : 'bg-emerald-600'
            }`}></div>
          </div>
          {index < timeline.length - 1 && (
            <div className="w-0.5 h-full bg-slate-200 my-1"></div>
          )}
        </div>
        <div className="flex-1 pb-4">
          <p className="font-medium text-sm text-slate-900 dark:text-white">{event.event}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{event.user_id || '-'}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(event.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-slate-500">No timeline yet.</p>
  )}
</div>
          </div>

          {/* Review Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Review Actions</h3>
            
            <button
              onClick={() => setShowApproveModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-700 hover:scale-[1.02] transition-all font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Approve
            </button>

            <button
              onClick={() => setShowRevisionModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 hover:scale-[1.02] transition-all font-medium"
            >
              <AlertCircle className="w-5 h-5" />
              Request Revision
            </button>

            <button
              onClick={() => setShowRejectModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 hover:scale-[1.02] transition-all font-medium"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Approve Workpack</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to approve this workpack? This will allow the contractor to proceed with the work.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Reject Workpack</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to reject this workpack? This action requires the contractor to create a new submission.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Request Revision</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Request changes to this workpack. The contractor will be notified and can make updates.
            </p>
            <textarea
              placeholder="Describe what needs to be revised..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}