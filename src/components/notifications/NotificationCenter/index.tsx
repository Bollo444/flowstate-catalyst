import React, { useState, useEffect, useRef } from 'react';
import { useProgressNotifications, ProgressNotification } from '../../../hooks/useProgressNotifications';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { ErrorDisplay } from '../../shared/ErrorDisplay';
import styles from './styles.module.css';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission,
    unreadCount
  } = useProgressNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: ProgressNotification['type']) => {
    switch (type) {
      case 'completion':
        return (
          <svg className={`${styles.icon} ${styles.completion}`} viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        );
      case 'milestone':
        return (
          <svg className={`${styles.icon} ${styles.milestone}`} viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
      default:
        return (
          <svg className={`${styles.icon} ${styles.update}`} viewBox="0 0 24 24">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
          </svg>
        );
    }
  };

  const renderNotification = (notification: ProgressNotification) => (
    <div
      key={notification.id}
      className={`${styles.notification} ${!notification.read ? styles.unread : ''}`}
      onClick={() => markAsRead(notification.id)}
    >
      {getNotificationIcon(notification.type)}
      
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.userName}>{notification.userName}</span>
          <span className={styles.time}>
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>

        <p className={styles.message}>
          Updated "{notification.taskTitle}" to {notification.progress}% complete
        </p>

        {notification.note && (
          <p className={styles.note}>{notification.note}</p>
        )}

        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${notification.progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <svg viewBox="0 0 24 24" className={styles.bellIcon}>
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button
                className={styles.markAllRead}
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className={styles.content}>
            {loading ? (
              <div className={styles.loading}>
                <LoadingSpinner size="small" />
              </div>
            ) : error ? (
              <div className={styles.error}>
                <ErrorDisplay
                  error={{
                    code: 'NOTIFICATION_ERROR',
                    message: 'Failed to load notifications',
                    details: error
                  }}
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.empty}>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className={styles.list}>
                {notifications.map(renderNotification)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};