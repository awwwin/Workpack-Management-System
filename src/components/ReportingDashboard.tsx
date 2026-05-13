import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Filter,
  Download,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ReportingDashboard() {
  const [workpacks, setWorkpacks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | '30days'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { effectiveTheme } = useTheme();
  const navigate = useNavigate();
  

  const COLORS = {
    approved: '#10b981',
    pending: '#f59e0b',
    rejected: '#ef4444',
    revision: '#f97316',
    blue: '#3b82f6',
    purple: '#8b5cf6',
  };

  useEffect(() => {
    async function loadData() {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        console.error('Auth user error:', authError?.message);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError?.message);
        return;
      }

      setCurrentUser(profileData);

      const { data: profileList, error: profileListError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');

      if (profileListError) {
        console.error('Profiles fetch error:', profileListError.message);
      }

      setProfiles(profileList || []);

      let query = supabase
  .from('workpacks')
  .select('*')
  .order('created_at', { ascending: true })
  .eq('is_deleted', false);

if (profileData.role === 'contractor') {
  query = query.eq('created_by', profileData.id);
}

if (profileData.role === 'reviewer') {
  query = query.eq('reviewer_id', profileData.id);
}

const { data, error } = await query;

if (error) {
  console.error('Workpacks fetch error:', error.message);
  return;
}

setWorkpacks(data || []);
}

loadData();
}, []);

const currentUserRole = currentUser?.role || '';

const filteredWorkpacks = useMemo(() => {
  let data = [...workpacks];

  if (dateFilter === '30days') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    data = data.filter(
      (w) => w.created_at && new Date(w.created_at) >= thirtyDaysAgo
    );
  }

  if (statusFilter !== 'all') {
    data = data.filter((w) => w.status === statusFilter);
  }

  return data;
}, [workpacks, dateFilter, statusFilter]);

const totalWorkpacks = filteredWorkpacks.length;
const approved = filteredWorkpacks.filter((w) => w.status === 'approved').length;
const pending = filteredWorkpacks.filter((w) => w.status === 'pending_review').length;
const rejected = filteredWorkpacks.filter((w) => w.status === 'rejected').length;
const revisionRequested = filteredWorkpacks.filter(
  (w) => w.status === 'revision_requested'
).length;

const approvalRate =
  totalWorkpacks > 0 ? ((approved / totalWorkpacks) * 100).toFixed(1) : '0.0';

const revisionRate =
  totalWorkpacks > 0
    ? ((revisionRequested / totalWorkpacks) * 100).toFixed(1)
    : '0.0';

const daysBetween = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const averageApprovalTime = useMemo(() => {
  const approvedItems = filteredWorkpacks.filter((w) => w.status === 'approved');

  if (approvedItems.length === 0) return '0.0';

  const totalDays = approvedItems.reduce((sum, w) => {
    return sum + daysBetween(w.created_at, w.updated_at || w.created_at);
  }, 0);

  return (totalDays / approvedItems.length).toFixed(1);
}, [filteredWorkpacks]);

const tooltipStyle = {
  backgroundColor: effectiveTheme === 'dark' ? '#0f172a' : '#ffffff',
  border: effectiveTheme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb',
  color: effectiveTheme === 'dark' ? '#ffffff' : '#0f172a',
  borderRadius: '8px',
};

const EmptyState = () => (
  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
    No data available yet
  </div>
);

const statusData = [
  { name: 'Approved', value: approved, color: COLORS.approved },
  { name: 'Pending', value: pending, color: COLORS.pending },
  { name: 'Rejected', value: rejected, color: COLORS.rejected },
  { name: 'Revision', value: revisionRequested, color: COLORS.revision },
].filter((item) => item.value > 0);

