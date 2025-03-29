export class ProjectInsightEngine {
  private readonly insightMetrics = new Map<string, InsightMetrics>();
  private readonly engine: InsightEngine;

  generateInsights(
    projectData: ProjectData,
    context: AnalysisContext
  ): InsightReport {
    const analysis = this.analyzeProjectPatterns(projectData, context);
    return this.generateInsightReport(analysis);
  }
}
