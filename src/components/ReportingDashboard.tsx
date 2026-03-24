import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Filter, Download, BarChart3 } from 'lucide-react';
import { mockWorkpacks } from '../lib/mockData';

export function ReportingDashboard() {
  // Calculate statistics
  const totalWorkpacks = mockWorkpacks.length;
  const approved = mockWorkpacks.filter(w => w.status === 'approved').length;
  const pending = mockWorkpacks.filter(w => w.status === 'pending_review').length;
  const rejected = mockWorkpacks.filter(w => w.status === 'rejected').length;
  const revisionRequested = mockWorkpacks.filter(w => w.status === 'revision_requested').length;

  const approvalRate = ((approved / totalWorkpacks) * 100).toFixed(1);

  // Status distribution data
  const statusData = [
    { name: 'Approved', value: approved, color: '#10b981' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
    { name: 'Revision', value: revisionRequested, color: '#f97316' },
  ];

  // Submission trends over time
  const trendsData = [
    { month: 'Jan', submitted: 12, approved: 10, rejected: 2 },
    { month: 'Feb', submitted: 19, approved: 15, rejected: 4 },
    { month: 'Mar', submitted: 15, approved: 13, rejected: 2 },
    { month: 'Apr', submitted: 22, approved: 18, rejected: 4 },
    { month: 'May', submitted: 18, approved: 16, rejected: 2 },
    { month: 'Jun', submitted: 25, approved: 20, rejected: 5 },
  ];

  // Project performance
  const projectData = [
    { project: 'Downtown Office', workpacks: 8, approved: 6, pending: 2 },
    { project: 'Riverside Mall', workpacks: 6, approved: 5, pending: 1 },
    { project: 'Tech Park', workpacks: 4, approved: 2, pending: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Comprehensive workpack statistics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{totalWorkpacks}</div>
          <div className="text-sm text-slate-600 mt-1">Total Workpacks</div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-sm font-semibold text-emerald-600">
              {approvalRate}%
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{approved}</div>
          <div className="text-sm text-slate-600 mt-1">Approved Workpacks</div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${approvalRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-slate-600">
              Pending
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{pending}</div>
          <div className="text-sm text-slate-600 mt-1">Awaiting Review</div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(pending / totalWorkpacks) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-sm font-medium text-red-600">
              {((rejected / totalWorkpacks) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900">{rejected}</div>
          <div className="text-sm text-slate-600 mt-1">Rejected</div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full" style={{ width: `${(rejected / totalWorkpacks) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-slate-900 mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Success Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-slate-900 mb-6">Approval Success Rate</h3>
          <div className="flex items-center justify-center h-[300px]">
            <div className="relative">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="#e2e8f0"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="#10b981"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - parseFloat(approvalRate) / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-5xl font-bold text-slate-900">{approvalRate}%</div>
                <div className="text-sm text-slate-600 mt-2">Approval Rate</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-600">{approved}</div>
              <div className="text-xs text-slate-600 mt-1">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">{revisionRequested}</div>
              <div className="text-xs text-slate-600 mt-1">Revisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-600">{rejected}</div>
              <div className="text-xs text-slate-600 mt-1">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Trends Over Time */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
        <h3 className="font-semibold text-slate-900 mb-6">Submission Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} name="Submitted" />
            <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} name="Approved" />
            <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} name="Rejected" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Project Performance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
        <h3 className="font-semibold text-slate-900 mb-6">Project Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="project" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Bar dataKey="workpacks" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Total Workpacks" />
            <Bar dataKey="approved" fill="#10b981" radius={[8, 8, 0, 0]} name="Approved" />
            <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Recent Activity Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Project</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Approved</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Pending</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Success Rate</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projectData.map((project) => {
                const successRate = ((project.approved / project.workpacks) * 100).toFixed(0);
                return (
                  <tr key={project.project} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{project.project}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{project.workpacks}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {project.approved}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {project.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">+{Math.floor(Math.random() * 15)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
