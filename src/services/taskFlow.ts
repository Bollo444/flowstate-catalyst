import { FlowState } from "@/types/flow";
import { supabase } from "@/lib/supabaseClient";
// Import Task and TaskStatus from the single source of truth
import { Task, TaskStatus as DatabaseTaskStatus, Json } from "@/types/database";

const CONTEXT_SWITCH_THRESHOLD = 0.5;

// Use TaskStatus from database types
export type TaskStatus = DatabaseTaskStatus;

// --- Define types specific to this service/feature ---

export interface TaskMetrics {
  // For logging/updating metrics subset
  lastUpdate?: string;
  lastNote?: string;
  progress?: number;
  flowScore?: number;
  completionTime?: number;
  // Add other relevant metrics derived during flow
}

export interface CompletionMetrics {
  // Structure matching DB Task's completion_metrics JSONB
  flowScore?: number;
  completionTime?: number | null; // Allow null if not completed
  progress?: number;
  lastNote?: string;
  lastUpdate?: string;
  // Add any other fields stored in the jsonb column
}

export interface CreateTaskInput {
  // Input for creating a new task
  title: string;
  description?: string | null;
  priority?: number;
  flow_optimal?: boolean;
  context_cost?: number;
  estimated_duration: number; // Required
  user_id: string;
  team_id?: string | null;
  project_id?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
  completion_metrics?: Partial<CompletionMetrics>; // Allow setting initial metrics
}

export interface TaskUpdateInput {
  // Input specifically for the update function
  title?: string;
  description?: string | null;
  priority?: number;
  flow_optimal?: boolean;
  context_cost?: number;
  estimated_duration?: number;
  completed?: boolean;
  team_id?: string | null;
  project_id?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
  completion_metrics?: Partial<CompletionMetrics>; // Allow partial updates to metrics
}

interface TaskContext {
  // Context for priority calculations
  previousTaskId?: string;
  currentFlowState: FlowState;
  activeTaskTime: number;
  taskSwitches: number;
}

// Corrected default task values, aligning with DB Task type
export const DEFAULT_TASK_VALUES: Partial<Task> = {
  priority: 50,
  flow_optimal: false,
  context_cost: 0,
  completed: false,
  status: "active", // Use 'active' from the DB enum
  completion_metrics: {
    // Default structure for the jsonb field
    progress: 0, // Include progress here if managed within metrics
  },
  // dependencies removed as it's not in DB schema Task type
};

// --- Standalone Utility Functions (Exported) ---

/**
 * Calculate context switch impact between tasks
 */
export function calculateContextSwitch(
  currentTask: Task | null | undefined,
  nextTask: Task,
  flowState: FlowState
): number {
  if (!currentTask) return 0;
  const sameProject = currentTask.project_id === nextTask.project_id;
  const cost = sameProject ? 0.1 : 0.4;
  const flowFactor = 1 + (50 - flowState.score) / 50;
  return Math.min(1, Math.max(0, cost * flowFactor));
}

/**
 * Suggest optimal break timing based on flow state
 */
export function suggestBreak(flowState: FlowState): boolean {
  return (
    flowState.activeTime > 90 ||
    flowState.score < 40 ||
    flowState.status === "rest"
  );
}

/**
 * Get task completion probability based on current state
 */
export function predictTaskSuccess(task: Task, flowState: FlowState): number {
  const baseScore = flowState.score / 100;
  // Use || 30 as fallback for estimated_duration
  const timeFactor = Math.min(
    1,
    (90 - flowState.activeTime) / (task.estimated_duration || 30)
  );
  const contextPenalty = (task.context_cost || 0) * CONTEXT_SWITCH_THRESHOLD;
  return Math.max(
    0,
    Math.min(1, baseScore * timeFactor * (1 - contextPenalty))
  );
}

/**
 * Delete a task by ID
 */
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

/**
 * Get a task by ID - Helper function
 */
async function getTaskById(taskId: string): Promise<Task | null> {
  const { data: task, error } = await supabase
    .from("tasks")
    .select(`*`)
    .eq("id", taskId)
    .single();
  if (error) {
    console.error("Error getting task:", error);
    return null;
  }
  return task as Task | null;
}

// --- TaskFlowService Class ---

export class TaskFlowService {
  private static readonly CONTEXT_SWITCH_THRESHOLD = 0.3;
  private static readonly FLOW_OPTIMAL_BONUS = 20;
  private static readonly TASK_SWITCH_PENALTY = 15;

  constructor(private userId: string) {}

