export class ProjectIntegrationEngine {
  private readonly integrationMetrics = new Map<string, IntegrationMetrics>();
  private readonly engine: IntegrationEngine;

  manageIntegration(
    components: ProjectComponent[],
    context: IntegrationContext
  ): IntegrationPlan {
    const strategy = this.planIntegration(components, context);
    return this.generateIntegrationPlan(strategy);
  }
}
