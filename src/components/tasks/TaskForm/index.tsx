"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/services/taskFlow";
import { useFlowContext } from "@/context/FlowContext";
import { TaskFlowService } from "@/services/taskFlow";
import { Clock, AlertCircle, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import styles from "./styles.module.css";

// Priority ranges: 0-33 = low, 34-66 = medium, 67-100 = high
const PRIORITY_RANGES = {
  low: 25,
  medium: 50,
  high: 75,
} as const;

type PriorityLevel = keyof typeof PRIORITY_RANGES;

interface TaskFormProps {
  projectId: string;
  userId: string;
  teamId?: string;
  initialData?: Partial<Task>;
  onSubmit: (taskData: Partial<Task>) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  projectId,
  userId,
  teamId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>(
    initialData?.priority
      ? initialData.priority > 66
        ? "high"
        : initialData.priority > 33
          ? "medium"
          : "low"
      : "medium"
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration || 30
  );
  const [isFlowOptimal, setIsFlowOptimal] = useState(
    initialData?.flowOptimal || false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { flowState } = useFlowContext();
  const { toast } = useToast();

  const [contextCost, setContextCost] = useState(0);
  const [flowAdvice, setFlowAdvice] = useState<{
    message: string;
    type: "success" | "warning" | "info";
  }>({ message: "", type: "info" });

  useEffect(() => {
    const cost = TaskFlowService.calculateContextSwitch("", title, flowState);
    setContextCost(cost);

    if (flowState.status === "peak") {
      setFlowAdvice({
        message: "Great time to tackle this task! Flow state is optimal.",
        type: "success",
      });
    } else if (flowState.status === "flow") {
      setFlowAdvice({
        message: "Good flow state for task execution.",
        type: "info",
      });
    } else if (cost > 0.3) {
      setFlowAdvice({
        message: "High context switch cost. Consider similar tasks first.",
        type: "warning",
      });
    }
  }, [title, flowState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const taskData: Partial<Task> = {
        title,
        description,
        priority: PRIORITY_RANGES[priorityLevel],
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        estimatedDuration,
        flowOptimal: isFlowOptimal,
        contextCost,
        userId,
        teamId,
        status: "active",
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(taskData);
      toast({
        title: initialData ? "Task updated" : "Task created",
        description: "The task has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {flowAdvice.message && (
        <div className={`${styles.flowAdvice} ${styles[flowAdvice.type]}`}>
          <AlertCircle className={styles.icon} />
          <span>{flowAdvice.message}</span>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          className={styles.textarea}
          rows={3}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="estimatedDuration">
            <Clock className={styles.icon} />
            Duration (minutes)
          </label>
          <input
            id="estimatedDuration"
            type="number"
            min={5}
            max={180}
            step={5}
            value={String(estimatedDuration)}
            onChange={(e) =>
              setEstimatedDuration(parseInt(e.target.value, 10) || 30)
            }
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priorityLevel}
            onChange={(e) => setPriorityLevel(e.target.value as PriorityLevel)}
            className={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.flowSettings}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isFlowOptimal}
            onChange={(e) => setIsFlowOptimal(e.target.checked)}
          />
          <Zap className={styles.icon} />
          <span>Optimize for flow state</span>
        </label>
        {contextCost > 0.3 && (
          <span className={styles.contextWarning}>
            High context switch cost: {Math.round(contextCost * 100)}%
          </span>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className={styles.submitButton}
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Task"
              : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
