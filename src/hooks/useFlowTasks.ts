import { useState, useEffect, useCallback, useMemo } from "react";
import { useFlowState } from "./useFlowState";
import {
  TaskFlowService,
  CreateTaskInput, // snake_case from form
  TaskUpdateInput, // snake_case from form
  calculateContextSwitch,
  deleteTask as deleteTaskService,
} from "@/services/taskFlow";
// Internal Task type (camelCase)
import { Task } from "@/types/taskFlow";
// DB Task type (snake_case) + Status enum
import { Task as DbTask, TaskStatus as DbTaskStatus } from "@/types/database";
import { supabase } from "@/lib/supabaseClient";
import { FlowState } from "@/types/flow"; // This should be TypesFlowState used by the hook
import { FocusPreferences, Profile } from "../../types/database"; // Added missing imports based on usage

interface FlowTasksConfig {
  userId: string;
  teamId?: string;
}

// Defaults matching the *internal* camelCase Task type
const DEFAULT_TASK_VALUES: Required<
  Pick<
    Task,
    | "id"
    | "title"
    | "description"
    | "status"
    | "createdAt"
    | "userId"
    | "estimatedDuration"
    | "priority"
    | "flowOptimal"
    | "contextCost"
    | "completed"
    | "completionMetrics"
  >
> = {
  id: "",
  title: "",
  description: null,
  status: "active" as DbTaskStatus, // Use DB status type
  createdAt: "", // Use camelCase
  userId: "", // Use camelCase
  estimatedDuration: 30, // Use camelCase
  priority: 50,
  flowOptimal: false,
  contextCost: 0,
  completed: false,
  completionMetrics: { progress: 0 },
};

// Helper to map DbTask (snake_case) to internal Task (camelCase)
const mapDbTaskToInternalTask = (dbTask: DbTask): Task => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status,
    createdAt: dbTask.created_at,
    userId: dbTask.user_id,
    priority: dbTask.priority,
    flowOptimal: dbTask.flow_optimal,
    contextCost: dbTask.context_cost,
    completed: dbTask.completed,
    completionMetrics: dbTask.completion_metrics,
    estimatedDuration: dbTask.estimated_duration,
    // Optional fields
    teamId: dbTask.team_id,
    projectId: dbTask.project_id,
    dueDate: dbTask.due_date ?? undefined, // Handle null from DB
    // dependencies are not in DbTask, might need separate handling
  };
};

