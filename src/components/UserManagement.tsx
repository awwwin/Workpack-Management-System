import { useEffect,useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'contractor' | 'reviewer' | 'admin';
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export function UserManagement() {
  const { showToast, ToastContainer } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Extended user data
const loadUsers = async () => {
  const { data, error } = await supabase
.from('profiles')
.select('id, full_name, email, role, status, created_at, phone, department')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Users fetch error:', error.message);
    return;
  }

  const formattedUsers: User[] = (data || []).map((user: any) => ({
    id: user.id,
    name: user.full_name || 'No Name',
    email: user.email || '',
    role: user.role,
   phone: user.phone || '-',
department:
  user.department ||
  (user.role === 'contractor'
    ? 'Construction'
    : user.role === 'reviewer'
    ? 'Quality Assurance'
    : 'Administration'),
    status: user.status || 'active',
    joinedDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : '-',
  }));

  setUsers(formattedUsers);
};

useEffect(() => {
  loadUsers();
}, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    contractors: users.filter(u => u.role === 'contractor').length,
    reviewers: users.filter(u => u.role === 'reviewer').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'reviewer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contractor':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200';
    }
  };

const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  department: '',
  role: 'contractor' as 'contractor' | 'reviewer' | 'admin',
  password: '',
});
 const handleAddUser = () => {
  setSelectedUser(null);
  setFormData({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'contractor',
    password: '',
  });
  setShowAddUserModal(true);
};

const handleEditUser = (user: User) => {
  setSelectedUser(user);
  setFormData({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    department: user.department || '',
    role: user.role,
    password: '',
  });
  setShowAddUserModal(true);
  setShowUserMenu(null);
};

  // 3. Status Toggle Logic
const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';

  const { error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', user.id);

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  showToast(`User ${user.name} is now ${newStatus}`, 'success');
  setShowUserMenu(null);
  loadUsers();
};

// 4. Delete Logic
const handleDeleteUser = async (user: User) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  showToast(`User ${user.name} has been removed`, 'success');
  setShowUserMenu(null);
  loadUsers();
};

// 5. Submit (Save/Update) Logic
const handleSubmit = async () => {
  const updatedData = {
    full_name: formData.name,
    email: formData.email,
    role: formData.role,
    // Add any other fields you are updating
  };

  const { error } = await supabase
    .from('profiles')
    .update(updatedData)
    .eq('id', selectedUser?.id);

  if (error) {
    showToast(error.message, 'error');
  } else {
    // THIS PART UPDATES THE SCREEN IMMEDIATELY
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === selectedUser?.id 
          ? { ...u, name: formData.name, email: formData.email, role: formData.role } 
          : u
      )
    );

    showToast('User updated successfully', 'success');
    setShowAddUserModal(false);
    setSelectedUser(null);
  }
};

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Manage system users, roles, and permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Total Users</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <Users className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Active</p>
              <p className="text-2xl font-semibold text-emerald-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Contractors</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.contractors}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Reviewers</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.reviewers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Admins</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.admins}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="contractor">Contractors</option>
              <option value="reviewer">Reviewers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Showing <span className="font-medium text-slate-900 dark:text-white">{filteredUsers.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{users.length}</span> users
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      <Shield className="w-3.5 h-3.5" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 dark:text-white">{user.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Calendar className="w-4 h-4" />
                      {user.joinedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </button>

                      <AnimatePresence>
                        {showUserMenu === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-10 overflow-hidden"
                          >
                            <button
                              onClick={() => handleEditUser(user)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                            >
                              <Edit className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                              <span className="text-sm text-slate-900 dark:text-white">Edit User</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                            >
                              {user.status === 'active' ? (
                                <>
                                  <XCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                  <span className="text-sm text-slate-900 dark:text-white">Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                  <span className="text-sm text-slate-900 dark:text-white">Activate</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-slate-200"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600">Delete User</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {selectedUser ? 'Update user information and permissions' : 'Create a new user account'}
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Full Name</label>
                   <input
  type="text"
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Email Address</label>
                   <input
  type="email"
  value={formData.email}
  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john.doe@example.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Phone Number</label>
                    <input
  type="tel"
  value={formData.phone}
  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Department</label>
                    <input
  type="text"
  value={formData.department}
  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Engineering"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Role</label>
                  <select
  value={formData.role}
  onChange={(e) =>
    setFormData({
      ...formData,
      role: e.target.value as 'contractor' | 'reviewer' | 'admin',
    })
  }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all cursor-pointer"
                  >
                    <option value="contractor">Contractor</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {!selectedUser && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Password</label>
                    <input
  type="password"
  value={formData.password}
  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
onClick={async () => {
  if (selectedUser) {
    const { error } = await supabase
      .from('profiles')
      .update({
  full_name: formData.name,
  email: formData.email,
  role: formData.role,
  phone: formData.phone,
  department: formData.department,
})
      .eq('id', selectedUser.id);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    showToast('User updated successfully', 'success');
    setShowAddUserModal(false);
    setSelectedUser(null);
    loadUsers();
    return;
  }

  showToast('For now, create login users in Supabase Authentication first, then add their profile.', 'info');
}}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  {selectedUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
