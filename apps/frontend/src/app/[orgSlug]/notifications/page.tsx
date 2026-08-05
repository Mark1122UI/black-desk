'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Bell, Check, Trash2, Settings, FileText, Bot, Users, Calendar, RefreshCw } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'New CRM Lead Assigned', message: 'Jane Doe has been assigned to you.', category: 'CRM', time: '10 min ago', isRead: false },
  { id: '2', title: 'Project Apollo Deadline', message: 'The Phase 1 milestone is due tomorrow.', category: 'PROJECT', time: '2 hours ago', isRead: false },
  { id: '3', title: 'Workflow Executed', message: 'Automated workflow rule ran successfully.', category: 'SYSTEM', time: 'Yesterday', isRead: true },
  { id: '4', title: 'Meeting Reminder', message: 'Sync with Design Team in 15 minutes.', category: 'MEETING', time: '2 days ago', isRead: true },
];

export default function NotificationsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [notifications, setNotifications] = useState<any[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/organizations/${orgSlug}/notifications`).catch(() => null);
      if (data && data.items && data.items.length > 0) {
        setNotifications(
          data.items.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            category: n.category || 'SYSTEM',
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: n.isRead,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [orgSlug]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'CRM') return n.category === 'CRM';
    if (filter === 'PROJECTS') return n.category === 'PROJECT';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notification Center
          </h2>
          <p className="text-muted-foreground text-sm">You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            title="Refresh Notifications"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Check size={16} /> Mark all read
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-zinc-800">
        {['ALL', 'UNREAD', 'CRM', 'PROJECTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${filter === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden divide-y divide-gray-200 dark:divide-zinc-800">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No notifications found.</div>
        ) : (
          filteredNotifications.map((notif) => (
            <div key={notif.id} className={`p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${!notif.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700">
                <Bell size={16} className={!notif.isRead ? 'text-primary' : 'text-gray-400'} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{notif.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(notif.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700"
                  title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  <Check size={16} className={notif.isRead ? 'text-green-500' : ''} />
                </button>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
