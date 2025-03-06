// src/components/team/TeamFlowStatus.tsx

import React, { useEffect } from 'react';
import styles from '../../styles/TeamFlow.module.css'; // Import CSS module
import { useTeamFlowSync } from '../../features/teamSync/TeamFlowSync';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { ErrorDisplay } from '../../components/shared/ErrorDisplay';
import { AppError } from '../../types/error';

interface TeamFlowStatusProps {
  teamId: string;
}

export const TeamFlowStatus: React.FC<TeamFlowStatusProps> = ({ teamId }) => {
  const { teamMetrics, syncTeamFlow } = useTeamFlowSync(teamId);

  useEffect(() => {
    syncTeamFlow();
  }, [syncTeamFlow]);

  if (!teamMetrics) {
    return <LoadingSpinner message="Loading Team Flow Status..." />;
  }

  if (teamMetrics.isError) {
    return <ErrorDisplay error={teamMetrics.error as AppError} />;
  }


  return (
    <div className={styles.teamFlowContainer}>
      <div className={styles.teamFlowHeader}>
        <h3>Team Flow Status</h3>
        <div className={styles.teamFlowScore}>
          {teamMetrics?.teamFlowScore}%
        </div>
      </div>
      
      <div className={styles.teamMetrics}>
        <div className={styles.metricCard}>
          <span>Average Streak</span>
          <strong>{teamMetrics?.averageTeamStreak} days</strong>
        </div>
        <div className={styles.metricCard}>
          <span>Active Members</span>
          <strong>{teamMetrics?.activeMembers}</strong>
        </div>
        <div className={styles.metricCard}>
          <span>Synced Sessions</span>
          <strong>{teamMetrics?.synchronizedSessions}</strong>
        </div>
      </div>
    </div>
  );
};