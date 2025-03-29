import React, { useState } from "react";
import { SearchInput } from "../../shared/SearchInput";
import { ProgressBar } from "../../shared/ProgressBar";
import { Task } from "../../../types/database";
import styles from "./styles.module.css";

interface TaskSearchProps {
  onSearch: (filters: TaskSearchFilters) => void;
  initialFilters?: TaskSearchFilters;
}

export interface TaskSearchFilters {
  query: string;
  status?: Task["status"];
  priority?: Task["priority"];
  dateRange?: {
    start: string;
    end: string;
  };
  assignee?: string;
  progressRange?: {
    min: number;
    max: number;
  };
}

export const TaskSearch: React.FC<TaskSearchProps> = ({
  onSearch,
  initialFilters = { query: "" },
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<TaskSearchFilters>(initialFilters);

  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, query };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleStatusChange = (status: Task["status"] | "") => {
    const newFilters = {
      ...filters,
      status: status || undefined,
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handlePriorityChange = (priority: Task["priority"] | "") => {
    const newFilters = {
      ...filters,
      priority: priority || undefined,
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    const dateRange = filters.dateRange || { start: "", end: "" };
    const newDateRange = {
      ...dateRange,
      [type]: value,
    };

    const newFilters = {
      ...filters,
      dateRange:
        newDateRange.start || newDateRange.end ? newDateRange : undefined,
    };

    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleProgressRangeChange = (value: number, type: "min" | "max") => {
    const currentRange = filters.progressRange || { min: 0, max: 100 };
    const newRange = {
      ...currentRange,
      [type]: value,
    };

    // Ensure min doesn't exceed max and vice versa
    if (type === "min" && value > currentRange.max) {
      newRange.min = currentRange.max;
    }
    if (type === "max" && value < currentRange.min) {
      newRange.max = currentRange.min;
    }

    const newFilters = {
      ...filters,
      progressRange: newRange,
    };

    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className={styles.taskSearch}>
      <div className={styles.mainSearch}>
        <SearchInput
          onSearch={handleSearchChange}
          placeholder="Search tasks..."
          initialValue={filters.query}
        />
        <button
          className={styles.advancedButton}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showAdvanced && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterGroup}>
            <label>Status</label>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                handleStatusChange(e.target.value as Task["status"] | "")
              }
            >
              <option value="">All Status</option>
              <option value="pending">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Priority</label>
            <select
              value={filters.priority || ""}
              onChange={(e) =>
                handlePriorityChange(e.target.value as Task["priority"] | "")
              }
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Date Range</label>
            <div className={styles.dateInputs}>
              <input
                type="date"
                value={filters.dateRange?.start || ""}
                onChange={(e) => handleDateRangeChange("start", e.target.value)}
                placeholder="Start date"
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateRange?.end || ""}
                onChange={(e) => handleDateRangeChange("end", e.target.value)}
                placeholder="End date"
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Progress Range</label>
            <div className={styles.progressRange}>
              <div className={styles.rangeControl}>
                <span>Min:</span>
                <ProgressBar
                  progress={filters.progressRange?.min || 0}
                  onChange={(value) => handleProgressRangeChange(value, "min")}
                  interactive
                  size="small"
                  showPercentage
                  color="#FFAA4C"
                />
              </div>
              <div className={styles.rangeControl}>
                <span>Max:</span>
                <ProgressBar
                  progress={filters.progressRange?.max || 100}
                  onChange={(value) => handleProgressRangeChange(value, "max")}
                  interactive
                  size="small"
                  showPercentage
                  color="#4CAF50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
