// src/components/dashboard/DashboardLayout.tsx
import React from 'react';
import styles from './DashboardLayout.module.css';
import { DashboardControls } from './DashboardControls';
import { TeamInsights } from './TeamInsights';
import { ActivityFeed } from '../team/ActivityFeed';
import { DashboardSummary } from './DashboardSummary'; // Assuming DashboardSummary component exists
import { TeamMembers } from '../team/TeamMembers'; // Assuming TeamMembers component exists
import { QuickActions } from './QuickActions';

export const DashboardLayout: React.FC = () => {
  const [teamId, setTeamId] = useState<string | null>('example-team-id'); // Example team ID

  return (
    <div className={styles.dashboardLayout}>
      <DashboardControls />
      
      <div className={styles.content}>
        {/* Conditionally render detailed or summary view */}
          <>
            <TeamInsights 
              teamId={teamId}
            />
            <ActivityFeed />
          </>
      </div>

      <div className={styles.sidebar}>
        {/* Team members list */}
        {/* <TeamMembers teamId={teamId} /> */}
        <p>Team Members Component Placeholder</p>
        <QuickActions />
      </div>
    </div>
  );
};