"use client";

import { useState, useCallback } from "react";
import { Dialog } from "@/components/shared/Dialog";
import { FlowStateIndicator } from "../FlowStateIndicator";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { MarkdownEditor } from "@/components/shared/MarkdownEditor";
import { useFlowState } from "@/hooks/useFlowState";
import { InterruptionType } from "@/types/flow";
import styles from "./FlowManager.module.css";

export const FlowManager: React.FC = () => {
  const {
    flowState,
    metrics,
    startFlowSession,
    endFlowSession,
    recordInterruption,
  } = useFlowState();

  const [showInterruptionDialog, setShowInterruptionDialog] = useState(false);
  const [interruptionNote, setInterruptionNote] = useState("");
  const [selectedInterruption, setSelectedInterruption] =
    useState<InterruptionType | null>(null);

  const handleStartFlow = async () => {
    await startFlowSession();
  };

  const handleEndFlow = async () => {
    await endFlowSession();
  };

  const handleInterruptionSubmit = async () => {
    if (!selectedInterruption) return;

    await recordInterruption(
      selectedInterruption.label,
      selectedInterruption.estimatedRecoveryTime,
      interruptionNote
    );
    setShowInterruptionDialog(false);
    setInterruptionNote("");
    setSelectedInterruption(null);
  };

  const renderMetrics = useCallback(() => {
    return (
      <div className={styles.metricsContainer}>
        <div className={styles.metricCard}>
          <h3>Flow Score</h3>
          <ProgressBar
            progress={flowState.score}
            color={getFlowScoreColor(flowState.score)}
            size="large"
            showPercentage
          />
        </div>
        <div className={styles.metricCard}>
          <h3>Active Time</h3>
          <span>{Math.floor(metrics.activeTime)}m</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Focus Rate</h3>
          <span>{calculateFocusRate(metrics)}%</span>
        </div>
      </div>
    );
  }, [flowState.score, metrics]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <FlowStateIndicator
          flowState={flowState}
          metrics={metrics}
          onInterrupt={() => setShowInterruptionDialog(true)}
        />

        {renderMetrics()}

        <div className={styles.controls}>
          {flowState.status === "inactive" ? (
            <button className={styles.startButton} onClick={handleStartFlow}>
              Start Flow Session
            </button>
          ) : (
            <button className={styles.endButton} onClick={handleEndFlow}>
              End Flow Session
            </button>
          )}
        </div>
      </div>

      <Dialog
        open={showInterruptionDialog}
        onClose={() => setShowInterruptionDialog(false)}
        title="Record Interruption"
      >
        <div className={styles.interruptionForm}>
          <div className={styles.interruptionTypes}>
            {INTERRUPTION_TYPES.map((type) => (
              <button
                key={type.label}
                className={`${styles.interruptionType} ${
                  selectedInterruption?.label === type.label
                    ? styles.selected
                    : ""
                }`}
                onClick={() => setSelectedInterruption(type)}
                style={{ borderColor: getImpactColor(type.impactLevel) }}
              >
                <span>{type.label}</span>
                <small>{type.estimatedRecoveryTime}m recovery</small>
              </button>
            ))}
          </div>

          <MarkdownEditor
            initialValue={interruptionNote}
            onChange={setInterruptionNote}
            placeholder="Add notes about the interruption..."
          />

          <div className={styles.dialogActions}>
            <button
              className={styles.submitButton}
              onClick={handleInterruptionSubmit}
              disabled={!selectedInterruption}
            >
              Record Interruption
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const INTERRUPTION_TYPES: InterruptionType[] = [
  { label: "Quick Question", estimatedRecoveryTime: 5, impactLevel: "low" },
  { label: "Meeting", estimatedRecoveryTime: 15, impactLevel: "medium" },
  { label: "Technical Issue", estimatedRecoveryTime: 20, impactLevel: "high" },
  { label: "Emergency", estimatedRecoveryTime: 30, impactLevel: "high" },
];

const getFlowScoreColor = (score: number): string => {
  if (score >= 80) return "#4CAF50";
  if (score >= 60) return "#FFA726";
  return "#FF5252";
};

const calculateFocusRate = (metrics: ActivityMetrics): number => {
  const totalTime = metrics.activeTime + metrics.interruptedTime;
  return totalTime > 0
    ? Math.round((metrics.activeTime / totalTime) * 100)
    : 100;
};
