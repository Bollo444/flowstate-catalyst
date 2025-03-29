// src/components/team/ActivityFeed.tsx

import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
// Assuming icons like Bell, CheckCircle, etc. are available or will be added
import { Bell, CheckCircle, Milestone, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: "session_start" | "session_end" | "achievement" | "milestone";
  user: string;
  timestamp: Date;
  description: string;
}

export const ActivityFeed: React.FC = () => {
  const supabase = useSupabaseClient();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Fetch initial activities
    const fetchInitialActivities = async () => {
      const { data, error } = await supabase
        .from('team_activities') // Adjust table name if different
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50); // Load initial set

      if (error) {
        console.error('Error fetching activities:', error);
      } else if (data) {
        // Ensure timestamp is a Date object if it's not already
        const typedData = data.map(a => ({...a, timestamp: new Date(a.timestamp)})) as Activity[];
        setActivities(typedData);
      }
    };
    fetchInitialActivities();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_activities",
        },
        (payload) => {
          setActivities((prev) =>
            // Ensure timestamp is a Date object
            [{...(payload.new as Activity), timestamp: new Date(payload.new.timestamp)}, ...prev].slice(0, 50)
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getActivityIcon = (type: string) => {
    // Basic icon mapping based on type
    switch (type) {
      case 'session_start': return <Clock size={20} className="text-blue-500" />;
      case 'session_end': return <Clock size={20} className="text-gray-500" />;
      case 'achievement': return <CheckCircle size={20} className="text-green-500" />;
      case 'milestone': return <Milestone size={20} className="text-purple-500" />;
      default: return <Bell size={20} className="text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    // Format relative time or absolute time based on preference
    // Example: using toLocaleTimeString
    try {
       // Handle potential invalid date objects safely
       if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
           throw new Error("Invalid Date object");
       }
       return timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (e: any) {
       console.error("Error formatting timestamp:", timestamp, e.message);
       return "Invalid time";
    }
  };

  return (
    // Main container: Themed background, rounded, padding, shadow, scrollable with max height
    <div className="bg-background-light dark:bg-background-dark-secondary rounded-lg p-6 shadow-md overflow-y-auto max-h-96"> {/* max-h-96 is 24rem */}
      {/* Feed Header: Flex layout, spacing, margin */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold text-foreground-light dark:text-foreground-dark">Team Activity</h3>
        <div>
          {/* Activity filters - future implementation */}
        </div>
      </div>

      {/* Feed Content List: Add space between items */}
      <div className="space-y-3">
        {activities.map((activity) => (
          // Activity Item: Flex layout, vertical padding, border bottom (except last)
          <div key={activity.id} className="flex items-center py-3 border-b border-border-light dark:border-border-dark last:border-b-0">
            {/* Activity Icon Container: Fixed size, rounded, centered, themed background */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background-light-secondary dark:bg-background-dark flex items-center justify-center mr-3">
              {getActivityIcon(activity.type)}
            </div>
            {/* Activity Content: Takes remaining space */}
            <div className="flex-1 min-w-0"> {/* Added min-w-0 for potential text overflow */}
              <p className="mb-1 font-medium text-foreground-light dark:text-foreground-dark truncate">{activity.description}</p> {/* Added truncate */}
              <span className="text-xs text-foreground-light-secondary dark:text-foreground-dark-secondary">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
