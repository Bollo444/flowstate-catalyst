export class ProjectMetricsAnalyzer {
  private readonly metricsStore = new Map<string, ProjectMetrics>();
  private readonly analysisEngine: AnalysisEngine;

  analyzeMetrics(
    projectData: ProjectData,
    timeRange: TimeRange
  ): MetricsAnalysis {
    const metrics = this.calculateProjectMetrics(projectData, timeRange);
    const insights = this.generateMetricsInsights(metrics);

    return this.createMetricsReport(insights);
  }
}
