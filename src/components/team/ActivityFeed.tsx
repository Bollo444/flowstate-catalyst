// src/components/team/ActivityFeed.tsx

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface Activity {
  id: string;
  type: 'session_start' | 'session_end' | 'achievement' | 'milestone';
  user: string;
  timestamp: Date;
  description: string;
}

export const ActivityFeed: React.FC = () => {
  const supabase = useSupabaseClient();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('activities')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_activities'
      }, payload => {
        setActivities(prev => [payload.new as Activity, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getActivityIcon = (type: string) => {
    // Placeholder for activity icons - replace with actual icons or components
    return type.toUpperCase(); 
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString();
  };

  return (
    <div className={styles.activityFeed}>
      <div className={styles.feedHeader}>
        <h3>Team Activity</h3>
        <div className={styles.filterControls}>
          {/* Activity filters - future implementation */}
        </div>
      </div>

      <div className={styles.feedContent}>
        {activities.map(activity => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              {getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <p>{activity.description}</p>
              <span className={styles.timestamp}>
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};