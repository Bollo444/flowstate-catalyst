export class ProjectHealthEngine {
  private readonly healthMetrics = new Map<string, HealthMetrics>();
  private readonly engine: HealthEngine;

  assessHealth(project: Project, indicators: HealthIndicator[]): HealthReport {
    const assessment = this.analyzeProjectHealth(project, indicators);
    return this.generateHealthReport(assessment);
  }
}
