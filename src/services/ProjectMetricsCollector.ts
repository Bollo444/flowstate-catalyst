export class ProjectMetricsCollector {
  private readonly metricsStore = new Map<string, ProjectMetrics>();
  private readonly collectionEngine: CollectionEngine;

  collectMetrics(project: Project, timeframe: TimeFrame): MetricsCollection {
    const metrics = this.gatherProjectMetrics(project, timeframe);
    const analysis = this.analyzeMetrics(metrics);

    return this.generateMetricsReport(analysis);
  }
}
