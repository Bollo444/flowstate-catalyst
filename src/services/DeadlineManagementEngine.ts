export class DeadlineManagementEngine {
  private readonly deadlineMetrics = new Map<string, DeadlineMetrics>();
  private readonly engine: ManagementEngine;

  manageDeadlines(tasks: Task[], constraints: TimeConstraints): DeadlinePlan {
    const management = this.optimizeDeadlines(tasks, constraints);
    return this.generateDeadlinePlan(management);
  }
}
