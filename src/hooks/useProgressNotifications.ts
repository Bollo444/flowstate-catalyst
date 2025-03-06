import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Task, ProgressUpdate } from '../types/database';
import { handleSupabaseError } from '../utils/errorHandling';

export interface ProgressNotification {
  id: string;
  type: 'progress_update' | 'completion' | 'milestone';
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  progress: number;
  note?: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationSubscription {
  taskId: string;
  type: 'all' | 'completion' | 'milestone';
}

interface UseProgressNotificationsReturn {
  notifications: ProgressNotification[];
  loading: boolean;
  error: AppError | null;
  markAsRead: (notificationId: string) => Promise<void>;
  subscribe: (subscription: NotificationSubscription) => Promise<void>;
  unsubscribe: (taskId: string) => Promise<void>;
}

export const useProgressNotifications = (): UseProgressNotificationsReturn => {
  const supabase = useSupabaseClient();
  const [notifications, setNotifications] = useState<ProgressNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let subscription: any;

    const setupRealtimeSubscription = async () => {
      // Subscribe to progress updates
      subscription = supabase
        .channel('progress-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'progress_updates'
          },
          async (payload) => {
            try {
              // Fetch related task and user info
              const { data: task } = await supabase
                .from('tasks')
                .select('title')
                .eq('id', payload.new.task_id)
                .single();

              const { data: user } = await supabase
                .from('users')
                .select('full_name, email')
                .eq('id', payload.new.user_id)
                .single();

              if (task && user) {
                const notification: ProgressNotification = {
                  id: payload.new.id,
                  type: payload.new.progress === 100 ? 'completion' : 
                        payload.new.progress % 25 === 0 ? 'milestone' : 
                        'progress_update',
                  taskId: payload.new.task_id,
                  taskTitle: task.title,
                  userId: payload.new.user_id,
                  userName: user.full_name || user.email,
                  progress: payload.new.progress,
                  note: payload.new.note,
                  timestamp: payload.new.created_at,
                  read: false
                };

                setNotifications(prev => [notification, ...prev]);

                // Show browser notification if supported
                if (Notification.permission === 'granted') {
                  new Notification('Task Progress Update', {
                    body: `${notification.userName} updated "${notification.taskTitle}" to ${notification.progress}% complete`,
                    icon: '/notification-icon.png'
                  });
                }
              }
            } catch (error) {
              console.error('Error processing notification:', error);
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [supabase]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: updates, error } = await supabase
        .from('progress_updates')
        .select(`
          *,
          task:tasks(id, title),
          user:users(id, full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedNotifications: ProgressNotification[] = updates.map(update => ({
        id: update.id,
        type: update.progress === 100 ? 'completion' : 
              update.progress % 25 === 0 ? 'milestone' : 
              'progress_update',
        taskId: update.task.id,
        taskTitle: update.task.title,
        userId: update.user.id,
        userName: update.user.full_name || update.user.email,
        progress: update.progress,
        note: update.note,
        timestamp: update.created_at,
        read: false
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      setError(error as Error);
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
