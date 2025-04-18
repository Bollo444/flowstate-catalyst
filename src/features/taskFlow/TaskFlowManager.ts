import { supabase } from "../../lib/supabaseClient";
// Import Task, TeamMemberStatus and DB FlowState
import {
  Task,
  TeamMemberStatus,
  FlowStatus, // Needed for FlowStateDb.status type check below
  FlowState as DbFlowState, // Alias DB state
  Profile, // Import Profile type if used within TeamMemberStatus joins
  FocusPreferences, // Import FocusPreferences type if used within TeamMemberStatus joins
} from "../../types/database";
import {
  TaskFlowMetrics,
  TaskUpdate,
  TaskFlowSession,
  TaskPriorityScore,
  TaskAssignmentMatch,
} from "../../types/taskFlow";

interface TaskWithPriority {
  task: Task;
  priority: TaskPriorityScore;
}

interface TaskPriorityFactors {
  urgency: number;
  importance: number;
  flowAlignment: number;
  complexity: number;
}

interface DependencyAnalysis {
  blockedBy: string[];
  blocking: string[];
  criticalPath: boolean;
}

/**
 * Predicts the likelihood of successfully completing a task given the current flow state.
 * @param task The task to predict success for.
 * @param flowStateDb The user's current database flow state (from flow_states table) or null.
 * @returns A prediction score between 0.1 and 0.95.
 */
function predictTaskSuccess(
  task: Task,
  flowStateDb: DbFlowState | null
): number {
  if (!flowStateDb) {
    // If no flow state available, return a neutral prediction
    console.warn(
      "predictTaskSuccess: No flow state available, returning neutral prediction."
    );
    return 0.5;
  }

  // Normalize flow score (0-1)
  const normalizedFlowScore = flowStateDb.score / 100;

  // Simplified complexity estimation (0-1) - based on description length and maybe priority
  const descriptionLengthFactor = Math.min(
    (task.description?.length || 0) / 500, // Normalize over 500 chars
    1
  );
  // Lower priority tasks might be slightly less likely to be completed successfully in flow?
  const priorityFactor = (100 - task.priority) / 100;
  const estimatedComplexity = Math.min(
    descriptionLengthFactor * 0.6 + priorityFactor * 0.1, // Reduced weight for priority
    1
  );

  // Base success rate adjusted by flow
  let successRate = 0.6 + normalizedFlowScore * 0.3; // More impact from flow score

  // Adjust based on complexity (higher complexity reduces success more significantly)
  successRate -= estimatedComplexity * 0.3;

  // Clamp the result between 0.1 (minimum chance) and 0.95 (maximum chance)
  const finalRate = Math.max(0.1, Math.min(successRate, 0.95));
  // console.log(`predictTaskSuccess for Task ${task.id}: Flow=${normalizedFlowScore.toFixed(2)}, Complexity=${estimatedComplexity.toFixed(2)}, Rate=${finalRate.toFixed(2)}`);
  return finalRate;
}

export class TaskFlowManager {
  private taskPriorityCache: Map<string, TaskPriorityScore> = new Map();
  private readonly OPTIMAL_SESSION_LENGTH = 90; // minutes

  constructor(private userId: string) {}

  /**
   * Calculate task priority based on multiple factors
   */
  async calculateTaskPriority(
    task: Task,
    userFlowState: TeamMemberStatus // This is the DB type, potentially with joined data
  ): Promise<TaskPriorityScore> {
    const cacheKey = `${task.id}-${this.userId}`;
    if (this.taskPriorityCache.has(cacheKey)) {
      return this.taskPriorityCache.get(cacheKey)!;
    }

    const factors: TaskPriorityFactors = {
      urgency: this.calculateUrgency(task),
      importance: task.priority / 100, // Normalize priority
      flowAlignment: this.calculateFlowAlignment(task, userFlowState),
      complexity: this.estimateComplexity(task),
    };

    // Weighted sum
    const score =
      factors.urgency * 0.4 +
      factors.importance * 0.2 +
      factors.flowAlignment * 0.3 +
      (1 - factors.complexity) * 0.1; // Less penalty for complexity here as it's separate
    const priorityScore = {
      score: Math.min(Math.max(score, 0), 1) * 100, // Scale to 0-100
      factors,
    };

    this.taskPriorityCache.set(cacheKey, priorityScore);
    return priorityScore;
  }