export function useFlowTasks({ userId, teamId }: FlowTasksConfig) {
  // State holds the internal Task[] (camelCase)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Added error state
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null); // State for active task
  const { flowState } = useFlowState(); // Returns TypesFlowState
  const taskService = useMemo(() => new TaskFlowService(userId), [userId]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      setError(null); // Clear error on new fetch
      // Assume service returns DbTask[]
      const fetchedDbTasks = await taskService.getUserTasks(teamId);
      // Map to internal Task[] before setting state
      setTasks(fetchedDbTasks.map(mapDbTaskToInternalTask));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setError(
        error instanceof Error ? error : new Error("Failed to fetch tasks")
      );
    } finally {
      setLoading(false);
    }
  }, [taskService, teamId]);

  // CREATE task using service instance method
  const createTask = useCallback(
    async (taskData: CreateTaskInput): Promise<Task> => {
      // taskData is snake_case
      try {
        setError(null); // Clear previous error
        // Construct DbTask structure for calculateContextSwitch
        const taskForCalc: DbTask = {
          id: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId,
          title: taskData.title,
          description: taskData.description ?? null,
          priority: taskData.priority ?? 50,
          flow_optimal: taskData.flow_optimal ?? false,
          context_cost: taskData.context_cost ?? 0,
          estimated_duration: taskData.estimated_duration,
          completed: false,
          team_id: taskData.team_id ?? null,
          project_id: taskData.project_id ?? null,
          due_date: taskData.due_date ?? null, // DB can be null
          status: (taskData.status as DbTaskStatus | undefined) ?? "active",
          completion_metrics: taskData.completion_metrics ?? { progress: 0 },
        };

        // flowState is TypesFlowState from useFlowState hook, which matches expected type
        const contextCost = calculateContextSwitch(
          null,
          taskForCalc, // Pass DbTask structure
          flowState // This flowState is from useFlowState hook (TypesFlowState)
        );

        const inputForService: CreateTaskInput = {
          ...taskData,
          context_cost: contextCost,
        };

        // Assume service.createTask returns a DbTask
        const newDbTask = await taskService.createTask(inputForService);
        const newTask = mapDbTaskToInternalTask(newDbTask); // Map to internal Task

        setTasks((prev) => [...prev, newTask]); // Update state with internal Task
        return newTask;
      } catch (error) {
        console.error("useFlowTasks: Error creating task:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to create task")
        );
        throw error;
      }
    },
    [taskService, flowState, userId]
  );

  // UPDATE task using service instance method
  const updateTask = useCallback(
    async (taskId: string, updates: TaskUpdateInput): Promise<Task> => {
      // updates is snake_case
      try {
        setError(null); // Clear previous error
        // Assume service returns updated DbTask
        const updatedDbTask = await taskService.updateTask(taskId, updates);
        const updatedTask = mapDbTaskToInternalTask(updatedDbTask); // Map to internal Task
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return updatedTask;
      } catch (error) {
        console.error("useFlowTasks: Error updating task:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to update task")
        );
        throw error;
      }
    },
    [taskService]
  );

  // DELETE task using the imported standalone service function
  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    try {
      setError(null); // Clear previous error
      await deleteTaskService(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("useFlowTasks: Error deleting task:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to delete task")
      );
      throw error;
    }
  }, []);

  // --- Active Task Management & Break Logic ---

  const switchTask = useCallback((taskId: string) => {
    setActiveTaskId(taskId);
    // Potentially log context switch cost here or trigger related logic
    console.log(`Switched active task to: ${taskId}`);
  }, []);

  // Complete task logic with UI revert on error
  const completeTask = useCallback(
    async (taskId: string) => {
      // Find the task to get its previous state for potential revert
      let previousTaskState: Task | undefined;
      setTasks((currentTasks) => {
        const newTasks = currentTasks.map((task) => {
          if (task.id === taskId) {
            previousTaskState = { ...task }; // Store previous state before optimistic update
            return {
              ...task,
              completed: true,
              status: "completed" as DbTaskStatus,
            };
          }
          return task;
        });
        return newTasks;
      });

      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      } // Deactivate task if it was the active one

      try {
        await taskService.updateTask(taskId, {
          completed: true,
          status: "completed",
        });
        console.log(`Task marked as complete: ${taskId}`);
      } catch (err) {
        console.error("Failed to mark task as complete on server", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to update task completion status")
        );

        // Revert UI change on error using the stored previous state
        if (previousTaskState) {
          const taskToRevert = previousTaskState; // Use captured state
          setTasks((currentTasks) =>
            currentTasks.map((task) =>
              task.id === taskId ? taskToRevert : task
            )
          );
          // Decide whether to restore active task ID
          // setActiveTaskId(taskId); // Example: Restore active state if needed
        }
      }
    },
    [taskService, activeTaskId]
  ); // activeTaskId added as dependency

  // Placeholder: Implement break suggestion logic
  const shouldTakeBreak = useCallback((): boolean => {
    // Constants for thresholds (could be configurable)
    const MAX_CONTINUOUS_WORK_MS = 90 * 60 * 1000; // 90 minutes in ms
    const MIN_FLOW_SCORE_THRESHOLD = 40; // Suggest break if flow drops below this
    const SIGNIFICANT_FLOW_DROP = 25; // Suggest break if flow drops by this much within session (requires historical tracking)

    if (flowState.activeTime > MAX_CONTINUOUS_WORK_MS) {
      console.log("Suggesting break: Exceeded max continuous work time.");
      return true;
    }

    if (flowState.score < MIN_FLOW_SCORE_THRESHOLD) {
      console.log("Suggesting break: Flow score below threshold.");
      return true;
    }

    // Advanced logic (placeholder): Check for significant flow drop within the session
    // This would require comparing current flowState.score with an initial or recent score.
    // Example: if (initialFlowScore - flowState.score > SIGNIFICANT_FLOW_DROP) return true;

    // Example: Check if fatigue indicator is high (if tracked in flowState)
    // if (flowState.fatigueLevel > 0.8) return true;

    return false; // Default to no break needed
  }, [flowState.activeTime, flowState.score]); // Dependencies: update if more state is used

  // Effect to fetch initial tasks and subscribe
  useEffect(() => {
    if (userId) {
      fetchTasks();

      let subscription: any = null;
      setError(null); // Clear error before subscribing
      try {
        // Subscribe should trigger fetchTasks which handles mapping
        subscription = taskService.subscribeToTaskUpdates(teamId, fetchTasks);
        console.log("Task subscription setup successfully.");
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Subscription failed")
        );
        console.error("Failed to subscribe to task updates:", error);
      }

      return () => {
        if (subscription && typeof subscription.unsubscribe === "function") {
          console.log("Unsubscribing from task updates.");
          subscription.unsubscribe();
        } else {
          console.warn(
            "Attempted to unsubscribe from invalid task subscription."
          );
        }
      };
    } else {
      setLoading(false);
      setTasks([]);
      setError(null); // Clear error if userId becomes invalid
    }
  }, [userId, teamId, fetchTasks, taskService]);

  return {
    tasks, // This is Task[] (camelCase)
    loading,
    createTask,
    error, // Added error state to return object
    updateTask,
    activeTaskId, // Added active task ID
    switchTask,
    completeTask, // Added function to complete task
    deleteTask,
    refreshTasks: fetchTasks,
    shouldTakeBreak, // Added break suggestion logic
  };
}
