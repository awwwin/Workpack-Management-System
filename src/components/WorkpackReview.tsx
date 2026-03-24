import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import { mockWorkpacks } from '../lib/mockData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function WorkpackReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const workpack = mockWorkpacks.find(w => w.id === id);
  const [comment, setComment] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  if (!workpack) {
    return <div>Workpack not found</div>;
  }

  const handleApprove = () => {
    // Approve logic
    toast.success('Workpack approved successfully!');
    navigate('/dashboard/reviewer');
  };

  const handleReject = () => {
    // Reject logic
    toast.error('Workpack rejected successfully!');
    navigate('/dashboard/reviewer');
  };

  const handleRequestRevision = () => {
    // Request revision logic
    toast.info('Revision request sent successfully!');
    navigate('/dashboard/reviewer');
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      // Add comment logic
      setComment('');
      toast.info('Comment added successfully!');
    }
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
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">Review Workpack</h1>
          <p className="text-slate-600 mt-1">Evaluate and provide feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workpack Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{workpack.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-600">
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
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                ID: {workpack.id}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Work Description</h3>
              <p className="text-slate-700 leading-relaxed">{workpack.description}</p>
            </div>

            {/* Supporting Documents */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Supporting Documents</h3>
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

          {/* Comments Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Comments & Feedback</h3>
            
            {/* Existing Comments */}
            <div className="space-y-4 mb-6">
              {workpack.comments.map((c) => (
                <div key={c.id} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{c.author}</span>
                        <span className="text-xs text-slate-500">{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
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
            <h3 className="font-semibold text-slate-900 mb-4">Workpack Timeline</h3>
            <div className="space-y-4">
              {workpack.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === workpack.timeline.length - 1 ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        index === workpack.timeline.length - 1 ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}></div>
                    </div>
                    {index < workpack.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm text-slate-900">{event.event}</p>
                    <p className="text-xs text-slate-600 mt-1">{event.user}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-semibold text-slate-900 mb-4">Review Actions</h3>
            
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
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Approve Workpack</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to approve this workpack? This will allow the contractor to proceed with the work.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
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
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Reject Workpack</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to reject this workpack? This action requires the contractor to create a new submission.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
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
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Request Revision</h3>
            <p className="text-slate-600 mb-4">
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
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
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