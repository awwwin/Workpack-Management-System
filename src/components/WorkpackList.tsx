import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Eye, Edit, ArrowUpDown } from 'lucide-react';
import { mockWorkpacks, getCurrentUser } from '../lib/mockData';

export function WorkpackList() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter workpacks based on user role
  const getWorkpacks = () => {
    if (currentUser.role === 'reviewer') {
      // Show only workpacks assigned to this reviewer or pending review
      return mockWorkpacks.filter(w => 
        w.status === 'pending_review' || w.assignedReviewer === currentUser.name
      );
    }
    // Contractors and admins see all workpacks
    return mockWorkpacks;
  };

  const workpacks = getWorkpacks();

  // Filter and search
  const filteredWorkpacks = workpacks.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getPageTitle = () => {
    if (currentUser.role === 'reviewer') return 'Review Queue';
    if (currentUser.role === 'admin') return 'All Workpacks';
    return 'My Workpacks';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{getPageTitle()}</h1>
        <p className="text-slate-600 mt-1">
          {currentUser.role === 'reviewer' 
            ? 'Review and manage workpack submissions'
            : 'View and manage all workpack submissions'
          }
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, project, or ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="revision_requested">Revision Requested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workpack Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                  <button className="flex items-center gap-2 hover:text-blue-600">
                    Workpack ID
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                  Project
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                  <button className="flex items-center gap-2 hover:text-blue-600">
                    Submission Date
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                  Reviewer
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWorkpacks.map((workpack) => (
                <tr key={workpack.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-900">{workpack.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{workpack.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{workpack.projectName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {new Date(workpack.submittedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workpack.status)}`}>
                      {getStatusText(workpack.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {workpack.assignedReviewer || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {currentUser.role === 'reviewer' && workpack.status === 'pending_review' ? (
                        <button
                          onClick={() => navigate(`/dashboard/workpack/${workpack.id}/review`)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/dashboard/workpack/${workpack.id}/status`)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          {currentUser.role === 'contractor' && workpack.status === 'draft' && (
                            <button
                              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkpacks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No workpacks found</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredWorkpacks.length} of {workpacks.length} workpacks
      </div>
    </div>
  );
}
