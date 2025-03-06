import React, { useState } from 'react';
import { useFlowState } from '../../../hooks/useFlowState';
import { FlowStateIndicator } from '../FlowStateIndicator';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import styles from './styles.module.css';

interface InterruptionType {
  id: string;
  label: string;
  description: string;
  impactLevel: 'low' | 'medium' | 'high';
  estimatedRecoveryTime: number;
}

const INTERRUPTION_TYPES: InterruptionType[] = [
  {
    id: 'meeting',
    label: 'Meeting',
    description: 'Scheduled or impromptu meetings',
    impactLevel: 'high',
    estimatedRecoveryTime: 30
  },
  {
    id: 'chat',
    label: 'Chat/Message',
    description: 'Slack, email, or other messages',
    impactLevel: 'low',
    estimatedRecoveryTime: 5
  },
  {
    id: 'break',
    label: 'Break',
    description: 'Personal break or pause',
    impactLevel: 'medium',
    estimatedRecoveryTime: 15
  },
  {
    id: 'emergency',
    label: 'Emergency',
    description: 'Urgent issues requiring immediate attention',
    impactLevel: 'high',
    estimatedRecoveryTime: 45
  }
];

export const FlowManager: React.FC = () => {
  const {
    flowState,
    metrics,
    startFlowSession,
    endFlowSession,
    recordInterruption
  } = useFlowState();

  const [showInterruptionDialog, setShowInterruptionDialog] = useState(false);
  const [interruptionNote, setInterruptionNote] = useState('');
  const [selectedInterruption, setSelectedInterruption] = useState<InterruptionType | null>(null);

  const handleStartFlow = async () => {
    await startFlowSession();
  };

  const handleEndFlow = async () => {
    await endFlowSession();
  };

  const handleInterruptionSubmit = async () => {
    if (!selectedInterruption) return;

    await recordInterruption(selectedInterruption.label, selectedInterruption.estimatedRecoveryTime);
    setShowInterruptionDialog(false);
    setInterruptionNote('');
    setSelectedInterruption(null);
  };

  const getImpactColor = (level: InterruptionType['impactLevel']) => {
    switch (level) {
      case 'high':
        return '#FF4C4C';
      case 'medium':
        return '#FFAA4C';
      case 'low':
        return '#4CAF50';
      default:
        return '#808080';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <FlowStateIndicator
          flowState={flowState}
          metrics={metrics}
          onInterrupt={() => setShowInterruptionDialog(true)}
        />

        <div className={styles.controls}>
          {flowState.status === 'inactive' ? (
            <button 
              className={styles.startButton}
              onClick={handleStartFlow}
            >
              Start Flow Session
            </button>
          ) : (
            <button
              className={styles.endButton}
              onClick={handleEndFlow}
            >
              End Flow Session
            </button>
          )}
        </div>
      </div>

      <Dialog
        open={showInterruptionDialog}
        onClose={() => setShowInterruptionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={styles.dialogTitle}>
          Record Interruption
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <div className={styles.interruptionTypes}>
            {INTERRUPTION_TYPES.map(type => (
              <button
                key={type.id}
                className={`${styles.interruptionType} ${
                  selectedInterruption?.id === type.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedInterruption(type)}
                style={{
                  '--impact-color': getImpactColor(type.impactLevel)
                } as React.CSSProperties}
              >
                <div className={styles.typeHeader}>
                  <span className={styles.typeLabel}>{type.label}</span>
                  <span className={styles.impactBadge}>
                    {type.impactLevel.charAt(0).toUpperCase() + type.impactLevel.slice(1)} Impact
                  </span>
                </div>
                <p className={styles.typeDescription}>{type.description}</p>
                <div className={styles.recoveryTime}>
                  ~{type.estimatedRecoveryTime}min recovery
                </div>
              </button>
            ))}
          </div>

          <textarea
            className={styles.noteInput}
            value={interruptionNote}
            onChange={(e) => setInterruptionNote(e.target.value)}
            placeholder="Add any notes about this interruption..."
            rows={3}
          />

          <div className={styles.dialogActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setShowInterruptionDialog(false)}
            >
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleInterruptionSubmit}
              disabled={!selectedInterruption}
            >
              Record Interruption
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};