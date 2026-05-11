import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarMeeting {
  id: string;
  workpack: string;
  title: string;
  date: string;
  time: string;
  reviewer: string;
  meetingType: 'virtual' | 'in-person' | 'hybrid';
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface MeetingCalendarProps {
  meetings: CalendarMeeting[];
  onMeetingClick?: (meeting: CalendarMeeting) => void;
}

export function MeetingCalendar({ meetings, onMeetingClick }: MeetingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(m => m.date === dateStr);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const selectedDateMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const getMeetingTypeIcon = (type: CalendarMeeting['meetingType']) => {
    if (type === 'virtual') {
      return <Video className="w-3 h-3 text-blue-600" />;
    } else if (type === 'in-person') {
      return <MapPin className="w-3 h-3 text-purple-600" />;
    } else {
      return <Users className="w-3 h-3 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Meeting Calendar</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">View and manage scheduled review meetings</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white/80 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
              </div>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/80 rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square border-b border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayMeetings = getMeetingsForDate(date);
                const today = isToday(day);
                const isSelected = selectedDate?.getDate() === day && 
                                 selectedDate?.getMonth() === currentDate.getMonth() &&
                                 selectedDate?.getFullYear() === currentDate.getFullYear();

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square border-b border-r border-slate-200 p-2 cursor-pointer transition-all ${
                      isSelected ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            today
                              ? 'w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {day}
                        </span>
                        {dayMeetings.length > 0 && (
                          <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {dayMeetings.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        {dayMeetings.slice(0, 2).map((meeting) => (
                          <div
                            key={meeting.id}
                            className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded truncate flex items-center gap-1"
                          >
                            {getMeetingTypeIcon(meeting.meetingType)}
                            <span className="truncate">{meeting.time}</span>
                          </div>
                        ))}
                        {dayMeetings.length > 2 && (
                          <div className="text-xs text-slate-500 px-1.5">
                            +{dayMeetings.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Meeting Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
            {selectedDate ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {selectedDateMeetings.length} {selectedDateMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
                  </p>
                </div>

                {selectedDateMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateMeetings.map((meeting) => (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => onMeetingClick?.(meeting)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getMeetingTypeIcon(meeting.meetingType)}
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                              {meeting.meetingType.replace('-', ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">{meeting.workpack}</span>
                        </div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">{meeting.title}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5" />
                            {meeting.time}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <Users className="w-3.5 h-3.5" />
                            {meeting.reviewer}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">No meetings scheduled</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-slate-900 dark:text-white font-medium mb-2">Select a Date</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Click on a day in the calendar to view scheduled meetings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Meeting Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Virtual Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">In-Person Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Hybrid Meeting</span>
          </div>
        </div>
      </div>
    </div>
  );
}
