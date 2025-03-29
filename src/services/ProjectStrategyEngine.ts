export class ProjectStrategyEngine {
  private readonly strategyMetrics = new Map<string, StrategyMetrics>();
  private readonly engine: StrategyEngine;

  developStrategy(project: Project, goals: StrategicGoals): StrategyPlan {
    const strategy = this.formulateStrategy(project, goals);
    return this.generateStrategyPlan(strategy);
  }
}
