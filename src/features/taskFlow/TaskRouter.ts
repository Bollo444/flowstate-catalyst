import { Task, TeamMemberStatus } from '../../types/database';
import { TaskPriorityScore } from '../../types/taskFlow';

export interface TaskRoutingResult {
  suggestedTasks: Task[];
  routingFactors: {
    flowAlignment: number;
    timingOptimality: number;
    workloadBalance: number;
    contextContinuity: number;
  };
  recommendations: string[];
}

export class TaskRouter {
  private readonly FLOW_THRESHOLD = 70; // Minimum flow score for complex tasks
  private readonly CONTEXT_SWITCH_PENALTY = 0.2;
  private readonly OPTIMAL_SESSION_LENGTH = 90; // minutes

  constructor(private userFlowState: TeamMemberStatus) {}

  /**
   * Route tasks based on current flow state and work context
   */
  public routeTasks(
    tasks: Task[],
    currentTaskId?: string,
    sessionDuration: number = this.OPTIMAL_SESSION_LENGTH
  ): TaskRoutingResult {
    const flowScore = this.userFlowState.flowState.score;
    const currentTask = currentTaskId 
      ? tasks.find(t => t.id === currentTaskId)
      : undefined;

    // Calculate initial routing scores
    const taskScores = tasks.map(task => ({
      task,
      score: this.calculateRoutingScore(task, flowScore, currentTask)
    }));

    // Optimize task sequence
    const optimizedSequence = this.optimizeTaskSequence(
      taskScores,
      sessionDuration,
      flowScore
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      optimizedSequence,
      flowScore,
      sessionDuration
    );

    // Calculate routing factors
    const routingFactors = this.calculateRoutingFactors(
      optimizedSequence,
      flowScore,
      currentTask
    );

    return {
      suggestedTasks: optimizedSequence.map(ts => ts.task),
      routingFactors,
      recommendations
    };
  }

  private calculateRoutingScore(
    task: Task,
    flowScore: number,
    currentTask?: Task
  ): number {
    let score = 0;

    // Flow state alignment
    const complexity = task.complexity_score || 0.5;
    const flowAlignment = flowScore >= this.FLOW_THRESHOLD
      ? complexity // High flow = prefer complex tasks
      : 1 - complexity; // Low flow = prefer simple tasks
    score += flowAlignment * 0.3;

    // Priority factor
    const priority = task.priority === 'high' ? 1 : task.priority === 'medium' ? 0.6 : 0.3;
    score += priority * 0.25;

    // Progress continuity
    if (task.progress > 0 && task.progress < 100) {
      score += 0.15; // Bonus for in-progress tasks
    }

    // Context switching cost
    if (currentTask && currentTask.id !== task.id) {
      const contextSwitch = this.calculateContextSwitchCost(currentTask, task);
      score -= contextSwitch * this.CONTEXT_SWITCH_PENALTY;
    }

    // Time sensitivity
    if (task.due_date) {
      const daysUntilDue = this.calculateDaysUntilDue(task.due_date);
      score += this.calculateUrgencyScore(daysUntilDue) * 0.2;
    }

    return score;
  }

  private optimizeTaskSequence(
    taskScores: Array<{ task: Task; score: number }>,
    sessionDuration: number,
    flowScore: number
  ): Array<{ task: Task; score: number }> {
    let remainingTime = sessionDuration;
    const sequence: Array<{ task: Task; score: number }> = [];
    const remainingTasks = [...taskScores];

    while (remainingTime > 0 && remainingTasks.length > 0) {
      // Find best task for current time slot
      const bestTaskIndex = this.findBestTaskForTimeSlot(
        remainingTasks,
        remainingTime,
        flowScore,
        sequence[sequence.length - 1]?.task
      );

      if (bestTaskIndex === -1) break;

      const selectedTask = remainingTasks.splice(bestTaskIndex, 1)[0];
      sequence.push(selectedTask);
      
      const estimatedDuration = selectedTask.task.estimated_duration || 30;
      remainingTime -= estimatedDuration;
    }

    return sequence;
  }

  private findBestTaskForTimeSlot(
    tasks: Array<{ task: Task; score: number }>,
    availableTime: number,
    flowScore: number,
    previousTask?: Task
  ): number {
    let bestScore = -1;
    let bestIndex = -1;

    tasks.forEach((taskScore, index) => {
      const estimatedDuration = taskScore.task.estimated_duration || 30;
      
      if (estimatedDuration <= availableTime) {
        let adjustedScore = taskScore.score;

        // Adjust score based on time fit
        const timeOptimality = 1 - Math.abs(estimatedDuration - availableTime) / availableTime;
        adjustedScore *= (0.7 + timeOptimality * 0.3);

        // Consider flow state continuity
        if (previousTask) {
          const contextSwitchCost = this.calculateContextSwitchCost(previousTask, taskScore.task);
          adjustedScore *= (1 - contextSwitchCost * this.CONTEXT_SWITCH_PENALTY);
        }

        if (adjustedScore > bestScore) {
          bestScore = adjustedScore;
          bestIndex = index;
        }
      }
    });

    return bestIndex;
  }

