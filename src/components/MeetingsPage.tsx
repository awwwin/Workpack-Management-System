import { Calendar, Plus, List, CalendarDays } from 'lucide-react';
import { ScheduleMeetingModal, MeetingData } from './ScheduleMeetingModal';
import { MeetingList } from './MeetingList';
import { MeetingCalendar } from './MeetingCalendar';
import { useToast } from './Toast';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function MeetingsPage() {
  const [workpacks, setWorkpacks] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast, ToastContainer } = useToast();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);

  const loadMeetings = async () => {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('meeting_date', { ascending: true });

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  setMeetings(data || []);
};

useEffect(() => {
  loadMeetings();
  loadFormOptions(); 
}, []);

const loadFormOptions = async () => {
  const { data: workpackData, error: workpackError } = await supabase
    .from('workpacks')
    .select('id, title')
    .order('created_at', { ascending: false })
    .eq('is_deleted', false);

  if (workpackError) {
    showToast(workpackError.message, 'error');
    return;
  }

  const { data: reviewerData, error: reviewerError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'reviewer');

  if (reviewerError) {
    showToast(reviewerError.message, 'error');
    return;
  }

  setWorkpacks(workpackData || []);
  setReviewers(reviewerData || []);
};

const handleScheduleMeeting = async (meeting: MeetingData) => {
  const selectedDate = new Date(meeting.date);
const today = new Date();

// remove time part (important)
today.setHours(0, 0, 0, 0);

if (selectedDate < today) {
  showToast('Cannot schedule meeting in the past!', 'error');
  return;
}
  const { data: authData } = await supabase.auth.getUser();

  const { error } = await supabase.from('meetings').insert([
    {
      title: meeting.title,
      workpack_id: meeting.workpackId || null,
      reviewer_id: meeting.reviewerId || null,
      meeting_date: meeting.date,
      meeting_time: meeting.time,
      meeting_type: meeting.meetingType,
      link: meeting.link || null,
      location: meeting.location || null,
      status: 'scheduled',
      created_by: authData.user?.id || null,
    },
  ]);

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  showToast('Meeting scheduled successfully!', 'success');
  setIsModalOpen(false);
  loadMeetings();
};

const handleEditMeeting = (meeting: any) => {
  setEditingMeeting(meeting);
  setIsModalOpen(true);
};

const handleCancelMeeting = async (meetingId: string) => {

  const { error } = await supabase
    .from('meetings')
    .update({
      status: 'cancelled',
    })
    .eq('id', meetingId);

  if (error) {
    console.error(error);
    showToast('Failed to cancel meeting', 'error');
    return;
  }

  setMeetings((prev) =>
    prev.map((m) =>
      m.id === meetingId
        ? { ...m, status: 'cancelled' }
        : m
    )
  );

  showToast('Meeting cancelled successfully', 'success');
};

const handleViewMeeting = (meeting: any) => {
  setSelectedMeeting(meeting);
  setIsViewModalOpen(true);
};

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Review Meetings</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Schedule and manage workpack review meetings</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  :'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === 'calendar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-medium">Calendar</span>
            </button>
          </div>

          {/* Schedule Button */}
          <button
            onClick={() => {
                 setEditingMeeting(null);
                 setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'list' ? (
<MeetingList
  meetings={meetings}
  onEdit={handleEditMeeting}
  onCancel={handleCancelMeeting}
  onView={handleViewMeeting}
/>
      ) : (
<MeetingCalendar
  meetings={meetings}
  onMeetingClick={handleViewMeeting}
/>
      )}

      {/* Schedule Meeting Modal */}
<ScheduleMeetingModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleScheduleMeeting}
  workpacks={workpacks}
  reviewers={reviewers}
  editingMeeting={editingMeeting}
/>

{isViewModalOpen && selectedMeeting && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-lg">

      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Meeting Details
      </h2>

      <div className="space-y-3 text-sm">
        <p><strong>Title:</strong> {selectedMeeting.title}</p>
        <p><strong>Date:</strong> {selectedMeeting.date}</p>
        <p><strong>Time:</strong> {selectedMeeting.time}</p>
        <p><strong>Reviewer:</strong> {selectedMeeting.reviewer}</p>
        <p><strong>Status:</strong> {selectedMeeting.status}</p>
        <p><strong>Type:</strong> {selectedMeeting.meetingType}</p>
      </div>

      {selectedMeeting.link && (
        <button
          onClick={() => window.open(selectedMeeting.link, '_blank')}
          className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Join Meeting
        </button>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsViewModalOpen(false)}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
