export class TeamLoadEngine {
  private readonly loadMetrics = new Map<string, LoadMetrics>();
  private readonly engine: LoadEngine;

  balanceLoad(team: Team, workload: Workload): LoadBalancePlan {
    const balance = this.calculateOptimalLoad(team, workload);
    return this.generateLoadPlan(balance);
  }
}
