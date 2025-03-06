import React from 'react';
import styles from './TeamView.module.css';
import { useFlowStore } from '../../../stores/flowStore';
import { TeamSyncButton } from '../TeamSyncButton';
import { TeamMemberCard } from '../TeamMemberCard';
import { TeamFlowChart } from '../TeamFlowChart';
import { SyncOpportunities } from '../SyncOpportunities';
import { CollaborationInsights } from '../CollaborationInsights';

export const TeamView: React.FC = () => {
  const { teamMembers, teamFlow } = useFlowStore();

  return (
    <div className={styles.teamViewContainer}>
      <div className={styles.teamHeader}>
        <h2>Team Flow</h2>
        <TeamSyncButton />
      </div>

      <div className={styles.teamGrid}>
        {teamMembers.map(member => (
          <TeamMemberCard
            key={member.id}
            member={member}
            flowState={member.currentFlow}
          />
        ))}
      </div>

      <div className={styles.teamMetrics}>
        <TeamFlowChart data={teamFlow.history} />
        <SyncOpportunities />
        <CollaborationInsights />
      </div>
    </div>
  );
};