const trendsData = useMemo(() => {
  const monthMap: Record<string, any> = {};

  filteredWorkpacks.forEach((w) => {
    if (!w.created_at) return;

    const month = new Date(w.created_at).toLocaleString('en-US', {
      month: 'short',
    });

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
}, [filteredWorkpacks]);

const projectData = useMemo(() => {
  const projectMap: Record<string, any> = {};

  filteredWorkpacks.forEach((w) => {
    const project = w.project_name || 'Unknown Project';

    if (!projectMap[project]) {
      projectMap[project] = {
        project,
        workpacks: 0,
        approved: 0,
        pending: 0,
      };
    }

    projectMap[project].workpacks += 1;
    if (w.status === 'approved') projectMap[project].approved += 1;
    if (w.status === 'pending_review') projectMap[project].pending += 1;
  });

  return Object.values(projectMap);
}, [filteredWorkpacks]);

const pendingQueue = useMemo(() => {
  return filteredWorkpacks
    .filter((w) => w.status === 'pending_review')
    .map((w) => ({
      ...w,
      waitingDays: daysBetween(w.created_at, new Date().toISOString()),
    }))
    .sort((a, b) => b.waitingDays - a.waitingDays);
}, [filteredWorkpacks]);

const reviewerComparisonData = useMemo(() => {
  return profiles
    .filter((p) => p.role === 'reviewer')
    .map((reviewer) => {
      const reviewerWorkpacks = workpacks.filter((w) => w.reviewer_id === reviewer.id);

      return {
        reviewer: reviewer.full_name || reviewer.email || 'Reviewer',
        avgDays: 0,
        workpacks: reviewerWorkpacks.length,
      };
    });
}, [profiles, workpacks]);

const contractorPerformanceData = useMemo(() => {
  return profiles
    .filter((p) => p.role === 'contractor')
    .map((contractor) => {
      const submitted = workpacks.filter((w) => w.created_by === contractor.id);
      const approvedCount = submitted.filter((w) => w.status === 'approved').length;

      return {
        contractor: contractor.full_name || contractor.email || 'Contractor',
        approvalRate:
          submitted.length > 0
            ? Number(((approvedCount / submitted.length) * 100).toFixed(1))
            : 0,
      };
    });
}, [profiles, workpacks]);

const bottleneckData = [
  { stage: 'Submission → Review', days: 1 },
  { stage: 'Review → Decision', days: Number(averageApprovalTime) || 0 },
  { stage: 'Revision → Resubmit', days: revisionRequested },
  { stage: 'Resubmit → Approval', days: approved },
];

 const renderSubmissionTrends = (title: string, reviewerMode = false) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      {trendsData.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />

                        {reviewerMode ? (
              <>
                <Line
                  type="monotone"
                  dataKey="submitted"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  name="Received"
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke={COLORS.approved}
                  strokeWidth={2}
                  name="Reviewed"
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="submitted"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  name="Submitted"
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke={COLORS.approved}
                  strokeWidth={2}
                  name="Approved"
                />
                <Line
                  type="monotone"
                  dataKey="rejected"
                  stroke={COLORS.rejected}
                  strokeWidth={2}
                  name="Rejected"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const renderStatusPieChart = (title: string) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>

      {statusData.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const renderProjectPerformance = (title: string) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>

      {projectData.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="project" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="workpacks" fill={COLORS.blue} name="Total" />
            <Bar dataKey="approved" fill={COLORS.approved} name="Approved" />
            <Bar dataKey="pending" fill={COLORS.pending} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const getRoleName = () => {
  switch (currentUserRole) {
    case 'contractor':
      return 'Contractor';
    case 'reviewer':
      return 'Reviewer';
    case 'admin':
      return 'Admin';
    default:
      return '';
  }
};

const getRoleDescription = () => {
  switch (currentUserRole) {
    case 'contractor':
      return 'Track your submission performance and approval metrics';
    case 'reviewer':
      return 'Monitor your review queue and turnaround times';
    case 'admin':
      return 'System-wide analytics and team performance insights';
    default:
      return 'Comprehensive workpack statistics and insights';
  }
};

const handleExportReport = () => {
  const headers = ['ID', 'Title', 'Project', 'Status', 'Created At', 'Role'];

  const rows = filteredWorkpacks.map((w) => [
    `WP${String(w.id).padStart(3, '0')}`,
    w.title || '',
    w.project_name || '',
    w.status || '',
    w.created_at ? new Date(w.created_at).toLocaleDateString() : '',
    currentUserRole,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentUserRole || 'workpack'}-report.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>

    <div className="text-3xl font-semibold text-slate-900 dark:text-white">
      {value}
    </div>

    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
      {title}
    </div>

    {subtitle && (
      <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
        {subtitle}
      </div>
    )}
  </div>
);

const getLastActionDate = (w: any) => {
  return w.updated_at || w.reviewed_at || w.approved_at || w.rejected_at || w.created_at;
};

const getDecisionDate = (w: any) => {
  return (
    w.approved_at ||
    w.reviewed_at ||
    w.rejected_at ||
    w.updated_at ||
    w.created_at
  );
};

const getDaysSince = (date?: string) => {
  if (!date) return '-';

  const diff = new Date().getTime() - new Date(date).getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    approved: {
      label: 'Approved',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    pending_review: {
      label: 'Pending',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    revision_requested: {
      label: 'Needs Revision',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    draft: {
      label: 'Draft',
      className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    },
  };

  const item = statusMap[status] || statusMap.draft;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.className}`}>
      {item.label}
    </span>
  );
};

const recentContractorActivity = [...filteredWorkpacks]
  .sort(
    (a, b) =>
      new Date(getLastActionDate(b)).getTime() -
      new Date(getLastActionDate(a)).getTime()
  )
  .slice(0, 3);

const fastestApproved = filteredWorkpacks
  .filter((w) => w.status === 'approved')
  .map((w) => ({
    ...w,
    approvalDays: daysBetween(w.created_at, getDecisionDate(w)) || 0,
  }))
  .sort((a, b) => a.approvalDays - b.approvalDays)[0];

const mostRevised = [...filteredWorkpacks]
  .map((w) => ({
    ...w,
    revisionCount: w.revision_count || w.revisions_count || w.revisionCount || 0,
  }))
  .sort((a, b) => b.revisionCount - a.revisionCount)[0];

const currentStreak = [...filteredWorkpacks]
  .sort(
    (a, b) =>
      new Date(getLastActionDate(b)).getTime() -
      new Date(getLastActionDate(a)).getTime()
  )
  .reduce((streak, w) => {
    if (streak.stopped) return streak;
    if (w.status === 'approved') return { count: streak.count + 1, stopped: false };
    if (['revision_requested', 'rejected'].includes(w.status)) return { ...streak, stopped: true };
    return streak;
  }, { count: 0, stopped: false }).count;


if (!currentUser) {
  return <div className="text-slate-500">Loading reports...</div>;
}

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {getRoleName()} Reports & Analytics
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {getRoleDescription()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setDateFilter(dateFilter === '30days' ? 'all' : '30days')
            }
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <Calendar className="w-4 h-4" />
            {dateFilter === '30days' ? 'All Time' : 'Last 30 Days'}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
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

      {/* CONTRACTOR */}
      {currentUserRole === 'contractor' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Submitted"
              value={totalWorkpacks}
              icon={BarChart3}
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />

            <SummaryCard
              title="Approved"
              value={approved}
              icon={CheckCircle}
              color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />

            <SummaryCard
              title="Revision Rate"
              value={`${revisionRate}%`}
              icon={AlertCircle}
              color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            />

            <SummaryCard
              title="Avg Approval Time"
              value={`${averageApprovalTime}d`}
              icon={Clock}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderSubmissionTrends('My Submission Trends')}

            {renderStatusPieChart('My Workpack Status')}
          </div>

          {/* Workpack Health Insights */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
        <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Fastest Approved
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {fastestApproved
            ? `WP${String(fastestApproved.id).padStart(3, '0')} · ${fastestApproved.approvalDays} day`
            : 'No approved workpack yet'}
        </p>
      </div>
    </div>
  </div>

  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Most Revised
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {mostRevised
            ? `WP${String(mostRevised.id).padStart(3, '0')} · revised ${mostRevised.revisionCount} times`
            : 'No revision data yet'}
        </p>
      </div>
    </div>
  </div>

  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Current Streak
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {currentStreak} approvals in a row
        </p>
      </div>
    </div>
  </div>
</div>

{/* Recent Workpack Activity */}
<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
      Recent Workpack Activity
    </h3>

    <button
      onClick={() => navigate('/dashboard/workpacks')}
      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
      View All
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Workpack ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Project
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Submitted Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Days Since Last Action
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
        {recentContractorActivity.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
              No recent workpack activity yet
            </td>
          </tr>
        ) : (
          recentContractorActivity.map((activity) => (
            <tr
              key={activity.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  WP{String(activity.id).padStart(3, '0')}
                </span>
              </td>

              <td className="px-6 py-4">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {activity.title || '-'}
                </span>
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {activity.project_name || '-'}
                </span>
              </td>

              <td className="px-6 py-4">
                {getStatusBadge(activity.status)}
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {activity.created_at
                    ? new Date(activity.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {getDaysSince(getLastActionDate(activity))}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
        </>
      )}

      {/* REVIEWER */}
      {currentUserRole === 'reviewer' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Pending Reviews"
              value={pending}
              icon={Clock}
              color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            />

            <SummaryCard
              title="Avg Turnaround"
              value={`${averageApprovalTime}d`}
              icon={TrendingUp}
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />

            <SummaryCard
              title="Revision Request Rate"
              value={`${revisionRate}%`}
              icon={AlertCircle}
              color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            />

            <SummaryCard
              title="Total Reviewed"
              value={approved + rejected + revisionRequested}
              icon={CheckCircle}
              color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Pending Queue */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Pending Review Queue
            </h3>

            {pendingQueue.length === 0 ? (
              <div className="text-slate-500 dark:text-slate-400">
                No pending workpacks
              </div>
            ) : (
              <div className="space-y-3">
                {pendingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                          WP{String(item.id).padStart(3, '0')}
                        </span>

                        <span className="font-medium text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {item.project_name}
                      </p>
                    </div>

                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      {item.waitingDays} days
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderSubmissionTrends(
              'Incoming Workpack Volume',
              true
            )}

            {renderProjectPerformance(
              'Workpack Volume by Project'
            )}
          </div>
        </>
      )}

      {/* ADMIN */}
      {currentUserRole === 'admin' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Workpacks"
              value={totalWorkpacks}
              icon={BarChart3}
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />

            <SummaryCard
              title="Approval Rate"
              value={`${approvalRate}%`}
              icon={CheckCircle}
              color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />

            <SummaryCard
              title="Active Reviewers"
              value={reviewerComparisonData.length}
              icon={Users}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />

            <SummaryCard
              title="Avg Review Time"
              value={`${averageApprovalTime}d`}
              icon={Clock}
              color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderStatusPieChart(
              'System-Wide Status Distribution'
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Reviewer Performance Comparison
              </h3>

              {reviewerComparisonData.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reviewerComparisonData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="reviewer"
                      stroke="#64748b"
                    />

                    <YAxis stroke="#64748b" />

                    <Tooltip contentStyle={tooltipStyle} />

                    <Legend />

                    <Bar
                      dataKey="avgDays"
                      fill={COLORS.blue}
                      name="Avg Time (days)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Contractor Approval Rates
              </h3>

              {contractorPerformanceData.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contractorPerformanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="contractor"
                      stroke="#64748b"
                    />

                    <YAxis stroke="#64748b" />

                    <Tooltip contentStyle={tooltipStyle} />

                    <Legend />

                    <Bar
                      dataKey="approvalRate"
                      fill={COLORS.approved}
                      name="Approval Rate %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Workflow Bottleneck Analysis
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={bottleneckData}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    type="number"
                    stroke="#64748b"
                  />

                  <YAxis
                    dataKey="stage"
                    type="category"
                    width={150}
                    stroke="#64748b"
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Bar
                    dataKey="days"
                    fill={COLORS.revision}
                    name="Avg Days"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {renderProjectPerformance('Project Performance')}
        </>
      )}
    </div>
  );
}