  // Instance method for user-specific task fetching
  async getUserTasks(teamId?: string): Promise<Task[]> {
    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", this.userId)
      .in("status", ["active", "completed", "archived"]);

    if (teamId) {
      query = query.eq("team_id", teamId);
    }
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching user tasks:", error);
      return [];
    }
    return (data as Task[]) || [];
  }

  // Instance method for creating task (uses userId)
  async createTask(input: CreateTaskInput): Promise<Task> {
    const taskData = {
      ...DEFAULT_TASK_VALUES,
      ...input,
      status: input.status || "active", // Default to active
      user_id: this.userId, // Set user ID from instance
      // Ensure correct mapping and null handling if needed
      priority: input.priority ?? DEFAULT_TASK_VALUES.priority,
      flow_optimal: input.flowOptimal ?? DEFAULT_TASK_VALUES.flow_optimal,
      context_cost: input.context_cost ?? DEFAULT_TASK_VALUES.context_cost,
      estimated_duration: input.estimated_duration,
    };
    // Clean object before insert
    Object.keys(taskData).forEach(
      (key) =>
        (taskData as any)[key] === undefined && delete (taskData as any)[key]
    );

    const { data, error } = await supabase
      .from("tasks")
      .insert(taskData as Partial<Task>)
      .select()
      .single();

    if (error) {
      console.error("Error in TaskFlowService.createTask:", error);
      throw error;
    }
    if (!data) {
      throw new Error("Task creation returned no data.");
    }
    return data as Task;
  }

  /**
   * Update task metrics, storing them in completion_metrics JSONB column.
   * Made instance method to potentially use this.userId later if needed for RLS.
   */
  async updateTaskFlowMetrics(
    taskId: string,
    update: Partial<TaskMetrics>
  ): Promise<void> {
    const task = await getTaskById(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);

    const estimatedDuration = task.estimated_duration ?? 0;
    const currentMetrics = (task.completion_metrics || {}) as CompletionMetrics; // Use CompletionMetrics type

    // Determine flowOptimal based on update and existing task data
    const flowOptimal =
      (update.flowScore ?? currentMetrics.flowScore ?? 0) >= 70 &&
      (update.completionTime ?? currentMetrics.completionTime ?? Infinity) <=
        estimatedDuration;

    const newCompletionMetrics: CompletionMetrics = {
      // Build the complete metrics object
      ...currentMetrics,
      flowScore: update.flowScore ?? currentMetrics.flowScore,
      completionTime: update.completionTime ?? currentMetrics.completionTime,
      progress: update.progress ?? currentMetrics.progress,
      lastNote: update.lastNote ?? currentMetrics.lastNote,
      lastUpdate: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("tasks")
      .update({
        flow_optimal: flowOptimal,
        completion_metrics: newCompletionMetrics, // Update the single JSONB field
      })
      .eq("id", taskId);

    if (error) {
      console.error(`Failed to update task metrics for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Update a task, handling completion_metrics separately. Instance method.
   */
  async updateTask(
    taskId: string,
    update: TaskUpdateInput // Use the specific input type
  ): Promise<Task> {
    const { completion_metrics, ...taskUpdate } = update;

    if (Object.keys(taskUpdate).length > 0) {
      const { error: taskUpdateError } = await supabase
        .from("tasks")
        .update(taskUpdate as Partial<Task>) // Cast as Partial<DB Task>
        .eq("id", taskId);
      if (taskUpdateError) {
        console.error(
          `Failed to update task fields for ${taskId}:`,
          taskUpdateError
        );
        throw taskUpdateError;
      }
    }

    if (completion_metrics) {
      // Cast metrics to Partial<TaskMetrics> expected by updateTaskFlowMetrics
      await this.updateTaskFlowMetrics(
        taskId,
        completion_metrics as Partial<TaskMetrics>
      );
    }

    const updatedTask = await getTaskById(taskId);
    if (!updatedTask)
      throw new Error(`Failed to refetch updated task ${taskId}`);
    return updatedTask;
  }

  // Instance method for subscription
  subscribeToTaskUpdates(
    teamId: string | undefined,
    callback: () => void
  ): any {
    const channel = supabase.channel(`public:tasks:user=${this.userId}`);
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${this.userId}`,
        },
        (payload) => {
          console.log("Task change received!", payload);
          callback();
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED")
          console.log("Subscribed to task updates for user:", this.userId);
        if (status === "CHANNEL_ERROR")
          console.error("Task subscription error:", err);
        if (status === "TIMED_OUT")
          console.warn("Task subscription timed out.");
      });
    return channel;
  }

  // --- Static Methods --- (Moved from outside, verify if they should be static)

  static calculateTaskPriority(task: Task, context: TaskContext): number {
    let priority = task.priority;
    if (context.currentFlowState.status === "peak")
      priority += this.FLOW_OPTIMAL_BONUS;
    else if (context.currentFlowState.status === "rest") priority -= 10;
    if (
      context.previousTaskId &&
      (task.context_cost ?? 0) > this.CONTEXT_SWITCH_THRESHOLD
    ) {
      priority -= this.TASK_SWITCH_PENALTY * (task.context_cost ?? 0);
    }
    const flowTimeRemaining = Math.max(90 - context.activeTaskTime, 0);
    if ((task.estimated_duration ?? 30) > flowTimeRemaining) priority -= 15;
    return Math.max(0, Math.min(100, priority));
  }

  static async getOptimalTasks(
    userId: string,
    flowState: FlowState
  ): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`*`)
      .eq("user_id", userId)
      .eq("status", "active")
      .order("priority", { ascending: false });
    if (error) throw error;
    const context: TaskContext = {
      currentFlowState: flowState,
      activeTaskTime: flowState.activeTime,
      taskSwitches: 0,
    };
    return tasks
      ? tasks
          .map((task) => ({
            ...task,
            priority: this.calculateTaskPriority(task as Task, context),
          }))
          .sort((a, b) => b.priority - a.priority)
      : [];
  }

  // Expose standalone functions via static properties if needed
  static calculateContextSwitch = calculateContextSwitch;
  static suggestBreak = suggestBreak;
  static predictTaskSuccess = predictTaskSuccess;
} // End of TaskFlowService class
