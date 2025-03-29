"use client";

import { useEffect } from "react";
import { useTaskRouting } from "../../context/TaskRoutingContext";
import { useFlowContext } from "../../context/FlowContext";
import { TaskFlow } from "../../components/flow/TaskFlow";
import { LoadingBoundary } from "../../components/shared/LoadingBoundary";
import { ErrorBoundary } from "../../components/shared/ErrorBoundary";
import { ErrorDisplay } from "../../components/shared/ErrorDisplay";
import styles from "./styles.module.css";

interface FlowStatsCardProps {
  flowState: {
    score: number;
    intensity: number;
    status: string;
  };
  routingResult: any;
  onStartNextTask: () => void;
  hasNextTask: boolean;
}

function FlowStatsCard({
  flowState,
  routingResult,
  onStartNextTask,
  hasNextTask,
}: FlowStatsCardProps) {
  return (
    <div className={styles.statsCard}>
      <h2 className={styles.statsTitle}>Flow Stats</h2>
      {flowState && (
        <>
          <div className={styles.stat}>
            <label>Current Flow Score</label>
            <div className={styles.value}>{flowState.score}%</div>
          </div>

          <div className={styles.stat}>
            <label>Flow Intensity</label>
            <div className={`${styles.value} ${styles.intensity}`}>
              {flowState.intensity}%
            </div>
          </div>

          {routingResult && (
            <div className={styles.stat}>
              <label>Task Alignment</label>
              <div className={`${styles.value} ${styles.alignment}`}>
                {Math.round(routingResult.routingFactors.flowAlignment * 100)}%
              </div>
            </div>
          )}
        </>
      )}

      {hasNextTask && (
        <button
          onClick={onStartNextTask}
          className={styles.actionButton}
          data-testid="start-next-task"
        >
          Start Next Task
        </button>
      )}
    </div>
  );
}

export default function FlowManager() {
  const {
    routingResult,
    currentSequence,
    isRouting,
    error,
    routeTasks,
    startNextTask,
    setError,
  } = useTaskRouting();

  const { flowState } = useFlowContext();

  useEffect(() => {
    if (flowState && routingResult?.routingFactors.flowAlignment) {
      const currentAlignment = routingResult.routingFactors.flowAlignment * 100;
      const alignmentDiff = Math.abs(flowState.score - currentAlignment);

      // Re-route tasks if flow state has significantly changed
      if (alignmentDiff > 20) {
        routeTasks(currentSequence);
      }
    }
  }, [
    flowState?.score,
    routingResult?.routingFactors.flowAlignment,
    routeTasks,
    currentSequence,
  ]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorDisplay error={error} />
        <button
          onClick={() => {
            setError(null);
            routeTasks(currentSequence);
          }}
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className={styles.container}>
        <LoadingBoundary
          isLoading={isRouting}
          loadingMessage="Optimizing your flow state..."
          testId="flow-manager"
        >
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Flow-Optimized Tasks</h1>
              <p className={styles.description}>
                Tasks are automatically organized based on your current flow
                state and optimal work patterns.
              </p>
            </div>

            <div className={styles.grid}>
              <div className={styles.mainContent}>
                <TaskFlow />
              </div>

              <aside className={styles.sidebar}>
                {flowState && (
                  <FlowStatsCard
                    flowState={flowState}
                    routingResult={routingResult}
                    onStartNextTask={startNextTask}
                    hasNextTask={currentSequence.length > 0}
                  />
                )}
              </aside>
            </div>
          </div>
        </LoadingBoundary>
      </main>
    </ErrorBoundary>
  );
}
