export interface User {
  id: string;
  name: string;
  email: string;
  role: 'contractor' | 'reviewer' | 'admin';
  avatar?: string;
}

export interface Workpack {
  id: string;
  title: string;
  projectName: string;
  description: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'revision_requested';
  submittedBy: string;
  submittedDate: string;
  assignedReviewer?: string;
  documents: string[];
  comments: Comment[];
  timeline: TimelineEvent[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface TimelineEvent {
  id: string;
  event: string;
  user: string;
  date: string;
  status: string;
}

export const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com', role: 'contractor' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'reviewer' },
  { id: '3', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'reviewer' },
  { id: '4', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

export const mockWorkpacks: Workpack[] = [
  {
    id: 'WP-001',
    title: 'Foundation and Structural Steel Installation',
    projectName: 'Downtown Office Complex',
    description: 'Complete foundation work including excavation, concrete pouring, and structural steel installation for the main building structure.',
    status: 'pending_review',
    submittedBy: 'John Smith',
    submittedDate: '2024-02-10',
    assignedReviewer: 'Sarah Johnson',
    documents: ['foundation_plans.pdf', 'steel_specifications.pdf', 'safety_checklist.pdf'],
    comments: [
      {
        id: 'c1',
        author: 'Sarah Johnson',
        content: 'Please provide additional details on the steel grade specifications.',
        date: '2024-02-11',
      }
    ],
    timeline: [
      { id: 't1', event: 'Workpack Created', user: 'John Smith', date: '2024-02-09', status: 'draft' },
      { id: 't2', event: 'Submitted for Review', user: 'John Smith', date: '2024-02-10', status: 'pending_review' },
      { id: 't3', event: 'Under Review', user: 'Sarah Johnson', date: '2024-02-11', status: 'pending_review' },
    ]
  },
  {
    id: 'WP-002',
    title: 'HVAC System Installation - Phase 1',
    projectName: 'Riverside Shopping Mall',
    description: 'Installation of primary HVAC units, ductwork, and control systems for the first floor retail spaces.',
    status: 'approved',
    submittedBy: 'John Smith',
    submittedDate: '2024-02-05',
    assignedReviewer: 'Michael Chen',
    documents: ['hvac_layout.pdf', 'equipment_specs.pdf'],
    comments: [
      {
        id: 'c2',
        author: 'Michael Chen',
        content: 'All documentation is complete. Approved for execution.',
        date: '2024-02-06',
      }
    ],
    timeline: [
      { id: 't4', event: 'Workpack Created', user: 'John Smith', date: '2024-02-04', status: 'draft' },
      { id: 't5', event: 'Submitted for Review', user: 'John Smith', date: '2024-02-05', status: 'pending_review' },
      { id: 't6', event: 'Approved', user: 'Michael Chen', date: '2024-02-06', status: 'approved' },
    ]
  },
  {
    id: 'WP-003',
    title: 'Electrical Wiring - Building A',
    projectName: 'Tech Park Development',
    description: 'Complete electrical wiring installation for Building A including power distribution, lighting circuits, and emergency systems.',
    status: 'revision_requested',
    submittedBy: 'John Smith',
    submittedDate: '2024-02-08',
    assignedReviewer: 'Sarah Johnson',
    documents: ['electrical_plans.pdf', 'load_calculations.pdf'],
    comments: [
      {
        id: 'c3',
        author: 'Sarah Johnson',
        content: 'Load calculations need to be revised according to the updated building specifications.',
        date: '2024-02-09',
      }
    ],
    timeline: [
      { id: 't7', event: 'Workpack Created', user: 'John Smith', date: '2024-02-07', status: 'draft' },
      { id: 't8', event: 'Submitted for Review', user: 'John Smith', date: '2024-02-08', status: 'pending_review' },
      { id: 't9', event: 'Revision Requested', user: 'Sarah Johnson', date: '2024-02-09', status: 'revision_requested' },
    ]
  },
  {
    id: 'WP-004',
    title: 'Plumbing Rough-In',
    projectName: 'Downtown Office Complex',
    description: 'Rough-in plumbing work including water supply lines, drainage systems, and fixture preparations.',
    status: 'draft',
    submittedBy: 'John Smith',
    submittedDate: '2024-02-12',
    documents: ['plumbing_layout.pdf'],
    comments: [],
    timeline: [
      { id: 't10', event: 'Workpack Created', user: 'John Smith', date: '2024-02-12', status: 'draft' },
    ]
  },
  {
    id: 'WP-005',
    title: 'Fire Protection System',
    projectName: 'Riverside Shopping Mall',
    description: 'Installation of sprinkler systems, fire alarms, and emergency response systems throughout the facility.',
    status: 'rejected',
    submittedBy: 'John Smith',
    submittedDate: '2024-02-03',
    assignedReviewer: 'Michael Chen',
    documents: ['fire_protection_plan.pdf'],
    comments: [
      {
        id: 'c4',
        author: 'Michael Chen',
        content: 'Documentation does not meet current fire safety code requirements. Please revise and resubmit with updated compliance documentation.',
        date: '2024-02-04',
      }
    ],
    timeline: [
      { id: 't11', event: 'Workpack Created', user: 'John Smith', date: '2024-02-02', status: 'draft' },
      { id: 't12', event: 'Submitted for Review', user: 'John Smith', date: '2024-02-03', status: 'pending_review' },
      { id: 't13', event: 'Rejected', user: 'Michael Chen', date: '2024-02-04', status: 'rejected' },
    ]
  },
];

export const getCurrentUser = (): User => {
  // Get role from localStorage or default to contractor
  const role = (localStorage.getItem('userRole') || 'contractor') as 'contractor' | 'reviewer' | 'admin';
  return mockUsers.find(u => u.role === role) || mockUsers[0];
};

export const setCurrentUserRole = (role: 'contractor' | 'reviewer' | 'admin') => {
  localStorage.setItem('userRole', role);
};
