import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Workpack Approved',
    message: 'WP-002 HVAC System Installation has been approved',
    time: '5 minutes ago',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Revision Requested',
    message: 'WP-003 requires revision on electrical specifications',
    time: '2 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: '3',
    title: 'New Assignment',
    message: 'You have been assigned as reviewer for WP-006',
    time: '3 hours ago',
    type: 'info',
    read: false,
  },
  {
    id: '4',
    title: 'Submission Complete',
    message: 'Your workpack WP-007 has been submitted for review',
    time: '1 day ago',
    type: 'success',
    read: true,
  },
  {
    id: '5',
    title: 'Deadline Reminder',
    message: '3 workpacks pending review are approaching deadline',
    time: '1 day ago',
    type: 'warning',
    read: true,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showBadge, setShowBadge] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Simulate new notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'System Update',
        message: 'New activity detected in your workspace',
        time: 'Just now',
        type: 'info',
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
      setShowBadge(true);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setShowBadge(false);
  };

  const handleRemove = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100';
      case 'warning':
        return 'bg-amber-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 rounded-xl transition-all group"
      >
        <Bell className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && showBadge && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in slide-in-from-top-5 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 transition-all group ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg ${getBgColor(notification.type)} flex-shrink-0`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm text-slate-900">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                              )}
                            </h4>
                            <button
                              onClick={() => handleRemove(notification.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                            >
                              <X className="w-3 h-3 text-slate-500" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-500">{notification.time}</p>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
