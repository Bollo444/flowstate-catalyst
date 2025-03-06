// src/components/dashboard/QuickActions.tsx
import React from 'react';
import styles from './QuickActions.module.css';
import TeamSyncButton from '../core/FlowInterface/TeamPresence';

interface QuickActionsProps {
  onActionComplete: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionComplete }) => {
  const startFlowSession = () => {
    // Placeholder function
    alert('Start Flow Session action');
    onActionComplete?.(); // Example of calling the callback
  };

  const toggleFocusMode = () => {
    // Placeholder function
    alert('Focus Mode Toggled');
    onActionComplete?.(); // Example of calling the callback
  };

  const scheduleTeamSync = () => {
    // Placeholder function
    alert('Schedule Team Sync action');
    onActionComplete?.(); // Example of calling the callback
  };

  const exportTeamMetrics = () => {
    // Placeholder function
    alert('Export Metrics action');
    onActionComplete?.(); // Example of calling the callback
  };

  return (
    <div className={styles.quickActions}>
      <h3>Quick Actions</h3>
      <div className={styles.actionButtons}>
        <button onClick={startFlowSession}>
          Start Flow Session ⚡
        </button>
        <button onClick={toggleFocusMode}>
          Focus Mode 🎯
        </button>
        <button onClick={scheduleTeamSync}>
          Schedule Team Sync
        </button>
        <button onClick={exportTeamMetrics}>
          Export Metrics
        </button>
      </div>
    </div>
  );
};

export default QuickActions;