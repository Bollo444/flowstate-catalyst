export class ProjectProgressTracker {
  private readonly progressMetrics = new Map<string, ProgressMetrics>();
  private readonly trackingEngine: TrackingEngine;

  trackProgress(project: Project, milestones: Milestone[]): ProgressReport {
    const progress = this.calculateProjectProgress(project, milestones);
    const forecast = this.generateProgressForecast(progress);

    return this.createProgressReport(forecast);
  }
}
