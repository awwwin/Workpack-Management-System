import { useState } from 'react';
import { Calendar, Clock, Users, Video, Edit, Trash2, Eye, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Meeting {
  id: string;
  workpack: string;
  title: string;
  date: string;
  time: string;
  reviewer: string;
  meetingType: 'virtual' | 'in-person' | 'hybrid';
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  link?: string;
  location?: string;
}

interface MeetingListProps {
  meetings: Meeting[];
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meetingId: string) => void;
  onView?: (meeting: Meeting) => void;
}

export function MeetingList({ meetings, onEdit, onCancel, onView }: MeetingListProps) {


  const getStatusBadge = (status: Meeting['status']) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200',
      'in-progress': 'bg-amber-100 text-amber-700 border-amber-200',
    };

    const labels = {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      'in-progress': 'In Progress',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getMeetingTypeIcon = (type: Meeting['meetingType']) => {
    if (type === 'virtual') {
      return <Video className="w-4 h-4 text-blue-600" />;
    } else if (type === 'in-person') {
      return <MapPin className="w-4 h-4 text-purple-600" />;
    } else {
      return (
        <div className="flex items-center gap-0.5">
          <Video className="w-3.5 h-3.5 text-blue-600" />
          <MapPin className="w-3.5 h-3.5 text-purple-600" />
        </div>
      );
    }
  };

  const getMeetingTypeLabel = (type: Meeting['meetingType']) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Review Meetings</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Scheduled workpack review meetings</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Meeting Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
           <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {meetings.map((meeting) => (
                <motion.tr
                  key={meeting.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                 className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {/* Meeting Details */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{meeting.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1">
                        <span className="font-medium">{meeting.workpack}</span>
                        {meeting.link && (
                          <a
                            href={meeting.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </p>
                      {meeting.location && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {meeting.location}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {meeting.time}
                      </div>
                    </div>
                  </td>

                  {/* Reviewer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {meeting.reviewer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-slate-900 dark:text-white">{meeting.reviewer}</span>
                    </div>
                  </td>

                  {/* Meeting Type */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getMeetingTypeIcon(meeting.meetingType)}
                      <span className="text-sm text-slate-700 dark:text-slate-300">{getMeetingTypeLabel(meeting.meetingType)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {getStatusBadge(meeting.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView?.(meeting)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {meeting.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => onEdit?.(meeting)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                            title="Edit meeting"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onCancel?.(meeting.id)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50  dark:hover:bg-red-900/30 rounded-lg transition-all"
                            title="Cancel meeting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {meetings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">No meetings scheduled</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Schedule your first review meeting to get started</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">Scheduled</p>
              <p className="text-2xl font-semibold text-blue-600">
                {meetings.filter(m => m.status === 'scheduled').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">Completed</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {meetings.filter(m => m.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">Virtual</p>
              <p className="text-2xl font-semibold text-purple-600">
                {meetings.filter(m => m.meetingType === 'virtual').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">Cancelled</p>
              <p className="text-2xl font-semibold text-slate-600 dark:text-slate-300">
                {meetings.filter(m => m.status === 'cancelled').length}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <Trash2 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}