  async planWorkSession(
    duration: number = this.OPTIMAL_SESSION_LENGTH,
    userFlowState: TeamMemberStatus // Pass the DB type
  ): Promise<Task[]> {
    const tasks = await this.getAvailableTasks();
    if (!tasks.length) return [];

    // Fetch current flow state separately to ensure it's up-to-date
    const { data: currentFlowStateDb, error: flowStateError } = await supabase
      .from("flow_states")
      .select("*")
      .eq("user_id", this.userId)
      .maybeSingle(); // Use maybeSingle to handle non-existent state gracefully

    if (flowStateError && flowStateError.code !== "PGRST116") {
      // Ignore if no state exists yet ('PGRST116': No rows found)
      console.error(
        "Error fetching current flow state for planning:",
        flowStateError
      );
    }

    const taskPriorities = await this.calculateTaskPriorities(
      tasks,
      userFlowState // Pass full TeamMemberStatus here as it might contain joined data used elsewhere
    );

    // Pass fetched state (which might be null if error or no row)
    return this.optimizeTaskSequence(
      taskPriorities,
      duration,
      currentFlowStateDb // Can be null
    );
  }

  private async getAvailableTasks(): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", this.userId)
      .in("status", ["active"]); // Filter for active tasks

    if (error) {
      console.error("Error fetching available tasks:", error);
      return [];
    }
    // Explicitly cast to Task[] or return empty array
    return (tasks as Task[] | null) ?? [];
  }

  private async calculateTaskPriorities(
    tasks: Task[],
    userFlowState: TeamMemberStatus
  ): Promise<TaskWithPriority[]> {
    // Use Promise.all to calculate priorities concurrently
    const priorities = await Promise.all(
      tasks.map((task) => this.calculateTaskPriority(task, userFlowState))
    );
    // Combine tasks with their calculated priorities
    return tasks.map((task, index) => ({
      task,
      priority: priorities[index],
    }));
  }

  // Updated to accept DbFlowState | null
  private optimizeTaskSequence(
    taskPriorities: TaskWithPriority[],
    duration: number,
    currentFlowStateDb: DbFlowState | null // Use DB type, allow null
  ): Task[] {
    let remainingTime = duration;
    const sequence: Task[] = [];
    // Sort tasks by calculated priority score (descending)
    const sortedTasks = [...taskPriorities].sort(
      (a, b) => b.priority.score - a.priority.score
    );

    for (const { task } of sortedTasks) {
      const taskDuration = this.estimateTaskDuration(task); // Use estimated or calculated duration
      if (remainingTime < taskDuration) continue; // Skip if not enough time

      // Predict success based on current flow state (can be null)
      const predictedSuccess = predictTaskSuccess(task, currentFlowStateDb);

      // Add task to sequence if predicted success is above threshold
      if (predictedSuccess >= 0.6) {
        // Example threshold
        sequence.push(task);
        remainingTime -= taskDuration;
        if (remainingTime <= 0) break; // Stop if time runs out
      }
    }

    return sequence;
  }

  private calculateUrgency(task: Task): number {
    if (!task.due_date) return 0.5; // Neutral if no due date

    const now = new Date();
    const due = new Date(task.due_date);
    // Ensure due date is valid before calculating difference
    if (isNaN(due.getTime())) return 0.5;

    const daysUntilDue =
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilDue < 0) return 1; // Overdue
    if (daysUntilDue < 1) return 0.9; // Due today
    if (daysUntilDue < 3) return 0.7; // Due within 3 days
    if (daysUntilDue < 7) return 0.5; // Due within a week
    return 0.3; // Due later
  }

  // Note: userState might need casting if flowState/focusPreferences are optional joined props
  private calculateFlowAlignment(
    task: Task,
    userState: TeamMemberStatus // Requires potentially joined data
  ): number {
    // Cast to access joined properties, assuming they might exist
    const stateWithDetails = userState as any;
    // Prefer joined flow_state if available
    const flowStateDb = stateWithDetails.flowState as DbFlowState | null;
    const flowScore = (flowStateDb?.score ?? 50) / 100; // Default to 50 if no state

    // Prefer joined focusPreferences if available
    const focusPrefs =
      stateWithDetails.focusPreferences as FocusPreferences | null;
    const preferredHours = focusPrefs?.preferredFocusHours ?? []; // Default to empty array
    const isOptimalTime = preferredHours.includes(new Date().getHours());

    const complexity = this.estimateComplexity(task);
    // Alignment: higher flow aligns better with higher complexity
    const complexityAlignment =
      flowScore * complexity + (1 - flowScore) * (1 - complexity);

    // Weighted average: Give flow score and optimal time higher importance
    return Math.min(
      Math.max(
        // Clamp between 0 and 1
        flowScore * 0.5 + (isOptimalTime ? 0.3 : 0) + complexityAlignment * 0.2,
        0
      ),
      1
    );
  }

  private estimateComplexity(task: Task): number {
    // Normalize factors to be between 0 and 1 before applying weights
    const descriptionLengthFactor = Math.min(
      (task.description?.length || 0) / 1000, // Normalize over 1000 chars
      1
    );
    // Placeholder for dependency factor - requires DB changes or assumptions
    const dependencyCountFactor = 0; // Assume 0 until dependencies are tracked
    // Estimate progress factor from completion_metrics if available
    let progressFactor = 0;
    // Safely access potentially nested property, assume number or null
    const metrics = task.completion_metrics as {
      progress?: number | null;
    } | null;
    if (metrics && typeof metrics.progress === "number") {
      progressFactor = Math.min(Math.max(metrics.progress / 100, 0), 1);
    }

    // Complexity increases with description length and dependencies, decreases with progress
    return Math.min(
      descriptionLengthFactor * 0.4 +
        dependencyCountFactor * 0.4 + // Assign weight even if 0 for future
        (1 - progressFactor) * 0.2, // Higher progress reduces complexity contribution
      1
    );
  }

  private async analyzeDependencies(task: Task): Promise<DependencyAnalysis> {
    // Placeholder implementation
    console.warn(
      "analyzeDependencies: Not implemented. Requires 'dependencies' field/table."
    );
    return { blockedBy: [], blocking: [], criticalPath: false };
    // Original logic requires a 'dependencies' field on the Task type/table
  }

  private estimateTaskDuration(task: Task): number {
    // Use provided estimate if available and valid
    if (
      typeof task.estimated_duration === "number" &&
      task.estimated_duration > 0
    ) {
      return task.estimated_duration;
    }
    // Otherwise, estimate based on complexity
    const complexity = this.estimateComplexity(task);
    const baseTime = 15; // Base time in minutes for simplest task
    // Duration increases with complexity, e.g., up to 2 hours for max complexity
    return Math.round(baseTime + complexity * (120 - baseTime));
  }

  /**
   * Suggest optimal task assignments based on team flow states
   */
  async suggestTaskAssignments(
    tasks: Task[],
    teamMembers: TeamMemberStatus[] // Accepts array of DB status type
  ): Promise<TaskAssignmentMatch[]> {
    const assignments: TaskAssignmentMatch[] = [];

    for (const task of tasks) {
      if (!teamMembers || teamMembers.length === 0) continue; // Skip if no members

      const memberScores = await Promise.all(
        teamMembers.map(async (member) => {
          // Assume user details and flow state might be joined onto TeamMemberStatus
          const memberWithDetails = member as any; // Cast for potential joined data
          const currentFlowState =
            memberWithDetails.flowState as DbFlowState | null; // Use DB state type

          const flowAlignment = this.calculateFlowAlignment(task, member); // Pass the potentially joined member status
          const workloadScore = await this.assessWorkload(member.user_id); // 1 = low load/available
          const expertiseScore = await this.assessExpertise(
            member.user_id,
            task
          );

          // Weighted average for assignment suitability
          const overallScore =
            flowAlignment * 0.4 +
            workloadScore * 0.3 + // Use availability score directly (1=available)
            expertiseScore * 0.3;

          return {
            userId: member.user_id,
            score: Math.min(Math.max(overallScore, 0), 1) * 100, // Normalized 0-100
            flowScore: currentFlowState?.score ?? 0, // Use joined flow score or default
            workloadScore: workloadScore, // Represents availability (1 = free)
            expertiseScore: expertiseScore,
            reasons: this.generateAssignmentReasons(
              flowAlignment,
              workloadScore, // Pass availability score
              expertiseScore
            ),
          };
        })
      );

      // Find best match
      if (memberScores.length > 0) {
        const bestMatch = memberScores.reduce((best, current) =>
          (current.score ?? 0) > (best.score ?? 0) ? current : best
        );
        assignments.push({ taskId: task.id, ...bestMatch });
      }
    }
    // Optionally sort assignments by best score first
    assignments.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return assignments;
  }

  /**
   * Update task status based on flow session outcomes
   */
  async updateTaskFlowStatus(session: TaskFlowSession): Promise<void> {
    try {
      console.log(
        "updateTaskFlowStatus: Updating 'completion_metrics' with session flow data."
      );

      // Prepare updates for all tasks in the session
      const updatePromises = (session.tasks ?? []).map(async (taskId) => {
        // Fetch current metrics first to merge
        const { data: currentTask, error: fetchError } = await supabase
          .from("tasks")
          .select("completion_metrics")
          .eq("id", taskId)
          .eq("user_id", this.userId) // Ensure user owns task
          .maybeSingle(); // Use maybeSingle to handle task not found gracefully

        if (fetchError && fetchError.code !== "PGRST116") {
          // Ignore "not found" errors if task was deleted mid-session
          console.error(
            `Failed to fetch task ${taskId} metrics before update:`,
            fetchError
          );
          return null; // Indicate failure for this task
        }

        // Ensure existingMetrics is an object, safely handling null/undefined
        const existingMetrics =
          (currentTask?.completion_metrics as Record<string, any>) ?? {};

        const flowMetricsData = {
          focus_duration: this.calculateFocusDuration(session),
          interruptions: session.interruptions,
          completion_time: session.end_time
            ? (new Date(session.end_time).getTime() -
                new Date(session.start_time).getTime()) /
              1000 // seconds
            : null,
          flow_score: session.flow_score,
          productivity_score: this.calculateProductivityScore(session),
          last_session_updated_at: new Date().toISOString(), // Add timestamp
        };

        // Merge new metrics under a 'flowMetrics' key
        const updatedCompletionMetrics = {
          ...existingMetrics,
          flowMetrics: flowMetricsData,
        };

        return supabase
          .from("tasks")
          .update({
            completion_metrics: updatedCompletionMetrics,
            // Optionally update task status if needed
            // status: session.completed_tasks?.includes(taskId) ? 'completed' : 'active',
            updated_at: new Date().toISOString(),
          })
          .eq("id", taskId)
          .eq("user_id", this.userId); // Ensure user owns the task being updated
      });

      const results = await Promise.all(
        updatePromises.filter((p) => p !== null) // Filter out null promises from fetch failures
      );

      results.forEach((result) => {
        if (result && result.error) {
          // Log errors but don't necessarily throw to allow other tasks to update
          console.error(
            "Partial failure during updateTaskFlowStatus update:",
            result.error
          );
        }
      });
    } catch (error) {
      console.error("Failed to update task flow status:", error);
      // Consider re-throwing or specific error handling
    }
  }

  private async assessWorkload(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true }) // Efficient count
        .eq("user_id", userId)
        .in("status", ["active"]); // Use valid TaskStatus values

      if (error) throw error;

      const activeTaskCount = count ?? 0;
      // Score represents availability: 1 = low load, 0 = high load
      const loadFactor = Math.min(activeTaskCount / 5, 1); // Example: load maxes out at 5 tasks
      return 1 - loadFactor; // Inverted: Higher score means more available
    } catch (error) {
      console.error("Failed to assess workload:", error);
      return 0.5; // Default neutral score on error
    }
  }

  private async assessExpertise(userId: string, task: Task): Promise<number> {
    try {
      // Search for similar completed tasks by the user based on title keywords
      const keywords = task.title
        .split(" ")
        .filter((k) => k.length > 2) // Filter short words
        .slice(0, 3); // Use first few meaningful words

      if (keywords.length === 0) return 0.5; // Neutral score if no keywords

      let query = supabase
        .from("tasks")
        .select("completion_metrics") // Only select needed data
        .eq("user_id", userId)
        .eq("status", "completed");

      // Build OR condition for keywords for broader matching
      const keywordConditions = keywords
        .map((keyword) => `title.ilike.%${keyword}%`) // Use case-insensitive LIKE
        .join(","); // Join conditions with OR logic

      query = query.or(keywordConditions);

      const { data: completedSimilar, error } = await query.limit(10); // Limit results

      if (error) throw error;
      if (!completedSimilar?.length) return 0.5; // Neutral score if no similar tasks found

      // Assess quality/efficiency of past similar tasks based on completion_metrics
      const successfulTasks = completedSimilar.filter((t) => {
        // Safely access nested properties
        const metrics = t.completion_metrics as Record<string, any> | null; // Let TS infer
        const flowMetrics = metrics?.flowMetrics as Record<string, any> | null;
        if (!flowMetrics) return false; // Need flowMetrics data
        // Define "successful": e.g., few interruptions
        const interruptionsOk = (flowMetrics.interruptions ?? 10) < 3; // Example threshold
        return interruptionsOk; // Add more criteria if needed
      });

      // Expertise score based on the proportion of successfully completed similar tasks
      return successfulTasks.length / completedSimilar.length;
    } catch (error) {
      console.error("Failed to assess expertise:", error);
      return 0.5; // Default neutral score on error
    }
  }

  private calculateFocusDuration(session: TaskFlowSession): number {
    if (!session.end_time) return 0; // Session hasn't ended

    const totalDurationMs =
      new Date(session.end_time).getTime() -
      new Date(session.start_time).getTime();
    const totalDurationMin = totalDurationMs / (1000 * 60);

    // Assume average interruption takes 5 mins - adjust based on actual recovery time if available
    const interruptionTime = (session.interruptions || 0) * 5; // Placeholder
    return Math.max(0, totalDurationMin - interruptionTime);
  }

  private calculateProductivityScore(session: TaskFlowSession): number {
    if (!session.tasks || session.tasks.length === 0) return 0;

    const completionRatio =
      (session.completed_tasks?.length || 0) / session.tasks.length;

    const totalDurationMin = session.end_time
      ? (new Date(session.end_time).getTime() -
          new Date(session.start_time).getTime()) /
        (1000 * 60)
      : this.OPTIMAL_SESSION_LENGTH; // Use default if session not ended

    const focusDuration = this.calculateFocusDuration(session);
    // Avoid division by zero if totalDuration is somehow 0
    const focusRatio =
      totalDurationMin > 0
        ? Math.max(0, Math.min(focusDuration / totalDurationMin, 1))
        : 0;

    // Weighted score: 60% completion, 40% focus quality
    return Math.round((completionRatio * 0.6 + focusRatio * 0.4) * 100);
  }

  private generateAssignmentReasons(
    flowAlignment: number,
    availabilityScore: number, // Renamed from workloadScore for clarity
    expertiseScore: number
  ): string[] {
    const reasons: string[] = [];

    if (flowAlignment > 0.7) reasons.push("High flow alignment");
    if (availabilityScore > 0.8) {
      reasons.push("Low current workload"); // High score = available
    } else if (availabilityScore < 0.3) {
      reasons.push("High current workload");
    }
    if (expertiseScore > 0.7) {
      reasons.push("Strong expertise in similar tasks");
    }
    if (reasons.length === 0) reasons.push("Balanced assignment factors"); // Default reason

    return reasons;
  }
} // End of TaskFlowManager class
