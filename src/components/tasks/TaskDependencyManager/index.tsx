import React, { useState } from "react";
import { Task } from "../../../types/database";
import { useTasks } from "../../../hooks/useTasks";
import styles from "./styles.module.css";

interface TaskDependencyManagerProps {
  task: Task;
  projectTasks: Task[];
  onUpdate: () => void;
}

export const TaskDependencyManager: React.FC<TaskDependencyManagerProps> = ({
  task,
  projectTasks,
  onUpdate,
}) => {
  const { updateTask } = useTasks();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const availableTasks = projectTasks.filter(
    (t) =>
      t.id !== task.id && // Can't depend on itself
      !task.dependencies?.includes(t.id) && // Not already a dependency
      t.status !== "completed" // Don't show completed tasks
  );

  const dependentTasks = projectTasks.filter((t) =>
    task.dependencies?.includes(t.id)
  );

  const handleAddDependency = async (dependencyId: string) => {
    setIsUpdating(true);
    try {
      const newDependencies = [...(task.dependencies || []), dependencyId];
      await updateTask(task.id, {
        dependencies: newDependencies,
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to add dependency:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveDependency = async (dependencyId: string) => {
    setIsUpdating(true);
    try {
      const newDependencies = task.dependencies?.filter(
        (id) => id !== dependencyId
      );
      await updateTask(task.id, {
        dependencies: newDependencies?.length ? newDependencies : null,
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to remove dependency:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getDependencyStatus = (dependencyTask: Task) => {
    return dependencyTask.status === "completed" ? "complete" : "pending";
  };

  return (
    <div className={styles.manager}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={isUpdating}
      >
        Dependencies ({dependentTasks.length})
        <svg
          className={`${styles.arrow} ${isExpanded ? styles.expanded : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className={styles.content}>
          {dependentTasks.length > 0 ? (
            <ul className={styles.dependencyList}>
              {dependentTasks.map((depTask) => (
                <li
                  key={depTask.id}
                  className={`${styles.dependency} ${styles[getDependencyStatus(depTask)]}`}
                >
                  <span className={styles.title}>{depTask.title}</span>
                  <button
                    onClick={() => handleRemoveDependency(depTask.id)}
                    className={styles.removeButton}
                    disabled={isUpdating}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>No dependencies</p>
          )}

          {availableTasks.length > 0 && (
            <div className={styles.addSection}>
              <select
                onChange={(e) => handleAddDependency(e.target.value)}
                className={styles.select}
                disabled={isUpdating}
                value=""
              >
                <option value="" disabled>
                  Add dependency...
                </option>
                {availableTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
