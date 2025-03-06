// src/components/core/FlowInterface/FlowTabs.tsx
import React from 'react';
import styles from './FlowInterface.module.css'; // Correct path

interface FlowTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FlowTabs: React.FC<FlowTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.flowTabs}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
        onClick={() => onTabChange('overview')}
      >
        Overview
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'tasks' ? styles.activeTab : ''}`}
        onClick={() => onTabChange('tasks')}
      >
        Tasks
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'metrics' ? styles.activeTab : ''}`}
        onClick={() => onTabChange('metrics')}
      >
        Metrics
      </button>
    </div>
  );
};

export default FlowTabs;