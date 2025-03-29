import { supabase } from "../../lib/supabaseClient";
// Ensure TeamMemberStatus is exported from database types, or import from appropriate source
// Assuming TeamMemberStatus includes flowState and focusPreferences
import { Task, TeamMemberStatus } from "../../types/database";
import {
  TaskFlowMetrics,
  TaskUpdate,
  TaskFlowSession,
  TaskPriorityScore,
  TaskAssignmentMatch,
} from "../../types/taskFlow"; // Removed OptimalTaskWindow as it seems not exported

// Define interface outside the class if potentially used elsewhere
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

// Placeholder for predictTaskSuccess function (should be defined or imported properly)
function predictTaskSuccess(task: Task, flowState: any): number {
  console.warn("predictTaskSuccess: Placeholder implementation used");
  return 0.8; // Always return high success for now
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
    userFlowState: TeamMemberStatus
  ): Promise<TaskPriorityScore> {
    const cacheKey = `${task.id}-${this.userId}`; // Unique key for cache
    if (this.taskPriorityCache.has(cacheKey)) {
      return this.taskPriorityCache.get(cacheKey)!; // Return cached value if available
    }

    const factors: TaskPriorityFactors = {
      urgency: this.calculateUrgency(task),
      // Correcting comparison: Assuming task.priority is number based on database.ts
      importance: task.priority >= 67 ? 1 : task.priority >= 34 ? 0.6 : 0.3,
      flowAlignment: this.calculateFlowAlignment(task, userFlowState),
      complexity: this.estimateComplexity(task),
    };

    // Simple weighted sum for now, adjust weights as needed
    const score =
      factors.urgency * 0.3 +
      factors.importance * 0.3 +
      factors.flowAlignment * 0.2 +
      (1 - factors.complexity) * 0.2;
    const priorityScore = {
      score: Math.min(Math.max(score, 0), 1) * 100,
      factors,
    }; // Scale to 0-100

    this.taskPriorityCache.set(cacheKey, priorityScore); // Store in cache
    return priorityScore;
  }

  async planWorkSession(
    duration: number = this.OPTIMAL_SESSION_LENGTH,
    userFlowState: TeamMemberStatus
  ): Promise<Task[]> {
    const tasks = await this.getAvailableTasks();
    const taskPriorities = await this.calculateTaskPriorities(
      tasks,
      userFlowState
    );

    return this.optimizeTaskSequence(taskPriorities, duration, userFlowState);
  }

  private async getAvailableTasks(): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", this.userId) // Corrected column name? Check RLS setup. Assuming user_id exists.
      .in("status", ["active"]); // Corrected status values based on TaskStatus type

    if (error) {
      console.error("Error fetching available tasks:", error);
      return [];
    }
    return tasks || [];
  }

  private async calculateTaskPriorities(
    tasks: Task[],
    userFlowState: TeamMemberStatus
  ): Promise<TaskWithPriority[]> {
    return Promise.all(
      tasks.map(async (task) => ({
        task,
        priority: await this.calculateTaskPriority(task, userFlowState),
      }))
    );
  }

  private optimizeTaskSequence(
    taskPriorities: TaskWithPriority[],
    duration: number,
    userFlowState: TeamMemberStatus
  ): Task[] {
    let remainingTime = duration;
    const sequence: Task[] = [];
    const sortedTasks = [...taskPriorities].sort(
      (a, b) => b.priority.score - a.priority.score
    );

    for (const { task } of sortedTasks) {
      // Use estimated_duration, provide default if null/undefined
      const taskDuration = task.estimated_duration ?? 30;
      if (remainingTime < taskDuration) continue;

      // Placeholder usage - assumes flowState is part of TeamMemberStatus
      // Ensure flowState exists on userFlowState before accessing score
      const currentFlowState = userFlowState.flowState;
      const predictedSuccess = predictTaskSuccess(task, currentFlowState);
      if (predictedSuccess > 0.7) {
        sequence.push(task);
        remainingTime -= taskDuration;
      }
    }

    return sequence;
  }

  // --- Moved Methods ---

  private calculateUrgency(task: Task): number {
    if (!task.due_date) return 0.5;

    const now = new Date();
    const due = new Date(task.due_date);
    const daysUntilDue =
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilDue < 0) return 1; // Overdue
    if (daysUntilDue < 1) return 0.9; // Due today
    if (daysUntilDue < 3) return 0.7; // Due within 3 days
    if (daysUntilDue < 7) return 0.5; // Due within a week
    return 0.3; // Due later
  }

  private calculateFlowAlignment(
    task: Task,
    userState: TeamMemberStatus
  ): number {
    // Assuming flowState structure within TeamMemberStatus, adjust if different
    const flowScore = (userState.flowState?.score ?? 50) / 100;
    // Assuming focusPreferences structure within TeamMemberStatus, adjust if different
    const isOptimalTime =
      userState.focusPreferences?.preferredFocusHours.includes(
        new Date().getHours()
      ) ?? false;

    const complexity = this.estimateComplexity(task);
    const complexityAlignment =
      flowScore >= 0.7
        ? complexity // High flow = good for complex tasks
        : 1 - complexity; // Low flow = better for simple tasks

    // Weighted average
    return (
      flowScore * 0.4 + (isOptimalTime ? 0.3 : 0) + complexityAlignment * 0.3
    );
  }

  private estimateComplexity(task: Task): number {
    // Normalize factors to be between 0 and 1-ish before applying weights
    const descriptionLengthFactor = Math.min(
      (task.description?.length || 0) / 1000,
      1
    ); // Cap at 1000 chars influence
    // 'dependencies' does not exist on Task type derived from DB schema
    const dependencyCountFactor = 0;
    // 'progress' does not exist on Task type derived from DB schema
    const progressFactor = 0;

    // Weighted sum, adjust weights as needed
    return Math.min(
      descriptionLengthFactor * 0.3 +
        dependencyCountFactor * 0.4 +
        progressFactor * 0.3,
      1 // Ensure complexity score doesn't exceed 1
    );
  }

  private async analyzeDependencies(task: Task): Promise<DependencyAnalysis> {
    // 'dependencies' does not exist on Task type derived from DB schema
    console.warn(
      "analyzeDependencies: 'dependencies' property missing on Task type. Returning empty analysis."
    );
    return {
      blockedBy: [],
      blocking: [],
      criticalPath: false,
    };
    /* 
    // Original logic commented out due to missing 'dependencies' property
    if (!task.dependencies?.length) return {
      blockedBy: [],
      blocking: [],
      criticalPath: false
    };

    try {
      const { data: dependentTasks, error } = await supabase
        .from('tasks')
        .select('id, status, progress') // Select id as well
        .in('id', task.dependencies);

      if (error) throw error;
        
      if (!dependentTasks?.length) return {
        blockedBy: [],
        blocking: [],
        criticalPath: false
      };

      const blockedByIds = dependentTasks
         .filter(t => t.status !== 'completed')
         .map(t => t.id); // Map to IDs

      const allDependenciesMet = blockedByIds.length === 0;

      // Simplified critical path logic: true if all dependencies are met
      return {
        blockedBy: blockedByIds,
        blocking: [], // Need logic to find tasks that depend on this one
        criticalPath: allDependenciesMet 
      };
    } catch (error) {
      console.error('Failed to analyze dependencies:', error);
      return {
        blockedBy: [],
        blocking: [],
        criticalPath: false
      };
    }
    */
  }

  private estimateTaskDuration(task: Task): number {
    const complexity = this.estimateComplexity(task);
    const baseTime = 30; // Base time in minutes
    // Duration increases with complexity, capped potentially
    return Math.round(baseTime * (1 + complexity * 2)); // Example: complexity scales duration up to 3x base
  }

  /**
   * Suggest optimal task assignments based on team flow states
   */
  async suggestTaskAssignments(
    tasks: Task[],
    teamMembers: TeamMemberStatus[]
  ): Promise<TaskAssignmentMatch[]> {
    const assignments: TaskAssignmentMatch[] = [];

    for (const task of tasks) {
      if (!teamMembers || teamMembers.length === 0) continue; // Skip if no members

      const memberScores = await Promise.all(
        teamMembers.map(async (member) => {
          // Add null checks for member properties
          const flowAlignment = this.calculateFlowAlignment(task, member);
          const workloadScore = await this.assessWorkload(member.user_id);
          const expertiseScore = await this.assessExpertise(
            member.user_id,
            task
          );

          return {
            userId: member.user_id,
            score: (flowAlignment + workloadScore + expertiseScore) / 3,
            flowScore: member.flowState?.score ?? 0, // Add null check
            workloadScore,
            expertiseScore,
            reasons: this.generateAssignmentReasons(
              flowAlignment,
              workloadScore,
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
        // Add taskId to the match result before pushing
        assignments.push({ taskId: task.id, ...bestMatch });
      }
    }
    return assignments;
  }

  /**
   * Update task status based on flow session outcomes
   */
  async updateTaskFlowStatus(session: TaskFlowSession): Promise<void> {
    try {
      // 'flow_metrics' doesn't exist on the Task type based on the schema.
      // Need to decide how/where to store this data, e.g., in completion_metrics (jsonb).
      console.warn(
        "updateTaskFlowStatus: Attempting to update non-existent 'flow_metrics'. Adjusting to use 'completion_metrics'."
      );

      const updates: Partial<Task>[] = session.tasks.map((taskId) => {
        const existingMetrics = {}; // Fetch existing metrics if needed, for now start fresh
        const flowMetricsData = {
          focus_duration: this.calculateFocusDuration(session),
          interruptions: session.interruptions,
          completion_time: session.end_time
            ? (new Date(session.end_time).getTime() -
                new Date(session.start_time).getTime()) /
              1000
            : null,
          flow_score: session.flow_score,
          productivity_score: this.calculateProductivityScore(session),
        };
        return {
          id: taskId,
          completion_metrics: { ...existingMetrics, ...flowMetricsData }, // Store in completion_metrics
        };
      });

      const { error } = await supabase.from("tasks").upsert(updates); // Upsert based on ID

      if (error) throw error;
    } catch (error) {
      console.error("Failed to update task flow status:", error);
    }
  }

  private async assessWorkload(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true }) // More efficient count
        .eq("user_id", userId) // Corrected column name? Assuming user_id
        .in("status", ["active"]); // Use 'active' based on TaskStatus

      if (error) throw error;

      const activeTaskCount = count ?? 0;
      // Score decreases as task count increases, maxing out reduction at 10 tasks
      const workloadScore = 1 - Math.min(activeTaskCount / 10, 1);
      return workloadScore;
    } catch (error) {
      console.error("Failed to assess workload:", error);
      return 0.5; // Default neutral score on error
    }
  }

  private async assessExpertise(userId: string, task: Task): Promise<number> {
    try {
      // Search for similar completed tasks by the user based on title keywords
      const keywords = task.title.split(" ").slice(0, 3); // Use first few words
      let query = supabase
        .from("tasks")
        .select("completion_metrics") // Only select needed data
        .eq("user_id", userId) // Corrected column name? Assuming user_id
        .eq("status", "completed");

      // Add fuzzy title matching if possible, else basic like
      // Supabase might not directly support advanced fuzzy matching like pg_trgm easily here
      keywords.forEach((keyword: string) => {
        // Ensure keyword is not empty before adding LIKE clause
        if (keyword) {
          query = query.like("title", `%${keyword}%`);
        }
      });

      const { data: completedSimilar, error } = await query.limit(20); // Limit results

      if (error) throw error;
      if (!completedSimilar?.length) return 0.5; // Neutral score if no similar tasks found

      // Assess quality/efficiency of past similar tasks based on completion_metrics
      const successfulTasks = completedSimilar.filter((t) => {
        const metrics = t.completion_metrics as any; // Cast completion_metrics for now
        // Define "successful": e.g., few interruptions
        return metrics && (metrics.interruptions ?? 10) < 5; // Example criteria
      });

      return successfulTasks.length / completedSimilar.length;
    } catch (error) {
      console.error("Failed to assess expertise:", error);
      return 0.5; // Default neutral score on error
    }
  }

  private calculateFocusDuration(session: TaskFlowSession): number {
    if (!session.end_time) return 0;

    const totalDurationMs =
      new Date(session.end_time).getTime() -
      new Date(session.start_time).getTime();
    const totalDurationMin = totalDurationMs / (1000 * 60);

    // Assume average interruption takes 5 mins - adjust as needed
    const interruptionTime = (session.interruptions || 0) * 5;
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
    workloadScore: number,
    expertiseScore: number
  ): string[] {
    const reasons: string[] = [];

    if (flowAlignment > 0.7) reasons.push("High flow state compatibility");
    if (workloadScore > 0.7) reasons.push("Optimal current workload");
    if (expertiseScore > 0.7)
      reasons.push("Strong track record with similar tasks");
    if (reasons.length === 0) reasons.push("Balanced assignment"); // Default reason

    return reasons;
  }
} // End of TaskFlowManager class
