"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowContext } from "@/context/FlowContext";
import { useFlowTasks } from "@/hooks/useFlowTasks";
import TaskItem from "@/components/TaskItem";
import TaskCreate from "@/components/tasks/TaskCreate";
import styles from "./styles.module.css";

interface ActiveTasksProps {
  userId: string;
  teamId?: string;
}

export const ActiveTasks: React.FC<ActiveTasksProps> = ({ userId, teamId }) => {
  const { flowState } = useFlowContext();
  const {
    tasks,
    loading,
    error,
    activeTaskId,
    switchTask,
    completeTask,
    shouldTakeBreak,
  } = useFlowTasks({ userId, teamId });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.pulse} />
        <span>Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading tasks: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const showBreakSuggestion = shouldTakeBreak();
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className={styles.tasksContainer}>
      <TaskCreate userId={userId} teamId={teamId} />

      {showBreakSuggestion && (
        <motion.div
          className={styles.breakSuggestion}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Break Suggested</h3>
          <p>
            {flowState.activeTime > 90
              ? "You've been working for a while. Take a short break to maintain productivity."
              : "Your flow score indicates it's a good time for a break."}
          </p>
        </motion.div>
      )}

      <div className={styles.tasksList}>
        <AnimatePresence mode="popLayout">
          {activeTasks.length > 0 ? (
            <>
              <h2 className={styles.sectionTitle}>Active Tasks</h2>
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isActive={task.id === activeTaskId}
                  onSelect={switchTask}
                  onComplete={completeTask}
                />
              ))}
            </>
          ) : (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No active tasks. Create a new task to get started!</p>
            </motion.div>
          )}

          {completedTasks.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>Completed Tasks</h2>
              <div className={styles.completedTasks}>
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} isActive={false} />
                ))}
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {teamId && tasks.length > 0 && (
        <div className={styles.teamStats}>
          <h3>Team Progress</h3>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span>Active Tasks</span>
              <span>{activeTasks.length}</span>
            </div>
            <div className={styles.stat}>
              <span>Completed Today</span>
              <span>{completedTasks.length}</span>
            </div>
            <div className={styles.stat}>
              <span>Team Flow Score</span>
              <span>{Math.round(flowState.score)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveTasks;
