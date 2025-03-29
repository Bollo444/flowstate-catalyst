export class ProjectMetricsEngine {
  private readonly metricsStore = new Map<string, ProjectMetrics>();
  private readonly engine: MetricsEngine;

  analyzeMetrics(project: Project, timeframe: TimeFrame): MetricsReport {
    const analysis = this.calculateProjectMetrics(project, timeframe);
    return this.generateMetricsReport(analysis);
  }
}
