import React from "react";
import styles from "./FlowDashboard.module.css";
import { useFlowStore } from "../../../stores/flowStore";
import { FlowStateIndicator } from "../FlowStateIndicator";
import { FlowTrends } from "../FlowTrends";
import { TaskList } from "../TaskList";
import { TeamSyncOverview } from "../../team/TeamSyncOverview";
import { FlowMetrics } from "../FlowMetrics";

export const FlowDashboard: React.FC = () => {
  const { currentFlow, tasks, teamSync } = useFlowStore();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContent}>
        <section className={styles.flowSection}>
          <FlowStateIndicator />
          <FlowTrends data={currentFlow.history} />
        </section>

        <section className={styles.tasksSection}>
          <h3>Flow-Optimized Tasks</h3>
          <TaskList tasks={tasks} flowState={currentFlow.status} />
        </section>
      </div>

      <div className={styles.sideContent}>
        <TeamSyncOverview data={teamSync} />
        <FlowMetrics />
      </div>
    </div>
  );
};
