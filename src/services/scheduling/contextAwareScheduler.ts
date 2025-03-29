import { Task } from "@/types/taskFlow";
import { FlowState } from "@/types/flow";
import { TaskFlowService } from "@/services/taskFlow";
import { MetricsAggregator } from "@/services/metrics";

export interface ScheduledTask {
  task: Task;
  priorityScore: number;
  optimalTimeSlot: {
    start: Date;
    end: Date;
  };
}

export class ContextAwareScheduler {
  private energyLevel = 100;

  constructor(
    private readonly taskService: TaskFlowService,
    private readonly metricsService: MetricsAggregator
  ) {}

  calculateSchedule(tasks: Task[], flowState: FlowState): ScheduledTask[] {
    return tasks
      .map((task) => ({
        task,
        priorityScore: this.calculatePriority(task, flowState),
        optimalTimeSlot: this.calculateTimeSlot(task),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  private calculatePriority(task: Task, flowState: FlowState): number {
    // Base priority combines task priority and flow state
    let priority = task.priority * (flowState.score / 100);

    // Energy level modifier (0.8-1.2 range)
    const energyModifier = 0.8 + (this.energyLevel / 100) * 0.4;
    priority *= energyModifier;

    // Deadline urgency boost
    if (task.dueDate) {
      const hoursRemaining =
        (new Date(task.dueDate).getTime() - Date.now()) / 3600000;
      const urgencyBoost = Math.min(1.5, 1 + 24 / Math.max(1, hoursRemaining));
      priority *= urgencyBoost;
    }

    return Math.round(priority * 100) / 100; // Round to 2 decimal places
  }

  private calculateTimeSlot(task: Task): { start: Date; end: Date } {
    const now = new Date();
    return {
      start: now,
      end: new Date(now.getTime() + task.estimated_duration * 60000),
    };
  }
}
