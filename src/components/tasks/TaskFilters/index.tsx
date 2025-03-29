import React from "react";
import styles from "./styles.module.css";
import { Task } from "../../../types/database";

export type SortOption = "priority" | "dueDate" | "status" | "createdAt";
export type FilterOption = "all" | "pending" | "in_progress" | "completed";

interface TaskFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onPriorityFilterChange: (priorities: Task["priority"][]) => void;
  currentSort: SortOption;
  currentFilter: FilterOption;
  selectedPriorities: Task["priority"][];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onSortChange,
  onFilterChange,
  onPriorityFilterChange,
  currentSort,
  currentFilter,
  selectedPriorities,
}) => {
  return (
    <div className={styles.filters}>
      <div className={styles.section}>
        <h3>Sort by</h3>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={styles.select}
        >
          <option value="createdAt">Date Created</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className={styles.section}>
        <h3>Status</h3>
        <div className={styles.statusFilters}>
          <button
            className={`${styles.filterButton} ${currentFilter === "all" ? styles.active : ""}`}
            onClick={() => onFilterChange("all")}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${currentFilter === "pending" ? styles.active : ""}`}
            onClick={() => onFilterChange("pending")}
          >
            To Do
          </button>
          <button
            className={`${styles.filterButton} ${currentFilter === "in_progress" ? styles.active : ""}`}
            onClick={() => onFilterChange("in_progress")}
          >
            In Progress
          </button>
          <button
            className={`${styles.filterButton} ${currentFilter === "completed" ? styles.active : ""}`}
            onClick={() => onFilterChange("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Priority</h3>
        <div className={styles.priorityFilters}>
          {["high", "medium", "low"].map((priority) => (
            <label key={priority} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedPriorities.includes(
                  priority as Task["priority"]
                )}
                onChange={(e) => {
                  const newPriorities = e.target.checked
                    ? [...selectedPriorities, priority as Task["priority"]]
                    : selectedPriorities.filter((p) => p !== priority);
                  onPriorityFilterChange(newPriorities);
                }}
              />
              <span className={`${styles.priority} ${styles[priority]}`}>
                {priority}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
