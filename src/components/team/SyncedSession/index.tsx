'use client';

import React, { useEffect, useState } from 'react';
import { TeamSync } from '../../../types/teamSync';
import { TeamMemberStatus } from '../../../types/flow';
import { Avatar } from '../../shared/Avatar';
import { FlowScore } from '../../flow/FlowScore';
import type { FlowScoreSize, FlowScoreProps, FlowScoreBaseProps } from '../../flow/FlowScore/FlowScore.types';
import { getColorStateFromScore, getFlowStateFromScore, getColorClass } from '../../flow/FlowScore/utils';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import styles from './styles.module.css';

interface SyncedSessionProps {
  sync: TeamSync;
  currentUserId: string;
  onStatusUpdate?: (status: TeamMemberStatus) => void;
}

export function SyncedSession({ sync, currentUserId, onStatusUpdate }: SyncedSessionProps) {
  const [localSync, setLocalSync] = useState<TeamSync>(sync);

  useEffect(() => {
    setLocalSync(sync);
  }, [sync]);

  if (!localSync) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    );
  }

  const currentUser = localSync.participants.find(p => p.user_id === currentUserId);
  const otherParticipants = localSync.participants.filter(p => p.user_id !== currentUserId);
  const teamScore = localSync.metrics.average_flow_score;

  const teamFlowScore: FlowScoreProps = {
    score: teamScore,
    colorState: getColorStateFromScore(teamScore),
    flowState: getFlowStateFromScore(teamScore),
    label: 'Team Flow',
    size: 'small',
    showLabel: true,
    className: styles.teamScore
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Flow Session</h2>
        <div className={styles.metrics}>
          <FlowScore {...teamFlowScore} />
          <div className={styles.duration}>
            {formatDuration(
              new Date(localSync.start_time).getTime() - new Date().getTime()
            )}
          </div>
        </div>
      </div>

      <div className={styles.participants}>
        {currentUser && (
          <ParticipantCard
            participant={currentUser}
            isCurrentUser
            onStatusUpdate={onStatusUpdate}
          />
        )}

        {otherParticipants.map(participant => (
          <ParticipantCard
            key={participant.user_id}
            participant={participant}
            isCurrentUser={false}
          />
        ))}
      </div>
    </div>
  );
}

interface ParticipantCardProps {
  participant: TeamMemberStatus;
  isCurrentUser: boolean;
  onStatusUpdate?: (status: TeamMemberStatus) => void;
}

function ParticipantCard({ participant, isCurrentUser, onStatusUpdate }: ParticipantCardProps) {
  const score = participant.flowState.score;
  const colorState = getColorStateFromScore(score);
  const flowState = getFlowStateFromScore(score);

  const flowScoreProps: FlowScoreProps = {
    score,
    colorState,
    flowState,
    size: 'tiny',
    showLabel: false,
    className: styles.participantScore
  };

  return (
    <div className={styles.participantCard}>
      <div className={styles.participantHeader}>
        <Avatar
          src={participant.user.avatar_url}
          alt={participant.user.name}
          size={32}
        />
        <div className={styles.participantInfo}>
          <div className={styles.participantName}>
            {participant.user.name}
            {isCurrentUser && <span className={styles.you}>(You)</span>}
          </div>
          <div className={styles.flowStatus}>
            <div
              className={styles.statusDot}
              style={{ 
                backgroundColor: getColorClass(colorState)
              }}
            />
            {participant.status.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className={styles.metrics}>
        <FlowScore {...flowScoreProps} />
        <div className={styles.focusMetrics}>
          <span>Focus Time: {formatDuration(participant.flowState.focus_duration * 1000)}</span>
          <span>Interruptions: {participant.flowState.interruption_count}</span>
        </div>
      </div>
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}

export default SyncedSession;