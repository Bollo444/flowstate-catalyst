import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './TeamSyncButton.module.css';
import { useFlowStore } from '../../../stores/flowStore';
import { LoadingSpinner } from '../../shared/LoadingSpinner';

export const TeamSyncButton: React.FC = () => {
  const { teamSync, startTeamSync } = useFlowStore();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await startTeamSync();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <motion.button
      className={`${styles.syncButton} ${teamSync.active ? styles.active : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSync}
      disabled={syncing}
    >
      <div className={styles.syncContent}>
        {syncing ? (
          <span className={styles.syncing}>
            Syncing... <LoadingSpinner size="small" />
          </span>
        ) : (
          <>
            <span className={styles.syncIcon}>🌊</span>
            <span>
              {teamSync.active ? 'In Sync' : 'Start Team Sync'}
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
};