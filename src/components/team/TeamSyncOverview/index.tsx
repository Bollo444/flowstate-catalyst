import React, { useState, useCallback, useMemo } from 'react';
import { useTeamSync, TeamMemberStatus } from '../../../hooks/useTeamSync';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { ErrorDisplay } from '../../shared/ErrorDisplay';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import styles from './styles.module.css';

interface TeamSyncOverviewProps {
  teamId: string;
}

export const TeamSyncOverview: React.FC<TeamSyncOverviewProps> = ({ teamId }) => {
  const {
    teamMembers,
    activeSyncs,
    loading,
    error,
    startTeamSync,
    checkTeamAvailability,
    getOptimalSyncTimes
  } = useTeamSync(teamId);

  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [syncDuration, setSyncDuration] = useState(60); // minutes

  const getStatusColor = useCallback((status: TeamMemberStatus['status']) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'focusing':
        return '#4A9EFF';
      case 'busy':
        return '#FF4C4C';
      case 'away':
        return '#FFAA4C';
      default:
        return '#808080';
    }
  }, []);

  const getFlowIndicator = (member: TeamMemberStatus) => {
    if (member.status !== 'focusing') return null;

    return (
      <div 
        className={styles.flowIndicator}
        title={`Flow Score: ${member.flowState.score}`}
      >
        <div 
          className={styles.flowBar}
          style={{ width: `${member.flowState.score}%` }}
        />
        <span className={styles.flowScore}>
          {Math.round(member.flowState.score)}
        </span>
      </div>
    );
  };

  const optimalTimeRanges = useMemo(() => {
    if (selectedMembers.length === 0) return [];
    return getOptimalSyncTimes(selectedMembers).filter(
      range => range.duration >= syncDuration / 60
    );
  }, [selectedMembers, syncDuration, getOptimalSyncTimes]);

  const handleStartSync = async () => {
    try {
      const availability = checkTeamAvailability(selectedMembers);
      if (!availability.available) {
        alert('Not all selected members are currently available');
        return;
      }

      await startTeamSync(selectedMembers);
      setShowSyncDialog(false);
      setSelectedMembers([]);
    } catch (error) {
      console.error('Failed to start team sync:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={{
          code: error.code || 'TEAM_SYNC_ERROR',
          message: error.message || 'Failed to load team sync data',
          details: error,
          retry: () => {
            // Add retry logic here
          }
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Team Flow Status</h2>
        <button
          className={styles.syncButton}
          onClick={() => setShowSyncDialog(true)}
        >
          Start Team Sync
        </button>
      </div>

      <div className={styles.memberGrid}>
        {teamMembers.map(member => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.avatar}>
              {member.user.avatar_url ? (
                <img src={member.user.avatar_url} alt={member.user.full_name || ''} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {(member.user.full_name || member.user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div 
                className={styles.statusIndicator}
                style={{ backgroundColor: getStatusColor(member.status) }}
              />
            </div>

            <div className={styles.memberInfo}>
              <h3>{member.user.full_name || member.user.email}</h3>
              <div className={styles.status}>
                <span className={styles.statusText}>{member.status}</span>
                {member.currentActivity && (
                  <span className={styles.activity}>{member.currentActivity}</span>
                )}
              </div>
              {getFlowIndicator(member)}
            </div>
          </div>
        ))}
      </div>

      {activeSyncs.length > 0 && (
        <div className={styles.activeSyncs}>
          <h3>Active Sync Sessions</h3>
          {activeSyncs.map(sync => (
            <div key={sync.id} className={styles.syncSession}>
              <div className={styles.sessionInfo}>
                <span className={styles.participants}>
                  {teamMembers
                    .filter(m => sync.participants.includes(m.user.id))
                    .map(m => m.user.full_name || m.user.email)
                    .join(', ')}
                </span>
                <span className={styles.duration}>
                  Started {new Date(sync.start_time).toLocaleTimeString()}
                </span>
              </div>
              <div className={styles.focusScore}>
                Flow Score: {sync.focus_score}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={showSyncDialog}
        onClose={() => setShowSyncDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Start Team Sync Session</DialogTitle>
        <DialogContent>
          <div className={styles.syncForm}>
            <div className={styles.memberSelection}>
              <h4>Select Team Members</h4>
              <div className={styles.memberList}>
                {teamMembers.map(member => (
                  <label key={member.id} className={styles.memberCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.user.id)}
                      onChange={(e) => {
                        setSelectedMembers(prev =>
                          e.target.checked
                            ? [...prev, member.user.id]
                            : prev.filter(id => id !== member.user.id)
                        );
                      }}
                    />
                    <span className={styles.memberName}>
                      {member.user.full_name || member.user.email}
                    </span>
                    <span
                      className={styles.memberStatus}
                      style={{ backgroundColor: getStatusColor(member.status) }}
                    >
                      {member.status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.syncSettings}>
              <h4>Session Settings</h4>
              <div className={styles.durationSelect}>
                <label>Duration:</label>
                <select
                  value={syncDuration}
                  onChange={(e) => setSyncDuration(Number(e.target.value))}
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {selectedMembers.length > 0 && (
                <div className={styles.optimalTimes}>
                  <h4>Optimal Time Slots</h4>
                  <div className={styles.timeSlots}>
                    {optimalTimeRanges.map((range, index) => (
                      <div key={index} className={styles.timeSlot}>
                        {range.start}:00 - {range.end}:00
                        ({range.duration} hours)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.syncActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowSyncDialog(false)}
              >
                Cancel
              </button>
              <button
                className={styles.startButton}
                onClick={handleStartSync}
                disabled={selectedMembers.length === 0}
              >
                Start Sync Session
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};