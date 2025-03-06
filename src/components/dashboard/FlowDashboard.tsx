// src/components/dashboard/FlowDashboard.tsx

import React, { useState, useEffect } from 'react';
import { FlowScore } from '../flow/FlowScore';
import ActiveTasks from '../core/ActiveTasks';
import TeamSync from '../team/TeamSync';
import styles from './FlowDashboard.module.css';
import FlowStateIndicator from '../flow/FlowStateIndicator'; // Import FlowStateIndicator component
import QuickActions from './QuickActions'; // Import QuickActions component
import TeamPresence from '../core/FlowInterface/TeamPresence'; // Ensure correct path to TeamPresence
import FlowNavigation from '../core/FlowInterface/FlowNavigation';
import FlowContent from '../core/FlowInterface/FlowContent';
import FlowHeader from '../core/FlowInterface/FlowHeader';
import FlowWorkspace from '../core/FlowInterface/FlowWorkspace';

interface FlowState {
  score: number;
  status: 'peak' | 'flow' | 'rest' | 'building';
  activeTime: number;
}

export const FlowDashboard: React.FC = () => {
  const [flowState, setFlowState] = useState<FlowState>({
    score: 87,
    status: 'flow',
    activeTime: 0
  });

  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <FlowHeader>
        <div className={styles.flowScore}>
          <FlowStateIndicator />
        </div>
        <div className={styles.quickActions}>
          <QuickActions />
        </div>
        <TeamPresence />
      </FlowHeader>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left Column - Active Flow */}
        <section className={styles.activeFlow}>
          <h2>Current Flow</h2>
          <ActiveTasks 
            filterByFlowState={flowState.status}
          />
        </section>

        {/* Right Column - Team & Metrics */}
        <section className={styles.teamMetrics}>
          <TeamSync />
          {/* Removed FlowMetrics placeholder */}
        </section>
      </div>
    </div>
  );
};

export default FlowDashboard;