export class ProjectVelocityTracker {
  private readonly velocityMetrics = new Map<string, VelocityMetrics>();
  private readonly trackingEngine: TrackingEngine;

  trackVelocity(project: Project, sprintHistory: SprintData[]): VelocityReport {
    const velocity = this.calculateProjectVelocity(project, sprintHistory);
    const trends = this.analyzeVelocityTrends(velocity);

    return this.generateVelocityReport(trends);
  }
}
