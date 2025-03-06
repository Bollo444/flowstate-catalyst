import { supabase } from '../../lib/supabaseClient';
import { Task, TeamMemberStatus } from '../../types/database';
import {
  TaskFlowMetrics,
  TaskUpdate,
  TaskFlowSession,
  TaskPriorityScore,
  TaskAssignmentMatch,
  OptimalTaskWindow
} from '../../types/taskFlow';

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

export class TaskFlowManager {
  private taskPriorityCache: Map<string, TaskPriorityScore> = new Map();

  constructor(private userId: string) {}

  /**
   * Calculate task priority based on multiple factors
   */
  async calculateTaskPriority(task: Task, userFlowState: TeamMemberStatus): Promise<TaskPriorityScore> {
    const cacheKey = `${task.id}-${this.userId}`; // Unique key for cache
    if (this.taskPriorityCache.has(cacheKey)) {
      return this.taskPriorityCache.get(cacheKey)!; // Return cached value if available
    }

    const factors: TaskPriorityFactors = {
      urgency: this.calculateUrgency(task),
      importance: task.priority === 'high' ? 1 : task.priority === 'medium' ? 0.6 : 0.3,
      flowAlignment: this.calculateFlowAlignment(task, userFlowState),
      complexity: this.estimateComplexity(task)
    };
    
    const priorityScore = { score: 0, factors }; // Calculate priority score
    this.taskPriorityCache.set(cacheKey, priorityScore); // Store in cache
    return priorityScore;
  }

  /**
   * Plan an optimal work session based on current flow state
   */
  async planWorkSession(
    duration: number,
    userFlowState: TeamMemberStatus
  ): Promise<Task[]> {
    try {
      // Get available tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', this.userId)
        .eq('status', 'pending');

      if (!tasks) return [];

      // Calculate priorities for all tasks
      const taskPriorities = await Promise.all(
        tasks.map(async task => ({
          task,
          priority: await this.calculateTaskPriority(task, userFlowState)
        }))
      );

      // Sort by priority and optimize for flow
      const sortedTasks = taskPriorities
        .sort((a, b) => b.priority.score - a.priority.score)
        .map(tp => tp.task);

      // Estimate total work time
      let plannedDuration = 0;
      const sessionTasks = [];

      for (const task of sortedTasks) {
        const estimatedTime = this.estimateTaskDuration(task);
        if (plannedDuration + estimatedTime <= duration) {
          sessionTasks.push(task);
          plannedDuration += estimatedTime;
        }
      }

      return sessionTasks;
    } catch (error) {
      console.error('Failed to plan work session:', error);
      return [];
    }
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
      const memberScores = await Promise.all(
        teamMembers.map(async member => {
          const flowAlignment = this.calculateFlowAlignment(task, member);
          const workloadScore = await this.assessWorkload(member.user_id);
          const expertiseScore = await this.assessExpertise(member.user_id, task);

          return {
            userId: member.user_id,
            score: (flowAlignment + workloadScore + expertiseScore) / 3,
            flowScore: member.flowState.score,
            workloadScore,
            expertiseScore,
            reasons: this.generateAssignmentReasons(flowAlignment, workloadScore, expertiseScore)
          };
        })
      );

      // Find best match
      const bestMatch = memberScores.reduce((best, current) => 
        current.score > best.score ? current : best
      );

      assignments.push(bestMatch);
    }