  private calculateContextSwitchCost(task1: Task, task2: Task): number {
    let cost = 0;

    // Project continuity
    if (task1.project_id !== task2.project_id) {
      cost += 0.3;
    }

    // Task type similarity (based on tags)
    const tags1 = new Set(task1.tags || []);
    const tags2 = new Set(task2.tags || []);
    const commonTagCount = (task1.tags || []).filter(tag => tags2.has(tag)).length;
    const tagSimilarity = commonTagCount / Math.max(tags1.size, tags2.size, 1);
    cost += (1 - tagSimilarity) * 0.2;

    // Complexity difference
    const complexityDiff = Math.abs(
      (task1.complexity_score || 0.5) - (task2.complexity_score || 0.5)
    );
    cost += complexityDiff * 0.2;

    return Math.min(cost, 1);
  }

  private calculateDaysUntilDue(dueDate: string): number {
    const now = new Date();
    const due = new Date(dueDate);
    return (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  }

  private calculateUrgencyScore(daysUntilDue: number): number {
    if (daysUntilDue <= 0) return 1;
    if (daysUntilDue <= 1) return 0.9;
    if (daysUntilDue <= 3) return 0.7;
    if (daysUntilDue <= 7) return 0.5;
    return 0.3;
  }

  private calculateRoutingFactors(
    sequence: Array<{ task: Task; score: number }>,
    flowScore: number,
    currentTask?: Task
  ) {
    // Flow alignment
    const flowAlignment = sequence.reduce((sum, ts) => {
      const complexity = ts.task.complexity_score || 0.5;
      return sum + (flowScore >= this.FLOW_THRESHOLD ? complexity : 1 - complexity);
    }, 0) / Math.max(sequence.length, 1);

    // Timing optimality
    const timingOptimality = this.userFlowState.focusPreferences?.preferredFocusHours.includes(
      new Date().getHours()
    ) ? 1 : 0.5;

    // Workload balance
    const workloadBalance = sequence.reduce((sum, ts) => {
      const complexity = ts.task.complexity_score || 0.5;
      return sum + (1 - Math.abs(complexity - 0.5) * 2);
    }, 0) / Math.max(sequence.length, 1);

    // Context continuity
    let contextSwitches = 0;
    if (currentTask) {
      contextSwitches += this.calculateContextSwitchCost(currentTask, sequence[0]?.task);
    }
    for (let i = 1; i < sequence.length; i++) {
      contextSwitches += this.calculateContextSwitchCost(
        sequence[i - 1].task,
        sequence[i].task
      );
    }
    const contextContinuity = Math.max(0, 1 - contextSwitches / sequence.length);

    return {
      flowAlignment,
      timingOptimality,
      workloadBalance,
      contextContinuity
    };
  }

  private generateRecommendations(
    sequence: Array<{ task: Task; score: number }>,
    flowScore: number,
    sessionDuration: number
  ): string[] {
    const recommendations: string[] = [];

    // Flow state recommendations
    if (flowScore < this.FLOW_THRESHOLD) {
      recommendations.push(
        'Current flow state is below optimal. Consider starting with simpler tasks to build momentum.'
      );
    } else {
      recommendations.push(
        'Strong flow state detected. Optimal time for tackling complex tasks.'
      );
    }

    // Session duration recommendations
    if (sessionDuration < 45) {
      recommendations.push(
        'Short session detected. Focus on quick wins and task completion.'
      );
    } else if (sessionDuration > this.OPTIMAL_SESSION_LENGTH) {
      recommendations.push(
        'Long session planned. Consider breaking work into focused blocks with short breaks.'
      );
    }

    // Task sequence recommendations
    if (sequence.length > 0) {
      const complexTasks = sequence.filter(ts => (ts.task.complexity_score || 0.5) > 0.7);
      if (complexTasks.length > 1) {
        recommendations.push(
          'Multiple complex tasks ahead. Plan shorter focused sessions for each.'
        );
      }

      const urgentTasks = sequence.filter(ts => 
        ts.task.due_date && this.calculateDaysUntilDue(ts.task.due_date) <= 1
      );
      if (urgentTasks.length > 0) {
        recommendations.push(
          `${urgentTasks.length} urgent task(s) due within 24 hours. Prioritize these.`
        );
      }
    }

    return recommendations;
  }
}