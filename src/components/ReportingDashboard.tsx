import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Filter, Download, BarChart3 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

export function ReportingDashboard() {

const [workpacks, setWorkpacks] = useState<any[]>([]);
const [currentUserRole, setCurrentUserRole] = useState('');
const [showFilters, setShowFilters] = useState(false);
const [dateFilter, setDateFilter] = useState<'all' | '30days'>('all');
const [statusFilter, setStatusFilter] = useState('all');
const { effectiveTheme } = useTheme();
useEffect(() => {
  async function loadWorkpacks() {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (!profileData) return;

     setCurrentUserRole(profileData.role);

    let query = supabase
      .from('workpacks')
      .select('*')
      .order('created_at', { ascending: true });

    if (profileData.role === 'contractor') {
      query = query.eq('created_by', profileData.id);
    }

    if (profileData.role === 'reviewer') {
      query = query.eq('reviewer_id', profileData.id);
    }

    // admin sees all, so no filter needed

    const { data, error } = await query;

    if (error) {
      console.error('Workpacks fetch error:', error.message);
      return;
    }

    setWorkpacks(data || []);
  }

  loadWorkpacks();
}, []);
const reportScope =
  currentUserRole === 'admin'
    ? 'Overall system report'
    : 'My workpack report';

const filteredWorkpacks = useMemo(() => {
  let data = [...workpacks];

  if (dateFilter === '30days') {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    data = data.filter((w) => {
      if (!w.created_at) return false;
      return new Date(w.created_at) >= thirtyDaysAgo;
    });
  }

  if (statusFilter !== 'all') {
    data = data.filter((w) => w.status === statusFilter);
  }

  return data;
}, [workpacks, dateFilter, statusFilter]);

  // Calculate statistics
const totalWorkpacks = filteredWorkpacks.length;
const approved = filteredWorkpacks.filter(w => w.status === 'approved').length;
const pending = filteredWorkpacks.filter(w => w.status === 'pending_review').length;
const rejected = filteredWorkpacks.filter(w => w.status === 'rejected').length;
const revisionRequested = filteredWorkpacks.filter(w => w.status === 'revision_requested').length;

  const approvalRate =
  totalWorkpacks > 0 ? ((approved / totalWorkpacks) * 100).toFixed(1) : '0.0';

  // Status distribution data
  const statusData = [
    { name: 'Approved', value: approved, color: '#10b981' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
    { name: 'Revision', value: revisionRequested, color: '#f97316' },
  ];

  // Submission trends over time
const trendsData = useMemo(() => {
  const monthMap: Record<string, { month: string; submitted: number; approved: number; rejected: number }> = {};

 filteredWorkpacks.forEach((w) => {
    if (!w.created_at) return;

    const d = new Date(w.created_at);
    const month = d.toLocaleString('en-US', { month: 'short' });

    if (!monthMap[month]) {
      monthMap[month] = {
        month,
        submitted: 0,
        approved: 0,
        rejected: 0,
      };
    }

    monthMap[month].submitted += 1;

    if (w.status === 'approved') monthMap[month].approved += 1;
    if (w.status === 'rejected') monthMap[month].rejected += 1;
  });

  return Object.values(monthMap);
}, [workpacks]);

  // Project performance
 const projectData = useMemo(() => {
  const projectMap: Record<string, { project: string; workpacks: number; approved: number; pending: number }> = {};

 filteredWorkpacks.forEach((w) => {
    const projectName = w.project_name || 'Unknown Project';

    if (!projectMap[projectName]) {
      projectMap[projectName] = {
        project: projectName,
        workpacks: 0,
        approved: 0,
        pending: 0,
      };
    }

    projectMap[projectName].workpacks += 1;

    if (w.status === 'approved') projectMap[projectName].approved += 1;
    if (w.status === 'pending_review') projectMap[projectName].pending += 1;
  });

  return Object.values(projectMap);
}, [workpacks]);

const handleExportReport = () => {
  const headers = ['ID', 'Title', 'Project', 'Status', 'Created At'];

  const rows = filteredWorkpacks.map((w) => [
    `WP${String(w.id).padStart(3, '0')}`,
    w.title || '',
    w.project_name || '',
    w.status || '',
    w.created_at ? new Date(w.created_at).toLocaleDateString() : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'workpack-report.csv';
  link.click();

  URL.revokeObjectURL(url);
};

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Comprehensive workpack statistics and insights</p>
        </div>
        <div className="flex items-center gap-3">
           <button
              onClick={() => setDateFilter(dateFilter === '30days' ? 'all' : '30days')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
                 <Calendar className="w-4 h-4" />
                 {dateFilter === '30days' ? 'All Time' : 'Last 30 Days'}
           </button>

          <button
           onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
           >
                 <Filter className="w-4 h-4" />
                Filter
        </button>

<button
  onClick={handleExportReport}
  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
>
  <Download className="w-4 h-4" />
  Export Report
</button>
        </div>
      </div>

  {showFilters && (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      Filter by Status
    </label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
    >
      <option value="all">All Status</option>
      <option value="pending_review">Pending Review</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
      <option value="revision_requested">Revision Requested</option>
    </select>
  </div>
)}    

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{totalWorkpacks}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Total Workpacks</div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-sm font-semibold text-emerald-600">
              {approvalRate}%
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{approved}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Approved Workpacks</div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${approvalRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Pending
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{pending}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Awaiting Review</div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: totalWorkpacks > 0 ? `${(pending / totalWorkpacks) * 100}%` : '0%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-sm font-medium text-red-600">
             {totalWorkpacks > 0 ? ((rejected / totalWorkpacks) * 100).toFixed(0) : '0'}%
            </div>
          </div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-white">{rejected}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Rejected</div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full" style={{ width: totalWorkpacks > 0 ? `${(rejected / totalWorkpacks) * 100}%` : '0%' }}></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Status Distribution</h3>
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
                <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Success Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Approval Success Rate</h3>
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
                <div className="text-5xl font-bold text-slate-900 dark:text-white">{approvalRate}%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">Approval Rate</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-600">{approved}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">{revisionRequested}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">Revisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-600">{rejected}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Trends Over Time */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Submission Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: effectiveTheme === 'dark' ? '#0f172a' : '#ffffff',
                border: effectiveTheme === 'dark'
                   ? '1px solid #334155'
                  : '1px solid #e2e8f0',
                color: effectiveTheme === 'dark' ? '#ffffff' : '#0f172a',
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Project Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="project" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: effectiveTheme === 'dark' ? '#0f172a' : '#ffffff',
                border: effectiveTheme === 'dark'
                 ? '1px solid #334155'
                 : '1px solid #e2e8f0',
               color: effectiveTheme === 'dark' ? '#ffffff' : '#0f172a',
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden hover:shadow-lg transition-all">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Project</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Approved</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Pending</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Success Rate</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {projectData.map((project) => {
                const successRate = ((project.approved / project.workpacks) * 100).toFixed(0);
                return (
                  <tr key={project.project} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 dark:text-white">{project.project}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 dark:text-slate-300">{project.workpacks}</span>
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
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{successRate}%</span>
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
