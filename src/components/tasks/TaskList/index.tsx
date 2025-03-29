import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "../../../types/database";
import { FlowStatus } from "../../../stores/flowStore";
import { TaskCard } from "../TaskCard";
import { TaskFilters } from "../TaskFilters";
import { TaskSearch, TaskSearchFilters } from "../TaskSearch";
import { BatchActionsBar } from "../BatchActionsBar";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { ErrorDisplay } from "../../shared/ErrorDisplay";
import { TaskSelectionProvider } from "../../../context/TaskSelectionContext";
import { useTasks } from "../../../hooks/useTasks";
import { useLoadingState } from "../../../hooks/useLoadingState";
import styles from "./TaskList.module.css";

interface TaskListProps {
  projectId: string;
  flowState: FlowStatus;
}

export const TaskList: React.FC<TaskListProps> = ({ projectId, flowState }) => {
  const { getTasks } = useTasks();
  const { isLoading, error, setError, startLoading, stopLoading, resetState } =
    useLoadingState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchFilters, setSearchFilters] = useState<TaskSearchFilters>({
    query: "",
  });

  const loadTasks = React.useCallback(
    async (filters?: TaskSearchFilters) => {
      startLoading();
      try {
        const data = await getTasks(projectId, filters);
        setTasks(data);
      } catch (err) {
        setError({
          code: "TASKS_LOAD_ERROR",
          message: "Failed to load tasks",
          details: err,
        });
      } finally {
        stopLoading();
      }
    },
    [projectId, getTasks, startLoading, stopLoading, setError]
  );

  React.useEffect(() => {
    loadTasks(searchFilters);
  }, [loadTasks, searchFilters]);

  const handleSearch = (newFilters: TaskSearchFilters) => {
    setSearchFilters(newFilters);
  };

  if (isLoading && !tasks.length) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" message="Loading tasks..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => {
          resetState();
          loadTasks(searchFilters);
        }}
      />
    );
  }

  return (
    <TaskSelectionProvider>
      <div className={styles.taskListContainer}>
        <TaskSearch onSearch={handleSearch} initialFilters={searchFilters} />

        <div className={styles.taskList}>
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.emptyState}
              >
                {searchFilters.query ? (
                  <p>No tasks match your search criteria</p>
                ) : (
                  <p>No tasks found in this project</p>
                )}
              </motion.div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard
                    task={task}
                    flowContext={flowState}
                    onUpdate={() => loadTasks(searchFilters)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <BatchActionsBar tasks={tasks} />
      </div>
    </TaskSelectionProvider>
  );
};
