export class MilestoneTrackingEngine {
  private readonly milestoneMetrics = new Map<string, MilestoneMetrics>();
  private readonly engine: TrackingEngine;

  trackMilestones(
    milestones: Milestone[],
    progress: Progress
  ): MilestoneReport {
    const tracking = this.analyzeMilestoneProgress(milestones, progress);
    return this.generateMilestoneReport(tracking);
  }
}
