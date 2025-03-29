export class ProjectCostEngine {
  private readonly costMetrics = new Map<string, CostMetrics>();
  private readonly engine: CostEngine;

  manageCosts(project: Project, budget: Budget): CostManagementPlan {
    const analysis = this.analyzeCosts(project, budget);
    return this.generateCostPlan(analysis);
  }
}
