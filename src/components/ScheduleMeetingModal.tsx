import { useState } from 'react';
import { X, Calendar, Clock, Users, Video, Link as LinkIcon, FileText, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meeting: MeetingData) => void;
  workpacks: any[];
  reviewers: any[];
}

export interface MeetingData {
  workpackId: string;
  title: string;
  date: string;
  time: string;
  reviewerId: string;
  meetingType: 'virtual' | 'in-person' | 'hybrid';
  link: string;
  location: string;
  notes: string;
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  workpacks,
  reviewers,
}: ScheduleMeetingModalProps) {

const [formData, setFormData] = useState<MeetingData>({
  workpackId: '',
  title: '',
  date: '',
  time: '',
  reviewerId: '',
  meetingType: 'virtual',
  link: '',
  location: '',
  notes: '',
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
setFormData({
  workpackId: '',
  title: '',
  date: '',
  time: '',
  reviewerId: '',
  meetingType: 'virtual',
  link: '',
  location: '',
  notes: '',
});
    onClose();
  };

  const handleChange = (field: keyof MeetingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
           <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Schedule Review Meeting</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Set up a meeting to review workpack progress</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Workpack Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Workpack
                </label>
                     <select
                      value={formData.workpackId}
                      onChange={(e) => handleChange('workpackId', e.target.value)}
                       required
                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                      >
                    <option value="">Select a workpack</option>
                    {workpacks.map((wp) => (
                     <option key={wp.id} value={wp.id}>
                    {`WP${String(wp.id).padStart(3, '0')} - ${wp.title}`}
                    </option>
                   ))}
                   </select>
              </div>

            <div>
               <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Meeting Title
               </label>
               <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Workpack Review Meeting"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 />
               </div>             

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                     min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Reviewer Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Reviewer
                </label>
               <select
                 value={formData.reviewerId}
                 onChange={(e) => handleChange('reviewerId', e.target.value)}
                 required
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                 >
             <option value="">Select a reviewer</option>
                 {reviewers.map((reviewer) => (
            <option key={reviewer.id} value={reviewer.id}>
                 {reviewer.full_name || reviewer.email}
             </option>
             ))}
             </select>
              </div>

              {/* Meeting Type */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                  <Video className="w-4 h-4 inline mr-2" />
                  Meeting Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('meetingType', 'virtual')}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      formData.meetingType === 'virtual'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Video className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Virtual</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('meetingType', 'in-person')}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      formData.meetingType === 'in-person'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">In-Person</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('meetingType', 'hybrid')}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      formData.meetingType === 'hybrid'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Video className="w-4 h-4" />
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium">Hybrid</div>
                  </button>
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Meeting Link {formData.meetingType !== 'in-person' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  required={formData.meetingType !== 'in-person'}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formData.meetingType === 'virtual' 
                    ? 'Provide the virtual meeting link (Zoom, Teams, Google Meet, etc.)'
                    : formData.meetingType === 'hybrid'
                    ? 'Provide the link for remote participants'
                    : 'Optional: Add a link for meeting details or location map'}
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add any additional notes or agenda items..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </form>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
               className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
              >
                <Save className="w-4 h-4" />
                Schedule Meeting
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
