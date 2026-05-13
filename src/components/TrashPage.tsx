import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, X, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';
import { supabase } from "../lib/supabase";

interface DeletedWorkpack {
  id: string;
  title: string;
  projectName: string;
  deletedBy: string;
  deletedDate: string;
  originalStatus: string;
  daysUntilPermanentDelete: number;
}

export function TrashPage() {
  const { showToast, ToastContainer } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<string | null>(null);
  const [deletedWorkpacks, setDeletedWorkpacks] = useState<any[]>([]);
  const [selectedWorkpack, setSelectedWorkpack] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
     loadDeletedWorkpacks();
  }, []);

  const loadDeletedWorkpacks = async () => {

  const { data, error } = await supabase
    .from('workpacks')
    .select('*')
    .eq('is_deleted', true)
    .order('deleted_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setDeletedWorkpacks(data || []);
};
  
  const filteredWorkpacks = deletedWorkpacks.filter(w =>
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (id: number) => {

  const { error } = await supabase
    .from('workpacks')
    .update({
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
    })
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setDeletedWorkpacks(prev =>
    prev.filter(w => w.id !== id)
  );

  showToast('Workpack restored successfully', 'success');
};

  const handlePermanentDelete = async (id: number) => {

  const { error } = await supabase
    .from('workpacks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setDeletedWorkpacks(prev =>
    prev.filter(w => w.id !== id)
  );

  showToast('Workpack permanently deleted', 'success');
}; 

  const handleBulkRestore = () => {
    if (selectedItems.length === 0) return;

    setDeletedWorkpacks(deletedWorkpacks.filter(w => !selectedItems.includes(w.id)));
    showToast(`${selectedItems.length} workpack(s) restored successfully`, 'success');
    setSelectedItems([]);
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently delete all items in trash? This action cannot be undone.')) {
      const count = deletedWorkpacks.length;
      setDeletedWorkpacks([]);
      showToast(`${count} workpack(s) permanently deleted`, 'success');
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredWorkpacks.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredWorkpacks.map(w => w.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'pending_review': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'approved': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'revision_requested': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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

  const formatDeletedDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Trash</h1>
    
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkRestore}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Restore {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
            </button>
          )}
          {deletedWorkpacks.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      {deletedWorkpacks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-300">Items in trash will be permanently deleted after 30 days</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Restore items before they are permanently deleted. Once permanently deleted, workpacks cannot be recovered.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      {deletedWorkpacks.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deleted workpacks..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Deleted Workpacks List */}
      {filteredWorkpacks.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredWorkpacks.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Workpack
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Original Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Deleted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Deleted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Auto-Delete In
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <AnimatePresence>
                  {filteredWorkpacks.map((workpack) => (
                    <motion.tr
                      key={workpack.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(workpack.id)}
                          onChange={() => toggleSelect(workpack.id)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{workpack.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 font-mono mt-1">{workpack.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{workpack.projectName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workpack.originalStatus)}`}>
                          {getStatusText(workpack.originalStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{workpack.deletedBy}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formatDeletedDate(workpack.deletedDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          workpack.daysUntilPermanentDelete <= 7
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {workpack.daysUntilPermanentDelete} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setShowRestoreConfirm(workpack.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restore
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(workpack.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Trash is empty</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Deleted workpacks will appear here and can be restored within 30 days
          </p>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      <AnimatePresence>
        {showRestoreConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowRestoreConfirm(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <RotateCcw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Restore Workpack</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to restore this workpack? It will be moved back to its original location.
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowRestoreConfirm(null)}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRestore(showRestoreConfirm)}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
                  >
                    Restore
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Permanent Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Permanently Delete</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to permanently delete this workpack? This action cannot be undone and all data will be lost forever.
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all"
                  >
                    Delete Permanently
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}