    return assignments;
  }

  /**
   * Update task status based on flow session outcomes
   */
  async updateTaskFlowStatus(session: TaskFlowSession): Promise<void> {
    try {
      const updates: TaskUpdate[] = session.tasks.map(taskId => ({
        id: taskId,
        flow_metrics: {
          focus_duration: this.calculateFocusDuration(session),
          interruptions: session.interruptions,
          completion_time: session.end_time 
            ? (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000
            : null,
          flow_score: session.flow_score,
          productivity_score: this.calculateProductivityScore(session)
        }
      }));

      await supabase
        .from('tasks')
        .upsert(updates);
    } catch (error) {
      console.error('Failed to update task flow status:', error);
    }
  }

  private calculateUrgency(task: Task): number {
    if (!task.due_date) return 0.5;

    const now = new Date();
    const due = new Date(task.due_date);
    const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilDue < 0) return 1;
    if (daysUntilDue < 1) return 0.9;
    if (daysUntilDue < 3) return 0.7;
    if (daysUntilDue < 7) return 0.5;
    return 0.3;
  }

  private calculateFlowAlignment(task: Task, userState: TeamMemberStatus): number {
    const flowScore = userState.flowState.score / 100;
    const isOptimalTime = userState.focusPreferences?.preferredFocusHours.includes(
      new Date().getHours()
    ) ?? false;

    const complexity = this.estimateComplexity(task);
    const complexityAlignment = flowScore >= 0.7 
      ? complexity // High flow = good for complex tasks
      : 1 - complexity; // Low flow = better for simple tasks

    return (flowScore * 0.4 + (isOptimalTime ? 0.3 : 0) + complexityAlignment * 0.3);
  }

  private estimateComplexity(task: Task): number {
    const descriptionLength = (task.description?.length || 0) / 1000;
    const dependencyCount = (task.dependencies?.length || 0) / 5;
    const progressComplexity = 1 - (task.progress || 0) / 100;

    return Math.min(
      (descriptionLength * 0.3 + dependencyCount * 0.4 + progressComplexity * 0.3),
      1
    );
  }

  private async analyzeDependencies(task: Task): Promise<DependencyAnalysis> {
    if (!task.dependencies?.length) return {
      blockedBy: [],
      blocking: [],
      criticalPath: false
    };

    try {
      const { data: dependentTasks } = await supabase
        .from('tasks')
        .select('status, progress')
        .in('id', task.dependencies);

      if (!dependentTasks?.length) return {
        blockedBy: [],
        blocking: [],
        criticalPath: false
      };

      const completedDependencies = dependentTasks.filter(
        t => t.status === 'completed'
      ).length;

      const averageProgress = dependentTasks.reduce(
        (sum, t) => sum + (t.progress || 0),
        0
      ) / dependentTasks.length;

      return {
        blockedBy: dependentTasks.filter(t => t.status !== 'completed').map(t => t.id),
        blocking: [],
        criticalPath: completedDependencies === dependentTasks.length
      };
    } catch (error) {
      console.error('Failed to analyze dependencies:', error);
      return {
        blockedBy: [],
        blocking: [],
        criticalPath: false
      };
    }
  }

  private estimateTaskDuration(task: Task): number {
    const complexity = this.estimateComplexity(task);
    const baseTime = 30; // 30 minutes base
    return Math.round(baseTime * (1 + complexity));
  }

  private async assessWorkload(userId: string): Promise<number> {
    try {
      const { data: activeTasks } = await supabase
        .from('tasks')
        .select('priority')
        .eq('assignee_id', userId)
        .in('status', ['pending', 'in_progress']);

      if (!activeTasks) return 0.5;

      const workloadScore = 1 - Math.min(activeTasks.length / 10, 1);
      return workloadScore;
    } catch (error) {
      console.error('Failed to assess workload:', error);
      return 0.5;
    }
  }

  private async assessExpertise(userId: string, task: Task): Promise<number> {
    try {
      const { data: completedSimilar } = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', userId)
        .eq('status', 'completed')
        .like('title', `%${task.title.split(' ').slice(0, 3).join('%')}%`);

      if (!completedSimilar?.length) return 0.5;

      const successfulTasks = completedSimilar.filter(t => 
        (t.flow_metrics?.completion_time || 0) > 0 &&
        (t.flow_metrics?.interruptions || 0) < 5
      );

      return successfulTasks.length / completedSimilar.length;
    } catch (error) {
      console.error('Failed to assess expertise:', error);
      return 0.5;
    }
  }

  private calculateFocusDuration(session: TaskFlowSession): number {
    if (!session.end_time) return 0;
    
    const totalDuration = (
      new Date(session.end_time).getTime() - 
      new Date(session.start_time).getTime()
    ) / (1000 * 60);

    const interruptionTime = session.interruptions * 5;
    return Math.max(0, totalDuration - interruptionTime);
  }

  private calculateProductivityScore(session: TaskFlowSession): number {
    const completionRatio = session.completed_tasks.length / session.tasks.length;
    const focusRatio = this.calculateFocusDuration(session) / 
      (session.end_time ? 
        (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60) 
        : 1);
    
    return Math.round((completionRatio * 0.6 + focusRatio * 0.4) * 100);
  }

  private generateAssignmentReasons(
    flowAlignment: number,
    workloadScore: number,
    expertiseScore: number
  ): string[] {
    const reasons: string[] = [];

    if (flowAlignment > 0.7) reasons.push('High flow state compatibility');
    if (workloadScore > 0.7) reasons.push('Optimal current workload');
    if (expertiseScore > 0.7) reasons.push('Strong track record with similar tasks');

    return reasons;
  }
}
