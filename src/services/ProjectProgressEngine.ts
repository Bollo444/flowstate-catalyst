export class ProjectProgressEngine {
  private readonly progressMetrics = new Map<string, ProgressMetrics>();
  private readonly engine: ProgressEngine;

  trackProgress(project: Project, milestones: Milestone[]): ProgressReport {
    const tracking = this.analyzeProgress(project, milestones);
    return this.generateProgressReport(tracking);
  }
}
