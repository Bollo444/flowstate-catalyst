export class WorkloadBalancingEngine {
  private readonly workloadMetrics = new Map<string, WorkloadMetrics>();
  private readonly engine: BalancingEngine;

  balanceWorkload(team: Team, tasks: Task[]): WorkloadPlan {
    const balance = this.calculateOptimalDistribution(team, tasks);
    return this.generateWorkloadPlan(balance);
  }
}
